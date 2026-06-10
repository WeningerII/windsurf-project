import { describe, expect, it } from 'vitest';
import {
  getSpellSlotsAtClassLevel,
  mergeMaxUsedSpellSlots,
  mergeVancianSpellSlots,
} from '../../utils/classSpellcasting';

describe('classSpellcasting helpers', () => {
  it('returns empty slots when no progression table exists', () => {
    expect(getSpellSlotsAtClassLevel(undefined, 5)).toEqual({});
  });

  it('skips invalid table entries and defaults missing progression values to zero', () => {
    const slots = getSpellSlotsAtClassLevel(
      {
        1: [2, 3, 4],
        2: [0],
        invalid: [99],
        3: 'not-an-array',
      } as unknown as Record<number, number[]>,
      25
    );

    expect(slots).toEqual({
      1: 0,
      2: 0,
    });
  });

  it('merges vancian slots with clamped totals and used counts', () => {
    expect(mergeVancianSpellSlots(undefined, { 1: 4, 2: -1 })).toEqual({
      1: { total: 4, used: 0 },
      2: { total: 0, used: 0 },
    });

    expect(
      mergeVancianSpellSlots(
        {
          1: { total: 3, used: 5 },
          3: { total: 1, used: 1 },
        },
        { 1: 2, 2: 4 }
      )
    ).toEqual({
      1: { total: 2, used: 2 },
      2: { total: 4, used: 0 },
      3: { total: 0, used: 0 },
    });
  });

  it('merges max-used slots with the same clamping rules', () => {
    expect(mergeMaxUsedSpellSlots(undefined, { 1: 3, 2: -2 })).toEqual({
      1: { max: 3, used: 0 },
      2: { max: 0, used: 0 },
    });

    expect(
      mergeMaxUsedSpellSlots(
        {
          1: { max: 2, used: 5 },
          4: { max: 1, used: 1 },
        },
        { 1: 1, 3: 2 }
      )
    ).toEqual({
      1: { max: 1, used: 1 },
      3: { max: 2, used: 0 },
      4: { max: 0, used: 0 },
    });
  });
});

describe('getSpellSlotsAtClassLevel level bounds', () => {
  it('grants no slots at class level 0 or below instead of the level-1 column', () => {
    const table = { 1: [2, 3, 4], 2: [0, 0, 2] };
    expect(getSpellSlotsAtClassLevel(table, 0)).toEqual({});
    expect(getSpellSlotsAtClassLevel(table, -3)).toEqual({});
    expect(getSpellSlotsAtClassLevel(table, 1)).toEqual({ 1: 2, 2: 0 });
  });
});
