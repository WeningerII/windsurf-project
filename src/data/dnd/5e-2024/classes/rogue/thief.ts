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
          description: 'You can use the Bonus Action granted by Cunning Action to make a Dexterity (Sleight of Hand) check, to use your Thieves\' Tools to disarm a trap or open a lock, or to take the Utilize action.',
        },
        {
          id: 'second-story-work',
          name: 'Second-Story Work',
          source: 'Thief 3',
          description: 'You gain a Climb Speed equal to your Speed. In addition, when you make a running High Jump or Long Jump, the distance you cover increases by a number of feet equal to your Dexterity modifier.',
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
          description: 'You have Advantage on Dexterity (Stealth) checks if you move no more than half your Speed on the same turn.',
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
          description: 'You ignore all class, species, and level requirements on the use of magic items.',
        },
      ],
    },
    {
      level: 17,
      features: [
        {
          id: 'thiefs-reflexes',
          name: 'Thief\'s Reflexes',
          source: 'Thief 17',
          description: 'You can take two turns during the first round of any combat. You take your first turn at your normal initiative and your second turn at your initiative minus 10. You can\'t use this feature if you have the Surprised condition.',
        },
      ],
    },
  ],
  
  description: 'You hone your skills in the larcenous arts. Burglars, bandits, cutpurses, and other criminals typically follow this archetype.',
};
