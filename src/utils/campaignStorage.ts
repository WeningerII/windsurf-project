import type { Campaign } from '../types/core/campaign';

const STORAGE_KEY = 'rpg-campaigns-v1';

interface CampaignStorageData {
  version: string;
  campaigns: Campaign[];
  lastModified: string;
}

function hydrateCampaigns(campaigns: Campaign[]): Campaign[] {
  return campaigns.map((c) => ({
    ...c,
    createdAt: new Date(c.createdAt),
    updatedAt: new Date(c.updatedAt),
  }));
}

export function loadCampaigns(): Campaign[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];

  try {
    const data: CampaignStorageData = JSON.parse(stored);
    if (!Array.isArray(data.campaigns)) return [];
    return hydrateCampaigns(data.campaigns);
  } catch {
    return [];
  }
}

export function saveCampaigns(campaigns: Campaign[]): void {
  const data: CampaignStorageData = {
    version: '1.0',
    campaigns,
    lastModified: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function clearCampaignStorage(): void {
  localStorage.removeItem(STORAGE_KEY);
}
