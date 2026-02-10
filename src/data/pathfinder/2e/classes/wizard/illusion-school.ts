import { Subclass } from '../../../../../types/character-options/classes';

export const illusionSchoolSubclass: Subclass = {
  id: 'pf2e-wizard-illusion',
  name: 'School of Illusion',
  parentClassId: 'wizard',
  description: 'A wizard who specializes in illusion magic, creating deceptive images and sounds to confound enemies.',
  
  features: [
    {
      level: 1,
      features: [
        {
          id: 'illusion-specialization',
          name: 'Illusion Specialization',
          source: 'Wizard 1',
          description: 'You can prepare one extra illusion spell of each spell level. The DC for creatures to disbelieve your illusions increases by 1.',
        },
        {
          id: 'warped-terrain',
          name: 'Warped Terrain',
          source: 'Wizard 1',
          description: 'You can create illusory terrain in a 5-foot square within 60 feet. Creatures treat it as difficult terrain unless they disbelieve the illusion.',
        },
      ],
    },
    {
      level: 4,
      features: [
        {
          id: 'invisible-escape',
          name: 'Invisible Escape',
          source: 'Wizard 4',
          description: 'When you take damage, you can use a reaction to become invisible until the end of your next turn. You can use this once per day.',
        },
      ],
    },
    {
      level: 8,
      features: [
        {
          id: 'malleable-illusions',
          name: 'Malleable Illusions',
          source: 'Wizard 8',
          description: 'You can use a single action to alter an illusion spell you have active, changing its appearance or sound.',
        },
      ],
    },
    {
      level: 12,
      features: [
        {
          id: 'illusory-self',
          name: 'Illusory Self',
          source: 'Wizard 12',
          description: 'When a creature makes an attack roll against you, you can use a reaction to create an illusory duplicate. The attack automatically misses. You can use this once per short rest.',
        },
      ],
    },
    {
      level: 16,
      features: [
        {
          id: 'illusory-reality',
          name: 'Illusory Reality',
          source: 'Wizard 16',
          description: 'You can make one object from an illusion spell become real for 1 minute. The object can\'t deal damage or directly harm anyone.',
        },
      ],
    },
  ],
};
