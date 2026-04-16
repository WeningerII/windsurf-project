import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { CharacterDocument, SystemDataModel } from '../../types/core/document';
import { getSupabaseClient } from '../../utils/supabaseClient';
import type { RemoteDocument } from '../../utils/syncEngine';
import {
  clearQueuedSyncSnapshot,
  deleteRemoteDocument,
  fetchRemoteDocuments,
  getQueuedSyncSnapshot,
  mergeDocuments,
  pushDocument,
  pushDocuments,
  queueSyncSnapshot,
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
    ...overrides,
  };
}

function createSupabaseMock(
  options: {
    rows?: RemoteDocument[];
    userId?: string;
    fetchError?: { message: string } | null;
    upsertError?: { message: string } | null;
    deleteError?: { message: string } | null;
  } = {}
) {
  const {
    rows = [],
    userId = 'user-1',
    fetchError = null,
    upsertError = null,
    deleteError = null,
  } = options;

  const order = vi.fn().mockResolvedValue({ data: rows, error: fetchError });
  const select = vi.fn(() => ({ order }));
  const upsert = vi.fn().mockResolvedValue({ error: upsertError });
  const eq = vi.fn().mockResolvedValue({ error: deleteError });
  const deleteFn = vi.fn(() => ({ eq }));
  const from = vi.fn(() => ({
    select,
    upsert,
    delete: deleteFn,
  }));
  const subscribedChannel = { id: 'channel-1' };
  const subscribe = vi.fn(() => subscribedChannel);
  const on = vi.fn(() => ({ subscribe }));
  const channel = vi.fn(() => ({ on }));
  const removeChannel = vi.fn().mockResolvedValue(undefined);
  const authGetUser = vi.fn().mockResolvedValue({
    data: { user: { id: userId } },
    error: null,
  });

  return {
    client: {
      from,
      auth: { getUser: authGetUser },
      channel,
      removeChannel,
    },
    spies: {
      from,
      select,
      order,
      upsert,
      deleteFn,
      eq,
      authGetUser,
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

  it('fetches remote documents and hydrates date fields', async () => {
    const remoteDoc = makeRemoteDoc('doc-1');
    const { client, spies } = createSupabaseMock({ rows: [remoteDoc] });
    mockedGetSupabaseClient.mockReturnValue(client as never);

    const documents = await fetchRemoteDocuments();

    expect(spies.from).toHaveBeenCalledWith('documents');
    expect(spies.select).toHaveBeenCalledWith('*');
    expect(spies.order).toHaveBeenCalledWith('updated_at', { ascending: false });
    expect(documents).toHaveLength(1);
    expect(documents[0]).toMatchObject({
      id: 'doc-1',
      name: 'Remote doc-1',
      systemId: 'dnd-5e-2024',
      version: 2,
    });
    expect(documents[0].createdAt).toBeInstanceOf(Date);
    expect(documents[0].updatedAt).toBeInstanceOf(Date);
  });

  it('normalizes documents before upserting them', async () => {
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

    expect(spies.authGetUser).toHaveBeenCalledTimes(2);
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

  it('subscribes to realtime changes, deletes remote documents, and unsubscribes cleanly', async () => {
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

    await deleteRemoteDocument('doc-9');
    expect(spies.deleteFn).toHaveBeenCalledTimes(1);
    expect(spies.eq).toHaveBeenCalledWith('id', 'doc-9');

    expect(unsubscribe).toBeTypeOf('function');
    unsubscribe?.();
    expect(spies.removeChannel).toHaveBeenCalledWith(subscribedChannel);
  });
});
