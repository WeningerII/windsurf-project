/**
 * Pathfinder 1e Combat Feats - Core Rulebook
 * 
 * This content is derived from the System Reference Document and is
 * released under the Open Gaming License v1.0a.
 * 
 * Source: Pathfinder 1e SRD (d20pfsrd.com)
 * License: OGL v1.0a
 */

import { FeatDefinition } from '../../../../types/character-options/feats';

export const agileManeuvers: FeatDefinition = {
  id: 'agile-maneuvers-pf1e', name: 'Agile Maneuvers', system: 'pf1e', source: 'CRB',
  description: 'You learned to use your quickness in place of brute force when performing combat maneuvers.',
  benefits: ['You add your Dexterity bonus to your base attack bonus and size bonus when determining your Combat Maneuver Bonus instead of your Strength bonus'],
};

export const arcaneStrike: FeatDefinition = {
  id: 'arcane-strike-pf1e', name: 'Arcane Strike', system: 'pf1e', source: 'CRB',
  prerequisites: [{ type: 'other', description: 'Ability to cast arcane spells' }],
  description: 'You draw upon your arcane power to enhance your weapons with magical energy.',
  benefits: ['As a swift action, you can imbue your weapons with a fraction of your power. For 1 round, your weapons deal +1 damage and are treated as magic for overcoming DR'],
};

export const blindFight: FeatDefinition = {
  id: 'blind-fight-pf1e', name: 'Blind-Fight', system: 'pf1e', source: 'CRB',
  description: 'You are skilled at attacking opponents that you cannot clearly perceive.',
  benefits: ['In melee, every time you miss because of concealment, you can reroll your miss chance once', 'Invisible attackers get no advantages related to hitting you in melee', 'You take only half the usual penalty to speed for being unable to see'],
};

export const cleave: FeatDefinition = {
  id: 'cleave-pf1e', name: 'Cleave', system: 'pf1e', source: 'CRB',
  prerequisites: [{ type: 'ability', ability: 'str', value: 13 }, { type: 'other', description: 'Power Attack, base attack bonus +1' }],
  description: 'You can strike two adjacent foes with a single swing.',
  benefits: ['As a standard action, you can make a single attack at your full base attack bonus against a foe within reach. If you hit, you deal damage normally and can make an additional attack against a foe adjacent to the first'],
};

export const combatCasting: FeatDefinition = {
  id: 'combat-casting-pf1e', name: 'Combat Casting', system: 'pf1e', source: 'CRB',
  description: 'You are adept at spellcasting when threatened or distracted.',
  benefits: ['+4 bonus on concentration checks made to cast a spell or use a spell-like ability when casting on the defensive or while grappled'],
};

export const combatExpertise: FeatDefinition = {
  id: 'combat-expertise-pf1e', name: 'Combat Expertise', system: 'pf1e', source: 'CRB',
  prerequisites: [{ type: 'ability', ability: 'int', value: 13 }],
  description: 'You can increase your defense at the expense of your accuracy.',
  benefits: ['You can choose to take a –1 penalty on melee attack rolls and combat maneuver checks to gain a +1 dodge bonus to your Armor Class. When your base attack bonus reaches +4 and every +4 thereafter, the penalty increases by –1 and the dodge bonus increases by +1'],
};

export const combatReflexes: FeatDefinition = {
  id: 'combat-reflexes-pf1e', name: 'Combat Reflexes', system: 'pf1e', source: 'CRB',
  description: 'You can make additional attacks of opportunity.',
  benefits: ['You may make a number of additional attacks of opportunity per round equal to your Dexterity bonus', 'You can make attacks of opportunity while flat-footed'],
};

export const criticalFocus: FeatDefinition = {
  id: 'critical-focus-pf1e', name: 'Critical Focus', system: 'pf1e', source: 'CRB',
  prerequisites: [{ type: 'other', description: 'Base attack bonus +9' }],
  description: 'You are trained in the art of causing pain.',
  benefits: ['+4 circumstance bonus on attack rolls made to confirm critical hits'],
};

export const deadlyAim: FeatDefinition = {
  id: 'deadly-aim-pf1e', name: 'Deadly Aim', system: 'pf1e', source: 'CRB',
  prerequisites: [{ type: 'ability', ability: 'dex', value: 13 }, { type: 'other', description: 'Base attack bonus +1' }],
  description: 'You can make exceptionally deadly ranged attacks by pinpointing a foe\'s weak spot.',
  benefits: ['You can choose to take a –1 penalty on all ranged attack rolls to gain a +2 bonus on all ranged damage rolls. When your base attack bonus reaches +4 and every +4 thereafter, the penalty increases by –1 and the bonus to damage increases by +2'],
};

export const defensiveCombatTraining: FeatDefinition = {
  id: 'defensive-combat-training-pf1e', name: 'Defensive Combat Training', system: 'pf1e', source: 'CRB',
  description: 'You excel at defending yourself from all manner of combat maneuvers.',
  benefits: ['You treat your total Hit Dice as your base attack bonus for the purpose of calculating your Combat Maneuver Defense'],
};

export const dodge: FeatDefinition = {
  id: 'dodge-pf1e', name: 'Dodge', system: 'pf1e', source: 'CRB',
  prerequisites: [{ type: 'ability', ability: 'dex', value: 13 }],
  description: 'Your training and reflexes allow you to react swiftly to avoid an opponent\'s attacks.',
  benefits: ['+1 dodge bonus to AC'],
};

export const doubleSlice: FeatDefinition = {
  id: 'double-slice-pf1e', name: 'Double Slice', system: 'pf1e', source: 'CRB',
  prerequisites: [{ type: 'ability', ability: 'dex', value: 15 }, { type: 'other', description: 'Two-Weapon Fighting' }],
  description: 'Your off-hand weapon while dual-wielding strikes with greater power.',
  benefits: ['Add your Strength bonus to damage rolls made with your off-hand weapon'],
};

export const endurance: FeatDefinition = {
  id: 'endurance-pf1e', name: 'Endurance', system: 'pf1e', source: 'CRB',
  description: 'Harsh conditions or long exertions do not easily tire you.',
  benefits: ['+4 bonus on checks and saves to avoid nonlethal damage from forced marches, starvation, thirst, hot or cold environments', 'May sleep in light or medium armor without becoming fatigued'],
};

export const greatCleave: FeatDefinition = {
  id: 'great-cleave-pf1e', name: 'Great Cleave', system: 'pf1e', source: 'CRB',
  prerequisites: [{ type: 'ability', ability: 'str', value: 13 }, { type: 'other', description: 'Cleave, Power Attack, base attack bonus +4' }],
  description: 'You can strike many adjacent foes with a single blow.',
  benefits: ['As a full-round action, you can make a single attack at your full base attack bonus against a foe within reach. If you hit, you deal damage normally and can make an additional attack against a foe adjacent to the previous target'],
};

export const greatFortitude: FeatDefinition = {
  id: 'great-fortitude-pf1e', name: 'Great Fortitude', system: 'pf1e', source: 'CRB',
  description: 'You are resistant to poisons, diseases, and other maladies.',
  benefits: ['+2 bonus on all Fortitude saving throws'],
};

export const improvedCritical: FeatDefinition = {
  id: 'improved-critical-pf1e', name: 'Improved Critical', system: 'pf1e', source: 'CRB',
  prerequisites: [{ type: 'other', description: 'Proficient with weapon, base attack bonus +8' }],
  description: 'Attacks made with your chosen weapon are quite deadly.',
  benefits: ['The threat range for your chosen weapon is doubled'],
};

export const improvedInitiative: FeatDefinition = {
  id: 'improved-initiative-pf1e', name: 'Improved Initiative', system: 'pf1e', source: 'CRB',
  description: 'Your quick reflexes allow you to react rapidly to danger.',
  benefits: ['+4 bonus on initiative checks'],
};

export const improvedUnarmedStrike: FeatDefinition = {
  id: 'improved-unarmed-strike-pf1e', name: 'Improved Unarmed Strike', system: 'pf1e', source: 'CRB',
  description: 'You are skilled at fighting while unarmed.',
  benefits: ['You are considered to be armed even when unarmed', 'Your unarmed strikes can deal lethal or nonlethal damage'],
};

export const intimidatingProwess: FeatDefinition = {
  id: 'intimidating-prowess-pf1e', name: 'Intimidating Prowess', system: 'pf1e', source: 'CRB',
  description: 'Your physical might is intimidating to others.',
  benefits: ['Add your Strength modifier to Intimidate skill checks in addition to your Charisma modifier'],
};

export const ironWill: FeatDefinition = {
  id: 'iron-will-pf1e', name: 'Iron Will', system: 'pf1e', source: 'CRB',
  description: 'You are more resistant to mental effects.',
  benefits: ['+2 bonus on all Will saving throws'],
};

export const lightningReflexes: FeatDefinition = {
  id: 'lightning-reflexes-pf1e', name: 'Lightning Reflexes', system: 'pf1e', source: 'CRB',
  description: 'You have faster reflexes than normal.',
  benefits: ['+2 bonus on all Reflex saving throws'],
};

export const mobility: FeatDefinition = {
  id: 'mobility-pf1e', name: 'Mobility', system: 'pf1e', source: 'CRB',
  prerequisites: [{ type: 'ability', ability: 'dex', value: 13 }, { type: 'other', description: 'Dodge' }],
  description: 'You can easily move through a dangerous melee.',
  benefits: ['+4 dodge bonus to Armor Class against attacks of opportunity caused when you move out of or within a threatened area'],
};

export const mountedCombat: FeatDefinition = {
  id: 'mounted-combat-pf1e', name: 'Mounted Combat', system: 'pf1e', source: 'CRB',
  prerequisites: [{ type: 'other', description: 'Ride 1 rank' }],
  description: 'You are adept at guiding your mount through combat.',
  benefits: ['Once per round when your mount is hit in combat, you may attempt a Ride check to negate the hit'],
};

export const pointBlankShot: FeatDefinition = {
  id: 'point-blank-shot-pf1e', name: 'Point-Blank Shot', system: 'pf1e', source: 'CRB',
  description: 'You are especially accurate when making ranged attacks against close targets.',
  benefits: ['+1 bonus on attack and damage rolls with ranged weapons at ranges of up to 30 feet'],
};

export const powerAttack: FeatDefinition = {
  id: 'power-attack-pf1e', name: 'Power Attack', system: 'pf1e', source: 'CRB',
  prerequisites: [{ type: 'ability', ability: 'str', value: 13 }, { type: 'other', description: 'Base attack bonus +1' }],
  description: 'You can make exceptionally deadly melee attacks by sacrificing accuracy for strength.',
  benefits: ['You can choose to take a –1 penalty on all melee attack rolls and combat maneuver checks to gain a +2 bonus on all melee damage rolls. When your base attack bonus reaches +4 and every 4 points thereafter, the penalty increases by –1 and the bonus to damage increases by +2'],
};

export const preciseShot: FeatDefinition = {
  id: 'precise-shot-pf1e', name: 'Precise Shot', system: 'pf1e', source: 'CRB',
  prerequisites: [{ type: 'other', description: 'Point-Blank Shot' }],
  description: 'You are adept at firing ranged attacks into melee.',
  benefits: ['You can shoot or throw ranged weapons at an opponent engaged in melee without taking the standard –4 penalty on your attack roll'],
};

export const quickDraw: FeatDefinition = {
  id: 'quick-draw-pf1e', name: 'Quick Draw', system: 'pf1e', source: 'CRB',
  prerequisites: [{ type: 'other', description: 'Base attack bonus +1' }],
  description: 'You can draw weapons faster than most.',
  benefits: ['You can draw a weapon as a free action instead of as a move action', 'You can draw a hidden weapon as a move action'],
};

export const rapidShot: FeatDefinition = {
  id: 'rapid-shot-pf1e', name: 'Rapid Shot', system: 'pf1e', source: 'CRB',
  prerequisites: [{ type: 'ability', ability: 'dex', value: 13 }, { type: 'other', description: 'Point-Blank Shot' }],
  description: 'You can make an additional ranged attack.',
  benefits: ['When making a full-attack action with a ranged weapon, you can fire one additional time this round. All of your attack rolls take a –2 penalty when using Rapid Shot'],
};

export const run: FeatDefinition = {
  id: 'run-pf1e', name: 'Run', system: 'pf1e', source: 'CRB',
  description: 'You are swift of foot.',
  benefits: ['When running, you move five times your normal speed instead of four times', '+4 bonus on Acrobatics checks made to jump'],
};

export const shieldFocus: FeatDefinition = {
  id: 'shield-focus-pf1e', name: 'Shield Focus', system: 'pf1e', source: 'CRB',
  prerequisites: [{ type: 'other', description: 'Shield Proficiency, base attack bonus +1' }],
  description: 'You are skilled at deflecting blows with your shield.',
  benefits: ['Increase the AC bonus granted by any shield you are using by 1'],
};

export const stepUp: FeatDefinition = {
  id: 'step-up-pf1e', name: 'Step Up', system: 'pf1e', source: 'CRB',
  prerequisites: [{ type: 'other', description: 'Base attack bonus +1' }],
  description: 'You can close the distance when a foe tries to move away.',
  benefits: ['Whenever an adjacent foe attempts to take a 5-foot step away from you, you may also take a 5-foot step as an immediate action so long as you end up adjacent to the foe'],
};

export const stunningFist: FeatDefinition = {
  id: 'stunning-fist-pf1e', name: 'Stunning Fist', system: 'pf1e', source: 'CRB',
  prerequisites: [{ type: 'ability', ability: 'dex', value: 13 }, { type: 'ability', ability: 'wis', value: 13 }, { type: 'other', description: 'Improved Unarmed Strike, base attack bonus +8' }],
  description: 'You know just where to strike to temporarily stun a foe.',
  benefits: ['You must declare that you are using this feat before you make your attack roll. On a successful hit, the target must succeed on a Fortitude save or be stunned for 1 round'],
};

export const toughness: FeatDefinition = {
  id: 'toughness-pf1e', name: 'Toughness', system: 'pf1e', source: 'CRB',
  description: 'You have enhanced physical stamina.',
  benefits: ['+3 hit points, +1 hit point per Hit Die beyond 3'],
};

export const twoWeaponFighting: FeatDefinition = {
  id: 'two-weapon-fighting-pf1e', name: 'Two-Weapon Fighting', system: 'pf1e', source: 'CRB',
  prerequisites: [{ type: 'ability', ability: 'dex', value: 15 }],
  description: 'You can fight with a weapon in each of your hands.',
  benefits: ['Your penalties on attack rolls for fighting with two weapons are reduced. The penalty for your primary hand lessens by 2 and the one for your off hand lessens by 6'],
};

export const vitalStrike: FeatDefinition = {
  id: 'vital-strike-pf1e', name: 'Vital Strike', system: 'pf1e', source: 'CRB',
  prerequisites: [{ type: 'other', description: 'Base attack bonus +6' }],
  description: 'You make a single attack that deals significantly more damage than normal.',
  benefits: ['When you use the attack action, you can make one attack at your highest base attack bonus that deals additional damage. Roll the weapon\'s damage dice for the attack twice and add the results together before adding bonuses from Strength, weapon abilities, precision-based damage, and other damage bonuses'],
};

export const weaponFinesse: FeatDefinition = {
  id: 'weapon-finesse-pf1e', name: 'Weapon Finesse', system: 'pf1e', source: 'CRB',
  description: 'You are trained in using your agility in melee combat, as opposed to brute strength.',
  benefits: ['With a light weapon, rapier, whip, or spiked chain made for a creature of your size category, you may use your Dexterity modifier instead of your Strength modifier on attack rolls'],
};

export const weaponFocus: FeatDefinition = {
  id: 'weapon-focus-pf1e', name: 'Weapon Focus', system: 'pf1e', source: 'CRB',
  prerequisites: [{ type: 'other', description: 'Proficiency with selected weapon, base attack bonus +1' }],
  description: 'You are especially good at using your chosen weapon.',
  benefits: ['+1 bonus on all attack rolls you make using the selected weapon'],
};

export const weaponSpecialization: FeatDefinition = {
  id: 'weapon-specialization-pf1e', name: 'Weapon Specialization', system: 'pf1e', source: 'CRB',
  prerequisites: [{ type: 'other', description: 'Weapon Focus with selected weapon, fighter level 4' }],
  description: 'You deal extra damage when using your chosen weapon.',
  benefits: ['+2 bonus on all damage rolls you make using the selected weapon'],
};

export const whirlwindAttack: FeatDefinition = {
  id: 'whirlwind-attack-pf1e', name: 'Whirlwind Attack', system: 'pf1e', source: 'CRB',
  prerequisites: [{ type: 'ability', ability: 'dex', value: 13 }, { type: 'ability', ability: 'int', value: 13 }, { type: 'other', description: 'Combat Expertise, Dodge, Mobility, Spring Attack, base attack bonus +4' }],
  description: 'You can strike out at every foe within reach.',
  benefits: ['When you use a full-round action to make a melee attack, you can give up your regular attacks and instead make one melee attack at your highest base attack bonus against each opponent within reach'],
};

export const improvedDisarm: FeatDefinition = {
  id: 'improved-disarm-pf1e', name: 'Improved Disarm', system: 'pf1e', source: 'CRB',
  prerequisites: [{ type: 'other', description: 'Combat Expertise, Intelligence 13' }],
  description: 'You do not provoke attacks of opportunity when disarming.',
  benefits: ['Do not provoke attacks of opportunity when attempting to disarm an opponent', '+2 bonus on checks made to disarm a foe'],
};

export const improvedGrapple: FeatDefinition = {
  id: 'improved-grapple-pf1e', name: 'Improved Grapple', system: 'pf1e', source: 'CRB',
  prerequisites: [{ type: 'other', description: 'Improved Unarmed Strike, Dexterity 13' }],
  description: 'You do not provoke attacks of opportunity when grappling.',
  benefits: ['Do not provoke attacks of opportunity when attempting to grapple an opponent', '+2 bonus on checks made to grapple a foe'],
};

export const improvedTrip: FeatDefinition = {
  id: 'improved-trip-pf1e', name: 'Improved Trip', system: 'pf1e', source: 'CRB',
  prerequisites: [{ type: 'other', description: 'Combat Expertise, Intelligence 13' }],
  description: 'You do not provoke attacks of opportunity when tripping.',
  benefits: ['Do not provoke attacks of opportunity when attempting to trip an opponent', '+2 bonus on checks made to trip a foe'],
};

export const improvedTwoWeaponFighting: FeatDefinition = {
  id: 'improved-two-weapon-fighting-pf1e', name: 'Improved Two-Weapon Fighting', system: 'pf1e', source: 'CRB',
  prerequisites: [{ type: 'ability', ability: 'dex', value: 17 }, { type: 'other', description: 'Two-Weapon Fighting, base attack bonus +6' }],
  description: 'You can make an additional attack with your off-hand weapon.',
  benefits: ['Make a second attack with off-hand weapon at -5 penalty'],
};

export const greaterTwoWeaponFighting: FeatDefinition = {
  id: 'greater-two-weapon-fighting-pf1e', name: 'Greater Two-Weapon Fighting', system: 'pf1e', source: 'CRB',
  prerequisites: [{ type: 'ability', ability: 'dex', value: 19 }, { type: 'other', description: 'Improved Two-Weapon Fighting, base attack bonus +11' }],
  description: 'You can make a third attack with your off-hand weapon.',
  benefits: ['Make a third attack with off-hand weapon at -10 penalty'],
};

export const improvedShieldBash: FeatDefinition = {
  id: 'improved-shield-bash-pf1e', name: 'Improved Shield Bash', system: 'pf1e', source: 'CRB',
  prerequisites: [{ type: 'other', description: 'Shield Proficiency' }],
  description: 'You can bash with your shield and retain full AC.',
  benefits: ['Retain full shield AC bonus when shield bashing'],
};

export const springAttack: FeatDefinition = {
  id: 'spring-attack-pf1e', name: 'Spring Attack', system: 'pf1e', source: 'CRB',
  prerequisites: [{ type: 'ability', ability: 'dex', value: 13 }, { type: 'other', description: 'Dodge, Mobility, base attack bonus +4' }],
  description: 'You can move before and after attacking.',
  benefits: ['Move before and after making a melee attack without provoking attacks of opportunity from the target'],
};

export const manyshot: FeatDefinition = {
  id: 'manyshot-pf1e', name: 'Manyshot', system: 'pf1e', source: 'CRB',
  prerequisites: [{ type: 'ability', ability: 'dex', value: 15 }, { type: 'other', description: 'Point-Blank Shot, Rapid Shot, base attack bonus +6' }],
  description: 'You can fire multiple arrows at once.',
  benefits: ['Fire two arrows at a single target as a standard action, taking the highest attack roll for both'],
};

export const combatFeats: FeatDefinition[] = [
  agileManeuvers, arcaneStrike, blindFight, cleave, combatCasting, combatExpertise,
  combatReflexes, criticalFocus, deadlyAim, defensiveCombatTraining, dodge, doubleSlice,
  endurance, greatCleave, greatFortitude, improvedCritical, improvedInitiative,
  improvedUnarmedStrike, intimidatingProwess, ironWill, lightningReflexes, mobility,
  mountedCombat, pointBlankShot, powerAttack, preciseShot, quickDraw, rapidShot, run,
  shieldFocus, stepUp, stunningFist, toughness, twoWeaponFighting,
  vitalStrike, weaponFinesse, weaponFocus, weaponSpecialization, whirlwindAttack,
  improvedDisarm, improvedGrapple, improvedTrip, improvedTwoWeaponFighting,
  greaterTwoWeaponFighting, improvedShieldBash, springAttack, manyshot,
];
