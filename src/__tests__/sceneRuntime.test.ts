import { describe, expect, it } from 'vitest';
import type { SceneDocument, SceneToken } from '../types/core/scene';
import {
  appendSceneEvent,
  createSceneDocument,
  foldSceneEvents,
  resolveSceneAction,
} from '../scene/runtime';
import { createSeededRng } from '../scene/seededRng';

const NOW = new Date('2026-05-01T12:00:00.000Z');

function makeToken(id: string, x: number, y: number): SceneToken {
  return {
    id,
    name: id,
    kind: 'character',
    position: { x, y },
    size: 1,
  };
}

function appendResolved(
  scene: SceneDocument,
  result: ReturnType<typeof resolveSceneAction>
): SceneDocument {
  expect(result.issues).toEqual([]);
  expect(result.event).toBeDefined();
  return appendSceneEvent(scene, result.event!);
}

describe('scene runtime', () => {
  it('folds typed scene events into deterministic state', () => {
    let scene = createSceneDocument({
      id: 'scene-1',
      name: 'Ambush',
      systemId: 'dnd-5e-2024',
      grid: { width: 8, height: 8 },
      seed: 'ambush-seed',
      now: NOW,
    });

    scene = appendResolved(
      scene,
      resolveSceneAction(
        scene,
        { type: 'place-token', token: makeToken('hero', 1, 1) },
        { eventId: 'event-1', createdAt: NOW }
      )
    );
    scene = appendResolved(
      scene,
      resolveSceneAction(
        scene,
        { type: 'move-token', tokenId: 'hero', position: { x: 2, y: 3 } },
        { eventId: 'event-2', createdAt: NOW }
      )
    );
    scene = appendResolved(
      scene,
      resolveSceneAction(
        scene,
        {
          type: 'add-marker',
          marker: {
            id: 'fire',
            kind: 'hazard',
            label: 'Fire',
            position: { x: 4, y: 4 },
            width: 2,
            height: 2,
          },
        },
        { eventId: 'event-3', createdAt: NOW }
      )
    );

    const { state, issues } = foldSceneEvents(scene);
    expect(issues).toEqual([]);
    expect(state.tokens.hero.position).toEqual({ x: 2, y: 3 });
    expect(state.markers.fire).toMatchObject({ label: 'Fire', kind: 'hazard' });

    const refold = foldSceneEvents(scene);
    expect(refold.state).toEqual(state);
  });

  it('rejects invalid action intents before they become events', () => {
    let scene = createSceneDocument({
      id: 'scene-2',
      name: 'Boundary Test',
      systemId: 'dnd-5e-2024',
      grid: { width: 3, height: 3 },
      now: NOW,
    });
    scene = appendResolved(
      scene,
      resolveSceneAction(
        scene,
        { type: 'place-token', token: makeToken('hero', 1, 1) },
        { eventId: 'event-1', createdAt: NOW }
      )
    );

    const invalidMove = resolveSceneAction(
      scene,
      { type: 'move-token', tokenId: 'hero', position: { x: 8, y: 1 } },
      { eventId: 'event-2', createdAt: NOW }
    );

    expect(invalidMove.event).toBeUndefined();
    expect(invalidMove.issues).toMatchObject([
      {
        code: 'scene-coordinate-out-of-bounds',
        severity: 'error',
        eventId: 'event-2',
      },
    ]);
  });

  it('advances initiative through normal events without hidden mutation', () => {
    let scene = createSceneDocument({
      id: 'scene-3',
      name: 'Initiative',
      systemId: 'dnd-5e-2024',
      now: NOW,
    });
    scene = appendResolved(
      scene,
      resolveSceneAction(
        scene,
        { type: 'place-token', token: makeToken('hero', 1, 1) },
        { eventId: 'event-1', createdAt: NOW }
      )
    );
    scene = appendResolved(
      scene,
      resolveSceneAction(
        scene,
        { type: 'place-token', token: makeToken('bandit', 2, 1) },
        { eventId: 'event-2', createdAt: NOW }
      )
    );
    scene = appendResolved(
      scene,
      resolveSceneAction(
        scene,
        {
          type: 'set-initiative',
          entries: [
            { tokenId: 'hero', value: 18 },
            { tokenId: 'bandit', value: 12 },
          ],
          activeTokenId: 'hero',
        },
        { eventId: 'event-3', createdAt: NOW }
      )
    );
    scene = appendResolved(
      scene,
      resolveSceneAction(scene, { type: 'advance-turn' }, { eventId: 'event-4', createdAt: NOW })
    );
    scene = appendResolved(
      scene,
      resolveSceneAction(scene, { type: 'advance-turn' }, { eventId: 'event-5', createdAt: NOW })
    );

    const { state } = foldSceneEvents(scene);
    expect(state.activeTokenId).toBe('hero');
    expect(state.round).toBe(2);
  });

  it('produces repeatable seeded random rolls', () => {
    const first = createSeededRng('scene-seed');
    const second = createSeededRng('scene-seed');

    expect([first.rollDie(20), first.rollDie(20), first.rollDie(6)]).toEqual([
      second.rollDie(20),
      second.rollDie(20),
      second.rollDie(6),
    ]);
  });

  it('REGRESSION (02-M1): advance-turn with empty initiative is rejected, not a round bump', () => {
    let scene = createSceneDocument({
      id: 'scene-empty-init',
      name: 'No Order',
      systemId: 'dnd-5e-2024',
      now: NOW,
    });
    scene = appendResolved(
      scene,
      resolveSceneAction(
        scene,
        { type: 'place-token', token: makeToken('hero', 1, 1) },
        { eventId: 'event-1', createdAt: NOW }
      )
    );

    // A token exists but initiative was never set: the intent is rejected with
    // an honest issue instead of building an event that inflates the round.
    const rejected = resolveSceneAction(
      scene,
      { type: 'advance-turn' },
      { eventId: 'event-2', createdAt: NOW }
    );
    expect(rejected.event).toBeUndefined();
    expect(rejected.issues).toMatchObject([{ code: 'scene-initiative-empty', severity: 'error' }]);

    const { state } = foldSceneEvents(scene);
    expect(state.round).toBe(1);
  });

  it('REGRESSION (02-M1): a historical turn.advanced event with no nextTokenId folds to round unchanged', () => {
    // Simulate an event log recorded BEFORE the intent-level guard existed:
    // clicking Next Turn with empty initiative stored payload {} (undefined
    // nextTokenId). It must still fold cleanly — no validation error, no round
    // inflation (previously undefined === undefined bumped the round).
    let scene = createSceneDocument({
      id: 'scene-legacy',
      name: 'Legacy Log',
      systemId: 'dnd-5e-2024',
      now: NOW,
    });
    scene = appendResolved(
      scene,
      resolveSceneAction(
        scene,
        { type: 'place-token', token: makeToken('hero', 1, 1) },
        { eventId: 'event-1', createdAt: NOW }
      )
    );
    const legacyScene: SceneDocument = {
      ...scene,
      events: [
        ...scene.events,
        {
          id: 'legacy-advance',
          sequence: scene.events.length + 1,
          createdAt: NOW,
          type: 'turn.advanced',
          payload: {},
        },
      ],
    };

    const { state, issues } = foldSceneEvents(legacyScene);
    expect(issues).toEqual([]); // the EVENT stays replayable
    expect(state.round).toBe(1); // round unchanged (was 2 before the fix)
    expect(state.activeTokenId).toBeUndefined();
  });

  it('REGRESSION (05-L5): folded marker effects are deep copies, not aliases of the event payload', () => {
    let scene = createSceneDocument({
      id: 'scene-terrain',
      name: 'Terrain',
      systemId: 'dnd-5e-2024',
      grid: { width: 8, height: 8 },
      now: NOW,
    });
    scene = appendResolved(
      scene,
      resolveSceneAction(
        scene,
        {
          type: 'add-marker',
          marker: {
            id: 'water',
            kind: 'terrain',
            label: 'Deep Water',
            position: { x: 1, y: 1 },
            width: 2,
            height: 2,
            effects: [
              { target: 'movement-cost', operation: 'multiply', value: 2, label: 'deep water' },
            ],
          },
        },
        { eventId: 'event-1', createdAt: NOW }
      )
    );

    const first = foldSceneEvents(scene);
    const firstEffects = first.state.markers.water.effects!;
    expect(firstEffects).toHaveLength(1);

    // Mutating a folded state's effects must NOT leak into the event log or
    // any later fold (the array used to be shared by reference).
    firstEffects[0].value = 999;
    firstEffects.push({ target: 'attack', operation: 'add', value: 5, label: 'corruption' });

    expect(scene.events[0].type).toBe('marker.added');
    const payloadMarker =
      scene.events[0].type === 'marker.added' ? scene.events[0].payload.marker : undefined;
    expect(payloadMarker?.effects).toEqual([
      { target: 'movement-cost', operation: 'multiply', value: 2, label: 'deep water' },
    ]);

    const second = foldSceneEvents(scene);
    expect(second.state.markers.water.effects).toEqual([
      { target: 'movement-cost', operation: 'multiply', value: 2, label: 'deep water' },
    ]);
  });
});
