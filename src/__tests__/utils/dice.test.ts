import { describe, expect, it, vi } from 'vitest';
import { parseDiceNotation, rollDice, rollDiceNotation } from '../../utils/dice';

describe('dice utilities', () => {
  it('rolls the requested number of dice within bounds', () => {
    const randomSpy = vi
      .spyOn(Math, 'random')
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0.49)
      .mockReturnValueOnce(0.99);

    expect(rollDice(6, 3)).toEqual([1, 3, 6]);

    randomSpy.mockRestore();
  });

  it('parses dice notation with and without optional parts', () => {
    expect(parseDiceNotation('2d8+3')).toEqual({ count: 2, sides: 8, modifier: 3 });
    expect(parseDiceNotation('d20')).toEqual({ count: 1, sides: 20, modifier: 0 });
    expect(parseDiceNotation('4d6-2')).toEqual({ count: 4, sides: 6, modifier: -2 });
  });

  it('rejects invalid dice notation', () => {
    expect(() => parseDiceNotation('2w8')).toThrow('Invalid dice notation: 2w8');
  });

  it('rolls parsed dice notation and applies the modifier', () => {
    const randomSpy = vi.spyOn(Math, 'random').mockReturnValueOnce(0).mockReturnValueOnce(0.5);

    expect(rollDiceNotation('2d6+2')).toBe(7);

    randomSpy.mockRestore();
  });
});
