import { CharacterClass } from '../../../../../types/character-options/classes';
import { hunterSubclass } from './hunter';

export const ranger: CharacterClass = {
  id: 'ranger',
  name: 'Ranger',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',

  version: '5.2',
  lastUpdated: '2026-01-13',
  sourceBook: {
    name: 'System Reference Document 5.2 (2024)',
    url: 'https://dnd.wizards.com/resources/systems-reference-document',
  },

  hitDie: 'd10',
  primaryAbility: ['dex', 'wis'],
  savingThrowProficiencies: ['str', 'dex'],

  armorProficiencies: ['light', 'medium', 'shields'],
  weaponProficiencies: ['simple', 'martial'],
  toolProficiencies: [],

  skillProficiencies: {
    count: 3,
    options: [
      'animal-handling',
      'athletics',
      'insight',
      'investigation',
      'nature',
      'perception',
      'stealth',
      'survival',
    ],
    label: 'Choose three skills',
  },

  equipmentChoices: [
    {
      choose: 1,
      options: [['scale-mail'], ['leather-armor']],
    },
    {
      choose: 1,
      options: [
        ['shortsword', 'shortsword'],
        ['simple-melee-weapon', 'simple-melee-weapon'],
      ],
    },
    {
      choose: 1,
      options: [['dungeoneers-pack'], ['explorers-pack']],
    },
    {
      choose: 1,
      options: [['longbow', 'arrows-20']],
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
          id: 'favored-enemy',
          name: 'Favored Enemy',
          source: 'Ranger 1',
          description:
            "You always have the Hunter's Mark spell prepared. You can cast it twice without expending a spell slot, and you regain all expended uses when you finish a Long Rest. The damage of the spell increases to 1d8 at Ranger level 6, and to 1d10 at Ranger level 14.",
          uses: {
            current: 2,
            max: 2,
            recoveryType: 'long-rest',
          },
        },
        {
          id: 'spellcasting-ranger',
          name: 'Spellcasting',
          source: 'Ranger 1',
          description:
            'You have learned to use the magical essence of nature to cast spells, much as a Druid does.',
        },
        {
          id: 'weapon-mastery-ranger',
          name: 'Weapon Mastery',
          source: 'Ranger 1',
          description:
            'Your training with weapons allows you to use the mastery property of two kinds of weapons of your choice, such as Longbows and Shortswords. Whenever you finish a Long Rest, you can change the kinds of weapons you chose.',
        },
      ],
    },
    {
      level: 2,
      features: [
        {
          id: 'deft-explorer',
          name: 'Deft Explorer',
          source: 'Ranger 2',
          description:
            'You are an unsurpassed explorer and survivor. You gain Expertise in one of your skill proficiencies. You also gain two languages of your choice.',
        },
        {
          id: 'fighting-style-ranger',
          name: 'Fighting Style',
          source: 'Ranger 2',
          description:
            'You adopt a particular style of fighting as your specialty. Choose one of the Fighting Style feats.',
        },
      ],
    },
    {
      level: 3,
      features: [
        {
          id: 'ranger-archetype',
          name: 'Ranger Subclass',
          source: 'Ranger 3',
          description: 'You choose an archetype that you strive to emulate.',
        },
      ],
    },
    {
      level: 4,
      features: [
        {
          id: 'ability-score-improvement-4',
          name: 'Ability Score Improvement',
          source: 'Ranger 4',
          description: 'Increase one ability score by 2, or increase two ability scores by 1.',
        },
      ],
    },
    {
      level: 5,
      features: [
        {
          id: 'extra-attack-ranger',
          name: 'Extra Attack',
          source: 'Ranger 5',
          description:
            'You can attack twice, instead of once, whenever you take the Attack action on your turn.',
        },
      ],
    },
    {
      level: 6,
      features: [
        {
          id: 'roving',
          name: 'Roving',
          source: 'Ranger 6',
          description:
            "Your Speed increases by 10 feet while you aren't wearing Heavy armor. You also gain a Climb Speed and a Swim Speed equal to your Speed.",
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
          source: 'Ranger 8',
          description: 'Increase one ability score by 2, or increase two ability scores by 1.',
        },
      ],
    },
    {
      level: 10,
      features: [
        {
          id: 'natures-veil',
          name: "Nature's Veil",
          source: 'Ranger 10',
          description:
            'You can use a Bonus Action to become Invisible until the start of your next turn or until you attack or cast a spell. You can use this feature a number of times equal to your Wisdom modifier, and you regain all expended uses when you finish a Long Rest.',
        },
        {
          id: 'tireless',
          name: 'Tireless',
          source: 'Ranger 10',
          description:
            'As an action, you can give yourself Temporary Hit Points equal to 1d8 + your Wisdom modifier. You can use this action a number of times equal to your Wisdom modifier, and you regain all expended uses when you finish a Long Rest. In addition, whenever you finish a Short Rest, your Exhaustion level, if any, decreases by 1.',
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
          source: 'Ranger 12',
          description: 'Increase one ability score by 2, or increase two ability scores by 1.',
        },
      ],
    },
    {
      level: 14,
      features: [
        {
          id: 'natures-veil-improvement',
          name: "Nature's Veil Improvement",
          source: 'Ranger 14',
          description:
            "Your Nature's Veil now lasts until the end of your next turn, even if you attack or cast a spell.",
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
          source: 'Ranger 16',
          description: 'Increase one ability score by 2, or increase two ability scores by 1.',
        },
      ],
    },
    {
      level: 17,
      features: [
        {
          id: 'precise-hunter',
          name: 'Precise Hunter',
          source: 'Ranger 17',
          description:
            "You have Advantage on attack rolls against the creature marked by your Hunter's Mark spell.",
        },
      ],
    },
    {
      level: 18,
      features: [
        {
          id: 'feral-senses',
          name: 'Feral Senses',
          source: 'Ranger 18',
          description:
            "You gain Blindsense with a range of 30 feet. Within that range, you can effectively see any creature that isn't behind Total Cover, even if you're Blinded or in darkness. Moreover, you can see an Invisible creature within that range, unless it successfully Hides from you.",
        },
      ],
    },
    {
      level: 19,
      features: [
        {
          id: 'epic-boon',
          name: 'Epic Boon',
          source: 'Ranger 19',
          description:
            'You gain an Epic Boon feat or another feat of your choice for which you qualify.',
        },
        {
          id: 'ability-score-improvement-19',
          name: 'Ability Score Improvement',
          source: 'Ranger 19',
          description: 'Increase one ability score by 2, or increase two ability scores by 1.',
        },
      ],
    },
    {
      level: 20,
      features: [
        {
          id: 'foe-slayer',
          name: 'Foe Slayer',
          source: 'Ranger 20',
          description:
            "Your Hunter's Mark damage die increases to a d10. In addition, once per turn when you miss with an attack roll, you can retry the attack roll against the same target.",
        },
      ],
    },
  ],
  alwaysPreparedSpellSourceLabel: 'Ranger Class Spells',
  alwaysPreparedSpellsByLevel: {
    // Conjure Barrage (9) and Conjure Volley (13) are not in SRD 5.2 and were
    // removed; the SRD 5.2 Ranger's base always-prepared spell is Hunter's Mark.
    1: ['hunters-mark'],
  },

  subclassLevel: 3,
  subclasses: [hunterSubclass],

  subclassSelection: {
    timing: 'level',
    optional: false,
    canChange: false,
    prerequisitesMustMeet: false,
    flavorText: 'At 3rd level, you choose a Ranger Archetype.',
  },

  classResources: [
    {
      id: 'hunters-mark',
      name: "Hunter's Mark",
      maxFormula: 'level >= 17 ? "6" : level >= 9 ? "4" : level >= 5 ? "3" : "2"',
      recoveryType: 'long-rest',
      displayOrder: 1,
      defaultValue: 2,
    },
  ],

  spellcasting: {
    ability: 'wis',
    spellListId: 'ranger',
    preparedCasterFormula: 'wis_modifier + (ranger_level / 2)',
    spellSlots: {
      1: [2, 2, 2, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
      2: [0, 0, 0, 0, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
      3: [0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3],
      4: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 2, 2, 2, 2, 3],
      5: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 2],
      6: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      7: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      8: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      9: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
    ritualCasting: true,
    multiclassCasterLevel: 'half',
  },

  multiclassRequirements: [
    {
      type: 'attribute',
      value: 13,
      description: 'Dexterity 13 and Wisdom 13',
    },
  ],

  multiclassProficiencies: {
    armor: ['light', 'medium', 'shields'],
    weapons: ['simple', 'martial'],
    tools: [],
    skills: {
      count: 1,
      options: ['any'],
      label: 'Choose one skill',
    },
  },

  description:
    'A warrior who uses martial prowess and nature magic to combat threats on the edges of civilization.',

  displayMetadata: {
    icon: 'bow',
    color: '#228B22',
    shortDescription: 'A warrior who uses martial prowess and nature magic to hunt threats.',
    playStyle: 'Ranged combatant with nature magic',
    complexity: 'moderate',
    role: 'striker',
    idealFor: ['Ranged combat enthusiasts', 'Nature-themed players'],
    tags: ['martial', 'ranged', 'melee', 'primal', 'versatile'],
    casterType: 'half',
  },
};
