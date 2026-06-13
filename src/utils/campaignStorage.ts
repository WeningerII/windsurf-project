import type { Campaign } from '../types/core/campaign';
import { parseCampaign } from './boundaryValidation';
import { safeGetItem, safeSetItem, safeRemoveItem } from './safeStorage';

const STORAGE_KEY = 'rpg-campaigns-v1';
/** Exported for cross-tab `storage` event filtering in useCampaigns. */
export const CAMPAIGNS_STORAGE_KEY = STORAGE_KEY;

interface CampaignStorageData {
  version: string;
  campaigns: Campaign[];
  lastModified: string;
}

/**
 * Parse a raw campaigns payload (e.g. a cross-tab `storage` event value).
 * Returns null when the payload is not a structurally valid snapshot.
 */
export function parseCampaignsSnapshot(raw: string): Campaign[] | null {
  try {
    const parsed: unknown = JSON.parse(raw);
    const campaignsField =
      parsed && typeof parsed === 'object' && !Array.isArray(parsed)
        ? (parsed as { campaigns?: unknown }).campaigns
        : undefined;
    if (!Array.isArray(campaignsField)) return null;

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
    return null;
  }
}

export function loadCampaigns(): Campaign[] {
  const stored = safeGetItem(STORAGE_KEY);
  if (!stored) return [];

  return parseCampaignsSnapshot(stored) ?? [];
}

export function saveCampaigns(campaigns: Campaign[]): void {
  const data: CampaignStorageData = {
    version: '1.0',
    campaigns,
    lastModified: new Date().toISOString(),
  };
  safeSetItem(STORAGE_KEY, JSON.stringify(data));
}

export function clearCampaignStorage(): void {
  safeRemoveItem(STORAGE_KEY);
}
