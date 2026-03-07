import { CharacterClass } from '../../../../types/character-options/classes';

export const archmage: CharacterClass = {
  id: 'archmage',
  name: 'Archmage',
  system: 'pf1e',
  source: 'Core Rulebook',
  version: '1.0',
  lastUpdated: '2026-01-14',
  sourceBook: {
    name: 'Pathfinder Core Rulebook',
    page: 424,
    url: 'https://www.d20pfsrd.com/classes/prestige-classes/core-prestige-classes/archmage/',
  },
  hitDie: 'd6',
  primaryAbility: ['int'],
  savingThrowProficiencies: ['int', 'wis'],
  armorProficiencies: [],
  weaponProficiencies: ['club', 'dagger', 'quarterstaff'],
  toolProficiencies: [],
  skillProficiencies: {
    count: 4,
    options: ['knowledge-arcana', 'knowledge-any', 'spellcraft'],
    label: 'Choose class skills',
  },
  equipmentChoices: [],
  startingGold: { dice: '1d6', multiplier: 10 },
  features: [
    {
      level: 1,
      features: [
        {
          id: 'arcane-mastery',
          name: 'Arcane Mastery',
          source: 'Archmage 1',
          description: 'Master arcane spellcasting and gain +1 to spell DCs.',
        },
        {
          id: 'high-arcana',
          name: 'High Arcana',
          source: 'Archmage 1',
          description: 'Learn one arcane high arcana ability.',
        },
      ],
    },
    {
      level: 2,
      features: [
        {
          id: 'arcane-reach',
          name: 'Arcane Reach',
          source: 'Archmage 2',
          description: 'Increase the range of your touch spells by 30 feet.',
        },
      ],
    },
    {
      level: 3,
      features: [
        {
          id: 'high-arcana-2',
          name: 'High Arcana',
          source: 'Archmage 3',
          description: 'Learn another arcane high arcana ability.',
        },
      ],
    },
    {
      level: 4,
      features: [
        {
          id: 'spell-power',
          name: 'Spell Power',
          source: 'Archmage 4',
          description: 'Increase spell damage by 1d6 when casting damaging spells.',
        },
      ],
    },
    {
      level: 5,
      features: [
        {
          id: 'high-arcana-3',
          name: 'High Arcana',
          source: 'Archmage 5',
          description: 'Learn a third arcane high arcana ability.',
        },
      ],
    },
    {
      level: 7,
      features: [
        {
          id: 'high-arcana-4',
          name: 'High Arcana',
          source: 'Archmage 7',
          description: 'Learn a fourth arcane high arcana ability.',
        },
      ],
    },
    {
      level: 10,
      features: [
        {
          id: 'spell-immunity',
          name: 'Spell Immunity',
          source: 'Archmage 10',
          description: 'Gain immunity to one spell of your choice.',
        },
        {
          id: 'high-arcana-5',
          name: 'High Arcana',
          source: 'Archmage 10',
          description: 'Learn a fifth arcane high arcana ability.',
        },
      ],
    },
  ],
  subclassLevel: 1,
  subclasses: [],
  description:
    'A supreme master of arcane magic who has transcended mortal limitations and commands reality itself.',
};
