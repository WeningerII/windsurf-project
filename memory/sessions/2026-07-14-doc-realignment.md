# 2026-07-14 — Planning-doc realignment (survey + workflow-driven)

## What was done

Session opened with "what should we focus on next?". Ran a 5-agent verification
workflow (survey) to ground every candidate program in current code, then — on
the owner's "run a dynamic workflow" — an 8-agent draft/gate/adversarial-review
workflow that executed the top recommendation: realigning the planning docs.
Committed as `6f03cad` on `claude/next-priorities-98pzof`, pushed; no PR opened
(not requested).

### Survey findings (all grounded in file:line evidence)

- **CI/e2e healthy**: PR #31 merge (`b0f0371`) fully green; Verify 9m20s/30m
  cap; 26 chromium + 26 firefox tests; pwa-offline passed first-try (local
  flake = rev-1194 bridge artifact, low risk); Pages deploys only the verified
  SHA (workflow_dispatch is a documented bypass). One firefox flaky:
  phase3-workflows Daggerheart roundtrip (passed retry).
- **Shell Phase 1**: all eight deferrals from memory verified still un-landed;
  `useAppNav.selectScene` exists unconsumed; keepalive `<div hidden>` violates
  final-plan Findings 7+14.
- **IR program**: Phase 0 DONE; Phases 1–5 PARTIAL (5/7 engines route AC via
  resolver — daggerheart/mam3e untouched; only 5e replaced imperative condition
  math; only 5e ledger re-backed; terrain bridge has zero non-test consumers;
  validators exist for 2/7 systems).
- **Plan drift**: MASTER_PLAN stale in both directions and self-contradicting
  (line 58 vs 237); RFC 004/005/006 missing from provenance; shell program not
  mirrored (sole-authority violation); check:doc-drift catches none of it.
- **GAPS §2 half stale**: 5e spell DC/attack, Unarmored Defense, iteratives,
  PF2e bulk are wired (some via duplicate implementations — register helpers
  themselves test-only); passive Perception, concentration DC, cantrip scaling,
  PF2e MAP/striking/heighten, M&M measurements remain helper-only.

### Changes landed (5 files, +193/−70)

MASTER_PLAN.md, GAPS.md, docs/design/ui-redesign-phase-build-specs.md
(amendment), docs/rfc/004 status line, STATUS.md (CI-authority note + d20-wide
encounter phrasing). Details in the commit message and hot.md.

## Decisions and why

- **Docs before code**: the sole planning authority misdescribing reality taxes
  every future prioritization; fixing it was S–M effort with zero code risk.
- **Kept the pinned May-30 verification baseline sentence** in STATUS/
  MASTER_PLAN (doc-drift VERIFICATION_RULES pins it to generated truth) and
  appended a CI-authority sentence after it instead of editing it.
- **RFC 004 marked "subsequently executed"** rather than promoted to Accepted —
  records reality without inventing an acceptance that never happened.
- **REMEDIATION_PLAN mirrored** as a maintenance track (review found it was a
  second live plan invisible to MASTER_PLAN); its Phase 6 would archive the
  superseded planning docs — owner decision.

## Verification performed

- Workflow gate + regate: `check:doc-drift`, `check:generated-docs`,
  `check:repo-hygiene` all green (run twice: after draft, after review fixes);
  re-run a third time after the STATUS.md touches. Prettier N/A (`.prettierignore`
  excludes `*.md`).
- Adversarial review (2 agents) refuted 13 draft claims — all fixed before
  commit (notable: tactical executor shipped 2026-05-31 not 06-19; pf2e profile
  DOES declare an attack economy, it lacks a MAP penalty step; "green on every
  main merge" overstated — PR #26/#30 merge runs were cancelled).

## Follow-ups

1. Shell increment: coupled tasks 3+5+12 + keepalive swap (build-specs
   amendment has the full spec).
2. IR Phase-1 closeout (daggerheart/mam3e engines).
3. Owner: GAPS §5 exhaustion review; README two-denominator citation;
   REMEDIATION Phase 6 archive decision; PR for this branch.
