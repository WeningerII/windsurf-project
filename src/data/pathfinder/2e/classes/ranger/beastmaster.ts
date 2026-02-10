import { Subclass } from '../../../../../types/character-options/classes';

// Pathfinder 2e Ranger Beast Master Subclass
export const beastmasterSubclass: Subclass = {
  id: 'pf2e-ranger-beastmaster',
  name: 'Beast Master',
  parentClassId: 'ranger',
  description: 'A ranger who forms a powerful bond with a beast companion, fighting alongside it in battle.',
  features: [
    {
      level: 1,
      features: [
        {
          id: 'beast-companion',
          name: 'Beast Companion',
          source: 'Ranger 1',
          description: 'You gain a beast companion that fights alongside you in combat.',
        },
        {
          id: 'animal-bond',
          name: 'Animal Bond',
          source: 'Ranger 1',
          description: 'You share a special bond with your beast companion.',
        },
      ],
    },
    {
      level: 2,
      features: [
        {
          id: 'companion-enhancement',
          name: 'Companion Enhancement',
          source: 'Ranger 2',
          description: 'Your beast companion gains enhanced abilities.',
        },
      ],
    },
    {
      level: 3,
      features: [
        {
          id: 'beastmaster-feat',
          name: 'Beast Master Feat',
          source: 'Ranger 3',
          description: 'You gain a special feat related to your beast mastery abilities.',
        },
      ],
    },
    {
      level: 4,
      features: [
        {
          id: 'improved-companion',
          name: 'Improved Companion',
          source: 'Ranger 4',
          description: 'Your beast companion becomes stronger and more capable.',
        },
      ],
    },
    {
      level: 5,
      features: [
        {
          id: 'beastmaster-mastery',
          name: 'Beast Master Mastery',
          source: 'Ranger 5',
          description: 'You have mastered beast companionship. Your companion gains additional abilities.',
        },
      ],
    },
    {
      level: 6,
      features: [
        {
          id: 'advanced-beastmaster-feat',
          name: 'Advanced Beast Master Feat',
          source: 'Ranger 6',
          description: 'You gain an advanced feat related to your beast mastery abilities.',
        },
      ],
    },
    {
      level: 7,
      features: [
        {
          id: 'pack-tactics',
          name: 'Pack Tactics',
          source: 'Ranger 7',
          description: 'You and your companion gain bonuses when fighting together.',
        },
      ],
    },
    {
      level: 8,
      features: [
        {
          id: 'companion-strike',
          name: 'Companion Strike',
          source: 'Ranger 8',
          description: 'Your companion can now make additional attacks.',
        },
      ],
    },
    {
      level: 9,
      features: [
        {
          id: 'beastmaster-ultimate-feat',
          name: 'Ultimate Beast Master Feat',
          source: 'Ranger 9',
          description: 'You gain an ultimate feat that represents the pinnacle of your beast mastery abilities.',
        },
      ],
    },
    {
      level: 10,
      features: [
        {
          id: 'beastmaster-perfection',
          name: 'Beast Master Perfection',
          source: 'Ranger 10',
          description: 'You have perfected your beast mastery abilities.',
        },
      ],
    },
    {
      level: 11,
      features: [
        {
          id: 'master-beastmaster-feat',
          name: 'Master Beast Master Feat',
          source: 'Ranger 11',
          description: 'You gain a master-level feat related to your beast mastery abilities.',
        },
      ],
    },
    {
      level: 12,
      features: [
        {
          id: 'multiple-companions',
          name: 'Multiple Companions',
          source: 'Ranger 12',
          description: 'You can now have multiple beast companions.',
        },
      ],
    },
    {
      level: 13,
      features: [
        {
          id: 'beastmaster-supreme-feat',
          name: 'Supreme Beast Master Feat',
          source: 'Ranger 13',
          description: 'You gain a supreme feat that represents mastery of beast companionship.',
        },
      ],
    },
    {
      level: 14,
      features: [
        {
          id: 'immortal-companion',
          name: 'Immortal Companion',
          source: 'Ranger 14',
          description: 'Your beast companion is eternal and cannot be permanently harmed.',
        },
      ],
    },
    {
      level: 15,
      features: [
        {
          id: 'beastmaster-apex-feat',
          name: 'Apex Beast Master Feat',
          source: 'Ranger 15',
          description: 'You gain an apex feat that represents the ultimate expression of your beast mastery abilities.',
        },
      ],
    },
    {
      level: 16,
      features: [
        {
          id: 'god-of-beasts',
          name: 'God of Beasts',
          source: 'Ranger 16',
          description: 'You have become a god of beasts.',
        },
      ],
    },
    {
      level: 17,
      features: [
        {
          id: 'beastmaster-transcendent-feat',
          name: 'Transcendent Beast Master Feat',
          source: 'Ranger 17',
          description: 'You gain a transcendent feat that goes beyond normal beast mastery abilities.',
        },
      ],
    },
    {
      level: 18,
      features: [
        {
          id: 'perfect-companionship',
          name: 'Perfect Companionship',
          source: 'Ranger 18',
          description: 'Your bond with your companions is perfect.',
        },
      ],
    },
    {
      level: 19,
      features: [
        {
          id: 'beastmaster-ultimate-mastery-feat',
          name: 'Ultimate Mastery Feat',
          source: 'Ranger 19',
          description: 'You gain the ultimate mastery feat for your beast mastery abilities.',
        },
      ],
    },
    {
      level: 20,
      features: [
        {
          id: 'beastmaster-ascension',
          name: 'Beast Master Ascension',
          source: 'Ranger 20',
          description: 'You have ascended to the pinnacle of beast mastery.',
        },
      ],
    },
  ],
};
