import { Species } from '../../../../types/character-options/species';

export const halfOrc: Species = {
  id: 'half-orc',
  name: 'Half-Orc',
  system: 'dnd-3.5e',
  source: 'SRD 3.5',

  abilityScoreIncrease: [
    {
      type: 'fixed',
      attributes: { str: 2, int: -2, cha: -2 },
    },
  ],

  size: 'medium',
  speed: 30,

  languages: {
    automatic: ['Common', 'Orc'],
    choice: {
      count: 0,
      options: ['Draconic', 'Giant', 'Gnoll', 'Goblin', 'Abyssal'],
      label: 'Bonus languages',
    },
  },

  traits: [
    {
      id: 'darkvision-half-orc-35e',
      name: 'Darkvision',
      source: 'Half-Orc',
      description: 'Half-orcs can see in the dark up to 60 feet.',
    },
    {
      id: 'orc-blood',
      name: 'Orc Blood',
      source: 'Half-Orc',
      description: 'For all effects related to race, a half-orc is considered an orc.',
    },
  ],

  description: 'Half-orcs combine human tenacity with orcish strength and ferocity.',

  ageInfo: 'Half-orcs mature a little faster than humans and rarely live longer than 75 years.',

  alignmentTendency: 'Half-orcs tend toward chaos.',

  sizeDescription: 'Half-orcs are somewhat larger and bulkier than humans. Your size is Medium.',
};
