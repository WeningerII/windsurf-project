import { useState, useEffect, useCallback } from 'react';
import type { Campaign } from '../types/core/campaign';
import { loadCampaigns, saveCampaigns, clearCampaignStorage } from '../utils/campaignStorage';
import { useDebouncedPersistence } from './useDebouncedPersistence';

export const useCampaigns = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setCampaigns(loadCampaigns());
    setIsLoading(false);
  }, []);

  const persist = useCallback((next: Campaign[]) => {
    saveCampaigns(next);
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
        persistence.persist(next, persistVersion);
        return next;
      });
    },
    [persistence]
  );

  const clearAllCampaigns = useCallback(() => {
    persistence.beginVersion();
    persistence.cancel();
    setCampaigns([]);
    clearCampaignStorage();
  }, [persistence]);

  return {
    campaigns,
    isLoading,
    addCampaign,
    addCampaigns,
    updateCampaign,
    deleteCampaign,
    addCharacterToCampaign,
    removeCharacterFromCampaign,
    clearAllCampaigns,
    flushPendingSaves: persistence.flush,
  };
};
