import { CharacterClass } from '../../../../types/character-options/classes';

export const duelist: CharacterClass = {
  id: 'duelist',
  name: 'Duelist',
  system: 'pf1e',
  source: 'Core Rulebook',
  version: '1.0',
  lastUpdated: '2026-01-14',
  sourceBook: {
    name: 'Pathfinder Core Rulebook',
    page: 400,
    url: 'https://www.d20pfsrd.com/classes/prestige-classes/core-prestige-classes/duelist/',
  },
  hitDie: 'd10',
  primaryAbility: ['dex'],
  savingThrowProficiencies: ['dex', 'int'],
  armorProficiencies: ['light'],
  weaponProficiencies: ['simple', 'martial'],
  toolProficiencies: [],
  skillProficiencies: {
    count: 4,
    options: ['acrobatics', 'bluff', 'escape-artist', 'perception', 'perform', 'sense-motive'],
    label: 'Choose class skills',
  },
  equipmentChoices: [],
  startingGold: { dice: '1d6', multiplier: 10 },
  features: [
    {
      level: 1,
      features: [
        {
          id: 'canny-defense',
          name: 'Canny Defense',
          source: 'Duelist 1',
          description:
            'Add Intelligence bonus to AC when wielding a light or one-handed melee weapon.',
        },
        {
          id: 'precise-strike',
          name: 'Precise Strike',
          source: 'Duelist 1',
          description: 'Add +1d6 damage to attacks with light or one-handed melee weapons.',
        },
      ],
    },
    {
      level: 2,
      features: [
        {
          id: 'improved-reaction',
          name: 'Improved Reaction',
          source: 'Duelist 2',
          description: 'Gain an additional attack of opportunity per round.',
        },
      ],
    },
    {
      level: 3,
      features: [
        {
          id: 'enhanced-mobility',
          name: 'Enhanced Mobility',
          source: 'Duelist 3',
          description: 'Gain +2 bonus to AC against melee attacks when moving.',
        },
      ],
    },
    {
      level: 4,
      features: [
        {
          id: 'canny-defense-2',
          name: 'Canny Defense',
          source: 'Duelist 4',
          description: 'Increase Intelligence bonus to AC by +1.',
        },
      ],
    },
    {
      level: 5,
      features: [
        {
          id: 'parry-riposte',
          name: 'Parry and Riposte',
          source: 'Duelist 5',
          description: 'When you parry an attack, you can immediately make a counterattack.',
        },
      ],
    },
    {
      level: 7,
      features: [
        {
          id: 'master-duelist',
          name: 'Master Duelist',
          source: 'Duelist 7',
          description: 'Gain +2 to attack rolls and damage with light or one-handed melee weapons.',
        },
      ],
    },
    {
      level: 10,
      features: [
        {
          id: 'supreme-parry',
          name: 'Supreme Parry',
          source: 'Duelist 10',
          description: 'Parry any attack once per round, negating all damage.',
        },
      ],
    },
  ],
  subclassLevel: 1,
  subclasses: [],
  description:
    'A master of finesse and elegance who uses intelligence and dexterity to dominate combat with precise strikes and masterful parries.',
};
