import { describe, it, expect } from 'vitest';

import {
  appendSceneEvent,
  createSceneDocument,
  foldSceneEvents,
  resolveSceneAction,
} from '../../scene/runtime';
import type { SceneDocument, SceneToken } from '../../types/core/scene';

/**
 * PHASE 4 (RFC 003): combat lands on the grid. A typed `apply-damage` action
 * becomes a `token.damaged` event that the pure fold applies to token HP. The
 * resolved amount is stored on the event (RNG happens before), so replay is
 * deterministic.
 */

function combatant(id: string, hp: number, x = 1, y = 1): SceneToken {
  return {
    id,
    name: id,
    kind: 'monster',
    position: { x, y },
    size: 1,
    hp: { current: hp, max: hp, temp: 0 },
  };
}

function sceneWith(...tokens: SceneToken[]): SceneDocument {
  let scene = createSceneDocument({ id: 'combat', name: 'Combat', systemId: 'dnd-5e-2014' });
  for (const token of tokens) {
    const result = resolveSceneAction(
      scene,
      { type: 'place-token', token },
      { eventId: `place-${token.id}` }
    );
    expect(result.event).toBeDefined();
    scene = appendSceneEvent(scene, result.event!);
  }
  return scene;
}

function hpOf(scene: SceneDocument, tokenId: string): number {
  return foldSceneEvents(scene).state.tokens[tokenId].hp!.current;
}

describe('scene apply-damage action', () => {
  it('damages a token through a validated event', () => {
    let scene = sceneWith(combatant('goblin', 7));
    const result = resolveSceneAction(
      scene,
      {
        type: 'apply-damage',
        actorId: 'fighter',
        damages: [{ tokenId: 'goblin', amount: 5 }],
        cause: 'longsword',
      },
      { eventId: 'dmg-1' }
    );
    expect(result.issues.filter((i) => i.severity === 'error')).toHaveLength(0);
    scene = appendSceneEvent(scene, result.event!);
    expect(hpOf(scene, 'goblin')).toBe(2);
  });

  it('floors HP at 0 and never goes negative', () => {
    let scene = sceneWith(combatant('goblin', 7));
    const result = resolveSceneAction(
      scene,
      { type: 'apply-damage', damages: [{ tokenId: 'goblin', amount: 100 }] },
      { eventId: 'dmg-big' }
    );
    scene = appendSceneEvent(scene, result.event!);
    expect(hpOf(scene, 'goblin')).toBe(0);
  });

  it('temp HP absorbs damage first', () => {
    const tok = combatant('hero', 20);
    tok.hp = { current: 20, max: 20, temp: 5 };
    let scene = sceneWith(tok);
    const result = resolveSceneAction(
      scene,
      { type: 'apply-damage', damages: [{ tokenId: 'hero', amount: 8 }] },
      { eventId: 'dmg-temp' }
    );
    scene = appendSceneEvent(scene, result.event!);
    const hp = foldSceneEvents(scene).state.tokens.hero.hp!;
    expect(hp.temp).toBe(0);
    expect(hp.current).toBe(17); // 5 absorbed, 3 to current
  });

  it('healing (negative amount) restores up to max', () => {
    const tok = combatant('hero', 20);
    tok.hp = { current: 4, max: 20, temp: 0 };
    let scene = sceneWith(tok);
    const result = resolveSceneAction(
      scene,
      { type: 'apply-damage', damages: [{ tokenId: 'hero', amount: -50 }] },
      { eventId: 'heal' }
    );
    scene = appendSceneEvent(scene, result.event!);
    expect(hpOf(scene, 'hero')).toBe(20);
  });

  it('applies damage to MANY tokens in one event (N participants)', () => {
    let scene = sceneWith(combatant('a', 10), combatant('b', 10), combatant('c', 10));
    const result = resolveSceneAction(
      scene,
      {
        type: 'apply-damage',
        cause: 'fireball',
        damages: [
          { tokenId: 'a', amount: 8 },
          { tokenId: 'b', amount: 4 }, // saved, half
          { tokenId: 'c', amount: 8 },
        ],
      },
      { eventId: 'aoe' }
    );
    scene = appendSceneEvent(scene, result.event!);
    expect(hpOf(scene, 'a')).toBe(2);
    expect(hpOf(scene, 'b')).toBe(6);
    expect(hpOf(scene, 'c')).toBe(2);
  });

  it('rejects damage to an unknown token', () => {
    const scene = sceneWith(combatant('goblin', 7));
    const result = resolveSceneAction(
      scene,
      { type: 'apply-damage', damages: [{ tokenId: 'ghost', amount: 5 }] },
      { eventId: 'bad' }
    );
    expect(result.event).toBeUndefined();
    expect(result.issues.some((i) => i.code === 'scene-token-unknown')).toBe(true);
  });

  it('a token without hp is left unchanged (additive)', () => {
    const obj: SceneToken = {
      id: 'door',
      name: 'Door',
      kind: 'object',
      position: { x: 2, y: 2 },
      size: 1,
    };
    let scene = sceneWith(obj);
    const result = resolveSceneAction(
      scene,
      { type: 'apply-damage', damages: [{ tokenId: 'door', amount: 5 }] },
      { eventId: 'door-dmg' }
    );
    // Event is valid (token exists); fold simply does not change a token with no hp.
    scene = appendSceneEvent(scene, result.event!);
    expect(foldSceneEvents(scene).state.tokens.door.hp).toBeUndefined();
  });

  it('damage replays deterministically (same events -> same HP)', () => {
    let scene = sceneWith(combatant('goblin', 12));
    const result = resolveSceneAction(
      scene,
      { type: 'apply-damage', damages: [{ tokenId: 'goblin', amount: 5 }] },
      { eventId: 'dmg' }
    );
    scene = appendSceneEvent(scene, result.event!);
    const a = foldSceneEvents(scene).state.tokens.goblin.hp!.current;
    const b = foldSceneEvents(scene).state.tokens.goblin.hp!.current;
    expect(a).toBe(b);
    expect(a).toBe(7);
  });
});
