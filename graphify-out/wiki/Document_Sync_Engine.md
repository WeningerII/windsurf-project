# Document Sync Engine

> 37 nodes · cohesion 0.15

## Key Concepts

- **syncEngine.ts** (68 connections) — `src/utils/syncEngine.ts`
- **useSync.ts** (34 connections) — `src/hooks/useSync.ts`
- **syncEngine.test.ts** (24 connections) — `src/__tests__/utils/syncEngine.test.ts`
- **useSync()** (21 connections) — `src/hooks/useSync.ts`
- **getSupabaseClient()** (21 connections) — `src/utils/supabaseClient.ts`
- **fetchRemoteDocuments()** (9 connections) — `src/utils/syncEngine.ts`
- **getQueuedDeletedDocumentIds()** (9 connections) — `src/utils/syncEngine.ts`
- **getQueuedSyncSnapshot()** (9 connections) — `src/utils/syncEngine.ts`
- **pushDocuments()** (9 connections) — `src/utils/syncEngine.ts`
- **clearQueuedDeletedDocumentIds()** (8 connections) — `src/utils/syncEngine.ts`
- **clearQueuedSyncSnapshot()** (7 connections) — `src/utils/syncEngine.ts`
- **deleteRemoteDocument()** (7 connections) — `src/utils/syncEngine.ts`
- **mergeDocuments()** (7 connections) — `src/utils/syncEngine.ts`
- **restoreRemoteDocument()** (7 connections) — `src/utils/syncEngine.ts`
- **getCurrentUserId()** (6 connections) — `src/utils/syncEngine.ts`
- **pushCampaign()** (6 connections) — `src/utils/syncEngine.ts`
- **pushDocument()** (6 connections) — `src/utils/syncEngine.ts`
- **queueDeletedDocumentIds()** (6 connections) — `src/utils/syncEngine.ts`
- **subscribeToRemoteDocuments()** (6 connections) — `src/utils/syncEngine.ts`
- **queueSyncSnapshot()** (5 connections) — `src/utils/syncEngine.ts`
- **toRemoteCampaign()** (5 connections) — `src/utils/syncEngine.ts`
- **queueIds()** (4 connections) — `src/utils/syncEngine.ts`
- **readQueuedIds()** (4 connections) — `src/utils/syncEngine.ts`
- **toRemote()** (4 connections) — `src/utils/syncEngine.ts`
- **clearQueuedIds()** (3 connections) — `src/utils/syncEngine.ts`
- *... and 12 more nodes in this community*

## Relationships

- [Campaign Sync Hooks](Campaign_Sync_Hooks.md) (32 shared connections)
- [Sync Engine Tests](Sync_Engine_Tests.md) (15 shared connections)
- [Sync Tombstones](Sync_Tombstones.md) (13 shared connections)
- [App Shell & Layout](App_Shell_%26_Layout.md) (12 shared connections)
- [Error Boundary & Auth Context](Error_Boundary_%26_Auth_Context.md) (12 shared connections)
- [Retry With Backoff](Retry_With_Backoff.md) (8 shared connections)
- [Boundary Validation Tests](Boundary_Validation_Tests.md) (5 shared connections)
- [System Registry & Renderer](System_Registry_%26_Renderer.md) (4 shared connections)
- [App Header & Auth UI](App_Header_%26_Auth_UI.md) (3 shared connections)
- [Dnd5e Sheets & E2E Tests](Dnd5e_Sheets_%26_E2E_Tests.md) (3 shared connections)
- [Dnd5e2024 Engine & Hit Dice](Dnd5e2024_Engine_%26_Hit_Dice.md) (3 shared connections)
- [Document Signature Hashing](Document_Signature_Hashing.md) (3 shared connections)

## Source Files

- `src/__tests__/utils/syncEngine.test.ts`
- `src/hooks/useSync.ts`
- `src/utils/supabaseClient.ts`
- `src/utils/syncEngine.ts`

## Audit Trail

- EXTRACTED: 288 (91%)
- INFERRED: 29 (9%)
- AMBIGUOUS: 0 (0%)

---

*Part of the graphify knowledge wiki. See [index](index.md) to navigate.*