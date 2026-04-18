import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Campaign } from '../types/core/campaign';
import { useAuth } from './useAuth';
import {
  clearQueuedCampaignsSnapshot,
  deleteRemoteCampaign,
  fetchRemoteCampaigns,
  getQueuedCampaignsSnapshot,
  mergeCampaigns,
  pushCampaigns,
  queueCampaignsSnapshot,
  subscribeToRemoteCampaigns,
} from '../utils/syncEngine';
import { debounce } from '../utils/performance';
import { sameCampaignSignatures } from '../utils/documentSignature';
import type { SyncState } from './useSync';

/**
 * Campaign-table analogue of `useSync`.  Structurally mirrors the
 * character-document sync hook but with the simpler campaign semantics:
 *
 *   - No `version` column, so merge is strictly last-writer-wins on
 *     updatedAt (see `mergeCampaigns`).
 *   - No in-flight edit queue per entity — just a flat snapshot queue for
 *     offline replay.  The campaign-change cadence is roughly 2-3 orders
 *     of magnitude lower than character-document edits, so the volume
 *     does not justify fancier queueing.
 *
 * Runs as a no-op whenever the user is not signed in or Supabase env
 * vars are unset, exactly like `useSync`.
 */
interface UseCampaignSyncOptions {
  campaigns: Campaign[];
  onMerge: (merged: Campaign[]) => void;
}

export function useCampaignSync({ campaigns, onMerge }: UseCampaignSyncOptions) {
  const { user, isConfigured } = useAuth();
  const [syncState, setSyncState] = useState<SyncState>(() => {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      return 'offline';
    }
    return 'idle';
  });
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);
  const isSyncingRef = useRef(false);
  const campaignsRef = useRef(campaigns);
  const previousCampaignsRef = useRef(campaigns);
  const initialSyncCompleteRef = useRef(false);

  useEffect(() => {
    campaignsRef.current = campaigns;
  }, [campaigns]);

  const pushSnapshot = useCallback(
    async (snapshot: Campaign[]) => {
      if (!user || !isConfigured) return;

      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        queueCampaignsSnapshot(snapshot);
        setSyncState('offline');
        return;
      }

      try {
        await pushCampaigns(snapshot);
        clearQueuedCampaignsSnapshot();
        setLastSyncedAt(new Date());
        setSyncState('idle');
      } catch {
        queueCampaignsSnapshot(snapshot);
        setSyncState('error');
      }
    },
    [isConfigured, user]
  );

  const debouncedPush = useMemo(
    () =>
      debounce((snapshot: Campaign[]) => {
        void pushSnapshot(snapshot);
      }, 300),
    [pushSnapshot]
  );

  const sync = useCallback(async () => {
    if (!user || !isConfigured || isSyncingRef.current) return;

    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      queueCampaignsSnapshot(campaignsRef.current);
      setSyncState('offline');
      return;
    }

    isSyncingRef.current = true;
    setSyncState('syncing');

    try {
      const queued = getQueuedCampaignsSnapshot();
      const remote = await fetchRemoteCampaigns();
      const localWithQueued = mergeCampaigns(campaignsRef.current, queued);
      const merged = mergeCampaigns(localWithQueued, remote);
      previousCampaignsRef.current = merged;
      initialSyncCompleteRef.current = true;
      onMerge(merged);

      await pushCampaigns(merged);
      clearQueuedCampaignsSnapshot();
      setLastSyncedAt(new Date());
      setSyncState('idle');
    } catch {
      setSyncState('error');
    } finally {
      isSyncingRef.current = false;
    }
  }, [user, isConfigured, onMerge]);

  // Initial sync on sign-in.
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
    previousCampaignsRef.current = campaigns;
  }, [campaigns, user, isConfigured]);

  useEffect(() => {
    if (!user || !isConfigured || !initialSyncCompleteRef.current) {
      return;
    }

    const previous = previousCampaignsRef.current;

    if (sameCampaignSignatures(previous, campaigns)) {
      return;
    }

    const currentIds = new Set(campaigns.map((c) => c.id));
    const removedIds = previous.filter((c) => !currentIds.has(c.id)).map((c) => c.id);

    previousCampaignsRef.current = campaigns;

    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      queueCampaignsSnapshot(campaigns);
      setSyncState('offline');
      return;
    }

    if (removedIds.length > 0) {
      void Promise.allSettled(removedIds.map((id) => deleteRemoteCampaign(id))).then((results) => {
        if (results.some((r) => r.status === 'rejected')) {
          queueCampaignsSnapshot(campaigns);
          setSyncState('error');
        }
      });
    }

    debouncedPush(campaigns);
  }, [debouncedPush, campaigns, isConfigured, user]);

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

    return subscribeToRemoteCampaigns(user.id, () => {
      void sync();
    });
  }, [isConfigured, sync, user]);

  useEffect(() => () => debouncedPush.flush(), [debouncedPush]);

  return { syncState, lastSyncedAt, sync };
}
