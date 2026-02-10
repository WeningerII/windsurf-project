import { Character } from '../../types/core/character';
import { SkillDefinition, ComputedSkill } from '../../types/mechanics/skills';
import { calculateAbilityModifier, calculateProficiencyBonus } from '../core/calculator';

export function calculateSkillBonus(
  character: Character,
  skill: SkillDefinition,
  attributeScores: Record<string, number>
): ComputedSkill {
  const attributeScore = attributeScores[skill.attribute] ?? 10;
  const attributeModifier = calculateAbilityModifier(attributeScore);
  
  const proficiency = character.skillProficiencies[skill.id];
  const proficiencyLevel = proficiency?.level || 'none';
  const proficiencyBonus = calculateProficiencyBonus(character.level);
  
  let proficiencyMultiplier = 0;
  switch (proficiencyLevel) {
    case 'half':
      proficiencyMultiplier = 0.5;
      break;
    case 'proficient':
      proficiencyMultiplier = 1;
      break;
    case 'expertise':
    case 'double':
      proficiencyMultiplier = 2;
      break;
  }
  
  const proficiencyBonusValue = Math.floor(proficiencyBonus * proficiencyMultiplier);
  const total = attributeModifier + proficiencyBonusValue;
  
  return {
    id: skill.id,
    name: skill.name,
    attribute: skill.attribute,
    attributeModifier,
    proficiencyBonus: proficiencyBonusValue,
    proficiencyLevel,
    miscModifiers: 0, // Additional modifiers from items, features, and effects
    total,
  };
}

export function computeAllSkills(
  character: Character,
  skills: SkillDefinition[],
  attributeScores: Record<string, number>
): ComputedSkill[] {
  return skills.map(skill => calculateSkillBonus(character, skill, attributeScores));
}
