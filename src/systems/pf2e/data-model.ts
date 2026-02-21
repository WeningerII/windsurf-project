import { SystemDataModel } from '../../types/core/document';

/**
 * Pathfinder 2e Data Model
 *
 * Radically different from D&D 5e and PF1e:
 *   - 4-tier proficiency: untrained/trained/expert/master/legendary
 *   - Proficiency bonus = level + tier bonus (0/2/4/6/8)
 *   - 3-action economy (not modeled in data, handled by UI)
 *   - Ancestry/Heritage/Background/Class structure
 *   - 4 spell traditions: arcane, divine, occult, primal
 *   - Bulk system instead of weight
 */

export type Pf2eProficiencyTier = 'untrained' | 'trained' | 'expert' | 'master' | 'legendary';

export interface Pf2eProficiency {
  tier: Pf2eProficiencyTier;
  /** Computed: level + tier bonus (0/2/4/6/8). 0 if untrained (no level added). */
  total: number;
}

export interface Pf2eClassLevel {
  classId: string;
  level: number;
  hitDieSize: number; // 6, 8, 10, 12
  keyAbility: string; // The class's key ability score
}

export interface Pf2eFeat {
  id: string;
  name: string;
  description: string;
  level: number;
  type: 'ancestry' | 'class' | 'skill' | 'general' | 'archetype';
  source: string;
}

export interface Pf2eSpellcasting {
  tradition: 'arcane' | 'divine' | 'occult' | 'primal';
  type: 'prepared' | 'spontaneous' | 'innate';
  proficiency: Pf2eProficiency;
  spellSlots: Record<number, { max: number; used: number }>; // level 1-10
  spellsKnown: string[];
  focusPoints: { current: number; max: number };
}

export interface Pf2eDataModel extends SystemDataModel {
  level: number;
  experiencePoints: number;
  heroPoints: number; // 0-3

  ancestryId?: string;
  heritageId?: string;
  backgroundId?: string;
  classId?: string;

  baseAttributes: Record<string, number>; // str, dex, con, int, wis, cha (ability scores, not modifiers)

  // Proficiencies (the core of PF2e)
  skillProficiencies: Record<string, Pf2eProficiency>;
  saveProficiencies: {
    fortitude: Pf2eProficiency;
    reflex: Pf2eProficiency;
    will: Pf2eProficiency;
  };
  perceptionProficiency: Pf2eProficiency;
  armorProficiencies: Record<string, Pf2eProficiency>; // unarmored, light, medium, heavy
  weaponProficiencies: Record<string, Pf2eProficiency>; // simple, martial, advanced, unarmed

  // Combat
  hitPoints: { current: number; max: number; temp: number };
  armorClass: number;
  speed: number;

  // Feats (organized by type)
  feats: Pf2eFeat[];

  // Spellcasting
  spellcasting?: Pf2eSpellcasting;

  // Equipment (Bulk system)
  equipment: Array<{ itemId: string; name: string; bulk: number; equipped: boolean; invested?: boolean }>;
  inventory: Array<{ itemId: string; name: string; quantity: number; bulk: number }>;
  currency: { copper: number; silver: number; gold: number; platinum: number };

  // Conditions (PF2e has a rich condition system)
  conditions: Array<{ id: string; name: string; value?: number }>;

  personality?: { description?: string; backstory?: string };
  notes?: string;
}

/** Tier bonus: untrained=0, trained=2, expert=4, master=6, legendary=8 */
export function tierBonus(tier: Pf2eProficiencyTier): number {
  const map: Record<Pf2eProficiencyTier, number> = {
    untrained: 0, trained: 2, expert: 4, master: 6, legendary: 8,
  };
  return map[tier];
}

/** PF2e proficiency total: untrained = 0 (no level), trained+ = level + tier bonus */
export function profTotal(level: number, tier: Pf2eProficiencyTier): number {
  if (tier === 'untrained') return 0;
  return level + tierBonus(tier);
}

export const createDefaultPf2eData = (): Pf2eDataModel => ({
  level: 1,
  experiencePoints: 0,
  heroPoints: 1,
  baseAttributes: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
  skillProficiencies: {},
  saveProficiencies: {
    fortitude: { tier: 'trained', total: 0 },
    reflex: { tier: 'trained', total: 0 },
    will: { tier: 'trained', total: 0 },
  },
  perceptionProficiency: { tier: 'trained', total: 0 },
  armorProficiencies: {
    unarmored: { tier: 'trained', total: 0 },
    light: { tier: 'untrained', total: 0 },
    medium: { tier: 'untrained', total: 0 },
    heavy: { tier: 'untrained', total: 0 },
  },
  weaponProficiencies: {
    simple: { tier: 'trained', total: 0 },
    martial: { tier: 'untrained', total: 0 },
    advanced: { tier: 'untrained', total: 0 },
    unarmed: { tier: 'trained', total: 0 },
  },
  hitPoints: { current: 10, max: 10, temp: 0 },
  armorClass: 10,
  speed: 25,
  feats: [],
  equipment: [],
  inventory: [],
  currency: { copper: 0, silver: 0, gold: 0, platinum: 0 },
  conditions: [],
});
