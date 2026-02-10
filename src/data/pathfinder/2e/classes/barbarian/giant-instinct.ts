import { Subclass } from '../../../../../types/character-options/classes';

export const giantInstinctSubclass: Subclass = {
  id: 'pf2e-barbarian-giant-instinct',
  name: 'Giant Instinct',
  parentClassId: 'barbarian',
  description: 'A barbarian who channels the might of giants, growing to enormous size and dealing devastating damage.',
  
  features: [
    {
      level: 1,
      features: [
        {
          id: 'giant-instinct-1',
          name: 'Giant Instinct',
          source: 'Barbarian 1',
          description: 'You embody the ferocity of a giant. You gain the Giant Stature action. While raging, you deal 6 additional damage with melee Strikes instead of 2, but you have weakness 3 to mental damage.',
        },
        {
          id: 'giant-stature',
          name: 'Giant Stature',
          source: 'Barbarian 1',
          description: 'You can increase your size to Large as part of your Rage action. While Large, you gain 5 feet of reach and are clumsy 1.',
        },
      ],
    },
    {
      level: 3,
      features: [
        {
          id: 'giant-instinct-3',
          name: 'Titan Mauler',
          source: 'Barbarian 3',
          description: 'You can wield weapons one size larger than you without penalty. You gain access to larger weapons and can use them effectively.',
        },
      ],
    },
    {
      level: 6,
      features: [
        {
          id: 'giant-instinct-6',
          name: 'Giant\'s Lunge',
          source: 'Barbarian 6',
          description: 'You can extend your reach even further. When you use Giant Stature, your reach increases by an additional 5 feet.',
        },
      ],
    },
    {
      level: 10,
      features: [
        {
          id: 'giant-instinct-10',
          name: 'Titanic Throw',
          source: 'Barbarian 10',
          description: 'You can throw creatures and objects with tremendous force. You can throw a grabbed creature or object up to 30 feet.',
        },
      ],
    },
    {
      level: 14,
      features: [
        {
          id: 'giant-instinct-14',
          name: 'Giant\'s Stature Improvement',
          source: 'Barbarian 14',
          description: 'Your Giant Stature becomes even more powerful. You can now grow to Huge size, gaining 10 feet of reach.',
        },
      ],
    },
    {
      level: 18,
      features: [
        {
          id: 'giant-instinct-18',
          name: 'Colossal Might',
          source: 'Barbarian 18',
          description: 'Your giant form reaches its peak. While using Giant Stature, you deal an additional 12 damage with melee Strikes instead of 6.',
        },
      ],
    },
  ],
};
