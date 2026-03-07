/**
 * D&D 5e Multiclass Spell Slot Calculator (SRD 5.1 / 5.2)
 *
 * Full casters (Bard, Cleric, Druid, Sorcerer, Wizard): caster level = class level
 * Half casters (Paladin, Ranger): caster level = floor(class level / 2)
 * Third casters (Eldritch Knight, Arcane Trickster): caster level = floor(class level / 3)
 * Pact casters (Warlock): separate pact magic (not included in multiclass table)
 * Non-casters: caster level = 0
 *
 * Total caster level = sum of all individual caster levels, clamped to [0, 20].
 * Look up the multiclass spell slot table by total caster level.
 */

import type { SpellSlots } from '../types/core/character';

type CasterType = 'full' | 'half' | 'third' | 'pact' | 'none';

/** Multiclass spell slot table (D&D 5e SRD) — indexed by total caster level 1–20 */
const MULTICLASS_SPELL_SLOTS: Record<number, SpellSlots> = {
  1: {
    1: { max: 2, used: 0 },
    2: { max: 0, used: 0 },
    3: { max: 0, used: 0 },
    4: { max: 0, used: 0 },
    5: { max: 0, used: 0 },
    6: { max: 0, used: 0 },
    7: { max: 0, used: 0 },
    8: { max: 0, used: 0 },
    9: { max: 0, used: 0 },
  },
  2: {
    1: { max: 3, used: 0 },
    2: { max: 0, used: 0 },
    3: { max: 0, used: 0 },
    4: { max: 0, used: 0 },
    5: { max: 0, used: 0 },
    6: { max: 0, used: 0 },
    7: { max: 0, used: 0 },
    8: { max: 0, used: 0 },
    9: { max: 0, used: 0 },
  },
  3: {
    1: { max: 4, used: 0 },
    2: { max: 2, used: 0 },
    3: { max: 0, used: 0 },
    4: { max: 0, used: 0 },
    5: { max: 0, used: 0 },
    6: { max: 0, used: 0 },
    7: { max: 0, used: 0 },
    8: { max: 0, used: 0 },
    9: { max: 0, used: 0 },
  },
  4: {
    1: { max: 4, used: 0 },
    2: { max: 3, used: 0 },
    3: { max: 0, used: 0 },
    4: { max: 0, used: 0 },
    5: { max: 0, used: 0 },
    6: { max: 0, used: 0 },
    7: { max: 0, used: 0 },
    8: { max: 0, used: 0 },
    9: { max: 0, used: 0 },
  },
  5: {
    1: { max: 4, used: 0 },
    2: { max: 3, used: 0 },
    3: { max: 2, used: 0 },
    4: { max: 0, used: 0 },
    5: { max: 0, used: 0 },
    6: { max: 0, used: 0 },
    7: { max: 0, used: 0 },
    8: { max: 0, used: 0 },
    9: { max: 0, used: 0 },
  },
  6: {
    1: { max: 4, used: 0 },
    2: { max: 3, used: 0 },
    3: { max: 3, used: 0 },
    4: { max: 0, used: 0 },
    5: { max: 0, used: 0 },
    6: { max: 0, used: 0 },
    7: { max: 0, used: 0 },
    8: { max: 0, used: 0 },
    9: { max: 0, used: 0 },
  },
  7: {
    1: { max: 4, used: 0 },
    2: { max: 3, used: 0 },
    3: { max: 3, used: 0 },
    4: { max: 1, used: 0 },
    5: { max: 0, used: 0 },
    6: { max: 0, used: 0 },
    7: { max: 0, used: 0 },
    8: { max: 0, used: 0 },
    9: { max: 0, used: 0 },
  },
  8: {
    1: { max: 4, used: 0 },
    2: { max: 3, used: 0 },
    3: { max: 3, used: 0 },
    4: { max: 2, used: 0 },
    5: { max: 0, used: 0 },
    6: { max: 0, used: 0 },
    7: { max: 0, used: 0 },
    8: { max: 0, used: 0 },
    9: { max: 0, used: 0 },
  },
  9: {
    1: { max: 4, used: 0 },
    2: { max: 3, used: 0 },
    3: { max: 3, used: 0 },
    4: { max: 3, used: 0 },
    5: { max: 1, used: 0 },
    6: { max: 0, used: 0 },
    7: { max: 0, used: 0 },
    8: { max: 0, used: 0 },
    9: { max: 0, used: 0 },
  },
  10: {
    1: { max: 4, used: 0 },
    2: { max: 3, used: 0 },
    3: { max: 3, used: 0 },
    4: { max: 3, used: 0 },
    5: { max: 2, used: 0 },
    6: { max: 0, used: 0 },
    7: { max: 0, used: 0 },
    8: { max: 0, used: 0 },
    9: { max: 0, used: 0 },
  },
  11: {
    1: { max: 4, used: 0 },
    2: { max: 3, used: 0 },
    3: { max: 3, used: 0 },
    4: { max: 3, used: 0 },
    5: { max: 2, used: 0 },
    6: { max: 1, used: 0 },
    7: { max: 0, used: 0 },
    8: { max: 0, used: 0 },
    9: { max: 0, used: 0 },
  },
  12: {
    1: { max: 4, used: 0 },
    2: { max: 3, used: 0 },
    3: { max: 3, used: 0 },
    4: { max: 3, used: 0 },
    5: { max: 2, used: 0 },
    6: { max: 1, used: 0 },
    7: { max: 0, used: 0 },
    8: { max: 0, used: 0 },
    9: { max: 0, used: 0 },
  },
  13: {
    1: { max: 4, used: 0 },
    2: { max: 3, used: 0 },
    3: { max: 3, used: 0 },
    4: { max: 3, used: 0 },
    5: { max: 2, used: 0 },
    6: { max: 1, used: 0 },
    7: { max: 1, used: 0 },
    8: { max: 0, used: 0 },
    9: { max: 0, used: 0 },
  },
  14: {
    1: { max: 4, used: 0 },
    2: { max: 3, used: 0 },
    3: { max: 3, used: 0 },
    4: { max: 3, used: 0 },
    5: { max: 2, used: 0 },
    6: { max: 1, used: 0 },
    7: { max: 1, used: 0 },
    8: { max: 0, used: 0 },
    9: { max: 0, used: 0 },
  },
  15: {
    1: { max: 4, used: 0 },
    2: { max: 3, used: 0 },
    3: { max: 3, used: 0 },
    4: { max: 3, used: 0 },
    5: { max: 2, used: 0 },
    6: { max: 1, used: 0 },
    7: { max: 1, used: 0 },
    8: { max: 1, used: 0 },
    9: { max: 0, used: 0 },
  },
  16: {
    1: { max: 4, used: 0 },
    2: { max: 3, used: 0 },
    3: { max: 3, used: 0 },
    4: { max: 3, used: 0 },
    5: { max: 2, used: 0 },
    6: { max: 1, used: 0 },
    7: { max: 1, used: 0 },
    8: { max: 1, used: 0 },
    9: { max: 0, used: 0 },
  },
  17: {
    1: { max: 4, used: 0 },
    2: { max: 3, used: 0 },
    3: { max: 3, used: 0 },
    4: { max: 3, used: 0 },
    5: { max: 2, used: 0 },
    6: { max: 1, used: 0 },
    7: { max: 1, used: 0 },
    8: { max: 1, used: 0 },
    9: { max: 1, used: 0 },
  },
  18: {
    1: { max: 4, used: 0 },
    2: { max: 3, used: 0 },
    3: { max: 3, used: 0 },
    4: { max: 3, used: 0 },
    5: { max: 3, used: 0 },
    6: { max: 1, used: 0 },
    7: { max: 1, used: 0 },
    8: { max: 1, used: 0 },
    9: { max: 1, used: 0 },
  },
  19: {
    1: { max: 4, used: 0 },
    2: { max: 3, used: 0 },
    3: { max: 3, used: 0 },
    4: { max: 3, used: 0 },
    5: { max: 3, used: 0 },
    6: { max: 2, used: 0 },
    7: { max: 1, used: 0 },
    8: { max: 1, used: 0 },
    9: { max: 1, used: 0 },
  },
  20: {
    1: { max: 4, used: 0 },
    2: { max: 3, used: 0 },
    3: { max: 3, used: 0 },
    4: { max: 3, used: 0 },
    5: { max: 3, used: 0 },
    6: { max: 2, used: 0 },
    7: { max: 2, used: 0 },
    8: { max: 1, used: 0 },
    9: { max: 1, used: 0 },
  },
};

const EMPTY_SLOTS: SpellSlots = {
  1: { max: 0, used: 0 },
  2: { max: 0, used: 0 },
  3: { max: 0, used: 0 },
  4: { max: 0, used: 0 },
  5: { max: 0, used: 0 },
  6: { max: 0, used: 0 },
  7: { max: 0, used: 0 },
  8: { max: 0, used: 0 },
  9: { max: 0, used: 0 },
};

/** Determine caster type for a class (SRD 5.1/5.2) */
function casterTypeForClass(classId: string, subclassId?: string): CasterType {
  const fullCasters = ['bard', 'cleric', 'druid', 'sorcerer', 'wizard'];
  const halfCasters = ['paladin', 'ranger'];

  if (fullCasters.includes(classId)) return 'full';
  if (halfCasters.includes(classId)) return 'half';
  if (classId === 'warlock') return 'pact';

  // Subclass-based third casters
  if (classId === 'fighter' && subclassId === 'eldritch-knight') return 'third';
  if (classId === 'rogue' && subclassId === 'arcane-trickster') return 'third';

  return 'none';
}

/**
 * Compute spell slots for a 5e character from their class levels.
 * Handles multiclassing per SRD rules.
 *
 * @param classLevels Array of { classId, level, subclassId? }
 * @param existingSlots Optional existing slots to preserve `used` counts
 * @returns Computed SpellSlots with max values from the table and preserved used counts
 */
export function compute5eSpellSlots(
  classLevels: Array<{ classId: string; level: number; subclassId?: string }>,
  existingSlots?: SpellSlots
): SpellSlots {
  let casterLevel = 0;

  for (const cl of classLevels) {
    const type = casterTypeForClass(cl.classId, cl.subclassId);
    switch (type) {
      case 'full':
        casterLevel += cl.level;
        break;
      case 'half':
        casterLevel += Math.floor(cl.level / 2);
        break;
      case 'third':
        casterLevel += Math.floor(cl.level / 3);
        break;
      // pact and none contribute 0
    }
  }

  casterLevel = Math.max(0, Math.min(20, casterLevel));
  if (casterLevel === 0) {
    return { ...EMPTY_SLOTS };
  }

  const table = MULTICLASS_SPELL_SLOTS[casterLevel];

  // Preserve existing `used` counts so we don't reset tracking on re-prepare
  const result: SpellSlots = { ...EMPTY_SLOTS };
  for (let lvl = 1; lvl <= 9; lvl++) {
    const key = lvl as keyof SpellSlots;
    const maxSlots = table[key].max;
    const usedSlots = existingSlots ? Math.min(existingSlots[key].used, maxSlots) : 0;
    result[key] = { max: maxSlots, used: usedSlots };
  }

  return result;
}
