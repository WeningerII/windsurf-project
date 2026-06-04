import { describe, it, expect } from 'vitest';

import { MinHeap } from '../../scene/minHeap';

/**
 * The grid searches depend on the heap reproducing a STABLE sort-by-priority:
 * lowest priority first, ties in insertion order. That stability is what keeps
 * pathfinding / line-of-effect results byte-identical after the O(E log V) switch.
 */

describe('MinHeap', () => {
  it('pops in priority order', () => {
    const h = new MinHeap<string>();
    h.push('c', 3);
    h.push('a', 1);
    h.push('b', 2);
    expect([h.pop(), h.pop(), h.pop()]).toEqual(['a', 'b', 'c']);
    expect(h.pop()).toBeUndefined();
  });

  it('breaks ties in insertion order (stable)', () => {
    const h = new MinHeap<string>();
    h.push('first', 5);
    h.push('second', 5);
    h.push('third', 5);
    expect([h.pop(), h.pop(), h.pop()]).toEqual(['first', 'second', 'third']);
  });

  it('matches a stable sort for an interleaved push/pop workload', () => {
    const items = [
      { v: 'x', p: 2 },
      { v: 'y', p: 1 },
      { v: 'z', p: 2 },
      { v: 'w', p: 1 },
      { v: 'q', p: 3 },
      { v: 'r', p: 1 },
    ];
    const h = new MinHeap<string>();
    items.forEach((i) => h.push(i.v, i.p));
    const popped: string[] = [];
    while (h.size > 0) popped.push(h.pop()!);
    // A stable sort by priority, preserving original order within equal priorities.
    const expected = items
      .map((i, idx) => ({ ...i, idx }))
      .sort((a, b) => a.p - b.p || a.idx - b.idx)
      .map((i) => i.v);
    expect(popped).toEqual(expected);
  });
});
