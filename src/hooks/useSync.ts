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
  mergeDocuments,
  queueSyncSnapshot,
  queueDeletedDocumentIds,
  subscribeToRemoteDocuments,
} from '../utils/syncEngine';
import { sameDocumentSignatures } from '../utils/documentSignature';
import { useEntitySync, type EntitySyncAdapter } from './useEntitySync';

export type { SyncState } from './useEntitySync';

type Doc = CharacterDocument<SystemDataModel>;

interface UseSyncOptions {
  documents: Doc[];
  onMerge: (merged: Doc[]) => void;
}

/** Character-document sync — a thin adapter over the generic `useEntitySync`. */
export function useSync({ documents, onMerge }: UseSyncOptions) {
  const adapter = useMemo<EntitySyncAdapter<Doc>>(
    () => ({
      sameSignatures: sameDocumentSignatures,
      merge: mergeDocuments,
      fetchRemote: fetchRemoteDocuments,
      push: pushDocuments,
      deleteRemote: deleteRemoteDocument,
      subscribeToRemote: subscribeToRemoteDocuments,
      queueSnapshot: queueSyncSnapshot,
      clearQueuedSnapshot: clearQueuedSyncSnapshot,
      getQueuedSnapshot: getQueuedSyncSnapshot,
      queueDeletedIds: queueDeletedDocumentIds,
      clearQueuedDeletedIds: clearQueuedDeletedDocumentIds,
      getQueuedDeletedIds: getQueuedDeletedDocumentIds,
    }),
    []
  );

  return useEntitySync({ entities: documents, onMerge, adapter });
}
