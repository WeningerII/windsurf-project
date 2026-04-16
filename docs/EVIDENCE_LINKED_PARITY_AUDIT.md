# Evidence-Linked Parity Audit

> Historical audit snapshot: the planning implications from this document have been subsumed by `docs/MASTER_PLAN.md`, which is now the sole planning authority.
>
> Unique historical value: this file preserves the evidence snapshot and row-level findings from the March 2026 audit before the later productization work landed.
>
> Internal references to `docs/STATUS.md` below reflect the repo state at the time of writing and are not current planning instructions.

Last verified: March 6, 2026

Status note (March 7, 2026): this remains a March 6 parity snapshot. By March 7, 2026, the repo's regression baseline had already moved forward to 78 passing test files / 3214 passing tests with 80.65% branch coverage under Node `v22.18.0`, baseline Daggerheart engine/sheet coverage had landed, a Daggerheart browser create/persist flow existed in Playwright, shared 5e subclass selection was live in-sheet, shared 5e feat ASI/proficiency automation was live in-sheet, shared 5e-2014 feature-option browsing/persistence was live in-sheet, PF1e prestige classes were loader-backed/selectable in the shared legacy sheet, PF2e backgrounds/archetypes already flowed through shared loaders, M&M archetypes/complications/power modifiers were loader-backed and product-reachable in the native sheet, and the shared tab trigger correctly activated loader-backed tabs while running their lazy-load callbacks. Re-audit the specific rows below before treating every finding as current.

Current repo truth note (March 16, 2026): many rows below are historical only. Use `docs/MASTER_PLAN.md`, `docs/STATUS.md`, and `docs/generated/roadmap-metrics.md` for live status. Since this snapshot, Daggerheart is data-backed, PF2e archetypes and PF1e traits are product-reachable, M&M archetype/complication/modifier surfaces are shipped, 3.5e prestige support is product-reachable, and the canonical spell catalogs now sit at 501 loader-backed D&D 3.5e spells and 143 loader-backed PF2e spells.

## Executive summary

This audit uses only current on-disk repo state plus one local loader-count pass run on March 6, 2026. A finding is included only when all four points are provable from the repo: source exists or is absent, propagation path exists or is missing, consumer path exists or is missing, and a concrete user-visible consequence follows.

Audited scope:
- Registered systems from `src/systems/index.ts`
- User-facing loaders in `src/utils/dataLoader.ts`
- Global reporting surfaces in `src/components/SystemStatusDashboard.tsx` and `src/components/GameSystemSelector.tsx`
- Native/shared sheets and template utilities
- Repo-resident edition datasets and mechanics not guaranteed to be loader-backed
- Test surfaces under `src/__tests__/` and `e2e/`
- Claim surfaces in `README.md` and `docs/STATUS.md`

Excluded from evidence:
- `docs/PLANNING_INDEX.md` was open in the IDE but does not exist on disk in this repo state.
- No external rules research was used.

Measured loader snapshot from a local `tsx` pass on March 6, 2026:

| System | Spells/Powers | Classes | Species | Backgrounds | Monsters | Equipment | Feats | Advantages |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| D&D 5e (2014) | 238 | 12 | 9 | 6 | 41 | 230 | 0 | 0 |
| D&D 5e (2024) | 315 | 12 | 9 | 6 | 99 | 204 | 87 | 0 |
| D&D 3.5e | 555 | 11 | 7 | 0 | 0 | 207 | 515 | 0 |
| Pathfinder 1e | 134 | 11 | 7 | 0 | 0 | 70 | 86 | 0 |
| Pathfinder 2e | 146 | 12 | 6 | 0 | 0 | 188 | 93 | 0 |
| M&M 3e | 61 | 0 | 0 | 0 | 0 | 150 | 0 | 74 |
| Daggerheart | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

These table counts are intentionally preserved as the March 6 historical snapshot. They are not the current repo totals.

High-confidence findings:
- False or dead user-facing surfaces exist in current product: 5e monster browsing claims, the shared D20 monster tab on systems with no monsters, and top-level Daggerheart readiness messaging.
- At the time of the March 6 snapshot, repo-backed categories were materially ahead of product reachability in PF2e archetypes, 3.5e prestige classes, PF1e prestige classes, 5e-2014 special-ability datasets, and several M&M categories.
- Some asymmetries are deliberate source-policy effects, not implementation failures: PF2e ancestries are filtered from 7 raw exports to 6 loader-backed items, and 5e-2014 feats are intentionally zero.

## Resolved Since Snapshot

The following rows should not be treated as live blockers after the March 7, 2026 follow-up pass:
- `UF-01`, `UF-02`: 5e monster browsing is now loader-backed in both shared 5e sheets and the docs have been aligned.
- `UF-03`, `UF-07`: PF2e backgrounds and PF1e traits already flow through shared loaders/reporting.
- `UF-04`: the dead D20 monster tab is gone from `D20LegacySheet`.
- `UF-05`: 3.5e selector/dashboard counts are now truth-aligned to 11 reachable base classes, even though prestige classes still remain repo-backed.
- `UF-06`, `RR-04`: PF1e prestige classes are loader-backed/selectable for the vetted CRB subset.
- `RR-01`: PF2e archetypes are already product-reachable in the native sheet and shared reporting.
- `RR-02`: 5e-2014 feature-option catalogs are now loader-backed, browseable, and persistent in the shared Features tab.
- `RR-05`, `RR-06`, `RR-07`: M&M archetypes, complications, and power modifiers are now loader-backed/product-reachable in the native sheet and shared reporting.
- `RR-09`: the misleading 5e-2014 empty Feats affordance is gone.
- `UF-10`: baseline Daggerheart engine/sheet coverage and a Daggerheart Playwright smoke flow now exist; the remaining gap is breadth, not zero coverage.
- `UF-11`, `UF-12`: README and status/docs can now be aligned to current product reachability instead of the March 6 doc-drift state.
- Spell-catalog parity work since this snapshot has canonicalized duplicate spell rows through alias-safe lookup, so current spell totals are lower than the preserved March 6 raw snapshot in D&D 3.5e and PF2e.

No direct non-parity proof was found in this pass for:
- D&D 5e-2024 loader-backed core categories
- D&D 5e-2014 loader-backed core spells/classes/species/backgrounds/equipment
- PF2e loader-backed spells/classes/feats/equipment
- M&M loader-backed/product-reachable powers, advantages, equipment, archetypes, complications, and power modifiers

## User-Facing Product Parity

| ID | System / edition | Category / capability | Baseline comparator | Cause chain | Evidence | User-visible consequence | Classification | Priority |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| UF-01 | D&D 5e 2014 + 2024 | Monster browsing in the sheet | 5e spells/feats/equipment tabs in the same sheet family are loader-backed and rendered | 5e monster data and a monster loader exist -> `Dnd5eSheetBase` imports no `MonsterBrowser` and renders no monster tab -> users cannot reach monster browsing from either 5e sheet | `src/utils/dataLoader.ts:609-624`; `src/systems/dnd5e/shared/Dnd5eSheetBase.tsx:43-50`; `src/systems/dnd5e/shared/Dnd5eSheetBase.tsx:56-85`; `src/systems/dnd5e/shared/Dnd5eSheetBase.tsx:897-931`; `src/systems/dnd5e/shared/Dnd5eSheetBase.tsx:1130-1376` | The repo can load 5e monsters, but the 5e sheet family does not expose them | Implementation gap | P0 |
| UF-02 | D&D 5e 2014 + 2024 | Monster-browsing claim surfaces | Current reachable 5e sheet behavior | Docs claim 5e monster browsing -> the actual 5e sheet has no monster tab or consumer -> the claim is false at product level | `docs/STATUS.md:115-116`; `README.md:118`; `src/systems/dnd5e/shared/Dnd5eSheetBase.tsx:897-931` | Status and README overstate a missing user-facing feature | Doc drift | P0 |
| UF-03 | Pathfinder 2e | Background selection versus global reporting | 5e backgrounds: loader-backed, sheet-backed, and dashboard-counted | PF2e backgrounds module exists -> PF2e sheet imports and renders it directly -> `loadBackgroundsForSystem()` has no `pf2e` case -> dashboard cannot count it -> sheet reachability and app-level reporting diverge | `src/data/pathfinder/2e/backgrounds/index.ts:26`; `src/systems/pf2e/sheet.tsx:59`; `src/systems/pf2e/sheet.tsx:285-294`; `src/systems/pf2e/sheet.tsx:300`; `src/systems/pf2e/sheet.tsx:367-369`; `src/systems/pf2e/sheet.tsx:445-458`; `src/utils/dataLoader.ts:581-598`; `src/components/SystemStatusDashboard.tsx:141-160` | PF2e users can pick backgrounds in the sheet, but the shared product counters behave as if PF2e has none | Implementation gap | P2 |
| UF-04 | D&D 3.5e + Pathfinder 1e | Shared D20 monster tab | Comparable tabs in the same sheet either load content or are absent | `D20LegacySheet` always renders a monster tab -> `loadMonstersForSystem()` returns `[]` for non-5e systems -> the tab resolves to a hard-coded empty-state message | `src/systems/d20-legacy/sheet.tsx:40-50`; `src/systems/d20-legacy/sheet.tsx:169-176`; `src/systems/d20-legacy/sheet.tsx:803-809`; `src/systems/d20-legacy/sheet.tsx:1311-1327`; `src/utils/dataLoader.ts:609-624` | PF1e and 3.5e users can click into a dead browse path | Implementation gap | P0 |
| UF-05 | D&D 3.5e | Reachable class selection | Base-class selection in the same D20 sheet | 3.5e metadata and selector count prestige classes -> `loadClassesForSystem()` returns only base classes -> D20 class dropdowns and add-class UI consume only loaded classes -> counted prestige classes are unreachable | `src/data/dnd/3.5e/metadata.ts:27-33`; `src/components/GameSystemSelector.tsx:61-70`; `src/utils/dataLoader.ts:331-334`; `src/utils/dataLoader.ts:521-545`; `src/systems/d20-legacy/sheet.tsx:184-193`; `src/systems/d20-legacy/sheet.tsx:482-502`; `src/systems/d20-legacy/sheet.tsx:548-567` | The selector advertises 26 classes, while the actual sheet can select 11 | Implementation gap | P1 |
| UF-06 | Pathfinder 1e | Reachable class selection | Base-class selection in the same D20 sheet | PF1e metadata and selector count prestige classes -> `loadClassesForSystem()` returns only base classes -> D20 class dropdowns and add-class UI consume only loaded classes -> counted prestige classes are unreachable | `src/data/pathfinder/1e/metadata.ts:31-34`; `src/components/GameSystemSelector.tsx:72-80`; `src/utils/dataLoader.ts:382-385`; `src/utils/dataLoader.ts:521-545`; `src/systems/d20-legacy/sheet.tsx:184-193`; `src/systems/d20-legacy/sheet.tsx:482-502`; `src/systems/d20-legacy/sheet.tsx:548-567` | The selector advertises 19 classes, while the actual sheet can select 11 | Implementation gap | P1 |
| UF-07 | Pathfinder 1e | Traits | 5e backgrounds and PF2e backgrounds are treated as explicit option families | PF1e traits exist -> the D20 sheet imports and renders them directly -> the shared loader/dashboard/selector schema has no traits path -> reachable content is globally under-reported | `src/data/pathfinder/1e/metadata.ts:49-50`; `src/systems/d20-legacy/sheet.tsx:60`; `src/systems/d20-legacy/sheet.tsx:1047-1118`; `src/components/SystemStatusDashboard.tsx:24-31`; `src/components/GameSystemSelector.tsx:27-30` | PF1e users can add traits, but app-level parity surfaces do not acknowledge them | Implementation gap | P2 |
| UF-08 | Daggerheart | Whole-system reachability | Every other registered system exposes at least some loader-backed content | Daggerheart is registered and selectable -> every shared loader falls through to `[]` -> the sheet is manual text/number entry rather than data-backed browsing -> the system is scaffold-only in product terms | `src/systems/index.ts:11-18`; `src/components/GameSystemSelector.tsx:94-99`; `src/utils/dataLoader.ts:481-504`; `src/utils/dataLoader.ts:521-541`; `src/utils/dataLoader.ts:555-575`; `src/utils/dataLoader.ts:581-595`; `src/utils/dataLoader.ts:609-620`; `src/utils/dataLoader.ts:634-657`; `src/utils/dataLoader.ts:671-691`; `src/systems/daggerheart/sheet.tsx:72-121` | Users can select Daggerheart, but they receive a manual scaffold with zero loader-backed content parity | Scaffold | n/a |
| UF-09 | Daggerheart | Top-level readiness messaging | Actual Daggerheart product behavior | README says the app is production-ready across 7 systems -> Daggerheart currently resolves to a manual scaffold with zero loader-backed content -> top-level messaging overstates support | `README.md:6`; `README.md:225`; `src/utils/dataLoader.ts:481-504`; `src/systems/daggerheart/sheet.tsx:72-121` | The top-level project description overstates what one of the seven registered systems can actually do | Doc drift | P0 |
| UF-10 | Cross-system | Test parity | D&D 5e-2024 has sheet coverage plus the only E2E flow | Seven systems are registered -> `SystemSheets.test.tsx` covers five sheet implementations and omits Daggerheart -> Playwright exercises only D&D 5e-2024 -> not all product paths are equally exercised | `src/systems/index.ts:11-18`; `src/__tests__/components/SystemSheets.test.tsx:7-16`; `src/__tests__/components/SystemSheets.test.tsx:40-122`; `e2e/phase3-workflows.spec.ts:9-14`; `e2e/phase3-workflows.spec.ts:38-48`; repo search on March 6, 2026 found six engine test files under `src/__tests__/engines` and none for Daggerheart | Parity claims cannot treat all seven systems as equally tested | Implementation gap | P3 |
| UF-11 | D&D 3.5e | README content count accuracy | Current metadata-derived repo count | The 3.5e prestige-class module and metadata compute 15 entries -> README still says 2 -> docs understate repo-resident coverage and obscure the selector mismatch | `README.md:195-203`; `src/data/dnd/3.5e/metadata.ts:31-33`; `src/data/dnd/3.5e/prestige-classes/index.ts:14-259` | Documentation is stale even before product reachability is considered | Doc drift | P3 |
| UF-12 | PF2e + M&M | README implementation claims for archetypes | Current product reachability | README lists PF2e archetypes and M&M archetypes as implemented product categories -> current product has no archetype loader, tab, or dashboard surface for either system -> docs overstate user-facing reachability | `README.md:184-191`; `README.md:206-213`; `src/data/pathfinder/2e/metadata.ts:50-52`; `src/data/mutants-and-masterminds/3e/metadata.ts:79-80`; `src/utils/dataLoader.ts:428-462`; `src/utils/dataLoader.ts:521-703`; `src/systems/mam3e/sheet.tsx:410-478` | README presents repo-resident archetype datasets as if they were product-level features | Doc drift | P1 |

## Repo-Resident Coverage Parity

| ID | System / edition | Repo-resident dataset / mechanic | Baseline comparator | Cause chain | Evidence | User-visible consequence | Classification | Priority |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| RR-01 | Pathfinder 2e | Archetypes | PF2e feats and classes are loader-backed, sheet-backed, and counted | PF2e archetype module exists -> metadata tests and roadmap metrics count it -> no loader case and no sheet/dashboard/selector consumer exists -> repo coverage exceeds product coverage | `src/data/pathfinder/2e/archetypes/index.ts:12-24`; `src/data/pathfinder/2e/metadata.ts:50-52`; `src/__tests__/metadata-counts.test.ts:57-62`; `src/__tests__/metadata-counts.test.ts:172-174`; `src/scripts/generate-roadmap-metrics.ts:25`; `src/scripts/generate-roadmap-metrics.ts:345-349`; `src/utils/dataLoader.ts:521-703`; repo search on March 6, 2026 found no consumer references outside metadata/tests/scripts | PF2e archetypes exist on disk and in metrics, but users cannot load or select them anywhere | Implementation gap | P1 |
| RR-02 | D&D 5e 2014 | Special-ability and class-feature option datasets | 5e spells, backgrounds, monsters, equipment, and 2024 feats are productized through common loaders and tabs | Metadata counts smites, invocations, maneuvers, ki abilities, channel divinity, wild shapes, metamagic, and fighting styles -> no corresponding loader category exists -> the 5e sheet exposes no dedicated consumer for these option datasets -> repo-backed option catalogs stop before product reachability | `src/data/dnd/5e-2014/metadata.ts:77-86`; `src/utils/dataLoader.ts:464-703`; `src/systems/dnd5e/shared/Dnd5eSheetBase.tsx:897-931`; repo search on March 6, 2026 for `eldritchInvocations|divineSmites|sorcererMetamagic|fightingStyles|kiAbilities|channelDivinityOptions|wildShapeForms|battleMasterManeuvers|maneuvers` in `src/components`, `src/systems`, and `src/utils` returned no consumer matches | The repo tracks many 5e-2014 option catalogs that users cannot browse or select through shared product flows | Implementation gap | P1 |
| RR-03 | D&D 3.5e | Prestige classes | Base 3.5e classes propagate through loader, template, and sheet | Prestige-class data exists -> metadata counts it -> `d20LegacyTemplate` imports only the base-class catalog -> `loadClassesForSystem()` imports only the base-class module -> prestige classes never propagate into template or sheet reachability | `src/data/dnd/3.5e/prestige-classes/index.ts:14-259`; `src/data/dnd/3.5e/metadata.ts:31-33`; `src/utils/d20LegacyTemplate.ts:6`; `src/utils/d20LegacyTemplate.ts:253-260`; `src/utils/dataLoader.ts:331-334`; `src/utils/dataLoader.ts:521-545` | 3.5e prestige classes are repo-backed only | Implementation gap | P1 |
| RR-04 | Pathfinder 1e | Prestige classes | Base PF1e classes propagate through loader, template, and sheet | Prestige-class data exists -> metadata counts it -> `d20LegacyTemplate` imports only the base-class catalog -> `loadClassesForSystem()` imports only the base-class module -> prestige classes never propagate into template or sheet reachability | `src/data/pathfinder/1e/prestige-classes/index.ts:12-21`; `src/data/pathfinder/1e/metadata.ts:31-34`; `src/utils/d20LegacyTemplate.ts:7`; `src/utils/d20LegacyTemplate.ts:256-257`; `src/utils/dataLoader.ts:382-385`; `src/utils/dataLoader.ts:521-545` | PF1e prestige classes are repo-backed only | Implementation gap | P1 |
| RR-05 | M&M 3e | Archetypes | M&M powers, advantages, and equipment are loader-backed and surfaced | M&M archetype data exists -> metadata and roadmap metrics count it -> no archetype loader exists -> the M&M sheet exposes no archetype tab or import path -> repo coverage exceeds product coverage | `src/data/mutants-and-masterminds/3e/archetypes/index.ts:1-37`; `src/data/mutants-and-masterminds/3e/metadata.ts:79-80`; `src/scripts/generate-roadmap-metrics.ts:24`; `src/scripts/generate-roadmap-metrics.ts:339-343`; `src/utils/dataLoader.ts:428-462`; `src/utils/dataLoader.ts:700-703`; `src/systems/mam3e/sheet.tsx:29-33`; `src/systems/mam3e/sheet.tsx:410-478` | The repo has 15 M&M archetypes, but the product has no archetype surface | Implementation gap | P1 |
| RR-06 | M&M 3e | Power modifiers | M&M powers and advantages use shared loaders and shared reporting | Power-modifier data exists -> metadata counts extras and flaws -> `powerMath.ts` imports modifiers directly for sheet-local calculations -> no loader/dashboard/selector path exists for the modifier catalog -> common infrastructure parity is missing | `src/data/mutants-and-masterminds/3e/modifiers/index.ts:3-9`; `src/data/mutants-and-masterminds/3e/metadata.ts:47-50`; `src/systems/mam3e/powerMath.ts:2`; `src/systems/mam3e/powerMath.ts:10-13`; `src/systems/mam3e/sheet.tsx:105-177`; `src/utils/dataLoader.ts:428-462`; `src/components/SystemStatusDashboard.tsx:24-31` | Modifiers are reachable only as a sheet-local editing mechanic, not as a first-class content family | Implementation gap | P2 |
| RR-07 | M&M 3e | Complications dataset | M&M powers/advantages/equipment have data-backed surfaces | Complication data exists -> metadata counts it -> no complication loader exists -> the sheet's Complications tab edits free-text manual entries rather than consuming the dataset -> repo-backed definitions never reach users | `src/data/mutants-and-masterminds/3e/complications/index.ts:3-31`; `src/data/mutants-and-masterminds/3e/metadata.ts:66-67`; `src/utils/dataLoader.ts:428-462`; `src/systems/mam3e/sheet.tsx:467-474`; `src/systems/mam3e/sheet.tsx:1029-1091` | Users can enter custom complications, but they cannot browse/select the repo-backed official complication set | Implementation gap | P1 |
| RR-08 | Pathfinder 2e | Ancestries raw export versus loader output | Raw repo counts versus product counts | `pf2eAncestries` exports seven ancestries including `orc` -> `finalizeLoadedItems()` applies the strict PF2e CRB-only source filter -> the loader-backed species surface resolves to six ancestries -> this is a deliberate source-policy drop, not missing implementation | `src/data/pathfinder/2e/ancestries/index.ts:2-18`; `src/data/pathfinder/2e/metadata.ts:36-38`; `src/utils/openContentPolicy.ts:37-39`; `src/utils/dataLoader.ts:46-55`; `src/utils/dataLoader.ts:555-579` | Product-visible PF2e species are intentionally narrower than raw repo exports | Source-scope difference | n/a |
| RR-09 | D&D 5e 2014 | Feats | 5e-2024 feat support and generic feat browser affordance | 5e-2014 metadata intentionally sets feat count to zero -> the 5e-2014 feat loader hard-returns `[]` -> the shared 5e sheet still renders the Feats tab and browser shell -> the empty state is policy-driven, not an implementation failure | `src/data/dnd/5e-2014/metadata.ts:53-55`; `src/utils/dataLoader.ts:284-286`; `src/utils/dataLoader.ts:671-695`; `src/systems/dnd5e/shared/Dnd5eSheetBase.tsx:914-915`; `src/systems/dnd5e/shared/Dnd5eSheetBase.tsx:1222-1259` | Users see an empty Feats surface because the source policy says 2014 feats are out of scope | Source-scope difference | n/a |

## Ranked remediation backlog

### P0

1. No March 6 `P0` parity row remains live after the March 7 follow-up. Daggerheart is already truth-aligned as scaffold-only; the remaining problem is missing content parity, not misleading messaging.

### P1

1. Normalize and productize 3.5e prestige classes without inventing missing class metadata. The count-truth half of `UF-05` is closed; the remaining live row is `RR-03`.

### P2

1. Decide whether Daggerheart should remain intentionally scaffold-only or receive real local data modules and browse surfaces. `UF-08`/`UF-09` are truth-aligned, but the content-parity gap remains.

### P3

1. Bring test parity closer to product parity by expanding E2E beyond the current D&D 5e-2024 and Daggerheart workflow coverage. Source row: the remaining breadth half of `UF-10`.
2. Keep roadmap/docs/metrics synchronized as the remaining repo-backed categories move into product surfaces, especially 3.5e prestige classes.

## Open questions / unresolved proofs

- Negative-reference evidence was required for the absence of `src/data/daggerheart/` in the March 6 snapshot. That judgment relied on a repo-wide search, not on a single file that proves absence.
- The README test-count claim that existed in the March 6, 2026 repo state was not validated during that audit pass, and it was not used in any parity judgment.
- If you want this audit to become mechanically reproducible, the next step is a checked-in script that snapshots negative searches and writes this matrix from code instead of manual synthesis.
