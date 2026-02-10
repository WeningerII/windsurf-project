// D&D 3.5e Combat Feats

import { FeatDefinition } from '../../../../types/character-options/feats';

export const ambidexterity: FeatDefinition = {
  id: 'ambidexterity-35e',
  name: 'Ambidexterity',
  system: 'dnd-3.5e',
  source: 'PHB',
  description: 'You are equally adept with both hands.',
  benefits: ['You can fight with a weapon in each hand without penalty'],
};

export const armorMastery: FeatDefinition = {
  id: 'armor-mastery-35e',
  name: 'Armor Mastery',
  system: 'dnd-3.5e',
  source: 'PHB',
  prerequisites: [{ type: 'other', description: 'Armor Proficiency (Heavy)' }],
  description: 'You are skilled at using heavy armor.',
  benefits: ['Reduce armor check penalty by 1', '+1 bonus to AC when wearing heavy armor'],
};

export const backstab: FeatDefinition = {
  id: 'backstab-35e',
  name: 'Backstab',
  system: 'dnd-3.5e',
  source: 'PHB',
  prerequisites: [{ type: 'other', description: 'Sneak Attack' }],
  description: 'You know how to strike a foe when they are vulnerable.',
  benefits: ['Your sneak attack damage increases by 1d6'],
};

export const beastMastery: FeatDefinition = {
  id: 'beast-mastery-35e',
  name: 'Beast Mastery',
  system: 'dnd-3.5e',
  source: 'PHB',
  prerequisites: [{ type: 'ability', ability: 'wis', value: 13 }],
  description: 'You have a way with animals.',
  benefits: ['+2 bonus on Handle Animal checks', '+2 bonus on Ride checks'],
};

export const berserkRage: FeatDefinition = {
  id: 'berserk-rage-35e',
  name: 'Berserk Rage',
  system: 'dnd-3.5e',
  source: 'PHB',
  prerequisites: [{ type: 'other', description: 'Rage class feature' }],
  description: 'You can enter a more powerful rage.',
  benefits: ['While raging, gain +4 to Strength instead of +2', 'Gain +2 to Will saves instead of +1'],
};

export const bladeMastery: FeatDefinition = {
  id: 'blade-mastery-35e',
  name: 'Blade Mastery',
  system: 'dnd-3.5e',
  source: 'PHB',
  prerequisites: [{ type: 'other', description: 'Weapon Focus (any blade)' }],
  description: 'You are a master of blade weapons.',
  benefits: ['+1 bonus on attack rolls with blade weapons', '+1 bonus on damage rolls with blade weapons'],
};

export const blastAttack: FeatDefinition = {
  id: 'blast-attack-35e',
  name: 'Blast Attack',
  system: 'dnd-3.5e',
  source: 'PHB',
  prerequisites: [{ type: 'other', description: 'Eldritch Blast' }],
  description: 'Your eldritch blast is more powerful.',
  benefits: ['Your eldritch blast deals +1d6 damage'],
};

export const blindFightMastery: FeatDefinition = {
  id: 'blind-fight-mastery-35e',
  name: 'Blind Fight Mastery',
  system: 'dnd-3.5e',
  source: 'PHB',
  prerequisites: [{ type: 'other', description: 'Blind-Fight' }],
  description: 'You are an expert at fighting without sight.',
  benefits: ['You can fight normally even if blinded', 'You gain blindsight out to 30 feet'],
};

export const bonusHitPoints: FeatDefinition = {
  id: 'bonus-hit-points-35e',
  name: 'Bonus Hit Points',
  system: 'dnd-3.5e',
  source: 'PHB',
  description: 'You have more hit points than normal.',
  benefits: ['+3 hit points'],
};

export const bowMastery: FeatDefinition = {
  id: 'bow-mastery-35e',
  name: 'Bow Mastery',
  system: 'dnd-3.5e',
  source: 'PHB',
  prerequisites: [{ type: 'other', description: 'Weapon Focus (any bow)' }],
  description: 'You are a master of bow weapons.',
  benefits: ['+1 bonus on attack rolls with bows', '+1 bonus on damage rolls with bows'],
};

export const brawler: FeatDefinition = {
  id: 'brawler-35e',
  name: 'Brawler',
  system: 'dnd-3.5e',
  source: 'PHB',
  prerequisites: [{ type: 'other', description: 'Improved Unarmed Strike' }],
  description: 'You are skilled at unarmed combat.',
  benefits: ['Your unarmed strike damage increases by 1d4', '+2 bonus on grapple checks'],
};

export const breakFall: FeatDefinition = {
  id: 'break-fall-35e',
  name: 'Break Fall',
  system: 'dnd-3.5e',
  source: 'PHB',
  prerequisites: [{ type: 'ability', ability: 'dex', value: 13 }],
  description: 'You know how to fall safely.',
  benefits: ['Reduce fall damage by 10 feet', '+2 bonus on Acrobatics checks to reduce fall damage'],
};

export const bullRush: FeatDefinition = {
  id: 'bull-rush-35e',
  name: 'Bull Rush',
  system: 'dnd-3.5e',
  source: 'PHB',
  prerequisites: [{ type: 'ability', ability: 'str', value: 13 }],
  description: 'You can knock foes back with your attacks.',
  benefits: ['+2 bonus on bull rush attempts', 'You can bull rush as a free action after a successful melee attack'],
};

export const chainLightning: FeatDefinition = {
  id: 'chain-lightning-35e',
  name: 'Chain Lightning',
  system: 'dnd-3.5e',
  source: 'PHB',
  prerequisites: [{ type: 'other', description: 'Spell Focus (Evocation)' }],
  description: 'Your lightning spells chain to nearby foes.',
  benefits: ['Your lightning spells can chain to nearby enemies', '+1 bonus on damage rolls with lightning spells'],
};

export const cleaveExpert: FeatDefinition = {
  id: 'cleave-expert-35e',
  name: 'Cleave Expert',
  system: 'dnd-3.5e',
  source: 'PHB',
  prerequisites: [{ type: 'other', description: 'Cleave' }],
  description: 'You are an expert at cleaving through multiple foes.',
  benefits: ['You can cleave twice per round', '+1 bonus on cleave attack rolls'],
};

export const combatMastery: FeatDefinition = {
  id: 'combat-mastery-35e',
  name: 'Combat Mastery',
  system: 'dnd-3.5e',
  source: 'PHB',
  prerequisites: [{ type: 'other', description: 'Base attack bonus +6' }],
  description: 'You are a master of combat.',
  benefits: ['+1 bonus on all attack rolls', '+1 bonus on all damage rolls'],
};

export const counterattack: FeatDefinition = {
  id: 'counterattack-35e',
  name: 'Counterattack',
  system: 'dnd-3.5e',
  source: 'PHB',
  prerequisites: [{ type: 'ability', ability: 'dex', value: 13 }],
  description: 'You can attack foes who miss you.',
  benefits: ['When a foe misses you with a melee attack, you can make an attack of opportunity'],
};

export const crushingBlow: FeatDefinition = {
  id: 'crushing-blow-35e',
  name: 'Crushing Blow',
  system: 'dnd-3.5e',
  source: 'PHB',
  prerequisites: [{ type: 'ability', ability: 'str', value: 15 }, { type: 'other', description: 'Power Attack' }],
  description: 'Your melee attacks are devastating.',
  benefits: ['When you use Power Attack, you gain +1d6 damage', '+2 bonus on damage rolls with heavy weapons'],
};

export const defensiveStance: FeatDefinition = {
  id: 'defensive-stance-35e',
  name: 'Defensive Stance',
  system: 'dnd-3.5e',
  source: 'PHB',
  prerequisites: [{ type: 'ability', ability: 'dex', value: 13 }],
  description: 'You can take a defensive stance in combat.',
  benefits: ['+2 bonus to AC when you take a full-round action to defend', '-2 penalty to attack rolls'],
};

export const disarmMastery: FeatDefinition = {
  id: 'disarm-mastery-35e',
  name: 'Disarm Mastery',
  system: 'dnd-3.5e',
  source: 'PHB',
  prerequisites: [{ type: 'ability', ability: 'dex', value: 13 }],
  description: 'You are skilled at disarming opponents.',
  benefits: ['+2 bonus on disarm attempts', 'You can disarm as a free action after a successful melee attack'],
};

export const doubleStrike: FeatDefinition = {
  id: 'double-strike-35e',
  name: 'Double Strike',
  system: 'dnd-3.5e',
  source: 'PHB',
  prerequisites: [{ type: 'other', description: 'Two-Weapon Fighting' }],
  description: 'You can strike with both weapons in quick succession.',
  benefits: ['You can make an extra attack with your off-hand weapon', '+1 bonus on off-hand attack rolls'],
};

export const drainMastery: FeatDefinition = {
  id: 'drain-mastery-35e',
  name: 'Drain Mastery',
  system: 'dnd-3.5e',
  source: 'PHB',
  prerequisites: [{ type: 'other', description: 'Spell Focus (Necromancy)' }],
  description: 'Your drain spells are more powerful.',
  benefits: ['+1 bonus on damage rolls with drain spells', 'Drain spells heal you for half the damage dealt'],
};

export const expertParry: FeatDefinition = {
  id: 'expert-parry-35e',
  name: 'Expert Parry',
  system: 'dnd-3.5e',
  source: 'PHB',
  prerequisites: [{ type: 'ability', ability: 'dex', value: 15 }],
  description: 'You are skilled at parrying attacks.',
  benefits: ['+2 bonus to AC against melee attacks', 'You can parry one attack per round as a free action'],
};

export const feintMastery: FeatDefinition = {
  id: 'feint-mastery-35e',
  name: 'Feint Mastery',
  system: 'dnd-3.5e',
  source: 'PHB',
  prerequisites: [{ type: 'ability', ability: 'int', value: 13 }],
  description: 'You are skilled at feinting in combat.',
  benefits: ['+2 bonus on feint attempts', 'You can feint as a free action against one opponent per round'],
};

export const combatFeats: FeatDefinition[] = [
  ambidexterity,
  armorMastery,
  backstab,
  beastMastery,
  berserkRage,
  bladeMastery,
  blastAttack,
  blindFightMastery,
  bonusHitPoints,
  bowMastery,
  brawler,
  breakFall,
  bullRush,
  chainLightning,
  cleaveExpert,
  combatMastery,
  counterattack,
  crushingBlow,
  defensiveStance,
  disarmMastery,
  doubleStrike,
  drainMastery,
  expertParry,
  feintMastery,
];
