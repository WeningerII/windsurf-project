import { Armor, Shield } from '../../../../types/equipment/items';

// Light Armor
export const padded: Armor = {
  id: 'padded', name: 'Padded Armor', system: 'pf2e', type: 'armor', armorType: 'light',
  rarity: 'common', armorClass: 1, dexBonusMax: 3, stealthDisadvantage: false,
  weight: 1, cost: { amount: 2, currency: 'sp' },
  description: 'Light padded armor.', source: 'Core Rulebook', requiresAttunement: false,
};

export const leather: Armor = {
  id: 'leather', name: 'Leather Armor', system: 'pf2e', type: 'armor', armorType: 'light',
  rarity: 'common', armorClass: 1, dexBonusMax: 4, stealthDisadvantage: false,
  weight: 2, cost: { amount: 2, currency: 'gp' },
  description: 'Basic leather armor.', source: 'Core Rulebook', requiresAttunement: false,
};

export const studdedLeather: Armor = {
  id: 'studded-leather', name: 'Studded Leather', system: 'pf2e', type: 'armor', armorType: 'light',
  rarity: 'common', armorClass: 2, dexBonusMax: 3, stealthDisadvantage: false,
  weight: 2, cost: { amount: 3, currency: 'gp' },
  description: 'Leather reinforced with studs.', source: 'Core Rulebook', requiresAttunement: false,
};

export const chainShirt: Armor = {
  id: 'chain-shirt', name: 'Chain Shirt', system: 'pf2e', type: 'armor', armorType: 'light',
  rarity: 'common', armorClass: 2, dexBonusMax: 3, stealthDisadvantage: true,
  weight: 2, cost: { amount: 5, currency: 'gp' },
  description: 'A shirt of interlocking metal rings.', source: 'Core Rulebook', requiresAttunement: false,
};

// Medium Armor
export const hide: Armor = {
  id: 'hide', name: 'Hide Armor', system: 'pf2e', type: 'armor', armorType: 'medium',
  rarity: 'common', armorClass: 3, dexBonusMax: 2, stealthDisadvantage: false,
  weight: 4, cost: { amount: 2, currency: 'gp' },
  description: 'Thick animal hides.', source: 'Core Rulebook', requiresAttunement: false,
};

export const scaleMail: Armor = {
  id: 'scale-mail', name: 'Scale Mail', system: 'pf2e', type: 'armor', armorType: 'medium',
  rarity: 'common', armorClass: 3, dexBonusMax: 2, stealthDisadvantage: true,
  weight: 4, cost: { amount: 4, currency: 'gp' },
  description: 'Overlapping metal scales.', source: 'Core Rulebook', requiresAttunement: false,
};

export const chainmail: Armor = {
  id: 'chainmail', name: 'Chain Mail', system: 'pf2e', type: 'armor', armorType: 'medium',
  rarity: 'common', armorClass: 4, dexBonusMax: 1, stealthDisadvantage: true,
  weight: 4, cost: { amount: 6, currency: 'gp' },
  description: 'Full chainmail suit.', source: 'Core Rulebook', requiresAttunement: false,
};

export const breastplate: Armor = {
  id: 'breastplate', name: 'Breastplate', system: 'pf2e', type: 'armor', armorType: 'medium',
  rarity: 'common', armorClass: 4, dexBonusMax: 1, stealthDisadvantage: false,
  weight: 4, cost: { amount: 8, currency: 'gp' },
  description: 'A fitted metal chestplate.', source: 'Core Rulebook', requiresAttunement: false,
};

// Heavy Armor
export const splintMail: Armor = {
  id: 'splint-mail', name: 'Splint Mail', system: 'pf2e', type: 'armor', armorType: 'heavy',
  rarity: 'common', armorClass: 5, dexBonusMax: 1, stealthDisadvantage: true,
  weight: 8, cost: { amount: 13, currency: 'gp' },
  description: 'Vertical strips of metal.', source: 'Core Rulebook', requiresAttunement: false,
};

export const halfPlate: Armor = {
  id: 'half-plate', name: 'Half Plate', system: 'pf2e', type: 'armor', armorType: 'heavy',
  rarity: 'common', armorClass: 5, dexBonusMax: 1, stealthDisadvantage: true,
  weight: 8, cost: { amount: 18, currency: 'gp' },
  description: 'Partial plate coverage.', source: 'Core Rulebook', requiresAttunement: false,
};

export const fullPlate: Armor = {
  id: 'full-plate', name: 'Full Plate', system: 'pf2e', type: 'armor', armorType: 'heavy',
  rarity: 'common', armorClass: 6, dexBonusMax: 0, stealthDisadvantage: true,
  weight: 10, cost: { amount: 30, currency: 'gp' },
  description: 'Complete suit of plate armor.', source: 'Core Rulebook', requiresAttunement: false,
};

// Shields
export const buckler: Shield = {
  id: 'buckler', name: 'Buckler', system: 'pf2e', type: 'shield',
  rarity: 'common', armorClassBonus: 1,
  weight: 1, cost: { amount: 1, currency: 'gp' },
  description: 'A small, light shield.', source: 'Core Rulebook', requiresAttunement: false,
};

export const woodenShield: Shield = {
  id: 'wooden-shield', name: 'Wooden Shield', system: 'pf2e', type: 'shield',
  rarity: 'common', armorClassBonus: 2,
  weight: 2, cost: { amount: 1, currency: 'gp' },
  description: 'A sturdy wooden shield.', source: 'Core Rulebook', requiresAttunement: false,
};

export const steelShield: Shield = {
  id: 'steel-shield', name: 'Steel Shield', system: 'pf2e', type: 'shield',
  rarity: 'common', armorClassBonus: 2,
  weight: 3, cost: { amount: 2, currency: 'gp' },
  description: 'A steel shield.', source: 'Core Rulebook', requiresAttunement: false,
};

export const towerShield: Shield = {
  id: 'tower-shield', name: 'Tower Shield', system: 'pf2e', type: 'shield',
  rarity: 'common', armorClassBonus: 2,
  weight: 8, cost: { amount: 10, currency: 'gp' },
  description: 'A large shield providing cover.', source: 'Core Rulebook', requiresAttunement: false,
};

// Additional Light Armor
export const explorerClothing: Armor = {
  id: 'explorer-clothing', name: 'Explorer\'s Clothing', system: 'pf2e', type: 'armor', armorType: 'light',
  rarity: 'common', armorClass: 0, dexBonusMax: 5, stealthDisadvantage: false,
  weight: 0, cost: { amount: 1, currency: 'sp' },
  description: 'Durable clothing for adventurers.', source: 'Core Rulebook', requiresAttunement: false,
};

// Additional Medium Armor
export const bandedMail: Armor = {
  id: 'banded-mail', name: 'Banded Mail', system: 'pf2e', type: 'armor', armorType: 'medium',
  rarity: 'common', armorClass: 4, dexBonusMax: 1, stealthDisadvantage: true,
  weight: 5, cost: { amount: 10, currency: 'gp' },
  description: 'Overlapping metal bands.', source: 'Core Rulebook', requiresAttunement: false,
};

// Additional Heavy Armor
export const ringMail: Armor = {
  id: 'ring-mail', name: 'Ring Mail', system: 'pf2e', type: 'armor', armorType: 'heavy',
  rarity: 'common', armorClass: 5, dexBonusMax: 0, stealthDisadvantage: true,
  weight: 8, cost: { amount: 10, currency: 'gp' },
  description: 'Armor made of interlocking rings.', source: 'Core Rulebook', requiresAttunement: false,
};

export const fieldPlate: Armor = {
  id: 'field-plate', name: 'Field Plate', system: 'pf2e', type: 'armor', armorType: 'heavy',
  rarity: 'common', armorClass: 6, dexBonusMax: 0, stealthDisadvantage: true,
  weight: 9, cost: { amount: 25, currency: 'gp' },
  description: 'Battle-ready plate armor.', source: 'Core Rulebook', requiresAttunement: false,
};

export const armoredCoat: Armor = {
  id: 'armored-coat', name: 'Armored Coat', system: 'pf2e', type: 'armor', armorType: 'medium',
  rarity: 'common', armorClass: 3, dexBonusMax: 2, stealthDisadvantage: false,
  weight: 3, cost: { amount: 3, currency: 'gp' },
  description: 'A reinforced coat providing protection.', source: 'Core Rulebook', requiresAttunement: false,
};

export const pf2eArmor = {
  explorerClothing, padded, leather, studdedLeather, chainShirt,
  hide, scaleMail, chainmail, breastplate, bandedMail, armoredCoat,
  ringMail, splintMail, halfPlate, fullPlate, fieldPlate,
  buckler, woodenShield, steelShield, towerShield,
};
