/**
 * Pathfinder 1e General Feats - Core Rulebook
 *
 * Derived from the Pathfinder Reference Document (Core Rulebook) and released
 * under the Open Gaming License v1.0a.
 */

import { FeatDefinition } from '../../../../types/character-options/feats';

export const generalFeats: FeatDefinition[] = [
  {
    id: 'acrobatic-pf1e',
    name: 'Acrobatic',
    system: 'pf1e',
    source: 'CRB',
    description: 'You are skilled at leaping, jumping, and flying.',
    benefits: [
      '+2 bonus on Acrobatics checks',
      '+2 bonus on Fly checks',
      'If you have 10 or more ranks in one of these skills, the bonus increases to +4 for that skill',
    ],
  },
  {
    id: 'alertness-pf1e',
    name: 'Alertness',
    system: 'pf1e',
    source: 'CRB',
    description: 'You often notice things that others might miss.',
    benefits: [
      '+2 bonus on Perception checks',
      '+2 bonus on Sense Motive checks',
      'If you have 10 or more ranks in one of these skills, the bonus increases to +4 for that skill',
    ],
  },
  {
    id: 'animal-affinity-pf1e',
    name: 'Animal Affinity',
    system: 'pf1e',
    source: 'CRB',
    description: 'You are skilled at working with animals and mounts.',
    benefits: [
      '+2 bonus on Handle Animal checks',
      '+2 bonus on Ride checks',
      'If you have 10 or more ranks in one of these skills, the bonus increases to +4 for that skill',
    ],
  },
  {
    id: 'armor-proficiency-light-pf1e',
    name: 'Armor Proficiency (Light)',
    system: 'pf1e',
    source: 'CRB',
    proficienciesGranted: {
      armor: ['light armor'],
    },
    description: 'You are skilled at wearing light armor.',
    benefits: [
      'When you wear a type of armor with which you are proficient, the armor check penalty for that armor applies only to Dexterity- and Strength-based skill checks',
    ],
  },
  {
    id: 'armor-proficiency-medium-pf1e',
    name: 'Armor Proficiency (Medium)',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'other',
        description: 'Light Armor Proficiency',
      },
    ],
    proficienciesGranted: {
      armor: ['medium armor'],
    },
    description: 'You are skilled at wearing medium armor.',
    benefits: [
      'When you wear a type of armor with which you are proficient, the armor check penalty for that armor applies only to Dexterity- and Strength-based skill checks',
    ],
  },
  {
    id: 'armor-proficiency-heavy-pf1e',
    name: 'Armor Proficiency (Heavy)',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'other',
        description: 'Light Armor Proficiency, Medium Armor Proficiency',
      },
    ],
    proficienciesGranted: {
      armor: ['heavy armor'],
    },
    description: 'You are skilled at wearing heavy armor.',
    benefits: [
      'When you wear a type of armor with which you are proficient, the armor check penalty for that armor applies only to Dexterity- and Strength-based skill checks',
    ],
  },
  {
    id: 'athletic-pf1e',
    name: 'Athletic',
    system: 'pf1e',
    source: 'CRB',
    description: 'You possess inherent physical prowess.',
    benefits: [
      '+2 bonus on Climb checks',
      '+2 bonus on Swim checks',
      'If you have 10 or more ranks in one of these skills, the bonus increases to +4 for that skill',
    ],
  },
  {
    id: 'brew-potion-pf1e',
    name: 'Brew Potion',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'level',
        value: 3,
      },
    ],
    description: 'You can create magic potions.',
    benefits: [
      'You can create a potion of any 3rd-level or lower spell that you know and that targets one or more creatures or objects',
      'Brewing a potion takes 2 hours if its base price is 250 gp or less, otherwise it takes 1 day for each 1,000 gp in its base price',
    ],
  },
  {
    id: 'craft-magic-arms-and-armor-pf1e',
    name: 'Craft Magic Arms and Armor',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'level',
        value: 5,
      },
    ],
    description: 'You can create magic armor, shields, and weapons.',
    benefits: [
      'You can create magic weapons, armor, or shields',
      'Enhancing a weapon, suit of armor, or shield takes 1 day for each 1,000 gp in the price of its magical features',
    ],
  },
  {
    id: 'craft-rod-pf1e',
    name: 'Craft Rod',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'level',
        value: 9,
      },
    ],
    description: 'You can create magic rods.',
    benefits: [
      'You can create magic rods',
      'Crafting a rod takes 1 day for each 1,000 gp in its base price',
    ],
  },
  {
    id: 'craft-staff-pf1e',
    name: 'Craft Staff',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'level',
        value: 11,
      },
    ],
    description: 'You can create magic staffs.',
    benefits: [
      'You can create any staff whose prerequisites you meet',
      'Crafting a staff takes 1 day for each 1,000 gp in its base price',
    ],
  },
  {
    id: 'craft-wand-pf1e',
    name: 'Craft Wand',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'level',
        value: 5,
      },
    ],
    description: 'You can create magic wands.',
    benefits: [
      'You can create a wand of any 4th-level or lower spell that you know',
      'Crafting a wand takes 1 day for each 1,000 gp in its base price',
    ],
  },
  {
    id: 'craft-wondrous-item-pf1e',
    name: 'Craft Wondrous Item',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'level',
        value: 3,
      },
    ],
    description: 'You can create wondrous items, a type of magic item.',
    benefits: [
      'You can create a wide variety of magic wondrous items',
      'Crafting a wondrous item takes 1 day for each 1,000 gp in its price',
    ],
  },
  {
    id: 'deceitful-pf1e',
    name: 'Deceitful',
    system: 'pf1e',
    source: 'CRB',
    description:
      'You are skilled at deceiving others, both with the spoken word and with physical disguises.',
    benefits: [
      '+2 bonus on Bluff checks',
      '+2 bonus on Disguise checks',
      'If you have 10 or more ranks in one of these skills, the bonus increases to +4 for that skill',
    ],
  },
  {
    id: 'deft-hands-pf1e',
    name: 'Deft Hands',
    system: 'pf1e',
    source: 'CRB',
    description: 'You have exceptional manual dexterity.',
    benefits: [
      '+2 bonus on Disable Device checks',
      '+2 bonus on Sleight of Hand checks',
      'If you have 10 or more ranks in one of these skills, the bonus increases to +4 for that skill',
    ],
  },
  {
    id: 'forge-ring-pf1e',
    name: 'Forge Ring',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'level',
        value: 7,
      },
    ],
    description: 'You can create magic rings.',
    benefits: [
      'You can create magic rings',
      'Crafting a ring takes 1 day for each 1,000 gp in its base price',
    ],
  },
  {
    id: 'improved-counterspell-pf1e',
    name: 'Improved Counterspell',
    system: 'pf1e',
    source: 'CRB',
    description: 'You are skilled at countering the spells of others using similar spells.',
    benefits: [
      'When counterspelling, you may use a spell of the same school that is one or more spell levels higher than the target spell',
    ],
  },
  {
    id: 'leadership-pf1e',
    name: 'Leadership',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'level',
        value: 7,
      },
    ],
    description:
      'You attract followers to your cause and a companion to join you on your adventures.',
    benefits: ['You attract a cohort and a number of followers based on your Leadership score'],
  },
  {
    id: 'magical-aptitude-pf1e',
    name: 'Magical Aptitude',
    system: 'pf1e',
    source: 'CRB',
    description: 'You are skilled at spellcasting and using magic items.',
    benefits: [
      '+2 bonus on Spellcraft checks',
      '+2 bonus on Use Magic Device checks',
      'If you have 10 or more ranks in one of these skills, the bonus increases to +4 for that skill',
    ],
  },
  {
    id: 'natural-spell-pf1e',
    name: 'Natural Spell',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'ability',
        ability: 'wis',
        value: 13,
      },
      {
        type: 'other',
        description: 'Wild shape class feature',
      },
    ],
    description: 'You can cast spells even while in a form that cannot normally cast spells.',
    benefits: [
      'You can complete the verbal and somatic components of spells while using wild shape',
    ],
  },
  {
    id: 'persuasive-pf1e',
    name: 'Persuasive',
    system: 'pf1e',
    source: 'CRB',
    description:
      'You are skilled at swaying attitudes and intimidating others into your way of thinking.',
    benefits: [
      '+2 bonus on Diplomacy checks',
      '+2 bonus on Intimidate checks',
      'If you have 10 or more ranks in one of these skills, the bonus increases to +4 for that skill',
    ],
  },
  {
    id: 'scribe-scroll-pf1e',
    name: 'Scribe Scroll',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'level',
        value: 1,
      },
    ],
    description: 'You can create magic scrolls.',
    benefits: [
      'You can create a scroll of any spell that you know',
      'Scribing a scroll takes 2 hours if its base price is 250 gp or less, otherwise it takes 1 day for each 1,000 gp in its base price',
    ],
  },
  {
    id: 'self-sufficient-pf1e',
    name: 'Self-Sufficient',
    system: 'pf1e',
    source: 'CRB',
    description: 'You know how to get along in the wild and how to effectively treat wounds.',
    benefits: [
      '+2 bonus on Heal checks',
      '+2 bonus on Survival checks',
      'If you have 10 or more ranks in one of these skills, the bonus increases to +4 for that skill',
    ],
  },
  {
    id: 'skill-focus-pf1e',
    name: 'Skill Focus',
    system: 'pf1e',
    source: 'CRB',
    description: 'You are particularly adept at your chosen skill.',
    benefits: [
      '+3 bonus on all checks involving the chosen skill',
      'If you have 10 or more ranks in that skill, this bonus increases to +6',
    ],
  },
  {
    id: 'spell-focus-pf1e',
    name: 'Spell Focus',
    system: 'pf1e',
    source: 'CRB',
    description:
      'Choose a school of magic. Any spells you cast of that school are more difficult to resist.',
    benefits: [
      '+1 bonus to the Difficulty Class for all saving throws against spells from the school of magic you select',
    ],
  },
  {
    id: 'spell-penetration-pf1e',
    name: 'Spell Penetration',
    system: 'pf1e',
    source: 'CRB',
    description: 'Your spells break through spell resistance more easily than most.',
    benefits: ["+2 bonus on caster level checks made to overcome a creature's spell resistance"],
  },
  {
    id: 'stealthy-pf1e',
    name: 'Stealthy',
    system: 'pf1e',
    source: 'CRB',
    description: 'You are good at avoiding attention and slipping out of bonds.',
    benefits: [
      '+2 bonus on Escape Artist checks',
      '+2 bonus on Stealth checks',
      'If you have 10 or more ranks in one of these skills, the bonus increases to +4 for that skill',
    ],
  },
  {
    id: 'greater-spell-focus-pf1e',
    name: 'Greater Spell Focus',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'other',
        description: 'Spell Focus',
      },
    ],
    description: 'Your spells are significantly more difficult to resist.',
    benefits: [
      '+1 additional bonus to spell DC for spells of your chosen school (total +2 with Spell Focus)',
    ],
  },
  {
    id: 'greater-spell-penetration-pf1e',
    name: 'Greater Spell Penetration',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'other',
        description: 'Spell Penetration',
      },
    ],
    description: 'Your spells penetrate spell resistance much more easily.',
    benefits: [
      '+2 additional bonus to caster level checks to overcome spell resistance (total +4 with Spell Penetration)',
    ],
  },
  {
    id: 'acrobatic-steps-pf1e',
    name: 'Acrobatic Steps',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'other',
        description: 'Dex 15',
      },
      {
        type: 'other',
        description: 'Nimble Moves',
      },
    ],
    description: 'You can easily move over and through obstacles.',
    benefits: [
      'Whenever you move, you may move through up to 15 feet of difficult terrain each round as if it were normal terrain. The effects of this feat stack with those provided by Nimble Moves (allowing you to move normally through a total of 20 feet of difficult terrain each round).',
    ],
  },
  {
    id: 'alignment-channel-pf1e',
    name: 'Alignment Channel',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'other',
        description: 'Ability to channel energy',
      },
    ],
    description:
      'Choose chaos, evil, good, or law. You can channel divine energy to affect outsiders that possess this subtype.',
    benefits: [
      'Instead of its normal effect, you can choose to have your ability to channel energy heal or harm outsiders of the chosen alignment subtype. You must make this choice each time you channel energy. If you choose to heal or harm creatures of the chosen alignment subtype, your channel energy has no effect on other creatures. The amount of damage healed or dealt and the DC to halve the damage is otherwise unchanged.',
    ],
    special:
      'You can gain this feat multiple times. Its effects do not stack. Each time you take this feat, it applies to a new alignment subtype. Whenever you channel energy, you must choose which type to effect.',
  },
  {
    id: 'augment-summoning-pf1e',
    name: 'Augment Summoning',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'other',
        description: 'Spell Focus (conjuration)',
      },
    ],
    description: 'Your summoned creatures are more powerful and robust.',
    benefits: [
      'Each creature you conjure with any summon spell gains a +4 enhancement bonus to Strength and Constitution for the duration of the spell that summoned it.',
    ],
  },
  {
    id: 'command-undead-pf1e',
    name: 'Command Undead',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'other',
        description: 'Channel negative energy class feature',
      },
    ],
    description:
      'Using foul powers of necromancy, you can command undead creatures, making them into your servants.',
    benefits: [
      'As a standard action, you can use one of your uses of channel negative energy to enslave undead within 30 feet. Undead receive a Will save to negate the effect. The DC for this Will save is equal to 10 + 1/2 your cleric level + your Charisma modifier. Undead that fail their saves fall under your control, obeying your commands to the best of their ability, as if under the effects of control undead. Intelligent undead receive a new saving throw each day to resist your command. You can control any number of undead, so long as their total Hit Dice do not exceed your cleric level. If you use channel energy in this way, it has no other effect (it does not heal or harm nearby creatures). If an undead creature is under the control of another creature, you must make an opposed Charisma check whenever your orders conflict.',
    ],
  },
  {
    id: 'diehard-pf1e',
    name: 'Diehard',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'other',
        description: 'Endurance',
      },
    ],
    description:
      "You are especially hard to kill. Not only do your wounds automatically stabilize when grievously injured, but you can remain conscious and continue to act even at death's door.",
    benefits: [
      "When your hit point total is below 0, but you are not dead, you automatically stabilize. You do not need to make a Constitution check each round to avoid losing additional hit points. You may choose to act as if you were disabled, rather than dying. You must make this decision as soon as you are reduced to negative hit points (even if it isn't your turn). If you do not choose to act as if you were disabled, you immediately fall unconscious. When using this feat, you are staggered. You can take a move action without further injuring yourself, but if you perform any standard action (or any other action deemed as strenuous, including some swift actions, such as casting a quickened spell) you take 1 point of damage after completing the act. If your negative hit points are equal to or greater than your Constitution score, you immediately die.",
    ],
  },
  {
    id: 'elemental-channel-pf1e',
    name: 'Elemental Channel',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'other',
        description: 'Channel energy class feature',
      },
    ],
    description:
      'Choose one elemental subtype, such as air, earth, fire, or water. You can channel your divine energy to harm or heal outsiders that possess your chosen elemental subtype.',
    benefits: [
      'Instead of its normal effect, you can choose to have your ability to channel energy heal or harm outsiders of your chosen elemental subtype. You must make this choice each time you channel energy. If you choose to heal or harm creatures of your elemental subtype, your channel energy has no effect on other creatures. The amount of damage healed or dealt and the DC to halve the damage is otherwise unchanged.',
    ],
    special:
      'You can gain this feat multiple times. Its effects do not stack. Each time you take this feat, it applies to a new elemental subtype.',
  },
  {
    id: 'eschew-materials-pf1e',
    name: 'Eschew Materials',
    system: 'pf1e',
    source: 'CRB',
    description: 'You can cast many spells without needing to utilize minor material components.',
    benefits: [
      'You can cast any spell with a material component costing 1 gp or less without needing that component. The casting of the spell still provokes attacks of opportunity as normal. If the spell requires a material component that costs more than 1 gp, you must have the material component on hand to cast the spell, as normal.',
    ],
  },
  {
    id: 'extra-channel-pf1e',
    name: 'Extra Channel',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'other',
        description: 'Channel energy class feature',
      },
    ],
    description: 'You can channel divine energy more often.',
    benefits: ['You can channel energy two additional times per day.'],
    special:
      'If a paladin with the ability to channel positive energy takes this feat, she can use lay on hands four additional times a day, but only to channel positive energy.',
  },
  {
    id: 'extra-ki-pf1e',
    name: 'Extra Ki',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'other',
        description: 'Ki pool class feature',
      },
    ],
    description: 'You can use your ki pool more times per day than most.',
    benefits: ['Your ki pool increases by 2.'],
    special: 'You can gain Extra Ki multiple times. Its effects stack.',
  },
  {
    id: 'extra-lay-on-hands-pf1e',
    name: 'Extra Lay On Hands',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'other',
        description: 'Lay on hands class feature',
      },
    ],
    description: 'You can use your lay on hands ability more often.',
    benefits: ['You can use your lay on hands ability two additional times per day.'],
    special: 'You can gain Extra Lay On Hands multiple times. Its effects stack.',
  },
  {
    id: 'extra-mercy-pf1e',
    name: 'Extra Mercy',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'other',
        description: 'Lay on hands class feature',
      },
      {
        type: 'other',
        description: 'mercy class feature',
      },
    ],
    description: 'Your lay on hands ability adds an additional mercy.',
    benefits: [
      'Select one additional mercy for which you qualify. When you use lay on hands to heal damage to one target, it also receives the additional effects of this mercy.',
    ],
    special:
      'You can gain this feat multiple times. Its effects do not stack. Each time you take this feat, select a new mercy.',
  },
  {
    id: 'extra-performance-pf1e',
    name: 'Extra Performance',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'other',
        description: 'Bardic performance class feature',
      },
    ],
    description: 'You can use your bardic performance ability more often than normal.',
    benefits: ['You can use bardic performance for 6 additional rounds per day.'],
    special: 'You can gain Extra Performance multiple times. Its effects stack.',
  },
  {
    id: 'extra-rage-pf1e',
    name: 'Extra Rage',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'other',
        description: 'Rage class feature',
      },
    ],
    description: 'You can use your rage ability more than normal.',
    benefits: ['You can rage for 6 additional rounds per day.'],
    special: 'You can gain Extra Rage multiple times. Its effects stack.',
  },
  {
    id: 'fleet-pf1e',
    name: 'Fleet',
    system: 'pf1e',
    source: 'CRB',
    description: 'You are faster than most.',
    benefits: [
      'While you are wearing light or no armor, your base speed increases by 5 feet. You lose the benefits of this feat if you carry a medium or heavy load.',
    ],
    special: 'You can take this feat multiple times. The effects stack.',
  },
  {
    id: 'improved-channel-pf1e',
    name: 'Improved Channel',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'other',
        description: 'Channel energy class feature',
      },
    ],
    description: 'Your channeled energy is harder to resist.',
    benefits: [
      'Add 2 to the DC of saving throws made to resist the effects of your channel energy ability.',
    ],
  },
  {
    id: 'improved-familiar-pf1e',
    name: 'Improved Familiar',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'other',
        description: 'Ability to acquire a new familiar',
      },
      {
        type: 'other',
        description: 'compatible alignment',
      },
      {
        type: 'other',
        description: 'sufficiently high level (see below)',
      },
    ],
    description:
      'This feat allows you to acquire a powerful familiar, but only when you could normally acquire a new familiar.',
    benefits: [
      'When choosing a familiar, the creatures listed below are also available to you. You may choose a familiar with an alignment up to one step away on each alignment axis (lawful through chaotic, good through evil).',
    ],
  },
  {
    id: 'improved-great-fortitude-pf1e',
    name: 'Improved Great Fortitude',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'other',
        description: 'Great Fortitude',
      },
    ],
    description:
      'You can draw upon an inner reserve to resist diseases, poisons, and other grievous harm.',
    benefits: [
      'Once per day, you may reroll a Fortitude save. You must decide to use this ability before the results are revealed. You must take the second roll, even if it is worse.',
    ],
  },
  {
    id: 'improved-iron-will-pf1e',
    name: 'Improved Iron Will',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'other',
        description: 'Iron Will',
      },
    ],
    description: 'Your clarity of thought allows you to resist mental attacks.',
    benefits: [
      'Once per day, you may reroll a Will save. You must decide to use this ability before the results are revealed. You must take the second roll, even if it is worse.',
    ],
  },
  {
    id: 'improved-lightning-reflexes-pf1e',
    name: 'Improved Lightning Reflexes',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'other',
        description: 'Lightning Reflexes',
      },
    ],
    description: 'You have a knack for avoiding danger all around you.',
    benefits: [
      'Once per day, you may reroll a Reflex save. You must decide to use this ability before the results are revealed. You must take the second roll, even if it is worse.',
    ],
  },
  {
    id: 'master-craftsman-pf1e',
    name: 'Master Craftsman',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'other',
        description: '5 ranks in any Craft or Profession skill',
      },
    ],
    description: 'Your superior crafting skills allow you to create simple magic items.',
    benefits: [
      'Choose one Craft or Profession skill in which you possess at least 5 ranks. You receive a +2 bonus on your chosen Craft or Profession skill. Ranks in your chosen skill count as your caster level for the purposes of qualifying for the Craft Magic Arms and Armor and Craft Wondrous Item feats. You can create magic items using these feats, substituting your ranks in the chosen skill for your total caster level. You must use the chosen skill for the check to create the item. The DC to create the item still increases for any necessary spell requirements (see the magic item creation rules in Magic Items). You cannot use this feat to create any spell-trigger or spell-activation item.',
    ],
  },
  {
    id: 'nimble-moves-pf1e',
    name: 'Nimble Moves',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'other',
        description: 'Dex 13',
      },
    ],
    description: 'You can move across a single obstacle with ease.',
    benefits: [
      'Whenever you move, you may move through 5 feet of difficult terrain each round as if it were normal terrain. This feat allows you to take a 5-foot step into difficult terrain.',
    ],
  },
  {
    id: 'selective-channeling-pf1e',
    name: 'Selective Channeling',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'other',
        description: 'Cha 13',
      },
      {
        type: 'other',
        description: 'channel energy class feature',
      },
    ],
    description: 'You can choose whom to affect when you channel energy.',
    benefits: [
      'When you channel energy, you can choose a number of targets in the area up to your Charisma modifier. These targets are not affected by your channeled energy.',
    ],
  },
  {
    id: 'spell-mastery-pf1e',
    name: 'Spell Mastery',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'other',
        description: '1st-level wizard',
      },
    ],
    description:
      'You have mastered a small handful of spells, and can prepare these spells without referencing your spellbooks at all.',
    benefits: [
      'Each time you take this feat, choose a number of spells that you already know equal to your Intelligence modifier. From that point on, you can prepare these spells without referring to a spellbook.',
    ],
  },
  {
    id: 'turn-undead-pf1e',
    name: 'Turn Undead',
    system: 'pf1e',
    source: 'CRB',
    prerequisites: [
      {
        type: 'other',
        description: 'Channel positive energy class feature',
      },
    ],
    description:
      'Calling upon higher powers, you cause undead to flee from the might of your unleashed divine energy.',
    benefits: [
      'You can, as a standard action, use one of your uses of channel positive energy to cause all undead within 30 feet of you to flee, as if panicked. Undead receive a Will save to negate the effect. The DC for this Will save is equal to 10 + 1/2 your cleric level + your Charisma modifier. Undead that fail their save flee for 1 minute. Intelligent undead receive a new saving throw each round to end the effect. If you use channel energy in this way, it has no other effect (it does not heal or harm nearby creatures).',
    ],
  },
];
