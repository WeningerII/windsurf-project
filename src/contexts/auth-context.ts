import { createContext } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { clearDocumentStorage } from '../utils/documentStorage';
import { clearCampaignStorage } from '../utils/campaignStorage';
import { clearSceneStorage } from '../utils/sceneStorage';
import { idbClearDocuments, isIndexedDBAvailable } from '../utils/indexedDBAdapter';
import {
  clearQueuedSyncSnapshot,
  clearQueuedDeletedDocumentIds,
  clearQueuedCampaignsSnapshot,
  clearQueuedDeletedCampaignIds,
} from '../utils/syncEngine';
import { clearSyncTombstones } from '../utils/syncTombstones';

export interface AuthContextValue {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<{ error: string | null }>;
  signUpWithEmail: (email: string, password: string) => Promise<{ error: string | null }>;
  signInWithOAuth: (provider: 'google' | 'github') => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  isConfigured: boolean;
}

export const AuthContext = createContext<AuthContextValue>({
  session: null,
  user: null,
  isLoading: false,
  signInWithEmail: async () => ({ error: null }),
  signUpWithEmail: async () => ({ error: null }),
  signInWithOAuth: async () => ({ error: null }),
  signOut: async () => {},
  isConfigured: false,
});

// ---------------------------------------------------------------------------
// Local-data privacy policy for auth identity changes.
//
// The browser-local stores (documents, campaigns, scenes, sync queues,
// tombstones) are global to the profile, not namespaced per user. Left alone,
// a sign-in by a different account would merge the previous user's data into
// the new account's sync push — a cross-tenant leak in both directions. The
// policy, kept in this one place:
//
//   - Track the user id that last synced on this browser.
//   - A sign-in by a DIFFERENT user id wipes the local stores BEFORE the new
//     account's initial sync can read them.
//   - An explicit sign-out also wipes (conservative choice for shared
//     devices). Passive session loss does NOT — local-first users keep their
//     offline data.
// ---------------------------------------------------------------------------

const LAST_SYNCED_USER_KEY = 'rpg-last-synced-user-v1';

export function getLastSyncedUserId(): string | null {
  if (typeof localStorage === 'undefined') {
    return null;
  }
  return localStorage.getItem(LAST_SYNCED_USER_KEY);
}

export function setLastSyncedUserId(userId: string): void {
  if (typeof localStorage === 'undefined') {
    return;
  }
  try {
    localStorage.setItem(LAST_SYNCED_USER_KEY, userId);
  } catch (error) {
    if (!import.meta.env.PROD) {
      console.warn('Failed to persist last-synced user id:', error);
    }
  }
}

/**
 * Wipe every browser-local store that holds (or could re-upload) user data.
 * Awaits the IndexedDB clear so callers can sequence the wipe strictly before
 * the next account's hooks load and its initial sync runs.
 */
export async function clearLocalDataForAccountChange(): Promise<void> {
  clearDocumentStorage();
  clearCampaignStorage();
  clearSceneStorage();
  clearQueuedSyncSnapshot();
  clearQueuedDeletedDocumentIds();
  clearQueuedCampaignsSnapshot();
  clearQueuedDeletedCampaignIds();
  clearSyncTombstones('documents');
  clearSyncTombstones('campaigns');

  // clearDocumentStorage's own IndexedDB clear is fire-and-forget; issue an
  // awaited pass so a still-pending mirror cannot resurface after the switch.
  if (isIndexedDBAvailable()) {
    try {
      await idbClearDocuments();
    } catch {
      // Best-effort: localStorage (the load path's fallback) is already clear.
    }
  }
}
