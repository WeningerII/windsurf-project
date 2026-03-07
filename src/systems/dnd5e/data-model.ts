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
  classLevels: ClassLevel[];
  backgroundId?: string;
  alignmentId?: string;

  // Base attributes
  baseAttributes: Record<string, number>;

  // Skills
  skillProficiencies: Record<string, SkillProficiency>;

  // Combat
  hitPoints: HitPoints;
  hitDice: HitDice[];
  deathSaves: DeathSaves;
  conditions: Dnd5eCondition[];
  exhaustionLevel: number;
  armorClass: number;
  initiative: number;
  speed: number;

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
  armorProficiencies: [],
  weaponProficiencies: [],
  toolProficiencies: [],
  languageProficiencies: [],
  savingThrowProficiencies: [],
  features: [],
  feats: [],
  featureOptionSelections: [],
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
