# 2026-07-08 — UI redesign FINAL plan (adversarial tournament)

**Deliverable:** docs/design/ui-shell-redesign-final-plan.md (plan of record).

**Workflow:** ui-redesign-adversarial-tournament (57 agents, opus-4-8). 4 conflicting
camps (Pragmatist / Owlbear-Maximalist / Surgeon / Integrator) -> each red-teamed by 5
hostile lenses + defense -> 4 weighted judges scored comparatively -> synthesis+grafts
-> loop-until-dry hardening.

**Winner: Staged Convergence** (3/4 judges; UX Purist ranked it #2). Resolves the
layout-vs-interaction tension as BOTH-in-sequence: ship the pragmatic handoff frame
(declutter in days), then layer Owlbear interaction (dock, pointer-drag, canvas-first)
as chapters, riskiest greenfield LAST. Load-bearing calls: (1) ONE total discriminated
nav union from day 1 = frame->shell is a one-module refactor, not an app-wide rewrite;
(2) hybrid verb model: pointer-drag ONLY on the Scene canvas, click-to-add on the Sheet
(NO sheet drop targets); (3) invariant: scene/runtime.ts + 12 SceneActionIntents frozen.

**All 6 decisions resolved** (4 product + 2 convergence): creation/import/export/delete
re-homing, campaigns two-pane, scene authoring in LibraryScenesView, pointer-events +
inline-chip, hybrid verb, disclosure-only role (no read-only mode).

**7 phases:** 1 handoff frame + total nav union (declutter, days) · 2 keepalive
substrate + sync pause/resume-with-reconcile · 3 shared dock (5 tabs incl. party) +
SheetDispatchContext + delete bestiary · 4 drag keystone + prototype GATE + pan/zoom
probe · 5 sheet eviction (click-to-add only) · 6 scene canvas (split 5c/5d/5e) · 7
hardening + CI budgets.

**Prototype GATE:** dock->scene-token, two sub-gates — party character-document =
genuine 1-choice auto-apply (needed a NEW 5th 'party' dock tab, Finding 15); bestiary
monster = intrinsically 2+ (buildPlacedToken requires allegiance, Finding 9) -> inline
friendly/hostile chip.

**HONEST CAVEAT: hardening did NOT converge** — 4-round cap hit with 8/8/6/7 crit/high
defects/round. All claim-fatal not camp-fatal; strategy survived intact. Signal: a
400k-LOC redesign spawns edges faster than 4 rounds close them -> gate each interaction
chapter on a real felt signal; phase-level detail is not final.

**Status:** plan of record, no code changed. Branch restarted from post-#29 main.
Full tournament artifacts (camps/tournament/judges/hardeningLog) in the workflow output.
