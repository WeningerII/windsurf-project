import type { Campaign } from '../types/core/campaign';
import { parseCampaign } from './boundaryValidation';

const STORAGE_KEY = 'rpg-campaigns-v1';

interface CampaignStorageData {
  version: string;
  campaigns: Campaign[];
  lastModified: string;
}

export function loadCampaigns(): Campaign[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];

  try {
    const parsed: unknown = JSON.parse(stored);
    const campaignsField =
      parsed && typeof parsed === 'object' && !Array.isArray(parsed)
        ? (parsed as { campaigns?: unknown }).campaigns
        : undefined;
    if (!Array.isArray(campaignsField)) return [];

    // Parse, don't cast: validate each stored campaign and drop malformed ones.
    const now = new Date();
    const campaigns: Campaign[] = [];
    for (const candidate of campaignsField) {
      const result = parseCampaign(candidate, now);
      if (result.ok) {
        campaigns.push(result.value);
      }
    }
    return campaigns;
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
