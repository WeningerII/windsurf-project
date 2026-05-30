import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  getQueuedCampaignsSnapshot,
  getQueuedDeletedCampaignIds,
  getQueuedDeletedDocumentIds,
  getQueuedSyncSnapshot,
} from '../../utils/syncEngine';
import {
  combineSyncStates,
  formatLastSyncedAt,
  getMostRecentSyncDate,
  getPendingSyncCount,
} from '../../utils/syncStatus';

vi.mock('../../utils/syncEngine', () => ({
  getQueuedSyncSnapshot: vi.fn(),
  getQueuedDeletedDocumentIds: vi.fn(),
  getQueuedCampaignsSnapshot: vi.fn(),
  getQueuedDeletedCampaignIds: vi.fn(),
}));

const mockedGetQueuedSyncSnapshot = vi.mocked(getQueuedSyncSnapshot);
const mockedGetQueuedDeletedDocumentIds = vi.mocked(getQueuedDeletedDocumentIds);
const mockedGetQueuedCampaignsSnapshot = vi.mocked(getQueuedCampaignsSnapshot);
const mockedGetQueuedDeletedCampaignIds = vi.mocked(getQueuedDeletedCampaignIds);

describe('syncStatus helpers', () => {
  it('combines entity sync states by user-visible severity', () => {
    expect(combineSyncStates(['idle', 'syncing'])).toBe('syncing');
    expect(combineSyncStates(['offline', 'syncing'])).toBe('offline');
    expect(combineSyncStates(['idle', 'error'])).toBe('error');
    expect(combineSyncStates(['idle', 'idle'])).toBe('idle');
  });

  it('returns the most recent successful sync timestamp', () => {
    const earlier = new Date('2026-04-26T12:00:00.000Z');
    const later = new Date('2026-04-26T12:05:00.000Z');

    expect(getMostRecentSyncDate([null, earlier, later])?.toISOString()).toBe(later.toISOString());
    expect(getMostRecentSyncDate([null, undefined])).toBeNull();
  });
});

describe('getPendingSyncCount', () => {
  beforeEach(() => {
    mockedGetQueuedSyncSnapshot.mockReset();
    mockedGetQueuedDeletedDocumentIds.mockReset();
    mockedGetQueuedCampaignsSnapshot.mockReset();
    mockedGetQueuedDeletedCampaignIds.mockReset();
  });

  it('returns 0 when every queue is empty', () => {
    mockedGetQueuedSyncSnapshot.mockReturnValue([]);
    mockedGetQueuedDeletedDocumentIds.mockReturnValue([]);
    mockedGetQueuedCampaignsSnapshot.mockReturnValue([]);
    mockedGetQueuedDeletedCampaignIds.mockReturnValue([]);

    expect(getPendingSyncCount()).toBe(0);
  });

  it('sums queued document edits, document deletions, campaign edits, and campaign deletions', () => {
    mockedGetQueuedSyncSnapshot.mockReturnValue([{ id: 'd1' }, { id: 'd2' }] as ReturnType<
      typeof getQueuedSyncSnapshot
    >);
    mockedGetQueuedDeletedDocumentIds.mockReturnValue(['d3', 'd4', 'd5']);
    mockedGetQueuedCampaignsSnapshot.mockReturnValue([{ id: 'c1' }] as ReturnType<
      typeof getQueuedCampaignsSnapshot
    >);
    mockedGetQueuedDeletedCampaignIds.mockReturnValue(['c2']);

    expect(getPendingSyncCount()).toBe(7);
  });
});

describe('formatLastSyncedAt', () => {
  const now = new Date('2026-04-29T15:30:00');

  it('returns null when the input is missing or invalid', () => {
    expect(formatLastSyncedAt(null, now)).toBeNull();
    expect(formatLastSyncedAt(new Date('not-a-date'), now)).toBeNull();
  });

  it('returns "just now" within the last minute', () => {
    expect(formatLastSyncedAt(new Date('2026-04-29T15:29:30'), now)).toBe('just now');
  });

  it('returns minute-level relative time within the last hour', () => {
    expect(formatLastSyncedAt(new Date('2026-04-29T15:25:00'), now)).toBe('5m ago');
  });

  it('returns hour-level relative time within the same calendar day', () => {
    expect(formatLastSyncedAt(new Date('2026-04-29T11:30:00'), now)).toBe('4h ago');
  });

  it('falls through to a dated label when the elapsed hours cross midnight', () => {
    // 23 hours earlier still lands on the previous day, so the absolute
    // "yesterday" wording is more useful than "23h ago".
    const previousDay = new Date('2026-04-28T16:30:00');
    expect(formatLastSyncedAt(previousDay, now)).toMatch(/^yesterday at /);
  });

  it('uses an absolute date when older than yesterday', () => {
    const earlier = new Date('2026-04-26T12:34:00');
    const formatted = formatLastSyncedAt(earlier, now);
    expect(formatted).toMatch(/Apr/);
    expect(formatted).toMatch(/26/);
    expect(formatted).toMatch(/at/);
  });

  it('includes the year when the sync date is in a previous calendar year', () => {
    const previousYear = new Date('2025-12-31T08:00:00');
    expect(formatLastSyncedAt(previousYear, now)).toMatch(/2025/);
  });

  it('falls through to an absolute label for clock skew where date is ahead of now', () => {
    const future = new Date('2026-04-29T15:35:00');
    expect(formatLastSyncedAt(future, now)).toMatch(/at/);
  });
});
