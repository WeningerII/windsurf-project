import { Armor, Shield } from '../../../../types/equipment/items';

// Light Armor
export const padded: Armor = {
  id: 'padded',
  name: 'Padded',
  system: 'dnd-5e-2024', source: 'SRD 5.2',   type: 'armor',
  armorType: 'light',
  rarity: 'common',
  armorClass: 11,
  stealthDisadvantage: true,
  weight: 8,
  cost: { amount: 5, currency: 'gp' },
  description: 'Padded armor consists of quilted layers of cloth and batting.',
  requiresAttunement: false,
};

export const leather: Armor = {
  id: 'leather',
  name: 'Leather',
  system: 'dnd-5e-2024', source: 'SRD 5.2',   type: 'armor',
  armorType: 'light',
  rarity: 'common',
  armorClass: 11,
  stealthDisadvantage: false,
  weight: 10,
  cost: { amount: 10, currency: 'gp' },
  description: 'The breastplate and shoulder protectors of this armor are made of leather that has been stiffened by being boiled in oil.',
  requiresAttunement: false,
};

export const studdedLeather: Armor = {
  id: 'studded-leather',
  name: 'Studded Leather',
  system: 'dnd-5e-2024', source: 'SRD 5.2',   type: 'armor',
  armorType: 'light',
  rarity: 'common',
  armorClass: 12,
  stealthDisadvantage: false,
  weight: 13,
  cost: { amount: 45, currency: 'gp' },
  description: 'Made from tough but flexible leather, studded leather is reinforced with close-set rivets or spikes.',
  requiresAttunement: false,
};

// Medium Armor
export const hide: Armor = {
  id: 'hide',
  name: 'Hide',
  system: 'dnd-5e-2024', source: 'SRD 5.2',   type: 'armor',
  armorType: 'medium',
  rarity: 'common',
  armorClass: 12,
  dexBonusMax: 2,
  stealthDisadvantage: false,
  weight: 12,
  cost: { amount: 10, currency: 'gp' },
  description: 'This crude armor consists of thick furs and pelts.',
  requiresAttunement: false,
};

export const chainShirt: Armor = {
  id: 'chain-shirt',
  name: 'Chain Shirt',
  system: 'dnd-5e-2024', source: 'SRD 5.2',   type: 'armor',
  armorType: 'medium',
  rarity: 'common',
  armorClass: 13,
  dexBonusMax: 2,
  stealthDisadvantage: false,
  weight: 20,
  cost: { amount: 50, currency: 'gp' },
  description: 'Made of interlocking metal rings, a chain shirt is worn between layers of clothing or leather.',
  requiresAttunement: false,
};

export const scaleMail: Armor = {
  id: 'scale-mail',
  name: 'Scale Mail',
  system: 'dnd-5e-2024', source: 'SRD 5.2',   type: 'armor',
  armorType: 'medium',
  rarity: 'common',
  armorClass: 14,
  dexBonusMax: 2,
  stealthDisadvantage: true,
  weight: 45,
  cost: { amount: 50, currency: 'gp' },
  description: 'This armor consists of a coat and leggings (and perhaps a separate skirt) of leather covered with overlapping pieces of metal, much like the scales of a fish.',
  requiresAttunement: false,
};

export const breastplate: Armor = {
  id: 'breastplate',
  name: 'Breastplate',
  system: 'dnd-5e-2024', source: 'SRD 5.2',   type: 'armor',
  armorType: 'medium',
  rarity: 'common',
  armorClass: 14,
  dexBonusMax: 2,
  stealthDisadvantage: false,
  weight: 20,
  cost: { amount: 400, currency: 'gp' },
  description: 'This armor consists of a fitted metal chest piece worn with supple leather.',
  requiresAttunement: false,
};

export const halfPlate: Armor = {
  id: 'half-plate',
  name: 'Half Plate',
  system: 'dnd-5e-2024', source: 'SRD 5.2',   type: 'armor',
  armorType: 'medium',
  rarity: 'common',
  armorClass: 15,
  dexBonusMax: 2,
  stealthDisadvantage: true,
  weight: 40,
  cost: { amount: 750, currency: 'gp' },
  description: 'Half plate consists of shaped metal plates that cover most of the wearer\'s body.',
  requiresAttunement: false,
};

// Heavy Armor
export const ringMail: Armor = {
  id: 'ring-mail',
  name: 'Ring Mail',
  system: 'dnd-5e-2024', source: 'SRD 5.2',   type: 'armor',
  armorType: 'heavy',
  rarity: 'common',
  armorClass: 14,
  dexBonusMax: 0,
  stealthDisadvantage: true,
  weight: 40,
  cost: { amount: 30, currency: 'gp' },
  description: 'This armor is leather armor with heavy rings sewn into it.',
  requiresAttunement: false,
};

export const chainMail: Armor = {
  id: 'chain-mail',
  name: 'Chain Mail',
  system: 'dnd-5e-2024', source: 'SRD 5.2',   type: 'armor',
  armorType: 'heavy',
  rarity: 'common',
  armorClass: 16,
  dexBonusMax: 0,
  strengthRequirement: 13,
  stealthDisadvantage: true,
  weight: 55,
  cost: { amount: 75, currency: 'gp' },
  description: 'Made of interlocking metal rings, chain mail includes a layer of quilted fabric underneath the mail to prevent chafing and to cushion the impact of blows.',
  requiresAttunement: false,
};

export const splint: Armor = {
  id: 'splint',
  name: 'Splint',
  system: 'dnd-5e-2024', source: 'SRD 5.2',   type: 'armor',
  armorType: 'heavy',
  rarity: 'common',
  armorClass: 17,
  dexBonusMax: 0,
  strengthRequirement: 15,
  stealthDisadvantage: true,
  weight: 60,
  cost: { amount: 200, currency: 'gp' },
  description: 'This armor is made of narrow vertical strips of metal riveted to a backing of leather that is worn over cloth padding.',
  requiresAttunement: false,
};

export const plate: Armor = {
  id: 'plate',
  name: 'Plate',
  system: 'dnd-5e-2024', source: 'SRD 5.2',   type: 'armor',
  armorType: 'heavy',
  rarity: 'common',
  armorClass: 18,
  dexBonusMax: 0,
  strengthRequirement: 15,
  stealthDisadvantage: true,
  weight: 65,
  cost: { amount: 1500, currency: 'gp' },
  description: 'Plate consists of shaped, interlocking metal plates to cover the entire body.',
  requiresAttunement: false,
};

// Shield
export const shield: Shield = {
  id: 'shield',
  name: 'Shield',
  system: 'dnd-5e-2024', source: 'SRD 5.2',   type: 'shield',
  rarity: 'common',
  armorClassBonus: 2,
  weight: 6,
  cost: { amount: 10, currency: 'gp' },
  description: 'A shield is made from wood or metal and is carried in one hand.',
  requiresAttunement: false,
};

export const dnd5e2024Armor: (Armor | Shield)[] = [
  padded,
  leather,
  studdedLeather,
  hide,
  chainShirt,
  scaleMail,
  breastplate,
  halfPlate,
  ringMail,
  chainMail,
  splint,
  plate,
  shield,
];
