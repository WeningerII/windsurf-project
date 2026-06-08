import { Species } from '../../../../types/character-options/species';

export const orc: Species = {
  id: 'orc',
  name: 'Orc',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',

  abilityScoreIncrease: [
    {
      type: 'fixed',
      attributes: { str: 2, con: 1 },
    },
  ],

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
      id: 'darkvision',
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
    'Orcs trace their creation to Gruumsh and are known for their physical might, keen senses, and the stubborn endurance that lets them push through wounds that would fell others.',
  ageInfo: 'Orcs reach adulthood in their late teens and live up to about 80 years.',
  sizeDescription: 'Orcs are usually over 6 feet tall. Your size is Medium.',
};
