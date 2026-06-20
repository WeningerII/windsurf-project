import { describe, expect, it } from 'vitest';
import type { SceneState, SceneToken } from '../../types/core/scene';
import { summarizeSceneForLog } from '../../scene/sceneRecap';

function token(id: string, name: string, current: number, max = 10): SceneToken {
  return { id, name, kind: 'monster', position: { x: 0, y: 0 }, size: 1, hp: { current, max } };
}

function makeState(overrides: Partial<SceneState> = {}): SceneState {
  return {
    sceneId: 's1',
    name: 'The Crypt',
    systemId: 'dnd-5e-2024',
    grid: { type: 'square', width: 6, height: 6, cellSize: 70 },
    tokens: {},
    markers: {},
    initiative: [],
    round: 1,
    seed: 'seed',
    checkLog: [],
    oracleLog: [],
    ...overrides,
  };
}

describe('summarizeSceneForLog', () => {
  it('reports nothing recorded for an empty scene', () => {
    expect(summarizeSceneForLog(makeState())).toBe('No recorded events in this scene yet.');
  });

  it('summarizes combat: round reached and defeated combatants', () => {
    const recap = summarizeSceneForLog(
      makeState({
        round: 3,
        tokens: {
          a: token('a', 'Goblin', 0),
          b: token('b', 'Orc', 0),
          c: token('c', 'Hero', 8),
        },
      })
    );
    expect(recap).toContain('Combat: reached round 3; defeated Goblin and Orc.');
  });

  it('does not emit a combat line when nothing was resolved', () => {
    // Round 1, everyone alive -> no combat outcome worth logging.
    const recap = summarizeSceneForLog(
      makeState({ tokens: { a: token('a', 'Goblin', 10), b: token('b', 'Hero', 10) } })
    );
    expect(recap).toBe('No recorded events in this scene yet.');
  });

  it('summarizes checks with totals, DCs, and outcomes', () => {
    const recap = summarizeSceneForLog(
      makeState({
        checkLog: [
          {
            id: 'k1',
            label: 'Perception',
            die: 14,
            modifier: 3,
            dc: 15,
            total: 17,
            outcome: 'success',
            createdAt: new Date(),
          },
          {
            id: 'k2',
            label: 'Insight',
            die: 8,
            modifier: 0,
            total: 8,
            outcome: 'unresolved',
            createdAt: new Date(),
          },
        ],
      })
    );
    expect(recap).toBe('Checks: Perception 17 vs DC 15 (success); Insight 8.');
  });

  it('summarizes oracle answers, falling back to "Oracle" without a question', () => {
    const recap = summarizeSceneForLog(
      makeState({
        oracleLog: [
          {
            id: 'o1',
            question: 'Is it a trap?',
            odds: 'even',
            roll: 80,
            target: 50,
            answer: 'no',
            createdAt: new Date(),
          },
          {
            id: 'o2',
            odds: 'likely',
            roll: 3,
            target: 70,
            answer: 'exceptional-yes',
            createdAt: new Date(),
          },
        ],
      })
    );
    expect(recap).toBe('Oracle: Is it a trap? → No; Oracle → Exceptional Yes.');
  });

  it('combines combat, checks, and oracle into separate lines', () => {
    const recap = summarizeSceneForLog(
      makeState({
        round: 2,
        tokens: { a: token('a', 'Goblin', 0) },
        checkLog: [
          {
            id: 'k1',
            label: 'Stealth',
            die: 5,
            modifier: 2,
            dc: 12,
            total: 7,
            outcome: 'failure',
            createdAt: new Date(),
          },
        ],
        oracleLog: [
          {
            id: 'o1',
            question: 'Reinforcements?',
            odds: 'unlikely',
            roll: 90,
            target: 30,
            answer: 'no',
            createdAt: new Date(),
          },
        ],
      })
    );
    expect(recap.split('\n')).toEqual([
      'Combat: reached round 2; defeated Goblin.',
      'Checks: Stealth 7 vs DC 12 (failure).',
      'Oracle: Reinforcements? → No.',
    ]);
  });
});
