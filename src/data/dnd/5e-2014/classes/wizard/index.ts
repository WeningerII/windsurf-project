import { CharacterClass } from '../../../../../types/character-options/classes';
import { evocationSubclass } from './evocation';

export const wizard: CharacterClass = {
  id: 'wizard',
  name: 'Wizard',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',

  version: '5.1',
  lastUpdated: '2026-01-13',
  sourceBook: {
    name: 'System Reference Document 5.1',
    url: 'https://dnd.wizards.com/resources/systems-reference-document',
  },

  hitDie: 'd6',
  primaryAbility: ['int'],
  savingThrowProficiencies: ['int', 'wis'],

  armorProficiencies: [],
  weaponProficiencies: ['daggers', 'darts', 'slings', 'quarterstaffs', 'light-crossbows'],
  toolProficiencies: [],

  skillProficiencies: {
    count: 2,
    options: ['arcana', 'history', 'insight', 'investigation', 'medicine', 'religion'],
    label: 'Choose two skills',
  },

  equipmentChoices: [
    {
      choose: 1,
      options: [['quarterstaff'], ['dagger']],
    },
    {
      choose: 1,
      options: [['component-pouch'], ['arcane-focus']],
    },
    {
      choose: 1,
      options: [['scholars-pack'], ['explorers-pack']],
    },
  ],

  startingGold: {
    dice: '4d4',
    multiplier: 10,
  },

  features: [
    {
      level: 1,
      features: [
        {
          id: 'spellcasting-wizard',
          name: 'Spellcasting',
          source: 'Wizard 1',
          description:
            'As a student of arcane magic, you have a spellbook containing spells that show the first glimmerings of your true power.\n\nCantrips: At 1st level, you know three cantrips of your choice from the wizard spell list. You learn additional wizard cantrips of your choice at higher levels.\n\nSpellbook: At 1st level, you have a spellbook containing six 1st-level wizard spells of your choice. Your spellbook is the repository of the wizard spells you know, except your cantrips, which are fixed in your mind.\n\nPreparing and Casting Spells: You prepare the list of wizard spells that are available for you to cast. To do so, choose a number of wizard spells from your spellbook equal to your Intelligence modifier + your wizard level (minimum of one spell). The spells must be of a level for which you have spell slots.\n\nSpellcasting Ability: Intelligence is your spellcasting ability for your wizard spells.',
        },
        {
          id: 'arcane-recovery',
          name: 'Arcane Recovery',
          source: 'Wizard 1',
          description:
            'You have learned to regain some of your magical energy by studying your spellbook. Once per day when you finish a short rest, you can choose expended spell slots to recover. The spell slots can have a combined level that is equal to or less than half your wizard level (rounded up), and none of the slots can be 6th level or higher.',
          uses: {
            current: 1,
            max: 1,
            recoveryType: 'long-rest',
          },
        },
      ],
    },
    {
      level: 2,
      features: [
        {
          id: 'arcane-tradition',
          name: 'Arcane Tradition',
          source: 'Wizard 2',
          description:
            'When you reach 2nd level, you choose an arcane tradition, shaping your practice of magic through one of eight schools.',
        },
      ],
    },
    {
      level: 3,
      features: [],
    },
    {
      level: 4,
      features: [
        {
          id: 'ability-score-improvement-4',
          name: 'Ability Score Improvement',
          source: 'Wizard 4',
          description:
            'When you reach 4th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
        },
      ],
    },
    {
      level: 5,
      features: [],
    },
    {
      level: 6,
      features: [
        {
          id: 'arcane-tradition-6',
          name: 'Arcane Tradition Feature',
          source: 'Wizard 6',
          description: 'At 6th level, you gain a feature from your Arcane Tradition.',
        },
      ],
    },
    {
      level: 7,
      features: [],
    },
    {
      level: 8,
      features: [
        {
          id: 'ability-score-improvement-8',
          name: 'Ability Score Improvement',
          source: 'Wizard 8',
          description:
            'When you reach 8th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
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
          id: 'arcane-tradition-10',
          name: 'Arcane Tradition Feature',
          source: 'Wizard 10',
          description: 'At 10th level, you gain a feature from your Arcane Tradition.',
        },
      ],
    },
    {
      level: 11,
      features: [],
    },
    {
      level: 12,
      features: [
        {
          id: 'ability-score-improvement-12',
          name: 'Ability Score Improvement',
          source: 'Wizard 12',
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
          id: 'arcane-tradition-14',
          name: 'Arcane Tradition Feature',
          source: 'Wizard 14',
          description: 'At 14th level, you gain a feature from your Arcane Tradition.',
        },
      ],
    },
    {
      level: 15,
      features: [],
    },
    {
      level: 16,
      features: [
        {
          id: 'ability-score-improvement-16',
          name: 'Ability Score Improvement',
          source: 'Wizard 16',
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
          id: 'spell-mastery',
          name: 'Spell Mastery',
          source: 'Wizard 18',
          description:
            'At 18th level, you have achieved such mastery over certain spells that you can cast them at will. Choose a 1st-level wizard spell and a 2nd-level wizard spell that are in your spellbook. You can cast those spells at their lowest level without expending a spell slot when you have them prepared.',
        },
      ],
    },
    {
      level: 19,
      features: [
        {
          id: 'ability-score-improvement-19',
          name: 'Ability Score Improvement',
          source: 'Wizard 19',
          description:
            'When you reach 19th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
        },
      ],
    },
    {
      level: 20,
      features: [
        {
          id: 'signature-spells',
          name: 'Signature Spells',
          source: 'Wizard 20',
          description:
            "When you reach 20th level, you gain mastery over two powerful spells and can cast them with little effort. Choose two 3rd-level wizard spells in your spellbook as your signature spells. You always have these spells prepared, they don't count against the number of spells you have prepared, and you can cast each of them once at 3rd level without expending a spell slot. When you do so, you can't do so again until you finish a short or long rest.",
        },
      ],
    },
  ],

  subclassLevel: 2,
  subclasses: [evocationSubclass],

  subclassSelection: {
    timing: 'level',
    optional: false,
    canChange: false,
    prerequisitesMustMeet: false,
    flavorText: 'At 2nd level, you choose an arcane tradition that shapes your study.',
  },

  classResources: [
    {
      id: 'arcane-recovery',
      name: 'Arcane Recovery',
      maxFormula: '"1"',
      recoveryType: 'long-rest',
      displayOrder: 1,
    },
  ], // SRD: Only School of Evocation

  spellcasting: {
    ability: 'int',
    spellListId: 'wizard',
    cantripsKnown: [3, 3, 3, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    preparedCasterFormula: 'int_modifier + wizard_level',
    spellSlots: {
      1: [2, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
      2: [0, 0, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
      3: [0, 0, 0, 0, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
      4: [0, 0, 0, 0, 0, 0, 1, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
      5: [0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3],
      6: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2],
      7: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 2],
      8: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1],
      9: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
    },
    ritualCasting: true,
    multiclassCasterLevel: 'full',
  },

  multiclassRequirements: [
    {
      type: 'attribute',
      value: 13,
      description: 'Intelligence 13',
    },
  ],

  multiclassProficiencies: {
    armor: [],
    weapons: [],
    tools: [],
  },

  description: 'A scholarly magic-user capable of manipulating the structures of reality.',

  displayMetadata: {
    icon: 'book',
    color: '#4169E1',
    shortDescription: 'A scholarly magic-user capable of manipulating reality.',
    playStyle: 'Versatile arcane caster with vast spell selection',
    complexity: 'complex',
    role: 'controller',
    idealFor: ['Players who like complexity', 'Spell variety enthusiasts'],
    tags: ['spellcaster', 'arcane', 'versatile', 'summoner'],
    casterType: 'full',
  },
};
