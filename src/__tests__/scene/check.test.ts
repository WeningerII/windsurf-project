import { describe, expect, it } from 'vitest';
import { resolveCheck } from '../../scene/check';

describe('resolveCheck', () => {
  it('adds the modifier to the die for the total', () => {
    expect(resolveCheck(12, 5).total).toBe(17);
    expect(resolveCheck(12, -3).total).toBe(9);
  });

  it('marks success when total meets or exceeds the DC', () => {
    expect(resolveCheck(10, 5, 15).outcome).toBe('success'); // 15 >= 15
    expect(resolveCheck(10, 6, 15).outcome).toBe('success');
  });

  it('marks failure when total falls short of the DC', () => {
    expect(resolveCheck(10, 4, 15).outcome).toBe('failure'); // 14 < 15
  });

  it('is unresolved and carries no DC when none is given', () => {
    const result = resolveCheck(18, 2);
    expect(result.outcome).toBe('unresolved');
    expect(result.dc).toBeUndefined();
    expect('dc' in result).toBe(false);
  });
});
