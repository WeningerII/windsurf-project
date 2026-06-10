import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useCampaigns } from '../../hooks/useCampaigns';
import * as campaignStorage from '../../utils/campaignStorage';
import type { Campaign } from '../../types/core/campaign';

function makeCampaign(overrides: Partial<Campaign> = {}): Campaign {
  return {
    id: 'camp-1',
    name: 'Test Campaign',
    characterIds: [],
    notes: '',
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
    ...overrides,
  };
}

describe('useCampaigns', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('starts with empty campaigns', () => {
    const { result } = renderHook(() => useCampaigns());
    expect(result.current.campaigns).toEqual([]);
  });

  it('adds a campaign', () => {
    const { result } = renderHook(() => useCampaigns());
    act(() => {
      result.current.addCampaign(makeCampaign());
    });
    expect(result.current.campaigns).toHaveLength(1);
    expect(result.current.campaigns[0].name).toBe('Test Campaign');
  });

  it('persists campaigns to localStorage', async () => {
    const { result } = renderHook(() => useCampaigns());
    act(() => {
      result.current.addCampaign(makeCampaign());
    });
    await waitFor(() => {
      const stored = localStorage.getItem('rpg-campaigns-v1');
      expect(stored).toBeTruthy();
      const parsed = JSON.parse(stored!);
      expect(parsed.campaigns).toHaveLength(1);
    });
  });

  it('updates a campaign', () => {
    const { result } = renderHook(() => useCampaigns());
    act(() => {
      result.current.addCampaign(makeCampaign());
    });
    act(() => {
      result.current.updateCampaign({ ...result.current.campaigns[0], name: 'Renamed' });
    });
    expect(result.current.campaigns[0].name).toBe('Renamed');
  });

  it('deletes a campaign', () => {
    const { result } = renderHook(() => useCampaigns());
    act(() => {
      result.current.addCampaign(makeCampaign());
    });
    act(() => {
      result.current.deleteCampaign('camp-1');
    });
    expect(result.current.campaigns).toHaveLength(0);
  });

  it('adds a character to a campaign', () => {
    const { result } = renderHook(() => useCampaigns());
    act(() => {
      result.current.addCampaign(makeCampaign());
    });
    act(() => {
      result.current.addCharacterToCampaign('camp-1', 'char-abc');
    });
    expect(result.current.campaigns[0].characterIds).toEqual(['char-abc']);
  });

  it('does not add duplicate character IDs', () => {
    const { result } = renderHook(() => useCampaigns());
    act(() => {
      result.current.addCampaign(makeCampaign());
    });
    act(() => {
      result.current.addCharacterToCampaign('camp-1', 'char-abc');
    });
    act(() => {
      result.current.addCharacterToCampaign('camp-1', 'char-abc');
    });
    expect(result.current.campaigns[0].characterIds).toEqual(['char-abc']);
  });

  it('removes a character from a campaign', () => {
    const { result } = renderHook(() => useCampaigns());
    act(() => {
      result.current.addCampaign(makeCampaign({ characterIds: ['char-a', 'char-b'] }));
    });
    act(() => {
      result.current.removeCharacterFromCampaign('camp-1', 'char-a');
    });
    expect(result.current.campaigns[0].characterIds).toEqual(['char-b']);
  });

  it('clears all campaigns without re-saving pending debounced state', async () => {
    const { result } = renderHook(() => useCampaigns());
    act(() => {
      result.current.addCampaign(makeCampaign());
      result.current.addCampaign(makeCampaign({ id: 'camp-2', name: 'Second' }));
      result.current.clearAllCampaigns();
    });
    expect(result.current.campaigns).toHaveLength(0);
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 350));
    });
    expect(localStorage.getItem('rpg-campaigns-v1')).toBeNull();
  });

  it('flushes pending debounced campaign saves on unmount', () => {
    const { result, unmount } = renderHook(() => useCampaigns());
    act(() => {
      result.current.addCampaign(makeCampaign());
      result.current.updateCampaign(makeCampaign({ name: 'Flushed Campaign' }));
    });

    unmount();

    const stored = localStorage.getItem('rpg-campaigns-v1');
    expect(stored).toBeTruthy();
    const parsed = JSON.parse(stored!);
    expect(parsed.campaigns).toMatchObject([{ name: 'Flushed Campaign' }]);
  });

  it('flushes pending campaign saves on pagehide', () => {
    const { result } = renderHook(() => useCampaigns());
    act(() => {
      result.current.addCampaign(makeCampaign());
      result.current.updateCampaign(makeCampaign({ name: 'Pagehide Campaign' }));
    });

    act(() => {
      window.dispatchEvent(new Event('pagehide'));
    });

    const stored = localStorage.getItem('rpg-campaigns-v1');
    expect(stored).toBeTruthy();
    const parsed = JSON.parse(stored!);
    expect(parsed.campaigns).toMatchObject([{ name: 'Pagehide Campaign' }]);
  });

  // M5: a save failure inside the debounce timer must surface as an error
  // state instead of becoming an uncaught exception.
  it('surfaces persistence failures through the error state and recovers', async () => {
    const saveSpy = vi.spyOn(campaignStorage, 'saveCampaigns').mockImplementation(() => {
      throw new Error('Quota exceeded');
    });

    const { result } = renderHook(() => useCampaigns());
    expect(result.current.error).toBeNull();

    act(() => {
      result.current.addCampaign(makeCampaign());
    });
    act(() => {
      result.current.flushPendingSaves();
    });

    await waitFor(() => expect(result.current.error).toBe('Quota exceeded'));

    // Once saving works again, the next successful persist clears the error.
    saveSpy.mockRestore();
    act(() => {
      result.current.updateCampaign({ ...result.current.campaigns[0], name: 'Recovered' });
    });
    act(() => {
      result.current.flushPendingSaves();
    });
    await waitFor(() => expect(result.current.error).toBeNull());
  });

  // H2 family: a no-op merged snapshot inside the debounce window must not
  // drop the pending save of a real edit.
  it('does not drop a pending save when a no-op merged snapshot lands within the debounce window', () => {
    const { result } = renderHook(() => useCampaigns());
    act(() => {
      result.current.addCampaign(makeCampaign());
    });
    act(() => {
      result.current.flushPendingSaves();
    });

    act(() => {
      result.current.updateCampaign({ ...result.current.campaigns[0], name: 'Edited' });
    });
    // A signature-identical snapshot (e.g. a sync echo) arrives in the window.
    act(() => {
      result.current.applyMergedCampaigns(result.current.campaigns.map((c) => ({ ...c })));
    });
    act(() => {
      result.current.flushPendingSaves();
    });

    const parsed = JSON.parse(localStorage.getItem('rpg-campaigns-v1')!);
    expect(parsed.campaigns).toMatchObject([{ name: 'Edited' }]);
  });

  // M3: cross-tab reconciliation via storage events.
  it("merges another tab's campaigns from a storage event", () => {
    const { result } = renderHook(() => useCampaigns());
    act(() => {
      result.current.addCampaign(makeCampaign({ id: 'local-camp', name: 'Local' }));
    });

    act(() => {
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: 'rpg-campaigns-v1',
          newValue: JSON.stringify({
            version: '1.0',
            campaigns: [makeCampaign({ id: 'other-camp', name: 'Other Tab' })],
            lastModified: new Date().toISOString(),
          }),
        })
      );
    });

    expect(result.current.campaigns.map((c) => c.id).sort()).toEqual(['local-camp', 'other-camp']);
  });

  it('ignores an identical cross-tab campaign snapshot without state churn (loop safety)', () => {
    const { result } = renderHook(() => useCampaigns());
    act(() => {
      result.current.addCampaign(makeCampaign({ id: 'stable-camp', name: 'Stable' }));
    });
    act(() => {
      result.current.flushPendingSaves();
    });

    const echoPayload = localStorage.getItem('rpg-campaigns-v1');
    expect(echoPayload).toBeTruthy();
    const before = result.current.campaigns;

    act(() => {
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: 'rpg-campaigns-v1',
          newValue: echoPayload!,
        })
      );
    });

    expect(result.current.campaigns).toBe(before);
  });
});
