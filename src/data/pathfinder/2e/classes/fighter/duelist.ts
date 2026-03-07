import { Subclass } from '../../../../../types/character-options/classes';

// Pathfinder 2e Fighter Duelist Subclass
export const duelistSubclass: Subclass = {
  id: 'pf2e-fighter-duelist',
  name: 'Duelist',
  parentClassId: 'fighter',
  description: 'A fighter who masters the art of single-weapon combat with finesse and precision.',
  features: [
    {
      level: 1,
      features: [
        {
          id: 'duelist-training',
          name: 'Duelist Training',
          source: 'Fighter 1',
          description: 'You gain training in single-weapon combat and finesse techniques.',
        },
        {
          id: 'parry-riposte',
          name: 'Parry and Riposte',
          source: 'Fighter 1',
          description: 'You can parry attacks and counter with precise strikes.',
        },
      ],
    },
    {
      level: 2,
      features: [
        {
          id: 'duelist-mastery',
          name: 'Duelist Mastery',
          source: 'Fighter 2',
          description: 'Your dueling abilities become more effective.',
        },
      ],
    },
    {
      level: 3,
      features: [
        {
          id: 'duelist-feat',
          name: 'Duelist Feat',
          source: 'Fighter 3',
          description: 'You gain a special feat related to your dueling abilities.',
        },
      ],
    },
    {
      level: 4,
      features: [
        {
          id: 'finesse-enhancement',
          name: 'Finesse Enhancement',
          source: 'Fighter 4',
          description: 'Your finesse techniques become more refined.',
        },
      ],
    },
    {
      level: 5,
      features: [
        {
          id: 'duelist-mastery-full',
          name: 'Duelist Mastery',
          source: 'Fighter 5',
          description: 'Your dueling techniques become more sophisticated.',
        },
      ],
    },
    {
      level: 6,
      features: [
        {
          id: 'advanced-duelist-feat',
          name: 'Advanced Duelist Feat',
          source: 'Fighter 6',
          description: 'You gain an advanced feat related to your dueling abilities.',
        },
      ],
    },
    {
      level: 7,
      features: [
        {
          id: 'perfect-parry',
          name: 'Perfect Parry',
          source: 'Fighter 7',
          description: 'Your parries are nearly impossible to overcome.',
        },
      ],
    },
    {
      level: 8,
      features: [
        {
          id: 'duelist-strike',
          name: 'Duelist Strike',
          source: 'Fighter 8',
          description: 'Your attacks can now apply dueling effects.',
        },
      ],
    },
    {
      level: 9,
      features: [
        {
          id: 'duelist-ultimate-feat',
          name: 'Ultimate Duelist Feat',
          source: 'Fighter 9',
          description:
            'You gain an ultimate feat that represents the pinnacle of your dueling abilities.',
        },
      ],
    },
    {
      level: 10,
      features: [
        {
          id: 'duelist-perfection',
          name: 'Duelist Perfection',
          source: 'Fighter 10',
          description: 'You have perfected your dueling abilities.',
        },
      ],
    },
    {
      level: 11,
      features: [
        {
          id: 'master-duelist-feat',
          name: 'Master Duelist Feat',
          source: 'Fighter 11',
          description: 'You gain a master-level feat related to your dueling abilities.',
        },
      ],
    },
    {
      level: 12,
      features: [
        {
          id: 'blade-dance',
          name: 'Blade Dance',
          source: 'Fighter 12',
          description: 'Your combat becomes a dance of blades.',
        },
      ],
    },
    {
      level: 13,
      features: [
        {
          id: 'duelist-supreme-feat',
          name: 'Supreme Duelist Feat',
          source: 'Fighter 13',
          description: 'You gain a supreme feat that represents mastery of dueling.',
        },
      ],
    },
    {
      level: 14,
      features: [
        {
          id: 'immortal-duelist',
          name: 'Immortal Duelist',
          source: 'Fighter 14',
          description: 'Your dueling abilities are eternal.',
        },
      ],
    },
    {
      level: 15,
      features: [
        {
          id: 'duelist-apex-feat',
          name: 'Apex Duelist Feat',
          source: 'Fighter 15',
          description:
            'You gain an apex feat that represents the ultimate expression of your dueling abilities.',
        },
      ],
    },
    {
      level: 16,
      features: [
        {
          id: 'god-of-duelists',
          name: 'God of Duelists',
          source: 'Fighter 16',
          description: 'You have become a god of duelists.',
        },
      ],
    },
    {
      level: 17,
      features: [
        {
          id: 'duelist-transcendent-feat',
          name: 'Transcendent Duelist Feat',
          source: 'Fighter 17',
          description: 'You gain a transcendent feat that goes beyond normal dueling abilities.',
        },
      ],
    },
    {
      level: 18,
      features: [
        {
          id: 'perfect-dueling',
          name: 'Perfect Dueling',
          source: 'Fighter 18',
          description: 'Your dueling is perfect and absolute.',
        },
      ],
    },
    {
      level: 19,
      features: [
        {
          id: 'duelist-ultimate-mastery-feat',
          name: 'Ultimate Mastery Feat',
          source: 'Fighter 19',
          description: 'You gain the ultimate mastery feat for your dueling abilities.',
        },
      ],
    },
    {
      level: 20,
      features: [
        {
          id: 'duelist-ascension',
          name: 'Duelist Ascension',
          source: 'Fighter 20',
          description: 'You have ascended to the pinnacle of dueling mastery.',
        },
      ],
    },
  ],
};
