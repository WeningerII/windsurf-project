import { Species } from '../../../../types/character-options/species';

export const halfling: Species = {
  id: 'halfling',
  name: 'Halfling',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',
  
  abilityScoreIncrease: [
    {
      type: 'fixed',
      attributes: { dex: 2 },
    },
  ],
  
  size: 'small',
  speed: 25,
  
  languages: {
    automatic: ['Common', 'Halfling'],
  },
  
  traits: [
    {
      id: 'lucky',
      name: 'Lucky',
      source: 'Halfling',
      description: 'When you roll a 1 on the d20 for an attack roll, ability check, or saving throw, you can reroll the die and must use the new roll.',
    },
    {
      id: 'brave',
      name: 'Brave',
      source: 'Halfling',
      description: 'You have advantage on saving throws against being frightened.',
    },
    {
      id: 'halfling-nimbleness',
      name: 'Halfling Nimbleness',
      source: 'Halfling',
      description: 'You can move through the space of any creature that is of a size larger than yours.',
    },
  ],
  
  subraces: [
    {
      id: 'lightfoot-halfling',
      name: 'Lightfoot Halfling',
      parentSpeciesId: 'halfling',
      
      abilityScoreIncrease: [
        {
          type: 'fixed',
          attributes: { cha: 1 },
        },
      ],
      
      traits: [
        {
          id: 'naturally-stealthy',
          name: 'Naturally Stealthy',
          source: 'Lightfoot Halfling',
          description: 'You can attempt to hide even when you are obscured only by a creature that is at least one size larger than you.',
        },
      ],
      
      description: 'As a lightfoot halfling, you can easily hide from notice, even using other people as cover.',
    },
    {
      id: 'stout-halfling',
      name: 'Stout Halfling',
      parentSpeciesId: 'halfling',
      
      abilityScoreIncrease: [
        {
          type: 'fixed',
          attributes: { con: 1 },
        },
      ],
      
      traits: [
        {
          id: 'stout-resilience',
          name: 'Stout Resilience',
          source: 'Stout Halfling',
          description: 'You have advantage on saving throws against poison, and you have resistance against poison damage.',
        },
      ],
      
      description: 'As a stout halfling, you\'re hardier than average and have some resistance to poison.',
    },
  ],
  
  description: 'The diminutive halflings survive in a world full of larger creatures by avoiding notice or, barring that, avoiding offense.',
  
  ageInfo: 'A halfling reaches adulthood at the age of 20 and generally lives into the middle of his or her second century.',
  
  alignmentTendency: 'Most halflings are lawful good. As a rule, they are good-hearted and kind, hate to see others in pain, and have no tolerance for oppression.',
  
  sizeDescription: 'Halflings average about 3 feet tall and weigh about 40 pounds. Your size is Small.',
};
