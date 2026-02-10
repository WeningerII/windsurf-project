import { Species } from '../../../../types/character-options/species';

export const halfElf: Species = {
  id: 'half-elf',
  name: 'Half-Elf',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  
  abilityScoreIncrease: [
    {
      type: 'fixed',
      attributes: { cha: 2 },
    },
    {
      type: 'choice',
      choice: {
        count: 2,
        options: ['str', 'dex', 'con', 'int', 'wis'],
        label: 'Choose two different abilities to increase by 1',
      },
    },
  ],
  
  size: 'medium',
  speed: 30,
  
  languages: {
    automatic: ['Common', 'Elvish'],
    choice: {
      count: 1,
      options: ['Dwarvish', 'Giant', 'Gnomish', 'Goblin', 'Halfling', 'Orc', 'Abyssal', 'Celestial', 'Draconic', 'Deep Speech', 'Infernal', 'Primordial', 'Sylvan', 'Undercommon'],
      label: 'Choose one additional language',
    },
  },
  
  traits: [
    {
      id: 'darkvision-half-elf',
      name: 'Darkvision',
      source: 'Half-Elf',
      description: 'Thanks to your elf blood, you have superior vision in dark and dim conditions. You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light. You can\'t discern color in darkness, only shades of gray.',
    },
    {
      id: 'fey-ancestry-half-elf',
      name: 'Fey Ancestry',
      source: 'Half-Elf',
      description: 'You have advantage on saving throws against being charmed, and magic can\'t put you to sleep.',
    },
    {
      id: 'skill-versatility',
      name: 'Skill Versatility',
      source: 'Half-Elf',
      description: 'You gain proficiency in two skills of your choice.',
    },
  ],
  
  description: 'Walking in two worlds but truly belonging to neither, half-elves combine what some say are the best qualities of both races.',
  
  ageInfo: 'Half-elves mature at the same rate humans do and reach adulthood around the age of 20. They live much longer than humans, however, often exceeding 180 years.',
  
  alignmentTendency: 'Half-elves share the chaotic bent of their elven heritage. They value both personal freedom and creative expression, demonstrating neither love of leaders nor desire for followers.',
  
  sizeDescription: 'Half-elves are about the same size as humans, ranging from 5 to 6 feet tall. Your size is Medium.',
};
