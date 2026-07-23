import { describe, expect, it } from 'vitest';
import { toEquippedPf2eWeapon } from '../../systems/pf2e/usePf2eMutationHandlers';
import { buildCharacterCombatant } from '../../rules';
import type { CharacterDocument, SystemDataModel } from '../../types/core/document';

/**
 * Item 2 (GAPS §2 L3): the PF2e equip flow now populates weaponDamage from the
 * PF2e catalog's own `Weapon.damage` DiceRoll, so a real saved PF2e character
 * carries real weapon dice into scene combat.
 */
describe('toEquippedPf2eWeapon — catalog DiceRoll → weaponDamage', () => {
  it('parses the PF2e canonical DiceRoll damage into numeric {count, die}', () => {
    const entry = toEquippedPf2eWeapon({
      id: 'longsword',
      name: 'Longsword',
      bulk: 1,
      damage: { count: 1, die: 'd8', notation: '1d8' } as { count: number; die: string },
    });
    expect(entry).toEqual({
      itemId: 'longsword',
      name: 'Longsword',
      bulk: 1,
      equipped: true,
      slot: 'mainHand',
      weaponDamage: { count: 1, die: 8 },
    });
  });

  it('defaults bulk to 0 and returns null for unparseable damage', () => {
    expect(
      toEquippedPf2eWeapon({ id: 'dagger', name: 'Dagger', damage: { count: 1, die: 'd4' } })
    ).toEqual({
      itemId: 'dagger',
      name: 'Dagger',
      bulk: 0,
      equipped: true,
      slot: 'mainHand',
      weaponDamage: { count: 1, die: 4 },
    });
    expect(toEquippedPf2eWeapon({ id: 'x', name: 'X' })).toBeNull();
  });
});

describe('an equipped PF2e weapon carries its dice into scene combat', () => {
  function pf2Hero(equipment: unknown[]): CharacterDocument<SystemDataModel> {
    return {
      id: 'pf2-hero',
      name: 'PF2e Hero',
      systemId: 'pf2e',
      system: {
        level: 1,
        baseAttributes: { str: 16, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
        armorClass: 16,
        hitPoints: { current: 10, max: 10, temp: 0 },
        equipment,
        feats: [],
        features: [],
      } as unknown as SystemDataModel,
      createdAt: new Date('2026-07-21T00:00:00.000Z'),
      updatedAt: new Date('2026-07-21T00:00:00.000Z'),
    };
  }

  it('rolls the equipped longsword die (d8) instead of the d6 placeholder', () => {
    const longsword = toEquippedPf2eWeapon({
      id: 'longsword',
      name: 'Longsword',
      bulk: 1,
      damage: { count: 1, die: 'd8' },
    });
    const result = buildCharacterCombatant(pf2Hero([longsword]), { position: { x: 0, y: 0 } });
    expect(result.supported).toBe(true);
    if (!result.supported) return;
    const die = result.combatant.damageEffects.find((e) => e.operation === 'add-die')?.value;
    expect(die).toBe(8);
  });
});
