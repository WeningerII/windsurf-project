import { Subclass } from '../../../../../types/character-options/classes';

export const berserkerSubclass: Subclass = {
  id: 'berserker',
  name: 'Path of the Berserker',
  parentClassId: 'barbarian',
  
  features: [
    {
      level: 3,
      features: [
        {
          id: 'frenzy',
          name: 'Frenzy',
          source: 'Path of the Berserker 3',
          description: 'Starting when you choose this path at 3rd level, you can go into a frenzy when you rage. If you do so, for the duration of your rage you can make a single melee weapon attack as a bonus action on each of your turns after this one. When your rage ends, you suffer one level of exhaustion.',
        },
      ],
    },
    {
      level: 6,
      features: [
        {
          id: 'mindless-rage',
          name: 'Mindless Rage',
          source: 'Path of the Berserker 6',
          description: 'Beginning at 6th level, you can\'t be charmed or frightened while raging. If you are charmed or frightened when you enter your rage, the effect is suspended for the duration of the rage.',
        },
      ],
    },
    {
      level: 10,
      features: [
        {
          id: 'intimidating-presence',
          name: 'Intimidating Presence',
          source: 'Path of the Berserker 10',
          description: 'Beginning at 10th level, you can use your action to frighten someone with your menacing presence. When you do so, choose one creature that you can see within 30 feet of you. If the creature can see or hear you, it must succeed on a Wisdom saving throw (DC equal to 8 + your proficiency bonus + your Charisma modifier) or be frightened of you until the end of your next turn. On subsequent turns, you can use your action to extend the duration of this effect on the frightened creature until the end of your next turn. This effect ends if the creature ends its turn out of line of sight or more than 60 feet away from you.\n\nIf the creature succeeds on its saving throw, you can\'t use this feature on that creature again for 24 hours.',
        },
      ],
    },
    {
      level: 14,
      features: [
        {
          id: 'retaliation',
          name: 'Retaliation',
          source: 'Path of the Berserker 14',
          description: 'Starting at 14th level, when you take damage from a creature that is within 5 feet of you, you can use your reaction to make a melee weapon attack against that creature.',
        },
      ],
    },
  ],
  
  description: 'For some barbarians, rage is a means to an end—that end being violence. The Path of the Berserker is a path of untrammeled fury, slick with blood. As you enter the berserker\'s rage, you thrill in the chaos of battle, heedless of your own health or well-being.',
};
