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
  | 'versatile';

export interface Initiative {
  dexModifier: number;
  bonuses: number;
  advantage: boolean;
  total: number;
}
