import { describe, it, expect } from 'vitest';

import { dnd5e2024MonstersById } from '../../data/dnd/5e-2024/monsters';
import {
  areaShapeForAction,
  cellInArea,
  DEFAULT_CONE_HALF_ANGLE_DEG,
  monsterSaveActions,
  resolveSceneAreaEffect,
  tokensInArea,
  type ResolveCombatStats,
  type SceneAreaAction,
} from '../../rules';
import type { SceneState, SceneToken } from '../../types/core/scene';

/**
 * Wiring save-based area actions (breath weapons / every AoE shape) into scene
 * combat: the cone geometry, the area→grid-shape mapping, and the participant-
 * aware scene bridge that catches N creatures, rolls shared damage once, saves
 * each independently, and emits a single apply-damage intent.
 */

const ORIGIN = { x: 0, y: 0 };

function token(
  id: string,
  x: number,
  y: number,
  kind: SceneToken['kind'] = 'character'
): SceneToken {
  return {
    id,
    name: id,
    kind,
    position: { x, y },
    size: 1,
    hp: { current: 20, max: 20, temp: 0 },
  };
}

function sceneWith(tokens: SceneToken[]): SceneState {
  return {
    sceneId: 'scene-1',
    name: 'Test',
    systemId: 'dnd-5e-2024',
    grid: { width: 20, height: 20, cellSize: 5 },
    tokens: Object.fromEntries(tokens.map((t) => [t.id, t])),
    markers: {},
    initiative: [],
    round: 1,
    seed: 'seed',
  };
}

describe('cone area shape (square grid, RAW width = distance)', () => {
  const cone = { kind: 'cone', origin: ORIGIN, aim: { x: 3, y: 0 }, length: 3 } as const;

  it('includes cells along the aim axis within range', () => {
    expect(cellInArea({ x: 1, y: 0 }, cone)).toBe(true);
    expect(cellInArea({ x: 3, y: 0 }, cone)).toBe(true);
  });

  it('excludes the apex (origin) and cells beyond range', () => {
    expect(cellInArea({ x: 0, y: 0 }, cone)).toBe(false);
    expect(cellInArea({ x: 4, y: 0 }, cone)).toBe(false);
  });

  it('widens with distance (atan(0.5) half-angle): (2,1) in, (1,1) and (2,2) out', () => {
    expect(cellInArea({ x: 2, y: 1 }, cone)).toBe(true); // on the RAW boundary
    expect(cellInArea({ x: 1, y: 1 }, cone)).toBe(false); // 45° — outside the spread
    expect(cellInArea({ x: 2, y: 2 }, cone)).toBe(false);
  });

  it('aims in arbitrary directions (diagonal)', () => {
    const diag = { kind: 'cone', origin: ORIGIN, aim: { x: 3, y: 3 }, length: 4 } as const;
    expect(cellInArea({ x: 2, y: 2 }, diag)).toBe(true);
    expect(cellInArea({ x: 3, y: 0 }, diag)).toBe(false);
  });

  it('a degenerate cone (aim === origin) catches nothing', () => {
    const degenerate = { kind: 'cone', origin: ORIGIN, aim: ORIGIN, length: 3 } as const;
    expect(cellInArea({ x: 1, y: 0 }, degenerate)).toBe(false);
  });

  it('defaults to the RAW cone half-angle, atan(0.5) ≈ 26.57°', () => {
    expect(DEFAULT_CONE_HALF_ANGLE_DEG).toBeCloseTo(26.565, 2);
  });
});

describe('areaShapeForAction maps every template to a grid shape', () => {
  const aim = { x: 4, y: 0 };
  it('cone emanates from origin toward aim', () => {
    const shape = areaShapeForAction({ shape: 'cone', lengthCells: 3 }, ORIGIN, aim);
    expect(shape).toEqual({ kind: 'cone', origin: ORIGIN, aim, length: 3 });
  });
  it('line extends length cells in the aim direction', () => {
    const shape = areaShapeForAction({ shape: 'line', lengthCells: 4 }, ORIGIN, aim);
    expect(shape).toEqual({ kind: 'line', origin: ORIGIN, to: { x: 4, y: 0 } });
  });
  it('burst/sphere is centered on the aim', () => {
    const shape = areaShapeForAction({ shape: 'burst', radiusCells: 2 }, ORIGIN, aim);
    expect(shape).toEqual({ kind: 'burst', origin: aim, radius: 2 });
  });
  it('cube is centered on the aim', () => {
    const shape = areaShapeForAction({ shape: 'cube', sizeCells: 4 }, ORIGIN, aim);
    expect(shape).toEqual({ kind: 'rect', origin: { x: 2, y: -2 }, width: 4, height: 4 });
  });
  it('no template degenerates to a single-cell burst on the aim', () => {
    const shape = areaShapeForAction(undefined, ORIGIN, aim);
    expect(shape).toEqual({ kind: 'burst', origin: aim, radius: 0 });
  });
});

describe('resolveSceneAreaEffect — a dragon breathes on N creatures', () => {
  const dragon = dnd5e2024MonstersById['red-dragon-wyrmling-2024'];
  const breath = monsterSaveActions(dragon).find((s) => /breath/i.test(s.name))!;

  // Dragon at origin breathing east; three creatures in the 15-ft (3-cell) cone,
  // one far away. saveBonus forces deterministic save/fail per token.
  const saveBonusById: Record<string, number> = {
    fighter: -100, // fails -> full
    cleric: -100, // fails -> full
    rogue: 100, // saves -> half
    bystander: 0,
  };
  const resolveStats: ResolveCombatStats = (t) => ({
    attackEffects: [],
    damageEffects: [],
    armorClass: 10,
    reach: 1,
    saveBonus: () => saveBonusById[t.id] ?? 0,
  });

  function run() {
    const state = sceneWith([
      token('dragon', 0, 0, 'monster'),
      token('fighter', 1, 0),
      token('cleric', 2, 0),
      token('rogue', 2, 1), // on the cone boundary
      token('bystander', 8, 8), // well outside
    ]);
    return resolveSceneAreaEffect({
      state,
      sourceId: 'dragon',
      action: breath,
      aim: { x: 3, y: 0 },
      resolveStats,
      seed: 'breath-seed',
      cause: breath.name,
    });
  }

  it('catches everyone in the cone, excludes the emitter and those outside', () => {
    const out = run();
    expect(out.affectedIds.sort()).toEqual(['cleric', 'fighter', 'rogue']);
    expect(out.affectedIds).not.toContain('dragon');
    expect(out.affectedIds).not.toContain('bystander');
  });

  it('rolls shared damage once and emits a single apply-damage intent', () => {
    const out = run();
    expect(out.intent?.type).toBe('apply-damage');
    const damages = out.intent && 'damages' in out.intent ? out.intent.damages : [];
    // Failed saves take full (shared) damage; the saver takes half — all from one roll.
    const full = damages.find((d) => d.tokenId === 'fighter')!.amount;
    expect(damages.find((d) => d.tokenId === 'cleric')!.amount).toBe(full);
    expect(damages.find((d) => d.tokenId === 'rogue')!.amount).toBe(Math.floor(full / 2));
  });

  it('is deterministic for a fixed (scene, seed)', () => {
    expect(JSON.stringify(run().intent)).toBe(JSON.stringify(run().intent));
  });

  it('friendly fire: a same-faction creature in the area is caught too', () => {
    const state = sceneWith([
      token('dragon', 0, 0, 'monster'),
      token('kobold', 1, 0, 'monster'), // ally of the dragon, but in the cone
    ]);
    const out = resolveSceneAreaEffect({
      state,
      sourceId: 'dragon',
      action: breath,
      aim: { x: 3, y: 0 },
      resolveStats,
      seed: 's',
    });
    expect(out.affectedIds).toEqual(['kobold']);
  });

  it('the emitter is excluded even when inside its own burst', () => {
    const burst: SceneAreaAction = { ...breath, area: { shape: 'burst', radiusCells: 3 } };
    const state = sceneWith([token('dragon', 0, 0, 'monster'), token('goblin', 1, 0, 'monster')]);
    const out = resolveSceneAreaEffect({
      state,
      sourceId: 'dragon',
      action: burst,
      aim: { x: 1, y: 0 }, // burst centered next to the dragon — dragon is within radius 3
      resolveStats,
      seed: 's',
    });
    expect(out.affectedIds).toEqual(['goblin']);
  });

  it('catches no one when the area is empty', () => {
    const state = sceneWith([token('dragon', 0, 0, 'monster'), token('far', 10, 10)]);
    const out = resolveSceneAreaEffect({
      state,
      sourceId: 'dragon',
      action: breath,
      aim: { x: 3, y: 0 },
      resolveStats,
      seed: 's',
    });
    expect(out.affectedIds).toEqual([]);
    expect(out.intent).toBeUndefined();
    expect(tokensInArea(state, out.shape).filter((t) => t.id !== 'dragon')).toEqual([]);
  });
});
