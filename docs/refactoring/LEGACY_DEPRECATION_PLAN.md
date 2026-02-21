# Legacy Debt Deprecation & Removal Plan

**Last Updated:** February 18, 2026  
**Scope:** V2 Document architecture cleanup and legacy surface retirement.

---

## Sweep Method

This audit was performed with targeted code search over runtime and test paths:

- `rg -n "useCharacters|CharacterCreation|DataManagement" src docs README.md`
- `rg -n "loadCharacters\(|saveCharacters\(|exportCharacters\(|importCharacters\(|clearAllData\(" src`
- `rg -n "dataMigration" src`
- `rg -n "types/core/character|types/game-systems" src`

---

## Current Legacy Inventory

### 1) Removed in Phase 3

| Artifact | Current Status | Notes |
| --- | --- | --- |
| `src/hooks/useCharacters.ts` | Removed | Legacy hook retired; runtime uses `useDocuments` only. |
| `src/components/CharacterCreation.tsx` | Removed | Legacy wizard UI retired. |
| `src/components/DataManagement.tsx` | Removed | Legacy V1 data management panel retired. |
| `src/utils/dataMigration.ts` | Removed | Migration logic consolidated under `migrateLegacy.ts`. |
| `src/__tests__/CharacterCreation.test.tsx` | Removed | Replaced by V2 flow coverage. |
| `src/__tests__/components/DataManagement.test.tsx` | Removed | Replaced by V2 flow coverage. |
| `src/__tests__/dataMigration.test.ts` | Removed | Replaced by `documentStorage` migration tests. |

### 2) Runtime migration bridge (still required short-term)

| Artifact | Current Runtime Use | Removal Blocker |
| --- | --- | --- |
| `src/utils/storage.ts` | Read by `src/utils/documentStorage.ts` during legacy fallback | Needed while supporting `rpg-characters` legacy imports. |
| `src/utils/migrateLegacy.ts` | Used by `src/utils/documentStorage.ts` during fallback migration | Needed until legacy storage support is retired. |
| `src/utils/documentStorage.ts` | Owns V2-first load + legacy migration semantics | Must remain until Phase 5 migration bridge removal. |

### 3) Transitional runtime adapters (active)

| Artifact | Current Runtime Use | Removal Blocker |
| --- | --- | --- |
| `src/components/D20SheetAdapter.tsx` | Active for D&D 5e 2014/2024 sheet rendering | D&D systems still rely on legacy tabbed sheet contract. |
| `src/components/CharacterSheetTabs.tsx` | Active via `D20SheetAdapter` | Needs replacement by native/document-first D&D sheets. |
| `src/components/CharacterSheet.tsx` | Active via `CharacterSheetTabs` | Same as above. |
| `src/components/LevelUpDialog.tsx` | Active via legacy sheet tabs | Same as above. |
| `src/types/core/character.ts` | Legacy character shape still used by adapters/engines/tests | Requires full adapter retirement to remove. |

---

## Deprecation Strategy (Phased)

### Phase 1: Freeze Legacy Surface (Complete)

1. Keep deprecated modules read-only; no new feature work in `useCharacters`, `CharacterCreation`, or `DataManagement`.
2. Route all new app behavior through `CharacterDocument` + `useDocuments`.
3. Keep integration coverage focused on `App` V2 flows (create/edit/import/export/clear).

**Exit Criteria:** No new runtime imports of test-only legacy modules.

**Status:** Complete. Legacy feature work remained frozen while V2 document flows continued.

### Phase 2: Move Migration Ownership to Storage Layer (Complete)

1. Move legacy key read/migration from `src/App.tsx` into `src/utils/documentStorage.ts` (or `useDocuments`).
2. Ensure migration is idempotent and single-responsibility (document persistence owns migrations).
3. Preserve behavior: auto-upgrade `rpg-characters` -> `rpg-documents-v2`.

**Exit Criteria:** `App.tsx` no longer imports `loadCharacters` or `migrateLegacyCharacters`.

**Status:** Complete. `App.tsx` migration effect was removed; migration now runs through `loadDocuments()`.

### Phase 3: Remove Test-only Legacy Modules (Complete)

1. Remove:
   - `src/hooks/useCharacters.ts`
   - `src/components/CharacterCreation.tsx`
   - `src/components/DataManagement.tsx`
2. Replace/remove tests tied exclusively to those modules:
   - `src/__tests__/CharacterCreation.test.tsx`
   - `src/__tests__/components/DataManagement.test.tsx`
3. Keep equivalent coverage in V2 app/integration tests.

**Exit Criteria:** Legacy module files removed; test suite still green.

**Status:** Complete. V2 coverage now includes migration (`documentStorage.test.ts`) and app-level create/import/export/clear flows.

### Phase 4: Retire D20 Legacy UI Adapter Path (Complete)

1. Implement native/document-first D&D 5e sheets (2014/2024).
2. Update system definitions to stop using `makeD20Sheet()`.
3. Remove:
   - `src/components/D20SheetAdapter.tsx`
   - `src/components/CharacterSheetTabs.tsx`
   - `src/components/CharacterSheet.tsx`
   - `src/components/LevelUpDialog.tsx`

**Exit Criteria:** No runtime dependency on legacy `Character` shape for D&D systems.

**Status:** Complete. Native React components built for all systems. LevelUpDialog and progression engine code deleted.

### Phase 5: Remove V1 Storage + Migration Bridge

1. Remove `src/utils/storage.ts` once migration support window closes.
2. Remove `src/utils/migrateLegacy.ts` if no longer needed.
3. Remove V1 storage tests (`src/__tests__/storage.test.ts`) or convert them to historical fixture tests only.

**Exit Criteria:** Only V2 key `rpg-documents-v2` remains in runtime code.

---

## Risks & Mitigations

- **Risk:** Breaking existing users with only V1 localStorage data.  
  **Mitigation:** Do not remove V1 bridge until migration has lived through a release window and telemetry/QA confirms conversion stability.

- **Risk:** Coverage regression after deleting legacy tests.  
  **Mitigation:** Add/expand App-level V2 integration tests before deletion.

- **Risk:** D&D UX regression while replacing adapter-based sheet.  
  **Mitigation:** Ship native D&D sheets behind side-by-side test parity checks.

---

## Tracking Checklist

- [x] Phase 1 complete
- [x] Phase 2 complete
- [x] Phase 3 complete
- [x] Phase 4 complete
- [ ] Phase 5 complete
