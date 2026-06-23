import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { CharacterDocument, SystemDataModel } from '../../../types/core/document';
import {
  createDefaultDaggerheartData,
  type DaggerheartDataModel,
} from '../../../systems/daggerheart/data-model';
import { useDaggerheartSheetController } from '../../../systems/daggerheart/useDaggerheartSheetController';

/**
 * Controller-level wiring: the synchronous `update` / `updateAttr` / `onNameChange`
 * callbacks and the read-only guard. Catalog loading is stubbed to empty so the
 * derived state is deterministic and these callback paths are isolated.
 */
vi.mock('../../../utils/dataLoader', () => ({
  loadDaggerheartClassesForSystem: vi.fn(() => Promise.resolve([])),
  loadDaggerheartAncestriesForSystem: vi.fn(() => Promise.resolve([])),
  loadDaggerheartCommunitiesForSystem: vi.fn(() => Promise.resolve([])),
  loadDaggerheartDomainsForSystem: vi.fn(() => Promise.resolve([])),
  loadDaggerheartDomainCardsForSystem: vi.fn(() => Promise.resolve([])),
  loadDaggerheartWeaponsForSystem: vi.fn(() => Promise.resolve([])),
  loadDaggerheartArmorForSystem: vi.fn(() => Promise.resolve([])),
  loadDaggerheartLootForSystem: vi.fn(() => Promise.resolve([])),
  loadDaggerheartConsumablesForSystem: vi.fn(() => Promise.resolve([])),
}));

function makeDoc(
  overrides: Partial<DaggerheartDataModel> = {}
): CharacterDocument<DaggerheartDataModel> {
  return {
    id: 'dh-controller',
    name: 'Hero',
    systemId: 'daggerheart',
    system: { ...createDefaultDaggerheartData(), ...overrides },
    createdAt: new Date('2026-03-09T00:00:00.000Z'),
    updatedAt: new Date('2026-03-09T00:00:00.000Z'),
  };
}

function lastDocument(onUpdate: ReturnType<typeof vi.fn>): CharacterDocument<SystemDataModel> {
  return onUpdate.mock.calls.at(-1)![0] as CharacterDocument<SystemDataModel>;
}

describe('useDaggerheartSheetController', () => {
  it('reports canUpdate=false and never calls onUpdate when no handler is supplied', async () => {
    const document = makeDoc();
    const { result } = renderHook(() => useDaggerheartSheetController({ document }));
    // Flush the (stubbed) resource-loading effect so it doesn't update state mid-assertion.
    await act(async () => {});

    expect(result.current.canUpdate).toBe(false);

    // Both of these route through guards that early-return without an onUpdate.
    act(() => result.current.updateAttr('agility', 2));
    act(() => result.current.onNameChange('Renamed'));

    // No throw, and the controller still exposes the unchanged document/data.
    expect(result.current.data.attributes.agility).toBe(0);
    expect(result.current.data.name).toBeUndefined();
  });

  it('updateAttr commits the full document with the single attribute changed', async () => {
    const onUpdate = vi.fn();
    const document = makeDoc();
    const { result } = renderHook(() => useDaggerheartSheetController({ document, onUpdate }));
    await act(async () => {});

    act(() => result.current.updateAttr('finesse', 2));

    expect(onUpdate).toHaveBeenCalledTimes(1);
    const next = lastDocument(onUpdate) as CharacterDocument<DaggerheartDataModel>;
    expect(next.system.attributes.finesse).toBe(2);
    // Other attributes are preserved.
    expect(next.system.attributes.agility).toBe(0);
    expect(next.updatedAt).toBeInstanceOf(Date);
  });

  it('update merges an arbitrary system patch onto the existing data', async () => {
    const onUpdate = vi.fn();
    const { result } = renderHook(() =>
      useDaggerheartSheetController({ document: makeDoc({ level: 1 }), onUpdate })
    );
    await act(async () => {});

    act(() => result.current.update({ level: 4, notes: 'leveled up' }));

    const next = lastDocument(onUpdate) as CharacterDocument<DaggerheartDataModel>;
    expect(next.system.level).toBe(4);
    expect(next.system.notes).toBe('leveled up');
  });

  it('onNameChange commits the renamed document without touching the system data', async () => {
    const onUpdate = vi.fn();
    const document = makeDoc({ level: 3 });
    const { result } = renderHook(() => useDaggerheartSheetController({ document, onUpdate }));
    await act(async () => {});

    act(() => result.current.onNameChange('Brave New Name'));

    expect(onUpdate).toHaveBeenCalledTimes(1);
    const next = lastDocument(onUpdate) as CharacterDocument<DaggerheartDataModel>;
    expect(next.name).toBe('Brave New Name');
    expect(next.system.level).toBe(3);
    expect(next.updatedAt).toBeInstanceOf(Date);
  });
});
