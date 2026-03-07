import { Background } from '../../../../types/character-options/backgrounds';

export const noble: Background = {
  id: 'noble-2024',
  name: 'Noble',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',

  skillProficiencies: ['history', 'persuasion'],

  toolProficiencies: ['one-gaming-set'],

  languageProficiencies: {
    count: 1,
    options: ['any'],
    label: 'One language of your choice',
  },

  equipment: ['fine-clothes', 'signet-ring', 'scroll-of-pedigree', 'purse'],

  gold: 25,

  suggestedCharacteristics: {
    traits: [
      'My eloquent flattery makes everyone I talk to feel wonderful',
      "I don't like to get my hands dirty",
      'I take great pains to always look my best',
    ],
    ideals: ['Respect', 'Responsibility', 'Power', 'Family'],
    bonds: [
      'I will face any challenge to win the approval of my family',
      "My house's alliance with another noble family must be sustained",
    ],
    flaws: [
      'I secretly believe that everyone is beneath me',
      'I hide a truly scandalous secret that could ruin my family forever',
    ],
  },

  feature: {
    id: 'position-of-privilege',
    name: 'Position of Privilege',
    source: 'Noble Background',
    description:
      'Thanks to your noble birth, people are inclined to think the best of you. You are welcome in high society, and people assume you have the right to be wherever you are. The common folk make every effort to accommodate you and avoid your displeasure, and other people of high birth treat you as a member of the same social sphere. You can secure an audience with a local noble if you need to.',
  },

  description:
    'You understand wealth, power, and privilege. You carry a noble title, and your family owns land, collects taxes, and wields significant political influence.',
};
