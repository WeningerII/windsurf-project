import { CharacterClass } from '../../../../types/character-options/classes';

export const dragonDisciple: CharacterClass = {
  id: 'dragon-disciple',
  name: 'Dragon Disciple',
  system: 'pf1e',
  source: 'Core Rulebook',
  version: '1.0',
  lastUpdated: '2026-01-14',
  sourceBook: {
    name: 'Pathfinder Core Rulebook',
    page: 396,
    url: 'https://www.d20pfsrd.com/classes/prestige-classes/core-prestige-classes/dragon-disciple/',
  },
  hitDie: 'd12',
  primaryAbility: ['str', 'cha'],
  savingThrowProficiencies: ['str', 'con'],
  armorProficiencies: ['light', 'medium', 'heavy'],
  weaponProficiencies: ['simple', 'martial'],
  toolProficiencies: [],
  skillProficiencies: {
    count: 2,
    options: ['diplomacy', 'escape-artist', 'fly', 'knowledge-arcana', 'perception', 'spellcraft'],
    label: 'Choose class skills',
  },
  equipmentChoices: [],
  startingGold: { dice: '1d6', multiplier: 10 },
  features: [
    {
      level: 1,
      features: [
        {
          id: 'dragon-heritage',
          name: 'Dragon Heritage',
          source: 'Dragon Disciple 1',
          description:
            'Gain draconic abilities and resistances. Gain resistance to your dragon type.',
        },
        {
          id: 'dragon-claws',
          name: 'Dragon Claws',
          source: 'Dragon Disciple 1',
          description: 'Grow dragon claws dealing +1d6 damage.',
        },
      ],
    },
    {
      level: 2,
      features: [
        {
          id: 'draconic-resilience',
          name: 'Draconic Resilience',
          source: 'Dragon Disciple 2',
          description: 'Gain +2 to AC and damage reduction 2/-.',
        },
      ],
    },
    {
      level: 3,
      features: [
        {
          id: 'dragon-breath',
          name: 'Dragon Breath',
          source: 'Dragon Disciple 3',
          description: 'Gain a breath weapon dealing 3d6 damage.',
        },
      ],
    },
    {
      level: 4,
      features: [
        {
          id: 'draconic-form',
          name: 'Draconic Form',
          source: 'Dragon Disciple 4',
          description: 'Grow wings and scales, gaining flight and increased armor.',
        },
      ],
    },
    {
      level: 5,
      features: [
        {
          id: 'dragon-strength',
          name: 'Dragon Strength',
          source: 'Dragon Disciple 5',
          description: 'Gain +2 to Strength and increase damage with melee weapons.',
        },
      ],
    },
    {
      level: 7,
      features: [
        {
          id: 'dragon-breath-2',
          name: 'Dragon Breath',
          source: 'Dragon Disciple 7',
          description: 'Increase breath weapon damage to 6d6 and use it more frequently.',
        },
      ],
    },
    {
      level: 10,
      features: [
        {
          id: 'true-dragon',
          name: 'True Dragon',
          source: 'Dragon Disciple 10',
          description: 'Transform into a true dragon form with all draconic powers.',
        },
      ],
    },
  ],
  d20SpellcastingAdvancement: {
    tracks: [
      {
        id: 'arcane-class',
        label: 'Arcane Spellcasting Class',
        kind: 'arcane',
        advancementLevels: [2, 3, 4, 6, 7, 8, 10],
        eligibleClassIds: ['bard', 'sorcerer'],
      },
    ],
  },
  subclassLevel: 1,
  subclasses: [],
  description:
    'A warrior infused with draconic power who gains dragon-like abilities, resistances, and eventually transforms into a true dragon.',
};
