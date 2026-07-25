/**
 * Nexus multi-site snapshot — humans only (no self, no bots).
 * One KV key for period analytics. Live/recent/alerts stay separate.
 */
export const NEXUS_SNAPSHOT_KEY = "nexus:snapshot:v1";
const MAX_DAILY = 45;
const MAX_JOURNEYS_PER_DAY = 40;

export function emptyDay() {
  return {
    pageviews: 0,
    sessions: 0,
    uniques: 0,
    leaves: 0,
    duration_ms: 0,
    hours: Array(24).fill(0),
    pages: {},
    pageTime: {}, // path -> { ms, n }
    sites: {},
    countries: {},
    cities: {},
    regions: {},
    refDomains: {},
    refs: {},
    browsers: {},
    os: {},
    devices: {},
    utm_source: {},
    utm_medium: {},
    utm_campaign: {},
    sessionSeen: {}, // session_id -> 1 (trimmed daily)
    visitorSeen: {}, // visitor_id -> 1
    journeys: [], // { ts, site, journey, land, duration_ms }
    // Conversion spine (session-deduped upstream where needed)
    funnel: { aware: 0, engage: 0, convert: 0 },
    funnelBySite: {}, // site -> { aware, engage, convert }
    eventCounts: {}, // type -> n
    converts: [], // recent convert rows for period
  };
}

export function emptySnapshot() {
  return {
    generated: new Date().toISOString(),
    totals: {
      pageviews: 0,
      sessions: 0,
      uniques: 0,
      leaves: 0,
      duration_ms: 0,
      aware: 0,
      engage: 0,
      convert: 0,
    },
    daily: {},
  };
}

const FUNNEL_STAGES = ["aware", "engage", "convert"];

function ensureFunnelSite(day, site) {
  const s = String(site || "unknown").slice(0, 64);
  if (!day.funnelBySite[s]) {
    day.funnelBySite[s] = { aware: 0, engage: 0, convert: 0 };
  }
  return day.funnelBySite[s];
}

/**
 * Conversion spine stage: aware | engage | convert
 * Caller should session-dedupe (once per session per stage).
 */
export function applyNexusFunnel(snap, stage, site, dateStr, meta = {}) {
  if (!FUNNEL_STAGES.includes(stage)) return;
  const day = ensureDay(snap, dateStr);
  if (!day.funnel) day.funnel = { aware: 0, engage: 0, convert: 0 };
  if (!day.funnelBySite) day.funnelBySite = {};
  if (!snap.totals) snap.totals = emptySnapshot().totals;
  day.funnel[stage] = (day.funnel[stage] || 0) + 1;
  snap.totals[stage] = (snap.totals[stage] || 0) + 1;
  const by = ensureFunnelSite(day, site);
  by[stage] = (by[stage] || 0) + 1;
  bump(day.eventCounts || (day.eventCounts = {}), stage);
  if (stage === "convert") {
    if (!day.converts) day.converts = [];
    day.converts.unshift({
      ts: meta.ts || Date.now(),
      site: String(site || "").slice(0, 64),
      path: String(meta.path || "").slice(0, 200),
      label: String(meta.label || meta.action || "convert").slice(0, 120),
      href: String(meta.href || "").slice(0, 300),
    });
    if (day.converts.length > 40) day.converts = day.converts.slice(0, 40);
  }
}

function bump(map, key, n = 1) {
  if (!key) return;
  const k = String(key).slice(0, 200);
  map[k] = (map[k] || 0) + n;
}

function ensureDay(snap, dateStr) {
  if (!snap.daily[dateStr]) snap.daily[dateStr] = emptyDay();
  return snap.daily[dateStr];
}

function trimSnapshot(snap) {
  const dates = Object.keys(snap.daily).sort();
  if (dates.length <= MAX_DAILY) return;
  for (const d of dates.slice(0, dates.length - MAX_DAILY)) {
    delete snap.daily[d];
  }
}

/** Cap in-day session/visitor maps so KV stays small */
function trimDayMaps(day) {
  const maxKeys = 500;
  for (const field of ["sessionSeen", "visitorSeen"]) {
    const keys = Object.keys(day[field] || {});
    if (keys.length > maxKeys) {
      const keep = keys.slice(-maxKeys);
      const next = {};
      for (const k of keep) next[k] = day[field][k];
      day[field] = next;
    }
  }
}

export async function loadNexusSnapshot(kv) {
  const raw = await kv.get(NEXUS_SNAPSHOT_KEY);
  if (!raw) return emptySnapshot();
  try {
    const snap = JSON.parse(raw);
    if (!snap.daily) snap.daily = {};
    if (!snap.totals) snap.totals = emptySnapshot().totals;
    return snap;
  } catch {
    return emptySnapshot();
  }
}

export async function saveNexusSnapshot(kv, snap) {
  snap.generated = new Date().toISOString();
  trimSnapshot(snap);
  await kv.put(NEXUS_SNAPSHOT_KEY, JSON.stringify(snap));
}

/**
 * Apply a human page_view / session event (already filtered).
 */
export function applyNexusPageview(snap, ev, dateStr) {
  const day = ensureDay(snap, dateStr);
  const hour = new Date(ev.ts || Date.now()).getUTCHours();
  day.hours[hour] = (day.hours[hour] || 0) + 1;
  day.pageviews += 1;
  snap.totals.pageviews += 1;

  bump(day.pages, ev.path || "/");
  bump(day.sites, ev.site || "unknown");
  bump(day.countries, ev.country);
  bump(day.cities, ev.city ? `${ev.city}${ev.region ? ", " + ev.region : ""}` : "");
  bump(day.regions, ev.region);
  bump(day.refDomains, ev.refDomain);
  bump(day.refs, ev.ref);
  bump(day.browsers, ev.browser);
  bump(day.os, ev.os);
  bump(day.devices, ev.device);
  bump(day.utm_source, ev.utm_source);
  bump(day.utm_medium, ev.utm_medium);
  bump(day.utm_campaign, ev.utm_campaign);

  if (ev.session_id && !day.sessionSeen[ev.session_id]) {
    day.sessionSeen[ev.session_id] = 1;
    day.sessions += 1;
    snap.totals.sessions += 1;
  }
  if (ev.visitor_id && !day.visitorSeen[ev.visitor_id]) {
    day.visitorSeen[ev.visitor_id] = 1;
    day.uniques += 1;
    snap.totals.uniques += 1;
  }

  trimDayMaps(day);
}

/**
 * Apply page_leave for time-on-page + journey snapshot.
 */
export function applyNexusLeave(snap, ev, dateStr) {
  const day = ensureDay(snap, dateStr);
  const ms = Math.max(0, Number(ev.duration_ms) || 0);
  const path = ev.path || "/";
  if (!day.pageTime[path]) day.pageTime[path] = { ms: 0, n: 0 };
  day.pageTime[path].ms += ms;
  day.pageTime[path].n += 1;
  day.leaves += 1;
  day.duration_ms += ms;
  snap.totals.leaves += 1;
  snap.totals.duration_ms += ms;

  const journey = Array.isArray(ev.journey) ? ev.journey.map(String).slice(0, 30) : [];
  day.journeys.unshift({
    ts: ev.ts || Date.now(),
    site: ev.site || "",
    land: ev.land || (journey[0] || path),
    path,
    journey,
    duration_ms: ms,
    country: ev.country || "",
    city: ev.city || "",
    refDomain: ev.refDomain || "",
  });
  if (day.journeys.length > MAX_JOURNEYS_PER_DAY) {
    day.journeys = day.journeys.slice(0, MAX_JOURNEYS_PER_DAY);
  }
}

function topN(map, n = 15) {
  return Object.entries(map || {})
    .filter(([k]) => k)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([name, count]) => ({ name, count }));
}

function mergeMaps(target, source) {
  for (const [k, v] of Object.entries(source || {})) {
    target[k] = (target[k] || 0) + v;
  }
}

function mergePageTime(target, source) {
  for (const [path, obj] of Object.entries(source || {})) {
    if (!target[path]) target[path] = { ms: 0, n: 0 };
    target[path].ms += obj.ms || 0;
    target[path].n += obj.n || 0;
  }
}

export function buildNexusStats(snap, periodId, dates) {
  const hours = Array(24).fill(0);
  const pages = {};
  const pageTime = {};
  const sites = {};
  const countries = {};
  const cities = {};
  const regions = {};
  const refDomains = {};
  const refs = {};
  const browsers = {};
  const os = {};
  const devices = {};
  const utm_source = {};
  const utm_medium = {};
  const utm_campaign = {};
  const journeys = [];
  const funnelBySite = {};
  const converts = [];
  let pageviews = 0;
  let sessions = 0;
  let uniques = 0;
  let leaves = 0;
  let duration_ms = 0;
  let aware = 0;
  let engage = 0;
  let convert = 0;
  const dailyTrend = [];

  // Forever = all daily keys; otherwise use provided dates or last 30
  const allDates = Object.keys(snap.daily || {}).sort();
  const useDates =
    periodId === "total" || periodId === "all"
      ? allDates
      : dates || allDates.slice(-30);

  for (const dateStr of useDates) {
    const day = snap.daily[dateStr];
    if (!day) {
      dailyTrend.push({
        date: dateStr,
        pageviews: 0,
        sessions: 0,
        uniques: 0,
        avg_sec: 0,
        aware: 0,
        engage: 0,
        convert: 0,
      });
      continue;
    }
    pageviews += day.pageviews || 0;
    sessions += day.sessions || 0;
    uniques += day.uniques || 0;
    leaves += day.leaves || 0;
    duration_ms += day.duration_ms || 0;
    const f = day.funnel || {};
    aware += f.aware || 0;
    engage += f.engage || 0;
    convert += f.convert || 0;
    for (const [sid, fv] of Object.entries(day.funnelBySite || {})) {
      if (!funnelBySite[sid]) funnelBySite[sid] = { aware: 0, engage: 0, convert: 0 };
      funnelBySite[sid].aware += fv.aware || 0;
      funnelBySite[sid].engage += fv.engage || 0;
      funnelBySite[sid].convert += fv.convert || 0;
    }
    if (Array.isArray(day.converts)) {
      for (const c of day.converts) converts.push(c);
    }
    for (let h = 0; h < 24; h++) hours[h] += day.hours?.[h] || 0;
    mergeMaps(pages, day.pages);
    mergePageTime(pageTime, day.pageTime);
    mergeMaps(sites, day.sites);
    mergeMaps(countries, day.countries);
    mergeMaps(cities, day.cities);
    mergeMaps(regions, day.regions);
    mergeMaps(refDomains, day.refDomains);
    mergeMaps(refs, day.refs);
    mergeMaps(browsers, day.browsers);
    mergeMaps(os, day.os);
    mergeMaps(devices, day.devices);
    mergeMaps(utm_source, day.utm_source);
    mergeMaps(utm_medium, day.utm_medium);
    mergeMaps(utm_campaign, day.utm_campaign);
    if (Array.isArray(day.journeys)) {
      for (const j of day.journeys) journeys.push(j);
    }
    const avg =
      day.leaves > 0 ? Math.round((day.duration_ms || 0) / day.leaves / 1000) : 0;
    dailyTrend.push({
      date: dateStr,
      pageviews: day.pageviews || 0,
      sessions: day.sessions || 0,
      uniques: day.uniques || 0,
      avg_sec: avg,
      aware: f.aware || 0,
      engage: f.engage || 0,
      convert: f.convert || 0,
    });
  }

  journeys.sort((a, b) => (b.ts || 0) - (a.ts || 0));
  converts.sort((a, b) => (b.ts || 0) - (a.ts || 0));

  const pageTimeList = Object.entries(pageTime)
    .map(([path, o]) => ({
      path,
      leaves: o.n,
      total_sec: Math.round((o.ms || 0) / 1000),
      avg_sec: o.n ? Math.round(o.ms / o.n / 1000) : 0,
    }))
    .sort((a, b) => b.leaves - a.leaves)
    .slice(0, 25);

  const funnelSites = Object.entries(funnelBySite)
    .map(([id, f]) => ({
      id,
      aware: f.aware || 0,
      engage: f.engage || 0,
      convert: f.convert || 0,
      rate:
        f.aware > 0 ? Math.round(((f.convert || 0) / f.aware) * 1000) / 10 : 0,
    }))
    .sort((a, b) => b.aware - a.aware || b.convert - a.convert);

  return {
    period: periodId,
    dates: useDates,
    overview: {
      pageviews,
      sessions,
      uniques,
      leaves,
      avg_sec: leaves > 0 ? Math.round(duration_ms / leaves / 1000) : 0,
      total_duration_sec: Math.round(duration_ms / 1000),
      aware,
      engage,
      convert,
      convert_rate: aware > 0 ? Math.round((convert / aware) * 1000) / 10 : 0,
    },
    funnel: {
      aware,
      engage,
      convert,
      rate: aware > 0 ? Math.round((convert / aware) * 1000) / 10 : 0,
      bySite: funnelSites,
      recentConverts: converts.slice(0, 25),
    },
    hours,
    dailyTrend: dailyTrend.sort((a, b) => (a.date < b.date ? -1 : 1)),
    topPages: topN(pages, 20),
    pageTime: pageTimeList,
    topSites: topN(sites, 15),
    topCountries: topN(countries, 15),
    topCities: topN(cities, 15),
    topRegions: topN(regions, 15),
    topRefDomains: topN(refDomains, 15),
    topRefs: topN(refs, 12),
    browsers: topN(browsers, 10),
    os: topN(os, 10),
    devices: topN(devices, 8),
    utm: {
      sources: topN(utm_source, 10),
      mediums: topN(utm_medium, 10),
      campaigns: topN(utm_campaign, 10),
    },
    journeys: journeys.slice(0, 50),
  };
}
