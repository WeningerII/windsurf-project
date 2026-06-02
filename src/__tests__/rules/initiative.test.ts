import { describe, it, expect } from 'vitest';

import { rollInitiative } from '../../rules';
import type { SeededRng } from '../../scene/seededRng';
import { createSeededRng } from '../../scene/seededRng';

/**
 * Initiative: each combatant rolls d20 + its modifier; the order is totals
 * descending with a stable id tie-break, deterministic from the seed.
 */

function scriptedRng(faces: number[]): SeededRng {
  let i = 0;
  return { next: () => 0, nextInt: () => 0, rollDie: () => faces[Math.min(i++, faces.length - 1)] };
}

describe('rollInitiative', () => {
  it('orders combatants by total, highest first', () => {
    const order = rollInitiative(
      [
        { tokenId: 'a', modifier: 0 },
        { tokenId: 'b', modifier: 0 },
        { tokenId: 'c', modifier: 0 },
      ],
      scriptedRng([5, 15, 10]) // a=5, b=15, c=10
    );
    expect(order.map((e) => e.tokenId)).toEqual(['b', 'c', 'a']);
    expect(order[0]).toMatchObject({ tokenId: 'b', roll: 15, total: 15 });
  });

  it('adds the modifier to the roll', () => {
    const order = rollInitiative(
      [
        { tokenId: 'slow', modifier: 0 },
        { tokenId: 'quick', modifier: 8 },
      ],
      scriptedRng([12, 6]) // slow=12, quick=6+8=14 → quick wins
    );
    expect(order.map((e) => e.tokenId)).toEqual(['quick', 'slow']);
    expect(order.find((e) => e.tokenId === 'quick')!.total).toBe(14);
  });

  it('breaks ties deterministically by token id', () => {
    const order = rollInitiative(
      [
        { tokenId: 'zara', modifier: 0 },
        { tokenId: 'alex', modifier: 0 },
      ],
      scriptedRng([10, 10]) // both 10 → alex sorts before zara
    );
    expect(order.map((e) => e.tokenId)).toEqual(['alex', 'zara']);
  });

  it('is deterministic for a given seed', () => {
    const combatants = [
      { tokenId: 'a', modifier: 2 },
      { tokenId: 'b', modifier: 3 },
    ];
    const first = rollInitiative(combatants, createSeededRng('init'));
    const second = rollInitiative(combatants, createSeededRng('init'));
    expect(first).toEqual(second);
  });
});
