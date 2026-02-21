import { SystemDataModel } from '../../types/core/document';
import {
  ClassLevel,
  SkillProficiency,
  HitPoints,
  HitDice,
  Feature,
  Feat,
  SpellcastingInfo,
  EquippedItem,
  InventoryItem,
  Currency,
  PersonalityInfo,
} from '../../types/core/character';

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
  classLevels: ClassLevel[];
  backgroundId?: string;

  baseAttributes: Record<string, number>;
  skillProficiencies: Record<string, SkillProficiency>;

  hitPoints: HitPoints;
  hitDice: HitDice[];
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
  spellcasting?: SpellcastingInfo;

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
  baseAttributes: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
  skillProficiencies: {},
  hitPoints: { current: 10, max: 10, temp: 0 },
  hitDice: [],
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
  equipment: [],
  inventory: [],
  currency: { copper: 0, silver: 0, electrum: 0, gold: 0, platinum: 0 },
  weaponMasteries: [],
});
