import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { useDocuments } from '../../hooks/useDocuments';
import { useCampaigns } from '../../hooks/useCampaigns';
import { registerAllSystems } from '../../systems';
import { systemRegistry } from '../../registry';
import { createDefaultDnd5e2024Data } from '../../systems/dnd5e-2024/data-model';
import type { CharacterDocument, SystemDataModel } from '../../types/core/document';
import type { Campaign } from '../../types/core/campaign';

function makeDoc(id: string, name = `Doc ${id}`): CharacterDocument<SystemDataModel> {
  return {
    id,
    name,
    systemId: 'dnd-5e-2024',
    system: createDefaultDnd5e2024Data(),
    createdAt: new Date('2026-02-24T00:00:00.000Z'),
    updatedAt: new Date('2026-02-24T00:00:00.000Z'),
    version: 1,
  };
}

function makeCampaign(id: string, overrides: Partial<Campaign> = {}): Campaign {
  return {
    id,
    name: `Campaign ${id}`,
    characterIds: [],
    notes: '',
    createdAt: new Date('2026-02-24T00:00:00.000Z'),
    updatedAt: new Date('2026-02-24T00:00:00.000Z'),
    ...overrides,
  };
}

/**
 * `applyMergedDocuments` / `applyMergedCampaigns` are the sync onMerge
 * pathway: unlike the upsert-only add* APIs, they treat the merged collection
 * as authoritative, so an entity tombstoned on another device (and therefore
 * absent from the merge result) is REMOVED from local state and storage.
 */
describe('applyMerged collections (sync onMerge pathway)', () => {
  beforeAll(() => {
    if (!systemRegistry.get('dnd-5e-2024')) {
      registerAllSystems();
    }
  });

  beforeEach(() => {
    localStorage.clear();
  });

  it('applyMergedDocuments removes documents missing from the merged collection', async () => {
    const { result } = renderHook(() => useDocuments());
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.addDocument(makeDoc('keep-doc'));
      result.current.addDocument(makeDoc('tombstoned-doc'));
    });
    expect(result.current.documents.map((d) => d.id)).toEqual(['keep-doc', 'tombstoned-doc']);

    // Sync merge came back without the tombstoned document.
    act(() => {
      result.current.applyMergedDocuments([makeDoc('keep-doc'), makeDoc('new-remote-doc')]);
    });

    expect(result.current.documents.map((d) => d.id)).toEqual(['keep-doc', 'new-remote-doc']);

    act(() => {
      result.current.flushPendingSaves();
    });
    const stored = JSON.parse(localStorage.getItem('rpg-documents-v2') ?? '{}') as {
      documents?: Array<{ id: string }>;
    };
    expect(stored.documents?.map((d) => d.id)).toEqual(['keep-doc', 'new-remote-doc']);
  });

  it('applyMergedDocuments keeps history so the removal is undoable', async () => {
    const { result } = renderHook(() => useDocuments());
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.addDocument(makeDoc('doomed-doc'));
    });

    act(() => {
      result.current.applyMergedDocuments([]);
    });
    expect(result.current.documents).toEqual([]);
    expect(result.current.canUndo).toBe(true);

    act(() => {
      result.current.undo();
    });
    expect(result.current.documents.map((d) => d.id)).toEqual(['doomed-doc']);
  });

  it('applyMergedCampaigns replaces the collection, removing missing campaigns', async () => {
    const { result } = renderHook(() => useCampaigns());
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.addCampaign(makeCampaign('keep-camp'));
      result.current.addCampaign(makeCampaign('tombstoned-camp'));
    });

    act(() => {
      result.current.applyMergedCampaigns([makeCampaign('keep-camp')]);
    });

    expect(result.current.campaigns.map((c) => c.id)).toEqual(['keep-camp']);

    act(() => {
      result.current.flushPendingSaves();
    });
    const stored = JSON.parse(localStorage.getItem('rpg-campaigns-v1') ?? '{}') as {
      campaigns?: Array<{ id: string }>;
    };
    expect(stored.campaigns?.map((c) => c.id)).toEqual(['keep-camp']);
  });

  it('applyMergedCampaigns is a no-op when the merged collection is signature-equal', async () => {
    const campaign = makeCampaign('stable-camp');
    const { result } = renderHook(() => useCampaigns());
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.addCampaign(campaign);
    });
    const before = result.current.campaigns;

    act(() => {
      result.current.applyMergedCampaigns([{ ...campaign }]);
    });

    // Same (id, updatedAt, members) signature: state identity is preserved,
    // so no render churn and no spurious persistence cycle.
    expect(result.current.campaigns).toBe(before);
  });
});
