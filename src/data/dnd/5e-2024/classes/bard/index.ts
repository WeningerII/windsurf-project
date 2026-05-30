import { CharacterClass } from '../../../../../types/character-options/classes';
import { loreSubclass } from './lore';

export const bard: CharacterClass = {
  id: 'bard',
  name: 'Bard',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',

  version: '5.2',
  lastUpdated: '2026-01-13',
  sourceBook: {
    name: 'System Reference Document 5.2 (2024)',
    url: 'https://dnd.wizards.com/resources/systems-reference-document',
  },

  hitDie: 'd8',
  primaryAbility: ['cha'],
  savingThrowProficiencies: ['dex', 'cha'],

  armorProficiencies: ['light'],
  weaponProficiencies: ['simple'],
  toolProficiencies: [
    {
      count: 3,
      options: ['musical-instrument'],
      label: 'Three musical instruments of your choice',
    },
  ],

  skillProficiencies: {
    count: 3,
    options: [
      'acrobatics',
      'animal-handling',
      'arcana',
      'athletics',
      'deception',
      'history',
      'insight',
      'intimidation',
      'investigation',
      'medicine',
      'nature',
      'perception',
      'performance',
      'persuasion',
      'religion',
      'sleight-of-hand',
      'stealth',
      'survival',
    ],
    label: 'Choose any three skills',
  },

  equipmentChoices: [
    {
      choose: 1,
      options: [['rapier'], ['longsword'], ['simple-weapon']],
    },
    {
      choose: 1,
      options: [['diplomats-pack'], ['entertainers-pack']],
    },
    {
      choose: 1,
      options: [['lute'], ['musical-instrument']],
    },
    {
      choose: 1,
      options: [['leather-armor', 'dagger']],
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
          id: 'bardic-inspiration',
          name: 'Bardic Inspiration',
          source: 'Bard 1',
          description:
            'You can inspire others through stirring words or music. To do so, you use a Bonus Action on your turn to choose one creature other than yourself within 60 feet of you who can hear you. That creature gains one Bardic Inspiration die, a d6.\n\nOnce within the next hour, the creature can roll the die and add the number rolled to one ability check, attack roll, or saving throw it makes. Alternatively, when a creature takes damage, it can use its Reaction to roll the die and reduce the damage taken by the number rolled.',
          uses: {
            current: 1,
            max: 1,
            recoveryType: 'long-rest',
          },
        },
        {
          id: 'spellcasting-bard',
          name: 'Spellcasting',
          source: 'Bard 1',
          description:
            'You have learned to untangle and reshape the fabric of reality in harmony with your wishes and music. You can cast Bard spells.',
        },
      ],
    },
    {
      level: 2,
      features: [
        {
          id: 'expertise-bard',
          name: 'Expertise',
          source: 'Bard 2',
          description:
            'Choose two of your skill proficiencies. Your Proficiency Bonus is doubled for any ability check you make that uses either of the chosen proficiencies. At 9th level, you can choose two more of your skill proficiencies to gain this benefit.',
        },
        {
          id: 'jack-of-all-trades',
          name: 'Jack of All Trades',
          source: 'Bard 2',
          description:
            "You can add half your Proficiency Bonus, rounded down, to any ability check you make that doesn't already include your Proficiency Bonus.",
        },
      ],
    },
    {
      level: 3,
      features: [
        {
          id: 'bard-college',
          name: 'Bard College',
          source: 'Bard 3',
          description: 'You delve into the advanced techniques of a bard college of your choice.',
        },
      ],
    },
    {
      level: 4,
      features: [
        {
          id: 'ability-score-improvement-4',
          name: 'Ability Score Improvement',
          source: 'Bard 4',
          description: 'Increase one ability score by 2, or increase two ability scores by 1.',
        },
      ],
    },
    {
      level: 5,
      features: [
        {
          id: 'font-of-inspiration',
          name: 'Font of Inspiration',
          source: 'Bard 5',
          description:
            'You now regain all of your expended uses of Bardic Inspiration when you finish a Short or Long Rest. In addition, you can expend a spell slot to regain a use of Bardic Inspiration (no action required).',
        },
      ],
    },
    {
      level: 6,
      features: [
        {
          id: 'countercharm',
          name: 'Countercharm',
          source: 'Bard 6',
          description:
            'You gain the ability to use musical notes or words of power to disrupt mind-influencing effects. If you or a creature within 30 feet of you fails a saving throw against an effect that applies the Charmed or Frightened condition, you can use your Reaction to cause the save to be rerolled with Advantage.',
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
          source: 'Bard 8',
          description: 'Increase one ability score by 2, or increase two ability scores by 1.',
        },
      ],
    },
    {
      level: 9,
      features: [
        {
          id: 'expertise-bard-9',
          name: 'Expertise',
          source: 'Bard 9',
          description: 'Choose two more of your skill proficiencies to gain Expertise.',
        },
      ],
    },
    {
      level: 10,
      features: [
        {
          id: 'magical-secrets',
          name: 'Magical Secrets',
          source: 'Bard 10',
          description:
            'You have plundered magical knowledge from a wide spectrum of disciplines. Choose two spells from the Bard, Cleric, Druid, or Wizard spell list. A spell you choose must be of a level you can cast, as shown on the Bard table, or a cantrip. The chosen spells count as Bard spells for you.',
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
          source: 'Bard 12',
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
      features: [],
    },
    {
      level: 16,
      features: [
        {
          id: 'ability-score-improvement-16',
          name: 'Ability Score Improvement',
          source: 'Bard 16',
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
          id: 'superior-inspiration',
          name: 'Superior Inspiration',
          source: 'Bard 18',
          description:
            'When you roll Initiative, you regain up to two expended uses of Bardic Inspiration if you have fewer than two left.',
        },
      ],
    },
    {
      level: 19,
      features: [
        {
          id: 'epic-boon',
          name: 'Epic Boon',
          source: 'Bard 19',
          description:
            'You gain an Epic Boon feat or another feat of your choice for which you qualify.',
        },
        {
          id: 'ability-score-improvement-19',
          name: 'Ability Score Improvement',
          source: 'Bard 19',
          description: 'Increase one ability score by 2, or increase two ability scores by 1.',
        },
      ],
    },
    {
      level: 20,
      features: [
        {
          id: 'words-of-creation',
          name: 'Words of Creation',
          source: 'Bard 20',
          description:
            "You have mastered the Words of Creation. You can cast the Power Word Kill and Power Word Heal spells. You always have these spells prepared, and they don't count against the number of spells you can have prepared. You can cast each of them once without expending a spell slot, and you regain the ability to do so when you finish a Long Rest.",
        },
      ],
    },
  ],
  alwaysPreparedSpellSourceLabel: 'Words of Creation',
  alwaysPreparedSpellsByLevel: {
    20: ['power-word-kill', 'power-word-heal'],
  },

  subclassLevel: 3,
  subclasses: [loreSubclass],

  subclassSelection: {
    timing: 'level',
    optional: false,
    canChange: false,
    prerequisitesMustMeet: false,
    flavorText: 'At 3rd level, you choose a Bard College that reflects your artistic style.',
  },

  classResources: [
    {
      id: 'bardic-inspiration',
      name: 'Bardic Inspiration',
      maxFormula: 'charisma_modifier',
      recoveryType: 'long-rest',
      displayOrder: 1,
    },
    {
      id: 'bardic-inspiration-die',
      name: 'Bardic Inspiration Die',
      maxFormula: 'level >= 15 ? "d12" : level >= 10 ? "d10" : level >= 5 ? "d8" : "d6"',
      recoveryType: 'long-rest',
      displayOrder: 2,
    },
  ],

  spellcasting: {
    ability: 'cha',
    spellListId: 'bard',
    cantripsKnown: [2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
    preparedCasterFormula: 'charisma_modifier + bard_level',
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
    armor: ['light'],
    weapons: [],
    tools: ['one-musical-instrument'],
    skills: {
      count: 1,
      options: ['any'],
      label: 'Choose one skill',
    },
  },

  description: 'An inspiring magician whose power echoes the music of creation.',

  displayMetadata: {
    icon: 'lute',
    color: '#9370DB',
    shortDescription: 'A versatile spellcaster who inspires allies and controls the battlefield.',
    playStyle: 'Support caster with versatile abilities',
    complexity: 'moderate',
    role: 'support',
    idealFor: ['Social players', 'Players who like versatility'],
    tags: ['spellcaster', 'arcane', 'support', 'face', 'versatile', 'skill-monkey'],
    casterType: 'full',
  },
};
