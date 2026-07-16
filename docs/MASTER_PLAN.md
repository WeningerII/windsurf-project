# Master Plan

**Last consolidated:** July 14, 2026

`docs/MASTER_PLAN.md` is the sole planning authority for this repo. If another document appears to define roadmap, sequencing, or long-horizon scope, treat that content as historical or descriptive unless it is explicitly mirrored here.

## Product North Star

The product direction is to make tabletop creation, preparation, play, and session presentation feel frictionless by combining deterministic rules automation with AI-assisted drafting, orchestration, and narration. The existing automation remains the authority: loaders define legal source data, validators decide whether drafts are acceptable, template handlers apply durable character changes, and future scene reducers resolve game state. AI accelerates and explains those workflows; it does not replace them.

The long-term user experience is: describe a character, encounter, scene, or desired moment in natural language; receive a structured draft constrained by shipped open-content data; review deterministic validation and provenance; then accept changes through the same character, campaign, and scene paths that manual users use. When provider keys are absent or a model call fails, the deterministic/manual product must still work.

**All seven systems are 1:1 equal.** D&D 5e (2014), D&D 5e (2024), D&D 3.5e, Pathfinder 1e, Pathfinder 2e, Mutants & Masterminds 3e, and Daggerheart must each reach full rules-as-written (RAW) parity for both creation and play. No system is privileged and none is a "pilot." The bar is **full deterministic auto-resolution everywhere**: equipment effects on attack/AC, magical bonuses, feats, spells, class features, and conditions all resolve in code, identically across systems; the only rules that stay non-mechanical are those written as pure GM judgment, which are labeled, never faked. The way this is achieved without privileging any one system is the **system-agnostic rules intermediate representation (IR) and deterministic effect resolver** in `docs/rfc/003-rules-ir-and-effects.md` (Accepted) — one shared mechanical backbone every engine compiles its RAW into. That connective layer is now the spine of the roadmap below, and its first proof point is explicitly cross-system: equipping an item resolves attack, AC, magical bonuses, and feats through one resolver, identically in all seven systems.

The durable *why* behind this direction — the thesis the product exists to test — lives in `docs/VISION.md`. This plan is the *what* and *how* and changes often; `docs/VISION.md` is the *why* and changes rarely. If the two disagree about scope, this plan wins.

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
- `docs/rfc/002-ai-control-plane.md`
- `docs/generated/roadmap-metrics.md`
- `src/data/mutants-and-masterminds/3e/conditions/README.md`
- `src/data/mutants-and-masterminds/3e/powers/README.md`

Every inherited item below is classified as one of:

- `Completed foundation`
- `Accepted product boundary`
- `Active implementation track`
- `Maintenance track`
- `Discovery track`
- `Historical context`

## Current Repo Truth

- The repo currently ships 7 registered systems.
- The documented repo-wide verification baseline is green as of May 30, 2026 via `npm run verify` under Node `20.19.0`. Verification claims and scripted re-checks must stay tied to the supported runtime policy (`20.19+`, `22.12+`, or `24+`). Since then, CI is the authority for the full gate: `.github/workflows/ci.yml` runs the full `npm run verify` (including Playwright e2e on chromium and firefox) on every main merge, and the latest main merge (`b0f0371`, 2026-07-10) was green end-to-end.
- Netlify is the canonical deployment target represented in repo docs and CI.
- The app is **local-first with an optional cloud sync layer**. Signed-out users and users without Supabase env vars configured behave exactly as the historical browser-local product: IndexedDB primary, localStorage fallback, dual-write persistence. Signed-in users get character-document and campaign sync against Supabase with per-user RLS, last-writer-wins merge semantics, offline queueing, realtime change propagation, and exponential-backoff retry on transient failures. The shipped design is documented in `docs/rfc/001-backend-sync.md`.
- Loader-backed counts and support summaries live in `docs/generated/roadmap-metrics.md` and `docs/generated/roadmap-metrics.json`. Narrative docs should summarize them, not compete with them, and must stay aligned with the metadata-backed selector/dashboard summary path already used in-app.
- Spell catalogs across 5e 2014/2024, D&D 3.5e, PF1e, and PF2e now share a normalized index/helper surface with alias-safe lookup, legacy d20 source-backed save/component/casting metadata, and a cross-system identity regression matrix. The only D&D 3.5e source-blocked spell exclusions are documented in the parity regression, and PF1e source-backed rows without a Saving Throw line are explicit fixtures. The shared spell browser derives levels from loaded data, so PF2e rank 10 is now a first-class browser path.
- Open-content compliance is enforced by an independent reverse-diff audit, not only the source-tag filter in `src/utils/openContentPolicy.ts`. `npm run srd:coverage` fetches the published open-content SRD lists and diffs them against the loaders (`docs/generated/srd-coverage.md`). This surfaced and removed non-SRD Player's Handbook and homebrew entries that had been mislabeled with an SRD source tag (5e feats, backgrounds, spells, and 2024 species), and now guards against re-introduction. Authoritative denominators are cited in `docs/srd-sources.md` (notably the SRD 5.2 spell list, which genuinely differs from SRD 5.1).
- Per-system derived-rules math is enumerated and test-pinned in the compute registers under `docs/compute-register/` (a cross-cutting L1–L10 model), levelled to even depth across all seven systems so the math is available for downstream calculation. Exact counts live in `docs/generated/roadmap-metrics.md`.
- The completion goal is two-denominator, mirrored here (2026-07-14) so it is roadmap-authoritative: every system is measured on **content%** (Denominator A — `docs/srd-manifest/` catalogs joined against loaded data) and **compute%** (Denominator B — `docs/compute-register/` verified engine math), reported per system in `docs/generated/roadmap-metrics.md`, with manual boundaries enumerated in `docs/srd-manifest/_exclusions.ts` so the metric cannot be gamed. `docs/GAPS.md` is the adopted tracking document for the outstanding gaps and the GLOBAL DONE criteria.
- Shared controller/section convergence is already shipped across the active sheet hosts for 5e, PF2e, legacy d20, M&M, and Daggerheart. The 5e host closeout is regression-gated by the sub-400-line host budget and shared-host behavior tests, not another decomposition project.
- The next major product program is the system-agnostic rules IR and deterministic effect resolver (`docs/rfc/003-rules-ir-and-effects.md`), and on top of it rule truth, provenance, executable activities, and guided creation for all seven systems equally. It is not a cosmetic wizard and it is not just an AI spike: it is a multi-phase implementation program across a shared effect resolver, per-system effect compilers, validation, derivation, action execution, draft persistence, template application, and UX — built once and applied to every system rather than deepened one system at a time.
- The app is currently a local-first multi-system character sheet built around `CharacterDocument`, `SystemEngine`, loader-backed data, template applicators, campaigns, import/export, and optional Supabase sync. It now also has a provider-free scene-runtime substrate in code: `SceneDocument`, browser-local scene storage, typed scene actions/events, a pure fold from initial scene plus append-only events to current state, seeded RNG helpers, and a first visible manual scene/grid manager for local scenes, tokens, markers, initiative, scene import/export, queued loader-backed monster encounter seeding across the d20 systems (5e 2014/2024, 3.5e, PF1e, PF2e — with 3.5e Encounter-Level budgeting honestly reported as unsupported), and party-level XP preview. It is not yet a full VTT/game-runtime app.
- AI-assisted play is now partially shipped, not merely planned (updated 2026-07-14). Live in the repo: a server-side provider gateway (`netlify/functions/ai-gateway.mts`, Vercel AI SDK + Gemini) shipping default-off behind `VITE_AI_ENABLED` with fixture replay and key-less degradation; AI encounter drafting gated by the shipped encounter-spec validator (`src/scene/encounterSpec.ts`); read-only recap narration; image-based creature identification; scene illustration; and the deterministic local tactical executor (`src/rules/tactical/tacticalExecutor.ts`, no LLM in the per-turn hot path). Still genuinely open: the LLM strategist blackboard, the narration critic, observability/cost controls, the full map-asset pipeline, grid-geometry automation, and any "make me a game" orchestration — and the repo still has no Foundry-style modifier registry. The constraint set is unchanged: AI proposes drafts and read-only artifacts, deterministic validators decide, and no AI path mutates character, scene, or campaign state directly.

| System | Support level | Current repo truth |
| --- | --- | --- |
| D&D 5e (2024) | Full | Shared 5e sheet, loader-backed SRD content, subclass selection, feat ASI/proficiency automation, by-level always-prepared spell data |
| D&D 5e (2014) | Full | Shared 5e sheet, loader-backed feature-option browsing/persistence, provenance-first downstream effects, by-level always-prepared spell data |
| Pathfinder 2e | Full | Native sheet, loader-backed backgrounds/archetypes, native controller split from sheet host, focus-spell manual surface, dynamic rank-10 spell browsing; loader-backed monster catalog is product-reachable in the scene encounter UI (since 2026-06-12) and participates in encounter budgets |
| D&D 3.5e | Full | Shared legacy sheet, full core prestige catalog is selectable, canonical 610-spell loader-backed catalog with alias-safe class-stub duplicate collapse, source-backed legacy spell metadata, deterministic spells-per-day (casting-ability, cleric domain, wizard specialist, and prestige/Dragon-Disciple bonus slots), synergy/encumbrance/gear skill resolution, equipped-armor AC; Vancian prepared-slot assignment and spontaneous conversion remain accepted manual boundaries; loader-backed core SRD monster catalog is product-reachable in the scene encounter UI (since 2026-06-12), with Encounter-Level budgeting honestly reported as unsupported |
| Pathfinder 1e | Full | Shared legacy sheet, vetted prestige support is product-reachable, raw `levelsByClass` and source-backed legacy spell metadata live in spell files, deterministic spells-per-day (casting-ability, cleric domain, wizard specialist, and prestige/Dragon-Disciple bonus slots), class-skill/encumbrance/gear skill resolution, equipped-armor AC; Vancian prepared-slot assignment and spontaneous conversion remain accepted manual boundaries; loader-backed Bestiary monster catalog is product-reachable in the scene encounter UI (since 2026-06-12) and participates in encounter budgets |
| M&M 3e | Full | Native point-buy sheet, archetype pinning, complications insertion, modifier catalog reachability |
| Daggerheart | Full | Native sheet, SRD-backed selectors/templates/libraries/domains/domain cards/equipment, loadout-vault persistence, export/import roundtrip, and deterministic passive automation (evasion, armor, thresholds, spellcast, traits) from class/ancestry/equipment/passive cards; triggered/narrative card resolution is GM-adjudicated by design, an enumerated accepted boundary |

**All seven systems are now `Full`.** Each system's deterministic creation+play loop auto-resolves RAW; the residual manual surfaces — e.g. Vancian prepared-slot assignment and spontaneous conversion for the d20 casters, triggered/narrative Daggerheart card effects, and M&M freeform power descriptors — are enumerated accepted boundaries in `docs/srd-manifest/_exclusions.ts`, never unfinished automation. A system reads `Full` when its only residual gaps live in that registry.

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
- `AI draft/action boundary`: AI-generated character data and content are draft input only. AI-DM action proposals can become state changes only by passing through typed actions/events, deterministic TypeScript validation, and the same reducer/resolver path as player actions.
- `No browser-bundled provider secrets`: shared-provider AI calls require a separate backend/RFC path, such as a Netlify Function with environment-held credentials. The browser bundle must not ship OpenAI, Anthropic, Gemini, or similar provider secrets.
- `No stack rewrite for AI or forms`: BAML, Zod, Zustand, Dexie, RAG embeddings, Promptfoo, RJSF, constrained local decoding, and similar tools are not active baseline dependencies. They require an RFC or phase-specific justification after repo-native primitives prove the need.
- `No direct AI-DM mutation`: AI-DM work cannot mutate character, scene, or campaign state directly. It must propose typed actions or events that deterministic TypeScript validators accept before any persisted state changes.
- `No LLM hot-path mechanics`: LLMs must stay out of mechanical resolution loops. Mechanics resolve deterministically first; AI narration, critique, or strategy hints may run afterward or asynchronously.
- `Provider details are planning inputs`: model names, prices, capability tables, and provider-specific routing claims are not roadmap commitments. Pin and benchmark any future model choices inside an accepted AI RFC, not in the master-plan narrative.
- `AI-DM dependencies are phase-scoped`: Vercel AI SDK, Langfuse, image generation, vector memory, tactical AI, grid registration, and vision-analysis dependencies are valid candidates for the AI-DM track, but each must land only in the phase that consumes it with a focused integration note, tests, and local-first fallback.
- `No content-pack rewrite`: current loaders, source filtering, generated metrics, source manifests, and system registry remain canonical. Do not replace the data tree with a Foundry-style pack architecture unless a future plan proves loader/reporting parity and migration safety.
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
- `Completed foundation`: the additive spell-preparation contract is shipped across the prepared-caster systems that currently use it. Shared 5e distinguishes tracked, prepared, always-prepared, and manual edges with by-level deterministic grant data; PF2e preserves native rank preparation with structured always-prepared and focus-spell manual surfacing; legacy d20 preserves tracked spells, Vancian prepared-slot assignment, and manual extra-slot/reference tracking.
- `Completed foundation`: the spell-catalog parity baseline is shipped across all five spell systems. Shared catalog helpers, spell-id alias resolution, PF1e raw `levelsByClass`, PF2e raw `traditions`, PF2e rank-10 browser support, legacy d20 save/component/casting metadata, and cross-system alias/class/iconic identity regressions are now in the repo.
- `Completed foundation`: 5e subclass selection, multiclass handling, feat ASI/proficiency automation, and 5e-2014 feature-option browsing/persistence are shipped.
- `Completed foundation`: the 5e host closeout is shipped as a shared-host contract. `Dnd5eSheetBase.tsx` remains a host shell under the existing size budget, and 2014/2024 preparation, feat, and feature-option behavior stays in the shared controller path.
- `Completed foundation`: PF2e loader-backed backgrounds and archetypes are shipped.
- `Completed foundation`: PF2e native prepared-slot persistence, focus-spell manual display, structured always-prepared surfacing, and condition/defense honesty are regression-gated.
- `Completed foundation`: D&D 3.5e core prestige classes and PF1e vetted prestige classes are product-reachable.
- `Completed foundation`: legacy d20 prestige spellcasting, Vancian preparation, and deterministic domain/specialist/Dragon-Disciple bonus-slot counting are regression-gated inside the shared `d20-legacy` path. The former 3.5e/PF1e no-monster reporting boundary was superseded on 2026-06-12, when loader-backed monster catalogs became product-reachable (see the Cross-Repo maintenance track and RFC 004). Only prepared-slot assignment and spontaneous conversion remain manual, as accepted boundaries.
- `Completed foundation`: M&M archetypes, complications, and power modifiers are product-reachable as reference surfaces, with pinned archetypes explicitly prevented from auto-building powers, skills, point totals, or PL caps.
- `Completed foundation`: Daggerheart now has a real versioned data tree, dedicated types, dedicated loaders, selector-backed sheet surfaces, starter templates, browse tabs, loadout/vault persistence, unresolved/manual fallback handling, import/export roundtrip coverage, automation badges/support notes, and deterministic passive stat derivation.
- `Completed foundation`: Daggerheart deterministic passive automation is bounded by the existing metadata model. Current passive coverage includes exact flat bonuses, existing armor/unarmored/loadout-count conditions, existing derived bonuses, and source-exact mappings such as Arcana Telekinesis spellcast and Bone I See It Coming evasion.
- The provider-free AI control-plane scaffolding and the guided-creation draft substrate were removed on 2026-05-30: both were orphaned (reachable from no UI) and the AI gateway was a non-functional stub. At that time the AI-DM and guided-creation tracks below remained future work; the AI port and its first task surfaces later shipped (2026-06-19) from the deterministic foundation, not from the removed scaffolding.
- `Completed foundation`: rule validation and provenance primitives have begun landing as repo-native code. The registry can expose system validators, 5e 2014/2024 validators return structured issues, contribution-ledger rows can explain selected 5e/Daggerheart/M&M derived values without changing persisted documents, and selected D&D 5e activities execute through local typed definitions instead of a repo-wide action bus.
- `Completed foundation`: scene-runtime substrate and first visible manual scene/grid slices exist. `SceneDocument` storage, import/export helpers, append-only event fold, seeded replay helpers, typed scene action validation, local scene persistence, grid rendering, manual token placement/movement, terrain/hazard markers, initiative controls, deterministic loader-backed encounter initialization (D&D 5e first, joined by the 3.5e/PF1e/PF2e monster catalogs on 2026-06-12), queued multi-monster encounter composition, and party-level XP preview are implemented with focused tests; the deterministic tactical executor landed later (2026-05-31, with scene-round wiring complete by 2026-06-10/12) and the first AI task surfaces later still (2026-06-19) — see the scene-runtime track — while the LLM strategist and observability/cost layers remain open.

## Accepted Product Boundaries

- `Accepted product boundary`: 5e feat automation remains partial by design. Supported ASIs and proficiencies are automated; most other feat riders remain manual.
- `Accepted product boundary`: 5e-2014 feature-option catalogs are provenance-first and persistence-first. Browsing and selection are shipped; every downstream rule rider is not automatically applied.
- `Accepted product boundary`: M&M archetypes remain reference-only. They can be pinned and reviewed in-sheet, but they do not auto-build powers, skills, or point totals.
- `Accepted product boundary`: Daggerheart's deterministic automation is bounded by the existing metadata model; triggered, timing-based, choice-based, and narrative card resolution is GM-adjudicated by design (an enumerated accepted boundary), not full card-resolution logic.
- `Accepted product boundary`: triggered, timing-based, rest-based, choice-based, and narrative Daggerheart card effects remain `triggered-manual` or `reference-only` unless they can be represented deterministically in the existing passive metadata model.
- `Accepted product boundary`: generic controller/form abstraction work is not backlog by default. System-local controllers and sections are preferred until multiple concrete consumers justify extraction.
- `Accepted product boundary`: shared rule, provenance, activity, or form abstractions require at least 3 named concrete consumers and an explicit extraction target. A single-system pilot must stay system-local.
- `Accepted product boundary`: guided creation must produce normal `CharacterDocument` data through existing template applicators and validators. It must not introduce a parallel character schema, bypass loaders, or require Supabase.
- `Accepted product boundary`: AI-assisted creation, if later approved, must send loader-derived candidate pools and receive structured draft data only. The client must validate and apply the draft deterministically; the model must not decide RAW legality.
- `Accepted product boundary`: hybrid species fusion and other generated homebrew are not active scope. Entry requires deterministic validation, provenance/explanation support, open-content/name-policy safeguards, and explicit UI that the result is homebrew/not RAW.
- `Accepted product boundary`: docs should describe current support honestly even when a system is intentionally manual in places.

## Active Implementation Tracks

### Rule Truth, Provenance, Activities, And Guided Creation

> **Direction update (2026-05-31): system-agnostic, all-seven-equal sequencing.**
> The phase table further down in this section was originally written
> D&D-5e-first (a "5e validation depth" pass, a "5e activity pilot," a "5e 2024
> wizard" as the first user-visible creator). That sequencing is **superseded**.
> Under the locked-in direction, all seven systems are equal and the foundation
> is the shared rules IR + effect resolver in `docs/rfc/003-rules-ir-and-effects.md`
> (Accepted). The corrected critical path is:
>
> 1. **Phase 0 — IR + resolver (additive, isolated).** Define the system-agnostic
>    `EffectInstance` shape plus stacking/operation grammar; implement the pure
>    deterministic resolver fold and the contribution-ledger view; prove the
>    cross-system worked encodings (5e magic weapon, PF2e three-bucket stack,
>    3.5e enhancement, PF1e size+enhancement, M&M cost, Daggerheart threshold).
>    New files only; no engine changes.
> 2. **Phase 1 — the cross-system proof point.** Each of the seven systems gets an
>    `effectCompiler`; equipment shapes gain optional bonus fields (additive, not
>    a content-pack rewrite); every engine routes AC and new attack/damage through
>    the shared resolver. Acceptance: equipping an item resolves attack, AC,
>    magical bonuses, and feats deterministically through one resolver,
>    **identically in all seven systems**, with the ledger naming the source, and
>    non-magic outputs unchanged.
> 3. **Phase 2 — conditions as IR** across all systems with condition rules.
> 4. **Phase 3 — ledger unification** (re-back existing ledger builders onto the
>    resolver; existing ledger tests pass unchanged).
> 5. **Phase 4 — functional terrain + seeded scene resolution.**
> 6. **Phase 5 — grounded AI seam** (candidate pools from loaders + resolver
>    legal actions; validators for all seven systems; server-side draft gateway
>    with fixtures and a no-keys fallback).
>
> Any creation UI is system-agnostic by construction: it renders the choices a
> system's loaders and validators expose, so it serves all seven equally. The
> 5e-named rows in the legacy table below are retained as historical context and
> should be read as "first test fixture," not "privileged path." The
> anti-overengineering "three named consumers before extraction" rule is
> satisfied immediately and overwhelmingly: seven effect compilers feed one
> resolver.
>
> **Per-phase actuals (2026-07-14):**
> - **Phase 0 — DONE.** The IR (`src/rules/ir/`), the pure resolver fold
>   (`src/rules/resolver/resolve.ts`), and the contribution-ledger view
>   (`src/rules/ir/ledgerView.ts`) all exist with cross-system worked-encoding
>   and determinism tests.
> - **Phase 1 — DONE for the additive-shaped systems; the remaining two are an
>   accepted architectural boundary (reviewed 2026-07-15).** A shared
>   systemId-parameterized compile layer (`src/rules/compile/`) feeds one
>   additive resolver (`resolveCharacterEffects` — additive by design: it turns
>   equipped items + feat/feature modifiers into per-target *sums*). All 5 d20/
>   PF2e engines route AC (and d20 attack) through it in engine code, so the
>   "equip resolution identical across systems" proof point holds for every
>   system whose equipment contributes additive typed bonuses. The Daggerheart
>   and M&M 3e engines are **intentionally not routed**: their derived defenses
>   are not additive-bonus-shaped. Daggerheart's `getDaggerheartDerivedStats`
>   uses conditional base *overrides* (`unarmored-defense-by-tier`, max-combined
>   across cards), attribute-*derived* terms (`evasion-half-trait` = ⌊trait/2⌋),
>   and proficiency/tier terms the additive resolver cannot express; M&M defenses
>   (ability + purchased rank + power contributions) *could* route but only by
>   synthesizing modifier sources from powers and widening the shared compiler's
>   target vocabulary — real regression risk on a working, well-tested engine for
>   no user-visible change. Forcing either buys marginal, partial unification at
>   real cost, so both stay on their bespoke (test-pinned) derivation. Equip
>   parity for the additive systems is covered by `equipParity.test.ts`.
> - **Phase 2 — PARTIAL.** IR condition catalogs cover all systems via the scene
>   dispatcher, but only the 5e engines replaced imperative rollCheck condition
>   math with resolver folds.
> - **Phase 3 — PARTIAL.** Only the 5e ledger is re-backed onto the resolver;
>   the Daggerheart and M&M ledger builders still hand-build entries.
> - **Phase 4 — PARTIAL (advancing).** Seeded scene resolution shipped, and
>   functional terrain is now authorable and resolves across every system: the
>   marker-creation flow offers cover / high-ground presets (2026-07-16), and
>   `resolveSceneAttack` folds a cell's terrain effects into every system's
>   manual attack branch (d20/5e/PF2e, M&M, and Daggerheart) — terrain at the
>   attacker's cell joins the attack effects (e.g. high ground), terrain at the
>   target's cell that raises the defense value models cover (+AC / +Dodge /
>   +Parry / +Evasion), with the effective defense reported in the combat log.
>   Additive (a cell with no terrain resolves identically). Remaining:
>   movement-cost/difficult-terrain in `runSceneRound` — autonomous rounds via
>   `buildSceneCombatants` do not yet apply terrain.
> - **Phase 5 — PARTIAL.** The grounded gateway ships, but validators exist for
>   only 2 of 7 systems and there is no resolver legal-actions seam.

- `Active implementation track`: this is the main research-informed build program. It should be treated as a large product and architecture effort, not a small enhancement. The work touches `src/registry/types.ts`, `src/registry/index.ts`, `src/types/core/document.ts`, system engines, template handlers, loader-backed data, import/export behavior, local draft persistence, and visible sheet/wizard UX.
- `Active implementation track`: keep the current repo stack while building the missing primitives. React/Vite/npm, the system registry, per-system engines, loader-backed SRD data, browser-local persistence, optional Supabase sync, and Netlify remain the implementation frame. External research informs the shape of validation, structured draft output, and form/action modeling, but does not authorize a stack replacement.
- `Active implementation track`: AI expansion enters through the control-plane contract in `docs/rfc/002-ai-control-plane.md`. That RFC defines AI as a server-side, task-scoped drafting/orchestration layer over existing automation: candidate pools come from loaders, validation owns legality, accepted drafts use normal template/document handlers, and missing provider keys leave deterministic creation fully functional.
- `Active implementation track`: implementation must be incremental and testable. Each phase below should land behind repo-native tests before the next phase depends on it. README and STATUS updates wait until user-visible capability ships; `docs/MASTER_PLAN.md` remains the planning source during the build.

| Phase | Workload signal | Primary surfaces | Deliverable | Acceptance |
| --- | --- | --- | --- | --- |
| 0. Constraints/RFC Intake | Required first step, docs-only but decision-heavy | `docs/rfc/`, `docs/MASTER_PLAN.md` | RFC that translates the external research into repo-native decisions: validation owns legality, AI is draft-only, browser secrets are forbidden, loaders remain canonical, and shared abstractions need real consumers | `npm run check:doc-drift`, `npm run check:repo-hygiene`; no runtime code changes |
| 1A. Validation Registry | New core contract | `src/registry/types.ts`, `src/registry/index.ts`, system definitions | Per-system validation entry point parallel to `SystemEngine`: document plus context in, structured issues out | Unit tests prove systems can opt in without changing persistence or sync schema |
| 1B. D&D 5e Validation Depth | First large rules pass | `src/systems/dnd5e/`, `src/systems/dnd5e-2024/`, `src/systems/dnd5e/shared/`, 5e loaders/templates | 2014/2024 validators for ids, level bounds, class/subclass availability, point-buy or standard-array choices, spell references, prepared limits, feat choices, and open-content source compliance | Valid and invalid 5e fixtures; import/export preserves documents; validators warn/annotate rather than globally blocking edits |
| 2A. Contribution Ledger Contract | New derived explanation primitive | system engines, sheet state builders, shared tooltip/breakdown UI | Non-persisted ledger entry shape for derived contributions: id, system, target, source, label, operation, value, category, and manual boundary | Tests prove ledgers do not alter stored document shape and can be generated from prepared documents |
| 2B. Ledger Consumers | Cross-system proof before any abstraction grows | 5e shared engine/templates, `src/systems/daggerheart/`, `src/systems/mam3e/powerMath.ts` | Breakdowns for 5e AC/proficiencies/spell grants, Daggerheart passive bonuses, and M&M power modifier cost math | Computed totals equal existing engine outputs; each ledger row identifies its source and whether manual interpretation remains |
| 3. D&D 5e Activity Pilot | System-local action execution, not a universal bus | 5e feature-option and feat surfaces, 5e document update handlers | Local activity/action definitions for selected 2014 feature options or feat riders that currently only mirror text into `features`; definitions include inputs, eligibility, costs, outputs, and manual-boundary copy | Selection persistence still works; existing feature-option tests pass; atomic updates use current handlers; unsupported downstream automation is visibly manual |
| 4A. Wizard Architecture | New UX and draft state | character creation entry points, local storage layer, template handlers | Deterministic guided-creation shell with resumable local drafts, step state, validation display, and final `CharacterDocument` output | Draft resume tests, reset/cancel tests, no Supabase dependency, no new remote schema |
| 4B. D&D 5e 2024 Wizard Path | First user-visible guided creator | 5e 2024 loaders/templates, ability/spell/equipment surfaces where supported | Non-AI wizard for system selection, class, species, background, choices, ability planning, spells, and equipment where current data supports it | Template application tests, validation failure display, import/export roundtrip, existing 5e engine/template regressions |
| 4C. D&D 5e 2014 Reuse | Compatibility pass, not a fork unless necessary | 5e 2014 loaders/templates and shared 5e wizard components | Reuse the 2024 wizard flow where the validation surface stays compatible; isolate only edition-specific steps | 2014 fixture coverage for class/species/background/feat/feature-option paths; no regression to 2024 flow |
| 5. Optional AI Draft Adapter | Optional spike after deterministic wizard works | Netlify Functions, loader-derived candidate pools, validation registry | RFC and spike for one shared-provider path. Client sends prompt plus candidate pools; server returns structured draft; client validates and applies templates. Native provider JSON Schema is the default first path | Missing API key leaves deterministic wizard fully functional; recorded fixtures cover CI; max 2 repair attempts with machine-readable `ValidationIssue[]`; session cost caps |
| 6. Deferred Homebrew/Fusion | Explicitly blocked until foundations exist | validators, ledger, open-content policy, homebrew UX | Research plan for hybrid species/homebrew only after validation, provenance, name-policy, and homebrew/not-RAW UX are real | No generated homebrew mutates shipped SRD data; no balancing point system lands without a separate acceptance plan |

- `Active implementation track`: Phase 1 is the first real code gate. Until the validation registry exists, AI repair has no machine-readable error loop, and import warnings cannot distinguish malformed data from merely manual data.
- `Active implementation track`: Phase 2 is the second real code gate. Until the ledger exists, the app cannot explain why a value changed and cannot safely promote one-off activity outputs into shared derived behavior.
- `Active implementation track`: the contribution-ledger primitive and a deterministic effect resolver are two views of one shape — explaining a value versus producing it. `docs/rfc/003-rules-ir-and-effects.md` (Accepted) unifies them into a system-independent, system-agnostic rules intermediate representation. It is the connective tissue under this track's ledger work and the scene runtime's resolution and functional-terrain phases. The anti-overengineering "at least three named consumers before extraction" rule is satisfied immediately and overwhelmingly: seven per-system effect compilers feed one shared resolver. It is a connective-layer specification, not a new track.
- `Active implementation track`: Phase 3 deliberately stays D&D 5e-local. The goal is to learn what executable feature/action definitions need in this repo before extracting a shared contract. Graduation requires Daggerheart triggered/manual cards and one additional system to need the same input/eligibility/cost/output shape.
- `Active implementation track`: Phase 4 is optional and subordinate to the automation foundations. AI can speed up drafting only after validation, candidate-pool construction, and template application are already working without it.
- `Active implementation track`: the critical path is Phase 0 -> Phase 1A -> Phase 1B -> Phase 3. Phase 2 can begin after Phase 1A, Phase 3 should wait for at least the first 5e validator and ledger shape, and Phase 4 must wait for working validation and ledger infrastructure.
- `Active implementation track`: final verification for each implementation phase includes targeted Vitest suites plus the relevant existing engine/template/browser regressions. Before merging a phase, run `npm run verify` under a supported Node runtime unless the phase is explicitly docs-only.

Research anchors for this track: SRD 5.2.1 and CC-BY status at https://www.dndbeyond.com/srd/; OpenAI Structured Outputs at https://platform.openai.com/docs/guides/structured-outputs; Gemini structured output and validation guidance at https://ai.google.dev/gemini-api/docs/structured-output; Anthropic JSON-schema tool use at https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/implement-tool-use; BAML generated client behavior at https://docs.boundaryml.com/guide/introduction/baml_client; vLLM/XGrammar structured output at https://docs.vllm.ai/usage/structured_outputs.html; RJSF form/widget behavior at https://rjsf-team.github.io/react-jsonschema-form/docs/.

### Scene Runtime, AI-DM Control Plane, And Generated Encounters

- `Active implementation track`: this is the next large product expansion after the character-creation/rule-truth substrate starts landing. It is not discovery. The work is to build the deterministic game-runtime layer that the AI-DM research assumes, then put AI orchestration above that layer without giving the model direct write access.
- `Active implementation track`: this track must stay honest about current repo shape. The baseline now includes character documents, campaigns, loaders, engines, templates, browser-local persistence, optional Supabase sync, monster catalogs, the scene runtime with encounter state, the manual scene/grid UI, the deterministic tactical executor, and the server-side AI gateway (`netlify/functions/ai-gateway.mts`) with its first task surfaces. What must still be added deliberately: the LLM strategist, observability/cost controls, and the map-asset/grid-geometry remainders (see the phase table below).
- `Active implementation track`: every phase must remain usable without provider keys. The deterministic runtime, manual scene tools, encounter builder, replay, import/export, and local tactical executor are product features on their own; AI improves authoring and narration after the deterministic surface exists.
- `Active implementation track`: AI-DM integration follows the same control-plane contract as AI character creation. Prompted encounter specs, map/vision proposals, tactical strategy hints, and narration are structured drafts or read-only artifacts until deterministic validators, typed scene actions, and replayable events accept them.

Per-phase status markers (as of 2026-07-14): **shipped** = phase complete; **slice** = a first slice shipped, the phase's core deliverable remains open; **open** = not started.

| Phase | Workload signal | Primary surfaces | Deliverable | Acceptance |
| --- | --- | --- | --- | --- |
| 0. Runtime Architecture RFC — **shipped** (`docs/rfc/006-scene-runtime.md`, Accepted, written retroactively) | Decision-heavy implementation kickoff | `docs/rfc/`, `docs/MASTER_PLAN.md` | RFC for scene documents, event sourcing, seeded replay, sync/import/export impact, and how scene state relates to campaigns and character documents | Docs checks pass; RFC names storage keys, event ownership, migration policy, and first supported system |
| 1. Scene Documents & Storage — **shipped** | New persisted product family | core types, storage hooks, campaign manager, import/export | `SceneDocument` or equivalent persisted scene model associated with a campaign/system, with browser-local storage, export/import, and no Supabase requirement | Scene create/edit/delete tests; import/export roundtrip; existing character/campaign storage tests unchanged |
| 2. Event Log, Fold, And Seeded Replay — **shipped** | Deterministic game-runtime core | scene runtime utilities, seeded RNG helper, replay tests | Append-only scene event log plus pure fold from initial scene + events to current scene state; seeded RNG streams for repeatable rolls/tie-breaks | Same seed + same event log yields byte-identical state; invalid events fail validation; no `Math.random` in runtime core |
| 3. Typed Action/Event Boundary — **shipped** | Mutation surface for players and AI | scene action validators, system adapters, activity pilot outputs | Typed action intents convert to validated scene events; all player UI and future AI tools use this path instead of mutating scene state directly | Invalid move/attack/use-feature intents return structured errors; valid intents emit auditable events; undo/replay remains deterministic |
| 4. Manual Scene/Grid MVP — **shipped** | First visible VTT slice | scene UI, grid renderer, token state, terrain/hazard state | Manual combat scene with grid, tokens linked to characters/monsters, initiative order, terrain/hazard markers, and event-log-backed placement/movement | Users can create a scene from a campaign, place tokens manually, move tokens, edit hazards, export/import, and replay to same state |
| 5. Encounter Builder V1 — **shipped** (spawn zones, +/- rebalance, spec validation included) | Loader-backed encounter creation | 5e monster loaders, campaign party data, scene initializer | Deterministic encounter builder that selects loader-backed monsters, creates tokens, seeds initiative, and initializes a manual map/grid scene | No invalid monster ids; open-content policy enforced; generated scene events replay; manual correction remains available |
| 6. Resolution & Narration Split — **shipped** (deterministic recap + read-only narration) | Mechanics/narration boundary | resolvers, event result artifacts, narration panel/pacer | Two-phase action resolution: deterministic mechanics first, then read-only narration/stub text tied to the resulting events | LLM absence does not block mechanics; narration cannot alter results; tests prove mechanics remain authoritative |
| 7. Server-Side AI Port — **shipped** (2026-06-19) | First provider integration layer | Netlify Functions, provider config, fixtures, telemetry hooks | Server-only AI gateway with task classes, capability flags, structured-output support, retries, prompt-cache-aware templates, recorded fixtures, and no browser secrets | Missing env keys degrades to deterministic/manual flow; fixture replay works in CI; provider errors normalize to typed failures |
| 8. AI Encounter Spec Drafting — **shipped** (2026-06-19) | First AI authoring loop | AI Port, loader candidate pools, encounter validator | Prompt-to-structured encounter spec using loader-derived valid ids, deterministic validation, repair attempts, and manual approval before scene creation | Invalid ids rejected; max repair budget enforced; accepted spec creates the same event-backed scene as manual builder |
| 9. Generated Map Pipeline MVP — **slice** (scene illustration only; map-asset/grid pipeline open) | Multimodal authoring slice | image asset storage, map UI, grid setup | Optional map image generation or import by hash, manual grid registration, manual token/hazard placement, and event-log references to the map asset | No provider key required; image asset survives export/import; user can correct grid manually; scene replay references same asset hash |
| 10. Vision/Grid Automation — **slice** (creature identification only; grid-geometry automation open) | Geometry automation after manual fallback | vision adapter, grid registrar, geometry validator | Optional image analysis that proposes grid, spawn, terrain, cover, and hazard boxes; deterministic geometry validator accepts, rejects, or asks for manual correction | Boxes outside image/grid rejected; max retry budget; manual registration remains the fallback; accepted analysis emits normal scene events |
| 11. Tactical AI Executor — **shipped** (`src/rules/tactical/tacticalExecutor.ts`) | Local tactical autonomy | utility scoring, influence maps, pathfinding, action validators | Local utility/influence/behavior executor that chooses valid NPC actions under seeded replay; no LLM in per-move hot path | NPC turn resolves under latency budget; action choices replay with seed; invalid choices fall back to next valid utility action |
| 12. LLM Strategist Blackboard — **open** | Hybrid strategy layer | AI Port, tactical blackboard, scene snapshots | Async LLM strategist that writes intent/weight hints every N turns or on triggers; local executor remains authoritative for moves | Stale/missing strategist output falls back to defaults; hints cannot create illegal actions; no turn blocks on an LLM call |
| 13. AI-DM Narration & Critic — **slice** (narration shipped; critic open) | Cinematic layer | narration prompts, pacer, critic fixtures | Streamed narration from deterministic resolution artifacts plus optional critic that checks faithfulness and asks for one rewrite only | False mechanical claims are corrected or logged; critic cannot change events; p95/timeout fallback uses deterministic prose |
| 14. Observability, Evals, And Cost Controls — **open** | Required before broad AI use | prompt fixtures, trace metadata, cost counters | Prompt/template versions, recorded AI fixtures, golden trace shape tests, latency budgets, cost/session caps, and provider/model metadata | CI can run without provider calls; cost caps trip deterministically; trace ids connect events, prompts, responses, and user-visible output |

- `Active implementation track`: the critical path was Phase 0 -> Phase 1 -> Phase 2 -> Phase 3 -> Phase 4 -> Phase 5, and Phases 0-5 are complete per `docs/rfc/006-scene-runtime.md` — including map-aware spawn zones, manual rebalance ergonomics (per-monster +/- controls), and structured encounter-spec validation (`src/scene/encounterSpec.ts`), which gates both manual and AI drafting. The genuinely open deterministic-runtime gaps are 3.5e Encounter-Level budgeting (deliberately absent from `ENCOUNTER_BUDGET_SYSTEMS` in `src/scene/encounterDraft.ts`; validation honestly reports `unsupported-system`), scene backend sync, and the open phases below.
- `Active implementation track`: provider-backed AI begins in Phase 7 only because the model needs a safe tool surface first. That is not deferral; it is the ordered build path that prevents the model from inventing state outside the runtime.
- `Active implementation track`: image generation, vision analysis, tactical AI, and LLM narration are separate phases so each can be tested, disabled, retried, and replaced without collapsing the game loop.
- `Active implementation track`: the "make me a game" endpoint is not a single prompt. It becomes a product workflow assembled from Phase 5 encounter specs, Phase 8 AI drafting, Phase 9/10 map work, Phase 4/5 scene initialization, Phase 11/12 NPC behavior, and Phase 13 narration.
- `Shipped (2026-06-19)`: **Phase 7 (Server-Side AI Port)** and **Phase 8 (AI Encounter Spec Drafting)** are live — a provider-agnostic gateway (`src/ai/`, server adapter in `netlify/functions/`, Vercel AI SDK + Gemini), default-off behind `VITE_AI_ENABLED`, with fixture-replay CI, key-less degradation, and encounter drafting gated by the shipped encounter-spec validator. Three further task surfaces landed as the **first slices** of later modalities: recap narration (a Phase 13 narration slice, no critic yet), image-based creature identification (a Phase 10 vision slice, not grid/geometry automation), and scene illustration (a Phase 9 image-generation slice, not the map-asset/grid pipeline). **Phase 11 (Tactical AI Executor) shipped earlier (2026-05-31, with scene-round wiring and iterative penalty steps complete by 2026-06-10/12; combat-panel hardening followed 2026-06-18)**: `src/rules/tactical/tacticalExecutor.ts` runs one combatant's turn deterministically — pure utility scoring, seeded per-pair attack streams, SRD Multiattack, no LLM in the per-turn hot path — and is wired into the scene UI's combat panel. Still open on this track: the LLM strategist (12) and the observability/cost-control layer (14) — only a per-request timeout and key-less/error degradation exist so far — plus the unshipped remainders of the sliced phases: the full map-asset pipeline (9), grid-geometry automation (10), and the narration critic (13).
- `Active implementation track`: final verification for deterministic phases includes targeted Vitest replay/fold suites, import/export tests, storage tests, and relevant UI tests. AI phases add fixture replay, structured-output validation, timeout/fallback tests, and cost-cap tests.

Research anchors for this track: Vercel AI SDK provider abstraction and telemetry docs at https://ai-sdk.dev/docs/introduction and https://ai-sdk.dev/docs/ai-sdk-core/telemetry; OpenAI Structured Outputs at https://platform.openai.com/docs/guides/structured-outputs; Gemini structured output and image bounding boxes at https://ai.google.dev/gemini-api/docs/structured-output and https://ai.google.dev/gemini-api/docs/image-understanding; Anthropic tool schemas and prompt caching at https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/implement-tool-use and https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching.

### UI Shell Redesign

- `Active implementation track`: mirrored here (2026-07-14) from `docs/design/ui-shell-redesign-final-plan.md` (2026-07-08), the plan of record for the shell/IA redesign; `docs/design/ui-redesign-phase-build-specs.md` is the build-spec source. The locked phase spine: **Phase 1** declutter (handoff frame, total `useAppNav` nav union, compound sheet-open and five-writer scene-selection seams, creation-as-dialog, Export/Delete re-home, left scene-list-rail relocation, lazy-mount-then-keepalive `SceneManager`); **Phase 2** structural substrate (ShellContext reducer, keepalive SurfaceStage, pause/resume-with-reconcile on the shared sync engine); **Phase 3** shared five-tab dock plus bestiary eviction from the 5e sheet; **Phase 4** pointer-drag keystone with a two-part prototype gate; **Phase 5** per-system sheet eviction (click-to-add only, no sheet drop targets); **Phase 6** scene canvas (transform render, pan/zoom viewport, right-rail summon tray); **Phase 7** hardening, budgets, and the seam doc. Load-bearing invariant: `src/scene/runtime.ts` and its typed scene-action intents are never touched — every new gesture emits existing intents.
- `Shipped (Phase 1 COMPLETE — 2026-07-09 through 2026-07-14)`: Phase 1 shipped in three PRs. PR #30 (2026-07-09) landed the first slice — the `useAppNav` shell-nav union (with `surface:'scene'` + `selectScene`), `NewCharacterDialog`, header segment nav, sheet-open/close writer rewiring, the Alt+N repoint, ungated Import, and lazy-mount-on-first-visit for `SceneManager` — while deferring the rest. Those deferrals then ALL landed: PR #32 (2026-07-14) the five-writer scene-selection lift (`SceneManager` now takes controlled `selectedSceneId`/`onSelectScene`; `useAppNav.selectScene` is consumed), `LibraryScenesView`, the 18rem left-rail relocation, the task-12 suite rewrites (`capabilityScenarios.test.tsx` needed none — it is engine-level), and the plan-compliant keepalive (`visibility:hidden` + off-screen, replacing the forbidden `<div hidden>`); PR #33 (2026-07-14) the Export/Delete re-home + per-card roster controls + roster search, Alt+1/2/3 surface shortcuts, the task-11 `performance.mark`/`performance.measure` surface-switch instrumentation, the explicit `sceneManagerChunk` bundle guard (in `scripts/check-bundle-size.mjs`, classifying eager-vs-lazy from `dist/index.html`), and the eight `e2e/phase1-*.spec.ts` acceptance gates. No Phase-1 deferrals remain, and the keepalive deviation is resolved.
- `Active implementation track`: **Phase 2 is unblocked** — its three Phase-1 prerequisites (the scene-selection lift, `LibraryScenesView` + left-rail relocation, and a plan-compliant keepalive) are all merged. Phase 2 is the ShellContext reducer + keepalive `SurfaceStage` + pause/resume-with-reconcile on the shared sync engine (see `docs/design/ui-redesign-phase-build-specs.md`).

## Maintenance Tracks

### Cross-Repo

- `Maintenance track`: preserve the shipped additive spell-preparation workflow across systems that already encode prepared-caster data. Shared 5e keeps tracked/prepared/always-prepared/manual states, PF2e keeps native rank preparation plus structured always-prepared and manual focus-spell display, and legacy d20 keeps tracked spells, Vancian prepared slots, and manual extra-slot/reference state.
- `Maintenance track`: unresolved always-prepared ids must survive import/export and render as unresolved/manual rather than being dropped. Preserve export/import compatibility, native system data shapes, and the current no-new-canonical-spell-schema boundary.
- `Maintenance track`: keep spell-file parity floors and source-backed exceptions as regression contracts. Future spell-file changes must not weaken metadata floors, alias-safe lookups, PF1e raw `levelsByClass`, PF2e raw `traditions`, PF2e rank-10 browser support, or the documented D&D 3.5e/PF1e source-backed exceptions.
- `Maintenance track`: keep product reporting loader-backed. The D&D 3.5e and PF1e monster surfaces now satisfy this rule (updated 2026-07-14): both catalogs load through `loadMonstersForSystem` in `src/utils/dataLoader.ts` and are product-reachable in the scene encounter UI (since 2026-06-12), with PF1e participating in encounter budgets and 3.5e budgeting honestly reported as unsupported. The principle is unchanged: no system may show monster UI, monster categories, or reporting claims that are not loader-backed.
- `Maintenance track`: keep selection-heavy surfaces covered when adjacent work lands: 5e feature options, legacy d20 prestige layering, PF2e archetype/preparation persistence, M&M reference surfaces, and Daggerheart loadout/vault/import-export paths.

### Technical Remediation Closeout

- `Maintenance track`: mirrored here (2026-07-14) from `docs/REMEDIATION_PLAN.md` (Status: Active) so its remaining sequencing is roadmap-authoritative under the sole-authority rule. Phases 0–5 (truthful green build, real CI gating, dead-code cleanup, boundary parsing, deferred per-system data load, security/privacy hardening) are done. Still pending: **Phase 6 (slim docs/process)** — archive the superseded planning docs (PRODUCTION_PLAN, both EVIDENCE_LINKED_PARITY docs, DAGGERHEART_DATA_ORGANIZATION_PLAN) to a docs history folder and slim `docs/MASTER_PLAN.md` and `CONTRIBUTING.md` — and **Phase 7 (toolchain modernization)** — ESLint 8→9 flat-config migration first (ESLint 8 is EOL), then risk-ordered React 19, Tailwind 4, Vite 8, and runtime-pin reconciliation. Until Phase 6 executes, the Historical Provenance table below and the source-document list above intentionally still cite those docs in place.

### D&D 5e (2014 + 2024)

- `Maintenance track`: keep `src/systems/dnd5e/shared/Dnd5eSheetBase.tsx` a shared host shell under the existing size budget, and keep shared 5e spell-preparation behavior in the shared host/controller path rather than forking per edition.
- `Maintenance track`: encode always-prepared grants only when they are source-explicit, deterministic by level, and backed by shipped spell ids. Choice-based, unsupported, or source-blocked riders remain manual with honest copy.
- `Maintenance track`: supported feat ASIs and proficiency grants stay automated; manual-only feat riders and unsupported feature-option downstream effects stay labeled manual. Feature-option selections must continue to persist through reload and import/export without applying unsupported downstream rules.

### D20 Legacy (D&D 3.5e + PF1e)

- `Maintenance track`: keep all 3.5e/PF1e sheet work inside the shared `src/systems/d20-legacy` host/controller/template/resource path. Do not split these systems into separate sheet hosts, alternate loader roots, or another prestige/schema layer.
- `Maintenance track`: preserve the normalized 3.5e prestige catalog and PF1e vetted prestige subset. Prestige spellcasting layering, class-row replacement/removal, and stale derived spellcasting cleanup are regression concerns, not a new content-productization program.
- `Maintenance track`: cleric domain slots, wizard specialist-school slots, and Dragon Disciple bonus slots are auto-resolved into the spells-per-day totals (counts are deterministic from the build); the chosen arcane school persists and round-trips. Keep the genuinely manual extras — which specific spell fills a prepared slot, and spontaneous cure/inflict conversion — explicit and reference-only; do not auto-apply those cast-time choices.
- `Maintenance track`: include these systems in spell-preparation work only when the implementation supports their Vancian semantics rather than forcing a 5e-shaped model onto them.

### Pathfinder 2e

- `Maintenance track`: preserve native prepared-slot state by rank through class/template reapplication and import/export. Cantrips, focus spells, and unsupported preparation edges remain manual unless already represented as structured always-prepared ids.
- `Maintenance track`: keep condition and defense behavior honest. Static AC may reflect implemented armor/Dex interactions, while unimplemented roll-modifier claims must stay out of static defense copy and tests.
- `Maintenance track`: backgrounds and archetypes are already product-reachable; there is no separate PF2e reachability program unless a future master-plan update adds one.

### Mutants & Masterminds 3e

- `Maintenance track`: archetypes remain reference-only. Pinning an archetype must not mutate powers, skills, point totals, or PL caps.
- `Maintenance track`: keep regression coverage tight around pinned archetypes, inserted complications, manual custom complications, modifier cost math, and PL-cap warnings through import/export.
- `Maintenance track`: any future ergonomics work must preserve the current reference-only contract unless a separate archetype-application spec is written first.

### Daggerheart

- `Maintenance track`: Daggerheart's deterministic passive automation is bounded by the existing metadata model: `automationMode`, `passiveBonuses`, `passiveDerivedBonuses`, `passiveCondition`, `effectTags`, and `automationNote`. Triggered/narrative card resolution stays GM-adjudicated; do not fake-automate it.
- `Maintenance track`: do not add new Daggerheart automation type variants in maintenance. Cards needing unsupported condition kinds, token pools, reactions, rest timing, target state, roll-result handling, choices, or narrative resolution stay `triggered-manual` or `reference-only`.
- `Maintenance track`: passive cards must have a supported passive payload, automation note, and effect tags after normalization, and passive effects apply only from loadout, never vault.
- `Maintenance track`: deterministic coverage may expand only for exact mappings to existing flat evasion, Armor Score, threshold, Spellcast, or trait bonuses; existing `while-armored`, `while-unarmored`, and `loadout-domain-count-at-least` conditions; or existing derived bonuses such as half-trait evasion, proficiency severe-threshold bonus, and unarmored defense by tier.
- `Maintenance track`: keep selector-backed manual fallback, starter templates, browse tabs, burden/loadout rules, loadout/vault persistence, export/import roundtrip, automation badges, deterministic passive stat math, and manual/reference copy as the shipped baseline.

## Discovery Tracks

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
| `docs/rfc/002-ai-control-plane.md` | Active RFC — foundation and four task surfaces shipped (2026-06-19) | AI integration contract for frictionless creation and play: server-side task gateway, loader-derived candidate pools, deterministic validation/repair, user approval, typed action/event boundaries, fixture replay, and cost/timeout fallbacks |
| `docs/rfc/003-rules-ir-and-effects.md` | Accepted RFC | System-independent, system-agnostic rules intermediate representation and deterministic effect resolver that unify the contribution ledger with scene resolution across all seven systems equally, enabling RAW auto-resolution of equipment/feat/spell/condition effects, mechanical condition application, and functional terrain; first proof point is cross-system equip resolution; the three-consumer extraction rule is satisfied by seven per-system effect compilers, and the content-pack-rewrite prohibition still holds (the IR is computed from loaded data) |
| `docs/rfc/004-monster-product-surface.md` | Draft RFC, subsequently executed | Monster product surface plan for bestiaries beyond 5e; the plan it demanded was executed on 2026-06-12 (loader-backed D&D 3.5e, PF1e, and PF2e monster catalogs became product-reachable, with PF1e/PF2e participating in encounter budgets) without formal acceptance — the RFC records the original scope, constraints, and reporting boundaries |
| `docs/rfc/005-resource-pools.md` | Accepted RFC | System-agnostic resource-pool primitive and stateful action verbs; the primitive plus first consumers are implemented, with broader adoption landing incrementally |
| `docs/rfc/006-scene-runtime.md` | Accepted RFC | Scene-runtime architecture of record — scene documents, append-only event sourcing, and seeded replay — written retroactively as the Scene Runtime track's Phase 0; the runtime shipped, and the RFC names the next increments |

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
