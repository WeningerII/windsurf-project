/**
 * D&D 5e (2014) - Magic Armor
 * 
 * This content is derived from the System Reference Document and is
 * released under the Open Gaming License v1.0a.
 * 
 * Source: SRD 5.1
 * License: OGL v1.0a
 */

export interface MagicArmor {
  id: string;
  name: string;
  description: string;
  system: 'dnd-5e-2014';
  source: { book: string; page: number };
  type: 'armor';
  rarity: 'common' | 'uncommon' | 'rare' | 'very-rare' | 'legendary' | 'artifact';
  requiresAttunement: boolean;
  armorType: string;
  bonusToAC?: number;
  specialProperties?: string[];
  version: string;
}

export const magicArmor: MagicArmor[] = [
  {
    id: 'armor-plus-1',
    name: 'Armor +1',
    description: 'You have a +1 bonus to AC while you wear this armor.',
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 152 },
    type: 'armor',
    rarity: 'rare',
    requiresAttunement: false,
    armorType: 'any',
    bonusToAC: 1,
    version: '1.0.0',
  },
  {
    id: 'armor-plus-2',
    name: 'Armor +2',
    description: 'You have a +2 bonus to AC while you wear this armor.',
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 152 },
    type: 'armor',
    rarity: 'very-rare',
    requiresAttunement: false,
    armorType: 'any',
    bonusToAC: 2,
    version: '1.0.0',
  },
  {
    id: 'armor-plus-3',
    name: 'Armor +3',
    description: 'You have a +3 bonus to AC while you wear this armor.',
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 152 },
    type: 'armor',
    rarity: 'legendary',
    requiresAttunement: false,
    armorType: 'any',
    bonusToAC: 3,
    version: '1.0.0',
  },
  {
    id: 'shield-plus-1',
    name: 'Shield +1',
    description: 'While holding this shield, you have a +1 bonus to AC. This bonus is in addition to the shield\'s normal bonus to AC.',
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 200 },
    type: 'armor',
    rarity: 'uncommon',
    requiresAttunement: false,
    armorType: 'shield',
    bonusToAC: 1,
    version: '1.0.0',
  },
  {
    id: 'shield-plus-2',
    name: 'Shield +2',
    description: 'While holding this shield, you have a +2 bonus to AC. This bonus is in addition to the shield\'s normal bonus to AC.',
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 200 },
    type: 'armor',
    rarity: 'rare',
    requiresAttunement: false,
    armorType: 'shield',
    bonusToAC: 2,
    version: '1.0.0',
  },
  {
    id: 'shield-plus-3',
    name: 'Shield +3',
    description: 'While holding this shield, you have a +3 bonus to AC. This bonus is in addition to the shield\'s normal bonus to AC.',
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 200 },
    type: 'armor',
    rarity: 'very-rare',
    requiresAttunement: false,
    armorType: 'shield',
    bonusToAC: 3,
    version: '1.0.0',
  },
  {
    id: 'armor-of-resistance',
    name: 'Armor of Resistance',
    description: 'You have resistance to one type of damage while you wear this armor. The GM chooses the type or determines it randomly from the options: acid, cold, fire, force, lightning, necrotic, poison, psychic, radiant, or thunder.',
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 152 },
    type: 'armor',
    rarity: 'rare',
    requiresAttunement: true,
    armorType: 'any',
    specialProperties: ['Resistance to one damage type'],
    version: '1.0.0',
  },
  {
    id: 'armor-of-invulnerability',
    name: 'Armor of Invulnerability',
    description: 'You have resistance to nonmagical damage while you wear this armor. Additionally, you can use an action to make yourself immune to nonmagical damage for 10 minutes or until you are no longer wearing the armor. Once this special action is used, it can\'t be used again until the next dawn.',
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 152 },
    type: 'armor',
    rarity: 'legendary',
    requiresAttunement: true,
    armorType: 'plate',
    specialProperties: ['Resistance to nonmagical damage', 'Immunity 10 min/day'],
    version: '1.0.0',
  },
  {
    id: 'demon-armor',
    name: 'Demon Armor',
    description: 'While wearing this armor, you gain a +1 bonus to AC, and you can understand and speak Abyssal. In addition, the armor\'s clawed gauntlets turn unarmed strikes with your hands into magic weapons that deal slashing damage, with a +1 bonus to attack rolls and damage rolls and a damage die of 1d8. Curse: Once you don this cursed armor, you can\'t doff it unless you are targeted by the remove curse spell or similar magic. While wearing the armor, you have disadvantage on attack rolls against demons and on saving throws against their spells and special abilities.',
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 162 },
    type: 'armor',
    rarity: 'very-rare',
    requiresAttunement: true,
    armorType: 'plate',
    bonusToAC: 1,
    specialProperties: ['Speak Abyssal', 'Clawed gauntlets 1d8+1', 'Cursed'],
    version: '1.0.0',
  },
  {
    id: 'dragon-scale-mail',
    name: 'Dragon Scale Mail',
    description: 'Dragon scale mail is made of the scales of one kind of dragon. Sometimes dragons collect their cast-off scales and gift them to humanoids. Other times, hunters carefully skin and preserve the hide of a dead dragon. In either case, dragon scale mail is highly valued. While wearing this armor, you gain a +1 bonus to AC, you have advantage on saving throws against the Frightful Presence and breath weapons of dragons, and you have resistance to one damage type that is determined by the kind of dragon that provided the scales (see the table).',
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 165 },
    type: 'armor',
    rarity: 'very-rare',
    requiresAttunement: true,
    armorType: 'scale mail',
    bonusToAC: 1,
    specialProperties: ['Advantage vs dragon abilities', 'Resistance to dragon damage type'],
    version: '1.0.0',
  },
  {
    id: 'mithral-armor',
    name: 'Mithral Armor',
    description: 'Mithral is a light, flexible metal. A mithral chain shirt or breastplate can be worn under normal clothes. If the armor normally imposes disadvantage on Dexterity (Stealth) checks or has a Strength requirement, the mithral version of the armor doesn\'t.',
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 182 },
    type: 'armor',
    rarity: 'uncommon',
    requiresAttunement: false,
    armorType: 'medium or heavy',
    specialProperties: ['No Stealth disadvantage', 'No Strength requirement'],
    version: '1.0.0',
  },
  {
    id: 'adamantine-armor',
    name: 'Adamantine Armor',
    description: 'This suit of armor is reinforced with adamantine, one of the hardest substances in existence. While you\'re wearing it, any critical hit against you becomes a normal hit.',
    system: 'dnd-5e-2014',
    source: { book: 'SRD 5.1', page: 150 },
    type: 'armor',
    rarity: 'uncommon',
    requiresAttunement: false,
    armorType: 'medium or heavy',
    specialProperties: ['Critical hits become normal hits'],
    version: '1.0.0',
  },
];
