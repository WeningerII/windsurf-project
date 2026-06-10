import { useState, useEffect, useCallback } from 'react';
import type { Campaign } from '../types/core/campaign';
import {
  loadCampaigns,
  saveCampaigns,
  clearCampaignStorage,
  parseCampaignsSnapshot,
  CAMPAIGNS_STORAGE_KEY,
} from '../utils/campaignStorage';
import { sameCampaignSignatures } from '../utils/documentSignature';
import { useDebouncedPersistence } from './useDebouncedPersistence';

export const useCampaigns = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setCampaigns(loadCampaigns());
    setIsLoading(false);
  }, []);

  const persist = useCallback((next: Campaign[]) => {
    // The write runs inside a debounce timer: an unguarded QuotaExceededError
    // would become an uncaught exception and the failure would be invisible.
    try {
      saveCampaigns(next);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save campaigns');
    }
  }, []);

  const persistence = useDebouncedPersistence(persist);

  const addCampaign = useCallback(
    (campaign: Campaign) => {
      const persistVersion = persistence.beginVersion();
      setCampaigns((prev) => {
        const next = [...prev, campaign];
        persistence.persist(next, persistVersion);
        return next;
      });
    },
    [persistence]
  );

  const updateCampaign = useCallback(
    (campaign: Campaign) => {
      const persistVersion = persistence.beginVersion();
      setCampaigns((prev) => {
        const next = prev.map((c) =>
          c.id === campaign.id ? { ...campaign, updatedAt: new Date() } : c
        );
        persistence.persist(next, persistVersion);
        return next;
      });
    },
    [persistence]
  );

  const deleteCampaign = useCallback(
    (id: string) => {
      const persistVersion = persistence.beginVersion();
      setCampaigns((prev) => {
        const next = prev.filter((c) => c.id !== id);
        persistence.persist(next, persistVersion);
        return next;
      });
    },
    [persistence]
  );

  const addCharacterToCampaign = useCallback(
    (campaignId: string, characterId: string) => {
      const persistVersion = persistence.beginVersion();
      setCampaigns((prev) => {
        const next = prev.map((c) => {
          if (c.id !== campaignId) return c;
          if (c.characterIds.includes(characterId)) return c;
          return { ...c, characterIds: [...c.characterIds, characterId], updatedAt: new Date() };
        });
        persistence.persist(next, persistVersion);
        return next;
      });
    },
    [persistence]
  );

  const removeCharacterFromCampaign = useCallback(
    (campaignId: string, characterId: string) => {
      const persistVersion = persistence.beginVersion();
      setCampaigns((prev) => {
        const next = prev.map((c) => {
          if (c.id !== campaignId) return c;
          return {
            ...c,
            characterIds: c.characterIds.filter((id) => id !== characterId),
            updatedAt: new Date(),
          };
        });
        persistence.persist(next, persistVersion);
        return next;
      });
    },
    [persistence]
  );

  const addCampaigns = useCallback(
    (incoming: Campaign[]) => {
      if (incoming.length === 0) return;
      const persistVersion = persistence.beginVersion();
      setCampaigns((prev) => {
        // Upsert-merge: incoming campaigns with a matching id replace the
        // existing one iff their updatedAt is strictly newer (last-writer
        // wins, matching `mergeCampaigns` on the sync side).  Brand new
        // ids are appended.
        const byId = new Map(prev.map((c) => [c.id, c] as const));
        for (const c of incoming) {
          const existing = byId.get(c.id);
          if (!existing || c.updatedAt > existing.updatedAt) {
            byId.set(c.id, c);
          }
        }
        const next = Array.from(byId.values());
        if (sameCampaignSignatures(prev, next)) {
          // No-op merge: keep state identity and roll the unused write
          // generation back — leaving it consumed would drop a still-pending
          // debounced save from a real edit (and would echo cross-tab storage
          // events back and forth forever).
          persistence.abandonVersion(persistVersion);
          return prev;
        }
        persistence.persist(next, persistVersion);
        return next;
      });
    },
    [persistence]
  );

  // Cross-tab reconciliation: merge snapshots written by other tabs through
  // the updatedAt-aware upsert above. Loop-safe via its signature
  // short-circuit (a no-change merge schedules no write, so no event echo).
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== CAMPAIGNS_STORAGE_KEY || !event.newValue) return;
      const incoming = parseCampaignsSnapshot(event.newValue);
      if (incoming === null || incoming.length === 0) return;
      addCampaigns(incoming);
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [addCampaigns]);

  // Replace the collection with a sync-merged snapshot. Unlike `addCampaigns`
  // (upsert-only), the merged collection is authoritative: entries missing
  // from it — e.g. tombstoned on another device — are removed locally.
  const applyMergedCampaigns = useCallback(
    (merged: Campaign[]) => {
      const persistVersion = persistence.beginVersion();
      setCampaigns((prev) => {
        if (sameCampaignSignatures(prev, merged)) {
          // See addCampaigns: a no-op merge must not consume a version token.
          persistence.abandonVersion(persistVersion);
          return prev;
        }
        persistence.persist(merged, persistVersion);
        return merged;
      });
    },
    [persistence]
  );

  const clearAllCampaigns = useCallback(() => {
    // Begin-without-persist is deliberate: it invalidates any pending write
    // of the old collection so it cannot land after the clear.
    persistence.beginVersion();
    persistence.cancel();
    setCampaigns([]);
    clearCampaignStorage();
  }, [persistence]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    campaigns,
    isLoading,
    error,
    clearError,
    addCampaign,
    addCampaigns,
    applyMergedCampaigns,
    updateCampaign,
    deleteCampaign,
    addCharacterToCampaign,
    removeCharacterFromCampaign,
    clearAllCampaigns,
    flushPendingSaves: persistence.flush,
  };
};
