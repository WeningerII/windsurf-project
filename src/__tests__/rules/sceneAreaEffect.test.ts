import { describe, it, expect } from 'vitest';

import { dnd5e2024MonstersById } from '../../data/dnd/5e-2024/monsters';
import {
  areaOfEffectToShape,
  areaShapeForAction,
  cellInArea,
  DEFAULT_CONE_HALF_ANGLE_DEG,
  diagonalRuleForSystem,
  gridDistance,
  monsterSaveActions,
  pf2eSaveDegree,
  resolveAreaEffect,
  resolveSceneAreaEffect,
  tokensInArea,
  type ResolveCombatStats,
} from '../../rules';
import type { AreaOfEffect } from '../../types/core/common';
import type { SceneMarker, SceneState, SceneToken } from '../../types/core/scene';

/**
 * Wiring save-based area actions (every AoE geometry, across the d20 family) into
 * scene combat: the grid geometry for all seven canonical `AreaOfEffect` shapes,
 * the per-system diagonal rule, the participant-aware scene bridge, and the
 * per-system save model (5e binary vs PF2e four-degree basic).
 */

const ORIGIN = { x: 0, y: 0 };

function token(
  id: string,
  x: number,
  y: number,
  kind: SceneToken['kind'] = 'character'
): SceneToken {
  return { id, name: id, kind, position: { x, y }, size: 1, hp: { current: 20, max: 20, temp: 0 } };
}

function sceneWith(
  tokens: SceneToken[],
  systemId = 'dnd-5e-2024',
  markers: SceneMarker[] = []
): SceneState {
  return {
    sceneId: 'scene-1',
    name: 'Test',
    systemId,
    grid: { width: 30, height: 30, cellSize: 5 },
    tokens: Object.fromEntries(tokens.map((t) => [t.id, t])),
    markers: Object.fromEntries(markers.map((m) => [m.id, m])),
    initiative: [],
    round: 1,
    seed: 'seed',
  };
}

/** A wall marker (blocks line of effect) occupying a vertical span at column x. */
function wall(id: string, x: number, y: number, height: number): SceneMarker {
  return {
    id,
    kind: 'terrain',
    label: 'Wall',
    position: { x, y },
    width: 1,
    height,
    effects: [{ target: 'cover', operation: 'set', value: 'total', label: 'Wall' }],
  };
}

describe('diagonal rule (RAW differs by system)', () => {
  it('5e counts every square as one (Chebyshev)', () => {
    expect(diagonalRuleForSystem('dnd-5e-2024')).toBe('chebyshev');
    expect(gridDistance({ x: 0, y: 0 }, { x: 3, y: 3 }, 'chebyshev')).toBe(3);
  });
  it('d20-legacy / Pathfinder alternate diagonals 1-2-1', () => {
    expect(diagonalRuleForSystem('pf1e')).toBe('alternating');
    expect(diagonalRuleForSystem('dnd-3.5e')).toBe('alternating');
    expect(diagonalRuleForSystem('pf2e')).toBe('alternating');
    // 3 diagonal steps = 5+10+5 ft = 20 ft = 4 cells.
    expect(gridDistance({ x: 0, y: 0 }, { x: 3, y: 3 }, 'alternating')).toBe(4);
    // 4 diagonals = 5+10+5+10 = 30 ft = 6 cells.
    expect(gridDistance({ x: 0, y: 0 }, { x: 4, y: 4 }, 'alternating')).toBe(6);
  });
});

describe('cone geometry (RAW square grid, width = distance)', () => {
  const cone = { kind: 'cone', origin: ORIGIN, aim: { x: 3, y: 0 }, length: 3 } as const;
  it('includes the axis within range, excludes the apex and beyond range', () => {
    expect(cellInArea({ x: 1, y: 0 }, cone)).toBe(true);
    expect(cellInArea({ x: 3, y: 0 }, cone)).toBe(true);
    expect(cellInArea({ x: 0, y: 0 }, cone)).toBe(false);
    expect(cellInArea({ x: 4, y: 0 }, cone)).toBe(false);
  });
  it('widens with distance: (2,1) in, (1,1)/(2,2) out', () => {
    expect(cellInArea({ x: 2, y: 1 }, cone)).toBe(true);
    expect(cellInArea({ x: 1, y: 1 }, cone)).toBe(false);
    expect(cellInArea({ x: 2, y: 2 }, cone)).toBe(false);
  });
  it('degenerate cone (aim === origin) catches nothing', () => {
    expect(
      cellInArea({ x: 1, y: 0 }, { kind: 'cone', origin: ORIGIN, aim: ORIGIN, length: 3 })
    ).toBe(false);
  });
  it('defaults to the RAW half-angle atan(0.5) ≈ 26.57°', () => {
    expect(DEFAULT_CONE_HALF_ANGLE_DEG).toBeCloseTo(26.565, 2);
  });
});

describe('thick line (width)', () => {
  it('width 1 (5-ft line) is the cells the segment passes through, origin included', () => {
    const line = { kind: 'line', origin: ORIGIN, to: { x: 3, y: 0 }, width: 1 } as const;
    expect(cellInArea({ x: 0, y: 0 }, line)).toBe(true);
    expect(cellInArea({ x: 2, y: 0 }, line)).toBe(true);
    expect(cellInArea({ x: 2, y: 1 }, line)).toBe(false);
  });
  it('width 3 catches cells off the centerline', () => {
    const line = { kind: 'line', origin: ORIGIN, to: { x: 4, y: 0 }, width: 3 } as const;
    expect(cellInArea({ x: 2, y: 1 }, line)).toBe(true);
    expect(cellInArea({ x: 2, y: 2 }, line)).toBe(false); // beyond half-width 1.5
  });
});

describe('areaOfEffectToShape maps all seven canonical shapes to the grid', () => {
  const aim = { x: 6, y: 0 };
  const cases: Array<[AreaOfEffect, ReturnType<typeof areaOfEffectToShape>]> = [
    [
      { type: 'cone', feet: 15 },
      { kind: 'cone', origin: ORIGIN, aim, length: 3 },
    ],
    [
      { type: 'cube', feet: 20 },
      { kind: 'rect', origin: { x: 4, y: -2 }, width: 4, height: 4 },
    ],
    [
      { type: 'line', length: 30, width: 5 },
      { kind: 'line', origin: ORIGIN, to: { x: 6, y: 0 }, width: 1 },
    ],
    [
      { type: 'sphere', radius: 20 },
      { kind: 'burst', origin: aim, radius: 4 },
    ],
    [
      { type: 'spread', radius: 20 },
      { kind: 'burst', origin: aim, radius: 4 },
    ],
    [
      { type: 'cylinder', radius: 20, height: 40 },
      { kind: 'burst', origin: aim, radius: 4 },
    ],
    // Emanation radiates from the EMITTER (origin), not the aimed point.
    [
      { type: 'emanation', radius: 10 },
      { kind: 'burst', origin: ORIGIN, radius: 2 },
    ],
  ];
  it.each(cases)('%o → %o', (aoe, expected) => {
    expect(areaOfEffectToShape(aoe, ORIGIN, aim)).toEqual(expected);
  });
});

describe('PF2e basic save degrees (CRB)', () => {
  it('beat DC by 10 → critical success; meet → success; miss → failure; miss by 10 → crit failure', () => {
    expect(pf2eSaveDegree(10, 30, 20)).toBe('critical-success');
    expect(pf2eSaveDegree(10, 22, 20)).toBe('success');
    expect(pf2eSaveDegree(10, 18, 20)).toBe('failure');
    expect(pf2eSaveDegree(10, 9, 20)).toBe('critical-failure');
  });
  it('nat 20 improves one degree, nat 1 worsens one degree', () => {
    expect(pf2eSaveDegree(20, 18, 20)).toBe('success'); // failure → success
    expect(pf2eSaveDegree(1, 22, 20)).toBe('failure'); // success → failure
  });
  // Degree → damage mapping (independent of which roll actually came up).
  const pf2eExpectedDamage = (roll: number, total: number, dc: number, shared: number): number => {
    switch (pf2eSaveDegree(roll, total, dc)) {
      case 'critical-success':
        return 0;
      case 'success':
        return Math.floor(shared / 2);
      case 'failure':
        return shared;
      case 'critical-failure':
        return shared * 2;
    }
  };

  it('resolveAreaEffect (pf2e-basic): every target takes damage matching its OWN degree', () => {
    const dragon = dnd5e2024MonstersById['red-dragon-wyrmling-2024'];
    const breath = monsterSaveActions(dragon).find((s) => /breath/i.test(s.name))!;
    const dc = 18;
    const res = resolveAreaEffect({
      sourceId: 'd',
      seed: 'pf2e-degrees',
      damageEffects: breath.damageEffects,
      saveDC: dc,
      saveModel: 'pf2e-basic',
      // A spread of bonuses so the four degrees all appear across the targets.
      participants: [
        { targetId: 'a', saveBonus: 100 },
        { targetId: 'b', saveBonus: 9 },
        { targetId: 'c', saveBonus: 0 },
        { targetId: 'd', saveBonus: -100 },
        { targetId: 'e', saveBonus: 13 },
        { targetId: 'f', saveBonus: -6 },
      ],
    });
    for (const p of res.perTarget) {
      expect(p.degree).toBeDefined();
      expect(p.damageTaken).toBe(pf2eExpectedDamage(p.saveRoll, p.saveTotal, dc, res.sharedDamage));
    }
    // Critical failure (double) is reachable only under this model — prove the
    // spread actually exercised more than the binary half/full outcomes.
    const degrees = new Set(res.perTarget.map((p) => p.degree));
    expect(degrees.size).toBeGreaterThan(1);
  });
});

describe('resolveSceneAreaEffect — a dragon breathes on N creatures', () => {
  const dragon = dnd5e2024MonstersById['red-dragon-wyrmling-2024'];
  const breath = monsterSaveActions(dragon).find((s) => /breath/i.test(s.name))!;

  const saveBonusById: Record<string, number> = {
    fighter: -100,
    cleric: -100,
    rogue: 100,
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
      token('rogue', 2, 1),
      token('bystander', 8, 8),
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
  });

  it('rolls shared damage once → one apply-damage intent; saver takes half', () => {
    const out = run();
    const damages = out.intent && 'damages' in out.intent ? out.intent.damages : [];
    const full = damages.find((d) => d.tokenId === 'fighter')!.amount;
    expect(damages.find((d) => d.tokenId === 'cleric')!.amount).toBe(full);
    expect(damages.find((d) => d.tokenId === 'rogue')!.amount).toBe(Math.floor(full / 2));
  });

  it('is deterministic for a fixed (scene, seed)', () => {
    expect(JSON.stringify(run().intent)).toBe(JSON.stringify(run().intent));
  });

  it('friendly fire: a same-faction creature in the area is caught', () => {
    const state = sceneWith([token('dragon', 0, 0, 'monster'), token('kobold', 1, 0, 'monster')]);
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

  it('an emanation/aura-shaped action is self-centered (ignores aim direction)', () => {
    const auraAction = { ...breath, area: { type: 'emanation', radius: 10 } as AreaOfEffect };
    const state = sceneWith([
      token('dragon', 5, 5, 'monster'),
      token('near', 6, 6), // within 10 ft (2 cells) of the dragon
      token('far', 0, 0), // outside
    ]);
    const out = resolveSceneAreaEffect({
      state,
      sourceId: 'dragon',
      action: auraAction,
      aim: { x: 0, y: 0 }, // aim is irrelevant for an emanation
      resolveStats,
      seed: 's',
    });
    expect(out.affectedIds).toEqual(['near']);
  });

  it('a wall blocks line of effect: a creature behind it is not caught', () => {
    // Dragon at origin breathes east; B sits behind a wall at (2,0), A in the open.
    const state = sceneWith(
      [token('dragon', 0, 0, 'monster'), token('A', 1, 0), token('B', 3, 0)],
      'dnd-5e-2024',
      [wall('w', 2, 0, 1)]
    );
    const out = resolveSceneAreaEffect({
      state,
      sourceId: 'dragon',
      action: breath, // 15-ft cone reaches both A (1,0) and B (3,0)
      aim: { x: 3, y: 0 },
      resolveStats,
      seed: 'cover',
    });
    expect(out.affectedIds).toContain('A');
    expect(out.affectedIds).not.toContain('B'); // total cover → excluded
    expect(out.log[0]).toMatch(/behind cover/);
  });

  it('a SPREAD bends around the wall and catches the creature a cone could not', () => {
    const state = sceneWith([token('dragon', 0, 0, 'monster'), token('B', 3, 0)], 'dnd-5e-2024', [
      wall('w', 2, 0, 1),
    ]);
    const spreadAction = { ...breath, area: { type: 'spread', radius: 40 } as AreaOfEffect };
    const out = resolveSceneAreaEffect({
      state,
      sourceId: 'dragon',
      action: spreadAction,
      aim: { x: 0, y: 0 }, // spread centered on the dragon, fills around the wall
      resolveStats,
      seed: 'spread',
    });
    expect(out.affectedIds).toContain('B'); // reached by flooding around the wall
  });

  it('a PF2e scene routes to the four-degree basic save (not the binary model)', () => {
    const state = sceneWith([token('dragon', 0, 0, 'monster'), token('rogue', 1, 0)], 'pf2e');
    const action = { ...breath, saveDC: 18 };
    const saveBonus = 7;
    const out = resolveSceneAreaEffect({
      state,
      sourceId: 'dragon',
      action,
      aim: { x: 3, y: 0 },
      resolveStats: () => ({
        attackEffects: [],
        damageEffects: [],
        armorClass: 10,
        reach: 1,
        saveBonus: () => saveBonus,
      }),
      seed: 'route',
    });
    // Independently resolve the same (seed, source, target) under pf2e-basic and
    // confirm the bridge selected that model purely from the scene's systemId.
    const independent = resolveAreaEffect({
      sourceId: 'dragon',
      seed: 'route',
      damageEffects: action.damageEffects,
      saveDC: 18,
      saveModel: 'pf2e-basic',
      participants: [{ targetId: 'rogue', saveBonus }],
    });
    const rogueDmg =
      (out.intent && 'damages' in out.intent ? out.intent.damages : []).find(
        (d) => d.tokenId === 'rogue'
      )?.amount ?? 0;
    expect(independent.perTarget[0].degree).toBeDefined();
    expect(rogueDmg).toBe(independent.perTarget[0].damageTaken);
  });
});

describe('areaShapeForAction (bridge wrapper) + tokensInArea selection', () => {
  it('an action with no template degenerates to a single-cell burst on the aim', () => {
    const shape = areaShapeForAction(undefined, ORIGIN, { x: 4, y: 0 });
    expect(shape).toEqual({ kind: 'burst', origin: { x: 4, y: 0 }, radius: 0 });
    const state = sceneWith([token('a', 4, 0), token('b', 5, 0)]);
    expect(tokensInArea(state, shape).map((t) => t.id)).toEqual(['a']);
  });
  it('delegates to the canonical mapper for a real template', () => {
    expect(areaShapeForAction({ type: 'cone', feet: 15 }, ORIGIN, { x: 3, y: 0 })).toEqual(
      areaOfEffectToShape({ type: 'cone', feet: 15 }, ORIGIN, { x: 3, y: 0 })
    );
  });
});
