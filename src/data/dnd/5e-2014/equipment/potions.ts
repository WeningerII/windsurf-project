/**
 * D&D 5e (2014) - Potions and Consumables
 *
 * This content is derived from the System Reference Document and is
 * released under the Open Gaming License v1.0a.
 *
 * Source: SRD 5.1
 * License: OGL v1.0a
 */

export interface Potion {
  id: string;
  name: string;
  description: string;
  system: 'dnd-5e-2014';
  source: { book: string; page: number };
  type: 'potion';
  rarity: 'common' | 'uncommon' | 'rare' | 'very-rare' | 'legendary' | 'artifact';
  requiresAttunement: boolean;
  consumable: boolean;
  effect: string;
  version: string;
}

export const potions: Potion[] = [
  {
    id: 'potion-of-healing',
    name: 'Potion of Healing',
    description:
      "You regain 2d4 + 2 hit points when you drink this potion. The potion's red liquid glimmers when agitated.",
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 187 },
    type: 'potion',
    rarity: 'common',
    requiresAttunement: false,
    consumable: true,
    effect: 'Regain 2d4 + 2 hit points',
    version: '1.0.0',
  },
  {
    id: 'potion-of-greater-healing',
    name: 'Potion of Greater Healing',
    description:
      "You regain 4d4 + 4 hit points when you drink this potion. The potion's red liquid glimmers when agitated.",
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 187 },
    type: 'potion',
    rarity: 'uncommon',
    requiresAttunement: false,
    consumable: true,
    effect: 'Regain 4d4 + 4 hit points',
    version: '1.0.0',
  },
  {
    id: 'potion-of-superior-healing',
    name: 'Potion of Superior Healing',
    description:
      "You regain 8d4 + 8 hit points when you drink this potion. The potion's red liquid glimmers when agitated.",
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 187 },
    type: 'potion',
    rarity: 'rare',
    requiresAttunement: false,
    consumable: true,
    effect: 'Regain 8d4 + 8 hit points',
    version: '1.0.0',
  },
  {
    id: 'potion-of-supreme-healing',
    name: 'Potion of Supreme Healing',
    description:
      "You regain 10d4 + 20 hit points when you drink this potion. The potion's red liquid glimmers when agitated.",
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 187 },
    type: 'potion',
    rarity: 'very-rare',
    requiresAttunement: false,
    consumable: true,
    effect: 'Regain 10d4 + 20 hit points',
    version: '1.0.0',
  },
  {
    id: 'potion-of-invisibility',
    name: 'Potion of Invisibility',
    description:
      'When you drink this potion, you become invisible for 1 hour. Anything you wear or carry is invisible with you. The effect ends early if you attack or cast a spell.',
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 188 },
    type: 'potion',
    rarity: 'very-rare',
    requiresAttunement: false,
    consumable: true,
    effect: 'Invisibility for 1 hour',
    version: '1.0.0',
  },
  {
    id: 'potion-of-flying',
    name: 'Potion of Flying',
    description:
      "When you drink this potion, you gain a flying speed equal to your walking speed for 1 hour and can hover. If you're in the air when the potion wears off, you fall unless you have some other means of staying aloft. This potion's clear liquid floats at the top of its container and has cloudy white impurities drifting in it.",
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 187 },
    type: 'potion',
    rarity: 'very-rare',
    requiresAttunement: false,
    consumable: true,
    effect: 'Flying speed for 1 hour',
    version: '1.0.0',
  },
  {
    id: 'potion-of-fire-resistance',
    name: 'Potion of Fire Resistance',
    description: 'When you drink this potion, you gain resistance to fire damage for 1 hour.',
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 188 },
    type: 'potion',
    rarity: 'uncommon',
    requiresAttunement: false,
    consumable: true,
    effect: 'Fire resistance for 1 hour',
    version: '1.0.0',
  },
  {
    id: 'potion-of-heroism',
    name: 'Potion of Heroism',
    description:
      'For 1 hour after drinking it, you gain 10 temporary hit points that last for 1 hour. For the same duration, you are under the effect of the bless spell (no concentration required). This blue potion bubbles and steams as if boiling.',
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 188 },
    type: 'potion',
    rarity: 'rare',
    requiresAttunement: false,
    consumable: true,
    effect: '10 temp HP and bless for 1 hour',
    version: '1.0.0',
  },
  {
    id: 'potion-of-growth',
    name: 'Potion of Growth',
    description:
      'When you drink this potion, you gain the "enlarge" effect of the enlarge/reduce spell for 1d4 hours (no concentration required). The red in the potion\'s liquid continuously expands from a tiny bead to color the clear liquid around it and then contracts. Shaking the bottle fails to interrupt this process.',
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 187 },
    type: 'potion',
    rarity: 'uncommon',
    requiresAttunement: false,
    consumable: true,
    effect: 'Enlarge effect for 1d4 hours',
    version: '1.0.0',
  },
  {
    id: 'potion-of-speed',
    name: 'Potion of Speed',
    description:
      "When you drink this potion, you gain the effect of the haste spell for 1 minute (no concentration required). The potion's yellow fluid is streaked with black and swirls on its own.",
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 188 },
    type: 'potion',
    rarity: 'very-rare',
    requiresAttunement: false,
    consumable: true,
    effect: 'Haste for 1 minute',
    version: '1.0.0',
  },
];
