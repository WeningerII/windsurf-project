/**
 * Core character data types
 *
 * Defines the unified Character interface that works across all game systems.
 * Supports D&D editions, Pathfinder, and Mutants & Masterminds 3e.
 *
 * @module types/core/character
 */

import type { GameSystemId } from '../game-systems';
import { BonusType, Modifier } from './common';

/**
 * Character - Single source of truth for all character data
 *
 * Unified character model supporting multiple game systems with flexible
 * structure for system-specific features. Uses classLevels array for multiclassing.
 *
 * @example
 * ```typescript
 * const character: Character = {
 *   id: generateUUID(),
 *   name: 'Gandalf',
 *   system: 'dnd-5e-2014',
 *   level: 20,
 *   classLevels: [{ classId: 'wizard', level: 20, hitDieRolls: [...] }],
 *   // ... other required fields
 * };
 * ```
 */
export interface Character {
  // Identity
  id: string;
  name: string;
  system: GameSystemId;

  // Core attributes
  level: number;
  experiencePoints: number;

  // Character options
  speciesId?: string; // race/ancestry
  classLevels: ClassLevel[]; // Supports multiclassing
  backgroundId?: string;
  alignmentId?: string;

  // Base attributes
  baseAttributes: Record<string, number>; // STR, DEX, etc.

  // Skills
  skillProficiencies: Record<string, SkillProficiency>;
  skillRanks?: Record<string, number>; // For systems that use ranks

  // Combat
  hitPoints: HitPoints;
  hitDice: HitDice[];
  armorClass: number;
  initiative: number;
  speed: number;

  // Proficiencies
  armorProficiencies: string[];
  weaponProficiencies: string[];
  toolProficiencies: string[];
  languageProficiencies: string[];
  savingThrowProficiencies: string[]; // Which saves are proficient

  // Features & Abilities
  features: Feature[];
  feats: Feat[];

  // Spellcasting
  spellcasting?: SpellcastingInfo;

  // Equipment
  equipment: EquippedItem[];
  inventory: InventoryItem[];
  currency: Currency;

  // Misc
  personality?: PersonalityInfo;
  notes?: string;

  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Class level for multiclassing support
 *
 * Tracks progression in a specific class, including subclass choice
 * and actual HP rolls per level for accurate HP calculation.
 */
export interface ClassLevel {
  classId: string;
  subclassId?: string;
  level: number;
  hitDieRolls: number[]; // Track actual HP rolls per level
  skillSelections?: string[];
  toolSelections?: string[];
}

/**
 * Skill proficiency levels
 *
 * - none: No proficiency bonus
 * - half: Half proficiency (some systems)
 * - proficient: Add full proficiency bonus
 * - expertise: Double proficiency bonus (D&D 5e)
 * - double: Alternative double proficiency
 */
export type ProficiencyLevel = 'none' | 'half' | 'proficient' | 'expertise' | 'double';

/**
 * Skill proficiency tracking
 *
 * Tracks both the proficiency level and where it came from for transparency.
 */
export interface SkillProficiency {
  level: ProficiencyLevel;
  source: string[]; // Where this proficiency came from
}

/**
 * Character hit points (HP)
 *
 * Tracks current, maximum, and temporary HP separately for accurate tracking.
 */
export interface HitPoints {
  current: number;
  max: number;
  temp: number;
}

/**
 * Hit dice for short rest healing
 *
 * Tracks total and remaining hit dice per die type.
 */
export interface HitDice {
  die: string; // e.g., "d8"
  total: number;
  remaining: number;
}

export interface DeathSaves {
  successes: number;
  failures: number;
}

export interface Feature {
  id: string;
  name: string;
  source: string; // e.g., "Fighter 1", "Elf", "Soldier Background"
  description: string;
  uses?: FeatureUses;
  modifiers?: Modifier[];
}

export interface FeatureUses {
  current: number;
  max: number;
  recoveryType: 'short-rest' | 'long-rest' | 'dawn' | 'manual';
}

export interface FeatAutomationState {
  abilityScores?: Record<string, number>;
  armor?: string[];
  weapons?: string[];
  tools?: string[];
  languages?: string[];
  skills?: Record<string, ProficiencyLevel>;
  savingThrows?: string[];
}

export interface Feat {
  id: string;
  name: string;
  description: string;
  source: string;
  modifiers?: Modifier[];
  automation?: FeatAutomationState;
}

export interface SpellcastingInfo {
  classes: SpellcastingClass[];
  spellsKnown: string[]; // Spell IDs
  spellsPrepared: string[]; // For prepared casters
  alwaysPreparedSpellIds?: string[];
  spellSlots: SpellSlots;
}

export interface SpellcastingClass {
  classId: string;
  ability: string; // INT, WIS, CHA
  spellcastingLevel: number; // For multiclassing
}

export interface SpellSlots {
  1: { max: number; used: number };
  2: { max: number; used: number };
  3: { max: number; used: number };
  4: { max: number; used: number };
  5: { max: number; used: number };
  6: { max: number; used: number };
  7: { max: number; used: number };
  8: { max: number; used: number };
  9: { max: number; used: number };
}

export interface EquippedItem {
  itemId: string;
  slot: EquipmentSlot;
  attuned: boolean;
  customName?: string;
  // Armor stats (populated when equipping armor/shield so engines can compute AC)
  armorClass?: number; // Base AC for armor (e.g. 14 for scale mail)
  armorType?: 'light' | 'medium' | 'heavy';
  dexBonusMax?: number; // Max DEX bonus (undefined = unlimited, 0 = none)
  shieldBonus?: number; // AC bonus from shield (e.g. 2)
  // Magic/effect bonuses (additive; consumed by the system-agnostic rules IR —
  // see docs/rfc/003-rules-ir-and-effects.md). Optional so existing AC math and
  // all non-magic gear are unaffected.
  attackBonus?: number; // e.g. +1 from a magic weapon, to attack rolls
  damageBonus?: number; // e.g. +1 from a magic weapon, to damage rolls
  acBonus?: number; // e.g. +1 from magic armor/shield or a ring of protection
  /**
   * Named bonus type, for d20/PF stacking (defaults applied per system by the
   * equipment compiler when omitted). Ignored by 5e/Daggerheart/M&M, which sum.
   */
  bonusType?: BonusType;
  /** PF2e stacking bucket for this item's bonuses (defaults to 'item'). */
  pf2eBucket?: 'item' | 'status' | 'circumstance';
}

export type EquipmentSlot =
  | 'head'
  | 'neck'
  | 'chest'
  | 'back'
  | 'mainHand'
  | 'offHand'
  | 'hands'
  | 'ring1'
  | 'ring2'
  | 'waist'
  | 'feet';

export interface InventoryItem {
  itemId: string;
  quantity: number;
  customName?: string;
  notes?: string;
}

export interface Currency {
  copper: number;
  silver: number;
  electrum: number;
  gold: number;
  platinum: number;
}

export interface PersonalityInfo {
  traits?: string;
  ideals?: string;
  bonds?: string;
  flaws?: string;
  appearance?: string;
  backstory?: string;
}
