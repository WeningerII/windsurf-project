import { Subclass } from '../../../../../types/character-options/classes';

// Pathfinder 2e Cleric Healing Domain Subclass
export const healingDomainSubclass: Subclass = {
  id: 'pf2e-cleric-healing-domain',
  name: 'Healing Domain',
  parentClassId: 'cleric',
  description: 'A cleric devoted to healing and restoration who mends the wounds of allies.',
  features: [
    {
      level: 1,
      features: [
        {
          id: 'healing-domain-spells',
          name: 'Healing Domain Spells',
          source: 'Cleric 1',
          description: 'You gain domain spells related to healing and restoration.',
        },
        {
          id: 'healing-touch',
          name: 'Healing Touch',
          source: 'Cleric 1',
          description: 'You can heal allies through touch.',
        },
      ],
    },
    {
      level: 2,
      features: [
        {
          id: 'channel-divinity-healing',
          name: 'Channel Divinity: Healing',
          source: 'Cleric 2',
          description: 'You can use your Channel Divinity to heal allies.',
        },
      ],
    },
    {
      level: 3,
      features: [
        {
          id: 'healing-domain-feat',
          name: 'Healing Domain Feat',
          source: 'Cleric 3',
          description: 'You gain a special feat related to your healing abilities.',
        },
      ],
    },
    {
      level: 4,
      features: [
        {
          id: 'healing-enhancement',
          name: 'Healing Enhancement',
          source: 'Cleric 4',
          description: 'Your healing becomes more potent.',
        },
      ],
    },
    {
      level: 5,
      features: [
        {
          id: 'healing-domain-mastery',
          name: 'Healing Domain Mastery',
          source: 'Cleric 5',
          description: 'Your healing magic becomes more powerful.',
        },
      ],
    },
    {
      level: 6,
      features: [
        {
          id: 'advanced-healing-domain-feat',
          name: 'Advanced Healing Domain Feat',
          source: 'Cleric 6',
          description: 'You gain an advanced feat related to your healing abilities.',
        },
      ],
    },
    {
      level: 7,
      features: [
        {
          id: 'mass-healing',
          name: 'Mass Healing',
          source: 'Cleric 7',
          description: 'You can heal multiple allies at once.',
        },
      ],
    },
    {
      level: 8,
      features: [
        {
          id: 'healing-strike',
          name: 'Healing Strike',
          source: 'Cleric 8',
          description: 'Your attacks can now heal allies.',
        },
      ],
    },
    {
      level: 9,
      features: [
        {
          id: 'healing-domain-ultimate-feat',
          name: 'Ultimate Healing Domain Feat',
          source: 'Cleric 9',
          description:
            'You gain an ultimate feat that represents the pinnacle of your healing abilities.',
        },
      ],
    },
    {
      level: 10,
      features: [
        {
          id: 'healing-domain-perfection',
          name: 'Healing Domain Perfection',
          source: 'Cleric 10',
          description: 'You have perfected your healing abilities.',
        },
      ],
    },
    {
      level: 11,
      features: [
        {
          id: 'master-healing-domain-feat',
          name: 'Master Healing Domain Feat',
          source: 'Cleric 11',
          description: 'You gain a master-level feat related to your healing abilities.',
        },
      ],
    },
    {
      level: 12,
      features: [
        {
          id: 'resurrection-healing',
          name: 'Resurrection Healing',
          source: 'Cleric 12',
          description: 'You can bring fallen allies back from the brink of death.',
        },
      ],
    },
    {
      level: 13,
      features: [
        {
          id: 'healing-domain-supreme-feat',
          name: 'Supreme Healing Domain Feat',
          source: 'Cleric 13',
          description: 'You gain a supreme feat that represents mastery of healing.',
        },
      ],
    },
    {
      level: 14,
      features: [
        {
          id: 'immortal-healing',
          name: 'Immortal Healing',
          source: 'Cleric 14',
          description: 'Your healing is eternal and cannot be undone.',
        },
      ],
    },
    {
      level: 15,
      features: [
        {
          id: 'healing-domain-apex-feat',
          name: 'Apex Healing Domain Feat',
          source: 'Cleric 15',
          description:
            'You gain an apex feat that represents the ultimate expression of your healing abilities.',
        },
      ],
    },
    {
      level: 16,
      features: [
        {
          id: 'god-of-healing',
          name: 'God of Healing',
          source: 'Cleric 16',
          description: 'You have become a god of healing.',
        },
      ],
    },
    {
      level: 17,
      features: [
        {
          id: 'healing-domain-transcendent-feat',
          name: 'Transcendent Healing Domain Feat',
          source: 'Cleric 17',
          description: 'You gain a transcendent feat that goes beyond normal healing abilities.',
        },
      ],
    },
    {
      level: 18,
      features: [
        {
          id: 'perfect-healing',
          name: 'Perfect Healing',
          source: 'Cleric 18',
          description: 'Your healing is perfect and absolute.',
        },
      ],
    },
    {
      level: 19,
      features: [
        {
          id: 'healing-domain-ultimate-mastery-feat',
          name: 'Ultimate Mastery Feat',
          source: 'Cleric 19',
          description: 'You gain the ultimate mastery feat for your healing abilities.',
        },
      ],
    },
    {
      level: 20,
      features: [
        {
          id: 'healing-domain-ascension',
          name: 'Healing Domain Ascension',
          source: 'Cleric 20',
          description: 'You have ascended to the pinnacle of healing mastery.',
        },
      ],
    },
  ],
};
