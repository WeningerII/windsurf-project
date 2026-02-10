import { Species } from '../../../../types/character-options/species';

export const human: Species = {
  id: 'human',
  name: 'Human',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  size: 'medium',
  speed: 30,
  
  abilityScoreIncrease: [
    {
      type: 'choice',
      choice: {
        count: 2,
        options: ['str', 'dex', 'con', 'int', 'wis', 'cha'],
        label: 'Choose two ability scores to increase (2024 uses +2/+1; stored as [2,1])',
      },
      values: [2, 1],
    },
  ],
  
  traits: [
    {
      id: 'resourceful',
      name: 'Resourceful',
      source: 'Human',
      description: 'You gain Inspiration whenever you finish a Long Rest.',
    },
    {
      id: 'skillful',
      name: 'Skillful',
      source: 'Human',
      description: 'You gain proficiency in one skill of your choice.',
    },
    {
      id: 'versatile',
      name: 'Versatile',
      source: 'Human',
      description: 'You gain an Origin feat of your choice.',
    },
  ],
  
  languages: {
    automatic: ['Common'],
    choice: {
      count: 1,
      options: ['Dwarvish', 'Elvish', 'Giant', 'Gnomish', 'Goblin', 'Halfling', 'Orc'],
      label: 'Choose one additional language',
    },
  },
  
  description: 'Humans are the most adaptable and ambitious people among the common species. They have widely varying tastes, morals, and customs in the many different lands where they have settled.',
  
  ageInfo: 'Humans reach adulthood in their late teens and live less than a century.',
  
  alignmentTendency: 'Humans tend toward no particular alignment.',
  
  sizeDescription: 'Humans vary widely in height and build, from barely 5 feet to well over 6 feet tall. Your size is Medium.',
};
