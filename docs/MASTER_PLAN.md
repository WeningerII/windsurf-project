# Master Plan

**Last consolidated:** April 21, 2026

`docs/MASTER_PLAN.md` is the sole planning authority for this repo. If another document appears to define roadmap, sequencing, or long-horizon scope, treat that content as historical or descriptive unless it is explicitly mirrored here.

## Purpose And Source Documents

This file merges the still-valid planning content from these repo planning documents:

- `docs/STATUS.md`
- `docs/PRODUCTION_PLAN.md`
- `docs/EVIDENCE_LINKED_PARITY_REMEDIATION_PLAN.md`
- `docs/EVIDENCE_LINKED_PARITY_AUDIT.md`
- `docs/DAGGERHEART_DATA_ORGANIZATION_PLAN.md`

These non-planning documents were also consulted where they contained planning-adjacent policy or product-scope statements, but they are not roadmap authorities:

- `README.md`
- `CONTRIBUTING.md`
- `docs/generated/roadmap-metrics.md`
- `src/data/mutants-and-masterminds/3e/conditions/README.md`
- `src/data/mutants-and-masterminds/3e/powers/README.md`

Every inherited item below is classified as one of:

- `Completed foundation`
- `Accepted product boundary`
- `Active implementation track`
- `Discovery track`
- `Historical context`

## Current Repo Truth

- The repo currently ships 7 registered systems.
- The documented repo-wide verification baseline is green as of April 21, 2026 via `npm run verify` under Node `20.19.0`. Verification claims and scripted re-checks must stay tied to the supported runtime policy (`20.19+`, `22.12+`, or `24+`).
- Netlify is the canonical deployment target represented in repo docs and CI.
- The app is **local-first with an optional cloud sync layer**. Signed-out users and users without Supabase env vars configured behave exactly as the historical browser-local product: IndexedDB primary, localStorage fallback, dual-write persistence. Signed-in users get character-document and campaign sync against Supabase with per-user RLS, last-writer-wins merge semantics, offline queueing, realtime change propagation, and exponential-backoff retry on transient failures. The shipped design is documented in `docs/rfc/001-backend-sync.md`.
- Loader-backed counts and support summaries live in `docs/generated/roadmap-metrics.md` and `docs/generated/roadmap-metrics.json`. Narrative docs should summarize them, not compete with them, and must stay aligned with the metadata-backed selector/dashboard summary path already used in-app.
- Spell catalogs across 5e 2014/2024, D&D 3.5e, PF1e, and PF2e now share a normalized index/helper surface with alias-safe lookup. The shared spell browser derives levels from loaded data, so PF2e rank 10 is now a first-class browser path.
- Shared controller/section convergence is already shipped across the active sheet hosts for 5e, PF2e, legacy d20, M&M, and Daggerheart. The remaining 5e host work is a final cleanup/documentation pass, not another large decomposition project.

| System | Support level | Current repo truth |
| --- | --- | --- |
| D&D 5e (2024) | Full | Shared 5e sheet, loader-backed SRD content, subclass selection, feat ASI/proficiency automation |
| D&D 5e (2014) | Full | Shared 5e sheet, loader-backed feature-option browsing/persistence, provenance-first downstream effects |
| Pathfinder 2e | Full | Native sheet, loader-backed backgrounds/archetypes, native controller split from sheet host, dynamic rank-10 spell browsing |
| D&D 3.5e | Partial | Shared legacy sheet, full core prestige catalog is selectable, canonical 501-spell loader-backed catalog, Vancian tracked/prepared spell workflow with explicit manual boundaries, no monster product surface |
| Pathfinder 1e | Partial | Shared legacy sheet, vetted prestige support is product-reachable, raw `levelsByClass` now live in spell files, Vancian tracked/prepared spell workflow with explicit manual boundaries, no monster product surface |
| M&M 3e | Full | Native point-buy sheet, archetype pinning, complications insertion, modifier catalog reachability |
| Daggerheart | Partial | Native sheet, SRD-backed selectors/templates/libraries/domains/domain cards/equipment, loadout-vault persistence, unresolved/manual fallback, export/import roundtrip, and deterministic passive automation with explicit manual/reference boundaries |

The following older backlog claims are no longer true and must not re-enter the live roadmap:

- Shared 5e engine-base work is already shipped; edition-engine reuse is no longer a live roadmap problem.
- Support-level semantics already flow through system definitions, selector UI, dashboard UI, and generated summaries.
- The former backend-stub claim is not a live repo concern because no such module exists in the current tree.

## Non-Negotiable Constraints

- `SRD/open-content only`: shipped content must remain inside the source strings enforced by `src/utils/openContentPolicy.ts`.
- `Local-first remains the default`: the app must continue to work fully when signed out and when Supabase env vars are unset. Cloud sync is additive, never required. Any change that makes a core flow depend on a live backend requires a new RFC superseding `docs/rfc/001-backend-sync.md`.
- `Loader-backed reporting only`: if a content family is shown as product support, it must be reachable through loaders and reflected in `docs/generated/roadmap-metrics.*`.
- `Reporting-path parity`: support notes, reachable categories, and generated counts must stay aligned across the loader-backed metrics path and the metadata-backed selector/dashboard summary path.
- `Anti-overengineering`: do not create repo-wide controller, form, or section abstractions unless at least 3 concrete consumers share the same interaction shape and the extraction target is explicit.
- `No fake automation`: when rules support is partial, the UI and docs must say so plainly rather than imply unsupported automation.
- `Narrative docs do not own counts`: precise counts belong in generated metrics first, then in compact summaries that cite those metrics.
- `Historical docs remain on disk but cannot steer roadmap`: legacy plan files are source records, not active backlog.

## Completed Foundation

- `Completed foundation`: repo verification now has a canonical `npm run verify` path, Node runtime gating, repo-hygiene checks, and generated-doc checks.
- `Completed foundation`: Netlify is the documented deployment path; dual-deploy ambiguity is no longer an active roadmap item.
- `Completed foundation`: support levels and support notes are already part of system definitions and are rendered through the selector/dashboard summary path.
- `Completed foundation`: product-reachable counts and source-filtered categories now flow through the shared system-catalog/reporting layer and generated roadmap metrics.
- `Completed foundation`: service-worker caching, install prompt support, top-level sheet lazy loading, and bundle-budget enforcement are shipped.
- `Completed foundation`: storage hardening, pending-save handling, and browser-local document persistence are shipped.
- `Completed foundation`: local-first backend sync is shipped per `docs/rfc/001-backend-sync.md`. Supabase Auth (email/password + OAuth), per-user RLS on `documents` and `campaigns`, versioned last-writer-wins merge for documents, timestamp-only merge for campaigns, offline queue replay on reconnect, realtime subscriptions keyed by user id, and exponential-backoff retry with jitter on transient network failures are all live. Signed-out and unconfigured paths continue to behave as the historical browser-local product.
- `Completed foundation`: the shared 5e engine base is shipped and edition engines are reduced to rules overrides.
- `Completed foundation`: `D20LegacySheet`, PF2e sheet, and M&M sheet decomposition work is shipped; sheet-local orchestration now lives outside the largest rendered tab bodies.
- `Completed foundation`: the shared controller/section-host convergence across 5e, PF2e, legacy d20, M&M, and Daggerheart is shipped. Remaining host cleanup is now local polish and documentation, not architecture extraction.
- `Completed foundation`: the additive spell-preparation contract is shipped across the prepared-caster systems that currently use it. Shared 5e distinguishes tracked, prepared, always-prepared, and manual edges; PF2e preserves native rank preparation with structured always-prepared surfacing; legacy d20 preserves tracked spells plus Vancian prepared-slot assignment.
- `Completed foundation`: the spell-catalog parity baseline is shipped across all five spell systems. Shared catalog helpers, spell-id alias resolution, PF1e raw `levelsByClass`, PF2e raw `traditions`, PF2e rank-10 browser support, and the first cross-system `target` / `effect` / `area` metadata backfill are now in the repo.
- `Completed foundation`: 5e subclass selection, multiclass handling, feat ASI/proficiency automation, and 5e-2014 feature-option browsing/persistence are shipped.
- `Completed foundation`: PF2e loader-backed backgrounds and archetypes are shipped.
- `Completed foundation`: D&D 3.5e core prestige classes and PF1e vetted prestige classes are product-reachable.
- `Completed foundation`: M&M archetypes, complications, and power modifiers are product-reachable as reference surfaces.
- `Completed foundation`: Daggerheart now has a real versioned data tree, dedicated types, dedicated loaders, selector-backed sheet surfaces, starter templates, browse tabs, loadout/vault persistence, unresolved/manual fallback handling, import/export roundtrip coverage, automation badges/support notes, and deterministic passive stat derivation.

## Accepted Product Boundaries

- `Accepted product boundary`: 5e feat automation remains partial by design. Supported ASIs and proficiencies are automated; most other feat riders remain manual.
- `Accepted product boundary`: 5e-2014 feature-option catalogs are provenance-first and persistence-first. Browsing and selection are shipped; every downstream rule rider is not automatically applied.
- `Accepted product boundary`: M&M archetypes remain reference-only. They can be pinned and reviewed in-sheet, but they do not auto-build powers, skills, or point totals.
- `Accepted product boundary`: Daggerheart remains partial support. The repo ships deterministic and clearly encoded automation, not full card-resolution logic.
- `Accepted product boundary`: generic controller/form abstraction work is not backlog by default. System-local controllers and sections are preferred until multiple concrete consumers justify extraction.
- `Accepted product boundary`: docs should describe current support honestly even when a system is intentionally manual in places.

## Active Implementation Tracks

### Cross-Repo

- `Active implementation track`: preserve the shipped spell-preparation workflow across systems that already encode prepared-caster data.
  - Current truth: the shared spell-prep helper contract and additive fields are already shipped. Shared 5e now distinguishes tracked/prepared/always-prepared/manual states, PF2e preserves native rank preparation while surfacing structured always-prepared grants, and legacy d20 now persists tracked spells plus Vancian prepared slots.
  - Remaining work: targeted regression coverage, unresolved import/manual edge honesty, and structured data maintenance when new always-prepared grants are added.
  - Required outcome: keep export/import compatibility, preserve native system data shapes, and do not collapse these systems into a new canonical spell schema.
- `Active implementation track`: deepen regression coverage around newly productized selection-heavy surfaces when those surfaces change.
  - Priority surfaces: 5e feature options, PF prestige layering, PF2e archetype persistence, M&M pinned references, and Daggerheart loadout/vault/import-export paths.
- `Active implementation track`: finish spell-level file parity across `dnd-5e-2014`, `dnd-5e-2024`, `dnd-3.5e`, `pf1e`, and `pf2e`.
  - Current truth: normalized `spells/index.ts` helper surfaces, spell-id alias resolution, PF1e raw `levelsByClass`, PF2e raw `traditions`, PF2e cross-rank aliasing, dynamic browser level filters, and initial high-signal `target` / `effect` / `area` metadata backfill are already shipped.
  - Remaining work: deeper raw metadata parity (`target`, `effect`, `area`, components, spell resistance details), PF2e `traits` plus broader non-cantrip `heightening`, and the remaining non-identical 3.5e duplicate groups.
  - Required outcome: raise the raw spell files toward the strongest current metadata baseline without introducing a new repo-wide spell schema or breaking alias compatibility.

### D&D 5e (2014 + 2024)

- `Active implementation track`: finish the last shared 5e host cleanup/documentation pass. `src/systems/dnd5e/shared/Dnd5eSheetBase.tsx` is no longer a monolith-level decomposition target and should remain a small, sub-400-line host shell.
- `Active implementation track`: keep spell-preparation work in the shared 5e host so both editions benefit from one workflow implementation where the rules overlap.
- `Active implementation track`: represent structured always-prepared grants in data where the grant is explicit and deterministic, but keep choice-based or unsupported preparation riders manual.
- `Active implementation track`: continue to label unsupported feat/feature-option riders honestly instead of broadening automation through ad hoc one-off logic.

### D20 Legacy (D&D 3.5e + PF1e)

- `Active implementation track`: keep all 3.5e/PF1e sheet work inside the existing shared `src/systems/d20-legacy` host/controller/template/resource path; do not split these systems into separate sheet hosts, alternate loader roots, or another prestige/schema layer.
- `Active implementation track`: there is no standalone content-productization program left here; the remaining live work is regression fidelity, not another big surface expansion.
- `Active implementation track`: preserve prestige-class spellcasting and layering behavior through targeted regression coverage as adjacent systems evolve.
- `Active implementation track`: if 3.5e prestige data changes again, keep the normalized prestige catalog and the product-reachable prestige subset aligned rather than introducing another representation.
- `Active implementation track`: do not reintroduce dead monster UI or monster reporting claims for systems with no reachable monster dataset.
- `Active implementation track`: include these systems in the spell-preparation workflow only if the implementation explicitly supports their Vancian preparation semantics rather than forcing a 5e-shaped model onto them.
- `Active implementation track`: keep domain-slot extras, spontaneous conversion/swap behavior, specialist-school extras, and Dragon Disciple bonus slots/manual gains explicit until they have structured support.

### Pathfinder 2e

- `Active implementation track`: there is no separate reachability program; backgrounds and archetypes are already product-reachable.
- `Active implementation track`: PF2e only needs targeted implementation work where the spell-preparation workflow or controller state contract changes the current native sheet behavior.
- `Active implementation track`: keep cantrips, focus spells, and other unsupported preparation edges explicitly manual while surfacing only structured always-prepared grants automatically.
- `Active implementation track`: keep condition and defense behavior honest; if a documented PF2e behavior is not actually implemented, remove the claim instead of inflating the roadmap.

### Mutants & Masterminds 3e

- `Active implementation track`: no archetype auto-build program exists in the live backlog.
- `Active implementation track`: keep regression coverage tight around pinned archetypes, inserted complications, modifier math, and PL-cap enforcement when adjacent sheet work lands.
- `Active implementation track`: any future ergonomics work must preserve the current reference-only contract unless a separate archetype-application spec is written first.

### Daggerheart

- `Active implementation track`: deepen domain-card automation only for deterministic effects that are safely representable in local data and derived stats.
- `Active implementation track`: treat selector-backed manual fallback, starter templates, browse tabs, burden/loadout rules, loadout/vault persistence, export/import roundtrip, automation badges, and deterministic passive stat math as shipped baseline; regression work here is protection for changed paths, not a greenfield feature program.
- `Active implementation track`: preserve the current versioned data tree and dedicated Daggerheart types instead of forcing lossy reuse of generic class/species/background contracts.
- `Active implementation track`: limit any future automation to the current additive metadata surface (`automationMode`, passive conditions, passive bonuses, passive derived bonuses, effect tags) plus the existing derived-stat helpers.
- `Active implementation track`: keep triggered, timing-based, rest-based, choice-based, and narrative card effects `triggered-manual` or `reference-only` unless they can be represented deterministically in that existing metadata model.
- `Active implementation track`: keep the UI explicit about what is auto-applied, what is tracked-but-manual, and what is reference-only.

## Discovery Tracks

- `Discovery track`: guided character-creation wizard.
  - Current truth: users create blank sheets and/or use template selectors.
  - Entry requirement: an RFC covering first-release system scope, step order, draft persistence, resumability, and how wizard output maps onto existing document shapes.
- `Discovery track`: additional game systems.
  - Current truth: the registry pattern can support more systems, but no new system is a live commitment.
  - Entry requirement: open-content eligibility, loader-backed data, reporting integration, tests, and a clear product surface.

## Historical Provenance

| Source document | Classification | Unique value retained |
| --- | --- | --- |
| `docs/PRODUCTION_PLAN.md` | Historical context | March 2026 production-hardening sequence, launch-risk ordering, and resolved ship-quality work |
| `docs/EVIDENCE_LINKED_PARITY_REMEDIATION_PLAN.md` | Historical context | Exhaustive remediation sequencing, row-to-workstream mapping, and parity decision matrix |
| `docs/EVIDENCE_LINKED_PARITY_AUDIT.md` | Historical context | Evidence snapshot showing what the repo looked like before the March 2026 parity/productization push landed |
| `docs/DAGGERHEART_DATA_ORGANIZATION_PLAN.md` | Historical context | Original Daggerheart data-shape rationale, plus superseded early structure proposals that informed the shipped data tree |
| `docs/rfc/001-backend-sync.md` | Accepted RFC | Canonical description of the shipped local-first sync architecture: auth, schema, merge semantics, offline queue, realtime, retry, migration-from-local, Netlify/runtime implications, accepted boundaries |

## Maintenance Rule

When roadmap content changes:

1. Update `docs/MASTER_PLAN.md` first.
2. Keep `docs/STATUS.md` as a concise current-state summary only.
3. Update `README.md` only if the public product overview changes.
4. If support notes or reachable categories changed, update the support-note copy and the selector/dashboard summary expectations together with the roadmap text.
5. Run `npm run roadmap:metrics` if count-bearing docs or reporting assumptions changed.
6. Run `npm run check:generated-docs`.
7. Run `npm run check:repo-hygiene`.
8. Run `npm run check:doc-drift`.
