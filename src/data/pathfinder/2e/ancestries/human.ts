import { Species } from '../../../../types/character-options/species';

export const human: Species = {
  id: 'human',
  name: 'Human',
  system: 'pf2e',
  source: 'Core Rulebook',

  abilityScoreIncrease: [
    {
      type: 'choice',
      choice: {
        count: 2,
        options: ['str', 'dex', 'con', 'int', 'wis', 'cha'],
        label: 'Two free ability boosts',
      },
      values: [2, 2],
    },
  ],

  size: 'medium',
  speed: 25,

  languages: {
    automatic: ['Common'],
    choice: {
      count: 1,
      options: ['Any'],
      label: 'One additional language plus languages equal to Intelligence modifier',
    },
  },

  traits: [],

  subraces: [
    {
      id: 'skilled',
      name: 'Skilled Heritage',
      parentSpeciesId: 'human',
      abilityScoreIncrease: [{ type: 'fixed', attributes: { int: 2 } }],
      traits: [],
      description: 'You gain an additional skill training and a +1 status bonus to skill checks.',
    },
    {
      id: 'versatile',
      name: 'Versatile Heritage',
      parentSpeciesId: 'human',
      abilityScoreIncrease: [{ type: 'fixed', attributes: { cha: 2 } }],
      traits: [],
      description: 'You gain an additional ancestry feat and can retrain one feat each day.',
    },
    {
      id: 'natural-ambition',
      name: 'Natural Ambition Heritage',
      parentSpeciesId: 'human',
      abilityScoreIncrease: [{ type: 'fixed', attributes: { str: 2 } }],
      traits: [],
      description: 'You gain an additional class feat at 1st level.',
    },
    {
      id: 'general-training',
      name: 'General Training Heritage',
      parentSpeciesId: 'human',
      abilityScoreIncrease: [{ type: 'fixed', attributes: { wis: 2 } }],
      traits: [],
      description: 'You gain an additional general feat at 1st level.',
    },
    {
      id: 'heart-of-the-people',
      name: 'Heart of the People Heritage',
      parentSpeciesId: 'human',
      abilityScoreIncrease: [{ type: 'fixed', attributes: { cha: 2 } }],
      traits: [],
      description:
        'You gain a +1 status bonus to Diplomacy checks and can use Diplomacy to Make an Impression on animals.',
    },
    {
      id: 'winged',
      name: 'Winged Heritage',
      parentSpeciesId: 'human',
      abilityScoreIncrease: [{ type: 'fixed', attributes: { dex: 2 } }],
      traits: [],
      description: 'You gain vestigial wings and can glide, taking no fall damage when falling.',
    },
  ],

  description:
    'Humans are incredibly adaptable. They reach for the stars and rise to the highest positions in most societies.',
  ageInfo: 'Humans reach adulthood at 18 and can live to around 90 years.',
  alignmentTendency: 'Humans have no particular tendencies toward any alignment.',
  sizeDescription: 'Humans vary widely in height and build, from 5 feet to over 6 feet tall.',
};
