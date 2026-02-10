import { Subclass } from '../../../../../types/character-options/classes';

// Pathfinder 2e Warlock Hexblade Subclass
export const hexbladeSubclass: Subclass = {
  id: 'pf2e-warlock-hexblade',
  name: 'Hexblade',
  parentClassId: 'warlock',
  description: 'A warlock who has made a pact with a powerful entity, gaining the ability to curse enemies with their blade.',
  features: [
    {
      level: 1,
      features: [
        {
          id: 'hexblade-curse',
          name: 'Hexblade Curse',
          source: 'Warlock 1',
          description: 'You can curse a creature with your blade, causing it to suffer misfortune.',
        },
        {
          id: 'hex-weapon',
          name: 'Hex Weapon',
          source: 'Warlock 1',
          description: 'Your weapon becomes a conduit for your hexes.',
        },
      ],
    },
    {
      level: 2,
      features: [
        {
          id: 'curse-amplification',
          name: 'Curse Amplification',
          source: 'Warlock 2',
          description: 'Your curses become more powerful and harder to resist.',
        },
      ],
    },
    {
      level: 3,
      features: [
        {
          id: 'hexblade-feat',
          name: 'Hexblade Feat',
          source: 'Warlock 3',
          description: 'You gain a special feat related to your hexblade abilities.',
        },
      ],
    },
    {
      level: 4,
      features: [
        {
          id: 'curse-enhancement',
          name: 'Curse Enhancement',
          source: 'Warlock 4',
          description: 'Enhance your curse abilities.',
        },
      ],
    },
    {
      level: 5,
      features: [
        {
          id: 'hexblade-mastery',
          name: 'Hexblade Mastery',
          source: 'Warlock 5',
          description: 'You have mastered hexblade magic. Your curses become devastating.',
        },
      ],
    },
    {
      level: 6,
      features: [
        {
          id: 'advanced-hexblade-feat',
          name: 'Advanced Hexblade Feat',
          source: 'Warlock 6',
          description: 'You gain an advanced feat related to your hexblade abilities.',
        },
      ],
    },
    {
      level: 7,
      features: [
        {
          id: 'curse-form',
          name: 'Curse Form',
          source: 'Warlock 7',
          description: 'You can assume a form wreathed in curse energy.',
        },
      ],
    },
    {
      level: 8,
      features: [
        {
          id: 'curse-strike',
          name: 'Curse Strike',
          source: 'Warlock 8',
          description: 'Your attacks can now apply multiple curses.',
        },
      ],
    },
    {
      level: 9,
      features: [
        {
          id: 'hexblade-ultimate-feat',
          name: 'Ultimate Hexblade Feat',
          source: 'Warlock 9',
          description: 'You gain an ultimate feat that represents the pinnacle of your hexblade abilities.',
        },
      ],
    },
    {
      level: 10,
      features: [
        {
          id: 'hexblade-perfection',
          name: 'Hexblade Perfection',
          source: 'Warlock 10',
          description: 'You have perfected your hexblade abilities.',
        },
      ],
    },
    {
      level: 11,
      features: [
        {
          id: 'master-hexblade-feat',
          name: 'Master Hexblade Feat',
          source: 'Warlock 11',
          description: 'You gain a master-level feat related to your hexblade abilities.',
        },
      ],
    },
    {
      level: 12,
      features: [
        {
          id: 'mass-curse',
          name: 'Mass Curse',
          source: 'Warlock 12',
          description: 'Your curses can now affect multiple creatures.',
        },
      ],
    },
    {
      level: 13,
      features: [
        {
          id: 'hexblade-supreme-feat',
          name: 'Supreme Hexblade Feat',
          source: 'Warlock 13',
          description: 'You gain a supreme feat that represents mastery of hexblade magic.',
        },
      ],
    },
    {
      level: 14,
      features: [
        {
          id: 'immortal-curse',
          name: 'Immortal Curse',
          source: 'Warlock 14',
          description: 'Your curses are eternal and cannot be broken.',
        },
      ],
    },
    {
      level: 15,
      features: [
        {
          id: 'hexblade-apex-feat',
          name: 'Apex Hexblade Feat',
          source: 'Warlock 15',
          description: 'You gain an apex feat that represents the ultimate expression of your hexblade abilities.',
        },
      ],
    },
    {
      level: 16,
      features: [
        {
          id: 'god-of-curses',
          name: 'God of Curses',
          source: 'Warlock 16',
          description: 'You have become a god of curses.',
        },
      ],
    },
    {
      level: 17,
      features: [
        {
          id: 'hexblade-transcendent-feat',
          name: 'Transcendent Hexblade Feat',
          source: 'Warlock 17',
          description: 'You gain a transcendent feat that goes beyond normal hexblade abilities.',
        },
      ],
    },
    {
      level: 18,
      features: [
        {
          id: 'perfect-curse',
          name: 'Perfect Curse',
          source: 'Warlock 18',
          description: 'Your curses are perfect and absolute.',
        },
      ],
    },
    {
      level: 19,
      features: [
        {
          id: 'hexblade-ultimate-mastery-feat',
          name: 'Ultimate Mastery Feat',
          source: 'Warlock 19',
          description: 'You gain the ultimate mastery feat for your hexblade abilities.',
        },
      ],
    },
    {
      level: 20,
      features: [
        {
          id: 'hexblade-ascension',
          name: 'Hexblade Ascension',
          source: 'Warlock 20',
          description: 'You have ascended to the pinnacle of hexblade mastery.',
        },
      ],
    },
  ],
};
