import { SystemDataModel } from '../../types/core/document';
import {
  ClassLevel,
  SkillProficiency,
  HitPoints,
  HitDice,
  DeathSaves,
  Feature,
  Feat,
  SpellcastingInfo,
  EquippedItem,
  InventoryItem,
  Currency,
  PersonalityInfo,
} from '../../types/core/character';
import type { Dnd5eFeatureOptionSelection } from '../../types/character-options/feature-options';
import { Dnd5eCondition } from './conditions';

export interface Dnd5eTemplateState {
  classDerivedProficiencies: {
    armor: string[];
    weapons: string[];
    tools: string[];
    savingThrows: string[];
  };
  backgroundDerived: {
    tools: string[];
    languages: string[];
  };
  featDerivedAutomation: {
    abilityScores: Record<string, number>;
    armor: string[];
    weapons: string[];
    tools: string[];
    languages: string[];
    savingThrows: string[];
  };
}

/**
 * D&D 5e Data Model
 *
 * This effectively mirrors the legacy 'Character' interface but
 * stripped of the document-level metadata (id, name, systemId).
 */
export interface Dnd5eDataModel extends SystemDataModel {
  // Core attributes
  level: number;
  experiencePoints: number;

  // Character options
  speciesId?: string;
  speciesAbilitySelections?: string[];
  speciesLanguageSelections?: string[];
  speciesSkillSelections?: string[];
  speciesToolSelections?: string[];
  classLevels: ClassLevel[];
  backgroundId?: string;
  backgroundLanguageSelections?: string[];
  backgroundToolSelections?: string[];
  alignmentId?: string;

  // Base attributes
  baseAttributes: Record<string, number>;

  // Skills
  skillProficiencies: Record<string, SkillProficiency>;

  // Combat
  hitPoints: HitPoints;
  /**
   * Unhalved maximum HP, maintained by the engine. `hitPoints.max` is derived
   * from this (2014 exhaustion >= 4 halves it), so prepareData stays
   * idempotent when prepared documents are persisted and re-prepared.
   */
  baseMaxHP?: number;
  hitDice: HitDice[];
  deathSaves: DeathSaves;
  conditions: Dnd5eCondition[];
  /**
   * Active rider toggles (phase 4 damage assembly): feature-gated, player-
   * controlled states like 'rage', 'great-weapon-master', 'sneak-attack'.
   * Compiled into resolver effects by collectDnd5eRiderEffects.
   */
  activeToggles?: string[];
  exhaustionLevel: number;
  armorClass: number;
  initiative: number;
  speed: number;
  /** Passive Perception = 10 + Wis(Perception) modifier (SRD). Engine-derived. */
  passivePerception: number;

  // Proficiencies
  armorProficiencies: string[];
  weaponProficiencies: string[];
  toolProficiencies: string[];
  languageProficiencies: string[];
  savingThrowProficiencies: string[];

  // Features & Abilities
  features: Feature[];
  feats: Feat[];
  featureOptionSelections?: Dnd5eFeatureOptionSelection[];

  // Spellcasting
  spellcasting?: SpellcastingInfo;
  templateState?: Dnd5eTemplateState;

  // Equipment
  equipment: EquippedItem[];
  inventory: InventoryItem[];
  currency: Currency;

  // Misc
  personality?: PersonalityInfo;
  notes?: string;
}

export const createDefaultDnd5eData = (): Dnd5eDataModel => ({
  level: 1,
  experiencePoints: 0,
  classLevels: [],
  speciesAbilitySelections: [],
  speciesLanguageSelections: [],
  speciesSkillSelections: [],
  speciesToolSelections: [],
  baseAttributes: {
    str: 10,
    dex: 10,
    con: 10,
    int: 10,
    wis: 10,
    cha: 10,
  },
  skillProficiencies: {},
  hitPoints: { current: 10, max: 10, temp: 0 },
  hitDice: [],
  deathSaves: { successes: 0, failures: 0 },
  conditions: [],
  exhaustionLevel: 0,
  armorClass: 10,
  initiative: 0,
  speed: 30,
  passivePerception: 10,
  armorProficiencies: [],
  weaponProficiencies: [],
  toolProficiencies: [],
  languageProficiencies: [],
  savingThrowProficiencies: [],
  features: [],
  feats: [],
  featureOptionSelections: [],
  backgroundLanguageSelections: [],
  backgroundToolSelections: [],
  equipment: [],
  inventory: [],
  currency: { copper: 0, silver: 0, electrum: 0, gold: 0, platinum: 0 },
  templateState: {
    classDerivedProficiencies: {
      armor: [],
      weapons: [],
      tools: [],
      savingThrows: [],
    },
    backgroundDerived: {
      tools: [],
      languages: [],
    },
    featDerivedAutomation: {
      abilityScores: {},
      armor: [],
      weapons: [],
      tools: [],
      languages: [],
      savingThrows: [],
    },
  },
});
