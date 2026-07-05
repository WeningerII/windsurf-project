# 2026-07-05 — System-agnosticism sweep (audit → relocations → profiles → gate)

**Branch:** `claude/claude-obsidian-graphify-research-d8ufwc` (three commits:
relocation `07272e2`, profile refactor `1887f2b`, boundary gate — this one).

## Audit verdict (five passes)

The universality *mechanism* was sound (all 7 systems register uniform engines
via definitions; dnd5e-2024 extends the 2014 base). The violations were file
*placement* and inline *branching*, concentrated in `utils/` and
`characterCombatant.ts`. `dataLoader`/`docDrift`/rules-conditions modules are
system-aware **by design** — documented as exemptions, not fixed.

## What changed

1. **21 files relocated** out of shared layers (templates → their systems;
   Mam browsers + FeatureOptionBrowser → their systems' components;
   `pf2eDegree`, `daggerheartDerived`, `daggerheartInventory` → rules layer
   because rules consume them). ~190 import specifiers rewritten
   deterministically; 29 mutation anchors repointed; RFC-001 path ref updated.
   Historical docs (EVIDENCE audits, dated review) deliberately left as
   written — reverted one overeager rewrite.
2. **characterCombatant profile refactor**: 7+ inline `if (systemId === ...)`
   branches → one `D20SystemProfile` per system in
   `rules/combatants/systemProfiles.ts` (BAB, active-weapon convention,
   riders, versatile/off-hand capability flags, attack economy).
   Behavior-preserving; effect ids/labels/order unchanged; both 5e editions
   share one profile.
3. **Lint gate**: `@typescript-eslint/no-restricted-imports` override in
   `.eslintrc.json` — shared layers cannot value-import `src/systems/**`
   (type-only allowed). Exempt: systems tree, `main.tsx` bootstrap,
   `dataLoader`, `docDrift`, tests/scripts. Negative-tested (a planted
   violation errors; removal restores clean). CLAUDE.md gotcha added.

## Traps hit (remember these)

- The graph flagged MY refactor introducing a new 3-file cycle:
  systemProfiles imported `EffectInstance` from the rules *barrel* (`../index`)
  which re-exports characterCombatant. Fix: import types from their true home
  (`../ir/types`), never the barrel, inside `src/rules/`. Run
  `graphify update .` after refactors — the cycle section is the smoke alarm.
- Same-directory imports (`./x`) are invisible to `utils/x`-style greps —
  the "dead" dnd5eToolChoices had three same-dir importers.
- Relocating one file of a sibling pair can flip a dependency across the
  boundary (daggerheartDerived → daggerheartInventory); moving the second
  file (also rules-consumed math) was the fix.

## Open follow-ups

- `dnd5eMovement.ts` (now in systems/dnd5e/shared/) has NO product consumers —
  test-only. Deletion candidate; knip can't see it (tests are entry points).
- dataLoader could someday dispatch through system definitions instead of
  switches, removing its exemption. Low priority.
- Full e2e not run locally this session (chromium-only smoke earlier); PR CI
  runs the full matrix.

## Verification

tsc (both configs), full vitest, lint (incl. new gate), format,
compute-register (zero demotions), doc-drift, repo-hygiene, generated-docs,
knip — all green. Graph: 4,192 nodes / 12,034 edges / 172 communities,
"Import Cycles: None detected."
