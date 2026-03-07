import { Species } from '../../../../types/character-options/species';

export const human: Species = {
  id: 'human',
  name: 'Human',
  system: 'dnd-3.5e',
  source: 'PHB 3.5',

  abilityScoreIncrease: [],

  size: 'medium',
  speed: 30,

  languages: {
    automatic: ['Common'],
    choice: {
      count: 1,
      options: [
        'Dwarvish',
        'Elvish',
        'Giant',
        'Gnomish',
        'Goblin',
        'Halfling',
        'Orc',
        'Abyssal',
        'Celestial',
        'Draconic',
        'Infernal',
        'Undercommon',
      ],
      label: 'Bonus language',
    },
  },

  traits: [
    {
      id: 'bonus-feat',
      name: 'Bonus Feat',
      source: 'Human',
      description: 'Humans gain an extra feat at 1st level.',
    },
    {
      id: 'bonus-skill-points',
      name: 'Bonus Skill Points',
      source: 'Human',
      description:
        'Humans gain 4 extra skill points at 1st level and 1 extra skill point at each additional level.',
    },
  ],

  description:
    'Humans are the most adaptable of the common races. Short generations and a penchant for migration and conquest have made them physically diverse as well.',

  ageInfo:
    'Humans are considered young until age 15, middle-aged at 35, old at 53, and venerable at 70.',

  alignmentTendency: 'Humans tend toward no particular alignment.',

  sizeDescription:
    'Humans vary widely in height and build, from barely 5 feet to well over 6 feet tall. Your size is Medium.',
};
