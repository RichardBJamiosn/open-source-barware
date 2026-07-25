/**
 * B-ATCAVE — Full SEO Analysis cockpit (warehouse-backed)
 * Prefers window.SEO_PORTFOLIO (seo-data.js), then /B-ATCAVE/data/seo-portfolio.json
 */
(function (global) {
  "use strict";

  var SNAPSHOT_URL = "/B-ATCAVE/data/seo-portfolio.json";
  var JOBS_URL = "/B-ATCAVE/data/seo-jobs.json";
  var jobsCache = null;
  var LOCAL_API = "http://127.0.0.1:8787";
  var cache = null;
  var activeDomain = null;
  var activeTab = "all";
  var localOnline = false;

  function $(id) {
    return document.getElementById(id);
  }
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
  function num(n) {
    if (n == null || n === "") return "—";
    var x = Number(n);
    if (isNaN(x)) return esc(n);
    return x.toLocaleString();
  }
  function money(n) {
    if (n == null || isNaN(Number(n))) return "—";
    return "$" + Number(n).toFixed(2);
  }
  function shortDate(s) {
    if (!s) return "—";
    try {
      return new Date(s).toLocaleString();
    } catch (e) {
      return esc(s);
    }
  }

  async function loadJobs() {
    try {
      var r = await fetch(JOBS_URL + "?_=" + Date.now(), { cache: "no-store" });
      if (!r.ok) throw new Error("jobs " + r.status);
      jobsCache = await r.json();
    } catch (e) {
      jobsCache = null;
    }
    return jobsCache;
  }

  function jobsStatusDot(st) {
    var s = st || "never";
    var cls = s === "current" ? "green" : s === "due" ? "yellow" : s === "blocked" ? "yellow" : "grey";
    return '<span class="seo-dot ' + cls + '" title="' + esc(s) + '"></span>';
  }

  function renderJobsStrip() {
    if (!jobsCache || !jobsCache.jobs || !jobsCache.jobs.length) {
      return (
        '<div class="card" style="margin-bottom:1rem">' +
        '<div class="card-h"><h3>SEO agent jobs</h3></div>' +
        '<p class="empty">No jobs board yet. Run: <code>python3 export_jobs_status.py</code></p></div>'
      );
    }
    var rows = jobsCache.jobs
      .map(function (j) {
        return (
          "<tr>" +
          '<td>' + jobsStatusDot(j.status) + ' <strong class="seo-mono">' + esc(j.job) + '</strong></td>' +
          "<td>" + esc(j.last_run || "—") + "</td>" +
          "<td>" + esc(j.next_due || "now") + "</td>" +
          '<td><span class="site-tag">' + esc(j.status) + '</span></td>' +
          '<td class="seo-mono" style="font-size:.75rem">' + esc((j.notes || "").slice(0, 90)) + '</td>' +
          "</tr>"
        );
      })
      .join("");
    return (
      '<div class="card" style="margin-bottom:1rem" id="seo-jobs-strip">' +
      '<div class="card-h"><h3>SEO agent jobs · live board</h3>' +
      '<span class="empty">Updated ' + shortDate(jobsCache.generated_at) +
      " · sites: " + esc((jobsCache.sites || []).join(", ")) +
      "</span></div>" +
      '<div class="seo-tablewrap"><table class="seo-table"><thead><tr>' +
      "<th>Job</th><th>Last run</th><th>Next due</th><th>Status</th><th>Notes</th>" +
      "</tr></thead><tbody>" +
      rows +
      "</tbody></table></div></div>"
    );
  }

  function statusDot(st) {
    var cls =
      st === "green" ? "seo-dot green" : st === "yellow" ? "seo-dot yellow" : "seo-dot grey";
    return '<span class="' + cls + '" title="' + esc(st || "unscanned") + '"></span>';
  }
  function diffBar(v) {
    if (v == null) return "—";
    var n = Math.round(Number(v));
    var cls = n < 30 ? "easy" : n < 60 ? "mid" : "hard";
    return (
      '<span class="seo-diff ' +
      cls +
      '"><span class="seo-diff-track"><span class="seo-diff-fill" style="width:' +
      Math.min(100, n) +
      '%"></span></span><b>' +
      n +
      "</b></span>"
    );
  }
  function findProp(domain) {
    if (!cache || !cache.properties) return null;
    for (var i = 0; i < cache.properties.length; i++) {
      if (cache.properties[i].domain === domain) return cache.properties[i];
    }
    return null;
  }

  async function loadSnapshot(force) {
    if (!force && cache) return cache;
    if (!force && global.SEO_PORTFOLIO && global.SEO_PORTFOLIO.properties) {
      cache = global.SEO_PORTFOLIO;
      return cache;
    }
    try {
      var r = await fetch(SNAPSHOT_URL + "?_=" + Date.now(), { cache: "no-store" });
      if (!r.ok) throw new Error("seo-portfolio " + r.status);
      cache = await r.json();
      global.SEO_PORTFOLIO = cache;
      return cache;
    } catch (e) {
      if (global.SEO_PORTFOLIO && global.SEO_PORTFOLIO.properties) {
        cache = global.SEO_PORTFOLIO;
        return cache;
      }
      throw e;
    }
  }

  async function probeLocal() {
    try {
      var r = await fetch(LOCAL_API + "/api/portfolio", { mode: "cors", cache: "no-store" });
      localOnline = r.ok;
    } catch (e) {
      localOnline = false;
    }
    return localOnline;
  }

  function setTitle(domain) {
    var title = $("pageTitle");
    var sub = $("pageSub");
    if (!title) return;
    if (domain) {
      var p = findProp(domain);
      title.textContent = "SEO · " + domain;
      if (sub) {
        sub.textContent =
          (p && p.label ? p.label + " · " : "") +
          "Full warehouse report · keywords · gaps · technical · links";
      }
    } else {
      title.textContent = "SEO Analysis";
      if (sub) {
        sub.textContent = "Command center · every client site · full functions & reports";
      }
    }
  }

  function showViewSafe(name) {
    document.querySelectorAll(".panel").forEach(function (p) {
      p.classList.remove("active");
    });
    var el = $("view-" + name);
    if (el) el.classList.add("active");
  }

  function highlightNav() {
    document.querySelectorAll("[data-view='seo-analysis']").forEach(function (a) {
      var d = a.getAttribute("data-seo-domain") || "";
      var on =
        (activeDomain && d === activeDomain) ||
        (!activeDomain && !d && a.id === "nav-seo-home");
      a.classList.toggle("active", !!on);
    });
    var sub = $("sub-seo");
    var btn = document.querySelector('[data-toggle="sub-seo"]');
    if (sub) sub.classList.add("open");
    if (btn) btn.classList.add("active");
  }

  function tile(k, v) {
    return (
      '<div class="kpi"><div class="label">' +
      esc(k) +
      '</div><div class="value" style="font-size:1.2rem">' +
      v +
      "</div></div>"
    );
  }

  function tableWrap(headers, rowHtml, emptyMsg) {
    if (!rowHtml) {
      return (
        '<div class="card"><p class="empty">' +
        esc(emptyMsg || "No data in warehouse yet for this section.") +
        "</p></div>"
      );
    }
    return (
      '<div class="card seo-tablewrap"><table class="seo-table"><thead><tr>' +
      headers +
      "</tr></thead><tbody>" +
      rowHtml +
      "</tbody></table></div>"
    );
  }

  function section(title, html, id) {
    return (
      '<section class="seo-section" id="' +
      esc(id || "") +
      '"><div class="card-h" style="margin:1.1rem 0 .55rem"><h3>' +
      esc(title) +
      "</h3></div>" +
      html +
      "</section>"
    );
  }

  /* ── Portfolio ─────────────────────────────────────────── */
  function renderPortfolio() {
    var body = $("seo-body");
    if (!body || !cache) return;
    var props = cache.properties || [];
    var tools = cache.tools || {};
    var spend = cache.spend || {};
    var sum = cache.summary || {};

    var cards = props
      .map(function (p) {
        var m = p.metrics || {};
        var scanned = p.status !== "unscanned";
        var stats = scanned
          ? '<div class="seo-stats">' +
            "<div><b>" +
            num(m.tracked_keywords || (p.keywords || []).length) +
            "</b><span>keywords</span></div>" +
            "<div><b>" +
            num(m.ranked_keywords) +
            "</b><span>ranked</span></div>" +
            "<div><b>" +
            num(m.backlinks || (p.backlinks || []).length) +
            "</b><span>backlinks</span></div>" +
            "<div><b>" +
            (m.onpage_score != null ? Math.round(m.onpage_score) : "—") +
            "</b><span>on-page</span></div>" +
            "<div><b>" +
            num((p.gap_keywords || []).length) +
            "</b><span>gaps</span></div>" +
            "<div><b>" +
            num((p.pages || []).length) +
            "</b><span>pages</span></div>" +
            "</div>"
          : '<div class="seo-unscan">Awaiting first dive — open site → Run / Claude</div>';
        return (
          '<button type="button" class="seo-card" data-domain="' +
          esc(p.domain) +
          '">' +
          '<div class="seo-card-top">' +
          statusDot(p.status) +
          '<strong class="seo-dom">' +
          esc(p.domain) +
          '</strong><span class="site-tag">' +
          esc(p.role || "") +
          "</span></div>" +
          '<div class="seo-lbl">' +
          esc(p.label || "") +
          "</div>" +
          stats +
          '<div class="seo-card-foot">Last dive · ' +
          shortDate(m.last_dive) +
          (p.report_url
            ? ' · <a href="' +
              esc(p.report_url) +
              '" target="_blank" rel="noopener" onclick="event.stopPropagation()">Full report ↗</a>'
            : "") +
          "</div></button>"
        );
      })
      .join("");

    var pullRows = ((spend.recent || []).slice(0, 15) || [])
      .map(function (r) {
        return (
          "<tr><td>" +
          shortDate(r.created_at) +
          '</td><td class="seo-mono">' +
          esc(String(r.endpoint || "").replace(/^\/v3\//, "")) +
          '</td><td class="num">' +
          money(r.cost_usd) +
          "</td></tr>"
        );
      })
      .join("");

    body.innerHTML =
      '<div class="seo-modules">' +
      '<a class="seo-mod" href="/B-ATCAVE/seo/reports/" target="_blank" rel="noopener"><strong>Full reports</strong><span>Per-site HTML dumps</span></a>' +
      '<a class="seo-mod" href="/B-ATCAVE/seo/wire-map" target="_blank" rel="noopener"><strong>System wire map</strong><span>All cockpit modules</span></a>' +
      '<a class="seo-mod" href="/B-ATCAVE/seo/cockpit" target="_blank" rel="noopener"><strong>Standalone cockpit</strong><span>Dark UI shell</span></a>' +
      '<button type="button" class="seo-mod" id="seoOpenResonant"><strong>Open Resonant</strong><span>Live warehouse view</span></button>' +
      "</div>" +
      '<p class="note"><strong>Command center.</strong> Click a site for the full analysis (keywords, page map, content gap, competitors, technical crawl, backlinks, queues, run commands). ' +
      "Data from in-house SEO engine (DataForSEO + warehouse). " +
      (localOnline ? "<strong>Local engine ONLINE.</strong>" : "Snapshot mode.") +
      " · " +
      esc(sum.scanned || 0) +
      "/" +
      esc(sum.properties || 0) +
      " scanned · spend <strong>$" +
      Number(spend.total || 0).toFixed(3) +
      "</strong></p>" +
      '<div class="seo-fleet">' +
      cards +
      "</div>" +
      '<div class="row row-2" style="margin-top:1rem">' +
      '<article class="card"><div class="card-h"><h3>Modules in this cockpit</h3></div>' +
      '<ul class="seo-ol">' +
      "<li><strong>Keyword Battlefield</strong> — volume, difficulty, CPC, intent</li>" +
      "<li><strong>Page map</strong> — keyword_targets → intended URL</li>" +
      "<li><strong>Content gap</strong> — rival keywords you don’t rank for</li>" +
      "<li><strong>Competitor intel</strong> — domains hitting your SERPs</li>" +
      "<li><strong>Technical crawl</strong> — status, titles, on-page flags</li>" +
      "<li><strong>Backlinks</strong> — source, anchor, DR</li>" +
      "<li><strong>Queues</strong> — Claude backend + Grok wording handoffs</li>" +
      "<li><strong>Full HTML report</strong> — printable warehouse dump</li>" +
      "</ul></article>" +
      '<article class="card"><div class="card-h"><h3>Recent DataForSEO pulls</h3></div>' +
      tableWrap(
        "<th>When</th><th>Endpoint</th><th class=\"num\">Cost</th>",
        pullRows,
        "No API pulls logged yet"
      ).replace(/^<div class="card seo-tablewrap">/, '<div class="seo-tablewrap">') +
      "</article></div>";

    // fix nested card from tableWrap if needed - simpler reinject pull table
    body.querySelectorAll(".seo-card").forEach(function (btn) {
      btn.onclick = function () {
        openSeo(btn.getAttribute("data-domain"));
      };
    });
    var or = $("seoOpenResonant");
    if (or) {
      or.onclick = function () {
        openSeo("resonantwebdesign.com");
      };
    }
  }

  /* ── Site detail — FULL stacked report ─────────────────── */
  function renderSite(domain) {
    var body = $("seo-body");
    var p = findProp(domain);
    if (!body) return;
    if (!p) {
      body.innerHTML =
        '<div class="card"><p class="empty">No warehouse row for <strong>' +
        esc(domain) +
        "</strong>.</p>" +
        "<pre class=\"seo-cmd\">cd ~/Documents/SEO/NEXUS-SEO-OPERATING-SYSTEM/engine\n" +
        "python3 run_site.py " +
        esc(domain) +
        "\npython3 publish_seo_to_batcave.py</pre></div>";
      return;
    }
    var m = p.metrics || {};
    var score = m.onpage_score != null ? Math.round(m.onpage_score) : null;
    var reportUrl = p.report_url || "/B-ATCAVE/seo/reports/" + p.domain;

    body.innerHTML =
      '<div class="seo-site-head">' +
      '<button type="button" class="btn ghost" id="seoBack">← All sites</button>' +
      "<div><h3 class=\"seo-site-title\">" +
      statusDot(p.status) +
      " " +
      esc(p.domain) +
      '</h3><p class="empty">' +
      esc(p.label || "") +
      "</p></div>" +
      '<div class="btn-row">' +
      '<a class="btn" href="' +
      esc(reportUrl) +
      '" target="_blank" rel="noopener">Full HTML report ↗</a>' +
      '<button type="button" class="btn ghost" id="seoCopyRun">Copy run command</button>' +
      '<a class="btn ghost" href="https://' +
      esc(p.domain) +
      '/" target="_blank" rel="noopener">Live site ↗</a>' +
      "</div></div>" +
      '<div class="kpis" style="grid-template-columns:repeat(auto-fit,minmax(100px,1fr))">' +
      tile("Keywords", num(m.tracked_keywords || (p.keywords || []).length)) +
      tile("Ranked", num(m.ranked_keywords)) +
      tile("Backlinks", num(m.backlinks || (p.backlinks || []).length)) +
      tile("Ref domains", num(m.referring_domains)) +
      tile("On-page", score != null ? score + "/100" : "—") +
      tile("Pages", num((p.pages || []).length)) +
      tile("Targets", num((p.keyword_targets || []).length)) +
      tile("Gaps", num((p.gap_keywords || []).length)) +
      tile("Competitors", num((p.competitors || []).length)) +
      "</div>" +
      (m.homepage_issues
        ? '<p class="note"><strong>Homepage flags:</strong> ' + esc(m.homepage_issues) + "</p>"
        : "") +
      '<div class="seo-tabs" id="seo-tabs">' +
      tabBtn("all", "Full report") +
      tabBtn("keywords", "Keywords") +
      tabBtn("targets", "Page map") +
      tabBtn("gaps", "Content gap") +
      tabBtn("competitors", "Competitors") +
      tabBtn("technical", "Technical") +
      tabBtn("backlinks", "Backlinks") +
      tabBtn("queues", "Queues") +
      tabBtn("run", "Run / Claude") +
      "</div>" +
      '<div id="seo-pane"></div>';

    $("seoBack").onclick = function () {
      openSeo(null);
    };
    $("seoCopyRun").onclick = function () {
      copyText(p.run_command || "python3 run_site.py " + p.domain);
    };
    $("seo-tabs").querySelectorAll("[data-tab]").forEach(function (btn) {
      btn.onclick = function () {
        activeTab = btn.getAttribute("data-tab");
        paintTabs();
        paintPane(p);
      };
    });
    paintTabs();
    paintPane(p);
  }

  function tabBtn(id, label) {
    return (
      '<button type="button" class="seo-tab' +
      (activeTab === id ? " active" : "") +
      '" data-tab="' +
      id +
      '">' +
      esc(label) +
      "</button>"
    );
  }
  function paintTabs() {
    var wrap = $("seo-tabs");
    if (!wrap) return;
    wrap.querySelectorAll("[data-tab]").forEach(function (b) {
      b.classList.toggle("active", b.getAttribute("data-tab") === activeTab);
    });
  }

  function paneKeywords(p) {
    var rows = (p.keywords || [])
      .map(function (r) {
        return (
          '<tr><td class="seo-kw">' +
          esc(r.keyword) +
          '</td><td class="num">' +
          num(r.volume) +
          "</td><td>" +
          diffBar(r.difficulty) +
          '</td><td class="num">' +
          money(r.cpc) +
          "</td><td>" +
          esc(r.intent || "—") +
          "</td></tr>"
        );
      })
      .join("");
    return tableWrap(
      "<th>Keyword</th><th class=\"num\">Volume</th><th>Difficulty</th><th class=\"num\">CPC</th><th>Intent</th>",
      rows,
      "No keywords — run a dive."
    );
  }

  function paneTargets(p) {
    var rows = (p.keyword_targets || [])
      .map(function (r) {
        return (
          '<tr><td class="seo-kw">' +
          esc(r.keyword) +
          '</td><td class="num">' +
          num(r.volume) +
          "</td><td>" +
          diffBar(r.difficulty) +
          "</td><td>" +
          esc(r.brand || r.bucket || "—") +
          "</td><td>" +
          esc(r.intended_page || "—") +
          '</td><td class="num">' +
          num(r.score) +
          "</td><td>" +
          esc(r.decision || "—") +
          "</td><td>" +
          esc((r.reason || "").slice(0, 50)) +
          "</td></tr>"
        );
      })
      .join("");
    return tableWrap(
      "<th>Keyword</th><th class=\"num\">Vol</th><th>KD</th><th>Brand</th><th>Intended page</th><th class=\"num\">Score</th><th>Decision</th><th>Reason</th>",
      rows,
      "No page-map targets yet."
    );
  }

  function paneGaps(p) {
    var rows = (p.gap_keywords || [])
      .map(function (r) {
        return (
          "<tr><td>" +
          esc(r.competitor) +
          '</td><td class="seo-kw">' +
          esc(r.keyword) +
          '</td><td class="num">' +
          num(r.volume) +
          "</td><td>" +
          diffBar(r.difficulty) +
          '</td><td class="num">#' +
          num(r.position) +
          '</td><td class="seo-mono">' +
          esc((r.url || "").slice(0, 70)) +
          "</td></tr>"
        );
      })
      .join("");
    return tableWrap(
      "<th>Competitor</th><th>Keyword they rank</th><th class=\"num\">Vol</th><th>KD</th><th class=\"num\">Pos</th><th>URL</th>",
      rows,
      "No content-gap rows yet."
    );
  }

  function paneComps(p) {
    var rows = (p.competitors || [])
      .map(function (r) {
        return (
          '<tr><td class="seo-kw">' +
          esc(r.domain) +
          '</td><td class="num">#' +
          (r.best < 999 ? r.best : "—") +
          '</td><td class="num">' +
          num(r.appearances) +
          "</td><td>" +
          esc(((r.notes && r.notes[0]) || "").slice(0, 80)) +
          "</td></tr>"
        );
      })
      .join("");
    return tableWrap(
      "<th>Domain</th><th class=\"num\">Best pos</th><th class=\"num\">SERPs hit</th><th>Note</th>",
      rows,
      "No competitors captured."
    );
  }

  function paneTech(p) {
    var rows = (p.pages || [])
      .map(function (r) {
        return (
          '<tr><td class="seo-mono">' +
          esc(r.url) +
          '</td><td class="num">' +
          num(r.status_code) +
          "</td><td>" +
          esc((r.title || "").slice(0, 80)) +
          '</td><td class="seo-mono">' +
          esc(r.source || "") +
          "</td><td>" +
          esc(String(r.canonical || r.meta_description || "").slice(0, 50)) +
          "</td></tr>"
        );
      })
      .join("");
    return tableWrap(
      "<th>URL</th><th class=\"num\">Status</th><th>Title</th><th>Source / score</th><th>Flags</th>",
      rows,
      "No crawl yet."
    );
  }

  function paneLinks(p) {
    var rows = (p.backlinks || [])
      .map(function (r) {
        return (
          '<tr><td class="seo-mono">' +
          esc((r.source_url || "").slice(0, 60)) +
          '</td><td class="seo-mono">' +
          esc((r.target_url || "").slice(0, 45)) +
          "</td><td>" +
          esc((r.anchor || "").slice(0, 35)) +
          '</td><td class="num">' +
          num(r.domain_rank) +
          "</td><td>" +
          (r.dofollow ? "yes" : "no") +
          "</td></tr>"
        );
      })
      .join("");
    return tableWrap(
      "<th>From</th><th>To</th><th>Anchor</th><th class=\"num\">DR</th><th>Follow</th>",
      rows,
      "No backlinks in warehouse."
    );
  }

  function paneRanks(p) {
    var rows = (p.rankings || [])
      .map(function (r) {
        return (
          '<tr><td class="seo-kw">' +
          esc(r.keyword) +
          '</td><td class="num">#' +
          num(r.position) +
          '</td><td class="seo-mono">' +
          esc((r.url || "").slice(0, 55)) +
          "</td><td>" +
          shortDate(r.checked_at) +
          "</td></tr>"
        );
      })
      .join("");
    return tableWrap(
      "<th>Keyword</th><th class=\"num\">Position</th><th>URL</th><th>Checked</th>",
      rows,
      "No rank checks stored yet (baseline often 0 ranked)."
    );
  }

  function paneQueues(p) {
    var q = p.queues || [];
    if (!q.length) {
      return (
        '<div class="card"><p class="empty">No handoff files under SEO-MASTER-INTERFACE/' +
        esc(p.domain) +
        "/ yet.</p></div>"
      );
    }
    return (
      '<div class="card">' +
      q
        .map(function (f) {
          return (
            '<div class="site-row"><div class="site-row-name"><strong>' +
            esc(f.name) +
            '</strong><span class="site-row-sub">' +
            num(f.bytes) +
            " bytes · " +
            esc(f.preview || "") +
            "</span></div></div>"
          );
        })
        .join("") +
      "</div>"
    );
  }

  function paneRun(p) {
    var cmd =
      p.run_command ||
      "cd ~/Documents/SEO/NEXUS-SEO-OPERATING-SYSTEM/engine && python3 run_site.py " +
        p.domain;
    return (
      '<div class="card">' +
      "<p class=\"empty\">Claude Code runs dives into the warehouse. This panel monitors results. Publishing updates the snapshot.</p>" +
      '<pre class="seo-cmd" id="seoCmd">' +
      esc(cmd) +
      "\npython3 publish_seo_to_batcave.py</pre>" +
      '<div class="btn-row"><button type="button" class="btn" id="seoCopyCmd2">Copy commands</button>' +
      '<a class="btn ghost" href="' +
      esc(p.report_url || "/B-ATCAVE/seo/reports/" + p.domain) +
      '" target="_blank" rel="noopener">Open full report</a></div>' +
      '<ol class="seo-ol" style="margin-top:1rem">' +
      "<li>Claude: run the command above (optional seed keywords).</li>" +
      "<li>Publish: <code>python3 publish_seo_to_batcave.py</code></li>" +
      "<li>Refresh this panel (↻ or reload).</li>" +
      "<li>Grok applies wording queues — design of public sites stays locked.</li>" +
      "</ol></div>"
    );
  }

  function paneOverview(p) {
    var m = p.metrics || {};
    var hist = (p.metric_history || []).slice(0, 15);
    return (
      '<div class="row row-2">' +
      '<article class="card"><div class="card-h"><h3>Snapshot</h3></div>' +
      '<div class="site-row"><div class="site-row-name">Status</div><div class="site-row-val">' +
      esc(p.status) +
      "</div></div>" +
      '<div class="site-row"><div class="site-row-name">Last dive</div><div class="site-row-val">' +
      shortDate(m.last_dive) +
      "</div></div>" +
      '<div class="site-row"><div class="site-row-name">Role</div><div class="site-row-val">' +
      esc(p.role) +
      "</div></div>" +
      '<div class="site-row"><div class="site-row-name">Warehouse id</div><div class="site-row-val">' +
      num(p.id) +
      "</div></div>" +
      '<div class="site-row"><div class="site-row-name">Full report</div><div class="site-row-val"><a href="' +
      esc(p.report_url || "/B-ATCAVE/seo/reports/" + p.domain) +
      '" target="_blank" rel="noopener">Open HTML ↗</a></div></div>' +
      "</article>" +
      '<article class="card"><div class="card-h"><h3>Metric history</h3></div>' +
      (hist.length
        ? hist
            .map(function (h) {
              return (
                '<div class="site-row"><div class="site-row-name">' +
                esc(h.key) +
                '<span class="site-row-sub">' +
                shortDate(h.captured_at) +
                " · " +
                esc(h.source) +
                '</span></div><div class="site-row-val">' +
                esc(h.value_num != null ? h.value_num : h.value_text || "—") +
                "</div></div>"
              );
            })
            .join("")
        : '<p class="empty">No metric history yet.</p>') +
      "</article></div>"
    );
  }

  function paneAll(p) {
    // Stack every major function so the page is never "empty"
    return (
      section("1. Overview", paneOverview(p), "sec-overview") +
      section(
        "2. Keyword Battlefield (" + (p.keywords || []).length + ")",
        paneKeywords(p),
        "sec-kw"
      ) +
      section(
        "3. Keyword → page map (" + (p.keyword_targets || []).length + ")",
        paneTargets(p),
        "sec-map"
      ) +
      section(
        "4. Competitor content gap (" + (p.gap_keywords || []).length + ")",
        paneGaps(p),
        "sec-gap"
      ) +
      section(
        "5. Competitor intel (" + (p.competitors || []).length + ")",
        paneComps(p),
        "sec-comp"
      ) +
      section(
        "6. Technical crawl (" + (p.pages || []).length + ")",
        paneTech(p),
        "sec-tech"
      ) +
      section("7. Rankings", paneRanks(p), "sec-rank") +
      section(
        "8. Backlinks (" + (p.backlinks || []).length + ")",
        paneLinks(p),
        "sec-bl"
      ) +
      section("9. Claude / Grok queues", paneQueues(p), "sec-q") +
      section("10. Run analysis", paneRun(p), "sec-run")
    );
  }

  function paintPane(p) {
    var pane = $("seo-pane");
    if (!pane) return;
    var t = activeTab || "all";
    if (t === "all") pane.innerHTML = paneAll(p);
    else if (t === "keywords") pane.innerHTML = paneKeywords(p);
    else if (t === "targets") pane.innerHTML = paneTargets(p);
    else if (t === "gaps") pane.innerHTML = paneGaps(p);
    else if (t === "competitors") pane.innerHTML = paneComps(p);
    else if (t === "technical") pane.innerHTML = paneTech(p);
    else if (t === "backlinks") pane.innerHTML = paneLinks(p);
    else if (t === "queues") pane.innerHTML = paneQueues(p);
    else if (t === "run") pane.innerHTML = paneRun(p);
    else pane.innerHTML = paneAll(p);

    var b = $("seoCopyCmd2");
    if (b) {
      b.onclick = function () {
        copyText(
          (p.run_command || "python3 run_site.py " + p.domain) +
            "\npython3 publish_seo_to_batcave.py"
        );
      };
    }
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(
        function () {
          toast("Copied");
        },
        function () {
          fallbackCopy(text);
        }
      );
    } else fallbackCopy(text);
  }
  function fallbackCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
      toast("Copied");
    } catch (e) {
      toast("Select command manually");
    }
    document.body.removeChild(ta);
  }
  function toast(msg) {
    var n = document.createElement("div");
    n.className = "seo-toast";
    n.textContent = msg;
    document.body.appendChild(n);
    setTimeout(function () {
      n.remove();
    }, 1600);
  }

  function renderShell() {
    var root = $("seo-root");
    if (!root) return;
    if (!cache) {
      root.innerHTML = '<p class="empty">Loading SEO portfolio…</p>';
      return;
    }
    var spend = cache.spend || {};
    var sum = cache.summary || {};
    var engine = localOnline ? "Local engine ONLINE :8787" : "Embedded snapshot";

    root.innerHTML =
      '<div class="seo-toolbar">' +
      '<div class="seo-spend">DataForSEO spend <strong>$' +
      Number(spend.total || 0).toFixed(3) +
      "</strong> / $" +
      (spend.cap || 50) +
      " · " +
      num(spend.calls) +
      " calls</div>" +
      '<div class="seo-meta">' +
      esc(sum.scanned || 0) +
      "/" +
      esc(sum.properties || 0) +
      " scanned · " +
      esc(engine) +
      " · " +
      shortDate(cache.generated_at) +
      "</div>" +
      '<div class="btn-row">' +
      '<button type="button" class="btn" id="seoRefresh">↻ Refresh</button>' +
      '<a class="btn ghost" href="/B-ATCAVE/seo/reports/" target="_blank" rel="noopener">All reports</a>' +
      '<a class="btn ghost" href="/B-ATCAVE/seo/wire-map" target="_blank" rel="noopener">Wire map</a>' +
      "</div></div>" +
      '<div id="seo-body"></div>';

    $("seoRefresh").onclick = function () {
      openSeo(activeDomain, true);
    };
    if (activeDomain) renderSite(activeDomain);
    else renderPortfolio();
  }

  async function openSeo(domain, forceReload) {
    activeDomain = domain || null;
    if (!domain) activeTab = "all";
    else if (!activeTab) activeTab = "all";

    showViewSafe("seo-analysis");
    setTitle(activeDomain);
    highlightNav();

    var root = $("seo-root");
    if (root && (!cache || forceReload)) {
      root.innerHTML = '<p class="empty">Loading SEO warehouse…</p>';
    }
    try {
      await loadSnapshot(!!forceReload);
      await loadJobs();
      await probeLocal();
      renderShell();
    } catch (e) {
      if (root) {
        root.innerHTML =
          '<div class="card"><p class="empty"><strong>Could not load SEO data.</strong> ' +
          esc(e.message || e) +
          "</p>" +
          "<p class=\"empty\">Ensure <code>seo-data.js</code> and <code>data/seo-portfolio.json</code> are deployed. " +
          "Local: <code>python3 publish_seo_to_batcave.py</code></p>" +
          '<p class="empty"><a class="btn" href="/B-ATCAVE/seo/reports/">Open reports folder ↗</a></p></div>';
      }
    }
  }

  global.BatcaveSEO = {
    open: openSeo,
    load: loadSnapshot,
    getCache: function () {
      return cache;
    },
  };

  function fromHash() {
    var h = (location.hash || "").replace(/^#/, "");
    if (h === "seo" || h === "seo-analysis") {
      openSeo(null);
      return true;
    }
    if (h.indexOf("seo/") === 0) {
      openSeo(decodeURIComponent(h.slice(4)));
      return true;
    }
    return false;
  }

  function boot() {
    // Preload embedded data immediately so first click is instant
    if (global.SEO_PORTFOLIO && global.SEO_PORTFOLIO.properties) {
      cache = global.SEO_PORTFOLIO;
    }
    fromHash();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})(window);
