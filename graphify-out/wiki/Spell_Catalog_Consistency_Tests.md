# Spell Catalog Consistency Tests

> 22 nodes · cohesion 0.14

## Key Concepts

- **Spell** (38 connections) — `src/types/magic/spells.ts`
- **spellCatalog.ts** (11 connections) — `src/utils/spellCatalog.ts`
- **spellCatalogCrossSystem.test.ts** (10 connections) — `src/__tests__/spellCatalogCrossSystem.test.ts`
- **indexById.ts** (6 connections) — `src/utils/indexById.ts`
- **buildSpellCatalog()** (5 connections) — `src/utils/spellCatalog.ts`
- **dedupeById()** (4 connections) — `src/utils/indexById.ts`
- **indexById()** (4 connections) — `src/utils/indexById.ts`
- **warnDuplicateId()** (3 connections) — `src/utils/indexById.ts`
- **resolveSpellIdAlias()** (3 connections) — `src/utils/spellCatalog.ts`
- **Props** (2 connections) — `src/systems/d20-legacy/components/D20SpellBrowserPanel.tsx`
- **Props** (2 connections) — `src/systems/pf2e/components/Pf2eSpellBrowserPanel.tsx`
- **e()** (2 connections) — `src/__tests__/spellCatalogCrossSystem.test.ts`
- **buildClassAndLevelIndex()** (2 connections) — `src/utils/spellCatalog.ts`
- **BuildSpellCatalogOptions** (2 connections) — `src/utils/spellCatalog.ts`
- **buildSpellIndex()** (2 connections) — `src/utils/spellCatalog.ts`
- **SpellCatalog** (2 connections) — `src/utils/spellCatalog.ts`
- **ExpectedSpellIdentity** (1 connections) — `src/__tests__/spellCatalogCrossSystem.test.ts`
- **findByName()** (1 connections) — `src/__tests__/spellCatalogCrossSystem.test.ts`
- **iconicSpellExpectations** (1 connections) — `src/__tests__/spellCatalogCrossSystem.test.ts`
- **SystemKey** (1 connections) — `src/__tests__/spellCatalogCrossSystem.test.ts`
- **systems** (1 connections) — `src/__tests__/spellCatalogCrossSystem.test.ts`
- **Identified** (1 connections) — `src/utils/indexById.ts`

## Relationships

- [Spell Browser UI](Spell_Browser_UI.md) (7 shared connections)
- [Pf2e Spell Types & Traits](Pf2e_Spell_Types_%26_Traits.md) (7 shared connections)
- [Sheet Resource Loading Hooks](Sheet_Resource_Loading_Hooks.md) (6 shared connections)
- [Spells Tab Components](Spells_Tab_Components.md) (5 shared connections)
- [D20 Legacy Spell Slots](D20_Legacy_Spell_Slots.md) (3 shared connections)
- [MAM Power Browser](MAM_Power_Browser.md) (2 shared connections)
- [Browser Compat & Error Logging](Browser_Compat_%26_Error_Logging.md) (1 shared connections)
- [Dnd5e Sheets & E2E Tests](Dnd5e_Sheets_%26_E2E_Tests.md) (1 shared connections)
- [Dnd35e Saves & Data Model](Dnd35e_Saves_%26_Data_Model.md) (1 shared connections)
- [Spell Validation Checks](Spell_Validation_Checks.md) (1 shared connections)
- [Spell Catalog Parity Tests](Spell_Catalog_Parity_Tests.md) (1 shared connections)
- [Currency & Inventory Editors](Currency_%26_Inventory_Editors.md) (1 shared connections)

## Source Files

- `src/__tests__/spellCatalogCrossSystem.test.ts`
- `src/systems/d20-legacy/components/D20SpellBrowserPanel.tsx`
- `src/systems/pf2e/components/Pf2eSpellBrowserPanel.tsx`
- `src/types/magic/spells.ts`
- `src/utils/indexById.ts`
- `src/utils/spellCatalog.ts`

## Audit Trail

- EXTRACTED: 103 (99%)
- INFERRED: 1 (1%)
- AMBIGUOUS: 0 (0%)

---

*Part of the graphify knowledge wiki. See [index](index.md) to navigate.*