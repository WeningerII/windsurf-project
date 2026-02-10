import { Species } from '../../../../types/character-options/species';

export const gnome: Species = {
  id: 'gnome',
  name: 'Gnome',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  
  abilityScoreIncrease: [
    {
      type: 'fixed',
      attributes: { int: 2 },
    },
  ],
  
  size: 'small',
  speed: 30,
  
  languages: {
    automatic: ['Common', 'Gnomish'],
  },
  
  traits: [
    {
      id: 'darkvision-gnome',
      name: 'Darkvision',
      source: 'Gnome',
      description: 'You have Darkvision with a range of 60 feet.',
    },
    {
      id: 'gnomish-cunning',
      name: 'Gnomish Cunning',
      source: 'Gnome',
      description: 'You have Advantage on Intelligence, Wisdom, and Charisma saving throws.',
    },
    {
      id: 'gnomish-lineage',
      name: 'Gnomish Lineage',
      source: 'Gnome',
      description: 'You are part of a gnomish lineage that grants you supernatural abilities. Choose one of the following options: Forest Gnome (you know the Minor Illusion cantrip) or Rock Gnome (you have proficiency with Artisan\'s Tools of your choice).',
    },
  ],
  
  description: 'A gnome\'s energy and enthusiasm for living shines through every inch of their tiny body.',
  
  ageInfo: 'Gnomes mature at the same rate humans do, and most are expected to settle down into an adult life by around age 40. They can live 350 to almost 500 years.',
  
  alignmentTendency: 'Gnomes are most often good.',
  
  sizeDescription: 'Gnomes are between 3 and 4 feet tall and average about 40 pounds. Your size is Small.',
};
