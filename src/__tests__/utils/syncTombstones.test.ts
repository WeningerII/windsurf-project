import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  TOMBSTONE_RETENTION_MS,
  clearSyncTombstones,
  getSyncTombstonedIds,
  getSyncTombstones,
  recordSyncTombstones,
  removeSyncTombstones,
} from '../../utils/syncTombstones';

const NOW = new Date('2026-06-01T00:00:00.000Z');

describe('syncTombstones', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('records tombstones and reads them back with hydrated dates', () => {
    const deletedAt = new Date('2026-05-30T12:00:00.000Z');
    recordSyncTombstones('documents', [{ id: 'doc-1', deletedAt }], NOW);

    const tombstones = getSyncTombstones('documents', NOW);
    expect(tombstones).toEqual([{ id: 'doc-1', deletedAt }]);
    expect(tombstones[0].deletedAt).toBeInstanceOf(Date);
    expect(getSyncTombstonedIds('documents', NOW)).toEqual(['doc-1']);
  });

  it('keeps the newest deletedAt when the same id is recorded twice', () => {
    const older = new Date('2026-05-01T00:00:00.000Z');
    const newer = new Date('2026-05-20T00:00:00.000Z');

    recordSyncTombstones('documents', [{ id: 'doc-1', deletedAt: newer }], NOW);
    recordSyncTombstones('documents', [{ id: 'doc-1', deletedAt: older }], NOW);

    expect(getSyncTombstones('documents', NOW)).toEqual([{ id: 'doc-1', deletedAt: newer }]);
  });

  it('prunes tombstones past the retention window', () => {
    const fresh = new Date(NOW.getTime() - 1000);
    const expired = new Date(NOW.getTime() - TOMBSTONE_RETENTION_MS - 1000);

    recordSyncTombstones(
      'documents',
      [
        { id: 'fresh-doc', deletedAt: fresh },
        { id: 'expired-doc', deletedAt: expired },
      ],
      NOW
    );

    expect(getSyncTombstonedIds('documents', NOW)).toEqual(['fresh-doc']);
  });

  it('keeps entity types isolated', () => {
    recordSyncTombstones('documents', [{ id: 'doc-1', deletedAt: NOW }], NOW);
    recordSyncTombstones('campaigns', [{ id: 'camp-1', deletedAt: NOW }], NOW);

    expect(getSyncTombstonedIds('documents', NOW)).toEqual(['doc-1']);
    expect(getSyncTombstonedIds('campaigns', NOW)).toEqual(['camp-1']);

    clearSyncTombstones('documents');
    expect(getSyncTombstonedIds('documents', NOW)).toEqual([]);
    expect(getSyncTombstonedIds('campaigns', NOW)).toEqual(['camp-1']);
  });

  it('removes only the requested ids', () => {
    recordSyncTombstones(
      'documents',
      [
        { id: 'doc-1', deletedAt: NOW },
        { id: 'doc-2', deletedAt: NOW },
      ],
      NOW
    );

    removeSyncTombstones('documents', ['doc-1']);

    expect(getSyncTombstonedIds('documents', NOW)).toEqual(['doc-2']);
  });

  it('tolerates malformed storage payloads', () => {
    localStorage.setItem('rpg-sync-tombstones-documents-v1', '{not json');
    expect(getSyncTombstones('documents', NOW)).toEqual([]);

    localStorage.setItem(
      'rpg-sync-tombstones-documents-v1',
      JSON.stringify([{ id: 'ok', deletedAt: NOW.toISOString() }, { id: 42 }, 'junk', null])
    );
    expect(getSyncTombstonedIds('documents', NOW)).toEqual(['ok']);
  });

  it('swallows storage write failures', () => {
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('quota', 'QuotaExceededError');
    });

    try {
      expect(() =>
        recordSyncTombstones('documents', [{ id: 'doc-1', deletedAt: NOW }], NOW)
      ).not.toThrow();
    } finally {
      setItemSpy.mockRestore();
    }
  });
});
