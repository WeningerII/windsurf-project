import { afterEach, describe, expect, it, vi } from 'vitest';
import { FEATURE_FLAGS, isFeatureEnabled } from '../../config/featureFlags';

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('isFeatureEnabled — strict-"true" / default-OFF semantics', () => {
  it('is enabled only when the env var is exactly "true"', () => {
    vi.stubEnv('VITE_AI_ENABLED', 'true');
    expect(isFeatureEnabled('ai')).toBe(true);
  });

  it('is disabled for every non-"true" value', () => {
    for (const value of ['false', 'TRUE', 'True', '1', '', 'yes', ' true ']) {
      vi.stubEnv('VITE_AI_ENABLED', value);
      expect(isFeatureEnabled('ai')).toBe(false);
    }
  });

  it('falls back to the registry default (OFF) when the env var is undefined', () => {
    vi.stubEnv('VITE_AI_ENABLED', undefined as unknown as string);
    expect(isFeatureEnabled('ai')).toBe(false);
    vi.stubEnv('VITE_TELEMETRY_ENABLED', undefined as unknown as string);
    expect(isFeatureEnabled('telemetry')).toBe(false);
  });
});

describe('per-flag independence', () => {
  it('reads each flag from its own env var without cross-talk', () => {
    vi.stubEnv('VITE_AI_ENABLED', 'true');
    vi.stubEnv('VITE_TELEMETRY_ENABLED', 'false');
    expect(isFeatureEnabled('ai')).toBe(true);
    expect(isFeatureEnabled('telemetry')).toBe(false);

    vi.stubEnv('VITE_AI_ENABLED', 'false');
    vi.stubEnv('VITE_TELEMETRY_ENABLED', 'true');
    expect(isFeatureEnabled('ai')).toBe(false);
    expect(isFeatureEnabled('telemetry')).toBe(true);
  });
});

describe('FEATURE_FLAGS registry', () => {
  it('maps each flag to its env var with an OFF default', () => {
    expect(FEATURE_FLAGS.ai).toEqual({ envVar: 'VITE_AI_ENABLED', default: false });
    expect(FEATURE_FLAGS.telemetry).toEqual({
      envVar: 'VITE_TELEMETRY_ENABLED',
      default: false,
    });
  });

  it('defaults every registered flag OFF', () => {
    for (const def of Object.values(FEATURE_FLAGS)) {
      expect(def.default).toBe(false);
    }
  });
});
