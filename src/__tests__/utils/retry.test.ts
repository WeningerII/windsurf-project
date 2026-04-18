import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { isRetryableError, retryWithBackoff } from '../../utils/retry';

/**
 * These tests exercise the retry mechanics directly, overriding the
 * test-environment defaults (maxAttempts: 1, delays: 0) with explicit
 * per-call options.  Real elapsed time stays ~0 because initialDelayMs
 * is kept very small and jitter is bounded.
 */

describe('isRetryableError', () => {
  it('returns false for null and undefined', () => {
    expect(isRetryableError(null)).toBe(false);
    expect(isRetryableError(undefined)).toBe(false);
  });

  it('returns true for an opaque network error', () => {
    expect(isRetryableError(new Error('fetch failed'))).toBe(true);
  });

  it.each([
    'Invalid API key',
    'JWT expired',
    'JWT malformed',
    'No authenticated Supabase user',
    'new row violates row-level security policy',
    'duplicate key value violates unique constraint',
    'Unauthorized',
    'Forbidden',
    'Supabase not configured',
  ])('classifies %j as non-retryable', (message) => {
    expect(isRetryableError(new Error(message))).toBe(false);
  });

  it('matches the non-retryable fragments case-insensitively', () => {
    expect(isRetryableError(new Error('JWT EXPIRED'))).toBe(false);
    expect(isRetryableError(new Error('jwt expired'))).toBe(false);
  });

  it('handles non-Error thrown values by coercing to string', () => {
    expect(isRetryableError('boom')).toBe(true);
    expect(isRetryableError('Unauthorized')).toBe(false);
  });
});

describe('retryWithBackoff', () => {
  beforeEach(() => {
    vi.useRealTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns the operation result when it succeeds on the first try', async () => {
    const op = vi.fn().mockResolvedValue('ok');
    const result = await retryWithBackoff(op, { maxAttempts: 3 });
    expect(result).toBe('ok');
    expect(op).toHaveBeenCalledTimes(1);
  });

  it('retries transient failures and returns the eventual result', async () => {
    const op = vi
      .fn()
      .mockRejectedValueOnce(new Error('timeout'))
      .mockRejectedValueOnce(new Error('timeout'))
      .mockResolvedValue('recovered');

    const result = await retryWithBackoff(op, {
      maxAttempts: 3,
      initialDelayMs: 1,
      maxDelayMs: 1,
    });

    expect(result).toBe('recovered');
    expect(op).toHaveBeenCalledTimes(3);
  });

  it('throws the last error after exhausting maxAttempts', async () => {
    const op = vi.fn().mockRejectedValue(new Error('still down'));

    await expect(
      retryWithBackoff(op, { maxAttempts: 3, initialDelayMs: 1, maxDelayMs: 1 })
    ).rejects.toThrow('still down');
    expect(op).toHaveBeenCalledTimes(3);
  });

  it('does not retry non-retryable errors even when attempts remain', async () => {
    const op = vi.fn().mockRejectedValue(new Error('JWT expired'));

    await expect(
      retryWithBackoff(op, { maxAttempts: 5, initialDelayMs: 1, maxDelayMs: 1 })
    ).rejects.toThrow('JWT expired');
    expect(op).toHaveBeenCalledTimes(1);
  });

  it('honors a caller-supplied shouldRetry predicate', async () => {
    const op = vi.fn().mockRejectedValue(new Error('anything'));
    const shouldRetry = vi.fn().mockReturnValue(false);

    await expect(
      retryWithBackoff(op, {
        maxAttempts: 3,
        initialDelayMs: 1,
        maxDelayMs: 1,
        shouldRetry,
      })
    ).rejects.toThrow('anything');

    expect(op).toHaveBeenCalledTimes(1);
    expect(shouldRetry).toHaveBeenCalledTimes(1);
  });

  it('invokes onRetry with attempt number, error, and delay before each retry', async () => {
    const onRetry = vi.fn();
    const op = vi
      .fn()
      .mockRejectedValueOnce(new Error('first'))
      .mockRejectedValueOnce(new Error('second'))
      .mockResolvedValue('ok');

    await retryWithBackoff(op, {
      maxAttempts: 3,
      initialDelayMs: 1,
      maxDelayMs: 1,
      onRetry,
    });

    expect(onRetry).toHaveBeenCalledTimes(2);
    expect(onRetry).toHaveBeenNthCalledWith(1, 1, expect.any(Error), expect.any(Number));
    expect(onRetry).toHaveBeenNthCalledWith(2, 2, expect.any(Error), expect.any(Number));
  });

  it('does not invoke onRetry on the final failed attempt', async () => {
    const onRetry = vi.fn();
    const op = vi.fn().mockRejectedValue(new Error('always'));

    await expect(
      retryWithBackoff(op, {
        maxAttempts: 2,
        initialDelayMs: 1,
        maxDelayMs: 1,
        onRetry,
      })
    ).rejects.toThrow();

    expect(op).toHaveBeenCalledTimes(2);
    // onRetry fires before the delay leading into attempt N+1, so with
    // maxAttempts=2 it fires exactly once (before attempt 2).
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('uses test-env defaults when no options are provided (no retries)', async () => {
    // MODE === 'test' under Vitest, so module-level defaults are
    // maxAttempts: 1. A pure failure should bail out after one try.
    const op = vi.fn().mockRejectedValue(new Error('network flap'));
    await expect(retryWithBackoff(op)).rejects.toThrow('network flap');
    expect(op).toHaveBeenCalledTimes(1);
  });

  it('delay per retry is bounded above by the exponential cap', async () => {
    const delays: number[] = [];
    const op = vi
      .fn()
      .mockRejectedValueOnce(new Error('a'))
      .mockRejectedValueOnce(new Error('b'))
      .mockRejectedValueOnce(new Error('c'))
      .mockResolvedValue('ok');

    await retryWithBackoff(op, {
      maxAttempts: 4,
      initialDelayMs: 10,
      maxDelayMs: 80,
      onRetry: (_attempt, _error, delayMs) => delays.push(delayMs),
    });

    expect(delays).toHaveLength(3);
    // Attempt 1→2 cap: min(80, 10 * 2^0) = 10
    expect(delays[0]).toBeLessThanOrEqual(10);
    // Attempt 2→3 cap: min(80, 10 * 2^1) = 20
    expect(delays[1]).toBeLessThanOrEqual(20);
    // Attempt 3→4 cap: min(80, 10 * 2^2) = 40
    expect(delays[2]).toBeLessThanOrEqual(40);
    delays.forEach((d) => expect(d).toBeGreaterThanOrEqual(0));
  });
});
