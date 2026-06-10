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

  // CRB heritages. PF2e heritages never grant ability boosts (those come from
  // the ancestry itself) — each grants the feature in its description, so
  // abilityScoreIncrease is truthfully empty on every entry.
  subraces: [
    {
      id: 'half-elf',
      name: 'Half-Elf',
      parentSpeciesId: 'human',
      abilityScoreIncrease: [],
      traits: [],
      description:
        'You gain the elf trait and low-light vision, and you can select elf and half-elf feats whenever you gain an ancestry feat.',
    },
    {
      id: 'half-orc',
      name: 'Half-Orc',
      parentSpeciesId: 'human',
      abilityScoreIncrease: [],
      traits: [],
      description:
        'You gain the orc trait and low-light vision, and you can select orc and half-orc feats whenever you gain an ancestry feat.',
    },
    {
      id: 'skilled',
      name: 'Skilled Heritage',
      parentSpeciesId: 'human',
      abilityScoreIncrease: [],
      traits: [],
      description:
        'You become trained in one skill of your choice; at 5th level you become an expert in that skill.',
    },
    {
      id: 'versatile',
      name: 'Versatile Heritage',
      parentSpeciesId: 'human',
      abilityScoreIncrease: [],
      traits: [],
      description: 'You gain a general feat of your choice that you meet the prerequisites for.',
    },
  ],

  description:
    'Humans are incredibly adaptable. They reach for the stars and rise to the highest positions in most societies.',
  ageInfo: 'Humans reach adulthood at 18 and can live to around 90 years.',
  alignmentTendency: 'Humans have no particular tendencies toward any alignment.',
  sizeDescription: 'Humans vary widely in height and build, from 5 feet to over 6 feet tall.',
};
