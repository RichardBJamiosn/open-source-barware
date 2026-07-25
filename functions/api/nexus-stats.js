/**
 * GET /api/nexus-stats?period=today|3d|7d|30d|yesterday
 * Full multi-site offer analytics (humans only).
 */
import { cors, getVisitorKv, jsonError } from "../_shared/kv.js";
import { kvDatesForPeriod, normalizePeriod, periodLabel } from "../_shared/periods.js";
import {
  buildNexusStats,
  loadNexusSnapshot,
} from "../_shared/nexus-snapshot.js";

const LIVE_KEY = "nexus:live";
const RECENT_KEY = "nexus:recent";
const ALERTS_KEY = "nexus:alerts";
const LIVE_TTL_MS = 3 * 60 * 1000;

async function readJson(kv, key, fallback) {
  const raw = await kv.get(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export async function onRequestGet(context) {
  const { request, env } = context;
  try {
    const url = new URL(request.url);
    const nexusKey = env.NEXUS_KEY;
    if (nexusKey) {
      const provided = url.searchParams.get("key") || "";
      if (provided !== nexusKey) {
        return new Response(JSON.stringify({ error: "unauthorized" }), {
          status: 401,
          headers: cors(),
        });
      }
    }

    const period = normalizePeriod(url.searchParams.get("period") || "today");
    const dates = kvDatesForPeriod(period);
    const kv = getVisitorKv(env);
    const snap = await loadNexusSnapshot(kv);
    const stats = buildNexusStats(snap, period, dates);

    const now = Date.now();
    const liveRaw = await readJson(kv, LIVE_KEY, {});
    const live = Object.values(liveRaw)
      .filter((row) => (row.last_ts || 0) >= now - LIVE_TTL_MS)
      .sort((a, b) => (b.last_ts || 0) - (a.last_ts || 0));
    const recent = await readJson(kv, RECENT_KEY, []);
    const alerts = await readJson(kv, ALERTS_KEY, []);

    // Optional OSB first-party slice
    let osb = null;
    try {
      const { loadSnapshot, buildStatsFromSnapshot } = await import(
        "../_shared/snapshot.js"
      );
      const osbSnap = await loadSnapshot(kv);
      const osbStats = buildStatsFromSnapshot(osbSnap, period === "30d" ? "30d" : period === "7d" ? "7d" : period === "3d" ? "3d" : "today");
      osb = {
        liveNow: osbStats.overview?.liveNow || 0,
        pageviews: osbStats.overview?.totalPageviews || osbStats.overview?.todayVisitTotal || 0,
        uniques: osbStats.overview?.uniqueVisitors || osbStats.overview?.todayUniqueVisitors || 0,
        downloads: osbStats.overview?.totalDownloadsAllTime || 0,
      };
    } catch {
      osb = null;
    }

    return new Response(
      JSON.stringify({
        generated: new Date().toISOString(),
        period: { id: period, label: periodLabel(period), dates },
        filter: "humans_only — owner and bots excluded",
        overview: stats.overview,
        funnel: stats.funnel || {
          aware: 0,
          engage: 0,
          convert: 0,
          rate: 0,
          bySite: [],
          recentConverts: [],
        },
        hours: stats.hours,
        dailyTrend: stats.dailyTrend,
        topPages: stats.topPages,
        pageTime: stats.pageTime,
        topSites: stats.topSites,
        topCountries: stats.topCountries,
        topCities: stats.topCities,
        topRegions: stats.topRegions,
        topRefDomains: stats.topRefDomains,
        topRefs: stats.topRefs,
        browsers: stats.browsers,
        os: stats.os,
        devices: stats.devices,
        utm: stats.utm,
        journeys: stats.journeys,
        live_count: live.length,
        live,
        recent: recent.slice(0, 60),
        alerts: alerts.slice(0, 30),
        osb,
        sites: [
          {
            id: "batiya-realty",
            name: "Batiya Realty (Ron)",
            url: "https://batiya-realty.vercel.app/pitch.html",
          },
          {
            id: "sulieman-hvac",
            name: "Sulieman HVAC",
            url: "https://sulieman-go.vercel.app/pitch.html",
          },
          {
            id: "fcr-funding",
            name: "FCR / Faber funding",
            url: "https://richardbjamison.github.io/faber-capital-resources/",
          },
          {
            id: "osb",
            name: "Open Source Barware",
            url: "https://opensourcebarware.com/",
          },
        ],
        ga4: {
          osb: "G-DQJKBWMM8H",
          batiya: "G-L3RRS8DH8Y",
          ovlp: "G-7FQDXC8DVC",
          resonant: "G-K7RCVL5RFQ",
          rbj: "G-7748LM48YW",
        },
      }),
      {
        headers: {
          ...cors(),
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (err) {
    return jsonError(err.message || "nexus-stats failed");
  }
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: cors() });
}
