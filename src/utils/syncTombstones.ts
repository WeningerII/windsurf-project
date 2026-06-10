/**
 * Local tombstone records for synced entity deletions.
 *
 * A tombstone is the durable memory that an entity id was deleted. Without it,
 * a snapshot-merge sync resurrects deletions: any device (or queued offline
 * snapshot, or stale IndexedDB mirror) that still holds a copy of the entity
 * re-merges it as "exists locally, missing remotely" and pushes it back.
 *
 * Tombstones are recorded:
 *   - when this device deletes an entity (before the remote soft-delete is
 *     even attempted, so a reload cannot forget the deletion), and
 *   - when a remote fetch reports a `deleted_at` tombstone row, so the
 *     removal survives locally even if the server row is later pruned.
 *
 * They are consulted by the sync merge (a tombstoned id is authoritatively
 * removed from local, queued, and remote collections) and lifted only by the
 * explicit restore path (an entity re-appearing locally, e.g. via undo).
 *
 * Storage is localStorage-backed per entity type and pruned after ~30 days —
 * by then every actively syncing device has observed the deletion.
 */

export type TombstoneEntityType = 'documents' | 'campaigns';

export interface SyncTombstone {
  id: string;
  deletedAt: Date;
}

const STORAGE_KEYS: Record<TombstoneEntityType, string> = {
  documents: 'rpg-sync-tombstones-documents-v1',
  campaigns: 'rpg-sync-tombstones-campaigns-v1',
};

export const TOMBSTONE_RETENTION_MS = 30 * 24 * 60 * 60 * 1000;

interface StoredTombstone {
  id: string;
  deletedAt: string;
}

function readStored(type: TombstoneEntityType): StoredTombstone[] {
  if (typeof localStorage === 'undefined') {
    return [];
  }

  const raw = localStorage.getItem(STORAGE_KEYS[type]);
  if (!raw) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter(
      (entry): entry is StoredTombstone =>
        typeof entry === 'object' &&
        entry !== null &&
        typeof (entry as StoredTombstone).id === 'string' &&
        (entry as StoredTombstone).id.length > 0 &&
        typeof (entry as StoredTombstone).deletedAt === 'string' &&
        !Number.isNaN(new Date((entry as StoredTombstone).deletedAt).getTime())
    );
  } catch {
    return [];
  }
}

function pruneExpired(entries: StoredTombstone[], now: Date): StoredTombstone[] {
  const cutoff = now.getTime() - TOMBSTONE_RETENTION_MS;
  return entries.filter((entry) => new Date(entry.deletedAt).getTime() >= cutoff);
}

function writeStored(type: TombstoneEntityType, entries: StoredTombstone[]): void {
  if (typeof localStorage === 'undefined') {
    return;
  }

  try {
    if (entries.length === 0) {
      localStorage.removeItem(STORAGE_KEYS[type]);
      return;
    }
    localStorage.setItem(STORAGE_KEYS[type], JSON.stringify(entries));
  } catch (error) {
    // Quota failure must not break the deletion flow; the remote soft-delete
    // and per-device delete queue still carry the intent.
    if (!import.meta.env.PROD) {
      console.warn('Failed to persist sync tombstones:', error);
    }
  }
}

/**
 * Record (or refresh) tombstones. Keeps the newest `deletedAt` per id and
 * prunes entries past the retention window.
 */
export function recordSyncTombstones(
  type: TombstoneEntityType,
  tombstones: SyncTombstone[],
  now: Date = new Date()
): void {
  if (tombstones.length === 0) {
    return;
  }

  const byId = new Map(readStored(type).map((entry) => [entry.id, entry] as const));
  for (const tombstone of tombstones) {
    if (!tombstone.id || Number.isNaN(tombstone.deletedAt.getTime())) {
      continue;
    }
    const existing = byId.get(tombstone.id);
    if (!existing || new Date(existing.deletedAt).getTime() < tombstone.deletedAt.getTime()) {
      byId.set(tombstone.id, {
        id: tombstone.id,
        deletedAt: tombstone.deletedAt.toISOString(),
      });
    }
  }

  writeStored(type, pruneExpired(Array.from(byId.values()), now));
}

export function getSyncTombstones(
  type: TombstoneEntityType,
  now: Date = new Date()
): SyncTombstone[] {
  return pruneExpired(readStored(type), now).map((entry) => ({
    id: entry.id,
    deletedAt: new Date(entry.deletedAt),
  }));
}

export function getSyncTombstonedIds(type: TombstoneEntityType, now: Date = new Date()): string[] {
  return getSyncTombstones(type, now).map((tombstone) => tombstone.id);
}

/** Lift tombstones for ids that were deliberately restored (e.g. undo). */
export function removeSyncTombstones(type: TombstoneEntityType, ids: string[]): void {
  if (ids.length === 0) {
    return;
  }

  const idSet = new Set(ids);
  writeStored(
    type,
    readStored(type).filter((entry) => !idSet.has(entry.id))
  );
}

export function clearSyncTombstones(type: TombstoneEntityType): void {
  if (typeof localStorage === 'undefined') {
    return;
  }
  localStorage.removeItem(STORAGE_KEYS[type]);
}
