/**
 * Pluggable rate-limit STORE for the AI gateway.
 *
 * The gateway core consumes a synchronous {@link RateLimiter} (`check(key)` ->
 * verdict, see `src/utils/rateLimit.ts`). This module factors the COUNTING out
 * of that limiter into a swappable {@link RateLimitStore} (get / increment /
 * reset, fixed-window TTL), so the counter can live in process memory today or a
 * durable backend tomorrow WITHOUT touching the core or the gateway wiring.
 *
 * Defaults are byte-for-byte today's behavior:
 *  - The DEFAULT store is {@link createInMemoryRateLimitStore} — the same
 *    fixed-window, per-key counting the current in-memory limiter does. A unit
 *    test asserts parity against `createRateLimiter` across a request sequence.
 *  - The DURABLE store ({@link createDurableRateLimitStore}) is a turnkey STUB:
 *    it reads its target from `RATE_LIMIT_STORE_URL` and is INERT (returns
 *    `undefined`, so the resolver falls back to in-memory) whenever the URL is
 *    unset OR no driver has been wired. It performs NO network I/O and needs NO
 *    secret; a real backend later plugs in a {@link RateLimitStoreDriver}.
 *
 * The seam is synchronous by design, to match the core's synchronous `check`.
 * An async backend (Redis/Upstash/etc.) is adapted by fronting it with a
 * synchronous {@link RateLimitStoreDriver} (e.g. a request-scoped snapshot); the
 * durable path here is the scaffold for exactly that.
 */
import type { RateLimiter, RateLimitResult } from '../../src/utils/rateLimit';
import type { SessionBudget, SessionBudgetVerdict } from '../../src/ai/gatewayCore';

/** One key's fixed-window counter state. `resetAt` doubles as the TTL deadline. */
export interface RateLimitRecord {
  /** Requests (or weighted budget units) counted in the current window. */
  count: number;
  /** Epoch ms when the window (and this record's TTL) expires. */
  resetAt: number;
}

/**
 * A durable-capable per-key counter with fixed-window TTL. All methods are
 * synchronous to satisfy the core's synchronous limiter.
 */
export interface RateLimitStore {
  /** Current live record for `key`, or `undefined` if none or expired. */
  get(key: string): RateLimitRecord | undefined;
  /**
   * Count `amount` (default 1) against `key`, opening a fresh `windowMs` window
   * when the prior one is absent or expired. Returns the post-increment record.
   * The optional weight lets the same store back both request rate limiting
   * (amount 1) and the Phase 14 session cost budget (per-task unit costs) with
   * one durable seam.
   */
  increment(key: string, windowMs: number, amount?: number): RateLimitRecord;
  /** Drop `key`'s record (window reset). */
  reset(key: string): void;
}

/**
 * Low-level KV-with-TTL a durable backend exposes. A real client (Redis, Upstash
 * REST, Netlify Blobs, ...) adapts to this; {@link storeFromDriver} layers the
 * fixed-window math on top so every store shares identical windowing semantics.
 */
export interface RateLimitStoreDriver {
  /** Read the raw record for `key`, or `undefined` if the backend has none. */
  read(key: string): RateLimitRecord | undefined;
  /** Persist `record` for `key` with a `ttlMs` expiry. */
  write(key: string, record: RateLimitRecord, ttlMs: number): void;
  /** Remove `key` from the backend. */
  remove(key: string): void;
}

type Clock = () => number;

/** Fixed-window step shared by every store: returns the post-increment record. */
function windowedIncrement(
  now: Clock,
  read: (key: string) => RateLimitRecord | undefined,
  key: string,
  windowMs: number,
  amount: number
): RateLimitRecord {
  const t = now();
  const prior = read(key);
  // A new key, or a window whose deadline has passed, opens a fresh window. This
  // mirrors `createRateLimiter`'s `t - windowStart >= windowMs` test exactly
  // (windowStart + windowMs === resetAt).
  if (!prior || t >= prior.resetAt) {
    return { count: amount, resetAt: t + windowMs };
  }
  return { count: prior.count + amount, resetAt: prior.resetAt };
}

/**
 * The DEFAULT store: a process-memory fixed-window counter — the same strategy
 * as today's in-memory limiter. The clock is injectable for deterministic tests.
 */
export function createInMemoryRateLimitStore(now: Clock = Date.now): RateLimitStore {
  const records = new Map<string, RateLimitRecord>();

  const liveRecord = (key: string): RateLimitRecord | undefined => {
    const rec = records.get(key);
    if (!rec) return undefined;
    if (now() >= rec.resetAt) {
      records.delete(key);
      return undefined;
    }
    return rec;
  };

  return {
    get(key) {
      const rec = liveRecord(key);
      return rec ? { ...rec } : undefined;
    },
    increment(key, windowMs, amount = 1) {
      const next = windowedIncrement(now, liveRecord, key, windowMs, amount);
      records.set(key, next);
      return { ...next };
    },
    reset(key) {
      records.delete(key);
    },
  };
}

/** Wrap a durable driver in the shared fixed-window semantics. */
function storeFromDriver(driver: RateLimitStoreDriver, now: Clock): RateLimitStore {
  const liveRecord = (key: string): RateLimitRecord | undefined => {
    const rec = driver.read(key);
    if (!rec) return undefined;
    if (now() >= rec.resetAt) {
      driver.remove(key);
      return undefined;
    }
    return rec;
  };

  return {
    get(key) {
      const rec = liveRecord(key);
      return rec ? { ...rec } : undefined;
    },
    increment(key, windowMs, amount = 1) {
      const next = windowedIncrement(now, liveRecord, key, windowMs, amount);
      // TTL is the remaining window; never negative.
      driver.write(key, next, Math.max(0, next.resetAt - now()));
      return { ...next };
    },
    reset(key) {
      driver.remove(key);
    },
  };
}

/** Env inputs the durable store reads. Sourced from `process.env`. */
export interface RateLimitStoreEnv {
  /** Connection target for the durable backend. Unset => durable store disabled. */
  RATE_LIMIT_STORE_URL?: string;
}

/**
 * Turnkey STUB for a durable store. Returns a {@link RateLimitStore} ONLY when
 * BOTH `RATE_LIMIT_STORE_URL` is set AND a {@link RateLimitStoreDriver} is wired;
 * otherwise `undefined` (inert). This means:
 *  - URL unset            -> `undefined` (today's behavior; no durable path).
 *  - URL set, no driver   -> `undefined` (target noted but not yet provisioned).
 *  - URL set, driver wired -> a durable store bound to that driver.
 *
 * It performs no I/O itself and reads no secret. When a backend is provisioned,
 * pass its driver here (and the URL via env) — nothing else changes.
 */
export function createDurableRateLimitStore(
  env: RateLimitStoreEnv,
  driver?: RateLimitStoreDriver,
  now: Clock = Date.now
): RateLimitStore | undefined {
  const url = (env.RATE_LIMIT_STORE_URL ?? '').trim();
  if (!url) return undefined; // INERT: disabled when the target is unset.
  if (!driver) return undefined; // Configured but no backend driver wired yet.
  return storeFromDriver(driver, now);
}

/**
 * Resolve the store the gateway should use: the durable store when configured
 * and driven, otherwise the in-memory default. Default (no env, no driver) is
 * exactly today's in-memory counting.
 */
export function resolveRateLimitStore(
  env: RateLimitStoreEnv,
  driver?: RateLimitStoreDriver,
  now: Clock = Date.now
): RateLimitStore {
  return createDurableRateLimitStore(env, driver, now) ?? createInMemoryRateLimitStore(now);
}

/** Options for adapting a store into the core's {@link RateLimiter}. */
export interface StoreRateLimiterOptions {
  /** Max requests allowed per key within a window. `<= 0` disables limiting. */
  limit: number;
  /** Window length in milliseconds. */
  windowMs: number;
  /** Injectable clock (ms) for the disabled branch; defaults to `Date.now`. */
  now?: Clock;
}

/**
 * Adapt any {@link RateLimitStore} into the synchronous {@link RateLimiter} the
 * gateway core consumes. Verdict semantics match `createRateLimiter` exactly:
 * `ok` when the post-increment count is within `limit`, `remaining` floored at 0,
 * `resetAt` the window rollover. A `limit <= 0` yields an always-open limiter.
 */
export function rateLimiterFromStore(
  store: RateLimitStore,
  options: StoreRateLimiterOptions
): RateLimiter {
  const { limit, windowMs } = options;
  const now = options.now ?? Date.now;
  return {
    check(key: string): RateLimitResult {
      if (limit <= 0) {
        return { ok: true, remaining: Number.POSITIVE_INFINITY, resetAt: now() + windowMs };
      }
      const rec = store.increment(key, windowMs);
      return {
        ok: rec.count <= limit,
        remaining: Math.max(0, limit - rec.count),
        resetAt: rec.resetAt,
      };
    },
  };
}

/**
 * Namespace prefix for session-budget keys, so a budget counter and a rate-limit
 * counter for the same caller never collide when they share one (durable) store.
 */
export const SESSION_BUDGET_KEY_PREFIX = 'ai-budget:';

/** Options for adapting a store into the core's {@link SessionBudget}. */
export interface StoreSessionBudgetOptions {
  /** Max budget units per key within a window. `<= 0` disables the cap. */
  maxUnits: number;
  /** Budget window (session TTL) in milliseconds. */
  windowMs: number;
  /** Injectable clock (ms) for the disabled branch; defaults to `Date.now`. */
  now?: Clock;
}

/**
 * Adapt any {@link RateLimitStore} into the synchronous {@link SessionBudget}
 * the gateway core consumes (Phase 14 cost caps). Charge-then-check semantics
 * mirror {@link rateLimiterFromStore}: the crossing charge's units are recorded
 * and the verdict fails once the cumulative spend exceeds `maxUnits`, so a
 * tripped cap stays tripped — deterministically — until the window resets.
 * Keys are namespaced with {@link SESSION_BUDGET_KEY_PREFIX}. A `maxUnits <= 0`
 * yields an always-open budget (cap disabled).
 */
export function sessionBudgetFromStore(
  store: RateLimitStore,
  options: StoreSessionBudgetOptions
): SessionBudget {
  const { maxUnits, windowMs } = options;
  const now = options.now ?? Date.now;
  return {
    charge(key: string, units: number): SessionBudgetVerdict {
      if (maxUnits <= 0) {
        return { ok: true, remainingUnits: Number.POSITIVE_INFINITY, resetAt: now() + windowMs };
      }
      const rec = store.increment(`${SESSION_BUDGET_KEY_PREFIX}${key}`, windowMs, units);
      return {
        ok: rec.count <= maxUnits,
        remainingUnits: Math.max(0, maxUnits - rec.count),
        resetAt: rec.resetAt,
      };
    },
  };
}
