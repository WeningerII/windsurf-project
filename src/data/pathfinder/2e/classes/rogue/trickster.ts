import { Subclass } from '../../../../../types/character-options/classes';

// Pathfinder 2e Rogue Trickster Subclass
export const tricksterSubclass: Subclass = {
  id: 'pf2e-rogue-trickster',
  name: 'Trickster',
  parentClassId: 'rogue',
  description: 'A master of deception and misdirection who uses cunning and wit to overcome challenges.',
  features: [
    {
      level: 1,
      features: [
        {
          id: 'trickster-racket',
          name: 'Trickster Racket',
          source: 'Rogue 1',
          description: 'You gain the Trickster Racket, allowing you to use deception and misdirection in combat. You can use Deception to Feint in combat, and you gain a +1 circumstance bonus to Deception checks to Feint.',
        },
        {
          id: 'rogue-racket-ability',
          name: 'Racket Ability',
          source: 'Rogue 1',
          description: 'You gain access to special abilities related to your Trickster Racket.',
        },
      ],
    },
    {
      level: 2,
      features: [
        {
          id: 'evasion',
          name: 'Evasion',
          source: 'Rogue 2',
          description: 'When you roll a success on a Reflex save, you get a critical success instead. You gain a +2 circumstance bonus to Reflex saves against effects you can see.',
        },
      ],
    },
    {
      level: 3,
      features: [
        {
          id: 'trickster-feat',
          name: 'Trickster Feat',
          source: 'Rogue 3',
          description: 'You gain a special feat related to your Trickster abilities.',
        },
      ],
    },
    {
      level: 4,
      features: [
        {
          id: 'debilitating-strike',
          name: 'Debilitating Strike',
          source: 'Rogue 4',
          description: 'When you hit with a Sneak Attack, you can apply a debilitating effect to your target.',
        },
      ],
    },
    {
      level: 5,
      features: [
        {
          id: 'trickster-mastery',
          name: 'Trickster Mastery',
          source: 'Rogue 5',
          description: 'Your deception and misdirection become more effective. Increase the bonus to Deception checks to Feint to +2.',
        },
      ],
    },
    {
      level: 6,
      features: [
        {
          id: 'advanced-trickster-feat',
          name: 'Advanced Trickster Feat',
          source: 'Rogue 6',
          description: 'You gain an advanced feat related to your Trickster abilities.',
        },
      ],
    },
    {
      level: 7,
      features: [
        {
          id: 'trickster-evasion-mastery',
          name: 'Evasion Mastery',
          source: 'Rogue 7',
          description: 'Your evasion becomes even more reliable. You gain a +3 circumstance bonus to Reflex saves.',
        },
      ],
    },
    {
      level: 8,
      features: [
        {
          id: 'trickster-strike-mastery',
          name: 'Strike Mastery',
          source: 'Rogue 8',
          description: 'Your strikes with Sneak Attack become more devastating.',
        },
      ],
    },
    {
      level: 9,
      features: [
        {
          id: 'trickster-ultimate-feat',
          name: 'Ultimate Trickster Feat',
          source: 'Rogue 9',
          description: 'You gain an ultimate feat that represents the pinnacle of your Trickster abilities.',
        },
      ],
    },
    {
      level: 10,
      features: [
        {
          id: 'trickster-perfection',
          name: 'Trickster Perfection',
          source: 'Rogue 10',
          description: 'You have perfected your trickster abilities. You gain a +4 circumstance bonus to Deception checks to Feint.',
        },
      ],
    },
    {
      level: 11,
      features: [
        {
          id: 'master-trickster-feat',
          name: 'Master Trickster Feat',
          source: 'Rogue 11',
          description: 'You gain a master-level feat related to your Trickster abilities.',
        },
      ],
    },
    {
      level: 12,
      features: [
        {
          id: 'trickster-legendary-strike',
          name: 'Legendary Strike',
          source: 'Rogue 12',
          description: 'Your Sneak Attacks can now apply multiple debilitating effects.',
        },
      ],
    },
    {
      level: 13,
      features: [
        {
          id: 'trickster-supreme-feat',
          name: 'Supreme Trickster Feat',
          source: 'Rogue 13',
          description: 'You gain a supreme feat that represents mastery of trickery.',
        },
      ],
    },
    {
      level: 14,
      features: [
        {
          id: 'trickster-immortal-evasion',
          name: 'Immortal Evasion',
          source: 'Rogue 14',
          description: 'Your evasion is nearly perfect. You gain a +5 circumstance bonus to Reflex saves.',
        },
      ],
    },
    {
      level: 15,
      features: [
        {
          id: 'trickster-apex-feat',
          name: 'Apex Trickster Feat',
          source: 'Rogue 15',
          description: 'You gain an apex feat that represents the ultimate expression of your Trickster abilities.',
        },
      ],
    },
    {
      level: 16,
      features: [
        {
          id: 'trickster-god-strike',
          name: 'God Strike',
          source: 'Rogue 16',
          description: 'Your Sneak Attacks can now devastate even the mightiest foes.',
        },
      ],
    },
    {
      level: 17,
      features: [
        {
          id: 'trickster-transcendent-feat',
          name: 'Transcendent Trickster Feat',
          source: 'Rogue 17',
          description: 'You gain a transcendent feat that goes beyond normal trickster abilities.',
        },
      ],
    },
    {
      level: 18,
      features: [
        {
          id: 'trickster-perfect-evasion',
          name: 'Perfect Evasion',
          source: 'Rogue 18',
          description: 'You can now avoid almost any danger. You gain a +6 circumstance bonus to Reflex saves.',
        },
      ],
    },
    {
      level: 19,
      features: [
        {
          id: 'trickster-ultimate-mastery-feat',
          name: 'Ultimate Mastery Feat',
          source: 'Rogue 19',
          description: 'You gain the ultimate mastery feat for your Trickster abilities.',
        },
      ],
    },
    {
      level: 20,
      features: [
        {
          id: 'trickster-ascension',
          name: 'Trickster Ascension',
          source: 'Rogue 20',
          description: 'You have ascended to the pinnacle of trickster mastery. You gain all benefits of your Trickster abilities at their maximum potency.',
        },
      ],
    },
  ],
};
