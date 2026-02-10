import { Subclass } from '../../../../../types/character-options/classes';

// Pathfinder 2e Druid Wildfire Order Subclass
export const wildfireOrderSubclass: Subclass = {
  id: 'pf2e-druid-wildfire-order',
  name: 'Wildfire Order',
  parentClassId: 'druid',
  description: 'A druid devoted to the primal forces of fire and destruction, channeling the power of wildfires.',
  features: [
    {
      level: 1,
      features: [
        {
          id: 'wildfire-order-spells',
          name: 'Wildfire Order Spells',
          source: 'Druid 1',
          description: 'You gain order spells related to fire and destruction.',
        },
        {
          id: 'wildfire-blessing',
          name: 'Wildfire Blessing',
          source: 'Druid 1',
          description: 'You gain resistance to fire damage and your fire spells deal extra damage.',
        },
      ],
    },
    {
      level: 2,
      features: [
        {
          id: 'wildfire-form',
          name: 'Wildfire Form',
          source: 'Druid 2',
          description: 'You can assume a form wreathed in flames, gaining fire immunity and dealing fire damage with melee attacks.',
        },
      ],
    },
    {
      level: 3,
      features: [
        {
          id: 'wildfire-feat',
          name: 'Wildfire Feat',
          source: 'Druid 3',
          description: 'You gain a special feat related to your wildfire abilities.',
        },
      ],
    },
    {
      level: 4,
      features: [
        {
          id: 'improved-wildfire',
          name: 'Improved Wildfire',
          source: 'Druid 4',
          description: 'Your wildfire abilities become more powerful. Increase the damage of your fire spells.',
        },
      ],
    },
    {
      level: 5,
      features: [
        {
          id: 'wildfire-mastery',
          name: 'Wildfire Mastery',
          source: 'Druid 5',
          description: 'You have mastered wildfire magic. Your fire spells can now spread to nearby creatures.',
        },
      ],
    },
    {
      level: 6,
      features: [
        {
          id: 'advanced-wildfire-feat',
          name: 'Advanced Wildfire Feat',
          source: 'Druid 6',
          description: 'You gain an advanced feat related to your wildfire abilities.',
        },
      ],
    },
    {
      level: 7,
      features: [
        {
          id: 'inferno-form',
          name: 'Inferno Form',
          source: 'Druid 7',
          description: 'You can assume an inferno form, becoming a creature of pure fire.',
        },
      ],
    },
    {
      level: 8,
      features: [
        {
          id: 'wildfire-strike',
          name: 'Wildfire Strike',
          source: 'Druid 8',
          description: 'Your melee attacks can now ignite enemies in flames.',
        },
      ],
    },
    {
      level: 9,
      features: [
        {
          id: 'wildfire-ultimate-feat',
          name: 'Ultimate Wildfire Feat',
          source: 'Druid 9',
          description: 'You gain an ultimate feat that represents the pinnacle of your wildfire abilities.',
        },
      ],
    },
    {
      level: 10,
      features: [
        {
          id: 'wildfire-perfection',
          name: 'Wildfire Perfection',
          source: 'Druid 10',
          description: 'You have perfected your wildfire abilities. Your fire spells deal maximum damage.',
        },
      ],
    },
    {
      level: 11,
      features: [
        {
          id: 'master-wildfire-feat',
          name: 'Master Wildfire Feat',
          source: 'Druid 11',
          description: 'You gain a master-level feat related to your wildfire abilities.',
        },
      ],
    },
    {
      level: 12,
      features: [
        {
          id: 'cataclysmic-fire',
          name: 'Cataclysmic Fire',
          source: 'Druid 12',
          description: 'Your fire spells can now create cataclysmic explosions.',
        },
      ],
    },
    {
      level: 13,
      features: [
        {
          id: 'wildfire-supreme-feat',
          name: 'Supreme Wildfire Feat',
          source: 'Druid 13',
          description: 'You gain a supreme feat that represents mastery of wildfire.',
        },
      ],
    },
    {
      level: 14,
      features: [
        {
          id: 'immortal-wildfire',
          name: 'Immortal Wildfire',
          source: 'Druid 14',
          description: 'Your wildfire is eternal and cannot be extinguished.',
        },
      ],
    },
    {
      level: 15,
      features: [
        {
          id: 'wildfire-apex-feat',
          name: 'Apex Wildfire Feat',
          source: 'Druid 15',
          description: 'You gain an apex feat that represents the ultimate expression of your wildfire abilities.',
        },
      ],
    },
    {
      level: 16,
      features: [
        {
          id: 'god-of-wildfire',
          name: 'God of Wildfire',
          source: 'Druid 16',
          description: 'You have become a god of wildfire and destruction.',
        },
      ],
    },
    {
      level: 17,
      features: [
        {
          id: 'wildfire-transcendent-feat',
          name: 'Transcendent Wildfire Feat',
          source: 'Druid 17',
          description: 'You gain a transcendent feat that goes beyond normal wildfire abilities.',
        },
      ],
    },
    {
      level: 18,
      features: [
        {
          id: 'perfect-wildfire',
          name: 'Perfect Wildfire',
          source: 'Druid 18',
          description: 'Your wildfire is perfect and absolute.',
        },
      ],
    },
    {
      level: 19,
      features: [
        {
          id: 'wildfire-ultimate-mastery-feat',
          name: 'Ultimate Mastery Feat',
          source: 'Druid 19',
          description: 'You gain the ultimate mastery feat for your wildfire abilities.',
        },
      ],
    },
    {
      level: 20,
      features: [
        {
          id: 'wildfire-ascension',
          name: 'Wildfire Ascension',
          source: 'Druid 20',
          description: 'You have ascended to the pinnacle of wildfire mastery.',
        },
      ],
    },
  ],
};
