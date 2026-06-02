import { describe, it, expect } from 'vitest';

import {
  adjustTypedDamage,
  makeEffectId,
  resolveAttack,
  runCombatRound,
  type EffectInstance,
  type RoundCombatant,
} from '../../rules';
import type { SeededRng } from '../../scene/seededRng';

/**
 * Damage resistance / immunity / vulnerability — applied per type, last (after
 * the crit rule). Immunity zeroes the type, resistance halves it (round down),
 * vulnerability doubles it. A mixed-type hit adjusts each type independently.
 */

function attack(bonus: number): EffectInstance {
  return {
    id: makeEffectId('dnd-5e-2014', 'attack', 'base', bonus),
    systemId: 'dnd-5e-2014',
    target: 'attack',
    operation: 'add',
    value: bonus,
    stackPolicy: 'sum',
    source: { kind: 'system', label: 'attack' },
    label: 'attack',
  };
}

/** A typed damage die + flat bonus on `damage.<type>`. */
function typedDamage(type: string, sides: number, flat: number): EffectInstance[] {
  const target = `damage.${type}`;
  return [
    {
      id: makeEffectId('dnd-5e-2014', target, 'die', sides),
      systemId: 'dnd-5e-2014',
      target,
      operation: 'add-die',
      value: sides,
      stackPolicy: 'sum',
      source: { kind: 'item', label: 'weapon' },
      label: `1d${sides} ${type}`,
    },
    {
      id: makeEffectId('dnd-5e-2014', target, 'flat', flat),
      systemId: 'dnd-5e-2014',
      target,
      operation: 'add',
      value: flat,
      stackPolicy: 'sum',
      source: { kind: 'system', label: 'bonus' },
      label: `+${flat}`,
    },
  ];
}

function scriptedRng(faces: number[]): SeededRng {
  let i = 0;
  return {
    next: () => 0,
    nextInt: () => 0,
    rollDie: () => faces[Math.min(i++, faces.length - 1)],
  };
}

describe('adjustTypedDamage', () => {
  it('immunity zeroes, resistance halves (round down), vulnerability doubles', () => {
    expect(adjustTypedDamage('fire', 11, { immune: ['fire'] })).toBe(0);
    expect(adjustTypedDamage('fire', 11, { resistant: ['fire'] })).toBe(5);
    expect(adjustTypedDamage('fire', 11, { vulnerable: ['fire'] })).toBe(22);
  });

  it('vulnerability and resistance to the same type net out', () => {
    expect(adjustTypedDamage('cold', 10, { vulnerable: ['cold'], resistant: ['cold'] })).toBe(10);
  });

  it('matches case-insensitively and ignores untyped or unlisted damage', () => {
    expect(adjustTypedDamage('Fire', 10, { resistant: ['fire'] })).toBe(5);
    expect(adjustTypedDamage('', 10, { immune: ['fire'] })).toBe(10);
    expect(adjustTypedDamage('slashing', 10, { resistant: ['fire'] })).toBe(10);
  });
});

describe('resolveAttack — target damage defenses', () => {
  it('halves a resisted type and zeroes an immune one', () => {
    const resisted = resolveAttack({
      attackEffects: [attack(20)],
      damageEffects: typedDamage('fire', 6, 4), // 1d6+4 → 10
      targetValue: 1,
      targetDefenses: { resistant: ['fire'] },
      rng: scriptedRng([10, 6]),
    });
    expect(resisted.isHit).toBe(true);
    expect(resisted.damage).toBe(5);
    expect(resisted.damageByType?.['damage.fire']).toBe(5);

    const immune = resolveAttack({
      attackEffects: [attack(20)],
      damageEffects: typedDamage('fire', 6, 4),
      targetValue: 1,
      targetDefenses: { immune: ['fire'] },
      rng: scriptedRng([10, 6]),
    });
    expect(immune.isHit).toBe(true); // it connects…
    expect(immune.damage).toBe(0); // …but deals nothing
  });

  it('applies resistance AFTER the crit (5e: double dice, then halve)', () => {
    const res = resolveAttack({
      attackEffects: [attack(20)],
      damageEffects: typedDamage('fire', 6, 4),
      targetValue: 1,
      critModel: 'd20-threshold',
      targetDefenses: { resistant: ['fire'] },
      rng: scriptedRng([20, 6]), // nat 20 crit: (6 doubled) + 4 = 16, then halved
    });
    expect(res.isCriticalHit).toBe(true);
    expect(res.damage).toBe(8);
  });

  it('adjusts each type independently on a mixed-type hit', () => {
    const res = resolveAttack({
      attackEffects: [attack(20)],
      damageEffects: [...typedDamage('slashing', 8, 0), ...typedDamage('fire', 6, 0)],
      targetValue: 1,
      targetDefenses: { resistant: ['fire'] }, // slashing full, fire halved
      rng: scriptedRng([10, 8, 6]),
    });
    expect(res.damageByType?.['damage.slashing']).toBe(8);
    expect(res.damageByType?.['damage.fire']).toBe(3); // floor(6/2)
    expect(res.damage).toBe(11);
  });
});

describe('the auto-round applies a target’s resistance', () => {
  const dmg = typedDamage('slashing', 6, 4); // 1d6+4 slashing
  function order(defenses?: RoundCombatant['damageDefenses']): RoundCombatant[] {
    return [
      {
        tokenId: 'hero',
        faction: 'party',
        position: { x: 0, y: 0 },
        armorClass: 10,
        hp: { current: 30, max: 30 },
        attackEffects: [attack(20)],
        damageEffects: dmg,
        reach: 1,
      },
      {
        tokenId: 'foe',
        faction: 'monsters',
        position: { x: 1, y: 0 },
        armorClass: 1,
        hp: { current: 100, max: 100 },
        attackEffects: [attack(0)],
        damageEffects: dmg,
        reach: 1,
        damageDefenses: defenses,
      },
    ];
  }

  it('a slashing-resistant foe takes half of what an undefended one would', () => {
    const seed = 'resist';
    const plain = runCombatRound({ order: order(), seed, round: 1, systemId: 'dnd-5e-2014' });
    const resistant = runCombatRound({
      order: order({ resistant: ['slashing'] }),
      seed,
      round: 1,
      systemId: 'dnd-5e-2014',
    });
    const dmgTo = (r: ReturnType<typeof runCombatRound>): number => {
      const t = r.turns.find((x) => x.tokenId === 'hero')!;
      return t.intent?.type === 'apply-damage' ? t.intent.damages[0].amount : 0;
    };
    const full = dmgTo(plain);
    expect(full).toBeGreaterThan(0);
    expect(dmgTo(resistant)).toBe(Math.floor(full / 2));
  });
});
