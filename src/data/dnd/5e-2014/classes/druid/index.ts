import { CharacterClass } from '../../../../../types/character-options/classes';
import { landSubclass } from './land';

export const druid: CharacterClass = {
  id: 'druid',
  name: 'Druid',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  
  version: '5.1',
  lastUpdated: '2026-01-13',
  sourceBook: {
    name: 'System Reference Document 5.1',
    url: 'https://dnd.wizards.com/resources/systems-reference-document'
  },
  
  hitDie: 'd8',
  primaryAbility: ['wis'],
  savingThrowProficiencies: ['int', 'wis'],
  
  armorProficiencies: ['light', 'medium', 'shields'],
  weaponProficiencies: ['clubs', 'daggers', 'darts', 'javelins', 'maces', 'quarterstaffs', 'scimitars', 'sickles', 'slings', 'spears'],
  toolProficiencies: [{
    count: 1,
    options: ['herbalism-kit'],
    label: 'Herbalism kit',
  }],
  
  skillProficiencies: {
    count: 2,
    options: ['arcana', 'animal-handling', 'insight', 'medicine', 'nature', 'perception', 'religion', 'survival'],
    label: 'Choose two skills',
  },
  
  equipmentChoices: [
    {
      choose: 1,
      options: [
        ['wooden-shield'],
        ['simple-weapon'],
      ],
    },
    {
      choose: 1,
      options: [
        ['scimitar'],
        ['simple-melee-weapon'],
      ],
    },
    {
      choose: 1,
      options: [
        ['leather-armor', 'explorers-pack', 'druidic-focus'],
      ],
    },
  ],
  
  startingGold: {
    dice: '2d4',
    multiplier: 10,
  },
  
  features: [
    {
      level: 1,
      features: [
        {
          id: 'druidic',
          name: 'Druidic',
          source: 'Druid 1',
          description: 'You know Druidic, the secret language of druids. You can speak the language and use it to leave hidden messages. You and others who know this language automatically spot such a message. Others spot the message\'s presence with a successful DC 15 Wisdom (Perception) check but can\'t decipher it without magic.',
        },
        {
          id: 'spellcasting-druid',
          name: 'Spellcasting',
          source: 'Druid 1',
          description: 'Drawing on the divine essence of nature itself, you can cast spells to shape that essence to your will.',
        },
      ],
    },
    {
      level: 2,
      features: [
        {
          id: 'wild-shape',
          name: 'Wild Shape',
          source: 'Druid 2',
          description: 'Starting at 2nd level, you can use your action to magically assume the shape of a beast that you have seen before. You can use this feature twice. You regain expended uses when you finish a short or long rest.\n\nYour druid level determines the beasts you can transform into, as shown in the Beast Shapes table. At 2nd level, for example, you can transform into any beast that has a challenge rating of 1/4 or lower that doesn\'t have a flying or swimming speed.\n\nYou can stay in a beast shape for a number of hours equal to half your druid level (rounded down). You then revert to your normal form unless you expend another use of this feature. You can revert to your normal form earlier by using a bonus action on your turn. You automatically revert if you fall unconscious, drop to 0 hit points, or die.',
          uses: {
            current: 2,
            max: 2,
            recoveryType: 'short-rest',
          },
        },
        {
          id: 'druid-circle',
          name: 'Druid Circle',
          source: 'Druid 2',
          description: 'At 2nd level, you choose to identify with a circle of druids.',
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
          id: 'wild-shape-improvement-4',
          name: 'Wild Shape Improvement',
          source: 'Druid 4',
          description: 'At 4th level, you can transform into beasts with a challenge rating as high as 1/2.',
        },
        {
          id: 'ability-score-improvement-4',
          name: 'Ability Score Improvement',
          source: 'Druid 4',
          description: 'When you reach 4th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
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
          id: 'circle-feature-6',
          name: 'Circle Feature',
          source: 'Druid 6',
          description: 'At 6th level, you gain a feature from your Druid Circle.',
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
          id: 'wild-shape-improvement-8',
          name: 'Wild Shape Improvement',
          source: 'Druid 8',
          description: 'At 8th level, you can transform into beasts with a challenge rating as high as 1.',
        },
        {
          id: 'ability-score-improvement-8',
          name: 'Ability Score Improvement',
          source: 'Druid 8',
          description: 'When you reach 8th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
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
          id: 'circle-feature-10',
          name: 'Circle Feature',
          source: 'Druid 10',
          description: 'At 10th level, you gain a feature from your Druid Circle.',
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
          source: 'Druid 12',
          description: 'When you reach 12th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
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
          id: 'circle-feature-14',
          name: 'Circle Feature',
          source: 'Druid 14',
          description: 'At 14th level, you gain a feature from your Druid Circle.',
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
          source: 'Druid 16',
          description: 'When you reach 16th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
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
          id: 'timeless-body-druid',
          name: 'Timeless Body',
          source: 'Druid 18',
          description: 'Starting at 18th level, the primal magic that you wield causes you to age more slowly. For every 10 years that pass, your body ages only 1 year.',
        },
        {
          id: 'beast-spells',
          name: 'Beast Spells',
          source: 'Druid 18',
          description: 'Beginning at 18th level, you can cast many of your druid spells in any shape you assume using Wild Shape. You can perform the somatic and verbal components of a druid spell while in a beast shape, but you aren\'t able to provide material components.',
        },
      ],
    },
    {
      level: 19,
      features: [
        {
          id: 'ability-score-improvement-19',
          name: 'Ability Score Improvement',
          source: 'Druid 19',
          description: 'When you reach 19th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
        },
      ],
    },
    {
      level: 20,
      features: [
        {
          id: 'archdruid',
          name: 'Archdruid',
          source: 'Druid 20',
          description: 'At 20th level, you can use your Wild Shape an unlimited number of times.\n\nAdditionally, you can ignore the verbal and somatic components of your druid spells, as well as any material components that lack a cost and aren\'t consumed by a spell. You gain this benefit in both your normal shape and your beast shape from Wild Shape.',
        },
  ],
},
],

subclassLevel: 2,
subclasses: [landSubclass],

subclassSelection: {
  timing: 'level',
  optional: false,
  canChange: false,
  prerequisitesMustMeet: false,
  flavorText: 'At 2nd level, you choose to identify with a circle of druids.'
}, 

classResources: [
  {
    id: 'wild-shape',
    name: 'Wild Shape',
    maxFormula: '2',
    recoveryType: 'short-rest',
    displayOrder: 1,
    defaultValue: 2,
  },
],

spellcasting: {
  ability: 'wis',
  spellListId: 'druid',
  cantripsKnown: [2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
  preparedCasterFormula: 'wis_modifier + druid_level',
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
    description: 'Wisdom 13',
  },
],

multiclassProficiencies: {
  armor: ['light', 'medium', 'shields'],
  weapons: [],
  tools: [],
},

description: 'A priest of the Old Faith, wielding the powers of nature and adopting animal forms.',

displayMetadata: {
  icon: 'leaf',
  color: '#228B22',
  shortDescription: 'A priest of nature who wields primal magic and can shapeshift.',
  playStyle: 'Versatile caster with wild shape abilities',
  complexity: 'complex',
  role: 'support',
  idealFor: ['Nature enthusiasts', 'Players who like shapeshifting'],
  tags: ['spellcaster', 'primal', 'shapeshifter', 'support', 'versatile', 'summoner'],
  casterType: 'full',
},
}
