import { useState } from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Session } from '@supabase/supabase-js';
import { AuthProvider } from '../contexts/AuthContext';
import { clearLocalDataForAccountChange, getLastSyncedUserId } from '../contexts/auth-context';
import { useAuth } from '../hooks/useAuth';
import { getSupabaseClient, isSupabaseConfigured } from '../utils/supabaseClient';

vi.mock('../utils/supabaseClient', () => ({
  getSupabaseClient: vi.fn(),
  isSupabaseConfigured: vi.fn(() => true),
}));

const mockedGetSupabaseClient = vi.mocked(getSupabaseClient);
const mockedIsSupabaseConfigured = vi.mocked(isSupabaseConfigured);

type AuthCallback = (event: string, session: Session | null) => void;

function makeSession(userId: string): Session {
  return { user: { id: userId } } as unknown as Session;
}

function createClientMock(initialSession: Session | null = null) {
  let authCallback: AuthCallback | undefined;
  const signOut = vi.fn().mockResolvedValue({ error: null });
  const client = {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: initialSession } }),
      onAuthStateChange: vi.fn((callback: AuthCallback) => {
        authCallback = callback;
        return { data: { subscription: { unsubscribe: vi.fn() } } };
      }),
      signOut,
    },
  };

  return {
    client: client as unknown as ReturnType<typeof getSupabaseClient>,
    fireAuthChange: (event: string, session: Session | null) => authCallback?.(event, session),
    signOut,
  };
}

const USER_DATA_KEYS = [
  'rpg-documents-v2',
  'rpg-campaigns-v1',
  'rpg-scenes-v1',
  'rpg-sync-queue-v1',
  'rpg-sync-delete-queue-v1',
  'rpg-campaign-sync-queue-v1',
  'rpg-campaign-sync-delete-queue-v1',
  'rpg-sync-tombstones-documents-v1',
  'rpg-sync-tombstones-campaigns-v1',
];

function seedUserData() {
  localStorage.setItem(
    'rpg-documents-v2',
    JSON.stringify({ version: '2.0', documents: [{ id: 'a-doc' }], lastModified: '' })
  );
  localStorage.setItem(
    'rpg-campaigns-v1',
    JSON.stringify({ version: '1.0', campaigns: [{ id: 'a-camp' }], lastModified: '' })
  );
  localStorage.setItem(
    'rpg-scenes-v1',
    JSON.stringify({ version: '1.0', scenes: [{ id: 'a-scene' }], lastModified: '' })
  );
  localStorage.setItem('rpg-sync-queue-v1', '[]');
  localStorage.setItem('rpg-sync-delete-queue-v1', '["a-doc"]');
  localStorage.setItem('rpg-campaign-sync-queue-v1', '[]');
  localStorage.setItem('rpg-campaign-sync-delete-queue-v1', '[]');
  localStorage.setItem(
    'rpg-sync-tombstones-documents-v1',
    JSON.stringify([{ id: 'x', deletedAt: new Date().toISOString() }])
  );
  localStorage.setItem(
    'rpg-sync-tombstones-campaigns-v1',
    JSON.stringify([{ id: 'y', deletedAt: new Date().toISOString() }])
  );
}

function expectUserDataCleared() {
  for (const key of USER_DATA_KEYS) {
    expect(localStorage.getItem(key), key).toBeNull();
  }
}

function expectUserDataPresent() {
  for (const key of USER_DATA_KEYS) {
    expect(localStorage.getItem(key), key).not.toBeNull();
  }
}

/**
 * Probe rendered as the AuthProvider's child. Captures what a collection hook
 * would see when it loads at mount time: if the workspace remounted AFTER the
 * wipe, the local document store reads empty — which is exactly why the next
 * account's initial sync cannot merge-and-upload the previous user's data.
 */
function Probe() {
  const { user } = useAuth();
  const [docsAtMount] = useState(() => localStorage.getItem('rpg-documents-v2'));
  return (
    <div
      data-testid="probe"
      data-user={user?.id ?? 'anon'}
      data-docs-at-mount={docsAtMount === null ? 'empty' : 'present'}
    />
  );
}

describe('AuthProvider account-switch policy', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    mockedIsSupabaseConfigured.mockReturnValue(true);
  });

  it('clearLocalDataForAccountChange wipes every user-data store and queue', async () => {
    seedUserData();

    await clearLocalDataForAccountChange();

    expectUserDataCleared();
  });

  it('records the signed-in user id without clearing on first sign-in', async () => {
    seedUserData();
    const { client, fireAuthChange } = createClientMock(null);
    mockedGetSupabaseClient.mockReturnValue(client);

    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('probe').dataset.user).toBe('anon');
    });

    // No previously synced user on this browser: keep local data (the
    // local-first "sign in later and upload your offline work" flow).
    await act(async () => {
      fireAuthChange('SIGNED_IN', makeSession('user-a'));
    });

    await waitFor(() => {
      expect(screen.getByTestId('probe').dataset.user).toBe('user-a');
    });
    expect(getLastSyncedUserId()).toBe('user-a');
    expectUserDataPresent();
  });

  it('keeps local data when the same user session is restored', async () => {
    seedUserData();
    localStorage.setItem('rpg-last-synced-user-v1', 'user-a');
    const { client } = createClientMock(makeSession('user-a'));
    mockedGetSupabaseClient.mockReturnValue(client);

    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('probe').dataset.user).toBe('user-a');
    });
    expectUserDataPresent();
  });

  it('wipes local data BEFORE the workspace remounts when a different user signs in', async () => {
    seedUserData();
    localStorage.setItem('rpg-last-synced-user-v1', 'user-a');
    const { client, fireAuthChange } = createClientMock(null);
    mockedGetSupabaseClient.mockReturnValue(client);

    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('probe').dataset.user).toBe('anon');
    });
    // Pre-switch the probe mounted with user A's data on disk.
    expect(screen.getByTestId('probe').dataset.docsAtMount).toBe('present');

    await act(async () => {
      fireAuthChange('SIGNED_IN', makeSession('user-b'));
    });

    await waitFor(() => {
      expect(screen.getByTestId('probe').dataset.user).toBe('user-b');
    });

    expectUserDataCleared();
    expect(getLastSyncedUserId()).toBe('user-b');
    // The children subtree remounted AFTER the wipe: anything loading local
    // state for user B's initial sync sees an empty store, so user A's
    // documents can never be merged into (or uploaded to) user B's account.
    expect(screen.getByTestId('probe').dataset.docsAtMount).toBe('empty');
  });

  it('does not wipe local data on passive session loss', async () => {
    seedUserData();
    localStorage.setItem('rpg-last-synced-user-v1', 'user-a');
    const { client, fireAuthChange } = createClientMock(makeSession('user-a'));
    mockedGetSupabaseClient.mockReturnValue(client);

    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('probe').dataset.user).toBe('user-a');
    });

    // Token expiry / network revocation — NOT an explicit sign-out.
    await act(async () => {
      fireAuthChange('SIGNED_OUT', null);
    });

    await waitFor(() => {
      expect(screen.getByTestId('probe').dataset.user).toBe('anon');
    });
    expectUserDataPresent();
  });

  it('wipes local data on explicit sign-out', async () => {
    seedUserData();
    localStorage.setItem('rpg-last-synced-user-v1', 'user-a');
    const { client, signOut } = createClientMock(makeSession('user-a'));
    mockedGetSupabaseClient.mockReturnValue(client);

    let signOutFromContext: (() => Promise<void>) | undefined;
    function SignOutGrabber() {
      const { signOut: contextSignOut } = useAuth();
      signOutFromContext = contextSignOut;
      return null;
    }

    render(
      <AuthProvider>
        <SignOutGrabber />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(signOutFromContext).toBeDefined();
    });

    await act(async () => {
      await signOutFromContext?.();
    });

    expect(signOut).toHaveBeenCalledTimes(1);
    expectUserDataCleared();
  });
});
