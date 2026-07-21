# Daggerheart Data Organization Plan

> Historical architecture/source record: the planning content in this file has been subsumed by `docs/MASTER_PLAN.md`, which is now the sole planning authority.
>
> Unique historical value: this file preserves the original Daggerheart data-shape rationale and the early structure proposals that informed the shipped `src/data/daggerheart/1.0/` tree.
>
> Superseded structure note: the current repo ships flat per-domain files under `src/data/daggerheart/1.0/domain-cards/` plus `automation.ts`; nested `domain-cards/<domain>/level-*.ts` folders are a historical proposal, not the current structure.
>
> Any planning implications below are historical context only; the live Daggerheart roadmap now lives in `docs/MASTER_PLAN.md`.

Current repo truth note (March 16, 2026): the repo now ships the versioned Daggerheart data tree, selector-backed identities, loadout/vault persistence, import/export coverage, deterministic passive automation, and automation badges/support notes. Remaining live Daggerheart work is deterministic-only automation expansion plus regression and support-honesty maintenance.

This historical plan was based on the existing shipped data layouts in:

- `src/data/dnd/5e-2024/`
- `src/data/dnd/5e-2014/`
- `src/data/dnd/3.5e/`
- `src/data/pathfinder/1e/`
- `src/data/pathfinder/2e/`
- `src/data/mutants-and-masterminds/3e/`
- `src/data/index.ts`
- `src/utils/dataLoader.ts`
- `src/utils/openContentPolicy.ts`

The original goal was to add Daggerheart content without inventing a one-off structure that ignored the repo's current conventions.

Status on March 16, 2026:

- `src/data/daggerheart/1.0/` now exists
- classes, ancestries, communities, metadata, strict source filtering, and dedicated loaders are shipped
- the native sheet now consumes those selectors, supports unresolved/manual fallbacks, and shows SRD reference panels
- weapons, armor, templates, browse tabs, domains, and domain cards are now shipped
- loadouts, vault persistence, import/export roundtrip, and deterministic passive automation are now shipped

## Repo Conventions To Reuse

1. Each supported system owns a versioned data root under `src/data/<family>/<edition>/`.
2. Each system exports a computed `metadata.ts` module with counts derived from imports, not hardcoded doc values.
3. Each content family exposes a category `index.ts` that acts as the canonical import surface for loaders and metadata.
4. Leaf files hold typed data entries; category indexes aggregate them into arrays or records.
5. `src/utils/dataLoader.ts` dynamically imports category indexes, normalizes the exported arrays/records, dedupes by `id`, and applies `filterOpenContentBySource()`.
6. `src/utils/openContentPolicy.ts` is the enforcement point for allowed source strings, so source attribution in the data files must be consistent.
7. Subfolders are used only when a category has a real second axis the code benefits from:
   - spells by level
   - monsters by creature type
   - M&M powers by mechanical family
   - class-specific subclass files under a class folder

## What Not To Copy Blindly

- Do not copy the current `src/data/index.ts` Daggerheart placeholder that returns `Promise.resolve({})`.
- Do not force every Daggerheart category into the `Spell` or `Background` interfaces if the fit is obviously lossy.
- Do not rely on "scan every export in the module" loader behavior when a clean canonical array can be exported directly.
- Do not hardcode counts in docs; compute them in `metadata.ts` and regenerate derived docs from there.

## Recommended Root Layout

Create a real versioned Daggerheart data tree:

```text
src/data/daggerheart/1.0/
  metadata.ts
  classes/
    index.ts
    guardian.ts
    ranger.ts
    rogue.ts
    seraph.ts
    sorcerer.ts
    warrior.ts
    wizard.ts
    ...
  ancestries/
    index.ts
    human.ts
    ...
  communities/
    index.ts
    ...
  equipment/
    index.ts
    weapons.ts
    armor.ts
    gear.ts
    consumables.ts
  domains/
    index.ts
    arcana.ts
    blade.ts
    bone.ts
    ...
  domain-cards/
    index.ts
    arcana/
      level-1.ts
      level-2.ts
    blade/
      level-1.ts
      level-2.ts
```

This matches the current repo pattern:

- stable versioned root
- one folder per user-facing content family
- `index.ts` as the canonical category surface
- optional nested folders only where cards are naturally grouped by both domain and level

## Type And Loader Mapping

Use existing shared types where the fit is good, and add Daggerheart-specific types where the shared contracts would distort the data.

### Current Shipped Decision

- `DaggerheartClass`
- `DaggerheartAncestry`
- `DaggerheartCommunity`

This is the path the repo now uses. It keeps the data honest and avoids pretending ancestries/communities are generic `Species` or `Background` records.

### Future Daggerheart-Specific Types

- `DaggerheartDomain`
- `DaggerheartDomainCard`
- possibly equipment-specific helpers if the generic `Item` contract proves lossy

## Export Conventions

Each category `index.ts` should expose one canonical loader-facing collection plus optional helper indexes.

Examples:

```ts
export const daggerheartClasses: DaggerheartClass[] = [...];
export const daggerheartClassesById: Record<string, DaggerheartClass> = ...;
export const getClass = (id: string) => daggerheartClassesById[id];
```

export const daggerheartEquipment = {
  weapons,
  armor,
  gear,
  consumables,
};
```

The important part is that `metadata.ts` and `dataLoader.ts` import a deliberate canonical surface, not arbitrary leaf files.

## Metadata Plan

Add `src/data/daggerheart/1.0/metadata.ts` that mirrors the existing systems:

- `system: 'daggerheart'`
- `edition: '1.0'`
- `version: 'Daggerheart 1.0'` or the final open-content label
- `stats` derived from the category indexes
- `sources` with the exact open-content source strings used in the leaf files
- `getProgress()` derived from actual imported counts

Once this exists, update `src/data/index.ts` so Daggerheart stops being a metadata stub.

## Loader Plan

Add explicit Daggerheart loader helpers to `src/utils/dataLoader.ts` instead of overloading unrelated systems:

- `loadDaggerheartClassesForSystem()`
- `loadDaggerheartAncestriesForSystem()`
- `loadDaggerheartCommunitiesForSystem()`
- later: equipment/domain/domain-card loaders as the sheet gains real browse surfaces

Then wire only the categories the sheet can actually browse.

Initial target:

1. classes
2. ancestries
3. communities

Second wave:

1. equipment
2. domains
3. domain cards

This avoids building loader categories the current Daggerheart sheet cannot yet consume.

## Open-Content Rules

Before populating the files, tighten `strictOpenContentPolicy.daggerheart.allowedSources` to the exact source strings used by the real Daggerheart open content.

Do not start data entry until the final allowed source labels are known, because every shipped system in this repo is filtered at load time by source attribution.

## Recommended Implementation Order

1. Create `src/data/daggerheart/1.0/metadata.ts` and root category folders.
2. Add dedicated Daggerheart class/ancestry/community types.
3. Populate classes, ancestries, communities, and metadata from the official SRD.
4. Update `src/data/index.ts` to use real Daggerheart metadata.
5. Add dedicated Daggerheart loader helpers.
6. Add targeted loader and sheet tests.
7. Extend the Daggerheart sheet with selector/reference flows.
8. Only then expand into equipment/domains/domain cards.

## Practical Rule Of Thumb

If Daggerheart content can fit an existing repo-wide type without lying about the data, reuse the type.
If reusing the type would require fake fields, misleading names, or distorted semantics, add a Daggerheart-specific type but keep the folder/index/metadata/loader structure consistent with the rest of the repo.
