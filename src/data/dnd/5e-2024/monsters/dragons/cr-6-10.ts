import { Monster } from '../../../../../types/creatures/monsters';

// D&D 5e-2024 Dragons - CR 6-10 (SRD 5.2)
// Young dragons

export const youngRedDragon: Monster = {
  id: 'young-red-dragon-2024',
  name: 'Young Red Dragon',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  size: 'large',
  type: 'dragon',
  alignment: 'chaotic evil',
  armorClass: 18,
  hitPoints: { count: 10, die: 'd10', modifier: 40, notation: '10d10+40' },
  speed: { walk: 40, fly: 80 },
  abilities: { str: 19, dex: 10, con: 17, int: 12, wis: 15, cha: 15 },
  savingThrows: { dex: 3, con: 6, wis: 5, cha: 5 },
  skills: { Perception: 8 },
  damageImmunities: ['fire'],
  senses: ['blindsight 30 ft.', 'darkvision 120 ft.', 'passive Perception 18'],
  languages: ['Common', 'Draconic'],
  challengeRating: 10,
  experiencePoints: 5900,
  specialAbilities: [
    {
      name: 'Legendary Resistance',
      description:
        'If the dragon fails a saving throw, it can choose to succeed instead. It can use this trait three times and regains expended uses when it finishes a long rest.',
    },
  ],
  actions: [
    {
      name: 'Multiattack',
      description: 'The dragon makes three attacks: one bite and two claws.',
    },
    {
      name: 'Bite',
      description:
        'Melee Weapon Attack: +7 to hit, reach 10 ft., one target. Hit: 15 (2d10 + 4) piercing damage plus 7 (2d6) fire damage.',
      attackBonus: 7,
      reach: 10,
      damage: [
        { dice: { count: 2, die: 'd10', modifier: 4, notation: '2d10+4' }, type: 'piercing' },
        { dice: { count: 2, die: 'd6', notation: '2d6' }, type: 'fire' },
      ],
    },
    {
      name: 'Claw',
      description:
        'Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 11 (2d6 + 4) slashing damage.',
      attackBonus: 7,
      reach: 5,
      damage: [{ dice: { count: 2, die: 'd6', modifier: 4, notation: '2d6+4' }, type: 'slashing' }],
    },
    {
      name: 'Fire Breath',
      description:
        'The dragon exhales fire in a 30-foot cone. Each creature in that area must make a DC 14 Dexterity saving throw, taking 56 (16d6) fire damage on a failed save, or half as much on a successful one.',
      savingThrow: { attribute: 'dex', dc: 14, effect: 'half as much damage on a success' },
      damage: [{ dice: { count: 16, die: 'd6', notation: '16d6' }, type: 'fire' }],
    },
  ],
  environment: ['mountain'],
};

export const dragonsCR6to10: Monster[] = [youngRedDragon];
