import { AbilityScore, Choice } from '../core/common';
import { Feature } from '../core/character';

/**
 * One lettered starting-equipment package. SRD 5.2 gives every background a
 * choice between a kit (A) and a flat 50 GP (B); the money-only branch carries
 * an empty `items`.
 */
export interface BackgroundEquipmentOption {
  label: string;
  items: { itemId: string; quantity: number }[];
  gold: number;
}

export interface Background {
  id: string;
  name: string;
  system: string;
  source: string;

  // Proficiencies
  skillProficiencies: string[] | Choice<string>;
  toolProficiencies?: string[] | Choice<string>;
  languageProficiencies?: Choice<string>;

  // Equipment. For a 2024-model background these mirror package A of
  // `equipmentOptions`, which is what the template applies by default.
  equipment: string[];
  gold: number;

  // 2024 model (SRD 5.2). A background lists three ability scores, grants a
  // named Origin feat, and offers a lettered equipment choice. Unset on
  // 2014-model backgrounds, which have none of these.
  abilityScores?: AbilityScore[];
  originFeat?: { id: string; name: string };
  equipmentOptions?: BackgroundEquipmentOption[];

  // 2014 model. SRD 5.2 replaced the background feature, the personality
  // tables and the descriptive prose with the three fields above, so a
  // 2024-model background carries none of these.
  feature?: Feature;
  suggestedCharacteristics?: {
    traits: string[];
    ideals: string[];
    bonds: string[];
    flaws: string[];
  };
  description?: string;
}
