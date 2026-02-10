import { CharacterClass } from '../../../../../types/character-options/classes';
import { landSubclass } from './land';

export const druid: CharacterClass = {
  id: 'druid',
  name: 'Druid',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  
  version: '5.2',
  lastUpdated: '2026-01-13',
  sourceBook: {
    name: 'System Reference Document 5.2 (2024)',
    url: 'https://dnd.wizards.com/resources/systems-reference-document'
  },
  
  hitDie: 'd8',
  primaryAbility: ['wis'],
  savingThrowProficiencies: ['int', 'wis'],
  
  armorProficiencies: ['light', 'medium', 'shields'],
  weaponProficiencies: ['simple'],
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
          description: 'You know Druidic, the secret language of Druids. You can speak the language and use it to leave hidden messages. You and others who know this language automatically spot such a message. Others spot the message\'s presence with a successful DC 15 Wisdom (Perception) check but can\'t decipher it without magic.',
        },
        {
          id: 'spellcasting-druid',
          name: 'Spellcasting',
          source: 'Druid 1',
          description: 'You have learned to draw on the divine essence of nature to cast spells.',
        },
        {
          id: 'primal-order',
          name: 'Primal Order',
          source: 'Druid 1',
          description: 'You have dedicated yourself to one of the following sacred roles: Magician (extra cantrip, bonus to Intelligence/Wisdom/Charisma checks related to nature) or Warden (proficiency with Martial weapons and Medium armor training).',
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
          description: 'As a Bonus Action, you can magically assume the shape of a beast that you have seen before. You can use this feature twice. You regain expended uses when you finish a Short or Long Rest.',
          uses: {
            current: 2,
            max: 2,
            recoveryType: 'short-rest',
          },
        },
        {
          id: 'wild-companion',
          name: 'Wild Companion',
          source: 'Druid 2',
          description: 'You can expend a use of your Wild Shape feature to cast the Find Familiar spell without material components.',
        },
      ],
    },
    {
      level: 3,
      features: [
        {
          id: 'druid-circle',
          name: 'Druid Subclass',
          source: 'Druid 3',
          description: 'You choose a Druid Circle that shapes your practice of the Old Faith.',
        },
      ],
    },
    {
      level: 4,
      features: [
        {
          id: 'ability-score-improvement-4',
          name: 'Ability Score Improvement',
          source: 'Druid 4',
          description: 'Increase one ability score by 2, or increase two ability scores by 1.',
        },
      ],
    },
    {
      level: 5,
      features: [
        {
          id: 'wild-resurgence',
          name: 'Wild Resurgence',
          source: 'Druid 5',
          description: 'You can expend a spell slot to regain one use of Wild Shape (no action required). You can also expend a use of Wild Shape to give yourself a level 1 spell slot (no action required), but you can\'t do so again until you finish a Long Rest.',
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
          id: 'elemental-fury',
          name: 'Elemental Fury',
          source: 'Druid 7',
          description: 'Choose one of the following options: Potent Spellcasting (add Wisdom modifier to Druid cantrip damage) or Primal Strike (once per turn deal extra 1d8 Cold, Fire, Lightning, or Thunder damage on weapon hit).',
        },
      ],
    },
    {
      level: 8,
      features: [
        {
          id: 'ability-score-improvement-8',
          name: 'Ability Score Improvement',
          source: 'Druid 8',
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
          source: 'Druid 12',
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
          id: 'improved-elemental-fury',
          name: 'Improved Elemental Fury',
          source: 'Druid 15',
          description: 'The option you chose for Elemental Fury improves. Potent Spellcasting now grants 60 feet of range to Druid cantrips with a range of 10 feet or more. Primal Strike damage increases to 2d8.',
        },
      ],
    },
    {
      level: 16,
      features: [
        {
          id: 'ability-score-improvement-16',
          name: 'Ability Score Improvement',
          source: 'Druid 16',
          description: 'Increase one ability score by 2, or increase two ability scores by 1.',
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
          id: 'beast-spells',
          name: 'Beast Spells',
          source: 'Druid 18',
          description: 'You can cast many of your Druid spells in any shape you assume using Wild Shape. You can perform the somatic and verbal components of a Druid spell while in a beast shape, but you aren\'t able to provide material components.',
        },
      ],
    },
    {
      level: 19,
      features: [
        {
          id: 'epic-boon',
          name: 'Epic Boon',
          source: 'Druid 19',
          description: 'You gain an Epic Boon feat or another feat of your choice for which you qualify.',
        },
        {
          id: 'ability-score-improvement-19',
          name: 'Ability Score Improvement',
          source: 'Druid 19',
          description: 'Increase one ability score by 2, or increase two ability scores by 1.',
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
          description: 'You can use your Wild Shape feature an unlimited number of times. Additionally, you regain one expended use of Wild Resurgence whenever you roll Initiative.',
        },
      ],
    },
  ],
  
  subclassLevel: 3,
  subclasses: [landSubclass],
  
  subclassSelection: {
    timing: 'level',
    optional: false,
    canChange: false,
    prerequisitesMustMeet: false,
    flavorText: 'At 3rd level, you choose a Druid Circle.'
  },
  
  classResources: [
    {
      id: 'wild-shape',
      name: 'Wild Shape',
      maxFormula: 'level >= 20 ? "Unlimited" : level >= 6 ? "4" : level >= 2 ? "2" : "0"',
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
};
