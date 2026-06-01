import { describe, it, expect } from 'vitest';

import { createSeededRng } from '../../scene/seededRng';
import {
  applyToughnessDegrees,
  daggerheartHpMarked,
  makeEffectId,
  resolveDaggerheartAttack,
  resolveMam3eAttack,
  type EffectInstance,
} from '../../rules';

/**
 * BREADTH (RFC 003): the two non-d20 systems get native combat resolvers, so all
 * seven systems can resolve combat. Daggerheart marks HP slots by threshold; M&M
 * resolves a Toughness save into a condition track. Both seeded/deterministic.
 */

function attack(systemId: EffectInstance['systemId'], bonus: number): EffectInstance {
  return {
    id: makeEffectId(systemId, 'attack', bonus),
    systemId,
    target: 'attack',
    operation: 'add',
    value: bonus,
    stackPolicy: 'sum',
    source: { kind: 'system', label: 'atk' },
    label: 'atk',
  };
}

function damage(systemId: EffectInstance['systemId'], flat: number): EffectInstance[] {
  return [
    {
      id: makeEffectId(systemId, 'damage', 'flat', flat),
      systemId,
      target: 'damage',
      operation: 'add',
      value: flat,
      stackPolicy: 'sum',
      source: { kind: 'item', label: 'weapon' },
      label: `+${flat}`,
    },
  ];
}

describe('Daggerheart threshold → HP slots', () => {
  it('maps damage to 1/2/3 HP by threshold (SRD)', () => {
    const thresholds = { major: 7, severe: 14 };
    expect(daggerheartHpMarked(0, thresholds)).toBe(0);
    expect(daggerheartHpMarked(5, thresholds)).toBe(1); // below major
    expect(daggerheartHpMarked(7, thresholds)).toBe(2); // at major
    expect(daggerheartHpMarked(13, thresholds)).toBe(2); // below severe
    expect(daggerheartHpMarked(14, thresholds)).toBe(3); // at severe
    expect(daggerheartHpMarked(99, thresholds)).toBe(3);
  });

  it('a hit marks HP by the damage total; a miss marks none', () => {
    // Big attack bonus guarantees a hit; flat 10 damage vs major 7 -> 2 HP.
    const hit = resolveDaggerheartAttack({
      attackEffects: [attack('daggerheart', 50)],
      damageEffects: damage('daggerheart', 10),
      evasion: 12,
      thresholds: { major: 7, severe: 14 },
      rng: createSeededRng('dh-hit'),
    });
    expect(hit.isHit).toBe(true);
    expect(hit.damage).toBe(10);
    expect(hit.hpMarked).toBe(2);

    const miss = resolveDaggerheartAttack({
      attackEffects: [attack('daggerheart', -50)],
      damageEffects: damage('daggerheart', 10),
      evasion: 99,
      thresholds: { major: 7, severe: 14 },
      rng: createSeededRng('dh-miss'),
    });
    expect(miss.isHit).toBe(false);
    expect(miss.hpMarked).toBe(0);
  });

  it('spending an Armor slot reduces marked HP by 1 (min 1)', () => {
    const base = {
      attackEffects: [attack('daggerheart', 50)],
      damageEffects: damage('daggerheart', 10), // -> 2 HP at major 7
      evasion: 12,
      thresholds: { major: 7, severe: 14 },
    };
    const noArmor = resolveDaggerheartAttack({ ...base, rng: createSeededRng('a') });
    const withArmor = resolveDaggerheartAttack({
      ...base,
      spendArmor: true,
      rng: createSeededRng('a'),
    });
    expect(noArmor.hpMarked).toBe(2);
    expect(withArmor.hpMarked).toBe(1);
    expect(withArmor.armorSpent).toBe(true);

    // Floor at 1: a 1-HP hit reduced by armor is still 1.
    const minor = resolveDaggerheartAttack({
      attackEffects: [attack('daggerheart', 50)],
      damageEffects: damage('daggerheart', 3), // below major -> 1 HP
      evasion: 12,
      thresholds: { major: 7, severe: 14 },
      spendArmor: true,
      rng: createSeededRng('b'),
    });
    expect(minor.hpMarked).toBe(1);
  });

  it('is deterministic under a fixed seed', () => {
    const input = {
      attackEffects: [attack('daggerheart', 5)],
      damageEffects: damage('daggerheart', 8),
      evasion: 13,
      thresholds: { major: 7, severe: 14 },
    };
    const a = resolveDaggerheartAttack({ ...input, rng: createSeededRng('seed') });
    const b = resolveDaggerheartAttack({ ...input, rng: createSeededRng('seed') });
    expect(a).toEqual(b);
  });
});

describe('M&M Toughness shortfall → condition track', () => {
  it('maps shortfall to graded conditions (Hero’s Handbook p.191)', () => {
    expect(applyToughnessDegrees(0)).toEqual({
      bruised: 0,
      dazed: false,
      staggered: false,
      incapacitated: false,
    });
    expect(applyToughnessDegrees(3)).toEqual({
      bruised: 1,
      dazed: false,
      staggered: false,
      incapacitated: false,
    });
    expect(applyToughnessDegrees(6)).toEqual({
      bruised: 1,
      dazed: true,
      staggered: false,
      incapacitated: false,
    });
    expect(applyToughnessDegrees(12)).toEqual({
      bruised: 1,
      dazed: false,
      staggered: true,
      incapacitated: false,
    });
    expect(applyToughnessDegrees(20)).toEqual({
      bruised: 0,
      dazed: false,
      staggered: false,
      incapacitated: true,
    });
  });

  it('a hit forces a Toughness save vs DC 15 + rank; a miss does nothing', () => {
    const hit = resolveMam3eAttack({
      attackEffects: [attack('mam3e', 50)], // always hits
      targetDefense: 12,
      effectRank: 10, // DC 25
      toughness: 0, // will fail badly
      rng: createSeededRng('mm-hit'),
    });
    expect(hit.isHit).toBe(true);
    expect(hit.saveDC).toBe(25);
    expect(hit.shortfall).toBeGreaterThan(0);
    // A large shortfall produces at least a Bruised + some condition.
    expect(hit.condition.bruised + (hit.condition.incapacitated ? 1 : 0)).toBeGreaterThan(0);

    const miss = resolveMam3eAttack({
      attackEffects: [attack('mam3e', -50)],
      targetDefense: 99,
      effectRank: 10,
      toughness: 0,
      rng: createSeededRng('mm-miss'),
    });
    expect(miss.isHit).toBe(false);
    expect(miss.condition).toEqual({
      bruised: 0,
      dazed: false,
      staggered: false,
      incapacitated: false,
    });
  });

  it('a high Toughness can shrug off the hit (save meets DC -> no condition)', () => {
    const result = resolveMam3eAttack({
      attackEffects: [attack('mam3e', 50)],
      targetDefense: 12,
      effectRank: 1, // DC 16
      toughness: 100, // always saves
      rng: createSeededRng('mm-tough'),
    });
    expect(result.isHit).toBe(true);
    expect(result.shortfall).toBe(0);
    expect(result.condition).toEqual({
      bruised: 0,
      dazed: false,
      staggered: false,
      incapacitated: false,
    });
  });

  it('is deterministic under a fixed seed', () => {
    const input = {
      attackEffects: [attack('mam3e', 8)],
      targetDefense: 14,
      effectRank: 8,
      toughness: 6,
    };
    const a = resolveMam3eAttack({ ...input, rng: createSeededRng('seed') });
    const b = resolveMam3eAttack({ ...input, rng: createSeededRng('seed') });
    expect(a).toEqual(b);
  });
});
