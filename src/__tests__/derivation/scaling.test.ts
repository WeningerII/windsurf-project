/**
 * Unit tests for the level-scaling shapes. Each block pins the shape against the
 * REAL system parameterization it replaced, so the golden-master migration
 * (getDaggerheartTier / classBAB / baseSave / profTotal) can never silently
 * drift from these three primitives.
 */
import { describe, it, expect } from 'vitest';
import { breakpoints, linearRate, levelPlus } from '../../rules/derivation';

describe('scaling shapes', () => {
  describe('breakpoints — Daggerheart tier (2/5/8)', () => {
    const tier = (level: number) =>
      breakpoints(
        level,
        [
          [2, 2],
          [5, 3],
          [8, 4],
        ],
        1
      );
    it.each([
      [1, 1],
      [2, 2],
      [4, 2],
      [5, 3],
      [7, 3],
      [8, 4],
      [10, 4],
    ])('level %i → tier %i', (level, expected) => {
      expect(tier(level)).toBe(expected);
    });
  });

  describe('linearRate — d20 BAB & saves', () => {
    it('full BAB = level', () => {
      expect(linearRate(20, 1, 1)).toBe(20);
      expect(linearRate(1, 1, 1)).toBe(1);
    });
    it('three-quarter BAB = floor(level × 3/4)', () => {
      expect(linearRate(4, 3, 4)).toBe(3);
      expect(linearRate(20, 3, 4)).toBe(15);
      expect(linearRate(5, 3, 4)).toBe(3);
    });
    it('half BAB = floor(level / 2)', () => {
      expect(linearRate(20, 1, 2)).toBe(10);
      expect(linearRate(3, 1, 2)).toBe(1);
    });
    it('good save = floor(level / 2) + 2', () => {
      expect(linearRate(1, 1, 2, 2)).toBe(2);
      expect(linearRate(20, 1, 2, 2)).toBe(12);
    });
    it('poor save = floor(level / 3)', () => {
      expect(linearRate(1, 1, 3)).toBe(0);
      expect(linearRate(20, 1, 3)).toBe(6);
    });
  });

  describe('levelPlus — PF2e proficiency total', () => {
    it('trained+ = level + tier bonus', () => {
      expect(levelPlus(5, 2)).toBe(7); // trained at level 5
      expect(levelPlus(20, 8)).toBe(28); // legendary at level 20
    });
  });
});
