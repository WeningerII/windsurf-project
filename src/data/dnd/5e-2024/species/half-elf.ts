import { Species } from '../../../../types/character-options/species';

export const halfElf: Species = {
  id: 'half-elf',
  name: 'Half-Elf',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  
  abilityScoreIncrease: [
    {
      type: 'fixed',
      attributes: { cha: 2 },
    },
  ],
  
  size: 'medium',
  speed: 30,
  
  languages: {
    automatic: ['Common', 'Elvish'],
    choice: {
      count: 1,
      options: ['any'],
      label: 'Choose one additional language',
    },
  },
  
  traits: [
    {
      id: 'darkvision-half-elf',
      name: 'Darkvision',
      source: 'Half-Elf',
      description: 'You have Darkvision with a range of 60 feet.',
    },
    {
      id: 'fey-ancestry-half-elf',
      name: 'Fey Ancestry',
      source: 'Half-Elf',
      description: 'You have Advantage on saving throws you make to avoid or end the Charmed condition.',
    },
    {
      id: 'versatile',
      name: 'Versatile',
      source: 'Half-Elf',
      description: 'You gain proficiency in two skills of your choice.',
    },
  ],
  
  description: 'Half-elves combine what some say are the best qualities of their elf and human parents.',
  
  ageInfo: 'Half-elves mature at the same rate humans do and reach adulthood around the age of 20. They live much longer than humans, however, often exceeding 180 years.',
  
  alignmentTendency: 'Half-elves share the chaotic bent of their elven heritage.',
  
  sizeDescription: 'Half-elves are about the same size as humans, ranging from 5 to 6 feet tall. Your size is Medium.',
};
