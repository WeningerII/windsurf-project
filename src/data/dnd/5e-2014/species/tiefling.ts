import { Species } from '../../../../types/character-options/species';

export const tiefling: Species = {
  id: 'tiefling',
  name: 'Tiefling',
  system: 'dnd-5e-2014',
  source: 'SRD 5.1',

  abilityScoreIncrease: [
    {
      type: 'fixed',
      attributes: {
        int: 1,
        cha: 2,
      },
    },
  ],

  size: 'medium',
  speed: 30,

  languages: {
    automatic: ['Common', 'Infernal'],
  },

  traits: [
    {
      id: 'darkvision-tiefling',
      name: 'Darkvision',
      source: 'Tiefling',
      description:
        "Thanks to your infernal heritage, you have superior vision in dark and dim conditions. You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light. You can't discern color in darkness, only shades of gray.",
    },
    {
      id: 'hellish-resistance',
      name: 'Hellish Resistance',
      source: 'Tiefling',
      description: 'You have resistance to fire damage.',
    },
    {
      id: 'infernal-legacy',
      name: 'Infernal Legacy',
      source: 'Tiefling',
      description:
        'You know the thaumaturgy cantrip. When you reach 3rd level, you can cast the hellish rebuke spell as a 2nd-level spell once with this trait and regain the ability to do so when you finish a long rest. When you reach 5th level, you can cast the darkness spell once with this trait and regain the ability to do so when you finish a long rest. Charisma is your spellcasting ability for these spells.',
    },
  ],

  description:
    'To be greeted with stares and whispers, to suffer violence and insult on the street, to see mistrust and fear in every eye: this is the lot of the tiefling.',

  ageInfo: 'Tieflings mature at the same rate as humans but live a few years longer.',

  alignmentTendency:
    'Tieflings might not have an innate tendency toward evil, but many of them end up there. Evil or not, an independent nature inclines many tieflings toward a chaotic alignment.',

  sizeDescription: 'Tieflings are about the same size and build as humans. Your size is Medium.',
};
