import { Monster } from '../../../../../types/creatures/monsters';

// D&D 5e-2024 Fey - CR 6-10 (SRD 5.2)
// Powerful fey lords

export const dryad: Monster = {
  id: 'dryad-2024',
  name: 'Dryad',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  size: 'medium',
  type: 'fey',
  alignment: 'true neutral',
  armorClass: 14,
  hitPoints: { count: 8, die: 'd8', modifier: 16, notation: '8d8+16' },
  speed: { walk: 30 },
  abilities: { str: 10, dex: 12, con: 13, int: 14, wis: 15, cha: 12 },
  skills: { Perception: 4, Stealth: 3 },
  senses: ['darkvision 60 ft.', 'passive Perception 14'],
  languages: ['Sylvan'],
  challengeRating: 1,
  experiencePoints: 200,
  specialAbilities: [
    {
      name: 'Innate Spellcasting',
      description: 'The dryad\'s innate spellcasting ability is Wisdom (spell save DC 12). It can innately cast the following spells, requiring no material components: At will: druidcraft; 3/day each: entangle, goodberry.',
    },
    {
      name: 'Tree Stride',
      description: 'Once on her turn, the dryad can use 10 feet of her movement to step magically into one living tree within her reach and emerge from a living tree within 60 feet of it, appearing in an unoccupied space within 5 feet of the second tree. Both trees must be Large or bigger.',
    },
  ],
  actions: [
    {
      name: 'Quarterstaff',
      description: 'Melee Weapon Attack: +2 to hit, reach 5 ft., one target. Hit: 2 (1d6 - 1) bludgeoning damage, or 3 (1d8 - 1) bludgeoning damage if used with two hands.',
    },
  ],
  environment: ['forest'],
};

export const feyCR6to10: Monster[] = [
  dryad,
];
