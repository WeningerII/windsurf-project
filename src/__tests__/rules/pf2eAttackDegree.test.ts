import { describe, it, expect } from 'vitest';

import { makeEffectId, pf2eDegreeOfSuccess, resolveAttack, type EffectInstance } from '../../rules';
import type { SeededRng } from '../../scene/seededRng';

/**
 * PF2e resolves attacks with its four-degree engine, not the d20 nat-20 crit
 * rule: beating AC by 10 is a critical hit (no natural 20 needed), a natural 20
 * steps the degree up and a natural 1 steps it down, and a critical hit doubles
 * the WHOLE damage total (dice and modifiers) — CRB pp.445, 451.
 */

function attackBonus(bonus: number): EffectInstance {
  return {
    id: makeEffectId('pf2e', 'attack', 'base', bonus),
    systemId: 'pf2e',
    target: 'attack',
    operation: 'add',
    value: bonus,
    stackPolicy: 'sum',
    source: { kind: 'system', label: 'attack' },
    label: 'attack bonus',
  };
}

function weaponDamage(sides: number, flat: number): EffectInstance[] {
  return [
    {
      id: makeEffectId('pf2e', 'damage', 'die', sides),
      systemId: 'pf2e',
      target: 'damage',
      operation: 'add-die',
      value: sides,
      stackPolicy: 'sum',
      source: { kind: 'item', label: 'weapon' },
      label: `1d${sides}`,
    },
    {
      id: makeEffectId('pf2e', 'damage', 'flat', flat),
      systemId: 'pf2e',
      target: 'damage',
      operation: 'add',
      value: flat,
      stackPolicy: 'sum',
      source: { kind: 'system', label: 'ability' },
      label: `+${flat}`,
    },
  ];
}

/** A deterministic RNG that returns a scripted sequence of die faces. */
function scriptedRng(faces: number[]): SeededRng {
  let i = 0;
  return {
    next: () => 0,
    nextInt: () => 0,
    rollDie: () => faces[Math.min(i++, faces.length - 1)],
  };
}

describe('pf2eDegreeOfSuccess — the four-degree engine', () => {
  it('grades by margin: ±10 are the critical bands', () => {
    expect(pf2eDegreeOfSuccess(10, 25, 15)).toBe('critical-success'); // beat by 10
    expect(pf2eDegreeOfSuccess(10, 24, 15)).toBe('success'); // beat by 9
    expect(pf2eDegreeOfSuccess(10, 15, 15)).toBe('success'); // meet exactly
    expect(pf2eDegreeOfSuccess(10, 14, 15)).toBe('failure'); // miss by 1
    expect(pf2eDegreeOfSuccess(10, 6, 15)).toBe('failure'); // miss by 9
    expect(pf2eDegreeOfSuccess(10, 5, 15)).toBe('critical-failure'); // miss by 10
  });

  it('a natural 20 steps the degree up one band', () => {
    expect(pf2eDegreeOfSuccess(20, 15, 15)).toBe('critical-success'); // success → crit
    expect(pf2eDegreeOfSuccess(20, 6, 15)).toBe('success'); // failure → success
    expect(pf2eDegreeOfSuccess(20, 5, 15)).toBe('failure'); // crit-fail → failure
  });

  it('a natural 1 steps the degree down one band', () => {
    expect(pf2eDegreeOfSuccess(1, 25, 15)).toBe('success'); // crit → success
    expect(pf2eDegreeOfSuccess(1, 15, 15)).toBe('failure'); // success → failure
    expect(pf2eDegreeOfSuccess(1, 6, 15)).toBe('critical-failure'); // failure → crit-fail
  });

  it('the step adjustment clamps at the ends', () => {
    expect(pf2eDegreeOfSuccess(20, 25, 15)).toBe('critical-success'); // can't exceed
    expect(pf2eDegreeOfSuccess(1, 5, 15)).toBe('critical-failure'); // can't go below
  });
});

describe('resolveAttack — PF2e crit model', () => {
  it('beating AC by 10 (no natural 20) is a crit and doubles the whole total', () => {
    const res = resolveAttack({
      attackEffects: [attackBonus(10)],
      damageEffects: weaponDamage(6, 4), // 1d6+4
      targetValue: 15, // total 25 = AC+10 → critical hit on a natural 15
      critModel: 'pf2e',
      rng: scriptedRng([15, 6]),
    });
    expect(res.degree).toBe('critical-success');
    expect(res.isCriticalHit).toBe(true);
    expect(res.isHit).toBe(true);
    expect(res.damage).toBe(20); // (6 + 4) doubled — modifiers included
  });

  it('the default d20 model does NOT crit the same roll or double the modifier', () => {
    const res = resolveAttack({
      attackEffects: [attackBonus(10)],
      damageEffects: weaponDamage(6, 4),
      targetValue: 15,
      rng: scriptedRng([15, 6]), // natural 15 < critOn 20
    });
    expect(res.degree).toBeUndefined();
    expect(res.isCriticalHit).toBe(false);
    expect(res.isHit).toBe(true);
    expect(res.damage).toBe(10); // no doubling
  });

  it('a natural 20 steps a mere success up to a critical hit', () => {
    const res = resolveAttack({
      attackEffects: [attackBonus(0)],
      damageEffects: weaponDamage(4, 0),
      targetValue: 15, // total 20 = success; natural 20 → crit
      critModel: 'pf2e',
      rng: scriptedRng([20, 4]),
    });
    expect(res.degree).toBe('critical-success');
    expect(res.isCriticalHit).toBe(true);
    expect(res.damage).toBe(8); // 4 doubled
  });

  it('a natural 1 steps a hit down to a miss', () => {
    const res = resolveAttack({
      attackEffects: [attackBonus(20)],
      damageEffects: weaponDamage(6, 0),
      targetValue: 15, // total 21 = success; natural 1 → failure
      critModel: 'pf2e',
      rng: scriptedRng([1]),
    });
    expect(res.degree).toBe('failure');
    expect(res.isHit).toBe(false);
    expect(res.damage).toBe(0);
  });

  it('missing AC by 10 is a critical failure', () => {
    const res = resolveAttack({
      attackEffects: [attackBonus(0)],
      targetValue: 20, // total 5 ≤ AC-10 → critical failure
      critModel: 'pf2e',
      rng: scriptedRng([5]),
    });
    expect(res.degree).toBe('critical-failure');
    expect(res.isCriticalMiss).toBe(true);
    expect(res.isHit).toBe(false);
  });
});
