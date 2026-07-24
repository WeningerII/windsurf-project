import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { useDockResources } from '../useDockResources';
import * as dataLoader from '../../utils/dataLoader';
import type { GameSystemId } from '../../types/game-systems';

vi.mock('../../utils/dataLoader', () => ({
  loadSpellsForSystem: vi.fn(),
  loadFeatsForSystem: vi.fn(),
  loadEquipmentForSystem: vi.fn(),
  loadMonstersForSystem: vi.fn(),
}));

const spell = { id: 's1', name: 'Spell 1' };
const feat = { id: 'f1', name: 'Feat 1' };
const item = { id: 'i1', name: 'Item 1' };
const monster = { id: 'm1', name: 'Monster 1' };

beforeEach(() => {
  vi.mocked(dataLoader.loadSpellsForSystem).mockResolvedValue([spell] as never);
  vi.mocked(dataLoader.loadFeatsForSystem).mockResolvedValue([feat] as never);
  vi.mocked(dataLoader.loadEquipmentForSystem).mockResolvedValue([item] as never);
  vi.mocked(dataLoader.loadMonstersForSystem).mockResolvedValue([monster] as never);
});

describe('useDockResources', () => {
  it('loads the four SRD catalogs for the explicit system selector', async () => {
    const { result } = renderHook(() => useDockResources('dnd-5e-2014'));

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(dataLoader.loadSpellsForSystem).toHaveBeenCalledWith('dnd-5e-2014');
    expect(dataLoader.loadFeatsForSystem).toHaveBeenCalledWith('dnd-5e-2014');
    expect(dataLoader.loadEquipmentForSystem).toHaveBeenCalledWith('dnd-5e-2014');
    expect(dataLoader.loadMonstersForSystem).toHaveBeenCalledWith('dnd-5e-2014');

    expect(result.current.spells).toEqual([spell]);
    expect(result.current.feats).toEqual([feat]);
    expect(result.current.equipment).toEqual([item]);
    expect(result.current.monsters).toEqual([monster]);
  });

  it('reloads for a newly-selected system', async () => {
    const { result, rerender } = renderHook(
      ({ id }: { id: GameSystemId }) => useDockResources(id),
      {
        initialProps: { id: 'dnd-5e-2014' as GameSystemId },
      }
    );

    await waitFor(() => expect(result.current.loading).toBe(false));

    rerender({ id: 'pf2e' as GameSystemId });
    await waitFor(() => {
      expect(dataLoader.loadMonstersForSystem).toHaveBeenCalledWith('pf2e');
    });
  });

  it('surfaces a loader failure as an empty catalog rather than throwing', async () => {
    vi.mocked(dataLoader.loadSpellsForSystem).mockRejectedValueOnce(new Error('chunk failed'));

    const { result } = renderHook(() => useDockResources('dnd-5e-2014'));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.spells).toEqual([]);
    expect(result.current.monsters).toEqual([]);
  });
});
