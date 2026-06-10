// D&D 3.5e Item Creation Feats — SRD 3.5 only.
//
// 40 fabricated filler entries ("Potion Mastery", "Cheese..."-grade fillers)
// were purged; only the eight SRD 3.5 item creation feats remain, re-cited as
// 'SRD 3.5'.

import { FeatDefinition } from '../../../../types/character-options/feats';

export const brewPotion: FeatDefinition = {
  id: 'brew-potion-35e',
  name: 'Brew Potion',
  system: 'dnd-3.5e',
  source: 'SRD 3.5',
  prerequisites: [{ type: 'other', description: 'Caster level 3rd' }],
  description: 'You can create magic potions.',
  benefits: [
    'You can create a potion of any 3rd-level or lower spell that you know and that targets one or more creatures',
    'Brewing a potion takes one day for each 1,000 gp in its base price',
  ],
};

export const craftMagicArmsAndArmor: FeatDefinition = {
  id: 'craft-magic-arms-and-armor-35e',
  name: 'Craft Magic Arms and Armor',
  system: 'dnd-3.5e',
  source: 'SRD 3.5',
  prerequisites: [{ type: 'other', description: 'Caster level 5th' }],
  description: 'You can create magic armor, shields, and weapons.',
  benefits: [
    'You can create any magic weapon, armor, or shield whose prerequisites you meet',
    'Crafting a magic weapon, suit of armor, or shield takes one day for each 1,000 gp in its base price',
  ],
};

export const craftRod: FeatDefinition = {
  id: 'craft-rod-35e',
  name: 'Craft Rod',
  system: 'dnd-3.5e',
  source: 'SRD 3.5',
  prerequisites: [{ type: 'other', description: 'Caster level 9th' }],
  description: 'You can create magic rods.',
  benefits: [
    'You can create any rod whose prerequisites you meet',
    'Crafting a rod takes one day for each 1,000 gp in its base price',
  ],
};

export const craftStaff: FeatDefinition = {
  id: 'craft-staff-35e',
  name: 'Craft Staff',
  system: 'dnd-3.5e',
  source: 'SRD 3.5',
  prerequisites: [{ type: 'other', description: 'Caster level 12th' }],
  description: 'You can create magic staffs.',
  benefits: [
    'You can create any staff whose prerequisites you meet',
    'Crafting a staff takes one day for each 1,000 gp in its base price',
  ],
};

export const craftWand: FeatDefinition = {
  id: 'craft-wand-35e',
  name: 'Craft Wand',
  system: 'dnd-3.5e',
  source: 'SRD 3.5',
  prerequisites: [{ type: 'other', description: 'Caster level 5th' }],
  description: 'You can create magic wands.',
  benefits: [
    'You can create a wand of any 4th-level or lower spell that you know',
    'Crafting a wand takes one day for each 1,000 gp in its base price',
  ],
};

export const craftWondrousItem: FeatDefinition = {
  id: 'craft-wondrous-item-35e',
  name: 'Craft Wondrous Item',
  system: 'dnd-3.5e',
  source: 'SRD 3.5',
  prerequisites: [{ type: 'other', description: 'Caster level 3rd' }],
  description: 'You can create wondrous magic items.',
  benefits: [
    'You can create any wondrous item whose prerequisites you meet',
    'Crafting a wondrous item takes one day for each 1,000 gp in its base price',
  ],
};

export const forgeRing: FeatDefinition = {
  id: 'forge-ring-35e',
  name: 'Forge Ring',
  system: 'dnd-3.5e',
  source: 'SRD 3.5',
  prerequisites: [{ type: 'other', description: 'Caster level 12th' }],
  description: 'You can create magic rings.',
  benefits: [
    'You can create any ring whose prerequisites you meet',
    'Forging a ring takes one day for each 1,000 gp in its base price',
  ],
};

export const scribeScroll: FeatDefinition = {
  id: 'scribe-scroll-35e',
  name: 'Scribe Scroll',
  system: 'dnd-3.5e',
  source: 'SRD 3.5',
  prerequisites: [{ type: 'other', description: 'Caster level 1st' }],
  description: 'You can create magic scrolls.',
  benefits: [
    'You can create a scroll of any spell that you know',
    'Scribing a scroll takes one day for each 1,000 gp in its base price',
  ],
};

export const itemCreationFeats: FeatDefinition[] = [
  brewPotion,
  craftMagicArmsAndArmor,
  craftRod,
  craftStaff,
  craftWand,
  craftWondrousItem,
  forgeRing,
  scribeScroll,
];
