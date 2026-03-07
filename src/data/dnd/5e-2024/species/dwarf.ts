import { Species } from '../../../../types/character-options/species';

export const dwarf: Species = {
  id: 'dwarf',
  name: 'Dwarf',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',

  abilityScoreIncrease: [
    {
      type: 'fixed',
      attributes: { con: 2 },
    },
  ],

  size: 'medium',
  speed: 25,

  languages: {
    automatic: ['Common', 'Dwarvish'],
  },

  traits: [
    {
      id: 'darkvision-dwarf',
      name: 'Darkvision',
      source: 'Dwarf',
      description: 'You have Darkvision with a range of 60 feet.',
    },
    {
      id: 'dwarven-resilience',
      name: 'Dwarven Resilience',
      source: 'Dwarf',
      description:
        'You have Resistance to Poison Damage. You also have Advantage on saving throws you make to avoid or end the Poisoned condition.',
    },
    {
      id: 'dwarven-toughness',
      name: 'Dwarven Toughness',
      source: 'Dwarf',
      description:
        'Your Hit Point maximum increases by 1, and it increases by 1 again whenever you gain a level.',
    },
    {
      id: 'stonecunning',
      name: 'Stonecunning',
      source: 'Dwarf',
      description:
        'As a Bonus Action, you can give yourself Tremorsense with a range of 60 feet for 10 minutes. You must be on a stone surface or touching a stone surface to use this Tremorsense. You can use this Bonus Action a number of times equal to your Proficiency Bonus, and you regain all expended uses when you finish a Long Rest.',
    },
  ],

  description:
    'Bold and hardy, dwarves are known as skilled warriors, miners, and workers of stone and metal.',

  ageInfo:
    "Dwarves mature at the same rate as humans, but they're considered young until they reach the age of 50. On average, they live about 350 years.",

  alignmentTendency:
    'Most dwarves are lawful, believing firmly in the benefits of a well-ordered society.',

  sizeDescription:
    'Dwarves stand between 4 and 5 feet tall and average about 150 pounds. Your size is Medium.',
};
