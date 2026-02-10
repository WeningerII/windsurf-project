import { Subclass } from '../../../../../types/character-options/classes';

// Pathfinder 2e Cleric Trickery Domain Subclass
export const trickeryDomainSubclass: Subclass = {
  id: 'pf2e-cleric-trickery-domain',
  name: 'Trickery Domain',
  parentClassId: 'cleric',
  description: 'A cleric devoted to deception and misdirection, serving a deity of trickery and cunning.',
  features: [
    {
      level: 1,
      features: [
        {
          id: 'trickery-domain-spells',
          name: 'Trickery Domain Spells',
          source: 'Cleric 1',
          description: 'You gain domain spells related to deception and misdirection.',
        },
        {
          id: 'blessing-of-trickery',
          name: 'Blessing of Trickery',
          source: 'Cleric 1',
          description: 'You gain advantage on Deception and Stealth checks.',
        },
      ],
    },
    {
      level: 2,
      features: [
        {
          id: 'channel-divinity-trickery',
          name: 'Channel Divinity: Invoke Duplicity',
          source: 'Cleric 2',
          description: 'You can create an illusory duplicate of yourself that can move and act independently.',
        },
      ],
    },
    {
      level: 3,
      features: [
        {
          id: 'trickery-feat',
          name: 'Trickery Feat',
          source: 'Cleric 3',
          description: 'You gain a special feat related to your trickery abilities.',
        },
      ],
    },
    {
      level: 4,
      features: [
        {
          id: 'improved-deception',
          name: 'Improved Deception',
          source: 'Cleric 4',
          description: 'Your deception becomes more effective. Increase the bonus to Deception checks to +2.',
        },
      ],
    },
    {
      level: 5,
      features: [
        {
          id: 'trickery-mastery',
          name: 'Trickery Mastery',
          source: 'Cleric 5',
          description: 'Your trickery becomes more powerful. You can create multiple duplicates.',
        },
      ],
    },
    {
      level: 6,
      features: [
        {
          id: 'advanced-trickery-feat',
          name: 'Advanced Trickery Feat',
          source: 'Cleric 6',
          description: 'You gain an advanced feat related to your trickery abilities.',
        },
      ],
    },
    {
      level: 7,
      features: [
        {
          id: 'master-of-deception',
          name: 'Master of Deception',
          source: 'Cleric 7',
          description: 'You have become a master of deception. Your duplicates are indistinguishable from you.',
        },
      ],
    },
    {
      level: 8,
      features: [
        {
          id: 'trickery-strike',
          name: 'Trickery Strike',
          source: 'Cleric 8',
          description: 'Your attacks can now confuse and disorient enemies.',
        },
      ],
    },
    {
      level: 9,
      features: [
        {
          id: 'trickery-ultimate-feat',
          name: 'Ultimate Trickery Feat',
          source: 'Cleric 9',
          description: 'You gain an ultimate feat that represents the pinnacle of your trickery abilities.',
        },
      ],
    },
    {
      level: 10,
      features: [
        {
          id: 'trickery-perfection',
          name: 'Trickery Perfection',
          source: 'Cleric 10',
          description: 'You have perfected your trickery abilities. Increase the bonus to Deception checks to +3.',
        },
      ],
    },
    {
      level: 11,
      features: [
        {
          id: 'master-trickery-feat',
          name: 'Master Trickery Feat',
          source: 'Cleric 11',
          description: 'You gain a master-level feat related to your trickery abilities.',
        },
      ],
    },
    {
      level: 12,
      features: [
        {
          id: 'mass-duplicity',
          name: 'Mass Duplicity',
          source: 'Cleric 12',
          description: 'Your duplicates can now act independently and cast spells.',
        },
      ],
    },
    {
      level: 13,
      features: [
        {
          id: 'trickery-supreme-feat',
          name: 'Supreme Trickery Feat',
          source: 'Cleric 13',
          description: 'You gain a supreme feat that represents mastery of trickery.',
        },
      ],
    },
    {
      level: 14,
      features: [
        {
          id: 'immortal-deception',
          name: 'Immortal Deception',
          source: 'Cleric 14',
          description: 'Your deception is nearly perfect. Increase the bonus to Deception checks to +4.',
        },
      ],
    },
    {
      level: 15,
      features: [
        {
          id: 'trickery-apex-feat',
          name: 'Apex Trickery Feat',
          source: 'Cleric 15',
          description: 'You gain an apex feat that represents the ultimate expression of your trickery abilities.',
        },
      ],
    },
    {
      level: 16,
      features: [
        {
          id: 'god-of-trickery',
          name: 'God of Trickery',
          source: 'Cleric 16',
          description: 'You have become a god of trickery. Your duplicates can now act as full copies of you.',
        },
      ],
    },
    {
      level: 17,
      features: [
        {
          id: 'trickery-transcendent-feat',
          name: 'Transcendent Trickery Feat',
          source: 'Cleric 17',
          description: 'You gain a transcendent feat that goes beyond normal trickery abilities.',
        },
      ],
    },
    {
      level: 18,
      features: [
        {
          id: 'perfect-deception',
          name: 'Perfect Deception',
          source: 'Cleric 18',
          description: 'Your deception is perfect. Increase the bonus to Deception checks to +5.',
        },
      ],
    },
    {
      level: 19,
      features: [
        {
          id: 'trickery-ultimate-mastery-feat',
          name: 'Ultimate Mastery Feat',
          source: 'Cleric 19',
          description: 'You gain the ultimate mastery feat for your trickery abilities.',
        },
      ],
    },
    {
      level: 20,
      features: [
        {
          id: 'trickery-ascension',
          name: 'Trickery Ascension',
          source: 'Cleric 20',
          description: 'You have ascended to the pinnacle of trickery mastery. You gain all benefits of your trickery abilities at their maximum potency.',
        },
      ],
    },
  ],
};
