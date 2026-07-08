# 2026-07-08 — UI redesign build-ready phase specs (re-grounding pass)

**Deliverable:** docs/design/ui-redesign-phase-build-specs.md.
**Workflow:** ui-redesign-phase-build-specs (9 agents). 1 spec agent per phase
(re-ground anchors + expand to build tasks/tests/gates) -> sequencing verifier ->
Phase-1 kickoff.

**Key outcomes:**
- Phase 1 anchors 100% still valid vs current code -> build-ready NOW.
- Sequencing = clean DAG, zero violations. P4 (scene/drag) and P5 (sheet-only)
  are independent siblings; linear numbering is a safe superset.
- Drift caught (would have broken later phases): src/context/ -> src/contexts/
  (plural, repo convention + vitest coverage glob); RUNTIME_COPY_RULES = 15 not 13;
  bestiary tab is doc-drift-SAFE (not guarded) but its plumbing threads 4 files;
  ConfirmDialog is strict 2-action (allegiance chip needs a new component); doc-drift
  is 3 coupled files (rules.ts + manifest.ts + docDriftManifest.test.ts); assertNever
  only in frozen runtime.ts (use a local one); hostSizeBudget covers the 5 sheet hosts
  only, NOT scene files (reduces Phase 6 burden).
- Phase-1 FIRST COMMIT: create src/hooks/useAppNav.ts + src/hooks/__tests__/useAppNav.test.ts
  (total discriminated nav union: openSheet/closeSheet/onSelectScene + local assertNever
  over BOTH surface & librarySegment discriminants). Green under npm test; knip-red until
  App.tsx consumes it (Phase 1 is ONE atomic PR, no sub-task lands alone).

**Status:** specs only, no code changed. Awaiting user go/no-go on implementing Phase 1.
