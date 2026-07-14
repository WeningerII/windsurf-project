# Document Sync Engine

> 66 nodes · cohesion 0.07

## Key Concepts

- **syncEngine.ts** (68 connections) — `src/utils/syncEngine.ts`
- **useSync.test.tsx** (47 connections) — `src/__tests__/hooks/useSync.test.tsx`
- **useSync.ts** (35 connections) — `src/hooks/useSync.ts`
- **syncEngine.test.ts** (24 connections) — `src/__tests__/utils/syncEngine.test.ts`
- **useSync()** (21 connections) — `src/hooks/useSync.ts`
- **getSupabaseClient()** (21 connections) — `src/utils/supabaseClient.ts`
- **retryWithBackoff()** (16 connections) — `src/utils/retry.ts`
- **supabaseClient.ts** (9 connections) — `src/utils/supabaseClient.ts`
- **fetchRemoteCampaigns()** (9 connections) — `src/utils/syncEngine.ts`
- **fetchRemoteDocuments()** (9 connections) — `src/utils/syncEngine.ts`
- **getQueuedDeletedDocumentIds()** (9 connections) — `src/utils/syncEngine.ts`
- **getQueuedSyncSnapshot()** (9 connections) — `src/utils/syncEngine.ts`
- **pushCampaigns()** (9 connections) — `src/utils/syncEngine.ts`
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
- *... and 41 more nodes in this community*

## Relationships

- [Campaign Sync Hooks](Campaign_Sync_Hooks.md) (50 shared connections)
- [Error Boundary & Auth Context](Error_Boundary_%26_Auth_Context.md) (19 shared connections)
- [Daggerheart Combatant Builders](Daggerheart_Combatant_Builders.md) (13 shared connections)
- [Document Migrations & Storage](Document_Migrations_%26_Storage.md) (6 shared connections)
- [Retry With Backoff](Retry_With_Backoff.md) (6 shared connections)
- [Boundary Validation Tests](Boundary_Validation_Tests.md) (6 shared connections)
- [App Shell & Layout](App_Shell_%26_Layout.md) (4 shared connections)
- [Combat & Recap Panels](Combat_%26_Recap_Panels.md) (3 shared connections)
- [Document Signature Hashing](Document_Signature_Hashing.md) (3 shared connections)
- [capabilityScenarios.test.tsx](capabilityScenarios.test.tsx.md) (3 shared connections)
- [Quest & Session Log UI](Quest_%26_Session_Log_UI.md) (3 shared connections)

## Source Files

- `src/__tests__/hooks/useSync.test.tsx`
- `src/__tests__/utils/syncEngine.test.ts`
- `src/hooks/useSync.ts`
- `src/utils/retry.ts`
- `src/utils/supabaseClient.ts`
- `src/utils/syncEngine.ts`

## Audit Trail

- EXTRACTED: 403 (93%)
- INFERRED: 31 (7%)
- AMBIGUOUS: 0 (0%)

---

*Part of the graphify knowledge wiki. See [index](index.md) to navigate.*