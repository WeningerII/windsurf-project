import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from './useAuth';
import { debounce } from '../utils/performance';

export type SyncState = 'idle' | 'syncing' | 'error' | 'offline';

/**
 * Operations a synced entity table must supply. Every member is expected to be
 * a stable reference (module-level function), so callers must memoize the
 * adapter object itself — it feeds the effect dependency arrays below.
 */
export interface EntitySyncAdapter<T> {
  sameSignatures: (a: T[], b: T[]) => boolean;
  merge: (local: T[], remote: T[]) => T[];
  fetchRemote: () => Promise<T[]>;
  push: (snapshot: T[]) => Promise<void>;
  deleteRemote: (id: string) => Promise<void>;
  subscribeToRemote: (userId: string, onChange: () => void) => (() => void) | undefined;
  queueSnapshot: (snapshot: T[]) => void;
  clearQueuedSnapshot: () => void;
  getQueuedSnapshot: () => T[];
  queueDeletedIds: (ids: string[]) => void;
  clearQueuedDeletedIds: () => void;
  getQueuedDeletedIds: () => string[];
}

interface UseEntitySyncOptions<T> {
  entities: T[];
  onMerge: (merged: T[]) => void;
  adapter: EntitySyncAdapter<T>;
}

/**
 * Generic local-first sync engine shared by `useSync` (character documents) and
 * `useCampaignSync` (campaigns). Owns the entire state machine: initial sync on
 * sign-in, debounced push on local change, delete reconciliation, offline
 * queueing/replay, online/offline listeners, and realtime re-sync. Runs as a
 * no-op whenever the user is signed out or Supabase is unconfigured.
 */
export function useEntitySync<T extends { id: string }>({
  entities,
  onMerge,
  adapter,
}: UseEntitySyncOptions<T>) {
  const { user, isConfigured } = useAuth();
  const [syncState, setSyncState] = useState<SyncState>(() => {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      return 'offline';
    }
    return 'idle';
  });
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);
  const isSyncingRef = useRef(false);
  const entitiesRef = useRef(entities);
  const previousEntitiesRef = useRef(entities);
  const initialSyncCompleteRef = useRef(false);

  useEffect(() => {
    entitiesRef.current = entities;
  }, [entities]);

  const pushSnapshot = useCallback(
    async (snapshot: T[]) => {
      if (!user || !isConfigured) {
        return;
      }

      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        adapter.queueSnapshot(snapshot);
        setSyncState('offline');
        return;
      }

      try {
        await adapter.push(snapshot);
        adapter.clearQueuedSnapshot();
        setLastSyncedAt(new Date());
        setSyncState('idle');
      } catch {
        adapter.queueSnapshot(snapshot);
        setSyncState('error');
      }
    },
    [adapter, isConfigured, user]
  );

  const debouncedPush = useMemo(
    () =>
      debounce((snapshot: T[]) => {
        void pushSnapshot(snapshot);
      }, 300),
    [pushSnapshot]
  );

  const sync = useCallback(async () => {
    if (!user || !isConfigured || isSyncingRef.current) return;

    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      adapter.queueSnapshot(entitiesRef.current);
      setSyncState('offline');
      return;
    }

    isSyncingRef.current = true;
    setSyncState('syncing');

    try {
      const queued = adapter.getQueuedSnapshot();
      const queuedDeletedIds = adapter.getQueuedDeletedIds();
      const remote = await adapter.fetchRemote();
      const localWithQueued = adapter.merge(entitiesRef.current, queued);
      const queuedDeletedIdSet = new Set(queuedDeletedIds);
      const merged = adapter.merge(
        localWithQueued.filter((entity) => !queuedDeletedIdSet.has(entity.id)),
        remote.filter((entity) => !queuedDeletedIdSet.has(entity.id))
      );
      previousEntitiesRef.current = merged;
      initialSyncCompleteRef.current = true;
      onMerge(merged);

      if (queuedDeletedIds.length > 0) {
        const results = await Promise.allSettled(
          queuedDeletedIds.map((id) => adapter.deleteRemote(id))
        );

        if (results.some((result) => result.status === 'rejected')) {
          adapter.queueSnapshot(merged);
          adapter.queueDeletedIds(queuedDeletedIds);
          setSyncState('error');
          return;
        }
      }

      await adapter.push(merged);
      adapter.clearQueuedSnapshot();
      adapter.clearQueuedDeletedIds();
      setLastSyncedAt(new Date());
      setSyncState('idle');
    } catch {
      setSyncState('error');
    } finally {
      isSyncingRef.current = false;
    }
  }, [adapter, user, isConfigured, onMerge]);

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
    previousEntitiesRef.current = entities;
  }, [entities, user, isConfigured]);

  useEffect(() => {
    if (!user || !isConfigured || !initialSyncCompleteRef.current) {
      return;
    }

    const previous = previousEntitiesRef.current;

    // Hot path: runs on every change. Cheap signature compare is sufficient
    // because every mutation stamps a fresh `updatedAt`.
    if (adapter.sameSignatures(previous, entities)) {
      return;
    }

    const currentIds = new Set(entities.map((entity) => entity.id));
    const removedIds = previous
      .filter((entity) => !currentIds.has(entity.id))
      .map((entity) => entity.id);

    previousEntitiesRef.current = entities;

    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      adapter.queueSnapshot(entities);
      adapter.queueDeletedIds(removedIds);
      setSyncState('offline');
      return;
    }

    void (async () => {
      if (removedIds.length > 0) {
        const results = await Promise.allSettled(removedIds.map((id) => adapter.deleteRemote(id)));

        if (results.some((result) => result.status === 'rejected')) {
          adapter.queueSnapshot(entities);
          adapter.queueDeletedIds(removedIds);
          setSyncState('error');
          return;
        }
      }

      debouncedPush(entities);
    })();
  }, [adapter, debouncedPush, entities, isConfigured, user]);

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

    return adapter.subscribeToRemote(user.id, () => {
      void sync();
    });
  }, [adapter, isConfigured, sync, user]);

  useEffect(() => () => debouncedPush.flush(), [debouncedPush]);

  return { syncState, lastSyncedAt, sync };
}
