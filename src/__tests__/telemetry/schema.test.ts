import { describe, it, expect } from 'vitest';
import { isPiiKey, MAX_PROP_KEYS, sanitizeProps, sanitizeValue } from '../../telemetry/schema';

describe('sanitizeProps — PII key defense', () => {
  it('strips keys that name an identifier or personal datum (even with valid values)', () => {
    const raw = {
      userId: 42, // numeric PII the value defense would otherwise allow
      email: 'LCP', // even an allowlisted value cannot rescue a PII key
      characterName: 5,
      sessionId: 7,
      ipAddress: 1,
      lat: 12.3,
      lng: 45.6,
      password: 9,
      metric: 'LCP', // non-PII key, allowlisted value -> kept
    } as Record<string, unknown>;
    expect(sanitizeProps(raw)).toEqual({ metric: 'LCP' });
  });

  it('matches PII tokens on word boundaries, not raw substrings', () => {
    // These contain "id"/"name" as substrings but not as tokens -> kept.
    expect(isPiiKey('valid')).toBe(false);
    expect(isPiiKey('grid')).toBe(false);
    expect(isPiiKey('width')).toBe(false);
    expect(isPiiKey('candidate')).toBe(false);
    // Real identifier/personal tokens -> stripped.
    expect(isPiiKey('userId')).toBe(true);
    expect(isPiiKey('user_id')).toBe(true);
    expect(isPiiKey('candidateId')).toBe(true);
    expect(isPiiKey('firstName')).toBe(true);
    expect(isPiiKey('ip_address')).toBe(true);
    expect(isPiiKey('HTTPStatus')).toBe(false);
  });
});

describe('sanitizeProps — value defense', () => {
  it('drops free-form strings but keeps allowlisted enum strings', () => {
    const raw = {
      color: 'chartreuse', // free-form value -> dropped
      note: 'my secret plan', // free-form value -> dropped
      metric: 'LCP', // allowlisted -> kept
      rating: 'good', // allowlisted -> kept
      caseSensitive: 'lcp', // wrong case, not in allowlist -> dropped
    } as Record<string, unknown>;
    expect(sanitizeProps(raw)).toEqual({ metric: 'LCP', rating: 'good' });
  });

  it('keeps finite numbers and booleans, drops NaN/Infinity', () => {
    const raw = {
      value: 42,
      ratio: 0,
      enabled: true,
      disabled: false,
      bad: NaN,
      worse: Infinity,
    } as Record<string, unknown>;
    expect(sanitizeProps(raw)).toEqual({ value: 42, ratio: 0, enabled: true, disabled: false });
  });

  it('drops every non-primitive (object, array, null, undefined, function)', () => {
    const raw = {
      nested: { a: 1 },
      arr: [1, 2, 3],
      nul: null,
      undef: undefined,
      fn: () => 1,
      value: 3, // survivor
    } as Record<string, unknown>;
    expect(sanitizeProps(raw)).toEqual({ value: 3 });
  });

  it('is total: empty/undefined/null input yields an empty payload', () => {
    expect(sanitizeProps(undefined)).toEqual({});
    expect(sanitizeProps(null)).toEqual({});
    expect(sanitizeProps({})).toEqual({});
  });

  it('does not mutate its input', () => {
    const raw = { userId: 1, value: 2 };
    sanitizeProps(raw);
    expect(raw).toEqual({ userId: 1, value: 2 });
  });

  it('caps retained fields at MAX_PROP_KEYS', () => {
    const raw: Record<string, number> = {};
    for (let i = 0; i < MAX_PROP_KEYS + 10; i += 1) raw[`m${i}`] = i;
    expect(Object.keys(sanitizeProps(raw)).length).toBe(MAX_PROP_KEYS);
  });
});

describe('sanitizeValue', () => {
  it('classifies primitives correctly', () => {
    expect(sanitizeValue(true)).toBe(true);
    expect(sanitizeValue(7)).toBe(7);
    expect(sanitizeValue('CLS')).toBe('CLS');
    expect(sanitizeValue('freeform')).toBeUndefined();
    expect(sanitizeValue(NaN)).toBeUndefined();
    expect(sanitizeValue({})).toBeUndefined();
    expect(sanitizeValue(null)).toBeUndefined();
  });
});
