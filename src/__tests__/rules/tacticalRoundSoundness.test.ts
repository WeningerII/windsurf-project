import { describe, it, expect } from 'vitest';

import {
  appendSceneEvent,
  applySceneIntents,
  createSceneDocument,
  foldSceneEvents,
  resolveSceneAction,
} from '../../scene/runtime';
import {
  makeEffectId,
  runSceneRound,
  type EffectInstance,
  type ResolveCombatStats,
} from '../../rules';
import { footprintCells } from '../../scene/grid';
import type { SceneDocument, SceneToken } from '../../types/core/scene';

/**
 * PHASE 11 (RFC 003): autonomous-round soundness. The tactical executor now
 * plans obstacle-aware paths whose destination is always a legal scene
 * placement, so every move the round driver proposes survives the scene
 * runtime's re-validation in `applySceneIntents`. This closes the gap where a
 * straight-line move the scene would REJECT (a large creature's footprint
 * overlapping a target) still let the attack it "enabled" land — phantom damage.
 */

const SID = 'dnd-5e-2014' as const;

const atk = (bonus: number): EffectInstance => ({
  id: makeEffectId(SID, 'attack', bonus),
  systemId: SID,
  target: 'attack',
  operation: 'add',
  value: bonus,
  stackPolicy: 'sum',
  source: { kind: 'system', label: 'atk' },
  label: 'atk',
});

const dmg = (sides: number, flat: number): EffectInstance[] => [
  {
    id: 'die',
    systemId: SID,
    target: 'damage',
    operation: 'add-die',
    value: sides,
    stackPolicy: 'sum',
    source: { kind: 'item', label: 'w' },
    label: 'die',
  },
  {
    id: 'flat',
    systemId: SID,
    target: 'damage',
    operation: 'add',
    value: flat,
    stackPolicy: 'sum',
    source: { kind: 'system', label: 'str' },
    label: 'flat',
  },
];

// An ogre attacks; the hero is a player-controlled target the round leaves alone.
const resolveStats: ResolveCombatStats = (token) => {
  if (token.kind === 'monster') {
    return {
      attackEffects: [atk(50)],
      damageEffects: dmg(6, 4),
      armorClass: 10,
      reach: 1,
      speedCells: 6,
    };
  }
  return {
    attackEffects: [atk(0)],
    damageEffects: dmg(1, 0),
    armorClass: 12,
    reach: 1,
    speedCells: 6,
  };
};

function sceneWith(...tokens: SceneToken[]): SceneDocument {
  let scene = createSceneDocument({
    id: 'sound',
    name: 'Soundness',
    systemId: SID,
    seed: 'sound-seed',
    grid: { width: 12, height: 12, cellSize: 5 },
  });
  for (const token of tokens) {
    const placed = resolveSceneAction(
      scene,
      { type: 'place-token', token },
      { eventId: `p-${token.id}` }
    );
    expect(placed.issues.filter((issue) => issue.severity === 'error')).toHaveLength(0);
    scene = appendSceneEvent(scene, placed.event!);
  }
  return scene;
}

describe('autonomous round soundness — every proposed move is a legal placement', () => {
  // A size-2 ogre at the corner must close on a size-1 hero. The straight-line
  // approach would anchor the ogre's 2x2 footprint over the hero's cell — a move
  // the scene rejects — yet still fire the attack. Pathfinding routes to a free,
  // in-reach anchor instead.
  const ogre: SceneToken = {
    id: 'ogre',
    name: 'Ogre',
    kind: 'monster',
    position: { x: 0, y: 0 },
    size: 2,
    hp: { current: 40, max: 40, temp: 0 },
  };
  const hero: SceneToken = {
    id: 'hero',
    name: 'Hero',
    kind: 'character',
    position: { x: 5, y: 5 },
    size: 1,
    hp: { current: 30, max: 30, temp: 0 },
    playerControlled: true,
  };

  it('produces zero rejected intents and never overlaps the target', () => {
    const scene = sceneWith(ogre, hero);
    const outcome = runSceneRound({
      state: foldSceneEvents(scene).state,
      resolveStats,
      seed: 'round-seed',
      round: 1,
    });

    let counter = 0;
    const { events, rejected } = applySceneIntents(scene, outcome.intents, {
      eventIdFactory: () => `ev-${(counter += 1)}`,
    });

    // The soundness invariant: nothing the round proposed is illegal.
    expect(rejected).toEqual([]);
    expect(events.length).toBe(outcome.intents.length);

    // The ogre actually relocated to a legal anchor whose footprint is clear of
    // the hero (no stacking, no overlap).
    let applied = scene;
    for (const event of events) applied = appendSceneEvent(applied, event);
    const ogrePos = foldSceneEvents(applied).state.tokens.ogre.position;
    expect(ogrePos).not.toEqual({ x: 0, y: 0 });
    const ogreCells = new Set(footprintCells(ogrePos, 2).map((c) => `${c.x}:${c.y}`));
    expect(ogreCells.has('5:5')).toBe(false);
  });

  it('replays identically for the same seeds', () => {
    const scene = sceneWith(ogre, hero);
    const run = () =>
      runSceneRound({ state: foldSceneEvents(scene).state, resolveStats, seed: 'r', round: 1 })
        .intents;
    expect(JSON.stringify(run())).toEqual(JSON.stringify(run()));
  });
});
