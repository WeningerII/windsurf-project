import { Item } from '../../../../types/equipment/items';

// Pathfinder 2e Magic Armor
// Core Rulebook magic armor and runes

export const resilientRune: Item = {
  id: 'resilient-rune-pf2e',
  name: 'Resilient Rune',
  system: 'pf2e',
  type: 'magic-item',
  rarity: 'common',
  weight: 0,
  cost: { amount: 340, currency: 'gp' },
  description: 'Resilient armor grants a +1 item bonus to saving throws. This is in addition to any bonuses the armor provides to AC.',
  source: 'Core Rulebook', requiresAttunement: false,
};

export const greaterResilientRune: Item = {
  id: 'greater-resilient-rune-pf2e',
  name: 'Greater Resilient Rune',
  system: 'pf2e',
  type: 'magic-item',
  rarity: 'uncommon',
  weight: 0,
  cost: { amount: 3440, currency: 'gp' },
  description: 'Greater resilient armor grants a +2 item bonus to saving throws.',
  source: 'Core Rulebook', requiresAttunement: false,
};

export const majorResilientRune: Item = {
  id: 'major-resilient-rune-pf2e',
  name: 'Major Resilient Rune',
  system: 'pf2e',
  type: 'magic-item',
  rarity: 'rare',
  weight: 0,
  cost: { amount: 49440, currency: 'gp' },
  description: 'Major resilient armor grants a +3 item bonus to saving throws.',
  source: 'Core Rulebook', requiresAttunement: false,
};

export const fortification: Item = {
  id: 'fortification-rune-pf2e',
  name: 'Fortification Rune',
  system: 'pf2e',
  type: 'magic-item',
  rarity: 'uncommon',
  weight: 0,
  cost: { amount: 2000, currency: 'gp' },
  description: 'Armor with this property rune has a chance to turn critical hits into normal hits. When you\'re critically hit, the attacker must roll a DC 11 flat check. On a failure, the critical hit becomes a normal hit.',
  source: 'Core Rulebook', requiresAttunement: false,
};

export const greaterFortification: Item = {
  id: 'greater-fortification-rune-pf2e',
  name: 'Greater Fortification Rune',
  system: 'pf2e',
  type: 'magic-item',
  rarity: 'rare',
  weight: 0,
  cost: { amount: 14000, currency: 'gp' },
  description: 'Greater fortification has a DC 14 flat check to turn critical hits into normal hits.',
  source: 'Core Rulebook', requiresAttunement: false,
};

export const energyResistant: Item = {
  id: 'energy-resistant-rune-pf2e',
  name: 'Energy-Resistant Rune',
  system: 'pf2e',
  type: 'magic-item',
  rarity: 'common',
  weight: 0,
  cost: { amount: 420, currency: 'gp' },
  description: 'Choose an energy type (acid, cold, electricity, fire, or sonic). The armor grants resistance 5 to that energy type. You can activate the armor to increase the resistance to 10 for 1 minute.',
  source: 'Core Rulebook', requiresAttunement: false,
};

export const greaterEnergyResistant: Item = {
  id: 'greater-energy-resistant-rune-pf2e',
  name: 'Greater Energy-Resistant Rune',
  system: 'pf2e',
  type: 'magic-item',
  rarity: 'uncommon',
  weight: 0,
  cost: { amount: 1650, currency: 'gp' },
  description: 'The armor grants resistance 10 to the chosen energy type. You can activate it to increase the resistance to 15 for 1 minute.',
  source: 'Core Rulebook', requiresAttunement: false,
};

export const slick: Item = {
  id: 'slick-rune-pf2e',
  name: 'Slick Rune',
  system: 'pf2e',
  type: 'magic-item',
  rarity: 'common',
  weight: 0,
  cost: { amount: 450, currency: 'gp' },
  description: 'Slick armor is coated in a frictionless coating. You gain a +1 item bonus to Acrobatics checks to Escape and to your Reflex DC against checks to Grapple you.',
  source: 'Core Rulebook', requiresAttunement: false,
};

export const shadow: Item = {
  id: 'shadow-rune-pf2e',
  name: 'Shadow Rune',
  system: 'pf2e',
  type: 'magic-item',
  rarity: 'common',
  weight: 0,
  cost: { amount: 55, currency: 'gp' },
  description: 'Shadow armor seems to absorb light. You gain a +1 item bonus to Stealth checks while wearing the armor.',
  source: 'Core Rulebook', requiresAttunement: false,
};

export const greaterShadow: Item = {
  id: 'greater-shadow-rune-pf2e',
  name: 'Greater Shadow Rune',
  system: 'pf2e',
  type: 'magic-item',
  rarity: 'uncommon',
  weight: 0,
  cost: { amount: 650, currency: 'gp' },
  description: 'Greater shadow armor grants a +2 item bonus to Stealth checks. You can activate the armor to become invisible for 1 round.',
  source: 'Core Rulebook', requiresAttunement: false,
};

export const glamered: Item = {
  id: 'glamered-rune-pf2e',
  name: 'Glamered Rune',
  system: 'pf2e',
  type: 'magic-item',
  rarity: 'common',
  weight: 0,
  cost: { amount: 140, currency: 'gp' },
  description: 'You can change the appearance of glamered armor to appear as any other type of clothing or armor. This doesn\'t change the armor\'s statistics.',
  source: 'Core Rulebook', requiresAttunement: false,
};

export const pf2eMagicArmor: Item[] = [
  resilientRune,
  greaterResilientRune,
  majorResilientRune,
  fortification,
  greaterFortification,
  energyResistant,
  greaterEnergyResistant,
  slick,
  shadow,
  greaterShadow,
  glamered,
];
