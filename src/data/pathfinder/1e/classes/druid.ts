import { CharacterClass } from '../../../../types/character-options/classes';

export const druid: CharacterClass = {
  id: 'druid',
  name: 'Druid',
  system: 'pf1e',
  source: 'Core Rulebook',

  version: '1.0',
  lastUpdated: '2026-01-13',
  sourceBook: {
    name: 'Pathfinder Core Rulebook',
    page: 48,
    url: 'https://www.d20pfsrd.com/classes/core-classes/druid/',
  },

  hitDie: 'd8',
  primaryAbility: ['wis'],
  savingThrowProficiencies: ['wis', 'con'],

  armorProficiencies: ['light', 'medium', 'shields'],
  weaponProficiencies: [
    'club',
    'dagger',
    'dart',
    'quarterstaff',
    'scimitar',
    'scythe',
    'sickle',
    'shortspear',
    'sling',
    'spear',
  ],
  toolProficiencies: [],

  skillProficiencies: {
    count: 4,
    options: [
      'climb',
      'fly',
      'handle-animal',
      'heal',
      'knowledge-geography',
      'knowledge-nature',
      'perception',
      'ride',
      'spellcraft',
      'survival',
      'swim',
    ],
    label: 'Choose class skills (4 + Int modifier ranks per level)',
  },

  equipmentChoices: [],

  startingGold: {
    dice: '2d6',
    multiplier: 10,
  },

  features: [
    {
      level: 1,
      features: [
        {
          id: 'nature-bond',
          name: 'Nature Bond',
          source: 'Druid 1',
          description:
            'At 1st level, a druid forms a bond with nature. This bond can take one of two forms. The first is a close tie to the natural world, granting the druid one of the following cleric domains: Air, Animal, Earth, Fire, Plant, Water, or Weather. The second option is to form a close bond with an animal companion.',
        },
        {
          id: 'nature-sense',
          name: 'Nature Sense',
          source: 'Druid 1',
          description: 'A druid gains a +2 bonus on Knowledge (nature) and Survival checks.',
        },
        {
          id: 'orisons',
          name: 'Orisons',
          source: 'Druid 1',
          description:
            'Druids can prepare a number of orisons, or 0-level spells, each day. These spells are cast like any other spell, but they are not expended when cast and may be used again.',
        },
        {
          id: 'spontaneous-casting',
          name: 'Spontaneous Casting',
          source: 'Druid 1',
          description:
            'A druid can channel stored spell energy into summoning spells that she hasn\'t prepared ahead of time. She can "lose" a prepared spell in order to cast any summon nature\'s ally spell of the same level or lower.',
        },
        {
          id: 'wild-empathy',
          name: 'Wild Empathy',
          source: 'Druid 1',
          description:
            'A druid can improve the attitude of an animal. This ability functions just like a Diplomacy check made to improve the attitude of a person. The druid rolls 1d20 and adds her druid level and her Charisma modifier to determine the wild empathy check result.',
        },
      ],
    },
    {
      level: 2,
      features: [
        {
          id: 'woodland-stride',
          name: 'Woodland Stride',
          source: 'Druid 2',
          description:
            'Starting at 2nd level, a druid may move through any sort of undergrowth (such as natural thorns, briars, overgrown areas, and similar terrain) at her normal speed and without taking damage or suffering any other impairment.',
        },
      ],
    },
    {
      level: 3,
      features: [
        {
          id: 'trackless-step',
          name: 'Trackless Step',
          source: 'Druid 3',
          description:
            'Starting at 3rd level, a druid leaves no trail in natural surroundings and cannot be tracked. She may choose to leave a trail if so desired.',
        },
      ],
    },
    {
      level: 4,
      features: [
        {
          id: 'resist-natures-lure',
          name: "Resist Nature's Lure",
          source: 'Druid 4',
          description:
            'Starting at 4th level, a druid gains a +4 bonus on saving throws against the spell-like and supernatural abilities of fey. This bonus also applies to spells and effects that target plants, such as blight, entangle, spike growth, and warp wood.',
        },
        {
          id: 'wild-shape-1',
          name: 'Wild Shape (1/day)',
          source: 'Druid 4',
          description:
            'At 4th level, a druid gains the ability to turn herself into any Small or Medium animal and back again once per day. This ability functions like the beast shape I spell, except as noted here. The effect lasts for 1 hour per druid level, or until she changes back.',
          uses: {
            current: 1,
            max: 1,
            recoveryType: 'long-rest',
          },
        },
      ],
    },
    {
      level: 6,
      features: [
        {
          id: 'wild-shape-2',
          name: 'Wild Shape (2/day)',
          source: 'Druid 6',
          description:
            'At 6th level, a druid can use wild shape twice per day. Her options also expand to include Large and Tiny animals, as well as Small elementals.',
        },
      ],
    },
    {
      level: 8,
      features: [
        {
          id: 'wild-shape-3',
          name: 'Wild Shape (3/day)',
          source: 'Druid 8',
          description:
            'At 8th level, a druid can use wild shape three per day. Her options also expand to include Large and Huge elementals, and Medium plant creatures.',
        },
      ],
    },
    {
      level: 9,
      features: [
        {
          id: 'venom-immunity',
          name: 'Venom Immunity',
          source: 'Druid 9',
          description: 'At 9th level, a druid gains immunity to all poisons.',
        },
      ],
    },
    {
      level: 10,
      features: [
        {
          id: 'wild-shape-4',
          name: 'Wild Shape (4/day)',
          source: 'Druid 10',
          description:
            'At 10th level, a druid can use wild shape four times per day. Her options also expand to include Huge elementals and Large plant creatures.',
        },
      ],
    },
    {
      level: 12,
      features: [
        {
          id: 'wild-shape-5',
          name: 'Wild Shape (5/day)',
          source: 'Druid 12',
          description:
            'At 12th level, a druid can use wild shape five times per day. She may also take the form of a Huge plant creature.',
        },
      ],
    },
    {
      level: 13,
      features: [
        {
          id: 'thousand-faces',
          name: 'A Thousand Faces',
          source: 'Druid 13',
          description:
            'At 13th level, a druid gains the ability to change her appearance at will, as if using the alter self spell, but only while in her normal form.',
        },
      ],
    },
    {
      level: 14,
      features: [
        {
          id: 'wild-shape-6',
          name: 'Wild Shape (6/day)',
          source: 'Druid 14',
          description: 'At 14th level, a druid can use wild shape six times per day.',
        },
      ],
    },
    {
      level: 15,
      features: [
        {
          id: 'timeless-body',
          name: 'Timeless Body',
          source: 'Druid 15',
          description:
            'After attaining 15th level, a druid no longer takes ability score penalties for aging and cannot be magically aged. Any penalties she may have already incurred, however, remain in place.',
        },
      ],
    },
    {
      level: 16,
      features: [
        {
          id: 'wild-shape-7',
          name: 'Wild Shape (7/day)',
          source: 'Druid 16',
          description: 'At 16th level, a druid can use wild shape seven times per day.',
        },
      ],
    },
    {
      level: 18,
      features: [
        {
          id: 'wild-shape-8',
          name: 'Wild Shape (8/day)',
          source: 'Druid 18',
          description: 'At 18th level, a druid can use wild shape eight times per day.',
        },
      ],
    },
    {
      level: 20,
      features: [
        {
          id: 'wild-shape-at-will',
          name: 'Wild Shape (At Will)',
          source: 'Druid 20',
          description: 'At 20th level, a druid can use wild shape at will.',
        },
      ],
    },
  ],

  subclassLevel: 1,
  subclasses: [],

  spellcasting: {
    ability: 'wis',
    spellListId: 'druid-pf1e',
    preparedCasterFormula: 'wis_mod + class_level',
    spellSlots: {
      1: [1, 2, 2, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
      2: [0, 0, 1, 2, 2, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
      3: [0, 0, 0, 0, 1, 2, 2, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
      4: [0, 0, 0, 0, 0, 0, 1, 2, 2, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4],
      5: [0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 3, 3, 3, 4, 4, 4, 4, 4, 4],
      6: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 3, 3, 3, 4, 4, 4, 4],
      7: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 3, 3, 3, 4, 4],
      8: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 3, 3, 4],
      9: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 4],
    },
    ritualCasting: false,
    multiclassCasterLevel: 'full',
  },

  classResources: [
    {
      id: 'wild-shape-uses',
      name: 'Wild Shape',
      maxFormula:
        'level >= 20 ? "unlimited" : level >= 18 ? "8" : level >= 16 ? "7" : level >= 14 ? "6" : level >= 12 ? "5" : level >= 10 ? "4" : level >= 8 ? "3" : level >= 6 ? "2" : level >= 4 ? "1" : "0"',
      recoveryType: 'long-rest',
      displayOrder: 1,
    },
  ],

  multiclassRequirements: [],

  multiclassProficiencies: {
    armor: [],
    weapons: [],
    tools: [],
  },

  description:
    'Within the purity of the elements and the order of the wilds lingers a power beyond the marvels of civilization. Furtive yet combatic, a subtle hunter and stalwart defender, the druid is versatile, wise, and aware.',

  displayMetadata: {
    icon: 'leaf',
    color: '#228B22',
    shortDescription: 'A nature-focused divine caster who can shapeshift into animals.',
    playStyle: 'Full divine caster with wild shape and animal companion options',
    complexity: 'complex',
    role: 'hybrid',
    idealFor: ['Nature lovers', 'Shapeshifting enthusiasts', 'Versatile players'],
    tags: ['primal', 'spellcaster', 'shapeshifter'],
    casterType: 'full',
  },
};
