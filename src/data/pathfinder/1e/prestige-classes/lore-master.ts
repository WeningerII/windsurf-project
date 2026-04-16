import { CharacterClass } from '../../../../types/character-options/classes';

export const loreMaster: CharacterClass = {
  id: 'lore-master',
  name: 'Loremaster',
  system: 'pf1e',
  source: 'Core Rulebook',
  version: '1.0',
  lastUpdated: '2026-01-14',
  sourceBook: {
    name: 'Pathfinder Core Rulebook',
    page: 408,
    url: 'https://www.d20pfsrd.com/classes/prestige-classes/core-prestige-classes/lore-master/',
  },
  hitDie: 'd6',
  primaryAbility: ['int'],
  savingThrowProficiencies: ['int', 'wis'],
  armorProficiencies: [],
  weaponProficiencies: ['club', 'dagger', 'quarterstaff'],
  toolProficiencies: [],
  skillProficiencies: {
    count: 4,
    options: [
      'appraise',
      'diplomacy',
      'handle-animal',
      'heal',
      'knowledge-any',
      'linguistics',
      'perform',
      'spellcraft',
      'use-magic',
    ],
    label: 'Choose class skills',
  },
  equipmentChoices: [],
  startingGold: { dice: '1d6', multiplier: 10 },
  features: [
    {
      level: 1,
      features: [
        {
          id: 'lore-mastery',
          name: 'Lore Mastery',
          source: 'Loremaster 1',
          description: 'Modify spell effects through knowledge. Gain +1 to spell DCs.',
        },
        {
          id: 'knowledge-pool',
          name: 'Knowledge Pool',
          source: 'Loremaster 1',
          description: 'Gain a pool of knowledge points to modify spells.',
        },
      ],
    },
    {
      level: 2,
      features: [
        {
          id: 'spell-modification',
          name: 'Spell Modification',
          source: 'Loremaster 2',
          description: 'Modify one aspect of a spell you cast per day.',
        },
      ],
    },
    {
      level: 3,
      features: [
        {
          id: 'arcane-knowledge',
          name: 'Arcane Knowledge',
          source: 'Loremaster 3',
          description: 'Gain +2 bonus to Knowledge checks and identify magical items.',
        },
      ],
    },
    {
      level: 4,
      features: [
        {
          id: 'spell-modification-2',
          name: 'Spell Modification',
          source: 'Loremaster 4',
          description: 'Modify two aspects of a spell you cast per day.',
        },
      ],
    },
    {
      level: 5,
      features: [
        {
          id: 'universal-knowledge',
          name: 'Universal Knowledge',
          source: 'Loremaster 5',
          description: 'Gain knowledge of all schools of magic. Add +1d6 to spell damage.',
        },
      ],
    },
    {
      level: 7,
      features: [
        {
          id: 'spell-modification-3',
          name: 'Spell Modification',
          source: 'Loremaster 7',
          description: 'Modify three aspects of a spell you cast per day.',
        },
      ],
    },
    {
      level: 10,
      features: [
        {
          id: 'master-of-lore',
          name: 'Master of Lore',
          source: 'Loremaster 10',
          description: 'Become a true master of lore, able to reshape reality through knowledge.',
        },
      ],
    },
  ],
  d20SpellcastingAdvancement: {
    tracks: [
      {
        id: 'existing-class',
        label: 'Spellcasting Class',
        kind: 'any',
        advancementLevels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      },
    ],
  },
  subclassLevel: 1,
  subclasses: [],
  description:
    'A master of knowledge who can modify spell effects through deep understanding of magic and lore.',
};
