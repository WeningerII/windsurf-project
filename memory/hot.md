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
- 1b ✅ COMPLETE + barrier-gated (typecheck app+test clean; 572 tests/41 files
  green single-worker): item 6 M&M creator inc2 `d606754`; item 5 d20-family
  (3.5e+PF1e derived quantities, generic `presentDerivedQuantities` render)
  `808f8f8` (added anchor `pf1e.L4.max-rank-cap`; Tier-A = 200 verified entries);
  item 9 telemetry scaffold `5c856fb` (opt-in/no-PII; I fixed CLS rounding →
  cumulative + fractional precision); item 7 RFC006 3.5e Encounter-Level budgets
  `edcc88e` (consensus ACCEPT — derived CR→value scale pinned to SRD +2-doubling,
  additive, drafter↔validator consistent; RFC prose updated four→five systems).

- 1c ✅ COMPLETE (all consensus ACCEPT): item 8 AI-gateway hardening `7a3fc31`
  (factory+mock+rate-limit+structured-logs, SDK-free via DI, over-budget→429
  reused, all-optional ctx = additive; 92 AI tests); item 11 RFC004 bestiary
  route `ea3d59a` + nav-test fixup `2a86120` (closed-union segment, agnostic
  data-driven selector, read-only loader, empty states); item 10 content
  coverage `fa29ae2` (3.5e/PF1e denominator collapse + M&M equipment target +
  provenance norm, offline-unit-tested; NETWORK REGEN of srd-coverage.md +
  encoding missing individuals still DEFERRED).

**WAVE-1 BARRIER — all gates green** (staged, OOM-safe): regen commits
`569e32b` (gap-ledger+graph) `b59df87` (roadmap-metrics) `b083137` (prettier);
typecheck app+test+netlify ✓; lint ✓; format ✓; **full suite 2368 tests / 233
files ✓** (cov 86% stmts); compute-register Tier-A **200** ✓; doc-drift ✓
repo-hygiene ✓ legal-notices ✓ generated-docs ✓ validate ✓; build ✓
bundle-size ✓ dead-code/knip ✓. **e2e chromium 34 passed ✓** (via
scratchpad/pw-bridge, 2.4m). **WAVE 1 COMPLETE + FULLY GATED (green).**

**WAVE 2 IN FLIGHT.** Sub-wave 2a-i ✅: **item 12 (AC/defense resolver fold)**
landed `d286b2d` — retired src/utils/armorClass.ts → src/rules/compile/defense.ts
(base AC as resolver `set` on target 'ac'; d20 touch/flatFooted = relocated
helper; D20_SIZE_MOD preserved for attacks). 9-importer atomic migration,
consensus ACCEPT (3 skeptics). Orchestrator re-pinned all 8 AC anchors to
defense.ts + fixed 2 stale comments. Mini-barrier GREEN: tsc app+test, 694
AC/engine/resolver tests, compute-register Tier-A 200 (full --mutate deferred to
2a barrier). Sub-wave 2a-ii RUNNING: items 13 (conditions-IR mam3e+daggerheart),
14 (pf2e multiclass dedication), 15 (RFC005 consume verb + leveling) — mutually
disjoint, launched against item 12's base. After 2a-ii: 2a barrier (incl.
compute-register --mutate to flip all 8 AC anchors) → sub-wave 2b (16,17,21).

**PRIOR NEXT (now superseded):** Wave 2 (7 items, sub-waves 2a/2b) — headliner item 12 P2 spine-α: fold
base AC/defense into the resolver + retire src/utils/armorClass.ts, migrating a
NINE-importer closure (5 src + 4 test) ATOMICALLY, preserving every describe+it
title verbatim, MANDATORY re-pin of all 8 pre-existing armorClass.ts anchors
applied+committed at the 2a barrier before any --mutate. Also 13 (conditions-IR
mam3e+daggerheart), 14 (pf2e multiclass dedication), 15 (RFC005 consume verb),
16 (CI a11y+secrets-guard), 17 (feature-flags), 21 (L2 AC register migration).
Then Wave 3 (18,19,20,22). See consensus doc for domains + constraints. Blocked
items (human sign-off / secrets / infra / OGC source) excluded from "complete".

**Landmine (pw-bridge intact this session):** scratchpad/pw-bridge has
chromium-1208 + chromium_headless_shell-1208 symlinked → 1194 binaries; run e2e
with PLAYWRIGHT_BROWSERS_PATH=<bridge> --project=chromium (firefox NOT bridged).
webServer does its own build+preview on :4173.

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
