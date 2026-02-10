import { Item } from '../../../../types/equipment/items';

// Pathfinder 2e Magic Weapons
// Core Rulebook magic weapons

export const strikingRune: Item = {
  id: 'striking-rune-pf2e',
  name: 'Striking Rune',
  system: 'pf2e',
  type: 'magic-item',
  rarity: 'common',
  weight: 0,
  cost: { amount: 65, currency: 'gp' },
  description: 'A striking rune increases the number of weapon damage dice. A striking weapon deals 2 damage dice instead of 1. This applies to all weapon damage dice, such as those from property runes and weapon specialization.',
  source: 'Core Rulebook', requiresAttunement: false,
};

export const greaterStrikingRune: Item = {
  id: 'greater-striking-rune-pf2e',
  name: 'Greater Striking Rune',
  system: 'pf2e',
  type: 'magic-item',
  rarity: 'uncommon',
  weight: 0,
  cost: { amount: 1065, currency: 'gp' },
  description: 'A greater striking rune increases the number of weapon damage dice to 3. This applies to all weapon damage dice.',
  source: 'Core Rulebook', requiresAttunement: false,
};

export const majorStrikingRune: Item = {
  id: 'major-striking-rune-pf2e',
  name: 'Major Striking Rune',
  system: 'pf2e',
  type: 'magic-item',
  rarity: 'rare',
  weight: 0,
  cost: { amount: 31065, currency: 'gp' },
  description: 'A major striking rune increases the number of weapon damage dice to 4. This applies to all weapon damage dice.',
  source: 'Core Rulebook', requiresAttunement: false,
};

export const flaming: Item = {
  id: 'flaming-rune-pf2e',
  name: 'Flaming Rune',
  system: 'pf2e',
  type: 'magic-item',
  rarity: 'common',
  weight: 0,
  cost: { amount: 500, currency: 'gp' },
  description: 'The weapon glows with a reddish hue. When you critically hit with the weapon, the target takes 1d6 persistent fire damage. You can activate the rune to have the weapon deal an additional 1d6 fire damage on a Strike.',
  source: 'Core Rulebook', requiresAttunement: false,
};

export const frost: Item = {
  id: 'frost-rune-pf2e',
  name: 'Frost Rune',
  system: 'pf2e',
  type: 'magic-item',
  rarity: 'common',
  weight: 0,
  cost: { amount: 500, currency: 'gp' },
  description: 'The weapon glows with pale blue light. When you critically hit with the weapon, the target takes 1d6 persistent cold damage. You can activate the rune to have the weapon deal an additional 1d6 cold damage on a Strike.',
  source: 'Core Rulebook', requiresAttunement: false,
};

export const shock: Item = {
  id: 'shock-rune-pf2e',
  name: 'Shock Rune',
  system: 'pf2e',
  type: 'magic-item',
  rarity: 'common',
  weight: 0,
  cost: { amount: 500, currency: 'gp' },
  description: 'The weapon crackles with electricity. When you critically hit with the weapon, the target takes 1d6 persistent electricity damage. You can activate the rune to have the weapon deal an additional 1d6 electricity damage on a Strike.',
  source: 'Core Rulebook', requiresAttunement: false,
};

export const thundering: Item = {
  id: 'thundering-rune-pf2e',
  name: 'Thundering Rune',
  system: 'pf2e',
  type: 'magic-item',
  rarity: 'common',
  weight: 0,
  cost: { amount: 500, currency: 'gp' },
  description: 'The weapon makes a thunderous boom when it strikes. When you critically hit with the weapon, the target takes 1d6 persistent sonic damage and is deafened for 1 round.',
  source: 'Core Rulebook', requiresAttunement: false,
};

export const holy: Item = {
  id: 'holy-rune-pf2e',
  name: 'Holy Rune',
  system: 'pf2e',
  type: 'magic-item',
  rarity: 'uncommon',
  weight: 0,
  cost: { amount: 1400, currency: 'gp' },
  description: 'Holy weapons deal an additional 1d6 good damage against evil creatures. On a critical hit against an evil creature, the target is enfeebled 1 for 1 round.',
  source: 'Core Rulebook', requiresAttunement: false,
};

export const unholy: Item = {
  id: 'unholy-rune-pf2e',
  name: 'Unholy Rune',
  system: 'pf2e',
  type: 'magic-item',
  rarity: 'uncommon',
  weight: 0,
  cost: { amount: 1400, currency: 'gp' },
  description: 'Unholy weapons deal an additional 1d6 evil damage against good creatures. On a critical hit against a good creature, the target is enfeebled 1 for 1 round.',
  source: 'Core Rulebook', requiresAttunement: false,
};

export const keen: Item = {
  id: 'keen-rune-pf2e',
  name: 'Keen Rune',
  system: 'pf2e',
  type: 'magic-item',
  rarity: 'uncommon',
  weight: 0,
  cost: { amount: 1400, currency: 'gp' },
  description: 'The weapon is sharper than normal. It scores a critical hit on a roll of 19 or 20 (instead of just 20). This increases your critical hit threat range.',
  source: 'Core Rulebook', requiresAttunement: false,
};

export const vorpal: Item = {
  id: 'vorpal-rune-pf2e',
  name: 'Vorpal Rune',
  system: 'pf2e',
  type: 'magic-item',
  rarity: 'rare',
  weight: 0,
  cost: { amount: 15000, currency: 'gp' },
  description: 'The weapon can sever limbs and heads. On a critical hit, the target must succeed at a DC 35 Fortitude save or be decapitated (if it has a head) or lose a limb. This has no effect on creatures that don\'t take persistent bleed damage.',
  source: 'Core Rulebook', requiresAttunement: false,
};

export const returning: Item = {
  id: 'returning-rune-pf2e',
  name: 'Returning Rune',
  system: 'pf2e',
  type: 'magic-item',
  rarity: 'common',
  weight: 0,
  cost: { amount: 55, currency: 'gp' },
  description: 'When you make a thrown Strike with this weapon, it flies back to your hand after the Strike is complete. If your hands are full when the weapon returns, it falls to the ground in your space.',
  source: 'Core Rulebook', requiresAttunement: false,
};

export const pf2eMagicWeapons: Item[] = [
  strikingRune,
  greaterStrikingRune,
  majorStrikingRune,
  flaming,
  frost,
  shock,
  thundering,
  holy,
  unholy,
  keen,
  vorpal,
  returning,
];
