import { describe, expect, it } from 'vitest';
import type { SceneDocument, SceneEvent, SceneState, SceneToken } from '../types/core/scene';
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

describe('scene runtime — hardening (corrupt persisted data)', () => {
  it('folds a non-array checkLog/oracleLog in initialState to [] without throwing', () => {
    const scene = createSceneDocument({
      id: 'h-logs',
      name: 'Corrupt',
      systemId: 'dnd-5e-2024',
      now: NOW,
    });
    // A hand-edited / corrupt import could carry a non-array here; the folder
    // must coerce rather than call `.map` on a string and crash.
    const corrupt: SceneDocument = {
      ...scene,
      initialState: {
        ...scene.initialState,
        checkLog: 'boom' as unknown as SceneState['checkLog'],
        oracleLog: 42 as unknown as SceneState['oracleLog'],
      },
    };

    const { state, issues } = foldSceneEvents(corrupt);
    expect(state.checkLog).toEqual([]);
    expect(state.oracleLog).toEqual([]);
    expect(issues).toEqual([]);
  });

  it('skips a corrupt event with a recorded issue instead of crashing the fold', () => {
    let scene = createSceneDocument({
      id: 'h-event',
      name: 'Corrupt',
      systemId: 'dnd-5e-2024',
      grid: { width: 6, height: 6 },
      now: NOW,
    });
    scene = appendResolved(
      scene,
      resolveSceneAction(
        scene,
        { type: 'place-token', token: makeToken('hero', 1, 1) },
        { eventId: 'e1', createdAt: NOW }
      )
    );
    // A token.added event whose payload is missing `token` would throw inside
    // the validator/applier; injected directly to simulate a corrupt log.
    const corrupt: SceneDocument = {
      ...scene,
      events: [
        ...scene.events,
        {
          id: 'bad',
          sequence: scene.events.length + 1,
          createdAt: NOW,
          type: 'token.added',
          payload: {} as never,
        },
      ],
    };

    const { state, issues } = foldSceneEvents(corrupt);
    expect(issues.some((issue) => issue.code === 'scene-event-malformed')).toBe(true);
    // The valid earlier event still folded.
    expect(state.tokens.hero).toBeDefined();
  });

  it('never throws folding a corrupt (empty-payload) event of any type', () => {
    // Locks the replay-safety guarantee for every current event type — and, by
    // construction, any future type that forgets to harden its own validator.
    const types: SceneEvent['type'][] = [
      'token.added',
      'token.moved',
      'token.removed',
      'token.damaged',
      'token.conditions-set',
      'marker.added',
      'marker.removed',
      'initiative.set',
      'turn.advanced',
      'check.rolled',
      'oracle.consulted',
    ];
    for (const type of types) {
      const scene = createSceneDocument({
        id: `ht-${type}`,
        name: 'x',
        systemId: 'dnd-5e-2024',
        now: NOW,
      });
      const corrupt: SceneDocument = {
        ...scene,
        events: [{ id: 'bad', sequence: 1, createdAt: NOW, type, payload: {} as never }],
      };
      expect(() => foldSceneEvents(corrupt), `folding corrupt ${type}`).not.toThrow();
    }
  });

  it('coerces a corrupt round to a valid integer so turn.advanced never yields NaN', () => {
    let scene = createSceneDocument({
      id: 'h-round',
      name: 'Corrupt',
      systemId: 'dnd-5e-2024',
      now: NOW,
    });
    // An import missing/garbling `round` would otherwise compute undefined + 1.
    scene = {
      ...scene,
      initialState: {
        ...scene.initialState,
        round: undefined as unknown as SceneState['round'],
      },
    };
    // Two combatants + initiative so a full cycle wraps and bumps the round.
    scene = appendResolved(
      scene,
      resolveSceneAction(
        scene,
        { type: 'place-token', token: makeToken('a', 1, 1) },
        { eventId: 'e1', createdAt: NOW }
      )
    );
    scene = appendResolved(
      scene,
      resolveSceneAction(
        scene,
        { type: 'place-token', token: makeToken('b', 2, 1) },
        { eventId: 'e2', createdAt: NOW }
      )
    );
    scene = appendResolved(
      scene,
      resolveSceneAction(
        scene,
        {
          type: 'set-initiative',
          entries: [
            { tokenId: 'a', value: 12 },
            { tokenId: 'b', value: 8 },
          ],
          activeTokenId: 'a',
        },
        { eventId: 'e3', createdAt: NOW }
      )
    );
    expect(foldSceneEvents(scene).state.round).toBe(1);

    scene = appendResolved(
      scene,
      resolveSceneAction(scene, { type: 'advance-turn' }, { eventId: 'e4', createdAt: NOW })
    );
    scene = appendResolved(
      scene,
      resolveSceneAction(scene, { type: 'advance-turn' }, { eventId: 'e5', createdAt: NOW })
    );
    const { state } = foldSceneEvents(scene);
    expect(state.round).toBe(2);
    expect(Number.isNaN(state.round)).toBe(false);
  });

  it('coerces a corrupt grid (non-positive dimensions) to a usable one on fold', () => {
    const scene = createSceneDocument({
      id: 'h-grid',
      name: 'Corrupt',
      systemId: 'dnd-5e-2024',
      now: NOW,
    });
    const corrupt: SceneDocument = {
      ...scene,
      initialState: {
        ...scene.initialState,
        grid: { type: 'square', width: 0, height: -4, cellSize: 0 },
      },
    };
    const { state } = foldSceneEvents(corrupt);
    expect(state.grid.width).toBeGreaterThan(0);
    expect(state.grid.height).toBeGreaterThan(0);
    expect(state.grid.cellSize).toBeGreaterThan(0);
  });

  it('does not throw when an event entry is not an object at all', () => {
    const scene = createSceneDocument({
      id: 'h-nonobj',
      name: 'Corrupt',
      systemId: 'dnd-5e-2024',
      now: NOW,
    });
    const corrupt: SceneDocument = {
      ...scene,
      events: ['not an event' as unknown as SceneDocument['events'][number]],
    };
    expect(() => foldSceneEvents(corrupt)).not.toThrow();
    expect(foldSceneEvents(corrupt).issues.length).toBeGreaterThan(0);
  });
});

describe('scene runtime — checks', () => {
  function freshScene(): SceneDocument {
    return createSceneDocument({
      id: 'check-scene',
      name: 'Exploration',
      systemId: 'dnd-5e-2024',
      grid: { width: 6, height: 6 },
      now: NOW,
    });
  }

  it('rolls a check into the log with a deterministic, event-id-seeded die', () => {
    let scene = freshScene();
    const expectedDie = createSeededRng('roll-1').rollDie(20);
    scene = appendResolved(
      scene,
      resolveSceneAction(
        scene,
        { type: 'roll-check', label: 'Perception', modifier: 3, dc: expectedDie + 3 },
        { eventId: 'roll-1', createdAt: NOW }
      )
    );

    const { state, issues } = foldSceneEvents(scene);
    expect(issues).toEqual([]);
    expect(state.checkLog).toHaveLength(1);
    expect(state.checkLog[0]).toMatchObject({
      id: 'roll-1',
      label: 'Perception',
      die: expectedDie,
      modifier: 3,
      total: expectedDie + 3,
      outcome: 'success', // dc was total exactly -> success (>=)
    });

    // Replay is identical.
    expect(foldSceneEvents(scene).state).toEqual(state);
  });

  it('records a DC-less check as unresolved', () => {
    let scene = freshScene();
    scene = appendResolved(
      scene,
      resolveSceneAction(
        scene,
        { type: 'roll-check', label: 'Insight', modifier: 0 },
        { eventId: 'roll-2', createdAt: NOW }
      )
    );
    const { state } = foldSceneEvents(scene);
    expect(state.checkLog[0].outcome).toBe('unresolved');
    expect(state.checkLog[0].dc).toBeUndefined();
  });

  it('rejects a check intent with a blank label, bad modifier, or unknown actor', () => {
    const scene = freshScene();
    const blank = resolveSceneAction(
      scene,
      { type: 'roll-check', label: '   ', modifier: 1 },
      { eventId: 'r', createdAt: NOW }
    );
    expect(blank.event).toBeUndefined();
    expect(blank.issues[0]).toMatchObject({ code: 'scene-check-label-required' });

    const badMod = resolveSceneAction(
      scene,
      { type: 'roll-check', label: 'Athletics', modifier: Number.NaN },
      { eventId: 'r', createdAt: NOW }
    );
    expect(badMod.issues[0]).toMatchObject({ code: 'scene-check-modifier-invalid' });

    const ghost = resolveSceneAction(
      scene,
      { type: 'roll-check', label: 'Stealth', modifier: 2, actorTokenId: 'nobody' },
      { eventId: 'r', createdAt: NOW }
    );
    expect(ghost.issues[0]).toMatchObject({ code: 'scene-check-actor-unknown' });
  });

  it('links a check to an existing actor token', () => {
    let scene = freshScene();
    scene = appendResolved(
      scene,
      resolveSceneAction(
        scene,
        { type: 'place-token', token: makeToken('rogue', 1, 1) },
        { eventId: 'place-1', createdAt: NOW }
      )
    );
    scene = appendResolved(
      scene,
      resolveSceneAction(
        scene,
        { type: 'roll-check', label: 'Stealth', modifier: 7, dc: 10, actorTokenId: 'rogue' },
        { eventId: 'roll-3', createdAt: NOW }
      )
    );
    const { state } = foldSceneEvents(scene);
    expect(state.checkLog[0].actorTokenId).toBe('rogue');
  });

  it('keeps the higher of two dice with advantage and records the discard', () => {
    let scene = freshScene();
    const rng = createSeededRng('adv-1');
    const a = rng.rollDie(20);
    const b = rng.rollDie(20);
    scene = appendResolved(
      scene,
      resolveSceneAction(
        scene,
        { type: 'roll-check', label: 'Athletics', modifier: 0, mode: 'advantage' },
        { eventId: 'adv-1', createdAt: NOW }
      )
    );
    const entry = foldSceneEvents(scene).state.checkLog[0];
    expect(entry.die).toBe(Math.max(a, b));
    expect(entry.discardedDie).toBe(Math.min(a, b));
    expect(entry.mode).toBe('advantage');
    expect(entry.total).toBe(Math.max(a, b)); // modifier 0
  });

  it('keeps the lower of two dice with disadvantage', () => {
    let scene = freshScene();
    const rng = createSeededRng('dis-1');
    const a = rng.rollDie(20);
    const b = rng.rollDie(20);
    scene = appendResolved(
      scene,
      resolveSceneAction(
        scene,
        { type: 'roll-check', label: 'Stealth', modifier: 2, mode: 'disadvantage' },
        { eventId: 'dis-1', createdAt: NOW }
      )
    );
    const entry = foldSceneEvents(scene).state.checkLog[0];
    expect(entry.die).toBe(Math.min(a, b));
    expect(entry.discardedDie).toBe(Math.max(a, b));
    expect(entry.mode).toBe('disadvantage');
  });
});

describe('scene runtime — oracle', () => {
  function freshScene(): SceneDocument {
    return createSceneDocument({
      id: 'oracle-scene',
      name: 'Mystery',
      systemId: 'dnd-5e-2024',
      now: NOW,
    });
  }

  it('consults the oracle into the log with a deterministic, event-id-seeded d100', () => {
    let scene = freshScene();
    const expectedRoll = createSeededRng('ask-1').rollDie(100);
    scene = appendResolved(
      scene,
      resolveSceneAction(
        scene,
        { type: 'consult-oracle', question: 'Is the door trapped?', odds: 'likely' },
        { eventId: 'ask-1', createdAt: NOW }
      )
    );

    const { state, issues } = foldSceneEvents(scene);
    expect(issues).toEqual([]);
    expect(state.oracleLog).toHaveLength(1);
    expect(state.oracleLog[0]).toMatchObject({
      id: 'ask-1',
      question: 'Is the door trapped?',
      odds: 'likely',
      roll: expectedRoll,
      target: 70,
    });

    // Replay is identical.
    expect(foldSceneEvents(scene).state).toEqual(state);
  });

  it('omits a blank question and rejects an unknown odds level', () => {
    let scene = freshScene();
    scene = appendResolved(
      scene,
      resolveSceneAction(
        scene,
        { type: 'consult-oracle', question: '   ', odds: 'even' },
        { eventId: 'ask-2', createdAt: NOW }
      )
    );
    expect(foldSceneEvents(scene).state.oracleLog[0].question).toBeUndefined();

    const bad = resolveSceneAction(
      scene,
      // A persisted/forged intent with an unrecognized odds level.
      { type: 'consult-oracle', odds: 'coin-flip' as never },
      { eventId: 'ask-3', createdAt: NOW }
    );
    expect(bad.event).toBeUndefined();
    expect(bad.issues[0]).toMatchObject({ code: 'scene-oracle-odds-invalid' });
  });
});

describe('scene runtime — token footprints', () => {
  function makeSizedToken(id: string, x: number, y: number, size: number): SceneToken {
    return { id, name: id, kind: 'monster', position: { x, y }, size };
  }
  function place(scene: SceneDocument, token: SceneToken, eventId: string) {
    return resolveSceneAction(scene, { type: 'place-token', token }, { eventId, createdAt: NOW });
  }

  it('rejects a multi-cell token whose footprint runs off the grid', () => {
    const scene = createSceneDocument({
      id: 'fp-1',
      name: 'Edge',
      systemId: 'dnd-5e-2024',
      grid: { width: 3, height: 3 },
      now: NOW,
    });
    // The 2x2 ogre's anchor (2,2) is in bounds but its footprint reaches (3,3).
    const result = place(scene, makeSizedToken('ogre', 2, 2, 2), 'e1');
    expect(result.event).toBeUndefined();
    expect(result.issues[0]).toMatchObject({ code: 'scene-footprint-out-of-bounds' });
  });

  it("rejects placing a token inside a large creature's footprint", () => {
    let scene = createSceneDocument({
      id: 'fp-2',
      name: 'Overlap',
      systemId: 'dnd-5e-2024',
      grid: { width: 6, height: 6 },
      now: NOW,
    });
    scene = appendResolved(scene, place(scene, makeSizedToken('ogre', 0, 0, 2), 'e1'));
    const intruder = place(scene, makeSizedToken('goblin', 1, 1, 1), 'e2');
    expect(intruder.event).toBeUndefined();
    expect(intruder.issues[0]).toMatchObject({ code: 'scene-footprint-occupied' });
  });

  it('still allows two size-1 tokens to share a cell (stacking)', () => {
    let scene = createSceneDocument({
      id: 'fp-3',
      name: 'Stack',
      systemId: 'dnd-5e-2024',
      grid: { width: 6, height: 6 },
      now: NOW,
    });
    scene = appendResolved(scene, place(scene, makeSizedToken('a', 2, 2, 1), 'e1'));
    const stacked = place(scene, makeSizedToken('b', 2, 2, 1), 'e2');
    expect(stacked.issues).toEqual([]);
    expect(stacked.event).toBeDefined();
  });

  it("rejects moving a token onto a large creature's footprint", () => {
    let scene = createSceneDocument({
      id: 'fp-4',
      name: 'MoveOverlap',
      systemId: 'dnd-5e-2024',
      grid: { width: 6, height: 6 },
      now: NOW,
    });
    scene = appendResolved(scene, place(scene, makeSizedToken('ogre', 0, 0, 2), 'e1'));
    scene = appendResolved(scene, place(scene, makeSizedToken('goblin', 4, 4, 1), 'e2'));
    const move = resolveSceneAction(
      scene,
      { type: 'move-token', tokenId: 'goblin', position: { x: 1, y: 0 } },
      { eventId: 'e3', createdAt: NOW }
    );
    expect(move.event).toBeUndefined();
    expect(move.issues[0]).toMatchObject({ code: 'scene-footprint-occupied' });
  });
});
