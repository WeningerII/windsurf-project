# Project Status

This file is a current-state summary only. `docs/MASTER_PLAN.md` is the sole planning authority, and `docs/generated/roadmap-metrics.md` remains the authoritative count source.

**Last repo-wide verification:** May 30, 2026 via `npm run verify` under Node `20.19.0`. CI is the standing authority for the full gate: `.github/workflows/ci.yml` runs the complete `npm run verify` — including Playwright e2e on chromium and firefox — on every pull request and every push to `main`. No "latest green" commit is named here: a SHA pinned in prose rots at every merge, and the one that stood here until 2026-07-26 had 64 merges pass it.

## Current Product Snapshot

- 7 registered systems are live in the registry.
- Netlify is the canonical deployment target.
- The app is local-first with an optional cloud sync layer. Signed-out and unconfigured paths remain pure browser-local (IndexedDB primary, localStorage fallback, dual-write persistence). Signed-in users on a configured Supabase project get per-user document and campaign sync with offline queueing, realtime change propagation, and exponential-backoff retry. See `docs/rfc/001-backend-sync.md` for the shipped design.
- **Scenes** are browser-local and provider-free end to end. A manual scene/grid manager creates scenes against a campaign/system; tokens are placed and moved through typed scene events; encounters seed from loader-backed monster catalogs, with the five d20 systems under cited encounter budgets and Daggerheart adversaries fieldable as monster-kind tokens. Terrain markers are *functional*, not decorative — cover, high ground and difficult terrain resolve in scene combat across all seven systems and slow autonomous movement. Scenes import/export without Supabase or provider keys.
- **Solo-play tooling** rides the same event-sourced path, so everything replays: d20 ability/skill checks, a GM-emulation oracle (yes/no at chosen odds), an arbitrary-dice roller, a 2d6 NPC reaction roller, and a one-click factual recap that drafts a session-log entry on the linked campaign.
- **NPCs are mechanically real, not set dressing.** An `npc` token resolves combat stats from either a creature statblock or a full character sheet (`src/scene/combatStats.ts`) and runs through the same deterministic tactical executor as monsters. Allegiance is explicit per token (`party`/`hostile`/`neutral`) rather than inferred from faction inequality, so an allied NPC fights *with* the party and a neutral one with no one; any token can be re-sided after placement through an event-sourced `set-token-allegiance`, and the grid colours by side. NPCs generate from the loader-backed catalog with a seeded name generator (`src/scene/npcGenerator.ts`) — deterministic, no AI involved.
- **The AI control plane** (`docs/rfc/002-ai-control-plane.md`) has a shipped foundation and four *user-reachable* task surfaces covering every modality the product needs: structured output, free prose, vision input, and image generation. The task allowlist carries a fifth — `character-draft` — plus a "make me a game" composition flow; both are complete, validator-gated and test-covered, but neither has a UI entry point, so they are landed contracts rather than shipped surfaces. It is provider-agnostic by construction — a pure typed gateway (`src/ai/`) whose only provider-bound code is a server-side adapter (`netlify/functions/`), so the browser never holds a key. Default OFF via `VITE_AI_ENABLED`, degrading to the manual tools whenever it is off, unconfigured, or unreachable; shipped behaviour is unchanged until AI is explicitly enabled and keyed. The contract is *the model proposes, deterministic validators decide*, and the gateway core is fixture-replayable so request validation, the bounded repair loop, and degradation are all CI-tested without a key or a network. The four surfaces:
  - **AI encounter drafting** (structured output): the model may only pick creature ids from the loader-derived catalog, and the SAME encounter-spec budget gate that backs the manual draft accepts or rejects the result (with one bounded repair), after which the GM reviews the selections and applies them through the SAME deterministic encounter builder a manual selection uses.
  - **AI session-recap narration** (free prose grounded in deterministic facts): the model restyles the existing factual scene recap (`summarizeSceneForLog`) into prose using ONLY those facts as source material; the GM edits the draft and chooses to log it (or keep the factual recap), so nothing is ever written to the campaign log automatically.
  - **AI creature identification** (vision / multimodal input): the GM uploads an image and the model names the best-matching creature from the loaded catalog; the flow rejects any id outside that pool (an invented name is a hard failure), then selects the identified statblock for the GM to queue or place manually. The image rides to the provider as a base64 `data:` URL the adapter attaches as a multimodal message part — proving the gateway carries image input, not just text.
  - **AI scene illustration** (image output / generation): a text prompt becomes a picture (Imagen via the same provider seam) the GM views or downloads. Generated imagery has no machine-checkable correctness, so this is an explicit human-judged boundary — the deterministic layer validates only the request and the output envelope (a real, bounded image), and the result is deliberately NOT written into the event-sourced scene state, so it can never corrupt anything deterministic.
- Campaigns carry lightweight solo-play story scaffolding alongside the party roster and free-form notes: per-campaign quests (each an objective checklist with an active/completed/failed status) and a chronological session log. The transforms are pure (`src/utils/campaignStory.ts`); quests and the session log are coerced at the untrusted boundary and round-trip through local storage and per-user Supabase sync (JSONB columns added in migration `004_campaign_story.sql`).
- Loader-backed counts, support levels, and source-filtered categories are generated from the runtime data/reporting path.
- Spell catalogs across 5e, D&D 3.5e, PF1e, and PF2e now share normalized index surfaces with alias-safe lookup, legacy d20 source-backed save/component/casting metadata coverage, and a cross-system identity regression matrix. The only D&D 3.5e spell source-blocked exclusions are `bleed-35e`, `mass-misdirection-35e`, and `reversal-of-fortune-35e`; PF1e source-backed rows without a Saving Throw line are explicit regression fixtures.
- Shared controller/section-host convergence is shipped across 5e, PF2e, legacy d20, M&M, and Daggerheart. Future work here is maintenance against existing host/controller contracts, not another decomposition push.

| System | Support level | Current slice |
| --- | --- | --- |
| D&D 5e (2024) | Full | Shared 5e host, subclass selection, feat ASI/proficiency automation, by-level always-prepared data with source labels and explicit unresolved/manual boundaries |
| D&D 5e (2014) | Full | Shared 5e host, feature-option browsing/persistence, provenance-first downstream effects, by-level always-prepared data with explicit manual riders |
| Pathfinder 2e | Full | Native sheet, loader-backed backgrounds/archetypes, native prepared-slot persistence, structured always-prepared surfacing, focus-spell manual surface, dynamic rank-10 spell browsing |
| D&D 3.5e | Full | Shared legacy host, full core prestige catalog is selectable, canonical 610-spell loader-backed catalog with alias-safe class-stub duplicate collapse, deterministic spells-per-day (casting-ability, cleric domain, wizard specialist, and prestige/Dragon-Disciple bonus slots), synergy/encumbrance/gear skills, and equipped-armor AC; Vancian prepared-slot assignment and spontaneous conversion remain accepted manual boundaries |
| Pathfinder 1e | Full | Shared legacy host, vetted prestige support is product-reachable, raw `levelsByClass` and legacy spell metadata live in spell files, deterministic spells-per-day (casting-ability, cleric domain, wizard specialist, and prestige/Dragon-Disciple bonus slots), class-skill/encumbrance/gear skills, and equipped-armor AC; Vancian prepared-slot assignment and spontaneous conversion remain accepted manual boundaries |
| M&M 3e | Full | Native point-buy sheet with pinned archetypes, complication insertion, and modifier math/PL-cap enforcement |
| Daggerheart | Full | Native sheet with selectors, domains, domain cards, equipment, loadouts, long-rest downtime moves (Tend to All Wounds / Clear All Stress / Repair All Armor / Prepare, built on the RFC 005 resource-pool `reset` verb), and deterministic passive automation with explicit manual/reference boundaries: passive bonuses (evasion, armor, thresholds, spellcast, traits) auto-apply, while triggered/narrative card resolution and short-rest `1d4 + tier` moves are GM-adjudicated by design (an enumerated accepted boundary) |

## Maintenance Tracks

- Sustain legacy spell parity and cross-system catalog invariants through raised parity floors and fixture-backed regressions.
- Maintain source-strict preparation surfaces across shared 5e, PF2e focus spells, and legacy d20 manual extras without expanding into choice-dependent automation.
- Keep Daggerheart passive automation, M&M reference surfaces, PF2e preparation/archetype behavior, legacy d20 prestige/manual extras, and 5e feature-option persistence covered by regression as future work enters through `docs/MASTER_PLAN.md`.

## Completion Tracking (Denominators)

Completeness is measured against two cited, open-content denominators, so "done" is a defined, reachable state rather than an open-ended judgment:

- **Content (Denominator A)** — **mid-migration; the current form does not hold (corrected 2026-07-26).** `docs/srd-manifest/` holds per-system catalogs, and the generated metric joins manifest ids against actually-loaded ids. But the manifests are themselves *generated from the loaders*, so that join measures catalog parity, not coverage — and because they have no wired regeneration command and no drift gate (`check:generated-docs` covers four files, all under `docs/generated/`), they have drifted since 2026-06-17. Manifest ids serve as both numerator and denominator, so drift can only ever read as 100%: one category prints a green 100% against a denominator holding roughly a tenth of what its loader ships. Per the decision in `docs/GAPS.md` §6, `docs/srd-manifest/` is **demoted from denominator duty** in favour of the independent networked reverse diff in `docs/generated/srd-coverage.md`. Treat that file as authoritative for content%; do not "fix" the drift by gating the manifests.
- **Engine math (Denominator B)** — `docs/compute-register/`: per-system registers of every derived quantity the rules define, indexed by system × quantity, each marked verified (test-pinned), implemented, or missing. `compute%` is verified ÷ in-scope.
- **Manual boundaries** — `docs/srd-manifest/_exclusions.ts`: the enumerated manual, reference-only, and narrative items excluded from both denominators, so that fake automation cannot be counted as coverage. **Corrected 2026-07-26:** the registry does not yet cover every residual gap — 4 of 7 systems carry measured content shortfalls that are neither automated nor enumerated here. The exclusion mechanism does what it claims; the claim that the metric is *therefore* never gameable outran it. **Updated 2026-07-27:** every system that ships a content denominator now carries at least one enumerated boundary — PF2e previously carried none while its support row named a manual focus-spell surface, and its focus-spell, prepared-slot/cantrip, and rank-10-slot boundaries are now enumerated with code citations, gated by `src/__tests__/manualExclusionRegistry.test.ts`. Live shortfalls are in `docs/generated/srd-coverage.md` and tracked in `docs/GAPS.md` §1.

Live `content%` and `compute%` per system are reported in `docs/generated/roadmap-metrics.md` (regenerate with `npm run roadmap:metrics`). All seven systems have engine-math registers; D&D 3.5e and PF1e gained their first engine-math tests under this tracking. The monster category is governed by `docs/rfc/004-monster-product-surface.md`.

### Engine math — what `verified` means

`check:compute-register` (in `npm run verify`) enforces two tiers, so the mark cannot be hand-stamped:

- **Tier A — test-linked and passing.** Every `status:'verified'` quantity resolves to a real, register-independent test, with pass/fail read from the vitest result tree.
- **Tier B — mutation-proven.** Every verified quantity carries a formula anchor whose arithmetic perturbation flips that test from pass to fail. New verified entries must land with their anchor.

The registers were rebalanced so no system is neglected (previously lopsided), adding SRD-cited quantities rather than padding — shared d20 encumbrance and bonus-spell math, the PF2e dying/recovery track, M&M Affliction DC and hero points, Daggerheart's damage-reduction pipeline, among others.

**Two honest limits.** Per-system completeness is **not** uniformly 100%. And layer coverage is **not** even across the seven — L1–L10 is complete for 2 systems, with L10 owed by 3, L5–L6 by one, and L4/L5/L9 by one (*corrected 2026-07-26; "each now spans L1–L10" was false*). The registers are a curated subset of the full spec, not its exhaustive enumeration. Per-system layer debt: `docs/GAPS.md` §2.

### Content — two different measures, only one of them trustworthy

**Catalog parity** (`docs/srd-manifest/` joined against loaded ids) certifies *provenance*: every shipped entry encoded, loader-backed, source-tagged, policy-clean. It is measured over the open-content population only — entries this project authored rather than transcribed carry manifest status `original` and are excluded from both sides, since counting self-authored content toward open-content parity would restate the very mislabeling that channel exists to expose (`docs/GAPS.md` §17).

**It does not certify completeness, and it is being retired.** The manifests are generated *from* the loaders, so the join is circular; they have drifted, and drift can only ever read as 100%. See `docs/GAPS.md` §6 for the demotion decision.

**Coverage** — which published-SRD entries the loaders *omit* — is the stricter measure and is now the authoritative one. `npm run srd:coverage` diffs the published open-content lists against the loaders and writes `docs/generated/srd-coverage.md`. All seven systems are measured there. **Counts are not restated here; they drift.**

Residual, in shape rather than number: a handful of single-entry gaps, some monster individuals, and D&D 3.5e classes/feats/equipment still unwired pending core-only sources. The earlier 5e over-inclusion (non-SRD content mislabeled with an SRD tag) was removed across both editions and the reverse diff now reports zero for those categories — but note that diff matches on **names**, so it cannot see an entry whose name is legitimately SRD while its substance came from a closed book. That hole is realized, not theoretical: `docs/GAPS.md` §11 and §15.

## Source Of Truth

- `docs/MASTER_PLAN.md` - canonical roadmap and planning classifications
- `docs/generated/roadmap-metrics.md` - generated product-reachable counts and repo-resident audit
- `docs/srd-manifest/` - content denominators (Denominator A) and the manual-exclusion registry
- `docs/compute-register/` - engine-math denominators (Denominator B)
- `README.md` - public product overview
- `CONTRIBUTING.md` - engineering policy and workflow guardrails
