import { describe, expect, it } from 'vitest';
import type { Pf2eSpellcasting } from '../../../systems/pf2e/data-model';
import { setPf2eFocusMax } from '../../../systems/pf2e/pf2eSheetShared';

function makeSpellcasting(current: number, max: number): Pf2eSpellcasting {
  return {
    tradition: 'occult',
    type: 'prepared',
    proficiency: { tier: 'trained', total: 0 },
    spellSlots: {},
    spellsKnown: [],
    focusSpells: [],
    focusPoints: { current, max },
  };
}

describe('setPf2eFocusMax (setMax leveling primitive)', () => {
  it('raises the cap on level-up while preserving expended focus', () => {
    // Cap 1, one point spent (current 0). Level-up to cap 3 -> 2 available.
    const next = setPf2eFocusMax(makeSpellcasting(0, 1), 3);
    expect(next?.focusPoints).toEqual({ current: 2, max: 3 });
  });

  it('lowers the cap and re-clamps remaining without refunding spent', () => {
    // Cap 3, one spent (current 2). Drop cap to 1 -> spent stays 1, current 0.
    const next = setPf2eFocusMax(makeSpellcasting(2, 3), 1);
    expect(next?.focusPoints).toEqual({ current: 0, max: 1 });
  });

  it('is behavior-preserving when the cap is unchanged', () => {
    const next = setPf2eFocusMax(makeSpellcasting(1, 3), 3);
    expect(next?.focusPoints).toEqual({ current: 1, max: 3 });
  });

  it('preserves the other spellcasting fields', () => {
    const input = makeSpellcasting(1, 2);
    const next = setPf2eFocusMax(input, 3);
    expect(next?.tradition).toBe('occult');
    expect(next?.type).toBe('prepared');
    // Pure: the input is not mutated.
    expect(input.focusPoints).toEqual({ current: 1, max: 2 });
  });

  it('returns undefined spellcasting untouched', () => {
    expect(setPf2eFocusMax(undefined, 3)).toBeUndefined();
  });
});
