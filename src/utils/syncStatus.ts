import type { SyncState } from '../hooks/useSync';
import {
  getQueuedSyncSnapshot,
  getQueuedDeletedDocumentIds,
  getQueuedCampaignsSnapshot,
  getQueuedDeletedCampaignIds,
} from './syncEngine';

const syncStatePriority: SyncState[] = ['error', 'offline', 'syncing', 'idle'];

export function combineSyncStates(states: SyncState[]): SyncState {
  for (const state of syncStatePriority) {
    if (states.includes(state)) {
      return state;
    }
  }

  return 'idle';
}

export function getMostRecentSyncDate(dates: Array<Date | null | undefined>): Date | null {
  const timestamps = dates
    .filter((date): date is Date => date instanceof Date)
    .map((date) => date.getTime());

  if (timestamps.length === 0) {
    return null;
  }

  return new Date(Math.max(...timestamps));
}

/**
 * Sum of all locally queued sync work that has not yet been replayed against
 * the remote.  Counts every entity once: a queued document edit, a queued
 * document deletion, a queued campaign edit, and a queued campaign deletion
 * are each a single unit.  Returns 0 when nothing is queued or when the
 * environment lacks `localStorage`.
 */
export function getPendingSyncCount(): number {
  return (
    getQueuedSyncSnapshot().length +
    getQueuedDeletedDocumentIds().length +
    getQueuedCampaignsSnapshot().length +
    getQueuedDeletedCampaignIds().length
  );
}

/**
 * Render `lastSyncedAt` with date context so the timestamp does not become
 * ambiguous after midnight.  Returns `null` when no successful sync has
 * happened yet so the caller can suppress the line entirely.
 *
 * The formatter is deterministic given a fixed `now`, which keeps the unit
 * tests stable across timezones and local clocks.
 */
export function formatLastSyncedAt(date: Date | null, now: Date = new Date()): string | null {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return null;
  }

  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);

  if (diffSec < 0) {
    return formatDateAndTime(date, now);
  }

  if (diffSec < 60) {
    return 'just now';
  }

  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) {
    return `${diffMin}m ago`;
  }

  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24 && isSameLocalDay(date, now)) {
    return `${diffHr}h ago`;
  }

  if (isPreviousLocalDay(date, now)) {
    return `yesterday at ${formatTimeOfDay(date)}`;
  }

  return formatDateAndTime(date, now);
}

function isSameLocalDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isPreviousLocalDay(date: Date, now: Date): boolean {
  const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
  return isSameLocalDay(date, yesterday);
}

function formatTimeOfDay(date: Date): string {
  return date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
}

function formatDateAndTime(date: Date, now: Date): string {
  const sameYear = date.getFullYear() === now.getFullYear();
  const dateOptions: Intl.DateTimeFormatOptions = sameYear
    ? { month: 'short', day: 'numeric' }
    : { month: 'short', day: 'numeric', year: 'numeric' };

  return `${date.toLocaleDateString(undefined, dateOptions)} at ${formatTimeOfDay(date)}`;
}
