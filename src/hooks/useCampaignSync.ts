import { useMemo } from 'react';
import type { Campaign } from '../types/core/campaign';
import {
  clearQueuedCampaignsSnapshot,
  clearQueuedDeletedCampaignIds,
  deleteRemoteCampaign,
  restoreRemoteCampaign,
  fetchRemoteCampaigns,
  getQueuedCampaignsSnapshot,
  getQueuedDeletedCampaignIds,
  mergeCampaigns,
  pushCampaigns,
  queueDeletedCampaignIds,
  queueCampaignsSnapshot,
  subscribeToRemoteCampaigns,
} from '../utils/syncEngine';
import {
  getSyncTombstonedIds,
  recordSyncTombstones,
  removeSyncTombstones,
} from '../utils/syncTombstones';
import { sameCampaignSignatures } from '../utils/documentSignature';
import { useEntitySync, type EntitySyncAdapter } from './useEntitySync';

/**
 * Campaign-table sync — a thin adapter over the generic `useEntitySync` engine.
 * Campaign semantics are simpler than character documents:
 *   - No `version` column, so merge is strictly last-writer-wins on updatedAt
 *     (see `mergeCampaigns`).
 *   - A flat snapshot queue for offline replay (no per-entity edit queue);
 *     campaign edits are orders of magnitude rarer than document edits.
 */
interface UseCampaignSyncOptions {
  campaigns: Campaign[];
  onMerge: (merged: Campaign[]) => void;
}

export function useCampaignSync({ campaigns, onMerge }: UseCampaignSyncOptions) {
  const adapter = useMemo<EntitySyncAdapter<Campaign>>(
    () => ({
      sameSignatures: sameCampaignSignatures,
      merge: mergeCampaigns,
      fetchRemote: fetchRemoteCampaigns,
      push: pushCampaigns,
      deleteRemote: deleteRemoteCampaign,
      restoreRemote: restoreRemoteCampaign,
      subscribeToRemote: subscribeToRemoteCampaigns,
      queueSnapshot: queueCampaignsSnapshot,
      clearQueuedSnapshot: clearQueuedCampaignsSnapshot,
      getQueuedSnapshot: getQueuedCampaignsSnapshot,
      queueDeletedIds: queueDeletedCampaignIds,
      clearQueuedDeletedIds: clearQueuedDeletedCampaignIds,
      getQueuedDeletedIds: getQueuedDeletedCampaignIds,
      recordTombstones: (tombstones) => recordSyncTombstones('campaigns', tombstones),
      getTombstonedIds: () => getSyncTombstonedIds('campaigns'),
      removeTombstones: (ids) => removeSyncTombstones('campaigns', ids),
    }),
    []
  );

  return useEntitySync({ entities: campaigns, onMerge, adapter });
}
