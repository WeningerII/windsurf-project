import { Subclass } from '../../../../../types/character-options/classes';

// Pathfinder 2e Rogue Assassin Subclass
export const assassinSubclass: Subclass = {
  id: 'pf2e-rogue-assassin',
  name: 'Assassin',
  parentClassId: 'rogue',
  description: 'A rogue trained in the art of assassination who strikes from the shadows with deadly precision.',
  features: [
    {
      level: 1,
      features: [
        {
          id: 'assassin-training',
          name: 'Assassin Training',
          source: 'Rogue 1',
          description: 'You gain training in assassination techniques and deadly strikes.',
        },
        {
          id: 'death-strike',
          name: 'Death Strike',
          source: 'Rogue 1',
          description: 'Your attacks can be instantly lethal if the target is caught off guard.',
        },
      ],
    },
    {
      level: 2,
      features: [
        {
          id: 'assassin-mastery',
          name: 'Assassin Mastery',
          source: 'Rogue 2',
          description: 'Your assassination abilities become more effective.',
        },
      ],
    },
    {
      level: 3,
      features: [
        {
          id: 'assassin-feat',
          name: 'Assassin Feat',
          source: 'Rogue 3',
          description: 'You gain a special feat related to your assassination abilities.',
        },
      ],
    },
    {
      level: 4,
      features: [
        {
          id: 'poison-mastery',
          name: 'Poison Mastery',
          source: 'Rogue 4',
          description: 'You master the use of poisons and toxins.',
        },
      ],
    },
    {
      level: 5,
      features: [
        {
          id: 'assassin-mastery-full',
          name: 'Assassin Mastery',
          source: 'Rogue 5',
          description: 'Your assassination techniques become more refined.',
        },
      ],
    },
    {
      level: 6,
      features: [
        {
          id: 'advanced-assassin-feat',
          name: 'Advanced Assassin Feat',
          source: 'Rogue 6',
          description: 'You gain an advanced feat related to your assassination abilities.',
        },
      ],
    },
    {
      level: 7,
      features: [
        {
          id: 'perfect-assassination',
          name: 'Perfect Assassination',
          source: 'Rogue 7',
          description: 'Your assassination attempts are nearly impossible to defend against.',
        },
      ],
    },
    {
      level: 8,
      features: [
        {
          id: 'assassin-strike',
          name: 'Assassin Strike',
          source: 'Rogue 8',
          description: 'Your attacks can now apply multiple assassination effects.',
        },
      ],
    },
    {
      level: 9,
      features: [
        {
          id: 'assassin-ultimate-feat',
          name: 'Ultimate Assassin Feat',
          source: 'Rogue 9',
          description: 'You gain an ultimate feat that represents the pinnacle of your assassination abilities.',
        },
      ],
    },
    {
      level: 10,
      features: [
        {
          id: 'assassin-perfection',
          name: 'Assassin Perfection',
          source: 'Rogue 10',
          description: 'You have perfected your assassination abilities.',
        },
      ],
    },
    {
      level: 11,
      features: [
        {
          id: 'master-assassin-feat',
          name: 'Master Assassin Feat',
          source: 'Rogue 11',
          description: 'You gain a master-level feat related to your assassination abilities.',
        },
      ],
    },
    {
      level: 12,
      features: [
        {
          id: 'instant-death',
          name: 'Instant Death',
          source: 'Rogue 12',
          description: 'Your assassination can instantly kill even powerful foes.',
        },
      ],
    },
    {
      level: 13,
      features: [
        {
          id: 'assassin-supreme-feat',
          name: 'Supreme Assassin Feat',
          source: 'Rogue 13',
          description: 'You gain a supreme feat that represents mastery of assassination.',
        },
      ],
    },
    {
      level: 14,
      features: [
        {
          id: 'immortal-assassin',
          name: 'Immortal Assassin',
          source: 'Rogue 14',
          description: 'Your assassination abilities are eternal.',
        },
      ],
    },
    {
      level: 15,
      features: [
        {
          id: 'assassin-apex-feat',
          name: 'Apex Assassin Feat',
          source: 'Rogue 15',
          description: 'You gain an apex feat that represents the ultimate expression of your assassination abilities.',
        },
      ],
    },
    {
      level: 16,
      features: [
        {
          id: 'god-of-assassins',
          name: 'God of Assassins',
          source: 'Rogue 16',
          description: 'You have become a god of assassins.',
        },
      ],
    },
    {
      level: 17,
      features: [
        {
          id: 'assassin-transcendent-feat',
          name: 'Transcendent Assassin Feat',
          source: 'Rogue 17',
          description: 'You gain a transcendent feat that goes beyond normal assassination abilities.',
        },
      ],
    },
    {
      level: 18,
      features: [
        {
          id: 'perfect-assassination-mastery',
          name: 'Perfect Assassination Mastery',
          source: 'Rogue 18',
          description: 'Your assassination is perfect and absolute.',
        },
      ],
    },
    {
      level: 19,
      features: [
        {
          id: 'assassin-ultimate-mastery-feat',
          name: 'Ultimate Mastery Feat',
          source: 'Rogue 19',
          description: 'You gain the ultimate mastery feat for your assassination abilities.',
        },
      ],
    },
    {
      level: 20,
      features: [
        {
          id: 'assassin-ascension',
          name: 'Assassin Ascension',
          source: 'Rogue 20',
          description: 'You have ascended to the pinnacle of assassination mastery.',
        },
      ],
    },
  ],
};
