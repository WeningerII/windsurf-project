import { Subclass } from '../../../../../types/character-options/classes';

// Pathfinder 2e Wizard Enchanter Subclass
export const enchanterSubclass: Subclass = {
  id: 'pf2e-wizard-enchanter',
  name: 'Enchanter',
  parentClassId: 'wizard',
  description: 'A specialist in enchantment magic who controls minds and influences the wills of others.',
  features: [
    {
      level: 1,
      features: [
        {
          id: 'enchantment-focus',
          name: 'Enchantment Focus',
          source: 'Wizard 1',
          description: 'You specialize in enchantment magic. You gain a +1 circumstance bonus to spell attack rolls and spell save DCs for enchantment spells.',
        },
        {
          id: 'enchantment-spells',
          name: 'Enchantment Spells',
          source: 'Wizard 1',
          description: 'You gain access to a wider selection of enchantment spells.',
        },
      ],
    },
    {
      level: 2,
      features: [
        {
          id: 'charm-mastery',
          name: 'Charm Mastery',
          source: 'Wizard 2',
          description: 'Your charm spells are more effective. Creatures affected by your charm spells have disadvantage on saving throws against them.',
        },
      ],
    },
    {
      level: 3,
      features: [
        {
          id: 'enchanter-feat',
          name: 'Enchanter Feat',
          source: 'Wizard 3',
          description: 'You gain a special feat related to your enchantment abilities.',
        },
      ],
    },
    {
      level: 4,
      features: [
        {
          id: 'mind-control',
          name: 'Mind Control',
          source: 'Wizard 4',
          description: 'You can now use enchantment magic to influence minds more directly.',
        },
      ],
    },
    {
      level: 5,
      features: [
        {
          id: 'enchantment-mastery',
          name: 'Enchantment Mastery',
          source: 'Wizard 5',
          description: 'Your enchantment magic becomes more potent. Increase the bonus to spell attack rolls and spell save DCs to +2.',
        },
      ],
    },
    {
      level: 6,
      features: [
        {
          id: 'advanced-enchanter-feat',
          name: 'Advanced Enchanter Feat',
          source: 'Wizard 6',
          description: 'You gain an advanced feat related to your enchantment abilities.',
        },
      ],
    },
    {
      level: 7,
      features: [
        {
          id: 'suggestion-mastery',
          name: 'Suggestion Mastery',
          source: 'Wizard 7',
          description: 'Your suggestion spells are nearly impossible to resist.',
        },
      ],
    },
    {
      level: 8,
      features: [
        {
          id: 'domination',
          name: 'Domination',
          source: 'Wizard 8',
          description: 'You can now dominate the minds of others with your enchantment magic.',
        },
      ],
    },
    {
      level: 9,
      features: [
        {
          id: 'enchanter-ultimate-feat',
          name: 'Ultimate Enchanter Feat',
          source: 'Wizard 9',
          description: 'You gain an ultimate feat that represents the pinnacle of your enchantment abilities.',
        },
      ],
    },
    {
      level: 10,
      features: [
        {
          id: 'enchantment-perfection',
          name: 'Enchantment Perfection',
          source: 'Wizard 10',
          description: 'You have perfected your enchantment abilities. Increase the bonus to spell attack rolls and spell save DCs to +3.',
        },
      ],
    },
    {
      level: 11,
      features: [
        {
          id: 'master-enchanter-feat',
          name: 'Master Enchanter Feat',
          source: 'Wizard 11',
          description: 'You gain a master-level feat related to your enchantment abilities.',
        },
      ],
    },
    {
      level: 12,
      features: [
        {
          id: 'mass-enchantment',
          name: 'Mass Enchantment',
          source: 'Wizard 12',
          description: 'Your enchantment spells can now affect multiple targets simultaneously.',
        },
      ],
    },
    {
      level: 13,
      features: [
        {
          id: 'enchanter-supreme-feat',
          name: 'Supreme Enchanter Feat',
          source: 'Wizard 13',
          description: 'You gain a supreme feat that represents mastery of enchantment.',
        },
      ],
    },
    {
      level: 14,
      features: [
        {
          id: 'irresistible-enchantment',
          name: 'Irresistible Enchantment',
          source: 'Wizard 14',
          description: 'Your enchantment magic is nearly impossible to resist. Increase the bonus to spell save DCs to +4.',
        },
      ],
    },
    {
      level: 15,
      features: [
        {
          id: 'enchanter-apex-feat',
          name: 'Apex Enchanter Feat',
          source: 'Wizard 15',
          description: 'You gain an apex feat that represents the ultimate expression of your enchantment abilities.',
        },
      ],
    },
    {
      level: 16,
      features: [
        {
          id: 'mind-master',
          name: 'Mind Master',
          source: 'Wizard 16',
          description: 'You have become a master of minds. You can control multiple minds simultaneously.',
        },
      ],
    },
    {
      level: 17,
      features: [
        {
          id: 'enchanter-transcendent-feat',
          name: 'Transcendent Enchanter Feat',
          source: 'Wizard 17',
          description: 'You gain a transcendent feat that goes beyond normal enchantment abilities.',
        },
      ],
    },
    {
      level: 18,
      features: [
        {
          id: 'perfect-enchantment',
          name: 'Perfect Enchantment',
          source: 'Wizard 18',
          description: 'Your enchantment magic is perfect. Increase the bonus to spell save DCs to +5.',
        },
      ],
    },
    {
      level: 19,
      features: [
        {
          id: 'enchanter-ultimate-mastery-feat',
          name: 'Ultimate Mastery Feat',
          source: 'Wizard 19',
          description: 'You gain the ultimate mastery feat for your enchantment abilities.',
        },
      ],
    },
    {
      level: 20,
      features: [
        {
          id: 'enchanter-ascension',
          name: 'Enchanter Ascension',
          source: 'Wizard 20',
          description: 'You have ascended to the pinnacle of enchantment mastery. You gain all benefits of your enchantment abilities at their maximum potency.',
        },
      ],
    },
  ],
};
