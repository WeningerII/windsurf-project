import { Monster } from '../../../../../types/creatures/monsters';

// D&D 5e-2024 Fiends - CR 11+ (SRD 5.2)
// Demon lords and archdevils

export const balor: Monster = {
  id: 'balor-2024',
  name: 'Balor',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  size: 'huge',
  type: 'fiend',
  alignment: 'chaotic evil',
  armorClass: 19,
  hitPoints: { count: 21, die: 'd12', modifier: 105, notation: '21d12+105' },
  speed: { walk: 40, fly: 80 },
  abilities: { str: 26, dex: 15, con: 22, int: 20, wis: 16, cha: 22 },
  savingThrows: { str: 12, con: 11, wis: 8, cha: 11 },
  damageResistances: ['cold', 'lightning', 'poison', 'bludgeoning', 'piercing', 'slashing'],
  damageImmunities: ['fire'],
  conditionImmunities: ['charmed', 'exhaustion', 'frightened', 'poisoned'],
  senses: ['truesight 120 ft.', 'passive Perception 13'],
  languages: ['Abyssal', 'telepathy 120 ft.'],
  challengeRating: 19,
  experiencePoints: 22000,
  specialAbilities: [
    {
      name: 'Death Throes',
      description:
        'When the balor dies, it explodes, and each creature within 30 feet of it must make a DC 19 Dexterity saving throw, taking 70 (20d6) fire damage on a failed save, or half as much on a successful one.',
    },
    {
      name: 'Fire Aura',
      description:
        "At the start of each of the balor's turns, each creature within 5 feet of it takes 11 (2d10) fire damage, and flammable objects in the aura that aren't being worn or carried ignite. A creature that touches the balor or hits it with a melee attack while within 5 feet of it takes 11 (2d10) fire damage.",
    },
    {
      name: 'Magic Resistance',
      description: 'The balor has advantage on saving throws against spells and magical effects.',
    },
  ],
  actions: [
    {
      name: 'Multiattack',
      description: 'The balor makes two attacks: one with its longsword and one with its whip.',
    },
    {
      name: 'Longsword',
      description:
        'Melee Weapon Attack: +12 to hit, reach 10 ft., one target. Hit: 21 (3d8 + 8) slashing damage plus 11 (2d10) fire damage.',
    },
    {
      name: 'Whip',
      description:
        'Melee Weapon Attack: +12 to hit, reach 30 ft., one target. Hit: 20 (2d10 + 8) slashing damage plus 11 (2d10) fire damage, and the target must succeed on a DC 19 Strength saving throw or be knocked prone.',
    },
  ],
  legendaryActions: [
    {
      name: 'Attack',
      cost: 1,
      description: 'The balor makes one longsword or whip attack.',
    },
  ],
  environment: ['underdark'],
};

export const fiendsCR11Plus: Monster[] = [balor];
