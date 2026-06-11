/**
 * D&D 5e (2014) - Wondrous Items
 *
 * This content is derived from the System Reference Document and is
 * released under the Open Gaming License v1.0a.
 *
 * Source: SRD 5.1
 * License: OGL v1.0a
 */

// Consolidated onto the canonical Item family (review M-2): the ad-hoc
// interface this file declared is gone, and the 13 entries that
// duplicated ids already shipped by the canonical equipment files were
// deleted (the canonical copies win — they are what the loader serves).
// The remaining entries are unique content, now reachable through
// dnd5eEquipment instead of being dead parallel data.

import { Item } from '../../../../types/equipment/items';

export const wondrousItems: Item[] = [
  {
    id: 'headband-of-intellect',
    name: 'Headband of Intellect',
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 173 },
    type: 'magic-item',
    rarity: 'uncommon',
    weight: 1,
    cost: { amount: 0, currency: 'gp' },
    description:
      'Your Intelligence score is 19 while you wear this headband. It has no effect on you if your Intelligence is already 19 or higher.',
    requiresAttunement: true,
  },
  {
    id: 'rope-of-climbing',
    name: 'Rope of Climbing',
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 197 },
    type: 'magic-item',
    rarity: 'uncommon',
    weight: 1,
    cost: { amount: 0, currency: 'gp' },
    description:
      'This 60-foot length of silk rope weighs 3 pounds and can hold up to 3,000 pounds. If you hold one end of the rope and use an action to speak the command word, the rope animates. As a bonus action, you can command the other end to move toward a destination you choose. That end moves 10 feet on your turn when you first command it and 10 feet on each of your turns until reaching its destination, up to its maximum length away, or until you tell it to stop. You can also tell the rope to fasten itself securely to an object or to unfasten itself, to knot or unknot itself, or to coil itself for carrying. If you tell the rope to knot, large knots appear at 1-foot intervals along the rope. While knotted, the rope shortens to a 50-foot length and grants advantage on checks made to climb it. The rope has AC 20 and 20 hit points. It regains 1 hit point every 5 minutes as long as it has at least 1 hit point. If the rope drops to 0 hit points, it is destroyed.',
    requiresAttunement: false,
  },
];
