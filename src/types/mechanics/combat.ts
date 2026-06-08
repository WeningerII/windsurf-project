import { DiceRoll, DamageType } from '../core/common';

export interface Attack {
  name: string;
  type: 'melee' | 'ranged' | 'spell';
  toHit: number;
  reach: number; // in feet
  range?: { normal: number; max: number }; // for ranged
  damage: DiceRoll;
  damageType: DamageType;
  additionalDamage?: { dice: DiceRoll; type: DamageType }[];
  properties: WeaponProperty[];
}

export type WeaponProperty =
  | 'ammunition'
  | 'finesse'
  | 'heavy'
  | 'light'
  | 'loading'
  | 'range'
  | 'reach'
  | 'special'
  | 'thrown'
  | 'two-handed'
  | 'versatile'
  // Pathfinder (3.5e/PF1) weapon special qualities, used by those systems'
  // weapon catalogs in addition to the shared d20 properties above.
  | 'brace'
  | 'disarm'
  | 'double'
  | 'monk'
  | 'nonlethal'
  | 'trip';

export interface ArmorClassCalculation {
  base: number;
  armorBonus: number;
  shieldBonus: number;
  dexModifier: number;
  dexMaxBonus?: number; // Some armor limits dex bonus
  naturalArmor: number;
  miscModifiers: number;
  total: number;
}

export interface Initiative {
  dexModifier: number;
  bonuses: number;
  advantage: boolean;
  total: number;
}

export interface SavingThrow {
  attribute: string;
  attributeModifier: number;
  proficiencyBonus: number;
  proficient: boolean;
  miscModifiers: number;
  total: number;
}
