import { MagicItem } from '../../../../types/equipment/items';

// Pathfinder 1e SRD Magic Items
// Source: Core Rulebook (d20pfsrd.com)
// License: OGL v1.0a

// WONDROUS ITEMS

export const amuletOfHealth: MagicItem = {
  id: 'amulet-of-health',
  name: 'Amulet of Health',
  system: 'pf1e',
  source: 'Core Rulebook',
  type: 'magic-item',
  rarity: 'uncommon',
  weight: 0.5,
  cost: { amount: 30000, currency: 'gp' },
  requiresAttunement: false,
  modifiers: [{ value: 2, type: 'enhancement', source: 'Amulet of Health' }],
  effects: ['+2 enhancement bonus to Constitution'],
  description: 'This amulet grants the wearer a +2 enhancement bonus to Constitution.',
};

export const beltOfStrength: MagicItem = {
  id: 'belt-of-strength',
  name: 'Belt of Strength',
  system: 'pf1e',
  source: 'Core Rulebook',
  type: 'magic-item',
  rarity: 'uncommon',
  weight: 1,
  cost: { amount: 30000, currency: 'gp' },
  requiresAttunement: false,
  modifiers: [{ value: 2, type: 'enhancement', source: 'Belt of Strength' }],
  effects: ['+2 enhancement bonus to Strength'],
  description: 'This belt grants the wearer a +2 enhancement bonus to Strength.',
};

export const bootsOfSpeed: MagicItem = {
  id: 'boots-of-speed',
  name: 'Boots of Speed',
  system: 'pf1e',
  source: 'Core Rulebook',
  type: 'magic-item',
  rarity: 'uncommon',
  weight: 1,
  cost: { amount: 12000, currency: 'gp' },
  requiresAttunement: false,
  modifiers: [],
  effects: ['Increase movement speed by 30 feet'],
  description: "These boots increase the wearer's movement speed by 30 feet.",
};

export const cloakOfResistance: MagicItem = {
  id: 'cloak-of-resistance',
  name: 'Cloak of Resistance',
  system: 'pf1e',
  source: 'Core Rulebook',
  type: 'magic-item',
  rarity: 'uncommon',
  weight: 1,
  cost: { amount: 1000, currency: 'gp' },
  requiresAttunement: false,
  modifiers: [{ value: 1, type: 'saving-throw', source: 'Cloak of Resistance' }],
  effects: ['+1 resistance bonus to all saving throws'],
  description: 'This cloak grants the wearer a +1 bonus to all saving throws.',
};

export const cloakOfCharisma: MagicItem = {
  id: 'cloak-of-charisma',
  name: 'Cloak of Charisma',
  system: 'pf1e',
  source: 'Core Rulebook',
  type: 'magic-item',
  rarity: 'uncommon',
  weight: 1,
  cost: { amount: 30000, currency: 'gp' },
  requiresAttunement: false,
  modifiers: [{ value: 2, type: 'enhancement', source: 'Cloak of Charisma' }],
  effects: ['+2 enhancement bonus to Charisma'],
  description: 'This cloak grants the wearer a +2 enhancement bonus to Charisma.',
};

// RINGS

export const ringOfProtection: MagicItem = {
  id: 'ring-of-protection',
  name: 'Ring of Protection',
  system: 'pf1e',
  source: 'Core Rulebook',
  type: 'magic-item',
  rarity: 'uncommon',
  weight: 0,
  cost: { amount: 2000, currency: 'gp' },
  requiresAttunement: false,
  modifiers: [{ value: 1, type: 'armor-class', source: 'Ring of Protection' }],
  effects: ['+1 deflection bonus to AC'],
  description: 'This ring grants the wearer a +1 deflection bonus to AC.',
};

export const ringOfSustenance: MagicItem = {
  id: 'ring-of-sustenance',
  name: 'Ring of Sustenance',
  system: 'pf1e',
  source: 'Core Rulebook',
  type: 'magic-item',
  rarity: 'uncommon',
  weight: 0,
  cost: { amount: 2500, currency: 'gp' },
  requiresAttunement: false,
  modifiers: [],
  effects: ['Survive on one-quarter the normal amount of food and water'],
  description:
    'This ring allows the wearer to survive on one-quarter the normal amount of food and water.',
};

export const ringOfInvisibility: MagicItem = {
  id: 'ring-of-invisibility',
  name: 'Ring of Invisibility',
  system: 'pf1e',
  source: 'Core Rulebook',
  type: 'magic-item',
  rarity: 'rare',
  weight: 0,
  cost: { amount: 20000, currency: 'gp' },
  requiresAttunement: false,
  modifiers: [],
  effects: ['Renders the wearer invisible'],
  description: 'This ring renders the wearer invisible.',
};

// WANDS

export const wandOfMagicMissiles: MagicItem = {
  id: 'wand-of-magic-missiles',
  name: 'Wand of Magic Missiles',
  system: 'pf1e',
  source: 'Core Rulebook',
  type: 'magic-item',
  rarity: 'common',
  weight: 0.5,
  cost: { amount: 750, currency: 'gp' },
  requiresAttunement: false,
  modifiers: [],
  charges: {
    max: 50,
    rechargeTime: 'dawn',
  },
  effects: ['Cast Magic Missile'],
  description: 'This wand allows the user to cast Magic Missile up to 50 times.',
};

export const wandOfCureLightWounds: MagicItem = {
  id: 'wand-of-cure-light-wounds',
  name: 'Wand of Cure Light Wounds',
  system: 'pf1e',
  source: 'Core Rulebook',
  type: 'magic-item',
  rarity: 'common',
  weight: 0.5,
  cost: { amount: 750, currency: 'gp' },
  requiresAttunement: false,
  modifiers: [],
  charges: {
    max: 50,
    rechargeTime: 'dawn',
  },
  effects: ['Cast Cure Light Wounds'],
  description: 'This wand allows the user to cast Cure Light Wounds up to 50 times.',
};

export const wandOfFireball: MagicItem = {
  id: 'wand-of-fireball',
  name: 'Wand of Fireball',
  system: 'pf1e',
  source: 'Core Rulebook',
  type: 'magic-item',
  rarity: 'uncommon',
  weight: 0.5,
  cost: { amount: 7200, currency: 'gp' },
  requiresAttunement: false,
  modifiers: [],
  charges: {
    max: 50,
    rechargeTime: 'dawn',
  },
  effects: ['Cast Fireball'],
  description: 'This wand allows the user to cast Fireball up to 50 times.',
};

// BAGS AND CONTAINERS

export const bagOfHolding: MagicItem = {
  id: 'bag-of-holding',
  name: 'Bag of Holding',
  system: 'pf1e',
  source: 'Core Rulebook',
  type: 'magic-item',
  rarity: 'uncommon',
  weight: 15,
  cost: { amount: 2500, currency: 'gp' },
  requiresAttunement: false,
  modifiers: [],
  effects: ['Holds up to 250 pounds of material'],
  description: 'This bag can hold up to 250 pounds of material, but weighs only 15 pounds.',
};

export const portableHole: MagicItem = {
  id: 'portable-hole',
  name: 'Portable Hole',
  system: 'pf1e',
  source: 'Core Rulebook',
  type: 'magic-item',
  rarity: 'rare',
  weight: 0,
  cost: { amount: 20000, currency: 'gp' },
  requiresAttunement: false,
  modifiers: [],
  effects: ['Creates a 10-foot-radius extradimensional space'],
  description: 'This cloth creates a 10-foot-radius extradimensional space.',
};

// CLOAKS AND CAPES

export const cloakOfInvisibility: MagicItem = {
  id: 'cloak-of-invisibility',
  name: 'Cloak of Invisibility',
  system: 'pf1e',
  source: 'Core Rulebook',
  type: 'magic-item',
  rarity: 'rare',
  weight: 1,
  cost: { amount: 62000, currency: 'gp' },
  requiresAttunement: false,
  modifiers: [],
  effects: ['Renders the wearer invisible when worn'],
  description: 'When worn, this cloak renders the wearer invisible.',
};

export const cloakOfFlying: MagicItem = {
  id: 'cloak-of-flying',
  name: 'Cloak of Flying',
  system: 'pf1e',
  source: 'Core Rulebook',
  type: 'magic-item',
  rarity: 'rare',
  weight: 1,
  cost: { amount: 55000, currency: 'gp' },
  requiresAttunement: false,
  modifiers: [],
  effects: ['Allows the wearer to fly at will'],
  description: 'This cloak allows the wearer to fly at will.',
};

// MAGIC WEAPONS

export const longsword1: MagicItem = {
  id: 'longsword-1',
  name: 'Longsword +1',
  system: 'pf1e',
  source: 'Core Rulebook',
  type: 'magic-item',
  rarity: 'uncommon',
  weight: 4,
  cost: { amount: 2315, currency: 'gp' },
  requiresAttunement: false,
  baseItemId: 'longsword',
  modifiers: [
    { value: 1, type: 'enhancement', source: 'Magic Enhancement' },
    { value: 1, type: 'attack', source: 'Magic Enhancement' },
    { value: 1, type: 'damage', source: 'Magic Enhancement' },
  ],
  effects: ['Counts as magical for overcoming damage reduction'],
  description: 'This longsword has a magical enhancement of +1.',
};

export const longsword2: MagicItem = {
  id: 'longsword-2',
  name: 'Longsword +2',
  system: 'pf1e',
  source: 'Core Rulebook',
  type: 'magic-item',
  baseItemId: 'longsword',
  rarity: 'rare',
  weight: 4,
  cost: { amount: 8315, currency: 'gp' },
  requiresAttunement: false,
  modifiers: [
    { value: 2, type: 'enhancement', source: 'Magic Enhancement' },
    { value: 2, type: 'attack', source: 'Magic Enhancement' },
    { value: 2, type: 'damage', source: 'Magic Enhancement' },
  ],
  effects: ['Counts as magical for overcoming damage reduction'],
  description: 'This longsword has a magical enhancement of +2.',
};

export const shortsword1: MagicItem = {
  id: 'shortsword-1',
  name: 'Shortsword +1',
  system: 'pf1e',
  source: 'Core Rulebook',
  type: 'magic-item',
  baseItemId: 'shortsword',
  rarity: 'uncommon',
  weight: 2,
  cost: { amount: 2310, currency: 'gp' },
  requiresAttunement: false,
  modifiers: [
    { value: 1, type: 'enhancement', source: 'Magic Enhancement' },
    { value: 1, type: 'attack', source: 'Magic Enhancement' },
    { value: 1, type: 'damage', source: 'Magic Enhancement' },
  ],
  effects: ['Counts as magical for overcoming damage reduction'],
  description: 'This shortsword has a magical enhancement of +1.',
};

export const greataxe1: MagicItem = {
  id: 'greataxe-1',
  name: 'Greataxe +1',
  system: 'pf1e',
  source: 'Core Rulebook',
  type: 'magic-item',
  baseItemId: 'greataxe',
  rarity: 'uncommon',
  weight: 12,
  cost: { amount: 2320, currency: 'gp' },
  requiresAttunement: false,
  modifiers: [
    { value: 1, type: 'enhancement', source: 'Magic Enhancement' },
    { value: 1, type: 'attack', source: 'Magic Enhancement' },
    { value: 1, type: 'damage', source: 'Magic Enhancement' },
  ],
  effects: ['Counts as magical for overcoming damage reduction'],
  description: 'This greataxe has a magical enhancement of +1.',
};

export const longbow1: MagicItem = {
  id: 'longbow-1',
  name: 'Longbow +1',
  system: 'pf1e',
  source: 'Core Rulebook',
  type: 'magic-item',
  baseItemId: 'longbow',
  rarity: 'uncommon',
  weight: 3,
  cost: { amount: 2375, currency: 'gp' },
  requiresAttunement: false,
  modifiers: [
    { value: 1, type: 'enhancement', source: 'Magic Enhancement' },
    { value: 1, type: 'attack', source: 'Magic Enhancement' },
    { value: 1, type: 'damage', source: 'Magic Enhancement' },
  ],
  effects: ['Counts as magical for overcoming damage reduction'],
  description: 'This longbow has a magical enhancement of +1.',
};

export const flamingLongsword: MagicItem = {
  id: 'flaming-longsword',
  name: 'Flaming Longsword',
  system: 'pf1e',
  source: 'Core Rulebook',
  type: 'magic-item',
  baseItemId: 'longsword',
  rarity: 'rare',
  weight: 4,
  cost: { amount: 8815, currency: 'gp' },
  requiresAttunement: false,
  modifiers: [
    { value: 1, type: 'enhancement', source: 'Magic Enhancement' },
    { value: 1, type: 'attack', source: 'Magic Enhancement' },
    { value: 1, type: 'damage', source: 'Magic Enhancement' },
    { value: 1, type: 'damage', source: 'Flaming Property' },
  ],
  effects: [
    'Deals additional 1d6 fire damage on hit',
    'Counts as magical for overcoming damage reduction',
  ],
  description: 'This longsword is wreathed in magical flames.',
};

export const frostLongsword: MagicItem = {
  id: 'frost-longsword',
  name: 'Frost Longsword',
  system: 'pf1e',
  source: 'Core Rulebook',
  type: 'magic-item',
  baseItemId: 'longsword',
  rarity: 'rare',
  weight: 4,
  cost: { amount: 8815, currency: 'gp' },
  requiresAttunement: false,
  modifiers: [
    { value: 1, type: 'enhancement', source: 'Magic Enhancement' },
    { value: 1, type: 'attack', source: 'Magic Enhancement' },
    { value: 1, type: 'damage', source: 'Magic Enhancement' },
    { value: 1, type: 'damage', source: 'Frost Property' },
  ],
  effects: [
    'Deals additional 1d6 cold damage on hit',
    'Counts as magical for overcoming damage reduction',
  ],
  description: 'This longsword is covered in a layer of magical frost.',
};

export const shockLongsword: MagicItem = {
  id: 'shock-longsword',
  name: 'Shock Longsword',
  system: 'pf1e',
  source: 'Core Rulebook',
  type: 'magic-item',
  rarity: 'rare',
  weight: 4,
  cost: { amount: 8815, currency: 'gp' },
  requiresAttunement: false,
  baseItemId: 'longsword',
  modifiers: [
    { value: 1, type: 'enhancement', source: 'Magic Enhancement' },
    { value: 1, type: 'attack', source: 'Magic Enhancement' },
    { value: 1, type: 'damage', source: 'Magic Enhancement' },
    { value: 1, type: 'damage', source: 'Shock Property' },
  ],
  effects: [
    'Deals additional 1d6 electricity damage on hit',
    'Counts as magical for overcoming damage reduction',
  ],
  description: 'This longsword crackles with electrical energy.',
};

// Collected array
export const pf1eMagicItems: MagicItem[] = [
  amuletOfHealth,
  beltOfStrength,
  bootsOfSpeed,
  cloakOfResistance,
  cloakOfCharisma,
  ringOfProtection,
  ringOfSustenance,
  ringOfInvisibility,
  wandOfMagicMissiles,
  wandOfCureLightWounds,
  wandOfFireball,
  bagOfHolding,
  portableHole,
  cloakOfInvisibility,
  cloakOfFlying,
  longsword1,
  longsword2,
  shortsword1,
  greataxe1,
  longbow1,
  flamingLongsword,
  frostLongsword,
  shockLongsword,
];
