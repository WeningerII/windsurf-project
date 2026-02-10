import { Species } from '../../../../types/character-options/species';

export const elf: Species = {
  id: 'elf',
  name: 'Elf',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  
  abilityScoreIncrease: [
    {
      type: 'fixed',
      attributes: { dex: 2 },
    },
  ],
  
  size: 'medium',
  speed: 30,
  
  languages: {
    automatic: ['Common', 'Elvish'],
  },
  
  traits: [
    {
      id: 'darkvision-elf',
      name: 'Darkvision',
      source: 'Elf',
      description: 'You have Darkvision with a range of 60 feet.',
    },
    {
      id: 'elven-lineage',
      name: 'Elven Lineage',
      source: 'Elf',
      description: 'You are part of an elven lineage that grants you supernatural abilities. Choose one of the following options: High Elf (you know one cantrip from the Wizard spell list), Wood Elf (your Speed increases to 35 feet), or Drow (you have Darkvision with a range of 120 feet).',
    },
    {
      id: 'fey-ancestry',
      name: 'Fey Ancestry',
      source: 'Elf',
      description: 'You have Advantage on saving throws you make to avoid or end the Charmed condition.',
    },
    {
      id: 'keen-senses',
      name: 'Keen Senses',
      source: 'Elf',
      description: 'You have proficiency in the Perception skill.',
    },
    {
      id: 'trance',
      name: 'Trance',
      source: 'Elf',
      description: 'You don\'t need to sleep, and magic can\'t put you to sleep. You can finish a Long Rest in 4 hours if you spend those hours in a trancelike meditation, during which you retain consciousness.',
    },
  ],
  
  description: 'Elves are a magical people of otherworldly grace, living in the world but not entirely part of it.',
  
  ageInfo: 'Although elves reach physical maturity at about the same age as humans, the elven understanding of adulthood goes beyond physical growth. An elf typically claims adulthood around the age of 100 and can live to be 750 years old.',
  
  alignmentTendency: 'Elves love freedom, variety, and self-expression.',
  
  sizeDescription: 'Elves range from under 5 to over 6 feet tall and have slender builds. Your size is Medium.',
};
