import { Species } from '../../../../types/character-options/species';

export const human: Species = {
  id: 'human',
  name: 'Human',
  system: 'pf1e',
  source: 'Core Rulebook',

  abilityScoreIncrease: [
    {
      type: 'choice',
      choice: {
        count: 1,
        options: ['str', 'dex', 'con', 'int', 'wis', 'cha'],
        label: 'Choose one ability score',
      },
      values: [2],
    },
  ],

  size: 'medium',
  speed: 30,

  languages: {
    automatic: ['Common'],
    choice: { count: 0, options: ['Any'], label: 'Bonus languages (any)' },
  },

  traits: [
    {
      id: 'bonus-feat',
      name: 'Bonus Feat',
      source: 'Human',
      description: 'Humans select one extra feat at 1st level.',
    },
    {
      id: 'skilled',
      name: 'Skilled',
      source: 'Human',
      description:
        'Humans gain an additional skill rank at first level and one additional rank whenever they gain a level.',
    },
  ],

  description:
    'Humans possess exceptional drive and a great capacity to endure and expand, and as such are currently the dominant race in the world.',
  ageInfo: 'Humans reach adulthood at 15 and can live to about 100 years.',
  alignmentTendency: 'Humans have no particular tendency toward any alignment.',
  sizeDescription:
    'Humans are Medium creatures and have no bonuses or penalties due to their size.',
};
