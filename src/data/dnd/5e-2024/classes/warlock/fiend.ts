import { Subclass } from '../../../../../types/character-options/classes';

export const fiendSubclass: Subclass = {
  id: 'fiend',
  name: 'The Fiend',
  parentClassId: 'warlock',

  features: [
    {
      level: 3,
      features: [
        {
          id: 'fiend-spells',
          name: 'Fiend Spells',
          source: 'The Fiend 3',
          description:
            'The magic of your patron ensures you always have certain spells ready; when you reach a Warlock level specified in the Fiend Spells table, you thereafter always have the listed spells prepared.',
        },
        {
          id: 'dark-ones-blessing',
          name: "Dark One's Blessing",
          source: 'The Fiend 3',
          description:
            'When you reduce a hostile creature to 0 Hit Points, you gain Temporary Hit Points equal to your Charisma modifier + your Warlock level (minimum of 1).',
        },
      ],
    },
    {
      level: 6,
      features: [
        {
          id: 'dark-ones-own-luck',
          name: "Dark One's Own Luck",
          source: 'The Fiend 6',
          description:
            "You can call on your patron to alter fate in your favor. When you make an ability check or a saving throw, you can use this feature to add a d10 to your roll. You can do so after seeing the initial roll but before any of the roll's effects occur. You can use this feature a number of times equal to your Charisma modifier (minimum of once), and you regain all expended uses when you finish a Long Rest.",
        },
      ],
    },
    {
      level: 10,
      features: [
        {
          id: 'fiendish-resilience',
          name: 'Fiendish Resilience',
          source: 'The Fiend 10',
          description:
            'You can choose one damage type when you finish a Short or Long Rest. You gain Resistance to that damage type until you choose a different one with this feature. Damage from magical weapons or Silver weapons ignores this Resistance.',
        },
      ],
    },
    {
      level: 14,
      features: [
        {
          id: 'hurl-through-hell',
          name: 'Hurl Through Hell',
          source: 'The Fiend 14',
          description:
            "When you hit a creature with an attack, you can use this feature to instantly transport the target through the Lower Planes. The creature disappears and hurtles through a nightmare landscape. At the end of your next turn, the target returns to the space it previously occupied, or the nearest unoccupied space. If the target is not a Fiend, it takes 10d10 Psychic damage as it reels from its horrific experience. Once you use this feature, you can't use it again until you finish a Long Rest, unless you expend a spell slot of 5th level or higher to use it again.",
        },
      ],
    },
  ],

  spellListExpansion: [
    'burning-hands',
    'command',
    'blindness-deafness',
    'scorching-ray',
    'fireball',
    'stinking-cloud',
    'fire-shield',
    'wall-of-fire',
    'flame-strike',
    'hallow',
  ],
  alwaysPreparedSpellSourceLabel: 'Fiend Spells',
  alwaysPreparedSpellsByLevel: {
    3: ['burning-hands', 'command'],
    5: ['blindness-deafness', 'scorching-ray'],
    7: ['fireball', 'stinking-cloud'],
    9: ['fire-shield', 'wall-of-fire'],
    11: ['flame-strike', 'hallow'],
  },

  description:
    'You have made a pact with a fiend from the lower planes of existence, a being whose aims are evil, even if you strive against those aims. Such beings desire the corruption or destruction of all things, ultimately including you.',
};
