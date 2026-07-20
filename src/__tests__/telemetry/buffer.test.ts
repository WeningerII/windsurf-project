import { describe, it, expect } from 'vitest';
import { RingBuffer } from '../../telemetry/buffer';

describe('RingBuffer', () => {
  it('retains items in order while under capacity', () => {
    const buf = new RingBuffer<number>(3);
    buf.push(1);
    buf.push(2);
    expect(buf.size).toBe(2);
    expect(buf.toArray()).toEqual([1, 2]);
  });

  it('caps size at capacity and drops the OLDEST on overflow', () => {
    const buf = new RingBuffer<number>(3);
    [1, 2, 3, 4, 5].forEach((n) => buf.push(n));
    expect(buf.size).toBe(3);
    // 1 and 2 were dropped as oldest; window is [3,4,5].
    expect(buf.toArray()).toEqual([3, 4, 5]);
  });

  it('keeps wrapping correctly across many overflows', () => {
    const buf = new RingBuffer<number>(2);
    for (let i = 1; i <= 100; i += 1) buf.push(i);
    expect(buf.size).toBe(2);
    expect(buf.toArray()).toEqual([99, 100]);
  });

  it('clear() empties the buffer', () => {
    const buf = new RingBuffer<number>(3);
    buf.push(1);
    buf.push(2);
    buf.clear();
    expect(buf.size).toBe(0);
    expect(buf.toArray()).toEqual([]);
  });

  it('rejects a non-positive or non-integer capacity', () => {
    expect(() => new RingBuffer<number>(0)).toThrow();
    expect(() => new RingBuffer<number>(-1)).toThrow();
    expect(() => new RingBuffer<number>(1.5)).toThrow();
  });
});
