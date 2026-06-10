/**
 * Exponential backoff with full jitter for transient network operations.
 *
 * Design notes:
 *   - "Full jitter" (random in [0, cap]) is preferred over equal-jitter or
 *     no-jitter because it dampens herds after a common-mode failure.
 *     Source: Marc Brooker, AWS Architecture Blog, "Exponential Backoff
 *     And Jitter" (2015).
 *   - Auth / policy / schema errors must NOT be retried: they will fail
 *     identically on every attempt and the delay just hides the signal.
 *     `isRetryableError` classifies on message text (Supabase does not
 *     expose HTTP status codes on Postgrest / Auth errors reliably).
 *   - In a test environment we disable retries and delays entirely so
 *     existing test suites that mock failure paths do not wait several
 *     seconds per call.  Tests for this module pass explicit options to
 *     exercise the retry mechanics.
 */

export interface RetryOptions {
  maxAttempts?: number;
  initialDelayMs?: number;
  maxDelayMs?: number;
  onRetry?: (attempt: number, error: unknown, delayMs: number) => void;
  /** Override the retryability classifier; defaults to `isRetryableError`. */
  shouldRetry?: (error: unknown) => boolean;
}

const IS_TEST_ENV =
  typeof import.meta !== 'undefined' &&
  typeof import.meta.env !== 'undefined' &&
  import.meta.env.MODE === 'test';

/**
 * Production retry defaults. Exported so tests can pin the shipped values —
 * under Vitest the module always runs with TEST_DEFAULTS, so without an
 * explicit assertion a typo here would ship silently.
 */
export const PROD_DEFAULTS = {
  maxAttempts: 4,
  initialDelayMs: 500,
  maxDelayMs: 8000,
} as const;

const TEST_DEFAULTS = {
  maxAttempts: 1,
  initialDelayMs: 0,
  maxDelayMs: 0,
};

const BASE_DEFAULTS = IS_TEST_ENV ? TEST_DEFAULTS : PROD_DEFAULTS;

/**
 * Message fragments for errors that are permanent and must not be retried.
 * Matched case-insensitively against the error message.
 *
 * Deliberately NOT listed (i.e. retryable):
 *   - 'jwt expired' — supabase-js refreshes expired tokens automatically, so
 *     a retry moments later succeeds; treating it as permanent flipped sync
 *     into a persistent error state for a self-healing condition.
 *   - 429 / 'too many requests' — transient by definition; backoff-and-retry
 *     is exactly the right response to rate limiting.
 */
const NON_RETRYABLE_FRAGMENTS = [
  'invalid api key',
  'jwt malformed',
  'no authenticated',
  'row-level security',
  'duplicate key',
  'violates',
  'unauthorized',
  'forbidden',
  'not configured',
];

export function isRetryableError(error: unknown): boolean {
  if (error === null || error === undefined) return false;
  const message =
    error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();
  return !NON_RETRYABLE_FRAGMENTS.some((fragment) => message.includes(fragment));
}

function computeBackoffMs(attempt: number, initial: number, max: number): number {
  if (max === 0 || initial === 0) return 0;
  const exponentialCap = Math.min(max, initial * 2 ** attempt);
  return Math.random() * exponentialCap;
}

function sleep(ms: number): Promise<void> {
  if (ms <= 0) return Promise.resolve();
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/**
 * Run `op` with retry on transient failures.  Throws the last error if all
 * attempts are exhausted or the error is classified as non-retryable.
 */
export async function retryWithBackoff<T>(
  op: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const maxAttempts = options.maxAttempts ?? BASE_DEFAULTS.maxAttempts;
  const initialDelayMs = options.initialDelayMs ?? BASE_DEFAULTS.initialDelayMs;
  const maxDelayMs = options.maxDelayMs ?? BASE_DEFAULTS.maxDelayMs;
  const shouldRetry = options.shouldRetry ?? isRetryableError;

  let lastError: unknown;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    try {
      return await op();
    } catch (error) {
      lastError = error;

      // Last attempt: do not delay, just throw below the loop.
      if (attempt === maxAttempts - 1) break;

      // Permanent failure: stop immediately.
      if (!shouldRetry(error)) break;

      const delayMs = computeBackoffMs(attempt, initialDelayMs, maxDelayMs);
      options.onRetry?.(attempt + 1, error, delayMs);
      await sleep(delayMs);
    }
  }

  throw lastError;
}
