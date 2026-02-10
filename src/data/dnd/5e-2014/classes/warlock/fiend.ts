import { Subclass } from '../../../../../types/character-options/classes';

export const fiendSubclass: Subclass = {
  id: 'fiend',
  name: 'The Fiend',
  parentClassId: 'warlock',
  
  features: [
    {
      level: 1,
      features: [
        {
          id: 'expanded-spell-list-fiend',
          name: 'Expanded Spell List',
          source: 'The Fiend 1',
          description: 'The Fiend lets you choose from an expanded list of spells when you learn a warlock spell. The following spells are added to the warlock spell list for you.\n\n1st: burning hands, command\n2nd: blindness/deafness, scorching ray\n3rd: fireball, stinking cloud\n4th: fire shield, wall of fire\n5th: flame strike, hallow',
        },
        {
          id: 'dark-ones-blessing',
          name: 'Dark One\'s Blessing',
          source: 'The Fiend 1',
          description: 'Starting at 1st level, when you reduce a hostile creature to 0 hit points, you gain temporary hit points equal to your Charisma modifier + your warlock level (minimum of 1).',
        },
      ],
    },
    {
      level: 6,
      features: [
        {
          id: 'dark-ones-own-luck',
          name: 'Dark One\'s Own Luck',
          source: 'The Fiend 6',
          description: 'Starting at 6th level, you can call on your patron to alter fate in your favor. When you make an ability check or a saving throw, you can use this feature to add a d10 to your roll. You can do so after seeing the initial roll but before any of the roll\'s effects occur.\n\nOnce you use this feature, you can\'t use it again until you finish a short or long rest.',
          uses: {
            current: 1,
            max: 1,
            recoveryType: 'short-rest',
          },
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
          description: 'Starting at 10th level, you can choose one damage type when you finish a short or long rest. You gain resistance to that damage type until you choose a different one with this feature. Damage from magical weapons or silver weapons ignores this resistance.',
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
          description: 'Starting at 14th level, when you hit a creature with an attack, you can use this feature to instantly transport the target through the lower planes. The creature disappears and hurtles through a nightmare landscape.\n\nAt the end of your next turn, the target returns to the space it previously occupied, or the nearest unoccupied space. If the target is not a fiend, it takes 10d10 psychic damage as it reels from its horrific experience.\n\nOnce you use this feature, you can\'t use it again until you finish a long rest.',
          uses: {
            current: 1,
            max: 1,
            recoveryType: 'long-rest',
          },
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
  
  description: 'You have made a pact with a fiend from the lower planes of existence, a being whose aims are evil, even if you strive against those aims. Such beings desire the corruption or destruction of all things, ultimately including you.',
};
