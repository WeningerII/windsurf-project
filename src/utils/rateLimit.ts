/**
 * A tiny, pure, in-memory request limiter for the AI gateway (RFC 002 cost
 * controls). Fixed-window counting per key: the first request in a key's window
 * opens the window, subsequent requests increment it, and once the count passes
 * `limit` the key is blocked until the window rolls over.
 *
 * Deliberately dependency-free and network-free so it is unit-testable and safe
 * to import on either side of the gateway. The clock is injectable (`now`) so
 * tests drive the window deterministically instead of sleeping on the wall
 * clock; production leaves it defaulting to `Date.now`.
 *
 * Intentionally NOT a distributed limiter: a single serverless instance's
 * memory is enough to blunt accidental floods, and exhaustion degrades to a
 * graceful `over-budget` (HTTP 429) rather than an error — never a hard stop.
 */

export interface RateLimiterOptions {
  /** Max requests allowed per key within a window. `<= 0` disables limiting. */
  limit: number;
  /** Window length in milliseconds. */
  windowMs: number;
  /** Injectable clock (ms). Defaults to `Date.now`; override in tests. */
  now?: () => number;
}

export interface RateLimitResult {
  /** True when this request is within budget and may proceed. */
  ok: boolean;
  /** Requests still allowed in the current window (floored at 0). */
  remaining: number;
  /** Timestamp (ms) when the current window rolls over. */
  resetAt: number;
}

export interface RateLimiter {
  /** Count one request against `key` and report whether it is within budget. */
  check(key: string): RateLimitResult;
}

interface WindowState {
  windowStart: number;
  count: number;
}

/**
 * Build a fixed-window limiter. Each `check(key)` counts one request; the return
 * value's `ok` tells the caller whether to proceed. A `limit <= 0` yields an
 * always-open limiter (disabled), so a misconfigured knob never bricks the
 * gateway.
 */
export function createRateLimiter(options: RateLimiterOptions): RateLimiter {
  const { limit, windowMs } = options;
  const now = options.now ?? Date.now;
  const windows = new Map<string, WindowState>();

  return {
    check(key: string): RateLimitResult {
      const t = now();

      // Disabled: always within budget, but keep the shape honest.
      if (limit <= 0) {
        return { ok: true, remaining: Number.POSITIVE_INFINITY, resetAt: t + windowMs };
      }

      let state = windows.get(key);
      if (!state || t - state.windowStart >= windowMs) {
        state = { windowStart: t, count: 0 };
        windows.set(key, state);
      }

      state.count += 1;
      const ok = state.count <= limit;
      return {
        ok,
        remaining: Math.max(0, limit - state.count),
        resetAt: state.windowStart + windowMs,
      };
    },
  };
}
