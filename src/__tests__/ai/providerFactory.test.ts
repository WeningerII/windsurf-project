import { describe, expect, it, vi } from 'vitest';
import { selectAiProvider } from '../../ai/providerFactory';
import type { AiProviderAdapter } from '../../ai/gatewayCore';

const google: AiProviderAdapter = {
  id: 'google',
  model: 'gemini-test',
  generate: async () => ({}),
};

function deps() {
  const createGoogleAdapter = vi.fn(() => google);
  return { createGoogleAdapter, obj: { createGoogleAdapter } };
}

describe('selectAiProvider', () => {
  it('defaults to Google when a key is present and no provider is set', () => {
    const d = deps();
    const adapter = selectAiProvider({ apiKey: 'k' }, d.obj);
    expect(adapter).toBe(google);
    expect(d.createGoogleAdapter).toHaveBeenCalledOnce();
  });

  it('returns undefined when no provider is set and no key is present', () => {
    const d = deps();
    expect(selectAiProvider({}, d.obj)).toBeUndefined();
    expect(d.createGoogleAdapter).not.toHaveBeenCalled();
  });

  it('selects the mock adapter without a key (SDK-free path)', () => {
    const d = deps();
    const adapter = selectAiProvider({ provider: 'mock' }, d.obj);
    expect(adapter?.id).toBe('mock');
    expect(d.createGoogleAdapter).not.toHaveBeenCalled();
  });

  it('honors an explicit google provider only when keyed', () => {
    const d = deps();
    expect(selectAiProvider({ provider: 'google', apiKey: 'k' }, d.obj)).toBe(google);
    const d2 = deps();
    expect(selectAiProvider({ provider: 'google' }, d2.obj)).toBeUndefined();
  });

  it('falls back to the default on an unrecognized provider (graceful)', () => {
    const d = deps();
    const adapter = selectAiProvider({ provider: 'typo', apiKey: 'k' }, d.obj);
    expect(adapter).toBe(google);
  });

  it('is case- and whitespace-insensitive on the provider knob', () => {
    const d = deps();
    expect(selectAiProvider({ provider: '  MOCK  ' }, d.obj)?.id).toBe('mock');
  });
});
