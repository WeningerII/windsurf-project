import { Species } from '../../../../types/character-options/species';

export const gnome: Species = {
  id: 'gnome',
  name: 'Gnome',
  system: 'dnd-3.5e',
  source: 'SRD 3.5',

  abilityScoreIncrease: [
    {
      type: 'fixed',
      attributes: { con: 2, str: -2 },
    },
  ],

  size: 'small',
  speed: 20,

  languages: {
    automatic: ['Common', 'Gnome'],
    choice: {
      count: 0,
      options: ['Draconic', 'Dwarven', 'Elven', 'Giant', 'Goblin', 'Orc'],
      label: 'Bonus languages',
    },
  },

  traits: [
    {
      id: 'low-light-vision-gnome',
      name: 'Low-Light Vision',
      source: 'Gnome',
      description:
        'A gnome can see twice as far as a human in starlight, moonlight, torchlight, and similar conditions of poor illumination.',
    },
    {
      id: 'gnome-cunning-35e',
      name: 'Gnome Cunning',
      source: 'Gnome',
      description: 'Gnomes have a +2 racial bonus on saving throws against illusions.',
    },
    {
      id: 'spell-like-abilities-gnome',
      name: 'Spell-Like Abilities',
      source: 'Gnome',
      description:
        'Once per day, a gnome can use speak with animals (burrowing mammal only), dancing lights, ghost sound, and prestidigitation as spell-like abilities.',
    },
    {
      id: 'skill-bonuses-gnome',
      name: 'Skill Bonuses',
      source: 'Gnome',
      description:
        'Gnomes have a +2 racial bonus on Listen checks and a +2 racial bonus on Craft (alchemy) checks.',
    },
  ],

  description:
    'Gnomes are small folk with a great sense of curiosity and a knack for illusion and engineering.',

  ageInfo:
    'Gnomes are considered young until age 40, middle-aged at 100, old at 150, and venerable at 200.',

  alignmentTendency: 'Gnomes are generally good.',

  sizeDescription:
    'Gnomes stand about 3 to 3½ feet tall and weigh 40 to 45 pounds. Your size is Small.',
};
