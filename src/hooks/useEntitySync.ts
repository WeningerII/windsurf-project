import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from './useAuth';
import { debounce } from '../utils/performance';
import type { RemoteFetchResult } from '../utils/syncEngine';
import type { SyncTombstone } from '../utils/syncTombstones';

export type SyncState = 'idle' | 'syncing' | 'error' | 'offline';

/**
 * Operations a synced entity table must supply. Every member is expected to be
 * a stable reference (module-level function), so callers must memoize the
 * adapter object itself — it feeds the effect dependency arrays below.
 */
export interface EntitySyncAdapter<T> {
  sameSignatures: (a: T[], b: T[]) => boolean;
  merge: (local: T[], remote: T[]) => T[];
  fetchRemote: () => Promise<RemoteFetchResult<T>>;
  push: (snapshot: T[]) => Promise<void>;
  deleteRemote: (id: string) => Promise<void>;
  restoreRemote: (id: string) => Promise<void>;
  subscribeToRemote: (userId: string, onChange: () => void) => (() => void) | undefined;
  queueSnapshot: (snapshot: T[]) => void;
  clearQueuedSnapshot: () => void;
  getQueuedSnapshot: () => T[];
  queueDeletedIds: (ids: string[]) => void;
  clearQueuedDeletedIds: () => void;
  getQueuedDeletedIds: () => string[];
  recordTombstones: (tombstones: SyncTombstone[]) => void;
  getTombstonedIds: () => string[];
  removeTombstones: (ids: string[]) => void;
}

interface UseEntitySyncOptions<T> {
  entities: T[];
  onMerge: (merged: T[]) => void;
  adapter: EntitySyncAdapter<T>;
}

/**
 * Generic local-first sync engine shared by `useSync` (character documents) and
 * `useCampaignSync` (campaigns). Owns the entire state machine: initial sync on
 * sign-in, debounced push on local change, delete reconciliation (soft-delete
 * tombstones), offline queueing/replay, online/offline listeners, and realtime
 * re-sync. Runs as a no-op whenever the user is signed out or Supabase is
 * unconfigured.
 */
export function useEntitySync<T extends { id: string }>({
  entities,
  onMerge,
  adapter,
}: UseEntitySyncOptions<T>) {
  const { user, isConfigured } = useAuth();
  // Effects key off the id string, not the session/user object: supabase-js
  // replaces the session object on every token refresh, which would otherwise
  // tear down the realtime channels and re-run the initial sync hourly.
  const userId = user?.id ?? null;
  const [syncState, setSyncState] = useState<SyncState>(() => {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      return 'offline';
    }
    return 'idle';
  });
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);
  const isSyncingRef = useRef(false);
  const pendingResyncRef = useRef(false);
  const entitiesRef = useRef(entities);
  const previousEntitiesRef = useRef(entities);
  const initialSyncCompleteRef = useRef(false);
  // Self-reference so the `finally` block can re-run the latest sync() after
  // a remote event arrived mid-flight (see pendingResyncRef).
  const syncRef = useRef<(() => Promise<void>) | null>(null);

  useEffect(() => {
    entitiesRef.current = entities;
  }, [entities]);

  const pushSnapshot = useCallback(
    async (snapshot: T[]) => {
      if (!userId || !isConfigured) {
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
    [adapter, isConfigured, userId]
  );

  const debouncedPush = useMemo(
    () =>
      debounce((snapshot: T[]) => {
        void pushSnapshot(snapshot);
      }, 300),
    [pushSnapshot]
  );

  const sync = useCallback(async () => {
    if (!userId || !isConfigured) return;

    if (isSyncingRef.current) {
      // A change arrived while a sync is in flight (e.g. a realtime event for
      // a row we have not fetched yet). Flag it so the in-flight sync re-runs
      // once in its `finally` instead of silently dropping the update.
      pendingResyncRef.current = true;
      return;
    }

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
      const { entities: remote, tombstones: remoteTombstones } = await adapter.fetchRemote();

      // Remote tombstones become local tombstones so the removal survives
      // reloads and queued snapshots cannot resurrect the entity. Queued
      // (not-yet-replayed) deletions are recorded too, in case they predate
      // the tombstone store.
      adapter.recordTombstones([
        ...remoteTombstones,
        ...queuedDeletedIds.map((id) => ({ id, deletedAt: new Date() })),
      ]);

      // A tombstoned id is authoritatively deleted: drop it from every input
      // of the merge so no copy — local state, offline queue, or a stale
      // remote row — can bring it back. Remote tombstone ids are included
      // directly because the local store prunes entries after ~30 days while
      // the server row stays authoritative for as long as it exists.
      const deadIds = new Set([
        ...remoteTombstones.map((tombstone) => tombstone.id),
        ...adapter.getTombstonedIds(),
        ...queuedDeletedIds,
      ]);
      const localWithQueued = adapter.merge(entitiesRef.current, queued);
      const liveRemote = remote.filter((entity) => !deadIds.has(entity.id));
      const merged = adapter.merge(
        localWithQueued.filter((entity) => !deadIds.has(entity.id)),
        liveRemote
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

      // Skip the push when the merge converged on exactly what the server
      // already holds — otherwise our own upsert re-fires the realtime
      // subscription, which re-triggers sync, forever.
      if (!adapter.sameSignatures(merged, liveRemote)) {
        await adapter.push(merged);
      }
      adapter.clearQueuedSnapshot();
      adapter.clearQueuedDeletedIds();
      setLastSyncedAt(new Date());
      setSyncState('idle');
    } catch {
      setSyncState('error');
    } finally {
      isSyncingRef.current = false;
      if (pendingResyncRef.current) {
        pendingResyncRef.current = false;
        void syncRef.current?.();
      }
    }
  }, [adapter, userId, isConfigured, onMerge]);

  useEffect(() => {
    syncRef.current = sync;
  }, [sync]);

  // Initial sync on sign-in
  useEffect(() => {
    if (userId && isConfigured) {
      void sync();
    }
  }, [userId, isConfigured, sync]);

  useEffect(() => {
    if (userId && isConfigured) {
      return;
    }

    initialSyncCompleteRef.current = false;
    previousEntitiesRef.current = entities;
  }, [entities, userId, isConfigured]);

  useEffect(() => {
    if (!userId || !isConfigured || !initialSyncCompleteRef.current) {
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

    // Record local deletions as tombstones immediately, so a reload between
    // this state change and the remote soft-delete cannot resurrect them.
    if (removedIds.length > 0) {
      const deletedAt = new Date();
      adapter.recordTombstones(removedIds.map((id) => ({ id, deletedAt })));
    }

    // An entity re-appearing under a tombstoned id is a deliberate local
    // restore (undo): lift the tombstone, then revive the remote row below.
    const previousIds = new Set(previous.map((entity) => entity.id));
    const addedIds = entities
      .filter((entity) => !previousIds.has(entity.id))
      .map((entity) => entity.id);
    let restoredIds: string[] = [];
    if (addedIds.length > 0) {
      const tombstonedIds = new Set(adapter.getTombstonedIds());
      restoredIds = addedIds.filter((id) => tombstonedIds.has(id));
      if (restoredIds.length > 0) {
        adapter.removeTombstones(restoredIds);
      }
    }

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

      if (restoredIds.length > 0) {
        const results = await Promise.allSettled(
          restoredIds.map((id) => adapter.restoreRemote(id))
        );

        if (results.some((result) => result.status === 'rejected')) {
          adapter.queueSnapshot(entities);
          setSyncState('error');
          return;
        }
      }

      debouncedPush(entities);
    })();
  }, [adapter, debouncedPush, entities, isConfigured, userId]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const handleOnline = () => {
      if (userId && isConfigured) {
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
  }, [isConfigured, sync, userId]);

  useEffect(() => {
    if (!userId || !isConfigured) {
      return undefined;
    }

    return adapter.subscribeToRemote(userId, () => {
      void sync();
    });
  }, [adapter, isConfigured, sync, userId]);

  useEffect(() => () => debouncedPush.flush(), [debouncedPush]);

  return { syncState, lastSyncedAt, sync };
}
