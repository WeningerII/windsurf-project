import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import type { Campaign } from '../types/core/campaign';
import { loadCampaigns, saveCampaigns, clearCampaignStorage } from '../utils/campaignStorage';
import { debounce } from '../utils/performance';

export const useCampaigns = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const persistVersionRef = useRef(0);

  useEffect(() => {
    setCampaigns(loadCampaigns());
    setIsLoading(false);
  }, []);

  const persist = useCallback((next: Campaign[]) => {
    saveCampaigns(next);
  }, []);

  const debouncedPersist = useMemo(
    () =>
      debounce((next: Campaign[], version: number) => {
        if (version !== persistVersionRef.current) return;
        persist(next);
      }, 300),
    [persist, persistVersionRef]
  );

  useEffect(() => () => debouncedPersist.flush(), [debouncedPersist]);

  const addCampaign = useCallback(
    (campaign: Campaign) => {
      const persistVersion = ++persistVersionRef.current;
      setCampaigns((prev) => {
        const next = [...prev, campaign];
        debouncedPersist(next, persistVersion);
        return next;
      });
    },
    [debouncedPersist, persistVersionRef]
  );

  const updateCampaign = useCallback(
    (campaign: Campaign) => {
      const persistVersion = ++persistVersionRef.current;
      setCampaigns((prev) => {
        const next = prev.map((c) =>
          c.id === campaign.id ? { ...campaign, updatedAt: new Date() } : c
        );
        debouncedPersist(next, persistVersion);
        return next;
      });
    },
    [debouncedPersist, persistVersionRef]
  );

  const deleteCampaign = useCallback(
    (id: string) => {
      const persistVersion = ++persistVersionRef.current;
      setCampaigns((prev) => {
        const next = prev.filter((c) => c.id !== id);
        debouncedPersist(next, persistVersion);
        return next;
      });
    },
    [debouncedPersist, persistVersionRef]
  );

  const addCharacterToCampaign = useCallback(
    (campaignId: string, characterId: string) => {
      const persistVersion = ++persistVersionRef.current;
      setCampaigns((prev) => {
        const next = prev.map((c) => {
          if (c.id !== campaignId) return c;
          if (c.characterIds.includes(characterId)) return c;
          return { ...c, characterIds: [...c.characterIds, characterId], updatedAt: new Date() };
        });
        debouncedPersist(next, persistVersion);
        return next;
      });
    },
    [debouncedPersist, persistVersionRef]
  );

  const removeCharacterFromCampaign = useCallback(
    (campaignId: string, characterId: string) => {
      const persistVersion = ++persistVersionRef.current;
      setCampaigns((prev) => {
        const next = prev.map((c) => {
          if (c.id !== campaignId) return c;
          return {
            ...c,
            characterIds: c.characterIds.filter((id) => id !== characterId),
            updatedAt: new Date(),
          };
        });
        debouncedPersist(next, persistVersion);
        return next;
      });
    },
    [debouncedPersist, persistVersionRef]
  );

  const clearAllCampaigns = useCallback(() => {
    persistVersionRef.current += 1;
    debouncedPersist.cancel();
    setCampaigns([]);
    clearCampaignStorage();
  }, [debouncedPersist, persistVersionRef]);

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
