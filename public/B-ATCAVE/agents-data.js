/* Embedded fallback for the Agents cockpit — used only if data/agents.json fails to load.
   The live copy is data/agents.json (written by publish_agents_to_batcave.py). Keep this thin. */
window.AGENTS_FLEET = {
  generated_at: "2026-08-02T00:00:00+00:00",
  version: 1,
  title: "Nexus Agent Fleet",
  is_seed: true,
  source_note: "Embedded fallback — data/agents.json did not load.",
  tokens: { today: 0, cap: 2000000, spend_usd_today: 0, spend_mtd: 0 },
  summary: { active: 5, running: 0, idle: 4, error: 0, scheduled: 1, queued: 2, runs_24h: 0, success_rate: 1.0 },
  agents: [
    { id: "claude-code", name: "Claude Code", role: "Primary operator · builds & runs all agents", model: "claude-opus-4-8", status: "running", current_task: "Standing by", last_run: null, next_run: null, runs_24h: 0, tokens_24h: 0, runtime_avg_s: 0, success_rate: 1.0, host: "macbook15", schedule: "on demand" },
    { id: "reeve", name: "Reeve", role: "Morning sync · aggregates Claude sessions", model: "claude-opus-4-8", status: "scheduled", current_task: null, last_run: null, next_run: null, runs_24h: 1, tokens_24h: 0, runtime_avg_s: 0, success_rate: 1.0, host: "macbook15", schedule: "08:00 daily" },
    { id: "seo-diver", name: "SEO Diver", role: "Weekly crawl · keywords · backlinks · gap", model: "claude-opus-4-8", status: "idle", current_task: null, last_run: null, next_run: null, runs_24h: 0, tokens_24h: 0, runtime_avg_s: 0, success_rate: 1.0, host: "macbook15", schedule: "weekly · per site" }
  ],
  runs: [],
  stream: [],
  queue: []
};
