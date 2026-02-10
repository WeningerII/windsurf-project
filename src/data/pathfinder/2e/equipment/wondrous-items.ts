import { Item } from '../../../../types/equipment/items';

// Pathfinder 2e Wondrous Items
// Core Rulebook wondrous items

export const bagOfHolding1: Item = {
  id: 'bag-of-holding-type-i-pf2e',
  name: 'Bag of Holding (Type I)',
  system: 'pf2e',
  type: 'magic-item',
  rarity: 'uncommon',
  weight: 1,
  cost: { amount: 75, currency: 'gp' },
  description: 'This bag has an interior space considerably larger than its outside dimensions. The bag can hold up to 25 Bulk worth of items. The first two Bulk you retrieve don\'t count against the total.',
  source: 'Core Rulebook', requiresAttunement: false,
};

export const bagOfHolding2: Item = {
  id: 'bag-of-holding-type-ii-pf2e',
  name: 'Bag of Holding (Type II)',
  system: 'pf2e',
  type: 'magic-item',
  rarity: 'uncommon',
  weight: 1,
  cost: { amount: 350, currency: 'gp' },
  description: 'This bag can hold up to 50 Bulk worth of items. The first four Bulk you retrieve don\'t count against the total.',
  source: 'Core Rulebook', requiresAttunement: false,
};

export const cloakOfElvenkind: Item = {
  id: 'cloak-of-elvenkind-pf2e',
  name: 'Cloak of Elvenkind',
  system: 'pf2e',
  type: 'magic-item',
  rarity: 'uncommon',
  weight: 1,
  cost: { amount: 360, currency: 'gp' },
  description: 'This cloak is deep green with a voluminous hood. You gain a +2 item bonus to Stealth checks. You can pull the hood up or down with an Interact action.',
  source: 'Core Rulebook', requiresAttunement: false,
};

export const bootsOfSpeed: Item = {
  id: 'boots-of-speed-pf2e',
  name: 'Boots of Speed',
  system: 'pf2e',
  type: 'magic-item',
  rarity: 'uncommon',
  weight: 1,
  cost: { amount: 650, currency: 'gp' },
  description: 'These sleek boots have straps that wind up the legs. You can activate the boots to gain a +5-foot status bonus to your Speed for 1 minute.',
  source: 'Core Rulebook', requiresAttunement: false,
};

export const ringOfProtection: Item = {
  id: 'ring-of-protection-pf2e',
  name: 'Ring of Protection',
  system: 'pf2e',
  type: 'magic-item',
  rarity: 'uncommon',
  weight: 0,
  cost: { amount: 350, currency: 'gp' },
  description: 'This ring has a blessing that protects the wearer. You gain a +1 item bonus to AC and saving throws.',
  source: 'Core Rulebook', requiresAttunement: false,
};

export const amuletOfNaturalArmor: Item = {
  id: 'amulet-of-natural-armor-pf2e',
  name: 'Amulet of Natural Armor',
  system: 'pf2e',
  type: 'magic-item',
  rarity: 'uncommon',
  weight: 0,
  cost: { amount: 60, currency: 'gp' },
  description: 'This amulet, usually crafted from a monster scale or hide, grants you a +1 item bonus to AC.',
  source: 'Core Rulebook', requiresAttunement: false,
};

export const bracersOfArmor: Item = {
  id: 'bracers-of-armor-pf2e',
  name: 'Bracers of Armor',
  system: 'pf2e',
  type: 'magic-item',
  rarity: 'uncommon',
  weight: 1,
  cost: { amount: 60, currency: 'gp' },
  description: 'These stiff leather bracers grant you a +1 item bonus to AC. They have no effect if you\'re wearing armor.',
  source: 'Core Rulebook', requiresAttunement: false,
};

export const beltOfGiantStrength: Item = {
  id: 'belt-of-giant-strength-pf2e',
  name: 'Belt of Giant Strength',
  system: 'pf2e',
  type: 'magic-item',
  rarity: 'uncommon',
  weight: 1,
  cost: { amount: 400, currency: 'gp' },
  description: 'This thick leather belt is decorated with a buckle carved from stone. You gain a +2 item bonus to Athletics checks and a +2 circumstance bonus to your Strength-based checks.',
  source: 'Core Rulebook', requiresAttunement: false,
};

export const headbandOfIntelligence: Item = {
  id: 'headband-of-intelligence-pf2e',
  name: 'Headband of Intelligence',
  system: 'pf2e',
  type: 'magic-item',
  rarity: 'uncommon',
  weight: 0,
  cost: { amount: 400, currency: 'gp' },
  description: 'This simple cloth headband grants greater mental prowess. You gain a +2 item bonus to Arcana, Nature, Occultism, or Religion checks (choose one when you invest the headband).',
  source: 'Core Rulebook', requiresAttunement: false,
};

export const cloakOfResistance: Item = {
  id: 'cloak-of-resistance-pf2e',
  name: 'Cloak of Resistance',
  system: 'pf2e',
  type: 'magic-item',
  rarity: 'uncommon',
  weight: 1,
  cost: { amount: 160, currency: 'gp' },
  description: 'This cloak is woven with precious metals. It grants you a +1 item bonus to saving throws.',
  source: 'Core Rulebook', requiresAttunement: false,
};

export const greaterCloakOfResistance: Item = {
  id: 'greater-cloak-of-resistance-pf2e',
  name: 'Greater Cloak of Resistance',
  system: 'pf2e',
  type: 'magic-item',
  rarity: 'rare',
  weight: 1,
  cost: { amount: 900, currency: 'gp' },
  description: 'This cloak grants a +2 item bonus to saving throws.',
  source: 'Core Rulebook', requiresAttunement: false,
};

export const wandOfMagicMissiles: Item = {
  id: 'wand-of-magic-missiles-pf2e',
  name: 'Wand of Magic Missiles',
  system: 'pf2e',
  type: 'magic-item',
  rarity: 'common',
  weight: 0,
  cost: { amount: 200, currency: 'gp' },
  description: 'This wand features a carved star on its tip. You can activate the wand to cast magic missile at 1st level. The wand has 7 charges, and it regains 1d6+1 expended charges each day at dawn.',
  source: 'Core Rulebook', requiresAttunement: false,
};

export const pf2eWondrousItems: Item[] = [
  bagOfHolding1,
  bagOfHolding2,
  cloakOfElvenkind,
  bootsOfSpeed,
  ringOfProtection,
  amuletOfNaturalArmor,
  bracersOfArmor,
  beltOfGiantStrength,
  headbandOfIntelligence,
  cloakOfResistance,
  greaterCloakOfResistance,
  wandOfMagicMissiles,
];
