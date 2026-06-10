import { Species } from '../../../../types/character-options/species';

export const halfElf: Species = {
  id: 'half-elf',
  name: 'Half-Elf',
  system: 'dnd-3.5e',
  source: 'SRD 3.5',

  abilityScoreIncrease: [],

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
      id: 'low-light-vision-half-elf',
      name: 'Low-Light Vision',
      source: 'Half-Elf',
      description:
        'A half-elf can see twice as far as a human in starlight, moonlight, torchlight, and similar conditions of poor illumination.',
    },
    {
      id: 'immunity-to-sleep-half-elf',
      name: 'Immunity to Sleep',
      source: 'Half-Elf',
      description:
        'Immunity to sleep spells and similar magical effects, and a +2 racial bonus on saving throws against enchantment spells or effects.',
    },
    {
      id: 'skill-bonuses-half-elf',
      name: 'Skill Bonuses',
      source: 'Half-Elf',
      description: 'Half-elves have a +1 racial bonus on Listen, Search, and Spot checks.',
    },
    {
      id: 'diplomacy-gather-info',
      name: 'Social Aptitude',
      source: 'Half-Elf',
      description: 'Half-elves have a +2 racial bonus on Diplomacy and Gather Information checks.',
    },
  ],

  description:
    'Half-elves are often caught between two worlds, combining human adaptability with elven grace.',

  ageInfo:
    'Half-elves reach adulthood around age 20 and live longer than humans (often beyond 180 years).',

  alignmentTendency: 'Half-elves share the chaotic bent of their elven heritage.',

  sizeDescription: 'Half-elves are about the same size as humans. Your size is Medium.',
};
