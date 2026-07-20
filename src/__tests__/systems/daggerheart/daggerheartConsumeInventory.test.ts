import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { DaggerheartDataModel } from '../../../systems/daggerheart/data-model';
import { createDefaultDaggerheartData } from '../../../systems/daggerheart/data-model';
import { useDaggerheartMutationHandlers } from '../../../systems/daggerheart/useDaggerheartMutationHandlers';

function makeData(inventory: DaggerheartDataModel['inventory']): DaggerheartDataModel {
  return { ...createDefaultDaggerheartData(), inventory };
}

function renderHandlers(data: DaggerheartDataModel, update: () => void) {
  return renderHook(() =>
    useDaggerheartMutationHandlers({
      data,
      update,
      weaponLoadout: data.weapons,
      weaponOptions: [],
      ownedDomainCardIds: new Set(),
    })
  );
}

describe('useDaggerheartMutationHandlers.consumeInventoryItem (consume verb)', () => {
  it('decrements a multi-unit stack by one', () => {
    const update = vi.fn();
    const data = makeData([
      { itemId: 'potion', name: 'Minor Potion', quantity: 3, description: '' },
    ]);

    const { result } = renderHandlers(data, update);
    act(() => result.current.consumeInventoryItem('potion'));

    expect(update).toHaveBeenCalledTimes(1);
    expect(update).toHaveBeenCalledWith({
      inventory: [{ itemId: 'potion', name: 'Minor Potion', quantity: 2, description: '' }],
    });
  });

  it('removes the entry when the last unit is consumed (depleted signal)', () => {
    const update = vi.fn();
    const data = makeData([
      { itemId: 'torch', name: 'Torch', quantity: 1, description: '' },
      { itemId: 'rope', name: 'Rope', quantity: 5, description: '' },
    ]);

    const { result } = renderHandlers(data, update);
    act(() => result.current.consumeInventoryItem('torch'));

    // The emptied stack is dropped; the untouched stack survives (independence).
    expect(update).toHaveBeenCalledWith({
      inventory: [{ itemId: 'rope', name: 'Rope', quantity: 5, description: '' }],
    });
  });

  it('is a no-op for an unknown item', () => {
    const update = vi.fn();
    const data = makeData([{ itemId: 'potion', name: 'Potion', quantity: 2, description: '' }]);

    const { result } = renderHandlers(data, update);
    act(() => result.current.consumeInventoryItem('missing'));

    expect(update).not.toHaveBeenCalled();
  });
});
