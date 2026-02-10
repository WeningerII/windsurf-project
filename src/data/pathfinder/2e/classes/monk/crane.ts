import { Subclass } from '../../../../../types/character-options/classes';

export const craneSubclass: Subclass = {
  id: 'pf2e-monk-crane',
  name: 'Crane Stance',
  parentClassId: 'monk',
  
  features: [
    {
      level: 1,
      features: [
        {
          id: 'crane-stance',
          name: 'Crane Stance',
          source: 'Monk 1',
          description: 'You adopt the crane stance, gaining a +1 circumstance bonus to AC and allowing you to use Acrobatics instead of Athletics for checks to Tumble Through or Balance.',
        },
        {
          id: 'crane-wing-block',
          name: 'Crane Wing Block',
          source: 'Monk 1',
          description: 'You can use your reaction to block an attack with your crane stance, potentially deflecting it.',
        },
      ],
    },
    {
      level: 2,
      features: [
        {
          id: 'crane-feat-2',
          name: 'Crane Feat',
          source: 'Monk 2',
          description: 'You gain a feat related to your crane stance training.',
        },
      ],
    },
    {
      level: 4,
      features: [
        {
          id: 'crane-feat-4',
          name: 'Crane Feat',
          source: 'Monk 4',
          description: 'You gain another crane-related feat.',
        },
      ],
    },
    {
      level: 6,
      features: [
        {
          id: 'crane-feat-6',
          name: 'Crane Feat',
          source: 'Monk 6',
          description: 'You gain another crane-related feat.',
        },
      ],
    },
    {
      level: 8,
      features: [
        {
          id: 'crane-feat-8',
          name: 'Crane Feat',
          source: 'Monk 8',
          description: 'You gain another crane-related feat.',
        },
      ],
    },
    {
      level: 10,
      features: [
        {
          id: 'crane-feat-10',
          name: 'Crane Feat',
          source: 'Monk 10',
          description: 'You gain another crane-related feat.',
        },
      ],
    },
    {
      level: 12,
      features: [
        {
          id: 'crane-feat-12',
          name: 'Crane Feat',
          source: 'Monk 12',
          description: 'You gain another crane-related feat.',
        },
      ],
    },
    {
      level: 14,
      features: [
        {
          id: 'crane-feat-14',
          name: 'Crane Feat',
          source: 'Monk 14',
          description: 'You gain another crane-related feat.',
        },
      ],
    },
    {
      level: 16,
      features: [
        {
          id: 'crane-feat-16',
          name: 'Crane Feat',
          source: 'Monk 16',
          description: 'You gain another crane-related feat.',
        },
      ],
    },
    {
      level: 18,
      features: [
        {
          id: 'crane-feat-18',
          name: 'Crane Feat',
          source: 'Monk 18',
          description: 'You gain another crane-related feat.',
        },
      ],
    },
    {
      level: 20,
      features: [
        {
          id: 'crane-feat-20',
          name: 'Crane Feat',
          source: 'Monk 20',
          description: 'You gain another crane-related feat.',
        },
      ],
    },
  ],
  
  description: 'A monk who has mastered the crane stance, emphasizing grace, balance, and defensive techniques.',
};
