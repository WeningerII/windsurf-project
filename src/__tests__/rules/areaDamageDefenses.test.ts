import { describe, it, expect } from 'vitest';

import { makeEffectId, resolveAreaEffect, type EffectInstance } from '../../rules';

/**
 * Area effects (breath weapons / spells) apply each participant's resistances
 * too — and they STACK with save-for-half (5e): a fire-resistant creature that
 * also saves against a fireball takes a quarter. Flat (diceless) damage keeps
 * the shared total deterministic so the math is exact.
 */

function flatDamage(type: string, amount: number): EffectInstance {
  const target = `damage.${type}`;
  return {
    id: makeEffectId('dnd-5e-2014', target, 'flat', amount),
    systemId: 'dnd-5e-2014',
    target,
    operation: 'add',
    value: amount,
    stackPolicy: 'sum',
    source: { kind: 'custom', id: 'breath', label: 'breath' },
    label: `${amount} ${type}`,
    category: 'other',
  };
}

const FIRE_12 = [flatDamage('fire', 12)];

describe('resolveAreaEffect — participant resistances', () => {
  it('halves a resisted type and zeroes an immune one on a failed save', () => {
    const result = resolveAreaEffect({
      sourceId: 'dragon',
      seed: 'breath',
      damageEffects: FIRE_12,
      saveDC: 100, // unbeatable → everyone fails (full damage before defenses)
      participants: [
        { targetId: 'plain', saveBonus: 0 },
        { targetId: 'resistant', saveBonus: 0, defenses: { resistant: ['fire'] } },
        { targetId: 'immune', saveBonus: 0, defenses: { immune: ['fire'] } },
        { targetId: 'wrongType', saveBonus: 0, defenses: { resistant: ['cold'] } },
      ],
    });
    const taken = (id: string) => result.perTarget.find((p) => p.targetId === id)!.damageTaken;
    expect(taken('plain')).toBe(12);
    expect(taken('resistant')).toBe(6);
    expect(taken('immune')).toBe(0);
    expect(taken('wrongType')).toBe(12); // resistance to a different type does nothing
  });

  it('stacks save-for-half with resistance (a quarter)', () => {
    const result = resolveAreaEffect({
      sourceId: 'dragon',
      seed: 'breath',
      damageEffects: FIRE_12,
      saveDC: 0, // trivially beaten → everyone saves (half)
      halfOnSave: true,
      participants: [
        { targetId: 'plain', saveBonus: 0 },
        { targetId: 'resistant', saveBonus: 0, defenses: { resistant: ['fire'] } },
      ],
    });
    const taken = (id: string) => result.perTarget.find((p) => p.targetId === id)!.damageTaken;
    expect(taken('plain')).toBe(6); // half of 12
    expect(taken('resistant')).toBe(3); // half, then halved again
  });

  it('vulnerability doubles a failed-save hit', () => {
    const result = resolveAreaEffect({
      sourceId: 'dragon',
      seed: 'breath',
      damageEffects: FIRE_12,
      saveDC: 100,
      participants: [{ targetId: 'vuln', saveBonus: 0, defenses: { vulnerable: ['fire'] } }],
    });
    expect(result.perTarget[0].damageTaken).toBe(24);
  });

  it('applies resistance after a PF2e critical-failure double (×2 then ½ = full)', () => {
    const result = resolveAreaEffect({
      sourceId: 'dragon',
      seed: 'breath',
      damageEffects: FIRE_12,
      saveDC: 100, // total ≤ DC-10 → critical failure → double
      saveModel: 'pf2e-basic',
      participants: [
        { targetId: 'plain', saveBonus: 0 },
        { targetId: 'resistant', saveBonus: 0, defenses: { resistant: ['fire'] } },
      ],
    });
    const taken = (id: string) => result.perTarget.find((p) => p.targetId === id)!.damageTaken;
    expect(taken('plain')).toBe(24); // crit-failure doubles
    expect(taken('resistant')).toBe(12); // doubled, then resistance halves
  });
});
