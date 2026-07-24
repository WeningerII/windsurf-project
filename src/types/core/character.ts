/**
 * Core character data types
 *
 * The `Character` interface below is a legacy model (see its deprecation
 * note); the sub-types in this module (`Feature`, `Feat`, `SpellSlots`,
 * `EquippedItem`, …) remain the shared, actively-used building blocks.
 *
 * @module types/core/character
 */

import type { GameSystemId } from '../game-systems';
import { BonusType, Modifier } from './common';

/**
 * @deprecated Legacy model — real persistence flows through
 * `CharacterDocument<SystemDataModel>` (`types/core/document.ts`) plus the
 * per-system data models (`src/systems/<system>/data-model.ts`); do not
 * extend. This interface is kept only because code throughout the app shares
 * its sub-types (`Feature`, `Feat`, `SpellSlots`, `EquippedItem`, …); it is
 * not the source of truth for any persisted character.
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
  /**
   * Owning class id. Optional for backward compatibility with persisted
   * documents written before pools were keyed by class; the engine matches
   * by classId when present and only falls back to position for legacy rows.
   */
  classId?: string;
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
  /**
   * Warlock Pact Magic (SRD 5.1/5.2): a separate slot pool from the standard
   * 1–9 grid. Every pact slot shares one slot level and recovers on a short
   * rest. Absent for characters without warlock levels.
   */
  pactMagic?: PactMagicSlots;
}

/**
 * Warlock Pact Magic slot pool (SRD): 1 slot at level 1, 2 at level 2,
 * 3 at level 11, 4 at level 17; slot level = ceil(min(level, 9) / 2), max 5.
 */
export interface PactMagicSlots {
  /** Spell level all pact slots are cast at (1–5). */
  level: number;
  max: number;
  used: number;
}

export interface SpellcastingClass {
  classId: string;
  ability: string; // INT, WIS, CHA
  spellcastingLevel: number; // For multiclassing
  /**
   * Derived (engine-computed in prepareData), per SRD Spellcasting:
   *   spell save DC    = 8 + proficiency bonus + spellcasting ability modifier
   *   spell attack mod =     proficiency bonus + spellcasting ability modifier
   * Per spellcasting class, since multiclass casters can use different abilities.
   */
  spellSaveDc?: number;
  spellAttackBonus?: number;
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
  /**
   * Minimum Strength score the armor lists (5e SRD "Str 13"/"Str 15" heavy
   * armor). When the wearer's Strength is lower, walking speed drops by 10 ft.
   * Optional so light/medium armor and all non-armor gear are unaffected.
   */
  strengthRequirement?: number;
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
  // Weapon stats — populated when equipping a weapon so the scene combatant can
  // assemble real weapon damage instead of its placeholder die. This is the
  // Denominator-B engine wiring; populating these fields from a weapon catalog at
  // equip time is a separate Denominator-A content step. All optional, so existing
  // equipment and the placeholder-die baseline are unaffected.
  /** Base weapon damage dice, e.g. `{ count: 1, die: 8 }` for a longsword. */
  weaponDamage?: { count: number; die: number };
  /** Larger die rolled when a Versatile weapon is wielded in two hands (e.g. 10). */
  weaponVersatileDie?: number;
  /**
   * PF2e striking rune tier on this weapon: 'striking' rolls 2 weapon damage
   * dice, 'greater' 3, 'major' 4. Type-only for now — no engine consumes it
   * yet (Lane F wires it into damage assembly); optional so all existing
   * equipment is unaffected.
   */
  strikingRune?: 'striking' | 'greater' | 'major';
  /** Weapon properties driving assembly: 'light' | 'versatile' | 'two-handed' | … */
  weaponProperties?: string[];
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
