/**
 * D&D 5e (2014) - Potions and Consumables
 *
 * This content is derived from the System Reference Document and is
 * released under the Open Gaming License v1.0a.
 *
 * Source: SRD 5.1
 * License: OGL v1.0a
 */

// Consolidated onto the canonical Item family (review M-2): the ad-hoc
// interface this file declared is gone, and the 6 entries that
// duplicated ids already shipped by the canonical equipment files were
// deleted (the canonical copies win — they are what the loader serves).
// The remaining entries are unique content, now reachable through
// dnd5eEquipment instead of being dead parallel data.

import { Item } from '../../../../types/equipment/items';

export const potions: Item[] = [
  {
    id: 'potion-of-superior-healing',
    name: 'Potion of Superior Healing',
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 187 },
    type: 'consumable',
    rarity: 'rare',
    weight: 0.5,
    cost: { amount: 0, currency: 'gp' },
    description: 'Effect: Regain 8d4 + 8 hit points',
    requiresAttunement: false,
  },
  {
    id: 'potion-of-fire-resistance',
    name: 'Potion of Fire Resistance',
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 188 },
    type: 'consumable',
    rarity: 'uncommon',
    weight: 0.5,
    cost: { amount: 0, currency: 'gp' },
    description:
      'When you drink this potion, you gain resistance to fire damage for 1 hour. Effect: Fire resistance for 1 hour',
    requiresAttunement: false,
  },
  {
    id: 'potion-of-heroism',
    name: 'Potion of Heroism',
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 188 },
    type: 'consumable',
    rarity: 'rare',
    weight: 0.5,
    cost: { amount: 0, currency: 'gp' },
    description:
      'For 1 hour after drinking it, you gain 10 temporary hit points that last for 1 hour. For the same duration, you are under the effect of the bless spell (no concentration required). This blue potion bubbles and steams as if boiling. Effect: 10 temp HP and bless for 1 hour',
    requiresAttunement: false,
  },
  {
    id: 'potion-of-speed',
    name: 'Potion of Speed',
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 188 },
    type: 'consumable',
    rarity: 'very-rare',
    weight: 0.5,
    cost: { amount: 0, currency: 'gp' },
    description: 'Effect: Haste for 1 minute',
    requiresAttunement: false,
  },
];
