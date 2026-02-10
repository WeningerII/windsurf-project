import { Armor, Shield } from '../../../../types/equipment/items';

// Light Armor
export const padded: Armor = {
  id: 'padded',
  name: 'Padded',
  system: 'dnd-5e-2014', source: 'SRD 5.1',   type: 'armor',
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
  system: 'dnd-5e-2014', source: 'SRD 5.1',   type: 'armor',
  armorType: 'light',
  rarity: 'common',
  armorClass: 11,
  stealthDisadvantage: false,
  weight: 10,
  cost: { amount: 10, currency: 'gp' },
  description: 'The breastplate and shoulder protectors of this armor are made of leather that has been stiffened by being boiled in oil. The rest of the armor is made of softer and more flexible materials.',
  requiresAttunement: false,
};

export const studdedLeather: Armor = {
  id: 'studded-leather',
  name: 'Studded Leather',
  system: 'dnd-5e-2014', source: 'SRD 5.1',   type: 'armor',
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
  system: 'dnd-5e-2014', source: 'SRD 5.1',   type: 'armor',
  armorType: 'medium',
  rarity: 'common',
  armorClass: 12,
  dexBonusMax: 2,
  stealthDisadvantage: false,
  weight: 12,
  cost: { amount: 10, currency: 'gp' },
  description: 'This crude armor consists of thick furs and pelts. It is commonly worn by barbarian tribes, evil humanoids, and other folk who lack access to the tools and materials needed to create better armor.',
  requiresAttunement: false,
};

export const chainShirt: Armor = {
  id: 'chain-shirt',
  name: 'Chain Shirt',
  system: 'dnd-5e-2014', source: 'SRD 5.1',   type: 'armor',
  armorType: 'medium',
  rarity: 'common',
  armorClass: 13,
  dexBonusMax: 2,
  stealthDisadvantage: false,
  weight: 20,
  cost: { amount: 50, currency: 'gp' },
  description: 'Made of interlocking metal rings, a chain shirt is worn between layers of clothing or leather. This armor offers modest protection to the wearer\'s upper body and allows the sound of the rings rubbing against one another to be muffled by outer layers.',
  requiresAttunement: false,
};

export const scaleMail: Armor = {
  id: 'scale-mail',
  name: 'Scale Mail',
  system: 'dnd-5e-2014', source: 'SRD 5.1',   type: 'armor',
  armorType: 'medium',
  rarity: 'common',
  armorClass: 14,
  dexBonusMax: 2,
  stealthDisadvantage: true,
  weight: 45,
  cost: { amount: 50, currency: 'gp' },
  description: 'This armor consists of a coat and leggings (and perhaps a separate skirt) of leather covered with overlapping pieces of metal, much like the scales of a fish. The suit includes gauntlets.',
  requiresAttunement: false,
};

export const breastplate: Armor = {
  id: 'breastplate',
  name: 'Breastplate',
  system: 'dnd-5e-2014', source: 'SRD 5.1',   type: 'armor',
  armorType: 'medium',
  rarity: 'common',
  armorClass: 14,
  dexBonusMax: 2,
  stealthDisadvantage: false,
  weight: 20,
  cost: { amount: 400, currency: 'gp' },
  description: 'This armor consists of a fitted metal chest piece worn with supple leather. Although it leaves the legs and arms relatively unprotected, this armor provides good protection for the wearer\'s vital organs while leaving the wearer relatively unencumbered.',
  requiresAttunement: false,
};

export const halfPlate: Armor = {
  id: 'half-plate',
  name: 'Half Plate',
  system: 'dnd-5e-2014', source: 'SRD 5.1',   type: 'armor',
  armorType: 'medium',
  rarity: 'common',
  armorClass: 15,
  dexBonusMax: 2,
  stealthDisadvantage: true,
  weight: 40,
  cost: { amount: 750, currency: 'gp' },
  description: 'Half plate consists of shaped metal plates that cover most of the wearer\'s body. It does not include leg protection beyond simple greaves that are attached with leather straps.',
  requiresAttunement: false,
};

// Heavy Armor
export const ringMail: Armor = {
  id: 'ring-mail',
  name: 'Ring Mail',
  system: 'dnd-5e-2014', source: 'SRD 5.1',   type: 'armor',
  armorType: 'heavy',
  rarity: 'common',
  armorClass: 14,
  dexBonusMax: 0,
  stealthDisadvantage: true,
  weight: 40,
  cost: { amount: 30, currency: 'gp' },
  description: 'This armor is leather armor with heavy rings sewn into it. The rings help reinforce the armor against blows from swords and axes. Ring mail is inferior to chain mail, and it\'s usually worn only by those who can\'t afford better armor.',
  requiresAttunement: false,
};

export const chainMail: Armor = {
  id: 'chain-mail',
  name: 'Chain Mail',
  system: 'dnd-5e-2014', source: 'SRD 5.1',   type: 'armor',
  armorType: 'heavy',
  rarity: 'common',
  armorClass: 16,
  dexBonusMax: 0,
  strengthRequirement: 13,
  stealthDisadvantage: true,
  weight: 55,
  cost: { amount: 75, currency: 'gp' },
  description: 'Made of interlocking metal rings, chain mail includes a layer of quilted fabric worn underneath the mail to prevent chafing and to cushion the impact of blows. The suit includes gauntlets.',
  requiresAttunement: false,
};

export const splint: Armor = {
  id: 'splint',
  name: 'Splint',
  system: 'dnd-5e-2014', source: 'SRD 5.1',   type: 'armor',
  armorType: 'heavy',
  rarity: 'common',
  armorClass: 17,
  dexBonusMax: 0,
  strengthRequirement: 15,
  stealthDisadvantage: true,
  weight: 60,
  cost: { amount: 200, currency: 'gp' },
  description: 'This armor is made of narrow vertical strips of metal riveted to a backing of leather that is worn over cloth padding. Flexible chain mail protects the joints.',
  requiresAttunement: false,
};

export const plate: Armor = {
  id: 'plate',
  name: 'Plate',
  system: 'dnd-5e-2014', source: 'SRD 5.1',   type: 'armor',
  armorType: 'heavy',
  rarity: 'common',
  armorClass: 18,
  dexBonusMax: 0,
  strengthRequirement: 15,
  stealthDisadvantage: true,
  weight: 65,
  cost: { amount: 1500, currency: 'gp' },
  description: 'Plate consists of shaped, interlocking metal plates to cover the entire body. A suit of plate includes gauntlets, heavy leather boots, a visored helmet, and thick layers of padding underneath the armor. Buckles and straps distribute the weight over the body.',
  requiresAttunement: false,
};

// Shields
export const shield: Shield = {
  id: 'shield',
  name: 'Shield',
  system: 'dnd-5e-2014', source: 'SRD 5.1',   type: 'shield',
  rarity: 'common',
  armorClassBonus: 2,
  weight: 6,
  cost: { amount: 10, currency: 'gp' },
  description: 'A shield is made from wood or metal and is carried in one hand. Wielding a shield increases your Armor Class by 2. You can benefit from only one shield at a time.',
  requiresAttunement: false,
};

export const dnd5eArmor: Armor[] = [
  // Light Armor
  padded,
  leather,
  studdedLeather,
  // Medium Armor
  hide,
  chainShirt,
  scaleMail,
  breastplate,
  halfPlate,
  // Heavy Armor
  ringMail,
  chainMail,
  splint,
  plate,
];

export const dnd5eShields: Shield[] = [
  shield,
];
import { Item } from '../../../../types/equipment/items';

// D&D 5e-2014 Magic Armor Variants - SRD Compliant
// +1, +2, +3 variants for all armor types

// PLATE ARMOR
export const platePlus1: Item = {
  id: 'plate-armor-plus-1',
  name: 'Plate Armor +1',
  system: 'dnd-5e-2014', source: 'SRD 5.1',   type: 'magic-item',
  rarity: 'rare',
  weight: 65,
  cost: { amount: 0, currency: 'gp' },
  description: 'You have a +1 bonus to AC while wearing this armor.',
  requiresAttunement: false,
};

export const platePlus2: Item = {
  id: 'plate-armor-plus-2',
  name: 'Plate Armor +2',
  system: 'dnd-5e-2014', source: 'SRD 5.1',   type: 'magic-item',
  rarity: 'very-rare',
  weight: 65,
  cost: { amount: 0, currency: 'gp' },
  description: 'You have a +2 bonus to AC while wearing this armor.',
  requiresAttunement: false,
};

export const platePlus3: Item = {
  id: 'plate-armor-plus-3',
  name: 'Plate Armor +3',
  system: 'dnd-5e-2014', source: 'SRD 5.1',   type: 'magic-item',
  rarity: 'legendary',
  weight: 65,
  cost: { amount: 0, currency: 'gp' },
  description: 'You have a +3 bonus to AC while wearing this armor.',
  requiresAttunement: false,
};

// CHAIN MAIL
export const chainMailPlus1: Item = {
  id: 'chain-mail-plus-1',
  name: 'Chain Mail +1',
  system: 'dnd-5e-2014', source: 'SRD 5.1',   type: 'magic-item',
  rarity: 'rare',
  weight: 55,
  cost: { amount: 0, currency: 'gp' },
  description: 'You have a +1 bonus to AC while wearing this armor.',
  requiresAttunement: false,
};

export const chainMailPlus2: Item = {
  id: 'chain-mail-plus-2',
  name: 'Chain Mail +2',
  system: 'dnd-5e-2014', source: 'SRD 5.1',   type: 'magic-item',
  rarity: 'very-rare',
  weight: 55,
  cost: { amount: 0, currency: 'gp' },
  description: 'You have a +2 bonus to AC while wearing this armor.',
  requiresAttunement: false,
};

export const chainMailPlus3: Item = {
  id: 'chain-mail-plus-3',
  name: 'Chain Mail +3',
  system: 'dnd-5e-2014', source: 'SRD 5.1',   type: 'magic-item',
  rarity: 'legendary',
  weight: 55,
  cost: { amount: 0, currency: 'gp' },
  description: 'You have a +3 bonus to AC while wearing this armor.',
  requiresAttunement: false,
};

// SPLINT ARMOR
export const splintPlus1: Item = {
  id: 'splint-armor-plus-1',
  name: 'Splint Armor +1',
  system: 'dnd-5e-2014', source: 'SRD 5.1',   type: 'magic-item',
  rarity: 'rare',
  weight: 60,
  cost: { amount: 0, currency: 'gp' },
  description: 'You have a +1 bonus to AC while wearing this armor.',
  requiresAttunement: false,
};

export const splintPlus2: Item = {
  id: 'splint-armor-plus-2',
  name: 'Splint Armor +2',
  system: 'dnd-5e-2014', source: 'SRD 5.1',   type: 'magic-item',
  rarity: 'very-rare',
  weight: 60,
  cost: { amount: 0, currency: 'gp' },
  description: 'You have a +2 bonus to AC while wearing this armor.',
  requiresAttunement: false,
};

export const splintPlus3: Item = {
  id: 'splint-armor-plus-3',
  name: 'Splint Armor +3',
  system: 'dnd-5e-2014', source: 'SRD 5.1',   type: 'magic-item',
  rarity: 'legendary',
  weight: 60,
  cost: { amount: 0, currency: 'gp' },
  description: 'You have a +3 bonus to AC while wearing this armor.',
  requiresAttunement: false,
};

// HALF PLATE
export const halfPlatePlus1: Item = {
  id: 'half-plate-plus-1',
  name: 'Half Plate +1',
  system: 'dnd-5e-2014', source: 'SRD 5.1',   type: 'magic-item',
  rarity: 'rare',
  weight: 40,
  cost: { amount: 0, currency: 'gp' },
  description: 'You have a +1 bonus to AC while wearing this armor.',
  requiresAttunement: false,
};

export const halfPlatePlus2: Item = {
  id: 'half-plate-plus-2',
  name: 'Half Plate +2',
  system: 'dnd-5e-2014', source: 'SRD 5.1',   type: 'magic-item',
  rarity: 'very-rare',
  weight: 40,
  cost: { amount: 0, currency: 'gp' },
  description: 'You have a +2 bonus to AC while wearing this armor.',
  requiresAttunement: false,
};

export const halfPlatePlus3: Item = {
  id: 'half-plate-plus-3',
  name: 'Half Plate +3',
  system: 'dnd-5e-2014', source: 'SRD 5.1',   type: 'magic-item',
  rarity: 'legendary',
  weight: 40,
  cost: { amount: 0, currency: 'gp' },
  description: 'You have a +3 bonus to AC while wearing this armor.',
  requiresAttunement: false,
};

// BREASTPLATE
export const breastplatePlus1: Item = {
  id: 'breastplate-plus-1',
  name: 'Breastplate +1',
  system: 'dnd-5e-2014', source: 'SRD 5.1',   type: 'magic-item',
  rarity: 'rare',
  weight: 20,
  cost: { amount: 0, currency: 'gp' },
  description: 'You have a +1 bonus to AC while wearing this armor.',
  requiresAttunement: false,
};

export const breastplatePlus2: Item = {
  id: 'breastplate-plus-2',
  name: 'Breastplate +2',
  system: 'dnd-5e-2014', source: 'SRD 5.1',   type: 'magic-item',
  rarity: 'very-rare',
  weight: 20,
  cost: { amount: 0, currency: 'gp' },
  description: 'You have a +2 bonus to AC while wearing this armor.',
  requiresAttunement: false,
};

export const breastplatePlus3: Item = {
  id: 'breastplate-plus-3',
  name: 'Breastplate +3',
  system: 'dnd-5e-2014', source: 'SRD 5.1',   type: 'magic-item',
  rarity: 'legendary',
  weight: 20,
  cost: { amount: 0, currency: 'gp' },
  description: 'You have a +3 bonus to AC while wearing this armor.',
  requiresAttunement: false,
};

// SCALE MAIL
export const scaleMailPlus1: Item = {
  id: 'scale-mail-plus-1',
  name: 'Scale Mail +1',
  system: 'dnd-5e-2014', source: 'SRD 5.1',   type: 'magic-item',
  rarity: 'rare',
  weight: 45,
  cost: { amount: 0, currency: 'gp' },
  description: 'You have a +1 bonus to AC while wearing this armor.',
  requiresAttunement: false,
};

export const scaleMailPlus2: Item = {
  id: 'scale-mail-plus-2',
  name: 'Scale Mail +2',
  system: 'dnd-5e-2014', source: 'SRD 5.1',   type: 'magic-item',
  rarity: 'very-rare',
  weight: 45,
  cost: { amount: 0, currency: 'gp' },
  description: 'You have a +2 bonus to AC while wearing this armor.',
  requiresAttunement: false,
};

export const scaleMailPlus3: Item = {
  id: 'scale-mail-plus-3',
  name: 'Scale Mail +3',
  system: 'dnd-5e-2014', source: 'SRD 5.1',   type: 'magic-item',
  rarity: 'legendary',
  weight: 45,
  cost: { amount: 0, currency: 'gp' },
  description: 'You have a +3 bonus to AC while wearing this armor.',
  requiresAttunement: false,
};

// LEATHER ARMOR
export const leatherPlus1: Item = {
  id: 'leather-armor-plus-1',
  name: 'Leather Armor +1',
  system: 'dnd-5e-2014', source: 'SRD 5.1',   type: 'magic-item',
  rarity: 'rare',
  weight: 10,
  cost: { amount: 0, currency: 'gp' },
  description: 'You have a +1 bonus to AC while wearing this armor.',
  requiresAttunement: false,
};

export const leatherPlus2: Item = {
  id: 'leather-armor-plus-2',
  name: 'Leather Armor +2',
  system: 'dnd-5e-2014', source: 'SRD 5.1',   type: 'magic-item',
  rarity: 'very-rare',
  weight: 10,
  cost: { amount: 0, currency: 'gp' },
  description: 'You have a +2 bonus to AC while wearing this armor.',
  requiresAttunement: false,
};

export const leatherPlus3: Item = {
  id: 'leather-armor-plus-3',
  name: 'Leather Armor +3',
  system: 'dnd-5e-2014', source: 'SRD 5.1',   type: 'magic-item',
  rarity: 'legendary',
  weight: 10,
  cost: { amount: 0, currency: 'gp' },
  description: 'You have a +3 bonus to AC while wearing this armor.',
  requiresAttunement: false,
};

// STUDDED LEATHER
export const studdedLeatherPlus1: Item = {
  id: 'studded-leather-plus-1',
  name: 'Studded Leather +1',
  system: 'dnd-5e-2014', source: 'SRD 5.1',   type: 'magic-item',
  rarity: 'rare',
  weight: 13,
  cost: { amount: 0, currency: 'gp' },
  description: 'You have a +1 bonus to AC while wearing this armor.',
  requiresAttunement: false,
};

export const studdedLeatherPlus2: Item = {
  id: 'studded-leather-plus-2',
  name: 'Studded Leather +2',
  system: 'dnd-5e-2014', source: 'SRD 5.1',   type: 'magic-item',
  rarity: 'very-rare',
  weight: 13,
  cost: { amount: 0, currency: 'gp' },
  description: 'You have a +2 bonus to AC while wearing this armor.',
  requiresAttunement: false,
};

export const studdedLeatherPlus3: Item = {
  id: 'studded-leather-plus-3',
  name: 'Studded Leather +3',
  system: 'dnd-5e-2014', source: 'SRD 5.1',   type: 'magic-item',
  rarity: 'legendary',
  weight: 13,
  cost: { amount: 0, currency: 'gp' },
  description: 'You have a +3 bonus to AC while wearing this armor.',
  requiresAttunement: false,
};

// SHIELDS
export const shieldPlus1: Item = {
  id: 'shield-plus-1',
  name: 'Shield +1',
  system: 'dnd-5e-2014', source: 'SRD 5.1',   type: 'magic-item',
  rarity: 'uncommon',
  weight: 6,
  cost: { amount: 0, currency: 'gp' },
  description: 'While holding this shield, you have a +1 bonus to AC. This bonus is in addition to the shield\'s normal bonus to AC.',
  requiresAttunement: false,
};

export const shieldPlus2: Item = {
  id: 'shield-plus-2',
  name: 'Shield +2',
  system: 'dnd-5e-2014', source: 'SRD 5.1',   type: 'magic-item',
  rarity: 'rare',
  weight: 6,
  cost: { amount: 0, currency: 'gp' },
  description: 'While holding this shield, you have a +2 bonus to AC. This bonus is in addition to the shield\'s normal bonus to AC.',
  requiresAttunement: false,
};

export const shieldPlus3: Item = {
  id: 'shield-plus-3',
  name: 'Shield +3',
  system: 'dnd-5e-2014', source: 'SRD 5.1',   type: 'magic-item',
  rarity: 'very-rare',
  weight: 6,
  cost: { amount: 0, currency: 'gp' },
  description: 'While holding this shield, you have a +3 bonus to AC. This bonus is in addition to the shield\'s normal bonus to AC.',
  requiresAttunement: false,
};

export const magicArmorExpanded: Item[] = [
  platePlus1, platePlus2, platePlus3,
  chainMailPlus1, chainMailPlus2, chainMailPlus3,
  splintPlus1, splintPlus2, splintPlus3,
  halfPlatePlus1, halfPlatePlus2, halfPlatePlus3,
  breastplatePlus1, breastplatePlus2, breastplatePlus3,
  scaleMailPlus1, scaleMailPlus2, scaleMailPlus3,
  leatherPlus1, leatherPlus2, leatherPlus3,
  studdedLeatherPlus1, studdedLeatherPlus2, studdedLeatherPlus3,
  shieldPlus1, shieldPlus2, shieldPlus3,
];
