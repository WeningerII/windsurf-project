import { Monster } from '../../../../../types/creatures/monsters';

// D&D 5e-2024 Fey - CR 0-5 (SRD 5.2)
// Pixies, sprites, and other fey

export const pixie: Monster = {
  id: 'pixie-2024',
  name: 'Pixie',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  size: 'tiny',
  type: 'fey',
  alignment: 'chaotic good',
  armorClass: 15,
  hitPoints: { count: 1, die: 'd4', modifier: 1, notation: '1d4+1' },
  speed: { walk: 10, fly: 30 },
  abilities: { str: 3, dex: 18, con: 13, int: 14, wis: 11, cha: 11 },
  skills: { Perception: 2, Stealth: 7 },
  senses: ['passive Perception 12'],
  languages: ['Sylvan'],
  challengeRating: 0.25,
  experiencePoints: 50,
  specialAbilities: [
    {
      name: 'Magic Resistance',
      description: 'The pixie has advantage on saving throws against spells and magical effects.',
    },
    {
      name: 'Innate Spellcasting',
      description: 'The pixie\'s innate spellcasting ability is Charisma (spell save DC 11). It can innately cast the following spells, requiring no material components: At will: druidcraft; 1/day each: confusion, dancing lights, detect magic, detect thoughts, disguise self, dispel magic, entangle, fly, phantasmal force, polymorph, sleep.',
    },
  ],
  actions: [
    {
      name: 'Dagger',
      description: 'Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 6 (1d4 + 4) piercing damage.',
    },
    {
      name: 'Polymorph',
      description: 'One creature the pixie can see within 30 feet of it must make a DC 11 Wisdom saving throw or be magically polymorphed into a sheep, pig, or goat for up to 1 hour. The target can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If the target is unwilling, it has advantage on the saving throw.',
    },
  ],
  environment: ['forest'],
};

export const feyCR0to5: Monster[] = [
  pixie,
];
