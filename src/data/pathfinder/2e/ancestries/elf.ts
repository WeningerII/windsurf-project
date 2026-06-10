import { Species } from '../../../../types/character-options/species';

export const elf: Species = {
  id: 'elf',
  name: 'Elf',
  system: 'pf2e',
  source: 'Core Rulebook',

  abilityScoreIncrease: [
    { type: 'fixed', attributes: { dex: 2, int: 2, con: -2 } },
    {
      type: 'choice',
      choice: { count: 1, options: ['str', 'wis', 'cha'], label: 'Free ability boost' },
      values: [2],
    },
  ],

  size: 'medium',
  speed: 30,

  languages: {
    automatic: ['Common', 'Elven'],
    choice: {
      count: 0,
      options: ['Celestial', 'Draconic', 'Gnoll', 'Gnomish', 'Goblin', 'Orcish', 'Sylvan'],
      label: 'Additional languages equal to Intelligence modifier',
    },
  },

  traits: [
    {
      id: 'low-light-vision',
      name: 'Low-Light Vision',
      source: 'Elf',
      description: 'You can see in dim light as though it were bright light.',
    },
  ],

  // CRB heritages. PF2e heritages never grant ability boosts (those come from
  // the ancestry itself) — each grants the feature in its description, so
  // abilityScoreIncrease is truthfully empty on every entry.
  subraces: [
    {
      id: 'arctic',
      name: 'Arctic Elf',
      parentSpeciesId: 'elf',
      abilityScoreIncrease: [],
      traits: [],
      description:
        'You gain cold resistance equal to half your level (minimum 1), and you treat environmental cold effects as if they were one step less extreme.',
    },
    {
      id: 'cavern',
      name: 'Cavern Elf',
      parentSpeciesId: 'elf',
      abilityScoreIncrease: [],
      traits: [],
      description: 'You gain darkvision.',
    },
    {
      id: 'seer',
      name: 'Seer Elf',
      parentSpeciesId: 'elf',
      abilityScoreIncrease: [],
      traits: [],
      description:
        'You can cast the detect magic cantrip as an arcane innate spell at will, and you gain a +1 circumstance bonus to checks to Identify Magic and to Decipher Writing of a magical nature.',
    },
    {
      id: 'whisper',
      name: 'Whisper Elf',
      parentSpeciesId: 'elf',
      abilityScoreIncrease: [],
      traits: [],
      description:
        'Your hearing is keen: you gain a +2 circumstance bonus to Perception checks to Seek hidden or undetected creatures within 30 feet.',
    },
    {
      id: 'woodland',
      name: 'Woodland Elf',
      parentSpeciesId: 'elf',
      abilityScoreIncrease: [],
      traits: [],
      description:
        'When Climbing trees and other plants you move at half your Speed on a success (full Speed on a critical success), and you can always Take Cover when within forest terrain.',
    },
  ],

  description:
    'As an ancient people, elves have seen a great deal of history. Elves combine otherworldly grace, sharp intellect, and mysterious charm.',
  ageInfo:
    'Elves reach physical adulthood around the age of 20 but are considered young until around 100. They can live to 600 years old or more.',
  alignmentTendency: 'Elves tend toward chaotic alignments.',
  sizeDescription: 'Elves are generally taller than humans, standing 5½ to 6½ feet tall.',
};
