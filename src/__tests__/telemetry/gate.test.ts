import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  clearTelemetryOptIn,
  isTelemetryEnabled,
  OPT_IN_STORAGE_KEY,
  setTelemetryOptIn,
} from '../../telemetry/gate';

beforeEach(() => {
  localStorage.clear();
  vi.unstubAllEnvs();
});

afterEach(() => {
  localStorage.clear();
  vi.unstubAllEnvs();
});

describe('isTelemetryEnabled — opt-in gate', () => {
  it('is disabled by default (no stored preference, no build flag)', () => {
    expect(isTelemetryEnabled()).toBe(false);
  });

  it('is enabled by an explicit stored opt-in', () => {
    localStorage.setItem(OPT_IN_STORAGE_KEY, 'true');
    expect(isTelemetryEnabled()).toBe(true);
  });

  it('is disabled by an explicit stored opt-out', () => {
    localStorage.setItem(OPT_IN_STORAGE_KEY, 'false');
    expect(isTelemetryEnabled()).toBe(false);
  });

  it('is enabled by the VITE_TELEMETRY_ENABLED build flag when no preference is stored', () => {
    vi.stubEnv('VITE_TELEMETRY_ENABLED', 'true');
    expect(isTelemetryEnabled()).toBe(true);
  });

  it('lets a stored opt-out override the build flag', () => {
    vi.stubEnv('VITE_TELEMETRY_ENABLED', 'true');
    localStorage.setItem(OPT_IN_STORAGE_KEY, 'false');
    expect(isTelemetryEnabled()).toBe(false);
  });

  it('lets a stored opt-in stand even without the build flag', () => {
    localStorage.setItem(OPT_IN_STORAGE_KEY, 'true');
    expect(isTelemetryEnabled()).toBe(true);
  });

  it('ignores a non-boolean stored value and falls back to the default', () => {
    localStorage.setItem(OPT_IN_STORAGE_KEY, 'yes');
    expect(isTelemetryEnabled()).toBe(false);
  });
});

describe('setTelemetryOptIn / clearTelemetryOptIn', () => {
  it('persists an opt-in and an opt-out', () => {
    setTelemetryOptIn(true);
    expect(localStorage.getItem(OPT_IN_STORAGE_KEY)).toBe('true');
    expect(isTelemetryEnabled()).toBe(true);

    setTelemetryOptIn(false);
    expect(localStorage.getItem(OPT_IN_STORAGE_KEY)).toBe('false');
    expect(isTelemetryEnabled()).toBe(false);
  });

  it('clears back to the build default', () => {
    setTelemetryOptIn(true);
    clearTelemetryOptIn();
    expect(localStorage.getItem(OPT_IN_STORAGE_KEY)).toBeNull();
    expect(isTelemetryEnabled()).toBe(false);
  });
});
