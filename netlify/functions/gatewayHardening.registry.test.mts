/**
 * Netlify-layer delta tests for the AI-gateway hardening:
 *  1. Env-driven provider REGISTRY selection resolves the right adapter and
 *     preserves the default-off posture.
 *  2. The pluggable RateLimitStore interface is honored by the in-memory default
 *     (including byte-for-byte parity with the current `createRateLimiter`), and
 *     the durable-store stub is inert unless both URL and driver are wired.
 *
 * Imported APIs are referenced explicitly (not via test globals) so the file also
 * typechecks under `tsconfig.netlify.json` (node-only ambient types).
 */
import { describe, it, expect, vi } from 'vitest';
import type { AiProviderAdapter } from '../../src/ai/gatewayCore';
import { createRateLimiter } from '../../src/utils/rateLimit';
import {
  DEFAULT_AI_PROVIDER,
  resolveProviderAdapter,
  type ProviderRegistryDeps,
} from './providerRegistry.mts';
import {
  createDurableRateLimitStore,
  createInMemoryRateLimitStore,
  rateLimiterFromStore,
  resolveRateLimitStore,
  type RateLimitRecord,
  type RateLimitStoreDriver,
} from './rateLimitStore.mts';

/** A fake SDK-bound Google adapter, returned by the injected builder. */
const googleAdapter: AiProviderAdapter = {
  id: 'google',
  model: 'fake-model',
  generate: () => Promise.resolve({}),
};

function makeDeps(): { deps: ProviderRegistryDeps; calls: () => number } {
  const build = vi.fn(() => googleAdapter);
  return { deps: { createGoogleAdapter: build }, calls: () => build.mock.calls.length };
}

describe('provider registry — env selection', () => {
  it('defaults to Gemini when AI_PROVIDER is unset and a key is present', () => {
    const { deps } = makeDeps();
    const adapter = resolveProviderAdapter({ provider: undefined, apiKey: 'key' }, deps);
    expect(adapter).toBe(googleAdapter);
    expect(DEFAULT_AI_PROVIDER).toBe('gemini');
  });

  it('preserves default-off: no key + default provider => no adapter', () => {
    const { deps, calls } = makeDeps();
    const adapter = resolveProviderAdapter({ provider: undefined, apiKey: undefined }, deps);
    expect(adapter).toBeUndefined();
    expect(calls()).toBe(0); // builder never invoked without a key
  });

  it("resolves the mock adapter for AI_PROVIDER='mock' without touching the SDK builder", () => {
    const { deps, calls } = makeDeps();
    const adapter = resolveProviderAdapter({ provider: 'mock', apiKey: undefined }, deps);
    expect(adapter?.id).toBe('mock');
    expect(calls()).toBe(0);
  });

  it("treats 'google' as an alias of the Gemini entry, case-insensitively", () => {
    const { deps } = makeDeps();
    expect(resolveProviderAdapter({ provider: 'google', apiKey: 'k' }, deps)).toBe(googleAdapter);
    expect(resolveProviderAdapter({ provider: 'GEMINI', apiKey: 'k' }, deps)).toBe(googleAdapter);
  });

  it('falls back to the default provider for an unrecognized value (graceful typo handling)', () => {
    const { deps } = makeDeps();
    expect(resolveProviderAdapter({ provider: 'nonsense', apiKey: 'k' }, deps)).toBe(googleAdapter);
    expect(resolveProviderAdapter({ provider: 'nonsense', apiKey: undefined }, deps)).toBeUndefined();
  });
});

describe('rate-limit store — in-memory default honors the interface', () => {
  it('supports get / increment / reset with fixed-window TTL', () => {
    let t = 1_000;
    const store = createInMemoryRateLimitStore(() => t);

    expect(store.get('a')).toBeUndefined();

    const first = store.increment('a', 1_000);
    expect(first).toEqual<RateLimitRecord>({ count: 1, resetAt: 2_000 });
    expect(store.get('a')).toEqual<RateLimitRecord>({ count: 1, resetAt: 2_000 });

    expect(store.increment('a', 1_000).count).toBe(2);
    // A different key has its own window.
    expect(store.increment('b', 1_000).count).toBe(1);

    // Cross the TTL: the record expires and a fresh window opens.
    t = 2_000;
    expect(store.get('a')).toBeUndefined();
    expect(store.increment('a', 1_000)).toEqual<RateLimitRecord>({ count: 1, resetAt: 3_000 });

    store.reset('a');
    expect(store.get('a')).toBeUndefined();
  });

  it('produces verdicts identical to the current createRateLimiter across a sequence', () => {
    let t = 5_000;
    const clock = () => t;
    const baseline = createRateLimiter({ limit: 2, windowMs: 1_000, now: clock });
    const viaStore = rateLimiterFromStore(createInMemoryRateLimitStore(clock), {
      limit: 2,
      windowMs: 1_000,
      now: clock,
    });

    const steps: Array<{ key: string; advance: number }> = [
      { key: 'ip1', advance: 0 },
      { key: 'ip1', advance: 100 },
      { key: 'ip1', advance: 100 }, // 3rd within window => over budget
      { key: 'ip2', advance: 0 }, // distinct key still ok
      { key: 'ip1', advance: 800 }, // window rolled over => ok again
    ];

    for (const step of steps) {
      t += step.advance;
      const b = baseline.check(step.key);
      // Advance is applied once; re-read the store limiter at the same instant.
      const s = viaStore.check(step.key);
      expect(s).toEqual(b);
    }
  });
});

describe('rate-limit store — durable stub is inert without URL + driver', () => {
  const driver = (): RateLimitStoreDriver => {
    const map = new Map<string, RateLimitRecord>();
    return {
      read: (k) => map.get(k),
      write: (k, rec) => void map.set(k, rec),
      remove: (k) => void map.delete(k),
    };
  };

  it('is disabled (undefined) when RATE_LIMIT_STORE_URL is unset or blank', () => {
    expect(createDurableRateLimitStore({})).toBeUndefined();
    expect(createDurableRateLimitStore({ RATE_LIMIT_STORE_URL: '   ' })).toBeUndefined();
  });

  it('stays inert when a URL is set but no driver is wired (turnkey scaffold)', () => {
    expect(createDurableRateLimitStore({ RATE_LIMIT_STORE_URL: 'redis://example' })).toBeUndefined();
  });

  it('engages the durable store when URL and driver are both present', () => {
    let t = 0;
    const d = driver();
    const store = createDurableRateLimitStore({ RATE_LIMIT_STORE_URL: 'redis://example' }, d, () => t);
    expect(store).toBeDefined();
    const rec = store!.increment('k', 1_000);
    expect(rec).toEqual<RateLimitRecord>({ count: 1, resetAt: 1_000 });
    // The record was persisted through the driver.
    expect(d.read('k')).toEqual<RateLimitRecord>({ count: 1, resetAt: 1_000 });
  });

  it('resolveRateLimitStore falls back to in-memory by default and uses the driver when wired', () => {
    // Default: no env, no driver => in-memory (today's behavior).
    const fallback = resolveRateLimitStore({});
    expect(fallback.increment('x', 1_000).count).toBe(1);

    // Provisioned: URL + driver => durable path writes through the driver.
    let t = 0;
    const d = driver();
    const durable = resolveRateLimitStore(
      { RATE_LIMIT_STORE_URL: 'redis://example' },
      d,
      () => t
    );
    durable.increment('y', 1_000);
    expect(d.read('y')?.count).toBe(1);
  });
});
