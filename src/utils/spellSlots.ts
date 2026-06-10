/**
 * D&D 5e Spell Slot Calculator (SRD 5.1 / 5.2)
 *
 * Full casters (Bard, Cleric, Druid, Sorcerer, Wizard): caster level = class level
 * Half casters (Paladin, Ranger):
 *   - 2014 single class: class table (= ceil(level / 2), no slots at level 1)
 *   - 2014 multiclass:   floor(level / 2) per the SRD 5.1 multiclass rule
 *   - 2024 (both):       ceil(level / 2) — SRD 5.2 rounds up; casting starts at level 1
 * Third casters (Eldritch Knight, Arcane Trickster):
 *   - 2014 single class: class table (= ceil(level / 3), no slots before level 3)
 *   - 2014 multiclass:   floor(level / 3)
 *   - 2024 (both):       ceil(level / 3)
 * Pact casters (Warlock): separate Pact Magic pool (see computePactMagicSlots);
 *   never contributes to the multiclass table.
 * Non-casters: caster level = 0
 *
 * The multiclass table applies only when 2+ classes contribute spell slots
 * (SRD: "if you have more than one spellcasting class"); a single-classed
 * caster uses their own class table. The single-class roundings above
 * reproduce the SRD class tables exactly.
 *
 * Total caster level = sum of all individual caster levels, clamped to [0, 20].
 * Look up the (shared 2014/2024) spell slot table by total caster level.
 */

import type { PactMagicSlots, SpellSlots } from '../types/core/character';

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

/** Build a fresh all-zero slot grid (fresh nested objects — never shared). */
function makeEmptySlots(): SpellSlots {
  return {
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
}

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

export type Dnd5eRulesEdition = '2014' | '2024';

export interface Compute5eSpellSlotsOptions {
  /** Rules edition for half/third-caster rounding. Defaults to '2014'. */
  edition?: Dnd5eRulesEdition;
}

/**
 * Caster level contributed by one half-caster class (Paladin/Ranger).
 *
 * SRD 5.1 multiclass rule floors; the single-class Paladin/Ranger tables are
 * equivalent to ceil(level / 2) with no casting at level 1. SRD 5.2 (2024)
 * rounds half-caster levels up in all cases and grants slots from level 1.
 */
function halfCasterLevel(level: number, edition: Dnd5eRulesEdition, singleClass: boolean): number {
  if (edition === '2024') {
    return Math.ceil(level / 2);
  }
  if (singleClass) {
    return level >= 2 ? Math.ceil(level / 2) : 0;
  }
  return Math.floor(level / 2);
}

/**
 * Caster level contributed by one third-caster subclass (EK/AT).
 * Same rounding split as half casters; casting begins at class level 3 (2014).
 */
function thirdCasterLevel(level: number, edition: Dnd5eRulesEdition, singleClass: boolean): number {
  if (edition === '2024') {
    return Math.ceil(level / 3);
  }
  if (singleClass) {
    return level >= 3 ? Math.ceil(level / 3) : 0;
  }
  return Math.floor(level / 3);
}

/**
 * Compute spell slots for a 5e character from their class levels.
 *
 * Single-classed casters use their own class table (reproduced by per-edition
 * rounding, see module header); the multiclass combined-level rule applies
 * only when 2+ classes contribute slots. Warlock Pact Magic never contributes
 * here — see computePactMagicSlots.
 *
 * @param classLevels Array of { classId, level, subclassId? }
 * @param existingSlots Optional existing slots to preserve `used` counts
 * @param options Edition selection ('2014' default, '2024' rounds up)
 * @returns Computed SpellSlots with max values from the table and preserved used counts
 */
export function compute5eSpellSlots(
  classLevels: Array<{ classId: string; level: number; subclassId?: string }>,
  existingSlots?: SpellSlots,
  options?: Compute5eSpellSlotsOptions
): SpellSlots {
  const edition = options?.edition ?? '2014';
  const contributors = classLevels
    .map((cl) => ({ level: cl.level, type: casterTypeForClass(cl.classId, cl.subclassId) }))
    .filter(
      (cl) => cl.level > 0 && (cl.type === 'full' || cl.type === 'half' || cl.type === 'third')
    );
  // SRD: the multiclass spellcaster table applies only with more than one
  // slot-contributing class (Pact Magic is a separate feature and never counts).
  const singleClass = contributors.length === 1;

  let casterLevel = 0;
  for (const cl of contributors) {
    switch (cl.type) {
      case 'full':
        casterLevel += cl.level;
        break;
      case 'half':
        casterLevel += halfCasterLevel(cl.level, edition, singleClass);
        break;
      case 'third':
        casterLevel += thirdCasterLevel(cl.level, edition, singleClass);
        break;
    }
  }

  casterLevel = Math.max(0, Math.min(20, casterLevel));
  if (casterLevel === 0) {
    return makeEmptySlots();
  }

  const table = MULTICLASS_SPELL_SLOTS[casterLevel];

  // Preserve existing `used` counts so we don't reset tracking on re-prepare.
  // Guard each level key: persisted documents may carry partial slot objects.
  const result: SpellSlots = makeEmptySlots();
  for (let lvl = 1; lvl <= 9; lvl++) {
    const key = lvl as keyof SpellSlots;
    const maxSlots = table[key].max;
    const usedSlots = Math.min(existingSlots?.[key]?.used ?? 0, maxSlots);
    result[key] = { max: maxSlots, used: usedSlots };
  }

  return result;
}

/**
 * Warlock Pact Magic slots (SRD 5.1/5.2).
 *
 * Slot count: 1 at level 1, 2 at level 2, 3 at level 11, 4 at level 17.
 * Slot level: ceil(min(level, 9) / 2), capped at 5 (levels 6–9 spells come
 * from Mystic Arcanum, not slots). All pact slots recover on a short rest.
 *
 * @param warlockLevel Total warlock class levels (0 → undefined: no pact pool)
 * @param existing Optional previous pool to preserve the `used` count
 */
export function computePactMagicSlots(
  warlockLevel: number,
  existing?: PactMagicSlots
): PactMagicSlots | undefined {
  const level = Math.min(20, Math.floor(warlockLevel));
  if (level <= 0) {
    return undefined;
  }

  const max = level >= 17 ? 4 : level >= 11 ? 3 : level >= 2 ? 2 : 1;
  const slotLevel = Math.min(5, Math.ceil(Math.min(level, 9) / 2));
  const used = Math.min(Math.max(0, existing?.used ?? 0), max);

  return { level: slotLevel, max, used };
}
