import { CharacterClass } from '../../../../../types/character-options/classes';

export const sorcerer: CharacterClass = {
  id: 'sorcerer',
  name: 'Sorcerer',
  system: 'dnd-3.5e',
  source: 'SRD 3.5',

  version: '3.5',
  lastUpdated: '2026-01-13',
  sourceBook: {
    name: "Player's Handbook 3.5",
    url: 'https://www.d20srd.org/srd/classes/sorcererWizard.htm',
  },

  hitDie: 'd4',
  d20Profile: {
    bab: 'half',
    fortSave: 'poor',
    refSave: 'poor',
    willSave: 'good',
  },
  primaryAbility: ['cha'],

  armorProficiencies: [],
  weaponProficiencies: ['club', 'dagger', 'heavy-crossbow', 'light-crossbow', 'quarterstaff'],
  toolProficiencies: [],

  skillProficiencies: {
    count: 2,
    options: ['bluff', 'concentration', 'craft', 'knowledge', 'profession', 'spellcraft'],
    label: 'Choose two skills',
  },

  equipmentChoices: [],

  startingGold: {
    dice: '3d4',
    multiplier: 10,
  },

  features: [
    {
      level: 1,
      features: [
        {
          id: 'spellcasting-sorcerer-35e',
          name: 'Spellcasting',
          source: 'Sorcerer 1',
          description:
            'You cast arcane spells drawn from the sorcerer/wizard spell list. You do not prepare spells; instead, you know a limited number of spells and can cast them spontaneously.',
        },
        {
          id: 'summon-familiar',
          name: 'Summon Familiar',
          source: 'Sorcerer 1',
          description:
            'You can obtain a familiar. Doing so takes 24 hours and uses magical materials that cost 100 gp.',
        },
      ],
    },
    {
      level: 2,
      features: [
        {
          id: 'sorcerer-2',
          name: 'Improved Spellcasting',
          source: 'Sorcerer 2',
          description: 'Your spellcasting improves.',
        },
      ],
    },
    {
      level: 3,
      features: [
        {
          id: 'sorcerer-3',
          name: 'Bloodline Power',
          source: 'Sorcerer 3',
          description: 'You gain a bloodline power.',
        },
      ],
    },
    {
      level: 4,
      features: [
        {
          id: 'sorcerer-4',
          name: 'Ability Increase',
          source: 'Sorcerer 4',
          description: 'You gain an ability score increase.',
        },
      ],
    },
    {
      level: 5,
      features: [
        {
          id: 'sorcerer-5',
          name: 'Enhanced Bloodline',
          source: 'Sorcerer 5',
          description: 'Your bloodline power enhances.',
        },
      ],
    },
    {
      level: 6,
      features: [
        {
          id: 'sorcerer-6',
          name: 'Spell Penetration',
          source: 'Sorcerer 6',
          description: 'Your spells penetrate magical defenses.',
        },
      ],
    },
    {
      level: 7,
      features: [
        {
          id: 'sorcerer-7',
          name: 'Greater Bloodline',
          source: 'Sorcerer 7',
          description: 'Your bloodline becomes more powerful.',
        },
      ],
    },
    {
      level: 8,
      features: [
        {
          id: 'sorcerer-8',
          name: 'Ability Increase',
          source: 'Sorcerer 8',
          description: 'You gain another ability score increase.',
        },
      ],
    },
    {
      level: 9,
      features: [
        {
          id: 'sorcerer-9',
          name: 'Arcane Mastery',
          source: 'Sorcerer 9',
          description: 'You achieve arcane mastery.',
        },
      ],
    },
    {
      level: 10,
      features: [
        {
          id: 'sorcerer-10',
          name: 'Supreme Bloodline',
          source: 'Sorcerer 10',
          description: 'Your bloodline reaches supreme power.',
        },
      ],
    },
    {
      level: 11,
      features: [
        {
          id: 'sorcerer-11',
          name: 'Spell Mastery',
          source: 'Sorcerer 11',
          description: 'You master spell casting.',
        },
      ],
    },
    {
      level: 12,
      features: [
        {
          id: 'sorcerer-12',
          name: 'Ability Increase',
          source: 'Sorcerer 12',
          description: 'You gain another ability score increase.',
        },
      ],
    },
    {
      level: 13,
      features: [
        {
          id: 'sorcerer-13',
          name: 'Perfect Bloodline',
          source: 'Sorcerer 13',
          description: 'Your bloodline becomes perfect.',
        },
      ],
    },
    {
      level: 14,
      features: [
        {
          id: 'sorcerer-14',
          name: 'Arcane Perfection',
          source: 'Sorcerer 14',
          description: 'You achieve arcane perfection.',
        },
      ],
    },
    {
      level: 15,
      features: [
        {
          id: 'sorcerer-15',
          name: 'Transcendent Power',
          source: 'Sorcerer 15',
          description: 'Your power becomes transcendent.',
        },
      ],
    },
    {
      level: 16,
      features: [
        {
          id: 'sorcerer-16',
          name: 'Ability Increase',
          source: 'Sorcerer 16',
          description: 'You gain another ability score increase.',
        },
      ],
    },
    {
      level: 17,
      features: [
        {
          id: 'sorcerer-17',
          name: 'Magical Ascension',
          source: 'Sorcerer 17',
          description: 'You achieve magical ascension.',
        },
      ],
    },
    {
      level: 18,
      features: [
        {
          id: 'sorcerer-18',
          name: 'Ultimate Bloodline',
          source: 'Sorcerer 18',
          description: 'Your bloodline reaches ultimate power.',
        },
      ],
    },
    {
      level: 19,
      features: [
        {
          id: 'sorcerer-19',
          name: 'Arcane Apotheosis',
          source: 'Sorcerer 19',
          description: 'You near arcane apotheosis.',
        },
      ],
    },
    {
      level: 20,
      features: [
        {
          id: 'sorcerer-20',
          name: 'True Sorcerer',
          source: 'Sorcerer 20',
          description: 'You become a true sorcerer.',
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

  description:
    'An arcane spellcaster whose magic comes from an innate bloodline or mysterious source.',

  displayMetadata: {
    icon: 'sparkles',
    color: '#FF1493',
    shortDescription: 'An innate arcane spellcaster.',
    playStyle: 'Spontaneous caster with limited spells known',
    complexity: 'complex',
    role: 'controller',
    idealFor: ['Players who like spontaneous casting'],
    tags: ['spellcaster', 'arcane', 'versatile'],
    casterType: 'full',
  },
};
