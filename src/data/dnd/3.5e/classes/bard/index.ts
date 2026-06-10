import { CharacterClass } from '../../../../../types/character-options/classes';

export const bard: CharacterClass = {
  id: 'bard',
  name: 'Bard',
  system: 'dnd-3.5e',
  source: 'SRD 3.5',

  version: '3.5',
  lastUpdated: '2026-01-13',
  sourceBook: {
    name: "Player's Handbook 3.5",
    url: 'https://www.d20srd.org/srd/classes/bard.htm',
  },

  hitDie: 'd6',
  d20Profile: {
    bab: 'three-quarter',
    fortSave: 'poor',
    refSave: 'good',
    willSave: 'good',
  },
  primaryAbility: ['cha'],

  armorProficiencies: ['light'],
  weaponProficiencies: ['simple', 'longsword', 'rapier', 'sap', 'short-sword', 'shortbow'],
  toolProficiencies: [],

  skillProficiencies: {
    count: 6,
    options: [
      'appraise',
      'balance',
      'bluff',
      'climb',
      'concentration',
      'decipher-script',
      'diplomacy',
      'disguise',
      'escape-artist',
      'gather-info',
      'hide',
      'jump',
      'knowledge',
      'listen',
      'move-silently',
      'perform',
      'profession',
      'sense-motive',
      'sleight-of-hand',
      'speak-language',
      'spellcraft',
      'swim',
      'tumble',
      'use-magic',
    ],
    label: 'Choose six skills',
  },

  equipmentChoices: [],

  startingGold: {
    dice: '4d4',
    multiplier: 10,
  },

  features: [
    {
      level: 1,
      features: [
        {
          id: 'bardic-music',
          name: 'Bardic Music',
          source: 'Bard 1',
          description:
            'Once per day per bard level, you can use song or poetics to produce magical effects on those around you.',
        },
        {
          id: 'bardic-knowledge',
          name: 'Bardic Knowledge',
          source: 'Bard 1',
          description:
            'You may make a special Bardic Knowledge check with a bonus equal to your bard level + your Intelligence modifier to see whether you know some relevant information about local notable people, legendary items, or noteworthy places.',
        },
      ],
    },
    {
      level: 2,
      features: [
        {
          id: 'well-versed',
          name: 'Well Versed',
          source: 'Bard 2',
          description:
            'You gain a +2 bonus on saving throws against Enchantment spells and effects.',
        },
      ],
    },
    {
      level: 3,
      features: [
        {
          id: 'inspire-competence',
          name: 'Inspire Competence',
          source: 'Bard 3',
          description: 'You can use music to help an ally succeed at a task.',
        },
      ],
    },
    {
      level: 4,
      features: [
        {
          id: 'inspire-courage-4',
          name: 'Inspire Courage',
          source: 'Bard 4',
          description: 'You can use music to inspire courage in your allies.',
        },
      ],
    },
    {
      level: 5,
      features: [
        {
          id: 'lore-master-5',
          name: 'Lore Master',
          source: 'Bard 5',
          description: 'Your knowledge of lore deepens.',
        },
      ],
    },
    {
      level: 6,
      features: [
        {
          id: 'suggestion-6',
          name: 'Suggestion',
          source: 'Bard 6',
          description: 'You can use your music to make magical suggestions.',
        },
      ],
    },
    {
      level: 7,
      features: [
        {
          id: 'inspire-greatness-7',
          name: 'Inspire Greatness',
          source: 'Bard 7',
          description: 'You can use music to inspire greatness in your allies.',
        },
      ],
    },
    {
      level: 8,
      features: [
        {
          id: 'song-of-freedom-8',
          name: 'Song of Freedom',
          source: 'Bard 8',
          description: 'You can use your music to free allies from enchantments.',
        },
      ],
    },
    {
      level: 9,
      features: [
        {
          id: 'inspire-heroics-9',
          name: 'Inspire Heroics',
          source: 'Bard 9',
          description: 'You can use music to inspire heroic deeds.',
        },
      ],
    },
    {
      level: 10,
      features: [
        {
          id: 'mass-suggestion-10',
          name: 'Mass Suggestion',
          source: 'Bard 10',
          description: 'Your suggestion ability now affects multiple targets.',
        },
      ],
    },
    {
      level: 11,
      features: [
        {
          id: 'inspire-excellence-11',
          name: 'Inspire Excellence',
          source: 'Bard 11',
          description: 'Your bardic music becomes more powerful.',
        },
      ],
    },
    {
      level: 12,
      features: [
        {
          id: 'song-of-shielding-12',
          name: 'Song of Shielding',
          source: 'Bard 12',
          description: 'You can use your music to shield allies from harm.',
        },
      ],
    },
    {
      level: 13,
      features: [
        {
          id: 'inspire-ultimate-13',
          name: 'Inspire Ultimate',
          source: 'Bard 13',
          description: 'Your bardic music reaches new heights of power.',
        },
      ],
    },
    {
      level: 14,
      features: [
        {
          id: 'mass-heal-14',
          name: 'Mass Healing',
          source: 'Bard 14',
          description: 'You can use your music to heal multiple allies.',
        },
      ],
    },
    {
      level: 15,
      features: [
        {
          id: 'inspire-immortality-15',
          name: 'Inspire Immortality',
          source: 'Bard 15',
          description: 'Your music grants temporary immortality to allies.',
        },
      ],
    },
    {
      level: 16,
      features: [
        {
          id: 'song-of-power-16',
          name: 'Song of Power',
          source: 'Bard 16',
          description: 'You can use your music to empower spellcasting.',
        },
      ],
    },
    {
      level: 17,
      features: [
        {
          id: 'inspire-transcendence-17',
          name: 'Inspire Transcendence',
          source: 'Bard 17',
          description: 'Your bardic music achieves transcendent power.',
        },
      ],
    },
    {
      level: 18,
      features: [
        {
          id: 'mass-resurrection-18',
          name: 'Mass Resurrection',
          source: 'Bard 18',
          description: 'You can use your music to resurrect fallen allies.',
        },
      ],
    },
    {
      level: 19,
      features: [
        {
          id: 'ultimate-performance-19',
          name: 'Ultimate Performance',
          source: 'Bard 19',
          description: 'Your performances achieve ultimate mastery.',
        },
      ],
    },
    {
      level: 20,
      features: [
        {
          id: 'bardic-music-master',
          name: 'Master Bard',
          source: 'Bard 20',
          description: 'At 20th level, you have mastered the bardic arts.',
        },
      ],
    },
  ],

  subclassLevel: 1,
  subclasses: [],

  classResources: [],

  multiclassRequirements: [],

  multiclassProficiencies: {
    armor: [],
    weapons: [],
    tools: [],
  },

  description: 'A charismatic performer whose music and lore inspire allies and confound foes.',

  displayMetadata: {
    icon: 'music',
    color: '#8A2BE2',
    shortDescription: 'A charismatic performer and arcane dabbler.',
    playStyle: 'Support caster and skill expert',
    complexity: 'moderate',
    role: 'support',
    idealFor: ['Face characters', 'Support players'],
    tags: ['spellcaster', 'arcane', 'support', 'face', 'versatile'],
    casterType: 'full',
  },
};
