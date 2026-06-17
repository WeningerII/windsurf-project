/**
 * ResourcePool — the system-agnostic shape behind every bounded, depletable
 * resource in the app.
 *
 * Today each system re-implements the same "spend a counter down, restore it,
 * reset it on rest" logic with its own inline `Math.min/Math.max` clamping:
 * D&D spell slots, limited-use features, PF2e focus/hero points, 5e hit dice,
 * ki/sorcery points, Daggerheart stress/armor slots, and (not yet built) item
 * charges. They differ only in presentation, not in behavior.
 *
 * This models a pool canonically as a `max` capacity and the amount `spent`
 * (always clamped to 0..max). The two presentation shapes in the data models
 * both map here:
 *   - "used" pools — spell slots `{ total, used }`: `total → max`, `used → spent`.
 *   - "remaining" pools — `{ current, max }`: `current → max - spent`
 *     (use {@link poolFromRemaining} / {@link remainingShape}).
 *
 * All operations are pure and return a new pool, so they compose with the
 * immutable document-patch flow the sheets already use.
 */
export interface ResourcePool {
  /** Capacity. Never negative. */
  max: number;
  /** Amount consumed, clamped to 0..max. */
  spent: number;
}

const clampInt = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, Math.trunc(value)));

/** Construct a pool, clamping `max` to >= 0 and `spent` into 0..max. */
export function createPool(max: number, spent = 0): ResourcePool {
  const safeMax = Math.max(0, Math.trunc(max));
  return { max: safeMax, spent: clampInt(spent, 0, safeMax) };
}

/** Amount still available (max - spent). */
export function remainingOf(pool: ResourcePool): number {
  return pool.max - pool.spent;
}

/** True when nothing remains. */
export function isExhausted(pool: ResourcePool): boolean {
  return remainingOf(pool) <= 0;
}

/** True when nothing is spent. */
export function isFull(pool: ResourcePool): boolean {
  return pool.spent <= 0;
}

/** Spend `amount` (default 1). Never spends past `max`. */
export function spend(pool: ResourcePool, amount = 1): ResourcePool {
  return { ...pool, spent: clampInt(pool.spent + amount, 0, pool.max) };
}

/** Restore `amount` (default 1). Never restores below zero spent. */
export function restore(pool: ResourcePool, amount = 1): ResourcePool {
  return { ...pool, spent: clampInt(pool.spent - amount, 0, pool.max) };
}

/** Fully restore the pool (spent = 0) — e.g. on a rest. */
export function reset(pool: ResourcePool): ResourcePool {
  return { ...pool, spent: 0 };
}

/** Change the capacity, keeping `spent` but clamping it to the new `max`. */
export function setMax(pool: ResourcePool, max: number): ResourcePool {
  const safeMax = Math.max(0, Math.trunc(max));
  return { max: safeMax, spent: Math.min(pool.spent, safeMax) };
}

/** Adapt a `{ current, max }` (remaining) shape into a canonical pool. */
export function poolFromRemaining(current: number, max: number): ResourcePool {
  const safeMax = Math.max(0, Math.trunc(max));
  return { max: safeMax, spent: clampInt(safeMax - Math.trunc(current), 0, safeMax) };
}

/** Project a canonical pool back to the `{ current, max }` remaining shape. */
export function remainingShape(pool: ResourcePool): { current: number; max: number } {
  return { current: remainingOf(pool), max: pool.max };
}
