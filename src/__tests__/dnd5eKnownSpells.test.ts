/**
 * Known-spell-count enforcement (L5) — pure formula coverage.
 *
 * Anti-bootstrap: imports NOTHING from docs/compute-register/**. The compute
 * register points its 5e/2024 L5 known-spell rows at the describe blocks below.
 */
import { describe, it, expect } from 'vitest';
import {
  dnd5eKnownSpellLimit,
  dnd5eKnownSpellOverage,
} from '../systems/dnd5e/shared/dnd5eKnownSpells';

// A stand-in known-caster table (Bard-shaped: spells known grows with level).
const KNOWN_CASTER = {
  spellsKnown: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11] as const,
  cantripsKnown: [2, 2, 2, 3, 3, 3, 3, 3, 3, 4] as const,
};

describe('dnd5e.L5.known-spell-limit', () => {
  it('reads the class table value at the class level (+ cantrips known)', () => {
    // level 3 → spellsKnown[2] = 4, cantripsKnown[2] = 2 → 6
    expect(dnd5eKnownSpellLimit(KNOWN_CASTER, 3)).toBe(6);
  });

  it('clamps below level 1 to the first table row', () => {
    // level 0 → index clamps to 0 → spellsKnown[0]=2 + cantripsKnown[0]=2 → 4
    expect(dnd5eKnownSpellLimit(KNOWN_CASTER, 0)).toBe(4);
  });

  it('clamps past the end of the table to the last row', () => {
    // level 50 → last row → spellsKnown[9]=11 + cantripsKnown[9]=4 → 15
    expect(dnd5eKnownSpellLimit(KNOWN_CASTER, 50)).toBe(15);
  });

  it('returns null for a prepared caster (no spellsKnown progression)', () => {
    expect(dnd5eKnownSpellLimit({ cantripsKnown: [3, 3, 3] }, 2)).toBeNull();
    expect(dnd5eKnownSpellLimit(undefined, 5)).toBeNull();
  });
});

describe('dnd5e.L5.known-spell-overage', () => {
  it('reports the count above the cap and 0 when within it', () => {
    expect(dnd5eKnownSpellOverage(8, 6)).toBe(2);
    expect(dnd5eKnownSpellOverage(6, 6)).toBe(0);
    expect(dnd5eKnownSpellOverage(4, 6)).toBe(0);
  });
});
