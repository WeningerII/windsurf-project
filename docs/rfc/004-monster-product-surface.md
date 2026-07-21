# RFC 004: Monster Product Surface (Bestiaries Beyond 5e)

**Status:** Accepted (formalized 2026-07-21). History preserved: this RFC was
Draft (Proposed) when the monster data and scene encounter surface it planned
shipped on 2026-06-12 — i.e. it was executed without formal acceptance — and
the user's 2026-07-21 acceptance formalizes that already-executed decision
after the fact. See `docs/MASTER_PLAN.md` and `docs/GAPS.md` §3.
**Author:** engineering planning
**Created:** May 31, 2026
**Executed:** June 12, 2026 (without formal acceptance)
**Accepted:** July 21, 2026 (formalized retroactively)

## Summary

This RFC proposes overriding one currently-accepted product boundary: the rule
in `docs/MASTER_PLAN.md` that D&D 3.5e and Pathfinder 1e have **no monster
product surface**, and that such systems "must not regain monster UI, monster
categories, or reporting claims without a separate loader-backed product-scope
plan." This document is that plan.

The objective is to make every system encounter-capable, not just 5e: add
loader-backed, open-content bestiary data for the systems that have an open
monster corpus (D&D 3.5e, Pathfinder 1e, Pathfinder 2e) and reference
adversaries for the others (M&M 3e, Daggerheart), measured against the content
denominators in `docs/srd-manifest/` exactly like every other category.

This RFC proposes a **scope decision and a sequencing**, not an implementation.
It respects the anti-overengineering constraint: no monster UI, category, or
reporting claim ships until loader-backed, source-tagged, policy-compliant data
exists and the completion metric can measure it.

## Motivation

- 5e (2014/2024) already ships loader-backed monsters (`loadMonstersForSystem`),
  scoped for the Scene Runtime / Encounter Builder track. The loader contract,
  the open-content policy (`src/utils/openContentPolicy.ts`), and the metric
  (`src/scripts/generate-roadmap-metrics.ts`) are all monster-aware already.
- The completion goal treats "RAW-complete" as "every open-content SRD entry in
  every category that exists for the system." Monsters are such a category, and
  the d20 SRDs (3.5 SRD, PF1e CRB/Bestiary OGC, PF2e Bestiary OGC) contain large,
  fully open monster corpora. Excluding them leaves a defining category empty.
- The boundary that blocks this was set precisely because monster data was *not*
  loader-backed for those systems. This RFC supplies the missing precondition
  (a loader-backed plan + a denominator), which is exactly what the maintenance
  rule asked for before the boundary could move.

## Goals

- A cited content denominator for monsters per in-scope system, authored in
  `docs/srd-manifest/` (the `monsters` category already exists in the schema).
- Loader-backed, source-tagged monster data that passes the strict open-content
  policy, reusing the existing `loadMonstersForSystem` contract.
- Statblock internal-consistency verification in the compute register
  (`docs/compute-register/`): a monster's derived values (e.g. AC, attack/save
  DCs, HP from stats) are checked, not just its presence.
- Honest reporting: monster `content%` per system appears in the generated
  metric alongside every other category.

## Non-Goals

- **Not a monster *builder*.** Editing/homebrew of monsters is out of scope; this
  is catalog + encounter use, consistent with the deferred-homebrew boundary.
- **Not an AI surface.** No model authors statblocks.
- **Not a content-pack rewrite.** Monster data follows the existing data-tree and
  loader conventions; nothing about the loader architecture changes.

## Scope decision (the K1 knob)

The d20 open bestiaries are large (the 3.5 SRD and PF1e OGC run to many hundreds
to low thousands of statblocks). The monster denominator is where total scope is
dialed. This RFC recommends a **tiered default**:

1. **Tier A — SRD/OGC core bestiary**, per system, as the initial denominator:
   the canonical open monster set (e.g. 3.5 SRD monsters; PF1e CRB Bestiary
   appendix; PF2e CRB Bestiary). This is finite, well-bounded, and the highest
   product value per unit effort.
2. **Tier B — full open corpus** (e.g. additional OGC bestiaries) is an explicit
   later expansion, only after Tier A reaches parity and only if the volume does
   not dominate the rest of the goal.

Rationale: Tier A makes every system encounter-capable with a bounded,
citeable denominator; Tier B is a scale dial that can be deferred without
blocking "encounter-capable everywhere."

## Sequencing

Per the completion goal's order, monsters are the **last** content slice, after
the per-system engine-math and the smaller content catalogs. Within this RFC:

1. Land this RFC + the `docs/MASTER_PLAN.md` boundary edit (the capability phrase
   `no monster product surface` is replaced with a loader-backed-scope phrase)
   **together with** the first loader-backed monster slice — never docs ahead of
   data, so reporting stays honest.
2. Author the monster denominator (Tier A) per system in `docs/srd-manifest/`.
3. Encode/verify statblocks behind the open-content policy; add statblock
   internal-consistency checks to `docs/compute-register/`.
4. Re-point the per-system support notes only once a system's monster slice is
   real and measured.

## Risks and mitigations

- **Doc/data drift.** The `no monster product surface` capability phrase is
  enforced by the doc-drift checker; flipping it before data exists would be a
  false claim. Mitigation: the phrase changes in the same change-set that lands
  the data and the measured metric.
- **Scope blow-up.** Tier B could dominate effort. Mitigation: Tier A is the
  default denominator; Tier B is opt-in.
- **Licensing.** Only open-content statblocks are eligible; the existing strict
  policy filters non-compliant entries at load time, so a mis-sourced statblock
  is excluded rather than shipped.

## Status of this document

Proposed. Accepting this RFC authorizes the boundary override **conditioned on**
the sequencing above. Until the first loader-backed monster slice lands, the
current boundary remains in force and is still enforced by the doc-drift checks.
