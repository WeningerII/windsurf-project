import { Subclass } from '../../../../../types/character-options/classes';

export const openHandSubclass: Subclass = {
  id: 'open-hand',
  name: 'Warrior of the Open Hand',
  parentClassId: 'monk',
  
  features: [
    {
      level: 3,
      features: [
        {
          id: 'open-hand-technique',
          name: 'Open Hand Technique',
          source: 'Warrior of the Open Hand 3',
          description: 'Whenever you hit a creature with an attack granted by your Flurry of Blows, you can impose one of the following effects on that target:\n\n• Addle: The target can\'t take Reactions until the start of its next turn.\n• Push: The target must succeed on a Strength saving throw or be pushed up to 15 feet away from you.\n• Topple: The target must succeed on a Dexterity saving throw or have the Prone condition.',
        },
      ],
    },
    {
      level: 6,
      features: [
        {
          id: 'wholeness-of-body',
          name: 'Wholeness of Body',
          source: 'Warrior of the Open Hand 6',
          description: 'You gain the ability to heal yourself. As a Bonus Action, you can roll your Martial Arts die. You regain a number of Hit Points equal to the number rolled plus your Wisdom modifier. You can use this feature a number of times equal to your Wisdom modifier (minimum of once), and you regain all expended uses when you finish a Long Rest.',
        },
      ],
    },
    {
      level: 11,
      features: [
        {
          id: 'fleet-step',
          name: 'Fleet Step',
          source: 'Warrior of the Open Hand 11',
          description: 'When you take a Bonus Action to use Step of the Wind, you can also use Flurry of Blows as part of that Bonus Action.',
        },
      ],
    },
    {
      level: 17,
      features: [
        {
          id: 'quivering-palm',
          name: 'Quivering Palm',
          source: 'Warrior of the Open Hand 17',
          description: 'You gain the ability to set up lethal vibrations in someone\'s body. When you hit a creature with an Unarmed Strike, you can spend 4 Focus Points to start these imperceptible vibrations, which last for a number of days equal to your Monk level. The vibrations are harmless unless you use your Action to end them. To do so, you and the target must be on the same plane of existence. When you use this action, the creature must make a Constitution saving throw. If it fails, it takes 10d12 Necrotic damage. If it succeeds, it takes half as much damage.',
        },
      ],
    },
  ],
  
  description: 'Warriors of the Open Hand are masters of unarmed combat. They learn techniques to push and trip their opponents, manipulate their own energy to heal themselves, and channel harmful vibrations into others.',
};
