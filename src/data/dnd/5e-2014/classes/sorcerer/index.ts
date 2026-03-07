import { CharacterClass } from '../../../../../types/character-options/classes';
import { draconicBloodlineSubclass } from './draconic-bloodline';

export const sorcerer: CharacterClass = {
  id: 'sorcerer',
  name: 'Sorcerer',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',

  version: '5.1',
  lastUpdated: '2026-01-13',
  sourceBook: {
    name: 'System Reference Document 5.1',
    url: 'https://dnd.wizards.com/resources/systems-reference-document',
  },

  hitDie: 'd6',
  primaryAbility: ['cha'],
  savingThrowProficiencies: ['con', 'cha'],

  armorProficiencies: [],
  weaponProficiencies: ['daggers', 'darts', 'slings', 'quarterstaffs', 'light-crossbows'],
  toolProficiencies: [],

  skillProficiencies: {
    count: 2,
    options: ['arcana', 'deception', 'insight', 'intimidation', 'persuasion', 'religion'],
    label: 'Choose two skills',
  },

  equipmentChoices: [
    {
      choose: 1,
      options: [['light-crossbow', 'bolts-20'], ['simple-weapon']],
    },
    {
      choose: 1,
      options: [['component-pouch'], ['arcane-focus']],
    },
    {
      choose: 1,
      options: [['dungeoneers-pack'], ['explorers-pack']],
    },
    {
      choose: 1,
      options: [['dagger', 'dagger']],
    },
  ],

  startingGold: {
    dice: '3d4',
    multiplier: 10,
  },

  features: [
    {
      level: 1,
      features: [
        {
          id: 'spellcasting-sorcerer',
          name: 'Spellcasting',
          source: 'Sorcerer 1',
          description:
            'An event in your past, or in the life of a parent or ancestor, left an indelible mark on you, infusing you with arcane magic. This font of magic, whatever its origin, fuels your spells.',
        },
        {
          id: 'sorcerous-origin',
          name: 'Sorcerous Origin',
          source: 'Sorcerer 1',
          description:
            'Choose a sorcerous origin, which describes the source of your innate magical power.',
        },
      ],
    },
    {
      level: 2,
      features: [
        {
          id: 'font-of-magic',
          name: 'Font of Magic',
          source: 'Sorcerer 2',
          description:
            'At 2nd level, you tap into a deep wellspring of magic within yourself. This wellspring is represented by sorcery points, which allow you to create a variety of magical effects.\n\nSorcery Points: You have 2 sorcery points, and you gain more as you reach higher levels, as shown in the Sorcery Points column of the Sorcerer table. You can never have more sorcery points than shown on the table for your level. You regain all spent sorcery points when you finish a long rest.\n\nFlexible Casting: You can use your sorcery points to gain additional spell slots, or sacrifice spell slots to gain additional sorcery points.',
        },
      ],
    },
    {
      level: 3,
      features: [
        {
          id: 'metamagic',
          name: 'Metamagic',
          source: 'Sorcerer 3',
          description:
            "At 3rd level, you gain the ability to twist your spells to suit your needs. You gain two of the following Metamagic options of your choice. You gain another one at 10th and 17th level.\n\nYou can use only one Metamagic option on a spell when you cast it, unless otherwise noted.\n\nCareful Spell: When you cast a spell that forces other creatures to make a saving throw, you can protect some of those creatures from the spell's full force. To do so, you spend 1 sorcery point and choose a number of those creatures up to your Charisma modifier (minimum of one creature). A chosen creature automatically succeeds on its saving throw against the spell.\n\nDistant Spell: When you cast a spell that has a range of 5 feet or greater, you can spend 1 sorcery point to double the range of the spell. When you cast a spell that has a range of touch, you can spend 1 sorcery point to make the range of the spell 30 feet.\n\nEmpowered Spell: When you roll damage for a spell, you can spend 1 sorcery point to reroll a number of the damage dice up to your Charisma modifier (minimum of one). You must use the new rolls. You can use Empowered Spell even if you have already used a different Metamagic option during the casting of the spell.\n\nExtended Spell: When you cast a spell that has a duration of 1 minute or longer, you can spend 1 sorcery point to double its duration, to a maximum duration of 24 hours.\n\nHeightened Spell: When you cast a spell that forces a creature to make a saving throw to resist its effects, you can spend 3 sorcery points to give one target of the spell disadvantage on its first saving throw made against the spell.\n\nQuickened Spell: When you cast a spell that has a casting time of 1 action, you can spend 2 sorcery points to change the casting time to 1 bonus action for this casting.\n\nSubtle Spell: When you cast a spell, you can spend 1 sorcery point to cast it without any somatic or verbal components.\n\nTwinned Spell: When you cast a spell that targets only one creature and doesn't have a range of self, you can spend a number of sorcery points equal to the spell's level to target a second creature in range with the same spell (1 sorcery point if the spell is a cantrip).",
        },
      ],
    },
    {
      level: 4,
      features: [
        {
          id: 'ability-score-improvement-4',
          name: 'Ability Score Improvement',
          source: 'Sorcerer 4',
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
          id: 'sorcerous-origin-6',
          name: 'Sorcerous Origin Feature',
          source: 'Sorcerer 6',
          description: 'At 6th level, you gain a feature from your Sorcerous Origin.',
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
          source: 'Sorcerer 8',
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
      features: [],
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
          source: 'Sorcerer 12',
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
          id: 'sorcerous-origin-14',
          name: 'Sorcerous Origin Feature',
          source: 'Sorcerer 14',
          description: 'At 14th level, you gain a feature from your Sorcerous Origin.',
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
          source: 'Sorcerer 16',
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
          id: 'sorcerous-origin-18',
          name: 'Sorcerous Origin Feature',
          source: 'Sorcerer 18',
          description: 'At 18th level, you gain a feature from your Sorcerous Origin.',
        },
      ],
    },
    {
      level: 19,
      features: [
        {
          id: 'ability-score-improvement-19',
          name: 'Ability Score Improvement',
          source: 'Sorcerer 19',
          description:
            'When you reach 19th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
        },
      ],
    },
    {
      level: 20,
      features: [
        {
          id: 'sorcerous-restoration',
          name: 'Sorcerous Restoration',
          source: 'Sorcerer 20',
          description:
            'At 20th level, you regain 4 expended sorcery points whenever you finish a short rest.',
        },
      ],
    },
  ],

  subclassLevel: 1,
  subclasses: [draconicBloodlineSubclass],

  subclassSelection: {
    timing: 'level',
    optional: false,
    canChange: false,
    prerequisitesMustMeet: false,
    flavorText: 'At 1st level, you choose a sorcerous origin that reflects your innate magic.',
  }, // SRD: Draconic Bloodline only

  classResources: [
    {
      id: 'sorcery-points',
      name: 'Sorcery Points',
      maxFormula: 'level',
      recoveryType: 'long-rest',
      displayOrder: 1,
    },
  ],

  spellcasting: {
    ability: 'cha',
    spellListId: 'sorcerer',
    cantripsKnown: [4, 4, 4, 5, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
    spellsKnown: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 12, 13, 13, 14, 14, 15, 15, 15, 15],
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
    ritualCasting: false,
    multiclassCasterLevel: 'full',
  },

  multiclassRequirements: [
    {
      type: 'attribute',
      value: 13,
      description: 'Charisma 13',
    },
  ],

  multiclassProficiencies: {
    armor: [],
    weapons: [],
    tools: [],
  },

  description: 'A spellcaster who draws on inherent magic from a gift or bloodline.',

  displayMetadata: {
    icon: 'flame',
    color: '#FF4500',
    shortDescription: 'A spellcaster who draws on inherent magic from a gift or bloodline.',
    playStyle: 'Flexible arcane caster with metamagic',
    complexity: 'complex',
    role: 'striker',
    idealFor: ['Players who like customization', 'Blaster casters'],
    tags: ['spellcaster', 'arcane'],
    casterType: 'full',
  },
};
