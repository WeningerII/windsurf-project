import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { CharacterDocument, SystemDataModel } from '../types/core/document';
import { useAuth } from './useAuth';
import {
  clearQueuedSyncSnapshot,
  getQueuedSyncSnapshot,
  fetchRemoteDocuments,
  pushDocuments,
  deleteRemoteDocument,
  mergeDocuments,
  queueSyncSnapshot,
  subscribeToRemoteDocuments,
} from '../utils/syncEngine';
import { debounce } from '../utils/performance';

export type SyncState = 'idle' | 'syncing' | 'error' | 'offline';

interface UseSyncOptions {
  documents: CharacterDocument<SystemDataModel>[];
  onMerge: (merged: CharacterDocument<SystemDataModel>[]) => void;
}

export function useSync({ documents, onMerge }: UseSyncOptions) {
  const { user, isConfigured } = useAuth();
  const [syncState, setSyncState] = useState<SyncState>(() => {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      return 'offline';
    }

    return 'idle';
  });
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);
  const isSyncingRef = useRef(false);
  const documentsRef = useRef(documents);
  const previousDocumentsRef = useRef(documents);
  const initialSyncCompleteRef = useRef(false);

  useEffect(() => {
    documentsRef.current = documents;
  }, [documents]);

  const pushSnapshot = useCallback(
    async (snapshot: CharacterDocument<SystemDataModel>[]) => {
      if (!user || !isConfigured) {
        return;
      }

      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        queueSyncSnapshot(snapshot);
        setSyncState('offline');
        return;
      }

      try {
        await pushDocuments(snapshot);
        clearQueuedSyncSnapshot();
        setLastSyncedAt(new Date());
        setSyncState('idle');
      } catch {
        queueSyncSnapshot(snapshot);
        setSyncState('error');
      }
    },
    [isConfigured, user]
  );

  const debouncedPush = useMemo(
    () =>
      debounce((snapshot: CharacterDocument<SystemDataModel>[]) => {
        void pushSnapshot(snapshot);
      }, 300),
    [pushSnapshot]
  );

  const sync = useCallback(async () => {
    if (!user || !isConfigured || isSyncingRef.current) return;

    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      queueSyncSnapshot(documentsRef.current);
      setSyncState('offline');
      return;
    }

    isSyncingRef.current = true;
    setSyncState('syncing');

    try {
      const queued = getQueuedSyncSnapshot();
      const remote = await fetchRemoteDocuments();
      const localWithQueued = mergeDocuments(documentsRef.current, queued);
      const merged = mergeDocuments(localWithQueued, remote);
      previousDocumentsRef.current = merged;
      initialSyncCompleteRef.current = true;
      onMerge(merged);

      await pushDocuments(merged);
      clearQueuedSyncSnapshot();
      setLastSyncedAt(new Date());
      setSyncState('idle');
    } catch {
      setSyncState('error');
    } finally {
      isSyncingRef.current = false;
    }
  }, [user, isConfigured, onMerge]);

  // Initial sync on sign-in
  useEffect(() => {
    if (user && isConfigured) {
      void sync();
    }
  }, [user, isConfigured, sync]);

  useEffect(() => {
    if (user && isConfigured) {
      return;
    }

    initialSyncCompleteRef.current = false;
    previousDocumentsRef.current = documents;
  }, [documents, user, isConfigured]);

  useEffect(() => {
    if (!user || !isConfigured || !initialSyncCompleteRef.current) {
      return;
    }

    const previous = previousDocumentsRef.current;
    const previousSerialized = JSON.stringify(previous);
    const currentSerialized = JSON.stringify(documents);

    if (previousSerialized === currentSerialized) {
      return;
    }

    const currentIds = new Set(documents.map((doc) => doc.id));
    const removedIds = previous.filter((doc) => !currentIds.has(doc.id)).map((doc) => doc.id);

    previousDocumentsRef.current = documents;

    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      queueSyncSnapshot(documents);
      setSyncState('offline');
      return;
    }

    if (removedIds.length > 0) {
      void Promise.allSettled(removedIds.map((id) => deleteRemoteDocument(id))).then((results) => {
        if (results.some((result) => result.status === 'rejected')) {
          queueSyncSnapshot(documents);
          setSyncState('error');
        }
      });
    }

    debouncedPush(documents);
  }, [debouncedPush, documents, isConfigured, user]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const handleOnline = () => {
      if (user && isConfigured) {
        void sync();
        return;
      }

      setSyncState('idle');
    };

    const handleOffline = () => {
      setSyncState('offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isConfigured, sync, user]);

  useEffect(() => {
    if (!user || !isConfigured) {
      return undefined;
    }

    return subscribeToRemoteDocuments(user.id, () => {
      void sync();
    });
  }, [isConfigured, sync, user]);

  useEffect(() => () => debouncedPush.flush(), [debouncedPush]);

  return { syncState, lastSyncedAt, sync };
}
