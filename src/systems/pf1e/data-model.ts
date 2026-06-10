import { SystemDataModel } from '../../types/core/document';
import { Feature } from '../../types/core/character';
import type { BonusType } from '../../types/core/common';

/**
 * Pathfinder 1e Data Model
 *
 * Based on D&D 3.5e with key differences:
 *   - CMB/CMD replace Grapple
 *   - Consolidated skill list (no Hide/Move Silently, just Stealth)
 *   - Class skills give +3 bonus when trained (1+ rank)
 *   - Favored class bonus (HP or skill point per level)
 *   - Traits (campaign/combat/faith/magic/social)
 */

export interface Pf1eClassLevel {
  classId: string;
  level: number;
  hitDieRolls: number[];
  spellcastingSelections?: string[];
  bab: 'full' | 'three-quarter' | 'half';
  fortSave: 'good' | 'poor';
  refSave: 'good' | 'poor';
  willSave: 'good' | 'poor';
  skillPointsPerLevel: number;
  favoredClassBonus: 'hp' | 'skill' | 'other';
}

export interface Pf1eSaves {
  fortitude: { base: number; ability: number; misc: number; total: number };
  reflex: { base: number; ability: number; misc: number; total: number };
  will: { base: number; ability: number; misc: number; total: number };
}

export interface Pf1eFeat {
  id: string;
  name: string;
  description: string;
  source: string;
  prerequisites?: string;
}

export interface Pf1eTrait {
  id: string;
  name: string;
  type: 'campaign' | 'combat' | 'faith' | 'magic' | 'social' | 'race' | 'regional';
  source?: string;
  description: string;
}

export interface Pf1eManualSpellcastingExtras {
  domainSlotConsumedByLevel?: Record<number, boolean>;
  specialistSlotConsumedByLevel?: Record<number, boolean>;
  spontaneousConversionReference?: 'cure' | 'inflict' | 'both';
  dragonDiscipleBonusSlots?: { total: number; used: number };
}

export interface Pf1eDataModel extends SystemDataModel {
  level: number;
  experiencePoints: number;

  speciesId?: string; // race
  classLevels: Pf1eClassLevel[];
  alignmentId?: string;
  sizeCategory:
    | 'fine'
    | 'diminutive'
    | 'tiny'
    | 'small'
    | 'medium'
    | 'large'
    | 'huge'
    | 'gargantuan'
    | 'colossal';

  baseAttributes: Record<string, number>;

  skillRanks: Record<string, number>;
  classSkills: string[];
  favoredClassSkillBonus: number; // cumulative +1 skill point selections from favored class

  hitPoints: { current: number; max: number; temp: number };
  baseAttackBonus: number;
  armorClass: { total: number; touch: number; flatFooted: number };
  initiative: number;
  speed: number;
  cmb: number; // Combat Maneuver Bonus: BAB + STR + size
  cmd: number; // Combat Maneuver Defense: 10 + BAB + STR + DEX + size

  saves: Pf1eSaves;

  features: Feature[];
  feats: Pf1eFeat[];
  traits: Pf1eTrait[];

  /**
   * Vancian slots per spell level. `total` is derived (class table + ability
   * bonus spells + `manualBonus`); `manualBonus` is the persisted manual delta
   * recorded by the sheet's slot editor so edits survive re-prepares.
   */
  spellsPerDay?: Record<number, { total: number; used: number; manualBonus?: number }>;
  spellsKnown?: string[];
  preparedSpellsByLevel?: Record<number, string[]>;
  alwaysPreparedSpellIds?: string[];
  manualSpellcastingExtras?: Pf1eManualSpellcastingExtras;

  equipment: Array<{
    itemId: string;
    name: string;
    equipped: boolean;
    slot?: string;
    armorClass?: number;
    armorType?: 'light' | 'medium' | 'heavy';
    dexBonusMax?: number;
    shieldBonus?: number;
    // Magic/effect bonuses consumed by the system-agnostic rules IR (RFC 003).
    // Optional and additive; base AC math is unaffected.
    attackBonus?: number;
    damageBonus?: number;
    acBonus?: number;
    bonusType?: BonusType;
  }>;
  inventory: Array<{ itemId: string; name: string; quantity: number; weight: number }>;
  currency: { copper: number; silver: number; gold: number; platinum: number };

  personality?: { description?: string; backstory?: string };
  notes?: string;
}

export const createDefaultPf1eData = (): Pf1eDataModel => ({
  level: 1,
  experiencePoints: 0,
  classLevels: [],
  sizeCategory: 'medium',
  baseAttributes: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
  skillRanks: {},
  classSkills: [],
  favoredClassSkillBonus: 0,
  hitPoints: { current: 8, max: 8, temp: 0 },
  baseAttackBonus: 0,
  armorClass: { total: 10, touch: 10, flatFooted: 10 },
  initiative: 0,
  speed: 30,
  cmb: 0,
  cmd: 10,
  saves: {
    fortitude: { base: 0, ability: 0, misc: 0, total: 0 },
    reflex: { base: 0, ability: 0, misc: 0, total: 0 },
    will: { base: 0, ability: 0, misc: 0, total: 0 },
  },
  features: [],
  feats: [],
  traits: [],
  equipment: [],
  inventory: [],
  currency: { copper: 0, silver: 0, gold: 0, platinum: 0 },
});
