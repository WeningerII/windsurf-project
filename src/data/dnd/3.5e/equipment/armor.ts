// D&D 3.5e Armor

import { DnD35eArmor, DnD35eShield } from '../../../../types/equipment';

// Light Armor
export const padded: DnD35eArmor = {
  id: 'padded',
  name: 'Padded',
  system: 'dnd-3.5e',
  source: 'SRD 3.5',
  type: 'light',
  armorClass: 11,
  armorCheckPenalty: 0,
  arcaneSpellFailure: 5,
  weight: 10,
  cost: '5 gp',
};
export const leather: DnD35eArmor = {
  id: 'leather',
  name: 'Leather',
  system: 'dnd-3.5e',
  source: 'SRD 3.5',
  type: 'light',
  armorClass: 11,
  armorCheckPenalty: 0,
  arcaneSpellFailure: 10,
  weight: 15,
  cost: '10 gp',
};
export const studdedLeather: DnD35eArmor = {
  id: 'studded-leather',
  name: 'Studded Leather',
  system: 'dnd-3.5e',
  source: 'SRD 3.5',
  type: 'light',
  armorClass: 12,
  armorCheckPenalty: 0,
  arcaneSpellFailure: 15,
  weight: 20,
  cost: '25 gp',
};

// Medium Armor
export const hide: DnD35eArmor = {
  id: 'hide',
  name: 'Hide',
  system: 'dnd-3.5e',
  source: 'SRD 3.5',
  type: 'medium',
  armorClass: 12,
  armorCheckPenalty: -2,
  arcaneSpellFailure: 20,
  weight: 25,
  cost: '15 gp',
};
export const chainShirt: DnD35eArmor = {
  id: 'chain-shirt',
  name: 'Chain Shirt',
  system: 'dnd-3.5e',
  source: 'SRD 3.5',
  type: 'medium',
  armorClass: 13,
  armorCheckPenalty: -2,
  arcaneSpellFailure: 20,
  weight: 25,
  cost: '100 gp',
};
export const scaleMail: DnD35eArmor = {
  id: 'scale-mail',
  name: 'Scale Mail',
  system: 'dnd-3.5e',
  source: 'SRD 3.5',
  type: 'medium',
  armorClass: 14,
  armorCheckPenalty: -4,
  arcaneSpellFailure: 25,
  weight: 30,
  cost: '50 gp',
};
export const breastplate: DnD35eArmor = {
  id: 'breastplate',
  name: 'Breastplate',
  system: 'dnd-3.5e',
  source: 'SRD 3.5',
  type: 'medium',
  armorClass: 14,
  armorCheckPenalty: -3,
  arcaneSpellFailure: 25,
  weight: 30,
  cost: '200 gp',
};
export const halfPlate: DnD35eArmor = {
  id: 'half-plate',
  name: 'Half-Plate',
  system: 'dnd-3.5e',
  source: 'SRD 3.5',
  type: 'medium',
  armorClass: 15,
  armorCheckPenalty: -5,
  arcaneSpellFailure: 40,
  weight: 50,
  cost: '600 gp',
};

// Heavy Armor
export const splintMail: DnD35eArmor = {
  id: 'splint-mail',
  name: 'Splint Mail',
  system: 'dnd-3.5e',
  source: 'SRD 3.5',
  type: 'heavy',
  armorClass: 17,
  armorCheckPenalty: -7,
  arcaneSpellFailure: 40,
  weight: 45,
  cost: '200 gp',
};
export const platemail: DnD35eArmor = {
  id: 'platemail',
  name: 'Platemail',
  system: 'dnd-3.5e',
  source: 'SRD 3.5',
  type: 'heavy',
  armorClass: 18,
  armorCheckPenalty: -6,
  arcaneSpellFailure: 50,
  weight: 50,
  cost: '1500 gp',
};
export const fullPlate: DnD35eArmor = {
  id: 'full-plate',
  name: 'Full Plate',
  system: 'dnd-3.5e',
  source: 'SRD 3.5',
  type: 'heavy',
  armorClass: 18,
  armorCheckPenalty: -6,
  arcaneSpellFailure: 50,
  weight: 50,
  cost: '1500 gp',
};

// Shields
export const buckler: DnD35eShield = {
  id: 'buckler',
  name: 'Buckler',
  system: 'dnd-3.5e',
  source: 'SRD 3.5',
  type: 'shield',
  armorClass: 0,
  armorClassBonus: 1,
  weight: 5,
  cost: '15 gp',
};
export const lightWoodenShield: DnD35eShield = {
  id: 'light-wooden-shield',
  name: 'Light Wooden Shield',
  system: 'dnd-3.5e',
  source: 'SRD 3.5',
  type: 'shield',
  armorClass: 0,
  armorClassBonus: 1,
  weight: 5,
  cost: '3 gp',
};
export const lightSteelShield: DnD35eShield = {
  id: 'light-steel-shield',
  name: 'Light Steel Shield',
  system: 'dnd-3.5e',
  source: 'SRD 3.5',
  type: 'shield',
  armorClass: 0,
  armorClassBonus: 1,
  weight: 6,
  cost: '9 gp',
};
export const heavyWoodenShield: DnD35eShield = {
  id: 'heavy-wooden-shield',
  name: 'Heavy Wooden Shield',
  system: 'dnd-3.5e',
  source: 'SRD 3.5',
  type: 'shield',
  armorClass: 0,
  armorClassBonus: 2,
  weight: 15,
  cost: '7 gp',
};
export const heavySteelShield: DnD35eShield = {
  id: 'heavy-steel-shield',
  name: 'Heavy Steel Shield',
  system: 'dnd-3.5e',
  source: 'SRD 3.5',
  type: 'shield',
  armorClass: 0,
  armorClassBonus: 2,
  weight: 15,
  cost: '20 gp',
};
export const towerShield: DnD35eShield = {
  id: 'tower-shield',
  name: 'Tower Shield',
  system: 'dnd-3.5e',
  source: 'SRD 3.5',
  type: 'shield',
  armorClass: 0,
  armorClassBonus: 4,
  weight: 45,
  cost: '30 gp',
};

export const dnd35eArmor: DnD35eArmor[] = [
  // Light
  padded,
  leather,
  studdedLeather,
  // Medium
  hide,
  chainShirt,
  scaleMail,
  breastplate,
  halfPlate,
  // Heavy
  splintMail,
  platemail,
  fullPlate,
];

export const dnd35eShields: DnD35eShield[] = [
  buckler,
  lightWoodenShield,
  lightSteelShield,
  heavyWoodenShield,
  heavySteelShield,
  towerShield,
];
