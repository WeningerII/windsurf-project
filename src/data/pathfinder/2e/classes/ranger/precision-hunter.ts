import { Subclass } from '../../../../../types/character-options/classes';

export const precisionHunterSubclass: Subclass = {
  id: 'pf2e-ranger-precision-hunter',
  name: 'Precision Hunter',
  parentClassId: 'ranger',
  description: 'A ranger who focuses on precise, devastating strikes against their hunted prey.',
  
  features: [
    {
      level: 1,
      features: [
        {
          id: 'precision-edge',
          name: 'Precision Edge',
          source: 'Ranger 1',
          description: 'You deal 1d8 additional precision damage to your hunted prey on your first Strike each turn. This increases to 2d8 at 11th level and 3d8 at 19th level.',
        },
        {
          id: 'hunters-aim',
          name: 'Hunter\'s Aim',
          source: 'Ranger 1',
          description: 'You take careful aim at your target. You can spend 2 actions to gain a +2 circumstance bonus to your next attack roll against your hunted prey.',
        },
      ],
    },
    {
      level: 5,
      features: [
        {
          id: 'precision-hunter-5',
          name: 'Deadly Aim',
          source: 'Ranger 5',
          description: 'Your precision strikes become even more lethal. Your precision damage dice increase by one step (d8 to d10).',
        },
      ],
    },
    {
      level: 9,
      features: [
        {
          id: 'precision-hunter-9',
          name: 'Targeting Shot',
          source: 'Ranger 9',
          description: 'You can target specific weak points. When you critically hit your hunted prey, they become flat-footed until the end of your next turn.',
        },
      ],
    },
    {
      level: 13,
      features: [
        {
          id: 'precision-hunter-13',
          name: 'Impossible Shot',
          source: 'Ranger 13',
          description: 'You can make shots that seem impossible. You ignore the concealed condition when attacking your hunted prey.',
        },
      ],
    },
    {
      level: 17,
      features: [
        {
          id: 'precision-hunter-17',
          name: 'Perfect Strike',
          source: 'Ranger 17',
          description: 'Your precision reaches perfection. Once per day, you can turn a hit against your hunted prey into a critical hit.',
        },
      ],
    },
  ],
};
