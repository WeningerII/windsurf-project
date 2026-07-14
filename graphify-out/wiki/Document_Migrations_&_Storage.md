# Document Migrations & Storage

> 50 nodes · cohesion 0.12

## Key Concepts

- **documentStorage.ts** (61 connections) — `src/utils/documentStorage.ts`
- **auth-context.ts** (27 connections) — `src/contexts/auth-context.ts`
- **useDocuments.ts** (26 connections) — `src/hooks/useDocuments.ts`
- **indexedDBAdapter.ts** (19 connections) — `src/utils/indexedDBAdapter.ts`
- **useDocuments()** (17 connections) — `src/hooks/useDocuments.ts`
- **saveDocuments()** (17 connections) — `src/utils/documentStorage.ts`
- **documentStorageIDB.test.ts** (15 connections) — `src/__tests__/utils/documentStorageIDB.test.ts`
- **clearLocalDataForAccountChange()** (14 connections) — `src/contexts/auth-context.ts`
- **indexedDBAdapterAbort.test.ts** (14 connections) — `src/__tests__/utils/indexedDBAdapterAbort.test.ts`
- **isIndexedDBAvailable()** (13 connections) — `src/utils/indexedDBAdapter.ts`
- **clearDocumentStorage()** (12 connections) — `src/utils/documentStorage.ts`
- **loadDocuments()** (12 connections) — `src/utils/documentStorage.ts`
- **indexedDBAdapter.test.ts** (11 connections) — `src/__tests__/utils/indexedDBAdapter.test.ts`
- **loadDocumentsAsync()** (11 connections) — `src/utils/documentStorage.ts`
- **idbClearDocuments()** (11 connections) — `src/utils/indexedDBAdapter.ts`
- **idbSaveDocuments()** (10 connections) — `src/utils/indexedDBAdapter.ts`
- **idbLoadDocuments()** (9 connections) — `src/utils/indexedDBAdapter.ts`
- **idbSetMigrated()** (8 connections) — `src/utils/indexedDBAdapter.ts`
- **notifications.ts** (8 connections) — `src/utils/notifications.ts`
- **parseDocumentsSnapshot()** (6 connections) — `src/utils/documentStorage.ts`
- **idbHasMigrated()** (6 connections) — `src/utils/indexedDBAdapter.ts`
- **openDB()** (6 connections) — `src/utils/indexedDBAdapter.ts`
- **mergeDocumentCollections()** (5 connections) — `src/utils/documentStorage.ts`
- **rejectOnAbort()** (5 connections) — `src/utils/indexedDBAdapter.ts`
- **emitToast()** (5 connections) — `src/utils/notifications.ts`
- *... and 25 more nodes in this community*

## Relationships

- [Daggerheart Combatant Builders](Daggerheart_Combatant_Builders.md) (27 shared connections)
- [App Shell & Layout](App_Shell_%26_Layout.md) (19 shared connections)
- [Error Boundary & Auth Context](Error_Boundary_%26_Auth_Context.md) (9 shared connections)
- [Campaign Sync Hooks](Campaign_Sync_Hooks.md) (9 shared connections)
- [System Registry & Renderer](System_Registry_%26_Renderer.md) (7 shared connections)
- [Document Sync Engine](Document_Sync_Engine.md) (6 shared connections)
- [Campaign Storage & Hooks](Campaign_Storage_%26_Hooks.md) (6 shared connections)
- [Pf2e Sheet Tabs](Pf2e_Sheet_Tabs.md) (5 shared connections)
- [Dnd5e Feature Options](Dnd5e_Feature_Options.md) (5 shared connections)
- [Browser Compat & Error Logging](Browser_Compat_%26_Error_Logging.md) (4 shared connections)
- [Scene Management Hooks](Scene_Management_Hooks.md) (3 shared connections)
- [Combat & Recap Panels](Combat_%26_Recap_Panels.md) (3 shared connections)

## Source Files

- `src/__tests__/pf2e-archetype-persistence.test.ts`
- `src/__tests__/utils/documentStorageIDB.test.ts`
- `src/__tests__/utils/indexedDBAdapter.test.ts`
- `src/__tests__/utils/indexedDBAdapterAbort.test.ts`
- `src/contexts/auth-context.ts`
- `src/hooks/useDocuments.ts`
- `src/utils/documentStorage.ts`
- `src/utils/indexedDBAdapter.ts`
- `src/utils/notifications.ts`
- `src/utils/syncTombstones.ts`

## Audit Trail

- EXTRACTED: 402 (100%)
- INFERRED: 2 (0%)
- AMBIGUOUS: 0 (0%)

---

*Part of the graphify knowledge wiki. See [index](index.md) to navigate.*