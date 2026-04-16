# Evidence-Linked Parity Remediation Plan

> Historical execution record: the planning content in this file has been subsumed by `docs/MASTER_PLAN.md`, which is now the sole planning authority.
>
> Unique historical value: this file preserves the exhaustive parity workstreams, decision matrix, and row-to-remediation mapping used during the March 2026 remediation push.
>
> Internal references to `docs/STATUS.md` below reflect the repo state at the time of writing and are not current planning instructions.

Last updated: March 7, 2026

Status note (March 7, 2026): at the time of this remediation snapshot, the Vitest coverage gate was green again at 80.65% branch coverage (78 files / 3214 tests) under Node `v22.18.0`, baseline Daggerheart engine/sheet coverage existed, a Daggerheart browser create/persist flow was covered in Playwright, shared 5e subclass selection was live in-sheet, shared 5e feat ASI/proficiency automation was live in-sheet, shared 5e-2014 feature-option browsing/persistence was live in-sheet, PF1e prestige classes were loader-backed/selectable in the shared legacy sheet, PF2e backgrounds/archetypes already flowed through shared loaders, M&M archetypes/complications/power modifiers were loader-backed and product-reachable in the native sheet, and the shared tab trigger correctly activated loader-backed tabs while running their lazy-load callbacks. The remaining work at that time was mostly Daggerheart data integration and 3.5e prestige normalization.

Current repo truth note (March 16, 2026): this file is now primarily a historical execution record. Use `docs/MASTER_PLAN.md` for the live backlog and `docs/generated/roadmap-metrics.md` for current counts. Since this snapshot, Daggerheart data productization, 3.5e prestige reachability, shared spell preparation, and the spell-catalog parity baseline have landed; the remaining live work is narrower and is tracked in the master plan.

Source of truth for gaps: `docs/EVIDENCE_LINKED_PARITY_AUDIT.md`

## Purpose

This plan turns the audited parity gaps into an implementation sequence that is:
- exhaustive across all proven row IDs
- explicit about what gets implemented versus what gets truth-aligned
- conservative about architecture changes
- additive where possible so existing documents do not require destructive migration

## Remediation goals

1. Make user-facing surfaces tell the truth about support level and reachable content.
2. Stop counting repo-resident categories as product support unless users can actually reach them.
3. Productize repo-backed content that is already sufficiently structured to browse/select.
4. Keep intentional source-scope differences explicit rather than "fixing" them by broadening source policy.
5. Add regression coverage so the same parity drift cannot recur silently.

## Non-goals

- No external data acquisition or rules research.
- No full Daggerheart content implementation in this plan; the repo has no local Daggerheart data modules today.
- No deep automation of every 5e special-ability or PF2e archetype rule rider in phase 1. The first target is reachability, persistence, provenance, and honest reporting.
- No one-size-fits-all "AnyContent" abstraction spanning every dataset shape. Reporting gets a thin shared layer; content interaction remains system-specific when the data shapes differ materially.

## Decision matrix

| Audit rows | Remediation mode | Chosen action |
| --- | --- | --- |
| `UF-01`, `UF-02` | Implement feature + remove doc drift | Wire real 5e monster browsing into `Dnd5eSheetBase`, then align docs to the shipped behavior |
| `UF-03`, `UF-07` | Unify propagation path | Replace direct sheet imports with real loaders and shared reporting coverage |
| `UF-04` | Remove dead path | Delete the D20 monster tab from systems with no monster dataset |
| `UF-05`, `UF-06`, `RR-03`, `RR-04` | Split by data quality | PF1e prestige classes get loader/template/sheet support; 3.5e prestige classes first stop inflating reachable counts, then get normalized before productization |
| `RR-01` | Implement feature | Add PF2e archetype browsing/selection and reporting |
| `RR-02` | Implement feature in phases | Expose 5e-2014 option catalogs through a dedicated feature-option surface; defer deep rule automation |
| `RR-05`, `RR-06`, `RR-07` | Implement reachability, not full template automation | Add M&M reference/browse surfaces for archetypes, modifiers, and complications; keep heavy application logic out of phase 1 |
| `UF-08`, `UF-09` | Truth-align support level | Mark Daggerheart as scaffold in runtime surfaces and docs; do not pretend parity where there is no local data |
| `RR-08`, `RR-09` | Preserve scope difference | Keep source-policy filtering intact; label counts as reachable/open-content counts and remove misleading empty affordances |
| `UF-10`, `UF-11`, `UF-12` | Add regression coverage + reduce manual doc claims | Extend tests and make count/claim surfaces derive from product-reachable summaries, not hand-maintained prose |

## Architectural decisions

### 1. Add support level to system definitions

Add an explicit support-level field to `SystemDefinition` so runtime surfaces can distinguish fully supported systems from scaffolds.

Planned type change:
- `src/registry/types.ts`
  - add `supportLevel?: 'full' | 'partial' | 'scaffold'`
  - add optional `supportNotes?: string`

Planned definition updates:
- `src/systems/dnd5e/definition.ts`
- `src/systems/dnd5e-2024/definition.ts`
- `src/systems/dnd35e/definition.ts`
- `src/systems/pf1e/definition.ts`
- `src/systems/pf2e/definition.ts`
- `src/systems/mam3e/definition.ts`
- `src/systems/daggerheart/definition.ts`

Expected values:
- `full`: 5e-2014, 5e-2024, PF2e, M&M
- `partial`: D&D 3.5e, PF1e if prestige-class work is not yet complete
- `scaffold`: Daggerheart

Why this is the right amount of abstraction:
- Support level already belongs with the system identity itself.
- It avoids building a second registry just to solve Daggerheart truth drift.

### 2. Introduce a thin product-summary layer for reporting surfaces

Current problem:
- `GameSystemSelector` uses metadata counts, which can include repo-only categories.
- `SystemStatusDashboard` hard-codes six loader categories and misses real user-facing categories.

Planned addition:
- new file: `src/types/system-catalog.ts`
  - `SystemContentCategoryId`
  - `SystemContentSummary`
  - `SystemCatalogSummary`
- new file: `src/utils/systemCatalog.ts`
  - async helpers that compute product-reachable counts per system
  - one summary object per system with only categories that are actually reachable in product

Important constraint:
- This layer summarizes counts and labels only.
- It does not replace specialized loaders or force every content family into a common browse shape.

### 3. Reachable content must flow through loaders

Rule:
- If a category is user-selectable or user-browsable in a sheet, it must have a loader path so shared reporting can count it honestly.

Immediate consequences:
- PF2e backgrounds stop using direct imports in the sheet.
- PF1e traits stop bypassing shared loading/reporting.
- M&M modifier options stop being sheet-local-only for content catalog purposes.

### 4. Use additive model changes for new persistent selections

Where persistent selection state is required, add optional fields and normalize defaults in `createDefaultData()` plus `prepareData()`.

Planned additive fields:
- `src/systems/pf2e/data-model.ts`
  - `selectedArchetypeIds?: string[]`
- `src/systems/dnd5e/data-model.ts`
  - `featureOptionSelections?: Array<{ id: string; group: Dnd5eFeatureOptionGroup }>`
- `src/systems/dnd5e-2024/data-model.ts`
  - `featureOptionSelections?: Array<{ id: string; group: Dnd5eFeatureOptionGroup }>`
- `src/systems/mam3e/data-model.ts`
  - `selectedArchetypeIds?: string[]`
  - expand complication entries to optional provenance:
    - `id?: string`
    - `source?: string`
    - `category?: string`

No destructive migration plan is needed if:
- new fields are optional
- default creators initialize them
- engines/sheets treat missing fields as empty state

## Workstreams

## WS-0: Truth alignment and support-level surfacing

Rows addressed:
- `UF-08`
- `UF-09`
- part of `UF-10`

### Scope

1. Add `supportLevel` to `SystemDefinition`.
2. Render support badges in system-selection and dashboard surfaces.
3. Stop treating scaffold systems as "ready" in content counts.

### File targets

- `src/registry/types.ts`
- `src/components/GameSystemSelector.tsx`
- `src/components/SystemStatusDashboard.tsx`
- `src/systems/*/definition.ts`
- `README.md`
- `docs/STATUS.md`

### Implementation details

`GameSystemSelector`:
- show `Scaffold` badge on Daggerheart
- suppress normal count badges for scaffold systems
- show a concise support note such as `Manual entry only`

`SystemStatusDashboard`:
- distinguish `ready` from `scaffold`
- do not let scaffold systems inflate the `X/Y systems loaded` readiness headline
- add a separate scaffold row or a support-level pill

`README.md`:
- replace "Production Ready across 7 game systems" with wording that reflects support levels
- move precise reachability claims into generated or audited docs instead of hard-coded prose when possible

### Acceptance criteria

- Daggerheart cannot appear identical to full systems on selector cards or dashboard rows.
- No top-level copy says all seven systems are production-ready.
- Existing full-support systems retain current create-sheet flow.

## WS-1: Shared reporting foundation

Rows addressed:
- `UF-03`
- `UF-07`
- `UF-11`
- `UF-12`
- `RR-08`
- `RR-09`

### Scope

1. Replace metadata-derived selector counts with product-reachable summaries.
2. Replace six-column fixed dashboard logic with per-system category summaries.
3. Distinguish:
   - product-reachable counts
   - repo-resident counts
   - source-scope filtered counts

### File targets

- `src/types/system-catalog.ts` (new)
- `src/utils/systemCatalog.ts` (new)
- `src/components/GameSystemSelector.tsx`
- `src/components/SystemStatusDashboard.tsx`
- `src/scripts/generate-roadmap-metrics.ts`

### Product-summary schema

Recommended shape:

```ts
export type SystemContentCategoryId =
  | 'spells'
  | 'classes'
  | 'species'
  | 'backgrounds'
  | 'traits'
  | 'monsters'
  | 'equipment'
  | 'feats'
  | 'advantages'
  | 'archetypes'
  | 'complications'
  | 'powerModifiers'
  | 'featureOptions';

export interface SystemContentSummary {
  id: SystemContentCategoryId;
  label: string;
  count: number;
  reachability: 'product' | 'repo-only' | 'source-filtered';
}

export interface SystemCatalogSummary {
  systemId: GameSystemId;
  supportLevel: 'full' | 'partial' | 'scaffold';
  categories: SystemContentSummary[];
}
```

### Implementation details

`GameSystemSelector`:
- make counts async and loader-derived through `systemCatalog.ts`
- show only the top 2-4 most relevant product categories per system
- never add metadata-only prestige counts or archetype counts unless the sheet can reach them

`SystemStatusDashboard`:
- render the categories returned for each system instead of assuming six fixed ones
- count PF2e backgrounds and PF1e traits once they become loader-backed
- show source-filtered categories with a tooltip or note when relevant

`generate-roadmap-metrics.ts`:
- emit two outputs:
  - `productReachable`
  - `repoResident`
- mark `sourceFiltered` rows explicitly instead of collapsing them into "missing"

### Acceptance criteria

- Selector and dashboard counts match reachable sheet behavior.
- PF2e raw ancestry count can remain 7 in repo reporting while product reporting stays 6.
- D&D 5e-2014 feat count remains 0 without being misreported as missing implementation.

## WS-2: D&D 5e remediation

Rows addressed:
- `UF-01`
- `UF-02`
- `RR-02`
- `RR-09`

### Part A: real 5e monster browsing

Status: shipped.

File targets:
- `src/systems/dnd5e/shared/Dnd5eSheetBase.tsx`
- `src/__tests__/components/SystemSheets.test.tsx`
- `src/__tests__/components/MonsterBrowser.test.tsx` if new integration behavior needs coverage

Implementation:
1. Import `loadMonstersForSystem` into `Dnd5eSheetBase`.
2. Add monster state and lazy-load handling parallel to spells/feats/equipment.
3. Lazy import `MonsterBrowser`.
4. Add a `monster-browser` tab for both 2014 and 2024 variants.
5. Render monster browse content with the same loading conventions as spells and equipment.

Acceptance:
- Both 5e sheets expose a functional monster tab.
- The tab loads 41 monsters for 2014 and 99 for 2024 under current loader policy.
- `UF-01` and `UF-02` can be closed without doc downgrades.

### Part B: 5e-2014 feature-option catalogs

Status: shipped on March 7, 2026.

Delivered:
- normalized loader-backed catalog across invocations, smites, maneuvers, ki abilities, channel-divinity options, wild shapes, metamagic, and fighting styles
- `featureOptionSelections` persisted on the shared 5e data models
- shared Features-tab browser and selected-item management in `Dnd5eSheetBase`
- mirrored provenance entries in `features`
- reporting support through `systemCatalog.ts` and `generate-roadmap-metrics.ts`

Primary files:
- `src/types/character-options/feature-options.ts` (new)
- `src/utils/dnd5eFeatureOptions.ts`
- `src/utils/dataLoader.ts`
- `src/components/FeatureOptionBrowser.tsx` (new)
- `src/systems/dnd5e/shared/Dnd5eSheetBase.tsx`
- `src/systems/dnd5e/data-model.ts`
- `src/systems/dnd5e-2024/data-model.ts`

Acceptance:
- Users can browse and persist all repo-backed 5e-2014 option catalogs.
- Selected entries survive reload/export/import.
- Reporting surfaces no longer treat these datasets as invisible repo-only data.
- Advanced downstream rule effects remain intentionally manual.

### Part C: 5e-2014 feats source-scope cleanup

Status: shipped.

Implementation:
- keep feat count at zero
- do not broaden source policy
- suppress the empty Feats tab for systems whose feat loader resolves to zero by policy, or relabel it as unavailable

Preferred fix:
- gate the Feats tab on `feats.length > 0 || systemId !== 'dnd-5e-2014'`

Acceptance:
- 5e-2014 no longer exposes a misleading permanent-empty feat affordance.
- The count remains 0 and is labeled as source-limited, not missing implementation.

## WS-3: D20 legacy remediation

Rows addressed:
- `UF-04`
- `UF-05`
- `UF-06`
- `RR-03`
- `RR-04`

### Part A: remove the dead monster path

Status: shipped.

File targets:
- `src/systems/d20-legacy/sheet.tsx`

Implementation:
- remove monster state, monster loader call, tab trigger, and tab content from `D20LegacySheet`
- remove now-unused `MonsterBrowser` import and related lazy-loading

Why removal is preferred over gating:
- this sheet only serves 3.5e and PF1e in current registry wiring
- neither system has a monster loader path today
- a hidden capability flag would add code for a state that does not currently exist

Acceptance:
- No D20 legacy user can click into a dead monster tab.

### Part B: Pathfinder 1e prestige-class productization

Status: shipped for the vetted CRB subset; manual spell-progression warnings remain for the unresolved prestige casters.

PF1e data quality is already sufficient:
- prestige classes are already `CharacterClass[]`

File targets:
- `src/utils/dataLoader.ts`
- `src/utils/d20LegacyTemplate.ts`
- `src/systems/d20-legacy/sheet.tsx`
- `src/components/GameSystemSelector.tsx`
- `src/__tests__/utils/d20LegacyTemplate.test.ts`
- `src/__tests__/d20-legacy-template-pipeline.test.ts`

Implementation:
1. Extend PF1e class loading to include prestige classes.
   - recommended approach: default `loadClassesForSystem('pf1e')` returns base + prestige once UI is ready
2. Extend `d20LegacyTemplate.ts` catalog to include `pf1ePrestigeClasses`.
3. Group PF1e class dropdowns:
   - Base classes
   - Prestige classes
4. Add prerequisite rendering in the UI.
   - phase 1: warning-only display
   - phase 2: optional validation gate
5. Once reachable, leave selector counts in place because they become truthful.

Acceptance:
- PF1e selector counts equal actual dropdown reachability.
- Applying a PF1e prestige class works through the same class-level/template pipeline as base classes.

### Part C: D&D 3.5e prestige-class normalization

Current blocker:
- 3.5e prestige data is not `CharacterClass`-compatible. It uses a custom `PrestigeClass` shape without enough fields to safely enter template/engine paths.

Required strategy:
- do not fake parity by inventing missing class fields in an adapter

Phase 1 immediate fix:
- stop counting 3.5e prestige classes as reachable classes in `GameSystemSelector`

Phase 2 data normalization:
- refactor `src/data/dnd/3.5e/prestige-classes/index.ts` into full `CharacterClass` definitions with explicit:
  - `system`
  - `primaryAbility`
  - `savingThrowProficiencies`
  - armor/weapon/tool proficiencies
  - skill-choice metadata
  - `features` in `ClassFeatureProgression[]` form
  - multiclass/prerequisite metadata

File targets:
- `src/data/dnd/3.5e/prestige-classes/*`
- `src/data/dnd/3.5e/metadata.ts`
- `src/utils/dataLoader.ts`
- `src/utils/d20LegacyTemplate.ts`
- `src/systems/d20-legacy/sheet.tsx`
- `src/components/GameSystemSelector.tsx`

Acceptance:
- Short-term: selector count reflects only reachable 3.5e classes.
- Long-term: normalized prestige classes become loader/template/sheet reachable without type shims that guess missing rules data.

## WS-4: Pathfinder 2e remediation

Rows addressed:
- `UF-03`
- `RR-01`
- `RR-08`
- part of `UF-12`

### Part A: PF2e backgrounds through real loaders

Status: shipped.

File targets:
- `src/utils/dataLoader.ts`
- `src/systems/pf2e/sheet.tsx`
- `src/components/SystemStatusDashboard.tsx`
- `src/utils/systemCatalog.ts`
- `src/__tests__/dataLoader.test.ts`
- `src/__tests__/components/SystemSheets.test.tsx`

Implementation:
1. Add `loadPf2eBackgrounds()`.
2. Extend `loadBackgroundsForSystem('pf2e')`.
3. Replace direct `pf2eBackgrounds` sheet import with loader-backed state.
4. Keep the `applyPf2eBackgroundTemplate()` path unchanged; only the source of selectable options changes.
5. Count backgrounds in reporting surfaces once the sheet is loader-backed.

Acceptance:
- PF2e backgrounds remain selectable in the sheet.
- Shared reporting surfaces now show the same existence/count truth as the sheet.

### Part B: PF2e archetype reachability

Status: shipped.

File targets:
- `src/systems/pf2e/data-model.ts`
- `src/utils/dataLoader.ts`
- `src/systems/pf2e/sheet.tsx`
- `src/utils/pf2eTemplate.ts`
- `src/components/SystemStatusDashboard.tsx`
- `src/utils/systemCatalog.ts`
- `src/__tests__/metadata-counts.test.ts`
- new PF2e loader/sheet tests

Implementation:
1. Add `selectedArchetypeIds?: string[]` to `Pf2eDataModel` and default it to `[]`.
2. Add `loadPf2eArchetypes()` and `loadArchetypesForSystem('pf2e')`.
3. Add a new PF2e archetype section or tab.
4. First-iteration behavior:
   - browse archetypes
   - add/remove selected archetype IDs
   - reflect selected archetype features into `features` with source provenance
5. Do not attempt full archetype-feat automation in phase 1 unless the repo grows the necessary feat graph.

Acceptance:
- PF2e archetypes are no longer repo-only.
- README archetype claims can become truthful or be rewritten from the new product summary.

### Part C: preserve ancestry source-scope filtering

Implementation:
- keep CRB-only filtering exactly as it is
- ensure selector/dashboard labels represent reachable/open-content counts, not raw repo totals

Acceptance:
- PF2e ancestry product count stays 6 unless policy changes.
- No code path treats the difference between 7 raw exports and 6 reachable entries as a bug.

## WS-5: Mutants & Masterminds remediation

Rows addressed:
- `RR-05`
- `RR-06`
- `RR-07`
- part of `UF-12`

### Part A: M&M archetype surface

Status: shipped on March 7, 2026. The native M&M sheet now exposes 15 loader-backed archetypes through a dedicated browser tab and persists pinned reference archetypes in the character document.

Constraint:
- Current archetype data is rich enough for browsing/reference, but not clearly rich enough to auto-build full characters without inventing missing power-point allocations.

Chosen scope:
- productize as a browse/reference surface first
- defer apply-template behavior until the data model is expanded explicitly

File targets:
- `src/utils/dataLoader.ts`
- `src/systems/mam3e/sheet.tsx`
- `src/components/MamArchetypeBrowser.tsx`
- `src/utils/systemCatalog.ts`

Implementation:
1. Add `loadMam3eArchetypesForSystem('mam3e')`.
2. Add an archetype browser tab plus persistent pinning in the M&M sheet.
3. Surface name, description, source, and features.
4. Keep the scope reference-only; do not auto-build powers or point totals.

Acceptance:
- M&M archetypes are reachable product content rather than repo-only metadata.

### Part B: M&M power modifiers through loaders

Status: shipped on March 7, 2026. Power modifiers now load through a shared loader, appear in system reporting/metrics, and are browseable from the M&M reference surface while `powerMath.ts` remains the cost engine.

File targets:
- `src/utils/dataLoader.ts`
- `src/systems/mam3e/powerMath.ts`
- `src/systems/mam3e/sheet.tsx`
- `src/utils/systemCatalog.ts`

Implementation:
1. Add `loadPowerModifiersForSystem('mam3e')`.
2. Keep `powerMath.ts` as the cost engine.
3. Replace sheet-local direct modifier sourcing with loaded modifier catalogs where practical.
4. Count modifiers in reporting surfaces as a real category.

Acceptance:
- Modifier counts are no longer invisible to shared reporting.
- The sheet and the reporting layer use the same modifier source of truth.

### Part C: M&M complications browser plus insertion

Status: shipped on March 7, 2026. The native M&M sheet now loads 28 SRD complications, preserves manual custom entries, and inserts repo-backed complications with provenance into the current document.

File targets:
- `src/systems/mam3e/data-model.ts`
- `src/utils/dataLoader.ts`
- `src/systems/mam3e/sheet.tsx`
- `src/components/MamComplicationBrowser.tsx`
- `src/utils/systemCatalog.ts`

Implementation:
1. Extend `Mam3eDataModel.complications` entries with optional provenance fields.
2. Add `loadComplicationsForSystem('mam3e')`.
3. Keep manual custom-entry support.
4. Add a browser/reference panel with "Insert complication" action that copies dataset entries into the current document.

Acceptance:
- M&M complications can be selected from repo-backed definitions or entered manually.
- Existing user-created manual complications remain valid.

## WS-6: Daggerheart runtime truth alignment plus minimum test parity

Rows addressed:
- `UF-08`
- `UF-09`
- `UF-10`

### Scope

1. Keep Daggerheart explicitly scaffold-only until local data exists.
2. Add missing baseline automated coverage so scaffold status does not also mean untested.

File targets:
- `src/systems/daggerheart/definition.ts`
- `src/components/GameSystemSelector.tsx`
- `src/components/SystemStatusDashboard.tsx`
- new `src/__tests__/engines/daggerheart-engine.test.ts`
- `src/__tests__/components/SystemSheets.test.tsx`

Implementation:
1. Add Daggerheart to `SystemSheets.test.tsx`.
2. Add a Daggerheart engine test file covering:
   - prepareData defaults
   - Hope/Fear roll shape
   - damage/healing edge cases already supported by engine
3. Show scaffold support level and zero content counts without implying readiness parity.

Acceptance:
- Daggerheart is honestly presented and no longer silently excluded from baseline tests.

## WS-7: Documentation, metrics, and parity regression suite

Rows addressed:
- `UF-10`
- `UF-11`
- `UF-12`
- all rows indirectly

### Documentation strategy

Current problem:
- README is carrying count/detail claims that drift faster than implementation.

Fix:
- reduce README to high-level support statements
- point precise counts to generated or audited docs
- ensure generated metrics distinguish product-reachable from repo-resident

File targets:
- `README.md`
- `docs/STATUS.md`
- `src/scripts/generate-roadmap-metrics.ts`
- `docs/generated/roadmap-metrics.md`
- `docs/generated/roadmap-metrics.json`

### Regression tests to add

1. `src/__tests__/parity-regression.test.ts` (new)
   - 5e sheets expose monsters
   - D20 legacy sheet does not expose monsters
   - PF2e backgrounds are loader-backed
   - selector counts match reachable loader counts for PF1e and 3.5e
   - Daggerheart support level is scaffold

2. Loader tests
   - PF2e backgrounds
   - PF2e archetypes
   - PF1e traits
   - M&M archetypes
   - M&M modifiers
   - M&M complications
   - 5e feature options

3. UI tests
   - selector support badge logic
   - dashboard dynamic-category rendering
   - 5e monster tab
   - PF2e archetype section
   - M&M archetype/complication browser sections

4. Template tests
   - PF1e prestige-class application
   - 5e feature-option selection persistence

### Acceptance criteria

- Count claims in runtime UI come from shared product-reachable summaries.
- README no longer contains stale product-level category claims.
- Every audit row has at least one regression assertion or an explicit truth-alignment assertion.

## Sequencing

## Phase 0: stop lying

Status: complete

Deliverables:
- WS-0 support levels
- Daggerheart truth alignment
- D20 monster tab removal
- README support-level correction

Why first:
- This closes the worst P0 drift without waiting for feature work.

## Phase 1: shared count truth

Status: complete

Deliverables:
- WS-1 product summary layer
- selector/dashboard conversion to product-reachable summaries
- `generate-roadmap-metrics.ts` updated to reflect product-reachable feature-option counts alongside repo-only module audits

Why second:
- Every later feature can plug into one honest reporting path.

## Phase 2: low-risk propagation fixes

Status: complete

Deliverables:
- PF2e backgrounds loader conversion
- PF1e traits loader conversion/reporting
- Daggerheart baseline tests

Why third:
- These are mostly wiring changes and establish the "everything reachable is loader-backed" rule.

## Phase 3: feature/productization work

Status: complete

Deliverables:
- 5e monster browser
- PF1e prestige classes
- PF2e archetypes
- 5e-2014 feature-option surface
- M&M archetypes/modifiers/complications surfaces

Why fourth:
- These are real user-facing additions with manageable data quality.

## Phase 4: complex normalization work

Status: active

Deliverables:
- 3.5e prestige-class normalization and eventual productization

Why last:
- The remaining work is now primarily non-trivial data normalization.

## Risks and blockers

### 1. 3.5e prestige-class normalization is not a wiring task

Risk:
- The current raw `PrestigeClass` shape is too thin for safe insertion into template logic.

Mitigation:
- Split the work:
  - immediate selector truth fix
  - later normalization to real `CharacterClass` data

### 2. M&M archetypes may not be template-ready

Risk:
- Current archetype records may not encode enough full-character construction detail.

Mitigation:
- Treat browse/reference as the required parity closure for phase 1. This is now the shipped behavior.
- Do not promise apply-template behavior without richer data.

### 3. 5e option catalogs can explode into automation creep

Risk:
- It is easy to turn "make these reachable" into a full rule-engine rewrite.

Mitigation:
- Phase 1 stores selections plus provenance and reflects them into `features`.
- Deep mechanics remain follow-up work.

### 4. Reporting drift can recur if docs stay hand-maintained

Risk:
- Manual README count edits will drift again.

Mitigation:
- remove high-precision claims from README
- prefer generated docs and audited status pages

## Completion checklist

The parity gaps are considered remediated when all of the following are true:

- `UF-01`, `UF-02`: 5e monster browsing is real and docs match it.
- `UF-03`: PF2e backgrounds load through shared loader/reporting path.
- `UF-04`: D20 legacy monster tab is gone.
- `UF-05`, `UF-06`: selector counts match reachable class options.
- `UF-07`: PF1e traits are countable through shared reporting.
- `UF-08`, `UF-09`: Daggerheart is visibly scaffold-level everywhere.
- `UF-10`: Daggerheart has baseline engine/sheet coverage and E2E expansion is underway.
- `UF-11`, `UF-12`: README no longer contains stale or repo-only product claims.
- `RR-01`: PF2e archetypes are product-reachable.
- `RR-02`: 5e-2014 feature-option catalogs are product-reachable.
- `RR-03`: 3.5e reachable counts are truthful now, and prestige classes are productized only after normalization.
- `RR-04`: PF1e prestige classes are product-reachable.
- `RR-05`: M&M archetypes are product-reachable.
- `RR-06`: M&M power modifiers are loader-countable and no longer invisible to reporting.
- `RR-07`: M&M complications can be inserted from repo-backed definitions.
- `RR-08`, `RR-09`: source-scope differences remain documented, intentional, and free of misleading UI.

## Suggested execution order by file cluster

1. Registry and shared surfaces
   - `src/registry/types.ts`
   - `src/systems/*/definition.ts`
   - `src/types/system-catalog.ts`
   - `src/utils/systemCatalog.ts`
   - `src/components/GameSystemSelector.tsx`
   - `src/components/SystemStatusDashboard.tsx`

2. Fast truth fixes
   - `src/systems/d20-legacy/sheet.tsx`
   - `README.md`
   - `docs/STATUS.md`

3. PF2e and PF1e propagation fixes
   - `src/utils/dataLoader.ts`
   - `src/systems/pf2e/sheet.tsx`
   - `src/systems/pf2e/data-model.ts`
   - `src/utils/pf2eTemplate.ts`
   - `src/utils/d20LegacyTemplate.ts`

4. 5e feature work
   - `src/systems/dnd5e/shared/Dnd5eSheetBase.tsx`
   - `src/systems/dnd5e/data-model.ts`
   - `src/systems/dnd5e-2024/data-model.ts`
   - new 5e feature-option files/components

5. M&M feature work (shipped March 7, 2026)
   - `src/systems/mam3e/data-model.ts`
   - `src/systems/mam3e/powerMath.ts`
   - `src/systems/mam3e/sheet.tsx`
   - new M&M browse components

6. 3.5e normalization
   - `src/data/dnd/3.5e/prestige-classes/*`
   - `src/data/dnd/3.5e/metadata.ts`
   - `src/utils/dataLoader.ts`
   - `src/utils/d20LegacyTemplate.ts`

7. Tests and scripts
   - `src/__tests__/...`
   - `e2e/phase3-workflows.spec.ts` or follow-on specs
   - `src/scripts/generate-roadmap-metrics.ts`
