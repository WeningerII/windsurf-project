// Core calculation utilities
// Delegates to shared utils where possible; keeps 5e-specific helpers here.

import { GAME_RULES } from '../../constants/game-rules';
import { abilityMod, formatMod } from '../../utils/math';

export function calculateAbilityModifier(score: number): number {
  return abilityMod(score);
}

export function calculateProficiencyBonus(level: number): number {
  return Math.ceil(level / GAME_RULES.PROFICIENCY_BONUS_DIVISOR) + GAME_RULES.PROFICIENCY_BONUS_BASE;
}

export function formatModifier(value: number): string {
  return formatMod(value);
}

export function calculateSpellSaveDC(
  spellcastingAbilityModifier: number,
  proficiencyBonus: number
): number {
  return 8 + spellcastingAbilityModifier + proficiencyBonus;
}

export function calculateSpellAttackBonus(
  spellcastingAbilityModifier: number,
  proficiencyBonus: number
): number {
  return spellcastingAbilityModifier + proficiencyBonus;
}

// Re-export dice utilities from canonical location
export { rollDice, parseDiceNotation, rollDiceNotation } from '../../utils/dice';
