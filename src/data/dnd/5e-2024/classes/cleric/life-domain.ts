import { Subclass } from '../../../../../types/character-options/classes';

export const lifeDomainSubclass: Subclass = {
  id: 'life-domain',
  name: 'Life Domain',
  parentClassId: 'cleric',

  features: [
    {
      level: 3,
      features: [
        {
          id: 'disciple-of-life',
          name: 'Disciple of Life',
          source: 'Life Domain 3',
          description:
            "Whenever you use a spell of 1st level or higher to restore Hit Points to a creature, the creature regains additional Hit Points equal to 2 + the spell's level.",
        },
        {
          id: 'preserve-life',
          name: 'Channel Divinity: Preserve Life',
          source: 'Life Domain 3',
          description:
            "As a Magic action, you present your Holy Symbol and evoke healing energy that can restore a number of Hit Points equal to 5 times your Cleric level. Choose any creatures within 30 feet of yourself (you can choose yourself), and divide those Hit Points among them. This feature can restore a creature to no more than half of its Hit Point maximum. You can't use this feature on an Undead or a Construct.",
        },
        {
          id: 'life-domain-spells',
          name: 'Life Domain Spells',
          source: 'Life Domain 3',
          description:
            "Your connection to this domain ensures you always have certain spells ready. When you reach a Cleric level specified in the Life Domain Spells table, you thereafter always have the listed spells prepared. These spells don't count against the number of spells you can prepare, and they are considered Cleric spells for you.",
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
            "The healing spells you cast on others heal you as well. When you cast a spell of 1st level or higher that restores Hit Points to a creature other than you, you regain Hit Points equal to 2 + the spell's level.",
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
            'When you would normally roll one or more dice to restore Hit Points with a spell, you instead use the highest number possible for each die. For example, instead of restoring 2d6 Hit Points to a creature, you restore 12.',
        },
      ],
    },
  ],

  spellListExpansion: [
    'aid',
    'beacon-of-hope',
    'bless',
    'cure-wounds',
    'death-ward',
    'guardian-of-faith',
    'lesser-restoration',
    'mass-cure-wounds',
    'raise-dead',
    'revivify',
  ],
  alwaysPreparedSpells: [
    {
      source: 'Life Domain Spells',
      minLevel: 3,
      spellIds: ['bless', 'cure-wounds'],
      countsAgainstPreparedLimit: false,
    },
    {
      source: 'Life Domain Spells',
      minLevel: 5,
      spellIds: ['aid', 'lesser-restoration'],
      countsAgainstPreparedLimit: false,
    },
    {
      source: 'Life Domain Spells',
      minLevel: 7,
      spellIds: ['beacon-of-hope', 'revivify'],
      countsAgainstPreparedLimit: false,
    },
    {
      source: 'Life Domain Spells',
      minLevel: 9,
      spellIds: ['death-ward', 'guardian-of-faith'],
      countsAgainstPreparedLimit: false,
    },
    {
      source: 'Life Domain Spells',
      minLevel: 11,
      spellIds: ['mass-cure-wounds', 'raise-dead'],
      countsAgainstPreparedLimit: false,
    },
  ],

  description:
    'The Life domain focuses on the vibrant positive energy—one of the fundamental forces of the universe—that sustains all life.',
};
