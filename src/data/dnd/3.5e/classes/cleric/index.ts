import { CharacterClass } from '../../../../../types/character-options/classes';

export const cleric: CharacterClass = {
  id: 'cleric',
  name: 'Cleric',
  system: 'dnd-3.5e',
  source: 'SRD 3.5',

  version: '3.5',
  lastUpdated: '2026-01-13',
  sourceBook: {
    name: "Player's Handbook 3.5",
    url: 'https://www.d20srd.org/srd/classes/cleric.htm',
  },

  hitDie: 'd8',
  primaryAbility: ['wis'],
  savingThrowProficiencies: ['wis', 'cha'],

  armorProficiencies: ['light', 'medium', 'heavy', 'shields'],
  weaponProficiencies: ['simple'],
  toolProficiencies: [],

  skillProficiencies: {
    count: 2,
    options: ['concentration', 'spellcraft', 'knowledge', 'heal', 'diplomacy'],
    label: 'Choose two skills',
  },

  equipmentChoices: [],

  startingGold: {
    dice: '5d4',
    multiplier: 10,
  },

  features: [
    {
      level: 1,
      features: [
        {
          id: 'spellcasting-cleric-35e',
          name: 'Spellcasting',
          source: 'Cleric 1',
          description:
            'A cleric casts divine spells, which are drawn from the cleric spell list. A cleric must choose and prepare spells in advance. To prepare or cast a spell, a cleric must have a Wisdom score equal to at least 10 + the spell level.',
        },
        {
          id: 'deity-domains',
          name: 'Deity, Domains, and Domain Spells',
          source: 'Cleric 1',
          description:
            "A cleric's deity influences his alignment, what magic he can perform, his values, and how others see him. A cleric chooses two domains from among those belonging to his deity.",
        },
        {
          id: 'spontaneous-casting',
          name: 'Spontaneous Casting',
          source: 'Cleric 1',
          description:
            "A good cleric (or a neutral cleric of a good deity) can channel stored spell energy into healing spells that the cleric did not prepare ahead of time. An evil cleric (or a neutral cleric of an evil deity) can't convert prepared spells to cure spells but can convert them to inflict spells.",
        },
        {
          id: 'turn-undead',
          name: 'Turn or Rebuke Undead',
          source: 'Cleric 1',
          description:
            'Any cleric, regardless of alignment, has the power to affect undead creatures by channeling the power of his faith through his holy (or unholy) symbol.',
        },
      ],
    },
    {
      level: 2,
      features: [
        {
          id: 'cleric-2',
          name: 'Improved Spellcasting',
          source: 'Cleric 2',
          description: 'Cleric spellcasting improves.',
        },
      ],
    },
    {
      level: 3,
      features: [
        {
          id: 'cleric-3',
          name: 'Divine Power',
          source: 'Cleric 3',
          description: 'Divine power increases.',
        },
      ],
    },
    {
      level: 4,
      features: [
        {
          id: 'cleric-4',
          name: 'Channel Energy',
          source: 'Cleric 4',
          description: 'Channel divine energy.',
        },
      ],
    },
    {
      level: 5,
      features: [
        {
          id: 'cleric-5',
          name: 'Divine Favor',
          source: 'Cleric 5',
          description: 'Divine favor strengthens.',
        },
      ],
    },
    {
      level: 6,
      features: [
        {
          id: 'cleric-6',
          name: 'Holy Strike',
          source: 'Cleric 6',
          description: 'Holy strike ability.',
        },
      ],
    },
    {
      level: 7,
      features: [
        {
          id: 'cleric-7',
          name: 'Divine Shield',
          source: 'Cleric 7',
          description: 'Divine shield protection.',
        },
      ],
    },
    {
      level: 8,
      features: [
        {
          id: 'cleric-8',
          name: 'Holy Aura',
          source: 'Cleric 8',
          description: 'Holy aura emanates.',
        },
      ],
    },
    {
      level: 9,
      features: [
        {
          id: 'cleric-9',
          name: 'Divine Wrath',
          source: 'Cleric 9',
          description: 'Divine wrath manifests.',
        },
      ],
    },
    {
      level: 10,
      features: [
        {
          id: 'cleric-10',
          name: 'Divine Intervention',
          source: 'Cleric 10',
          description: 'Divine intervention occurs.',
        },
      ],
    },
    {
      level: 11,
      features: [
        {
          id: 'cleric-11',
          name: 'Holy Champion',
          source: 'Cleric 11',
          description: 'Become a holy champion.',
        },
      ],
    },
    {
      level: 12,
      features: [
        {
          id: 'cleric-12',
          name: 'Divine Blessing',
          source: 'Cleric 12',
          description: 'Divine blessing granted.',
        },
      ],
    },
    {
      level: 13,
      features: [
        {
          id: 'cleric-13',
          name: 'Holy Crusade',
          source: 'Cleric 13',
          description: 'Lead a holy crusade.',
        },
      ],
    },
    {
      level: 14,
      features: [
        {
          id: 'cleric-14',
          name: 'Divine Judgment',
          source: 'Cleric 14',
          description: 'Divine judgment manifests.',
        },
      ],
    },
    {
      level: 15,
      features: [
        {
          id: 'cleric-15',
          name: 'Holy Ascension',
          source: 'Cleric 15',
          description: 'Holy ascension begins.',
        },
      ],
    },
    {
      level: 16,
      features: [
        {
          id: 'cleric-16',
          name: 'Divine Radiance',
          source: 'Cleric 16',
          description: 'Divine radiance shines.',
        },
      ],
    },
    {
      level: 17,
      features: [
        {
          id: 'cleric-17',
          name: 'Holy Resurrection',
          source: 'Cleric 17',
          description: 'Holy resurrection power.',
        },
      ],
    },
    {
      level: 18,
      features: [
        {
          id: 'cleric-18',
          name: 'Divine Transcendence',
          source: 'Cleric 18',
          description: 'Divine transcendence achieved.',
        },
      ],
    },
    {
      level: 19,
      features: [
        {
          id: 'cleric-19',
          name: 'Holy Apotheosis',
          source: 'Cleric 19',
          description: 'Holy apotheosis nears.',
        },
      ],
    },
    {
      level: 20,
      features: [
        {
          id: 'cleric-20',
          name: 'Divine Avatar',
          source: 'Cleric 20',
          description: 'Become a divine avatar.',
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

  description: 'A divine spellcaster who serves a deity and can channel divine energy.',

  displayMetadata: {
    icon: 'holy-symbol',
    color: '#FFD700',
    shortDescription: 'A divine spellcaster who serves a deity.',
    playStyle: 'Versatile divine caster',
    complexity: 'moderate',
    role: 'support',
    idealFor: ['Support players', 'Healers'],
    tags: ['divine', 'spellcaster', 'support'],
    casterType: 'full',
  },
};
