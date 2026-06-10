import { Species } from '../../../../types/character-options/species';

export const elf: Species = {
  id: 'elf',
  name: 'Elf',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',

  abilityScoreIncrease: [
    {
      type: 'fixed',
      attributes: { dex: 2 },
    },
  ],

  size: 'medium',
  speed: 30,

  languages: {
    automatic: ['Common', 'Elvish'],
  },

  traits: [
    {
      id: 'darkvision',
      name: 'Darkvision',
      source: 'Elf',
      description:
        "Accustomed to twilit forests and the night sky, you have superior vision in dark and dim conditions. You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light. You can't discern color in darkness, only shades of gray.",
    },
    {
      id: 'keen-senses',
      name: 'Keen Senses',
      source: 'Elf',
      description: 'You have proficiency in the Perception skill.',
    },
    {
      id: 'fey-ancestry',
      name: 'Fey Ancestry',
      source: 'Elf',
      description:
        "You have advantage on saving throws against being charmed, and magic can't put you to sleep.",
    },
    {
      id: 'trance',
      name: 'Trance',
      source: 'Elf',
      description:
        'Elves don\'t need to sleep. Instead, they meditate deeply, remaining semiconscious, for 4 hours a day. (The Common word for such meditation is "trance.") While meditating, you can dream after a fashion; such dreams are actually mental exercises that have become reflexive through years of practice. After resting in this way, you gain the same benefit that a human does from 8 hours of sleep.',
    },
  ],

  // SRD 5.1 ships exactly one elf subrace (High Elf). Wood Elf and Dark Elf
  // (Drow) are PHB-only content and were removed.
  subraces: [
    {
      id: 'high-elf',
      name: 'High Elf',
      parentSpeciesId: 'elf',
      source: 'SRD 5.1',

      abilityScoreIncrease: [
        {
          type: 'fixed',
          attributes: { int: 1 },
        },
      ],

      traits: [
        {
          id: 'elf-weapon-training',
          name: 'Elf Weapon Training',
          source: 'High Elf',
          description:
            'You have proficiency with the longsword, shortsword, shortbow, and longbow.',
        },
        {
          id: 'cantrip',
          name: 'Cantrip',
          source: 'High Elf',
          description:
            'You know one cantrip of your choice from the wizard spell list. Intelligence is your spellcasting ability for it.',
        },
        {
          id: 'extra-language',
          name: 'Extra Language',
          source: 'High Elf',
          description: 'You can speak, read, and write one extra language of your choice.',
        },
      ],

      description:
        'As a high elf, you have a keen mind and a mastery of at least the basics of magic.',
    },
  ],

  description:
    'Elves are a magical people of otherworldly grace, living in the world but not entirely part of it.',

  ageInfo:
    'Although elves reach physical maturity at about the same age as humans, the elven understanding of adulthood goes beyond physical growth to encompass worldly experience. An elf typically claims adulthood and an adult name around the age of 100 and can live to be 750 years old.',

  alignmentTendency:
    'Elves love freedom, variety, and self-expression, so they lean strongly toward the gentler aspects of chaos.',

  sizeDescription:
    'Elves range from under 5 to over 6 feet tall and have slender builds. Your size is Medium.',
};
