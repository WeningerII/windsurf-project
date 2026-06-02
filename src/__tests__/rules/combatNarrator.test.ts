import { describe, it, expect } from 'vitest';

import {
  narrateAttack,
  runSceneRound,
  type EffectInstance,
  type ResolveCombatStats,
} from '../../rules';
import type { SceneState, SceneToken } from '../../types/core/scene';

/**
 * Deterministic combat narration — the no-key fallback for the narration half
 * of the resolution/narration split. Same outcome + seed → same prose; it never
 * authors mechanics, only describes them.
 */

describe('narrateAttack', () => {
  const base = { attacker: 'Aria', target: 'Goblin', seed: 'narr' };

  it('is deterministic for the same outcome and seed', () => {
    const a = narrateAttack({ ...base, tone: 'crit', damage: 12 });
    const b = narrateAttack({ ...base, tone: 'crit', damage: 12 });
    expect(a).toBe(b);
  });

  it('names both combatants and, on a hit, the damage', () => {
    const hit = narrateAttack({ ...base, tone: 'hit', damage: 7 });
    expect(hit).toContain('Aria');
    expect(hit).toContain('Goblin');
    expect(hit).toContain('7');
  });

  it('a miss reads as a miss and carries no damage number', () => {
    const miss = narrateAttack({ ...base, tone: 'miss' });
    expect(miss).toContain('Aria');
    expect(miss).toContain('Goblin');
    expect(miss).not.toMatch(/\d/);
  });

  it('varies the phrasing across different exchanges', () => {
    // Across enough pairings the pool produces more than one phrasing.
    const variants = new Set(
      ['a', 'b', 'c', 'd', 'e'].map((id) =>
        narrateAttack({ attacker: id, target: 'foe', tone: 'hit', damage: 5, seed: 'v' })
      )
    );
    expect(variants.size).toBeGreaterThan(1);
  });
});

describe('runSceneRound narration', () => {
  const atk = (v: number): EffectInstance => ({
    id: `a${v}`,
    systemId: 'dnd-5e-2014',
    target: 'attack',
    operation: 'add',
    value: v,
    stackPolicy: 'sum',
    source: { kind: 'custom', id: 'x', label: 'x' },
    label: 'a',
    category: 'other',
  });
  const dmg: EffectInstance[] = [
    {
      id: 'd',
      systemId: 'dnd-5e-2014',
      target: 'damage',
      operation: 'add',
      value: 6,
      stackPolicy: 'sum',
      source: { kind: 'custom', id: 'x', label: 'x' },
      label: 'd',
      category: 'other',
    },
  ];
  function token(id: string, x: number, kind: SceneToken['kind']): SceneToken {
    return { id, name: id, kind, position: { x, y: 0 }, size: 1, hp: { current: 20, max: 20 } };
  }
  const state: SceneState = {
    sceneId: 's',
    name: 'S',
    systemId: 'dnd-5e-2014',
    grid: { width: 8, height: 8, cellSize: 5 },
    tokens: { hero: token('hero', 0, 'character'), goblin: token('goblin', 1, 'monster') },
    markers: {},
    initiative: [],
    round: 1,
    seed: 's',
  };
  const stats: ResolveCombatStats = () => ({
    attackEffects: [atk(20)],
    damageEffects: dmg,
    armorClass: 1,
    reach: 1,
  });

  it('produces prose narration alongside the terse log', () => {
    const out = runSceneRound({ state, resolveStats: stats, seed: 'r', round: 1 });
    expect(out.narration.length).toBeGreaterThan(0);
    // The narration is prose, not the mechanical "rolled X vs AC" log.
    expect(out.narration.join(' ')).not.toMatch(/vs AC/);
    // The terse log is still available and mechanical.
    expect(out.log.join(' ')).toMatch(/hits|crits|misses/);
  });
});
