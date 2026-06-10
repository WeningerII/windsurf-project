// D&D 3.5e General Feats — SRD 3.5 only.
//
// This file previously held 335 entries, ~280 of which were fabricated filler
// (invented names mass-labeled 'PHB'). All non-SRD entries were purged; only
// feats verifiable in the 3.5 System Reference Document remain, re-cited as
// 'SRD 3.5'.

import { FeatDefinition } from '../../../../types/character-options/feats';

export const acrobatic: FeatDefinition = {
  id: 'acrobatic-35e',
  name: 'Acrobatic',
  system: 'dnd-3.5e',
  source: 'SRD 3.5',
  description: 'You have excellent body awareness and coordination.',
  benefits: ['+2 bonus on Jump checks', '+2 bonus on Tumble checks'],
};

export const agile: FeatDefinition = {
  id: 'agile-35e',
  name: 'Agile',
  system: 'dnd-3.5e',
  source: 'SRD 3.5',
  description: 'You are particularly dexterous and poised.',
  benefits: ['+2 bonus on Balance checks', '+2 bonus on Escape Artist checks'],
};

export const alertness: FeatDefinition = {
  id: 'alertness-35e',
  name: 'Alertness',
  system: 'dnd-3.5e',
  source: 'SRD 3.5',
  description: 'You have finely tuned senses.',
  benefits: ['+2 bonus on Listen checks', '+2 bonus on Spot checks'],
};

export const animalAffinity: FeatDefinition = {
  id: 'animal-affinity-35e',
  name: 'Animal Affinity',
  system: 'dnd-3.5e',
  source: 'SRD 3.5',
  description: 'You are good with animals.',
  benefits: ['+2 bonus on Handle Animal checks', '+2 bonus on Ride checks'],
};

export const armorProficiencyLight: FeatDefinition = {
  id: 'armor-proficiency-light-35e',
  name: 'Armor Proficiency (Light)',
  system: 'dnd-3.5e',
  source: 'SRD 3.5',
  proficienciesGranted: { armor: ['light armor'] },
  description: 'You are proficient with light armor.',
  benefits: ['No armor check penalty when wearing light armor'],
};

export const armorProficiencyMedium: FeatDefinition = {
  id: 'armor-proficiency-medium-35e',
  name: 'Armor Proficiency (Medium)',
  system: 'dnd-3.5e',
  source: 'SRD 3.5',
  prerequisites: [{ type: 'other', description: 'Armor Proficiency (Light)' }],
  proficienciesGranted: { armor: ['medium armor'] },
  description: 'You are proficient with medium armor.',
  benefits: ['No armor check penalty when wearing medium armor'],
};

export const armorProficiencyHeavy: FeatDefinition = {
  id: 'armor-proficiency-heavy-35e',
  name: 'Armor Proficiency (Heavy)',
  system: 'dnd-3.5e',
  source: 'SRD 3.5',
  prerequisites: [{ type: 'other', description: 'Armor Proficiency (Medium)' }],
  proficienciesGranted: { armor: ['heavy armor'] },
  description: 'You are proficient with heavy armor.',
  benefits: ['No armor check penalty when wearing heavy armor'],
};

export const athletic: FeatDefinition = {
  id: 'athletic-35e',
  name: 'Athletic',
  system: 'dnd-3.5e',
  source: 'SRD 3.5',
  description: 'You have a knack for athletic endeavors.',
  benefits: ['+2 bonus on Climb checks', '+2 bonus on Swim checks'],
};

export const augmentSummoning: FeatDefinition = {
  id: 'augment-summoning-35e',
  name: 'Augment Summoning',
  system: 'dnd-3.5e',
  source: 'SRD 3.5',
  prerequisites: [{ type: 'other', description: 'Spell Focus (conjuration)' }],
  description: 'Your summoned creatures are more powerful than normal.',
  benefits: [
    'Each creature you conjure with any summon spell gains a +4 enhancement bonus to Strength and Constitution',
  ],
};

export const blindFight: FeatDefinition = {
  id: 'blind-fight-35e',
  name: 'Blind-Fight',
  system: 'dnd-3.5e',
  source: 'SRD 3.5',
  description: 'You are skilled at fighting in conditions of poor visibility.',
  benefits: [
    'In melee, every time you miss because of concealment, you can reroll your miss chance',
    'Invisible attackers get no bonus to hit you in melee',
    'You take only half the usual penalty to speed for being unable to see',
  ],
};

export const cleave: FeatDefinition = {
  id: 'cleave-35e',
  name: 'Cleave',
  system: 'dnd-3.5e',
  source: 'SRD 3.5',
  prerequisites: [
    { type: 'ability', ability: 'str', value: 13 },
    { type: 'other', description: 'Power Attack' },
  ],
  description: 'You can follow through with powerful blows.',
  benefits: [
    'If you deal a creature enough damage to make it drop, you get an immediate extra melee attack against another creature within reach',
  ],
};

export const combatCasting: FeatDefinition = {
  id: 'combat-casting-35e',
  name: 'Combat Casting',
  system: 'dnd-3.5e',
  source: 'SRD 3.5',
  description: 'You are adept at casting spells in combat.',
  benefits: [
    '+4 bonus on Concentration checks made to cast a spell or use a spell-like ability while on the defensive or while you are grappling or pinned',
  ],
};

export const combatExpertise: FeatDefinition = {
  id: 'combat-expertise-35e',
  name: 'Combat Expertise',
  system: 'dnd-3.5e',
  source: 'SRD 3.5',
  prerequisites: [{ type: 'ability', ability: 'int', value: 13 }],
  description: 'You are trained at using your combat skill for defense as well as offense.',
  benefits: [
    'When you use the attack action or full attack action in melee, you can take a penalty of up to -5 on your attack roll and add the same number as a dodge bonus to your Armor Class',
  ],
};

export const combatReflexes: FeatDefinition = {
  id: 'combat-reflexes-35e',
  name: 'Combat Reflexes',
  system: 'dnd-3.5e',
  source: 'SRD 3.5',
  description: 'You can respond quickly and repeatedly to opponents who let their defenses down.',
  benefits: [
    'You may make a number of additional attacks of opportunity equal to your Dexterity bonus',
    'You can make attacks of opportunity while flat-footed',
  ],
};

export const deceitful: FeatDefinition = {
  id: 'deceitful-35e',
  name: 'Deceitful',
  system: 'dnd-3.5e',
  source: 'SRD 3.5',
  description: 'You have a talent for misleading others.',
  benefits: ['+2 bonus on Disguise checks', '+2 bonus on Forgery checks'],
};

export const deftHands: FeatDefinition = {
  id: 'deft-hands-35e',
  name: 'Deft Hands',
  system: 'dnd-3.5e',
  source: 'SRD 3.5',
  description: 'You have exceptional manual dexterity.',
  benefits: ['+2 bonus on Sleight of Hand checks', '+2 bonus on Use Rope checks'],
};

export const diligent: FeatDefinition = {
  id: 'diligent-35e',
  name: 'Diligent',
  system: 'dnd-3.5e',
  source: 'SRD 3.5',
  description: 'You are particularly studious and thorough.',
  benefits: ['+2 bonus on Appraise checks', '+2 bonus on Decipher Script checks'],
};

export const dodge: FeatDefinition = {
  id: 'dodge-35e',
  name: 'Dodge',
  system: 'dnd-3.5e',
  source: 'SRD 3.5',
  prerequisites: [{ type: 'ability', ability: 'dex', value: 13 }],
  description: 'You are adept at dodging blows.',
  benefits: [
    'You gain a +1 dodge bonus to your AC against attacks from one opponent that you designate during your action',
  ],
};

export const endurance: FeatDefinition = {
  id: 'endurance-35e',
  name: 'Endurance',
  system: 'dnd-3.5e',
  source: 'SRD 3.5',
  description: 'You are capable of amazing feats of stamina.',
  benefits: [
    '+4 bonus on Swim checks to resist nonlethal damage',
    '+4 bonus on Constitution checks to continue running',
    '+4 bonus on Constitution checks to hold your breath',
    '+4 bonus on Concentration checks to cast spells',
  ],
};

export const greatCleave: FeatDefinition = {
  id: 'great-cleave-35e',
  name: 'Great Cleave',
  system: 'dnd-3.5e',
  source: 'SRD 3.5',
  prerequisites: [
    { type: 'ability', ability: 'str', value: 13 },
    { type: 'other', description: 'Power Attack, Cleave, base attack bonus +4' },
  ],
  description:
    'You can wield a melee weapon with such power that you can strike multiple times when you fell your foes.',
  benefits: [
    'This feat works like Cleave, except that there is no limit to the number of times you can use it per round',
  ],
};

export const greatFortitude: FeatDefinition = {
  id: 'great-fortitude-35e',
  name: 'Great Fortitude',
  system: 'dnd-3.5e',
  source: 'SRD 3.5',
  description: 'You are tougher than normal.',
  benefits: ['+2 bonus on Fortitude saving throws'],
};

export const improvedCritical: FeatDefinition = {
  id: 'improved-critical-35e',
  name: 'Improved Critical',
  system: 'dnd-3.5e',
  source: 'SRD 3.5',
  prerequisites: [{ type: 'other', description: 'Proficient with weapon, base attack bonus +8' }],
  description: 'You know how to hit where it hurts.',
  benefits: ['The threat range for your chosen weapon is doubled'],
};

export const improvedInitiative: FeatDefinition = {
  id: 'improved-initiative-35e',
  name: 'Improved Initiative',
  system: 'dnd-3.5e',
  source: 'SRD 3.5',
  description: 'You can react faster than normal in a fight.',
  benefits: ['+4 bonus on initiative checks'],
};

export const improvedUnarmedStrike: FeatDefinition = {
  id: 'improved-unarmed-strike-35e',
  name: 'Improved Unarmed Strike',
  system: 'dnd-3.5e',
  source: 'SRD 3.5',
  description: 'You are skilled at fighting while unarmed.',
  benefits: [
    'You are considered to be armed even when unarmed',
    'Your unarmed strikes can deal lethal or nonlethal damage',
  ],
};

export const investigator: FeatDefinition = {
  id: 'investigator-35e',
  name: 'Investigator',
  system: 'dnd-3.5e',
  source: 'SRD 3.5',
  description: 'You have a knack for finding information.',
  benefits: ['+2 bonus on Gather Information checks', '+2 bonus on Search checks'],
};

export const ironWill: FeatDefinition = {
  id: 'iron-will-35e',
  name: 'Iron Will',
  system: 'dnd-3.5e',
  source: 'SRD 3.5',
  description: 'You have a stronger will than normal.',
  benefits: ['+2 bonus on Will saving throws'],
};

export const leadership: FeatDefinition = {
  id: 'leadership-35e',
  name: 'Leadership',
  system: 'dnd-3.5e',
  source: 'SRD 3.5',
  prerequisites: [{ type: 'level', value: 6 }],
  description: 'You are a natural leader.',
  benefits: ['You attract a cohort and followers based on your Leadership score'],
};

export const lightningReflexes: FeatDefinition = {
  id: 'lightning-reflexes-35e',
  name: 'Lightning Reflexes',
  system: 'dnd-3.5e',
  source: 'SRD 3.5',
  description: 'You have faster than normal reflexes.',
  benefits: ['+2 bonus on Reflex saving throws'],
};

export const martialWeaponProficiency: FeatDefinition = {
  id: 'martial-weapon-proficiency-35e',
  name: 'Martial Weapon Proficiency',
  system: 'dnd-3.5e',
  source: 'SRD 3.5',
  proficienciesGranted: { weapons: ['one martial weapon'] },
  description: 'You understand how to use a martial weapon in combat.',
  benefits: ['No -4 penalty on attack rolls with chosen martial weapon'],
};

export const mobility: FeatDefinition = {
  id: 'mobility-35e',
  name: 'Mobility',
  system: 'dnd-3.5e',
  source: 'SRD 3.5',
  prerequisites: [
    { type: 'ability', ability: 'dex', value: 13 },
    { type: 'other', description: 'Dodge' },
  ],
  description: 'You are skilled at dodging past opponents and avoiding blows.',
  benefits: [
    '+4 dodge bonus to AC against attacks of opportunity caused when you move out of or within a threatened area',
  ],
};

export const mountedCombat: FeatDefinition = {
  id: 'mounted-combat-35e',
  name: 'Mounted Combat',
  system: 'dnd-3.5e',
  source: 'SRD 3.5',
  prerequisites: [{ type: 'other', description: 'Ride 1 rank' }],
  description: 'You are skilled in mounted combat.',
  benefits: [
    'Once per round when your mount is hit in combat, you may attempt a Ride check to negate the hit',
  ],
};

export const naturalSpell: FeatDefinition = {
  id: 'natural-spell-35e',
  name: 'Natural Spell',
  system: 'dnd-3.5e',
  source: 'SRD 3.5',
  prerequisites: [
    { type: 'ability', ability: 'wis', value: 13 },
    { type: 'other', description: 'Wild Shape ability' },
  ],
  description: 'You can cast spells while in wild shape.',
  benefits: ['You can complete the verbal and somatic components of spells while in wild shape'],
};

export const negotiator: FeatDefinition = {
  id: 'negotiator-35e',
  name: 'Negotiator',
  system: 'dnd-3.5e',
  source: 'SRD 3.5',
  description: 'You are good at gauging and swaying attitudes.',
  benefits: ['+2 bonus on Diplomacy checks', '+2 bonus on Sense Motive checks'],
};

export const nimbleFingers: FeatDefinition = {
  id: 'nimble-fingers-35e',
  name: 'Nimble Fingers',
  system: 'dnd-3.5e',
  source: 'SRD 3.5',
  description: 'You are adept at manipulating small, delicate objects.',
  benefits: ['+2 bonus on Disable Device checks', '+2 bonus on Open Lock checks'],
};

export const persuasive: FeatDefinition = {
  id: 'persuasive-35e',
  name: 'Persuasive',
  system: 'dnd-3.5e',
  source: 'SRD 3.5',
  description: 'You have a way with words and body language.',
  benefits: ['+2 bonus on Bluff checks', '+2 bonus on Intimidate checks'],
};

export const pointBlankShot: FeatDefinition = {
  id: 'point-blank-shot-35e',
  name: 'Point Blank Shot',
  system: 'dnd-3.5e',
  source: 'SRD 3.5',
  description: 'You are skilled at making well-placed shots with ranged weapons at close range.',
  benefits: ['+1 bonus on attack and damage rolls with ranged weapons at ranges of up to 30 feet'],
};

export const powerAttack: FeatDefinition = {
  id: 'power-attack-35e',
  name: 'Power Attack',
  system: 'dnd-3.5e',
  source: 'SRD 3.5',
  prerequisites: [{ type: 'ability', ability: 'str', value: 13 }],
  description: 'You can make exceptionally powerful melee attacks.',
  benefits: [
    'On your action, before making attack rolls for a round, you may choose to subtract up to -5 from all melee attack rolls and add the same number to all melee damage rolls',
  ],
};

export const preciseShot: FeatDefinition = {
  id: 'precise-shot-35e',
  name: 'Precise Shot',
  system: 'dnd-3.5e',
  source: 'SRD 3.5',
  prerequisites: [{ type: 'other', description: 'Point Blank Shot' }],
  description: 'You are skilled at timing and aiming ranged attacks.',
  benefits: [
    'You can shoot or throw ranged weapons at an opponent engaged in melee without taking the standard -4 penalty on your attack roll',
  ],
};

export const quickDraw: FeatDefinition = {
  id: 'quick-draw-35e',
  name: 'Quick Draw',
  system: 'dnd-3.5e',
  source: 'SRD 3.5',
  prerequisites: [{ type: 'other', description: 'Base attack bonus +1' }],
  description: 'You can draw weapons with startling speed.',
  benefits: [
    'You can draw a weapon as a free action instead of as a move action',
    'You can draw a hidden weapon as a move action',
  ],
};

export const rapidShot: FeatDefinition = {
  id: 'rapid-shot-35e',
  name: 'Rapid Shot',
  system: 'dnd-3.5e',
  source: 'SRD 3.5',
  prerequisites: [
    { type: 'ability', ability: 'dex', value: 13 },
    { type: 'other', description: 'Point Blank Shot' },
  ],
  description: 'You can use ranged weapons with exceptional speed.',
  benefits: [
    'When making a full attack action with a ranged weapon, you can fire one additional time this round at your highest bonus. All attack rolls take a -2 penalty',
  ],
};

export const run: FeatDefinition = {
  id: 'run-35e',
  name: 'Run',
  system: 'dnd-3.5e',
  source: 'SRD 3.5',
  description: 'You are fleet of foot.',
  benefits: [
    'When running, you move five times your normal speed instead of four times',
    '+4 bonus on Jump checks made after a running start',
  ],
};

export const selfSufficient: FeatDefinition = {
  id: 'self-sufficient-35e',
  name: 'Self-Sufficient',
  system: 'dnd-3.5e',
  source: 'SRD 3.5',
  description: 'You can take care of yourself in harsh environments and situations.',
  benefits: ['+2 bonus on Heal checks', '+2 bonus on Survival checks'],
};

export const shieldProficiency: FeatDefinition = {
  id: 'shield-proficiency-35e',
  name: 'Shield Proficiency',
  system: 'dnd-3.5e',
  source: 'SRD 3.5',
  proficienciesGranted: { armor: ['shields'] },
  description: 'You are proficient with bucklers, light shields, and heavy shields.',
  benefits: ['No armor check penalty on attack rolls when using a shield'],
};

export const simpleWeaponProficiency: FeatDefinition = {
  id: 'simple-weapon-proficiency-35e',
  name: 'Simple Weapon Proficiency',
  system: 'dnd-3.5e',
  source: 'SRD 3.5',
  proficienciesGranted: { weapons: ['all simple weapons'] },
  description: 'You understand how to use simple weapons in combat.',
  benefits: ['No -4 penalty on attack rolls with simple weapons'],
};

export const skillFocus: FeatDefinition = {
  id: 'skill-focus-35e',
  name: 'Skill Focus',
  system: 'dnd-3.5e',
  source: 'SRD 3.5',
  description: 'You are particularly adept at a certain skill.',
  benefits: ['+3 bonus on all checks involving the chosen skill'],
};

export const spellFocus: FeatDefinition = {
  id: 'spell-focus-35e',
  name: 'Spell Focus',
  system: 'dnd-3.5e',
  source: 'SRD 3.5',
  description: 'Your spells of a particular school are more potent than normal.',
  benefits: [
    '+1 bonus to the Difficulty Class for all saving throws against spells from the school of magic you select',
  ],
};

export const spellPenetration: FeatDefinition = {
  id: 'spell-penetration-35e',
  name: 'Spell Penetration',
  system: 'dnd-3.5e',
  source: 'SRD 3.5',
  description:
    'Your spells are especially potent, breaking through spell resistance more readily than normal.',
  benefits: ["+2 bonus on caster level checks to overcome a creature's spell resistance"],
};

export const stealthy: FeatDefinition = {
  id: 'stealthy-35e',
  name: 'Stealthy',
  system: 'dnd-3.5e',
  source: 'SRD 3.5',
  description: 'You are particularly good at avoiding notice.',
  benefits: ['+2 bonus on Hide checks', '+2 bonus on Move Silently checks'],
};

export const toughness: FeatDefinition = {
  id: 'toughness-35e',
  name: 'Toughness',
  system: 'dnd-3.5e',
  source: 'SRD 3.5',
  description: 'You are tougher than normal.',
  benefits: ['+3 hit points'],
};

export const track: FeatDefinition = {
  id: 'track-35e',
  name: 'Track',
  system: 'dnd-3.5e',
  source: 'SRD 3.5',
  description:
    'You can follow the trails of creatures and characters across most types of terrain.',
  benefits: ['You can use the Survival skill to track creatures'],
};

export const twoWeaponFighting: FeatDefinition = {
  id: 'two-weapon-fighting-35e',
  name: 'Two-Weapon Fighting',
  system: 'dnd-3.5e',
  source: 'SRD 3.5',
  prerequisites: [{ type: 'ability', ability: 'dex', value: 15 }],
  description: 'You can fight with a weapon in each hand.',
  benefits: [
    'Your penalties on attack rolls for fighting with two weapons are reduced by 2 for the primary hand and by 6 for the off hand',
  ],
};

export const weaponFinesse: FeatDefinition = {
  id: 'weapon-finesse-35e',
  name: 'Weapon Finesse',
  system: 'dnd-3.5e',
  source: 'SRD 3.5',
  prerequisites: [{ type: 'other', description: 'Base attack bonus +1' }],
  description: 'You are especially skilled at using a certain light weapon.',
  benefits: [
    'With the selected weapon, you may use your Dexterity modifier instead of your Strength modifier on attack rolls',
  ],
};

export const weaponFocus: FeatDefinition = {
  id: 'weapon-focus-35e',
  name: 'Weapon Focus',
  system: 'dnd-3.5e',
  source: 'SRD 3.5',
  prerequisites: [{ type: 'other', description: 'Proficiency with weapon, base attack bonus +1' }],
  description: 'You are especially good at using a chosen weapon.',
  benefits: ['+1 bonus on all attack rolls you make using the selected weapon'],
};

export const weaponSpecialization: FeatDefinition = {
  id: 'weapon-specialization-35e',
  name: 'Weapon Specialization',
  system: 'dnd-3.5e',
  source: 'SRD 3.5',
  prerequisites: [{ type: 'other', description: 'Weapon Focus with weapon, fighter level 4th' }],
  description: 'You deal extra damage when using a chosen weapon.',
  benefits: ['+2 bonus on all damage rolls you make using the selected weapon'],
};

export const generalFeats: FeatDefinition[] = [
  acrobatic,
  agile,
  alertness,
  animalAffinity,
  armorProficiencyLight,
  armorProficiencyMedium,
  armorProficiencyHeavy,
  athletic,
  augmentSummoning,
  blindFight,
  cleave,
  combatCasting,
  combatExpertise,
  combatReflexes,
  deceitful,
  deftHands,
  diligent,
  dodge,
  endurance,
  greatCleave,
  greatFortitude,
  improvedCritical,
  improvedInitiative,
  improvedUnarmedStrike,
  investigator,
  ironWill,
  leadership,
  lightningReflexes,
  martialWeaponProficiency,
  mobility,
  mountedCombat,
  naturalSpell,
  negotiator,
  nimbleFingers,
  persuasive,
  pointBlankShot,
  powerAttack,
  preciseShot,
  quickDraw,
  rapidShot,
  run,
  selfSufficient,
  shieldProficiency,
  simpleWeaponProficiency,
  skillFocus,
  spellFocus,
  spellPenetration,
  stealthy,
  toughness,
  track,
  twoWeaponFighting,
  weaponFinesse,
  weaponFocus,
  weaponSpecialization,
];
