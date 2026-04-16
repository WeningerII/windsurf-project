import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useCampaigns } from '../../hooks/useCampaigns';
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
});
