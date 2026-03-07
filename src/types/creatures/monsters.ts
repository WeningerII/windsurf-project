import { DiceRoll, DamageType, AbilityScore } from '../core/common';

export interface Monster {
  id: string;
  name: string;
  system: string;
  source: string;

  // Basic Info
  size: CreatureSize;
  type: CreatureType;
  alignment: Alignment;
  challengeRating: number;
  experiencePoints: number;

  // Defenses
  armorClass: number;
  hitPoints: DiceRoll;
  speed: CreatureSpeed;

  // Ability Scores
  abilities: AbilityScores;

  // Proficiencies
  savingThrows?: Partial<Record<AbilityScore, number>>;
  skills?: Record<string, number>;

  // Resistances & Immunities
  damageResistances?: DamageType[];
  damageImmunities?: DamageType[];
  damageVulnerabilities?: DamageType[];
  conditionImmunities?: string[];

  // Senses
  senses: string[];
  languages: string[];

  // Abilities
  specialAbilities?: SpecialAbility[];
  actions: Action[];
  reactions?: Action[];
  legendaryActions?: LegendaryAction[];

  // Description
  description?: string;
  environment?: string[];
}

export type CreatureSize = 'tiny' | 'small' | 'medium' | 'large' | 'huge' | 'gargantuan';

export type CreatureType =
  | 'aberration'
  | 'beast'
  | 'celestial'
  | 'construct'
  | 'dragon'
  | 'elemental'
  | 'fey'
  | 'fiend'
  | 'giant'
  | 'humanoid'
  | 'monstrosity'
  | 'ooze'
  | 'plant'
  | 'undead';

export type Alignment =
  | 'lawful good'
  | 'neutral good'
  | 'chaotic good'
  | 'lawful neutral'
  | 'true neutral'
  | 'chaotic neutral'
  | 'lawful evil'
  | 'neutral evil'
  | 'chaotic evil'
  | 'unaligned';

export interface AbilityScores {
  str: number;
  dex: number;
  con: number;
  int: number;
  wis: number;
  cha: number;
}

export interface CreatureSpeed {
  walk?: number;
  fly?: number;
  swim?: number;
  burrow?: number;
  climb?: number;
}

export interface SpecialAbility {
  name: string;
  description: string;
  recharge?: string; // e.g., "5-6" or "short rest"
}

export interface Action {
  name: string;
  description: string;
  attackBonus?: number;
  reach?: number;
  range?: { normal: number; max: number };
  damage?: ActionDamage[];
  savingThrow?: {
    attribute: AbilityScore;
    dc: number;
    effect: string;
  };
  recharge?: string; // e.g., "5-6" for breath weapons
}

export interface ActionDamage {
  dice: DiceRoll;
  type: DamageType;
  condition?: string; // e.g., "on a hit" or "on failed save"
}

export interface LegendaryAction {
  name: string;
  cost: number; // Number of legendary actions this costs
  description: string;
}

// Challenge Rating to XP mapping
export const CR_TO_XP: Record<number, number> = {
  0: 10,
  0.125: 25,
  0.25: 50,
  0.5: 100,
  1: 200,
  2: 450,
  3: 700,
  4: 1100,
  5: 1800,
  6: 2300,
  7: 2900,
  8: 3900,
  9: 5000,
  10: 5900,
  11: 7200,
  12: 8400,
  13: 10000,
  14: 11500,
  15: 13000,
  16: 15000,
  17: 18000,
  18: 20000,
  19: 22000,
  20: 25000,
  21: 33000,
  22: 41000,
  23: 50000,
  24: 62000,
  25: 75000,
  26: 90000,
  27: 105000,
  28: 120000,
  29: 135000,
  30: 155000,
};
