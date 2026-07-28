import { Monster } from '../../../../../types/creatures/monsters';

// D&D 5e-2024 Dragons - CR 0-5 (SRD 5.2)
// Dragon wyrmlings

export const redDragonWyrmling: Monster = {
  id: 'red-dragon-wyrmling-2024',
  name: 'Red Dragon Wyrmling',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  size: 'medium',
  type: 'dragon',
  alignment: 'chaotic evil',
  armorClass: 17,
  hitPoints: { count: 10, die: 'd8', modifier: 30, notation: '10d8+30' },
  speed: { walk: 30, fly: 60, climb: 30 },
  abilities: { str: 19, dex: 10, con: 17, int: 12, wis: 11, cha: 15 },
  savingThrows: { dex: 2, con: 3, wis: 2, cha: 2 },
  skills: { Perception: 4 },
  damageImmunities: ['fire'],
  senses: ['blindsight 10 ft.', 'darkvision 60 ft.', 'passive Perception 14'],
  languages: ['Draconic'],
  challengeRating: 4,
  experiencePoints: 1100,
  specialAbilities: [
    {
      name: 'Draconic Resilience',
      description: 'The dragon has resistance to fire damage.',
    },
  ],
  actions: [
    {
      name: 'Bite',
      description:
        'Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 7 (1d10 + 2) piercing damage plus 3 (1d6) fire damage.',
    },
    {
      name: 'Fire Breath',
      description:
        'The dragon exhales fire in a 15-foot cone. Each creature in that area must make a DC 11 Dexterity saving throw, taking 22 (5d8) fire damage on a failed save, or half as much on a successful one.',
    },
  ],
  environment: ['mountain'],
};

export const dragonsCR0to5: Monster[] = [redDragonWyrmling];
