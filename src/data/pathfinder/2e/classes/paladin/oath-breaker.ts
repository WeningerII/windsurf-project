import { Subclass } from '../../../../../types/character-options/classes';

// Pathfinder 2e Paladin Oath Breaker Subclass
export const oathBreakerSubclass: Subclass = {
  id: 'pf2e-paladin-oath-breaker',
  name: 'Oath Breaker',
  parentClassId: 'paladin',
  description:
    'A fallen paladin who has broken their oath and now wields dark power through their betrayal.',
  features: [
    {
      level: 1,
      features: [
        {
          id: 'oath-breaking',
          name: 'Oath Breaking',
          source: 'Paladin 1',
          description: 'You have broken your sacred oath and gained dark power from your betrayal.',
        },
        {
          id: 'dark-aura',
          name: 'Dark Aura',
          source: 'Paladin 1',
          description: 'You emit an aura of dark power that corrupts those around you.',
        },
      ],
    },
    {
      level: 2,
      features: [
        {
          id: 'channel-divinity-oath-breaker',
          name: 'Channel Divinity: Dark Power',
          source: 'Paladin 2',
          description: 'You can use your Channel Divinity to channel dark power.',
        },
      ],
    },
    {
      level: 3,
      features: [
        {
          id: 'oath-breaker-feat',
          name: 'Oath Breaker Feat',
          source: 'Paladin 3',
          description: 'You gain a special feat related to your oath breaker abilities.',
        },
      ],
    },
    {
      level: 4,
      features: [
        {
          id: 'dark-enhancement',
          name: 'Dark Enhancement',
          source: 'Paladin 4',
          description: 'Your dark power becomes more potent.',
        },
      ],
    },
    {
      level: 5,
      features: [
        {
          id: 'oath-breaker-mastery',
          name: 'Oath Breaker Mastery',
          source: 'Paladin 5',
          description: 'Your oath breaking power becomes more powerful.',
        },
      ],
    },
    {
      level: 6,
      features: [
        {
          id: 'advanced-oath-breaker-feat',
          name: 'Advanced Oath Breaker Feat',
          source: 'Paladin 6',
          description: 'You gain an advanced feat related to your oath breaker abilities.',
        },
      ],
    },
    {
      level: 7,
      features: [
        {
          id: 'dark-form',
          name: 'Dark Form',
          source: 'Paladin 7',
          description: 'You can assume a form of pure dark power.',
        },
      ],
    },
    {
      level: 8,
      features: [
        {
          id: 'oath-breaker-strike',
          name: 'Oath Breaker Strike',
          source: 'Paladin 8',
          description: 'Your attacks can now corrupt enemies.',
        },
      ],
    },
    {
      level: 9,
      features: [
        {
          id: 'oath-breaker-ultimate-feat',
          name: 'Ultimate Oath Breaker Feat',
          source: 'Paladin 9',
          description:
            'You gain an ultimate feat that represents the pinnacle of your oath breaker abilities.',
        },
      ],
    },
    {
      level: 10,
      features: [
        {
          id: 'oath-breaker-perfection',
          name: 'Oath Breaker Perfection',
          source: 'Paladin 10',
          description: 'You have perfected your oath breaker abilities.',
        },
      ],
    },
    {
      level: 11,
      features: [
        {
          id: 'master-oath-breaker-feat',
          name: 'Master Oath Breaker Feat',
          source: 'Paladin 11',
          description: 'You gain a master-level feat related to your oath breaker abilities.',
        },
      ],
    },
    {
      level: 12,
      features: [
        {
          id: 'mass-corruption',
          name: 'Mass Corruption',
          source: 'Paladin 12',
          description: 'Your dark power can corrupt multiple creatures.',
        },
      ],
    },
    {
      level: 13,
      features: [
        {
          id: 'oath-breaker-supreme-feat',
          name: 'Supreme Oath Breaker Feat',
          source: 'Paladin 13',
          description: 'You gain a supreme feat that represents mastery of oath breaking.',
        },
      ],
    },
    {
      level: 14,
      features: [
        {
          id: 'immortal-oath-breaker',
          name: 'Immortal Oath Breaker',
          source: 'Paladin 14',
          description: 'Your oath breaking power is eternal.',
        },
      ],
    },
    {
      level: 15,
      features: [
        {
          id: 'oath-breaker-apex-feat',
          name: 'Apex Oath Breaker Feat',
          source: 'Paladin 15',
          description:
            'You gain an apex feat that represents the ultimate expression of your oath breaker abilities.',
        },
      ],
    },
    {
      level: 16,
      features: [
        {
          id: 'god-of-betrayal',
          name: 'God of Betrayal',
          source: 'Paladin 16',
          description: 'You have become a god of betrayal.',
        },
      ],
    },
    {
      level: 17,
      features: [
        {
          id: 'oath-breaker-transcendent-feat',
          name: 'Transcendent Oath Breaker Feat',
          source: 'Paladin 17',
          description:
            'You gain a transcendent feat that goes beyond normal oath breaker abilities.',
        },
      ],
    },
    {
      level: 18,
      features: [
        {
          id: 'perfect-oath-breaking',
          name: 'Perfect Oath Breaking',
          source: 'Paladin 18',
          description: 'Your oath breaking is perfect and absolute.',
        },
      ],
    },
    {
      level: 19,
      features: [
        {
          id: 'oath-breaker-ultimate-mastery-feat',
          name: 'Ultimate Mastery Feat',
          source: 'Paladin 19',
          description: 'You gain the ultimate mastery feat for your oath breaker abilities.',
        },
      ],
    },
    {
      level: 20,
      features: [
        {
          id: 'oath-breaker-ascension',
          name: 'Oath Breaker Ascension',
          source: 'Paladin 20',
          description: 'You have ascended to the pinnacle of oath breaker mastery.',
        },
      ],
    },
  ],
};
