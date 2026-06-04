/**
 * A binary min-heap with a deterministic, stable tie-break.
 *
 * The grid searches (pathfinding, line-of-effect spread) previously re-sorted the
 * whole frontier on every pop — O(V² log V). This heap makes them O(E log V)
 * while preserving EXACT behavior: ties on priority pop in insertion order (a
 * monotonic sequence number), reproducing the prior stable `Array.sort`, so
 * results stay byte-identical and replayable. Pure; no shared state.
 */
export class MinHeap<T> {
  private readonly nodes: Array<{ item: T; priority: number; seq: number }> = [];
  private counter = 0;

  get size(): number {
    return this.nodes.length;
  }

  /** True when node a should pop before node b (lower priority, then earlier insertion). */
  private before(
    a: { priority: number; seq: number },
    b: { priority: number; seq: number }
  ): boolean {
    return a.priority < b.priority || (a.priority === b.priority && a.seq < b.seq);
  }

  push(item: T, priority: number): void {
    const node = { item, priority, seq: this.counter++ };
    this.nodes.push(node);
    let i = this.nodes.length - 1;
    // parent and i are always valid indices (0 <= parent < i < length) here.
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (this.before(this.nodes[parent]!, this.nodes[i]!)) break;
      [this.nodes[parent], this.nodes[i]] = [this.nodes[i]!, this.nodes[parent]!];
      i = parent;
    }
  }

  pop(): T | undefined {
    const n = this.nodes.length;
    if (n === 0) return undefined;
    const top = this.nodes[0]!; // defined: n > 0
    const last = this.nodes.pop()!;
    if (n > 1) {
      this.nodes[0] = last;
      let i = 0;
      for (;;) {
        const left = 2 * i + 1;
        const right = 2 * i + 2;
        let smallest = i;
        if (left < this.nodes.length && this.before(this.nodes[left]!, this.nodes[smallest]!)) {
          smallest = left;
        }
        if (right < this.nodes.length && this.before(this.nodes[right]!, this.nodes[smallest]!)) {
          smallest = right;
        }
        if (smallest === i) break;
        [this.nodes[i], this.nodes[smallest]] = [this.nodes[smallest]!, this.nodes[i]!];
        i = smallest;
      }
    }
    return top.item;
  }
}
