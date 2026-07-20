/**
 * A fixed-capacity ring buffer. Bounded BY CONSTRUCTION: once full, each push
 * overwrites the OLDEST entry, so memory never grows with event volume and a
 * runaway caller can never exhaust the heap. (errorLogger applies the same
 * cap-and-drop rule with `maxLogs = 100`; this is the reusable form of it.)
 */
export class RingBuffer<T> {
  private readonly slots: (T | undefined)[];
  /** Index of the oldest retained entry. */
  private start = 0;
  /** Number of retained entries (0..capacity). */
  private count = 0;

  constructor(public readonly capacity: number) {
    if (!Number.isInteger(capacity) || capacity <= 0) {
      throw new Error(`RingBuffer capacity must be a positive integer, got ${capacity}`);
    }
    this.slots = new Array<T | undefined>(capacity);
  }

  /** Current number of retained entries. */
  get size(): number {
    return this.count;
  }

  /** Append an entry, dropping the oldest if already at capacity. */
  push(item: T): void {
    const end = (this.start + this.count) % this.capacity;
    if (this.count < this.capacity) {
      this.slots[end] = item;
      this.count += 1;
    } else {
      // Full: `end` equals `start`; overwrite the oldest and advance the window.
      this.slots[this.start] = item;
      this.start = (this.start + 1) % this.capacity;
    }
  }

  /** Snapshot of retained entries, oldest first. */
  toArray(): T[] {
    const out: T[] = [];
    for (let i = 0; i < this.count; i += 1) {
      out.push(this.slots[(this.start + i) % this.capacity] as T);
    }
    return out;
  }

  /** Drop all entries. */
  clear(): void {
    this.slots.fill(undefined);
    this.start = 0;
    this.count = 0;
  }
}
