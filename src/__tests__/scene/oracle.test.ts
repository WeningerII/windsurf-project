import { describe, expect, it } from 'vitest';
import { isOracleOdds, resolveOracle } from '../../scene/oracle';

describe('resolveOracle', () => {
  it('answers yes when the roll is at or under the odds target', () => {
    // even -> target 50
    expect(resolveOracle('even', 50).answer).toBe('yes');
    expect(resolveOracle('even', 51).answer).toBe('no');
  });

  it('shifts the yes threshold with the odds', () => {
    expect(resolveOracle('very-likely', 85)).toMatchObject({ target: 85, answer: 'yes' });
    expect(resolveOracle('very-likely', 86).answer).toBe('no');
    expect(resolveOracle('very-unlikely', 15)).toMatchObject({ target: 15, answer: 'yes' });
    expect(resolveOracle('very-unlikely', 16).answer).toBe('no');
  });

  it('promotes the extreme low band to an exceptional yes', () => {
    // even: target 50, exceptional-yes when roll <= ceil(50/5) = 10
    expect(resolveOracle('even', 10).answer).toBe('exceptional-yes');
    expect(resolveOracle('even', 11).answer).toBe('yes');
  });

  it('promotes the extreme high band to an exceptional no', () => {
    // even: no range 51..100; exceptional-no when roll > 50 + floor(50*4/5)=90
    expect(resolveOracle('even', 91).answer).toBe('exceptional-no');
    expect(resolveOracle('even', 90).answer).toBe('no');
  });

  it('always records the odds, roll, and target', () => {
    expect(resolveOracle('likely', 42)).toEqual({
      odds: 'likely',
      roll: 42,
      target: 70,
      answer: 'yes',
    });
  });
});

describe('isOracleOdds', () => {
  it('accepts the five odds levels and rejects anything else', () => {
    expect(isOracleOdds('even')).toBe(true);
    expect(isOracleOdds('very-likely')).toBe(true);
    expect(isOracleOdds('maybe')).toBe(false);
    expect(isOracleOdds(3)).toBe(false);
    expect(isOracleOdds(undefined)).toBe(false);
  });
});
