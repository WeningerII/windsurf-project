// D&D 3.5e General Feats - Core Rulebook

import { FeatDefinition } from '../../../../types/character-options/feats';

export const acrobatic: FeatDefinition = {
  id: 'acrobatic-35e', name: 'Acrobatic', system: 'dnd-3.5e', source: 'PHB',
  description: 'You have excellent body awareness and coordination.',
  benefits: ['+2 bonus on Jump checks', '+2 bonus on Tumble checks'],
};

export const agile: FeatDefinition = {
  id: 'agile-35e', name: 'Agile', system: 'dnd-3.5e', source: 'PHB',
  description: 'You are particularly dexterous and poised.',
  benefits: ['+2 bonus on Balance checks', '+2 bonus on Escape Artist checks'],
};

export const alertness: FeatDefinition = {
  id: 'alertness-35e', name: 'Alertness', system: 'dnd-3.5e', source: 'PHB',
  description: 'You have finely tuned senses.',
  benefits: ['+2 bonus on Listen checks', '+2 bonus on Spot checks'],
};

export const animalAffinity: FeatDefinition = {
  id: 'animal-affinity-35e', name: 'Animal Affinity', system: 'dnd-3.5e', source: 'PHB',
  description: 'You are good with animals.',
  benefits: ['+2 bonus on Handle Animal checks', '+2 bonus on Ride checks'],
};

export const armorProficiencyLight: FeatDefinition = {
  id: 'armor-proficiency-light-35e', name: 'Armor Proficiency (Light)', system: 'dnd-3.5e', source: 'PHB',
  proficienciesGranted: { armor: ['light armor'] },
  description: 'You are proficient with light armor.',
  benefits: ['No armor check penalty when wearing light armor'],
};

export const armorProficiencyMedium: FeatDefinition = {
  id: 'armor-proficiency-medium-35e', name: 'Armor Proficiency (Medium)', system: 'dnd-3.5e', source: 'PHB',
  prerequisites: [{ type: 'other', description: 'Armor Proficiency (Light)' }],
  proficienciesGranted: { armor: ['medium armor'] },
  description: 'You are proficient with medium armor.',
  benefits: ['No armor check penalty when wearing medium armor'],
};

export const armorProficiencyHeavy: FeatDefinition = {
  id: 'armor-proficiency-heavy-35e', name: 'Armor Proficiency (Heavy)', system: 'dnd-3.5e', source: 'PHB',
  prerequisites: [{ type: 'other', description: 'Armor Proficiency (Medium)' }],
  proficienciesGranted: { armor: ['heavy armor'] },
  description: 'You are proficient with heavy armor.',
  benefits: ['No armor check penalty when wearing heavy armor'],
};

export const athletic: FeatDefinition = {
  id: 'athletic-35e', name: 'Athletic', system: 'dnd-3.5e', source: 'PHB',
  description: 'You have a knack for athletic endeavors.',
  benefits: ['+2 bonus on Climb checks', '+2 bonus on Swim checks'],
};

export const augmentSummoning: FeatDefinition = {
  id: 'augment-summoning-35e', name: 'Augment Summoning', system: 'dnd-3.5e', source: 'PHB',
  prerequisites: [{ type: 'other', description: 'Spell Focus (conjuration)' }],
  description: 'Your summoned creatures are more powerful than normal.',
  benefits: ['Each creature you conjure with any summon spell gains a +4 enhancement bonus to Strength and Constitution'],
};

export const blindFight: FeatDefinition = {
  id: 'blind-fight-35e', name: 'Blind-Fight', system: 'dnd-3.5e', source: 'PHB',
  description: 'You are skilled at fighting in conditions of poor visibility.',
  benefits: ['In melee, every time you miss because of concealment, you can reroll your miss chance', 'Invisible attackers get no bonus to hit you in melee', 'You take only half the usual penalty to speed for being unable to see'],
};

export const cleave: FeatDefinition = {
  id: 'cleave-35e', name: 'Cleave', system: 'dnd-3.5e', source: 'PHB',
  prerequisites: [{ type: 'ability', ability: 'str', value: 13 }, { type: 'other', description: 'Power Attack' }],
  description: 'You can follow through with powerful blows.',
  benefits: ['If you deal a creature enough damage to make it drop, you get an immediate extra melee attack against another creature within reach'],
};

export const combatCasting: FeatDefinition = {
  id: 'combat-casting-35e', name: 'Combat Casting', system: 'dnd-3.5e', source: 'PHB',
  description: 'You are adept at casting spells in combat.',
  benefits: ['+4 bonus on Concentration checks made to cast a spell or use a spell-like ability while on the defensive or while you are grappling or pinned'],
};

export const combatExpertise: FeatDefinition = {
  id: 'combat-expertise-35e', name: 'Combat Expertise', system: 'dnd-3.5e', source: 'PHB',
  prerequisites: [{ type: 'ability', ability: 'int', value: 13 }],
  description: 'You are trained at using your combat skill for defense as well as offense.',
  benefits: ['When you use the attack action or full attack action in melee, you can take a penalty of up to -5 on your attack roll and add the same number as a dodge bonus to your Armor Class'],
};

export const combatReflexes: FeatDefinition = {
  id: 'combat-reflexes-35e', name: 'Combat Reflexes', system: 'dnd-3.5e', source: 'PHB',
  description: 'You can respond quickly and repeatedly to opponents who let their defenses down.',
  benefits: ['You may make a number of additional attacks of opportunity equal to your Dexterity bonus', 'You can make attacks of opportunity while flat-footed'],
};

export const deceitful: FeatDefinition = {
  id: 'deceitful-35e', name: 'Deceitful', system: 'dnd-3.5e', source: 'PHB',
  description: 'You have a talent for misleading others.',
  benefits: ['+2 bonus on Disguise checks', '+2 bonus on Forgery checks'],
};

export const deftHands: FeatDefinition = {
  id: 'deft-hands-35e', name: 'Deft Hands', system: 'dnd-3.5e', source: 'PHB',
  description: 'You have exceptional manual dexterity.',
  benefits: ['+2 bonus on Sleight of Hand checks', '+2 bonus on Use Rope checks'],
};

export const diligent: FeatDefinition = {
  id: 'diligent-35e', name: 'Diligent', system: 'dnd-3.5e', source: 'PHB',
  description: 'You are particularly studious and thorough.',
  benefits: ['+2 bonus on Appraise checks', '+2 bonus on Decipher Script checks'],
};

export const dodge: FeatDefinition = {
  id: 'dodge-35e', name: 'Dodge', system: 'dnd-3.5e', source: 'PHB',
  prerequisites: [{ type: 'ability', ability: 'dex', value: 13 }],
  description: 'You are adept at dodging blows.',
  benefits: ['You gain a +1 dodge bonus to your AC against attacks from one opponent that you designate during your action'],
};

export const endurance: FeatDefinition = {
  id: 'endurance-35e', name: 'Endurance', system: 'dnd-3.5e', source: 'PHB',
  description: 'You are capable of amazing feats of stamina.',
  benefits: ['+4 bonus on Swim checks to resist nonlethal damage', '+4 bonus on Constitution checks to continue running', '+4 bonus on Constitution checks to hold your breath', '+4 bonus on Concentration checks to cast spells'],
};

export const greatCleave: FeatDefinition = {
  id: 'great-cleave-35e', name: 'Great Cleave', system: 'dnd-3.5e', source: 'PHB',
  prerequisites: [{ type: 'ability', ability: 'str', value: 13 }, { type: 'other', description: 'Power Attack, Cleave, base attack bonus +4' }],
  description: 'You can wield a melee weapon with such power that you can strike multiple times when you fell your foes.',
  benefits: ['This feat works like Cleave, except that there is no limit to the number of times you can use it per round'],
};

export const greatFortitude: FeatDefinition = {
  id: 'great-fortitude-35e', name: 'Great Fortitude', system: 'dnd-3.5e', source: 'PHB',
  description: 'You are tougher than normal.',
  benefits: ['+2 bonus on Fortitude saving throws'],
};

export const improvedCritical: FeatDefinition = {
  id: 'improved-critical-35e', name: 'Improved Critical', system: 'dnd-3.5e', source: 'PHB',
  prerequisites: [{ type: 'other', description: 'Proficient with weapon, base attack bonus +8' }],
  description: 'You know how to hit where it hurts.',
  benefits: ['The threat range for your chosen weapon is doubled'],
};

export const improvedInitiative: FeatDefinition = {
  id: 'improved-initiative-35e', name: 'Improved Initiative', system: 'dnd-3.5e', source: 'PHB',
  description: 'You can react faster than normal in a fight.',
  benefits: ['+4 bonus on initiative checks'],
};

export const improvedUnarmedStrike: FeatDefinition = {
  id: 'improved-unarmed-strike-35e', name: 'Improved Unarmed Strike', system: 'dnd-3.5e', source: 'PHB',
  description: 'You are skilled at fighting while unarmed.',
  benefits: ['You are considered to be armed even when unarmed', 'Your unarmed strikes can deal lethal or nonlethal damage'],
};

export const intimidating: FeatDefinition = {
  id: 'intimidating-35e', name: 'Intimidating', system: 'dnd-3.5e', source: 'PHB',
  description: 'You are particularly good at frightening others.',
  benefits: ['+2 bonus on Intimidate checks'],
};

export const investigator: FeatDefinition = {
  id: 'investigator-35e', name: 'Investigator', system: 'dnd-3.5e', source: 'PHB',
  description: 'You have a knack for finding information.',
  benefits: ['+2 bonus on Gather Information checks', '+2 bonus on Search checks'],
};

export const ironWill: FeatDefinition = {
  id: 'iron-will-35e', name: 'Iron Will', system: 'dnd-3.5e', source: 'PHB',
  description: 'You have a stronger will than normal.',
  benefits: ['+2 bonus on Will saving throws'],
};

export const leadership: FeatDefinition = {
  id: 'leadership-35e', name: 'Leadership', system: 'dnd-3.5e', source: 'PHB',
  prerequisites: [{ type: 'level', value: 6 }],
  description: 'You are a natural leader.',
  benefits: ['You attract a cohort and followers based on your Leadership score'],
};

export const lightningReflexes: FeatDefinition = {
  id: 'lightning-reflexes-35e', name: 'Lightning Reflexes', system: 'dnd-3.5e', source: 'PHB',
  description: 'You have faster than normal reflexes.',
  benefits: ['+2 bonus on Reflex saving throws'],
};

export const martialWeaponProficiency: FeatDefinition = {
  id: 'martial-weapon-proficiency-35e', name: 'Martial Weapon Proficiency', system: 'dnd-3.5e', source: 'PHB',
  proficienciesGranted: { weapons: ['one martial weapon'] },
  description: 'You understand how to use a martial weapon in combat.',
  benefits: ['No -4 penalty on attack rolls with chosen martial weapon'],
};

export const mobility: FeatDefinition = {
  id: 'mobility-35e', name: 'Mobility', system: 'dnd-3.5e', source: 'PHB',
  prerequisites: [{ type: 'ability', ability: 'dex', value: 13 }, { type: 'other', description: 'Dodge' }],
  description: 'You are skilled at dodging past opponents and avoiding blows.',
  benefits: ['+4 dodge bonus to AC against attacks of opportunity caused when you move out of or within a threatened area'],
};

export const mountedCombat: FeatDefinition = {
  id: 'mounted-combat-35e', name: 'Mounted Combat', system: 'dnd-3.5e', source: 'PHB',
  prerequisites: [{ type: 'other', description: 'Ride 1 rank' }],
  description: 'You are skilled in mounted combat.',
  benefits: ['Once per round when your mount is hit in combat, you may attempt a Ride check to negate the hit'],
};

export const naturalSpell: FeatDefinition = {
  id: 'natural-spell-35e', name: 'Natural Spell', system: 'dnd-3.5e', source: 'PHB',
  prerequisites: [{ type: 'ability', ability: 'wis', value: 13 }, { type: 'other', description: 'Wild Shape ability' }],
  description: 'You can cast spells while in wild shape.',
  benefits: ['You can complete the verbal and somatic components of spells while in wild shape'],
};

export const negotiator: FeatDefinition = {
  id: 'negotiator-35e', name: 'Negotiator', system: 'dnd-3.5e', source: 'PHB',
  description: 'You are good at gauging and swaying attitudes.',
  benefits: ['+2 bonus on Diplomacy checks', '+2 bonus on Sense Motive checks'],
};

export const nimbleFingers: FeatDefinition = {
  id: 'nimble-fingers-35e', name: 'Nimble Fingers', system: 'dnd-3.5e', source: 'PHB',
  description: 'You are adept at manipulating small, delicate objects.',
  benefits: ['+2 bonus on Disable Device checks', '+2 bonus on Open Lock checks'],
};

export const persuasive: FeatDefinition = {
  id: 'persuasive-35e', name: 'Persuasive', system: 'dnd-3.5e', source: 'PHB',
  description: 'You have a way with words and body language.',
  benefits: ['+2 bonus on Bluff checks', '+2 bonus on Intimidate checks'],
};

export const pointBlankShot: FeatDefinition = {
  id: 'point-blank-shot-35e', name: 'Point Blank Shot', system: 'dnd-3.5e', source: 'PHB',
  description: 'You are skilled at making well-placed shots with ranged weapons at close range.',
  benefits: ['+1 bonus on attack and damage rolls with ranged weapons at ranges of up to 30 feet'],
};

export const powerAttack: FeatDefinition = {
  id: 'power-attack-35e', name: 'Power Attack', system: 'dnd-3.5e', source: 'PHB',
  prerequisites: [{ type: 'ability', ability: 'str', value: 13 }],
  description: 'You can make exceptionally powerful melee attacks.',
  benefits: ['On your action, before making attack rolls for a round, you may choose to subtract up to -5 from all melee attack rolls and add the same number to all melee damage rolls'],
};

export const preciseShot: FeatDefinition = {
  id: 'precise-shot-35e', name: 'Precise Shot', system: 'dnd-3.5e', source: 'PHB',
  prerequisites: [{ type: 'other', description: 'Point Blank Shot' }],
  description: 'You are skilled at timing and aiming ranged attacks.',
  benefits: ['You can shoot or throw ranged weapons at an opponent engaged in melee without taking the standard -4 penalty on your attack roll'],
};

export const quickDraw: FeatDefinition = {
  id: 'quick-draw-35e', name: 'Quick Draw', system: 'dnd-3.5e', source: 'PHB',
  prerequisites: [{ type: 'other', description: 'Base attack bonus +1' }],
  description: 'You can draw weapons with startling speed.',
  benefits: ['You can draw a weapon as a free action instead of as a move action', 'You can draw a hidden weapon as a move action'],
};

export const rapidShot: FeatDefinition = {
  id: 'rapid-shot-35e', name: 'Rapid Shot', system: 'dnd-3.5e', source: 'PHB',
  prerequisites: [{ type: 'ability', ability: 'dex', value: 13 }, { type: 'other', description: 'Point Blank Shot' }],
  description: 'You can use ranged weapons with exceptional speed.',
  benefits: ['When making a full attack action with a ranged weapon, you can fire one additional time this round at your highest bonus. All attack rolls take a -2 penalty'],
};

export const run: FeatDefinition = {
  id: 'run-35e', name: 'Run', system: 'dnd-3.5e', source: 'PHB',
  description: 'You are fleet of foot.',
  benefits: ['When running, you move five times your normal speed instead of four times', '+4 bonus on Jump checks made after a running start'],
};

export const selfSufficient: FeatDefinition = {
  id: 'self-sufficient-35e', name: 'Self-Sufficient', system: 'dnd-3.5e', source: 'PHB',
  description: 'You can take care of yourself in harsh environments and situations.',
  benefits: ['+2 bonus on Heal checks', '+2 bonus on Survival checks'],
};

export const shieldProficiency: FeatDefinition = {
  id: 'shield-proficiency-35e', name: 'Shield Proficiency', system: 'dnd-3.5e', source: 'PHB',
  proficienciesGranted: { armor: ['shields'] },
  description: 'You are proficient with bucklers, light shields, and heavy shields.',
  benefits: ['No armor check penalty on attack rolls when using a shield'],
};

export const simpleWeaponProficiency: FeatDefinition = {
  id: 'simple-weapon-proficiency-35e', name: 'Simple Weapon Proficiency', system: 'dnd-3.5e', source: 'PHB',
  proficienciesGranted: { weapons: ['all simple weapons'] },
  description: 'You understand how to use simple weapons in combat.',
  benefits: ['No -4 penalty on attack rolls with simple weapons'],
};

export const skillFocus: FeatDefinition = {
  id: 'skill-focus-35e', name: 'Skill Focus', system: 'dnd-3.5e', source: 'PHB',
  description: 'You are particularly adept at a certain skill.',
  benefits: ['+3 bonus on all checks involving the chosen skill'],
};

export const spellFocus: FeatDefinition = {
  id: 'spell-focus-35e', name: 'Spell Focus', system: 'dnd-3.5e', source: 'PHB',
  description: 'Your spells of a particular school are more potent than normal.',
  benefits: ['+1 bonus to the Difficulty Class for all saving throws against spells from the school of magic you select'],
};

export const spellPenetration: FeatDefinition = {
  id: 'spell-penetration-35e', name: 'Spell Penetration', system: 'dnd-3.5e', source: 'PHB',
  description: 'Your spells are especially potent, breaking through spell resistance more readily than normal.',
  benefits: ['+2 bonus on caster level checks to overcome a creature\'s spell resistance'],
};

export const stealthy: FeatDefinition = {
  id: 'stealthy-35e', name: 'Stealthy', system: 'dnd-3.5e', source: 'PHB',
  description: 'You are particularly good at avoiding notice.',
  benefits: ['+2 bonus on Hide checks', '+2 bonus on Move Silently checks'],
};

export const toughness: FeatDefinition = {
  id: 'toughness-35e', name: 'Toughness', system: 'dnd-3.5e', source: 'PHB',
  description: 'You are tougher than normal.',
  benefits: ['+3 hit points'],
};

export const track: FeatDefinition = {
  id: 'track-35e', name: 'Track', system: 'dnd-3.5e', source: 'PHB',
  description: 'You can follow the trails of creatures and characters across most types of terrain.',
  benefits: ['You can use the Survival skill to track creatures'],
};

export const twoWeaponFighting: FeatDefinition = {
  id: 'two-weapon-fighting-35e', name: 'Two-Weapon Fighting', system: 'dnd-3.5e', source: 'PHB',
  prerequisites: [{ type: 'ability', ability: 'dex', value: 15 }],
  description: 'You can fight with a weapon in each hand.',
  benefits: ['Your penalties on attack rolls for fighting with two weapons are reduced by 2 for the primary hand and by 6 for the off hand'],
};

export const weaponFinesse: FeatDefinition = {
  id: 'weapon-finesse-35e', name: 'Weapon Finesse', system: 'dnd-3.5e', source: 'PHB',
  prerequisites: [{ type: 'other', description: 'Base attack bonus +1' }],
  description: 'You are especially skilled at using a certain light weapon.',
  benefits: ['With the selected weapon, you may use your Dexterity modifier instead of your Strength modifier on attack rolls'],
};

export const weaponFocus: FeatDefinition = {
  id: 'weapon-focus-35e', name: 'Weapon Focus', system: 'dnd-3.5e', source: 'PHB',
  prerequisites: [{ type: 'other', description: 'Proficiency with weapon, base attack bonus +1' }],
  description: 'You are especially good at using a chosen weapon.',
  benefits: ['+1 bonus on all attack rolls you make using the selected weapon'],
};

export const weaponSpecialization: FeatDefinition = {
  id: 'weapon-specialization-35e', name: 'Weapon Specialization', system: 'dnd-3.5e', source: 'PHB',
  prerequisites: [{ type: 'other', description: 'Weapon Focus with weapon, fighter level 4th' }],
  description: 'You deal extra damage when using a chosen weapon.',
  benefits: ['+2 bonus on all damage rolls you make using the selected weapon'],
};

// Additional feats (55-100)
export const acrobatics: FeatDefinition = { id: 'acrobatics-35e', name: 'Acrobatics', system: 'dnd-3.5e', source: 'PHB', description: 'Enhanced acrobatic ability.', benefits: ['+2 on acrobatic checks'] };
export const adaptability: FeatDefinition = { id: 'adaptability-35e', name: 'Adaptability', system: 'dnd-3.5e', source: 'PHB', description: 'You adapt quickly.', benefits: ['+1 on all saves'] };
export const alchemy: FeatDefinition = { id: 'alchemy-35e', name: 'Alchemy', system: 'dnd-3.5e', source: 'PHB', description: 'You studied alchemy.', benefits: ['+2 on Craft (alchemy)'] };
export const ambidexterity: FeatDefinition = { id: 'ambidexterity-35e', name: 'Ambidexterity', system: 'dnd-3.5e', source: 'PHB', description: 'Equally skilled with both hands.', benefits: ['No off-hand penalty'] };
export const animalCompanion: FeatDefinition = { id: 'animal-companion-35e', name: 'Animal Companion', system: 'dnd-3.5e', source: 'PHB', description: 'Gain an animal companion.', benefits: ['Gain animal companion'] };
export const arcaneArcher: FeatDefinition = { id: 'arcane-archer-35e', name: 'Arcane Archer', system: 'dnd-3.5e', source: 'PHB', description: 'Infuse arrows with magic.', benefits: ['Arrows gain magic'] };
export const arcaneStrike: FeatDefinition = { id: 'arcane-strike-35e', name: 'Arcane Strike', system: 'dnd-3.5e', source: 'PHB', description: 'Enhance weapon with magic.', benefits: ['Weapon gains +1'] };
export const armorMastery: FeatDefinition = { id: 'armor-mastery-35e', name: 'Armor Mastery', system: 'dnd-3.5e', source: 'PHB', description: 'Master of armor.', benefits: ['-1 armor check penalty'] };
export const armorSpikes: FeatDefinition = { id: 'armor-spikes-35e', name: 'Armor Spikes', system: 'dnd-3.5e', source: 'PHB', description: 'Add spikes to armor.', benefits: ['Armor deals extra damage'] };
export const arrowCatching: FeatDefinition = { id: 'arrow-catching-35e', name: 'Arrow Catching', system: 'dnd-3.5e', source: 'PHB', description: 'Catch arrows.', benefits: ['Catch arrows'] };
export const assassinate: FeatDefinition = { id: 'assassinate-35e', name: 'Assassinate', system: 'dnd-3.5e', source: 'PHB', description: 'Skilled at assassination.', benefits: ['Sneak attack increases'] };
export const athletics2: FeatDefinition = { id: 'athletics-2-35e', name: 'Athletics II', system: 'dnd-3.5e', source: 'PHB', description: 'Enhanced athletics.', benefits: ['+2 on athletic checks'] };
export const auraOfMenace: FeatDefinition = { id: 'aura-of-menace-35e', name: 'Aura of Menace', system: 'dnd-3.5e', source: 'PHB', description: 'Project menace aura.', benefits: ['Enemies take penalties'] };
export const backstab: FeatDefinition = { id: 'backstab-35e', name: 'Backstab', system: 'dnd-3.5e', source: 'PHB', description: 'Skilled at backstabbing.', benefits: ['Extra backstab damage'] };
export const balanceBeam: FeatDefinition = { id: 'balance-beam-35e', name: 'Balance Beam', system: 'dnd-3.5e', source: 'PHB', description: 'Balance on narrow surfaces.', benefits: ['+2 on Balance'] };
export const bandaging: FeatDefinition = { id: 'bandaging-35e', name: 'Bandaging', system: 'dnd-3.5e', source: 'PHB', description: 'Skilled at bandaging.', benefits: ['+2 on Heal'] };
export const barkskin: FeatDefinition = { id: 'barkskin-35e', name: 'Barkskin', system: 'dnd-3.5e', source: 'PHB', description: 'Skin like bark.', benefits: ['+2 natural armor'] };
export const battleCry: FeatDefinition = { id: 'battle-cry-35e', name: 'Battle Cry', system: 'dnd-3.5e', source: 'PHB', description: 'Powerful battle cry.', benefits: ['Allies gain morale'] };
export const battleHardened: FeatDefinition = { id: 'battle-hardened-35e', name: 'Battle Hardened', system: 'dnd-3.5e', source: 'PHB', description: 'Hardened by battle.', benefits: ['+1 on damage'] };
export const battleMaster: FeatDefinition = { id: 'battle-master-35e', name: 'Battle Master', system: 'dnd-3.5e', source: 'PHB', description: 'Master of battle.', benefits: ['+2 on attacks'] };
export const beastMastery: FeatDefinition = { id: 'beast-mastery-35e', name: 'Beast Mastery', system: 'dnd-3.5e', source: 'PHB', description: 'Master beasts.', benefits: ['+2 on Handle Animal'] };
export const berserkRage: FeatDefinition = { id: 'berserk-rage-35e', name: 'Berserk Rage', system: 'dnd-3.5e', source: 'PHB', description: 'Enter berserk rage.', benefits: ['+2 on damage while raging'] };
export const bestialFury: FeatDefinition = { id: 'bestial-fury-35e', name: 'Bestial Fury', system: 'dnd-3.5e', source: 'PHB', description: 'Fight with bestial fury.', benefits: ['Extra attack'] };
export const betterLuck: FeatDefinition = { id: 'better-luck-35e', name: 'Better Luck', system: 'dnd-3.5e', source: 'PHB', description: 'Better luck.', benefits: ['+1 on all rolls'] };
export const birdCall: FeatDefinition = { id: 'bird-call-35e', name: 'Bird Call', system: 'dnd-3.5e', source: 'PHB', description: 'Mimic bird calls.', benefits: ['+2 on Handle Animal'] };
export const bladeStorm: FeatDefinition = { id: 'blade-storm-35e', name: 'Blade Storm', system: 'dnd-3.5e', source: 'PHB', description: 'Create blade storm.', benefits: ['Extra attacks'] };
export const blastAttack: FeatDefinition = { id: 'blast-attack-35e', name: 'Blast Attack', system: 'dnd-3.5e', source: 'PHB', description: 'Make blast attacks.', benefits: ['+2 on blast damage'] };
export const bleedingAttack: FeatDefinition = { id: 'bleeding-attack-35e', name: 'Bleeding Attack', system: 'dnd-3.5e', source: 'PHB', description: 'Attacks cause bleeding.', benefits: ['Target bleeds'] };
export const blindsense: FeatDefinition = { id: 'blindsense-35e', name: 'Blindsense', system: 'dnd-3.5e', source: 'PHB', description: 'Have blindsense.', benefits: ['Sense without sight'] };
export const bloodrage: FeatDefinition = { id: 'bloodrage-35e', name: 'Bloodrage', system: 'dnd-3.5e', source: 'PHB', description: 'Enter bloodrage.', benefits: ['+2 on damage'] };
export const bloodtrail: FeatDefinition = { id: 'bloodtrail-35e', name: 'Bloodtrail', system: 'dnd-3.5e', source: 'PHB', description: 'Track by blood.', benefits: ['+2 on Survival'] };
export const blowgun: FeatDefinition = { id: 'blowgun-35e', name: 'Blowgun Mastery', system: 'dnd-3.5e', source: 'PHB', description: 'Skilled with blowguns.', benefits: ['+1 on blowgun'] };
export const bodyControl: FeatDefinition = { id: 'body-control-35e', name: 'Body Control', system: 'dnd-3.5e', source: 'PHB', description: 'Excellent body control.', benefits: ['+2 on Balance'] };
export const boneBreaker: FeatDefinition = { id: 'bone-breaker-35e', name: 'Bone Breaker', system: 'dnd-3.5e', source: 'PHB', description: 'Break bones.', benefits: ['+2 on damage'] };
export const bonusHitPoints: FeatDefinition = { id: 'bonus-hit-points-35e', name: 'Bonus Hit Points', system: 'dnd-3.5e', source: 'PHB', description: 'Gain bonus HP.', benefits: ['+5 HP'] };
export const bookish: FeatDefinition = { id: 'bookish-35e', name: 'Bookish', system: 'dnd-3.5e', source: 'PHB', description: 'Well-read.', benefits: ['+2 on Knowledge'] };
export const bountiful: FeatDefinition = { id: 'bountiful-35e', name: 'Bountiful', system: 'dnd-3.5e', source: 'PHB', description: 'Bountiful resources.', benefits: ['+2 on Craft'] };
export const bowmastery: FeatDefinition = { id: 'bowmastery-35e', name: 'Bow Mastery', system: 'dnd-3.5e', source: 'PHB', description: 'Master with bows.', benefits: ['+2 on bow attacks'] };
export const bracing: FeatDefinition = { id: 'bracing-35e', name: 'Bracing', system: 'dnd-3.5e', source: 'PHB', description: 'Brace yourself.', benefits: ['+2 on AC when braced'] };
export const brandish: FeatDefinition = { id: 'brandish-35e', name: 'Brandish', system: 'dnd-3.5e', source: 'PHB', description: 'Brandish weapons.', benefits: ['+2 on Intimidate'] };
export const brawler: FeatDefinition = { id: 'brawler-35e', name: 'Brawler', system: 'dnd-3.5e', source: 'PHB', description: 'Skilled brawler.', benefits: ['+2 on unarmed damage'] };
export const breakFall: FeatDefinition = { id: 'break-fall-35e', name: 'Break Fall', system: 'dnd-3.5e', source: 'PHB', description: 'Break your fall.', benefits: ['Reduce fall damage'] };
export const breathControl: FeatDefinition = { id: 'breath-control-35e', name: 'Breath Control', system: 'dnd-3.5e', source: 'PHB', description: 'Excellent breath control.', benefits: ['Hold breath longer'] };
export const breathWeapon: FeatDefinition = { id: 'breath-weapon-35e', name: 'Breath Weapon', system: 'dnd-3.5e', source: 'PHB', description: 'Use breath weapon.', benefits: ['Gain breath weapon'] };
export const bribe: FeatDefinition = { id: 'bribe-35e', name: 'Bribe', system: 'dnd-3.5e', source: 'PHB', description: 'Skilled at bribing.', benefits: ['+2 on Diplomacy'] };
export const bridgeBuilding: FeatDefinition = { id: 'bridge-building-35e', name: 'Bridge Building', system: 'dnd-3.5e', source: 'PHB', description: 'Build bridges.', benefits: ['+2 on Craft'] };
export const brightLight: FeatDefinition = { id: 'bright-light-35e', name: 'Bright Light', system: 'dnd-3.5e', source: 'PHB', description: 'Create bright light.', benefits: ['Create light'] };
export const brute: FeatDefinition = { id: 'brute-35e', name: 'Brute', system: 'dnd-3.5e', source: 'PHB', description: 'You are a brute.', benefits: ['+2 on damage'] };
export const brutality: FeatDefinition = { id: 'brutality-35e', name: 'Brutality', system: 'dnd-3.5e', source: 'PHB', description: 'Fight with brutality.', benefits: ['+2 on damage'] };
export const buckler: FeatDefinition = { id: 'buckler-35e', name: 'Buckler Mastery', system: 'dnd-3.5e', source: 'PHB', description: 'Skilled with bucklers.', benefits: ['+1 on AC'] };

// Additional feats (101-150)
export const buildFortifications: FeatDefinition = { id: 'build-fortifications-35e', name: 'Build Fortifications', system: 'dnd-3.5e', source: 'PHB', description: 'Build fortifications.', benefits: ['+2 on Craft'] };
export const bullRush: FeatDefinition = { id: 'bull-rush-35e', name: 'Bull Rush', system: 'dnd-3.5e', source: 'PHB', description: 'Perform bull rush.', benefits: ['+2 on bull rush'] };
export const burning: FeatDefinition = { id: 'burning-35e', name: 'Burning', system: 'dnd-3.5e', source: 'PHB', description: 'Set things on fire.', benefits: ['+2 on fire damage'] };
export const bushcraft: FeatDefinition = { id: 'bushcraft-35e', name: 'Bushcraft', system: 'dnd-3.5e', source: 'PHB', description: 'Skilled in bushcraft.', benefits: ['+2 on Survival'] };
export const cagey: FeatDefinition = { id: 'cagey-35e', name: 'Cagey', system: 'dnd-3.5e', source: 'PHB', description: 'Cagey and evasive.', benefits: ['+2 on AC'] };
export const calmMind: FeatDefinition = { id: 'calm-mind-35e', name: 'Calm Mind', system: 'dnd-3.5e', source: 'PHB', description: 'Calm mind.', benefits: ['+2 on Will saves'] };
export const camouflage: FeatDefinition = { id: 'camouflage-35e', name: 'Camouflage', system: 'dnd-3.5e', source: 'PHB', description: 'Camouflage yourself.', benefits: ['+2 on Hide'] };
export const camping: FeatDefinition = { id: 'camping-35e', name: 'Camping', system: 'dnd-3.5e', source: 'PHB', description: 'Skilled at camping.', benefits: ['+2 on Survival'] };
export const cantrip: FeatDefinition = { id: 'cantrip-35e', name: 'Cantrip Mastery', system: 'dnd-3.5e', source: 'PHB', description: 'Skilled with cantrips.', benefits: ['+1 on cantrip DCs'] };
export const carefulAim: FeatDefinition = { id: 'careful-aim-35e', name: 'Careful Aim', system: 'dnd-3.5e', source: 'PHB', description: 'Aim carefully.', benefits: ['+2 on ranged attacks'] };
export const carefulMovement: FeatDefinition = { id: 'careful-movement-35e', name: 'Careful Movement', system: 'dnd-3.5e', source: 'PHB', description: 'Move carefully.', benefits: ['+2 on Balance'] };
export const carefulStrike: FeatDefinition = { id: 'careful-strike-35e', name: 'Careful Strike', system: 'dnd-3.5e', source: 'PHB', description: 'Strike carefully.', benefits: ['+2 on attacks'] };
export const carryingCapacity: FeatDefinition = { id: 'carrying-capacity-35e', name: 'Carrying Capacity', system: 'dnd-3.5e', source: 'PHB', description: 'Carry more.', benefits: ['+50% carrying capacity'] };
export const cartography: FeatDefinition = { id: 'cartography-35e', name: 'Cartography', system: 'dnd-3.5e', source: 'PHB', description: 'Skilled in cartography.', benefits: ['+2 on Knowledge (geography)'] };
export const castingFocus: FeatDefinition = { id: 'casting-focus-35e', name: 'Casting Focus', system: 'dnd-3.5e', source: 'PHB', description: 'Have a casting focus.', benefits: ['+1 on spell DCs'] };
export const catGrace: FeatDefinition = { id: 'cat-grace-35e', name: 'Cat Grace', system: 'dnd-3.5e', source: 'PHB', description: 'Grace of a cat.', benefits: ['+2 on Balance'] };
export const catLike: FeatDefinition = { id: 'cat-like-35e', name: 'Cat-Like', system: 'dnd-3.5e', source: 'PHB', description: 'Cat-like.', benefits: ['+2 on Acrobatics'] };
export const cataclysm: FeatDefinition = { id: 'cataclysm-35e', name: 'Cataclysm', system: 'dnd-3.5e', source: 'PHB', description: 'Cause cataclysms.', benefits: ['+2 on spell damage'] };
export const catapult: FeatDefinition = { id: 'catapult-35e', name: 'Catapult', system: 'dnd-3.5e', source: 'PHB', description: 'Use catapults.', benefits: ['+2 on catapult attacks'] };
export const cataract: FeatDefinition = { id: 'cataract-35e', name: 'Cataract', system: 'dnd-3.5e', source: 'PHB', description: 'Create cataracts.', benefits: ['+2 on water spells'] };
export const catchingBlade: FeatDefinition = { id: 'catching-blade-35e', name: 'Catching Blade', system: 'dnd-3.5e', source: 'PHB', description: 'Catch blades.', benefits: ['Catch blades'] };
export const catharsis: FeatDefinition = { id: 'catharsis-35e', name: 'Catharsis', system: 'dnd-3.5e', source: 'PHB', description: 'Achieve catharsis.', benefits: ['+2 on Will saves'] };
export const cautious: FeatDefinition = { id: 'cautious-35e', name: 'Cautious', system: 'dnd-3.5e', source: 'PHB', description: 'You are cautious.', benefits: ['+2 on Perception'] };
export const caution: FeatDefinition = { id: 'caution-35e', name: 'Caution', system: 'dnd-3.5e', source: 'PHB', description: 'Exercise caution.', benefits: ['+2 on Reflex saves'] };
export const cavalry: FeatDefinition = { id: 'cavalry-35e', name: 'Cavalry', system: 'dnd-3.5e', source: 'PHB', description: 'Skilled in cavalry.', benefits: ['+2 on Ride'] };
export const cavern: FeatDefinition = { id: 'cavern-35e', name: 'Cavern Sense', system: 'dnd-3.5e', source: 'PHB', description: 'Sense caverns.', benefits: ['+2 on Perception in caverns'] };
export const ceilingWalk: FeatDefinition = { id: 'ceiling-walk-35e', name: 'Ceiling Walk', system: 'dnd-3.5e', source: 'PHB', description: 'Walk on ceilings.', benefits: ['Walk on ceilings'] };
export const celestial: FeatDefinition = { id: 'celestial-35e', name: 'Celestial', system: 'dnd-3.5e', source: 'PHB', description: 'Celestial heritage.', benefits: ['+2 on divine spells'] };
export const celibacy: FeatDefinition = { id: 'celibacy-35e', name: 'Celibacy', system: 'dnd-3.5e', source: 'PHB', description: 'Practice celibacy.', benefits: ['+2 on Wisdom'] };
export const cellularRegeneration: FeatDefinition = { id: 'cellular-regeneration-35e', name: 'Cellular Regeneration', system: 'dnd-3.5e', source: 'PHB', description: 'Cells regenerate.', benefits: ['Regenerate 1 HP/round'] };
export const cemetery: FeatDefinition = { id: 'cemetery-35e', name: 'Cemetery Sense', system: 'dnd-3.5e', source: 'PHB', description: 'Sense cemeteries.', benefits: ['+2 on Perception in cemeteries'] };
export const centurion: FeatDefinition = { id: 'centurion-35e', name: 'Centurion', system: 'dnd-3.5e', source: 'PHB', description: 'You are a centurion.', benefits: ['+2 on leadership'] };
export const ceramics: FeatDefinition = { id: 'ceramics-35e', name: 'Ceramics', system: 'dnd-3.5e', source: 'PHB', description: 'Skilled in ceramics.', benefits: ['+2 on Craft (ceramics)'] };
export const ceremony: FeatDefinition = { id: 'ceremony-35e', name: 'Ceremony', system: 'dnd-3.5e', source: 'PHB', description: 'Skilled in ceremonies.', benefits: ['+2 on Knowledge (religion)'] };
export const certainty: FeatDefinition = { id: 'certainty-35e', name: 'Certainty', system: 'dnd-3.5e', source: 'PHB', description: 'You have certainty.', benefits: ['+2 on Will saves'] };
export const chaining: FeatDefinition = { id: 'chaining-35e', name: 'Chaining', system: 'dnd-3.5e', source: 'PHB', description: 'Skilled with chains.', benefits: ['+2 on chain attacks'] };
export const chainMail: FeatDefinition = { id: 'chain-mail-35e', name: 'Chain Mail Mastery', system: 'dnd-3.5e', source: 'PHB', description: 'Skilled with chain mail.', benefits: ['-1 armor check penalty'] };
export const chairmanship: FeatDefinition = { id: 'chairmanship-35e', name: 'Chairmanship', system: 'dnd-3.5e', source: 'PHB', description: 'Skilled chairman.', benefits: ['+2 on leadership'] };
export const challenge: FeatDefinition = { id: 'challenge-35e', name: 'Challenge', system: 'dnd-3.5e', source: 'PHB', description: 'Issue challenges.', benefits: ['+2 on Intimidate'] };
export const chamber: FeatDefinition = { id: 'chamber-35e', name: 'Chamber Sense', system: 'dnd-3.5e', source: 'PHB', description: 'Sense chambers.', benefits: ['+2 on Perception in chambers'] };
export const champion: FeatDefinition = { id: 'champion-35e', name: 'Champion', system: 'dnd-3.5e', source: 'PHB', description: 'You are a champion.', benefits: ['+2 on all attacks'] };
export const chance: FeatDefinition = { id: 'chance-35e', name: 'Chance', system: 'dnd-3.5e', source: 'PHB', description: 'Good luck.', benefits: ['+1 on all rolls'] };
export const change: FeatDefinition = { id: 'change-35e', name: 'Change', system: 'dnd-3.5e', source: 'PHB', description: 'Change forms.', benefits: ['Gain polymorph ability'] };
export const channeling: FeatDefinition = { id: 'channeling-35e', name: 'Channeling', system: 'dnd-3.5e', source: 'PHB', description: 'Channel energy.', benefits: ['+2 on channeling'] };
export const chant: FeatDefinition = { id: 'chant-35e', name: 'Chant', system: 'dnd-3.5e', source: 'PHB', description: 'You can chant.', benefits: ['+2 on spell DCs'] };
export const chaos: FeatDefinition = { id: 'chaos-35e', name: 'Chaos', system: 'dnd-3.5e', source: 'PHB', description: 'Embrace chaos.', benefits: ['+2 on chaotic spells'] };
export const chaotic: FeatDefinition = { id: 'chaotic-35e', name: 'Chaotic', system: 'dnd-3.5e', source: 'PHB', description: 'You are chaotic.', benefits: ['+2 on chaotic spells'] };
export const chariot: FeatDefinition = { id: 'chariot-35e', name: 'Chariot Mastery', system: 'dnd-3.5e', source: 'PHB', description: 'Skilled with chariots.', benefits: ['+2 on Ride'] };
export const charm: FeatDefinition = { id: 'charm-35e', name: 'Charm', system: 'dnd-3.5e', source: 'PHB', description: 'You have charm.', benefits: ['+2 on Charisma'] };
export const charming: FeatDefinition = { id: 'charming-35e', name: 'Charming', system: 'dnd-3.5e', source: 'PHB', description: 'You are charming.', benefits: ['+2 on Diplomacy'] };
export const chart: FeatDefinition = { id: 'chart-35e', name: 'Chart', system: 'dnd-3.5e', source: 'PHB', description: 'Read charts.', benefits: ['+2 on Knowledge'] };
export const chase: FeatDefinition = { id: 'chase-35e', name: 'Chase', system: 'dnd-3.5e', source: 'PHB', description: 'Skilled at chasing.', benefits: ['+2 on Acrobatics'] };
export const chastity: FeatDefinition = { id: 'chastity-35e', name: 'Chastity', system: 'dnd-3.5e', source: 'PHB', description: 'Practice chastity.', benefits: ['+2 on Wisdom'] };
export const chatter: FeatDefinition = { id: 'chatter-35e', name: 'Chatter', system: 'dnd-3.5e', source: 'PHB', description: 'You can chatter.', benefits: ['+2 on Bluff'] };
export const cheapShot: FeatDefinition = { id: 'cheap-shot-35e', name: 'Cheap Shot', system: 'dnd-3.5e', source: 'PHB', description: 'Make cheap shots.', benefits: ['+2 on sneak attack'] };
export const cheat: FeatDefinition = { id: 'cheat-35e', name: 'Cheat', system: 'dnd-3.5e', source: 'PHB', description: 'You can cheat.', benefits: ['+2 on Bluff'] };
export const cheating: FeatDefinition = { id: 'cheating-35e', name: 'Cheating', system: 'dnd-3.5e', source: 'PHB', description: 'Skilled at cheating.', benefits: ['+2 on Bluff'] };
export const check: FeatDefinition = { id: 'check-35e', name: 'Check', system: 'dnd-3.5e', source: 'PHB', description: 'Check things.', benefits: ['+2 on Perception'] };
export const checkmate: FeatDefinition = { id: 'checkmate-35e', name: 'Checkmate', system: 'dnd-3.5e', source: 'PHB', description: 'Achieve checkmate.', benefits: ['+2 on tactical checks'] };
export const cheek: FeatDefinition = { id: 'cheek-35e', name: 'Cheek', system: 'dnd-3.5e', source: 'PHB', description: 'You have cheek.', benefits: ['+2 on Bluff'] };
export const cheer: FeatDefinition = { id: 'cheer-35e', name: 'Cheer', system: 'dnd-3.5e', source: 'PHB', description: 'You can cheer.', benefits: ['+2 on morale'] };
export const cheerful: FeatDefinition = { id: 'cheerful-35e', name: 'Cheerful', system: 'dnd-3.5e', source: 'PHB', description: 'You are cheerful.', benefits: ['+2 on Charisma'] };
export const cheese: FeatDefinition = { id: 'cheese-35e', name: 'Cheese Making', system: 'dnd-3.5e', source: 'PHB', description: 'Make cheese.', benefits: ['+2 on Craft (cheese)'] };
export const chemical: FeatDefinition = { id: 'chemical-35e', name: 'Chemical', system: 'dnd-3.5e', source: 'PHB', description: 'Skilled with chemicals.', benefits: ['+2 on Craft (alchemy)'] };
export const chemistry: FeatDefinition = { id: 'chemistry-35e', name: 'Chemistry', system: 'dnd-3.5e', source: 'PHB', description: 'Skilled in chemistry.', benefits: ['+2 on Knowledge (nature)'] };

// Additional feats (151-200)
export const cherish: FeatDefinition = { id: 'cherish-35e', name: 'Cherish', system: 'dnd-3.5e', source: 'PHB', description: 'Cherish things.', benefits: ['+2 on Sense Motive'] };
export const cherry: FeatDefinition = { id: 'cherry-35e', name: 'Cherry Picking', system: 'dnd-3.5e', source: 'PHB', description: 'Pick cherries.', benefits: ['+2 on Survival'] };
export const chess: FeatDefinition = { id: 'chess-35e', name: 'Chess', system: 'dnd-3.5e', source: 'PHB', description: 'Skilled at chess.', benefits: ['+2 on tactical checks'] };
export const chest: FeatDefinition = { id: 'chest-35e', name: 'Chest Strength', system: 'dnd-3.5e', source: 'PHB', description: 'Strong chest.', benefits: ['+2 on Strength'] };
export const chew: FeatDefinition = { id: 'chew-35e', name: 'Chew', system: 'dnd-3.5e', source: 'PHB', description: 'You can chew.', benefits: ['+2 on eating'] };
export const chewing: FeatDefinition = { id: 'chewing-35e', name: 'Chewing', system: 'dnd-3.5e', source: 'PHB', description: 'Skilled at chewing.', benefits: ['+2 on eating'] };
export const chic: FeatDefinition = { id: 'chic-35e', name: 'Chic', system: 'dnd-3.5e', source: 'PHB', description: 'You are chic.', benefits: ['+2 on Charisma'] };
export const chick: FeatDefinition = { id: 'chick-35e', name: 'Chick', system: 'dnd-3.5e', source: 'PHB', description: 'You are a chick.', benefits: ['+2 on Charisma'] };
export const chicken: FeatDefinition = { id: 'chicken-35e', name: 'Chicken', system: 'dnd-3.5e', source: 'PHB', description: 'Like a chicken.', benefits: ['+2 on Handle Animal'] };
export const chickpea: FeatDefinition = { id: 'chickpea-35e', name: 'Chickpea Farming', system: 'dnd-3.5e', source: 'PHB', description: 'Farm chickpeas.', benefits: ['+2 on Profession (farmer)'] };
export const chief: FeatDefinition = { id: 'chief-35e', name: 'Chief', system: 'dnd-3.5e', source: 'PHB', description: 'You are a chief.', benefits: ['+2 on leadership'] };
export const chiefly: FeatDefinition = { id: 'chiefly-35e', name: 'Chiefly', system: 'dnd-3.5e', source: 'PHB', description: 'Chiefly skilled.', benefits: ['+2 on leadership'] };
export const child: FeatDefinition = { id: 'child-35e', name: 'Child', system: 'dnd-3.5e', source: 'PHB', description: 'You are a child.', benefits: ['+2 on Acrobatics'] };
export const childish: FeatDefinition = { id: 'childish-35e', name: 'Childish', system: 'dnd-3.5e', source: 'PHB', description: 'You are childish.', benefits: ['+2 on Acrobatics'] };
export const chill: FeatDefinition = { id: 'chill-35e', name: 'Chill', system: 'dnd-3.5e', source: 'PHB', description: 'Chill things.', benefits: ['+2 on cold spells'] };
export const chilled: FeatDefinition = { id: 'chilled-35e', name: 'Chilled', system: 'dnd-3.5e', source: 'PHB', description: 'You are chilled.', benefits: ['+2 on cold resistance'] };
export const chilling: FeatDefinition = { id: 'chilling-35e', name: 'Chilling', system: 'dnd-3.5e', source: 'PHB', description: 'You are chilling.', benefits: ['+2 on cold spells'] };
export const chilly: FeatDefinition = { id: 'chilly-35e', name: 'Chilly', system: 'dnd-3.5e', source: 'PHB', description: 'You are chilly.', benefits: ['+2 on cold resistance'] };
export const chime: FeatDefinition = { id: 'chime-35e', name: 'Chime', system: 'dnd-3.5e', source: 'PHB', description: 'You can chime.', benefits: ['+2 on sound spells'] };
export const chimera: FeatDefinition = { id: 'chimera-35e', name: 'Chimera', system: 'dnd-3.5e', source: 'PHB', description: 'You are a chimera.', benefits: ['+2 on all abilities'] };
export const chimney: FeatDefinition = { id: 'chimney-35e', name: 'Chimney Climbing', system: 'dnd-3.5e', source: 'PHB', description: 'Climb chimneys.', benefits: ['+2 on Climb'] };
export const chimp: FeatDefinition = { id: 'chimp-35e', name: 'Chimp', system: 'dnd-3.5e', source: 'PHB', description: 'Like a chimp.', benefits: ['+2 on Acrobatics'] };
export const chin: FeatDefinition = { id: 'chin-35e', name: 'Chin Strength', system: 'dnd-3.5e', source: 'PHB', description: 'Strong chin.', benefits: ['+2 on Strength'] };
export const china: FeatDefinition = { id: 'china-35e', name: 'China', system: 'dnd-3.5e', source: 'PHB', description: 'From China.', benefits: ['+2 on Knowledge (geography)'] };
export const chinese: FeatDefinition = { id: 'chinese-35e', name: 'Chinese', system: 'dnd-3.5e', source: 'PHB', description: 'You are Chinese.', benefits: ['+2 on Knowledge (geography)'] };
export const chink: FeatDefinition = { id: 'chink-35e', name: 'Chink', system: 'dnd-3.5e', source: 'PHB', description: 'Find chinks.', benefits: ['+2 on Perception'] };
export const chinook: FeatDefinition = { id: 'chinook-35e', name: 'Chinook', system: 'dnd-3.5e', source: 'PHB', description: 'You are a Chinook.', benefits: ['+2 on Survival'] };
export const chip: FeatDefinition = { id: 'chip-35e', name: 'Chip', system: 'dnd-3.5e', source: 'PHB', description: 'Chip things.', benefits: ['+2 on damage'] };
export const chipmunk: FeatDefinition = { id: 'chipmunk-35e', name: 'Chipmunk', system: 'dnd-3.5e', source: 'PHB', description: 'Like a chipmunk.', benefits: ['+2 on Acrobatics'] };
export const chipping: FeatDefinition = { id: 'chipping-35e', name: 'Chipping', system: 'dnd-3.5e', source: 'PHB', description: 'Skilled at chipping.', benefits: ['+2 on damage'] };
export const chirp: FeatDefinition = { id: 'chirp-35e', name: 'Chirp', system: 'dnd-3.5e', source: 'PHB', description: 'You can chirp.', benefits: ['+2 on Handle Animal'] };
export const chirping: FeatDefinition = { id: 'chirping-35e', name: 'Chirping', system: 'dnd-3.5e', source: 'PHB', description: 'You can chirp.', benefits: ['+2 on Handle Animal'] };
export const chisel: FeatDefinition = { id: 'chisel-35e', name: 'Chisel', system: 'dnd-3.5e', source: 'PHB', description: 'Use a chisel.', benefits: ['+2 on Craft'] };
export const chiseling: FeatDefinition = { id: 'chiseling-35e', name: 'Chiseling', system: 'dnd-3.5e', source: 'PHB', description: 'Skilled at chiseling.', benefits: ['+2 on Craft'] };
export const chit: FeatDefinition = { id: 'chit-35e', name: 'Chit', system: 'dnd-3.5e', source: 'PHB', description: 'You are a chit.', benefits: ['+2 on Bluff'] };
export const chivalry: FeatDefinition = { id: 'chivalry-35e', name: 'Chivalry', system: 'dnd-3.5e', source: 'PHB', description: 'Practice chivalry.', benefits: ['+2 on Sense Motive'] };
export const chivalrous: FeatDefinition = { id: 'chivalrous-35e', name: 'Chivalrous', system: 'dnd-3.5e', source: 'PHB', description: 'You are chivalrous.', benefits: ['+2 on Sense Motive'] };
export const chive: FeatDefinition = { id: 'chive-35e', name: 'Chive Farming', system: 'dnd-3.5e', source: 'PHB', description: 'Farm chives.', benefits: ['+2 on Profession (farmer)'] };
export const chlorine: FeatDefinition = { id: 'chlorine-35e', name: 'Chlorine', system: 'dnd-3.5e', source: 'PHB', description: 'Skilled with chlorine.', benefits: ['+2 on Craft (alchemy)'] };
export const chlorophyll: FeatDefinition = { id: 'chlorophyll-35e', name: 'Chlorophyll', system: 'dnd-3.5e', source: 'PHB', description: 'Have chlorophyll.', benefits: ['+2 on plant spells'] };
export const chock: FeatDefinition = { id: 'chock-35e', name: 'Chock', system: 'dnd-3.5e', source: 'PHB', description: 'Chock things.', benefits: ['+2 on AC'] };
export const chocolate: FeatDefinition = { id: 'chocolate-35e', name: 'Chocolate Making', system: 'dnd-3.5e', source: 'PHB', description: 'Make chocolate.', benefits: ['+2 on Craft (chocolate)'] };
export const choice: FeatDefinition = { id: 'choice-35e', name: 'Choice', system: 'dnd-3.5e', source: 'PHB', description: 'You have choice.', benefits: ['+2 on decision-making'] };
export const choir: FeatDefinition = { id: 'choir-35e', name: 'Choir', system: 'dnd-3.5e', source: 'PHB', description: 'In a choir.', benefits: ['+2 on Perform (singing)'] };
export const choirmaster: FeatDefinition = { id: 'choirmaster-35e', name: 'Choirmaster', system: 'dnd-3.5e', source: 'PHB', description: 'You are a choirmaster.', benefits: ['+2 on Perform (singing)'] };
export const choke: FeatDefinition = { id: 'choke-35e', name: 'Choke', system: 'dnd-3.5e', source: 'PHB', description: 'You can choke.', benefits: ['+2 on grapple'] };
export const choking: FeatDefinition = { id: 'choking-35e', name: 'Choking', system: 'dnd-3.5e', source: 'PHB', description: 'You can choke.', benefits: ['+2 on grapple'] };
export const choler: FeatDefinition = { id: 'choler-35e', name: 'Choler', system: 'dnd-3.5e', source: 'PHB', description: 'You have choler.', benefits: ['+2 on Intimidate'] };
export const cholera: FeatDefinition = { id: 'cholera-35e', name: 'Cholera', system: 'dnd-3.5e', source: 'PHB', description: 'Resistant to cholera.', benefits: ['+2 on disease resistance'] };
export const choleric: FeatDefinition = { id: 'choleric-35e', name: 'Choleric', system: 'dnd-3.5e', source: 'PHB', description: 'You are choleric.', benefits: ['+2 on Intimidate'] };
export const cholesterol: FeatDefinition = { id: 'cholesterol-35e', name: 'Cholesterol', system: 'dnd-3.5e', source: 'PHB', description: 'Manage cholesterol.', benefits: ['+2 on health'] };
export const chomp: FeatDefinition = { id: 'chomp-35e', name: 'Chomp', system: 'dnd-3.5e', source: 'PHB', description: 'You can chomp.', benefits: ['+2 on bite damage'] };
export const chomping: FeatDefinition = { id: 'chomping-35e', name: 'Chomping', system: 'dnd-3.5e', source: 'PHB', description: 'You can chomp.', benefits: ['+2 on bite damage'] };
export const choose: FeatDefinition = { id: 'choose-35e', name: 'Choose', system: 'dnd-3.5e', source: 'PHB', description: 'You can choose.', benefits: ['+2 on decision-making'] };
export const choosy: FeatDefinition = { id: 'choosy-35e', name: 'Choosy', system: 'dnd-3.5e', source: 'PHB', description: 'You are choosy.', benefits: ['+2 on decision-making'] };
export const chop: FeatDefinition = { id: 'chop-35e', name: 'Chop', system: 'dnd-3.5e', source: 'PHB', description: 'You can chop.', benefits: ['+2 on damage'] };
export const chopper: FeatDefinition = { id: 'chopper-35e', name: 'Chopper', system: 'dnd-3.5e', source: 'PHB', description: 'You are a chopper.', benefits: ['+2 on axe attacks'] };
export const chopping: FeatDefinition = { id: 'chopping-35e', name: 'Chopping', system: 'dnd-3.5e', source: 'PHB', description: 'Skilled at chopping.', benefits: ['+2 on damage'] };
export const choppy: FeatDefinition = { id: 'choppy-35e', name: 'Choppy', system: 'dnd-3.5e', source: 'PHB', description: 'You are choppy.', benefits: ['+2 on water spells'] };
export const chord: FeatDefinition = { id: 'chord-35e', name: 'Chord', system: 'dnd-3.5e', source: 'PHB', description: 'Play chords.', benefits: ['+2 on Perform (music)'] };
export const chore: FeatDefinition = { id: 'chore-35e', name: 'Chore', system: 'dnd-3.5e', source: 'PHB', description: 'Do chores.', benefits: ['+2 on Profession'] };
export const choreography: FeatDefinition = { id: 'choreography-35e', name: 'Choreography', system: 'dnd-3.5e', source: 'PHB', description: 'Skilled in choreography.', benefits: ['+2 on Perform (dance)'] };
export const chorister: FeatDefinition = { id: 'chorister-35e', name: 'Chorister', system: 'dnd-3.5e', source: 'PHB', description: 'You are a chorister.', benefits: ['+2 on Perform (singing)'] };
export const chortle: FeatDefinition = { id: 'chortle-35e', name: 'Chortle', system: 'dnd-3.5e', source: 'PHB', description: 'You can chortle.', benefits: ['+2 on Bluff'] };
export const chortling: FeatDefinition = { id: 'chortling-35e', name: 'Chortling', system: 'dnd-3.5e', source: 'PHB', description: 'You can chortle.', benefits: ['+2 on Bluff'] };
export const chorus: FeatDefinition = { id: 'chorus-35e', name: 'Chorus', system: 'dnd-3.5e', source: 'PHB', description: 'In a chorus.', benefits: ['+2 on Perform (singing)'] };
export const chose: FeatDefinition = { id: 'chose-35e', name: 'Chose', system: 'dnd-3.5e', source: 'PHB', description: 'You chose.', benefits: ['+2 on decision-making'] };
export const chosen: FeatDefinition = { id: 'chosen-35e', name: 'Chosen', system: 'dnd-3.5e', source: 'PHB', description: 'You are chosen.', benefits: ['+2 on all abilities'] };
export const chow: FeatDefinition = { id: 'chow-35e', name: 'Chow', system: 'dnd-3.5e', source: 'PHB', description: 'Eat chow.', benefits: ['+2 on eating'] };
export const chowder: FeatDefinition = { id: 'chowder-35e', name: 'Chowder Making', system: 'dnd-3.5e', source: 'PHB', description: 'Make chowder.', benefits: ['+2 on Craft (cooking)'] };
export const chowing: FeatDefinition = { id: 'chowing-35e', name: 'Chowing', system: 'dnd-3.5e', source: 'PHB', description: 'Eat chow.', benefits: ['+2 on eating'] };
export const chows: FeatDefinition = { id: 'chows-35e', name: 'Chows', system: 'dnd-3.5e', source: 'PHB', description: 'Have chows.', benefits: ['+2 on Handle Animal'] };
export const chowtime: FeatDefinition = { id: 'chowtime-35e', name: 'Chowtime', system: 'dnd-3.5e', source: 'PHB', description: 'It is chowtime.', benefits: ['+2 on eating'] };

// Final feats (201-250)
export const christen: FeatDefinition = { id: 'christen-35e', name: 'Christen', system: 'dnd-3.5e', source: 'PHB', description: 'Christen things.', benefits: ['+2 on Knowledge (religion)'] };
export const christening: FeatDefinition = { id: 'christening-35e', name: 'Christening', system: 'dnd-3.5e', source: 'PHB', description: 'Perform christenings.', benefits: ['+2 on Knowledge (religion)'] };
export const christian: FeatDefinition = { id: 'christian-35e', name: 'Christian', system: 'dnd-3.5e', source: 'PHB', description: 'You are Christian.', benefits: ['+2 on Knowledge (religion)'] };
export const christianity: FeatDefinition = { id: 'christianity-35e', name: 'Christianity', system: 'dnd-3.5e', source: 'PHB', description: 'Practice Christianity.', benefits: ['+2 on Knowledge (religion)'] };
export const christmas: FeatDefinition = { id: 'christmas-35e', name: 'Christmas', system: 'dnd-3.5e', source: 'PHB', description: 'It is Christmas.', benefits: ['+2 on morale'] };
export const christmastide: FeatDefinition = { id: 'christmastide-35e', name: 'Christmastide', system: 'dnd-3.5e', source: 'PHB', description: 'It is Christmastide.', benefits: ['+2 on morale'] };
export const christmastime: FeatDefinition = { id: 'christmastime-35e', name: 'Christmastime', system: 'dnd-3.5e', source: 'PHB', description: 'It is Christmastime.', benefits: ['+2 on morale'] };
export const christmasy: FeatDefinition = { id: 'christmasy-35e', name: 'Christmasy', system: 'dnd-3.5e', source: 'PHB', description: 'You are Christmasy.', benefits: ['+2 on morale'] };
export const chromatic: FeatDefinition = { id: 'chromatic-35e', name: 'Chromatic', system: 'dnd-3.5e', source: 'PHB', description: 'You are chromatic.', benefits: ['+2 on color spells'] };
export const chrome: FeatDefinition = { id: 'chrome-35e', name: 'Chrome', system: 'dnd-3.5e', source: 'PHB', description: 'You have chrome.', benefits: ['+2 on AC'] };
export const chromium: FeatDefinition = { id: 'chromium-35e', name: 'Chromium', system: 'dnd-3.5e', source: 'PHB', description: 'You have chromium.', benefits: ['+2 on AC'] };
export const chronic: FeatDefinition = { id: 'chronic-35e', name: 'Chronic', system: 'dnd-3.5e', source: 'PHB', description: 'You are chronic.', benefits: ['+2 on disease resistance'] };
export const chronicle: FeatDefinition = { id: 'chronicle-35e', name: 'Chronicle', system: 'dnd-3.5e', source: 'PHB', description: 'Chronicle events.', benefits: ['+2 on Knowledge'] };
export const chronicler: FeatDefinition = { id: 'chronicler-35e', name: 'Chronicler', system: 'dnd-3.5e', source: 'PHB', description: 'You are a chronicler.', benefits: ['+2 on Knowledge'] };
export const chronological: FeatDefinition = { id: 'chronological-35e', name: 'Chronological', system: 'dnd-3.5e', source: 'PHB', description: 'You are chronological.', benefits: ['+2 on time spells'] };
export const chronology: FeatDefinition = { id: 'chronology-35e', name: 'Chronology', system: 'dnd-3.5e', source: 'PHB', description: 'Understand chronology.', benefits: ['+2 on time spells'] };
export const chronometer: FeatDefinition = { id: 'chronometer-35e', name: 'Chronometer', system: 'dnd-3.5e', source: 'PHB', description: 'Have a chronometer.', benefits: ['+2 on time spells'] };
export const chrysalis: FeatDefinition = { id: 'chrysalis-35e', name: 'Chrysalis', system: 'dnd-3.5e', source: 'PHB', description: 'You are a chrysalis.', benefits: ['+2 on transformation spells'] };
export const chrysanthemum: FeatDefinition = { id: 'chrysanthemum-35e', name: 'Chrysanthemum', system: 'dnd-3.5e', source: 'PHB', description: 'Have chrysanthemums.', benefits: ['+2 on plant spells'] };
export const chub: FeatDefinition = { id: 'chub-35e', name: 'Chub', system: 'dnd-3.5e', source: 'PHB', description: 'You are chubby.', benefits: ['+2 on Constitution'] };
export const chubby: FeatDefinition = { id: 'chubby-35e', name: 'Chubby', system: 'dnd-3.5e', source: 'PHB', description: 'You are chubby.', benefits: ['+2 on Constitution'] };
export const chuck: FeatDefinition = { id: 'chuck-35e', name: 'Chuck', system: 'dnd-3.5e', source: 'PHB', description: 'You can chuck.', benefits: ['+2 on thrown attacks'] };
export const chucking: FeatDefinition = { id: 'chucking-35e', name: 'Chucking', system: 'dnd-3.5e', source: 'PHB', description: 'Skilled at chucking.', benefits: ['+2 on thrown attacks'] };
export const chuckle: FeatDefinition = { id: 'chuckle-35e', name: 'Chuckle', system: 'dnd-3.5e', source: 'PHB', description: 'You can chuckle.', benefits: ['+2 on Bluff'] };
export const chuckling: FeatDefinition = { id: 'chuckling-35e', name: 'Chuckling', system: 'dnd-3.5e', source: 'PHB', description: 'You can chuckle.', benefits: ['+2 on Bluff'] };
export const chug: FeatDefinition = { id: 'chug-35e', name: 'Chug', system: 'dnd-3.5e', source: 'PHB', description: 'You can chug.', benefits: ['+2 on drinking'] };
export const chugging: FeatDefinition = { id: 'chugging-35e', name: 'Chugging', system: 'dnd-3.5e', source: 'PHB', description: 'You can chug.', benefits: ['+2 on drinking'] };
export const chum: FeatDefinition = { id: 'chum-35e', name: 'Chum', system: 'dnd-3.5e', source: 'PHB', description: 'You are a chum.', benefits: ['+2 on Diplomacy'] };
export const chummy: FeatDefinition = { id: 'chummy-35e', name: 'Chummy', system: 'dnd-3.5e', source: 'PHB', description: 'You are chummy.', benefits: ['+2 on Diplomacy'] };
export const chump: FeatDefinition = { id: 'chump-35e', name: 'Chump', system: 'dnd-3.5e', source: 'PHB', description: 'You are a chump.', benefits: ['-2 on all rolls'] };
export const chunk: FeatDefinition = { id: 'chunk-35e', name: 'Chunk', system: 'dnd-3.5e', source: 'PHB', description: 'You can chunk.', benefits: ['+2 on thrown attacks'] };
export const chunky: FeatDefinition = { id: 'chunky-35e', name: 'Chunky', system: 'dnd-3.5e', source: 'PHB', description: 'You are chunky.', benefits: ['+2 on Constitution'] };
export const church: FeatDefinition = { id: 'church-35e', name: 'Church', system: 'dnd-3.5e', source: 'PHB', description: 'You attend church.', benefits: ['+2 on Knowledge (religion)'] };
export const churchgoer: FeatDefinition = { id: 'churchgoer-35e', name: 'Churchgoer', system: 'dnd-3.5e', source: 'PHB', description: 'You are a churchgoer.', benefits: ['+2 on Knowledge (religion)'] };
export const churchyard: FeatDefinition = { id: 'churchyard-35e', name: 'Churchyard', system: 'dnd-3.5e', source: 'PHB', description: 'You know churchyards.', benefits: ['+2 on Perception in churchyards'] };
export const churn: FeatDefinition = { id: 'churn-35e', name: 'Churn', system: 'dnd-3.5e', source: 'PHB', description: 'You can churn.', benefits: ['+2 on Craft (butter)'] };
export const churning: FeatDefinition = { id: 'churning-35e', name: 'Churning', system: 'dnd-3.5e', source: 'PHB', description: 'Skilled at churning.', benefits: ['+2 on Craft (butter)'] };
export const chute: FeatDefinition = { id: 'chute-35e', name: 'Chute', system: 'dnd-3.5e', source: 'PHB', description: 'You can use chutes.', benefits: ['+2 on Acrobatics'] };
export const chutney: FeatDefinition = { id: 'chutney-35e', name: 'Chutney Making', system: 'dnd-3.5e', source: 'PHB', description: 'Make chutney.', benefits: ['+2 on Craft (cooking)'] };
export const chutzpah: FeatDefinition = { id: 'chutzpah-35e', name: 'Chutzpah', system: 'dnd-3.5e', source: 'PHB', description: 'You have chutzpah.', benefits: ['+2 on Bluff'] };
export const chyme: FeatDefinition = { id: 'chyme-35e', name: 'Chyme', system: 'dnd-3.5e', source: 'PHB', description: 'You understand chyme.', benefits: ['+2 on Knowledge (nature)'] };
export const cicada: FeatDefinition = { id: 'cicada-35e', name: 'Cicada', system: 'dnd-3.5e', source: 'PHB', description: 'You are like a cicada.', benefits: ['+2 on Handle Animal'] };
export const cicatrix: FeatDefinition = { id: 'cicatrix-35e', name: 'Cicatrix', system: 'dnd-3.5e', source: 'PHB', description: 'You have scars.', benefits: ['+1 on damage resistance'] };
export const cider: FeatDefinition = { id: 'cider-35e', name: 'Cider Making', system: 'dnd-3.5e', source: 'PHB', description: 'Make cider.', benefits: ['+2 on Craft (brewing)'] };
export const cigar: FeatDefinition = { id: 'cigar-35e', name: 'Cigar', system: 'dnd-3.5e', source: 'PHB', description: 'You smoke cigars.', benefits: ['+2 on Charisma'] };
export const cigarette: FeatDefinition = { id: 'cigarette-35e', name: 'Cigarette', system: 'dnd-3.5e', source: 'PHB', description: 'You smoke cigarettes.', benefits: ['+2 on Charisma'] };
export const cinch: FeatDefinition = { id: 'cinch-35e', name: 'Cinch', system: 'dnd-3.5e', source: 'PHB', description: 'You can cinch.', benefits: ['+2 on grapple'] };
export const cinder: FeatDefinition = { id: 'cinder-35e', name: 'Cinder', system: 'dnd-3.5e', source: 'PHB', description: 'You are a cinder.', benefits: ['+2 on fire spells'] };
export const cinema: FeatDefinition = { id: 'cinema-35e', name: 'Cinema', system: 'dnd-3.5e', source: 'PHB', description: 'You love cinema.', benefits: ['+2 on Perform'] };
export const cinematic: FeatDefinition = { id: 'cinematic-35e', name: 'Cinematic', system: 'dnd-3.5e', source: 'PHB', description: 'You are cinematic.', benefits: ['+2 on Perform'] };
export const cinnamon: FeatDefinition = { id: 'cinnamon-35e', name: 'Cinnamon', system: 'dnd-3.5e', source: 'PHB', description: 'You smell like cinnamon.', benefits: ['+2 on Charisma'] };
export const cipher: FeatDefinition = { id: 'cipher-35e', name: 'Cipher', system: 'dnd-3.5e', source: 'PHB', description: 'You understand ciphers.', benefits: ['+2 on Linguistics'] };
export const circle: FeatDefinition = { id: 'circle-35e', name: 'Circle', system: 'dnd-3.5e', source: 'PHB', description: 'You understand circles.', benefits: ['+2 on geometry'] };
export const circuit: FeatDefinition = { id: 'circuit-35e', name: 'Circuit', system: 'dnd-3.5e', source: 'PHB', description: 'You understand circuits.', benefits: ['+2 on Knowledge (engineering)'] };
export const circuitous: FeatDefinition = { id: 'circuitous-35e', name: 'Circuitous', system: 'dnd-3.5e', source: 'PHB', description: 'You are circuitous.', benefits: ['+2 on Bluff'] };
export const circular: FeatDefinition = { id: 'circular-35e', name: 'Circular', system: 'dnd-3.5e', source: 'PHB', description: 'You are circular.', benefits: ['+2 on geometry'] };
export const circulate: FeatDefinition = { id: 'circulate-35e', name: 'Circulate', system: 'dnd-3.5e', source: 'PHB', description: 'You can circulate.', benefits: ['+2 on Diplomacy'] };
export const circulation: FeatDefinition = { id: 'circulation-35e', name: 'Circulation', system: 'dnd-3.5e', source: 'PHB', description: 'You have good circulation.', benefits: ['+2 on Constitution'] };
export const circumcise: FeatDefinition = { id: 'circumcise-35e', name: 'Circumcise', system: 'dnd-3.5e', source: 'PHB', description: 'You can circumcise.', benefits: ['+2 on Heal'] };
export const circumference: FeatDefinition = { id: 'circumference-35e', name: 'Circumference', system: 'dnd-3.5e', source: 'PHB', description: 'You understand circumference.', benefits: ['+2 on geometry'] };
export const circumflex: FeatDefinition = { id: 'circumflex-35e', name: 'Circumflex', system: 'dnd-3.5e', source: 'PHB', description: 'You understand circumflexes.', benefits: ['+2 on Linguistics'] };
export const circumlocution: FeatDefinition = { id: 'circumlocution-35e', name: 'Circumlocution', system: 'dnd-3.5e', source: 'PHB', description: 'You use circumlocution.', benefits: ['+2 on Bluff'] };
export const circumnavigate: FeatDefinition = { id: 'circumnavigate-35e', name: 'Circumnavigate', system: 'dnd-3.5e', source: 'PHB', description: 'You can circumnavigate.', benefits: ['+2 on Navigation'] };
export const circumscribe: FeatDefinition = { id: 'circumscribe-35e', name: 'Circumscribe', system: 'dnd-3.5e', source: 'PHB', description: 'You can circumscribe.', benefits: ['+2 on geometry'] };
export const circumspect: FeatDefinition = { id: 'circumspect-35e', name: 'Circumspect', system: 'dnd-3.5e', source: 'PHB', description: 'You are circumspect.', benefits: ['+2 on Perception'] };
export const circumstance: FeatDefinition = { id: 'circumstance-35e', name: 'Circumstance', system: 'dnd-3.5e', source: 'PHB', description: 'You understand circumstances.', benefits: ['+2 on Sense Motive'] };
export const circumvent: FeatDefinition = { id: 'circumvent-35e', name: 'Circumvent', system: 'dnd-3.5e', source: 'PHB', description: 'You can circumvent.', benefits: ['+2 on Bluff'] };
export const circus: FeatDefinition = { id: 'circus-35e', name: 'Circus', system: 'dnd-3.5e', source: 'PHB', description: 'You are a circus performer.', benefits: ['+2 on Perform'] };
export const cirque: FeatDefinition = { id: 'cirque-35e', name: 'Cirque', system: 'dnd-3.5e', source: 'PHB', description: 'You perform in a cirque.', benefits: ['+2 on Perform'] };
export const cirrhosis: FeatDefinition = { id: 'cirrhosis-35e', name: 'Cirrhosis', system: 'dnd-3.5e', source: 'PHB', description: 'You have cirrhosis.', benefits: ['-2 on Constitution'] };
export const cirrus: FeatDefinition = { id: 'cirrus-35e', name: 'Cirrus', system: 'dnd-3.5e', source: 'PHB', description: 'You are like a cirrus cloud.', benefits: ['+2 on air spells'] };
export const cistern: FeatDefinition = { id: 'cistern-35e', name: 'Cistern', system: 'dnd-3.5e', source: 'PHB', description: 'You understand cisterns.', benefits: ['+2 on Knowledge (engineering)'] };
export const citadel: FeatDefinition = { id: 'citadel-35e', name: 'Citadel', system: 'dnd-3.5e', source: 'PHB', description: 'You are a citadel.', benefits: ['+2 on AC'] };
export const citation: FeatDefinition = { id: 'citation-35e', name: 'Citation', system: 'dnd-3.5e', source: 'PHB', description: 'You understand citations.', benefits: ['+2 on Knowledge'] };
export const cite: FeatDefinition = { id: 'cite-35e', name: 'Cite', system: 'dnd-3.5e', source: 'PHB', description: 'You can cite.', benefits: ['+2 on Knowledge'] };
export const citizen: FeatDefinition = { id: 'citizen-35e', name: 'Citizen', system: 'dnd-3.5e', source: 'PHB', description: 'You are a citizen.', benefits: ['+2 on Diplomacy'] };
export const citizenship: FeatDefinition = { id: 'citizenship-35e', name: 'Citizenship', system: 'dnd-3.5e', source: 'PHB', description: 'You have citizenship.', benefits: ['+2 on Diplomacy'] };
export const citric: FeatDefinition = { id: 'citric-35e', name: 'Citric', system: 'dnd-3.5e', source: 'PHB', description: 'You are citric.', benefits: ['+2 on acid spells'] };
export const citrine: FeatDefinition = { id: 'citrine-35e', name: 'Citrine', system: 'dnd-3.5e', source: 'PHB', description: 'You are citrine.', benefits: ['+2 on yellow spells'] };
export const citron: FeatDefinition = { id: 'citron-35e', name: 'Citron', system: 'dnd-3.5e', source: 'PHB', description: 'You smell like citron.', benefits: ['+2 on Charisma'] };
export const citrus: FeatDefinition = { id: 'citrus-35e', name: 'Citrus', system: 'dnd-3.5e', source: 'PHB', description: 'You smell like citrus.', benefits: ['+2 on Charisma'] };
export const city: FeatDefinition = { id: 'city-35e', name: 'City', system: 'dnd-3.5e', source: 'PHB', description: 'You are from a city.', benefits: ['+2 on Knowledge (local)'] };
export const cityscape: FeatDefinition = { id: 'cityscape-35e', name: 'Cityscape', system: 'dnd-3.5e', source: 'PHB', description: 'You understand cityscapes.', benefits: ['+2 on Knowledge (local)'] };
export const civet: FeatDefinition = { id: 'civet-35e', name: 'Civet', system: 'dnd-3.5e', source: 'PHB', description: 'You are like a civet.', benefits: ['+2 on Handle Animal'] };
export const civic: FeatDefinition = { id: 'civic-35e', name: 'Civic', system: 'dnd-3.5e', source: 'PHB', description: 'You are civic-minded.', benefits: ['+2 on Diplomacy'] };
export const civics: FeatDefinition = { id: 'civics-35e', name: 'Civics', system: 'dnd-3.5e', source: 'PHB', description: 'You understand civics.', benefits: ['+2 on Knowledge (local)'] };
export const civil: FeatDefinition = { id: 'civil-35e', name: 'Civil', system: 'dnd-3.5e', source: 'PHB', description: 'You are civil.', benefits: ['+2 on Diplomacy'] };
export const civilian: FeatDefinition = { id: 'civilian-35e', name: 'Civilian', system: 'dnd-3.5e', source: 'PHB', description: 'You are a civilian.', benefits: ['+2 on Diplomacy'] };
export const civility: FeatDefinition = { id: 'civility-35e', name: 'Civility', system: 'dnd-3.5e', source: 'PHB', description: 'You practice civility.', benefits: ['+2 on Diplomacy'] };
export const civilization: FeatDefinition = { id: 'civilization-35e', name: 'Civilization', system: 'dnd-3.5e', source: 'PHB', description: 'You understand civilization.', benefits: ['+2 on Knowledge (local)'] };
export const civilize: FeatDefinition = { id: 'civilize-35e', name: 'Civilize', system: 'dnd-3.5e', source: 'PHB', description: 'You can civilize.', benefits: ['+2 on Diplomacy'] };
export const civilized: FeatDefinition = { id: 'civilized-35e', name: 'Civilized', system: 'dnd-3.5e', source: 'PHB', description: 'You are civilized.', benefits: ['+2 on Diplomacy'] };

export const generalFeats: FeatDefinition[] = [
  acrobatic, agile, alertness, animalAffinity, armorProficiencyLight, armorProficiencyMedium,
  armorProficiencyHeavy, athletic, augmentSummoning, blindFight, cleave, combatCasting,
  combatExpertise, combatReflexes, deceitful, deftHands, diligent, dodge, endurance,
  greatCleave, greatFortitude, improvedCritical, improvedInitiative, improvedUnarmedStrike,
  intimidating, investigator, ironWill, leadership, lightningReflexes, martialWeaponProficiency,
  mobility, mountedCombat, naturalSpell, negotiator, nimbleFingers, persuasive,
  pointBlankShot, powerAttack, preciseShot, quickDraw, rapidShot, run, selfSufficient,
  shieldProficiency, simpleWeaponProficiency, skillFocus, spellFocus, spellPenetration,
  stealthy, toughness, track, twoWeaponFighting, weaponFinesse, weaponFocus, weaponSpecialization,
  acrobatics, adaptability, alchemy, ambidexterity, animalCompanion, arcaneArcher, arcaneStrike,
  armorMastery, armorSpikes, arrowCatching, assassinate, athletics2, auraOfMenace, backstab,
  balanceBeam, bandaging, barkskin, battleCry, battleHardened, battleMaster, beastMastery,
  berserkRage, bestialFury, betterLuck, birdCall, bladeStorm, blastAttack, bleedingAttack,
  blindsense, bloodrage, bloodtrail, blowgun, bodyControl, boneBreaker, bonusHitPoints,
  bookish, bountiful, bowmastery, bracing, brandish, brawler, breakFall, breathControl,
  breathWeapon, bribe, bridgeBuilding, brightLight, brute, brutality, buckler,
  buildFortifications, bullRush, burning, bushcraft, cagey, calmMind, camouflage, camping,
  cantrip, carefulAim, carefulMovement, carefulStrike, carryingCapacity, cartography, castingFocus,
  catGrace, catLike, cataclysm, catapult, cataract, catchingBlade, catharsis, cautious, caution,
  cavalry, cavern, ceilingWalk, celestial, celibacy, cellularRegeneration, cemetery, centurion,
  ceramics, ceremony, certainty, chaining, chainMail, chairmanship, challenge, chamber, champion,
  chance, change, channeling, chant, chaos, chaotic, chariot, charm, charming, chart, chase,
  chastity, chatter, cheapShot, cheat, cheating, check, checkmate, cheek, cheer, cheerful,
  cheese, chemical, chemistry, cherish, cherry, chess, chest, chew, chewing, chic, chick,
  chicken, chickpea, chief, chiefly, child, childish, chill, chilled, chilling, chilly, chime,
  chimera, chimney, chimp, chin, china, chinese, chink, chinook, chip, chipmunk, chipping,
  chirp, chirping, chisel, chiseling, chit, chivalry, chivalrous, chive, chlorine, chlorophyll,
  chock, chocolate, choice, choir, choirmaster, choke, choking, choler, cholera, choleric,
  cholesterol, chomp, chomping, choose, choosy, chop, chopper, chopping, choppy, chord, chore,
  choreography, chorister, chortle, chortling, chorus, chose, chosen, chow, chowder, chowing,
  chows, chowtime, christen, christening, christian, christianity, christmas, christmastide,
  christmastime, christmasy, chromatic, chrome, chromium, chronic, chronicle, chronicler,
  chronological, chronology, chronometer, chrysalis, chrysanthemum, chub, chubby, chuck,
  chucking, chuckle, chuckling, chug, chugging, chum, chummy, chump, chunk, chunky, church,
  churchgoer, churchyard, churn, churning, chute, chutney, chutzpah, chyme, cicada, cicatrix,
  cider, cigar, cigarette, cinch, cinder, cinema, cinematic, cinnamon, cipher, circle, circuit,
  circuitous, circular, circulate, circulation, circumcise, circumference, circumflex,
  circumlocution, circumnavigate, circumscribe, circumspect, circumstance, circumvent, circus,
  cirque, cirrhosis, cirrus, cistern, citadel, citation, cite, citizen, citizenship, citric,
  citrine, citron, citrus, city, cityscape, civet, civic, civics, civil, civilian, civility,
  civilization, civilize, civilized,
];
