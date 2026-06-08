/**
 * Pathfinder 1e Combat Feats - Core Rulebook
 *
 * Derived from the Pathfinder Reference Document (Core Rulebook) and released
 * under the Open Gaming License v1.0a.
 */

import { FeatDefinition } from '../../../../types/character-options/feats';

export const combatFeats: FeatDefinition[] = [
  {
    id: 'agile-maneuvers-pf1e',
    name: 'Agile Maneuvers',
    system: 'pf1e',
    source: 'CRB',
    description:
      'You learned to use your quickness in place of brute force when performing combat maneuvers.',
    benefits: [
      'You add your Dexterity bonus to your base attack bonus and size bonus when determining your Combat Maneuver Bonus instead of your Strength bonus',
    ],
  },
  {
    id: 'arcane-strike-pf1e',
    name: 'Arcane Strike',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'other',
        description: 'Ability to cast arcane spells',
      },
    ],
    description: 'You draw upon your arcane power to enhance your weapons with magical energy.',
    benefits: [
      'As a swift action, you can imbue your weapons with a fraction of your power. For 1 round, your weapons deal +1 damage and are treated as magic for overcoming DR',
    ],
  },
  {
    id: 'blind-fight-pf1e',
    name: 'Blind-Fight',
    system: 'pf1e',
    source: 'CRB',
    description: 'You are skilled at attacking opponents that you cannot clearly perceive.',
    benefits: [
      'In melee, every time you miss because of concealment, you can reroll your miss chance once',
      'Invisible attackers get no advantages related to hitting you in melee',
      'You take only half the usual penalty to speed for being unable to see',
    ],
  },
  {
    id: 'cleave-pf1e',
    name: 'Cleave',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'ability',
        ability: 'str',
        value: 13,
      },
      {
        type: 'other',
        description: 'Power Attack, base attack bonus +1',
      },
    ],
    description: 'You can strike two adjacent foes with a single swing.',
    benefits: [
      'As a standard action, you can make a single attack at your full base attack bonus against a foe within reach. If you hit, you deal damage normally and can make an additional attack against a foe adjacent to the first',
    ],
  },
  {
    id: 'combat-casting-pf1e',
    name: 'Combat Casting',
    system: 'pf1e',
    source: 'CRB',
    description: 'You are adept at spellcasting when threatened or distracted.',
    benefits: [
      '+4 bonus on concentration checks made to cast a spell or use a spell-like ability when casting on the defensive or while grappled',
    ],
  },
  {
    id: 'combat-expertise-pf1e',
    name: 'Combat Expertise',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'ability',
        ability: 'int',
        value: 13,
      },
    ],
    description: 'You can increase your defense at the expense of your accuracy.',
    benefits: [
      'You can choose to take a –1 penalty on melee attack rolls and combat maneuver checks to gain a +1 dodge bonus to your Armor Class. When your base attack bonus reaches +4 and every +4 thereafter, the penalty increases by –1 and the dodge bonus increases by +1',
    ],
  },
  {
    id: 'combat-reflexes-pf1e',
    name: 'Combat Reflexes',
    system: 'pf1e',
    source: 'CRB',
    description: 'You can make additional attacks of opportunity.',
    benefits: [
      'You may make a number of additional attacks of opportunity per round equal to your Dexterity bonus',
      'You can make attacks of opportunity while flat-footed',
    ],
  },
  {
    id: 'critical-focus-pf1e',
    name: 'Critical Focus',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'other',
        description: 'Base attack bonus +9',
      },
    ],
    description: 'You are trained in the art of causing pain.',
    benefits: ['+4 circumstance bonus on attack rolls made to confirm critical hits'],
  },
  {
    id: 'deadly-aim-pf1e',
    name: 'Deadly Aim',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'ability',
        ability: 'dex',
        value: 13,
      },
      {
        type: 'other',
        description: 'Base attack bonus +1',
      },
    ],
    description:
      "You can make exceptionally deadly ranged attacks by pinpointing a foe's weak spot.",
    benefits: [
      'You can choose to take a –1 penalty on all ranged attack rolls to gain a +2 bonus on all ranged damage rolls. When your base attack bonus reaches +4 and every +4 thereafter, the penalty increases by –1 and the bonus to damage increases by +2',
    ],
  },
  {
    id: 'defensive-combat-training-pf1e',
    name: 'Defensive Combat Training',
    system: 'pf1e',
    source: 'CRB',
    description: 'You excel at defending yourself from all manner of combat maneuvers.',
    benefits: [
      'You treat your total Hit Dice as your base attack bonus for the purpose of calculating your Combat Maneuver Defense',
    ],
  },
  {
    id: 'dodge-pf1e',
    name: 'Dodge',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'ability',
        ability: 'dex',
        value: 13,
      },
    ],
    description:
      "Your training and reflexes allow you to react swiftly to avoid an opponent's attacks.",
    benefits: ['+1 dodge bonus to AC'],
  },
  {
    id: 'double-slice-pf1e',
    name: 'Double Slice',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'ability',
        ability: 'dex',
        value: 15,
      },
      {
        type: 'other',
        description: 'Two-Weapon Fighting',
      },
    ],
    description: 'Your off-hand weapon while dual-wielding strikes with greater power.',
    benefits: ['Add your Strength bonus to damage rolls made with your off-hand weapon'],
  },
  {
    id: 'endurance-pf1e',
    name: 'Endurance',
    system: 'pf1e',
    source: 'CRB',
    description: 'Harsh conditions or long exertions do not easily tire you.',
    benefits: [
      '+4 bonus on checks and saves to avoid nonlethal damage from forced marches, starvation, thirst, hot or cold environments',
      'May sleep in light or medium armor without becoming fatigued',
    ],
  },
  {
    id: 'great-cleave-pf1e',
    name: 'Great Cleave',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'ability',
        ability: 'str',
        value: 13,
      },
      {
        type: 'other',
        description: 'Cleave, Power Attack, base attack bonus +4',
      },
    ],
    description: 'You can strike many adjacent foes with a single blow.',
    benefits: [
      'As a full-round action, you can make a single attack at your full base attack bonus against a foe within reach. If you hit, you deal damage normally and can make an additional attack against a foe adjacent to the previous target',
    ],
  },
  {
    id: 'great-fortitude-pf1e',
    name: 'Great Fortitude',
    system: 'pf1e',
    source: 'CRB',
    description: 'You are resistant to poisons, diseases, and other maladies.',
    benefits: ['+2 bonus on all Fortitude saving throws'],
  },
  {
    id: 'improved-critical-pf1e',
    name: 'Improved Critical',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'other',
        description: 'Proficient with weapon, base attack bonus +8',
      },
    ],
    description: 'Attacks made with your chosen weapon are quite deadly.',
    benefits: ['The threat range for your chosen weapon is doubled'],
  },
  {
    id: 'improved-initiative-pf1e',
    name: 'Improved Initiative',
    system: 'pf1e',
    source: 'CRB',
    description: 'Your quick reflexes allow you to react rapidly to danger.',
    benefits: ['+4 bonus on initiative checks'],
  },
  {
    id: 'improved-unarmed-strike-pf1e',
    name: 'Improved Unarmed Strike',
    system: 'pf1e',
    source: 'CRB',
    description: 'You are skilled at fighting while unarmed.',
    benefits: [
      'You are considered to be armed even when unarmed',
      'Your unarmed strikes can deal lethal or nonlethal damage',
    ],
  },
  {
    id: 'intimidating-prowess-pf1e',
    name: 'Intimidating Prowess',
    system: 'pf1e',
    source: 'CRB',
    description: 'Your physical might is intimidating to others.',
    benefits: [
      'Add your Strength modifier to Intimidate skill checks in addition to your Charisma modifier',
    ],
  },
  {
    id: 'iron-will-pf1e',
    name: 'Iron Will',
    system: 'pf1e',
    source: 'CRB',
    description: 'You are more resistant to mental effects.',
    benefits: ['+2 bonus on all Will saving throws'],
  },
  {
    id: 'lightning-reflexes-pf1e',
    name: 'Lightning Reflexes',
    system: 'pf1e',
    source: 'CRB',
    description: 'You have faster reflexes than normal.',
    benefits: ['+2 bonus on all Reflex saving throws'],
  },
  {
    id: 'mobility-pf1e',
    name: 'Mobility',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'ability',
        ability: 'dex',
        value: 13,
      },
      {
        type: 'other',
        description: 'Dodge',
      },
    ],
    description: 'You can easily move through a dangerous melee.',
    benefits: [
      '+4 dodge bonus to Armor Class against attacks of opportunity caused when you move out of or within a threatened area',
    ],
  },
  {
    id: 'mounted-combat-pf1e',
    name: 'Mounted Combat',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'other',
        description: 'Ride 1 rank',
      },
    ],
    description: 'You are adept at guiding your mount through combat.',
    benefits: [
      'Once per round when your mount is hit in combat, you may attempt a Ride check to negate the hit',
    ],
  },
  {
    id: 'point-blank-shot-pf1e',
    name: 'Point-Blank Shot',
    system: 'pf1e',
    source: 'CRB',
    description: 'You are especially accurate when making ranged attacks against close targets.',
    benefits: [
      '+1 bonus on attack and damage rolls with ranged weapons at ranges of up to 30 feet',
    ],
  },
  {
    id: 'power-attack-pf1e',
    name: 'Power Attack',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'ability',
        ability: 'str',
        value: 13,
      },
      {
        type: 'other',
        description: 'Base attack bonus +1',
      },
    ],
    description:
      'You can make exceptionally deadly melee attacks by sacrificing accuracy for strength.',
    benefits: [
      'You can choose to take a –1 penalty on all melee attack rolls and combat maneuver checks to gain a +2 bonus on all melee damage rolls. When your base attack bonus reaches +4 and every 4 points thereafter, the penalty increases by –1 and the bonus to damage increases by +2',
    ],
  },
  {
    id: 'precise-shot-pf1e',
    name: 'Precise Shot',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'other',
        description: 'Point-Blank Shot',
      },
    ],
    description: 'You are adept at firing ranged attacks into melee.',
    benefits: [
      'You can shoot or throw ranged weapons at an opponent engaged in melee without taking the standard –4 penalty on your attack roll',
    ],
  },
  {
    id: 'quick-draw-pf1e',
    name: 'Quick Draw',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'other',
        description: 'Base attack bonus +1',
      },
    ],
    description: 'You can draw weapons faster than most.',
    benefits: [
      'You can draw a weapon as a free action instead of as a move action',
      'You can draw a hidden weapon as a move action',
    ],
  },
  {
    id: 'rapid-shot-pf1e',
    name: 'Rapid Shot',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'ability',
        ability: 'dex',
        value: 13,
      },
      {
        type: 'other',
        description: 'Point-Blank Shot',
      },
    ],
    description: 'You can make an additional ranged attack.',
    benefits: [
      'When making a full-attack action with a ranged weapon, you can fire one additional time this round. All of your attack rolls take a –2 penalty when using Rapid Shot',
    ],
  },
  {
    id: 'run-pf1e',
    name: 'Run',
    system: 'pf1e',
    source: 'CRB',
    description: 'You are swift of foot.',
    benefits: [
      'When running, you move five times your normal speed instead of four times',
      '+4 bonus on Acrobatics checks made to jump',
    ],
  },
  {
    id: 'shield-focus-pf1e',
    name: 'Shield Focus',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'other',
        description: 'Shield Proficiency, base attack bonus +1',
      },
    ],
    description: 'You are skilled at deflecting blows with your shield.',
    benefits: ['Increase the AC bonus granted by any shield you are using by 1'],
  },
  {
    id: 'step-up-pf1e',
    name: 'Step Up',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'other',
        description: 'Base attack bonus +1',
      },
    ],
    description: 'You can close the distance when a foe tries to move away.',
    benefits: [
      'Whenever an adjacent foe attempts to take a 5-foot step away from you, you may also take a 5-foot step as an immediate action so long as you end up adjacent to the foe',
    ],
  },
  {
    id: 'stunning-fist-pf1e',
    name: 'Stunning Fist',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'ability',
        ability: 'dex',
        value: 13,
      },
      {
        type: 'ability',
        ability: 'wis',
        value: 13,
      },
      {
        type: 'other',
        description: 'Improved Unarmed Strike, base attack bonus +8',
      },
    ],
    description: 'You know just where to strike to temporarily stun a foe.',
    benefits: [
      'You must declare that you are using this feat before you make your attack roll. On a successful hit, the target must succeed on a Fortitude save or be stunned for 1 round',
    ],
  },
  {
    id: 'toughness-pf1e',
    name: 'Toughness',
    system: 'pf1e',
    source: 'CRB',
    description: 'You have enhanced physical stamina.',
    benefits: ['+3 hit points, +1 hit point per Hit Die beyond 3'],
  },
  {
    id: 'two-weapon-fighting-pf1e',
    name: 'Two-Weapon Fighting',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'ability',
        ability: 'dex',
        value: 15,
      },
    ],
    description: 'You can fight with a weapon in each of your hands.',
    benefits: [
      'Your penalties on attack rolls for fighting with two weapons are reduced. The penalty for your primary hand lessens by 2 and the one for your off hand lessens by 6',
    ],
  },
  {
    id: 'vital-strike-pf1e',
    name: 'Vital Strike',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'other',
        description: 'Base attack bonus +6',
      },
    ],
    description: 'You make a single attack that deals significantly more damage than normal.',
    benefits: [
      "When you use the attack action, you can make one attack at your highest base attack bonus that deals additional damage. Roll the weapon's damage dice for the attack twice and add the results together before adding bonuses from Strength, weapon abilities, precision-based damage, and other damage bonuses",
    ],
  },
  {
    id: 'weapon-finesse-pf1e',
    name: 'Weapon Finesse',
    system: 'pf1e',
    source: 'CRB',
    description:
      'You are trained in using your agility in melee combat, as opposed to brute strength.',
    benefits: [
      'With a light weapon, rapier, whip, or spiked chain made for a creature of your size category, you may use your Dexterity modifier instead of your Strength modifier on attack rolls',
    ],
  },
  {
    id: 'weapon-focus-pf1e',
    name: 'Weapon Focus',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'other',
        description: 'Proficiency with selected weapon, base attack bonus +1',
      },
    ],
    description: 'You are especially good at using your chosen weapon.',
    benefits: ['+1 bonus on all attack rolls you make using the selected weapon'],
  },
  {
    id: 'weapon-specialization-pf1e',
    name: 'Weapon Specialization',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'other',
        description: 'Weapon Focus with selected weapon, fighter level 4',
      },
    ],
    description: 'You deal extra damage when using your chosen weapon.',
    benefits: ['+2 bonus on all damage rolls you make using the selected weapon'],
  },
  {
    id: 'whirlwind-attack-pf1e',
    name: 'Whirlwind Attack',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'ability',
        ability: 'dex',
        value: 13,
      },
      {
        type: 'ability',
        ability: 'int',
        value: 13,
      },
      {
        type: 'other',
        description: 'Combat Expertise, Dodge, Mobility, Spring Attack, base attack bonus +4',
      },
    ],
    description: 'You can strike out at every foe within reach.',
    benefits: [
      'When you use a full-round action to make a melee attack, you can give up your regular attacks and instead make one melee attack at your highest base attack bonus against each opponent within reach',
    ],
  },
  {
    id: 'improved-disarm-pf1e',
    name: 'Improved Disarm',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'other',
        description: 'Combat Expertise, Intelligence 13',
      },
    ],
    description: 'You do not provoke attacks of opportunity when disarming.',
    benefits: [
      'Do not provoke attacks of opportunity when attempting to disarm an opponent',
      '+2 bonus on checks made to disarm a foe',
    ],
  },
  {
    id: 'improved-grapple-pf1e',
    name: 'Improved Grapple',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'other',
        description: 'Improved Unarmed Strike, Dexterity 13',
      },
    ],
    description: 'You do not provoke attacks of opportunity when grappling.',
    benefits: [
      'Do not provoke attacks of opportunity when attempting to grapple an opponent',
      '+2 bonus on checks made to grapple a foe',
    ],
  },
  {
    id: 'improved-trip-pf1e',
    name: 'Improved Trip',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'other',
        description: 'Combat Expertise, Intelligence 13',
      },
    ],
    description: 'You do not provoke attacks of opportunity when tripping.',
    benefits: [
      'Do not provoke attacks of opportunity when attempting to trip an opponent',
      '+2 bonus on checks made to trip a foe',
    ],
  },
  {
    id: 'improved-two-weapon-fighting-pf1e',
    name: 'Improved Two-Weapon Fighting',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'ability',
        ability: 'dex',
        value: 17,
      },
      {
        type: 'other',
        description: 'Two-Weapon Fighting, base attack bonus +6',
      },
    ],
    description: 'You can make an additional attack with your off-hand weapon.',
    benefits: ['Make a second attack with off-hand weapon at -5 penalty'],
  },
  {
    id: 'greater-two-weapon-fighting-pf1e',
    name: 'Greater Two-Weapon Fighting',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'ability',
        ability: 'dex',
        value: 19,
      },
      {
        type: 'other',
        description: 'Improved Two-Weapon Fighting, base attack bonus +11',
      },
    ],
    description: 'You can make a third attack with your off-hand weapon.',
    benefits: ['Make a third attack with off-hand weapon at -10 penalty'],
  },
  {
    id: 'improved-shield-bash-pf1e',
    name: 'Improved Shield Bash',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'other',
        description: 'Shield Proficiency',
      },
    ],
    description: 'You can bash with your shield and retain full AC.',
    benefits: ['Retain full shield AC bonus when shield bashing'],
  },
  {
    id: 'spring-attack-pf1e',
    name: 'Spring Attack',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'ability',
        ability: 'dex',
        value: 13,
      },
      {
        type: 'other',
        description: 'Dodge, Mobility, base attack bonus +4',
      },
    ],
    description: 'You can move before and after attacking.',
    benefits: [
      'Move before and after making a melee attack without provoking attacks of opportunity from the target',
    ],
  },
  {
    id: 'manyshot-pf1e',
    name: 'Manyshot',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'ability',
        ability: 'dex',
        value: 15,
      },
      {
        type: 'other',
        description: 'Point-Blank Shot, Rapid Shot, base attack bonus +6',
      },
    ],
    description: 'You can fire multiple arrows at once.',
    benefits: [
      'Fire two arrows at a single target as a standard action, taking the highest attack roll for both',
    ],
  },
  {
    id: 'arcane-armor-mastery-pf1e',
    name: 'Arcane Armor Mastery',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'other',
        description: 'Arcane Armor Training',
      },
      {
        type: 'other',
        description: 'Medium Armor Proficiency',
      },
      {
        type: 'other',
        description: 'caster level 7th',
      },
    ],
    description: 'You have mastered the ability to cast spells while wearing armor.',
    benefits: [
      'As a swift action, reduce the arcane spell failure chance due to the armor you are wearing by 20% for any spells you cast this round. This bonus replaces, and does not stack with, the bonus granted by Arcane Armor Training.',
    ],
  },
  {
    id: 'arcane-armor-training-pf1e',
    name: 'Arcane Armor Training',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'other',
        description: 'Light Armor Proficiency',
      },
      {
        type: 'other',
        description: 'caster level 3rd',
      },
    ],
    description: 'You have learned how to cast spells while wearing armor.',
    benefits: [
      'As a swift action, reduce the arcane spell failure chance due to the armor you are wearing by 10% for any spells you cast this round.',
    ],
  },
  {
    id: 'bleeding-critical-pf1e',
    name: 'Bleeding Critical',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'other',
        description: 'Critical Focus',
      },
      {
        type: 'other',
        description: 'base attack bonus +11',
      },
    ],
    description: 'Your critical hits cause opponents to bleed profusely.',
    benefits: [
      'Whenever you score a critical hit with a slashing or piercing weapon, your opponent takes 2d6 points of bleed damage (see Conditions) each round on his turn, in addition to the damage dealt by the critical hit. Bleed damage can be stopped by a DC 15 Heal skill check or through any magical healing. The effects of this feat stack.',
    ],
    special:
      'You can only apply the effects of one critical feat to a given critical hit unless you possess Critical Mastery.',
  },
  {
    id: 'blinding-critical-pf1e',
    name: 'Blinding Critical',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'other',
        description: 'Critical Focus',
      },
      {
        type: 'other',
        description: 'base attack bonus +15',
      },
    ],
    description: 'Your critical hits blind your opponents.',
    benefits: [
      "Whenever you score a critical hit, your opponent is permanently blinded. A successful Fortitude save reduces this to dazzled for 1d4 rounds. The DC of this Fortitude save is equal to 10 + your base attack bonus. This feat has no effect on creatures that do not rely on eyes for sight or creatures with more than two eyes (although multiple critical hits might cause blindness, at the GM's discretion). Blindness can be cured by heal, regeneration, remove blindness, or similar abilities.",
    ],
    special:
      'You can only apply the effects of one critical feat to a given critical hit unless you possess Critical Mastery.',
  },
  {
    id: 'catch-off-guard-pf1e',
    name: 'Catch Off-Guard',
    system: 'pf1e',
    source: 'CRB',
    description: 'Foes are surprised by your skilled use of unorthodox and improvised weapons.',
    benefits: [
      'You do not suffer any penalties for using an improvised melee weapon. Unarmed opponents are flat-footed against any attacks you make with an improvised melee weapon.',
    ],
  },
  {
    id: 'channel-smite-pf1e',
    name: 'Channel Smite',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'other',
        description: 'Channel energy class feature',
      },
    ],
    description: 'You can channel your divine energy through a melee weapon you wield.',
    benefits: [
      'Before you make a melee attack roll, you can choose to spend one use of your channel energy ability as a swift action. If you channel positive energy and you hit an undead creature, that creature takes an amount of additional damage equal to the damage dealt by your channel positive energy ability. If you channel negative energy and you hit a living creature, that creature takes an amount of additional damage equal to the damage dealt by your channel negative energy ability. Your target can make a Will save, as normal, to halve this additional damage. If your attack misses, the channel energy ability is still expended with no effect.',
    ],
  },
  {
    id: 'critical-mastery-pf1e',
    name: 'Critical Mastery',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'other',
        description: 'Critical Focus',
      },
      {
        type: 'other',
        description: 'any two critical feats',
      },
      {
        type: 'other',
        description: '14th-level fighter',
      },
    ],
    description: 'Your critical hits cause two additional effects.',
    benefits: [
      'When you score a critical hit, you can apply the effects of two critical feats in addition to the damage dealt.',
    ],
  },
  {
    id: 'dazzling-display-pf1e',
    name: 'Dazzling Display',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'other',
        description: 'Weapon Focus',
      },
      {
        type: 'other',
        description: 'proficiency with the selected weapon',
      },
    ],
    description: 'Your skill with your favored weapon can frighten enemies.',
    benefits: [
      'While wielding the weapon in which you have Weapon Focus, you can perform a bewildering show of prowess as a full-round action. Make an Intimidate check to demoralize all foes within 30 feet who can see your display.',
    ],
  },
  {
    id: 'deadly-stroke-pf1e',
    name: 'Deadly Stroke',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'other',
        description: 'Dazzling Display',
      },
      {
        type: 'other',
        description: 'Greater Weapon Focus',
      },
      {
        type: 'other',
        description: 'Shatter Defenses',
      },
      {
        type: 'other',
        description: 'Weapon Focus',
      },
      {
        type: 'other',
        description: 'proficiency with the selected weapon',
      },
      {
        type: 'other',
        description: 'base attack bonus +11',
      },
    ],
    description: 'With a well-placed strike, you can bring a swift and painful end to most foes.',
    benefits: [
      'As a standard action, make a single attack with the weapon for which you have Greater Weapon Focus against a stunned or flat-footed opponent. If you hit, you deal double the normal damage and the target takes 1 point of Constitution bleed (see Conditions). The additional damage and bleed is not multiplied on a critical hit.',
    ],
  },
  {
    id: 'deafening-critical-pf1e',
    name: 'Deafening Critical',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'other',
        description: 'Critical Focus',
      },
      {
        type: 'other',
        description: 'base attack bonus +13',
      },
    ],
    description: 'Your critical hits cause enemies to lose their hearing.',
    benefits: [
      'Whenever you score a critical hit against an opponent, the victim is permanently deafened. A successful Fortitude save reduces the deafness to 1 round. The DC of this Fortitude save is equal to 10 + your base attack bonus. This feat has no effect on deaf creatures. This deafness can be cured by heal, regeneration, remove deafness, or a similar ability.',
    ],
    special:
      'You can only apply the effects of one critical feat to a given critical hit unless you possess Critical Mastery.',
  },
  {
    id: 'deflect-arrows-pf1e',
    name: 'Deflect Arrows',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'other',
        description: 'Dex 13',
      },
      {
        type: 'other',
        description: 'Improved Unarmed Strike',
      },
    ],
    description:
      'You can knock arrows and other projectiles off course, preventing them from hitting you.',
    benefits: [
      "You must have at least one hand free (holding nothing) to use this feat. Once per round when you would normally be hit with an attack from a ranged weapon, you may deflect it so that you take no damage from it. You must be aware of the attack and not flat-footed. Attempting to deflect a ranged attack doesn't count as an action. Unusually massive ranged weapons (such as boulders or ballista bolts) and ranged attacks generated by natural attacks or spell effects can't be deflected.",
    ],
  },
  {
    id: 'disruptive-pf1e',
    name: 'Disruptive',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'other',
        description: '6th-level fighter',
      },
    ],
    description:
      'Your training makes it difficult for enemy spellcasters to safely cast spells near you.',
    benefits: [
      "The DC to cast spells defensively increases by +4 for all enemies that are within your threatened area. This increase to casting spells defensively only applies if you are aware of the enemy's location and are capable of taking an attack of opportunity. If you can only take one attack of opportunity per round and have already used that attack, this increase does not apply.",
    ],
  },
  {
    id: 'exhausting-critical-pf1e',
    name: 'Exhausting Critical',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'other',
        description: 'Critical Focus',
      },
      {
        type: 'other',
        description: 'Tiring Critical',
      },
      {
        type: 'other',
        description: 'base attack bonus +15',
      },
    ],
    description: 'Your critical hits cause opponents to become exhausted.',
    benefits: [
      'When you score a critical hit on a foe, your target immediately becomes exhausted. This feat has no effect on exhausted creatures.',
    ],
    special:
      'You can only apply the effects of one critical feat to a given critical hit unless you possess the Critical Mastery feat.',
  },
  {
    id: 'exotic-weapon-proficiency-pf1e',
    name: 'Exotic Weapon Proficiency',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'other',
        description: 'Base attack bonus +1',
      },
    ],
    description:
      'Choose one type of exotic weapon, such as the spiked chain or whip. You understand how to use that type of exotic weapon in combat, and can utilize any special tricks or qualities that exotic weapon might allow.',
    benefits: ['You make attack rolls with the weapon normally.'],
    special:
      'You can gain Exotic Weapon Proficiency multiple times. Each time you take the feat, it applies to a new type of exotic weapon.',
  },
  {
    id: 'far-shot-pf1e',
    name: 'Far Shot',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'other',
        description: 'Point-Blank Shot',
      },
    ],
    description: 'You are more accurate at longer ranges.',
    benefits: [
      'You only suffer a –1 penalty per full range increment between you and your target when using a ranged weapon.',
    ],
  },
  {
    id: 'gorgons-fist-pf1e',
    name: "Gorgon's Fist",
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'other',
        description: 'Improved Unarmed Strike',
      },
      {
        type: 'other',
        description: 'Scorpion Style',
      },
      {
        type: 'other',
        description: 'base attack bonus +6',
      },
    ],
    description: 'With one well-placed blow, you leave your target reeling.',
    benefits: [
      'As a standard action, make a single unarmed melee attack against a foe whose speed is reduced (such as from Scorpion Style). If the attack hits, you deal damage normally and the target is staggered until the end of your next turn unless it makes a Fortitude saving throw (DC 10 + 1/2 your character level + your Wis modifier). This feat has no effect on targets that are staggered.',
    ],
  },
  {
    id: 'greater-bull-rush-pf1e',
    name: 'Greater Bull Rush',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'other',
        description: 'Improved Bull Rush',
      },
      {
        type: 'other',
        description: 'Power Attack',
      },
      {
        type: 'other',
        description: 'base attack bonus +6',
      },
      {
        type: 'other',
        description: 'Str 13',
      },
    ],
    description: 'Your bull rush attacks throw enemies off balance.',
    benefits: [
      'You receive a +2 bonus on checks made to bull rush a foe. This bonus stacks with the bonus granted by Improved Bull Rush. Whenever you bull rush an opponent, his movement provokes attacks of opportunity from all of your allies (but not you).',
    ],
  },
  {
    id: 'greater-disarm-pf1e',
    name: 'Greater Disarm',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'other',
        description: 'Combat Expertise',
      },
      {
        type: 'other',
        description: 'Improved Disarm',
      },
      {
        type: 'other',
        description: 'base attack bonus +6',
      },
      {
        type: 'other',
        description: 'Int 13',
      },
    ],
    description: "You can knock weapons far from an enemy's grasp.",
    benefits: [
      'You receive a +2 bonus on checks made to disarm a foe. This bonus stacks with the bonus granted by Improved Disarm. Whenever you successfully disarm an opponent, the weapon lands 15 feet away from its previous wielder, in a random direction.',
    ],
  },
  {
    id: 'greater-feint-pf1e',
    name: 'Greater Feint',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'other',
        description: 'Combat Expertise',
      },
      {
        type: 'other',
        description: 'Improved Feint',
      },
      {
        type: 'other',
        description: 'base attack bonus +6',
      },
      {
        type: 'other',
        description: 'Int 13',
      },
    ],
    description: 'You are skilled at making foes overreact to your attacks.',
    benefits: [
      'Whenever you use feint to cause an opponent to lose his Dexterity bonus, he loses that bonus until the beginning of your next turn, in addition to losing his Dexterity bonus against your next attack.',
    ],
  },
  {
    id: 'greater-grapple-pf1e',
    name: 'Greater Grapple',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'other',
        description: 'Improved Grapple',
      },
      {
        type: 'other',
        description: 'Improved Unarmed Strike',
      },
      {
        type: 'other',
        description: 'base attack bonus +6',
      },
      {
        type: 'other',
        description: 'Dex 13',
      },
    ],
    description: 'Maintaining a grapple is second nature to you.',
    benefits: [
      'You receive a +2 bonus on checks made to grapple a foe. This bonus stacks with the bonus granted by Improved Grapple. Once you have grappled a creature, maintaining the grapple is a move action. This feat allows you to make two grapple checks each round (to move, harm, or pin your opponent), but you are not required to make two checks. You only need to succeed at one of these checks to maintain the grapple.',
    ],
  },
  {
    id: 'greater-overrun-pf1e',
    name: 'Greater Overrun',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'other',
        description: 'Improved Overrun',
      },
      {
        type: 'other',
        description: 'Power Attack',
      },
      {
        type: 'other',
        description: 'base attack bonus +6',
      },
      {
        type: 'other',
        description: 'Str 13',
      },
    ],
    description: 'Enemies must dive to avoid your dangerous move.',
    benefits: [
      'You receive a +2 bonus on checks made to overrun a foe. This bonus stacks with the bonus granted by Improved Overrun. Whenever you overrun opponents, they provoke attacks of opportunity if they are knocked prone by your overrun.',
    ],
  },
  {
    id: 'greater-penetrating-strike-pf1e',
    name: 'Greater Penetrating Strike',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'other',
        description: 'Penetrating Strike',
      },
      {
        type: 'other',
        description: 'Weapon Focus',
      },
      {
        type: 'other',
        description: '16th-level fighter',
      },
    ],
    description: 'Your attacks penetrate the defenses of most foes.',
    benefits: [
      'Your attacks with weapons selected with Weapon Focus ignore up to 10 points of damage reduction. This amount is reduced to 5 points for damage reduction without a type (such as DR 10/—).',
    ],
  },
  {
    id: 'greater-shield-focus-pf1e',
    name: 'Greater Shield Focus',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'other',
        description: 'Shield Focus',
      },
      {
        type: 'other',
        description: 'Shield Proficiency',
      },
      {
        type: 'other',
        description: 'base attack bonus +1',
      },
      {
        type: 'other',
        description: '8th-level fighter',
      },
    ],
    description: 'You are skilled at deflecting blows with your shield.',
    benefits: [
      'Increase the AC bonus granted by any shield you are using by 1. This bonus stacks with the bonus granted by Shield Focus.',
    ],
  },
  {
    id: 'greater-sunder-pf1e',
    name: 'Greater Sunder',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'other',
        description: 'Improved Sunder',
      },
      {
        type: 'other',
        description: 'Power Attack',
      },
      {
        type: 'other',
        description: 'base attack bonus +6',
      },
      {
        type: 'other',
        description: 'Str 13',
      },
    ],
    description:
      'Your devastating strikes cleave through weapons and armor and into their wielders, damaging both item and wielder alike in a single terrific strike.',
    benefits: [
      "You receive a +2 bonus on checks made to sunder an item. This bonus stacks with the bonus granted by Improved Sunder. Whenever you sunder to destroy a weapon, shield, or suit of armor, any excess damage is applied to the item's wielder. No damage is transferred if you decide to leave the item with 1 hit point.",
    ],
  },
  {
    id: 'greater-trip-pf1e',
    name: 'Greater Trip',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'other',
        description: 'Combat Expertise',
      },
      {
        type: 'other',
        description: 'Improved Trip',
      },
      {
        type: 'other',
        description: 'base attack bonus +6',
      },
      {
        type: 'other',
        description: 'Int 13',
      },
    ],
    description: 'You can make free attacks on foes that you knock down.',
    benefits: [
      'You receive a +2 bonus on checks made to trip a foe. This bonus stacks with the bonus granted by Improved Trip. Whenever you successfully trip an opponent, that opponent provokes attacks of opportunity.',
    ],
  },
  {
    id: 'greater-vital-strike-pf1e',
    name: 'Greater Vital Strike',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'other',
        description: 'Improved Vital Strike',
      },
      {
        type: 'other',
        description: 'Vital Strike',
      },
      {
        type: 'other',
        description: 'base attack bonus +16',
      },
    ],
    description: 'You can make a single attack that deals incredible damage.',
    benefits: [
      "When you use the attack action, you can make one attack at your highest base attack bonus that deals additional damage. Roll the weapon's damage dice for the attack four times and add the results together before adding bonuses from Strength, weapon abilities (such as flaming), precision based damage, and other damage bonuses. These extra weapon damage dice are not multiplied on a critical hit, but are added to the total.",
    ],
  },
  {
    id: 'greater-weapon-focus-pf1e',
    name: 'Greater Weapon Focus',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'other',
        description: 'Proficiency with selected weapon',
      },
      {
        type: 'other',
        description: 'Weapon Focus with selected weapon',
      },
      {
        type: 'other',
        description: 'base attack bonus +1',
      },
      {
        type: 'other',
        description: '8th-level fighter',
      },
    ],
    description:
      'Choose one type of weapon (including unarmed strike or grapple) for which you have already selected Weapon Focus. You are a master at your chosen weapon.',
    benefits: [
      'You gain a +1 bonus on attack rolls you make using the selected weapon. This bonus stacks with other bonuses on attack rolls, including those from Weapon Focus.',
    ],
    special:
      'You can gain Greater Weapon Focus multiple times. Its effects do not stack. Each time you take the feat, it applies to a new type of weapon.',
  },
  {
    id: 'greater-weapon-specialization-pf1e',
    name: 'Greater Weapon Specialization',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'other',
        description: 'Proficiency with selected weapon',
      },
      {
        type: 'other',
        description: 'Greater Weapon Focus with selected weapon',
      },
      {
        type: 'other',
        description: 'Weapon Focus with selected weapon',
      },
      {
        type: 'other',
        description: 'Weapon Specialization with selected weapon',
      },
      {
        type: 'other',
        description: '12th-level fighter',
      },
    ],
    description:
      'Choose one type of weapon (including unarmed strike or grapple) for which you possess the Weapon Specialization feat. Your attacks with the chosen weapon are more devastating than normal.',
    benefits: [
      'You gain a +2 bonus on all damage rolls you make using the selected weapon. This bonus to damage stacks with other damage roll bonuses, including any you gain from Weapon Specialization.',
    ],
    special:
      'You can gain Greater Weapon Specialization multiple times. Its effects do not stack. Each time you take the feat, it applies to a new type of weapon.',
  },
  {
    id: 'improved-bull-rush-pf1e',
    name: 'Improved Bull Rush',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'other',
        description: 'Str 13',
      },
      {
        type: 'other',
        description: 'Power Attack',
      },
      {
        type: 'other',
        description: 'base attack bonus +1',
      },
    ],
    description: 'You are skilled at pushing your foes around.',
    benefits: [
      'You do not provoke an attack of opportunity when performing a bull rush combat maneuver. In addition, you receive a +2 bonus on checks made to bull rush a foe. You also receive a +2 bonus to your Combat Maneuver Defense whenever an opponent tries to bull rush you.',
    ],
  },
  {
    id: 'improved-feint-pf1e',
    name: 'Improved Feint',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'other',
        description: 'Int 13',
      },
      {
        type: 'other',
        description: 'Combat Expertise',
      },
    ],
    description: 'You are skilled at fooling your opponents in combat.',
    benefits: ['You can make a Bluff check to feint in combat as a move action.'],
  },
  {
    id: 'improved-overrun-pf1e',
    name: 'Improved Overrun',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'other',
        description: 'Str 13',
      },
      {
        type: 'other',
        description: 'Power Attack',
      },
      {
        type: 'other',
        description: 'base attack bonus +1',
      },
    ],
    description: 'You are skilled at running down your foes.',
    benefits: [
      'You do not provoke an attack of opportunity when performing an overrun combat maneuver. In addition, you receive a +2 bonus on checks made to overrun a foe. You also receive a +2 bonus to your Combat Maneuver Defense whenever an opponent tries to overrun you. Targets of your overrun attempt may not chose to avoid you.',
    ],
  },
  {
    id: 'improved-precise-shot-pf1e',
    name: 'Improved Precise Shot',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'other',
        description: 'Dex 19',
      },
      {
        type: 'other',
        description: 'Point-Blank Shot',
      },
      {
        type: 'other',
        description: 'Precise Shot',
      },
      {
        type: 'other',
        description: 'base attack bonus +11',
      },
    ],
    description: 'Your ranged attacks ignore anything but total concealment and cover.',
    benefits: [
      'Your ranged attacks ignore the AC bonus granted to targets by anything less than total cover, and the miss chance granted to targets by anything less than total concealment. Total cover and total concealment provide their normal benefits against your ranged attacks.',
    ],
  },
  {
    id: 'improved-sunder-pf1e',
    name: 'Improved Sunder',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'other',
        description: 'Str 13',
      },
      {
        type: 'other',
        description: 'Power Attack',
      },
      {
        type: 'other',
        description: 'base attack bonus +1',
      },
    ],
    description: "You are skilled at damaging your foes' weapons and armor.",
    benefits: [
      'You do not provoke an attack of opportunity when performing a sunder combat maneuver. In addition, you receive a +2 bonus on checks made to sunder an item. You also receive a +2 bonus to your Combat Maneuver Defense whenever an opponent tries to sunder your gear.',
    ],
  },
  {
    id: 'improved-vital-strike-pf1e',
    name: 'Improved Vital Strike',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'other',
        description: 'Vital Strike',
      },
      {
        type: 'other',
        description: 'base attack bonus +11',
      },
    ],
    description: 'You can make a single attack that deals a large amount of damage.',
    benefits: [
      "When you use the attack action, you can make one attack at your highest base attack bonus that deals additional damage. Roll the weapon's damage dice for the attack three times and add the results together before adding bonuses from Strength, weapon special abilities (such as flaming), precision based damage, and other damage bonuses. These extra weapon damage dice are not multiplied on a critical hit, but are added to the total.",
    ],
  },
  {
    id: 'improvised-weapon-mastery-pf1e',
    name: 'Improvised Weapon Mastery',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'other',
        description: 'Catch Off-Guard or Throw Anything',
      },
      {
        type: 'other',
        description: 'base attack bonus +8',
      },
    ],
    description:
      'You can turn nearly any object into a deadly weapon, from a razor-sharp chair leg to a sack of flour.',
    benefits: [
      'You do not suffer any penalties for using an improvised weapon. Increase the amount of damage dealt by the improvised weapon by one step (for example, 1d4 becomes 1d6) to a maximum of 1d8 (2d6 if the improvised weapon is two-handed). The improvised weapon has a critical threat range of 19–20, with a critical multiplier of ×2.',
    ],
  },
  {
    id: 'lightning-stance-pf1e',
    name: 'Lightning Stance',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'other',
        description: 'Dex 17',
      },
      {
        type: 'other',
        description: 'Dodge',
      },
      {
        type: 'other',
        description: 'Wind Stance',
      },
      {
        type: 'other',
        description: 'base attack bonus +11',
      },
    ],
    description:
      'The speed at which you move makes it nearly impossible for opponents to strike you.',
    benefits: [
      'If you take two actions to move or a withdraw action in a turn, you gain 50% concealment for 1 round.',
    ],
  },
  {
    id: 'lunge-pf1e',
    name: 'Lunge',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'other',
        description: 'Base attack bonus +6',
      },
    ],
    description: 'You can strike foes that would normally be out of reach.',
    benefits: [
      'You can increase the reach of your melee attacks by 5 feet until the end of your turn by taking a –2 penalty to your AC until your next turn. You must decide to use this ability before any attacks are made.',
    ],
  },
  {
    id: 'martial-weapon-proficiency-pf1e',
    name: 'Martial Weapon Proficiency',
    system: 'pf1e',
    source: 'CRB',
    description:
      'Choose a type of martial weapon. You understand how to use that type of martial weapon in combat.',
    benefits: [
      'You make attack rolls with the selected weapon normally (without the non-proficient penalty).',
    ],
    special:
      'Barbarians, fighters, paladins, and rangers are proficient with all martial weapons. They need not select this feat. You can gain Martial Weapon Proficiency multiple times. Each time you take the feat, it applies to a new type of weapon.',
  },
  {
    id: 'medusas-wrath-pf1e',
    name: "Medusa's Wrath",
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'other',
        description: 'Improved Unarmed Strike',
      },
      {
        type: 'other',
        description: "Gorgon's Fist",
      },
      {
        type: 'other',
        description: 'Scorpion Style',
      },
      {
        type: 'other',
        description: 'base attack bonus +11',
      },
    ],
    description: "You can take advantage of your opponent's confusion, delivering multiple blows.",
    benefits: [
      'Whenever you use the full-attack action and make at least one unarmed strike, you can make two additional unarmed strikes at your highest base attack bonus. These bonus attacks must be made against a dazed, flat-footed, paralyzed, staggered, stunned, or unconscious foe.',
    ],
  },
  {
    id: 'mounted-archery-pf1e',
    name: 'Mounted Archery',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'other',
        description: 'Ride 1 rank',
      },
      {
        type: 'other',
        description: 'Mounted Combat',
      },
    ],
    description: 'You are skilled at making ranged attacks while mounted.',
    benefits: [
      'The penalty you take when using a ranged weapon while mounted is halved: –2 instead of –4 if your mount is taking a double move, and –4 instead of –8 if your mount is running.',
    ],
  },
  {
    id: 'penetrating-strike-pf1e',
    name: 'Penetrating Strike',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'other',
        description: 'Weapon Focus',
      },
      {
        type: 'other',
        description: 'base attack bonus +1',
      },
      {
        type: 'other',
        description: '12th-level fighter',
      },
      {
        type: 'other',
        description: 'proficiency with weapon',
      },
    ],
    description: 'Your attacks are capable of penetrating the defenses of some creatures.',
    benefits: [
      'Your attacks with weapons selected with Weapon Focus ignore up to 5 points of damage reduction. This feat does not apply to damage reduction without a type (such as DR 10/—).',
    ],
  },
  {
    id: 'pinpoint-targeting-pf1e',
    name: 'Pinpoint Targeting',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'other',
        description: 'Dex 19',
      },
      {
        type: 'other',
        description: 'Improved Precise Shot',
      },
      {
        type: 'other',
        description: 'Point-Blank Shot',
      },
      {
        type: 'other',
        description: 'Precise Shot',
      },
      {
        type: 'other',
        description: 'base attack bonus +16',
      },
    ],
    description: "You can target the weak points in your opponent's armor.",
    benefits: [
      'As a standard action, make a single ranged attack. The target does not gain any armor, natural armor, or shield bonuses to its Armor Class. You do not gain the benefit of this feat if you move this round.',
    ],
  },
  {
    id: 'ride-by-attack-pf1e',
    name: 'Ride-By Attack',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'other',
        description: 'Ride 1 rank',
      },
      {
        type: 'other',
        description: 'Mounted Combat',
      },
    ],
    description:
      'While mounted and charging, you can move, strike at a foe, and then continue moving.',
    benefits: [
      "When you are mounted and use the charge action, you may move and attack as if with a standard charge and then move again (continuing the straight line of the charge). Your total movement for the round can't exceed double your mounted speed. You and your mount do not provoke an attack of opportunity from the opponent that you attack.",
    ],
  },
  {
    id: 'scorpion-style-pf1e',
    name: 'Scorpion Style',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'other',
        description: 'Improved Unarmed Strike',
      },
    ],
    description: "You can perform an unarmed strike that greatly hampers your target's movement.",
    benefits: [
      "To use this feat, you must make a single unarmed attack as a standard action. If this unarmed attack hits, you deal damage normally, and the target's base land speed is reduced to 5 feet for a number of rounds equal to your Wisdom modifier unless it makes a Fortitude saving throw (DC 10 + 1/2 your character level + your Wis modifier).",
    ],
  },
  {
    id: 'shatter-defenses-pf1e',
    name: 'Shatter Defenses',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'other',
        description: 'Weapon Focus',
      },
      {
        type: 'other',
        description: 'Dazzling Display',
      },
      {
        type: 'other',
        description: 'base attack bonus +6',
      },
      {
        type: 'other',
        description: 'proficiency with weapon',
      },
    ],
    description:
      'Your skill with your chosen weapon leaves opponents unable to defend themselves if you strike them when their defenses are already compromised.',
    benefits: [
      'Any shaken, frightened, or panicked opponent hit by you this round is flat-footed to your attacks until the end of your next turn. This includes any additional attacks you make this round.',
    ],
  },
  {
    id: 'shield-master-pf1e',
    name: 'Shield Master',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'other',
        description: 'Improved Shield Bash',
      },
      {
        type: 'other',
        description: 'Shield Proficiency',
      },
      {
        type: 'other',
        description: 'Shield Slam',
      },
      {
        type: 'other',
        description: 'Two-Weapon Fighting',
      },
      {
        type: 'other',
        description: 'base attack bonus +11',
      },
    ],
    description: 'Your mastery of the shield allows you to fight with it without hindrance.',
    benefits: [
      "You do not suffer any penalties on attack rolls made with a shield while you are wielding another weapon. Add your shield's enhancement bonus to attacks and damage rolls made with the shield as if it was a weapon enhancement bonus.",
    ],
  },
  {
    id: 'shield-proficiency-pf1e',
    name: 'Shield Proficiency',
    system: 'pf1e',
    source: 'CRB',
    description: 'You are trained in how to properly use a shield.',
    benefits: [
      "When you use a shield (except a tower shield), the shield's armor check penalty only applies to Strength- and Dexterity-based skills.",
    ],
    special:
      'Barbarians, bards, clerics, druids, fighters, paladins, and rangers all automatically have Shield Proficiency as a bonus feat. They need not select it.',
  },
  {
    id: 'shield-slam-pf1e',
    name: 'Shield Slam',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'other',
        description: 'Improved Shield Bash',
      },
      {
        type: 'other',
        description: 'Shield Proficiency',
      },
      {
        type: 'other',
        description: 'Two-Weapon Fighting',
      },
      {
        type: 'other',
        description: 'base attack bonus +6',
      },
    ],
    description: 'In the right position, your shield can be used to send opponents flying.',
    benefits: [
      'Any opponents hit by your shield bash are also hit with a free bull rush attack, substituting your attack roll for the combat maneuver check (see Combat). This bull rush does not provoke an attack of opportunity. Opponents who cannot move back due to a wall or other surface are knocked prone after moving the maximum possible distance. You may choose to move with your target if you are able to take a 5-foot step or to spend an action to move this turn.',
    ],
  },
  {
    id: 'shot-on-the-run-pf1e',
    name: 'Shot on the Run',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'other',
        description: 'Dex 13',
      },
      {
        type: 'other',
        description: 'Dodge',
      },
      {
        type: 'other',
        description: 'Mobility',
      },
      {
        type: 'other',
        description: 'Point-Blank Shot',
      },
      {
        type: 'other',
        description: 'base attack bonus +4',
      },
    ],
    description: 'You can move, fire a ranged weapon, and move again before your foes can react.',
    benefits: [
      'As a full-round action, you can move up to your speed and make a single ranged attack at any point during your movement.',
    ],
  },
  {
    id: 'sickening-critical-pf1e',
    name: 'Sickening Critical',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'other',
        description: 'Critical Focus',
      },
      {
        type: 'other',
        description: 'base attack bonus +11',
      },
    ],
    description: 'Your critical hits cause opponents to become sickened.',
    benefits: [
      "Whenever you score a critical hit, your opponent becomes sickened for 1 minute. The effects of this feat do not stack. Additional hits instead add to the effect's duration.",
    ],
    special:
      'You can only apply the effects of one critical feat to a given critical hit unless you possess Critical Mastery.',
  },
  {
    id: 'simple-weapon-proficiency-pf1e',
    name: 'Simple Weapon Proficiency',
    system: 'pf1e',
    source: 'CRB',
    description: 'You are trained in the use of basic weapons.',
    benefits: ['You make attack rolls with simple weapons without penalty.'],
    special:
      'All characters except for druids, monks, and wizards are automatically proficient with all simple weapons. They need not select this feat.',
  },
  {
    id: 'snatch-arrows-pf1e',
    name: 'Snatch Arrows',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'other',
        description: 'Dex 15',
      },
      {
        type: 'other',
        description: 'Deflect Arrows',
      },
      {
        type: 'other',
        description: 'Improved Unarmed Strike',
      },
    ],
    description:
      'Instead of knocking an arrow or ranged attack aside, you can catch it in mid-flight.',
    benefits: [
      "When using the Deflect Arrows feat you may choose to catch the weapon instead of just deflecting it. Thrown weapons can immediately be thrown back as an attack against the original attacker (even though it isn't your turn) or kept for later use. You must have at least one hand free (holding nothing) to use this feat.",
    ],
  },
  {
    id: 'spellbreaker-pf1e',
    name: 'Spellbreaker',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'other',
        description: 'Disruptive',
      },
      {
        type: 'other',
        description: '10th-level fighter',
      },
    ],
    description:
      'You can strike at enemy spellcasters who fail to cast defensively when you threaten them.',
    benefits: [
      'Enemies in your threatened area that fail their checks to cast spells defensively provoke attacks of opportunity from you.',
    ],
  },
  {
    id: 'spirited-charge-pf1e',
    name: 'Spirited Charge',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'other',
        description: 'Ride 1 rank',
      },
      {
        type: 'other',
        description: 'Mounted Combat',
      },
      {
        type: 'other',
        description: 'Ride-By Attack',
      },
    ],
    description: 'Your mounted charge attacks deal a tremendous amount of damage.',
    benefits: [
      'When mounted and using the charge action, you deal double damage with a melee weapon (or triple damage with a lance).',
    ],
  },
  {
    id: 'staggering-critical-pf1e',
    name: 'Staggering Critical',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'other',
        description: 'Critical Focus',
      },
      {
        type: 'other',
        description: 'base attack bonus +13',
      },
    ],
    description: 'Your critical hits cause opponents to slow down.',
    benefits: [
      'Whenever you score a critical hit, your opponent becomes staggered for 1d4+1 rounds. A successful Fortitude save reduces the duration to 1 round. The DC of this Fortitude save is equal to 10 + your base attack bonus. The effects of this feat do not stack. Additional hits instead add to the duration.',
    ],
    special:
      'You can only apply the effects of one critical feat to a given critical hit unless you possess Critical Mastery.',
  },
  {
    id: 'stand-still-pf1e',
    name: 'Stand Still',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'other',
        description: 'Combat Reflexes',
      },
    ],
    description: 'You can stop foes that try to move past you.',
    benefits: [
      'When a foe provokes an attack of opportunity due to moving through your adjacent squares, you can make a combat maneuver check as your attack of opportunity. If successful, the enemy cannot move for the rest of his turn. An enemy can still take the rest of his action, but cannot move. This feat also applies to any creature that attempts to move from a square that is adjacent to you if such movement provokes an attack of opportunity.',
    ],
  },
  {
    id: 'strike-back-pf1e',
    name: 'Strike Back',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'other',
        description: 'Base attack bonus +11',
      },
    ],
    description:
      'You can strike at foes that attack you using their superior reach, by targeting their limbs or weapons as they come at you.',
    benefits: [
      'You can ready an action to make a melee attack against any foe that attacks you in melee, even if the foe is outside of your reach.',
    ],
  },
  {
    id: 'stunning-critical-pf1e',
    name: 'Stunning Critical',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'other',
        description: 'Critical Focus',
      },
      {
        type: 'other',
        description: 'Staggering Critical',
      },
      {
        type: 'other',
        description: 'base attack bonus +17',
      },
    ],
    description: 'Your critical hits cause opponents to become stunned.',
    benefits: [
      'Whenever you score a critical hit, your opponent becomes stunned for 1d4 rounds. A successful Fortitude save reduces this to staggered for 1d4 rounds. The DC of this Fortitude save is equal to 10 + your base attack bonus. The effects of this feat do not stack. Additional hits instead add to the duration.',
    ],
    special:
      'You can only apply the effects of one critical feat to a given critical hit unless you possess Critical Mastery.',
  },
  {
    id: 'throw-anything-pf1e',
    name: 'Throw Anything',
    system: 'pf1e',
    source: 'CRB',
    description: 'You are used to throwing things you have on hand.',
    benefits: [
      'You do not suffer any penalties for using an improvised ranged weapon. You receive a +1 circumstance bonus on attack rolls made with thrown splash weapons.',
    ],
  },
  {
    id: 'tiring-critical-pf1e',
    name: 'Tiring Critical',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'other',
        description: 'Critical Focus',
      },
      {
        type: 'other',
        description: 'base attack bonus +13',
      },
    ],
    description: 'Your critical hits cause opponents to become fatigued.',
    benefits: [
      'Whenever you score a critical hit, your opponent becomes fatigued. This feat has no additional effect on a fatigued or exhausted creature.',
    ],
    special:
      'You can only apply the effects of one critical feat to a given critical hit unless you possess Critical Mastery.',
  },
  {
    id: 'tower-shield-proficiency-pf1e',
    name: 'Tower Shield Proficiency',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'other',
        description: 'Shield Proficiency',
      },
    ],
    description: 'You are trained in how to properly use a tower shield.',
    benefits: [
      "When you use a tower shield, the shield's armor check penalty only applies to Strength and Dexterity-based skills.",
    ],
    special:
      'Fighters automatically have Tower Shield Proficiency as a bonus feat. They need not select it.',
  },
  {
    id: 'trample-pf1e',
    name: 'Trample',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'other',
        description: 'Ride 1 rank',
      },
      {
        type: 'other',
        description: 'Mounted Combat',
      },
    ],
    description: 'While mounted, you can ride down opponents and trample them under your mount.',
    benefits: [
      'When you attempt to overrun an opponent while mounted, your target may not choose to avoid you. Your mount may make one hoof attack against any target you knock down, gaining the standard +4 bonus on attack rolls against prone targets.',
    ],
  },
  {
    id: 'two-weapon-defense-pf1e',
    name: 'Two-Weapon Defense',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'other',
        description: 'Dex 15',
      },
      {
        type: 'other',
        description: 'Two-Weapon Fighting',
      },
    ],
    description: 'You are skilled at defending yourself while dual-wielding.',
    benefits: [
      'When wielding a double weapon or two weapons (not including natural weapons or unarmed strikes), you gain a +1 shield bonus to your AC. When you are fighting defensively or using the total defense action, this shield bonus increases to +2.',
    ],
  },
  {
    id: 'two-weapon-rend-pf1e',
    name: 'Two-Weapon Rend',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'other',
        description: 'Dex 17',
      },
      {
        type: 'other',
        description: 'Double Slice',
      },
      {
        type: 'other',
        description: 'Improved Two-Weapon Fighting',
      },
      {
        type: 'other',
        description: 'Two-Weapon Fighting',
      },
      {
        type: 'other',
        description: 'base attack bonus +11',
      },
    ],
    description:
      'Striking with both of your weapons simultaneously, you can use them to deliver devastating wounds.',
    benefits: [
      'If you hit an opponent with both your primary hand and your off-hand weapon, you deal an additional 1d10 points of damage plus 1-1/2 times your Strength modifier. You can only deal this additional damage once each round.',
    ],
  },
  {
    id: 'unseat-pf1e',
    name: 'Unseat',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'other',
        description: 'Str 13',
      },
      {
        type: 'other',
        description: 'Ride 1 rank',
      },
      {
        type: 'other',
        description: 'Mounted Combat',
      },
      {
        type: 'other',
        description: 'Power Attack',
      },
      {
        type: 'other',
        description: 'Improved Bull Rush',
      },
      {
        type: 'other',
        description: 'base attack bonus +1',
      },
    ],
    description: 'You are skilled at unseating your mounted opponents.',
    benefits: [
      'When charging an opponent while mounted and wielding a lance, resolve the attack as normal. If it hits, you may immediately make a free bull rush attempt in addition to the normal damage. If successful, the target is knocked off his horse and lands prone in a space adjacent to his mount that is directly away from you.',
    ],
  },
  {
    id: 'wind-stance-pf1e',
    name: 'Wind Stance',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'other',
        description: 'Dex 15',
      },
      {
        type: 'other',
        description: 'Dodge',
      },
      {
        type: 'other',
        description: 'base attack bonus +6',
      },
    ],
    description: 'Your erratic movements make it difficult for enemies to pinpoint your location.',
    benefits: [
      'If you move more than 5 feet this turn, you gain 20% concealment for 1 round against ranged attacks.',
    ],
  },
];
