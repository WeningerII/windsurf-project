import { SystemDataModel } from '../../types/core/document';
import { Power } from '../../types/mam/powers';

/**
 * Mutants & Masterminds 3e Character Data Model
 * 
 * This model purely defines the DATA structure.
 * It has NO dependency on "Class Levels" or "Spell Slots".
 */
export interface Mam3eDataModel extends SystemDataModel {
  // Power Level is the cap for the campaign/character
  powerLevel: number;
  
  // Power Points (PP) Economy
  powerPoints: {
    total: number;
    spent: {
      abilities: number;
      powers: number;
      advantages: number;
      skills: number;
      defenses: number;
    };
  };

  // Abilities (Rank-based, not Score-based D&D style)
  // In M&M 3e, abilities are direct ranks (-5 to 20+)
  abilities: {
    str: number; // Strength
    sta: number; // Stamina
    agi: number; // Agility
    dex: number; // Dexterity
    fgt: number; // Fighting
    int: number; // Intellect
    awe: number; // Awareness
    pre: number; // Presence
  };

  // Defenses
  defenses: {
    dodge: { rank: number; total: number };
    parry: { rank: number; total: number };
    fortitude: { rank: number; total: number };
    toughness: { rank: number; total: number };
    will: { rank: number; total: number };
  };

  // Powers - The core mechanic!
  // No longer hiding inside "spells"
  powers: Power[];

  // Advantages (Feats)
  advantages: Array<{
    id: string;
    name: string;
    rank?: number; // Some advantages have ranks
  }>;

  // Skills
  skills: Record<string, {
    rank: number; // Purchased ranks
    total: number; // Ability + Rank + Misc
  }>;
  
  // Complications (Hero Points generator)
  complications: Array<{
    name: string;
    description: string;
  }>;
}

export const createDefaultMam3eData = (): Mam3eDataModel => ({
  powerLevel: 10,
  powerPoints: {
    total: 150,
    spent: {
      abilities: 0,
      powers: 0,
      advantages: 0,
      skills: 0,
      defenses: 0,
    },
  },
  abilities: {
    str: 0, sta: 0, agi: 0, dex: 0,
    fgt: 0, int: 0, awe: 0, pre: 0,
  },
  defenses: {
    dodge: { rank: 0, total: 0 },
    parry: { rank: 0, total: 0 },
    fortitude: { rank: 0, total: 0 },
    toughness: { rank: 0, total: 0 },
    will: { rank: 0, total: 0 },
  },
  powers: [],
  advantages: [],
  skills: {},
  complications: [],
});
