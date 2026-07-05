import { describe, expect, it } from 'vitest';

import { rollD20, rollDuality } from '../rules/dice';
import { createLiveRng, createSeededRng } from '../scene/seededRng';

describe('shared dice primitives', () => {
  it('rollDie produces every die type within [1, sides] and reaches both extremes', () => {
    const rng = createLiveRng();
    for (const sides of [4, 6, 8, 10, 12, 20, 100]) {
      const seen = new Set<number>();
      for (let index = 0; index < 5000; index += 1) {
        const value = rng.rollDie(sides);
        expect(value).toBeGreaterThanOrEqual(1);
        expect(value).toBeLessThanOrEqual(sides);
        seen.add(value);
      }
      // Over 5000 rolls a fair die hits both 1 and its maximum.
      expect(seen.has(1)).toBe(true);
      expect(seen.has(sides)).toBe(true);
    }
  });

  it('a seeded rng is deterministic — same seed yields the same sequence', () => {
    const a = createSeededRng('roll-seed');
    const b = createSeededRng('roll-seed');
    const seqA = Array.from({ length: 50 }, () => a.rollDie(100));
    const seqB = Array.from({ length: 50 }, () => b.rollDie(100));
    expect(seqA).toEqual(seqB);
  });

  it('rejects invalid die sides and bounds', () => {
    const rng = createLiveRng();
    expect(() => rng.rollDie(0)).toThrow();
    expect(() => rng.rollDie(2.5)).toThrow();
    expect(() => rng.nextInt(0)).toThrow();
  });

  it('rollD20 normal rolls one d20; advantage/disadvantage keep higher/lower', () => {
    const normal = rollD20('normal', createSeededRng('a'));
    expect(normal.terms).toHaveLength(1);
    expect(normal.formula).toBe('1d20');
    expect(normal.chosen).toBe(normal.terms[0]);

    const adv = rollD20('advantage', createSeededRng('b'));
    expect(adv.terms).toHaveLength(2);
    expect(adv.formula).toBe('2d20kh1');
    expect(adv.chosen).toBe(Math.max(...adv.terms));

    const dis = rollD20('disadvantage', createSeededRng('b'));
    expect(dis.terms).toHaveLength(2);
    expect(dis.formula).toBe('2d20kl1');
    expect(dis.chosen).toBe(Math.min(...dis.terms));
  });

  it('rollD20 is seedable for reproducible checks (L3 / replay)', () => {
    expect(rollD20('advantage', createSeededRng('x'))).toEqual(
      rollD20('advantage', createSeededRng('x'))
    );
  });

  it('rollDuality rolls a Hope and a Fear d12, seedably', () => {
    const { hope, fear } = rollDuality(createSeededRng('duality'));
    for (const die of [hope, fear]) {
      expect(die).toBeGreaterThanOrEqual(1);
      expect(die).toBeLessThanOrEqual(12);
    }
    expect(rollDuality(createSeededRng('duality'))).toEqual({ hope, fear });
  });
});
