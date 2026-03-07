import { Subclass } from '../../../../../types/character-options/classes';

export const wildOrderSubclass: Subclass = {
  id: 'pf2e-druid-wild',
  name: 'Wild Order',
  parentClassId: 'druid',
  description:
    'A druid who embraces the savage power of nature, gaining the ability to transform into powerful beasts.',

  features: [
    {
      level: 1,
      features: [
        {
          id: 'wild-order-1',
          name: 'Wild Order',
          source: 'Druid 1',
          description:
            'You gain the Wild Shape ability, allowing you to transform into animals. You can use Wild Shape to transform into a battle form for 1 minute, a number of times per day equal to your Wisdom modifier.',
        },
        {
          id: 'wild-shape',
          name: 'Wild Shape',
          source: 'Druid 1',
          description:
            'You can transform into an animal form. At 1st level, you can become a Medium animal. Your statistics change to match the animal form.',
        },
      ],
    },
    {
      level: 4,
      features: [
        {
          id: 'wild-order-4',
          name: 'Improved Wild Shape',
          source: 'Druid 4',
          description:
            'You can transform into Large animals. Your natural attacks in animal form deal an additional 1d6 damage.',
        },
      ],
    },
    {
      level: 8,
      features: [
        {
          id: 'wild-order-8',
          name: 'Elemental Shape',
          source: 'Druid 8',
          description:
            "You can use Wild Shape to transform into elemental forms. You gain resistance 10 to the element's damage type while in elemental form.",
        },
      ],
    },
    {
      level: 14,
      features: [
        {
          id: 'wild-order-14',
          name: 'Primal Fury',
          source: 'Druid 14',
          description:
            'While in Wild Shape, you can make two natural attacks as a single action. Your natural attacks also ignore 10 points of resistance.',
        },
      ],
    },
    {
      level: 18,
      features: [
        {
          id: 'wild-order-18',
          name: 'Timeless Body',
          source: 'Druid 18',
          description:
            'You age more slowly and can remain in Wild Shape indefinitely. You also gain immunity to disease and poison while in Wild Shape.',
        },
      ],
    },
  ],
};
