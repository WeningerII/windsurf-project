import type { ReactNode } from 'react';
import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthContext, type AuthContextValue } from '../../contexts/auth-context';
import { useSync } from '../../hooks/useSync';
import type { CharacterDocument, SystemDataModel } from '../../types/core/document';
import {
  clearQueuedSyncSnapshot,
  deleteRemoteDocument,
  fetchRemoteDocuments,
  getQueuedSyncSnapshot,
  mergeDocuments,
  pushDocuments,
  queueSyncSnapshot,
  subscribeToRemoteDocuments,
} from '../../utils/syncEngine';

vi.mock('../../utils/syncEngine', () => ({
  clearQueuedSyncSnapshot: vi.fn(),
  deleteRemoteDocument: vi.fn(),
  fetchRemoteDocuments: vi.fn(),
  getQueuedSyncSnapshot: vi.fn(),
  mergeDocuments: vi.fn(),
  pushDocuments: vi.fn(),
  queueSyncSnapshot: vi.fn(),
  subscribeToRemoteDocuments: vi.fn(),
}));

const mockedClearQueuedSyncSnapshot = vi.mocked(clearQueuedSyncSnapshot);
const mockedDeleteRemoteDocument = vi.mocked(deleteRemoteDocument);
const mockedFetchRemoteDocuments = vi.mocked(fetchRemoteDocuments);
const mockedGetQueuedSyncSnapshot = vi.mocked(getQueuedSyncSnapshot);
const mockedMergeDocuments = vi.mocked(mergeDocuments);
const mockedPushDocuments = vi.mocked(pushDocuments);
const mockedQueueSyncSnapshot = vi.mocked(queueSyncSnapshot);
const mockedSubscribeToRemoteDocuments = vi.mocked(subscribeToRemoteDocuments);

function makeDoc(
  id: string,
  overrides: Partial<CharacterDocument<SystemDataModel>> = {}
): CharacterDocument<SystemDataModel> {
  return {
    id,
    name: `Document ${id}`,
    systemId: 'dnd-5e-2024',
    system: { hp: 10 },
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-02T00:00:00.000Z'),
    version: 1,
    ...overrides,
  };
}

function mergeUnique(
  primary: CharacterDocument<SystemDataModel>[],
  secondary: CharacterDocument<SystemDataModel>[]
): CharacterDocument<SystemDataModel>[] {
  const merged = new Map<string, CharacterDocument<SystemDataModel>>();

  [...secondary, ...primary].forEach((doc) => {
    merged.set(doc.id, doc);
  });

  return Array.from(merged.values());
}

function setNavigatorOnline(value: boolean) {
  Object.defineProperty(window.navigator, 'onLine', {
    configurable: true,
    value,
  });
}

const baseAuthValue: AuthContextValue = {
  session: null,
  user: { id: 'user-1' } as AuthContextValue['user'],
  isLoading: false,
  signInWithEmail: async () => ({ error: null }),
  signUpWithEmail: async () => ({ error: null }),
  signInWithOAuth: async () => ({ error: null }),
  signOut: async () => {},
  isConfigured: true,
};

function createWrapper(overrides: Partial<AuthContextValue> = {}) {
  const value: AuthContextValue = {
    ...baseAuthValue,
    ...overrides,
  };

  return function Wrapper({ children }: { children: ReactNode }) {
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
  };
}

describe('useSync', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setNavigatorOnline(true);
    mockedGetQueuedSyncSnapshot.mockReturnValue([]);
    mockedFetchRemoteDocuments.mockResolvedValue([]);
    mockedPushDocuments.mockResolvedValue(undefined);
    mockedDeleteRemoteDocument.mockResolvedValue(undefined);
    mockedMergeDocuments.mockImplementation(mergeUnique);
    mockedSubscribeToRemoteDocuments.mockReturnValue(vi.fn());
  });

  it('performs an initial sync and re-syncs when realtime updates arrive', async () => {
    const localDocuments = [makeDoc('local-doc')];
    const queuedDocuments = [makeDoc('queued-doc')];
    const remoteDocuments = [makeDoc('remote-doc')];
    const onMerge = vi.fn();

    mockedGetQueuedSyncSnapshot.mockReturnValue(queuedDocuments);
    mockedFetchRemoteDocuments.mockResolvedValue(remoteDocuments);

    const { result } = renderHook(() => useSync({ documents: localDocuments, onMerge }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(onMerge).toHaveBeenCalledTimes(1);
    });

    const mergedDocuments = onMerge.mock.calls[0][0] as CharacterDocument<SystemDataModel>[];
    expect(mockedFetchRemoteDocuments).toHaveBeenCalledTimes(1);
    expect(mockedPushDocuments).toHaveBeenCalledWith(mergedDocuments);
    expect(mockedClearQueuedSyncSnapshot).toHaveBeenCalled();
    expect(mockedSubscribeToRemoteDocuments).toHaveBeenCalledWith('user-1', expect.any(Function));
    expect(result.current.syncState).toBe('idle');
    expect(result.current.lastSyncedAt).toBeInstanceOf(Date);

    const realtimeHandler = mockedSubscribeToRemoteDocuments.mock.calls[0][1] as () => void;
    mockedFetchRemoteDocuments.mockClear();
    mockedPushDocuments.mockClear();
    onMerge.mockClear();

    act(() => {
      realtimeHandler();
    });

    await waitFor(() => {
      expect(mockedFetchRemoteDocuments).toHaveBeenCalledTimes(1);
      expect(onMerge).toHaveBeenCalledTimes(1);
      expect(mockedPushDocuments).toHaveBeenCalledTimes(1);
    });
  });

  it('queues the current snapshot when the initial sync runs offline', async () => {
    const documents = [makeDoc('offline-doc')];
    const onMerge = vi.fn();

    setNavigatorOnline(false);

    const { result } = renderHook(() => useSync({ documents, onMerge }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(mockedQueueSyncSnapshot).toHaveBeenCalledWith(documents);
    });

    expect(mockedFetchRemoteDocuments).not.toHaveBeenCalled();
    expect(onMerge).not.toHaveBeenCalled();
    expect(result.current.syncState).toBe('offline');
  });

  it('queues the latest snapshot and marks the sync state as error when remote deletions fail', async () => {
    const existingDocument = makeDoc('existing-doc');
    const onMerge = vi.fn();

    const { result, rerender } = renderHook(({ documents }) => useSync({ documents, onMerge }), {
      initialProps: { documents: [existingDocument] as CharacterDocument<SystemDataModel>[] },
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(onMerge).toHaveBeenCalledTimes(1);
    });

    mockedDeleteRemoteDocument.mockRejectedValueOnce(new Error('delete failed'));
    mockedQueueSyncSnapshot.mockClear();

    act(() => {
      rerender({ documents: [] });
    });

    await waitFor(() => {
      expect(mockedDeleteRemoteDocument).toHaveBeenCalledWith('existing-doc');
    });

    await waitFor(() => {
      expect(mockedQueueSyncSnapshot).toHaveBeenCalledWith([]);
      expect(result.current.syncState).toBe('error');
    });
  });

  it('flushes pending debounced pushes on unmount', async () => {
    const initialDocuments = [makeDoc('flush-doc', { name: 'Original Name' })];
    const updatedDocuments = [
      makeDoc('flush-doc', {
        name: 'Updated Name',
        updatedAt: new Date('2026-01-04T00:00:00.000Z'),
      }),
    ];
    const onMerge = vi.fn();

    const { rerender, unmount } = renderHook(({ documents }) => useSync({ documents, onMerge }), {
      initialProps: { documents: initialDocuments as CharacterDocument<SystemDataModel>[] },
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(onMerge).toHaveBeenCalledTimes(1);
    });

    mockedPushDocuments.mockClear();
    mockedClearQueuedSyncSnapshot.mockClear();

    act(() => {
      rerender({ documents: updatedDocuments });
    });

    unmount();

    await waitFor(() => {
      expect(mockedPushDocuments).toHaveBeenCalledWith(updatedDocuments);
      expect(mockedClearQueuedSyncSnapshot).toHaveBeenCalled();
    });
  });

  it('stays idle when Supabase auth is unavailable', async () => {
    const onMerge = vi.fn();
    const documents = [makeDoc('no-auth-doc')];

    const { result } = renderHook(() => useSync({ documents, onMerge }), {
      wrapper: createWrapper({ user: null, isConfigured: false }),
    });

    await act(async () => {
      await Promise.resolve();
    });

    expect(mockedFetchRemoteDocuments).not.toHaveBeenCalled();
    expect(mockedPushDocuments).not.toHaveBeenCalled();
    expect(mockedSubscribeToRemoteDocuments).not.toHaveBeenCalled();
    expect(result.current.syncState).toBe('idle');
  });
});
