/**
 * D&D 5e (2014) - Magic Weapons
 *
 * This content is derived from the System Reference Document and is
 * released under the Open Gaming License v1.0a.
 *
 * Source: SRD 5.1
 * License: OGL v1.0a
 */

// Consolidated onto the canonical Item family (review M-2): the ad-hoc
// interface this file declared is gone, and the 1 entries that
// duplicated ids already shipped by the canonical equipment files were
// deleted (the canonical copies win — they are what the loader serves).
// The remaining entries are unique content, now reachable through
// dnd5eEquipment instead of being dead parallel data.

import { Item } from '../../../../types/equipment/items';

export const magicWeapons: Item[] = [
  {
    id: 'weapon-plus-1',
    name: 'Weapon +1',
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 213 },
    type: 'magic-item',
    rarity: 'uncommon',
    weight: 3,
    cost: { amount: 0, currency: 'gp' },
    description: 'You have a +1 bonus to attack and damage rolls made with this magic weapon.',
    requiresAttunement: false,
  },
  {
    id: 'weapon-plus-2',
    name: 'Weapon +2',
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 213 },
    type: 'magic-item',
    rarity: 'rare',
    weight: 3,
    cost: { amount: 0, currency: 'gp' },
    description: 'You have a +2 bonus to attack and damage rolls made with this magic weapon.',
    requiresAttunement: false,
  },
  {
    id: 'weapon-plus-3',
    name: 'Weapon +3',
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 213 },
    type: 'magic-item',
    rarity: 'very-rare',
    weight: 3,
    cost: { amount: 0, currency: 'gp' },
    description: 'You have a +3 bonus to attack and damage rolls made with this magic weapon.',
    requiresAttunement: false,
  },
  {
    id: 'flame-tongue',
    name: 'Flame Tongue',
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 170 },
    type: 'magic-item',
    rarity: 'rare',
    weight: 3,
    cost: { amount: 0, currency: 'gp' },
    description: '',
    requiresAttunement: true,
  },
  {
    id: 'javelin-of-lightning',
    name: 'Javelin of Lightning',
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 179 },
    type: 'magic-item',
    rarity: 'uncommon',
    weight: 3,
    cost: { amount: 0, currency: 'gp' },
    description: '',
    requiresAttunement: false,
  },
  {
    id: 'trident-of-fish-command',
    name: 'Trident of Fish Command',
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 209 },
    type: 'magic-item',
    rarity: 'uncommon',
    weight: 3,
    cost: { amount: 0, currency: 'gp' },
    description:
      'This trident is a magic weapon. It has 3 charges. While you carry it, you can use an action and expend 1 charge to cast dominate beast (save DC 15) from it on a beast that has an innate swimming speed. The trident regains 1d3 expended charges daily at dawn.',
    requiresAttunement: true,
  },
  {
    id: 'dagger-of-venom',
    name: 'Dagger of Venom',
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 161 },
    type: 'magic-item',
    rarity: 'rare',
    weight: 3,
    cost: { amount: 0, currency: 'gp' },
    description: '',
    requiresAttunement: false,
  },
  {
    id: 'mace-of-disruption',
    name: 'Mace of Disruption',
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 179 },
    type: 'magic-item',
    rarity: 'rare',
    weight: 3,
    cost: { amount: 0, currency: 'gp' },
    description:
      'When you hit a fiend or an undead with this magic weapon, that creature takes an extra 2d6 radiant damage. If the target has 25 hit points or fewer after taking this damage, it must succeed on a DC 15 Wisdom saving throw or be destroyed. On a successful save, the creature becomes frightened of you until the end of your next turn. While you hold this weapon, it sheds bright light in a 20-foot radius and dim light for an additional 20 feet.',
    requiresAttunement: true,
  },
  {
    id: 'sword-of-wounding',
    name: 'Sword of Wounding',
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 207 },
    type: 'magic-item',
    rarity: 'rare',
    weight: 3,
    cost: { amount: 0, currency: 'gp' },
    description: '',
    requiresAttunement: true,
  },
];
