import { DiceRoll, DamageType } from '../core/common';
import { WeaponProperty } from '../mechanics/combat';
import { Modifier } from '../core/common';

export interface Item {
  id: string;
  name: string;
  system: string;
  source?:
    | string
    | {
        book?: string;
        name?: string;
        page?: number;
        url?: string;
      };
  type: ItemType;
  rarity: Rarity;

  weight: number;
  cost: { amount: number; currency: 'cp' | 'sp' | 'gp' | 'pp' };

  description: string;
  requiresAttunement: boolean;
}

export type ItemType =
  | 'weapon'
  | 'armor'
  | 'shield'
  | 'consumable'
  | 'tool'
  | 'gear'
  | 'magic-item'
  | 'treasure';

export type Rarity = 'common' | 'uncommon' | 'rare' | 'very-rare' | 'legendary' | 'artifact';

export interface Weapon extends Item {
  type: 'weapon';
  weaponType: 'simple' | 'martial';
  category: 'melee' | 'ranged';

  damage: DiceRoll;
  damageType: DamageType;
  properties: WeaponProperty[];
  mastery?: string;

  range?: { normal: number; max: number };
  reach?: number;

  versatileDamage?: DiceRoll;
}

export interface Armor extends Item {
  type: 'armor';
  armorType: 'light' | 'medium' | 'heavy';
  armorClass: number;
  dexBonusMax?: number;
  strengthRequirement?: number;
  stealthDisadvantage: boolean;
  /** d20 (3.5e/PF1e) armor check penalty (<= 0). */
  armorCheckPenalty?: number;
}

export interface Shield extends Item {
  type: 'shield';
  armorClassBonus: number;
  /** AC bonus the equip flow reads (mirrors armorClassBonus for d20 shields). */
  shieldBonus?: number;
  /** d20 (3.5e/PF1e) armor check penalty (<= 0). */
  armorCheckPenalty?: number;
}

export interface MagicItem extends Item {
  type: 'magic-item';
  baseItemId?: string; // If it's a +1 weapon, reference the base weapon
  modifiers: Modifier[];
  charges?: {
    max: number;
    rechargeDice?: DiceRoll;
    rechargeTime: 'dawn' | 'dusk' | 'long-rest';
  };
  effects: string[];
}
