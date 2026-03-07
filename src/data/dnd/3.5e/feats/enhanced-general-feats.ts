// D&D 3.5e Enhanced General Feats with Detailed Mechanics
// SRD-compliant general feats with comprehensive descriptions

import { FeatDefinition } from '../../../../types/character-options/feats';

export const toughness: FeatDefinition = {
  id: 'toughness-35e',
  name: 'Toughness',
  system: 'dnd-3.5e',
  source: 'SRD',
  prerequisites: [],
  description: 'You are tougher than normal.',
  benefits: [
    'You gain +3 hit points',
    'Special: A character may gain this feat multiple times. Its effects stack',
  ],
};

export const improvedUnarmedStrike: FeatDefinition = {
  id: 'improved-unarmed-strike-35e',
  name: 'Improved Unarmed Strike',
  system: 'dnd-3.5e',
  source: 'SRD',
  prerequisites: [],
  description: 'You are skilled at fighting while unarmed.',
  benefits: [
    'You are considered to be armed even when unarmed—that is, you do not provoke attacks of opportunity from armed opponents when you attack them while unarmed',
    'However, you still get an attack of opportunity against any opponent who makes an unarmed attack on you',
    'In addition, your unarmed strikes can deal lethal or nonlethal damage, at your option',
    'Normal: Without this feat, you are considered unarmed when attacking with an unarmed strike, and you can deal only nonlethal damage with such an attack',
  ],
};

export const dodge: FeatDefinition = {
  id: 'dodge-35e',
  name: 'Dodge',
  system: 'dnd-3.5e',
  source: 'SRD',
  prerequisites: [{ type: 'ability', ability: 'dex', value: 13 }],
  description: 'You are adept at dodging blows.',
  benefits: [
    'During your action, you designate an opponent and receive a +1 dodge bonus to Armor Class against attacks from that opponent',
    'You can select a new opponent on any action',
    'A condition that makes you lose your Dexterity bonus to Armor Class (if any) also makes you lose dodge bonuses',
    'Dodge bonuses stack with each other, unlike most other types of bonuses',
  ],
};

export const mobility: FeatDefinition = {
  id: 'mobility-35e',
  name: 'Mobility',
  system: 'dnd-3.5e',
  source: 'SRD',
  prerequisites: [
    { type: 'ability', ability: 'dex', value: 13 },
    { type: 'other', description: 'Dodge' },
  ],
  description: 'You are skilled at dodging past opponents and avoiding blows.',
  benefits: [
    'You get a +4 dodge bonus to Armor Class against attacks of opportunity caused when you move out of or within a threatened area',
    'A condition that makes you lose your Dexterity bonus to Armor Class (if any) also makes you lose dodge bonuses',
    'Dodge bonuses stack with each other',
  ],
};

export const springAttack: FeatDefinition = {
  id: 'spring-attack-35e',
  name: 'Spring Attack',
  system: 'dnd-3.5e',
  source: 'SRD',
  prerequisites: [
    { type: 'ability', ability: 'dex', value: 13 },
    { type: 'other', description: 'Dodge, Mobility, base attack bonus +4' },
  ],
  description: 'You are trained in fast melee attacks and fancy footwork.',
  benefits: [
    'When using the attack action with a melee weapon, you can move both before and after the attack, provided that your total distance moved is not greater than your speed',
    'Moving in this way does not provoke an attack of opportunity from the defender you attack, though it might provoke attacks of opportunity from other creatures, if appropriate',
    "You can't use this feat if you are wearing heavy armor",
    'You must move at least 5 feet both before and after you make your attack in order to utilize the benefits of Spring Attack',
  ],
};

export const leadership: FeatDefinition = {
  id: 'leadership-35e',
  name: 'Leadership',
  system: 'dnd-3.5e',
  source: 'SRD',
  prerequisites: [{ type: 'other', description: 'Character level 6th' }],
  description: 'You are a leader of men.',
  benefits: [
    'You can attract loyal companions and devoted followers, subordinates who assist you',
    "See the leadership rules in the Dungeon Master's Guide for details on your Leadership score and how many followers you can attract",
  ],
};

export const runFeat: FeatDefinition = {
  id: 'run-35e',
  name: 'Run',
  system: 'dnd-3.5e',
  source: 'SRD',
  prerequisites: [],
  description: 'You are fleet of foot.',
  benefits: [
    'When running, you move five times your normal speed (if wearing medium, light, or no armor and carrying no more than a medium load) or four times your speed (if wearing heavy armor or carrying a heavy load)',
    'If you make a jump after a running start, you gain a +4 bonus on your Jump check',
    'While running, you retain your Dexterity bonus to AC',
    'Normal: You move four times your speed while running (if wearing medium, light, or no armor and carrying no more than a medium load) or three times your speed (if wearing heavy armor or carrying a heavy load), and you lose your Dexterity bonus to AC',
  ],
};

export const greatFortitude: FeatDefinition = {
  id: 'great-fortitude-35e',
  name: 'Great Fortitude',
  system: 'dnd-3.5e',
  source: 'SRD',
  prerequisites: [],
  description: 'You are tougher than normal.',
  benefits: ['You get a +2 bonus on all Fortitude saving throws'],
};

export const ironWill: FeatDefinition = {
  id: 'iron-will-35e',
  name: 'Iron Will',
  system: 'dnd-3.5e',
  source: 'SRD',
  prerequisites: [],
  description: 'You have a stronger will than normal.',
  benefits: ['You get a +2 bonus on all Will saving throws'],
};

export const lightningReflexes: FeatDefinition = {
  id: 'lightning-reflexes-35e',
  name: 'Lightning Reflexes',
  system: 'dnd-3.5e',
  source: 'SRD',
  prerequisites: [],
  description: 'You have faster reflexes than normal.',
  benefits: ['You get a +2 bonus on all Reflex saving throws'],
};

export const skillFocus: FeatDefinition = {
  id: 'skill-focus-35e',
  name: 'Skill Focus',
  system: 'dnd-3.5e',
  source: 'SRD',
  prerequisites: [],
  description: 'You are particularly adept at a certain skill.',
  benefits: [
    'Choose a skill. You get a +3 bonus on all checks involving that skill',
    'Special: You can gain this feat multiple times. Its effects do not stack. Each time you take the feat, it applies to a new skill',
  ],
};

export const spellFocus: FeatDefinition = {
  id: 'spell-focus-35e',
  name: 'Spell Focus',
  system: 'dnd-3.5e',
  source: 'SRD',
  prerequisites: [],
  description: 'Your spells of a certain school are more potent than normal.',
  benefits: [
    'Choose a school of magic. Add +1 to the Difficulty Class for all saving throws against spells from the school of magic you select',
    'Special: You can gain this feat multiple times. Its effects do not stack. Each time you take the feat, it applies to a new school of magic',
  ],
};

export const dnd35eEnhancedGeneralFeats: FeatDefinition[] = [
  toughness,
  improvedUnarmedStrike,
  dodge,
  mobility,
  springAttack,
  leadership,
  runFeat,
  greatFortitude,
  ironWill,
  lightningReflexes,
  skillFocus,
  spellFocus,
];
