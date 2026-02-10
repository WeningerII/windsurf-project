import { Species } from '../../../../types/character-options/species';

export const dwarf: Species = {
  id: 'dwarf',
  name: 'Dwarf',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  
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
      description: 'Accustomed to life underground, you have superior vision in dark and dim conditions. You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light. You can\'t discern color in darkness, only shades of gray.',
    },
    {
      id: 'dwarven-resilience',
      name: 'Dwarven Resilience',
      source: 'Dwarf',
      description: 'You have advantage on saving throws against poison, and you have resistance against poison damage.',
    },
    {
      id: 'dwarven-combat-training',
      name: 'Dwarven Combat Training',
      source: 'Dwarf',
      description: 'You have proficiency with the battleaxe, handaxe, light hammer, and warhammer.',
    },
    {
      id: 'tool-proficiency',
      name: 'Tool Proficiency',
      source: 'Dwarf',
      description: 'You gain proficiency with the artisan\'s tools of your choice: smith\'s tools, brewer\'s supplies, or mason\'s tools.',
    },
    {
      id: 'stonecunning',
      name: 'Stonecunning',
      source: 'Dwarf',
      description: 'Whenever you make an Intelligence (History) check related to the origin of stonework, you are considered proficient in the History skill and add double your proficiency bonus to the check, instead of your normal proficiency bonus.',
    },
  ],
  
  subraces: [
    {
      id: 'hill-dwarf',
      name: 'Hill Dwarf',
      parentSpeciesId: 'dwarf',
      
      abilityScoreIncrease: [
        {
          type: 'fixed',
          attributes: { wis: 1 },
        },
      ],
      
      traits: [
        {
          id: 'dwarven-toughness',
          name: 'Dwarven Toughness',
          source: 'Hill Dwarf',
          description: 'Your hit point maximum increases by 1, and it increases by 1 every time you gain a level.',
        },
      ],
      
      description: 'As a hill dwarf, you have keen senses, deep intuition, and remarkable resilience.',
    },
    {
      id: 'mountain-dwarf',
      name: 'Mountain Dwarf',
      parentSpeciesId: 'dwarf',
      
      abilityScoreIncrease: [
        {
          type: 'fixed',
          attributes: { str: 2 },
        },
      ],
      
      traits: [
        {
          id: 'dwarven-armor-training',
          name: 'Dwarven Armor Training',
          source: 'Mountain Dwarf',
          description: 'You have proficiency with light and medium armor.',
        },
      ],
      
      description: 'As a mountain dwarf, you\'re strong and hardy, accustomed to a difficult life in rugged terrain.',
    },
  ],
  
  description: 'Bold and hardy, dwarves are known as skilled warriors, miners, and workers of stone and metal.',
  
  ageInfo: 'Dwarves mature at the same rate as humans, but they\'re considered young until they reach the age of 50. On average, they live about 350 years.',
  
  alignmentTendency: 'Most dwarves are lawful, believing firmly in the benefits of a well-ordered society.',
  
  sizeDescription: 'Dwarves stand between 4 and 5 feet tall and average about 150 pounds. Your size is Medium.',
};
