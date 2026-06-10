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
import { Dnd5eCondition } from '../dnd5e/conditions';

export interface Dnd5e2024TemplateState {
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
 * D&D 5e 2024 (SRD 5.2) Data Model
 *
 * Mechanically identical to 2014 at the data layer for now.
 * The 2024 revision changes:
 *   - Species replaces Race (field already named speciesId)
 *   - Backgrounds grant origin feats
 *   - Weapon Mastery properties
 *   - Bastions (not modeled yet)
 *
 * These differences live in the engine/sheet, not the data shape.
 */
export interface Dnd5e2024DataModel extends SystemDataModel {
  level: number;
  experiencePoints: number;

  speciesId?: string;
  speciesAbilitySelections?: string[];
  speciesLanguageSelections?: string[];
  speciesSkillSelections?: string[];
  speciesToolSelections?: string[];
  classLevels: ClassLevel[];
  backgroundId?: string;
  backgroundLanguageSelections?: string[];
  backgroundToolSelections?: string[];

  baseAttributes: Record<string, number>;
  skillProficiencies: Record<string, SkillProficiency>;

  hitPoints: HitPoints;
  /**
   * Unhalved maximum HP, maintained by the engine (shared with 2014; the 2024
   * rules never halve it, so here it simply mirrors `hitPoints.max`).
   */
  baseMaxHP?: number;
  hitDice: HitDice[];
  deathSaves: DeathSaves;
  conditions: Dnd5eCondition[];
  exhaustionLevel: number;
  armorClass: number;
  initiative: number;
  speed: number;

  armorProficiencies: string[];
  weaponProficiencies: string[];
  toolProficiencies: string[];
  languageProficiencies: string[];
  savingThrowProficiencies: string[];

  features: Feature[];
  feats: Feat[];
  featureOptionSelections?: Dnd5eFeatureOptionSelection[];
  spellcasting?: SpellcastingInfo;
  templateState?: Dnd5e2024TemplateState;

  equipment: EquippedItem[];
  inventory: InventoryItem[];
  currency: Currency;

  personality?: PersonalityInfo;
  notes?: string;

  // 2024-specific fields
  weaponMasteries?: string[];
}

export const createDefaultDnd5e2024Data = (): Dnd5e2024DataModel => ({
  level: 1,
  experiencePoints: 0,
  classLevels: [],
  speciesAbilitySelections: [],
  speciesLanguageSelections: [],
  speciesSkillSelections: [],
  speciesToolSelections: [],
  baseAttributes: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
  skillProficiencies: {},
  hitPoints: { current: 10, max: 10, temp: 0 },
  hitDice: [],
  deathSaves: { successes: 0, failures: 0 },
  conditions: [],
  exhaustionLevel: 0,
  armorClass: 10,
  initiative: 0,
  speed: 30,
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
  weaponMasteries: [],
});
