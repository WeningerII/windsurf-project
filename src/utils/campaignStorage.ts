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
 * Read the `campaigns` array field from a raw payload, or null when the JSON is
 * malformed or the field is absent/not an array. Shared by the tolerant
 * snapshot parser and the throwing import path so they can never disagree on
 * what counts as a valid envelope.
 */
function readCampaignsField(raw: string): unknown[] | null {
  try {
    const parsed: unknown = JSON.parse(raw);
    const field =
      parsed && typeof parsed === 'object' && !Array.isArray(parsed)
        ? (parsed as { campaigns?: unknown }).campaigns
        : undefined;
    return Array.isArray(field) ? field : null;
  } catch {
    return null;
  }
}

/** Parse, don't cast: validate each candidate campaign and drop malformed ones. */
function parseCampaignField(field: unknown[]): Campaign[] {
  const now = new Date();
  const campaigns: Campaign[] = [];
  for (const candidate of field) {
    const result = parseCampaign(candidate, now);
    if (result.ok) {
      campaigns.push(result.value);
    }
  }
  return campaigns;
}

/**
 * Parse a raw campaigns payload (e.g. a cross-tab `storage` event value).
 * Returns null when the payload is not a structurally valid snapshot.
 */
export function parseCampaignsSnapshot(raw: string): Campaign[] | null {
  const field = readCampaignsField(raw);
  return field === null ? null : parseCampaignField(field);
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

/** Serialize campaigns to a pretty-printed JSON snapshot for backup/transfer. */
export function exportCampaigns(campaigns: Campaign[]): string {
  const data: CampaignStorageData = {
    version: '1.0',
    campaigns,
    lastModified: new Date().toISOString(),
  };
  return JSON.stringify(data, null, 2);
}

export interface ImportCampaignsResult {
  campaigns: Campaign[];
  /** How many array entries were dropped by validation (partial import). */
  droppedCount: number;
}

/**
 * Import campaigns from an export payload, reporting how many records were
 * dropped by validation so callers can tell a partial (or empty) import apart
 * from a clean one. Throws on a structurally invalid payload.
 */
export function importCampaignsWithReport(jsonString: string): ImportCampaignsResult {
  const field = readCampaignsField(jsonString);
  if (field === null) {
    throw new Error('Failed to import campaigns. Invalid JSON format.');
  }
  const campaigns = parseCampaignField(field);
  return { campaigns, droppedCount: field.length - campaigns.length };
}

/** Backward-compatible wrapper around {@link importCampaignsWithReport}. */
export function importCampaigns(jsonString: string): Campaign[] {
  return importCampaignsWithReport(jsonString).campaigns;
}
