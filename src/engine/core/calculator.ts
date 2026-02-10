// Core calculation utilities

import { GAME_RULES } from '../../constants/game-rules';

export function calculateAbilityModifier(score: number): number {
  return Math.floor((score - GAME_RULES.ABILITY_MODIFIER_BASE) / GAME_RULES.ABILITY_MODIFIER_DIVISOR);
}

export function calculateProficiencyBonus(level: number): number {
  return Math.ceil(level / GAME_RULES.PROFICIENCY_BONUS_DIVISOR) + GAME_RULES.PROFICIENCY_BONUS_BASE;
}

export function formatModifier(value: number): string {
  return value >= 0 ? `+${value}` : `${value}`;
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

export function rollDice(sides: number, count: number = 1): number[] {
  const rolls: number[] = [];
  for (let i = 0; i < count; i++) {
    rolls.push(Math.floor(Math.random() * sides) + 1);
  }
  return rolls;
}

export function parseDiceNotation(notation: string): { count: number; sides: number; modifier: number } {
  const match = notation.match(/(\d+)?d(\d+)([+-]\d+)?/i);
  if (!match) {
    throw new Error(`Invalid dice notation: ${notation}`);
  }
  
  return {
    count: match[1] ? parseInt(match[1]) : 1,
    sides: parseInt(match[2]),
    modifier: match[3] ? parseInt(match[3]) : 0,
  };
}

export function rollDiceNotation(notation: string): number {
  const { count, sides, modifier } = parseDiceNotation(notation);
  const rolls = rollDice(sides, count);
  return rolls.reduce((sum, roll) => sum + roll, 0) + modifier;
}
