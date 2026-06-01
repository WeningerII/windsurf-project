import { Monster } from '../../../../../types/creatures/monsters';

// D&D 5e-2024 Dragons - CR 11+ (SRD 5.2)
// Adult and ancient dragons

export const adultRedDragon: Monster = {
  id: 'adult-red-dragon-2024',
  name: 'Adult Red Dragon',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  size: 'huge',
  type: 'dragon',
  alignment: 'chaotic evil',
  armorClass: 19,
  hitPoints: { count: 19, die: 'd12', modifier: 95, notation: '19d12+95' },
  speed: { walk: 40, fly: 80 },
  abilities: { str: 27, dex: 10, con: 25, int: 16, wis: 13, cha: 21 },
  savingThrows: { dex: 4, con: 12, wis: 5, cha: 9 },
  skills: { Perception: 9 },
  damageImmunities: ['fire'],
  senses: ['blindsight 60 ft.', 'darkvision 120 ft.', 'passive Perception 19'],
  languages: ['Common', 'Draconic'],
  challengeRating: 17,
  experiencePoints: 18000,
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
      description:
        'The dragon can use its Frightful Presence. It then makes three attacks: one bite and two claws.',
    },
    {
      name: 'Bite',
      description:
        'Melee Weapon Attack: +11 to hit, reach 15 ft., one target. Hit: 19 (2d10 + 8) piercing damage plus 11 (2d10) fire damage.',
      attackBonus: 11,
      reach: 15,
      damage: [
        { dice: { count: 2, die: 'd10', modifier: 8, notation: '2d10+8' }, type: 'piercing' },
        { dice: { count: 2, die: 'd10', notation: '2d10' }, type: 'fire' },
      ],
    },
    {
      name: 'Claw',
      description:
        'Melee Weapon Attack: +11 to hit, reach 10 ft., one target. Hit: 15 (2d8 + 8) slashing damage.',
      attackBonus: 11,
      reach: 10,
      damage: [{ dice: { count: 2, die: 'd8', modifier: 8, notation: '2d8+8' }, type: 'slashing' }],
    },
    {
      name: 'Tail',
      description:
        'Melee Weapon Attack: +11 to hit, reach 20 ft., one target. Hit: 17 (2d10 + 8) bludgeoning damage.',
      attackBonus: 11,
      reach: 20,
      damage: [
        { dice: { count: 2, die: 'd10', modifier: 8, notation: '2d10+8' }, type: 'bludgeoning' },
      ],
    },
    {
      name: 'Frightful Presence',
      description:
        "Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 17 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature's saving throw is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours.",
    },
    {
      name: 'Fire Breath',
      description:
        'The dragon exhales fire in a 90-foot cone. Each creature in that area must make a DC 19 Dexterity saving throw, taking 66 (12d8) fire damage on a failed save, or half as much on a successful one.',
    },
  ],
  legendaryActions: [
    {
      name: 'Detect',
      cost: 1,
      description: 'The dragon makes a Wisdom (Perception) check.',
    },
    {
      name: 'Tail',
      cost: 1,
      description: 'The dragon makes a tail attack.',
    },
    {
      name: 'Wing Attack',
      cost: 2,
      description:
        'The dragon beats its wings. Each creature within 15 feet of the dragon must succeed on a DC 19 Dexterity saving throw or take 15 (2d6 + 8) bludgeoning damage and be knocked prone. The dragon can then fly up to half its flying speed.',
    },
  ],
  environment: ['mountain'],
};

export const ancientRedDragon: Monster = {
  id: 'ancient-red-dragon-2024',
  name: 'Ancient Red Dragon',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  size: 'gargantuan',
  type: 'dragon',
  alignment: 'chaotic evil',
  armorClass: 22,
  hitPoints: { count: 25, die: 'd12', modifier: 200, notation: '25d12+200' },
  speed: { walk: 40, fly: 80 },
  abilities: { str: 30, dex: 14, con: 26, int: 18, wis: 15, cha: 23 },
  savingThrows: { dex: 7, con: 13, wis: 6, cha: 10 },
  skills: { Perception: 10 },
  damageImmunities: ['fire'],
  senses: ['blindsight 60 ft.', 'darkvision 120 ft.', 'passive Perception 20'],
  languages: ['Common', 'Draconic'],
  challengeRating: 24,
  experiencePoints: 50000,
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
      description:
        'The dragon can use its Frightful Presence. It then makes three attacks: one bite and two claws.',
    },
    {
      name: 'Bite',
      description:
        'Melee Weapon Attack: +15 to hit, reach 20 ft., one target. Hit: 25 (3d10 + 10) piercing damage plus 13 (2d10) fire damage.',
      attackBonus: 15,
      reach: 20,
      damage: [
        { dice: { count: 3, die: 'd10', modifier: 10, notation: '3d10+10' }, type: 'piercing' },
        { dice: { count: 2, die: 'd10', notation: '2d10' }, type: 'fire' },
      ],
    },
    {
      name: 'Claw',
      description:
        'Melee Weapon Attack: +15 to hit, reach 15 ft., one target. Hit: 20 (3d8 + 10) slashing damage.',
      attackBonus: 15,
      reach: 15,
      damage: [
        { dice: { count: 3, die: 'd8', modifier: 10, notation: '3d8+10' }, type: 'slashing' },
      ],
    },
    {
      name: 'Tail',
      description:
        'Melee Weapon Attack: +15 to hit, reach 25 ft., one target. Hit: 22 (3d10 + 10) bludgeoning damage.',
      attackBonus: 15,
      reach: 25,
      damage: [
        { dice: { count: 3, die: 'd10', modifier: 10, notation: '3d10+10' }, type: 'bludgeoning' },
      ],
    },
    {
      name: 'Frightful Presence',
      description:
        "Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 20 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature's saving throw is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours.",
    },
    {
      name: 'Fire Breath',
      description:
        'The dragon exhales fire in a 120-foot cone. Each creature in that area must make a DC 22 Dexterity saving throw, taking 91 (16d8) fire damage on a failed save, or half as much on a successful one.',
    },
  ],
  legendaryActions: [
    {
      name: 'Detect',
      cost: 1,
      description: 'The dragon makes a Wisdom (Perception) check.',
    },
    {
      name: 'Tail',
      cost: 1,
      description: 'The dragon makes a tail attack.',
    },
    {
      name: 'Wing Attack',
      cost: 2,
      description:
        'The dragon beats its wings. Each creature within 20 feet of the dragon must succeed on a DC 22 Dexterity saving throw or take 20 (3d6 + 10) bludgeoning damage and be knocked prone. The dragon can then fly up to half its flying speed.',
    },
  ],
  environment: ['mountain'],
};

export const dragonsCR11Plus: Monster[] = [adultRedDragon, ancientRedDragon];
