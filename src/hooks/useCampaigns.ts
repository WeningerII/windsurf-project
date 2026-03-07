import { useState, useEffect, useCallback } from 'react';
import type { Campaign } from '../types/core/campaign';
import { loadCampaigns, saveCampaigns, clearCampaignStorage } from '../utils/campaignStorage';

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

  const addCampaign = useCallback(
    (campaign: Campaign) => {
      setCampaigns((prev) => {
        const next = [...prev, campaign];
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const updateCampaign = useCallback(
    (campaign: Campaign) => {
      setCampaigns((prev) => {
        const next = prev.map((c) =>
          c.id === campaign.id ? { ...campaign, updatedAt: new Date() } : c
        );
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const deleteCampaign = useCallback(
    (id: string) => {
      setCampaigns((prev) => {
        const next = prev.filter((c) => c.id !== id);
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const addCharacterToCampaign = useCallback(
    (campaignId: string, characterId: string) => {
      setCampaigns((prev) => {
        const next = prev.map((c) => {
          if (c.id !== campaignId) return c;
          if (c.characterIds.includes(characterId)) return c;
          return { ...c, characterIds: [...c.characterIds, characterId], updatedAt: new Date() };
        });
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const removeCharacterFromCampaign = useCallback(
    (campaignId: string, characterId: string) => {
      setCampaigns((prev) => {
        const next = prev.map((c) => {
          if (c.id !== campaignId) return c;
          return {
            ...c,
            characterIds: c.characterIds.filter((id) => id !== characterId),
            updatedAt: new Date(),
          };
        });
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const clearAllCampaigns = useCallback(() => {
    setCampaigns([]);
    clearCampaignStorage();
  }, []);

  return {
    campaigns,
    isLoading,
    addCampaign,
    updateCampaign,
    deleteCampaign,
    addCharacterToCampaign,
    removeCharacterFromCampaign,
    clearAllCampaigns,
  };
};
