import { describe, it, expect } from 'vitest';

import { resolveSceneChallenge, type ChallengeParticipant } from '../../rules';
import type { SceneState, SceneToken } from '../../types/core/scene';

/**
 * The exploration bridge: a party skill challenge whose FAILURE springs a trap,
 * damaging every party member through the event-sourced apply-damage path.
 */

function party(id: string): SceneToken {
  return {
    id,
    name: id,
    kind: 'character',
    position: { x: 0, y: 0 },
    size: 1,
    hp: { current: 30, max: 30, temp: 0 },
  };
}

function scene(tokens: SceneToken[]): SceneState {
  return {
    sceneId: 's',
    name: 'Dungeon',
    systemId: 'dnd-5e-2024',
    grid: { width: 10, height: 10, cellSize: 5 },
    tokens: Object.fromEntries(tokens.map((t) => [t.id, t])),
    markers: {},
    initiative: [],
    round: 1,
    seed: 'seed',
  };
}

const doomed: ChallengeParticipant[] = [
  { id: 'bran', modifier: -100 },
  { id: 'mira', modifier: -100 },
];
const heroes: ChallengeParticipant[] = [
  { id: 'bran', modifier: 100 },
  { id: 'mira', modifier: 100 },
];

describe('resolveSceneChallenge', () => {
  it('on failure, the trap springs and damages every party member', () => {
    const out = resolveSceneChallenge({
      state: scene([party('bran'), party('mira')]),
      participants: doomed,
      dc: 15,
      successesNeeded: 3,
      failuresAllowed: 3,
      trap: { count: 2, faces: 6, modifier: 0 },
      seed: 'trap-run',
    });
    expect(out.result.outcome).toBe('failure');
    expect(out.intent?.type).toBe('apply-damage');
    const damages = out.intent && 'damages' in out.intent ? out.intent.damages : [];
    expect(damages.map((d) => d.tokenId).sort()).toEqual(['bran', 'mira']);
    // 2d6 → both take the same shared amount, between 2 and 12.
    expect(damages[0].amount).toBe(damages[1].amount);
    expect(damages[0].amount).toBeGreaterThanOrEqual(2);
    expect(damages[0].amount).toBeLessThanOrEqual(12);
    expect(out.log.some((line) => /trap springs/i.test(line))).toBe(true);
  });

  it('on success, the trap does not spring', () => {
    const out = resolveSceneChallenge({
      state: scene([party('bran'), party('mira')]),
      participants: heroes,
      dc: 15,
      successesNeeded: 3,
      failuresAllowed: 3,
      trap: { count: 2, faces: 6, modifier: 0 },
      seed: 'trap-run',
    });
    expect(out.result.outcome).toBe('success');
    expect(out.intent).toBeUndefined();
  });

  it('a failure with no trap configured changes nothing', () => {
    const out = resolveSceneChallenge({
      state: scene([party('bran')]),
      participants: [{ id: 'bran', modifier: -100 }],
      dc: 15,
      successesNeeded: 3,
      failuresAllowed: 3,
      seed: 'no-trap',
    });
    expect(out.result.outcome).toBe('failure');
    expect(out.intent).toBeUndefined();
  });

  it('is deterministic for a fixed seed', () => {
    const run = () =>
      JSON.stringify(
        resolveSceneChallenge({
          state: scene([party('bran'), party('mira')]),
          participants: doomed,
          dc: 15,
          successesNeeded: 3,
          failuresAllowed: 3,
          trap: { count: 3, faces: 8, modifier: 2 },
          seed: 'fixed',
        }).intent
      );
    expect(run()).toBe(run());
  });
});
