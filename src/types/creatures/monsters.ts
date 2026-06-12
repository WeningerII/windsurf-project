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
  /** 3.5e/PF1e Fort/Ref/Will saves (these are not ability-keyed like 5e's). */
  d20Saves?: { fort: number; ref: number; will: number };
  /** 3.5e/PF1e base attack bonus. */
  baseAttackBonus?: number;
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
  | 'undead'
  // Swarms ("swarm of Tiny beasts") are a first-class SRD creature type.
  | 'swarm'
  // 3.5e SRD creature types absent from the 5e taxonomy.
  | 'animal'
  | 'magical-beast'
  | 'monstrous-humanoid'
  | 'outsider'
  | 'vermin'
  // PF2e creature types absent from both (aeons/proteans/psychopomps are
  // 'monitor'; PF2e splits fungi from plants).
  | 'monitor'
  | 'fungus'
  | 'astral';

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
  | 'unaligned'
  // SRD statblocks like the Doppelganger print "any alignment".
  | 'any';

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
