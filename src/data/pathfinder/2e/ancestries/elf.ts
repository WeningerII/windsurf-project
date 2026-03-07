import { Species } from '../../../../types/character-options/species';

export const elf: Species = {
  id: 'elf',
  name: 'Elf',
  system: 'pf2e',
  source: 'Core Rulebook',

  abilityScoreIncrease: [
    { type: 'fixed', attributes: { dex: 2, int: 2, con: -2 } },
    {
      type: 'choice',
      choice: { count: 1, options: ['str', 'wis', 'cha'], label: 'Free ability boost' },
      values: [2],
    },
  ],

  size: 'medium',
  speed: 30,

  languages: {
    automatic: ['Common', 'Elven'],
    choice: {
      count: 0,
      options: ['Celestial', 'Draconic', 'Gnoll', 'Gnomish', 'Goblin', 'Orcish', 'Sylvan'],
      label: 'Additional languages equal to Intelligence modifier',
    },
  },

  traits: [
    {
      id: 'low-light-vision',
      name: 'Low-Light Vision',
      source: 'Elf',
      description: 'You can see in dim light as though it were bright light.',
    },
  ],

  subraces: [
    {
      id: 'drow',
      name: 'Drow Heritage',
      parentSpeciesId: 'elf',
      abilityScoreIncrease: [{ type: 'fixed', attributes: { cha: 2 } }],
      traits: [],
      description: 'You gain darkvision and a +1 status bonus to Stealth checks in darkness.',
    },
    {
      id: 'wood-elf',
      name: 'Wood Elf Heritage',
      parentSpeciesId: 'elf',
      abilityScoreIncrease: [{ type: 'fixed', attributes: { str: 2 } }],
      traits: [],
      description:
        'You gain a +1 status bonus to Survival checks and can move through difficult terrain.',
    },
    {
      id: 'high-elf',
      name: 'High Elf Heritage',
      parentSpeciesId: 'elf',
      abilityScoreIncrease: [{ type: 'fixed', attributes: { int: 2 } }],
      traits: [],
      description: 'You gain a +1 status bonus to Arcana checks and can cast one cantrip.',
    },
    {
      id: 'cavern-elf',
      name: 'Cavern Elf Heritage',
      parentSpeciesId: 'elf',
      abilityScoreIncrease: [{ type: 'fixed', attributes: { dex: 2 } }],
      traits: [],
      description: 'You gain darkvision and a +1 status bonus to Acrobatics checks.',
    },
  ],

  description:
    'As an ancient people, elves have seen a great deal of history. Elves combine otherworldly grace, sharp intellect, and mysterious charm.',
  ageInfo:
    'Elves reach physical adulthood around the age of 20 but are considered young until around 100. They can live to 600 years old or more.',
  alignmentTendency: 'Elves tend toward chaotic alignments.',
  sizeDescription: 'Elves are generally taller than humans, standing 5½ to 6½ feet tall.',
};
