import { ProficiencyLevel } from '../core/character';

export interface SkillDefinition {
  id: string;
  name: string;
  attribute: string; // Which attribute it's based on
  description: string;
  trainedOnly?: boolean; // Some systems require training to use
}

export interface ComputedSkill {
  id: string;
  name: string;
  attribute: string;
  attributeModifier: number;
  proficiencyBonus: number;
  proficiencyLevel: ProficiencyLevel;
  ranks?: number; // For 3.5e/PF1e
  miscModifiers: number;
  total: number;
}
