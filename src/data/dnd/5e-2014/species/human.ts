import { Species } from '../../../../types/character-options/species';

export const human: Species = {
  id: 'human',
  name: 'Human',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  
  abilityScoreIncrease: [
    {
      type: 'fixed',
      attributes: {
        str: 1,
        dex: 1,
        con: 1,
        int: 1,
        wis: 1,
        cha: 1,
      },
    },
  ],
  
  size: 'medium',
  speed: 30,
  
  languages: {
    automatic: ['Common'],
    choice: {
      count: 1,
      options: ['Dwarvish', 'Elvish', 'Giant', 'Gnomish', 'Goblin', 'Halfling', 'Orc', 'Abyssal', 'Celestial', 'Draconic', 'Deep Speech', 'Infernal', 'Primordial', 'Sylvan', 'Undercommon'],
      label: 'Choose one additional language',
    },
  },
  
  traits: [
    {
      id: 'human-versatility',
      name: 'Versatility',
      source: 'Human',
      description: 'Humans gain +1 to all ability scores, reflecting their adaptable nature.',
    },
  ],
  
  description: 'Humans are the most adaptable and ambitious people among the common races. They have widely varying tastes, morals, and customs in the many different lands where they have settled.',
  
  ageInfo: 'Humans reach adulthood in their late teens and live less than a century.',
  
  alignmentTendency: 'Humans tend toward no particular alignment. The best and the worst are found among them.',
  
  sizeDescription: 'Humans vary widely in height and build, from barely 5 feet to well over 6 feet tall. Regardless of your position in that range, your size is Medium.',
};

// Note: Variant Human is NOT included in SRD 5.1
