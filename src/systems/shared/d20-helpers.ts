/**
 * Shared helpers for d20 3.x-family systems (D&D 3.5e and Pathfinder 1e).
 */

/** Size modifier for grapple (D&D 3.5e — opposite sign, larger steps) */
export const GRAPPLE_SIZE_MODS: Record<string, number> = {
  fine: -16,
  diminutive: -12,
  tiny: -8,
  small: -4,
  medium: 0,
  large: 4,
  huge: 8,
  gargantuan: 12,
  colossal: 16,
};

/** Size modifier for CMB/CMD (Pathfinder 1e — opposite sign from AC) */
export const CMB_SIZE_MODS: Record<string, number> = {
  fine: -8,
  diminutive: -4,
  tiny: -2,
  small: -1,
  medium: 0,
  large: 1,
  huge: 2,
  gargantuan: 4,
  colossal: 8,
};

/**
 * Compute base save bonus for a given class save progression.
 * Good save: 2 + level/2 (floored)
 * Poor save: level/3 (floored)
 */
export function baseSave(level: number, quality: 'good' | 'poor'): number {
  if (quality === 'good') return 2 + Math.floor(level / 2);
  return Math.floor(level / 3);
}

/**
 * Compute BAB for a class at a given level.
 * Full: level
 * Three-quarter: floor(level * 3/4)
 * Half: floor(level / 2)
 */
export function classBAB(level: number, progression: 'full' | 'three-quarter' | 'half'): number {
  if (progression === 'full') return level;
  if (progression === 'three-quarter') return Math.floor((level * 3) / 4);
  return Math.floor(level / 2);
}

// ── Carrying capacity & encumbrance ─────────────────────────────────────────
// The Carrying Capacity table and load rules are identical between SRD 3.5
// (Carrying Capacity) and the PF1e Core Rulebook (Carrying Capacity), so the
// math is shared by both d20-legacy systems.

/**
 * Heavy-load (maximum load) anchors in pounds for Strength 1-19. Index = the
 * Strength score (index 0 is unused — Strength 0 is helpless, 0 lbs). For
 * Strength >= 20 the capacity is the value ten Strength points lower, times 4
 * (the table's documented doubling-by-four pattern). SRD 3.5 / PF1e CRB.
 */
const HEAVY_LOAD_BY_STR: readonly number[] = [
  0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 115, 130, 150, 175, 200, 230, 260, 300, 350,
];

/** Maximum (heavy) load in pounds for a Strength score (SRD 3.5 / PF1e CRB). */
export function d20HeavyLoad(strength: number): number {
  const str = Math.floor(strength);
  if (str <= 0) return 0;
  if (str < HEAVY_LOAD_BY_STR.length) return HEAVY_LOAD_BY_STR[str];
  return d20HeavyLoad(str - 10) * 4;
}

export type D20LoadCategory = 'light' | 'medium' | 'heavy';

export interface D20CarryingCapacity {
  /** Maximum weight still counting as a light load. */
  light: number;
  /** Maximum weight still counting as a medium load. */
  medium: number;
  /** Maximum (heavy) load; weight above this exceeds carrying capacity. */
  heavy: number;
}

/**
 * Light / medium / heavy load thresholds in pounds: heavy is the table maximum,
 * with light = up to 1/3 and medium = up to 2/3 of it (SRD 3.5 / PF1e CRB).
 */
export function d20CarryingCapacity(strength: number): D20CarryingCapacity {
  const heavy = d20HeavyLoad(strength);
  return {
    light: Math.floor(heavy / 3),
    medium: Math.floor((heavy * 2) / 3),
    heavy,
  };
}

/**
 * Load category for a carried weight. Weight beyond the heavy threshold still
 * returns 'heavy' — exceeding it invokes the separate lift/drag limits
 * ({@link d20LiftDragLimits}); callers compare against `capacity.heavy` to detect that.
 */
export function d20LoadCategory(strength: number, weight: number): D20LoadCategory {
  const cap = d20CarryingCapacity(strength);
  if (weight <= cap.light) return 'light';
  if (weight <= cap.medium) return 'medium';
  return 'heavy';
}

export interface D20EncumbrancePenalties {
  /** Maximum Dexterity bonus to AC imposed by the load (null = no limit). */
  maxDex: number | null;
  /** Armor check penalty imposed by the load. */
  checkPenalty: number;
  /** Run speed multiplier (x4 light/medium, x3 heavy). */
  runMultiplier: number;
}

/**
 * Encumbrance penalties by load category (SRD 3.5 / PF1e CRB): a light load is
 * unencumbered; medium imposes max Dex +3 / -3 check penalty; heavy imposes max
 * Dex +1 / -6 check penalty and drops the run multiplier from x4 to x3.
 */
export function d20EncumbrancePenalties(category: D20LoadCategory): D20EncumbrancePenalties {
  switch (category) {
    case 'light':
      return { maxDex: null, checkPenalty: 0, runMultiplier: 4 };
    case 'medium':
      return { maxDex: 3, checkPenalty: -3, runMultiplier: 4 };
    case 'heavy':
      return { maxDex: 1, checkPenalty: -6, runMultiplier: 3 };
  }
}

/**
 * 3.5e skills that take an armor/encumbrance check penalty (the SRD's
 * Strength- and Dexterity-based physical skills). Swim is included; the SRD's
 * doubled penalty for Swim is an ARMOR-specific rule, so the encumbrance
 * (load) penalty below applies to it once.
 */
export const DND35E_CHECK_PENALTY_SKILLS: ReadonlySet<string> = new Set([
  'balance',
  'climb',
  'escape-artist',
  'hide',
  'jump',
  'move-silently',
  'sleight-of-hand',
  'swim',
  'tumble',
]);

/**
 * The encumbrance (load) check penalty applied to a single 3.5e check-penalty
 * skill, derived from carried weight against the character's Strength-based
 * carrying capacity. Returns 0 for an unaffected skill or a light load. The
 * gear-based armor check penalty is separate and not included here.
 */
export function dnd35eEncumbranceSkillPenalty(
  strength: number,
  carriedWeight: number,
  skillId: string
): number {
  if (!DND35E_CHECK_PENALTY_SKILLS.has(skillId)) return 0;
  return d20EncumbrancePenalties(d20LoadCategory(strength, carriedWeight)).checkPenalty;
}

export interface D20LiftDragLimits {
  /** Lift over head: up to the maximum (heavy) load. */
  overHead: number;
  /** Lift off the ground: up to 2x maximum load (can only stagger). */
  offGround: number;
  /** Push or drag: up to 5x maximum load. */
  pushDrag: number;
}

/** Lift/drag limits in pounds, as multiples of the maximum load (SRD 3.5 / PF1e CRB). */
export function d20LiftDragLimits(strength: number): D20LiftDragLimits {
  const max = d20HeavyLoad(strength);
  return { overHead: max, offGround: max * 2, pushDrag: max * 5 };
}

/**
 * Bonus spells per day granted by a high casting-ability modifier, for a given
 * spell level (SRD 3.5 / PF1e CRB — Ability Modifiers and Bonus Spells). You
 * gain bonus spells of spell level L only once your casting-ability modifier is
 * at least L, then one more for every 4 points of modifier beyond that. Spell
 * level 0 (cantrips/orisons) never gets bonus spells.
 */
export function d20BonusSpells(abilityMod: number, spellLevel: number): number {
  if (spellLevel < 1 || abilityMod < spellLevel) return 0;
  return Math.floor((abilityMod - spellLevel) / 4) + 1;
}
