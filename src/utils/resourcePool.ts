/**
 * ResourcePool — the system-agnostic shape behind every bounded, depletable
 * resource in the app.
 *
 * Today each system re-implements the same "clamp a counter down, restore it,
 * reset it on rest" logic with its own inline `Math.max(0, Math.min(bound, x))`:
 * D&D spell slots, limited-use features, PF2e focus points, 5e hit dice,
 * ki/sorcery points, Daggerheart stress/armor/hope, and (not yet built) item
 * charges. They differ only in presentation, not in behavior.
 *
 * This models a pool canonically as a `max` capacity and the amount `spent`
 * (always clamped to 0..max). The two presentation shapes in the data models
 * both map here:
 *   - "used" pools — spell slots `{ total, used }`: `total → max`, `used → spent`.
 *   - "remaining" pools — `{ current, max }`: `current → max - spent`
 *     (use {@link poolFromRemaining} / {@link remainingShape}).
 *
 * For raw `+/-` stepper edits that apply a signed delta straight to a counter
 * (`used`/`current`/`remaining`), use {@link clampCount} — the shared building
 * block these all duplicated. The semantic verbs below are layered on it.
 *
 * All operations are pure and return a new pool/value, so they compose with the
 * immutable document-patch flow the sheets already use.
 */
export interface ResourcePool {
  /** Capacity. Never negative. */
  max: number;
  /** Amount consumed, clamped to 0..max. */
  spent: number;
}

/**
 * Clamp a raw counter edit into `[min, max]` (truncated to integers). The
 * shared building block behind every "+/- a bounded resource" stepper and
 * every post-derive pool clamp — replacing the duplicated
 * `Math.max(0, Math.min(bound, x))` scattered across the system handlers.
 */
export function clampCount(value: number, max: number, min = 0): number {
  return Math.min(Math.max(min, Math.trunc(max)), Math.max(min, Math.trunc(value)));
}

/** Construct a pool, clamping `max` to >= 0 and `spent` into 0..max. */
export function createPool(max: number, spent = 0): ResourcePool {
  const safeMax = Math.max(0, Math.trunc(max));
  return { max: safeMax, spent: clampCount(spent, safeMax) };
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
  return { ...pool, spent: clampCount(pool.spent + amount, pool.max) };
}

/** Restore `amount` (default 1). Never restores below zero spent. */
export function restore(pool: ResourcePool, amount = 1): ResourcePool {
  return { ...pool, spent: clampCount(pool.spent - amount, pool.max) };
}

/** Fully restore the pool (spent = 0) — e.g. on a rest. */
export function reset(pool: ResourcePool): ResourcePool {
  return { ...pool, spent: 0 };
}

/**
 * The outcome of a {@link consume}: the pool after depleting `amount`, plus a
 * `depleted` flag that is `true` once nothing remains. Callers use `depleted`
 * to drive destruction of a spent consumable (drop the last potion / arrow /
 * charge from the sheet) — the signal {@link spend} deliberately does not give.
 */
export interface ConsumeResult {
  pool: ResourcePool;
  /** True when the pool is now exhausted — the caller should destroy the item. */
  depleted: boolean;
}

/**
 * Consume `amount` (default 1) charges/units from the pool and SIGNAL whether it
 * is now empty. Unlike {@link spend} — which only floors `spent` at `max` and
 * returns a bare pool — this is the verb for finite item charges and stacked
 * consumables: the returned `depleted` tells the inventory handler to remove the
 * emptied item (RFC 005's "typed consume verb for item charges/ammunition").
 * Deterministic, clamped, pure.
 */
export function consume(pool: ResourcePool, amount = 1): ConsumeResult {
  const next = spend(pool, amount);
  return { pool: next, depleted: isExhausted(next) };
}

/** Change the capacity, keeping `spent` but clamping it to the new `max`. */
export function setMax(pool: ResourcePool, max: number): ResourcePool {
  const safeMax = Math.max(0, Math.trunc(max));
  return { max: safeMax, spent: Math.min(pool.spent, safeMax) };
}

/** Adapt a `{ current, max }` (remaining) shape into a canonical pool. */
export function poolFromRemaining(current: number, max: number): ResourcePool {
  const safeMax = Math.max(0, Math.trunc(max));
  return { max: safeMax, spent: clampCount(safeMax - Math.trunc(current), safeMax) };
}

/** Project a canonical pool back to the `{ current, max }` remaining shape. */
export function remainingShape(pool: ResourcePool): { current: number; max: number } {
  return { current: remainingOf(pool), max: pool.max };
}
