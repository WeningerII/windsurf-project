import { DiceType, Choice, Prerequisite, AbilityScore } from '../core/common';
import { Feature } from '../core/character';

export interface CharacterClass {
  id: string;
  name: string;
  system: string;
  source: string;

  // Versioning and provenance
  version?: string; // e.g., "5.1", "2024", "3.5"
  lastUpdated?: string; // ISO date of last update
  errata?: string[]; // Links or references to applied errata
  sourceBook?: {
    name: string;
    page?: number;
    url?: string;
  };

  // Core properties
  hitDie: DiceType;
  primaryAbility: AbilityScore[];
  savingThrowProficiencies: AbilityScore[];

  // Display metadata for UI
  displayMetadata?: ClassDisplayMetadata;

  // Starting proficiencies
  armorProficiencies: string[];
  weaponProficiencies: string[];
  toolProficiencies: Choice<string>[];
  skillProficiencies: Choice<string>;

  // Starting equipment choices
  equipmentChoices: EquipmentChoice[];
  startingGold?: { dice: string; multiplier: number }; // Alternative to equipment

  // Level progression
  features: ClassFeatureProgression[];
  subclassLevel: number; // When you choose a subclass
  subclasses: Subclass[];

  // Subclass selection metadata
  subclassSelection?: {
    timing: 'level' | 'creation'; // Most get at a level, some at creation
    optional: boolean; // Can you choose not to take a subclass?
    canChange: boolean; // Can you change subclass later?
    prerequisitesMustMeet: boolean; // Do subclass prerequisites apply?
    flavorText?: string; // Description of the choice moment
  };

  // Spellcasting
  spellcasting?: SpellcastingProgression;

  // Class-specific resources
  classResources?: ClassResource[];

  // Multiclassing
  multiclassRequirements?: Prerequisite[];
  multiclassProficiencies?: MulticlassProficiencies;

  description: string;
}

export interface EquipmentChoice {
  choose: number;
  options: (string | string[])[]; // Either single item or array for "X and Y"
}

export interface ClassFeatureProgression {
  level: number;
  features: Feature[];
  choices?: FeatureChoice[];
}

export interface FeatureChoice {
  name: string;
  choose: number;
  from: Feature[];
}

export interface Subclass {
  id: string;
  name: string;
  parentClassId: string;
  description: string;
  features: ClassFeatureProgression[];
  spellListExpansion?: string[]; // Additional spells available
}

export interface SpellcastingProgression {
  ability: AbilityScore; // INT, WIS, or CHA
  spellListId: string;
  cantripsKnown?: number[];
  spellsKnown?: number[];
  preparedCasterFormula?: string; // e.g., "ability_modifier + class_level" for prepared casters
  spellSlots: SpellSlotProgression;
  ritualCasting: boolean;

  // Pact Magic (Warlock-specific)
  isPactMagic?: boolean; // True for Warlock
  slotRecovery?: 'long-rest' | 'short-rest'; // Short rest for Warlock

  // Multiclassing
  multiclassCasterLevel?: 'full' | 'half' | 'third' | 'none';
}

export interface SpellSlotProgression {
  1: number[];
  2: number[];
  3: number[];
  4: number[];
  5: number[];
  6: number[];
  7: number[];
  8: number[];
  9: number[];
}

export interface ClassResource {
  id: string;
  name: string;
  maxFormula: string; // e.g., "level >= 20 ? 'unlimited' : ..."
  recoveryType: 'short-rest' | 'long-rest' | 'dawn';
  displayOrder?: number;
  defaultValue?: number;
}

export interface MulticlassProficiencies {
  armor: string[];
  weapons: string[];
  tools: string[];
  skills?: Choice<string>;
}

// Type guard for spell slot array validation
export type SpellSlotArray = readonly [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
]; // Exactly 20 elements for levels 1-20

// Display metadata for UI/UX
export interface ClassDisplayMetadata {
  icon?: string; // Icon identifier (e.g., 'sword', 'book', 'fist')
  color?: string; // Primary color (hex format)
  shortDescription: string; // 1-2 sentence summary
  playStyle: string; // e.g., "Melee combatant", "Arcane spellcaster"
  complexity: 'simple' | 'moderate' | 'complex';
  role: 'striker' | 'defender' | 'controller' | 'support' | 'hybrid';
  idealFor?: string[]; // e.g., ["Beginners", "Tactical players"]
  tags?: ClassTag[]; // Searchable tags for filtering
  casterType?: 'full' | 'half' | 'third' | 'pact' | 'none'; // Spellcasting progression type
}

/**
 * Tags for categorizing and filtering classes
 */
export type ClassTag =
  | 'martial' // Physical combat focused
  | 'spellcaster' // Magic user
  | 'divine' // Divine magic source
  | 'arcane' // Arcane magic source
  | 'primal' // Primal/nature magic source
  | 'psionic' // Psionic powers
  | 'melee' // Primarily melee combat
  | 'ranged' // Primarily ranged combat
  | 'support' // Healing/buffing focus
  | 'tank' // High durability/defense
  | 'skill-monkey' // High skill proficiency
  | 'summoner' // Summons creatures
  | 'shapeshifter' // Can change form
  | 'stealth' // Stealth and subterfuge
  | 'face' // Social interaction specialist
  | 'versatile'; // Can fill multiple roles
