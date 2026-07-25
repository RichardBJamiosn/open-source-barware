/**
 * Offer Tracker — first-party journey tracking for pitch / offer sites
 * Package: web-building-programs / tracker
 *
 * Captures: visitor id, session, land page, page views, time on page,
 * scroll depth, internal path (journey), outbound clicks, UTMs.
 *
 * Dual-fire: GA4 (optional) + first-party endpoint (optional) + console debug.
 *
 * Usage (before </body>):
 * <script>
 *   window.OFFER_TRACKER = {
 *     siteId: "batiya-realty",
 *     ga4Id: "G-XXXXXXXX",
 *     endpoint: "https://YOUR-COLLECTOR/api/collect", // optional
 *     clarityId: "",  // optional Microsoft Clarity project id
 *     debug: false
 *   };
 * </script>
 * <script src="/js/tracker.js" defer></script>
 */
(function () {
  "use strict";

  var cfg = window.OFFER_TRACKER || {};
  var SITE = cfg.siteId || location.hostname || "unknown";
  var GA4 = cfg.ga4Id || "";
  var ENDPOINT =
    cfg.endpoint ||
    "https://opensourcebarware.com/api/nexus-collect";
  var CLARITY = cfg.clarityId || "";
  var DEBUG = !!cfg.debug;
  var HEARTBEAT_MS = Math.max(10000, Number(cfg.heartbeatMs) || 15000);
  var VERSION = 1;

  /* Mark this browser as Richard / owner → ignored for live + uniques + alerts */
  try {
    if (/[?&]owner=1(?:&|$)/.test(location.search || "")) {
      localStorage.setItem("ot_owner", "1");
    }
    if ((location.pathname || "").indexOf("B-ATCAVE") !== -1) {
      localStorage.setItem("ot_owner", "1");
    }
    // Known owner hostnames (your machines browsing your own marketing/offer sites)
    if (cfg.forceOwner || cfg.self) {
      localStorage.setItem("ot_owner", "1");
    }
  } catch (e) {}

  function log() {
    if (DEBUG && console && console.log) {
      console.log.apply(console, ["[offer-tracker]"].concat([].slice.call(arguments)));
    }
  }

  function uid(prefix) {
    return (
      (prefix || "t") +
      "_" +
      Math.random().toString(36).slice(2, 10) +
      "_" +
      Date.now().toString(36)
    );
  }

  function storageGet(key) {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      return null;
    }
  }
  function storageSet(key, val) {
    try {
      localStorage.setItem(key, val);
    } catch (e) {}
  }
  function sessionGet(key) {
    try {
      return sessionStorage.getItem(key);
    } catch (e) {
      return null;
    }
  }
  function sessionSet(key, val) {
    try {
      sessionStorage.setItem(key, val);
    } catch (e) {}
  }

  var VISITOR_KEY = "ot_vid";
  var SESSION_KEY = "ot_sid";
  var JOURNEY_KEY = "ot_journey";
  var SESSION_START_KEY = "ot_sstart";

  var visitorId = storageGet(VISITOR_KEY);
  if (!visitorId) {
    visitorId = uid("v");
    storageSet(VISITOR_KEY, visitorId);
  }

  var sessionId = sessionGet(SESSION_KEY);
  var isNewSession = false;
  if (!sessionId) {
    sessionId = uid("s");
    sessionSet(SESSION_KEY, sessionId);
    sessionSet(SESSION_START_KEY, String(Date.now()));
    isNewSession = true;
  }

  /* Register owner visitor_id server-side so uniques/live stay clean even if localStorage is cleared later */
  function registerOwnerOnServer() {
    if (!isOwnerBrowser()) return;
    try {
      var body = JSON.stringify({
        type: "mark_owner",
        visitor_id: visitorId,
        site: SITE,
        ts: Date.now(),
      });
      if (navigator.sendBeacon) {
        navigator.sendBeacon(ENDPOINT, new Blob([body], { type: "application/json" }));
      } else {
        fetch(ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: body,
          keepalive: true,
          mode: "cors",
          credentials: "omit",
        }).catch(function () {});
      }
    } catch (e) {}
  }

  function getJourney() {
    try {
      var raw = sessionGet(JOURNEY_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }
  function pushJourney(path) {
    var j = getJourney();
    if (j.length === 0 || j[j.length - 1] !== path) {
      j.push(path);
      if (j.length > 40) j = j.slice(-40);
      sessionSet(JOURNEY_KEY, JSON.stringify(j));
    }
    return j;
  }

  function utmParams() {
    var out = {};
    try {
      var q = new URLSearchParams(location.search);
      ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"].forEach(function (k) {
        var v = q.get(k);
        if (v) out[k] = v;
      });
    } catch (e) {}
    return out;
  }

  function now() {
    return Date.now();
  }

  var pagePath = location.pathname + location.search;
  var pageTitle = document.title || "";
  var pageEnteredAt = now();
  var lastHeartbeatAt = pageEnteredAt;
  var maxScroll = 0;
  var left = false;
  var journey = pushJourney(pagePath);

  function scrollPct() {
    var el = document.documentElement;
    var body = document.body;
    var scrollTop = window.pageYOffset || el.scrollTop || body.scrollTop || 0;
    var height = Math.max(el.scrollHeight, body.scrollHeight) - window.innerHeight;
    if (height <= 0) return 100;
    return Math.min(100, Math.round((scrollTop / height) * 100));
  }

  function isOwnerBrowser() {
    try {
      if (localStorage.getItem("ot_owner") === "1") return true;
    } catch (e) {}
    if (location.hostname === "localhost" || location.hostname === "127.0.0.1") return true;
    return !!cfg.self;
  }

  function basePayload(type, extra) {
    var p = {
      v: VERSION,
      type: type,
      site: SITE,
      visitor_id: visitorId,
      session_id: sessionId,
      ts: now(),
      path: pagePath,
      title: pageTitle,
      href: location.href,
      ref: document.referrer || "",
      land: journey[0] || pagePath,
      journey: journey.slice(),
      journey_len: journey.length,
      utm: utmParams(),
      lang: navigator.language || "",
      self: isOwnerBrowser(),
      tz: (function () {
        try {
          return Intl.DateTimeFormat().resolvedOptions().timeZone || "";
        } catch (e) {
          return "";
        }
      })(),
      sw: window.screen ? window.screen.width : 0,
      sh: window.screen ? window.screen.height : 0,
      vw: window.innerWidth || 0,
      vh: window.innerHeight || 0,
    };
    if (extra) {
      for (var k in extra) {
        if (Object.prototype.hasOwnProperty.call(extra, k)) p[k] = extra[k];
      }
    }
    return p;
  }

  /* —— GA4 —— */
  function ensureGtag() {
    if (!GA4) return;
    if (typeof window.gtag === "function") return;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(GA4);
    document.head.appendChild(s);
    window.gtag("js", new Date());
    window.gtag("config", GA4, {
      send_page_view: false,
      anonymize_ip: true,
    });
  }

  function fireGa4(name, params) {
    if (!GA4) return;
    ensureGtag();
    try {
      window.gtag("event", name, params || {});
    } catch (e) {
      log("ga4 error", e);
    }
  }

  /* —— Clarity (optional session replay) —— */
  function ensureClarity() {
    if (!CLARITY || window.clarity) return;
    (function (c, l, a, r, i, t, y) {
      c[a] =
        c[a] ||
        function () {
          (c[a].q = c[a].q || []).push(arguments);
        };
      t = l.createElement(r);
      t.async = 1;
      t.src = "https://www.clarity.ms/tag/" + i;
      y = l.getElementsByTagName(r)[0];
      y.parentNode.insertBefore(t, y);
    })(window, document, "clarity", "script", CLARITY);
  }

  /* —— First-party endpoint —— */
  function sendEndpoint(payload) {
    if (!ENDPOINT) return;
    var body = JSON.stringify(payload);
    try {
      if (navigator.sendBeacon) {
        var blob = new Blob([body], { type: "application/json" });
        if (navigator.sendBeacon(ENDPOINT, blob)) return;
      }
    } catch (e) {}
    try {
      fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: body,
        keepalive: true,
        mode: "cors",
        credentials: "omit",
      }).catch(function () {});
    } catch (e) {
      log("endpoint error", e);
    }
  }

  function emit(type, extra) {
    var payload = basePayload(type, extra);
    log(type, payload);

    /* GA4 mapping */
    if (type === "session_start") {
      fireGa4("offer_session_start", {
        site_id: SITE,
        session_id: sessionId,
        visitor_id: visitorId,
        land_page: payload.land,
      });
    } else if (type === "page_view") {
      fireGa4("page_view", {
        page_path: pagePath,
        page_title: pageTitle,
        site_id: SITE,
        session_id: sessionId,
      });
      fireGa4("offer_page_view", {
        site_id: SITE,
        session_id: sessionId,
        visitor_id: visitorId,
        page_path: pagePath,
        journey_len: journey.length,
        land_page: payload.land,
      });
    } else if (type === "page_heartbeat" || type === "page_leave") {
      fireGa4("offer_page_time", {
        site_id: SITE,
        session_id: sessionId,
        page_path: pagePath,
        duration_sec: Math.round((extra && extra.duration_ms ? extra.duration_ms : 0) / 1000),
        scroll_pct: (extra && extra.scroll_pct) || maxScroll,
        event_type: type,
      });
    } else if (type === "click") {
      fireGa4("offer_click", {
        site_id: SITE,
        session_id: sessionId,
        link_url: (extra && extra.link_href) || "",
        link_text: (extra && extra.link_text) || "",
        outbound: !!(extra && extra.outbound),
      });
    } else if (type === "scroll") {
      fireGa4("offer_scroll", {
        site_id: SITE,
        session_id: sessionId,
        page_path: pagePath,
        scroll_pct: (extra && extra.scroll_pct) || 0,
      });
    } else if (type === "session_end") {
      fireGa4("offer_session_end", {
        site_id: SITE,
        session_id: sessionId,
        journey_path: journey.join(" → ").slice(0, 500),
        journey_len: journey.length,
        total_sec: Math.round((extra && extra.session_ms ? extra.session_ms : 0) / 1000),
      });
    }

    sendEndpoint(payload);
  }

  /* —— Lifecycle —— */
  // Owner first: stamp server + never emit page stats for this browser
  if (isOwnerBrowser()) {
    registerOwnerOnServer();
    log("owner browser — excluded from live, uniques, funnel, alerts");
  } else {
    if (isNewSession) emit("session_start");
    emit("page_view");
  }

  function durationSoFar() {
    return now() - pageEnteredAt;
  }

  function heartbeat() {
    if (left || document.visibilityState === "hidden" || isOwnerBrowser()) return;
    maxScroll = Math.max(maxScroll, scrollPct());
    var d = durationSoFar();
    lastHeartbeatAt = now();
    emit("page_heartbeat", {
      duration_ms: d,
      scroll_pct: maxScroll,
    });
  }

  var hbTimer = setInterval(heartbeat, HEARTBEAT_MS);

  function pageLeave(reason) {
    if (left) return;
    left = true;
    clearInterval(hbTimer);
    if (isOwnerBrowser()) return;
    maxScroll = Math.max(maxScroll, scrollPct());
    var d = durationSoFar();
    emit("page_leave", {
      duration_ms: d,
      scroll_pct: maxScroll,
      leave_reason: reason || "unknown",
    });

    /* session end snapshot (best-effort) */
    var sstart = Number(sessionGet(SESSION_START_KEY) || pageEnteredAt);
    emit("session_end", {
      session_ms: now() - sstart,
      duration_ms: d,
      scroll_pct: maxScroll,
    });
  }

  window.addEventListener("pagehide", function () {
    pageLeave("pagehide");
  });
  window.addEventListener("beforeunload", function () {
    pageLeave("beforeunload");
  });
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "hidden") {
      pageLeave("hidden");
    } else if (document.visibilityState === "visible" && left) {
      /* resumed tab — start a fresh page slice without new session */
      left = false;
      pageEnteredAt = now();
      hbTimer = setInterval(heartbeat, HEARTBEAT_MS);
      if (!isOwnerBrowser()) emit("page_view", { resumed: true });
    }
  });

  /* —— Conversion spine helpers (aware / engage / convert) —— */
  var engagedOnce = false;
  var convertOnce = false;

  function markEngage(reason) {
    if (engagedOnce || isOwnerBrowser()) return;
    engagedOnce = true;
    emit("engage", { label: reason || "engage", scroll_pct: maxScroll, duration_ms: durationSoFar() });
  }

  function markConvert(label, extra) {
    if (convertOnce && !(extra && extra.allowMultiple)) return;
    if (isOwnerBrowser()) return;
    convertOnce = true;
    markEngage("pre_convert");
    var payload = { label: label || "convert", action: (extra && extra.action) || "convert" };
    if (extra) {
      for (var k in extra) {
        if (Object.prototype.hasOwnProperty.call(extra, k) && k !== "allowMultiple") {
          payload[k] = extra[k];
        }
      }
    }
    emit("convert", payload);
    fireGa4("offer_convert", {
      site_id: SITE,
      session_id: sessionId,
      label: payload.label,
      action: payload.action || "convert",
    });
  }

  /* scroll milestones 25/50/75/100 — 50%+ = engage */
  var scrollMarks = { 25: false, 50: false, 75: false, 100: false };
  window.addEventListener(
    "scroll",
    function () {
      var p = scrollPct();
      maxScroll = Math.max(maxScroll, p);
      [25, 50, 75, 100].forEach(function (m) {
        if (!scrollMarks[m] && p >= m) {
          scrollMarks[m] = true;
          emit("scroll", { scroll_pct: m });
          if (m >= 50) markEngage("scroll_" + m);
        }
      });
    },
    { passive: true }
  );

  /* dwell 15s = engage */
  setTimeout(function () {
    if (!left) markEngage("dwell_15s");
  }, 15000);

  /* CTA view — elements with data-ot-cta enter viewport */
  try {
    if (typeof IntersectionObserver === "function") {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (en) {
            if (en.isIntersecting) {
              emit("cta_view", {
                label: (en.target.getAttribute("data-ot-cta") || en.target.id || "cta").slice(0, 80),
              });
              markEngage("cta_view");
              io.unobserve(en.target);
            }
          });
        },
        { threshold: 0.4 }
      );
      document.querySelectorAll("[data-ot-cta], .ot-cta, [data-ot-convert]").forEach(function (el) {
        io.observe(el);
      });
    }
  } catch (e) {}

  /* click / movement through links + convert signals */
  document.addEventListener(
    "click",
    function (ev) {
      var t = ev.target;
      if (!t) return;
      var convertEl = t.closest ? t.closest("[data-ot-convert], .ot-convert, button[type='submit']") : null;
      var a = t.closest ? t.closest("a") : null;

      if (a && a.href) {
        var href = a.href;
        var text = (a.textContent || "").trim().slice(0, 120);
        var outbound = false;
        try {
          outbound = a.hostname && a.hostname !== location.hostname;
        } catch (e) {}
        var isTel = /^tel:/i.test(href);
        var isMail = /^mailto:/i.test(href);
        var isDl =
          /\.(zip|pdf|csv|xlsx?)($|\?)/i.test(href) ||
          /download/i.test(href) ||
          a.hasAttribute("download");
        var forceConvert =
          a.hasAttribute("data-ot-convert") ||
          (a.className && String(a.className).indexOf("ot-convert") !== -1);

        emit("click", {
          link_href: href,
          link_text: text,
          outbound: outbound,
          convert: !!(isTel || isMail || isDl || forceConvert),
        });

        if (isTel) markConvert("call_click", { action: "call_click", href: href });
        else if (isMail) markConvert("mailto_click", { action: "mailto_click", href: href });
        else if (isDl) markConvert("download", { action: "download", href: href });
        else if (forceConvert) markConvert(text || "cta_click", { action: "cta_click", href: href });
        else if (/book|start|contact|apply|get started|deal|call|schedule|buy|sign up|signup/i.test(text)) {
          markEngage("cta_click_soft");
        }
        return;
      }

      if (convertEl) {
        markConvert(
          convertEl.getAttribute("data-ot-convert") ||
            (convertEl.textContent || "").trim().slice(0, 80) ||
            "convert",
          { action: convertEl.tagName === "BUTTON" ? "button" : "convert" }
        );
      }
    },
    true
  );

  /* form submits = convert */
  document.addEventListener(
    "submit",
    function (ev) {
      var form = ev.target;
      if (!form || form.tagName !== "FORM") return;
      if (form.getAttribute("data-ot-ignore") === "1") return;
      markConvert(form.getAttribute("data-ot-convert") || form.id || form.name || "form_submit", {
        action: "form_submit",
      });
    },
    true
  );

  ensureGtag();
  ensureClarity();

  window.OfferTracker = {
    visitorId: visitorId,
    sessionId: sessionId,
    siteId: SITE,
    emit: emit,
    getJourney: getJourney,
    engage: markEngage,
    convert: markConvert,
  };

  log("ready", { SITE: SITE, visitorId: visitorId, sessionId: sessionId, GA4: GA4, ENDPOINT: ENDPOINT });
})();
