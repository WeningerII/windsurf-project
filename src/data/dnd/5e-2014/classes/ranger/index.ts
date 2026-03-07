import { CharacterClass } from '../../../../../types/character-options/classes';
import { hunterSubclass } from './hunter';

export const ranger: CharacterClass = {
  id: 'ranger',
  name: 'Ranger',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',

  version: '5.1',
  lastUpdated: '2026-01-13',
  sourceBook: {
    name: 'System Reference Document 5.1',
    url: 'https://dnd.wizards.com/resources/systems-reference-document',
  },

  hitDie: 'd10',
  primaryAbility: ['dex', 'wis'],
  savingThrowProficiencies: ['str', 'dex'],

  armorProficiencies: ['light', 'medium', 'shields'],
  weaponProficiencies: ['simple', 'martial'],
  toolProficiencies: [],

  skillProficiencies: {
    count: 3,
    options: [
      'animal-handling',
      'athletics',
      'insight',
      'investigation',
      'nature',
      'perception',
      'stealth',
      'survival',
    ],
    label: 'Choose three skills',
  },

  equipmentChoices: [
    {
      choose: 1,
      options: [['scale-mail'], ['leather-armor']],
    },
    {
      choose: 1,
      options: [
        ['shortsword', 'shortsword'],
        ['simple-melee-weapon', 'simple-melee-weapon'],
      ],
    },
    {
      choose: 1,
      options: [['dungeoneers-pack'], ['explorers-pack']],
    },
    {
      choose: 1,
      options: [['longbow', 'arrows-20']],
    },
  ],

  startingGold: {
    dice: '5d4',
    multiplier: 10,
  },

  features: [
    {
      level: 1,
      features: [
        {
          id: 'favored-enemy',
          name: 'Favored Enemy',
          source: 'Ranger 1',
          description:
            'Beginning at 1st level, you have significant experience studying, tracking, hunting, and even talking to a certain type of enemy.\n\nChoose a type of favored enemy: aberrations, beasts, celestials, constructs, dragons, elementals, fey, fiends, giants, monstrosities, oozes, plants, or undead. Alternatively, you can select two races of humanoid (such as gnolls and orcs) as favored enemies.\n\nYou have advantage on Wisdom (Survival) checks to track your favored enemies, as well as on Intelligence checks to recall information about them.\n\nWhen you gain this feature, you also learn one language of your choice that is spoken by your favored enemies, if they speak one at all.\n\nYou choose one additional favored enemy, as well as an associated language, at 6th and 14th level.',
        },
        {
          id: 'natural-explorer',
          name: 'Natural Explorer',
          source: 'Ranger 1',
          description:
            "You are particularly familiar with one type of natural environment and are adept at traveling and surviving in such regions. Choose one type of favored terrain: arctic, coast, desert, forest, grassland, mountain, swamp, or the Underdark.\n\nWhen you make an Intelligence or Wisdom check related to your favored terrain, your proficiency bonus is doubled if you are using a skill that you're proficient in.\n\nWhile traveling for an hour or more in your favored terrain, you gain the following benefits:\n\n• Difficult terrain doesn't slow your group's travel.\n• Your group can't become lost except by magical means.\n• Even when you are engaged in another activity while traveling (such as foraging, navigating, or tracking), you remain alert to danger.\n• If you are traveling alone, you can move stealthily at a normal pace.\n• When you forage, you find twice as much food as you normally would.\n• While tracking other creatures, you also learn their exact number, their sizes, and how long ago they passed through the area.\n\nYou choose additional favored terrain types at 6th and 10th level.",
        },
      ],
    },
    {
      level: 2,
      features: [
        {
          id: 'fighting-style-ranger',
          name: 'Fighting Style',
          source: 'Ranger 2',
          description:
            "At 2nd level, you adopt a particular style of fighting as your specialty. Choose one of the following options. You can't take a Fighting Style option more than once, even if you later get to choose again.\n\nArchery: You gain a +2 bonus to attack rolls you make with ranged weapons.\n\nDefense: While you are wearing armor, you gain a +1 bonus to AC.\n\nDueling: When you are wielding a melee weapon in one hand and no other weapons, you gain a +2 bonus to damage rolls with that weapon.\n\nTwo-Weapon Fighting: When you engage in two-weapon fighting, you can add your ability modifier to the damage of the second attack.",
        },
        {
          id: 'spellcasting-ranger',
          name: 'Spellcasting',
          source: 'Ranger 2',
          description:
            'By the time you reach 2nd level, you have learned to use the magical essence of nature to cast spells, much as a druid does.',
        },
      ],
    },
    {
      level: 3,
      features: [
        {
          id: 'ranger-archetype',
          name: 'Ranger Archetype',
          source: 'Ranger 3',
          description: 'At 3rd level, you choose an archetype that you strive to emulate.',
        },
        {
          id: 'primeval-awareness',
          name: 'Primeval Awareness',
          source: 'Ranger 3',
          description:
            "Beginning at 3rd level, you can use your action and expend one ranger spell slot to focus your awareness on the region around you. For 1 minute per level of the spell slot you expend, you can sense whether the following types of creatures are present within 1 mile of you (or within up to 6 miles if you are in your favored terrain): aberrations, celestials, dragons, elementals, fey, fiends, and undead. This feature doesn't reveal the creatures' location or number.",
        },
      ],
    },
    {
      level: 4,
      features: [
        {
          id: 'ability-score-improvement-4',
          name: 'Ability Score Improvement',
          source: 'Ranger 4',
          description:
            'When you reach 4th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
        },
      ],
    },
    {
      level: 5,
      features: [
        {
          id: 'extra-attack-ranger',
          name: 'Extra Attack',
          source: 'Ranger 5',
          description:
            'Beginning at 5th level, you can attack twice, instead of once, whenever you take the Attack action on your turn.',
        },
      ],
    },
    {
      level: 6,
      features: [],
    },
    {
      level: 7,
      features: [
        {
          id: 'ranger-archetype-7',
          name: 'Ranger Archetype Feature',
          source: 'Ranger 7',
          description: 'At 7th level, you gain a feature from your Ranger Archetype.',
        },
      ],
    },
    {
      level: 8,
      features: [
        {
          id: 'ability-score-improvement-8',
          name: 'Ability Score Improvement',
          source: 'Ranger 8',
          description:
            'When you reach 8th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
        },
        {
          id: 'lands-stride',
          name: "Land's Stride",
          source: 'Ranger 8',
          description:
            'Starting at 8th level, moving through nonmagical difficult terrain costs you no extra movement. You can also pass through nonmagical plants without being slowed by them and without taking damage from them if they have thorns, spines, or a similar hazard.\n\nIn addition, you have advantage on saving throws against plants that are magically created or manipulated to impede movement, such those created by the entangle spell.',
        },
      ],
    },
    {
      level: 9,
      features: [],
    },
    {
      level: 10,
      features: [
        {
          id: 'hide-in-plain-sight',
          name: 'Hide in Plain Sight',
          source: 'Ranger 10',
          description:
            'Starting at 10th level, you can spend 1 minute creating camouflage for yourself. You must have access to fresh mud, dirt, plants, soot, and other naturally occurring materials with which to create your camouflage.\n\nOnce you are camouflaged in this way, you can try to hide by pressing yourself up against a solid surface, such as a tree or wall, that is at least as tall and wide as you are. You gain a +10 bonus to Dexterity (Stealth) checks as long as you remain there without moving or taking actions. Once you move or take an action or a reaction, you must camouflage yourself again to gain this benefit.',
        },
      ],
    },
    {
      level: 11,
      features: [
        {
          id: 'ranger-archetype-11',
          name: 'Ranger Archetype Feature',
          source: 'Ranger 11',
          description: 'At 11th level, you gain a feature from your Ranger Archetype.',
        },
      ],
    },
    {
      level: 12,
      features: [
        {
          id: 'ability-score-improvement-12',
          name: 'Ability Score Improvement',
          source: 'Ranger 12',
          description:
            'When you reach 12th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
        },
      ],
    },
    {
      level: 13,
      features: [],
    },
    {
      level: 14,
      features: [
        {
          id: 'vanish',
          name: 'Vanish',
          source: 'Ranger 14',
          description:
            "Starting at 14th level, you can use the Hide action as a bonus action on your turn. Also, you can't be tracked by nonmagical means, unless you choose to leave a trail.",
        },
      ],
    },
    {
      level: 15,
      features: [
        {
          id: 'ranger-archetype-15',
          name: 'Ranger Archetype Feature',
          source: 'Ranger 15',
          description: 'At 15th level, you gain a feature from your Ranger Archetype.',
        },
      ],
    },
    {
      level: 16,
      features: [
        {
          id: 'ability-score-improvement-16',
          name: 'Ability Score Improvement',
          source: 'Ranger 16',
          description:
            'When you reach 16th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
        },
      ],
    },
    {
      level: 17,
      features: [],
    },
    {
      level: 18,
      features: [
        {
          id: 'feral-senses',
          name: 'Feral Senses',
          source: 'Ranger 18',
          description:
            "At 18th level, you gain preternatural senses that help you fight creatures you can't see. When you attack a creature you can't see, your inability to see it doesn't impose disadvantage on your attack rolls against it.\n\nYou are also aware of the location of any invisible creature within 30 feet of you, provided that the creature isn't hidden from you and you aren't blinded or deafened.",
        },
      ],
    },
    {
      level: 19,
      features: [
        {
          id: 'ability-score-improvement-19',
          name: 'Ability Score Improvement',
          source: 'Ranger 19',
          description:
            'When you reach 19th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
        },
      ],
    },
    {
      level: 20,
      features: [
        {
          id: 'foe-slayer',
          name: 'Foe Slayer',
          source: 'Ranger 20',
          description:
            'At 20th level, you become an unparalleled hunter of your enemies. Once on each of your turns, you can add your Wisdom modifier to the attack roll or the damage roll of an attack you make against one of your favored enemies. You can choose to use this feature before or after the roll, but before any effects of the roll are applied.',
        },
      ],
    },
  ],

  subclassLevel: 3,
  subclasses: [hunterSubclass],

  subclassSelection: {
    timing: 'level',
    optional: false,
    canChange: false,
    prerequisitesMustMeet: false,
    flavorText: 'At 3rd level, you choose an archetype that best reflects your training.',
  },

  classResources: [
    {
      id: 'favored-enemy-count',
      name: 'Favored Enemies',
      maxFormula: 'level >= 14 ? "3" : level >= 6 ? "2" : "1"',
      recoveryType: 'long-rest',
      displayOrder: 1,
    },
  ], // SRD: Hunter only

  spellcasting: {
    ability: 'wis',
    spellListId: 'ranger',
    spellsKnown: [0, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11],
    spellSlots: {
      1: [0, 2, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
      2: [0, 0, 0, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
      3: [0, 0, 0, 0, 0, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
      4: [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3],
      5: [0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3],
      6: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      7: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      8: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      9: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
    ritualCasting: false,
    multiclassCasterLevel: 'half',
  },

  multiclassRequirements: [
    {
      type: 'attribute',
      value: 13,
      description: 'Dexterity 13 and Wisdom 13',
    },
  ],

  multiclassProficiencies: {
    armor: ['light', 'medium', 'shields'],
    weapons: ['simple', 'martial'],
    tools: [],
  },

  description:
    'A warrior who uses martial prowess and nature magic to combat threats on the edges of civilization.',

  displayMetadata: {
    icon: 'bow',
    color: '#228B22',
    shortDescription: 'A warrior who uses martial prowess and nature magic to hunt threats.',
    playStyle: 'Ranged combatant with nature magic',
    complexity: 'moderate',
    role: 'striker',
    idealFor: ['Ranged combat enthusiasts', 'Nature-themed players'],
    tags: ['martial', 'ranged', 'melee', 'primal', 'versatile'],
    casterType: 'half',
  },
};
