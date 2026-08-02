/* NEXUS · Agents cockpit — Hermes-style fleet view, native to the B-ATCAVE design system.
   Reads data/agents.json (live) with window.AGENTS_FLEET as embedded fallback.
   Public API: window.BatcaveAgents.open()  ·  self-boots from #agents hash. */
(function (global) {
  "use strict";

  var DATA_URL = "/B-ATCAVE/data/agents.json";
  var REFRESH_MS = 15000;
  var cache = null;
  var timer = null;

  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

  function fmt(n) {
    if (n == null || n === "") return "—";
    var x = Number(n);
    if (isNaN(x)) return esc(n);
    if (x >= 1000000) return (x / 1000000).toFixed(x >= 10000000 ? 0 : 1) + "M";
    if (x >= 1000) return (x / 1000).toFixed(x >= 10000 ? 0 : 1) + "k";
    return String(x);
  }
  function usd(n) { var x = Number(n || 0); return "$" + (x < 10 ? x.toFixed(2) : x.toFixed(0)); }
  function ago(ts) {
    if (!ts) return "—";
    var t = Date.parse(String(ts).replace(" ", "T"));
    if (isNaN(t)) return esc(ts);
    var s = Math.round((Date.now() - t) / 1000);
    if (s < 0) return "in " + rel(-s);
    return rel(s) + " ago";
  }
  function rel(s) {
    if (s < 60) return s + "s";
    if (s < 3600) return Math.round(s / 60) + "m";
    if (s < 86400) return Math.round(s / 3600) + "h";
    return Math.round(s / 86400) + "d";
  }

  var STATUS = {
    running:   { dot: "green",  label: "RUNNING",   cls: "ag-running" },
    scheduled: { dot: "yellow", label: "SCHEDULED", cls: "" },
    idle:      { dot: "grey",   label: "IDLE",      cls: "" },
    error:     { dot: "red",    label: "ERROR",     cls: "ag-error" },
    blocked:   { dot: "red",    label: "BLOCKED",   cls: "ag-error" }
  };

  /* One-time scoped styles so index.html stays untouched beyond nav + section + script tags. */
  function injectStyles() {
    if ($("agents-style")) return;
    var css =
      ".ag-wrap{min-height:320px}" +
      ".ag-toolbar{display:flex;flex-wrap:wrap;gap:.65rem;align-items:center;margin-bottom:1rem}" +
      ".ag-meta{font-size:.8rem;color:var(--muted);background:#fff;border:1px solid var(--line);border-radius:12px;padding:.55rem .85rem;box-shadow:var(--shadow)}" +
      ".ag-seed{background:#fff7ed;border:1px solid #fed7aa;color:#b45309;font-weight:650}" +
      ".ag-kpis{display:grid;grid-template-columns:repeat(6,1fr);gap:.85rem;margin-bottom:1rem}" +
      "@media(max-width:1100px){.ag-kpis{grid-template-columns:repeat(3,1fr)}}" +
      "@media(max-width:640px){.ag-kpis{grid-template-columns:repeat(2,1fr)}}" +
      ".ag-fleet{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:.75rem;margin-bottom:1rem}" +
      ".ag-card{text-align:left;border:1px solid var(--line);border-radius:16px;padding:.95rem 1rem;background:#fff;box-shadow:var(--shadow);transition:border-color .15s,box-shadow .15s}" +
      ".ag-card.ag-running{border-color:#a7f3d0;box-shadow:0 0 0 2px rgba(16,185,129,.14),var(--shadow)}" +
      ".ag-card.ag-error{border-color:#fecaca;box-shadow:0 0 0 2px rgba(239,68,68,.14),var(--shadow)}" +
      ".ag-card-top{display:flex;align-items:center;gap:.5rem;margin-bottom:.35rem}" +
      ".ag-name{font-size:.95rem;font-weight:750}" +
      ".ag-badge{margin-left:auto;font-size:.6rem;font-weight:800;letter-spacing:.05em;padding:3px 8px;border-radius:999px;background:#f4f1fb;color:var(--muted);white-space:nowrap}" +
      ".ag-badge.green{background:#d1fae5;color:#047857}.ag-badge.yellow{background:#fef3c7;color:#b45309}.ag-badge.red{background:#fee2e2;color:#b91c1c}" +
      ".ag-role{font-size:.76rem;color:var(--muted);min-height:2.1em;margin-bottom:.6rem;line-height:1.35}" +
      ".ag-task{font-size:.78rem;background:#f7f5fc;border-radius:10px;padding:.5rem .6rem;margin-bottom:.6rem;color:var(--text)}" +
      ".ag-task .lbl{color:var(--muted);font-weight:700;font-size:.62rem;text-transform:uppercase;letter-spacing:.05em;display:block;margin-bottom:2px}" +
      ".ag-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:.35rem;font-size:.72rem}" +
      ".ag-stats b{display:block;font-size:.92rem;color:var(--text)}" +
      ".ag-stats span{color:var(--muted);text-transform:uppercase;letter-spacing:.03em;font-size:.58rem;font-weight:700}" +
      ".ag-foot{margin-top:.6rem;font-size:.68rem;color:var(--muted);display:flex;justify-content:space-between;gap:.5rem}" +
      ".ag-meter{height:8px;border-radius:6px;background:#ece8f5;overflow:hidden;margin:.5rem 0 .25rem}" +
      ".ag-meter-fill{height:100%;border-radius:6px;background:linear-gradient(90deg,#7c3aed,#a78bfa)}" +
      ".ag-meter-fill.hot{background:linear-gradient(90deg,#ea580c,#f59e0b)}" +
      ".ag-pulse{width:9px;height:9px;border-radius:50%;background:#10b981;box-shadow:0 0 0 0 rgba(16,185,129,.5);animation:agPulse 1.5s infinite}" +
      "@keyframes agPulse{0%{box-shadow:0 0 0 0 rgba(16,185,129,.45)}70%{box-shadow:0 0 0 7px rgba(16,185,129,0)}100%{box-shadow:0 0 0 0 rgba(16,185,129,0)}}" +
      ".ag-q{display:flex;justify-content:space-between;gap:.6rem;padding:.55rem 0;border-bottom:1px solid var(--line);font-size:.84rem}" +
      ".ag-q:last-child{border-bottom:0}" +
      ".ag-q .pri{font-size:.6rem;font-weight:800;padding:2px 7px;border-radius:6px;background:var(--purple-soft);color:var(--purple);text-transform:uppercase}" +
      ".ag-q .pri.high{background:#fee2e2;color:#b91c1c}";
    var st = document.createElement("style");
    st.id = "agents-style";
    st.textContent = css;
    document.head.appendChild(st);
  }

  function kpi(label, value, hint) {
    return '<div class="kpi"><div class="label">' + esc(label) + '</div><div class="value">' +
      value + '</div><div class="hint">' + esc(hint || "") + "</div></div>";
  }

  function agentCard(a) {
    var st = STATUS[a.status] || STATUS.idle;
    var pulse = a.status === "running" ? '<span class="ag-pulse"></span>' : '<span class="seo-dot ' + st.dot + '"></span>';
    var task = a.current_task
      ? '<div class="ag-task"><span class="lbl">Now</span>' + esc(a.current_task) + "</div>"
      : '<div class="ag-task"><span class="lbl">Next</span>' + (a.next_run ? esc(ago(a.next_run)) : esc(a.schedule || "—")) + "</div>";
    return '<div class="ag-card ' + st.cls + '">' +
      '<div class="ag-card-top">' + pulse +
      '<span class="ag-name">' + esc(a.name) + '</span>' +
      '<span class="ag-badge ' + st.dot + '">' + esc(st.label) + "</span></div>" +
      '<div class="ag-role">' + esc(a.role) + "</div>" +
      task +
      '<div class="ag-stats">' +
      "<div><b>" + fmt(a.runs_24h) + "</b><span>runs 24h</span></div>" +
      "<div><b>" + fmt(a.tokens_24h) + "</b><span>tokens 24h</span></div>" +
      "<div><b>" + (a.success_rate != null ? Math.round(a.success_rate * 100) + "%" : "—") + "</b><span>success</span></div>" +
      "</div>" +
      '<div class="ag-foot"><span>' + esc(a.model || "—") + " · " + esc(a.host || "") + "</span>" +
      "<span>last " + esc(ago(a.last_run)) + "</span></div>" +
      "</div>";
  }

  function runRow(r) {
    var dot = r.status === "ok" ? "#16a34a" : r.status === "running" ? "#7c3aed" : "#ef4444";
    return "<tr>" +
      '<td><span class="seo-dot" style="background:' + dot + '"></span></td>' +
      "<td>" + esc(r.task) + '<div class="seo-mono" style="color:var(--muted)">' + esc(r.agent) + "</div></td>" +
      '<td class="num">' + (r.duration_s ? rel(r.duration_s) : "—") + "</td>" +
      '<td class="num">' + fmt(r.tokens) + "</td>" +
      '<td class="num">' + (r.cost_usd ? usd(r.cost_usd) : "—") + "</td>" +
      '<td class="num" style="color:var(--muted)">' + esc(ago(r.ts)) + "</td>" +
      "</tr>";
  }

  function streamRow(s) {
    var sev = s.severity || "info";
    var color = sev === "critical" ? "#ef4444" : sev === "high" ? "#f59e0b" : "#3b82f6";
    return '<div class="activity-item"><div class="dot" style="background:' + color + '"></div><div><strong>' +
      esc(s.event) + '</strong><div class="when"><span class="site-tag">' + esc(s.agent) + "</span> " +
      esc(ago(s.ts)) + "</div></div></div>";
  }

  function render(d) {
    injectStyles();
    var root = $("agents-root");
    if (!root) return;
    var sum = d.summary || {};
    var tok = d.tokens || {};
    var agents = d.agents || [];
    var runs = d.runs || [];
    var stream = d.stream || [];
    var queue = d.queue || [];

    var running = agents.filter(function (a) { return a.status === "running"; }).length;
    var capPct = tok.cap ? Math.min(100, Math.round((Number(tok.today) / Number(tok.cap)) * 100)) : 0;

    var seedBanner = d.is_seed
      ? '<div class="ag-meta ag-seed">SEED DATA · layout is live, feed is not wired yet. Run <code>publish_agents_to_batcave.py</code> to fill this from the coordination ledger.</div>'
      : "";

    var html =
      '<div class="ag-wrap">' +
      '<div class="ag-toolbar">' +
        seedBanner +
        '<div class="ag-meta">Fleet as of <strong>' + esc(ago(d.generated_at)) + "</strong></div>" +
        '<div class="ag-meta">Token spend today <strong>' + usd(tok.spend_usd_today) + "</strong> · MTD " + usd(tok.spend_mtd) + "</div>" +
      "</div>" +

      '<div class="ag-kpis">' +
        kpi("Agents", '<span style="color:var(--purple)">' + fmt(sum.active) + "</span>", "In the fleet") +
        kpi("Running now", (running || sum.running || 0) > 0 ? '<span style="color:#16a34a">' + fmt(running || sum.running) + "</span>" : "0", "Live this moment") +
        kpi("Queued", fmt(sum.queued), "Waiting to run") +
        kpi("Runs · 24h", fmt(sum.runs_24h), "Completed today") +
        kpi("Tokens · today", fmt(tok.today), "of " + fmt(tok.cap) + " cap") +
        kpi("Success", (sum.success_rate != null ? Math.round(sum.success_rate * 100) + "%" : "—"), "Last 24h") +
      "</div>" +

      '<article class="card" style="margin-bottom:1rem">' +
        '<div class="card-h"><h3>Token budget · today</h3><span class="site-tag">' + capPct + "%</span></div>" +
        '<div class="ag-meter"><div class="ag-meter-fill ' + (capPct >= 80 ? "hot" : "") + '" style="width:' + capPct + '%"></div></div>' +
        '<div class="ag-foot"><span>' + fmt(tok.today) + " tokens</span><span>cap " + fmt(tok.cap) + "</span></div>" +
      "</article>" +

      '<div class="card-h"><h3>Agent fleet</h3><span class="site-tag">' + agents.length + "</span></div>" +
      '<div class="ag-fleet">' + (agents.length ? agents.map(agentCard).join("") : '<p class="empty">No agents registered.</p>') + "</div>" +

      '<div class="row row-2">' +
        '<article class="card">' +
          '<div class="card-h"><h3>Live activity stream</h3></div>' +
          "<div>" + (stream.length ? stream.map(streamRow).join("") : '<p class="empty">No agent events yet.</p>') + "</div>" +
        "</article>" +
        '<article class="card">' +
          '<div class="card-h"><h3>Queue</h3><span class="site-tag">' + queue.length + "</span></div>" +
          "<div>" + (queue.length ? queue.map(function (q) {
            return '<div class="ag-q"><div><strong>' + esc(q.task) + '</strong><div class="when"><span class="site-tag">' +
              esc(q.agent) + "</span> " + esc(q.eta || "") + '</div></div><span class="pri ' +
              (q.priority === "high" ? "high" : "") + '">' + esc(q.priority || "normal") + "</span></div>";
          }).join("") : '<p class="empty">Queue is clear.</p>') + "</div>" +
        "</article>" +
      "</div>" +

      '<article class="card">' +
        '<div class="card-h"><h3>Recent runs</h3></div>' +
        '<div class="seo-tablewrap"><table class="seo-table"><thead><tr>' +
        '<th></th><th>Task / agent</th><th class="num">Runtime</th><th class="num">Tokens</th><th class="num">Cost</th><th class="num">When</th>' +
        "</tr></thead><tbody>" +
        (runs.length ? runs.map(runRow).join("") : '<tr><td colspan="6" class="empty">No runs recorded yet.</td></tr>') +
        "</tbody></table></div>" +
      "</article>" +
      "</div>";

    root.innerHTML = html;
  }

  async function loadData(force) {
    if (cache && !force) return cache;
    try {
      var r = await fetch(DATA_URL + "?_=" + Date.now(), { cache: "no-store" });
      if (!r.ok) throw new Error("agents.json " + r.status);
      cache = await r.json();
    } catch (e) {
      cache = global.AGENTS_FLEET || null;
      if (!cache) throw e;
    }
    return cache;
  }

  function showViewSafe(name) {
    document.querySelectorAll(".panel").forEach(function (p) { p.classList.remove("active"); });
    var el = $("view-" + name);
    if (el) el.classList.add("active");
  }
  function setTitle() {
    var t = $("pageTitle"), s = $("pageSub");
    if (t) t.textContent = "Agents";
    if (s) s.textContent = "NEXUS · agent fleet · live operations cockpit";
  }
  function highlightNav() {
    document.querySelectorAll(".nav > a, .nav-item").forEach(function (a) {
      a.classList.toggle("active", a.getAttribute && a.getAttribute("data-view") === "agents");
    });
  }

  async function openAgents(force) {
    showViewSafe("agents");
    setTitle();
    highlightNav();
    var root = $("agents-root");
    if (root && !cache) root.innerHTML = '<p class="empty">Loading agent fleet…</p>';
    try {
      var d = await loadData(force);
      render(d);
    } catch (e) {
      if (root) root.innerHTML = '<div class="card"><p class="empty"><strong>Could not load agent fleet.</strong> ' +
        esc(e.message || e) + " Ensure <code>data/agents.json</code> is deployed.</p></div>";
    }
    if (timer) clearInterval(timer);
    timer = setInterval(function () {
      if ($("view-agents") && $("view-agents").classList.contains("active")) {
        loadData(true).then(render).catch(function () {});
      }
    }, REFRESH_MS);
  }

  global.BatcaveAgents = { open: openAgents, getCache: function () { return cache; } };

  function fromHash() {
    var h = (location.hash || "").replace(/^#/, "");
    if (h === "agents") { openAgents(); return true; }
    return false;
  }
  function boot() {
    if (global.AGENTS_FLEET) cache = cache || null; // fallback stays available; live fetch preferred
    fromHash();
    window.addEventListener("hashchange", fromHash);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window);
