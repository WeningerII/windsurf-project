# 2026-07-15 — Master-plan execution (shell closeout → IR closeout → terrain)

Continuation of the 2026-07-14 doc-realignment session. Owner delegated
sequencing ("follow the order of operations your best judgment calls for").
Six PRs merged to main (#32–#36); `cd316ae` is the tip.

## What was done (in order)

1. **Shell Phase-1 closeout (#33)** — tasks 7-8 (Export/Delete → `OverflowMenu`
   overflow on the sheet header + per-card `CharacterCard` controls + roster
   search), task 9 Alt+1/2/3 surface shortcuts, task 11 surface-switch
   `performance.mark/measure` (`useSurfaceSwitchMetrics`) + `sceneManagerChunk`
   bundle guard (classifies eager/lazy from `dist/index.html`, not the fragile
   `index-*` heuristic), task 14's eight `e2e/phase1-*` gates. Adversarial
   review caught a real bug: OverflowMenu Escape also fired App's global Escape
   (closed the whole sheet) — fixed with capture-phase `stopPropagation` + a
   regression test.
2. **IR Phase-1 closeout (#34 + #35)** — quick wins: 5e spell save DC/attack
   displayed (`getDnd5eSpellcastingClassSummaries`, shares the engine's cited
   helpers), `EquippedItem.weaponDamage` populated at 5e equip time in
   `toEquippedItem`. KEY FINDING: routing Daggerheart/M&M engines through
   `resolveCharacterEffects` is NOT worth forcing — the resolver is additive by
   design, their derived defenses use conditional base-overrides /
   attribute-derived / max-combining it can't express. Documented as an accepted
   boundary rather than a forced refactor. #35 was a staleness sweep.
3. **IR Phase-4 functional terrain — first slice (#36)** — `resolveSceneAttack`
   default branch folds `collectTerrainEffectsAt` for attacker + target cells:
   attacker-cell terrain → attack effects; target-cell terrain raising defense →
   cover (+AC), effective AC in the log. Additive; 26 existing combat tests
   unchanged + 3 new. Scoped to the default branch (M&M/DH branches, movement
   cost, and authoring UI are follow-ups).

## Decisions / why

- **Terrain chosen over shell Phase 2** for the post-closeout program: additive
  new capability (low regression risk) with immediate gameplay value, vs.
  shell Phase 2's pure substrate. Verified the terrain bridge was real and
  unconsumed before committing (learned this session not to trust survey
  framings — cf. the IR engine-routing finding).
- **Foreground + commit-per-piece** throughout, because the container recycled
  twice this session and silently killed a background workflow (wiping its
  saved script + scratchpad). Committed work is the only durable state.

## Process landmines (this session)

- Container recycles mid-session → kills background workflows with no
  notification, wipes scratchpad + workflow scripts. Do heavy work foreground.
- Auto-mode classifier blocks merge-to-main unless the USER gave explicit,
  specific consent for THAT PR — generic "proceed"/"continue" is insufficient.
  The user merged #34–#36 themselves after the classifier declined scheduled
  auto-merges.
- Fable 5 credits ran out → session ran on Opus 4.8.

## Follow-ups

Continue IR Phase 4 in value order: (1) marker-effects authoring UI, (2)
movement-cost/difficult terrain in `runSceneRound`, (3) M&M/Daggerheart attack
branches. Owner items still open: GAPS §5 exhaustion review; README
two-denominator citation.
