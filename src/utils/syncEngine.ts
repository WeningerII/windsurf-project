import type { CharacterDocument, SystemDataModel } from '../types/core/document';
import type { Campaign } from '../types/core/campaign';
import { getSupabaseClient } from './supabaseClient';
import { retryWithBackoff } from './retry';

const SYNC_QUEUE_KEY = 'rpg-sync-queue-v1';
const SYNC_DELETE_QUEUE_KEY = 'rpg-sync-delete-queue-v1';
const CAMPAIGN_SYNC_QUEUE_KEY = 'rpg-campaign-sync-queue-v1';
const CAMPAIGN_SYNC_DELETE_QUEUE_KEY = 'rpg-campaign-sync-delete-queue-v1';

export interface RemoteDocument {
  id: string;
  user_id: string;
  name: string;
  system_id: string;
  system_data: SystemDataModel;
  created_at: string;
  updated_at: string;
  version: number;
}

function hydrateQueuedDocuments(
  docs: CharacterDocument<SystemDataModel>[]
): CharacterDocument<SystemDataModel>[] {
  return docs.map((doc) => ({
    ...doc,
    createdAt: new Date(doc.createdAt),
    updatedAt: new Date(doc.updatedAt),
  }));
}

function getDocumentVersion(doc: CharacterDocument<SystemDataModel>): number {
  return doc.version ?? 1;
}

function readQueuedIds(key: string): string[] {
  if (typeof localStorage === 'undefined') {
    return [];
  }

  const raw = localStorage.getItem(key);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return Array.from(new Set(parsed.filter((id): id is string => typeof id === 'string')));
  } catch {
    return [];
  }
}

function queueIds(key: string, ids: string[]): void {
  if (typeof localStorage === 'undefined' || ids.length === 0) {
    return;
  }

  const next = Array.from(new Set([...readQueuedIds(key), ...ids]));
  localStorage.setItem(key, JSON.stringify(next));
}

function clearQueuedIds(key: string): void {
  if (typeof localStorage === 'undefined') {
    return;
  }

  localStorage.removeItem(key);
}

async function getCurrentUserId(): Promise<string> {
  const client = getSupabaseClient();
  if (!client) {
    throw new Error('Supabase not configured');
  }

  const {
    data: { user },
    error,
  } = await client.auth.getUser();

  if (error) {
    throw new Error(error.message);
  }

  if (!user) {
    throw new Error('No authenticated Supabase user');
  }

  return user.id;
}

async function toRemote(doc: CharacterDocument<SystemDataModel>): Promise<RemoteDocument> {
  const userId = await getCurrentUserId();

  return {
    id: doc.id,
    user_id: userId,
    name: doc.name,
    system_id: doc.systemId,
    system_data: doc.system,
    created_at: doc.createdAt.toISOString(),
    updated_at: doc.updatedAt.toISOString(),
    version: getDocumentVersion(doc),
  };
}

function fromRemote(row: RemoteDocument): CharacterDocument<SystemDataModel> {
  return {
    id: row.id,
    name: row.name,
    systemId: row.system_id,
    system: row.system_data,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
    version: row.version,
  };
}

export async function fetchRemoteDocuments(): Promise<CharacterDocument<SystemDataModel>[]> {
  const client = getSupabaseClient();
  if (!client) return [];

  return retryWithBackoff(async () => {
    const { data, error } = await client
      .from('documents')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) throw new Error(error.message);
    return (data as RemoteDocument[]).map(fromRemote);
  });
}

export async function pushDocument(doc: CharacterDocument<SystemDataModel>): Promise<void> {
  const client = getSupabaseClient();
  if (!client) return;

  const payload = await toRemote(doc);
  await retryWithBackoff(async () => {
    const { error } = await client.from('documents').upsert(payload, { onConflict: 'id' });
    if (error) throw new Error(error.message);
  });
}

export async function pushDocuments(docs: CharacterDocument<SystemDataModel>[]): Promise<void> {
  const client = getSupabaseClient();
  if (!client) return;

  if (docs.length === 0) return;

  const payload = await Promise.all(docs.map((doc) => toRemote(doc)));

  await retryWithBackoff(async () => {
    const { error } = await client.from('documents').upsert(payload, { onConflict: 'id' });
    if (error) throw new Error(error.message);
  });
}

export async function deleteRemoteDocument(id: string): Promise<void> {
  const client = getSupabaseClient();
  if (!client) return;

  await retryWithBackoff(async () => {
    const { error } = await client.from('documents').delete().eq('id', id);
    if (error) throw new Error(error.message);
  });
}

export function mergeDocuments(
  local: CharacterDocument<SystemDataModel>[],
  remote: CharacterDocument<SystemDataModel>[]
): CharacterDocument<SystemDataModel>[] {
  const merged = new Map<string, CharacterDocument<SystemDataModel>>();

  for (const doc of remote) {
    merged.set(doc.id, doc);
  }

  for (const doc of local) {
    const existing = merged.get(doc.id);
    const existingVersion = existing ? getDocumentVersion(existing) : 0;
    const docVersion = getDocumentVersion(doc);

    if (
      !existing ||
      docVersion > existingVersion ||
      (docVersion === existingVersion && doc.updatedAt > existing.updatedAt)
    ) {
      merged.set(doc.id, doc);
    }
  }

  return Array.from(merged.values()).sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
}

export function queueSyncSnapshot(docs: CharacterDocument<SystemDataModel>[]): void {
  if (typeof localStorage === 'undefined') {
    return;
  }

  localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(docs));
}

export function getQueuedSyncSnapshot(): CharacterDocument<SystemDataModel>[] {
  if (typeof localStorage === 'undefined') {
    return [];
  }

  const raw = localStorage.getItem(SYNC_QUEUE_KEY);
  if (!raw) {
    return [];
  }

  try {
    return hydrateQueuedDocuments(JSON.parse(raw) as CharacterDocument<SystemDataModel>[]);
  } catch {
    return [];
  }
}

export function clearQueuedSyncSnapshot(): void {
  if (typeof localStorage === 'undefined') {
    return;
  }

  localStorage.removeItem(SYNC_QUEUE_KEY);
}

export function queueDeletedDocumentIds(ids: string[]): void {
  queueIds(SYNC_DELETE_QUEUE_KEY, ids);
}

export function getQueuedDeletedDocumentIds(): string[] {
  return readQueuedIds(SYNC_DELETE_QUEUE_KEY);
}

export function clearQueuedDeletedDocumentIds(): void {
  clearQueuedIds(SYNC_DELETE_QUEUE_KEY);
}

export function subscribeToRemoteDocuments(
  userId: string,
  onChange: () => void
): (() => void) | undefined {
  const client = getSupabaseClient();
  if (!client) {
    return undefined;
  }

  const channel = client
    .channel(`documents-sync-${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'documents',
        filter: `user_id=eq.${userId}`,
      },
      () => {
        onChange();
      }
    )
    .subscribe();

  return () => {
    void client.removeChannel(channel);
  };
}

// ---------------------------------------------------------------------------
// Campaigns
//
// Campaigns are structurally simpler than character documents: they have no
// `version` field (low-churn metadata, last-writer-wins on updatedAt is
// acceptable) and the payload itself is just name + optional systemId +
// notes + characterIds.  The server schema lives in
// supabase/migrations/001_initial.sql.
// ---------------------------------------------------------------------------

export interface RemoteCampaign {
  id: string;
  user_id: string;
  name: string;
  system_id: string | null;
  notes: string;
  character_ids: string[];
  created_at: string;
  updated_at: string;
}

function hydrateQueuedCampaigns(campaigns: Campaign[]): Campaign[] {
  return campaigns.map((c) => ({
    ...c,
    createdAt: new Date(c.createdAt),
    updatedAt: new Date(c.updatedAt),
  }));
}

async function toRemoteCampaign(campaign: Campaign): Promise<RemoteCampaign> {
  const userId = await getCurrentUserId();

  return {
    id: campaign.id,
    user_id: userId,
    name: campaign.name,
    system_id: campaign.systemId ?? null,
    notes: campaign.notes,
    character_ids: campaign.characterIds,
    created_at: campaign.createdAt.toISOString(),
    updated_at: campaign.updatedAt.toISOString(),
  };
}

function fromRemoteCampaign(row: RemoteCampaign): Campaign {
  return {
    id: row.id,
    name: row.name,
    systemId: row.system_id ?? undefined,
    notes: row.notes,
    characterIds: row.character_ids,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

export async function fetchRemoteCampaigns(): Promise<Campaign[]> {
  const client = getSupabaseClient();
  if (!client) return [];

  return retryWithBackoff(async () => {
    const { data, error } = await client
      .from('campaigns')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) throw new Error(error.message);
    return (data as RemoteCampaign[]).map(fromRemoteCampaign);
  });
}

export async function pushCampaign(campaign: Campaign): Promise<void> {
  const client = getSupabaseClient();
  if (!client) return;

  const payload = await toRemoteCampaign(campaign);
  await retryWithBackoff(async () => {
    const { error } = await client.from('campaigns').upsert(payload, { onConflict: 'id' });
    if (error) throw new Error(error.message);
  });
}

export async function pushCampaigns(campaigns: Campaign[]): Promise<void> {
  const client = getSupabaseClient();
  if (!client) return;
  if (campaigns.length === 0) return;

  const payload = await Promise.all(campaigns.map((c) => toRemoteCampaign(c)));

  await retryWithBackoff(async () => {
    const { error } = await client.from('campaigns').upsert(payload, { onConflict: 'id' });
    if (error) throw new Error(error.message);
  });
}

export async function deleteRemoteCampaign(id: string): Promise<void> {
  const client = getSupabaseClient();
  if (!client) return;

  await retryWithBackoff(async () => {
    const { error } = await client.from('campaigns').delete().eq('id', id);
    if (error) throw new Error(error.message);
  });
}

/**
 * Merge local and remote campaign collections.  Unlike documents, campaigns
 * have no version field, so the tiebreaker is `updatedAt` alone — strictly
 * last-writer-wins.  For a shared-DM-one-player deployment this is fine;
 * true multi-editor conflict resolution is a future concern.
 */
export function mergeCampaigns(local: Campaign[], remote: Campaign[]): Campaign[] {
  const merged = new Map<string, Campaign>();

  for (const c of remote) {
    merged.set(c.id, c);
  }

  for (const c of local) {
    const existing = merged.get(c.id);
    if (!existing || c.updatedAt > existing.updatedAt) {
      merged.set(c.id, c);
    }
  }

  return Array.from(merged.values()).sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
}

export function queueCampaignsSnapshot(campaigns: Campaign[]): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(CAMPAIGN_SYNC_QUEUE_KEY, JSON.stringify(campaigns));
}

export function getQueuedCampaignsSnapshot(): Campaign[] {
  if (typeof localStorage === 'undefined') return [];

  const raw = localStorage.getItem(CAMPAIGN_SYNC_QUEUE_KEY);
  if (!raw) return [];

  try {
    return hydrateQueuedCampaigns(JSON.parse(raw) as Campaign[]);
  } catch {
    return [];
  }
}

export function clearQueuedCampaignsSnapshot(): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.removeItem(CAMPAIGN_SYNC_QUEUE_KEY);
}

export function queueDeletedCampaignIds(ids: string[]): void {
  queueIds(CAMPAIGN_SYNC_DELETE_QUEUE_KEY, ids);
}

export function getQueuedDeletedCampaignIds(): string[] {
  return readQueuedIds(CAMPAIGN_SYNC_DELETE_QUEUE_KEY);
}

export function clearQueuedDeletedCampaignIds(): void {
  clearQueuedIds(CAMPAIGN_SYNC_DELETE_QUEUE_KEY);
}

export function subscribeToRemoteCampaigns(
  userId: string,
  onChange: () => void
): (() => void) | undefined {
  const client = getSupabaseClient();
  if (!client) {
    return undefined;
  }

  const channel = client
    .channel(`campaigns-sync-${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'campaigns',
        filter: `user_id=eq.${userId}`,
      },
      () => {
        onChange();
      }
    )
    .subscribe();

  return () => {
    void client.removeChannel(channel);
  };
}
