/**
 * Entity-id conventions (review L-5).
 *
 * Ids are bare strings with NO branding, and the same id may legitimately
 * recur across systems ('club', 'cleric') — safe ONLY because every catalog
 * and store is per-system. Code must never mix ids from different systems in
 * one keyed collection without namespacing.
 *
 * Per-system suffix/prefix conventions in the data:
 *   - 5e 2014: bare kebab ids ('fire-bolt'); 2024 entries suffix '-2024'
 *     ('mind-flayer-2024').
 *   - 3.5e: suffix '-35e', often with the class variant for legacy split
 *     entries ('bane-cleric-35e'); the spell catalog merges those splits and
 *     aliases old ids to canonical ones (see data/dnd/3.5e/spells/index.ts).
 *   - PF1e / PF2e: bare kebab ids; PF2e archetypes prefix 'pf2e-'.
 *   - M&M 3e: prefix 'mam3e-' for archetypes; powers/advantages bare kebab.
 *   - Daggerheart: prefix 'daggerheart-' for generated entities
 *     ('daggerheart-weapon-primary-…').
 *
 * New data MUST follow its system's existing convention; cross-system
 * consumers key by (systemId, id), never by id alone.
 */

// Shared vocabulary types — largely d20-family, despite living in core:
// AbilityScore is the six d20 abilities, DamageType is the 5e list plus
// 3.5e's electricity/sonic, BonusType is d20/PF named-bonus stacking.
// Daggerheart's traits (agility/instinct/presence/…) and M&M's abilities
// (fgt/awe/…) live in their own system types, not here.

// d2/d3 appear in the SRD 3.5 size-step damage table (Tiny weapon dice).
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
