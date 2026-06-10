import { Choice } from '../core/common';
import { Feature } from '../core/character';

// Species = Race/Ancestry depending on system
export interface Species {
  id: string;
  name: string;
  system: string; // Which game system
  source: string; // PHB, Volo's, etc.

  // Ability score modifiers
  abilityScoreIncrease: AbilityScoreIncrease[];

  // Basic traits
  size: Size;
  speed: number;
  languages: LanguageChoice;

  // Features
  traits: Feature[];

  // Optional: Subraces
  subraces?: Subrace[];

  // Flavor
  description: string;
  ageInfo: string;
  alignmentTendency?: string;
  sizeDescription: string;
}

export interface AbilityScoreIncrease {
  type: 'fixed' | 'choice';
  attributes?: Record<string, number>; // For fixed increases
  choice?: Choice<string>; // For flexible increases
  values?: number[]; // Optional: per-choice bonus values (e.g. [2, 1] for 2024-style)
}

export type Size = 'tiny' | 'small' | 'medium' | 'large' | 'huge' | 'gargantuan';

export interface LanguageChoice {
  automatic: string[]; // Languages granted automatically
  choice?: Choice<string>; // Choose X from a list
}

export interface Subrace {
  id: string;
  name: string;
  parentSpeciesId: string;
  abilityScoreIncrease: AbilityScoreIncrease[];
  traits: Feature[];
  description: string;
  /**
   * Open-content citation for this subrace (e.g. 'SRD 5.1'). Subraces can come
   * from a different book than their parent species, so the open-content
   * policy checks this nested attribution when present.
   */
  source?: string;
}
