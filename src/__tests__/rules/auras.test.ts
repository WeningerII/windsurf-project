import { describe, it, expect } from 'vitest';

import {
  AUTO_HIT_SAVE_DC,
  monsterAuras,
  parseAuraFromDescription,
  runCombatRound,
  type RoundCombatant,
} from '../../rules';
import type { Monster } from '../../types/creatures/monsters';

/**
 * Recurring auras (e.g. a Balor's Fire Aura): a creature-anchored emanation that
 * pulses each round from the owner's current cell, hitting everyone in range
 * (RAW-indiscriminate), modeled through the shared area path.
 */

const BALOR_AURA =
  "At the start of each of the balor's turns, each creature within 5 feet of it takes 11 (2d10) fire damage, and flammable objects in the aura that aren't being worn or carried ignite.";

const balor = {
  id: 'balor',
  name: 'Balor',
  system: 'dnd-5e-2024',
  specialAbilities: [{ name: 'Fire Aura', description: BALOR_AURA }],
} as unknown as Monster;

describe('parseAuraFromDescription', () => {
  it('parses the Balor Fire Aura: start-of-turn, 5 ft, no save, 2d10 fire', () => {
    const aura = parseAuraFromDescription(BALOR_AURA);
    expect(aura).toBeDefined();
    expect(aura!.trigger).toBe('start-of-turn');
    expect(aura!.radiusFeet).toBe(5);
    expect(aura!.saveAbility).toBeUndefined(); // automatic — no save
    expect(aura!.damage).toEqual([{ count: 2, faces: 10, modifier: 0, type: 'fire' }]);
  });

  it('captures a save when the aura allows one (end-of-turn variant)', () => {
    const aura = parseAuraFromDescription(
      'At the end of each of its turns, each creature within 10 feet must make a DC 15 Constitution saving throw, taking 7 (2d6) necrotic damage on a failed save.'
    );
    expect(aura!.trigger).toBe('end-of-turn');
    expect(aura!.radiusFeet).toBe(10);
    expect(aura!.saveAbility).toBe('con');
    expect(aura!.saveDC).toBe(15);
  });

  it('ignores non-aura abilities', () => {
    expect(parseAuraFromDescription('The balor has advantage on saving throws.')).toBeUndefined();
  });
});

describe('monsterAuras', () => {
  it('normalizes the Fire Aura into a no-save emanation', () => {
    const auras = monsterAuras(balor);
    expect(auras).toHaveLength(1);
    const aura = auras[0];
    expect(aura.name).toBe('Fire Aura');
    expect(aura.trigger).toBe('start-of-turn');
    expect(aura.area).toEqual({ type: 'emanation', radius: 5 });
    expect(aura.saveDC).toBe(AUTO_HIT_SAVE_DC); // automatic
    expect(aura.halfOnSave).toBe(false);
    const dice = aura.damageEffects.filter((e) => e.operation === 'add-die');
    expect(dice).toHaveLength(2);
    expect(dice.every((e) => e.target === 'damage.fire' && e.value === 10)).toBe(true);
  });
});

describe('runCombatRound — an aura pulses each round', () => {
  function combatant(
    tokenId: string,
    x: number,
    y: number,
    faction: string,
    auras?: RoundCombatant['auras']
  ): RoundCombatant {
    return {
      tokenId,
      faction,
      position: { x, y },
      armorClass: 10,
      hp: { current: 40, max: 40 },
      attackEffects: [],
      damageEffects: [],
      reach: 1,
      auras,
      saveBonus: () => 0,
    };
  }

  it("the Balor's Fire Aura sears adjacent creatures on its turn, not distant ones", () => {
    const result = runCombatRound({
      order: [
        combatant('balor', 0, 0, 'monsters', monsterAuras(balor)),
        combatant('p1', 1, 0, 'party'), // within 5 ft (1 cell)
        combatant('p2', 1, 1, 'party'), // within 5 ft
        combatant('far', 6, 6, 'party'), // well outside
      ],
      seed: 'aura-round',
      round: 1,
    });

    const balorTurn = result.turns.find((t) => t.tokenId === 'balor')!;
    expect(balorTurn.auraIntents).toBeDefined();
    const pulse = balorTurn.auraIntents!.find((i) => i.type === 'apply-damage')!;
    const damaged = 'damages' in pulse ? pulse.damages : [];
    expect(damaged.map((d) => d.tokenId).sort()).toEqual(['p1', 'p2']); // not 'far'
    // No save → both take the same shared 2d10 (between 2 and 20).
    expect(damaged[0].amount).toBe(damaged[1].amount);
    expect(damaged[0].amount).toBeGreaterThanOrEqual(2);
    expect(damaged[0].amount).toBeLessThanOrEqual(20);
  });

  it('is deterministic for a fixed (order, seed)', () => {
    const run = () =>
      JSON.stringify(
        runCombatRound({
          order: [
            combatant('balor', 0, 0, 'monsters', monsterAuras(balor)),
            combatant('p1', 1, 0, 'party'),
          ],
          seed: 'fixed',
          round: 2,
        }).intents
      );
    expect(run()).toBe(run());
  });
});
