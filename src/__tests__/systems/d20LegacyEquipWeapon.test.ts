import { describe, expect, it } from 'vitest';
import { toEquippedD20LegacyWeapon } from '../../systems/d20-legacy/useD20LegacyMutationHandlers';
import { buildCharacterCombatant } from '../../rules';
import type { CharacterDocument, SystemDataModel } from '../../types/core/document';

/**
 * Item 2 (GAPS §2 L3): the d20-legacy equip flow now populates weaponDamage from
 * its OWN catalog shapes — 3.5e's notation-string `damage` ('1d8') and PF1e's
 * canonical DiceRoll — so a real saved 3.5e/PF1e character carries real weapon
 * dice into scene combat, without forcing the 5e DiceRoll shape.
 */
describe('toEquippedD20LegacyWeapon — catalog-shape → weaponDamage', () => {
  it('parses a 3.5e notation-string damage ("1d8") into numeric {count, die}', () => {
    const entry = toEquippedD20LegacyWeapon({ id: 'longsword', name: 'Longsword', damage: '1d8' });
    expect(entry).toEqual({
      itemId: 'longsword',
      name: 'Longsword',
      equipped: true,
      slot: 'mainHand',
      weaponDamage: { count: 1, die: 8 },
    });
  });

  it('carries the count for a multi-die string ("2d6" greatsword)', () => {
    const entry = toEquippedD20LegacyWeapon({
      id: 'greatsword',
      name: 'Greatsword',
      damage: '2d6',
    });
    expect(entry?.weaponDamage).toEqual({ count: 2, die: 6 });
  });

  it('parses PF1e canonical DiceRoll damage ({ count, die: "d10" })', () => {
    const entry = toEquippedD20LegacyWeapon({
      id: 'greataxe',
      name: 'Greataxe',
      damage: { count: 1, die: 'd10' },
    });
    expect(entry?.weaponDamage).toEqual({ count: 1, die: 10 });
  });

  it('returns null for a weapon with missing or unparseable damage', () => {
    expect(toEquippedD20LegacyWeapon({ id: 'x', name: 'X' })).toBeNull();
    expect(toEquippedD20LegacyWeapon({ id: 'x', name: 'X', damage: 'bare hands' })).toBeNull();
  });
});

describe('an equipped d20-legacy weapon carries its dice into scene combat', () => {
  function pf1Hero(equipment: unknown[]): CharacterDocument<SystemDataModel> {
    return {
      id: 'pf1-hero',
      name: 'Legacy Hero',
      systemId: 'pf1e',
      system: {
        level: 1,
        baseAttributes: { str: 16, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
        baseAttackBonus: 1,
        armorClass: { total: 12, touch: 10, flatFooted: 12 },
        hitPoints: { current: 10, max: 10, temp: 0 },
        equipment,
        feats: [],
        features: [],
      } as unknown as SystemDataModel,
      createdAt: new Date('2026-07-21T00:00:00.000Z'),
      updatedAt: new Date('2026-07-21T00:00:00.000Z'),
    };
  }

  it('rolls the equipped greataxe die (d12) instead of the d6 placeholder', () => {
    const greataxe = toEquippedD20LegacyWeapon({
      id: 'greataxe',
      name: 'Greataxe',
      damage: '1d12',
    });
    const result = buildCharacterCombatant(pf1Hero([greataxe]), { position: { x: 0, y: 0 } });
    expect(result.supported).toBe(true);
    if (!result.supported) return;
    const die = result.combatant.damageEffects.find((e) => e.operation === 'add-die')?.value;
    expect(die).toBe(12);
  });
});
