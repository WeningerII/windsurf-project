import { Subclass } from '../../../../../types/character-options/classes';

// Pathfinder 2e Wizard Abjurer Subclass
export const abjurerSubclass: Subclass = {
  id: 'pf2e-wizard-abjurer',
  name: 'Abjurer',
  parentClassId: 'wizard',
  description:
    'A wizard who specializes in abjuration magic, protecting allies and banishing threats.',
  features: [
    {
      level: 1,
      features: [
        {
          id: 'abjuration-focus',
          name: 'Abjuration Focus',
          source: 'Wizard 1',
          description:
            'You specialize in abjuration magic. You gain a +1 bonus to spell save DCs for abjuration spells.',
        },
        {
          id: 'abjuration-spells',
          name: 'Abjuration Spells',
          source: 'Wizard 1',
          description: 'You gain access to a wider selection of abjuration spells.',
        },
      ],
    },
    {
      level: 2,
      features: [
        {
          id: 'protective-ward',
          name: 'Protective Ward',
          source: 'Wizard 2',
          description: 'You can create protective wards around yourself and allies.',
        },
      ],
    },
    {
      level: 3,
      features: [
        {
          id: 'abjurer-feat',
          name: 'Abjurer Feat',
          source: 'Wizard 3',
          description: 'You gain a special feat related to your abjuration abilities.',
        },
      ],
    },
    {
      level: 4,
      features: [
        {
          id: 'improved-abjuration',
          name: 'Improved Abjuration',
          source: 'Wizard 4',
          description:
            'Your abjuration spells become more effective. Increase the bonus to spell save DCs to +2.',
        },
      ],
    },
    {
      level: 5,
      features: [
        {
          id: 'abjurer-mastery',
          name: 'Abjurer Mastery',
          source: 'Wizard 5',
          description:
            'Your abjuration magic becomes more potent. Your protective wards become stronger.',
        },
      ],
    },
    {
      level: 6,
      features: [
        {
          id: 'advanced-abjurer-feat',
          name: 'Advanced Abjurer Feat',
          source: 'Wizard 6',
          description: 'You gain an advanced feat related to your abjuration abilities.',
        },
      ],
    },
    {
      level: 7,
      features: [
        {
          id: 'banishment-mastery',
          name: 'Banishment Mastery',
          source: 'Wizard 7',
          description: 'Your banishment spells are nearly impossible to resist.',
        },
      ],
    },
    {
      level: 8,
      features: [
        {
          id: 'abjuration-strike',
          name: 'Abjuration Strike',
          source: 'Wizard 8',
          description: 'Your attacks can now apply abjuration effects.',
        },
      ],
    },
    {
      level: 9,
      features: [
        {
          id: 'abjurer-ultimate-feat',
          name: 'Ultimate Abjurer Feat',
          source: 'Wizard 9',
          description:
            'You gain an ultimate feat that represents the pinnacle of your abjuration abilities.',
        },
      ],
    },
    {
      level: 10,
      features: [
        {
          id: 'abjurer-perfection',
          name: 'Abjurer Perfection',
          source: 'Wizard 10',
          description:
            'You have perfected your abjuration abilities. Increase the bonus to spell save DCs to +3.',
        },
      ],
    },
    {
      level: 11,
      features: [
        {
          id: 'master-abjurer-feat',
          name: 'Master Abjurer Feat',
          source: 'Wizard 11',
          description: 'You gain a master-level feat related to your abjuration abilities.',
        },
      ],
    },
    {
      level: 12,
      features: [
        {
          id: 'mass-protection',
          name: 'Mass Protection',
          source: 'Wizard 12',
          description: 'Your protective wards can now affect multiple creatures.',
        },
      ],
    },
    {
      level: 13,
      features: [
        {
          id: 'abjurer-supreme-feat',
          name: 'Supreme Abjurer Feat',
          source: 'Wizard 13',
          description: 'You gain a supreme feat that represents mastery of abjuration.',
        },
      ],
    },
    {
      level: 14,
      features: [
        {
          id: 'immortal-abjurer',
          name: 'Immortal Abjurer',
          source: 'Wizard 14',
          description: 'Your abjuration magic is eternal and cannot be dispelled.',
        },
      ],
    },
    {
      level: 15,
      features: [
        {
          id: 'abjurer-apex-feat',
          name: 'Apex Abjurer Feat',
          source: 'Wizard 15',
          description:
            'You gain an apex feat that represents the ultimate expression of your abjuration abilities.',
        },
      ],
    },
    {
      level: 16,
      features: [
        {
          id: 'god-of-protection',
          name: 'God of Protection',
          source: 'Wizard 16',
          description: 'You have become a god of protection.',
        },
      ],
    },
    {
      level: 17,
      features: [
        {
          id: 'abjurer-transcendent-feat',
          name: 'Transcendent Abjurer Feat',
          source: 'Wizard 17',
          description: 'You gain a transcendent feat that goes beyond normal abjuration abilities.',
        },
      ],
    },
    {
      level: 18,
      features: [
        {
          id: 'perfect-abjuration',
          name: 'Perfect Abjuration',
          source: 'Wizard 18',
          description: 'Your abjuration magic is perfect and absolute.',
        },
      ],
    },
    {
      level: 19,
      features: [
        {
          id: 'abjurer-ultimate-mastery-feat',
          name: 'Ultimate Mastery Feat',
          source: 'Wizard 19',
          description: 'You gain the ultimate mastery feat for your abjuration abilities.',
        },
      ],
    },
    {
      level: 20,
      features: [
        {
          id: 'abjurer-ascension',
          name: 'Abjurer Ascension',
          source: 'Wizard 20',
          description: 'You have ascended to the pinnacle of abjuration mastery.',
        },
      ],
    },
  ],
};
