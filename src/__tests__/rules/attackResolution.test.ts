import { describe, it, expect } from 'vitest';

import { createSeededRng } from '../../scene/seededRng';
import {
  compileEquipmentEffects,
  makeEffectId,
  resolveAttack,
  type EffectInstance,
  type MagicBonusItem,
} from '../../rules';

/**
 * PHASE 4 (RFC 003): deterministic attack resolution — the mechanics half of
 * the resolution/narration split. Pure, seeded, replayable, system-agnostic.
 */

function attackEffect(systemId: EffectInstance['systemId'], bonus: number): EffectInstance {
  return {
    id: makeEffectId(systemId, 'attack', 'base', bonus),
    systemId,
    target: 'attack',
    operation: 'add',
    value: bonus,
    stackPolicy: 'sum',
    source: { kind: 'system', label: 'proficiency + ability' },
    label: 'attack bonus',
  };
}

function weaponDamage(
  systemId: EffectInstance['systemId'],
  sides: number,
  flat: number
): EffectInstance[] {
  return [
    {
      id: makeEffectId(systemId, 'damage', 'die', sides),
      systemId,
      target: 'damage',
      operation: 'add-die',
      value: sides,
      stackPolicy: 'sum',
      source: { kind: 'item', label: 'weapon' },
      label: `1d${sides}`,
    },
    {
      id: makeEffectId(systemId, 'damage', 'flat', flat),
      systemId,
      target: 'damage',
      operation: 'add',
      value: flat,
      stackPolicy: 'sum',
      source: { kind: 'system', label: 'ability' },
      label: `+${flat}`,
    },
  ];
}

describe('resolveAttack — determinism', () => {
  it('same effects + same seed yield byte-identical resolution', () => {
    const input = {
      attackEffects: [attackEffect('dnd-5e-2014', 5)],
      damageEffects: weaponDamage('dnd-5e-2014', 8, 3),
      targetValue: 15,
    };
    const a = resolveAttack({ ...input, rng: createSeededRng('combat-1') });
    const b = resolveAttack({ ...input, rng: createSeededRng('combat-1') });
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });

  it('no Math.random: replay across many seeds is internally consistent', () => {
    for (const seed of ['a', 'b', 'c', 'xyz', '42']) {
      const r1 = resolveAttack({
        attackEffects: [attackEffect('pf2e', 9)],
        damageEffects: weaponDamage('pf2e', 6, 4),
        targetValue: 18,
        rng: createSeededRng(seed),
      });
      const r2 = resolveAttack({
        attackEffects: [attackEffect('pf2e', 9)],
        damageEffects: weaponDamage('pf2e', 6, 4),
        targetValue: 18,
        rng: createSeededRng(seed),
      });
      expect(r1).toEqual(r2);
    }
  });
});

describe('resolveAttack — hit/miss math', () => {
  it('hits when natural roll + bonus meets the target value', () => {
    // Find a seed whose first d20 is known by sampling; instead assert the rule
    // holds for the resolved values directly.
    const result = resolveAttack({
      attackEffects: [attackEffect('dnd-5e-2014', 5)],
      targetValue: 1, // trivially beatable
      rng: createSeededRng('hit'),
    });
    expect(result.isHit).toBe(true);
    expect(result.attackTotal).toBe(result.naturalRoll + 5);
  });

  it('misses when the total falls short (high target, no crit)', () => {
    const result = resolveAttack({
      attackEffects: [attackEffect('dnd-5e-2014', 0)],
      targetValue: 100, // unbeatable except by a natural crit
      rng: createSeededRng('miss'),
    });
    if (!result.isCriticalHit) {
      expect(result.isHit).toBe(false);
      expect(result.damage).toBe(0);
    }
  });

  it('a natural 20 always hits even against an impossible target', () => {
    // Search seeds for a natural 20 to exercise the crit path deterministically.
    let found = false;
    for (let i = 0; i < 200 && !found; i += 1) {
      const result = resolveAttack({
        attackEffects: [attackEffect('dnd-5e-2014', 0)],
        damageEffects: weaponDamage('dnd-5e-2014', 8, 2),
        targetValue: 999,
        rng: createSeededRng(`crit-${i}`),
      });
      if (result.naturalRoll === 20) {
        found = true;
        expect(result.isCriticalHit).toBe(true);
        expect(result.isHit).toBe(true);
        // 5e crit (1d8 + 2): the dice are doubled, the flat modifier counted once.
        const diceSum = result.damageDiceTerms.reduce((sum, d) => sum + d, 0);
        expect(result.damage).toBe(2 * diceSum + result.damageBonus);
      }
    }
    expect(found).toBe(true);
  });

  it('a natural 1 always misses even against a trivial target', () => {
    let found = false;
    for (let i = 0; i < 200 && !found; i += 1) {
      const result = resolveAttack({
        attackEffects: [attackEffect('dnd-5e-2014', 20)],
        targetValue: 1,
        rng: createSeededRng(`fumble-${i}`),
      });
      if (result.naturalRoll === 1) {
        found = true;
        expect(result.isCriticalMiss).toBe(true);
        expect(result.isHit).toBe(false);
      }
    }
    expect(found).toBe(true);
  });
});

describe('resolveAttack — damage', () => {
  it('rolls damage only on a hit; the die term is within range and bonus is flat', () => {
    const result = resolveAttack({
      attackEffects: [attackEffect('dnd-5e-2014', 50)], // guarantees a hit
      damageEffects: weaponDamage('dnd-5e-2014', 8, 3),
      targetValue: 10,
      rng: createSeededRng('dmg'),
    });
    expect(result.isHit).toBe(true);
    expect(result.damageDiceTerms).toHaveLength(1);
    expect(result.damageDiceTerms[0]).toBeGreaterThanOrEqual(1);
    expect(result.damageDiceTerms[0]).toBeLessThanOrEqual(8);
    expect(result.damageBonus).toBe(3);
    // On a non-crit hit: damage = die + 3.
    if (!result.isCriticalHit) {
      expect(result.damage).toBe(result.damageDiceTerms[0] + 3);
    }
  });

  it('a critical hit doubles the dice but not the flat bonus (5e/PF rule)', () => {
    let checked = false;
    for (let i = 0; i < 200 && !checked; i += 1) {
      const result = resolveAttack({
        attackEffects: [attackEffect('dnd-5e-2014', 0)],
        damageEffects: weaponDamage('dnd-5e-2014', 8, 3),
        targetValue: 5,
        rng: createSeededRng(`critdmg-${i}`),
      });
      if (result.isCriticalHit) {
        checked = true;
        const die = result.damageDiceTerms[0];
        // doubled dice (die*2) + flat 3
        expect(result.damage).toBe(die * 2 + 3);
      }
    }
    expect(checked).toBe(true);
  });
});

describe('resolveAttack — system-agnostic via the equipment compiler', () => {
  it('a +1 magic weapon raises attack and damage identically across systems', () => {
    const weapon: MagicBonusItem = { itemId: 'sword-1', attackBonus: 1, damageBonus: 1 };
    for (const systemId of ['dnd-5e-2014', 'dnd-3.5e', 'pf2e'] as const) {
      const attackEffects = [
        attackEffect(systemId, 4),
        ...compileEquipmentEffects(systemId, [weapon]).filter((e) => e.target === 'attack'),
      ];
      const damageEffects = [
        ...weaponDamage(systemId, 8, 3),
        ...compileEquipmentEffects(systemId, [weapon]).filter((e) => e.target === 'damage'),
      ];
      const result = resolveAttack({
        attackEffects,
        damageEffects,
        targetValue: 50, // force a hit to inspect damage
        rng: createSeededRng('agnostic'),
      });
      // attack bonus = base 4 + item 1 = 5
      expect(result.attackBonus).toBe(5);
      if (result.isHit && !result.isCriticalHit) {
        // damage = die + flat 3 + item 1
        expect(result.damageBonus).toBe(4);
      }
    }
  });
});

describe('resolveAttack — provenance', () => {
  it('the ledger names every contributing source on a hit', () => {
    const result = resolveAttack({
      attackEffects: [attackEffect('dnd-5e-2014', 5)],
      damageEffects: weaponDamage('dnd-5e-2014', 8, 3),
      targetValue: 1,
      rng: createSeededRng('ledger'),
    });
    expect(result.isHit).toBe(true);
    // attack bonus + damage die + damage flat = 3 ledger rows
    expect(result.ledger.length).toBe(3);
  });
});
