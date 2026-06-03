import { describe, it, expect } from 'vitest';

import {
  coverBetweenElevated,
  gridDistance,
  runCombatRound,
  type EffectInstance,
  type RoundCombatant,
  type WallTopAt,
} from '../../rules';

/**
 * Ranged threat is line-of-sight-gated, which gives cover-seeking for free: a
 * cell a wall hides from an archer carries no threat from it, so the mover
 * approaches via cover — preferring a shielded cell over an exposed one even when
 * the exposed cell is cheaper to reach.
 */

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

describe('ranged threat and cover-seeking', () => {
  it('approaches the target via a cell shielded from the archer', () => {
    const hero: RoundCombatant = {
      tokenId: 'hero',
      faction: 'party',
      position: { x: 0, y: 0 },
      armorClass: 16,
      hp: { current: 30, max: 30 },
      attackEffects: [eff('attack', 'add', 20)],
      damageEffects: [eff('damage', 'add', 12)],
      reach: 1,
      speed: 6,
    };
    // The wounded melee target draws the hero in.
    const target: RoundCombatant = {
      tokenId: 'target',
      faction: 'monsters',
      position: { x: 4, y: 0 },
      armorClass: 5,
      hp: { current: 1, max: 30 },
      attackEffects: [eff('attack', 'add', 0)],
      damageEffects: [eff('damage', 'add-die', 4)],
      reach: 1,
      speed: 0,
    };
    // A deadly archer to the south (no reach → ranged); a wall at (4,2) hides the
    // target's column from it.
    const archer: RoundCombatant = {
      tokenId: 'archer',
      faction: 'monsters',
      position: { x: 4, y: 5 },
      armorClass: 16,
      hp: { current: 40, max: 40 },
      attackEffects: [eff('attack', 'add', 0)],
      damageEffects: [eff('damage', 'add', 30)],
    };
    const wallTopAt: WallTopAt = (c) => (c.x === 4 && c.y === 2 ? Infinity : 0);

    const result = runCombatRound({
      order: [hero, target, archer],
      seed: 'cover',
      round: 1,
      systemId: 'dnd-5e-2014',
      gridWidth: 20,
      gridHeight: 20,
      wallTopAt,
    });

    const dest = result.turns.find((t) => t.tokenId === 'hero')!.turn.moveTo!;
    expect(dest).toBeDefined();
    // It reached the target (adjacent) and ended where the archer cannot see it,
    // even though the exposed cell (3,0) was a cheaper approach.
    expect(gridDistance(dest, { x: 4, y: 0 })).toBeLessThanOrEqual(1);
    expect(coverBetweenElevated({ x: 4, y: 5 }, dest, wallTopAt)).toBe('total');
  });
});
