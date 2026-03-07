import { CharacterClass } from '../../../../../types/character-options/classes';
import { loreSubclass } from './lore';

export const bard: CharacterClass = {
  id: 'bard',
  name: 'Bard',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',

  version: '5.1',
  lastUpdated: '2026-01-13',
  sourceBook: {
    name: 'System Reference Document 5.1',
    url: 'https://dnd.wizards.com/resources/systems-reference-document',
  },

  hitDie: 'd8',
  primaryAbility: ['cha'],
  savingThrowProficiencies: ['dex', 'cha'],

  armorProficiencies: ['light'],
  weaponProficiencies: ['simple', 'hand-crossbows', 'longswords', 'rapiers', 'shortswords'],
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
          id: 'spellcasting-bard',
          name: 'Spellcasting',
          source: 'Bard 1',
          description:
            'You have learned to untangle and reshape the fabric of reality in harmony with your wishes and music. Your spells are part of your vast repertoire, magic that you can tune to different situations.',
        },
        {
          id: 'bardic-inspiration',
          name: 'Bardic Inspiration',
          source: 'Bard 1',
          description:
            'You can inspire others through stirring words or music. To do so, you use a bonus action on your turn to choose one creature other than yourself within 60 feet of you who can hear you. That creature gains one Bardic Inspiration die, a d6.\n\nOnce within the next 10 minutes, the creature can roll the die and add the number rolled to one ability check, attack roll, or saving throw it makes. The creature can wait until after it rolls the d20 before deciding to use the Bardic Inspiration die, but must decide before the DM says whether the roll succeeds or fails. Once the Bardic Inspiration die is rolled, it is lost. A creature can have only one Bardic Inspiration die at a time.\n\nYou can use this feature a number of times equal to your Charisma modifier (a minimum of once). You regain any expended uses when you finish a long rest.\n\nYour Bardic Inspiration die changes when you reach certain levels in this class. The die becomes a d8 at 5th level, a d10 at 10th level, and a d12 at 15th level.',
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
          id: 'jack-of-all-trades',
          name: 'Jack of All Trades',
          source: 'Bard 2',
          description:
            "Starting at 2nd level, you can add half your proficiency bonus, rounded down, to any ability check you make that doesn't already include your proficiency bonus.",
        },
        {
          id: 'song-of-rest',
          name: 'Song of Rest',
          source: 'Bard 2',
          description:
            'Beginning at 2nd level, you can use soothing music or oration to help revitalize your wounded allies during a short rest. If you or any friendly creatures who can hear your performance regain hit points at the end of the short rest by spending one or more Hit Dice, each of those creatures regains an extra 1d6 hit points.\n\nThe extra hit points increase when you reach certain levels in this class: to 1d8 at 9th level, to 1d10 at 13th level, and to 1d12 at 17th level.',
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
          description:
            'At 3rd level, you delve into the advanced techniques of a bard college of your choice.',
        },
        {
          id: 'expertise-bard',
          name: 'Expertise',
          source: 'Bard 3',
          description:
            'At 3rd level, choose two of your skill proficiencies. Your proficiency bonus is doubled for any ability check you make that uses either of the chosen proficiencies.\n\nAt 10th level, you can choose another two skill proficiencies to gain this benefit.',
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
          description:
            'When you reach 4th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
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
            'Beginning when you reach 5th level, you regain all of your expended uses of Bardic Inspiration when you finish a short or long rest.',
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
            'At 6th level, you gain the ability to use musical notes or words of power to disrupt mind-influencing effects. As an action, you can start a performance that lasts until the end of your next turn. During that time, you and any friendly creatures within 30 feet of you have advantage on saving throws against being frightened or charmed. A creature must be able to hear you to gain this benefit. The performance ends early if you are incapacitated or silenced or if you voluntarily end it (no action required).',
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
          description:
            'When you reach 8th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
        },
      ],
    },
    {
      level: 9,
      features: [
        {
          id: 'song-of-rest-d8',
          name: 'Song of Rest (d8)',
          source: 'Bard 9',
          description:
            'At 9th level, the extra hit points regained from Song of Rest increases to 1d8.',
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
            'By 10th level, you have plundered magical knowledge from a wide spectrum of disciplines. Choose two spells from any classes, including this one. A spell you choose must be of a level you can cast, as shown on the Bard table, or a cantrip.\n\nThe chosen spells count as bard spells for you and are included in the number in the Spells Known column of the Bard table.\n\nYou learn two additional spells from any classes at 14th level and again at 18th level.',
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
          description:
            'When you reach 12th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
        },
      ],
    },
    {
      level: 13,
      features: [
        {
          id: 'song-of-rest-d10',
          name: 'Song of Rest (d10)',
          source: 'Bard 13',
          description:
            'At 13th level, the extra hit points regained from Song of Rest increases to 1d10.',
        },
      ],
    },
    {
      level: 14,
      features: [
        {
          id: 'magical-secrets-14',
          name: 'Magical Secrets',
          source: 'Bard 14',
          description:
            'At 14th level, you learn two additional spells from any class. The spells must be of a level you can cast.',
        },
        {
          id: 'college-feature-14',
          name: 'College Feature',
          source: 'Bard 14',
          description: 'At 14th level, you gain a feature from your Bard College.',
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
          source: 'Bard 16',
          description:
            'When you reach 16th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
        },
      ],
    },
    {
      level: 17,
      features: [
        {
          id: 'song-of-rest-d12',
          name: 'Song of Rest (d12)',
          source: 'Bard 17',
          description:
            'At 17th level, the extra hit points regained from Song of Rest increases to 1d12.',
        },
      ],
    },
    {
      level: 18,
      features: [
        {
          id: 'magical-secrets-18',
          name: 'Magical Secrets',
          source: 'Bard 18',
          description:
            'At 18th level, you learn two additional spells from any class. The spells must be of a level you can cast.',
        },
      ],
    },
    {
      level: 19,
      features: [
        {
          id: 'ability-score-improvement-19',
          name: 'Ability Score Improvement',
          source: 'Bard 19',
          description:
            'When you reach 19th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
        },
      ],
    },
    {
      level: 20,
      features: [
        {
          id: 'superior-inspiration',
          name: 'Superior Inspiration',
          source: 'Bard 20',
          description:
            'At 20th level, when you roll initiative and have no uses of Bardic Inspiration left, you regain one use.',
        },
      ],
    },
  ],

  subclassLevel: 3,
  subclasses: [loreSubclass], // SRD: College of Lore only

  subclassSelection: {
    timing: 'level',
    optional: false,
    canChange: false,
    prerequisitesMustMeet: false,
    flavorText: 'At 3rd level, you delve into the advanced techniques of a bard college.',
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
    spellsKnown: [4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 15, 16, 18, 19, 19, 20, 22, 22, 22],
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
