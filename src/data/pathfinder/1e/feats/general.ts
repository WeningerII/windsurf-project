/**
 * Pathfinder 1e General Feats - Core Rulebook
 * 
 * This content is derived from the System Reference Document and is
 * released under the Open Gaming License v1.0a.
 * 
 * Source: Pathfinder 1e SRD (d20pfsrd.com)
 * License: OGL v1.0a
 */

import { FeatDefinition } from '../../../../types/character-options/feats';

export const acrobatic: FeatDefinition = {
  id: 'acrobatic-pf1e', name: 'Acrobatic', system: 'pf1e', source: 'CRB',
  description: 'You are skilled at leaping, jumping, and flying.',
  benefits: ['+2 bonus on Acrobatics checks', '+2 bonus on Fly checks', 'If you have 10 or more ranks in one of these skills, the bonus increases to +4 for that skill'],
};

export const alertness: FeatDefinition = {
  id: 'alertness-pf1e', name: 'Alertness', system: 'pf1e', source: 'CRB',
  description: 'You often notice things that others might miss.',
  benefits: ['+2 bonus on Perception checks', '+2 bonus on Sense Motive checks', 'If you have 10 or more ranks in one of these skills, the bonus increases to +4 for that skill'],
};

export const animalAffinity: FeatDefinition = {
  id: 'animal-affinity-pf1e', name: 'Animal Affinity', system: 'pf1e', source: 'CRB',
  description: 'You are skilled at working with animals and mounts.',
  benefits: ['+2 bonus on Handle Animal checks', '+2 bonus on Ride checks', 'If you have 10 or more ranks in one of these skills, the bonus increases to +4 for that skill'],
};

export const armorProficiencyLight: FeatDefinition = {
  id: 'armor-proficiency-light-pf1e', name: 'Armor Proficiency (Light)', system: 'pf1e', source: 'CRB',
  proficienciesGranted: { armor: ['light armor'] },
  description: 'You are skilled at wearing light armor.',
  benefits: ['When you wear a type of armor with which you are proficient, the armor check penalty for that armor applies only to Dexterity- and Strength-based skill checks'],
};

export const armorProficiencyMedium: FeatDefinition = {
  id: 'armor-proficiency-medium-pf1e', name: 'Armor Proficiency (Medium)', system: 'pf1e', source: 'CRB',
  prerequisites: [{ type: 'other', description: 'Light Armor Proficiency' }],
  proficienciesGranted: { armor: ['medium armor'] },
  description: 'You are skilled at wearing medium armor.',
  benefits: ['When you wear a type of armor with which you are proficient, the armor check penalty for that armor applies only to Dexterity- and Strength-based skill checks'],
};

export const armorProficiencyHeavy: FeatDefinition = {
  id: 'armor-proficiency-heavy-pf1e', name: 'Armor Proficiency (Heavy)', system: 'pf1e', source: 'CRB',
  prerequisites: [{ type: 'other', description: 'Light Armor Proficiency, Medium Armor Proficiency' }],
  proficienciesGranted: { armor: ['heavy armor'] },
  description: 'You are skilled at wearing heavy armor.',
  benefits: ['When you wear a type of armor with which you are proficient, the armor check penalty for that armor applies only to Dexterity- and Strength-based skill checks'],
};

export const athletic: FeatDefinition = {
  id: 'athletic-pf1e', name: 'Athletic', system: 'pf1e', source: 'CRB',
  description: 'You possess inherent physical prowess.',
  benefits: ['+2 bonus on Climb checks', '+2 bonus on Swim checks', 'If you have 10 or more ranks in one of these skills, the bonus increases to +4 for that skill'],
};

export const brewPotion: FeatDefinition = {
  id: 'brew-potion-pf1e', name: 'Brew Potion', system: 'pf1e', source: 'CRB',
  prerequisites: [{ type: 'level', value: 3 }],
  description: 'You can create magic potions.',
  benefits: ['You can create a potion of any 3rd-level or lower spell that you know and that targets one or more creatures or objects', 'Brewing a potion takes 2 hours if its base price is 250 gp or less, otherwise it takes 1 day for each 1,000 gp in its base price'],
};

export const craftMagicArmsAndArmor: FeatDefinition = {
  id: 'craft-magic-arms-and-armor-pf1e', name: 'Craft Magic Arms and Armor', system: 'pf1e', source: 'CRB',
  prerequisites: [{ type: 'level', value: 5 }],
  description: 'You can create magic armor, shields, and weapons.',
  benefits: ['You can create magic weapons, armor, or shields', 'Enhancing a weapon, suit of armor, or shield takes 1 day for each 1,000 gp in the price of its magical features'],
};

export const craftRod: FeatDefinition = {
  id: 'craft-rod-pf1e', name: 'Craft Rod', system: 'pf1e', source: 'CRB',
  prerequisites: [{ type: 'level', value: 9 }],
  description: 'You can create magic rods.',
  benefits: ['You can create magic rods', 'Crafting a rod takes 1 day for each 1,000 gp in its base price'],
};

export const craftStaff: FeatDefinition = {
  id: 'craft-staff-pf1e', name: 'Craft Staff', system: 'pf1e', source: 'CRB',
  prerequisites: [{ type: 'level', value: 11 }],
  description: 'You can create magic staffs.',
  benefits: ['You can create any staff whose prerequisites you meet', 'Crafting a staff takes 1 day for each 1,000 gp in its base price'],
};

export const craftWand: FeatDefinition = {
  id: 'craft-wand-pf1e', name: 'Craft Wand', system: 'pf1e', source: 'CRB',
  prerequisites: [{ type: 'level', value: 5 }],
  description: 'You can create magic wands.',
  benefits: ['You can create a wand of any 4th-level or lower spell that you know', 'Crafting a wand takes 1 day for each 1,000 gp in its base price'],
};

export const craftWondrousItem: FeatDefinition = {
  id: 'craft-wondrous-item-pf1e', name: 'Craft Wondrous Item', system: 'pf1e', source: 'CRB',
  prerequisites: [{ type: 'level', value: 3 }],
  description: 'You can create wondrous items, a type of magic item.',
  benefits: ['You can create a wide variety of magic wondrous items', 'Crafting a wondrous item takes 1 day for each 1,000 gp in its price'],
};

export const deceitful: FeatDefinition = {
  id: 'deceitful-pf1e', name: 'Deceitful', system: 'pf1e', source: 'CRB',
  description: 'You are skilled at deceiving others, both with the spoken word and with physical disguises.',
  benefits: ['+2 bonus on Bluff checks', '+2 bonus on Disguise checks', 'If you have 10 or more ranks in one of these skills, the bonus increases to +4 for that skill'],
};

export const deftHands: FeatDefinition = {
  id: 'deft-hands-pf1e', name: 'Deft Hands', system: 'pf1e', source: 'CRB',
  description: 'You have exceptional manual dexterity.',
  benefits: ['+2 bonus on Disable Device checks', '+2 bonus on Sleight of Hand checks', 'If you have 10 or more ranks in one of these skills, the bonus increases to +4 for that skill'],
};

export const forgeRing: FeatDefinition = {
  id: 'forge-ring-pf1e', name: 'Forge Ring', system: 'pf1e', source: 'CRB',
  prerequisites: [{ type: 'level', value: 7 }],
  description: 'You can create magic rings.',
  benefits: ['You can create magic rings', 'Crafting a ring takes 1 day for each 1,000 gp in its base price'],
};

export const improvedCounterspell: FeatDefinition = {
  id: 'improved-counterspell-pf1e', name: 'Improved Counterspell', system: 'pf1e', source: 'CRB',
  description: 'You are skilled at countering the spells of others using similar spells.',
  benefits: ['When counterspelling, you may use a spell of the same school that is one or more spell levels higher than the target spell'],
};

export const leadership: FeatDefinition = {
  id: 'leadership-pf1e', name: 'Leadership', system: 'pf1e', source: 'CRB',
  prerequisites: [{ type: 'level', value: 7 }],
  description: 'You attract followers to your cause and a companion to join you on your adventures.',
  benefits: ['You attract a cohort and a number of followers based on your Leadership score'],
};

export const magicalAptitude: FeatDefinition = {
  id: 'magical-aptitude-pf1e', name: 'Magical Aptitude', system: 'pf1e', source: 'CRB',
  description: 'You are skilled at spellcasting and using magic items.',
  benefits: ['+2 bonus on Spellcraft checks', '+2 bonus on Use Magic Device checks', 'If you have 10 or more ranks in one of these skills, the bonus increases to +4 for that skill'],
};

export const naturalSpell: FeatDefinition = {
  id: 'natural-spell-pf1e', name: 'Natural Spell', system: 'pf1e', source: 'CRB',
  prerequisites: [{ type: 'ability', ability: 'wis', value: 13 }, { type: 'other', description: 'Wild shape class feature' }],
  description: 'You can cast spells even while in a form that cannot normally cast spells.',
  benefits: ['You can complete the verbal and somatic components of spells while using wild shape'],
};

export const negotiator: FeatDefinition = {
  id: 'negotiator-pf1e', name: 'Negotiator', system: 'pf1e', source: 'CRB',
  description: 'You are good at gauging and swaying attitudes.',
  benefits: ['+2 bonus on Diplomacy checks', '+2 bonus on Sense Motive checks', 'If you have 10 or more ranks in one of these skills, the bonus increases to +4 for that skill'],
};

export const persuasive: FeatDefinition = {
  id: 'persuasive-pf1e', name: 'Persuasive', system: 'pf1e', source: 'CRB',
  description: 'You are skilled at swaying attitudes and intimidating others into your way of thinking.',
  benefits: ['+2 bonus on Diplomacy checks', '+2 bonus on Intimidate checks', 'If you have 10 or more ranks in one of these skills, the bonus increases to +4 for that skill'],
};

export const scribeScroll: FeatDefinition = {
  id: 'scribe-scroll-pf1e', name: 'Scribe Scroll', system: 'pf1e', source: 'CRB',
  prerequisites: [{ type: 'level', value: 1 }],
  description: 'You can create magic scrolls.',
  benefits: ['You can create a scroll of any spell that you know', 'Scribing a scroll takes 2 hours if its base price is 250 gp or less, otherwise it takes 1 day for each 1,000 gp in its base price'],
};

export const selfSufficient: FeatDefinition = {
  id: 'self-sufficient-pf1e', name: 'Self-Sufficient', system: 'pf1e', source: 'CRB',
  description: 'You know how to get along in the wild and how to effectively treat wounds.',
  benefits: ['+2 bonus on Heal checks', '+2 bonus on Survival checks', 'If you have 10 or more ranks in one of these skills, the bonus increases to +4 for that skill'],
};

export const skillFocus: FeatDefinition = {
  id: 'skill-focus-pf1e', name: 'Skill Focus', system: 'pf1e', source: 'CRB',
  description: 'You are particularly adept at your chosen skill.',
  benefits: ['+3 bonus on all checks involving the chosen skill', 'If you have 10 or more ranks in that skill, this bonus increases to +6'],
};

export const spellFocus: FeatDefinition = {
  id: 'spell-focus-pf1e', name: 'Spell Focus', system: 'pf1e', source: 'CRB',
  description: 'Choose a school of magic. Any spells you cast of that school are more difficult to resist.',
  benefits: ['+1 bonus to the Difficulty Class for all saving throws against spells from the school of magic you select'],
};

export const spellPenetration: FeatDefinition = {
  id: 'spell-penetration-pf1e', name: 'Spell Penetration', system: 'pf1e', source: 'CRB',
  description: 'Your spells break through spell resistance more easily than most.',
  benefits: ['+2 bonus on caster level checks made to overcome a creature\'s spell resistance'],
};

export const stealthy: FeatDefinition = {
  id: 'stealthy-pf1e', name: 'Stealthy', system: 'pf1e', source: 'CRB',
  description: 'You are good at avoiding attention and slipping out of bonds.',
  benefits: ['+2 bonus on Escape Artist checks', '+2 bonus on Stealth checks', 'If you have 10 or more ranks in one of these skills, the bonus increases to +4 for that skill'],
};

export const greaterSpellFocus: FeatDefinition = {
  id: 'greater-spell-focus-pf1e', name: 'Greater Spell Focus', system: 'pf1e', source: 'CRB',
  prerequisites: [{ type: 'other', description: 'Spell Focus' }],
  description: 'Your spells are significantly more difficult to resist.',
  benefits: ['+1 additional bonus to spell DC for spells of your chosen school (total +2 with Spell Focus)'],
};

export const greaterSpellPenetration: FeatDefinition = {
  id: 'greater-spell-penetration-pf1e', name: 'Greater Spell Penetration', system: 'pf1e', source: 'CRB',
  prerequisites: [{ type: 'other', description: 'Spell Penetration' }],
  description: 'Your spells penetrate spell resistance much more easily.',
  benefits: ['+2 additional bonus to caster level checks to overcome spell resistance (total +4 with Spell Penetration)'],
};

export const generalFeats: FeatDefinition[] = [
  acrobatic, alertness, animalAffinity, armorProficiencyLight, armorProficiencyMedium,
  armorProficiencyHeavy, athletic, brewPotion, craftMagicArmsAndArmor, craftRod,
  craftStaff, craftWand, craftWondrousItem, deceitful, deftHands, forgeRing,
  improvedCounterspell, leadership, magicalAptitude, naturalSpell, negotiator,
  persuasive, scribeScroll, selfSufficient, skillFocus, spellFocus,
  spellPenetration, stealthy,
  greaterSpellFocus, greaterSpellPenetration,
];
