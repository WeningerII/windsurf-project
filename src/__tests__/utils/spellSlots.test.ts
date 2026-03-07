import { describe, expect, it } from 'vitest';
import { compute5eSpellSlots } from '../../utils/spellSlots';

describe('compute5eSpellSlots', () => {
  it('returns empty slots for non-casters and pact-only builds', () => {
    expect(compute5eSpellSlots([{ classId: 'fighter', level: 4 }])[1]).toEqual({
      max: 0,
      used: 0,
    });
    expect(compute5eSpellSlots([{ classId: 'warlock', level: 5 }])[1]).toEqual({
      max: 0,
      used: 0,
    });
  });

  it('computes full, half, and third-caster progressions', () => {
    expect(compute5eSpellSlots([{ classId: 'wizard', level: 3 }])[2]).toEqual({
      max: 2,
      used: 0,
    });

    expect(
      compute5eSpellSlots([
        { classId: 'paladin', level: 5 },
        { classId: 'wizard', level: 1 },
      ])[2]
    ).toEqual({ max: 2, used: 0 });

    expect(
      compute5eSpellSlots([
        { classId: 'fighter', level: 3, subclassId: 'eldritch-knight' },
        { classId: 'rogue', level: 6, subclassId: 'arcane-trickster' },
      ])[2]
    ).toEqual({ max: 2, used: 0 });
  });

  it('preserves and clamps used slot counts', () => {
    const result = compute5eSpellSlots(
      [{ classId: 'wizard', level: 5 }],
      {
        1: { max: 4, used: 99 },
        2: { max: 3, used: 2 },
        3: { max: 2, used: 7 },
        4: { max: 0, used: 1 },
        5: { max: 0, used: 0 },
        6: { max: 0, used: 0 },
        7: { max: 0, used: 0 },
        8: { max: 0, used: 0 },
        9: { max: 0, used: 0 },
      }
    );

    expect(result[1]).toEqual({ max: 4, used: 4 });
    expect(result[2]).toEqual({ max: 3, used: 2 });
    expect(result[3]).toEqual({ max: 2, used: 2 });
    expect(result[4]).toEqual({ max: 0, used: 0 });
  });

  it('clamps total caster level to 20', () => {
    const result = compute5eSpellSlots([
      { classId: 'wizard', level: 20 },
      { classId: 'cleric', level: 20 },
    ]);

    expect(result[9]).toEqual({ max: 1, used: 0 });
    expect(result[7]).toEqual({ max: 2, used: 0 });
  });
});
