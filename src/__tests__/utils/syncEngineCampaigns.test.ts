import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Campaign } from '../../types/core/campaign';
import { getSupabaseClient } from '../../utils/supabaseClient';
import type { RemoteCampaign } from '../../utils/syncEngine';
import {
  clearQueuedCampaignsSnapshot,
  clearQueuedDeletedCampaignIds,
  deleteRemoteCampaign,
  fetchRemoteCampaigns,
  getQueuedCampaignsSnapshot,
  getQueuedDeletedCampaignIds,
  mergeCampaigns,
  pushCampaign,
  pushCampaigns,
  queueDeletedCampaignIds,
  queueCampaignsSnapshot,
  restoreRemoteCampaign,
  subscribeToRemoteCampaigns,
} from '../../utils/syncEngine';

vi.mock('../../utils/supabaseClient', () => ({
  getSupabaseClient: vi.fn(),
}));

const mockedGetSupabaseClient = vi.mocked(getSupabaseClient);

function makeCampaign(id: string, overrides: Partial<Campaign> = {}): Campaign {
  return {
    id,
    name: `Campaign ${id}`,
    systemId: 'dnd-5e-2024',
    notes: '',
    characterIds: [],
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-02T00:00:00.000Z'),
    ...overrides,
  };
}

function makeRemoteCampaign(id: string, overrides: Partial<RemoteCampaign> = {}): RemoteCampaign {
  return {
    id,
    user_id: 'user-1',
    name: `Remote ${id}`,
    system_id: 'dnd-5e-2024',
    notes: 'server notes',
    character_ids: [],
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-03T00:00:00.000Z',
    deleted_at: null,
    ...overrides,
  };
}

function createSupabaseMock(
  options: {
    rows?: RemoteCampaign[];
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
  const from = vi.fn(() => ({ select, upsert, update }));
  const subscribedChannel = { id: 'campaigns-channel-1' };
  const on = vi.fn(() => ({ subscribe: vi.fn(() => subscribedChannel) }));
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
    } as unknown as ReturnType<typeof getSupabaseClient>,
    spies: {
      from,
      select,
      order,
      upsert,
      update,
      updateEq,
      channel,
      on,
      removeChannel,
      authGetSession,
    },
  };
}

describe('syncEngine — campaigns', () => {
  beforeEach(() => {
    mockedGetSupabaseClient.mockReset();
    if (typeof localStorage !== 'undefined') localStorage.clear();
  });

  it('fetchRemoteCampaigns returns empty result when Supabase is not configured', async () => {
    mockedGetSupabaseClient.mockReturnValue(null);
    await expect(fetchRemoteCampaigns()).resolves.toEqual({ entities: [], tombstones: [] });
  });

  it('fetchRemoteCampaigns maps remote rows to local Campaign shape and splits out tombstones', async () => {
    const remote = makeRemoteCampaign('c1', {
      name: 'Arkham Investigators',
      notes: 'First session',
      character_ids: ['char-a', 'char-b'],
    });
    const tombstoneRow = makeRemoteCampaign('c-gone', {
      deleted_at: '2026-01-06T00:00:00.000Z',
    });
    const mock = createSupabaseMock({ rows: [remote, tombstoneRow] });
    mockedGetSupabaseClient.mockReturnValue(mock.client);

    const { entities, tombstones } = await fetchRemoteCampaigns();

    expect(mock.spies.from).toHaveBeenCalledWith('campaigns');
    expect(entities).toHaveLength(1);
    expect(entities[0]).toMatchObject({
      id: 'c1',
      name: 'Arkham Investigators',
      notes: 'First session',
      characterIds: ['char-a', 'char-b'],
    });
    expect(entities[0].createdAt).toBeInstanceOf(Date);
    expect(entities[0].updatedAt).toBeInstanceOf(Date);
    expect(tombstones).toEqual([{ id: 'c-gone', deletedAt: new Date('2026-01-06T00:00:00.000Z') }]);
  });

  it('fetchRemoteCampaigns propagates Supabase errors (after retry)', async () => {
    const mock = createSupabaseMock({ fetchError: { message: 'boom' } });
    mockedGetSupabaseClient.mockReturnValue(mock.client);

    await expect(fetchRemoteCampaigns()).rejects.toThrow('boom');
  });

  it('pushCampaign upserts with onConflict: id and no-ops without Supabase', async () => {
    mockedGetSupabaseClient.mockReturnValue(null);
    await expect(pushCampaign(makeCampaign('c1'))).resolves.toBeUndefined();

    const mock = createSupabaseMock();
    mockedGetSupabaseClient.mockReturnValue(mock.client);

    const campaign = makeCampaign('c1', { systemId: undefined });
    await pushCampaign(campaign);

    expect(mock.spies.from).toHaveBeenCalledWith('campaigns');
    expect(mock.spies.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'c1',
        user_id: 'user-1',
        system_id: null,
      }),
      { onConflict: 'id' }
    );
    // The payload must not carry deleted_at, so upserts can never resurrect a
    // soft-deleted row.
    const payload = mock.spies.upsert.mock.calls[0][0] as Record<string, unknown>;
    expect('deleted_at' in payload).toBe(false);
  });

  it('pushCampaigns batches an array, resolves the user id once, and short-circuits on empty input', async () => {
    const mock = createSupabaseMock();
    mockedGetSupabaseClient.mockReturnValue(mock.client);

    await pushCampaigns([]);
    expect(mock.spies.upsert).not.toHaveBeenCalled();
    expect(mock.spies.authGetSession).not.toHaveBeenCalled();

    await pushCampaigns([makeCampaign('c1'), makeCampaign('c2')]);
    expect(mock.spies.upsert).toHaveBeenCalledTimes(1);
    expect(mock.spies.authGetSession).toHaveBeenCalledTimes(1);
    const payload = mock.spies.upsert.mock.calls[0][0] as RemoteCampaign[];
    expect(payload).toHaveLength(2);
    expect(payload[0].id).toBe('c1');
    expect(payload[1].id).toBe('c2');
  });

  it('pushCampaigns propagates upsert errors (after retry)', async () => {
    const mock = createSupabaseMock({ upsertError: { message: 'denied' } });
    mockedGetSupabaseClient.mockReturnValue(mock.client);

    await expect(pushCampaigns([makeCampaign('c1')])).rejects.toThrow('denied');
  });

  it('deleteRemoteCampaign soft-deletes by stamping deleted_at on the row', async () => {
    const mock = createSupabaseMock();
    mockedGetSupabaseClient.mockReturnValue(mock.client);

    await deleteRemoteCampaign('c1');

    expect(mock.spies.from).toHaveBeenCalledWith('campaigns');
    expect(mock.spies.update).toHaveBeenCalledWith({
      deleted_at: expect.any(String),
      updated_at: expect.any(String),
    });
    expect(mock.spies.updateEq).toHaveBeenCalledWith('id', 'c1');
  });

  it('deleteRemoteCampaign propagates errors (after retry)', async () => {
    const mock = createSupabaseMock({ updateError: { message: 'delete denied' } });
    mockedGetSupabaseClient.mockReturnValue(mock.client);

    await expect(deleteRemoteCampaign('c1')).rejects.toThrow('delete denied');
  });

  it('restoreRemoteCampaign clears the tombstone', async () => {
    const mock = createSupabaseMock();
    mockedGetSupabaseClient.mockReturnValue(mock.client);

    await restoreRemoteCampaign('c1');

    expect(mock.spies.update).toHaveBeenCalledWith({
      deleted_at: null,
      updated_at: expect.any(String),
    });
    expect(mock.spies.updateEq).toHaveBeenCalledWith('id', 'c1');
  });

  it('mergeCampaigns takes the last-writer on updatedAt and sorts desc', () => {
    const local = [
      makeCampaign('c1', { updatedAt: new Date('2026-01-05T00:00:00.000Z'), name: 'Local wins' }),
      makeCampaign('c2', { updatedAt: new Date('2026-01-02T00:00:00.000Z') }),
    ];
    const remote = [
      makeCampaign('c1', { updatedAt: new Date('2026-01-04T00:00:00.000Z'), name: 'Remote older' }),
      makeCampaign('c3', { updatedAt: new Date('2026-01-07T00:00:00.000Z') }),
    ];

    const merged = mergeCampaigns(local, remote);

    expect(merged).toHaveLength(3);
    expect(merged.map((c) => c.id)).toEqual(['c3', 'c1', 'c2']);
    expect(merged.find((c) => c.id === 'c1')!.name).toBe('Local wins');
  });

  it('mergeCampaigns resolves conflicts by client edit time: local newer wins, remote newer wins', () => {
    // With the 003 migration the server no longer rewrites updated_at, so
    // these timestamps are real client edit times and last-writer-wins is
    // sound in both directions.
    const localNewer = makeCampaign('c-local', {
      updatedAt: new Date('2026-02-02T00:00:00.000Z'),
      name: 'Local edit (newer)',
    });
    const remoteStale = makeCampaign('c-local', {
      updatedAt: new Date('2026-02-01T00:00:00.000Z'),
      name: 'Remote copy (older)',
    });
    const localStale = makeCampaign('c-remote', {
      updatedAt: new Date('2026-02-01T00:00:00.000Z'),
      name: 'Local copy (older)',
    });
    const remoteNewer = makeCampaign('c-remote', {
      updatedAt: new Date('2026-02-03T00:00:00.000Z'),
      name: 'Remote edit (newer)',
    });

    const merged = mergeCampaigns([localNewer, localStale], [remoteStale, remoteNewer]);

    expect(merged.find((c) => c.id === 'c-local')!.name).toBe('Local edit (newer)');
    expect(merged.find((c) => c.id === 'c-remote')!.name).toBe('Remote edit (newer)');
    // Equal timestamps keep the remote copy (no spurious local push).
    const tie = mergeCampaigns(
      [makeCampaign('c-tie', { name: 'Local tie' })],
      [makeCampaign('c-tie', { name: 'Remote tie' })]
    );
    expect(tie.find((c) => c.id === 'c-tie')!.name).toBe('Remote tie');
  });

  it('queueCampaignsSnapshot round-trips through localStorage with hydrated dates', () => {
    const snapshot = [makeCampaign('c1'), makeCampaign('c2')];
    queueCampaignsSnapshot(snapshot);
    const restored = getQueuedCampaignsSnapshot();

    expect(restored).toHaveLength(2);
    expect(restored[0].createdAt).toBeInstanceOf(Date);
    expect(restored[0].updatedAt).toBeInstanceOf(Date);
    expect(restored[0].id).toBe('c1');

    clearQueuedCampaignsSnapshot();
    expect(getQueuedCampaignsSnapshot()).toEqual([]);
  });

  it('queueCampaignsSnapshot swallows storage failures', () => {
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('quota', 'QuotaExceededError');
    });

    try {
      expect(() => queueCampaignsSnapshot([makeCampaign('c1')])).not.toThrow();
    } finally {
      setItemSpy.mockRestore();
    }
  });

  it('getQueuedCampaignsSnapshot tolerates malformed JSON by returning []', () => {
    localStorage.setItem('rpg-campaign-sync-queue-v1', 'not json');
    expect(getQueuedCampaignsSnapshot()).toEqual([]);
  });

  it('deduplicates queued deleted campaign ids and clears them', () => {
    queueDeletedCampaignIds(['c1', 'c2']);
    queueDeletedCampaignIds(['c1', 'c3']);

    expect(getQueuedDeletedCampaignIds()).toEqual(['c1', 'c2', 'c3']);

    clearQueuedDeletedCampaignIds();
    expect(getQueuedDeletedCampaignIds()).toEqual([]);

    localStorage.setItem('rpg-campaign-sync-delete-queue-v1', 'not json');
    expect(getQueuedDeletedCampaignIds()).toEqual([]);
  });

  it('subscribeToRemoteCampaigns wires a postgres_changes listener filtered by user_id', () => {
    const mock = createSupabaseMock();
    mockedGetSupabaseClient.mockReturnValue(mock.client);
    const onChange = vi.fn();

    const unsubscribe = subscribeToRemoteCampaigns('user-1', onChange);

    expect(mock.spies.channel).toHaveBeenCalledWith('campaigns-sync-user-1');
    expect(mock.spies.on).toHaveBeenCalledWith(
      'postgres_changes',
      expect.objectContaining({
        event: '*',
        schema: 'public',
        table: 'campaigns',
        filter: 'user_id=eq.user-1',
      }),
      expect.any(Function)
    );

    // The vi.fn() mock for `on` has an empty-tuple args type by default; the
    // third positional arg is the postgres_changes callback.  Cast through
    // unknown to pull it out for behavioural verification.
    const firstOnCall = mock.spies.on.mock.calls[0] as unknown as unknown[];
    const realtimeHandler = firstOnCall[2] as (() => void) | undefined;
    expect(realtimeHandler).toBeTypeOf('function');
    realtimeHandler?.();
    expect(onChange).toHaveBeenCalledTimes(1);

    expect(typeof unsubscribe).toBe('function');
    unsubscribe?.();
    expect(mock.spies.removeChannel).toHaveBeenCalled();
  });
});
