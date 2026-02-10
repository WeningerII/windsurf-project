import { Character } from '../../types/core/character';
import { Species } from '../../types/character-options/species';
import { calculateAbilityModifier } from '../core/calculator';
import { ComputedAttribute } from '../../types/mechanics/attributes';

export function calculateTotalAttributeScore(
  character: Character,
  attributeId: string,
  species?: Species
): number {
  let total = character.baseAttributes[attributeId] ?? 10;
  
  // Add racial bonuses
  if (species) {
    for (const increase of species.abilityScoreIncrease) {
      if (increase.type === 'fixed' && increase.attributes) {
        total += increase.attributes[attributeId] ?? 0;
      }
    }
  }
  
  // Additional bonuses from items, spells, and other effects can be added here
  
  return Math.min(total, 30); // Cap at 30
}

export function computeAttribute(
  character: Character,
  attributeId: string,
  species?: Species
): ComputedAttribute {
  const score = calculateTotalAttributeScore(character, attributeId, species);
  const modifier = calculateAbilityModifier(score);
  const savingThrowProficient = character.savingThrowProficiencies.includes(attributeId);
  const proficiencyBonus = Math.ceil(character.level / 4) + 1;
  const savingThrow = modifier + (savingThrowProficient ? proficiencyBonus : 0);
  
  return {
    score,
    modifier,
    savingThrow,
    savingThrowProficient,
  };
}

export function computeAllAttributes(
  character: Character,
  species?: Species
): Record<string, ComputedAttribute> {
  const attributes = ['str', 'dex', 'con', 'int', 'wis', 'cha'];
  const computed: Record<string, ComputedAttribute> = {};
  
  for (const attr of attributes) {
    computed[attr] = computeAttribute(character, attr, species);
  }
  
  return computed;
}
