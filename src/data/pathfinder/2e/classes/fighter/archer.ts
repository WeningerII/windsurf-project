import { Subclass } from '../../../../../types/character-options/classes';

// Pathfinder 2e Fighter Archer Subclass
export const archerSubclass: Subclass = {
  id: 'pf2e-fighter-archer',
  name: 'Archer',
  parentClassId: 'fighter',
  description: 'A master of ranged combat who wields bows and other projectile weapons with deadly precision.',
  features: [
    {
      level: 1,
      features: [
        {
          id: 'archer-training',
          name: 'Archer Training',
          source: 'Fighter 1',
          description: 'You gain proficiency with all ranged weapons and advantage on ranged attack rolls.',
        },
        {
          id: 'quick-draw',
          name: 'Quick Draw',
          source: 'Fighter 1',
          description: 'You can draw and fire ranged weapons as a bonus action.',
        },
      ],
    },
    {
      level: 2,
      features: [
        {
          id: 'multishot',
          name: 'Multishot',
          source: 'Fighter 2',
          description: 'You can fire multiple arrows in a single action.',
        },
      ],
    },
    {
      level: 3,
      features: [
        {
          id: 'archer-feat',
          name: 'Archer Feat',
          source: 'Fighter 3',
          description: 'You gain a special feat related to your archery abilities.',
        },
      ],
    },
    {
      level: 4,
      features: [
        {
          id: 'improved-accuracy',
          name: 'Improved Accuracy',
          source: 'Fighter 4',
          description: 'Your ranged attacks gain a +1 bonus to hit.',
        },
      ],
    },
    {
      level: 5,
      features: [
        {
          id: 'archer-mastery',
          name: 'Archer Mastery',
          source: 'Fighter 5',
          description: 'You have mastered archery. Your ranged attacks can now penetrate armor.',
        },
      ],
    },
    {
      level: 6,
      features: [
        {
          id: 'advanced-archer-feat',
          name: 'Advanced Archer Feat',
          source: 'Fighter 6',
          description: 'You gain an advanced feat related to your archery abilities.',
        },
      ],
    },
    {
      level: 7,
      features: [
        {
          id: 'volley-fire',
          name: 'Volley Fire',
          source: 'Fighter 7',
          description: 'You can fire a volley of arrows that affects a large area.',
        },
      ],
    },
    {
      level: 8,
      features: [
        {
          id: 'archer-strike',
          name: 'Archer Strike',
          source: 'Fighter 8',
          description: 'Your ranged attacks can now knock enemies prone.',
        },
      ],
    },
    {
      level: 9,
      features: [
        {
          id: 'archer-ultimate-feat',
          name: 'Ultimate Archer Feat',
          source: 'Fighter 9',
          description: 'You gain an ultimate feat that represents the pinnacle of your archery abilities.',
        },
      ],
    },
    {
      level: 10,
      features: [
        {
          id: 'archer-perfection',
          name: 'Archer Perfection',
          source: 'Fighter 10',
          description: 'You have perfected your archery abilities. Your ranged attacks gain a +2 bonus to hit.',
        },
      ],
    },
    {
      level: 11,
      features: [
        {
          id: 'master-archer-feat',
          name: 'Master Archer Feat',
          source: 'Fighter 11',
          description: 'You gain a master-level feat related to your archery abilities.',
        },
      ],
    },
    {
      level: 12,
      features: [
        {
          id: 'rain-of-arrows',
          name: 'Rain of Arrows',
          source: 'Fighter 12',
          description: 'You can fire a rain of arrows that devastates a large area.',
        },
      ],
    },
    {
      level: 13,
      features: [
        {
          id: 'archer-supreme-feat',
          name: 'Supreme Archer Feat',
          source: 'Fighter 13',
          description: 'You gain a supreme feat that represents mastery of archery.',
        },
      ],
    },
    {
      level: 14,
      features: [
        {
          id: 'immortal-archer',
          name: 'Immortal Archer',
          source: 'Fighter 14',
          description: 'Your archery is nearly perfect. Your ranged attacks gain a +3 bonus to hit.',
        },
      ],
    },
    {
      level: 15,
      features: [
        {
          id: 'archer-apex-feat',
          name: 'Apex Archer Feat',
          source: 'Fighter 15',
          description: 'You gain an apex feat that represents the ultimate expression of your archery abilities.',
        },
      ],
    },
    {
      level: 16,
      features: [
        {
          id: 'god-of-archery',
          name: 'God of Archery',
          source: 'Fighter 16',
          description: 'You have become a god of archery.',
        },
      ],
    },
    {
      level: 17,
      features: [
        {
          id: 'archer-transcendent-feat',
          name: 'Transcendent Archer Feat',
          source: 'Fighter 17',
          description: 'You gain a transcendent feat that goes beyond normal archery abilities.',
        },
      ],
    },
    {
      level: 18,
      features: [
        {
          id: 'perfect-archery',
          name: 'Perfect Archery',
          source: 'Fighter 18',
          description: 'Your archery is perfect. Your ranged attacks gain a +4 bonus to hit.',
        },
      ],
    },
    {
      level: 19,
      features: [
        {
          id: 'archer-ultimate-mastery-feat',
          name: 'Ultimate Mastery Feat',
          source: 'Fighter 19',
          description: 'You gain the ultimate mastery feat for your archery abilities.',
        },
      ],
    },
    {
      level: 20,
      features: [
        {
          id: 'archer-ascension',
          name: 'Archer Ascension',
          source: 'Fighter 20',
          description: 'You have ascended to the pinnacle of archery mastery.',
        },
      ],
    },
  ],
};
