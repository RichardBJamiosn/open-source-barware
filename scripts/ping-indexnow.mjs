#!/usr/bin/env node
/**
 * Ping IndexNow (Bing + multi-engine hub) after deploy.
 *
 * Usage:
 *   node scripts/ping-indexnow.mjs
 *   npm run indexnow
 *
 * Key hosted at:
 *   https://opensourcebarware.com/764da58717134fd189dfba0013bc076b.txt
 *   https://opensourcebarware.com/indexnow-key.txt  (same key, convenience)
 */
const HOST = "opensourcebarware.com";
const KEY = "764da58717134fd189dfba0013bc076b";
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;

const URLS = [
  `https://${HOST}/`,
  `https://${HOST}/download`,
  `https://${HOST}/downloads`,
  `https://${HOST}/free-bar-inventory-software`,
  `https://${HOST}/bar-inventory-software-comparison`,
  `https://${HOST}/the-process`,
  `https://${HOST}/changelog`,
  `https://${HOST}/about`,
  `https://${HOST}/resources`,
  `https://${HOST}/manifesto`,
  `https://${HOST}/open-source-compliance`,
  `https://${HOST}/liquor-inventory`,
  `https://${HOST}/wine-inventory`,
  `https://${HOST}/blog`,
  `https://${HOST}/blog/free-inventory-system-guide`,
  `https://${HOST}/blog/best-free-bar-inventory-system`,
  `https://${HOST}/blog/variance-tracking-that-works`,
  `https://${HOST}/blog/pos-integration-free-inventory`,
  `https://${HOST}/blog/when-inventory-meets-the-front-of-house`,
  `https://${HOST}/blog/feed.xml`,
  `https://${HOST}/inventory/dashboard`,
  `https://${HOST}/llms.txt`,
  `https://${HOST}/sitemap.xml`,
];

const payload = {
  host: HOST,
  key: KEY,
  keyLocation: KEY_LOCATION,
  urlList: URLS,
};

const endpoints = [
  "https://api.indexnow.org/indexnow",
  "https://www.bing.com/indexnow",
];

console.log(`IndexNow · ${HOST} · ${URLS.length} URLs · key ${KEY.slice(0, 8)}…`);

let allOk = true;
for (const endpoint of endpoints) {
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(payload),
    });
    const body = await res.text().catch(() => "");
    console.log(`${endpoint} → ${res.status} ${res.statusText}${body ? ` · ${body.slice(0, 120)}` : ""}`);
    if (res.status !== 200 && res.status !== 202) allOk = false;
  } catch (e) {
    allOk = false;
    console.error(`${endpoint} → ERROR ${e.message}`);
  }
}

// Optional single-URL GET smoke (homepage)
try {
  const q = new URL("https://www.bing.com/indexnow");
  q.searchParams.set("url", `https://${HOST}/`);
  q.searchParams.set("key", KEY);
  const res = await fetch(q);
  console.log(`GET homepage ping → ${res.status} ${res.statusText}`);
} catch (e) {
  console.error(`GET ping ERROR ${e.message}`);
}

process.exit(allOk ? 0 : 1);
