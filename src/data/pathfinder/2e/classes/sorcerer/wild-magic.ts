import { Subclass } from '../../../../../types/character-options/classes';

// Pathfinder 2e Sorcerer Wild Magic Subclass
export const wildMagicSubclass: Subclass = {
  id: 'pf2e-sorcerer-wild-magic',
  name: 'Wild Magic',
  parentClassId: 'sorcerer',
  description: 'A sorcerer whose magic is chaotic and unpredictable, channeling the raw forces of wild magic.',
  features: [
    {
      level: 1,
      features: [
        {
          id: 'wild-magic-surge',
          name: 'Wild Magic Surge',
          source: 'Sorcerer 1',
          description: 'Your spells can trigger unpredictable magical effects.',
        },
        {
          id: 'chaotic-casting',
          name: 'Chaotic Casting',
          source: 'Sorcerer 1',
          description: 'Your spells gain unpredictable properties.',
        },
      ],
    },
    {
      level: 2,
      features: [
        {
          id: 'wild-magic-enhancement',
          name: 'Wild Magic Enhancement',
          source: 'Sorcerer 2',
          description: 'Your wild magic becomes more powerful.',
        },
      ],
    },
    {
      level: 3,
      features: [
        {
          id: 'wild-magic-feat',
          name: 'Wild Magic Feat',
          source: 'Sorcerer 3',
          description: 'You gain a special feat related to your wild magic abilities.',
        },
      ],
    },
    {
      level: 4,
      features: [
        {
          id: 'surge-control',
          name: 'Surge Control',
          source: 'Sorcerer 4',
          description: 'You gain some control over your wild magic surges.',
        },
      ],
    },
    {
      level: 5,
      features: [
        {
          id: 'wild-magic-mastery',
          name: 'Wild Magic Mastery',
          source: 'Sorcerer 5',
          description: 'You have mastered wild magic. Your surges become more predictable.',
        },
      ],
    },
    {
      level: 6,
      features: [
        {
          id: 'advanced-wild-magic-feat',
          name: 'Advanced Wild Magic Feat',
          source: 'Sorcerer 6',
          description: 'You gain an advanced feat related to your wild magic abilities.',
        },
      ],
    },
    {
      level: 7,
      features: [
        {
          id: 'wild-magic-form',
          name: 'Wild Magic Form',
          source: 'Sorcerer 7',
          description: 'You can assume a form of pure wild magic.',
        },
      ],
    },
    {
      level: 8,
      features: [
        {
          id: 'wild-magic-strike',
          source: 'Sorcerer 8',
          name: 'Wild Magic Strike',
          description: 'Your attacks can now trigger wild magic effects.',
        },
      ],
    },
    {
      level: 9,
      features: [
        {
          id: 'wild-magic-ultimate-feat',
          name: 'Ultimate Wild Magic Feat',
          source: 'Sorcerer 9',
          description: 'You gain an ultimate feat that represents the pinnacle of your wild magic abilities.',
        },
      ],
    },
    {
      level: 10,
      features: [
        {
          id: 'wild-magic-perfection',
          name: 'Wild Magic Perfection',
          source: 'Sorcerer 10',
          description: 'You have perfected your wild magic abilities.',
        },
      ],
    },
    {
      level: 11,
      features: [
        {
          id: 'master-wild-magic-feat',
          name: 'Master Wild Magic Feat',
          source: 'Sorcerer 11',
          description: 'You gain a master-level feat related to your wild magic abilities.',
        },
      ],
    },
    {
      level: 12,
      features: [
        {
          id: 'wild-magic-cascade',
          name: 'Wild Magic Cascade',
          source: 'Sorcerer 12',
          description: 'Your wild magic surges can cascade into each other.',
        },
      ],
    },
    {
      level: 13,
      features: [
        {
          id: 'wild-magic-supreme-feat',
          name: 'Supreme Wild Magic Feat',
          source: 'Sorcerer 13',
          description: 'You gain a supreme feat that represents mastery of wild magic.',
        },
      ],
    },
    {
      level: 14,
      features: [
        {
          id: 'immortal-wild-magic',
          name: 'Immortal Wild Magic',
          source: 'Sorcerer 14',
          description: 'Your wild magic is eternal and cannot be suppressed.',
        },
      ],
    },
    {
      level: 15,
      features: [
        {
          id: 'wild-magic-apex-feat',
          name: 'Apex Wild Magic Feat',
          source: 'Sorcerer 15',
          description: 'You gain an apex feat that represents the ultimate expression of your wild magic abilities.',
        },
      ],
    },
    {
      level: 16,
      features: [
        {
          id: 'god-of-wild-magic',
          name: 'God of Wild Magic',
          source: 'Sorcerer 16',
          description: 'You have become a god of wild magic.',
        },
      ],
    },
    {
      level: 17,
      features: [
        {
          id: 'wild-magic-transcendent-feat',
          name: 'Transcendent Wild Magic Feat',
          source: 'Sorcerer 17',
          description: 'You gain a transcendent feat that goes beyond normal wild magic abilities.',
        },
      ],
    },
    {
      level: 18,
      features: [
        {
          id: 'perfect-wild-magic',
          name: 'Perfect Wild Magic',
          source: 'Sorcerer 18',
          description: 'Your wild magic is perfect and absolute.',
        },
      ],
    },
    {
      level: 19,
      features: [
        {
          id: 'wild-magic-ultimate-mastery-feat',
          name: 'Ultimate Mastery Feat',
          source: 'Sorcerer 19',
          description: 'You gain the ultimate mastery feat for your wild magic abilities.',
        },
      ],
    },
    {
      level: 20,
      features: [
        {
          id: 'wild-magic-ascension',
          name: 'Wild Magic Ascension',
          source: 'Sorcerer 20',
          description: 'You have ascended to the pinnacle of wild magic mastery.',
        },
      ],
    },
  ],
};
