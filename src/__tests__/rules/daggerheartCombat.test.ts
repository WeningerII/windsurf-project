import { describe, it, expect } from 'vitest';

import {
  buildDaggerheartCombatant,
  resolveSceneAttack,
  type EffectInstance,
  type ResolveCombatStats,
} from '../../rules';
import type { CharacterDocument, SystemDataModel } from '../../types/core/document';
import type { SceneState, SceneToken } from '../../types/core/scene';

/**
 * Daggerheart in combat: attack vs Evasion, then MARK 1-3 HP slots by the
 * target's damage thresholds (not raw HP subtraction).
 */

function dhDoc(): CharacterDocument<SystemDataModel> {
  return {
    id: 'rogue',
    name: 'Rogue',
    systemId: 'daggerheart',
    system: {
      attributes: { agility: 3, strength: 1, finesse: 2, instinct: 0, presence: 0, knowledge: 0 },
      evasion: 12,
      majorThreshold: 7,
      severeThreshold: 12,
      hitPoints: { current: 6, max: 6 },
    },
  } as unknown as CharacterDocument<SystemDataModel>;
}

describe('buildDaggerheartCombatant', () => {
  it('reads Evasion, thresholds, and HP slots from the sheet', () => {
    const c = buildDaggerheartCombatant(dhDoc(), { tokenId: 't', position: { x: 0, y: 0 } });
    expect(c.evasion).toBe(12);
    expect(c.thresholds).toEqual({ major: 7, severe: 12 });
    expect(c.token.hp).toEqual({ current: 6, max: 6, temp: 0 });
    // Attack uses the best trait (+3 Agility).
    expect(c.attackEffects.find((e) => e.target === 'attack')?.value).toBe(3);
  });
});

describe('resolveSceneAttack — Daggerheart marks HP slots by threshold', () => {
  const attack = (value: number): EffectInstance => ({
    id: `atk-${value}`,
    systemId: 'daggerheart',
    target: 'attack',
    operation: 'add',
    value,
    stackPolicy: 'sum',
    source: { kind: 'custom', id: 'x', label: 'x' },
    label: 'atk',
    category: 'other',
  });
  const dmg: EffectInstance[] = [
    {
      id: 'd-die',
      systemId: 'daggerheart',
      target: 'damage',
      operation: 'add-die',
      value: 8,
      stackPolicy: 'sum',
      source: { kind: 'custom', id: 'x', label: 'x' },
      label: 'd8',
      category: 'other',
    },
    {
      id: 'd-flat',
      systemId: 'daggerheart',
      target: 'damage',
      operation: 'add',
      value: 4,
      stackPolicy: 'sum',
      source: { kind: 'custom', id: 'x', label: 'x' },
      label: '+4',
      category: 'other',
    },
  ];

  function token(id: string): SceneToken {
    return {
      id,
      name: id,
      kind: 'character',
      position: { x: 0, y: 0 },
      size: 1,
      hp: { current: 6, max: 6 },
    };
  }
  function scene(): SceneState {
    return {
      sceneId: 's',
      name: 'Daggerheart',
      systemId: 'daggerheart',
      grid: { width: 8, height: 8, cellSize: 5 },
      tokens: { hero: token('hero'), foe: token('foe') },
      markers: {},
      initiative: [],
      round: 1,
      seed: 'seed',
    };
  }

  function stats(
    evasion: number,
    thresholds: { major: number; severe: number }
  ): ResolveCombatStats {
    return () => ({
      attackEffects: [attack(20)], // high bonus → reliably beats a low Evasion
      damageEffects: dmg,
      armorClass: evasion,
      reach: 1,
      thresholds,
    });
  }

  it('a hit at/above Severe marks 3 HP', () => {
    const out = resolveSceneAttack({
      state: scene(),
      attackerId: 'hero',
      targetId: 'foe',
      resolveStats: stats(1, { major: 1, severe: 2 }), // damage 1d8+4 ≥ 5 ≥ severe
      seed: 's',
    });
    expect(out.hit).toBe(true);
    const damages = out.intent && 'damages' in out.intent ? out.intent.damages : [];
    expect(damages[0]).toEqual({ tokenId: 'foe', amount: 3 });
  });

  it('a hit below Major marks 1 HP', () => {
    const out = resolveSceneAttack({
      state: scene(),
      attackerId: 'hero',
      targetId: 'foe',
      resolveStats: stats(1, { major: 100, severe: 200 }), // damage never reaches Major
      seed: 's',
    });
    expect(out.hit).toBe(true);
    const damages = out.intent && 'damages' in out.intent ? out.intent.damages : [];
    expect(damages[0]).toEqual({ tokenId: 'foe', amount: 1 });
  });

  it('a miss vs high Evasion produces no damage', () => {
    const out = resolveSceneAttack({
      state: scene(),
      attackerId: 'hero',
      targetId: 'foe',
      resolveStats: stats(100, { major: 7, severe: 12 }), // unreachable Evasion
      seed: 's',
    });
    expect(out.hit).toBe(false);
    expect(out.intent).toBeUndefined();
  });
});
