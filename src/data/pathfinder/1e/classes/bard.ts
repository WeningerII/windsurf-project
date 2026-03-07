import { CharacterClass } from '../../../../types/character-options/classes';

export const bard: CharacterClass = {
  id: 'bard',
  name: 'Bard',
  system: 'pf1e',
  source: 'Core Rulebook',

  version: '1.0',
  lastUpdated: '2026-01-13',
  sourceBook: {
    name: 'Pathfinder Core Rulebook',
    page: 34,
    url: 'https://www.d20pfsrd.com/classes/core-classes/bard/',
  },

  hitDie: 'd8',
  primaryAbility: ['cha'],
  savingThrowProficiencies: ['dex', 'wis'],

  armorProficiencies: ['light', 'shields'],
  weaponProficiencies: ['simple', 'longsword', 'rapier', 'sap', 'short-sword', 'shortbow', 'whip'],
  toolProficiencies: [],

  skillProficiencies: {
    count: 6,
    options: [
      'acrobatics',
      'appraise',
      'bluff',
      'climb',
      'diplomacy',
      'disguise',
      'escape-artist',
      'intimidate',
      'knowledge-all',
      'linguistics',
      'perception',
      'perform',
      'sense-motive',
      'sleight-of-hand',
      'spellcraft',
      'stealth',
      'use-magic',
    ],
    label: 'Choose class skills (6 + Int modifier ranks per level)',
  },

  equipmentChoices: [],

  startingGold: {
    dice: '3d6',
    multiplier: 10,
  },

  features: [
    {
      level: 1,
      features: [
        {
          id: 'bardic-knowledge',
          name: 'Bardic Knowledge',
          source: 'Bard 1',
          description:
            'A bard adds half his class level (minimum 1) to all Knowledge skill checks and may make all Knowledge skill checks untrained.',
        },
        {
          id: 'bardic-performance',
          name: 'Bardic Performance',
          source: 'Bard 1',
          description:
            'A bard is trained to use the Perform skill to create magical effects on those around him, including himself if desired. He can use this ability for a number of rounds per day equal to 4 + his Charisma modifier. At each level after 1st a bard can use bardic performance for 2 additional rounds per day.',
          uses: {
            current: 4,
            max: 4,
            recoveryType: 'long-rest',
          },
        },
        {
          id: 'countersong',
          name: 'Countersong',
          source: 'Bard 1',
          description:
            "At 1st level, a bard learns to counter magic effects that depend on sound. Each round of the countersong he makes a Perform (keyboard, percussion, wind, string, or sing) skill check. Any creature within 30 feet (including the bard himself) that is affected by a sonic or language-dependent magical attack may use the bard's Perform check result in place of its saving throw if, after the saving throw is rolled, the Perform check result proves to be higher.",
        },
        {
          id: 'distraction',
          name: 'Distraction',
          source: 'Bard 1',
          description:
            "At 1st level, a bard can use his performance to counter magic effects that depend on sight. Each round of the distraction, he makes a Perform (act, comedy, dance, or oratory) skill check. Any creature within 30 feet (including the bard himself) that is affected by an illusion (pattern) or illusion (figment) magical attack may use the bard's Perform check result in place of its saving throw if, after the saving throw is rolled, the Perform check result proves to be higher.",
        },
        {
          id: 'fascinate',
          name: 'Fascinate',
          source: 'Bard 1',
          description:
            'At 1st level, a bard can use his performance to cause one or more creatures to become fascinated with him. Each creature to be fascinated must be within 90 feet, able to see and hear the bard, and capable of paying attention to him.',
        },
        {
          id: 'inspire-courage-1',
          name: 'Inspire Courage +1',
          source: 'Bard 1',
          description:
            'A 1st level bard can use his performance to inspire courage in his allies (including himself), bolstering them against fear and improving their combat abilities. Affected allies receive a +1 morale bonus on saving throws against charm and fear effects and a +1 competence bonus on attack and weapon damage rolls.',
        },
      ],
    },
    {
      level: 2,
      features: [
        {
          id: 'versatile-performance',
          name: 'Versatile Performance',
          source: 'Bard 2',
          description:
            'At 2nd level, a bard can choose one type of Perform skill. He can use his bonus in that skill in place of his bonus in associated skills.',
        },
        {
          id: 'well-versed',
          name: 'Well-Versed',
          source: 'Bard 2',
          description:
            'At 2nd level, the bard becomes resistant to the bardic performance of others, and to sonic effects in general. The bard gains a +4 bonus on saving throws made against bardic performance, sonic, and language-dependent effects.',
        },
      ],
    },
    {
      level: 3,
      features: [
        {
          id: 'inspire-competence-2',
          name: 'Inspire Competence +2',
          source: 'Bard 3',
          description:
            "A bard of 3rd level or higher can use his performance to help an ally succeed at a task. That ally must be within 30 feet and be able to hear the bard. The ally gets a +2 competence bonus on skill checks with a particular skill as long as she continues to hear the bard's performance.",
        },
      ],
    },
    {
      level: 5,
      features: [
        {
          id: 'inspire-courage-2',
          name: 'Inspire Courage +2',
          source: 'Bard 5',
          description: 'At 5th level, the bonuses from inspire courage increase to +2.',
        },
        {
          id: 'lore-master',
          name: 'Lore Master',
          source: 'Bard 5',
          description:
            'At 5th level, the bard becomes a master of lore and can take 10 on any Knowledge skill check that he has ranks in. A bard can choose not to take 10 and can instead roll normally. In addition, once per day, the bard can take 20 on any Knowledge skill check as a standard action.',
        },
      ],
    },
    {
      level: 6,
      features: [
        {
          id: 'suggestion',
          name: 'Suggestion',
          source: 'Bard 6',
          description:
            'A bard of 6th level or higher can use his performance to make a suggestion (as per the spell) to a creature he has already fascinated. Using this ability does not disrupt the fascinate effect, but it does require a standard action to activate.',
        },
        {
          id: 'versatile-performance-2',
          name: 'Versatile Performance',
          source: 'Bard 6',
          description: 'The bard gains another versatile performance choice.',
        },
      ],
    },
    {
      level: 7,
      features: [
        {
          id: 'inspire-competence-3',
          name: 'Inspire Competence +3',
          source: 'Bard 7',
          description: 'The inspire competence bonus increases to +3.',
        },
      ],
    },
    {
      level: 8,
      features: [
        {
          id: 'dirge-of-doom',
          name: 'Dirge of Doom',
          source: 'Bard 8',
          description:
            'A bard of 8th level or higher can use his performance to foster a sense of growing dread in his enemies, causing them to become shaken. Enemies within 30 feet of the bard must be able to see and hear the bard to be affected. This ability cannot cause a creature to become frightened or panicked, even if the targets are already shaken from another effect.',
        },
      ],
    },
    {
      level: 9,
      features: [
        {
          id: 'inspire-greatness',
          name: 'Inspire Greatness',
          source: 'Bard 9',
          description:
            'A bard of 9th level or higher can use his performance to inspire greatness in himself or a single willing ally within 30 feet, granting extra fighting capability. A creature inspired with greatness gains 2 bonus Hit Dice (d10s), the commensurate number of temporary hit points, a +2 competence bonus on attack rolls, and a +1 competence bonus on Fortitude saves.',
        },
      ],
    },
    {
      level: 10,
      features: [
        {
          id: 'jack-of-all-trades',
          name: 'Jack-of-All-Trades',
          source: 'Bard 10',
          description:
            'At 10th level, the bard can use any skill, even if the skill normally requires him to be trained. At 16th level, the bard considers all skills to be class skills. At 19th level, the bard can take 10 on any skill check, even if it is not normally allowed.',
        },
        {
          id: 'versatile-performance-3',
          name: 'Versatile Performance',
          source: 'Bard 10',
          description: 'The bard gains another versatile performance choice.',
        },
      ],
    },
    {
      level: 11,
      features: [
        {
          id: 'inspire-courage-3',
          name: 'Inspire Courage +3',
          source: 'Bard 11',
          description: 'At 11th level, the bonuses from inspire courage increase to +3.',
        },
        {
          id: 'inspire-competence-4',
          name: 'Inspire Competence +4',
          source: 'Bard 11',
          description: 'The inspire competence bonus increases to +4.',
        },
      ],
    },
    {
      level: 12,
      features: [
        {
          id: 'soothing-performance',
          name: 'Soothing Performance',
          source: 'Bard 12',
          description:
            "A bard of 12th level or higher can use his performance to create an effect equivalent to a mass cure serious wounds, using the bard's level as the caster level. Using this ability requires 4 rounds of continuous performance.",
        },
      ],
    },
    {
      level: 14,
      features: [
        {
          id: 'frightening-tune',
          name: 'Frightening Tune',
          source: 'Bard 14',
          description:
            "A bard of 14th level or higher can use his performance to cause fear in his enemies. Enemies within 30 feet of the bard must make a Will save (DC 10 + 1/2 the bard's level + the bard's Cha modifier) or become frightened.",
        },
        {
          id: 'versatile-performance-4',
          name: 'Versatile Performance',
          source: 'Bard 14',
          description: 'The bard gains another versatile performance choice.',
        },
      ],
    },
    {
      level: 15,
      features: [
        {
          id: 'inspire-competence-5',
          name: 'Inspire Competence +5',
          source: 'Bard 15',
          description: 'The inspire competence bonus increases to +5.',
        },
        {
          id: 'inspire-heroics',
          name: 'Inspire Heroics',
          source: 'Bard 15',
          description:
            'A bard of 15th level or higher can inspire tremendous heroism in himself or a single ally within 30 feet. The creature gains a +4 morale bonus on saving throws and a +4 dodge bonus to AC.',
        },
      ],
    },
    {
      level: 17,
      features: [
        {
          id: 'inspire-courage-4',
          name: 'Inspire Courage +4',
          source: 'Bard 17',
          description: 'At 17th level, the bonuses from inspire courage increase to +4.',
        },
      ],
    },
    {
      level: 18,
      features: [
        {
          id: 'mass-suggestion',
          name: 'Mass Suggestion',
          source: 'Bard 18',
          description:
            'This ability functions just like suggestion, but allows a bard of 18th level or higher to make a suggestion simultaneously to any number of creatures that he has already fascinated.',
        },
        {
          id: 'versatile-performance-5',
          name: 'Versatile Performance',
          source: 'Bard 18',
          description: 'The bard gains another versatile performance choice.',
        },
      ],
    },
    {
      level: 19,
      features: [
        {
          id: 'inspire-competence-6',
          name: 'Inspire Competence +6',
          source: 'Bard 19',
          description: 'The inspire competence bonus increases to +6.',
        },
      ],
    },
    {
      level: 20,
      features: [
        {
          id: 'deadly-performance',
          name: 'Deadly Performance',
          source: 'Bard 20',
          description:
            "A bard of 20th level or higher can use his performance to cause one enemy to die from joy or sorrow. To be affected, the target must be able to see and hear the bard perform for 1 full round and be within 30 feet. The target receives a Will save (DC 10 + 1/2 the bard's level + the bard's Cha modifier) to negate the effect. If a creature's saving throw succeeds, the target is staggered for 1d4 rounds, and the bard cannot use deadly performance on that creature again for 24 hours.",
        },
      ],
    },
  ],

  subclassLevel: 0,
  subclasses: [],

  spellcasting: {
    ability: 'cha',
    spellListId: 'bard-pf1e',
    cantripsKnown: [4, 5, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
    spellsKnown: [2, 3, 4, 4, 5, 5, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
    spellSlots: {
      1: [1, 2, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
      2: [0, 0, 0, 1, 2, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5],
      3: [0, 0, 0, 0, 0, 0, 1, 2, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5],
      4: [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 3, 4, 4, 4, 4, 5, 5, 5],
      5: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 3, 4, 4, 5, 5],
      6: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 5],
      7: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      8: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      9: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
    ritualCasting: false,
    multiclassCasterLevel: 'none',
  },

  classResources: [
    {
      id: 'bardic-performance-rounds',
      name: 'Bardic Performance Rounds',
      maxFormula: '4 + cha_mod + (level - 1) * 2',
      recoveryType: 'long-rest',
      displayOrder: 1,
      defaultValue: 4,
    },
  ],

  multiclassRequirements: [],

  multiclassProficiencies: {
    armor: [],
    weapons: [],
    tools: [],
  },

  description:
    'Untold wonders and secrets exist for those skillful enough to discover them. Through cleverness, talent, and magic, these cunning few unravel the wiles of the world, becoming adept in the arts of persuasion, manipulation, and inspiration.',

  displayMetadata: {
    icon: 'music',
    color: '#9932CC',
    shortDescription: 'A versatile performer who weaves magic through music and oration.',
    playStyle: 'Support caster with performance-based abilities',
    complexity: 'moderate',
    role: 'support',
    idealFor: ['Social characters', 'Support players', 'Jack-of-all-trades'],
    tags: ['arcane', 'spellcaster', 'support', 'face', 'skill-monkey'],
    casterType: 'none',
  },
};
