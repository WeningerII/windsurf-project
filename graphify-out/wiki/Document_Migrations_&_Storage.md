# Document Migrations & Storage

> 22 nodes · cohesion 0.17

## Key Concepts

- **documentStorage.ts** (61 connections) — `src/utils/documentStorage.ts`
- **saveDocuments()** (17 connections) — `src/utils/documentStorage.ts`
- **indexedDBAdapterAbort.test.ts** (14 connections) — `src/__tests__/utils/indexedDBAdapterAbort.test.ts`
- **documentMigrations.test.ts** (12 connections) — `src/__tests__/utils/documentMigrations.test.ts`
- **documentMigrations.ts** (8 connections) — `src/utils/documentMigrations.ts`
- **notifications.ts** (8 connections) — `src/utils/notifications.ts`
- **emitToast()** (5 connections) — `src/utils/notifications.ts`
- **migrateDocument()** (4 connections) — `src/utils/documentMigrations.ts`
- **resetDocumentStorageDiagnosticsForTests()** (4 connections) — `src/utils/documentStorage.ts`
- **hydrateDocuments()** (3 connections) — `src/utils/documentStorage.ts`
- **noteCompleteSaveFailure()** (3 connections) — `src/utils/documentStorage.ts`
- **noteIdbSaveFailure()** (3 connections) — `src/utils/documentStorage.ts`
- **noteLocalStorageOnlyFailure()** (3 connections) — `src/utils/documentStorage.ts`
- **makeDoc()** (2 connections) — `src/__tests__/utils/documentMigrations.test.ts`
- **noteIdbSaveSuccess()** (2 connections) — `src/utils/documentStorage.ts`
- **noteLocalStorageSaveSuccess()** (2 connections) — `src/utils/documentStorage.ts`
- **saveToLocalStorage()** (2 connections) — `src/utils/documentStorage.ts`
- **installStubIndexedDB()** (1 connections) — `src/__tests__/utils/indexedDBAdapterAbort.test.ts`
- **makeDoc()** (1 connections) — `src/__tests__/utils/indexedDBAdapterAbort.test.ts`
- **StubTransaction** (1 connections) — `src/__tests__/utils/indexedDBAdapterAbort.test.ts`
- **MIGRATIONS** (1 connections) — `src/utils/documentMigrations.ts`
- **ToastHandler** (1 connections) — `src/utils/notifications.ts`

## Relationships

- [Document Storage (IndexedDB)](Document_Storage_%28IndexedDB%29.md) (18 shared connections)
- [Documents Hook & Persistence](Documents_Hook_%26_Persistence.md) (13 shared connections)
- [System Registry & Renderer](System_Registry_%26_Renderer.md) (7 shared connections)
- [Dnd5e Sheets & E2E Tests](Dnd5e_Sheets_%26_E2E_Tests.md) (6 shared connections)
- [Dnd35e Saves & Data Model](Dnd35e_Saves_%26_Data_Model.md) (6 shared connections)
- [Dnd5e2024 Engine & Hit Dice](Dnd5e2024_Engine_%26_Hit_Dice.md) (4 shared connections)
- [D20 Legacy Spell Slots](D20_Legacy_Spell_Slots.md) (4 shared connections)
- [Browser Compat & Error Logging](Browser_Compat_%26_Error_Logging.md) (4 shared connections)
- [App Shell & Layout](App_Shell_%26_Layout.md) (3 shared connections)
- [Boundary Validation Tests](Boundary_Validation_Tests.md) (3 shared connections)
- [Toast Notifications](Toast_Notifications.md) (3 shared connections)
- [Character Management Flow Tests](Character_Management_Flow_Tests.md) (2 shared connections)

## Source Files

- `src/__tests__/utils/documentMigrations.test.ts`
- `src/__tests__/utils/indexedDBAdapterAbort.test.ts`
- `src/utils/documentMigrations.ts`
- `src/utils/documentStorage.ts`
- `src/utils/notifications.ts`

## Audit Trail

- EXTRACTED: 158 (100%)
- INFERRED: 0 (0%)
- AMBIGUOUS: 0 (0%)

---

*Part of the graphify knowledge wiki. See [index](index.md) to navigate.*