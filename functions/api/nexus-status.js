/**
 * GET /api/nexus-status
 * Live presence + recent journeys + alerts for B-ATCAVE Nexus.
 * Optional ?key= if ANALYTICS_KEY is set (same as /api/stats).
 */
import { cors, getVisitorKv, jsonError } from "../_shared/kv.js";

const LIVE_KEY = "nexus:live";
const RECENT_KEY = "nexus:recent";
const ALERTS_KEY = "nexus:alerts";
const DAY_PREFIX = "nexus:day:";
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
    // B-ATCAVE has no password yet (end of day). Do not gate on ANALYTICS_KEY.
    // Optional future: require env.NEXUS_KEY when set.
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

    const kv = getVisitorKv(env);
    const now = Date.now();
    const liveRaw = await readJson(kv, LIVE_KEY, {});
    const live = Object.values(liveRaw)
      .filter((row) => (row.last_ts || 0) >= now - LIVE_TTL_MS)
      .sort((a, b) => (b.last_ts || 0) - (a.last_ts || 0));

    const recent = await readJson(kv, RECENT_KEY, []);
    const alerts = await readJson(kv, ALERTS_KEY, []);

    const today = new Date().toISOString().slice(0, 10);
    const day = await readJson(kv, DAY_PREFIX + today, { hits: 0, by_site: {} });

    // Also pull OSB first-party overview (single snapshot read)
    let osb = null;
    try {
      const { loadSnapshot, buildStatsFromSnapshot } = await import("../_shared/snapshot.js");
      const snap = await loadSnapshot(kv);
      const stats = buildStatsFromSnapshot(snap, "today");
      osb = {
        liveNow: stats.overview?.liveNow || 0,
        todayVisits: stats.overview?.todayVisitTotal || 0,
        todayUnique: stats.overview?.todayUniqueVisitors || 0,
        totalPageviews: stats.overview?.totalPageviews || 0,
        totalDownloads: stats.overview?.totalDownloadsAllTime || 0,
      };
    } catch {
      osb = null;
    }

    return new Response(
      JSON.stringify({
        generated: new Date().toISOString(),
        live_count: live.length,
        live,
        recent: recent.slice(0, 50),
        alerts: alerts.slice(0, 25),
        today: day,
        osb,
        sites: [
          { id: "batiya-realty", name: "Batiya Realty (Ron)", url: "https://batiya-realty.vercel.app/pitch.html" },
          { id: "sulieman-hvac", name: "Sulieman HVAC", url: "https://sulieman-go.vercel.app/pitch.html" },
          { id: "fcr-funding", name: "FCR / Faber funding", url: "https://richardbjamison.github.io/faber-capital-resources/" },
          { id: "osb", name: "Open Source Barware", url: "https://opensourcebarware.com/" },
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
    return jsonError(err.message || "nexus-status failed");
  }
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: cors() });
}
