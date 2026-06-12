// GENERATED from 5e-bits/5e-database 2024 species + traits (SRD 5.2,
// OGL 1.0a — see docs/srd-sources.md), completing 2024 species coverage.

import { Species } from '../../../../types/character-options/species';

export const orc: Species = {
  id: 'orc',
  name: 'Orc',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',

  // SRD 5.2 species grant no ability score increases (those moved to
  // backgrounds in the 2024 rules).
  abilityScoreIncrease: [],

  size: 'medium',
  speed: 30,

  languages: {
    automatic: ['Common', 'Orc'],
  },

  traits: [
    {
      id: 'adrenaline-rush',
      name: 'Adrenaline Rush',
      source: 'Orc',
      description:
        'You can take the Dash action as a Bonus Action. When you do so, you gain a number of Temporary Hit Points equal to your Proficiency Bonus. You can use this trait a number of times equal to your Proficiency Bonus, and you regain all expended uses when you finish a Short or Long Rest.',
    },
    {
      id: 'darkvision-120',
      name: 'Darkvision',
      source: 'Orc',
      description: 'You have Darkvision with a range of 120 feet.',
    },
    {
      id: 'relentless-endurance',
      name: 'Relentless Endurance',
      source: 'Orc',
      description:
        "When you are reduced to 0 Hit Points but not killed outright, you can drop to 1 Hit Point instead. Once you use this trait, you can't do so again until you finish a Long Rest.",
    },
  ],

  description:
    'Orcs are tough and tenacious, equipped with gifts of endurance and determination passed down from the one-eyed god Gruumsh.',

  ageInfo: 'Orcs reach adulthood at about age 12 and can live to be 80.',

  sizeDescription: 'Medium',
};
