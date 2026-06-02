import { describe, it, expect } from 'vitest';

import { critModelForSystem, makeEffectId, resolveAttack, type EffectInstance } from '../../rules';
import type { SeededRng } from '../../scene/seededRng';

/**
 * 3.5e / PF1e critical hits: a natural roll in the threat range is only a
 * THREAT — it must be confirmed by a second attack roll vs the same AC. A
 * confirmed crit multiplies the whole base damage (dice AND modifiers) by the
 * weapon's ×N multiplier (PHB 3.5 p.140); an unconfirmed threat is a normal hit.
 */

function attackBonus(systemId: EffectInstance['systemId'], bonus: number): EffectInstance {
  return {
    id: makeEffectId(systemId, 'attack', 'base', bonus),
    systemId,
    target: 'attack',
    operation: 'add',
    value: bonus,
    stackPolicy: 'sum',
    source: { kind: 'system', label: 'attack' },
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
      source: { kind: 'system', label: 'strength' },
      label: `+${flat}`,
    },
  ];
}

/** A deterministic RNG returning a scripted sequence of die faces. */
function scriptedRng(faces: number[]): SeededRng {
  let i = 0;
  return {
    next: () => 0,
    nextInt: () => 0,
    rollDie: () => faces[Math.min(i++, faces.length - 1)],
  };
}

describe('critModelForSystem', () => {
  it('maps each system to its attack crit model', () => {
    expect(critModelForSystem('pf2e')).toBe('pf2e');
    expect(critModelForSystem('dnd-3.5e')).toBe('d20-confirm');
    expect(critModelForSystem('pf1e')).toBe('d20-confirm');
    expect(critModelForSystem('dnd-5e-2014')).toBe('d20-threshold');
    expect(critModelForSystem('dnd-5e-2024')).toBe('d20-threshold');
    expect(critModelForSystem(undefined)).toBe('d20-threshold');
  });
});

describe('resolveAttack — 3.5e/PF1e confirmation model', () => {
  it('a confirmed threat crits and multiplies dice AND modifiers', () => {
    const res = resolveAttack({
      attackEffects: [attackBonus('dnd-3.5e', 5)],
      damageEffects: weaponDamage('dnd-3.5e', 8, 3), // 1d8+3
      targetValue: 15,
      critModel: 'd20-confirm',
      rng: scriptedRng([20, 12, 8]), // nat 20 threat, confirm 12+5=17 ≥ 15, die 8
    });
    expect(res.isCriticalHit).toBe(true);
    expect(res.confirmed).toBe(true);
    expect(res.confirmationRoll).toBe(12);
    expect(res.damage).toBe(22); // (8 + 3) × 2 — modifier multiplied too
  });

  it('an unconfirmed threat is only a normal hit', () => {
    const res = resolveAttack({
      attackEffects: [attackBonus('dnd-3.5e', 5)],
      damageEffects: weaponDamage('dnd-3.5e', 8, 3),
      targetValue: 25, // a nat 20 still hits, but confirm 2+5=7 < 25 fails
      critModel: 'd20-confirm',
      rng: scriptedRng([20, 2, 8]),
    });
    expect(res.isHit).toBe(true);
    expect(res.isCriticalHit).toBe(false);
    expect(res.confirmed).toBe(false);
    expect(res.confirmationRoll).toBe(2);
    expect(res.damage).toBe(11); // not multiplied
  });

  it('honors a ×3 weapon multiplier on a confirmed crit', () => {
    const res = resolveAttack({
      attackEffects: [attackBonus('pf1e', 10)],
      damageEffects: weaponDamage('pf1e', 6, 2), // 1d6+2
      targetValue: 15,
      critModel: 'd20-confirm',
      critMultiplier: 3,
      rng: scriptedRng([20, 10, 6]),
    });
    expect(res.isCriticalHit).toBe(true);
    expect(res.damage).toBe(24); // (6 + 2) × 3
  });

  it('a threat range below 20 (e.g. 19-20) still requires confirmation', () => {
    const res = resolveAttack({
      attackEffects: [attackBonus('pf1e', 5)],
      damageEffects: weaponDamage('pf1e', 8, 1),
      targetValue: 15,
      critOn: 19, // scimitar-style threat range
      critModel: 'd20-confirm',
      rng: scriptedRng([19, 10, 8]), // nat 19 threatens, confirm 10+5=15 ≥ 15
    });
    expect(res.isCriticalHit).toBe(true);
    expect(res.confirmed).toBe(true);
    expect(res.damage).toBe(18); // (8 + 1) × 2
  });

  it('a normal hit (no threat) rolls no confirmation and is not multiplied', () => {
    const res = resolveAttack({
      attackEffects: [attackBonus('dnd-3.5e', 5)],
      damageEffects: weaponDamage('dnd-3.5e', 8, 3),
      targetValue: 15,
      critModel: 'd20-confirm',
      rng: scriptedRng([12, 8]), // nat 12: hit, no threat → die 8 is the next roll
    });
    expect(res.isHit).toBe(true);
    expect(res.isCriticalHit).toBe(false);
    expect(res.confirmed).toBeUndefined();
    expect(res.confirmationRoll).toBeUndefined();
    expect(res.damage).toBe(11);
  });

  it('contrast: the 5e threshold model auto-crits the same threat (dice only)', () => {
    const res = resolveAttack({
      attackEffects: [attackBonus('dnd-5e-2014', 5)],
      damageEffects: weaponDamage('dnd-5e-2014', 8, 3),
      targetValue: 15,
      critModel: 'd20-threshold',
      rng: scriptedRng([20, 8]), // no confirmation roll consumed
    });
    expect(res.isCriticalHit).toBe(true);
    expect(res.confirmed).toBeUndefined();
    expect(res.damage).toBe(19); // (8 doubled) + 3 once — modifier NOT doubled
  });
});
