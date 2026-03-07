import { Species } from '../../../../types/character-options/species';

export const tiefling: Species = {
  id: 'tiefling',
  name: 'Tiefling',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',

  abilityScoreIncrease: [
    {
      type: 'fixed',
      attributes: { cha: 2, int: 1 },
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
      description: 'You have Darkvision with a range of 60 feet.',
    },
    {
      id: 'fiendish-legacy',
      name: 'Fiendish Legacy',
      source: 'Tiefling',
      description:
        "You are the recipient of a fiendish legacy that grants you supernatural abilities. Choose a legacy from the Fiendish Legacies table: Abyssal, Chthonic, or Infernal. You gain the 1st-level benefit of the chosen legacy. Starting at 3rd level and again at 5th level, you gain the ability to cast a higher-level spell with this trait. Once you cast the spell with this trait, you can't cast that spell with it again until you finish a Long Rest; however, you can cast the spell using any spell slots you have of the appropriate level.",
    },
    {
      id: 'otherworldly-presence',
      name: 'Otherworldly Presence',
      source: 'Tiefling',
      description:
        'You know the Thaumaturgy cantrip. When you cast it with this trait, the spell uses your spellcasting ability if you have one, or Charisma otherwise.',
    },
  ],

  description:
    'To be greeted with stares and whispers, to suffer violence and insult on the street, to see mistrust and fear in every eye: this is the lot of the tiefling.',

  ageInfo: 'Tieflings mature at the same rate as humans but live a few years longer.',

  alignmentTendency:
    'Tieflings might not have an innate tendency toward evil, but many of them end up there.',

  sizeDescription: 'Tieflings are about the same size and build as humans. Your size is Medium.',
};
