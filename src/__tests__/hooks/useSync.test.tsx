import type { ReactNode } from 'react';
import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthContext, type AuthContextValue } from '../../contexts/auth-context';
import { useSync } from '../../hooks/useSync';
import type { CharacterDocument, SystemDataModel } from '../../types/core/document';
import {
  clearQueuedDeletedDocumentIds,
  clearQueuedSyncSnapshot,
  deleteRemoteDocument,
  fetchRemoteDocuments,
  getQueuedDeletedDocumentIds,
  getQueuedSyncSnapshot,
  mergeDocuments,
  pushDocuments,
  queueDeletedDocumentIds,
  queueSyncSnapshot,
  restoreRemoteDocument,
  subscribeToRemoteDocuments,
} from '../../utils/syncEngine';
import {
  getSyncTombstonedIds,
  recordSyncTombstones,
  removeSyncTombstones,
} from '../../utils/syncTombstones';

vi.mock('../../utils/syncEngine', () => ({
  clearQueuedDeletedDocumentIds: vi.fn(),
  clearQueuedSyncSnapshot: vi.fn(),
  deleteRemoteDocument: vi.fn(),
  fetchRemoteDocuments: vi.fn(),
  getQueuedDeletedDocumentIds: vi.fn(),
  getQueuedSyncSnapshot: vi.fn(),
  mergeDocuments: vi.fn(),
  pushDocuments: vi.fn(),
  queueDeletedDocumentIds: vi.fn(),
  queueSyncSnapshot: vi.fn(),
  restoreRemoteDocument: vi.fn(),
  subscribeToRemoteDocuments: vi.fn(),
}));

vi.mock('../../utils/syncTombstones', () => ({
  recordSyncTombstones: vi.fn(),
  getSyncTombstonedIds: vi.fn(),
  removeSyncTombstones: vi.fn(),
}));

const mockedClearQueuedDeletedDocumentIds = vi.mocked(clearQueuedDeletedDocumentIds);
const mockedClearQueuedSyncSnapshot = vi.mocked(clearQueuedSyncSnapshot);
const mockedDeleteRemoteDocument = vi.mocked(deleteRemoteDocument);
const mockedFetchRemoteDocuments = vi.mocked(fetchRemoteDocuments);
const mockedGetQueuedDeletedDocumentIds = vi.mocked(getQueuedDeletedDocumentIds);
const mockedGetQueuedSyncSnapshot = vi.mocked(getQueuedSyncSnapshot);
const mockedMergeDocuments = vi.mocked(mergeDocuments);
const mockedPushDocuments = vi.mocked(pushDocuments);
const mockedQueueDeletedDocumentIds = vi.mocked(queueDeletedDocumentIds);
const mockedQueueSyncSnapshot = vi.mocked(queueSyncSnapshot);
const mockedRestoreRemoteDocument = vi.mocked(restoreRemoteDocument);
const mockedSubscribeToRemoteDocuments = vi.mocked(subscribeToRemoteDocuments);
const mockedRecordSyncTombstones = vi.mocked(recordSyncTombstones);
const mockedGetSyncTombstonedIds = vi.mocked(getSyncTombstonedIds);
const mockedRemoveSyncTombstones = vi.mocked(removeSyncTombstones);

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

function remoteResult(
  entities: CharacterDocument<SystemDataModel>[] = [],
  tombstones: { id: string; deletedAt: Date }[] = []
) {
  return { entities, tombstones };
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
    mockedGetQueuedDeletedDocumentIds.mockReturnValue([]);
    mockedGetQueuedSyncSnapshot.mockReturnValue([]);
    mockedFetchRemoteDocuments.mockResolvedValue(remoteResult());
    mockedPushDocuments.mockResolvedValue(undefined);
    mockedDeleteRemoteDocument.mockResolvedValue(undefined);
    mockedRestoreRemoteDocument.mockResolvedValue(undefined);
    mockedMergeDocuments.mockImplementation(mergeUnique);
    mockedSubscribeToRemoteDocuments.mockReturnValue(vi.fn());
    mockedGetSyncTombstonedIds.mockReturnValue([]);
  });

  it('performs an initial sync and re-syncs when realtime updates arrive', async () => {
    const localDocuments = [makeDoc('local-doc')];
    const queuedDocuments = [makeDoc('queued-doc')];
    const remoteDocuments = [makeDoc('remote-doc')];
    const onMerge = vi.fn();

    mockedGetQueuedSyncSnapshot.mockReturnValue(queuedDocuments);
    mockedFetchRemoteDocuments.mockResolvedValue(remoteResult(remoteDocuments));

    const { result } = renderHook(() => useSync({ documents: localDocuments, onMerge }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(onMerge).toHaveBeenCalledTimes(1);
    });

    const mergedDocuments = onMerge.mock.calls[0][0] as CharacterDocument<SystemDataModel>[];
    expect(mockedFetchRemoteDocuments).toHaveBeenCalledTimes(1);
    expect(mockedPushDocuments).toHaveBeenCalledWith(mergedDocuments);
    expect(mockedClearQueuedDeletedDocumentIds).toHaveBeenCalled();
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

  it('skips the push when the merged collection matches the remote one', async () => {
    const sharedDoc = makeDoc('shared-doc');
    const onMerge = vi.fn();

    mockedFetchRemoteDocuments.mockResolvedValue(remoteResult([sharedDoc]));

    const { result } = renderHook(() => useSync({ documents: [sharedDoc], onMerge }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(onMerge).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(result.current.syncState).toBe('idle');
    });

    // Nothing differs from the server, so pushing would only re-trigger the
    // realtime subscription with our own write (the C2 sync loop).
    expect(mockedPushDocuments).not.toHaveBeenCalled();
    expect(mockedClearQueuedSyncSnapshot).toHaveBeenCalled();
    expect(result.current.lastSyncedAt).toBeInstanceOf(Date);
  });

  it('removes locally held documents that are tombstoned remotely without re-pushing them', async () => {
    const aliveDoc = makeDoc('alive-doc');
    const zombieDoc = makeDoc('zombie-doc');
    const deletedAt = new Date('2026-01-05T00:00:00.000Z');
    const onMerge = vi.fn();

    mockedFetchRemoteDocuments.mockResolvedValue(
      remoteResult([aliveDoc], [{ id: 'zombie-doc', deletedAt }])
    );

    const { result } = renderHook(() => useSync({ documents: [aliveDoc, zombieDoc], onMerge }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(onMerge).toHaveBeenCalledTimes(1);
    });

    // The remote tombstone is authoritative: the local copy is dropped from
    // the merge result and persisted locally so it survives reloads.
    const mergedDocuments = onMerge.mock.calls[0][0] as CharacterDocument<SystemDataModel>[];
    expect(mergedDocuments.map((doc) => doc.id)).toEqual(['alive-doc']);
    expect(mockedRecordSyncTombstones).toHaveBeenCalledWith('documents', [
      { id: 'zombie-doc', deletedAt },
    ]);

    await waitFor(() => {
      expect(result.current.syncState).toBe('idle');
    });

    // The merge converged on the remote state, so no push happens — the
    // deleted document is not resurrected.
    expect(mockedPushDocuments).not.toHaveBeenCalled();
  });

  it('records a tombstone for locally deleted documents before the remote soft delete', async () => {
    const existingDocument = makeDoc('doomed-doc');
    const onMerge = vi.fn();

    const { rerender } = renderHook(({ documents }) => useSync({ documents, onMerge }), {
      initialProps: { documents: [existingDocument] as CharacterDocument<SystemDataModel>[] },
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(onMerge).toHaveBeenCalledTimes(1);
    });

    mockedRecordSyncTombstones.mockClear();

    act(() => {
      rerender({ documents: [] });
    });

    expect(mockedRecordSyncTombstones).toHaveBeenCalledWith('documents', [
      { id: 'doomed-doc', deletedAt: expect.any(Date) },
    ]);

    await waitFor(() => {
      expect(mockedDeleteRemoteDocument).toHaveBeenCalledWith('doomed-doc');
    });
  });

  it('lifts the tombstone and restores the remote row when a deleted document reappears locally', async () => {
    const documentToRestore = makeDoc('phoenix-doc');
    const onMerge = vi.fn();

    const { rerender } = renderHook(({ documents }) => useSync({ documents, onMerge }), {
      initialProps: { documents: [documentToRestore] as CharacterDocument<SystemDataModel>[] },
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(onMerge).toHaveBeenCalledTimes(1);
    });

    act(() => {
      rerender({ documents: [] });
    });

    await waitFor(() => {
      expect(mockedDeleteRemoteDocument).toHaveBeenCalledWith('phoenix-doc');
    });

    // The id is tombstoned now; an undo brings the document back.
    mockedGetSyncTombstonedIds.mockReturnValue(['phoenix-doc']);

    act(() => {
      rerender({ documents: [documentToRestore] });
    });

    await waitFor(() => {
      expect(mockedRemoveSyncTombstones).toHaveBeenCalledWith('documents', ['phoenix-doc']);
      expect(mockedRestoreRemoteDocument).toHaveBeenCalledWith('phoenix-doc');
    });
  });

  it('re-runs sync once when a realtime event arrives during an in-flight sync', async () => {
    const onMerge = vi.fn();
    let resolveFirstFetch:
      | ((value: {
          entities: CharacterDocument<SystemDataModel>[];
          tombstones: { id: string; deletedAt: Date }[];
        }) => void)
      | undefined;

    mockedFetchRemoteDocuments.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveFirstFetch = resolve;
        })
    );

    renderHook(() => useSync({ documents: [makeDoc('doc-1')], onMerge }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(mockedFetchRemoteDocuments).toHaveBeenCalledTimes(1);
      expect(mockedSubscribeToRemoteDocuments).toHaveBeenCalled();
    });

    const realtimeHandler = mockedSubscribeToRemoteDocuments.mock.calls[0][1] as () => void;

    // Event lands while the first sync is still awaiting its fetch: it must
    // not start a parallel sync, but must not be dropped either.
    act(() => {
      realtimeHandler();
    });
    expect(mockedFetchRemoteDocuments).toHaveBeenCalledTimes(1);

    await act(async () => {
      resolveFirstFetch?.(remoteResult());
    });

    await waitFor(() => {
      expect(mockedFetchRemoteDocuments).toHaveBeenCalledTimes(2);
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

  it('replays queued document deletes and skips the push when nothing else changed', async () => {
    const remoteDeleted = makeDoc('deleted-doc');
    const remoteKept = makeDoc('kept-doc');
    const onMerge = vi.fn();

    mockedGetQueuedDeletedDocumentIds.mockReturnValue(['deleted-doc']);
    mockedFetchRemoteDocuments.mockResolvedValue(remoteResult([remoteDeleted, remoteKept]));

    const { result } = renderHook(() => useSync({ documents: [], onMerge }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(mockedDeleteRemoteDocument).toHaveBeenCalledWith('deleted-doc');
    });

    const mergedDocuments = onMerge.mock.calls[0][0] as CharacterDocument<SystemDataModel>[];
    expect(mergedDocuments.map((doc) => doc.id)).toEqual(['kept-doc']);
    expect(mockedClearQueuedDeletedDocumentIds).toHaveBeenCalled();

    await waitFor(() => {
      expect(result.current.syncState).toBe('idle');
    });

    // After the delete replay the merged collection equals the live remote
    // rows, so there is nothing to push.
    expect(mockedPushDocuments).not.toHaveBeenCalled();
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
    mockedQueueDeletedDocumentIds.mockClear();
    mockedQueueSyncSnapshot.mockClear();

    act(() => {
      rerender({ documents: [] });
    });

    await waitFor(() => {
      expect(mockedDeleteRemoteDocument).toHaveBeenCalledWith('existing-doc');
    });

    await waitFor(() => {
      expect(mockedQueueSyncSnapshot).toHaveBeenCalledWith([]);
      expect(mockedQueueDeletedDocumentIds).toHaveBeenCalledWith(['existing-doc']);
      expect(result.current.syncState).toBe('error');
    });
  });

  it('sets the sync state to error when the remote fetch rejects', async () => {
    const onMerge = vi.fn();

    mockedFetchRemoteDocuments.mockRejectedValue(new Error('network down'));

    const { result } = renderHook(() => useSync({ documents: [makeDoc('doc-1')], onMerge }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.syncState).toBe('error');
    });

    expect(onMerge).not.toHaveBeenCalled();
    expect(mockedPushDocuments).not.toHaveBeenCalled();
  });

  it('queues the latest snapshot and sets error when the debounced push fails', async () => {
    const initialDocuments = [makeDoc('push-doc')];
    const updatedDocuments = [
      makeDoc('push-doc', {
        name: 'Updated Name',
        updatedAt: new Date('2026-01-04T00:00:00.000Z'),
      }),
    ];
    const onMerge = vi.fn();

    const { result, rerender } = renderHook(({ documents }) => useSync({ documents, onMerge }), {
      initialProps: { documents: initialDocuments as CharacterDocument<SystemDataModel>[] },
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(onMerge).toHaveBeenCalledTimes(1);
    });

    mockedPushDocuments.mockRejectedValueOnce(new Error('push failed'));
    mockedQueueSyncSnapshot.mockClear();

    act(() => {
      rerender({ documents: updatedDocuments });
    });

    await waitFor(() => {
      expect(mockedQueueSyncSnapshot).toHaveBeenCalledWith(updatedDocuments);
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
