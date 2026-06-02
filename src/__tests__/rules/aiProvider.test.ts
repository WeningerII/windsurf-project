import { describe, it, expect } from 'vitest';

import {
  deterministicAiProvider,
  resolveAiProvider,
  runSceneRound,
  type AiProvider,
  type EffectInstance,
  type ResolveCombatStats,
} from '../../rules';
import type { SceneState, SceneToken } from '../../types/core/scene';

/**
 * The AI provider gateway: with no key it resolves to the deterministic
 * fallback (the strategist defers to scoring, the narrator is the seeded
 * template pool). A real provider plugs into the same seam and genuinely steers
 * the round — without ever authoring mechanics.
 */

describe('resolveAiProvider', () => {
  it('returns the deterministic fallback when no key is configured', () => {
    expect(resolveAiProvider()).toBe(deterministicAiProvider);
    expect(resolveAiProvider({})).toBe(deterministicAiProvider);
  });

  it('the fallback defers the choice and narrates deterministically', () => {
    expect(deterministicAiProvider.strategist([], [])).toBeUndefined();
    const prose = deterministicAiProvider.narrator({
      attacker: 'Aria',
      target: 'Goblin',
      tone: 'hit',
      damage: 5,
      seed: 's',
    });
    expect(prose).toContain('Aria');
    expect(prose).toContain('Goblin');
  });
});

describe('a custom provider steers the round through the same seam', () => {
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
  function token(id: string, x: number, kind: SceneToken['kind'], hp = 30): SceneToken {
    return { id, name: id, kind, position: { x, y: 0 }, size: 1, hp: { current: hp, max: 30 } };
  }
  // Hero between two foes, both in reach. The wounded one scores higher (default).
  const state: SceneState = {
    sceneId: 's',
    name: 'S',
    systemId: 'dnd-5e-2014',
    grid: { width: 8, height: 8, cellSize: 5 },
    tokens: {
      hero: token('hero', 1, 'character'),
      wounded: token('wounded', 0, 'monster', 1),
      healthy: token('healthy', 2, 'monster', 30),
    },
    markers: {},
    initiative: [{ tokenId: 'hero', value: 20 }],
    round: 1,
    seed: 's',
  };
  const stats: ResolveCombatStats = () => ({
    attackEffects: [atk(20)], // reliably hits
    damageEffects: dmg,
    armorClass: 1,
    reach: 1,
  });

  it("honors the provider's strategist and narrator", () => {
    const provider: AiProvider = {
      // Always pick the healthy foe (a legal target), overriding the default.
      strategist: (legal) => legal.find((t) => t.tokenId === 'healthy')?.tokenId,
      narrator: () => 'A thunderous blow!',
    };
    const out = runSceneRound({ state, resolveStats: stats, seed: 'r', round: 1, provider });

    // The hero's damage landed on the strategist's pick, not the default.
    const heroTurn = out.result.turns.find((t) => t.tokenId === 'hero')!;
    const dmgIntent = heroTurn.intent?.type === 'apply-damage' ? heroTurn.intent : undefined;
    expect(dmgIntent?.damages.some((d) => d.tokenId === 'healthy')).toBe(true);
    // The narration came from the provider's narrator.
    expect(out.narration).toContain('A thunderous blow!');
  });
});
