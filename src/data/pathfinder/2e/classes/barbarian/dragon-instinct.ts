import { Subclass } from '../../../../../types/character-options/classes';

export const dragonInstinctSubclass: Subclass = {
  id: 'pf2e-barbarian-dragon-instinct',
  name: 'Dragon Instinct',
  parentClassId: 'barbarian',
  description: 'A barbarian who embodies draconic fury, gaining elemental powers and resistance based on their chosen dragon type.',
  
  features: [
    {
      level: 1,
      features: [
        {
          id: 'dragon-instinct-1',
          name: 'Dragon Instinct',
          source: 'Barbarian 1',
          description: 'You summon the fury of a dragon. Choose a dragon type. While raging, you deal 4 additional damage with melee Strikes and gain resistance 3 to the damage type associated with your dragon.',
        },
        {
          id: 'draconic-rage',
          name: 'Draconic Rage',
          source: 'Barbarian 1',
          description: 'Your rage manifests draconic features. You grow claws and fangs, and your attacks deal the damage type associated with your dragon.',
        },
      ],
    },
    {
      level: 3,
      features: [
        {
          id: 'dragon-instinct-3',
          name: 'Dragon\'s Breath',
          source: 'Barbarian 3',
          description: 'You can exhale a blast of energy. Once per rage, you can use a 2-action activity to breathe energy in a 30-foot cone or 60-foot line, dealing 1d6 damage per level.',
        },
      ],
    },
    {
      level: 7,
      features: [
        {
          id: 'dragon-instinct-7',
          name: 'Dragon Transformation',
          source: 'Barbarian 7',
          description: 'Your draconic features become more pronounced. You gain a fly Speed of 20 feet while raging.',
        },
      ],
    },
    {
      level: 11,
      features: [
        {
          id: 'dragon-instinct-11',
          name: 'Draconic Arrogance',
          source: 'Barbarian 11',
          description: 'You exude the confidence of a dragon. You gain a +2 circumstance bonus to Intimidation checks while raging.',
        },
      ],
    },
    {
      level: 15,
      features: [
        {
          id: 'dragon-instinct-15',
          name: 'Wyrm\'s Rage',
          source: 'Barbarian 15',
          description: 'Your draconic power reaches new heights. Your resistance to your dragon\'s damage type increases to 10, and your additional damage increases to 8.',
        },
      ],
    },
    {
      level: 19,
      features: [
        {
          id: 'dragon-instinct-19',
          name: 'Draconic Juggernaut',
          source: 'Barbarian 19',
          description: 'You become a true draconic force. Your Dragon\'s Breath deals an additional 2d6 damage and you gain immunity to frightened while raging.',
        },
      ],
    },
  ],
};
