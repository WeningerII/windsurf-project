import { CharacterClass } from '../../../../types/character-options/classes';

export const arcaneArcher: CharacterClass = {
  id: 'arcane-archer',
  name: 'Arcane Archer',
  system: 'pf1e',
  source: 'Core Rulebook',
  version: '1.0',
  lastUpdated: '2026-01-14',
  sourceBook: {
    name: 'Pathfinder Core Rulebook',
    page: 374,
    url: 'https://www.d20pfsrd.com/classes/prestige-classes/core-prestige-classes/arcane-archer/',
  },
  hitDie: 'd10',
  d20Profile: {
    bab: 'full',
    fortSave: 'good',
    refSave: 'good',
    willSave: 'poor',
  },
  primaryAbility: ['dex', 'int'],
  armorProficiencies: ['light', 'medium'],
  weaponProficiencies: ['simple', 'martial'],
  toolProficiencies: [],
  skillProficiencies: {
    count: 4,
    options: ['perception', 'ride', 'stealth', 'survival'],
    label: 'Choose class skills',
  },
  equipmentChoices: [],
  startingGold: { dice: '1d6', multiplier: 10 },
  features: [
    {
      level: 1,
      features: [
        {
          id: 'arcane-arrow',
          name: 'Arcane Arrow',
          source: 'Arcane Archer 1',
          description: 'Enhance arrows with arcane magic, adding +1d6 damage.',
        },
        {
          id: 'arcane-mastery',
          name: 'Arcane Mastery',
          source: 'Arcane Archer 1',
          description: 'Gain +1 to spell DCs for spells cast through arrows.',
        },
      ],
    },
    {
      level: 2,
      features: [
        {
          id: 'arrow-enhancement',
          name: 'Arrow Enhancement',
          source: 'Arcane Archer 2',
          description: 'Arrows gain magical properties, treating them as +1 weapons.',
        },
      ],
    },
    {
      level: 3,
      features: [
        {
          id: 'arcane-arrow-2',
          name: 'Arcane Arrow',
          source: 'Arcane Archer 3',
          description: 'Increase Arcane Arrow damage to +2d6.',
        },
      ],
    },
    {
      level: 4,
      features: [
        {
          id: 'arrow-enhancement-2',
          name: 'Arrow Enhancement',
          source: 'Arcane Archer 4',
          description: 'Arrows gain additional magical properties, treating them as +2 weapons.',
        },
      ],
    },
    {
      level: 5,
      features: [
        {
          id: 'arcane-arrow-3',
          name: 'Arcane Arrow',
          source: 'Arcane Archer 5',
          description: 'Increase Arcane Arrow damage to +3d6 and add spell effects to arrows.',
        },
      ],
    },
    {
      level: 7,
      features: [
        {
          id: 'arrow-enhancement-3',
          name: 'Arrow Enhancement',
          source: 'Arcane Archer 7',
          description: 'Arrows gain supreme magical properties, treating them as +3 weapons.',
        },
      ],
    },
    {
      level: 10,
      features: [
        {
          id: 'master-archer',
          name: 'Master Archer',
          source: 'Arcane Archer 10',
          description:
            'Become a master of arcane archery, gaining +4d6 damage and the ability to fire multiple arrows per round.',
        },
      ],
    },
  ],
  subclassLevel: 1,
  subclasses: [],
  description:
    'A master archer who infuses arrows with arcane magic for devastating effects and supernatural accuracy.',
};
