import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type {
  DaggerheartDomainCard,
  DaggerheartInventoryDefinition,
  DaggerheartWeapon,
} from '../../../types/daggerheart';
import type { DaggerheartDataModel } from '../../../systems/daggerheart/data-model';
import { createDefaultDaggerheartData } from '../../../systems/daggerheart/data-model';
import {
  INVENTORY_WEAPON_LIMIT,
  LOADOUT_LIMIT,
} from '../../../systems/daggerheart/daggerheartSheetConstants';
import { useDaggerheartMutationHandlers } from '../../../systems/daggerheart/useDaggerheartMutationHandlers';
import { getDaggerheartDerivedStats } from '../../../utils/daggerheartDerived';
import { normalizeDaggerheartCurrency } from '../../../utils/daggerheartInventory';

const GAMBESON_ID = 'daggerheart-armor-gambeson-armor-tier-1';

/** A weapon with only the fields the handlers read (category, burden). */
function makeWeapon(
  id: string,
  category: 'primary' | 'secondary',
  burden: number
): DaggerheartWeapon {
  return { id, name: id, category, burden } as DaggerheartWeapon;
}

function renderHandlers(
  data: DaggerheartDataModel,
  update = vi.fn(),
  options: {
    weaponOptions?: DaggerheartWeapon[];
    activePrimaryWeapon?: DaggerheartWeapon;
    activeSecondaryWeapon?: DaggerheartWeapon;
  } = {}
) {
  const view = renderHook(() =>
    useDaggerheartMutationHandlers({
      data,
      update,
      weaponLoadout: data.weapons,
      weaponOptions: options.weaponOptions ?? [],
      activePrimaryWeapon: options.activePrimaryWeapon,
      activeSecondaryWeapon: options.activeSecondaryWeapon,
      ownedDomainCardIds: makeOwnedCardIdSet(data.domainCards),
    })
  );
  return { result: view.result, update };
}

/** The single patch from the most recent update call. */
function latestPatch(update: ReturnType<typeof vi.fn>): Partial<DaggerheartDataModel> {
  return update.mock.calls.at(-1)![0] as Partial<DaggerheartDataModel>;
}

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

  it('adds a domain card to the loadout when there is room', () => {
    const { result, update } = renderHandlers(createDefaultDaggerheartData());

    act(() => result.current.addDomainCard(makeDomainCard('grace-inspire'), 'loadout'));

    expect(latestPatch(update).domainCards).toEqual([
      expect.objectContaining({
        id: 'grace-inspire',
        cardId: 'grace-inspire',
        location: 'loadout',
      }),
    ]);
  });

  it('refuses to add a domain card that is already owned', () => {
    const data: DaggerheartDataModel = {
      ...createDefaultDaggerheartData(),
      domainCards: [makeOwnedDomainCard(1, 'loadout')],
    };
    const { result, update } = renderHandlers(data);

    // makeOwnedDomainCard(1) has cardId 'card-1', which the owned-id set carries.
    act(() => result.current.addDomainCard(makeDomainCard('card-1'), 'vault'));

    expect(update).not.toHaveBeenCalled();
  });

  it('moves a loadout card to the vault', () => {
    const data: DaggerheartDataModel = {
      ...createDefaultDaggerheartData(),
      domainCards: [makeOwnedDomainCard(1, 'loadout')],
    };
    const { result, update } = renderHandlers(data);

    act(() => result.current.moveDomainCard('owned-card-1', 'vault'));

    expect(latestPatch(update).domainCards![0]).toMatchObject({
      id: 'owned-card-1',
      location: 'vault',
    });
  });

  it('updates a domain card entry in place and removes one by id', () => {
    const data: DaggerheartDataModel = {
      ...createDefaultDaggerheartData(),
      domainCards: [makeOwnedDomainCard(1), makeOwnedDomainCard(2)],
    };

    const edited = renderHandlers(data);
    act(() => edited.result.current.updateDomainCardEntry('owned-card-1', { recallCost: 3 }));
    expect(latestPatch(edited.update).domainCards![0]).toMatchObject({
      id: 'owned-card-1',
      recallCost: 3,
    });

    const removed = renderHandlers(data);
    act(() => removed.result.current.removeDomainCard('owned-card-1'));
    expect(latestPatch(removed.update).domainCards!.map((card) => card.id)).toEqual([
      'owned-card-2',
    ]);
  });

  it('equips a primary weapon and drops it from the stored list', () => {
    const data: DaggerheartDataModel = {
      ...createDefaultDaggerheartData(),
      weapons: { primaryId: '', secondaryId: '', inventoryIds: ['sword'] },
    };
    const { result, update } = renderHandlers(data, vi.fn(), {
      weaponOptions: [makeWeapon('sword', 'primary', 1)],
    });

    act(() => result.current.equipPrimaryWeapon('sword'));

    expect(latestPatch(update).weapons).toEqual({
      primaryId: 'sword',
      secondaryId: '',
      inventoryIds: [],
    });
  });

  it('refuses a primary weapon whose burden exceeds the two-hand limit', () => {
    const { result, update } = renderHandlers(createDefaultDaggerheartData(), vi.fn(), {
      weaponOptions: [makeWeapon('greatsword', 'primary', 2)],
      activeSecondaryWeapon: makeWeapon('dagger', 'secondary', 1),
    });

    act(() => result.current.equipPrimaryWeapon('greatsword'));

    expect(update).not.toHaveBeenCalled();
  });

  it('refuses to equip a secondary weapon into the primary slot', () => {
    const { result, update } = renderHandlers(createDefaultDaggerheartData(), vi.fn(), {
      weaponOptions: [makeWeapon('buckler', 'secondary', 1)],
    });

    act(() => result.current.equipPrimaryWeapon('buckler'));

    expect(update).not.toHaveBeenCalled();
  });

  it('equips a secondary weapon when combined burden fits', () => {
    const { result, update } = renderHandlers(createDefaultDaggerheartData(), vi.fn(), {
      weaponOptions: [makeWeapon('dagger', 'secondary', 1)],
      activePrimaryWeapon: makeWeapon('sword', 'primary', 1),
    });

    act(() => result.current.equipSecondaryWeapon('dagger'));

    expect(latestPatch(update).weapons).toMatchObject({ secondaryId: 'dagger' });
  });

  it('stores an equipped weapon, clearing it from its slot', () => {
    const data: DaggerheartDataModel = {
      ...createDefaultDaggerheartData(),
      weapons: { primaryId: 'sword', secondaryId: '', inventoryIds: [] },
    };
    const { result, update } = renderHandlers(data);

    act(() => result.current.storeWeapon('sword'));

    expect(latestPatch(update).weapons).toEqual({
      primaryId: '',
      secondaryId: '',
      inventoryIds: ['sword'],
    });
  });

  it('refuses to store a weapon once the stored-weapon limit is reached', () => {
    const full = Array.from({ length: INVENTORY_WEAPON_LIMIT }, (_, index) => `stored-${index}`);
    const data: DaggerheartDataModel = {
      ...createDefaultDaggerheartData(),
      weapons: { primaryId: '', secondaryId: '', inventoryIds: full },
    };
    const { result, update } = renderHandlers(data);

    act(() => result.current.storeWeapon('one-more'));

    expect(update).not.toHaveBeenCalled();
  });

  it('removes a stored weapon and clears the primary slot', () => {
    const data: DaggerheartDataModel = {
      ...createDefaultDaggerheartData(),
      weapons: { primaryId: 'sword', secondaryId: '', inventoryIds: ['axe'] },
    };
    const { result, update } = renderHandlers(data);

    act(() => result.current.removeStoredWeapon('axe'));
    expect(latestPatch(update).weapons).toMatchObject({ inventoryIds: [] });

    act(() => result.current.clearPrimaryWeapon());
    expect(latestPatch(update).weapons).toMatchObject({ primaryId: '' });
  });

  it('equips armor and fills the armor track to the derived maximum', () => {
    const data = createDefaultDaggerheartData();
    const expectedMax = getDaggerheartDerivedStats({
      ...data,
      armorId: GAMBESON_ID,
      weapons: data.weapons,
    }).armorMax;
    const { result, update } = renderHandlers(data);

    act(() => result.current.equipArmor(GAMBESON_ID));

    expect(latestPatch(update)).toEqual({
      armorId: GAMBESON_ID,
      armor: { current: expectedMax, max: expectedMax },
    });
    expect(expectedMax).toBe(3); // Gambeson baseArmorScore
  });

  it('clears armor and zeroes the armor track', () => {
    const data: DaggerheartDataModel = {
      ...createDefaultDaggerheartData(),
      armorId: GAMBESON_ID,
      armor: { current: 3, max: 4 },
    };
    const { result, update } = renderHandlers(data);

    act(() => result.current.clearArmor());

    expect(latestPatch(update)).toEqual({ armorId: '', armor: { current: 0, max: 0 } });
  });

  it('normalizes currency on update (10 handfuls roll into a bag)', () => {
    const { result, update } = renderHandlers(createDefaultDaggerheartData());

    act(() => result.current.updateCurrency({ handfuls: 12, bags: 0, chests: 0 }));

    expect(latestPatch(update).currency).toEqual(
      normalizeDaggerheartCurrency({ handfuls: 12, bags: 0, chests: 0 })
    );
    expect(latestPatch(update).currency).toEqual({ handfuls: 2, bags: 1, chests: 0 });
  });

  it('adds a custom blank inventory item', () => {
    const { result, update } = renderHandlers(createDefaultDaggerheartData());

    act(() => result.current.addCustomInventoryItem());

    const inventory = latestPatch(update).inventory!;
    expect(inventory).toHaveLength(1);
    expect(inventory[0]).toMatchObject({ name: '', quantity: 1 });
    expect(inventory[0].itemId).toMatch(/^custom-item:/);
  });

  it('adds a new inventory definition, then stacks quantity on a repeat add', () => {
    const definition = {
      id: 'test-loot',
      name: 'Test Loot',
      category: 'loot',
    } as DaggerheartInventoryDefinition;

    const fresh = renderHandlers(createDefaultDaggerheartData());
    act(() => fresh.result.current.addInventoryDefinition(definition));
    expect(latestPatch(fresh.update).inventory).toEqual([
      { itemId: 'test-loot', name: 'Test Loot', quantity: 1, description: '' },
    ]);

    const owned = renderHandlers({
      ...createDefaultDaggerheartData(),
      inventory: [{ itemId: 'test-loot', name: 'Test Loot', quantity: 2, description: '' }],
    });
    act(() => owned.result.current.addInventoryDefinition(definition));
    expect(latestPatch(owned.update).inventory).toEqual([
      { itemId: 'test-loot', name: 'Test Loot', quantity: 3, description: '' },
    ]);
  });

  it('updates an inventory entry by index and clamps the quantity to >= 1', () => {
    const data: DaggerheartDataModel = {
      ...createDefaultDaggerheartData(),
      inventory: [{ itemId: 'test-loot', name: 'Test Loot', quantity: 2, description: '' }],
    };
    const { result, update } = renderHandlers(data);

    act(() => result.current.updateInventoryEntry('test-loot', { quantity: 0 }, 0));

    expect(latestPatch(update).inventory![0].quantity).toBe(1);
  });

  it('removes an inventory entry by index', () => {
    const data: DaggerheartDataModel = {
      ...createDefaultDaggerheartData(),
      inventory: [
        { itemId: 'a', name: 'A', quantity: 1, description: '' },
        { itemId: 'b', name: 'B', quantity: 1, description: '' },
      ],
    };
    const { result, update } = renderHandlers(data);

    act(() => result.current.removeInventoryEntry(0));

    expect(latestPatch(update).inventory!.map((entry) => entry.itemId)).toEqual(['b']);
  });

  it('consumes an item: decrements above 1, removes at 1, ignores missing', () => {
    const stacked = renderHandlers({
      ...createDefaultDaggerheartData(),
      inventory: [{ itemId: 'potion', name: 'Potion', quantity: 3, description: '' }],
    });
    act(() => stacked.result.current.consumeInventoryItem('potion'));
    expect(latestPatch(stacked.update).inventory![0].quantity).toBe(2);

    const last = renderHandlers({
      ...createDefaultDaggerheartData(),
      inventory: [{ itemId: 'potion', name: 'Potion', quantity: 1, description: '' }],
    });
    act(() => last.result.current.consumeInventoryItem('potion'));
    expect(latestPatch(last.update).inventory).toEqual([]);

    const missing = renderHandlers(createDefaultDaggerheartData());
    act(() => missing.result.current.consumeInventoryItem('nope'));
    expect(missing.update).not.toHaveBeenCalled();
  });
});
