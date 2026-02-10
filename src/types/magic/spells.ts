/**
 * Spell data types for magic systems
 * 
 * Unified spell interface supporting D&D, Pathfinder, and other magic systems.
 * Flexible enough to handle system differences (spell slots vs spell points, etc.).
 * 
 * @module types/magic/spells
 */

import { DiceRoll, DamageType, Duration, Range, AreaOfEffect } from '../core/common';

/**
 * Spell definition
 * 
 * Complete spell data including casting requirements, effects, and system info.
 * Level 0 = cantrips. Supports both D&D-style and Pathfinder-style spells.
 * 
 * @example
 * ```typescript
 * const fireball: Spell = {
 *   id: 'fireball',
 *   name: 'Fireball',
 *   system: 'dnd-5e-2014',
 *   level: 3,
 *   school: 'evocation',
 *   classes: ['wizard', 'sorcerer'],
 *   damage: { diceRoll: { count: 8, sides: 6, bonus: 0 }, damageType: 'fire' },
 *   // ... other required fields
 * };
 * ```
 */
export interface Spell {
  id: string;
  name: string;
  system: string;
  source: string;
  
  level: number; // 0 for cantrips
  school: MagicSchool;
  subschool?: string;
  descriptors?: string[];
  
  castingTime: CastingTime;
  range: Range;
  components: SpellComponents;
  duration: Duration;
  
  areaOfEffect?: AreaOfEffect;
  target?: string;
  effect?: string;
  area?: string;
  savingThrow?: SavingThrowInfo;
  attackRoll?: boolean;
  
  damage?: SpellDamage;
  healing?: DiceRoll;
  spellResistance?: boolean;
  
  concentration: boolean;
  ritual: boolean;
  
  description: string;
  atHigherLevels?: string;
  
  classes: string[]; // Which classes can learn this
  levelsByClass?: Record<string, number>;
}

/**
 * Magic schools for spell classification
 * 
 * Supports D&D schools (abjuration-transmutation) and Pathfinder traditions.
 */
export type MagicSchool = 
  | 'abjuration'
  | 'conjuration'
  | 'divination'
  | 'enchantment'
  | 'evocation'
  | 'illusion'
  | 'necromancy'
  | 'transmutation'
  | 'arcane'
  | 'divine'
  | 'occult'
  | 'primal';

/**
 * Spell casting time
 * 
 * Supports D&D 5e actions, D&D 3.5e/Pathfinder 1e actions, and extended casting times.
 */
export interface CastingTime {
  type:
    | 'action'
    | 'bonus-action'
    | 'reaction'
    | 'minute'
    | 'minutes'
    | 'hour'
    | 'standard'
    | 'full-round'
    | 'swift'
    | 'immediate'
    | 'free'
    | 'rounds';
  amount?: number;
  minutes?: number;
  hours?: number;
  rounds?: number;
  condition?: string; // For reactions
}

/**
 * Spell components (Verbal, Somatic, Material)
 * 
 * Tracks VSM components and material cost for expensive components.
 */
export interface SpellComponents {
  verbal: boolean;
  somatic: boolean;
  material: boolean;
  materialDescription?: string;
  materialCost?: number;
  materialConsumed?: boolean;
  focus?: boolean;
  focusDescription?: string;
  divineFocus?: boolean;
  xpCost?: number;
}

export interface SavingThrowInfo {
  attribute: string;
  success: 'half' | 'none' | 'special';
  description?: string;
}

export interface SpellDamage {
  base: DiceRoll;
  type: DamageType;
  scaling?: {
    type: 'character-level' | 'spell-level';
    increment: DiceRoll;
  };
}
