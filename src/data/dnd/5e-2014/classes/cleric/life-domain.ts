import { Subclass } from '../../../../../types/character-options/classes';

export const lifeDomainSubclass: Subclass = {
  id: 'life-domain',
  name: 'Life Domain',
  parentClassId: 'cleric',

  features: [
    {
      level: 1,
      features: [
        {
          id: 'life-domain-spells',
          name: 'Life Domain Spells',
          source: 'Life Domain 1',
          description:
            "You gain domain spells at the cleric levels listed in the Life Domain Spells table. Once you gain a domain spell, you always have it prepared, and it doesn't count against the number of spells you can prepare each day.\n\n1st: bless, cure wounds\n3rd: lesser restoration, spiritual weapon\n5th: beacon of hope, revivify\n7th: death ward, guardian of faith\n9th: mass cure wounds, raise dead",
        },
        {
          id: 'bonus-proficiency-life',
          name: 'Bonus Proficiency',
          source: 'Life Domain 1',
          description:
            'When you choose this domain at 1st level, you gain proficiency with heavy armor.',
        },
        {
          id: 'disciple-of-life',
          name: 'Disciple of Life',
          source: 'Life Domain 1',
          description:
            "Also starting at 1st level, your healing spells are more effective. Whenever you use a spell of 1st level or higher to restore hit points to a creature, the creature regains additional hit points equal to 2 + the spell's level.",
        },
      ],
    },
    {
      level: 2,
      features: [
        {
          id: 'preserve-life',
          name: 'Channel Divinity: Preserve Life',
          source: 'Life Domain 2',
          description:
            "Starting at 2nd level, you can use your Channel Divinity to heal the badly injured.\n\nAs an action, you present your holy symbol and evoke healing energy that can restore a number of hit points equal to five times your cleric level. Choose any creatures within 30 feet of you, and divide those hit points among them. This feature can restore a creature to no more than half of its hit point maximum. You can't use this feature on an undead or a construct.",
        },
      ],
    },
    {
      level: 6,
      features: [
        {
          id: 'blessed-healer',
          name: 'Blessed Healer',
          source: 'Life Domain 6',
          description:
            "Beginning at 6th level, the healing spells you cast on others heal you as well. When you cast a spell of 1st level or higher that restores hit points to a creature other than you, you regain hit points equal to 2 + the spell's level.",
        },
      ],
    },
    {
      level: 8,
      features: [
        {
          id: 'divine-strike-life',
          name: 'Divine Strike',
          source: 'Life Domain 8',
          description:
            'At 8th level, you gain the ability to infuse your weapon strikes with divine energy. Once on each of your turns when you hit a creature with a weapon attack, you can cause the attack to deal an extra 1d8 radiant damage to the target. When you reach 14th level, the extra damage increases to 2d8.',
        },
      ],
    },
    {
      level: 17,
      features: [
        {
          id: 'supreme-healing',
          name: 'Supreme Healing',
          source: 'Life Domain 17',
          description:
            'Starting at 17th level, when you would normally roll one or more dice to restore hit points with a spell, you instead use the highest number possible for each die. For example, instead of restoring 2d6 hit points to a creature, you restore 12.',
        },
      ],
    },
  ],

  spellListExpansion: [
    'bless',
    'cure-wounds',
    'lesser-restoration',
    'spiritual-weapon',
    'beacon-of-hope',
    'revivify',
    'death-ward',
    'guardian-of-faith',
    'mass-cure-wounds',
    'raise-dead',
  ],
  alwaysPreparedSpellSourceLabel: 'Life Domain Spells',
  alwaysPreparedSpellsByLevel: {
    1: ['bless', 'cure-wounds'],
    3: ['lesser-restoration', 'spiritual-weapon'],
    5: ['beacon-of-hope', 'revivify'],
    7: ['death-ward', 'guardian-of-faith'],
    9: ['mass-cure-wounds', 'raise-dead'],
  },

  description:
    'The Life domain focuses on the vibrant positive energy—one of the fundamental forces of the universe—that sustains all life. The gods of life promote vitality and health through healing the sick and wounded, caring for those in need, and driving away the forces of death and undeath.',
};
