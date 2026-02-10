import { Subclass } from '../../../../../types/character-options/classes';

// Pathfinder 2e Sorcerer Draconic Bloodline Subclass
export const dragonicBloodlineSubclass: Subclass = {
  id: 'pf2e-sorcerer-draconic-bloodline',
  name: 'Draconic Bloodline',
  parentClassId: 'sorcerer',
  description: 'A sorcerer with draconic heritage who wields dragon magic and gains draconic abilities.',
  features: [
    {
      level: 1,
      features: [
        {
          id: 'draconic-bloodline-spells',
          name: 'Draconic Bloodline Spells',
          source: 'Sorcerer 1',
          description: 'You gain bloodline spells related to dragons and draconic magic.',
        },
        {
          id: 'draconic-resilience',
          name: 'Draconic Resilience',
          source: 'Sorcerer 1',
          description: 'You gain resistance to one type of elemental damage based on your dragon ancestry.',
        },
      ],
    },
    {
      level: 2,
      features: [
        {
          id: 'draconic-presence',
          name: 'Draconic Presence',
          source: 'Sorcerer 2',
          description: 'You gain an aura of draconic power that intimidates enemies.',
        },
      ],
    },
    {
      level: 3,
      features: [
        {
          id: 'draconic-feat',
          name: 'Draconic Feat',
          source: 'Sorcerer 3',
          description: 'You gain a special feat related to your draconic abilities.',
        },
      ],
    },
    {
      level: 4,
      features: [
        {
          id: 'draconic-wings',
          name: 'Draconic Wings',
          source: 'Sorcerer 4',
          description: 'You grow draconic wings and gain a flying speed.',
        },
      ],
    },
    {
      level: 5,
      features: [
        {
          id: 'draconic-mastery',
          name: 'Draconic Mastery',
          source: 'Sorcerer 5',
          description: 'Your draconic magic becomes more powerful. Your spells deal extra damage.',
        },
      ],
    },
    {
      level: 6,
      features: [
        {
          id: 'advanced-draconic-feat',
          name: 'Advanced Draconic Feat',
          source: 'Sorcerer 6',
          description: 'You gain an advanced feat related to your draconic abilities.',
        },
      ],
    },
    {
      level: 7,
      features: [
        {
          id: 'draconic-form',
          name: 'Draconic Form',
          source: 'Sorcerer 7',
          description: 'You can assume a draconic form, gaining draconic traits.',
        },
      ],
    },
    {
      level: 8,
      features: [
        {
          id: 'draconic-strike',
          source: 'Sorcerer 8',
          name: 'Draconic Strike',
          description: 'Your melee attacks can now deal draconic damage.',
        },
      ],
    },
    {
      level: 9,
      features: [
        {
          id: 'draconic-ultimate-feat',
          name: 'Ultimate Draconic Feat',
          source: 'Sorcerer 9',
          description: 'You gain an ultimate feat that represents the pinnacle of your draconic abilities.',
        },
      ],
    },
    {
      level: 10,
      features: [
        {
          id: 'draconic-perfection',
          name: 'Draconic Perfection',
          source: 'Sorcerer 10',
          description: 'You have perfected your draconic abilities.',
        },
      ],
    },
    {
      level: 11,
      features: [
        {
          id: 'master-draconic-feat',
          name: 'Master Draconic Feat',
          source: 'Sorcerer 11',
          description: 'You gain a master-level feat related to your draconic abilities.',
        },
      ],
    },
    {
      level: 12,
      features: [
        {
          id: 'dragon-breath',
          name: 'Dragon Breath',
          source: 'Sorcerer 12',
          description: 'You can breathe draconic energy as a weapon.',
        },
      ],
    },
    {
      level: 13,
      features: [
        {
          id: 'draconic-supreme-feat',
          name: 'Supreme Draconic Feat',
          source: 'Sorcerer 13',
          description: 'You gain a supreme feat that represents mastery of draconic magic.',
        },
      ],
    },
    {
      level: 14,
      features: [
        {
          id: 'immortal-dragon',
          name: 'Immortal Dragon',
          source: 'Sorcerer 14',
          description: 'Your draconic form is eternal and cannot be harmed.',
        },
      ],
    },
    {
      level: 15,
      features: [
        {
          id: 'draconic-apex-feat',
          name: 'Apex Draconic Feat',
          source: 'Sorcerer 15',
          description: 'You gain an apex feat that represents the ultimate expression of your draconic abilities.',
        },
      ],
    },
    {
      level: 16,
      features: [
        {
          id: 'god-of-dragons',
          name: 'God of Dragons',
          source: 'Sorcerer 16',
          description: 'You have become a god of dragons.',
        },
      ],
    },
    {
      level: 17,
      features: [
        {
          id: 'draconic-transcendent-feat',
          name: 'Transcendent Draconic Feat',
          source: 'Sorcerer 17',
          description: 'You gain a transcendent feat that goes beyond normal draconic abilities.',
        },
      ],
    },
    {
      level: 18,
      features: [
        {
          id: 'perfect-draconic',
          name: 'Perfect Draconic',
          source: 'Sorcerer 18',
          description: 'Your draconic power is perfect and absolute.',
        },
      ],
    },
    {
      level: 19,
      features: [
        {
          id: 'draconic-ultimate-mastery-feat',
          name: 'Ultimate Mastery Feat',
          source: 'Sorcerer 19',
          description: 'You gain the ultimate mastery feat for your draconic abilities.',
        },
      ],
    },
    {
      level: 20,
      features: [
        {
          id: 'draconic-ascension',
          name: 'Draconic Ascension',
          source: 'Sorcerer 20',
          description: 'You have ascended to the pinnacle of draconic mastery.',
        },
      ],
    },
  ],
};
