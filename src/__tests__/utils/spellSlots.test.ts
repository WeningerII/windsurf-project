import { describe, expect, it } from 'vitest';
import { compute5eSpellSlots, computePactMagicSlots } from '../../utils/spellSlots';
// The class data tables are the source of truth the engine math must
// reproduce (SRD class tables); consume them directly in the cross-checks.
import { paladin as paladin2014 } from '../../data/dnd/5e-2014/classes/paladin';
import { ranger as ranger2014 } from '../../data/dnd/5e-2014/classes/ranger';
import { warlock as warlock2014 } from '../../data/dnd/5e-2014/classes/warlock';
import { paladin as paladin2024 } from '../../data/dnd/5e-2024/classes/paladin';
import { ranger as ranger2024 } from '../../data/dnd/5e-2024/classes/ranger';

describe('compute5eSpellSlots', () => {
  it('returns empty standard slots for non-casters and pact-only builds', () => {
    expect(compute5eSpellSlots([{ classId: 'fighter', level: 4 }])[1]).toEqual({
      max: 0,
      used: 0,
    });
    // Warlock slots are Pact Magic (computePactMagicSlots), never the 1-9 grid.
    expect(compute5eSpellSlots([{ classId: 'warlock', level: 5 }])[1]).toEqual({
      max: 0,
      used: 0,
    });
  });

  it('returns fresh nested slot objects on the zero-caster-level path', () => {
    const first = compute5eSpellSlots([{ classId: 'fighter', level: 4 }]);
    const second = compute5eSpellSlots([{ classId: 'fighter', level: 4 }]);
    expect(first[1]).not.toBe(second[1]);
  });

  it('computes full-caster progressions', () => {
    expect(compute5eSpellSlots([{ classId: 'wizard', level: 3 }])[2]).toEqual({
      max: 2,
      used: 0,
    });
  });

  // SRD 5.1: the multiclass table applies only with 2+ spellcasting classes —
  // a single-classed Paladin uses the Paladin table (PHB: 3 slots at level 3,
  // 4/2 at level 5), which rounds the caster level up, not down.
  it('single-class 2014 half casters use their class table (round up)', () => {
    const paladin3 = compute5eSpellSlots([{ classId: 'paladin', level: 3 }]);
    expect(paladin3[1].max).toBe(3);
    expect(paladin3[2].max).toBe(0);

    const paladin5 = compute5eSpellSlots([{ classId: 'paladin', level: 5 }]);
    expect(paladin5[1].max).toBe(4);
    expect(paladin5[2].max).toBe(2);

    // 2014 Paladin/Ranger gain Spellcasting at level 2 — no slots at level 1.
    expect(compute5eSpellSlots([{ classId: 'paladin', level: 1 }])[1].max).toBe(0);
  });

  // SRD 5.1 Eldritch Knight table: level 7 → 4 first / 2 second.
  it('single-class 2014 third casters use their class table (EK 7 → 4/2)', () => {
    const ek7 = compute5eSpellSlots([
      { classId: 'fighter', level: 7, subclassId: 'eldritch-knight' },
    ]);
    expect(ek7[1].max).toBe(4);
    expect(ek7[2].max).toBe(2);
  });

  it('matches the 2014 Paladin class table at every level', () => {
    const table = paladin2014.spellcasting!.spellSlots;
    for (let level = 1; level <= 20; level += 1) {
      const slots = compute5eSpellSlots([{ classId: 'paladin', level }]);
      for (let slotLevel = 1; slotLevel <= 5; slotLevel += 1) {
        const key = slotLevel as 1 | 2 | 3 | 4 | 5;
        expect(slots[key].max, `paladin ${level}, slot level ${slotLevel}`).toBe(
          table[key][level - 1]
        );
      }
    }
  });

  // PHB/SRD 5.1 Ranger table (shared half-caster progression with Paladin):
  // 2nd-level slots begin at level 5, 3rd at 9, 4th at 13, 5th at 17.
  it('matches the 2014 Ranger class table at every level', () => {
    const table = ranger2014.spellcasting!.spellSlots;
    for (let level = 1; level <= 20; level += 1) {
      const slots = compute5eSpellSlots([{ classId: 'ranger', level }]);
      for (let slotLevel = 1; slotLevel <= 5; slotLevel += 1) {
        const key = slotLevel as 1 | 2 | 3 | 4 | 5;
        expect(slots[key].max, `ranger ${level}, slot level ${slotLevel}`).toBe(
          table[key][level - 1]
        );
      }
    }
  });

  // PHB Ranger 5: 4 first-level and 2 second-level slots (the tier the bad
  // data started at level 4) — pinned explicitly, not just via the table loop.
  it('2014 Ranger 5 has 4 first-level and 2 second-level slots', () => {
    const ranger5 = compute5eSpellSlots([{ classId: 'ranger', level: 5 }]);
    expect(ranger5[1].max).toBe(4);
    expect(ranger5[2].max).toBe(2);
    expect(ranger5[3].max).toBe(0);

    // No 2nd-level slots yet at level 4 (3 first-level only).
    const ranger4 = compute5eSpellSlots([{ classId: 'ranger', level: 4 }]);
    expect(ranger4[1].max).toBe(3);
    expect(ranger4[2].max).toBe(0);
  });

  // SRD 5.2 multiclass rule rounds half-caster levels UP, and Paladin/Ranger
  // cast from level 1; their class tables agree with that rounding.
  it('2024 half casters round up and cast from level 1', () => {
    const paladin1 = compute5eSpellSlots([{ classId: 'paladin', level: 1 }], undefined, {
      edition: '2024',
    });
    expect(paladin1[1].max).toBe(2);

    for (const data of [paladin2024, ranger2024]) {
      const table = data.spellcasting!.spellSlots;
      for (let level = 1; level <= 20; level += 1) {
        const slots = compute5eSpellSlots([{ classId: data.id, level }], undefined, {
          edition: '2024',
        });
        for (let slotLevel = 1; slotLevel <= 5; slotLevel += 1) {
          const key = slotLevel as 1 | 2 | 3 | 4 | 5;
          expect(slots[key].max, `${data.id} ${level}, slot level ${slotLevel}`).toBe(
            table[key][level - 1]
          );
        }
      }
    }
  });

  it('2024 multiclass half casters still round up (Paladin 1 / Wizard 2)', () => {
    const slots = compute5eSpellSlots(
      [
        { classId: 'paladin', level: 1 },
        { classId: 'wizard', level: 2 },
      ],
      undefined,
      { edition: '2024' }
    );
    // ceil(1/2) + 2 = 3 → 4 first / 2 second
    expect(slots[1].max).toBe(4);
    expect(slots[2].max).toBe(2);
  });

  // SRD 5.1 multiclass rule: half casters contribute floor(level / 2).
  it('2014 multiclass keeps the floored combined caster level', () => {
    expect(
      compute5eSpellSlots([
        { classId: 'paladin', level: 5 },
        { classId: 'wizard', level: 1 },
      ])[2]
    ).toEqual({ max: 2, used: 0 }); // floor(5/2) + 1 = 3 → 4/2

    expect(
      compute5eSpellSlots([
        { classId: 'fighter', level: 3, subclassId: 'eldritch-knight' },
        { classId: 'rogue', level: 6, subclassId: 'arcane-trickster' },
      ])[2]
    ).toEqual({ max: 2, used: 0 }); // floor(3/3) + floor(6/3) = 3 → 4/2
  });

  it('a non-casting extra class does not trigger the multiclass rule', () => {
    // Paladin 3 / Fighter 2 (no EK): only one spellcasting class → Paladin table.
    const slots = compute5eSpellSlots([
      { classId: 'paladin', level: 3 },
      { classId: 'fighter', level: 2 },
    ]);
    expect(slots[1].max).toBe(3);
  });

  it('preserves and clamps used slot counts', () => {
    const result = compute5eSpellSlots([{ classId: 'wizard', level: 5 }], {
      1: { max: 4, used: 99 },
      2: { max: 3, used: 2 },
      3: { max: 2, used: 7 },
      4: { max: 0, used: 1 },
      5: { max: 0, used: 0 },
      6: { max: 0, used: 0 },
      7: { max: 0, used: 0 },
      8: { max: 0, used: 0 },
      9: { max: 0, used: 0 },
    });

    expect(result[1]).toEqual({ max: 4, used: 4 });
    expect(result[2]).toEqual({ max: 3, used: 2 });
    expect(result[3]).toEqual({ max: 2, used: 2 });
    expect(result[4]).toEqual({ max: 0, used: 0 });
  });

  it('self-heals partial/legacy existing slot objects instead of throwing', () => {
    const partial = { 1: { max: 4, used: 1 } } as unknown as Parameters<
      typeof compute5eSpellSlots
    >[1];
    const result = compute5eSpellSlots([{ classId: 'wizard', level: 5 }], partial);
    expect(result[1]).toEqual({ max: 4, used: 1 });
    expect(result[2]).toEqual({ max: 3, used: 0 });
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

describe('computePactMagicSlots', () => {
  // SRD Warlock Pact Magic table: slots 1 → 2 → 3 → 4 at levels 1/2/11/17;
  // slot level 1/1/3/5/5 at levels 1/2/5/11/17.
  it.each([
    [1, 1, 1],
    [2, 2, 1],
    [5, 2, 3],
    [11, 3, 5],
    [17, 4, 5],
  ])('warlock %i → %i slots at slot level %i', (warlockLevel, max, slotLevel) => {
    expect(computePactMagicSlots(warlockLevel)).toEqual({
      level: slotLevel,
      max,
      used: 0,
    });
  });

  it('caps the slot level at 5 (levels 6-9 spells are Mystic Arcanum)', () => {
    expect(computePactMagicSlots(20)).toEqual({ level: 5, max: 4, used: 0 });
  });

  // The 2014 Warlock class-data table must agree with the pact-magic engine
  // math at every level: the slot count sits at the row for the current pact
  // slot level (2 → 3 slots at level 11, 3 → 4 at level 17 per the SRD), and
  // every other slot-level row is 0 (Pact Magic has a single slot tier).
  it('matches the 2014 Warlock class-data pact table at every level', () => {
    const table = warlock2014.spellcasting!.spellSlots;
    for (let level = 1; level <= 20; level += 1) {
      const pact = computePactMagicSlots(level)!;
      for (let slotLevel = 1; slotLevel <= 9; slotLevel += 1) {
        const key = slotLevel as keyof typeof table;
        const expected = slotLevel === pact.level ? pact.max : 0;
        expect(table[key][level - 1], `warlock ${level}, slot level ${slotLevel}`).toBe(expected);
      }
    }
  });

  it('returns undefined without warlock levels', () => {
    expect(computePactMagicSlots(0)).toBeUndefined();
    expect(computePactMagicSlots(-3)).toBeUndefined();
  });

  it('preserves the used count, clamped to the new max', () => {
    expect(computePactMagicSlots(2, { level: 1, max: 1, used: 1 })).toEqual({
      level: 1,
      max: 2,
      used: 1,
    });
    expect(computePactMagicSlots(1, { level: 1, max: 2, used: 2 })).toEqual({
      level: 1,
      max: 1,
      used: 1,
    });
  });
});
