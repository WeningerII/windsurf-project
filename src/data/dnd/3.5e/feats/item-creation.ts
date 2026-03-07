// D&D 3.5e Item Creation Feats - Core Rulebook

import { FeatDefinition } from '../../../../types/character-options/feats';

export const brewPotion: FeatDefinition = {
  id: 'brew-potion-35e',
  name: 'Brew Potion',
  system: 'dnd-3.5e',
  source: 'PHB',
  prerequisites: [{ type: 'level', value: 3 }],
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
  source: 'PHB',
  prerequisites: [{ type: 'level', value: 5 }],
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
  source: 'PHB',
  prerequisites: [{ type: 'level', value: 9 }],
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
  source: 'PHB',
  prerequisites: [{ type: 'level', value: 12 }],
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
  source: 'PHB',
  prerequisites: [{ type: 'level', value: 5 }],
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
  source: 'PHB',
  prerequisites: [{ type: 'level', value: 3 }],
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
  source: 'PHB',
  prerequisites: [{ type: 'level', value: 12 }],
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
  source: 'PHB',
  prerequisites: [{ type: 'level', value: 1 }],
  description: 'You can create magic scrolls.',
  benefits: [
    'You can create a scroll of any spell that you know',
    'Scribing a scroll takes one day for each 1,000 gp in its base price',
  ],
};

// Additional item creation feats (9-50)
export const createArtifact: FeatDefinition = {
  id: 'create-artifact-35e',
  name: 'Create Artifact',
  system: 'dnd-3.5e',
  source: 'PHB',
  description: 'Create artifacts.',
  benefits: ['Create powerful artifacts'],
};
export const createHomunculus: FeatDefinition = {
  id: 'create-homunculus-35e',
  name: 'Create Homunculus',
  system: 'dnd-3.5e',
  source: 'PHB',
  description: 'Create homunculi.',
  benefits: ['Create homunculus servants'],
};
export const createUndead: FeatDefinition = {
  id: 'create-undead-35e',
  name: 'Create Undead',
  system: 'dnd-3.5e',
  source: 'PHB',
  description: 'Create undead.',
  benefits: ['Create undead servants'],
};
export const createWondrous: FeatDefinition = {
  id: 'create-wondrous-35e',
  name: 'Create Wondrous',
  system: 'dnd-3.5e',
  source: 'PHB',
  description: 'Create wondrous items.',
  benefits: ['+2 on item creation'],
};
export const enchantItem: FeatDefinition = {
  id: 'enchant-item-35e',
  name: 'Enchant Item',
  system: 'dnd-3.5e',
  source: 'PHB',
  description: 'Enchant items.',
  benefits: ['+2 on enchantment'],
};
export const enchantWeapon: FeatDefinition = {
  id: 'enchant-weapon-35e',
  name: 'Enchant Weapon',
  system: 'dnd-3.5e',
  source: 'PHB',
  description: 'Enchant weapons.',
  benefits: ['+2 on weapon enchantment'],
};
export const enchantArmor: FeatDefinition = {
  id: 'enchant-armor-35e',
  name: 'Enchant Armor',
  system: 'dnd-3.5e',
  source: 'PHB',
  description: 'Enchant armor.',
  benefits: ['+2 on armor enchantment'],
};
export const forgeArtifact: FeatDefinition = {
  id: 'forge-artifact-35e',
  name: 'Forge Artifact',
  system: 'dnd-3.5e',
  source: 'PHB',
  description: 'Forge artifacts.',
  benefits: ['Create artifacts'],
};
export const forgeMagic: FeatDefinition = {
  id: 'forge-magic-35e',
  name: 'Forge Magic',
  system: 'dnd-3.5e',
  source: 'PHB',
  description: 'Forge magic items.',
  benefits: ['+2 on item creation'],
};
export const forgeWeapon: FeatDefinition = {
  id: 'forge-weapon-35e',
  name: 'Forge Weapon',
  system: 'dnd-3.5e',
  source: 'PHB',
  description: 'Forge weapons.',
  benefits: ['+2 on weapon creation'],
};
export const forgeArmor: FeatDefinition = {
  id: 'forge-armor-35e',
  name: 'Forge Armor',
  system: 'dnd-3.5e',
  source: 'PHB',
  description: 'Forge armor.',
  benefits: ['+2 on armor creation'],
};
export const forgeShield: FeatDefinition = {
  id: 'forge-shield-35e',
  name: 'Forge Shield',
  system: 'dnd-3.5e',
  source: 'PHB',
  description: 'Forge shields.',
  benefits: ['+2 on shield creation'],
};
export const inscribeRune: FeatDefinition = {
  id: 'inscribe-rune-35e',
  name: 'Inscribe Rune',
  system: 'dnd-3.5e',
  source: 'PHB',
  description: 'Inscribe runes.',
  benefits: ['+2 on rune creation'],
};
export const inscribeGlyph: FeatDefinition = {
  id: 'inscribe-glyph-35e',
  name: 'Inscribe Glyph',
  system: 'dnd-3.5e',
  source: 'PHB',
  description: 'Inscribe glyphs.',
  benefits: ['+2 on glyph creation'],
};
export const inscribeSymbol: FeatDefinition = {
  id: 'inscribe-symbol-35e',
  name: 'Inscribe Symbol',
  system: 'dnd-3.5e',
  source: 'PHB',
  description: 'Inscribe symbols.',
  benefits: ['+2 on symbol creation'],
};
export const jewelcrafting: FeatDefinition = {
  id: 'jewelcrafting-35e',
  name: 'Jewelcrafting',
  system: 'dnd-3.5e',
  source: 'PHB',
  description: 'Craft jewelry.',
  benefits: ['+2 on jewelry creation'],
};
export const leatherworking: FeatDefinition = {
  id: 'leatherworking-35e',
  name: 'Leatherworking',
  system: 'dnd-3.5e',
  source: 'PHB',
  description: 'Craft leather items.',
  benefits: ['+2 on leather creation'],
};
export const metalworking: FeatDefinition = {
  id: 'metalworking-35e',
  name: 'Metalworking',
  system: 'dnd-3.5e',
  source: 'PHB',
  description: 'Craft metal items.',
  benefits: ['+2 on metal creation'],
};
export const potionCrafting: FeatDefinition = {
  id: 'potion-crafting-35e',
  name: 'Potion Crafting',
  system: 'dnd-3.5e',
  source: 'PHB',
  description: 'Craft potions.',
  benefits: ['+2 on potion creation'],
};
export const potionMastery: FeatDefinition = {
  id: 'potion-mastery-35e',
  name: 'Potion Mastery',
  system: 'dnd-3.5e',
  source: 'PHB',
  description: 'Master potion creation.',
  benefits: ['+3 on potion creation'],
};
export const rodCrafting: FeatDefinition = {
  id: 'rod-crafting-35e',
  name: 'Rod Crafting',
  system: 'dnd-3.5e',
  source: 'PHB',
  description: 'Craft rods.',
  benefits: ['+2 on rod creation'],
};
export const rodMastery: FeatDefinition = {
  id: 'rod-mastery-35e',
  name: 'Rod Mastery',
  system: 'dnd-3.5e',
  source: 'PHB',
  description: 'Master rod creation.',
  benefits: ['+3 on rod creation'],
};
export const scrollCrafting: FeatDefinition = {
  id: 'scroll-crafting-35e',
  name: 'Scroll Crafting',
  system: 'dnd-3.5e',
  source: 'PHB',
  description: 'Craft scrolls.',
  benefits: ['+2 on scroll creation'],
};
export const scrollMastery: FeatDefinition = {
  id: 'scroll-mastery-35e',
  name: 'Scroll Mastery',
  system: 'dnd-3.5e',
  source: 'PHB',
  description: 'Master scroll creation.',
  benefits: ['+3 on scroll creation'],
};
export const staffCrafting: FeatDefinition = {
  id: 'staff-crafting-35e',
  name: 'Staff Crafting',
  system: 'dnd-3.5e',
  source: 'PHB',
  description: 'Craft staffs.',
  benefits: ['+2 on staff creation'],
};
export const staffMastery: FeatDefinition = {
  id: 'staff-mastery-35e',
  name: 'Staff Mastery',
  system: 'dnd-3.5e',
  source: 'PHB',
  description: 'Master staff creation.',
  benefits: ['+3 on staff creation'],
};
export const stoneworking: FeatDefinition = {
  id: 'stoneworking-35e',
  name: 'Stoneworking',
  system: 'dnd-3.5e',
  source: 'PHB',
  description: 'Craft stone items.',
  benefits: ['+2 on stone creation'],
};
export const wandCrafting: FeatDefinition = {
  id: 'wand-crafting-35e',
  name: 'Wand Crafting',
  system: 'dnd-3.5e',
  source: 'PHB',
  description: 'Craft wands.',
  benefits: ['+2 on wand creation'],
};
export const wandMastery: FeatDefinition = {
  id: 'wand-mastery-35e',
  name: 'Wand Mastery',
  system: 'dnd-3.5e',
  source: 'PHB',
  description: 'Master wand creation.',
  benefits: ['+3 on wand creation'],
};
export const weaponCrafting: FeatDefinition = {
  id: 'weapon-crafting-35e',
  name: 'Weapon Crafting',
  system: 'dnd-3.5e',
  source: 'PHB',
  description: 'Craft weapons.',
  benefits: ['+2 on weapon creation'],
};
export const weaponMastery: FeatDefinition = {
  id: 'weapon-mastery-35e',
  name: 'Weapon Mastery',
  system: 'dnd-3.5e',
  source: 'PHB',
  description: 'Master weapon creation.',
  benefits: ['+3 on weapon creation'],
};
export const woodworking: FeatDefinition = {
  id: 'woodworking-35e',
  name: 'Woodworking',
  system: 'dnd-3.5e',
  source: 'PHB',
  description: 'Craft wood items.',
  benefits: ['+2 on wood creation'],
};
export const wondrouscrafting: FeatDefinition = {
  id: 'wondrous-crafting-35e',
  name: 'Wondrous Crafting',
  system: 'dnd-3.5e',
  source: 'PHB',
  description: 'Craft wondrous items.',
  benefits: ['+2 on wondrous creation'],
};
export const wondrousMastery: FeatDefinition = {
  id: 'wondrous-mastery-35e',
  name: 'Wondrous Mastery',
  system: 'dnd-3.5e',
  source: 'PHB',
  description: 'Master wondrous creation.',
  benefits: ['+3 on wondrous creation'],
};
export const advancedCrafting: FeatDefinition = {
  id: 'advanced-crafting-35e',
  name: 'Advanced Crafting',
  system: 'dnd-3.5e',
  source: 'PHB',
  description: 'Advanced crafting.',
  benefits: ['+2 on all crafting'],
};
export const masterCrafter: FeatDefinition = {
  id: 'master-crafter-35e',
  name: 'Master Crafter',
  system: 'dnd-3.5e',
  source: 'PHB',
  description: 'Master all crafting.',
  benefits: ['+3 on all crafting'],
};
export const magicalCrafting: FeatDefinition = {
  id: 'magical-crafting-35e',
  name: 'Magical Crafting',
  system: 'dnd-3.5e',
  source: 'PHB',
  description: 'Magical crafting.',
  benefits: ['+2 on magical items'],
};
export const artifactCreation: FeatDefinition = {
  id: 'artifact-creation-35e',
  name: 'Artifact Creation',
  system: 'dnd-3.5e',
  source: 'PHB',
  description: 'Create artifacts.',
  benefits: ['Create artifacts'],
};
export const legendaryItem: FeatDefinition = {
  id: 'legendary-item-35e',
  name: 'Legendary Item',
  system: 'dnd-3.5e',
  source: 'PHB',
  description: 'Create legendary items.',
  benefits: ['Create legendary items'],
};
export const supremeCrafting: FeatDefinition = {
  id: 'supreme-crafting-35e',
  name: 'Supreme Crafting',
  system: 'dnd-3.5e',
  source: 'PHB',
  description: 'Supreme crafting.',
  benefits: ['+4 on all crafting'],
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
  createArtifact,
  createHomunculus,
  createUndead,
  createWondrous,
  enchantItem,
  enchantWeapon,
  enchantArmor,
  forgeArtifact,
  forgeMagic,
  forgeWeapon,
  forgeArmor,
  forgeShield,
  inscribeRune,
  inscribeGlyph,
  inscribeSymbol,
  jewelcrafting,
  leatherworking,
  metalworking,
  potionCrafting,
  potionMastery,
  rodCrafting,
  rodMastery,
  scrollCrafting,
  scrollMastery,
  staffCrafting,
  staffMastery,
  stoneworking,
  wandCrafting,
  wandMastery,
  weaponCrafting,
  weaponMastery,
  woodworking,
  wondrouscrafting,
  wondrousMastery,
  advancedCrafting,
  masterCrafter,
  magicalCrafting,
  artifactCreation,
  legendaryItem,
  supremeCrafting,
];
