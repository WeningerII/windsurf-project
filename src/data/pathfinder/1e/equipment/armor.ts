import { Armor, Shield } from '../../../../types/equipment/items';

// Light Armor
export const padded: Armor = {
  id: 'padded', name: 'Padded', system: 'pf1e', source: 'Core Rulebook', type: 'armor', armorType: 'light',
  rarity: 'common', armorClass: 1, dexBonusMax: 8, stealthDisadvantage: false,
  weight: 10, cost: { amount: 5, currency: 'gp' },
  description: 'Quilted layers of cloth and batting.', requiresAttunement: false,
};

export const leather: Armor = {
  id: 'leather', name: 'Leather', system: 'pf1e', source: 'Core Rulebook', type: 'armor', armorType: 'light',
  rarity: 'common', armorClass: 2, dexBonusMax: 6, stealthDisadvantage: false,
  weight: 15, cost: { amount: 10, currency: 'gp' },
  description: 'Leather armor covering the torso.', requiresAttunement: false,
};

export const studdedLeather: Armor = {
  id: 'studded-leather', name: 'Studded Leather', system: 'pf1e', source: 'Core Rulebook', type: 'armor', armorType: 'light',
  rarity: 'common', armorClass: 3, dexBonusMax: 5, stealthDisadvantage: false,
  weight: 20, cost: { amount: 25, currency: 'gp' },
  description: 'Leather reinforced with metal studs.', requiresAttunement: false,
};

export const chainShirt: Armor = {
  id: 'chain-shirt', name: 'Chain Shirt', system: 'pf1e', source: 'Core Rulebook', type: 'armor', armorType: 'light',
  rarity: 'common', armorClass: 4, dexBonusMax: 4, stealthDisadvantage: false,
  weight: 25, cost: { amount: 100, currency: 'gp' },
  description: 'A shirt of interlocking metal rings.', requiresAttunement: false,
};

// Medium Armor
export const hide: Armor = {
  id: 'hide', name: 'Hide', system: 'pf1e', source: 'Core Rulebook', type: 'armor', armorType: 'medium',
  rarity: 'common', armorClass: 4, dexBonusMax: 4, stealthDisadvantage: false,
  weight: 25, cost: { amount: 15, currency: 'gp' },
  description: 'Thick furs and pelts.', requiresAttunement: false,
};

export const scaleMail: Armor = {
  id: 'scale-mail', name: 'Scale Mail', system: 'pf1e', source: 'Core Rulebook', type: 'armor', armorType: 'medium',
  rarity: 'common', armorClass: 5, dexBonusMax: 3, stealthDisadvantage: false,
  weight: 30, cost: { amount: 50, currency: 'gp' },
  description: 'Overlapping metal scales on leather.', requiresAttunement: false,
};

export const chainmail: Armor = {
  id: 'chainmail', name: 'Chainmail', system: 'pf1e', source: 'Core Rulebook', type: 'armor', armorType: 'medium',
  rarity: 'common', armorClass: 6, dexBonusMax: 2, stealthDisadvantage: false,
  weight: 40, cost: { amount: 150, currency: 'gp' },
  description: 'Interlocking metal rings covering the body.', requiresAttunement: false,
};

export const breastplate: Armor = {
  id: 'breastplate', name: 'Breastplate', system: 'pf1e', source: 'Core Rulebook', type: 'armor', armorType: 'medium',
  rarity: 'common', armorClass: 6, dexBonusMax: 3, stealthDisadvantage: false,
  weight: 30, cost: { amount: 200, currency: 'gp' },
  description: 'A fitted metal chestplate.', requiresAttunement: false,
};

// Heavy Armor
export const splintMail: Armor = {
  id: 'splint-mail', name: 'Splint Mail', system: 'pf1e', source: 'Core Rulebook', type: 'armor', armorType: 'heavy',
  rarity: 'common', armorClass: 7, dexBonusMax: 0, stealthDisadvantage: true,
  weight: 45, cost: { amount: 200, currency: 'gp' },
  description: 'Vertical strips of metal riveted to leather.', requiresAttunement: false,
};

export const bandedMail: Armor = {
  id: 'banded-mail', name: 'Banded Mail', system: 'pf1e', source: 'Core Rulebook', type: 'armor', armorType: 'heavy',
  rarity: 'common', armorClass: 7, dexBonusMax: 1, stealthDisadvantage: true,
  weight: 35, cost: { amount: 250, currency: 'gp' },
  description: 'Overlapping strips of metal over chain.', requiresAttunement: false,
};

export const halfPlate: Armor = {
  id: 'half-plate', name: 'Half-Plate', system: 'pf1e', source: 'Core Rulebook', type: 'armor', armorType: 'heavy',
  rarity: 'common', armorClass: 8, dexBonusMax: 0, stealthDisadvantage: true,
  weight: 50, cost: { amount: 600, currency: 'gp' },
  description: 'Shaped metal plates covering most of the body.', requiresAttunement: false,
};

export const fullPlate: Armor = {
  id: 'full-plate', name: 'Full Plate', system: 'pf1e', source: 'Core Rulebook', type: 'armor', armorType: 'heavy',
  rarity: 'common', armorClass: 9, dexBonusMax: 1, stealthDisadvantage: true,
  weight: 50, cost: { amount: 1500, currency: 'gp' },
  description: 'Complete suit of interlocking metal plates.', requiresAttunement: false,
};

// Shields
export const buckler: Shield = {
  id: 'buckler', name: 'Buckler', system: 'pf1e', source: 'Core Rulebook', type: 'shield',
  rarity: 'common', armorClassBonus: 1,
  weight: 5, cost: { amount: 5, currency: 'gp' },
  description: 'A small shield strapped to the forearm.', requiresAttunement: false,
};

export const lightShield: Shield = {
  id: 'light-shield', name: 'Light Shield', system: 'pf1e', source: 'Core Rulebook', type: 'shield',
  rarity: 'common', armorClassBonus: 1,
  weight: 6, cost: { amount: 9, currency: 'gp' },
  description: 'A light wooden or steel shield.', requiresAttunement: false,
};

export const heavyShield: Shield = {
  id: 'heavy-shield', name: 'Heavy Shield', system: 'pf1e', source: 'Core Rulebook', type: 'shield',
  rarity: 'common', armorClassBonus: 2,
  weight: 15, cost: { amount: 20, currency: 'gp' },
  description: 'A heavy wooden or steel shield.', requiresAttunement: false,
};

export const towerShield: Shield = {
  id: 'tower-shield', name: 'Tower Shield', system: 'pf1e', source: 'Core Rulebook', type: 'shield',
  rarity: 'common', armorClassBonus: 4,
  weight: 45, cost: { amount: 30, currency: 'gp' },
  description: 'A massive shield providing cover.', requiresAttunement: false,
};

// Export all armor
export const pf1eArmor = {
  padded, leather, studdedLeather, chainShirt,
  hide, scaleMail, chainmail, breastplate,
  splintMail, bandedMail, halfPlate, fullPlate,
  buckler, lightShield, heavyShield, towerShield,
};
