/**
 * D&D 5e (2014) - Magic Armor
 *
 * This content is derived from the System Reference Document and is
 * released under the Open Gaming License v1.0a.
 *
 * Source: SRD 5.1
 * License: OGL v1.0a
 */

// Consolidated onto the canonical Item family (review M-2): the ad-hoc
// interface this file declared is gone, and the 4 entries that
// duplicated ids already shipped by the canonical equipment files were
// deleted (the canonical copies win — they are what the loader serves).
// The remaining entries are unique content, now reachable through
// dnd5eEquipment instead of being dead parallel data.

import { Item } from '../../../../types/equipment/items';

export const magicArmors: Item[] = [
  {
    id: 'armor-plus-1',
    name: 'Armor +1',
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 152 },
    type: 'magic-item',
    rarity: 'rare',
    weight: 0,
    cost: { amount: 0, currency: 'gp' },
    description: 'You have a +1 bonus to AC while you wear this armor.',
    requiresAttunement: false,
  },
  {
    id: 'armor-plus-2',
    name: 'Armor +2',
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 152 },
    type: 'magic-item',
    rarity: 'very-rare',
    weight: 0,
    cost: { amount: 0, currency: 'gp' },
    description: 'You have a +2 bonus to AC while you wear this armor.',
    requiresAttunement: false,
  },
  {
    id: 'armor-plus-3',
    name: 'Armor +3',
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 152 },
    type: 'magic-item',
    rarity: 'legendary',
    weight: 0,
    cost: { amount: 0, currency: 'gp' },
    description: 'You have a +3 bonus to AC while you wear this armor.',
    requiresAttunement: false,
  },
  {
    id: 'armor-of-invulnerability',
    name: 'Armor of Invulnerability',
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 152 },
    type: 'magic-item',
    rarity: 'legendary',
    weight: 0,
    cost: { amount: 0, currency: 'gp' },
    description: '',
    requiresAttunement: true,
  },
  {
    id: 'demon-armor',
    name: 'Demon Armor',
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 162 },
    type: 'magic-item',
    rarity: 'very-rare',
    weight: 0,
    cost: { amount: 0, currency: 'gp' },
    description: '',
    requiresAttunement: true,
  },
  {
    id: 'dragon-scale-mail',
    name: 'Dragon Scale Mail',
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 165 },
    type: 'magic-item',
    rarity: 'very-rare',
    weight: 0,
    cost: { amount: 0, currency: 'gp' },
    description:
      'Dragon scale mail is made of the scales of one kind of dragon. Sometimes dragons collect their cast-off scales and gift them to humanoids. Other times, hunters carefully skin and preserve the hide of a dead dragon. In either case, dragon scale mail is highly valued. While wearing this armor, you gain a +1 bonus to AC, you have advantage on saving throws against the Frightful Presence and breath weapons of dragons, and you have resistance to one damage type that is determined by the kind of dragon that provided the scales (see the table).',
    requiresAttunement: true,
  },
  {
    id: 'mithral-armor',
    name: 'Mithral Armor',
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 182 },
    type: 'magic-item',
    rarity: 'uncommon',
    weight: 0,
    cost: { amount: 0, currency: 'gp' },
    description: '',
    requiresAttunement: false,
  },
  {
    id: 'adamantine-armor',
    name: 'Adamantine Armor',
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 150 },
    type: 'magic-item',
    rarity: 'uncommon',
    weight: 0,
    cost: { amount: 0, currency: 'gp' },
    description: '',
    requiresAttunement: false,
  },
];
