import { Choice } from '../core/common';
import { Feature } from '../core/character';

export interface Background {
  id: string;
  name: string;
  system: string;
  source: string;
  
  // Proficiencies
  skillProficiencies: string[] | Choice<string>;
  toolProficiencies?: string[] | Choice<string>;
  languageProficiencies?: Choice<string>;
  
  // Equipment
  equipment: string[];
  gold: number;
  
  // Features
  feature: Feature;
  
  // Personality
  suggestedCharacteristics: {
    traits: string[];
    ideals: string[];
    bonds: string[];
    flaws: string[];
  };
  
  description: string;
}
