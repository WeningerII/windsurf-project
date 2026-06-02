import { describe, it, expect } from 'vitest';

import {
  appendSceneEvent,
  createSceneDocument,
  foldSceneEvents,
  resolveSceneAction,
} from '../../scene/runtime';
import { resolveSceneSocialAction, tokenAttitude } from '../../rules';
import type { SceneActionIntent, SceneDocument, SceneToken } from '../../types/core/scene';

/**
 * The scene social bridge: a speaker addresses the scene's NPC tokens, each
 * reacts on its own attitude, and shifts land through the event-sourced
 * set-attitude path (so they persist and replay).
 */

const NOW = new Date('2026-05-01T12:00:00.000Z');
let seq = 0;

function apply(scene: SceneDocument, intent: SceneActionIntent): SceneDocument {
  const result = resolveSceneAction(scene, intent, { eventId: `evt-${seq++}`, createdAt: NOW });
  expect(result.issues).toEqual([]);
  return appendSceneEvent(scene, result.event!);
}

function npc(id: string, x: number, attitude: string): SceneToken {
  return { id, name: id, kind: 'npc', position: { x, y: 0 }, size: 1, attitude };
}

function buildScene(): SceneDocument {
  let scene = createSceneDocument({
    id: 'scene-1',
    name: 'Parley',
    systemId: 'dnd-5e-2024',
    grid: { width: 12, height: 8 },
    seed: 'parley-seed',
    now: NOW,
  });
  scene = apply(scene, {
    type: 'place-token',
    token: { id: 'bard', name: 'Bard', kind: 'character', position: { x: 0, y: 0 }, size: 1 },
  });
  scene = apply(scene, { type: 'place-token', token: npc('guard', 2, 'hostile') });
  scene = apply(scene, { type: 'place-token', token: npc('clerk', 3, 'indifferent') });
  scene = apply(scene, { type: 'place-token', token: npc('friend', 4, 'friendly') });
  return scene;
}

describe('set-attitude scene event', () => {
  it('folds a set-attitude action into the token state', () => {
    let scene = createSceneDocument({
      id: 's',
      name: 'S',
      systemId: 'dnd-5e-2024',
      grid: { width: 8, height: 8 },
      seed: 'seed',
      now: NOW,
    });
    scene = apply(scene, { type: 'place-token', token: npc('innkeeper', 1, 'unfriendly') });
    scene = apply(scene, { type: 'set-attitude', tokenId: 'innkeeper', attitude: 'friendly' });
    expect(foldSceneEvents(scene).state.tokens.innkeeper.attitude).toBe('friendly');
  });
});

describe('resolveSceneSocialAction', () => {
  it('addresses every NPC and shifts each from its own attitude', () => {
    const state = foldSceneEvents(buildScene()).state;
    const outcome = resolveSceneSocialAction({
      state,
      speakerId: 'bard',
      modifier: 100, // a rousing speech that lands on everyone
      baseDC: 15,
      approach: 'persuasion',
      seed: 'speech',
    });
    // One set-attitude intent per NPC that moved (all three shift up a step).
    expect(outcome.intents).toHaveLength(3);
    expect(outcome.intents.every((i) => i.type === 'set-attitude')).toBe(true);
    const after = Object.fromEntries(outcome.outcomes.map((o) => [o.npcId, o.after]));
    expect(after).toEqual({ guard: 'unfriendly', clerk: 'friendly', friend: 'helpful' });
  });

  it('the shifts persist when applied as scene events', () => {
    let scene = buildScene();
    const outcome = resolveSceneSocialAction({
      state: foldSceneEvents(scene).state,
      speakerId: 'bard',
      modifier: 100,
      baseDC: 15,
      seed: 'speech',
    });
    for (const intent of outcome.intents) scene = apply(scene, intent);
    const state = foldSceneEvents(scene).state;
    expect(tokenAttitude(state.tokens.friend)).toBe('helpful');
    expect(tokenAttitude(state.tokens.guard)).toBe('unfriendly');
  });

  it('reports when there are no NPCs to address', () => {
    const state = foldSceneEvents(
      apply(
        createSceneDocument({
          id: 's2',
          name: 'Empty',
          systemId: 'dnd-5e-2024',
          grid: { width: 8, height: 8 },
          seed: 'seed',
          now: NOW,
        }),
        {
          type: 'place-token',
          token: { id: 'bard', name: 'Bard', kind: 'character', position: { x: 0, y: 0 }, size: 1 },
        }
      )
    ).state;
    const outcome = resolveSceneSocialAction({
      state,
      speakerId: 'bard',
      modifier: 5,
      baseDC: 15,
      seed: 's',
    });
    expect(outcome.intents).toEqual([]);
    expect(outcome.log[0]).toMatch(/no NPCs/i);
  });
});
