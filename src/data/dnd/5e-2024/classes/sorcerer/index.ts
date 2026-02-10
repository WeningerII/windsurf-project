import { CharacterClass } from '../../../../../types/character-options/classes';
import { draconicBloodlineSubclass } from './draconic-bloodline';

export const sorcerer: CharacterClass = {
  id: 'sorcerer',
  name: 'Sorcerer',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  
  version: '5.2',
  lastUpdated: '2026-01-13',
  sourceBook: {
    name: 'System Reference Document 5.2 (2024)',
    url: 'https://dnd.wizards.com/resources/systems-reference-document'
  },
  
  hitDie: 'd6',
  primaryAbility: ['cha'],
  savingThrowProficiencies: ['con', 'cha'],
  
  armorProficiencies: [],
  weaponProficiencies: ['simple'],
  toolProficiencies: [],
  
  skillProficiencies: {
    count: 2,
    options: ['arcana', 'deception', 'insight', 'intimidation', 'persuasion', 'religion'],
    label: 'Choose two skills',
  },
  
  equipmentChoices: [
    {
      choose: 1,
      options: [
        ['light-crossbow', 'bolts-20'],
        ['simple-weapon'],
      ],
    },
    {
      choose: 1,
      options: [
        ['component-pouch'],
        ['arcane-focus'],
      ],
    },
    {
      choose: 1,
      options: [
        ['dungeoneers-pack'],
        ['explorers-pack'],
      ],
    },
    {
      choose: 1,
      options: [
        ['dagger', 'dagger'],
      ],
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
          id: 'innate-sorcery',
          name: 'Innate Sorcery',
          source: 'Sorcerer 1',
          description: 'An event in your past, or in the life of a parent or ancestor, left an indelible mark on you, infusing you with arcane magic. As a Bonus Action, you can unleash the magic within you for 1 minute. For the duration, the spell save DC of your Sorcerer spells increases by 1, and you have Advantage on attack rolls for Sorcerer spells you cast. You can use this feature twice, and you regain all expended uses of it when you finish a Long Rest.',
          uses: {
            current: 2,
            max: 2,
            recoveryType: 'long-rest',
          },
        },
        {
          id: 'spellcasting-sorcerer',
          name: 'Spellcasting',
          source: 'Sorcerer 1',
          description: 'You have learned to manipulate the fabric of reality with your will and your innate magic. You can cast Sorcerer spells.',
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
          description: 'You tap into a deep wellspring of magic within yourself. This wellspring is represented by Sorcery Points, which allow you to create a variety of magical effects. You have 2 Sorcery Points, and you gain more as you reach higher levels. You regain all spent Sorcery Points when you finish a Long Rest. You can also use your Sorcery Points to gain additional spell slots or sacrifice spell slots to gain additional Sorcery Points.',
        },
        {
          id: 'metamagic',
          name: 'Metamagic',
          source: 'Sorcerer 2',
          description: 'You gain the ability to twist your spells to suit your needs. You gain two Metamagic options of your choice. You gain more at higher levels. You can use only one Metamagic option on a spell when you cast it, unless otherwise noted.',
        },
      ],
    },
    {
      level: 3,
      features: [
        {
          id: 'sorcerous-origin',
          name: 'Sorcerer Subclass',
          source: 'Sorcerer 3',
          description: 'You choose a Sorcerous Origin, which describes the source of your innate magical power.',
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
          description: 'Increase one ability score by 2, or increase two ability scores by 1.',
        },
      ],
    },
    {
      level: 5,
      features: [
        {
          id: 'sorcerous-vitality',
          name: 'Sorcerous Vitality',
          source: 'Sorcerer 5',
          description: 'Your innate magic sustains you in battle. As a Bonus Action, you can spend 1 or more Sorcery Points to regain Hit Points. For each Sorcery Point you spend, you roll a d6 and add your Constitution modifier to the roll. You regain a number of Hit Points equal to the total.',
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
          id: 'sorcery-incarnate',
          name: 'Sorcery Incarnate',
          source: 'Sorcerer 7',
          description: 'While your Innate Sorcery feature is active, you can use up to two Metamagic options on a spell when you cast it.',
        },
      ],
    },
    {
      level: 8,
      features: [
        {
          id: 'ability-score-improvement-8',
          name: 'Ability Score Improvement',
          source: 'Sorcerer 8',
          description: 'Increase one ability score by 2, or increase two ability scores by 1.',
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
          id: 'metamagic-10',
          name: 'Metamagic',
          source: 'Sorcerer 10',
          description: 'You gain two additional Metamagic options.',
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
          source: 'Sorcerer 12',
          description: 'Increase one ability score by 2, or increase two ability scores by 1.',
        },
      ],
    },
    {
      level: 13,
      features: [],
    },
    {
      level: 14,
      features: [],
    },
    {
      level: 15,
      features: [
        {
          id: 'sorcerous-restoration',
          name: 'Sorcerous Restoration',
          source: 'Sorcerer 15',
          description: 'You regain 4 expended Sorcery Points whenever you finish a Short Rest. Additionally, when you roll Initiative and have no Sorcery Points remaining, you regain 4 Sorcery Points.',
        },
      ],
    },
    {
      level: 16,
      features: [
        {
          id: 'ability-score-improvement-16',
          name: 'Ability Score Improvement',
          source: 'Sorcerer 16',
          description: 'Increase one ability score by 2, or increase two ability scores by 1.',
        },
      ],
    },
    {
      level: 17,
      features: [
        {
          id: 'metamagic-17',
          name: 'Metamagic',
          source: 'Sorcerer 17',
          description: 'You gain two additional Metamagic options.',
        },
      ],
    },
    {
      level: 18,
      features: [
        {
          id: 'arcane-apotheosis',
          name: 'Arcane Apotheosis',
          source: 'Sorcerer 18',
          description: 'While your Innate Sorcery feature is active, you can use one Metamagic option on each of your turns without spending Sorcery Points.',
        },
      ],
    },
    {
      level: 19,
      features: [
        {
          id: 'epic-boon',
          name: 'Epic Boon',
          source: 'Sorcerer 19',
          description: 'You gain an Epic Boon feat or another feat of your choice for which you qualify.',
        },
        {
          id: 'ability-score-improvement-19',
          name: 'Ability Score Improvement',
          source: 'Sorcerer 19',
          description: 'Increase one ability score by 2, or increase two ability scores by 1.',
        },
      ],
    },
    {
      level: 20,
      features: [
        {
          id: 'sorcery-incarnate-20',
          name: 'Sorcerous Restoration Improvement',
          source: 'Sorcerer 20',
          description: 'You regain 4 Sorcery Points when you finish a Short Rest, or when you roll Initiative and have no Sorcery Points left.',
        },
      ],
    },
  ],
  
  subclassLevel: 3,
  subclasses: [draconicBloodlineSubclass],
  
  subclassSelection: {
    timing: 'level',
    optional: false,
    canChange: false,
    prerequisitesMustMeet: false,
    flavorText: 'At 3rd level, you choose a Sorcerous Origin.'
  },
  
  classResources: [
    {
      id: 'sorcery-points',
      name: 'Sorcery Points',
      maxFormula: 'level',
      recoveryType: 'long-rest',
      displayOrder: 1,
    },
    {
      id: 'innate-sorcery',
      name: 'Innate Sorcery',
      maxFormula: '2',
      recoveryType: 'long-rest',
      displayOrder: 2,
      defaultValue: 2,
    },
  ],
  
  spellcasting: {
    ability: 'cha',
    spellListId: 'sorcerer',
    cantripsKnown: [4, 4, 4, 5, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
    spellsKnown: [2, 4, 6, 8, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 22, 22, 22],
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
