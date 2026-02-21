import { SystemDataModel } from '../../types/core/document';

/**
 * D&D 3.5e Data Model
 *
 * Key mechanical differences from 5e:
 *   - Skill ranks (not proficiency), max ranks = level + 3
 *   - Base Attack Bonus (BAB) instead of proficiency bonus
 *   - Three save categories: Fortitude (CON), Reflex (DEX), Will (WIS)
 *   - Feats every 3 levels
 *   - No concentration mechanic for spells
 */

export interface Dnd35eClassLevel {
  classId: string;
  level: number;
  hitDieRolls: number[];
  bab: 'full' | 'three-quarter' | 'half';
  fortSave: 'good' | 'poor';
  refSave: 'good' | 'poor';
  willSave: 'good' | 'poor';
  skillPointsPerLevel: number;
}

export interface Dnd35eSaves {
  fortitude: { base: number; ability: number; misc: number; total: number };
  reflex: { base: number; ability: number; misc: number; total: number };
  will: { base: number; ability: number; misc: number; total: number };
}

export interface Dnd35eFeat {
  id: string;
  name: string;
  description: string;
  source: string;
  prerequisites?: string;
}

export interface Dnd35eDataModel extends SystemDataModel {
  level: number;
  experiencePoints: number;

  speciesId?: string; // race
  classLevels: Dnd35eClassLevel[];
  alignmentId?: string;
  sizeCategory: 'fine' | 'diminutive' | 'tiny' | 'small' | 'medium' | 'large' | 'huge' | 'gargantuan' | 'colossal';

  baseAttributes: Record<string, number>; // str, dex, con, int, wis, cha

  // Skills use ranks, not proficiency
  skillRanks: Record<string, number>;
  classSkills: string[]; // skills that are class skills (get +3 if trained in PF1e, full rank in 3.5e)

  // Combat
  hitPoints: { current: number; max: number; temp: number };
  baseAttackBonus: number;
  armorClass: { total: number; touch: number; flatFooted: number };
  initiative: number;
  speed: number;
  grapple: number; // BAB + STR + size

  // Saves
  saves: Dnd35eSaves;

  // Feats
  feats: Dnd35eFeat[];

  // Spellcasting (Vancian)
  spellsPerDay?: Record<number, { total: number; used: number }>; // level -> slots
  spellsKnown?: string[];

  // Equipment
  equipment: Array<{ itemId: string; name: string; equipped: boolean; slot?: string }>;
  inventory: Array<{ itemId: string; name: string; quantity: number; weight: number }>;
  currency: { copper: number; silver: number; gold: number; platinum: number };

  personality?: { description?: string; backstory?: string };
  notes?: string;
}

export const createDefaultDnd35eData = (): Dnd35eDataModel => ({
  level: 1,
  experiencePoints: 0,
  classLevels: [],
  sizeCategory: 'medium',
  baseAttributes: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
  skillRanks: {},
  classSkills: [],
  hitPoints: { current: 8, max: 8, temp: 0 },
  baseAttackBonus: 0,
  armorClass: { total: 10, touch: 10, flatFooted: 10 },
  initiative: 0,
  speed: 30,
  grapple: 0,
  saves: {
    fortitude: { base: 0, ability: 0, misc: 0, total: 0 },
    reflex: { base: 0, ability: 0, misc: 0, total: 0 },
    will: { base: 0, ability: 0, misc: 0, total: 0 },
  },
  feats: [],
  equipment: [],
  inventory: [],
  currency: { copper: 0, silver: 0, gold: 0, platinum: 0 },
});
