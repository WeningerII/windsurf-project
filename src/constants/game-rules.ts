/**
 * D&D 5e Game Rules Constants
 *
 * These constants are specific to D&D 5e (2014 & 2024). They are consumed by
 * the validation system. If/when native 5e sheets are fully independent,
 * move these into src/systems/dnd5e/constants.ts.
 */

export const GAME_RULES = {
  // Character Levels
  MAX_CHARACTER_LEVEL: 20,
  MIN_CHARACTER_LEVEL: 1,

  // Ability Scores
  MAX_ABILITY_SCORE: 30,
  MIN_ABILITY_SCORE: 1,
  DEFAULT_ABILITY_SCORE: 10,
  ABILITY_MODIFIER_BASE: 10,
  ABILITY_MODIFIER_DIVISOR: 2,

  // Proficiency Bonus
  PROFICIENCY_BONUS_DIVISOR: 4,
  PROFICIENCY_BONUS_BASE: 1,

  // Spell Levels
  MAX_SPELL_LEVEL: 9,
  MIN_SPELL_LEVEL: 0,
  CANTRIP_LEVEL: 0,

  // Hit Points
  MIN_HIT_POINTS: 1,
  MIN_CURRENT_HP: 0,
  MIN_TEMP_HP: 0,

  // Armor Class
  BASE_ARMOR_CLASS: 10,
  MIN_ARMOR_CLASS: 1,

  // Speed
  DEFAULT_SPEED: 30,
  MIN_SPEED: 0,

  // Spell Slot Progression Length
  SPELL_SLOT_ARRAY_LENGTH: 20,

  // Saving Throws
  SAVING_THROW_COUNT: 2,

  // Character Name
  MAX_CHARACTER_NAME_LENGTH: 100,
  MIN_CHARACTER_NAME_LENGTH: 1,
};

// Re-export shared math as named 5e-style aliases
export { abilityMod as calculateAbilityModifier } from '../utils/math';

export function calculateProficiencyBonus(level: number): number {
  return (
    Math.ceil(level / GAME_RULES.PROFICIENCY_BONUS_DIVISOR) + GAME_RULES.PROFICIENCY_BONUS_BASE
  );
}

/**
 * Validate character level
 */
export function isValidLevel(level: number): boolean {
  return (
    Number.isInteger(level) &&
    level >= GAME_RULES.MIN_CHARACTER_LEVEL &&
    level <= GAME_RULES.MAX_CHARACTER_LEVEL
  );
}

/**
 * Validate ability score
 */
export function isValidAbilityScore(score: number): boolean {
  return (
    Number.isInteger(score) &&
    score >= GAME_RULES.MIN_ABILITY_SCORE &&
    score <= GAME_RULES.MAX_ABILITY_SCORE
  );
}

/**
 * Validate spell level
 */
export function isValidSpellLevel(level: number): boolean {
  return (
    Number.isInteger(level) &&
    level >= GAME_RULES.MIN_SPELL_LEVEL &&
    level <= GAME_RULES.MAX_SPELL_LEVEL
  );
}
