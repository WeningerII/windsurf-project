import type { CharacterDocument, SystemDataModel } from '../types/core/document';
import type { Campaign, CampaignQuest, CampaignSessionEntry } from '../types/core/campaign';
import { getSupabaseClient } from './supabaseClient';
import { retryWithBackoff } from './retry';
import { parseCharacterDocument, parseCampaign } from './boundaryValidation';
import type { SyncTombstone } from './syncTombstones';

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
  /** Soft-delete tombstone (003 migration); null/absent for live rows. */
  deleted_at?: string | null;
}

/**
 * Result of a remote fetch: live entities plus the soft-delete tombstones the
 * server holds. Tombstones are surfaced (not filtered) so the sync merge can
 * distinguish "deleted remotely" (authoritative removal) from "missing
 * remotely" (never uploaded — keep and push).
 */
export interface RemoteFetchResult<T> {
  entities: T[];
  tombstones: SyncTombstone[];
}

/**
 * Extract a soft-delete tombstone from a remote row, or null for live rows.
 * Only the id and deletion time are needed; the rest of the row is ignored.
 */
function extractTombstone(row: unknown): SyncTombstone | null {
  if (!row || typeof row !== 'object') {
    return null;
  }
  const remote = row as { id?: unknown; deleted_at?: unknown };
  if (typeof remote.deleted_at !== 'string' || remote.deleted_at.length === 0) {
    return null;
  }
  if (typeof remote.id !== 'string' || remote.id.length === 0) {
    return null;
  }
  const deletedAt = new Date(remote.deleted_at);
  if (Number.isNaN(deletedAt.getTime())) {
    return null;
  }
  return { id: remote.id, deletedAt };
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
  try {
    localStorage.setItem(key, JSON.stringify(next));
  } catch (error) {
    if (!import.meta.env.PROD) {
      console.warn('Failed to queue sync ids:', error);
    }
  }
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

  // getSession() reads the locally cached session — unlike getUser() it does
  // not hit the auth server, so resolving the id once per push is cheap.
  const {
    data: { session },
    error,
  } = await client.auth.getSession();

  if (error) {
    throw new Error(error.message);
  }

  if (!session?.user) {
    throw new Error('No authenticated Supabase user');
  }

  return session.user.id;
}

// `deleted_at` is deliberately NOT part of the upsert payload: PostgREST
// leaves omitted columns untouched on conflict, so a stale device pushing its
// full collection cannot resurrect a soft-deleted row. Revival goes through
// the explicit restoreRemote* path only.
function toRemote(doc: CharacterDocument<SystemDataModel>, userId: string): RemoteDocument {
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

function fromRemote(row: unknown): CharacterDocument<SystemDataModel> | null {
  if (!row || typeof row !== 'object') {
    return null;
  }
  const remote = row as Partial<RemoteDocument>;
  const parsed = parseCharacterDocument({
    id: remote.id,
    name: remote.name,
    systemId: remote.system_id,
    system: remote.system_data,
    createdAt: remote.created_at,
    updatedAt: remote.updated_at,
    version: remote.version,
  });
  return parsed.ok ? parsed.value : null;
}

export async function fetchRemoteDocuments(): Promise<
  RemoteFetchResult<CharacterDocument<SystemDataModel>>
> {
  const client = getSupabaseClient();
  if (!client) return { entities: [], tombstones: [] };

  return retryWithBackoff(async () => {
    const { data, error } = await client
      .from('documents')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) throw new Error(error.message);
    const rows: unknown[] = Array.isArray(data) ? data : [];
    const entities: CharacterDocument<SystemDataModel>[] = [];
    const tombstones: SyncTombstone[] = [];
    for (const row of rows) {
      const tombstone = extractTombstone(row);
      if (tombstone) {
        tombstones.push(tombstone);
        continue;
      }
      const doc = fromRemote(row);
      if (doc) {
        entities.push(doc);
      }
    }
    return { entities, tombstones };
  });
}

export async function pushDocument(doc: CharacterDocument<SystemDataModel>): Promise<void> {
  const client = getSupabaseClient();
  if (!client) return;

  const payload = toRemote(doc, await getCurrentUserId());
  await retryWithBackoff(async () => {
    const { error } = await client.from('documents').upsert(payload, { onConflict: 'id' });
    if (error) throw new Error(error.message);
  });
}

export async function pushDocuments(docs: CharacterDocument<SystemDataModel>[]): Promise<void> {
  const client = getSupabaseClient();
  if (!client) return;

  if (docs.length === 0) return;

  // Resolve the user id ONCE for the whole batch — one auth lookup per push,
  // not one (network) round trip per entity.
  const userId = await getCurrentUserId();
  const payload = docs.map((doc) => toRemote(doc, userId));

  await retryWithBackoff(async () => {
    const { error } = await client.from('documents').upsert(payload, { onConflict: 'id' });
    if (error) throw new Error(error.message);
  });
}

export async function deleteRemoteDocument(id: string): Promise<void> {
  const client = getSupabaseClient();
  if (!client) return;

  // Soft delete: stamp a tombstone instead of removing the row, so other
  // devices observe the deletion rather than re-uploading their stale copy.
  // The client also stamps updated_at (003 dropped the server trigger).
  const deletedAt = new Date().toISOString();
  await retryWithBackoff(async () => {
    const { error } = await client
      .from('documents')
      .update({ deleted_at: deletedAt, updated_at: deletedAt })
      .eq('id', id);
    if (error) throw new Error(error.message);
  });
}

/** Clear a soft-delete tombstone (deliberate local restore, e.g. undo). */
export async function restoreRemoteDocument(id: string): Promise<void> {
  const client = getSupabaseClient();
  if (!client) return;

  const restoredAt = new Date().toISOString();
  await retryWithBackoff(async () => {
    const { error } = await client
      .from('documents')
      .update({ deleted_at: null, updated_at: restoredAt })
      .eq('id', id);
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

  try {
    localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(docs));
  } catch (error) {
    // A full-collection snapshot can exceed the localStorage quota. Losing
    // the queue entry is recoverable (the next sync re-merges live state);
    // throwing here would break the offline/error path that called us.
    if (!import.meta.env.PROD) {
      console.warn('Failed to queue sync snapshot:', error);
    }
  }
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
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    const now = new Date();
    const documents: CharacterDocument<SystemDataModel>[] = [];
    for (const candidate of parsed) {
      const result = parseCharacterDocument(candidate, now);
      if (result.ok) {
        documents.push(result.value);
      }
    }
    return documents;
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
// supabase/migrations/001_initial.sql; since 003_soft_delete.sql the client
// owns `updated_at`, so last-writer-wins compares real edit times rather than
// server push times.
// ---------------------------------------------------------------------------

export interface RemoteCampaign {
  id: string;
  user_id: string;
  name: string;
  system_id: string | null;
  notes: string;
  character_ids: string[];
  /** Story scaffolding — JSONB columns (004 migration). Dates ride as ISO
   * strings; `fromRemoteCampaign` re-parses them through `parseCampaign`. */
  quests: unknown;
  session_log: unknown;
  created_at: string;
  updated_at: string;
  /** Soft-delete tombstone (003 migration); null/absent for live rows. */
  deleted_at?: string | null;
}

/** JSON-safe quest (Date -> ISO) for the `quests` JSONB column. */
function serializeQuest(quest: CampaignQuest): Record<string, unknown> {
  return {
    id: quest.id,
    title: quest.title,
    summary: quest.summary,
    status: quest.status,
    objectives: quest.objectives,
    createdAt: quest.createdAt.toISOString(),
    updatedAt: quest.updatedAt.toISOString(),
  };
}

/** JSON-safe session entry (Date -> ISO) for the `session_log` JSONB column. */
function serializeSessionEntry(entry: CampaignSessionEntry): Record<string, unknown> {
  return {
    id: entry.id,
    title: entry.title,
    body: entry.body,
    createdAt: entry.createdAt.toISOString(),
  };
}

// `deleted_at` omitted for the same reason as `toRemote` — upserts must not
// be able to resurrect a tombstoned row.
function toRemoteCampaign(campaign: Campaign, userId: string): RemoteCampaign {
  return {
    id: campaign.id,
    user_id: userId,
    name: campaign.name,
    system_id: campaign.systemId ?? null,
    notes: campaign.notes,
    character_ids: campaign.characterIds,
    quests: campaign.quests.map(serializeQuest),
    session_log: campaign.sessionLog.map(serializeSessionEntry),
    created_at: campaign.createdAt.toISOString(),
    updated_at: campaign.updatedAt.toISOString(),
  };
}

function fromRemoteCampaign(row: unknown): Campaign | null {
  if (!row || typeof row !== 'object') {
    return null;
  }
  const remote = row as Partial<RemoteCampaign>;
  const parsed = parseCampaign({
    id: remote.id,
    name: remote.name,
    systemId: remote.system_id ?? undefined,
    notes: remote.notes,
    characterIds: remote.character_ids,
    // JSONB blobs are untrusted like any other row field — parseCampaign
    // coerces them (dropping malformed quests/entries) and re-parses dates.
    quests: remote.quests,
    sessionLog: remote.session_log,
    createdAt: remote.created_at,
    updatedAt: remote.updated_at,
  });
  return parsed.ok ? parsed.value : null;
}

export async function fetchRemoteCampaigns(): Promise<RemoteFetchResult<Campaign>> {
  const client = getSupabaseClient();
  if (!client) return { entities: [], tombstones: [] };

  return retryWithBackoff(async () => {
    const { data, error } = await client
      .from('campaigns')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) throw new Error(error.message);
    const rows: unknown[] = Array.isArray(data) ? data : [];
    const entities: Campaign[] = [];
    const tombstones: SyncTombstone[] = [];
    for (const row of rows) {
      const tombstone = extractTombstone(row);
      if (tombstone) {
        tombstones.push(tombstone);
        continue;
      }
      const campaign = fromRemoteCampaign(row);
      if (campaign) {
        entities.push(campaign);
      }
    }
    return { entities, tombstones };
  });
}

export async function pushCampaign(campaign: Campaign): Promise<void> {
  const client = getSupabaseClient();
  if (!client) return;

  const payload = toRemoteCampaign(campaign, await getCurrentUserId());
  await retryWithBackoff(async () => {
    const { error } = await client.from('campaigns').upsert(payload, { onConflict: 'id' });
    if (error) throw new Error(error.message);
  });
}

export async function pushCampaigns(campaigns: Campaign[]): Promise<void> {
  const client = getSupabaseClient();
  if (!client) return;
  if (campaigns.length === 0) return;

  // One auth lookup per push (see pushDocuments).
  const userId = await getCurrentUserId();
  const payload = campaigns.map((c) => toRemoteCampaign(c, userId));

  await retryWithBackoff(async () => {
    const { error } = await client.from('campaigns').upsert(payload, { onConflict: 'id' });
    if (error) throw new Error(error.message);
  });
}

export async function deleteRemoteCampaign(id: string): Promise<void> {
  const client = getSupabaseClient();
  if (!client) return;

  // Soft delete — see deleteRemoteDocument.
  const deletedAt = new Date().toISOString();
  await retryWithBackoff(async () => {
    const { error } = await client
      .from('campaigns')
      .update({ deleted_at: deletedAt, updated_at: deletedAt })
      .eq('id', id);
    if (error) throw new Error(error.message);
  });
}

/** Clear a soft-delete tombstone (deliberate local restore, e.g. undo). */
export async function restoreRemoteCampaign(id: string): Promise<void> {
  const client = getSupabaseClient();
  if (!client) return;

  const restoredAt = new Date().toISOString();
  await retryWithBackoff(async () => {
    const { error } = await client
      .from('campaigns')
      .update({ deleted_at: null, updated_at: restoredAt })
      .eq('id', id);
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
  try {
    localStorage.setItem(CAMPAIGN_SYNC_QUEUE_KEY, JSON.stringify(campaigns));
  } catch (error) {
    // See queueSyncSnapshot — never let a quota error escape the sync path.
    if (!import.meta.env.PROD) {
      console.warn('Failed to queue campaigns snapshot:', error);
    }
  }
}

export function getQueuedCampaignsSnapshot(): Campaign[] {
  if (typeof localStorage === 'undefined') return [];

  const raw = localStorage.getItem(CAMPAIGN_SYNC_QUEUE_KEY);
  if (!raw) return [];

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    const now = new Date();
    const campaigns: Campaign[] = [];
    for (const candidate of parsed) {
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
