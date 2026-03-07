import { CharacterClass } from '../../../../../types/character-options/classes';
import { lifeDomainSubclass } from './life-domain';

export const cleric: CharacterClass = {
  id: 'cleric',
  name: 'Cleric',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',

  version: '5.2',
  lastUpdated: '2026-01-13',
  sourceBook: {
    name: 'System Reference Document 5.2 (2024)',
    url: 'https://dnd.wizards.com/resources/systems-reference-document',
  },

  hitDie: 'd8',
  primaryAbility: ['wis'],
  savingThrowProficiencies: ['wis', 'cha'],

  armorProficiencies: ['light', 'medium', 'shields'],
  weaponProficiencies: ['simple'],
  toolProficiencies: [],

  skillProficiencies: {
    count: 2,
    options: ['history', 'insight', 'medicine', 'persuasion', 'religion'],
    label: 'Choose two skills',
  },

  equipmentChoices: [
    {
      choose: 1,
      options: [['mace'], ['warhammer']],
    },
    {
      choose: 1,
      options: [['scale-mail'], ['leather-armor'], ['chain-mail']],
    },
    {
      choose: 1,
      options: [['light-crossbow', 'bolts-20'], ['simple-weapon']],
    },
    {
      choose: 1,
      options: [['priests-pack'], ['explorers-pack']],
    },
    {
      choose: 1,
      options: [['shield', 'holy-symbol']],
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
          id: 'spellcasting-cleric',
          name: 'Spellcasting',
          source: 'Cleric 1',
          description:
            'You have learned to draw on divine power through meditation and prayer to cast spells as a Cleric.',
        },
        {
          id: 'divine-order',
          name: 'Divine Order',
          source: 'Cleric 1',
          description:
            'You have dedicated yourself to one of the following sacred roles, either Protector (gaining proficiency with Martial weapons and Heavy armor training) or Thaumaturge (gaining an extra cantrip and a bonus to Intelligence, Wisdom, or Charisma checks related to religion).',
        },
      ],
    },
    {
      level: 2,
      features: [
        {
          id: 'channel-divinity',
          name: 'Channel Divinity',
          source: 'Cleric 2',
          description:
            'You gain the ability to channel divine energy directly from your deity, using that energy to fuel magical effects. You start with two such effects: Divine Spark and Turn Undead. You gain additional effects as you advance in this class.',
          uses: {
            current: 2,
            max: 2,
            recoveryType: 'short-rest',
          },
        },
        {
          id: 'divine-spark',
          name: 'Channel Divinity: Divine Spark',
          source: 'Cleric 2',
          description:
            'As a Magic action, you point your Holy Symbol at another creature you can see within 30 feet of yourself and focus divine energy at it. If you choose a friendly creature, it regains Hit Points equal to 1d8 + your Wisdom modifier. If you choose a hostile creature, it must succeed on a Constitution saving throw or take Radiant damage equal to 1d8 + your Wisdom modifier. The healing and damage increase by 1d8 when you reach Cleric levels 7 (2d8), 13 (3d8), and 18 (4d8).',
        },
        {
          id: 'turn-undead',
          name: 'Channel Divinity: Turn Undead',
          source: 'Cleric 2',
          description:
            'As a Magic action, you present your Holy Symbol and censure Undead creatures. Each Undead within 30 feet of you that can see or hear you must make a Wisdom saving throw. If the creature fails its save, it is Turned for 1 minute or until it takes any damage.',
        },
      ],
    },
    {
      level: 3,
      features: [
        {
          id: 'cleric-subclass',
          name: 'Cleric Subclass',
          source: 'Cleric 3',
          description: 'You choose a domain shaped by your deity.',
        },
      ],
    },
    {
      level: 4,
      features: [
        {
          id: 'ability-score-improvement-4',
          name: 'Ability Score Improvement',
          source: 'Cleric 4',
          description: 'Increase one ability score by 2, or increase two ability scores by 1.',
        },
      ],
    },
    {
      level: 5,
      features: [
        {
          id: 'sear-undead',
          name: 'Sear Undead',
          source: 'Cleric 5',
          description:
            'Whenever you use your Turn Undead feature, you can roll a number of d8s equal to your Wisdom modifier (minimum of 1d8) and add the rolls together. Each Undead that fails its saving throw against that use of Turn Undead takes Radiant damage equal to the total.',
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
          id: 'blessed-strikes',
          name: 'Blessed Strikes',
          source: 'Cleric 7',
          description:
            'Divine power infuses your strikes. Choose one of the following options: Divine Strike (once per turn deal extra 1d8 Radiant damage on weapon hit) or Potent Spellcasting (add Wisdom modifier to damage of Cleric cantrips).',
        },
      ],
    },
    {
      level: 8,
      features: [
        {
          id: 'ability-score-improvement-8',
          name: 'Ability Score Improvement',
          source: 'Cleric 8',
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
          id: 'divine-intervention',
          name: 'Divine Intervention',
          source: 'Cleric 10',
          description:
            "You can call on your deity to intervene on your behalf. As a Magic action, choose any Cleric spell of 5th level or lower that doesn't require a Reaction to cast. You can cast that spell without expending a spell slot or needing Material components. Once you use this feature, you can't use it again until you finish a Long Rest.",
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
          source: 'Cleric 12',
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
      features: [
        {
          id: 'improved-blessed-strikes',
          name: 'Improved Blessed Strikes',
          source: 'Cleric 14',
          description:
            'The option you chose for Blessed Strikes improves. Divine Strike damage increases to 2d8. Potent Spellcasting now grants Temporary Hit Points equal to twice your Wisdom modifier to you or a creature you heal with a spell slot.',
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
          source: 'Cleric 16',
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
      features: [],
    },
    {
      level: 19,
      features: [
        {
          id: 'epic-boon',
          name: 'Epic Boon',
          source: 'Cleric 19',
          description:
            'You gain an Epic Boon feat or another feat of your choice for which you qualify.',
        },
        {
          id: 'ability-score-improvement-19',
          name: 'Ability Score Improvement',
          source: 'Cleric 19',
          description: 'Increase one ability score by 2, or increase two ability scores by 1.',
        },
      ],
    },
    {
      level: 20,
      features: [
        {
          id: 'greater-divine-intervention',
          name: 'Greater Divine Intervention',
          source: 'Cleric 20',
          description:
            "You can now use Divine Intervention to cast the Wish spell. If you do so, you can't use Divine Intervention again for 2d4 Long Rests.",
        },
      ],
    },
  ],

  subclassLevel: 3,
  subclasses: [lifeDomainSubclass],

  subclassSelection: {
    timing: 'level',
    optional: false,
    canChange: false,
    prerequisitesMustMeet: false,
    flavorText: 'At 3rd level, you choose a domain shaped by your deity.',
  },

  classResources: [
    {
      id: 'channel-divinity',
      name: 'Channel Divinity',
      maxFormula: 'level >= 18 ? "4" : level >= 6 ? "3" : "2"',
      recoveryType: 'short-rest',
      displayOrder: 1,
      defaultValue: 2,
    },
  ],

  spellcasting: {
    ability: 'wis',
    spellListId: 'cleric',
    cantripsKnown: [3, 3, 3, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    preparedCasterFormula: 'wis_modifier + cleric_level',
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

  description: 'A priestly champion who wields divine magic in service of a higher power.',

  displayMetadata: {
    icon: 'cross',
    color: '#FFD700',
    shortDescription: 'A divine spellcaster who heals allies and smites foes.',
    playStyle: 'Divine caster with healing and support',
    complexity: 'moderate',
    role: 'support',
    idealFor: ['Players who like healing', 'Support-focused players'],
    tags: ['spellcaster', 'divine', 'support', 'versatile'],
    casterType: 'full',
  },
};
