import { describe, it, expect } from 'vitest';

import {
  coverAcBonus,
  coverBetween,
  makeEffectId,
  resolveSceneAttack,
  type EffectInstance,
  type ResolveCombatStats,
} from '../../rules';
import type { SceneMarker, SceneState, SceneToken } from '../../types/core/scene';

/**
 * Cover protects against attacks too, not just area saves: a target behind a
 * wall corner gains a per-system AC bonus, and total cover (no line of sight)
 * means the attack can't be made at all.
 */

function atk(bonus: number): EffectInstance {
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

const STATS: ResolveCombatStats = () => ({
  attackEffects: [atk(0)],
  damageEffects: [],
  armorClass: 10,
  reach: 10,
});

function token(id: string, x: number, y: number): SceneToken {
  return {
    id,
    name: id,
    kind: 'character',
    position: { x, y },
    size: 1,
    hp: { current: 20, max: 20 },
  };
}

function wall(x: number, y: number): SceneMarker {
  return {
    id: `wall-${x}-${y}`,
    kind: 'terrain',
    label: 'Wall',
    position: { x, y },
    width: 1,
    height: 1,
    effects: [{ target: 'cover', operation: 'set', value: 'total', label: 'Wall' }],
  };
}

function scene(attacker: SceneToken, target: SceneToken, walls: SceneMarker[]): SceneState {
  return {
    sceneId: 's',
    name: 'Cover',
    systemId: 'dnd-5e-2014',
    grid: { width: 10, height: 10, cellSize: 5 },
    tokens: { [attacker.id]: attacker, [target.id]: target },
    markers: Object.fromEntries(walls.map((w) => [w.id, w])),
    initiative: [],
    round: 1,
    seed: 'seed',
  };
}

describe('coverAcBonus', () => {
  it('grades the AC bonus per system', () => {
    expect(coverAcBonus('half', 'dnd-5e-2014')).toBe(2);
    expect(coverAcBonus('three-quarters', 'dnd-5e-2014')).toBe(5);
    expect(coverAcBonus('half', 'dnd-3.5e')).toBe(4);
    expect(coverAcBonus('three-quarters', 'pf1e')).toBe(4);
    expect(coverAcBonus('half', 'pf2e')).toBe(2);
    expect(coverAcBonus('three-quarters', 'pf2e')).toBe(4);
    expect(coverAcBonus('none', 'dnd-5e-2014')).toBe(0);
    expect(coverAcBonus('total', 'dnd-5e-2014')).toBe(0); // total is "no shot", not a bonus
  });
});

describe('resolveSceneAttack — cover', () => {
  it('a wall directly between gives total cover: no line of sight', () => {
    const attacker = token('archer', 0, 0);
    const target = token('foe', 4, 0);
    const blocked = scene(attacker, target, [wall(2, 0)]);
    // Sanity: this geometry is total cover.
    expect(coverBetween({ x: 0, y: 0 }, { x: 4, y: 0 }, (c) => c.x === 2 && c.y === 0)).toBe(
      'total'
    );

    const out = resolveSceneAttack({
      state: blocked,
      attackerId: 'archer',
      targetId: 'foe',
      resolveStats: STATS,
      seed: 'shot',
    });
    expect(out.hit).toBe(false);
    expect(out.intent).toBeUndefined();
    expect(out.log).toMatch(/no line of sight/i);
  });

  it('partial cover raises the effective AC by the cover bonus', () => {
    const attacker = token('archer', 0, 1);
    const target = token('foe', 4, 0);
    const level = coverBetween({ x: 0, y: 1 }, { x: 4, y: 0 }, (c) => c.x === 2 && c.y === 0);
    // This offset yields partial (not total, not none) cover.
    expect(level === 'half' || level === 'three-quarters').toBe(true);
    const bonus = coverAcBonus(level, 'dnd-5e-2014');

    const out = resolveSceneAttack({
      state: scene(attacker, target, [wall(2, 0)]),
      attackerId: 'archer',
      targetId: 'foe',
      resolveStats: STATS,
      seed: 'shot',
    });
    // The log reports the cover-boosted AC (base 10 + bonus) and notes it.
    expect(out.log).toContain(`vs AC ${10 + bonus} incl. +${bonus} cover`);
  });

  it('no wall means no cover penalty', () => {
    const out = resolveSceneAttack({
      state: scene(token('archer', 0, 0), token('foe', 4, 0), []),
      attackerId: 'archer',
      targetId: 'foe',
      resolveStats: STATS,
      seed: 'shot',
    });
    expect(out.log).toContain('vs AC 10)');
    expect(out.log).not.toMatch(/cover/i);
  });
});
