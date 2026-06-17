import { describe, expect, it } from 'vitest';
import {
  clampCount,
  createPool,
  remainingOf,
  isExhausted,
  isFull,
  spend,
  restore,
  reset,
  setMax,
  poolFromRemaining,
  remainingShape,
} from '../../utils/resourcePool';

describe('resourcePool', () => {
  it('clampCount clamps a raw counter edit into [min, max] and truncates', () => {
    expect(clampCount(5, 3)).toBe(3);
    expect(clampCount(-2, 3)).toBe(0);
    expect(clampCount(2, 3)).toBe(2);
    expect(clampCount(2.9, 3)).toBe(2);
    expect(clampCount(1, 3, 1)).toBe(1);
  });

  it('createPool clamps spent into [0, max] and floors fractional input', () => {
    expect(createPool(3)).toEqual({ max: 3, spent: 0 });
    expect(createPool(3, 5)).toEqual({ max: 3, spent: 3 });
    expect(createPool(3, -2)).toEqual({ max: 3, spent: 0 });
    expect(createPool(-1)).toEqual({ max: 0, spent: 0 });
    expect(createPool(3.9, 1.9)).toEqual({ max: 3, spent: 1 });
  });

  it('spend/restore move spent and clamp at the bounds', () => {
    const pool = createPool(3);
    expect(spend(pool)).toEqual({ max: 3, spent: 1 });
    expect(spend(pool, 2)).toEqual({ max: 3, spent: 2 });
    // Cannot overspend.
    expect(spend(createPool(3, 3))).toEqual({ max: 3, spent: 3 });
    expect(restore(createPool(3, 1))).toEqual({ max: 3, spent: 0 });
    // Cannot over-restore.
    expect(restore(createPool(3, 0))).toEqual({ max: 3, spent: 0 });
  });

  it('reset fully restores; setMax preserves spent but clamps it', () => {
    expect(reset(createPool(5, 4))).toEqual({ max: 5, spent: 0 });
    // Raising the cap keeps spent.
    expect(setMax(createPool(3, 2), 5)).toEqual({ max: 5, spent: 2 });
    // Lowering the cap below spent clamps spent down.
    expect(setMax(createPool(5, 4), 2)).toEqual({ max: 2, spent: 2 });
  });

  it('derives remaining / exhausted / full', () => {
    expect(remainingOf(createPool(3, 1))).toBe(2);
    expect(isExhausted(createPool(3, 3))).toBe(true);
    expect(isExhausted(createPool(3, 2))).toBe(false);
    expect(isFull(createPool(3, 0))).toBe(true);
    expect(isFull(createPool(3, 1))).toBe(false);
  });

  it('round-trips the {current, max} remaining shape', () => {
    // current 4 / max 6 -> spent 2; back to current 4.
    const pool = poolFromRemaining(4, 6);
    expect(pool).toEqual({ max: 6, spent: 2 });
    expect(remainingShape(pool)).toEqual({ current: 4, max: 6 });
    // Spending a remaining-shaped pool reduces current.
    expect(remainingShape(spend(pool))).toEqual({ current: 3, max: 6 });
  });
});
