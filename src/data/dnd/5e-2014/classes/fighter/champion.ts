import { Subclass } from '../../../../../types/character-options/classes';

export const championSubclass: Subclass = {
  id: 'champion',
  name: 'Champion',
  parentClassId: 'fighter',
  
  description: 'The archetypal Champion focuses on the development of raw physical power honed to deadly perfection.',
  
  features: [
    {
      level: 3,
      features: [
        {
          id: 'improved-critical',
          name: 'Improved Critical',
          source: 'Champion 3',
          description: 'Beginning when you choose this archetype at 3rd level, your weapon attacks score a critical hit on a roll of 19 or 20.',
        },
      ],
    },
    {
      level: 7,
      features: [
        {
          id: 'remarkable-athlete',
          name: 'Remarkable Athlete',
          source: 'Champion 7',
          description: 'Starting at 7th level, you can add half your proficiency bonus (round up) to any Strength, Dexterity, or Constitution check you make that doesn\'t already use your proficiency bonus. In addition, when you make a running long jump, the distance you can cover increases by a number of feet equal to your Strength modifier.',
        },
      ],
    },
    {
      level: 10,
      features: [
        {
          id: 'additional-fighting-style',
          name: 'Additional Fighting Style',
          source: 'Champion 10',
          description: 'At 10th level, you can choose a second option from the Fighting Style class feature.',
        },
      ],
    },
    {
      level: 15,
      features: [
        {
          id: 'superior-critical',
          name: 'Superior Critical',
          source: 'Champion 15',
          description: 'Starting at 15th level, your weapon attacks score a critical hit on a roll of 18-20.',
        },
      ],
    },
    {
      level: 18,
      features: [
        {
          id: 'survivor',
          name: 'Survivor',
          source: 'Champion 18',
          description: 'At 18th level, you attain the pinnacle of resilience in battle. At the start of each of your turns, you regain hit points equal to 5 + your Constitution modifier if you have no more than half of your hit points left. You don\'t gain this benefit if you have 0 hit points.',
        },
      ],
    },
  ],
};
