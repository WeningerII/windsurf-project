import { describe, it, expect } from 'vitest';

import { makeEffectId, resolveAttack, type EffectInstance } from '../../rules';
import type { SeededRng } from '../../scene/seededRng';

/**
 * 5e advantage/disadvantage as an attack-time override: the resolver rolls two
 * d20s and keeps the higher (advantage) or lower (disadvantage), regardless of
 * what the attack effects carry. Normal rolls one die.
 */

function attackBonus(bonus: number): EffectInstance {
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

function scriptedRng(faces: number[]): SeededRng {
  let i = 0;
  return {
    next: () => 0,
    nextInt: () => 0,
    rollDie: () => faces[Math.min(i++, faces.length - 1)],
  };
}

describe('resolveAttack — advantage / disadvantage override', () => {
  it('advantage keeps the higher of two d20s', () => {
    const res = resolveAttack({
      attackEffects: [attackBonus(0)],
      targetValue: 10,
      rollMode: 'advantage',
      rng: scriptedRng([5, 18]),
    });
    expect(res.d20Terms).toEqual([5, 18]);
    expect(res.naturalRoll).toBe(18);
    expect(res.isHit).toBe(true);
  });

  it('disadvantage keeps the lower of two d20s', () => {
    const res = resolveAttack({
      attackEffects: [attackBonus(0)],
      targetValue: 10,
      rollMode: 'disadvantage',
      rng: scriptedRng([5, 18]),
    });
    expect(res.d20Terms).toEqual([5, 18]);
    expect(res.naturalRoll).toBe(5);
    expect(res.isHit).toBe(false);
  });

  it('normal rolls a single d20', () => {
    const res = resolveAttack({
      attackEffects: [attackBonus(0)],
      targetValue: 10,
      rng: scriptedRng([12]),
    });
    expect(res.d20Terms).toEqual([12]);
    expect(res.naturalRoll).toBe(12);
  });
});
