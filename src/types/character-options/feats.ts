import { Prerequisite } from '../core/common';
import { Modifier } from '../core/common';

export interface FeatDefinition {
  id: string;
  name: string;
  system: string;
  source: string;

  prerequisites?: Prerequisite[];

  // Feat benefits
  abilityScoreIncrease?: AbilityScoreIncreaseFeat;
  proficienciesGranted?: ProficienciesGranted;
  modifiers?: Modifier[];

  description: string;
  benefits: string[];
  special?: string;
}

export interface AbilityScoreIncreaseFeat {
  type: 'fixed' | 'choice';
  attributes?: Record<string, number>;
  totalIncrease?: number; // For flexible increases like "increase two different scores by 1"
  maxPerAttribute?: number;
}

export interface ProficienciesGranted {
  armor?: string[];
  weapons?: string[];
  tools?: string[];
  skills?: string[];
  languages?: string[];
}
