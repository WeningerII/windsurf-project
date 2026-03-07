import { Subclass } from '../../../../../types/character-options/classes';

export const thiefSubclass: Subclass = {
  id: 'thief',
  name: 'Thief',
  parentClassId: 'rogue',

  features: [
    {
      level: 3,
      features: [
        {
          id: 'fast-hands',
          name: 'Fast Hands',
          source: 'Thief 3',
          description:
            "Starting at 3rd level, you can use the bonus action granted by your Cunning Action to make a Dexterity (Sleight of Hand) check, use your thieves' tools to disarm a trap or open a lock, or take the Use an Object action.",
        },
        {
          id: 'second-story-work',
          name: 'Second-Story Work',
          source: 'Thief 3',
          description:
            'When you choose this archetype at 3rd level, you gain the ability to climb faster than normal; climbing no longer costs you extra movement.\n\nIn addition, when you make a running jump, the distance you cover increases by a number of feet equal to your Dexterity modifier.',
        },
      ],
    },
    {
      level: 9,
      features: [
        {
          id: 'supreme-sneak',
          name: 'Supreme Sneak',
          source: 'Thief 9',
          description:
            'Starting at 9th level, you have advantage on a Dexterity (Stealth) check if you move no more than half your speed on the same turn.',
        },
      ],
    },
    {
      level: 13,
      features: [
        {
          id: 'use-magic-device',
          name: 'Use Magic Device',
          source: 'Thief 13',
          description:
            'By 13th level, you have learned enough about the workings of magic that you can improvise the use of items even when they are not intended for you. You ignore all class, race, and level requirements on the use of magic items.',
        },
      ],
    },
    {
      level: 17,
      features: [
        {
          id: 'thiefs-reflexes',
          name: "Thief's Reflexes",
          source: 'Thief 17',
          description:
            "When you reach 17th level, you have become adept at laying ambushes and quickly escaping danger. You can take two turns during the first round of any combat. You take your first turn at your normal initiative and your second turn at your initiative minus 10. You can't use this feature when you are surprised.",
        },
      ],
    },
  ],

  description:
    'You hone your skills in the larcenous arts. Burglars, bandits, cutpurses, and other criminals typically follow this archetype, but so do rogues who prefer to think of themselves as professional treasure seekers, explorers, delvers, and investigators.',
};
