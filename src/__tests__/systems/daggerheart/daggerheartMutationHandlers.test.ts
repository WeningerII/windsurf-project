import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { DaggerheartDomainCard } from '../../../types/daggerheart';
import type { DaggerheartDataModel } from '../../../systems/daggerheart/data-model';
import { createDefaultDaggerheartData } from '../../../systems/daggerheart/data-model';
import { LOADOUT_LIMIT } from '../../../systems/daggerheart/daggerheartSheetConstants';
import { useDaggerheartMutationHandlers } from '../../../systems/daggerheart/useDaggerheartMutationHandlers';

function makeOwnedDomainCard(
  index: number,
  location: 'loadout' | 'vault' = 'loadout'
): DaggerheartDataModel['domainCards'][number] {
  return {
    id: `owned-card-${index}`,
    cardId: `card-${index}`,
    name: `Owned Card ${index}`,
    domain: 'grace',
    level: 1,
    type: 'ability',
    recallCost: 1,
    location,
    description: `Owned card ${index}`,
  };
}

function makeDomainCard(id: string): DaggerheartDomainCard {
  return {
    id,
    name: `Card ${id}`,
    system: 'daggerheart',
    source: 'SRD',
    version: '1.0',
    lastUpdated: '2026-03-16',
    sourceBook: {
      name: 'Daggerheart SRD',
      url: 'https://www.daggerheart.com',
    },
    domain: 'grace',
    level: 1,
    type: 'ability',
    recallCost: 1,
    description: `Card ${id}`,
  };
}

function makeOwnedCardIdSet(domainCards: DaggerheartDataModel['domainCards']) {
  return new Set(domainCards.map((entry) => entry.cardId ?? entry.id));
}

describe('useDaggerheartMutationHandlers', () => {
  it('blocks adding a card to the loadout when the loadout is already full', () => {
    const update = vi.fn();
    const data: DaggerheartDataModel = {
      ...createDefaultDaggerheartData(),
      domainCards: Array.from({ length: LOADOUT_LIMIT }, (_, index) =>
        makeOwnedDomainCard(index + 1, 'loadout')
      ),
    };

    const { result } = renderHook(() =>
      useDaggerheartMutationHandlers({
        data,
        update,
        weaponLoadout: data.weapons,
        weaponOptions: [],
        ownedDomainCardIds: makeOwnedCardIdSet(data.domainCards),
      })
    );

    act(() => {
      result.current.addDomainCard(makeDomainCard('new-loadout-card'), 'loadout');
    });

    expect(update).not.toHaveBeenCalled();
  });

  it('blocks moving a vaulted card into the loadout when the loadout is already full', () => {
    const update = vi.fn();
    const data: DaggerheartDataModel = {
      ...createDefaultDaggerheartData(),
      domainCards: [
        ...Array.from({ length: LOADOUT_LIMIT }, (_, index) => makeOwnedDomainCard(index + 1)),
        makeOwnedDomainCard(99, 'vault'),
      ],
    };

    const { result } = renderHook(() =>
      useDaggerheartMutationHandlers({
        data,
        update,
        weaponLoadout: data.weapons,
        weaponOptions: [],
        ownedDomainCardIds: makeOwnedCardIdSet(data.domainCards),
      })
    );

    act(() => {
      result.current.moveDomainCard('owned-card-99', 'loadout');
    });

    expect(update).not.toHaveBeenCalled();
  });

  it('dispatches each long-rest downtime move as its own pool patch', () => {
    const update = vi.fn();
    const data: DaggerheartDataModel = {
      ...createDefaultDaggerheartData(),
      hitPoints: { current: 1, max: 6 },
      stress: { current: 5, max: 6 },
      armor: { current: 2, max: 3 },
      hope: 2,
    };

    const { result } = renderHook(() =>
      useDaggerheartMutationHandlers({
        data,
        update,
        weaponLoadout: data.weapons,
        weaponOptions: [],
        ownedDomainCardIds: makeOwnedCardIdSet(data.domainCards),
      })
    );

    act(() => result.current.restTendToAllWounds());
    expect(update).toHaveBeenLastCalledWith({ hitPoints: { current: 6, max: 6 } });
    act(() => result.current.restClearAllStress());
    expect(update).toHaveBeenLastCalledWith({ stress: { current: 0, max: 6 } });
    act(() => result.current.restRepairAllArmor());
    expect(update).toHaveBeenLastCalledWith({ armor: { current: 0, max: 3 } });
    act(() => result.current.restPrepare());
    expect(update).toHaveBeenLastCalledWith({ hope: 3 });
  });

  it('still allows adding cards to the vault when the loadout is already full', () => {
    const update = vi.fn();
    const data: DaggerheartDataModel = {
      ...createDefaultDaggerheartData(),
      domainCards: Array.from({ length: LOADOUT_LIMIT }, (_, index) =>
        makeOwnedDomainCard(index + 1, 'loadout')
      ),
    };

    const { result } = renderHook(() =>
      useDaggerheartMutationHandlers({
        data,
        update,
        weaponLoadout: data.weapons,
        weaponOptions: [],
        ownedDomainCardIds: makeOwnedCardIdSet(data.domainCards),
      })
    );

    act(() => {
      result.current.addDomainCard(makeDomainCard('new-vault-card'), 'vault');
    });

    expect(update).toHaveBeenCalledTimes(1);
    expect(update).toHaveBeenCalledWith({
      domainCards: [
        ...data.domainCards,
        expect.objectContaining({
          id: 'new-vault-card',
          cardId: 'new-vault-card',
          location: 'vault',
        }),
      ],
    });
  });
});
