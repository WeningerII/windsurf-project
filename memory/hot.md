# Hot cache

> Rolling working memory. Rewritten at the end of each substantial session via
> `/save` — overwrite stale content, keep it under ~500 words. Durable facts go
> to [[CLAUDE]] (CLAUDE.md) or `docs/`, not here.

**Last updated:** 2026-07-20 — **Executing the 22-item wave plan on
`claude/next-priorities-98pzof`.** Authoritative plan + binding execution rules:
[[sessions/2026-07-20-wave-plan-consensus]] (reached via 5-round adversarial
consensus). Model: each item = own background Workflow (implement→adversarial-
verify); orchestrator does per-completion path-scoped commit+push, then staged
OOM-safe barrier gates (never monolithic `verify`; use
`test:coverage -- --run --maxWorkers=1`). Agents never edit orchestrator-owned
files (mutation-anchors.ts, compute-register/index.ts, docs/generated/**,
package.json, App.tsx, main.tsx, memory/**).

**Theme:** declarative derivation layer (`src/rules/derivation/**`, READ-ONLY
for agents) + scaling shapes (`src/utils/scaling.ts`); one numeric
`DerivedQuantitySpec` per scalar; compute-register (Denominator B) pins
engine-math with mutation anchors. **ALL 7 SYSTEMS ARE PEERS — never frame work
as "5e vs non-5e" (hard, repeated user constraint).**

**Wave 1 progress (sub-waves 1a done, 1b in flight, 1c queued):**
- 1a ✅ pf2e `f6606ef`, mam3e `f3b507f`, daggerheart `592a134`, 5e-family
  `4a5864f`, housekeeping `2dc4d2c` — declarative derived quantities, gated.
- 1b: item 6 M&M creator inc2 ✅ `d606754`; item 5 d20-family (3.5e+PF1e derived
  quantities, generic `presentDerivedQuantities` render) ✅ `808f8f8` (added
  anchor `pf1e.L4.max-rank-cap`; Tier-A = 200 verified entries, all resolve).
  Item 9 telemetry scaffold ⏳ running (task `wyhu79olz`; domain src/telemetry/**,
  performanceMonitoring.ts, main.tsx). Item 7 RFC006 3.5e Encounter-Level
  budgets ⏳ running (task `w07imq9bh`; domain src/scene/**, components/scene/**,
  __tests__/scene/**, rfc/006). No more 1b items to launch.

**NEXT:** (1) await items 7+9 → per-completion commit+push each; (2) 1b barrier
gate (tree reconcile → typecheck → targeted vitest on changed domains,
single-worker); (3) sub-wave 1c: item 8 AI-gateway hardening, item 10 content
coverage, item 11 RFC004 bestiary route → closes wave 1 (`graphify update` +
full wave-1 barrier). Then Wave 2 (7 items incl. item 12 AC/defense resolver
fold with atomic anchor re-pin) + Wave 3 (4 items). Blocked items (human
sign-off / secrets / infra / OGC source) excluded from "complete".

## Landmines

- **Container recycles mid-session** silently kill background workflows AND wipe
  scratchpad + saved workflow scripts. Workflow subagent Edits DO persist to the
  tree, so commit+push per slice; don't trust a long idle wait. (This session: a
  prior WF survived and a duplicate WF I launched both wrote the same mam creator
  files — the survivor's agent handled it via backward-compat; watch for dupes.)
- **Playwright browser bridge:** /opt/pw-browsers has rev **1194**, toolchain
  wants **1208**. Working bridge at `scratchpad/pw-bridge` symlinks
  chromium-1208/chrome-linux/chrome + chromium_headless_shell-1208/
  chrome-headless-shell-linux64/chrome-headless-shell → 1194 binaries (ffmpeg-1011
  matches). Run e2e with `PLAYWRIGHT_BROWSERS_PATH=<bridge> --project=chromium`.
  NEVER `playwright install`.
- **Merge policy:** auto-mode classifier blocks merge-to-main (and force-push)
  unless the USER gave explicit, specific consent. Generic "proceed" ≠ consent.
- **Never amend GitHub PR-merge commits** (committer noreply@github.com, on main).
  My git identity (Claude / noreply@anthropic.com) is correct.
- **doc-drift** pins verbatim phrases (e.g. Daggerheart STATUS.md capability
  phrase) — preserve exact strings when editing paired docs.
- `outcome/baseline.json` gates TIME only (20s ceiling, ~30× headroom), not
  steps; `steps` is descriptive. last-run.json is gitignored.
