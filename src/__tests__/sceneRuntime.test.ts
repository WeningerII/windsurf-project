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
});

describe('scene runtime — damage and healing', () => {
  function hpToken(id: string, hp: { current: number; max: number; temp?: number }): SceneToken {
    return { id, name: id, kind: 'character', position: { x: 1, y: 1 }, size: 1, hp };
  }

  it('spends temp HP first on damage and caps healing at max', () => {
    let scene = createSceneDocument({
      id: 'heal-scene',
      name: 'Infirmary',
      systemId: 'dnd-5e-2024',
      grid: { width: 8, height: 8 },
      seed: 'heal',
      now: NOW,
    });
    scene = appendResolved(
      scene,
      resolveSceneAction(
        scene,
        { type: 'place-token', token: hpToken('hero', { current: 20, max: 30, temp: 5 }) },
        { eventId: 'evt-place', createdAt: NOW }
      )
    );

    // 8 damage: temp (5) absorbs first, the remaining 3 comes off current.
    scene = appendResolved(
      scene,
      resolveSceneAction(
        scene,
        { type: 'apply-damage', damages: [{ tokenId: 'hero', amount: 8 }] },
        { eventId: 'evt-dmg', createdAt: NOW }
      )
    );
    expect(foldSceneEvents(scene).state.tokens.hero.hp).toEqual({ current: 17, max: 30, temp: 0 });

    // Healing is a negative amount; it restores current and never exceeds max.
    scene = appendResolved(
      scene,
      resolveSceneAction(
        scene,
        { type: 'apply-damage', cause: 'heal', damages: [{ tokenId: 'hero', amount: -20 }] },
        { eventId: 'evt-heal', createdAt: NOW }
      )
    );
    expect(foldSceneEvents(scene).state.tokens.hero.hp).toEqual({ current: 30, max: 30, temp: 0 });
  });
});

describe('scene runtime — token statuses', () => {
  function plainToken(id: string): SceneToken {
    return { id, name: id, kind: 'character', position: { x: 1, y: 1 }, size: 1 };
  }

  it('normalizes, de-duplicates, and can clear named conditions', () => {
    let scene = createSceneDocument({
      id: 'status-scene',
      name: 'Hexed',
      systemId: 'dnd-5e-2014',
      grid: { width: 8, height: 8 },
      seed: 'hex',
      now: NOW,
    });
    scene = appendResolved(
      scene,
      resolveSceneAction(
        scene,
        { type: 'place-token', token: plainToken('hero') },
        { eventId: 'evt-place', createdAt: NOW }
      )
    );

    // Mixed case, blanks, and a duplicate all normalize to a clean set.
    scene = appendResolved(
      scene,
      resolveSceneAction(
        scene,
        { type: 'set-statuses', tokenId: 'hero', statuses: ['Prone', 'poisoned', '  ', 'PRONE'] },
        { eventId: 'evt-set', createdAt: NOW }
      )
    );
    expect(foldSceneEvents(scene).state.tokens.hero.statuses).toEqual(['prone', 'poisoned']);

    // An empty set clears them (authoritative replace, not merge).
    scene = appendResolved(
      scene,
      resolveSceneAction(
        scene,
        { type: 'set-statuses', tokenId: 'hero', statuses: [] },
        { eventId: 'evt-clear', createdAt: NOW }
      )
    );
    expect(foldSceneEvents(scene).state.tokens.hero.statuses).toEqual([]);
  });
});
