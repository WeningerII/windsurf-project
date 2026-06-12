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
 * seven systems can resolve combat. Daggerheart rolls the 2d12 duality dice
 * (Hope + Fear; matching dice crit) and marks HP slots by threshold; M&M
 * resolves a Toughness save into a condition track with nat-20 crits and nat-1
 * auto-misses. Both seeded/deterministic.
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
    // Pinned: seed 'dh-miss' rolls non-matching duality dice (matching dice
    // would crit and auto-hit). A seed/RNG change that rolls a crit here must
    // pick a new seed, not weaken the miss assertions.
    expect(miss.isCritical).toBe(false);
    expect(miss.isHit).toBe(false);
    expect(miss.hpMarked).toBe(0);
  });

  it('REGRESSION (05-H3): rolls 2d12 duality dice — total = Hope + Fear + modifiers', () => {
    // Probe the same seeded stream the resolver consumes: with no dice in the
    // attack effects, the first two draws are the Hope and Fear dice.
    const probe = createSeededRng('dh-duality');
    const expectedHope = probe.rollDie(12);
    const expectedFear = probe.rollDie(12);

    const result = resolveDaggerheartAttack({
      attackEffects: [attack('daggerheart', 3)],
      damageEffects: damage('daggerheart', 5),
      evasion: 1, // trivially beatable; this test is about the dice model
      thresholds: { major: 7, severe: 14 },
      rng: createSeededRng('dh-duality'),
    });

    expect(result.hopeDie).toBe(expectedHope);
    expect(result.fearDie).toBe(expectedFear);
    expect(result.hopeDie).toBeGreaterThanOrEqual(1);
    expect(result.hopeDie).toBeLessThanOrEqual(12);
    expect(result.fearDie).toBeGreaterThanOrEqual(1);
    expect(result.fearDie).toBeLessThanOrEqual(12);
    expect(result.attackTotal).toBe(expectedHope + expectedFear + 3);
    expect(result.withHope).toBe(expectedHope >= expectedFear);
    expect(result.isCritical).toBe(expectedHope === expectedFear);
  });

  it('matching duality dice are a critical success that hits any Evasion (SRD)', () => {
    // Search seeds for matching dice; non-matching seeds must all miss the
    // impossible Evasion (max total 24 + 0 < 99), so the crit is the ONLY hit.
    let found = false;
    for (let i = 0; i < 300 && !found; i += 1) {
      const result = resolveDaggerheartAttack({
        attackEffects: [attack('daggerheart', 0)],
        damageEffects: damage('daggerheart', 10),
        evasion: 99,
        thresholds: { major: 7, severe: 14 },
        rng: createSeededRng(`dh-crit-${i}`),
      });
      if (result.hopeDie !== result.fearDie) {
        expect(result.isCritical).toBe(false);
        expect(result.isHit).toBe(false);
        continue;
      }
      found = true;
      expect(result.isCritical).toBe(true);
      expect(result.isHit).toBe(true); // automatic success
      expect(result.withHope).toBe(true); // a crit counts as rolling with Hope
      expect(result.hpMarked).toBeGreaterThan(0);
    }
    expect(found).toBe(true);
  });

  it('reports with-Hope vs with-Fear from the higher die', () => {
    // Search for one of each to pin both branches.
    let sawHope = false;
    let sawFear = false;
    for (let i = 0; i < 300 && !(sawHope && sawFear); i += 1) {
      const result = resolveDaggerheartAttack({
        attackEffects: [attack('daggerheart', 0)],
        damageEffects: damage('daggerheart', 1),
        evasion: 2,
        thresholds: { major: 7, severe: 14 },
        rng: createSeededRng(`dh-hopefear-${i}`),
      });
      if (result.hopeDie > result.fearDie) {
        sawHope = true;
        expect(result.withHope).toBe(true);
      } else if (result.fearDie > result.hopeDie) {
        sawFear = true;
        expect(result.withHope).toBe(false);
      }
    }
    expect(sawHope).toBe(true);
    expect(sawFear).toBe(true);
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
      attackEffects: [attack('mam3e', 50)], // hits unless natural 1
      targetDefense: 12,
      effectRank: 10, // DC 25
      toughness: 0, // will fail badly
      rng: createSeededRng('mm-hit'),
    });
    // Pinned: seed 'mm-hit' rolls a plain hit (no nat 20/1), so the base DC
    // applies. A seed/RNG change that rolls a natural here must pick a new
    // seed, not weaken these assertions.
    expect(hit.naturalRoll).toBeGreaterThan(1);
    expect(hit.naturalRoll).toBeLessThan(20);
    expect(hit.isHit).toBe(true);
    expect(hit.isCriticalHit).toBe(false);
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
    // Pinned: seed 'mm-miss' does not roll the natural 20 that would auto-hit.
    expect(miss.naturalRoll).toBeLessThan(20);
    expect(miss.isHit).toBe(false);
    expect(miss.condition).toEqual({
      bruised: 0,
      dazed: false,
      staggered: false,
      incapacitated: false,
    });
  });

  it('REGRESSION (05-M1): a natural 20 always hits and raises the Toughness DC by +5', () => {
    let found = false;
    for (let i = 0; i < 300 && !found; i += 1) {
      const result = resolveMam3eAttack({
        attackEffects: [attack('mam3e', 0)],
        targetDefense: 99, // unhittable except by the natural 20
        effectRank: 10, // base DC 25
        toughness: 0,
        rng: createSeededRng(`mm-crit-${i}`),
      });
      if (result.naturalRoll !== 20) {
        expect(result.isHit).toBe(false); // max non-nat-20 total is 19 < 99
        continue;
      }
      found = true;
      expect(result.isCriticalHit).toBe(true);
      expect(result.isHit).toBe(true);
      // Crit: effect DC = 15 + rank + 5.
      expect(result.saveDC).toBe(30);
    }
    expect(found).toBe(true);
  });

  it('REGRESSION (05-M1): a natural 1 always misses, even vs a trivial defense', () => {
    let found = false;
    for (let i = 0; i < 300 && !found; i += 1) {
      const result = resolveMam3eAttack({
        attackEffects: [attack('mam3e', 50)],
        targetDefense: 1, // trivially beatable by any total
        effectRank: 5,
        toughness: 0,
        rng: createSeededRng(`mm-fumble-${i}`),
      });
      if (result.naturalRoll !== 1) continue;
      found = true;
      expect(result.isHit).toBe(false);
      expect(result.saveDC).toBe(0);
      expect(result.condition).toEqual({
        bruised: 0,
        dazed: false,
        staggered: false,
        incapacitated: false,
      });
    }
    expect(found).toBe(true);
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

describe('M&M attack advantages reach the scene adapter', () => {
  it('Close/Ranged Attack ranks add to the matching attack check', async () => {
    const { buildMam3eCombatant } = await import('../../rules');
    const { createDefaultMam3eData } = await import('../../systems/mam3e/data-model');
    const build = (
      range: 'close' | 'ranged',
      advantages: Array<{ id: string; name: string; rank?: number }>
    ) =>
      buildMam3eCombatant(
        {
          id: 'hero',
          name: 'Hero',
          systemId: 'mam3e',
          system: {
            ...createDefaultMam3eData(),
            powers: [{ id: 'punch', name: 'Punch', type: 'attack', rank: 8, range }],
            advantages,
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        } as never,
        { tokenId: 'h', position: { x: 0, y: 0 } }
      );
    const attackTotal = (result: ReturnType<typeof build>) =>
      result.supported
        ? result.combatant.attackEffects.reduce(
            (sum, effect) => sum + (typeof effect.value === 'number' ? effect.value : 0),
            0
          )
        : NaN;

    const base = build('close', []);
    const closeRanked = build('close', [{ id: 'close-attack', name: 'Close Attack', rank: 3 }]);
    // The matching advantage adds its rank...
    expect(attackTotal(closeRanked)).toBe(attackTotal(base) + 3);
    // ...the non-matching one adds nothing...
    const mismatched = build('close', [{ id: 'ranged-attack', name: 'Ranged Attack', rank: 3 }]);
    expect(attackTotal(mismatched)).toBe(attackTotal(base));
    // ...and a rankless advantage counts as rank 1.
    const rankless = build('ranged', [{ id: 'ranged-attack', name: 'Ranged Attack' }]);
    const rangedBase = build('ranged', []);
    expect(attackTotal(rankless)).toBe(attackTotal(rangedBase) + 1);
  });
});

describe('Daggerheart weapon features and derived defenses reach the adapter', () => {
  it('Reliable (+1 to attack rolls) compiles; evasion/thresholds use derived math', async () => {
    const { buildDaggerheartCombatant } = await import('../../rules');
    const { createDefaultDaggerheartData } = await import('../../systems/daggerheart/data-model');
    const { getDaggerheartDerivedStats } = await import('../../utils/daggerheartDerived');
    const weapon = {
      id: 'w-reliable',
      name: 'Broadsword',
      system: 'daggerheart',
      source: 'SRD',
      version: '1.0',
      lastUpdated: '',
      sourceBook: { name: 'SRD', url: '' },
      category: 'primary',
      tier: 1,
      trait: 'agility',
      range: 'Melee',
      damage: 'd8',
      damageType: 'physical',
      burden: 1,
      feature: 'Reliable: +1 to attack rolls',
    } as never;
    const system = {
      ...createDefaultDaggerheartData(),
      level: 1,
      weapons: { primaryId: 'w-reliable', secondaryId: '', inventoryIds: [] },
    };
    const built = buildDaggerheartCombatant(
      {
        id: 'dh',
        name: 'DH',
        systemId: 'daggerheart',
        system,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      new Map([['w-reliable', weapon]]),
      { tokenId: 'd', position: { x: 0, y: 0 } }
    );
    expect(built.supported).toBe(true);
    if (!built.supported) return;
    expect(
      built.combatant.attackEffects.some(
        (effect) => effect.value === 1 && /reliable/i.test(effect.label)
      )
    ).toBe(true);
    const derived = getDaggerheartDerivedStats(system);
    expect(built.combatant.evasion).toBe(derived.evasion);
    expect(built.combatant.thresholds).toEqual({
      major: derived.majorThreshold,
      severe: derived.severeThreshold,
    });
  });
});
