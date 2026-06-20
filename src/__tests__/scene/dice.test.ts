import { describe, expect, it } from 'vitest';
import { parseDiceExpression, rollDiceExpression } from '../../scene/dice';
import { createSeededRng } from '../../scene/seededRng';

describe('parseDiceExpression', () => {
  it('parses a sum of dice and constants with signs', () => {
    expect(parseDiceExpression('2d6+3')).toEqual([
      { sign: 1, count: 2, sides: 6 },
      { sign: 1, constant: 3 },
    ]);
    expect(parseDiceExpression('d20-1')).toEqual([
      { sign: 1, count: 1, sides: 20 },
      { sign: -1, constant: 1 },
    ]);
  });

  it('parses keep-highest / keep-lowest modifiers', () => {
    expect(parseDiceExpression('4d6kh3')).toEqual([
      { sign: 1, count: 4, sides: 6, keep: { type: 'kh', n: 3 } },
    ]);
    expect(parseDiceExpression('2d20kl1')).toEqual([
      { sign: 1, count: 2, sides: 20, keep: { type: 'kl', n: 1 } },
    ]);
  });

  it('tolerates whitespace and case', () => {
    expect(parseDiceExpression(' 2D6 + 1D4 ')).toEqual([
      { sign: 1, count: 2, sides: 6 },
      { sign: 1, count: 1, sides: 4 },
    ]);
  });

  it('rejects empty, malformed, and out-of-bounds expressions', () => {
    expect(() => parseDiceExpression('')).toThrow(/dice expression/i);
    expect(() => parseDiceExpression('garbage')).toThrow(/could not parse/i);
    expect(() => parseDiceExpression('2d6 plus 3')).toThrow(/could not parse/i);
    expect(() => parseDiceExpression('200d6')).toThrow(/count must be/i);
    expect(() => parseDiceExpression('1d5000')).toThrow(/sides must be/i);
    expect(() => parseDiceExpression('4d6kh5')).toThrow(/keep count/i);
    expect(() => parseDiceExpression(`1d6${'+1'.repeat(60)}`)).toThrow(/too long/i);
  });
});

describe('rollDiceExpression', () => {
  it('is deterministic for a given seed and sums the terms', () => {
    const expr = '2d6+3';
    const a = rollDiceExpression(expr, createSeededRng('roll'));
    const b = rollDiceExpression(expr, createSeededRng('roll'));
    expect(a).toEqual(b);

    // Verify the math against the same RNG sequence.
    const rng = createSeededRng('roll');
    const d1 = rng.rollDie(6);
    const d2 = rng.rollDie(6);
    expect(a.total).toBe(d1 + d2 + 3);
    expect(a.terms[0].rolls).toEqual([d1, d2]);
    expect(a.terms[0].kept).toEqual([d1, d2]);
  });

  it('keeps the highest dice under kh and drops the rest', () => {
    const rng = createSeededRng('stats');
    const four = [rng.rollDie(6), rng.rollDie(6), rng.rollDie(6), rng.rollDie(6)];
    const expectedKept = [...four].sort((x, y) => y - x).slice(0, 3);

    const result = rollDiceExpression('4d6kh3', createSeededRng('stats'));
    expect(result.terms[0].rolls).toEqual(four);
    expect(result.terms[0].kept).toEqual(expectedKept);
    expect(result.total).toBe(expectedKept.reduce((s, n) => s + n, 0));
  });

  it('subtracts negative terms from the total', () => {
    const rng = createSeededRng('atk');
    const die = rng.rollDie(20);
    const result = rollDiceExpression('d20-2', createSeededRng('atk'));
    expect(result.total).toBe(die - 2);
  });
});
