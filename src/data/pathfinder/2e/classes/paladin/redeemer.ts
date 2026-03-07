import { Subclass } from '../../../../../types/character-options/classes';

// Pathfinder 2e Paladin Redeemer Subclass
export const redeemerSubclass: Subclass = {
  id: 'pf2e-paladin-redeemer',
  name: 'Redeemer',
  parentClassId: 'paladin',
  description:
    'A paladin devoted to redemption and salvation, seeking to save even the most fallen souls.',
  features: [
    {
      level: 1,
      features: [
        {
          id: 'redeemer-oath',
          name: 'Redeemer Oath',
          source: 'Paladin 1',
          description: 'You take an oath to redeem the fallen and save lost souls.',
        },
        {
          id: 'redemption-aura',
          name: 'Redemption Aura',
          source: 'Paladin 1',
          description: 'You emit an aura of redemption that encourages allies to show mercy.',
        },
      ],
    },
    {
      level: 2,
      features: [
        {
          id: 'channel-divinity-redemption',
          name: 'Channel Divinity: Redemption',
          source: 'Paladin 2',
          description:
            'You can use your Channel Divinity to offer redemption to a creature, giving it a chance to change its ways.',
        },
      ],
    },
    {
      level: 3,
      features: [
        {
          id: 'redeemer-feat',
          name: 'Redeemer Feat',
          source: 'Paladin 3',
          description: 'You gain a special feat related to your redemption abilities.',
        },
      ],
    },
    {
      level: 4,
      features: [
        {
          id: 'improved-redemption',
          name: 'Improved Redemption',
          source: 'Paladin 4',
          description:
            'Your redemption becomes more effective. Increase the chance of redemption success.',
        },
      ],
    },
    {
      level: 5,
      features: [
        {
          id: 'redeemer-mastery',
          name: 'Redeemer Mastery',
          source: 'Paladin 5',
          description:
            'Your redemption abilities become more powerful. You can redeem multiple creatures.',
        },
      ],
    },
    {
      level: 6,
      features: [
        {
          id: 'advanced-redeemer-feat',
          name: 'Advanced Redeemer Feat',
          source: 'Paladin 6',
          description: 'You gain an advanced feat related to your redemption abilities.',
        },
      ],
    },
    {
      level: 7,
      features: [
        {
          id: 'salvation-aura',
          name: 'Salvation Aura',
          source: 'Paladin 7',
          description: 'Your aura now grants allies protection from evil influences.',
        },
      ],
    },
    {
      level: 8,
      features: [
        {
          id: 'redeemer-strike',
          name: 'Redeemer Strike',
          source: 'Paladin 8',
          description: 'Your melee attacks can now offer redemption to enemies.',
        },
      ],
    },
    {
      level: 9,
      features: [
        {
          id: 'redeemer-ultimate-feat',
          name: 'Ultimate Redeemer Feat',
          source: 'Paladin 9',
          description:
            'You gain an ultimate feat that represents the pinnacle of your redemption abilities.',
        },
      ],
    },
    {
      level: 10,
      features: [
        {
          id: 'redeemer-perfection',
          name: 'Redeemer Perfection',
          source: 'Paladin 10',
          description: 'You have perfected your redemption abilities.',
        },
      ],
    },
    {
      level: 11,
      features: [
        {
          id: 'master-redeemer-feat',
          name: 'Master Redeemer Feat',
          source: 'Paladin 11',
          description: 'You gain a master-level feat related to your redemption abilities.',
        },
      ],
    },
    {
      level: 12,
      features: [
        {
          id: 'mass-redemption',
          name: 'Mass Redemption',
          source: 'Paladin 12',
          description: 'Your redemption can now affect entire groups of creatures.',
        },
      ],
    },
    {
      level: 13,
      features: [
        {
          id: 'redeemer-supreme-feat',
          name: 'Supreme Redeemer Feat',
          source: 'Paladin 13',
          description: 'You gain a supreme feat that represents mastery of redemption.',
        },
      ],
    },
    {
      level: 14,
      features: [
        {
          id: 'immortal-redeemer',
          name: 'Immortal Redeemer',
          source: 'Paladin 14',
          description: 'Your redemption is eternal and cannot be undone.',
        },
      ],
    },
    {
      level: 15,
      features: [
        {
          id: 'redeemer-apex-feat',
          name: 'Apex Redeemer Feat',
          source: 'Paladin 15',
          description:
            'You gain an apex feat that represents the ultimate expression of your redemption abilities.',
        },
      ],
    },
    {
      level: 16,
      features: [
        {
          id: 'god-of-redemption',
          name: 'God of Redemption',
          source: 'Paladin 16',
          description: 'You have become a god of redemption.',
        },
      ],
    },
    {
      level: 17,
      features: [
        {
          id: 'redeemer-transcendent-feat',
          name: 'Transcendent Redeemer Feat',
          source: 'Paladin 17',
          description: 'You gain a transcendent feat that goes beyond normal redemption abilities.',
        },
      ],
    },
    {
      level: 18,
      features: [
        {
          id: 'perfect-redemption',
          name: 'Perfect Redemption',
          source: 'Paladin 18',
          description: 'Your redemption is perfect and absolute.',
        },
      ],
    },
    {
      level: 19,
      features: [
        {
          id: 'redeemer-ultimate-mastery-feat',
          name: 'Ultimate Mastery Feat',
          source: 'Paladin 19',
          description: 'You gain the ultimate mastery feat for your redemption abilities.',
        },
      ],
    },
    {
      level: 20,
      features: [
        {
          id: 'redeemer-ascension',
          name: 'Redeemer Ascension',
          source: 'Paladin 20',
          description: 'You have ascended to the pinnacle of redemption mastery.',
        },
      ],
    },
  ],
};
