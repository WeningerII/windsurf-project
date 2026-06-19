import { describe, expect, it } from 'vitest';
import { dispositionForTotal, resolveReaction, rollReaction } from '../../scene/reaction';
import { createSeededRng } from '../../scene/seededRng';

describe('dispositionForTotal', () => {
  it('maps the 2d6 reaction bands', () => {
    expect(dispositionForTotal(2)).toBe('hostile');
    expect(dispositionForTotal(3)).toBe('unfriendly');
    expect(dispositionForTotal(5)).toBe('unfriendly');
    expect(dispositionForTotal(6)).toBe('indifferent');
    expect(dispositionForTotal(8)).toBe('indifferent');
    expect(dispositionForTotal(9)).toBe('friendly');
    expect(dispositionForTotal(11)).toBe('friendly');
    expect(dispositionForTotal(12)).toBe('helpful');
  });

  it('lets the modifier push past the ends of the table', () => {
    expect(dispositionForTotal(0)).toBe('hostile'); // a steep penalty
    expect(dispositionForTotal(14)).toBe('helpful'); // a strong bonus
  });
});

describe('resolveReaction', () => {
  it('sums both dice and the modifier', () => {
    expect(resolveReaction(4, 5, 2)).toEqual({
      rolls: [4, 5],
      modifier: 2,
      total: 11,
      disposition: 'friendly',
    });
  });

  it('applies a negative modifier', () => {
    expect(resolveReaction(3, 3, -3).disposition).toBe('unfriendly'); // total 3
  });
});

describe('rollReaction', () => {
  it('is deterministic for a given seed', () => {
    const a = rollReaction(createSeededRng('npc-1'), 0);
    const b = rollReaction(createSeededRng('npc-1'), 0);
    expect(a).toEqual(b);
    expect(a.rolls[0]).toBeGreaterThanOrEqual(1);
    expect(a.rolls[0]).toBeLessThanOrEqual(6);
  });
});
