# Project Status

This file is a current-state summary only. `docs/MASTER_PLAN.md` is the sole planning authority, and `docs/generated/roadmap-metrics.md` remains the authoritative count source.

**Last repo-wide verification:** May 30, 2026 via `npm run verify` under Node `20.19.0`

## Current Product Snapshot

- 7 registered systems are live in the registry.
- Netlify is the canonical deployment target.
- The app is local-first with an optional cloud sync layer. Signed-out and unconfigured paths remain pure browser-local (IndexedDB primary, localStorage fallback, dual-write persistence). Signed-in users on a configured Supabase project get per-user document and campaign sync with offline queueing, realtime change propagation, and exponential-backoff retry. See `docs/rfc/001-backend-sync.md` for the shipped design.
- Browser-local scenes are now visible through a manual scene/grid manager. Users can create local scenes, associate them with campaigns/systems, place and move character/manual tokens through typed scene events, seed queued loader-backed D&D 5e monster encounters with party-level XP preview, manage terrain or hazard markers, set initiative, and import/export scene documents without Supabase or provider keys.
- Loader-backed counts, support levels, and source-filtered categories are generated from the runtime data/reporting path.
- Spell catalogs across 5e, D&D 3.5e, PF1e, and PF2e now share normalized index surfaces with alias-safe lookup, legacy d20 source-backed save/component/casting metadata coverage, and a cross-system identity regression matrix. The only D&D 3.5e spell source-blocked exclusions are `bleed-35e`, `mass-misdirection-35e`, and `reversal-of-fortune-35e`; PF1e source-backed rows without a Saving Throw line are explicit regression fixtures.
- Shared controller/section-host convergence is shipped across 5e, PF2e, legacy d20, M&M, and Daggerheart. Future work here is maintenance against existing host/controller contracts, not another decomposition push.

| System | Support level | Current slice |
| --- | --- | --- |
| D&D 5e (2024) | Full | Shared 5e host, subclass selection, feat ASI/proficiency automation, by-level always-prepared data with source labels and explicit unresolved/manual boundaries |
| D&D 5e (2014) | Full | Shared 5e host, feature-option browsing/persistence, provenance-first downstream effects, by-level always-prepared data with explicit manual riders |
| Pathfinder 2e | Full | Native sheet, loader-backed backgrounds/archetypes, native prepared-slot persistence, structured always-prepared surfacing, focus-spell manual surface, dynamic rank-10 spell browsing |
| D&D 3.5e | Partial | Shared legacy host, full core prestige catalog is selectable, canonical 428-spell loader-backed catalog with alias-safe class-stub duplicate collapse, Vancian tracked/prepared spell workflow, and manual domain/specialist/spontaneous/Dragon Disciple extras |
| Pathfinder 1e | Partial | Shared legacy host, vetted prestige support is product-reachable, raw `levelsByClass` and legacy spell metadata live in spell files, Vancian tracked/prepared workflow, and manual domain/specialist/spontaneous/Dragon Disciple extras |
| M&M 3e | Full | Native point-buy sheet with pinned archetypes, complication insertion, and modifier math/PL-cap enforcement |
| Daggerheart | Partial | Native sheet with selectors, domains, domain cards, equipment, loadouts, and deterministic passive automation with explicit manual/reference boundaries bounded by the existing metadata model |

## Maintenance Tracks

- Sustain legacy spell parity and cross-system catalog invariants through raised parity floors and fixture-backed regressions.
- Maintain source-strict preparation surfaces across shared 5e, PF2e focus spells, and legacy d20 manual extras without expanding into choice-dependent automation.
- Keep Daggerheart passive automation, M&M reference surfaces, PF2e preparation/archetype behavior, legacy d20 prestige/manual extras, and 5e feature-option persistence covered by regression as future work enters through `docs/MASTER_PLAN.md`.

## Completion Tracking (Denominators)

Completeness is measured against two cited, open-content denominators, so "done" is a defined, reachable state rather than an open-ended judgment:

- **Content (Denominator A)** — `docs/srd-manifest/`: per-system catalogs of the open-content SRD entries each system should contain. The generated metric joins manifest ids against actually-loaded ids, so the reported `content%` reflects real loader data rather than a self-asserted number.
- **Engine math (Denominator B)** — `docs/compute-register/`: per-system registers of every derived quantity the rules define, indexed by system × quantity, each marked verified (test-pinned), implemented, or missing. `compute%` is verified ÷ in-scope.
- **Manual boundaries** — `docs/srd-manifest/_exclusions.ts`: the enumerated manual, reference-only, and narrative items excluded from both denominators so the metric is never gamed by fake automation.

Live `content%` and `compute%` per system are reported in `docs/generated/roadmap-metrics.md` (regenerate with `npm run roadmap:metrics`). All seven systems have engine-math registers; D&D 3.5e and PF1e gained their first engine-math tests under this tracking. The monster category is governed by `docs/rfc/004-monster-product-surface.md`.

**Current state:** Engine math (Denominator B) is verified at 100% across all seven systems — every derived quantity in the compute registers is test-pinned. Content (Denominator A) is enumerated as cited per-entry manifests in `docs/srd-manifest/` (generated by `src/scripts/generate-srd-manifests.ts`) — 4,216 open-content entries across the seven systems, every one encoded, loader-backed, source-tagged, and open-content-policy-clean — giving 100% **catalog parity** (the metric's content%). Full-SRD *coverage* (detecting entries the published SRD contains but the loaders omit) is a stricter, separate dimension that requires an external authoritative SRD index unavailable in this environment; per the "cite, never invent" policy it is flagged unresolved rather than asserted. The 100% content figure therefore certifies catalog parity + provenance, **not** completeness against the full published SRD.

## Source Of Truth

- `docs/MASTER_PLAN.md` - canonical roadmap and planning classifications
- `docs/generated/roadmap-metrics.md` - generated product-reachable counts and repo-resident audit
- `docs/srd-manifest/` - content denominators (Denominator A) and the manual-exclusion registry
- `docs/compute-register/` - engine-math denominators (Denominator B)
- `README.md` - public product overview
- `CONTRIBUTING.md` - engineering policy and workflow guardrails
