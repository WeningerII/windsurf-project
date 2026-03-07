import { Species } from '../../../../types/character-options/species';

export const elf: Species = {
  id: 'elf',
  name: 'Elf',
  system: 'dnd-3.5e',
  source: 'PHB 3.5',

  abilityScoreIncrease: [
    {
      type: 'fixed',
      attributes: { dex: 2, con: -2 },
    },
  ],

  size: 'medium',
  speed: 30,

  languages: {
    automatic: ['Common', 'Elven'],
    choice: {
      count: 0,
      options: ['Draconic', 'Gnoll', 'Gnome', 'Goblin', 'Orc', 'Sylvan'],
      label: 'Bonus languages',
    },
  },

  traits: [
    {
      id: 'low-light-vision',
      name: 'Low-Light Vision',
      source: 'Elf',
      description:
        'An elf can see twice as far as a human in starlight, moonlight, torchlight, and similar conditions of poor illumination.',
    },
    {
      id: 'weapon-proficiency-elf',
      name: 'Weapon Proficiency',
      source: 'Elf',
      description:
        'Elves receive the Martial Weapon Proficiency feats for the longsword, rapier, longbow, and shortbow as bonus feats.',
    },
    {
      id: 'keen-senses-35e',
      name: 'Keen Senses',
      source: 'Elf',
      description:
        'Elves have a +2 racial bonus on Listen, Search, and Spot checks. An elf who merely passes within 5 feet of a secret or concealed door is entitled to a Search check to notice it as if she were actively looking for it.',
    },
    {
      id: 'immunity-to-sleep',
      name: 'Immunity to Sleep',
      source: 'Elf',
      description:
        'Immunity to magic sleep effects, and a +2 racial saving throw bonus against enchantment spells or effects.',
    },
  ],

  description:
    'Elves are known for their poetry, song, and magical arts, but when danger threatens they show great skill with weapons and strategy.',

  ageInfo:
    'Elves are considered young until age 110, middle-aged at 175, old at 263, and venerable at 350.',

  alignmentTendency: 'Elves are usually chaotic good.',

  sizeDescription:
    'Elves are slightly shorter than humans, standing 4½ to 5½ feet tall. Your size is Medium.',
};
