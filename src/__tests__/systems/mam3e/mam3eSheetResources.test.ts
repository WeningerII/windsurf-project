import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { CharacterClass } from '../../../types/character-options/classes';
import type { GameSystemId } from '../../../types/game-systems';
import {
  loadMam3eArchetypesForSystem,
  loadPowerModifiersForSystem,
} from '../../../utils/dataLoader';
import { useMam3eSheetResources } from '../../../systems/mam3e/useMam3eSheetResources';

vi.mock('../../../utils/dataLoader', () => ({
  loadAdvantagesForSystem: vi.fn().mockResolvedValue([]),
  loadComplicationsForSystem: vi.fn().mockResolvedValue([]),
  loadEquipmentForSystem: vi.fn().mockResolvedValue([]),
  loadMam3eArchetypesForSystem: vi.fn(),
  loadPowerModifiersForSystem: vi.fn(),
  loadSpellsForSystem: vi.fn().mockResolvedValue([]),
}));

const SYSTEM_ID = 'mam3e' as GameSystemId;

describe('useMam3eSheetResources lazy-load error handling', () => {
  it('tracks an error state for a failed lazy load instead of swallowing the rejection', async () => {
    const loadMock = vi.mocked(loadMam3eArchetypesForSystem);
    loadMock.mockReset();
    loadMock.mockRejectedValueOnce(new Error('network down'));

    const { result } = renderHook(() => useMam3eSheetResources({ systemId: SYSTEM_ID }));

    await act(async () => {
      await result.current.loadArchetypes();
    });

    expect(result.current.archetypesLoaded).toBe(false);
    expect(result.current.archetypesError).toBe(true);
  });

  it('clears the error and loads the data when a retry succeeds', async () => {
    const loadMock = vi.mocked(loadMam3eArchetypesForSystem);
    loadMock.mockReset();
    loadMock
      .mockRejectedValueOnce(new Error('network down'))
      .mockResolvedValueOnce([{ id: 'speedster', name: 'Speedster' } as CharacterClass]);

    const { result } = renderHook(() => useMam3eSheetResources({ systemId: SYSTEM_ID }));

    await act(async () => {
      await result.current.loadArchetypes();
    });
    expect(result.current.archetypesError).toBe(true);

    await act(async () => {
      await result.current.loadArchetypes();
    });

    expect(result.current.archetypesError).toBe(false);
    expect(result.current.archetypesLoaded).toBe(true);
    expect(result.current.archetypes.map((entry) => entry.id)).toEqual(['speedster']);
  });

  it('tracks and recovers the power-modifier catalog load the same way', async () => {
    const loadMock = vi.mocked(loadPowerModifiersForSystem);
    loadMock.mockReset();
    loadMock.mockRejectedValueOnce(new Error('chunk failed')).mockResolvedValueOnce([]);

    const { result } = renderHook(() => useMam3eSheetResources({ systemId: SYSTEM_ID }));

    await act(async () => {
      await result.current.loadPowerModifiers();
    });
    expect(result.current.powerModifiersLoaded).toBe(false);
    expect(result.current.powerModifiersError).toBe(true);
    // The bundled fallback catalog stays available while in the error state.
    expect(result.current.modifierCatalog.length).toBeGreaterThan(0);

    await act(async () => {
      await result.current.loadPowerModifiers();
    });
    expect(result.current.powerModifiersLoaded).toBe(true);
    expect(result.current.powerModifiersError).toBe(false);
  });
});
