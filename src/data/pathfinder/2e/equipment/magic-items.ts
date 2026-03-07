// Pathfinder 2e Magic Items
// Source: Core Rulebook (SRD-compliant)
// These are common magical items available in the core rulebook

export interface MagicItem {
  id: string;
  name: string;
  level: number;
  price: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'unique';
  type: string;
  description: string;
  source: string;
}

export const pf2eMagicItems: MagicItem[] = [
  {
    id: 'pf2e-magic-item-amulet-of-health',
    name: 'Amulet of Health',
    level: 3,
    price: '50 gp',
    rarity: 'uncommon',
    type: 'Wondrous Item',
    description: 'This amulet grants the wearer a +2 enhancement bonus to Constitution.',
    source: 'Core Rulebook',
  },
  {
    id: 'pf2e-magic-item-belt-of-strength',
    name: 'Belt of Strength',
    level: 3,
    price: '50 gp',
    rarity: 'uncommon',
    type: 'Wondrous Item',
    description: 'This belt grants the wearer a +2 enhancement bonus to Strength.',
    source: 'Core Rulebook',
  },
  {
    id: 'pf2e-magic-item-boots-of-speed',
    name: 'Boots of Speed',
    level: 4,
    price: '100 gp',
    rarity: 'uncommon',
    type: 'Wondrous Item',
    description: "These boots increase the wearer's movement speed by 10 feet.",
    source: 'Core Rulebook',
  },
  {
    id: 'pf2e-magic-item-cloak-of-resistance',
    name: 'Cloak of Resistance',
    level: 3,
    price: '50 gp',
    rarity: 'uncommon',
    type: 'Wondrous Item',
    description: 'This cloak grants the wearer a +1 bonus to all saving throws.',
    source: 'Core Rulebook',
  },
  {
    id: 'pf2e-magic-item-ring-of-protection',
    name: 'Ring of Protection',
    level: 3,
    price: '50 gp',
    rarity: 'uncommon',
    type: 'Ring',
    description: 'This ring grants the wearer a +1 deflection bonus to AC.',
    source: 'Core Rulebook',
  },
  {
    id: 'pf2e-magic-item-ring-of-sustenance',
    name: 'Ring of Sustenance',
    level: 4,
    price: '100 gp',
    rarity: 'uncommon',
    type: 'Ring',
    description:
      'This ring allows the wearer to survive on one-quarter the normal amount of food and water.',
    source: 'Core Rulebook',
  },
  {
    id: 'pf2e-magic-item-wand-of-magic-missiles',
    name: 'Wand of Magic Missiles',
    level: 2,
    price: '30 gp',
    rarity: 'common',
    type: 'Wand',
    description: 'This wand allows the user to cast Magic Missile up to 3 times per day.',
    source: 'Core Rulebook',
  },
  {
    id: 'pf2e-magic-item-wand-of-cure-light-wounds',
    name: 'Wand of Cure Light Wounds',
    level: 2,
    price: '30 gp',
    rarity: 'common',
    type: 'Wand',
    description: 'This wand allows the user to cast Cure Light Wounds up to 3 times per day.',
    source: 'Core Rulebook',
  },
  {
    id: 'pf2e-magic-item-bag-of-holding',
    name: 'Bag of Holding',
    level: 5,
    price: '250 gp',
    rarity: 'uncommon',
    type: 'Wondrous Item',
    description: 'This bag can hold up to 250 pounds of material, but weighs only 15 pounds.',
    source: 'Core Rulebook',
  },
  {
    id: 'pf2e-magic-item-cloak-of-invisibility',
    name: 'Cloak of Invisibility',
    level: 6,
    price: '500 gp',
    rarity: 'rare',
    type: 'Wondrous Item',
    description: 'When worn, this cloak renders the wearer invisible.',
    source: 'Core Rulebook',
  },
];

export const getMagicItem = (id: string): MagicItem | undefined => {
  return pf2eMagicItems.find((item) => item.id === id);
};

export const getMagicItemsByLevel = (level: number): MagicItem[] => {
  return pf2eMagicItems.filter((item) => item.level === level);
};

export const getMagicItemsByRarity = (rarity: string): MagicItem[] => {
  return pf2eMagicItems.filter((item) => item.rarity === rarity);
};
