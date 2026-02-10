import { Subclass } from '../../../../../types/character-options/classes';

// Pathfinder 2e Druid Animal Order Subclass
export const animalOrderSubclass: Subclass = {
  id: 'pf2e-druid-animal-order',
  name: 'Animal Order',
  parentClassId: 'druid',
  description: 'A druid devoted to the animal kingdom who gains the ability to transform into animals and command beasts.',
  features: [
    {
      level: 1,
      features: [
        {
          id: 'animal-order-spells',
          name: 'Animal Order Spells',
          source: 'Druid 1',
          description: 'You gain order spells related to animals and beasts.',
        },
        {
          id: 'animal-companion',
          name: 'Animal Companion',
          source: 'Druid 1',
          description: 'You gain an animal companion that fights alongside you.',
        },
      ],
    },
    {
      level: 2,
      features: [
        {
          id: 'wild-shape-animal',
          name: 'Wild Shape: Animal',
          source: 'Druid 2',
          description: 'You can transform into an animal form.',
        },
      ],
    },
    {
      level: 3,
      features: [
        {
          id: 'animal-order-feat',
          name: 'Animal Order Feat',
          source: 'Druid 3',
          description: 'You gain a special feat related to your animal order abilities.',
        },
      ],
    },
    {
      level: 4,
      features: [
        {
          id: 'animal-enhancement',
          name: 'Animal Enhancement',
          source: 'Druid 4',
          description: 'Your animal abilities become more powerful.',
        },
      ],
    },
    {
      level: 5,
      features: [
        {
          id: 'animal-order-mastery',
          name: 'Animal Order Mastery',
          source: 'Druid 5',
          description: 'Your animal magic becomes more potent.',
        },
      ],
    },
    {
      level: 6,
      features: [
        {
          id: 'advanced-animal-order-feat',
          name: 'Advanced Animal Order Feat',
          source: 'Druid 6',
          description: 'You gain an advanced feat related to your animal order abilities.',
        },
      ],
    },
    {
      level: 7,
      features: [
        {
          id: 'pack-tactics',
          name: 'Pack Tactics',
          source: 'Druid 7',
          description: 'You and your animal companion gain bonuses when fighting together.',
        },
      ],
    },
    {
      level: 8,
      features: [
        {
          id: 'animal-strike',
          name: 'Animal Strike',
          source: 'Druid 8',
          description: 'Your attacks can now apply animal effects.',
        },
      ],
    },
    {
      level: 9,
      features: [
        {
          id: 'animal-order-ultimate-feat',
          name: 'Ultimate Animal Order Feat',
          source: 'Druid 9',
          description: 'You gain an ultimate feat that represents the pinnacle of your animal order abilities.',
        },
      ],
    },
    {
      level: 10,
      features: [
        {
          id: 'animal-order-perfection',
          name: 'Animal Order Perfection',
          source: 'Druid 10',
          description: 'You have perfected your animal order abilities.',
        },
      ],
    },
    {
      level: 11,
      features: [
        {
          id: 'master-animal-order-feat',
          name: 'Master Animal Order Feat',
          source: 'Druid 11',
          description: 'You gain a master-level feat related to your animal order abilities.',
        },
      ],
    },
    {
      level: 12,
      features: [
        {
          id: 'multiple-companions',
          name: 'Multiple Companions',
          source: 'Druid 12',
          description: 'You can now have multiple animal companions.',
        },
      ],
    },
    {
      level: 13,
      features: [
        {
          id: 'animal-order-supreme-feat',
          name: 'Supreme Animal Order Feat',
          source: 'Druid 13',
          description: 'You gain a supreme feat that represents mastery of animal order.',
        },
      ],
    },
    {
      level: 14,
      features: [
        {
          id: 'immortal-animals',
          name: 'Immortal Animals',
          source: 'Druid 14',
          description: 'Your animal companions are eternal.',
        },
      ],
    },
    {
      level: 15,
      features: [
        {
          id: 'animal-order-apex-feat',
          name: 'Apex Animal Order Feat',
          source: 'Druid 15',
          description: 'You gain an apex feat that represents the ultimate expression of your animal order abilities.',
        },
      ],
    },
    {
      level: 16,
      features: [
        {
          id: 'god-of-animals',
          name: 'God of Animals',
          source: 'Druid 16',
          description: 'You have become a god of animals.',
        },
      ],
    },
    {
      level: 17,
      features: [
        {
          id: 'animal-order-transcendent-feat',
          name: 'Transcendent Animal Order Feat',
          source: 'Druid 17',
          description: 'You gain a transcendent feat that goes beyond normal animal order abilities.',
        },
      ],
    },
    {
      level: 18,
      features: [
        {
          id: 'perfect-animal-order',
          name: 'Perfect Animal Order',
          source: 'Druid 18',
          description: 'Your animal order is perfect and absolute.',
        },
      ],
    },
    {
      level: 19,
      features: [
        {
          id: 'animal-order-ultimate-mastery-feat',
          name: 'Ultimate Mastery Feat',
          source: 'Druid 19',
          description: 'You gain the ultimate mastery feat for your animal order abilities.',
        },
      ],
    },
    {
      level: 20,
      features: [
        {
          id: 'animal-order-ascension',
          name: 'Animal Order Ascension',
          source: 'Druid 20',
          description: 'You have ascended to the pinnacle of animal order mastery.',
        },
      ],
    },
  ],
};
