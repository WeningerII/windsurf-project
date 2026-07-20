import { describe, expect, it } from 'vitest';
import { createRateLimiter } from '../../utils/rateLimit';

/** A controllable clock so window behavior is deterministic, not wall-clock. */
function fakeClock(start = 0) {
  let t = start;
  return {
    now: () => t,
    advance: (ms: number) => {
      t += ms;
    },
  };
}

describe('createRateLimiter', () => {
  it('allows requests up to the limit within a window', () => {
    const clock = fakeClock();
    const limiter = createRateLimiter({ limit: 3, windowMs: 1000, now: clock.now });
    expect(limiter.check('k').ok).toBe(true);
    expect(limiter.check('k').ok).toBe(true);
    const third = limiter.check('k');
    expect(third.ok).toBe(true);
    expect(third.remaining).toBe(0);
  });

  it('blocks once the limit is exceeded in the window', () => {
    const clock = fakeClock();
    const limiter = createRateLimiter({ limit: 2, windowMs: 1000, now: clock.now });
    limiter.check('k');
    limiter.check('k');
    expect(limiter.check('k').ok).toBe(false);
    // Still blocked later in the same window.
    clock.advance(500);
    expect(limiter.check('k').ok).toBe(false);
  });

  it('resets after the window rolls over (via injected clock)', () => {
    const clock = fakeClock();
    const limiter = createRateLimiter({ limit: 1, windowMs: 1000, now: clock.now });
    expect(limiter.check('k').ok).toBe(true);
    expect(limiter.check('k').ok).toBe(false);
    clock.advance(1000);
    expect(limiter.check('k').ok).toBe(true);
  });

  it('buckets independently per key', () => {
    const clock = fakeClock();
    const limiter = createRateLimiter({ limit: 1, windowMs: 1000, now: clock.now });
    expect(limiter.check('a').ok).toBe(true);
    expect(limiter.check('b').ok).toBe(true);
    expect(limiter.check('a').ok).toBe(false);
  });

  it('is disabled (always ok) when limit <= 0', () => {
    const clock = fakeClock();
    const limiter = createRateLimiter({ limit: 0, windowMs: 1000, now: clock.now });
    for (let i = 0; i < 5; i += 1) expect(limiter.check('k').ok).toBe(true);
  });
});
