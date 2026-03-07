import { Species } from '../../../../types/character-options/species';

export const halfling: Species = {
  id: 'halfling',
  name: 'Halfling',
  system: 'dnd-3.5e',
  source: 'PHB 3.5',

  abilityScoreIncrease: [
    {
      type: 'fixed',
      attributes: { dex: 2, str: -2 },
    },
  ],

  size: 'small',
  speed: 20,

  languages: {
    automatic: ['Common', 'Halfling'],
    choice: {
      count: 0,
      options: ['Dwarven', 'Elven', 'Gnome', 'Goblin', 'Orc'],
      label: 'Bonus languages',
    },
  },

  traits: [
    {
      id: 'small-size',
      name: 'Small Size',
      source: 'Halfling',
      description:
        'As a Small creature, a halfling gains a +1 size bonus to Armor Class, a +1 size bonus on attack rolls, and a +4 size bonus on Hide checks, but uses smaller weapons than humans use, and his lifting and carrying limits are three-quarters of those of a Medium character.',
    },
    {
      id: 'saving-throw-bonuses',
      name: 'Saving Throw Bonuses',
      source: 'Halfling',
      description:
        "Halflings have a +2 morale bonus on saving throws against fear. This bonus stacks with the halfling's +1 bonus on saving throws in general.",
    },
    {
      id: 'attack-bonuses',
      name: 'Attack Bonuses',
      source: 'Halfling',
      description:
        'Halflings have a +1 racial bonus on attack rolls with thrown weapons and slings.',
    },
    {
      id: 'skill-bonuses-halfling',
      name: 'Skill Bonuses',
      source: 'Halfling',
      description: 'Halflings have a +2 racial bonus on Climb, Jump, and Move Silently checks.',
    },
    {
      id: 'lucky',
      name: 'Lucky',
      source: 'Halfling',
      description: 'Halflings have a +1 racial bonus on all saving throws.',
    },
  ],

  description:
    'Halflings are clever, capable, and resourceful survivors. They are notoriously curious.',

  ageInfo:
    'Halflings are considered young until age 20, middle-aged at 50, old at 75, and venerable at 100.',

  alignmentTendency: 'Halflings are usually lawful good.',

  sizeDescription: 'Halflings stand about 3 feet tall. Your size is Small.',
};
