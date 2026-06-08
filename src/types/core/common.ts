// Common types used across the application

// d2 and d3 are used by Pathfinder/3.5e weapon damage (e.g. whip, gauntlet) and
// some effects; they are valid d20-system dice alongside the standard polyhedrals.
export type DiceType = 'd1' | 'd2' | 'd3' | 'd4' | 'd6' | 'd8' | 'd10' | 'd12' | 'd20' | 'd100';

// Ability Scores - Type-safe enumeration
export type AbilityScore = 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha';

export const AbilityScores = {
  STR: 'str' as AbilityScore,
  DEX: 'dex' as AbilityScore,
  CON: 'con' as AbilityScore,
  INT: 'int' as AbilityScore,
  WIS: 'wis' as AbilityScore,
  CHA: 'cha' as AbilityScore,
} as const;

export interface DiceRoll {
  count: number;
  die: DiceType;
  modifier?: number;
  notation: string; // e.g., "2d6+3"
}

export type DamageType =
  | 'acid'
  | 'bludgeoning'
  | 'cold'
  | 'fire'
  | 'force'
  | 'lightning'
  | 'necrotic'
  | 'piercing'
  | 'poison'
  | 'psychic'
  | 'radiant'
  | 'slashing'
  | 'thunder'
  | 'electricity'
  | 'sonic';

export type BonusType =
  | 'enhancement'
  | 'circumstance'
  | 'racial'
  | 'insight'
  | 'luck'
  | 'proficiency'
  | 'alchemical'
  | 'divine'
  | 'armor-class'
  | 'damage'
  | 'ability-score'
  | 'attack'
  | 'saving-throw'
  | 'skill'
  | 'untyped';

export interface Modifier {
  value: number;
  type: BonusType;
  source: string;
}

export type Duration =
  | { type: 'instant' }
  | { type: 'rounds'; rounds: number }
  | { type: 'rounds-per-level'; rounds: number }
  | { type: 'minutes'; minutes: number }
  | { type: 'minutes-per-level'; minutes: number }
  | { type: 'hours'; hours: number }
  | { type: 'hours-per-level'; hours: number }
  | { type: 'days-per-level'; days: number }
  | { type: 'concentration'; maxDuration: string }
  | { type: 'permanent' }
  | { type: 'unlimited' }
  | { type: 'varies'; description?: string }
  | { type: 'special'; description: string };

export type Range =
  | { type: 'self' }
  | { type: 'personal' }
  | { type: 'touch' }
  | { type: 'ranged'; feet: number }
  | { type: 'close'; feet?: number }
  | { type: 'medium'; feet?: number }
  | { type: 'long'; feet?: number }
  | { type: 'sight' }
  | { type: 'unlimited' }
  | { type: 'cone'; feet: number }
  | { type: 'special'; description: string };

export type AreaOfEffect =
  | { type: 'cone'; feet: number }
  | { type: 'cube'; feet: number }
  | { type: 'cylinder'; radius: number; height: number }
  | { type: 'line'; length: number; width: number }
  | { type: 'sphere'; radius: number }
  | { type: 'emanation'; radius: number }
  | { type: 'spread'; radius: number };

export interface Prerequisite {
  type:
    | 'level'
    | 'attribute'
    | 'ability'
    | 'proficiency'
    | 'feature'
    | 'spell'
    | 'class'
    | 'race'
    | 'skill'
    | 'advantage'
    | 'other';
  id?: string;
  ability?: string;
  value?: string | number;
  minValue?: number;
  description?: string;
}

export interface Choice<T> {
  count: number;
  options: T[];
  label: string;
}
