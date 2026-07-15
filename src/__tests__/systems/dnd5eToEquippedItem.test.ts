import { describe, expect, it } from 'vitest';
import { toEquippedItem } from '../../systems/dnd5e/shared/dnd5eSheetShared';
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
