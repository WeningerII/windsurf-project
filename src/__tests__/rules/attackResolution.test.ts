import { describe, it, expect } from 'vitest';

import { createSeededRng, type SeededRng } from '../../scene/seededRng';
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
    // Found-flag pattern: search seeds for a non-crit roll so the miss
    // assertions are guaranteed to execute (a bare `if` would silently skip
    // if the seed happened to roll a natural 20 under a future RNG).
    let found = false;
    for (let i = 0; i < 200 && !found; i += 1) {
      const result = resolveAttack({
        attackEffects: [attackEffect('dnd-5e-2014', 0)],
        targetValue: 100, // unbeatable except by a natural crit
        rng: createSeededRng(`miss-${i}`),
      });
      if (result.isCriticalHit) continue;
      found = true;
      expect(result.isHit).toBe(false);
      expect(result.damage).toBe(0);
    }
    expect(found).toBe(true);
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
        expect(result.damage).toBeGreaterThan(0);
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
    // Found-flag pattern: search seeds for a plain (non-crit, non-fumble) hit
    // so the exact-damage equation is guaranteed to execute for some seed.
    let found = false;
    for (let i = 0; i < 200 && !found; i += 1) {
      const result = resolveAttack({
        attackEffects: [attackEffect('dnd-5e-2014', 50)], // hits unless natural 1
        damageEffects: weaponDamage('dnd-5e-2014', 8, 3),
        targetValue: 10,
        rng: createSeededRng(`dmg-${i}`),
      });
      if (result.isCriticalHit || result.isCriticalMiss) continue;
      found = true;
      expect(result.isHit).toBe(true);
      expect(result.damageDiceTerms).toHaveLength(1);
      expect(result.damageDiceTerms[0]).toBeGreaterThanOrEqual(1);
      expect(result.damageDiceTerms[0]).toBeLessThanOrEqual(8);
      expect(result.damageBonus).toBe(3);
      // On a non-crit hit: damage = die + 3.
      expect(result.damage).toBe(result.damageDiceTerms[0] + 3);
    }
    expect(found).toBe(true);
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
      // Search seeds for a plain hit so the damage-parity assertion is
      // guaranteed to execute. (The original test used targetValue 50, which a
      // +5 total can only beat on a natural 20 — i.e. always a crit — so its
      // non-crit damage branch was provably dead code.)
      let found = false;
      for (let i = 0; i < 200 && !found; i += 1) {
        const result = resolveAttack({
          attackEffects,
          damageEffects,
          targetValue: 5, // beatable by any non-fumble roll
          rng: createSeededRng(`agnostic-${i}`),
        });
        // attack bonus = base 4 + item 1 = 5, on every seed
        expect(result.attackBonus).toBe(5);
        if (result.isCriticalHit || result.isCriticalMiss) continue;
        found = true;
        expect(result.isHit).toBe(true);
        // damage = die + flat 3 + item 1
        expect(result.damageBonus).toBe(4);
      }
      expect(found).toBe(true);
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

describe("resolveAttack — PF2e degrees of success (degreeModel: 'pf2e')", () => {
  const SID = 'pf2e' as const;

  // Find seeds whose first d20 is a known value so degree thresholds are
  // exercised deterministically without mocking.
  function seedWithFirstD20(target: number): string {
    for (let i = 0; i < 5000; i += 1) {
      const seed = `degree-${i}`;
      if (createSeededRng(seed).rollDie(20) === target) return seed;
    }
    throw new Error(`no seed found for d20=${target}`);
  }

  it('beats the AC by 10+ for a critical success and doubles the WHOLE damage', () => {
    const seed = seedWithFirstD20(15);
    const resolution = resolveAttack({
      attackEffects: [attackEffect(SID, 10)], // total 25 vs AC 15 = +10 over
      damageEffects: weaponDamage(SID, 6, 4),
      targetValue: 15,
      degreeModel: 'pf2e',
      rng: createSeededRng(seed),
    });
    expect(resolution.degreeOfSuccess).toBe('critical-success');
    expect(resolution.isCriticalHit).toBe(true);
    // CRB: double dice AND static damage — total = 2 x (die + 4).
    const die = resolution.damageDiceTerms[0];
    expect(resolution.damage).toBe(2 * (die + 4));
  });

  it('a natural 20 upgrades the degree one step (failure -> success)', () => {
    const seed = seedWithFirstD20(20);
    const resolution = resolveAttack({
      attackEffects: [attackEffect(SID, 0)], // total 20 vs AC 25: failure...
      damageEffects: weaponDamage(SID, 6, 0),
      targetValue: 25,
      degreeModel: 'pf2e',
      rng: createSeededRng(seed),
    });
    // ...upgraded to success by the nat 20 — a plain hit, NOT a crit.
    expect(resolution.degreeOfSuccess).toBe('success');
    expect(resolution.isHit).toBe(true);
    expect(resolution.isCriticalHit).toBe(false);
  });

  it('a natural 1 downgrades success to failure', () => {
    const seed = seedWithFirstD20(1);
    const resolution = resolveAttack({
      attackEffects: [attackEffect(SID, 14)], // total 15 vs AC 15: success...
      targetValue: 15,
      degreeModel: 'pf2e',
      rng: createSeededRng(seed),
    });
    // ...downgraded to failure by the nat 1.
    expect(resolution.degreeOfSuccess).toBe('failure');
    expect(resolution.isHit).toBe(false);
  });

  it('the default d20 model is unchanged (no degree, dice-only crit)', () => {
    const seed = seedWithFirstD20(20);
    const resolution = resolveAttack({
      attackEffects: [attackEffect('dnd-5e-2014', 5)],
      damageEffects: weaponDamage('dnd-5e-2014', 6, 4),
      targetValue: 12,
      rng: createSeededRng(seed),
    });
    expect(resolution.degreeOfSuccess).toBeUndefined();
    expect(resolution.isCriticalHit).toBe(true);
    // 5e crit: dice doubled, flat NOT doubled.
    const die = resolution.damageDiceTerms[0];
    expect(resolution.damage).toBe(2 * die + 4);
  });
});

describe("resolveAttack — 3.5e/PF1e critical confirmation (critModel: 'confirm-multiply')", () => {
  const SID = 'dnd-3.5e' as const;

  // Scripted rng: rollDie(20) drains the queued naturals (attack threat, then
  // the confirmation roll); every other die (the damage dice) returns its max,
  // so damage is deterministic without coupling the test to add-die ordering.
  function scriptedRng(d20s: number[]): SeededRng {
    const queue = [...d20s];
    return {
      next: () => 0.5,
      nextInt: (max: number) => max - 1,
      rollDie: (sides: number) => (sides === 20 ? (queue.shift() ?? 1) : sides),
    };
  }

  it('a confirmed threat multiplies normal damage by the weapon multiplier', () => {
    // Attack nat 20 (threat), then confirmation nat 20 (25 vs AC 15 -> confirms).
    const resolution = resolveAttack({
      attackEffects: [attackEffect(SID, 5)],
      damageEffects: weaponDamage(SID, 8, 3),
      targetValue: 15,
      critModel: 'confirm-multiply',
      rng: scriptedRng([20, 20]),
    });
    expect(resolution.isCriticalHit).toBe(true);
    expect(resolution.criticalConfirmed).toBe(true);
    expect(resolution.confirmationRoll).toBe(20);
    // Normal damage = max d8 (8) + 3 = 11; ×2 default multiplier = 22.
    expect(resolution.damage).toBe(22);
  });

  it('honors a higher critical multiplier (×3)', () => {
    const resolution = resolveAttack({
      attackEffects: [attackEffect(SID, 5)],
      damageEffects: weaponDamage(SID, 8, 3),
      targetValue: 15,
      critModel: 'confirm-multiply',
      criticalMultiplier: 3,
      rng: scriptedRng([20, 20]),
    });
    expect(resolution.criticalConfirmed).toBe(true);
    expect(resolution.damage).toBe(33); // 11 × 3
  });

  it('an unconfirmed threat is an ordinary hit, not a crit', () => {
    // Attack nat 20 (threat), confirmation nat 2 (2 + 5 = 7 < AC 15 -> fails).
    const resolution = resolveAttack({
      attackEffects: [attackEffect(SID, 5)],
      damageEffects: weaponDamage(SID, 8, 3),
      targetValue: 15,
      critModel: 'confirm-multiply',
      rng: scriptedRng([20, 2]),
    });
    expect(resolution.isHit).toBe(true);
    expect(resolution.isCriticalHit).toBe(false);
    expect(resolution.criticalConfirmed).toBe(false);
    expect(resolution.confirmationRoll).toBe(2);
    expect(resolution.damage).toBe(11); // normal, unmultiplied
  });
});
