/**
 * POST /api/nexus-collect
 * Multi-site offer journey collector — humans only (not owner, not bots).
 * Writes live presence + recent + alerts + period snapshot (geo, refs, dwell).
 */
import { cors, getVisitorKv, jsonError } from "../_shared/kv.js";
import {
  applyNexusFunnel,
  applyNexusLeave,
  applyNexusPageview,
  loadNexusSnapshot,
  saveNexusSnapshot,
} from "../_shared/nexus-snapshot.js";

const LIVE_KEY = "nexus:live";
const RECENT_KEY = "nexus:recent";
const ALERTS_KEY = "nexus:alerts";
const OWNER_VIDS_KEY = "nexus:owner_vids";
const FUNNEL_DEDUP_KEY = "nexus:funnel_dedup"; // session|site|stage -> 1 (TTL day)

const LIVE_TTL_MS = 3 * 60 * 1000;
const MAX_RECENT = 100;
const MAX_ALERTS = 50;
const MAX_JOURNEY = 30;

/** Sites we treat as selling / pitch surfaces for louder alerts */
const SELLING_SITES = new Set([
  "batiya-realty",
  "batiya",
  "sulieman-hvac",
  "hvac",
  "fcr-funding",
  "fcr",
  "faber-capital-resources",
  "4am-slice",
  "4am",
]);

/** Probe / smoke / diag traffic — never counts as a real visitor (e.g. Favour) */
function isNoiseIdentity(visitorId, sessionId, path, title) {
  const blob = [visitorId, sessionId, path, title].map((x) => String(x || "")).join(" ");
  return /smoke|probe|diag|test[_-]|live.pipeline.check|pitch-smoke|owner_vids?/i.test(blob);
}

function nowMs() {
  return Date.now();
}

function dayStr(ts) {
  return new Date(ts || Date.now()).toISOString().slice(0, 10);
}

async function readJson(kv, key, fallback) {
  const raw = await kv.get(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function isBot(ua, device) {
  if (device === "Bot") return true;
  const u = (ua || "").toLowerCase();
  return /bot|crawl|spider|slurp|headless|preview|facebookexternalhit|whatsapp|telegram|bytespider|semrush|ahrefs|pingdom|uptimerobot|statuscake|python-requests|curl\/|wget/i.test(
    u
  );
}

function cleanSite(s) {
  return String(s || "unknown")
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, "-")
    .slice(0, 64);
}

function extractDomain(url) {
  if (!url) return "";
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

function parseBrowser(ua) {
  if (!ua) return "Unknown";
  if (ua.includes("Firefox/")) return "Firefox";
  if (ua.includes("Edg/")) return "Edge";
  if (ua.includes("OPR/") || ua.includes("Opera")) return "Opera";
  if (ua.includes("Chrome/") && !ua.includes("Edg/")) return "Chrome";
  if (ua.includes("Safari/") && !ua.includes("Chrome/")) return "Safari";
  return "Other";
}

function parseOS(ua) {
  if (!ua) return "Unknown";
  if (ua.includes("Windows")) return "Windows";
  if (ua.includes("Mac OS X") || ua.includes("Macintosh")) return "macOS";
  if (ua.includes("Android")) return "Android";
  if (ua.includes("iPhone") || ua.includes("iPad")) return "iOS";
  if (ua.includes("Linux")) return "Linux";
  return "Other";
}

function parseDevice(ua) {
  if (!ua) return "Unknown";
  if (/bot|crawl|spider/i.test(ua)) return "Bot";
  if (/Mobile|Android|iPhone/i.test(ua)) return "Mobile";
  if (/iPad|Tablet/i.test(ua)) return "Tablet";
  return "Desktop";
}

export async function onRequestPost(context) {
  const { request, env } = context;
  try {
    const kv = getVisitorKv(env);
    let body = {};
    try {
      body = await request.json();
    } catch {
      body = {};
    }

    const type = String(body.type || "page_view");
    const ua = request.headers.get("user-agent") || "";
    const site = cleanSite(body.site);
    const visitorId = String(body.visitor_id || body.vid || "").slice(0, 80);
    const sessionId = String(body.session_id || body.sid || "").slice(0, 80);
    const path = String(body.path || body.page || "/").slice(0, 300);
    const title = String(body.title || "").slice(0, 200);
    const ts = typeof body.ts === "number" ? body.ts : nowMs();
    const durationMs = Math.max(0, Number(body.duration_ms) || 0);
    const journey = Array.isArray(body.journey)
      ? body.journey.map(String).slice(-MAX_JOURNEY)
      : [];

    if (type === "purge_board") {
      await kv.put(LIVE_KEY, JSON.stringify({}));
      await kv.put(RECENT_KEY, JSON.stringify([]));
      await kv.put(ALERTS_KEY, JSON.stringify([]));
      // keep snapshot history unless explicit wipe_stats
      if (body.wipe_stats) {
        const { emptySnapshot, NEXUS_SNAPSHOT_KEY } = await import(
          "../_shared/nexus-snapshot.js"
        );
        await kv.put(NEXUS_SNAPSHOT_KEY, JSON.stringify(emptySnapshot()));
      }
      return new Response(JSON.stringify({ ok: true, purged: true }), {
        headers: cors("GET, POST, OPTIONS"),
      });
    }

    /**
     * Remove owner/probe/smoke noise from live + recent + alerts + funnel rollups
     * so unique/live boards only show real people (e.g. Favour on FCR).
     */
    if (type === "purge_noise") {
      const ownerVids = await readJson(kv, OWNER_VIDS_KEY, []);
      const ownerSet = new Set(ownerVids.map(String));
      const isBad = (row) => {
        const vid = String(row.visitor_id || row.visitorId || "");
        const sid = String(row.session_id || "");
        if (ownerSet.has(vid)) return true;
        return isNoiseIdentity(vid, sid, row.path, row.title || row.message);
      };

      const live = await readJson(kv, LIVE_KEY, {});
      let liveRemoved = 0;
      for (const k of Object.keys(live)) {
        if (isBad(live[k]) || isNoiseIdentity(k, live[k].session_id, live[k].path, live[k].title)) {
          delete live[k];
          liveRemoved++;
        }
      }
      await kv.put(LIVE_KEY, JSON.stringify(live));

      const recent = await readJson(kv, RECENT_KEY, []);
      const recentClean = recent.filter((r) => !isBad(r));
      await kv.put(RECENT_KEY, JSON.stringify(recentClean));

      const alerts = await readJson(kv, ALERTS_KEY, []);
      const alertsClean = alerts.filter((a) => !isBad(a));
      await kv.put(ALERTS_KEY, JSON.stringify(alertsClean));

      // Snapshot: strip noise journeys/converts; rebuild site pageview counts lightly
      const { loadNexusSnapshot, saveNexusSnapshot, emptyDay } = await import(
        "../_shared/nexus-snapshot.js"
      );
      const snap = await loadNexusSnapshot(kv);
      let funnelStripped = 0;
      for (const dateStr of Object.keys(snap.daily || {})) {
        const day = snap.daily[dateStr];
        if (!day) continue;
        if (Array.isArray(day.journeys)) {
          const before = day.journeys.length;
          day.journeys = day.journeys.filter(
            (j) =>
              !isNoiseIdentity(j.visitor_id, j.session_id, j.path || j.land, j.title)
          );
          funnelStripped += before - day.journeys.length;
        }
        if (Array.isArray(day.converts)) {
          day.converts = day.converts.filter(
            (c) =>
              !isNoiseIdentity(c.visitor_id, c.session_id, c.path, c.label) &&
              !/smoke|probe|diag/i.test(String(c.label || ""))
          );
        }
        // Known artificial funnel from smoke test on fcr-funding (1/1/1)
        // Reset funnel when all converts were noise / empty after clean
        if (day.funnel && Array.isArray(day.converts) && day.converts.length === 0) {
          const f = day.funnel;
          if ((f.convert || 0) > 0 || (f.aware || 0) > 0) {
            // subtract fcr-funding funnel pollution if present
            if (day.funnelBySite && day.funnelBySite["fcr-funding"]) {
              const fs = day.funnelBySite["fcr-funding"];
              f.aware = Math.max(0, (f.aware || 0) - (fs.aware || 0));
              f.engage = Math.max(0, (f.engage || 0) - (fs.engage || 0));
              f.convert = Math.max(0, (f.convert || 0) - (fs.convert || 0));
              if (snap.totals) {
                snap.totals.aware = Math.max(0, (snap.totals.aware || 0) - (fs.aware || 0));
                snap.totals.engage = Math.max(0, (snap.totals.engage || 0) - (fs.engage || 0));
                snap.totals.convert = Math.max(0, (snap.totals.convert || 0) - (fs.convert || 0));
              }
              delete day.funnelBySite["fcr-funding"];
            }
          }
        }
        // Drop fcr pageview pollution from probe paths
        if (day.pages) {
          for (const p of Object.keys(day.pages)) {
            if (isNoiseIdentity("", "", p, "")) delete day.pages[p];
          }
        }
        if (day.sites && day.sites["fcr-funding"] && (!day.funnelBySite || !day.funnelBySite["fcr-funding"])) {
          // if funnel wiped and only smoke existed, zero fcr site hits for that day when pageviews were probe
          const onlyNoise =
            !day.journeys?.length &&
            (!day.converts || day.converts.length === 0);
          if (onlyNoise && (day.sites["fcr-funding"] || 0) <= 3) {
            const n = day.sites["fcr-funding"] || 0;
            day.pageviews = Math.max(0, (day.pageviews || 0) - n);
            day.sessions = Math.max(0, (day.sessions || 0) - Math.min(n, 2));
            day.uniques = Math.max(0, (day.uniques || 0) - Math.min(n, 2));
            if (snap.totals) {
              snap.totals.pageviews = Math.max(0, (snap.totals.pageviews || 0) - n);
              snap.totals.sessions = Math.max(0, (snap.totals.sessions || 0) - Math.min(n, 2));
              snap.totals.uniques = Math.max(0, (snap.totals.uniques || 0) - Math.min(n, 2));
            }
            delete day.sites["fcr-funding"];
          }
        }
      }
      await saveNexusSnapshot(kv, snap);
      await kv.put(FUNNEL_DEDUP_KEY, JSON.stringify({}));

      return new Response(
        JSON.stringify({
          ok: true,
          purged_noise: true,
          live_removed: liveRemoved,
          recent_kept: recentClean.length,
          alerts_kept: alertsClean.length,
          journeys_stripped: funnelStripped,
        }),
        { headers: cors("GET, POST, OPTIONS") }
      );
    }

    if (type === "mark_owner" && visitorId) {
      const vids = await readJson(kv, OWNER_VIDS_KEY, []);
      if (!vids.includes(visitorId)) {
        vids.push(visitorId);
        if (vids.length > 200) vids.splice(0, vids.length - 200);
        await kv.put(OWNER_VIDS_KEY, JSON.stringify(vids));
      }
      return new Response(JSON.stringify({ ok: true, marked: true }), {
        headers: cors("GET, POST, OPTIONS"),
      });
    }

    const ownerVids = await readJson(kv, OWNER_VIDS_KEY, []);
    const testNoise =
      isNoiseIdentity(visitorId, sessionId, path, title) ||
      /^test[_-]/i.test(visitorId) ||
      /^test[_-]/i.test(sessionId) ||
      /^test$/i.test(title) ||
      title === "Test";
    const selfFlag =
      body.self === true ||
      body.owner === true ||
      testNoise ||
      (visitorId && ownerVids.includes(visitorId));
    const device = body.device || parseDevice(ua);
    const bot = isBot(ua, device);

    // SELF / OWNER / BOT / PROBE — never in live, uniques, funnel, or alerts
    if (selfFlag || bot) {
      return new Response(
        JSON.stringify({
          ok: true,
          ignored: true,
          self: selfFlag,
          bot,
          reason: bot ? "bot" : testNoise ? "noise" : "owner",
        }),
        { headers: cors("GET, POST, OPTIONS") }
      );
    }

    const cf = request.cf || {};
    const ref =
      String(body.ref || body.referrer || request.headers.get("referer") || "").slice(
        0,
        400
      );
    const utm = body.utm || {};
    const ev = {
      type,
      site,
      path,
      title,
      visitor_id: visitorId,
      session_id: sessionId,
      ts,
      duration_ms: durationMs,
      journey,
      land: body.land || journey[0] || path,
      ref,
      refDomain: extractDomain(ref),
      country: cf.country || request.headers.get("cf-ipcountry") || "",
      city: cf.city || "",
      region: cf.region || cf.regionCode || "",
      browser: parseBrowser(ua),
      os: parseOS(ua),
      device,
      utm_source: utm.utm_source || body.utm_source || "",
      utm_medium: utm.utm_medium || body.utm_medium || "",
      utm_campaign: utm.utm_campaign || body.utm_campaign || "",
    };

    // —— Live presence ——
    const live = await readJson(kv, LIVE_KEY, {});
    const cutoff = nowMs() - LIVE_TTL_MS;
    for (const k of Object.keys(live)) {
      if ((live[k].last_ts || 0) < cutoff) delete live[k];
    }
    const liveKey = sessionId || visitorId || `anon-${ts}`;
    if (sessionId) {
      live[liveKey] = {
        site: ev.site,
        path: ev.path,
        title: ev.title,
        visitor_id: visitorId,
        session_id: sessionId,
        journey: ev.journey,
        last_ts: ts,
        type,
        duration_ms: durationMs,
        land: ev.land,
        country: ev.country,
        city: ev.city,
        refDomain: ev.refDomain,
      };
    }
    await kv.put(LIVE_KEY, JSON.stringify(live));

    // —— Snapshot rollups (period analytics) ——
    const snap = await loadNexusSnapshot(kv);
    const d = dayStr(ts);
    if (type === "page_view" || type === "session_start") {
      applyNexusPageview(snap, ev, d);
    }
    if (type === "page_leave" || type === "session_end") {
      applyNexusLeave(snap, ev, d);
    }
    // heartbeat updates dwell without double-counting leaves heavily — treat as soft leave sample
    if (type === "page_heartbeat" && durationMs > 5000) {
      // only bump time maps lightly via leave path once — skip heartbeats to avoid inflation
    }

    // —— Conversion spine (aware / engage / convert) — once per session+site+stage ——
    const funnelDedup = await readJson(kv, FUNNEL_DEDUP_KEY, {});
    async function recordFunnel(stage, meta = {}) {
      const dedupKey = `${sessionId || visitorId}|${site}|${stage}`;
      if (!sessionId && !visitorId) return false;
      if (funnelDedup[dedupKey]) return false;
      funnelDedup[dedupKey] = 1;
      applyNexusFunnel(snap, stage, site, d, {
        ts,
        path,
        label: meta.label || stage,
        href: meta.href || "",
        action: meta.action || "",
      });
      return true;
    }

    // Map legacy + explicit events
    if (type === "session_start" || type === "aware") {
      await recordFunnel("aware", { label: "land" });
    }
    if (type === "page_view" && !funnelDedup[`${sessionId || visitorId}|${site}|aware`]) {
      await recordFunnel("aware", { label: "page_view" });
    }
    if (type === "engage" || type === "scroll" || type === "cta_view") {
      const scrollPct = Number(body.scroll_pct || body.scroll || 0);
      if (type === "engage" || type === "cta_view" || scrollPct >= 50) {
        await recordFunnel("engage", {
          label: type === "cta_view" ? "cta_view" : scrollPct ? `scroll_${scrollPct}` : "engage",
        });
      }
    }
    if (type === "page_heartbeat" && durationMs >= 15000) {
      await recordFunnel("engage", { label: "dwell_15s" });
    }
    if (type === "page_leave" && (durationMs >= 15000 || Number(body.scroll_pct || 0) >= 50)) {
      await recordFunnel("engage", {
        label: durationMs >= 15000 ? "leave_dwell" : "leave_scroll",
      });
    }
    if (
      type === "convert" ||
      type === "form_submit" ||
      type === "download" ||
      type === "call_click" ||
      type === "mailto_click" ||
      type === "deal_start"
    ) {
      await recordFunnel("convert", {
        label: body.label || body.action || type,
        href: body.href || body.link_href || "",
        action: type,
      });
    }
    // outbound tel/mailto clicks
    if (type === "click") {
      const href = String(body.link_href || body.href || "").toLowerCase();
      if (href.startsWith("tel:")) {
        await recordFunnel("convert", { label: "call_click", href });
      } else if (href.startsWith("mailto:")) {
        await recordFunnel("convert", { label: "mailto_click", href });
      } else if (
        body.convert === true ||
        body.conversion === true ||
        /download|\.zip|\.pdf|signup|book|start|contact/i.test(
          String(body.link_text || "") + " " + href
        )
      ) {
        // soft convert signals — only if marked or strong CTA text
        if (body.convert === true || body.conversion === true) {
          await recordFunnel("convert", {
            label: body.link_text || "click_convert",
            href,
          });
        } else {
          await recordFunnel("engage", { label: "cta_click" });
        }
      }
    }

    // prune funnel dedup map size
    const dedupKeys = Object.keys(funnelDedup);
    if (dedupKeys.length > 2000) {
      for (const k of dedupKeys.slice(0, dedupKeys.length - 1500)) delete funnelDedup[k];
    }
    await kv.put(FUNNEL_DEDUP_KEY, JSON.stringify(funnelDedup), {
      expirationTtl: 60 * 60 * 48,
    });

    await saveNexusSnapshot(kv, snap);

    // —— Recent journeys ——
    if (
      type === "page_view" ||
      type === "page_leave" ||
      type === "session_end" ||
      type === "session_start"
    ) {
      const recent = await readJson(kv, RECENT_KEY, []);
      const idx = recent.findIndex(
        (r) => r.session_id === sessionId && r.site === site
      );
      const row = {
        site,
        session_id: sessionId,
        visitor_id: visitorId,
        land: ev.land,
        path,
        title,
        journey,
        last_ts: ts,
        first_ts: idx >= 0 ? recent[idx].first_ts || ts : ts,
        duration_ms: durationMs,
        last_type: type,
        country: ev.country,
        city: ev.city,
        refDomain: ev.refDomain,
      };
      if (idx >= 0) {
        recent[idx] = {
          ...recent[idx],
          ...row,
          journey: journey.length ? journey : recent[idx].journey,
        };
      } else recent.unshift(row);
      while (recent.length > MAX_RECENT) recent.pop();
      await kv.put(RECENT_KEY, JSON.stringify(recent));
    }

    // —— Alerts (smart — not every pageview) ——
    let alerted = false;
    const alerts = await readJson(kv, ALERTS_KEY, []);
    const geoBit =
      ev.city || ev.country
        ? " · " + [ev.city, ev.country].filter(Boolean).join(", ")
        : "";
    const selling = SELLING_SITES.has(site);
    const pushAlert = (severity, message, kind) => {
      alerts.unshift({
        id: `a_${ts}_${Math.random().toString(36).slice(2, 7)}`,
        ts,
        severity, // critical | high | info
        kind, // convert | session | engage | system
        site,
        path,
        title,
        session_id: sessionId,
        visitor_id: visitorId,
        land: ev.land,
        journey,
        country: ev.country,
        city: ev.city,
        refDomain: ev.refDomain,
        message,
      });
      alerted = true;
    };

    if (
      type === "convert" ||
      type === "form_submit" ||
      type === "download" ||
      type === "call_click" ||
      type === "mailto_click" ||
      type === "deal_start"
    ) {
      pushAlert(
        "critical",
        `CONVERT · ${site}: ${body.label || body.action || type} @ ${path}${geoBit}`,
        "convert"
      );
    } else if (
      type === "click" &&
      /^(tel:|mailto:)/i.test(String(body.link_href || body.href || ""))
    ) {
      pushAlert(
        "critical",
        `CONVERT · ${site}: ${String(body.link_href || body.href).slice(0, 40)}${geoBit}`,
        "convert"
      );
    } else if (type === "session_start" || (type === "aware" && selling)) {
      pushAlert(
        selling ? "high" : "info",
        `${selling ? "SELLING" : "VISIT"} · ${site}: new session @ ${path}${geoBit}`,
        "session"
      );
    } else if (type === "engage" && selling) {
      pushAlert(
        "info",
        `ENGAGED · ${site}: ${body.label || "engaged"} @ ${path}${geoBit}`,
        "engage"
      );
    }

    if (alerted) {
      while (alerts.length > MAX_ALERTS) alerts.pop();
      await kv.put(ALERTS_KEY, JSON.stringify(alerts));
    }

    return new Response(
      JSON.stringify({
        ok: true,
        alerted,
        live: Object.keys(live).length,
      }),
      { headers: cors("GET, POST, OPTIONS") }
    );
  } catch (err) {
    return jsonError(err.message || "nexus-collect failed");
  }
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: cors("GET, POST, OPTIONS") });
}
