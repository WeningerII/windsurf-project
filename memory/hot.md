# Hot cache

> Rolling working memory. Rewritten at the end of each substantial session via
> `/save` — overwrite stale content, keep it under ~500 words. Durable facts go
> to [[CLAUDE]] (CLAUDE.md) or `docs/`, not here.

**Last updated:** 2026-07-14 (planning-doc realignment committed `6f03cad` and
pushed on `claude/next-priorities-98pzof`; no PR yet)

## Current focus

Planning docs realigned with shipped reality. Two verification workflows (a
5-agent survey, then an 8-agent draft/gate/adversarial-review pass) grounded
every change in code before writing:

- **MASTER_PLAN**: shipped AI surfaces + tactical executor (landed 2026-05-31,
  wired by 06-12) recorded; stale 3.5e/PF1e "no monster product surface"
  dropped (bestiaries shipped 2026-06-12, incl. PF2e); scene-runtime phase
  table annotated (0–8 + 11 shipped, 9/10/13 slice, 12/14 open); RFC 004/005/006
  provenance rows added, rfc/002 reclassified Active; UI-shell redesign mirrored
  as an Active track (Phase 1 = PR #30 with enumerated deferrals); two-denominator
  completion goal + REMEDIATION_PLAN closeout (Phases 6–7 pending) mirrored; IR
  per-phase actuals: Phase 0 DONE, 1–5 PARTIAL (daggerheart/mam3e engines not
  resolver-routed; all-seven parity holds only in tests).
- **GAPS §2** split into verified now-wired vs still-helper-only (helper-only:
  passive Perception, concentration DC, cantrip scaling, PF2e MAP/striking/
  heighten, M&M measurements). Quick win flagged: populate
  `EquippedItem.weaponDamage` in `toEquippedItem` (consumer already written).
- **build-specs**: dated amendment — PR #30 landed-vs-deferred, the
  `<div hidden>` keepalive deviation (Findings 7+14), corrected Phase-2
  prerequisite gate, recommended next increment.

Doc gates green (doc-drift, generated-docs, repo-hygiene). Docs/memory only —
graph not refreshed.

## Next steps

1. Open PR for `claude/next-priorities-98pzof` when owner asks; CI runs the
   full verify gate on merge.
2. Next code increment (agreed priority): coupled shell tasks **3+5+12** —
   five-writer scene-selection lift (`useAppNav.selectScene` exists unconsumed;
   writers at SceneManager.tsx L109/143/807/872/926), LibraryScenesView +
   18rem left-rail removal, same-commit SceneManager/capabilityScenarios test
   rewrites — bundling the keepalive swap (App.tsx L638 `hidden` →
   visibility:hidden). See build-specs "Amendment — 2026-07-14".
3. Then IR Phase-1 closeout: route daggerheart + mam3e engine `prepareData`
   through `resolveCharacterEffects` with outputs unchanged.
4. Owner items: GAPS §5 human review (5e-2024 exhaustion −2/level); README
   still doesn't cite the two denominators; REMEDIATION Phase 6 doc-archive
   decision.

## Watch items

- firefox `phase3-workflows.spec.ts:368` (Daggerheart roundtrip) flaked once
  in CI, passed retry #1. `pwa-offline` passed clean in CI; the local blank
  shell is the rev-1194 browser-bridge artifact (see 2026-07-10 session log;
  NEVER `playwright install` in this container).
- Main CI green at `b0f0371`: Verify 9m20s vs 30m cap, e2e ~3m — ample headroom.

## Open questions

- Ship the shell increment as one PR, or split LibraryScenesView from the lift?
- GAPS §1 decision still open: fold genuine srd-coverage numbers into the
  headline metric / retire the loader-mirror manifests?
