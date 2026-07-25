import { describe, expect, it, vi } from 'vitest';
import { selectAiProvider } from '../../ai/providerFactory';
import type { AiProviderAdapter } from '../../ai/gatewayCore';

const google: AiProviderAdapter = {
  id: 'google',
  model: 'gemini-test',
  generate: async () => ({}),
};

const anthropic: AiProviderAdapter = {
  id: 'anthropic',
  model: 'claude-test',
  generate: async () => ({}),
};

function deps() {
  const createGoogleAdapter = vi.fn(() => google);
  const createAnthropicAdapter = vi.fn(() => anthropic);
  return {
    createGoogleAdapter,
    createAnthropicAdapter,
    obj: { createGoogleAdapter, createAnthropicAdapter },
  };
}

describe('selectAiProvider', () => {
  it('defaults to Google when a key is present and no provider is set', () => {
    const d = deps();
    const adapter = selectAiProvider({ apiKey: 'k' }, d.obj);
    expect(adapter).toBe(google);
    expect(d.createGoogleAdapter).toHaveBeenCalledOnce();
    expect(d.createAnthropicAdapter).not.toHaveBeenCalled();
  });

  it('returns undefined when no provider is set and no key is present', () => {
    const d = deps();
    expect(selectAiProvider({}, d.obj)).toBeUndefined();
    expect(d.createGoogleAdapter).not.toHaveBeenCalled();
    expect(d.createAnthropicAdapter).not.toHaveBeenCalled();
  });

  it('selects the mock adapter without a key (SDK-free path)', () => {
    const d = deps();
    const adapter = selectAiProvider({ provider: 'mock' }, d.obj);
    expect(adapter?.id).toBe('mock');
    expect(d.createGoogleAdapter).not.toHaveBeenCalled();
    expect(d.createAnthropicAdapter).not.toHaveBeenCalled();
  });

  it('honors an explicit google provider only when keyed', () => {
    const d = deps();
    expect(selectAiProvider({ provider: 'google', apiKey: 'k' }, d.obj)).toBe(google);
    const d2 = deps();
    expect(selectAiProvider({ provider: 'google' }, d2.obj)).toBeUndefined();
  });

  it('honors an explicit anthropic provider only when keyed', () => {
    const d = deps();
    expect(selectAiProvider({ provider: 'anthropic', apiKey: 'k' }, d.obj)).toBe(anthropic);
    expect(d.createAnthropicAdapter).toHaveBeenCalledOnce();
    expect(d.createGoogleAdapter).not.toHaveBeenCalled();

    const d2 = deps();
    expect(selectAiProvider({ provider: 'anthropic' }, d2.obj)).toBeUndefined();
    expect(d2.createAnthropicAdapter).not.toHaveBeenCalled();
  });

  it('applies the identical key-absence rule to every real provider', () => {
    // Key-less degradation is a property of the SEAM, not of one provider: the
    // same input shape yields the same "no adapter" answer either way.
    for (const provider of ['google', 'anthropic', 'gemini-typo']) {
      const d = deps();
      expect(selectAiProvider({ provider }, d.obj)).toBeUndefined();
      expect(d.createGoogleAdapter).not.toHaveBeenCalled();
      expect(d.createAnthropicAdapter).not.toHaveBeenCalled();
    }
  });

  it('falls back to the default on an unrecognized provider (graceful)', () => {
    const d = deps();
    const adapter = selectAiProvider({ provider: 'typo', apiKey: 'k' }, d.obj);
    expect(adapter).toBe(google);
  });

  it('is case- and whitespace-insensitive on the provider knob', () => {
    const d = deps();
    expect(selectAiProvider({ provider: '  MOCK  ' }, d.obj)?.id).toBe('mock');
    expect(selectAiProvider({ provider: ' Anthropic ', apiKey: 'k' }, d.obj)).toBe(anthropic);
  });
});
