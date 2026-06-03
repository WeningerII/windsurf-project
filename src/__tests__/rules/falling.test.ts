import { describe, it, expect } from 'vitest';

import { resolveFall, runCombatRound, type EffectInstance, type RoundCombatant } from '../../rules';
import { createSeededRng } from '../../scene/seededRng';

/**
 * Falling: a creature that leaves the air without the means to stay aloft drops
 * to the ground and, if it was conscious as it fell, takes system falling damage.
 * The auto-round drops a shot-down flyer immediately and a stranded non-flyer at
 * the start of its turn.
 */

const rng = () => createSeededRng('fall-seed');

describe('resolveFall', () => {
  it('rolls 1d6 per 10 ft for the d20 line, capped at 20d6', () => {
    const thirty = resolveFall({ systemId: 'dnd-5e-2014', heightCells: 6, rng: rng() }); // 30 ft
    expect(thirty.distanceFeet).toBe(30);
    expect(thirty.dice).toBe(3);
    expect(thirty.damage).toBeGreaterThanOrEqual(3);
    expect(thirty.damage).toBeLessThanOrEqual(18);

    const huge = resolveFall({ systemId: 'pf1e', heightCells: 100, rng: rng() }); // 500 ft
    expect(huge.dice).toBe(20); // capped
    expect(huge.damage).toBeLessThanOrEqual(120);
  });

  it('deals nothing for a fall under 10 ft or from the ground', () => {
    expect(resolveFall({ systemId: 'dnd-5e-2014', heightCells: 1, rng: rng() }).damage).toBe(0); // 5 ft
    expect(resolveFall({ systemId: 'dnd-5e-2014', heightCells: 0, rng: rng() }).damage).toBe(0);
  });

  it('PF2e takes half the distance fallen, deterministically', () => {
    const fall = resolveFall({ systemId: 'pf2e', heightCells: 6, rng: rng() }); // 30 ft
    expect(fall.dice).toBe(0);
    expect(fall.damage).toBe(15);
  });

  it('descends M&M and Daggerheart without HP-based damage', () => {
    expect(resolveFall({ systemId: 'mam3e', heightCells: 10, rng: rng() }).damage).toBe(0);
    expect(resolveFall({ systemId: 'daggerheart', heightCells: 10, rng: rng() }).damage).toBe(0);
  });
});

let seq = 0;
const eff = (
  target: 'attack' | 'damage',
  op: 'add' | 'add-die',
  value: number
): EffectInstance => ({
  id: `${target}-${op}-${value}-${seq++}`,
  systemId: 'dnd-5e-2014',
  target,
  operation: op,
  value,
  stackPolicy: 'sum',
  source: { kind: 'custom', id: 'x', label: 'x' },
  label: target,
  category: 'other',
});

describe('falling in the auto-round', () => {
  it('drops a stranded non-flyer at the start of its turn, with damage', () => {
    // A conscious creature aloft with no fly speed cannot stay there.
    const faller: RoundCombatant = {
      tokenId: 'faller',
      faction: 'party',
      position: { x: 1, y: 1, z: 6 }, // 30 ft up
      armorClass: 10,
      hp: { current: 30, max: 30 },
      attackEffects: [eff('attack', 'add', 0)],
      damageEffects: [eff('damage', 'add-die', 4)],
      reach: 1,
    };
    const result = runCombatRound({
      order: [faller],
      seed: 'fall',
      round: 1,
      systemId: 'dnd-5e-2014',
    });

    const turn = result.turns.find((t) => t.tokenId === 'faller')!;
    expect(turn.fallIntents).toBeDefined();
    const damage = turn.fallIntents!.find((i) => i.type === 'apply-damage');
    expect(damage).toBeDefined();
    // It landed: a descent move to ground (no elevation) was emitted.
    const descent = turn.fallIntents!.find((i) => i.type === 'move-token');
    expect(descent?.type === 'move-token' && (descent.position.z ?? 0)).toBe(0);
    // 30 ft = 3d6 (3–18), so it lost some HP but is not wiped out.
    expect(result.finalHp.faller).toBeLessThan(30);
    expect(result.finalHp.faller).toBeGreaterThanOrEqual(12);
  });

  it('plummets a flyer the moment it is shot out of the sky', () => {
    const archer: RoundCombatant = {
      tokenId: 'archer',
      faction: 'party',
      position: { x: 0, y: 0 },
      armorClass: 10,
      hp: { current: 30, max: 30 },
      attackEffects: [eff('attack', 'add', 20)], // reliably hits
      damageEffects: [eff('damage', 'add', 50)], // and reliably kills
      // No reach → ranged: it can hit the airborne target.
    };
    const flyer: RoundCombatant = {
      tokenId: 'flyer',
      faction: 'monsters',
      position: { x: 2, y: 0, z: 6 }, // 30 ft up
      armorClass: 5,
      hp: { current: 1, max: 40 },
      attackEffects: [eff('attack', 'add', 0)],
      damageEffects: [eff('damage', 'add-die', 6)],
      reach: 1,
      flySpeed: 12,
    };
    const result = runCombatRound({
      order: [archer, flyer],
      seed: 'sky',
      round: 1,
      systemId: 'dnd-5e-2014',
    });

    expect(result.finalHp.flyer).toBe(0); // shot down
    // It fell to the ground: a move-token grounding the flyer was emitted.
    const descent = result.intents.find((i) => i.type === 'move-token' && i.tokenId === 'flyer');
    expect(descent).toBeDefined();
    expect(descent?.type === 'move-token' && (descent.position.z ?? 0)).toBe(0);
  });
});
