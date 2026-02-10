import { Subclass } from '../../../../../types/character-options/classes';

export const stormOrderSubclass: Subclass = {
  id: 'pf2e-druid-storm',
  name: 'Storm Order',
  parentClassId: 'druid',
  description: 'A druid who channels the fury of storms, commanding lightning, wind, and weather.',
  
  features: [
    {
      level: 1,
      features: [
        {
          id: 'storm-order-1',
          name: 'Storm Order',
          source: 'Druid 1',
          description: 'You gain resistance 5 to electricity damage. You can create minor weather effects at will, such as wind, rain, or fog in a 10-foot radius.',
        },
        {
          id: 'tempest-surge',
          name: 'Tempest Surge',
          source: 'Druid 1',
          description: 'You can unleash a surge of wind and lightning. As a 2-action activity, you deal 1d6 electricity damage to all creatures in a 15-foot cone. This increases by 1d6 at 5th, 11th, and 17th levels.',
        },
      ],
    },
    {
      level: 4,
      features: [
        {
          id: 'storm-order-4',
          name: 'Wind Walker',
          source: 'Druid 4',
          description: 'You gain a fly speed of 20 feet. This increases to 30 feet at 8th level and 40 feet at 14th level.',
        },
      ],
    },
    {
      level: 8,
      features: [
        {
          id: 'storm-order-8',
          name: 'Storm\'s Fury',
          source: 'Druid 8',
          description: 'When you take damage from a melee attack, you can use a reaction to deal 2d6 electricity damage to the attacker. Your resistance to electricity increases to 10.',
        },
      ],
    },
    {
      level: 14,
      features: [
        {
          id: 'storm-order-14',
          name: 'Eye of the Storm',
          source: 'Druid 14',
          description: 'You and allies within 30 feet gain immunity to weather effects and resistance 15 to electricity damage. You can see normally through fog, mist, and rain.',
        },
      ],
    },
    {
      level: 18,
      features: [
        {
          id: 'storm-order-18',
          name: 'Storm Avatar',
          source: 'Druid 18',
          description: 'Once per day, you can transform into a living storm for 1 minute. You gain immunity to electricity damage, a fly speed of 60 feet, and your spell attacks deal an extra 3d6 electricity damage.',
        },
      ],
    },
  ],
};
