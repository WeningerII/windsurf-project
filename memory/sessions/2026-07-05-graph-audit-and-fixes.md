# 2026-07-05 — Graph-driven architecture audit + fixes

**Branch:** `claude/claude-obsidian-graphify-research-d8ufwc` (restarted from
post-#28 main, `b582bf3`).

## Audit method

Interrogated the fresh knowledge graph rather than grepping: GRAPH_REPORT god
nodes / import-cycle / isolated-node sections, wiki community names, targeted
`graphify explain`/`query`, and a python sweep over `graph.json` for
file-nodes with degree ≤ 2.

## Findings

1. **rules→dnd5e import cycle (fixed this session)** — the repo's ONLY import
   cycle: `rules/combatants/characterCombatant.ts` imported `profBonus` from
   `systems/dnd5e/shared/engine.ts`, which imports `resolveCharacterEffects`
   from `rules/index.ts`, which re-exports characterCombatant. The
   "system-agnostic rules core" wasn't.
2. **Duplicate vitest.d.ts (fixed this session)** — `src/vitest.d.ts` (36 B)
   was a strict subset of `src/__tests__/vitest.d.ts`; graphify auto-named its
   community "Vitest Type Defs Dup".
3. **CharacterDocument god node** — 229 edges, ~50 communities. No action;
   recorded as a check-before-touching fact.
4. **knip is soft on exports** — exports/types/duplicates rules off; only
   unused files/deps gate CI.
5. **No dead-code trove** — degree≤2 sweep found 11 file nodes, all
   legitimately standalone (configs, entries) or graph blind spots.
6. **Not vestigial**: `notion-site/` (pages.yml deploy), `d20-legacy` (live
   shared 3.5e/PF1e host).

## Fixes applied

- `profBonus` → `src/utils/math.ts` (next to `abilityMod`); dnd5e engine
  re-exports for API stability; characterCombatant imports from utils/math;
  both `*.L1.proficiency-bonus` mutation anchors repointed to the new file
  (find-string verified to occur exactly once there). Remaining rules→systems
  references are `import type` only (compile-time erased).
- Deleted `src/vitest.d.ts`; dropped its entry from tsconfig.test.json
  include (`src/__tests__/**/*` already covers the superset file).

## Verification

- typecheck:test, lint, knip, compute-register (Tier A, zero demotions) green.
- 95 affected unit tests + a jest-dom matcher test pass.
- Graph rebuilt: 4,179 nodes / 12,009 edges / 174 communities;
  GRAPH_REPORT.md now reads "Import Cycles: None detected."
