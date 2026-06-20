import type { ReactNode } from 'react';
import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthContext, type AuthContextValue } from '../../contexts/auth-context';
import { useCampaignSync } from '../../hooks/useCampaignSync';
import type { Campaign } from '../../types/core/campaign';
import {
  clearQueuedCampaignsSnapshot,
  clearQueuedDeletedCampaignIds,
  deleteRemoteCampaign,
  fetchRemoteCampaigns,
  getQueuedCampaignsSnapshot,
  getQueuedDeletedCampaignIds,
  mergeCampaigns,
  pushCampaigns,
  queueDeletedCampaignIds,
  queueCampaignsSnapshot,
  restoreRemoteCampaign,
  subscribeToRemoteCampaigns,
} from '../../utils/syncEngine';
import { getSyncTombstonedIds, recordSyncTombstones } from '../../utils/syncTombstones';

vi.mock('../../utils/syncEngine', () => ({
  clearQueuedCampaignsSnapshot: vi.fn(),
  clearQueuedDeletedCampaignIds: vi.fn(),
  deleteRemoteCampaign: vi.fn(),
  fetchRemoteCampaigns: vi.fn(),
  getQueuedCampaignsSnapshot: vi.fn(),
  getQueuedDeletedCampaignIds: vi.fn(),
  mergeCampaigns: vi.fn(),
  pushCampaigns: vi.fn(),
  queueDeletedCampaignIds: vi.fn(),
  queueCampaignsSnapshot: vi.fn(),
  restoreRemoteCampaign: vi.fn(),
  subscribeToRemoteCampaigns: vi.fn(),
}));

vi.mock('../../utils/syncTombstones', () => ({
  recordSyncTombstones: vi.fn(),
  getSyncTombstonedIds: vi.fn(),
  removeSyncTombstones: vi.fn(),
}));

const mockedClearQueuedCampaignsSnapshot = vi.mocked(clearQueuedCampaignsSnapshot);
const mockedClearQueuedDeletedCampaignIds = vi.mocked(clearQueuedDeletedCampaignIds);
const mockedDeleteRemoteCampaign = vi.mocked(deleteRemoteCampaign);
const mockedFetchRemoteCampaigns = vi.mocked(fetchRemoteCampaigns);
const mockedGetQueuedCampaignsSnapshot = vi.mocked(getQueuedCampaignsSnapshot);
const mockedGetQueuedDeletedCampaignIds = vi.mocked(getQueuedDeletedCampaignIds);
const mockedMergeCampaigns = vi.mocked(mergeCampaigns);
const mockedPushCampaigns = vi.mocked(pushCampaigns);
const mockedQueueDeletedCampaignIds = vi.mocked(queueDeletedCampaignIds);
const mockedQueueCampaignsSnapshot = vi.mocked(queueCampaignsSnapshot);
const mockedRestoreRemoteCampaign = vi.mocked(restoreRemoteCampaign);
const mockedSubscribeToRemoteCampaigns = vi.mocked(subscribeToRemoteCampaigns);
const mockedRecordSyncTombstones = vi.mocked(recordSyncTombstones);
const mockedGetSyncTombstonedIds = vi.mocked(getSyncTombstonedIds);

function makeCampaign(id: string, overrides: Partial<Campaign> = {}): Campaign {
  return {
    id,
    name: `Campaign ${id}`,
    systemId: 'dnd-5e-2024',
    notes: '',
    characterIds: [],
    quests: [],
    sessionLog: [],
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-02T00:00:00.000Z'),
    ...overrides,
  };
}

function mergeNewest(primary: Campaign[], secondary: Campaign[]): Campaign[] {
  const merged = new Map<string, Campaign>();

  [...secondary, ...primary].forEach((campaign) => {
    const existing = merged.get(campaign.id);
    if (!existing || campaign.updatedAt >= existing.updatedAt) {
      merged.set(campaign.id, campaign);
    }
  });

  return Array.from(merged.values());
}

function remoteResult(
  entities: Campaign[] = [],
  tombstones: { id: string; deletedAt: Date }[] = []
) {
  return { entities, tombstones };
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

function createWrapper(getAuthValue: () => AuthContextValue) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <AuthContext.Provider value={getAuthValue()}>{children}</AuthContext.Provider>;
  };
}

describe('useCampaignSync', () => {
  let authValue: AuthContextValue;

  beforeEach(() => {
    vi.clearAllMocks();
    authValue = { ...baseAuthValue };
    setNavigatorOnline(true);
    mockedGetQueuedCampaignsSnapshot.mockReturnValue([]);
    mockedGetQueuedDeletedCampaignIds.mockReturnValue([]);
    mockedFetchRemoteCampaigns.mockResolvedValue(remoteResult());
    mockedPushCampaigns.mockResolvedValue(undefined);
    mockedDeleteRemoteCampaign.mockResolvedValue(undefined);
    mockedRestoreRemoteCampaign.mockResolvedValue(undefined);
    mockedMergeCampaigns.mockImplementation(mergeNewest);
    mockedSubscribeToRemoteCampaigns.mockReturnValue(vi.fn());
    mockedGetSyncTombstonedIds.mockReturnValue([]);
  });

  it('performs an initial local, queued, and remote merge, then re-syncs on realtime updates', async () => {
    const localCampaigns = [makeCampaign('local-campaign')];
    const queuedCampaigns = [
      makeCampaign('queued-campaign', { updatedAt: new Date('2026-01-03T00:00:00.000Z') }),
    ];
    const remoteCampaigns = [
      makeCampaign('remote-campaign', { updatedAt: new Date('2026-01-04T00:00:00.000Z') }),
    ];
    const onMerge = vi.fn();

    mockedGetQueuedCampaignsSnapshot.mockReturnValue(queuedCampaigns);
    mockedFetchRemoteCampaigns.mockResolvedValue(remoteResult(remoteCampaigns));

    const { result } = renderHook(() => useCampaignSync({ campaigns: localCampaigns, onMerge }), {
      wrapper: createWrapper(() => authValue),
    });

    await waitFor(() => {
      expect(onMerge).toHaveBeenCalledTimes(1);
    });

    const mergedCampaigns = onMerge.mock.calls[0][0] as Campaign[];
    expect(mergedCampaigns.map((campaign) => campaign.id)).toEqual(
      expect.arrayContaining(['local-campaign', 'queued-campaign', 'remote-campaign'])
    );
    expect(mockedFetchRemoteCampaigns).toHaveBeenCalledTimes(1);
    expect(mockedPushCampaigns).toHaveBeenCalledWith(mergedCampaigns);
    expect(mockedClearQueuedCampaignsSnapshot).toHaveBeenCalled();
    expect(mockedClearQueuedDeletedCampaignIds).toHaveBeenCalled();
    expect(mockedSubscribeToRemoteCampaigns).toHaveBeenCalledWith('user-1', expect.any(Function));
    expect(result.current.syncState).toBe('idle');
    expect(result.current.lastSyncedAt).toBeInstanceOf(Date);

    const realtimeHandler = mockedSubscribeToRemoteCampaigns.mock.calls[0][1] as () => void;
    mockedFetchRemoteCampaigns.mockClear();
    mockedPushCampaigns.mockClear();
    onMerge.mockClear();

    act(() => {
      realtimeHandler();
    });

    await waitFor(() => {
      expect(mockedFetchRemoteCampaigns).toHaveBeenCalledTimes(1);
      expect(onMerge).toHaveBeenCalledTimes(1);
      expect(mockedPushCampaigns).toHaveBeenCalledTimes(1);
    });
  });

  it('queues the current snapshot when initial sync runs offline', async () => {
    const campaigns = [makeCampaign('offline-campaign')];
    const onMerge = vi.fn();

    setNavigatorOnline(false);

    const { result } = renderHook(() => useCampaignSync({ campaigns, onMerge }), {
      wrapper: createWrapper(() => authValue),
    });

    await waitFor(() => {
      expect(mockedQueueCampaignsSnapshot).toHaveBeenCalledWith(campaigns);
    });

    expect(mockedFetchRemoteCampaigns).not.toHaveBeenCalled();
    expect(onMerge).not.toHaveBeenCalled();
    expect(result.current.syncState).toBe('offline');
  });

  it('replays queued campaign state when the browser comes back online', async () => {
    const campaigns = [makeCampaign('offline-then-online')];
    const queuedCampaigns = [
      makeCampaign('queued-after-online', {
        updatedAt: new Date('2026-01-05T00:00:00.000Z'),
      }),
    ];
    const onMerge = vi.fn();

    setNavigatorOnline(false);
    mockedGetQueuedCampaignsSnapshot.mockReturnValue(queuedCampaigns);

    const { result } = renderHook(() => useCampaignSync({ campaigns, onMerge }), {
      wrapper: createWrapper(() => authValue),
    });

    await waitFor(() => {
      expect(result.current.syncState).toBe('offline');
    });

    mockedFetchRemoteCampaigns.mockClear();
    mockedPushCampaigns.mockClear();
    setNavigatorOnline(true);

    act(() => {
      window.dispatchEvent(new Event('online'));
    });

    await waitFor(() => {
      expect(mockedFetchRemoteCampaigns).toHaveBeenCalledTimes(1);
      expect(onMerge).toHaveBeenCalledTimes(1);
      expect(mockedPushCampaigns).toHaveBeenCalledTimes(1);
    });

    const mergedCampaigns = onMerge.mock.calls[0][0] as Campaign[];
    expect(mergedCampaigns.map((campaign) => campaign.id)).toEqual(
      expect.arrayContaining(['offline-then-online', 'queued-after-online'])
    );
    expect(result.current.syncState).toBe('idle');
  });

  it('replays queued campaign deletes and skips the push when nothing else changed', async () => {
    const remoteDeleted = makeCampaign('deleted-campaign');
    const remoteKept = makeCampaign('kept-campaign');
    const onMerge = vi.fn();

    mockedGetQueuedDeletedCampaignIds.mockReturnValue(['deleted-campaign']);
    mockedFetchRemoteCampaigns.mockResolvedValue(remoteResult([remoteDeleted, remoteKept]));

    const { result } = renderHook(() => useCampaignSync({ campaigns: [], onMerge }), {
      wrapper: createWrapper(() => authValue),
    });

    await waitFor(() => {
      expect(mockedDeleteRemoteCampaign).toHaveBeenCalledWith('deleted-campaign');
    });

    const mergedCampaigns = onMerge.mock.calls[0][0] as Campaign[];
    expect(mergedCampaigns.map((campaign) => campaign.id)).toEqual(['kept-campaign']);
    expect(mockedClearQueuedDeletedCampaignIds).toHaveBeenCalled();

    await waitFor(() => {
      expect(result.current.syncState).toBe('idle');
    });

    // The merged collection equals the live remote rows after the delete
    // replay, so the full-collection push is skipped.
    expect(mockedPushCampaigns).not.toHaveBeenCalled();
  });

  it('removes locally held campaigns that are tombstoned remotely without re-pushing them', async () => {
    const aliveCampaign = makeCampaign('alive-campaign');
    const zombieCampaign = makeCampaign('zombie-campaign');
    const deletedAt = new Date('2026-01-06T00:00:00.000Z');
    const onMerge = vi.fn();

    mockedFetchRemoteCampaigns.mockResolvedValue(
      remoteResult([aliveCampaign], [{ id: 'zombie-campaign', deletedAt }])
    );

    const { result } = renderHook(
      () => useCampaignSync({ campaigns: [aliveCampaign, zombieCampaign], onMerge }),
      { wrapper: createWrapper(() => authValue) }
    );

    await waitFor(() => {
      expect(onMerge).toHaveBeenCalledTimes(1);
    });

    const mergedCampaigns = onMerge.mock.calls[0][0] as Campaign[];
    expect(mergedCampaigns.map((campaign) => campaign.id)).toEqual(['alive-campaign']);
    expect(mockedRecordSyncTombstones).toHaveBeenCalledWith('campaigns', [
      { id: 'zombie-campaign', deletedAt },
    ]);

    await waitFor(() => {
      expect(result.current.syncState).toBe('idle');
    });

    expect(mockedPushCampaigns).not.toHaveBeenCalled();
  });

  it('deletes removed remote campaigns and pushes the latest snapshot', async () => {
    const existingCampaign = makeCampaign('existing-campaign');
    const onMerge = vi.fn();

    const { rerender } = renderHook(({ campaigns }) => useCampaignSync({ campaigns, onMerge }), {
      initialProps: { campaigns: [existingCampaign] as Campaign[] },
      wrapper: createWrapper(() => authValue),
    });

    await waitFor(() => {
      expect(onMerge).toHaveBeenCalledTimes(1);
    });

    mockedDeleteRemoteCampaign.mockClear();
    mockedPushCampaigns.mockClear();

    act(() => {
      rerender({ campaigns: [] });
    });

    await waitFor(() => {
      expect(mockedDeleteRemoteCampaign).toHaveBeenCalledWith('existing-campaign');
    });

    await waitFor(() => {
      expect(mockedPushCampaigns).toHaveBeenCalledWith([]);
    });
  });

  it('queues the latest snapshot and keeps error state when remote deletion fails', async () => {
    const existingCampaign = makeCampaign('existing-campaign');
    const onMerge = vi.fn();

    const { result, rerender } = renderHook(
      ({ campaigns }) => useCampaignSync({ campaigns, onMerge }),
      {
        initialProps: { campaigns: [existingCampaign] as Campaign[] },
        wrapper: createWrapper(() => authValue),
      }
    );

    await waitFor(() => {
      expect(onMerge).toHaveBeenCalledTimes(1);
    });

    mockedDeleteRemoteCampaign.mockRejectedValueOnce(new Error('delete failed'));
    mockedQueueDeletedCampaignIds.mockClear();
    mockedQueueCampaignsSnapshot.mockClear();
    mockedPushCampaigns.mockClear();

    act(() => {
      rerender({ campaigns: [] });
    });

    await waitFor(() => {
      expect(mockedDeleteRemoteCampaign).toHaveBeenCalledWith('existing-campaign');
    });

    await waitFor(() => {
      expect(mockedQueueCampaignsSnapshot).toHaveBeenCalledWith([]);
      expect(mockedQueueDeletedCampaignIds).toHaveBeenCalledWith(['existing-campaign']);
      expect(result.current.syncState).toBe('error');
    });

    expect(mockedPushCampaigns).not.toHaveBeenCalledWith([]);
  });

  it('stays idle when Supabase auth is unavailable', async () => {
    const campaigns = [makeCampaign('no-auth-campaign')];
    const onMerge = vi.fn();

    authValue = { ...baseAuthValue, user: null, isConfigured: false };

    const { result } = renderHook(() => useCampaignSync({ campaigns, onMerge }), {
      wrapper: createWrapper(() => authValue),
    });

    await act(async () => {
      await Promise.resolve();
    });

    expect(mockedFetchRemoteCampaigns).not.toHaveBeenCalled();
    expect(mockedPushCampaigns).not.toHaveBeenCalled();
    expect(mockedSubscribeToRemoteCampaigns).not.toHaveBeenCalled();
    expect(result.current.syncState).toBe('idle');
  });

  it('resets initial-sync state on sign-out before a later sign-in', async () => {
    const existingCampaign = makeCampaign('existing-campaign');
    const onMerge = vi.fn();

    const { rerender } = renderHook(({ campaigns }) => useCampaignSync({ campaigns, onMerge }), {
      initialProps: { campaigns: [existingCampaign] as Campaign[] },
      wrapper: createWrapper(() => authValue),
    });

    await waitFor(() => {
      expect(onMerge).toHaveBeenCalledTimes(1);
    });

    authValue = { ...baseAuthValue, user: null, isConfigured: true };
    mockedDeleteRemoteCampaign.mockClear();
    mockedPushCampaigns.mockClear();

    act(() => {
      rerender({ campaigns: [] });
    });

    await act(async () => {
      await Promise.resolve();
    });

    expect(mockedDeleteRemoteCampaign).not.toHaveBeenCalled();
    expect(mockedPushCampaigns).not.toHaveBeenCalled();

    authValue = { ...baseAuthValue };

    act(() => {
      rerender({ campaigns: [] });
    });

    await waitFor(() => {
      expect(onMerge).toHaveBeenCalledTimes(2);
    });

    // Empty local merged with empty remote — nothing to push.
    expect(onMerge.mock.calls[1][0]).toEqual([]);
    expect(mockedPushCampaigns).not.toHaveBeenCalled();
  });
});
