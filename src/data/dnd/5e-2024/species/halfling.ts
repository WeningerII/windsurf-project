import { Species } from '../../../../types/character-options/species';

export const halfling: Species = {
  id: 'halfling',
  name: 'Halfling',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',

  abilityScoreIncrease: [
    {
      type: 'fixed',
      attributes: { dex: 2 },
    },
  ],

  size: 'small',
  speed: 30,

  languages: {
    automatic: ['Common', 'Halfling'],
  },

  traits: [
    {
      id: 'brave',
      name: 'Brave',
      source: 'Halfling',
      description:
        'You have Advantage on saving throws you make to avoid or end the Frightened condition.',
    },
    {
      id: 'halfling-nimbleness',
      name: 'Halfling Nimbleness',
      source: 'Halfling',
      description:
        "You can move through the space of any creature that is a size larger than you, but you can't stop in the same space.",
    },
    {
      id: 'luck',
      name: 'Luck',
      source: 'Halfling',
      description:
        'When you roll a 1 on the d20 of a D20 Test, you can reroll the die, and you must use the new roll.',
    },
    {
      id: 'naturally-stealthy',
      name: 'Naturally Stealthy',
      source: 'Halfling',
      description:
        'You can take the Hide action even when you are obscured only by a creature that is at least one size larger than you.',
    },
  ],

  description:
    'The diminutive halflings survive in a world full of larger creatures by avoiding notice or, barring that, avoiding offense.',

  ageInfo:
    'A halfling reaches adulthood at the age of 20 and generally lives into the middle of their second century.',

  alignmentTendency: 'Most halflings are lawful good.',

  sizeDescription:
    'Halflings average about 3 feet tall and weigh about 40 pounds. Your size is Small.',
};
