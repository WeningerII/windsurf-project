import { useMemo } from 'react';
import type { CharacterDocument, SystemDataModel } from '../types/core/document';
import {
  clearQueuedSyncSnapshot,
  clearQueuedDeletedDocumentIds,
  getQueuedSyncSnapshot,
  getQueuedDeletedDocumentIds,
  fetchRemoteDocuments,
  pushDocuments,
  deleteRemoteDocument,
  restoreRemoteDocument,
  mergeDocuments,
  queueSyncSnapshot,
  queueDeletedDocumentIds,
  subscribeToRemoteDocuments,
} from '../utils/syncEngine';
import {
  getSyncTombstonedIds,
  recordSyncTombstones,
  removeSyncTombstones,
} from '../utils/syncTombstones';
import { sameDocumentSignatures } from '../utils/documentSignature';
import { useEntitySync, type EntitySyncAdapter } from './useEntitySync';

export type { SyncState } from './useEntitySync';

type Doc = CharacterDocument<SystemDataModel>;

interface UseSyncOptions {
  documents: Doc[];
  onMerge: (merged: Doc[]) => void;
  /** Pause/resume knob forwarded to `useEntitySync` (defaults to true). */
  active?: boolean;
}

/** Character-document sync — a thin adapter over the generic `useEntitySync`. */
export function useSync({ documents, onMerge, active }: UseSyncOptions) {
  const adapter = useMemo<EntitySyncAdapter<Doc>>(
    () => ({
      sameSignatures: sameDocumentSignatures,
      merge: mergeDocuments,
      fetchRemote: fetchRemoteDocuments,
      push: pushDocuments,
      deleteRemote: deleteRemoteDocument,
      restoreRemote: restoreRemoteDocument,
      subscribeToRemote: subscribeToRemoteDocuments,
      queueSnapshot: queueSyncSnapshot,
      clearQueuedSnapshot: clearQueuedSyncSnapshot,
      getQueuedSnapshot: getQueuedSyncSnapshot,
      queueDeletedIds: queueDeletedDocumentIds,
      clearQueuedDeletedIds: clearQueuedDeletedDocumentIds,
      getQueuedDeletedIds: getQueuedDeletedDocumentIds,
      recordTombstones: (tombstones) => recordSyncTombstones('documents', tombstones),
      getTombstonedIds: () => getSyncTombstonedIds('documents'),
      removeTombstones: (ids) => removeSyncTombstones('documents', ids),
    }),
    []
  );

  return useEntitySync({ entities: documents, onMerge, adapter, active });
}
