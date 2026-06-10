import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { CharacterDocument, SystemDataModel } from '../../types/core/document';
import { getSupabaseClient } from '../../utils/supabaseClient';
import type { RemoteDocument } from '../../utils/syncEngine';
import {
  clearQueuedDeletedDocumentIds,
  clearQueuedSyncSnapshot,
  deleteRemoteDocument,
  fetchRemoteDocuments,
  getQueuedDeletedDocumentIds,
  getQueuedSyncSnapshot,
  mergeDocuments,
  queueDeletedDocumentIds,
  pushDocument,
  pushDocuments,
  queueSyncSnapshot,
  restoreRemoteDocument,
  subscribeToRemoteDocuments,
} from '../../utils/syncEngine';

vi.mock('../../utils/supabaseClient', () => ({
  getSupabaseClient: vi.fn(),
}));

const mockedGetSupabaseClient = vi.mocked(getSupabaseClient);

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

function makeRemoteDoc(id: string, overrides: Partial<RemoteDocument> = {}): RemoteDocument {
  return {
    id,
    user_id: 'user-1',
    name: `Remote ${id}`,
    system_id: 'dnd-5e-2024',
    system_data: { hp: 12 },
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-03T00:00:00.000Z',
    version: 2,
    deleted_at: null,
    ...overrides,
  };
}

function createSupabaseMock(
  options: {
    rows?: RemoteDocument[];
    userId?: string;
    fetchError?: { message: string } | null;
    upsertError?: { message: string } | null;
    updateError?: { message: string } | null;
  } = {}
) {
  const {
    rows = [],
    userId = 'user-1',
    fetchError = null,
    upsertError = null,
    updateError = null,
  } = options;

  const order = vi.fn().mockResolvedValue({ data: rows, error: fetchError });
  const select = vi.fn(() => ({ order }));
  const upsert = vi.fn().mockResolvedValue({ error: upsertError });
  const updateEq = vi.fn().mockResolvedValue({ error: updateError });
  const update = vi.fn(() => ({ eq: updateEq }));
  const from = vi.fn(() => ({
    select,
    upsert,
    update,
  }));
  const subscribedChannel = { id: 'channel-1' };
  const subscribe = vi.fn(() => subscribedChannel);
  const on = vi.fn(() => ({ subscribe }));
  const channel = vi.fn(() => ({ on }));
  const removeChannel = vi.fn().mockResolvedValue(undefined);
  const authGetSession = vi.fn().mockResolvedValue({
    data: { session: { user: { id: userId } } },
    error: null,
  });

  return {
    client: {
      from,
      auth: { getSession: authGetSession },
      channel,
      removeChannel,
    },
    spies: {
      from,
      select,
      order,
      upsert,
      update,
      updateEq,
      authGetSession,
      channel,
      on,
      subscribe,
      removeChannel,
    },
    subscribedChannel,
  };
}

describe('syncEngine', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    mockedGetSupabaseClient.mockReturnValue(null);
  });

  it('fetches remote documents, hydrates date fields, and splits out tombstones', async () => {
    const remoteDoc = makeRemoteDoc('doc-1');
    const tombstoneRow = makeRemoteDoc('doc-gone', {
      deleted_at: '2026-01-05T00:00:00.000Z',
    });
    const { client, spies } = createSupabaseMock({ rows: [remoteDoc, tombstoneRow] });
    mockedGetSupabaseClient.mockReturnValue(client as never);

    const { entities, tombstones } = await fetchRemoteDocuments();

    expect(spies.from).toHaveBeenCalledWith('documents');
    expect(spies.select).toHaveBeenCalledWith('*');
    expect(spies.order).toHaveBeenCalledWith('updated_at', { ascending: false });
    expect(entities).toHaveLength(1);
    expect(entities[0]).toMatchObject({
      id: 'doc-1',
      name: 'Remote doc-1',
      systemId: 'dnd-5e-2024',
      version: 2,
    });
    expect(entities[0].createdAt).toBeInstanceOf(Date);
    expect(entities[0].updatedAt).toBeInstanceOf(Date);
    expect(tombstones).toEqual([
      { id: 'doc-gone', deletedAt: new Date('2026-01-05T00:00:00.000Z') },
    ]);
  });

  it('propagates fetch errors (after retry)', async () => {
    const { client } = createSupabaseMock({ fetchError: { message: 'boom' } });
    mockedGetSupabaseClient.mockReturnValue(client as never);

    await expect(fetchRemoteDocuments()).rejects.toThrow('boom');
  });

  it('normalizes documents before upserting them and never includes deleted_at', async () => {
    const { client, spies } = createSupabaseMock();
    mockedGetSupabaseClient.mockReturnValue(client as never);

    const singleDoc = makeDoc('doc-1', { version: undefined });
    const batchDoc = makeDoc('doc-2', {
      systemId: 'pf2e',
      version: 3,
      updatedAt: new Date('2026-01-04T00:00:00.000Z'),
    });

    await pushDocument(singleDoc);
    await pushDocuments([batchDoc]);

    expect(spies.upsert).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        id: 'doc-1',
        user_id: 'user-1',
        system_id: 'dnd-5e-2024',
        created_at: singleDoc.createdAt.toISOString(),
        updated_at: singleDoc.updatedAt.toISOString(),
        version: 1,
      }),
      { onConflict: 'id' }
    );
    expect(spies.upsert).toHaveBeenNthCalledWith(
      2,
      [
        expect.objectContaining({
          id: 'doc-2',
          user_id: 'user-1',
          system_id: 'pf2e',
          version: 3,
        }),
      ],
      { onConflict: 'id' }
    );

    // Omitting deleted_at from the payload is what prevents a stale push from
    // resurrecting a soft-deleted row (PostgREST leaves absent columns alone).
    const singlePayload = spies.upsert.mock.calls[0][0] as Record<string, unknown>;
    const batchPayload = spies.upsert.mock.calls[1][0] as Record<string, unknown>[];
    expect('deleted_at' in singlePayload).toBe(false);
    expect('deleted_at' in batchPayload[0]).toBe(false);
  });

  it('resolves the user id once per push, not once per entity', async () => {
    const { client, spies } = createSupabaseMock();
    mockedGetSupabaseClient.mockReturnValue(client as never);

    await pushDocuments([makeDoc('doc-1'), makeDoc('doc-2'), makeDoc('doc-3')]);

    expect(spies.authGetSession).toHaveBeenCalledTimes(1);
    const payload = spies.upsert.mock.calls[0][0] as RemoteDocument[];
    expect(payload).toHaveLength(3);
    expect(payload.every((row) => row.user_id === 'user-1')).toBe(true);
  });

  it('propagates upsert errors (after retry)', async () => {
    const { client } = createSupabaseMock({ upsertError: { message: 'quota exceeded' } });
    mockedGetSupabaseClient.mockReturnValue(client as never);

    await expect(pushDocuments([makeDoc('doc-1')])).rejects.toThrow('quota exceeded');
  });

  it('soft-deletes remote documents by stamping deleted_at', async () => {
    const { client, spies } = createSupabaseMock();
    mockedGetSupabaseClient.mockReturnValue(client as never);

    await deleteRemoteDocument('doc-9');

    expect(spies.from).toHaveBeenCalledWith('documents');
    expect(spies.update).toHaveBeenCalledWith({
      deleted_at: expect.any(String),
      updated_at: expect.any(String),
    });
    expect(spies.updateEq).toHaveBeenCalledWith('id', 'doc-9');
  });

  it('propagates soft-delete errors (after retry)', async () => {
    const { client } = createSupabaseMock({ updateError: { message: 'delete denied' } });
    mockedGetSupabaseClient.mockReturnValue(client as never);

    await expect(deleteRemoteDocument('doc-9')).rejects.toThrow('delete denied');
  });

  it('restores a soft-deleted remote document by clearing deleted_at', async () => {
    const { client, spies } = createSupabaseMock();
    mockedGetSupabaseClient.mockReturnValue(client as never);

    await restoreRemoteDocument('doc-9');

    expect(spies.update).toHaveBeenCalledWith({
      deleted_at: null,
      updated_at: expect.any(String),
    });
    expect(spies.updateEq).toHaveBeenCalledWith('id', 'doc-9');
  });

  it('prefers higher versions, then newer timestamps, and sorts newest first', () => {
    const localPreferred = makeDoc('doc-a', {
      version: 2,
      updatedAt: new Date('2026-01-02T00:00:00.000Z'),
      name: 'Local Preferred',
    });
    const remoteStale = makeDoc('doc-a', {
      version: 1,
      updatedAt: new Date('2026-01-04T00:00:00.000Z'),
      name: 'Remote Stale',
    });
    const localOlder = makeDoc('doc-b', {
      version: 1,
      updatedAt: new Date('2026-01-01T00:00:00.000Z'),
      name: 'Local Older',
    });
    const remoteNewer = makeDoc('doc-b', {
      version: 1,
      updatedAt: new Date('2026-01-03T00:00:00.000Z'),
      name: 'Remote Newer',
    });
    const localNewest = makeDoc('doc-c', {
      updatedAt: new Date('2026-01-05T00:00:00.000Z'),
      name: 'Local Newest',
    });

    const merged = mergeDocuments(
      [localPreferred, localOlder, localNewest],
      [remoteStale, remoteNewer]
    );

    expect(merged.map((doc) => doc.id)).toEqual(['doc-c', 'doc-b', 'doc-a']);
    expect(merged.find((doc) => doc.id === 'doc-a')?.name).toBe('Local Preferred');
    expect(merged.find((doc) => doc.id === 'doc-b')?.name).toBe('Remote Newer');
  });

  it('round-trips queued snapshots through localStorage and clears them', () => {
    const document = makeDoc('queued-doc', {
      createdAt: new Date('2026-02-01T00:00:00.000Z'),
      updatedAt: new Date('2026-02-02T00:00:00.000Z'),
    });

    queueSyncSnapshot([document]);

    const queuedDocuments = getQueuedSyncSnapshot();
    expect(queuedDocuments).toHaveLength(1);
    expect(queuedDocuments[0]).toMatchObject({ id: 'queued-doc', name: 'Document queued-doc' });
    expect(queuedDocuments[0].createdAt).toBeInstanceOf(Date);
    expect(queuedDocuments[0].updatedAt).toBeInstanceOf(Date);

    clearQueuedSyncSnapshot();
    expect(getQueuedSyncSnapshot()).toEqual([]);

    localStorage.setItem('rpg-sync-queue-v1', '{invalid-json');
    expect(getQueuedSyncSnapshot()).toEqual([]);
  });

  it('swallows storage failures when queueing snapshots', () => {
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('quota', 'QuotaExceededError');
    });

    try {
      expect(() => queueSyncSnapshot([makeDoc('too-big')])).not.toThrow();
    } finally {
      setItemSpy.mockRestore();
    }
  });

  it('deduplicates queued deleted document ids and clears them', () => {
    queueDeletedDocumentIds(['doc-a', 'doc-b']);
    queueDeletedDocumentIds(['doc-a', 'doc-c']);

    expect(getQueuedDeletedDocumentIds()).toEqual(['doc-a', 'doc-b', 'doc-c']);

    clearQueuedDeletedDocumentIds();
    expect(getQueuedDeletedDocumentIds()).toEqual([]);

    localStorage.setItem('rpg-sync-delete-queue-v1', '{invalid-json');
    expect(getQueuedDeletedDocumentIds()).toEqual([]);
  });

  it('subscribes to realtime changes and unsubscribes cleanly', async () => {
    const { client, spies, subscribedChannel } = createSupabaseMock();
    mockedGetSupabaseClient.mockReturnValue(client as never);
    const onChange = vi.fn();

    const unsubscribe = subscribeToRemoteDocuments('user-1', onChange);
    expect(spies.channel).toHaveBeenCalledWith('documents-sync-user-1');
    expect(spies.on).toHaveBeenCalledWith(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'documents',
        filter: 'user_id=eq.user-1',
      },
      expect.any(Function)
    );

    const realtimeHandler = spies.on.mock.calls.at(0)?.[2] as (() => void) | undefined;
    expect(realtimeHandler).toBeTypeOf('function');
    if (!realtimeHandler) {
      throw new Error('Expected realtime handler to be registered');
    }
    realtimeHandler();
    expect(onChange).toHaveBeenCalledTimes(1);

    expect(unsubscribe).toBeTypeOf('function');
    unsubscribe?.();
    expect(spies.removeChannel).toHaveBeenCalledWith(subscribedChannel);
  });
});
