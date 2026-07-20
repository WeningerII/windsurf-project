import { describe, expect, it } from 'vitest';
import {
  consume,
  createPool,
  isExhausted,
  poolFromRemaining,
  remainingOf,
  spend,
} from '../../utils/resourcePool';

describe('resourcePool.consume', () => {
  it('decrements one charge by default and reports not-yet-depleted', () => {
    const { pool, depleted } = consume(createPool(3));
    expect(pool).toEqual({ max: 3, spent: 1 });
    expect(depleted).toBe(false);
    expect(remainingOf(pool)).toBe(2);
  });

  it('decrements by an explicit amount', () => {
    const { pool, depleted } = consume(createPool(5), 2);
    expect(pool).toEqual({ max: 5, spent: 2 });
    expect(depleted).toBe(false);
  });

  it('signals depletion when the last unit is consumed', () => {
    // remaining 1 -> consume 1 -> exhausted.
    const { pool, depleted } = consume(poolFromRemaining(1, 3));
    expect(remainingOf(pool)).toBe(0);
    expect(depleted).toBe(true);
    expect(isExhausted(pool)).toBe(true);
  });

  it('reports depleted when consuming more than remains, without overspending', () => {
    const { pool, depleted } = consume(poolFromRemaining(1, 4), 5);
    // Never spends past max: spent clamps at max, remaining floors at 0.
    expect(pool).toEqual({ max: 4, spent: 4 });
    expect(remainingOf(pool)).toBe(0);
    expect(depleted).toBe(true);
  });

  it('an already-empty pool stays empty and reports depleted', () => {
    const { pool, depleted } = consume(createPool(2, 2));
    expect(pool).toEqual({ max: 2, spent: 2 });
    expect(depleted).toBe(true);
  });

  it('is pure — it does not mutate the input pool', () => {
    const original = createPool(3, 1);
    const snapshot = { ...original };
    consume(original);
    expect(original).toEqual(snapshot);
  });

  it('keeps per-item stacks independent (distinct pools do not interfere)', () => {
    const potions = poolFromRemaining(2, 2);
    const arrows = poolFromRemaining(1, 20);

    const afterPotion = consume(potions);
    const afterArrow = consume(arrows);

    // Consuming one potion leaves the other stack untouched.
    expect(remainingOf(afterPotion.pool)).toBe(1);
    expect(afterPotion.depleted).toBe(false);
    // The arrow stack drops to its own remaining and depletes independently.
    expect(remainingOf(afterArrow.pool)).toBe(0);
    expect(afterArrow.depleted).toBe(true);
    // Original arrow pool is unchanged (purity across items).
    expect(remainingOf(arrows)).toBe(1);
  });

  it('differs from spend: spend returns a bare pool with no depletion signal', () => {
    const pool = poolFromRemaining(1, 3);
    const spent = spend(pool);
    // spend gives only the pool...
    expect(spent).toEqual({ max: 3, spent: 3 });
    // ...consume gives the same pool PLUS the destroy signal.
    const consumed = consume(pool);
    expect(consumed.pool).toEqual(spent);
    expect(consumed.depleted).toBe(true);
  });
});
