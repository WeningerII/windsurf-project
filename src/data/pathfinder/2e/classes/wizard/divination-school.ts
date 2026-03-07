import { Subclass } from '../../../../../types/character-options/classes';

export const divinationSchoolSubclass: Subclass = {
  id: 'pf2e-wizard-divination',
  name: 'School of Divination',
  parentClassId: 'wizard',
  description:
    'A wizard who specializes in divination magic, peering into the future and uncovering hidden knowledge.',

  features: [
    {
      level: 1,
      features: [
        {
          id: 'divination-specialization',
          name: 'Divination Specialization',
          source: 'Wizard 1',
          description:
            'You can prepare one extra divination spell of each spell level. You gain a +1 circumstance bonus to Perception checks and initiative rolls.',
        },
        {
          id: 'diviner-sense',
          name: "Diviner's Sense",
          source: 'Wizard 1',
          description:
            "You can detect magic within 30 feet at will. This functions as the detect magic spell but doesn't require concentration.",
        },
      ],
    },
    {
      level: 4,
      features: [
        {
          id: 'portent',
          name: 'Portent',
          source: 'Wizard 4',
          description:
            'At the start of each day, roll two d20s and record the results. You can replace any attack roll, saving throw, or ability check made by you or a creature you can see with one of these rolls. You must choose before the roll is made.',
        },
      ],
    },
    {
      level: 8,
      features: [
        {
          id: 'expert-divination',
          name: 'Expert Divination',
          source: 'Wizard 8',
          description:
            'When you cast a divination spell of 4th level or lower, you regain one expended spell slot of a level lower than the spell you cast.',
        },
      ],
    },
    {
      level: 12,
      features: [
        {
          id: 'third-eye',
          name: 'The Third Eye',
          source: 'Wizard 12',
          description:
            "You can see invisible creatures and objects within 60 feet as if they were visible. You also gain darkvision to 60 feet if you don't already have it.",
        },
      ],
    },
    {
      level: 16,
      features: [
        {
          id: 'greater-portent',
          name: 'Greater Portent',
          source: 'Wizard 16',
          description: 'You roll three d20s for your Portent feature instead of two.',
        },
      ],
    },
  ],
};
