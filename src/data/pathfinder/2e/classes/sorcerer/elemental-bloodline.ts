import { Subclass } from '../../../../../types/character-options/classes';

export const elementalBloodlineSubclass: Subclass = {
  id: 'pf2e-sorcerer-elemental',
  name: 'Elemental Bloodline',
  parentClassId: 'sorcerer',
  description: 'A sorcerer whose magic comes from elemental forces, commanding fire, water, air, or earth.',
  
  features: [
    {
      level: 1,
      features: [
        {
          id: 'elemental-bloodline-1',
          name: 'Elemental Bloodline',
          source: 'Sorcerer 1',
          description: 'Choose an element (air, earth, fire, or water). You gain resistance 5 to that element\'s damage type. You can change minor aspects of your appearance to reflect your element.',
        },
        {
          id: 'elemental-blast',
          name: 'Elemental Blast',
          source: 'Sorcerer 1',
          description: 'You can unleash a blast of elemental energy as a cantrip, dealing 1d6 damage of your element\'s type. This increases by 1d6 at 5th, 11th, and 17th levels.',
        },
      ],
    },
    {
      level: 3,
      features: [
        {
          id: 'elemental-bloodline-3',
          name: 'Elemental Movement',
          source: 'Sorcerer 3',
          description: 'You gain a special movement mode based on your element: fly 20 feet (air), burrow 15 feet (earth), ignore difficult terrain from fire (fire), or swim 30 feet (water).',
        },
      ],
    },
    {
      level: 7,
      features: [
        {
          id: 'elemental-bloodline-7',
          name: 'Elemental Resistance',
          source: 'Sorcerer 7',
          description: 'Your resistance to your element\'s damage increases to 10. You also gain resistance 5 to a related element.',
        },
      ],
    },
    {
      level: 13,
      features: [
        {
          id: 'elemental-bloodline-13',
          name: 'Elemental Spell',
          source: 'Sorcerer 13',
          description: 'When you cast a spell that deals damage, you can change its damage type to your element\'s damage type.',
        },
      ],
    },
    {
      level: 17,
      features: [
        {
          id: 'elemental-bloodline-17',
          name: 'Elemental Form',
          source: 'Sorcerer 17',
          description: 'Once per day, you can transform into an elemental form for 1 minute. You gain immunity to your element\'s damage and can pass through spaces related to your element.',
        },
      ],
    },
  ],
};
