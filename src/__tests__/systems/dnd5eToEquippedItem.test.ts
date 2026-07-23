import { describe, expect, it } from 'vitest';
import { toEquippedItem } from '../../systems/dnd5e/shared/dnd5eSheetShared';
import { buildCharacterCombatant } from '../../rules';
import type { CharacterDocument, SystemDataModel } from '../../types/core/document';
import type { Armor, Weapon } from '../../types/equipment/items';

function makeWeapon(overrides: Partial<Weapon> = {}): Weapon {
  return {
    id: 'longsword',
    name: 'Longsword',
    system: 'dnd-5e-2014',
    type: 'weapon',
    rarity: 'common',
    weight: 3,
    cost: { amount: 15, currency: 'gp' },
    description: '',
    requiresAttunement: false,
    weaponType: 'martial',
    category: 'melee',
    damage: { count: 1, die: 'd8', notation: '1d8' },
    damageType: 'slashing',
    properties: [],
    versatileDamage: { count: 1, die: 'd10', notation: '1d10' },
    ...overrides,
  };
}

function makeArmor(): Armor {
  return {
    id: 'chain-mail',
    name: 'Chain Mail',
    system: 'dnd-5e-2014',
    type: 'armor',
    rarity: 'common',
    weight: 55,
    cost: { amount: 75, currency: 'gp' },
    description: '',
    requiresAttunement: false,
    armorType: 'heavy',
    armorClass: 16,
    stealthDisadvantage: true,
  };
}

describe('toEquippedItem weapon dice population', () => {
  it('parses a weapon catalog DiceRoll into the numeric {count, die} the combatant reads', () => {
    const equipped = toEquippedItem(makeWeapon());
    // die 'd8' (string) → 8 (numeric faces); base one-handed damage, not versatile.
    expect(equipped?.weaponDamage).toEqual({ count: 1, die: 8 });
    expect(equipped?.slot).toBe('mainHand');
  });

  it('carries the count for multi-die weapons', () => {
    const equipped = toEquippedItem(
      makeWeapon({ id: 'greatsword', damage: { count: 2, die: 'd6', notation: '2d6' } })
    );
    expect(equipped?.weaponDamage).toEqual({ count: 2, die: 6 });
  });

  it('leaves weaponDamage unset for non-weapons', () => {
    expect(toEquippedItem(makeArmor())?.weaponDamage).toBeUndefined();
  });

  it('leaves weaponDamage unset when the die string is unparseable', () => {
    const equipped = toEquippedItem(
      makeWeapon({
        damage: { count: 1, die: 'x', notation: '1dx' } as unknown as Weapon['damage'],
      })
    );
    expect(equipped?.weaponDamage).toBeUndefined();
  });
});

describe('toEquippedItem versatile-die population', () => {
  it('parses the catalog versatileDamage into the numeric weaponVersatileDie the combatant reads', () => {
    const equipped = toEquippedItem(makeWeapon({ properties: ['versatile'] }));
    // versatileDamage 'd10' (string) → 10 (numeric faces).
    expect(equipped?.weaponVersatileDie).toBe(10);
  });

  it('carries the catalog weapon properties so the combatant can gate versatile behavior', () => {
    const equipped = toEquippedItem(makeWeapon({ properties: ['versatile'] }));
    expect(equipped?.weaponProperties).toEqual(['versatile']);
  });

  it('leaves weaponVersatileDie unset for a non-versatile weapon', () => {
    const equipped = toEquippedItem(
      makeWeapon({ id: 'greatclub', versatileDamage: undefined, properties: [] })
    );
    expect(equipped?.weaponVersatileDie).toBeUndefined();
    expect(equipped?.weaponProperties).toBeUndefined();
  });
});

describe('equipped versatile weapon carries the two-handed die into scene combat', () => {
  function heroWith(equipment: unknown[]): CharacterDocument<SystemDataModel> {
    return {
      id: 'pc-versatile',
      name: 'Versatile Hero',
      systemId: 'dnd-5e-2014',
      system: {
        level: 1,
        baseAttributes: { str: 16, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
        armorClass: 12,
        hitPoints: { current: 10, max: 10, temp: 0 },
        equipment,
        feats: [],
        features: [],
      } as unknown as SystemDataModel,
      createdAt: new Date('2026-07-21T00:00:00.000Z'),
      updatedAt: new Date('2026-07-21T00:00:00.000Z'),
    };
  }

  function weaponDie(equipment: unknown[]) {
    const result = buildCharacterCombatant(heroWith(equipment), { position: { x: 0, y: 0 } });
    if (!result.supported) return undefined;
    return result.combatant.damageEffects.find((effect) => effect.operation === 'add-die')?.value;
  }

  const longsword = toEquippedItem(makeWeapon({ properties: ['versatile'] }));

  it('rolls the larger (versatile) die when wielded two-handed (empty off-hand)', () => {
    expect(weaponDie([longsword])).toBe(10); // 1d10 two-handed via the equipped catalog weapon
  });

  it('rolls the base die when a shield occupies the off-hand', () => {
    expect(
      weaponDie([longsword, { itemId: 'shield', slot: 'offHand', attuned: false, shieldBonus: 2 }])
    ).toBe(8); // 1d8 one-handed
  });
});
