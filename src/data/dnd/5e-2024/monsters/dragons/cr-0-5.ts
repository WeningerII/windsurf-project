import { Monster } from '../../../../../types/creatures/monsters';

// D&D 5e-2024 Dragons - CR 0-5 (SRD 5.2)
// Dragon wyrmlings

export const redDragonWyrmling: Monster = {
  id: 'red-dragon-wyrmling-2024',
  name: 'Red Dragon Wyrmling',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  size: 'small',
  type: 'dragon',
  alignment: 'chaotic evil',
  armorClass: 17,
  hitPoints: { count: 4, die: 'd6', modifier: 8, notation: '4d6+8' },
  speed: { walk: 30, fly: 60 },
  abilities: { str: 15, dex: 10, con: 13, int: 8, wis: 11, cha: 10 },
  savingThrows: { dex: 2, con: 3, wis: 2, cha: 2 },
  skills: { Perception: 4 },
  damageImmunities: ['fire'],
  senses: ['blindsight 10 ft.', 'darkvision 60 ft.', 'passive Perception 14'],
  languages: ['Draconic'],
  challengeRating: 3,
  experiencePoints: 700,
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
      attackBonus: 4,
      reach: 5,
      damage: [
        { dice: { count: 1, die: 'd10', modifier: 2, notation: '1d10+2' }, type: 'piercing' },
        { dice: { count: 1, die: 'd6', notation: '1d6' }, type: 'fire' },
      ],
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
