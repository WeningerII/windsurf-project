import { Monster } from '../../../../../types/creatures/monsters';

// D&D 5e-2024 Beasts - CR 6-10 (SRD 5.2)
// Large and powerful beasts

export const giantApe: Monster = {
  id: 'giant-ape-2024',
  name: 'Giant Ape',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  size: 'huge',
  type: 'beast',
  alignment: 'unaligned',
  armorClass: 12,
  hitPoints: { count: 19, die: 'd12', modifier: 76, notation: '19d12+76' },
  speed: { walk: 40, climb: 40 },
  abilities: { str: 23, dex: 14, con: 18, int: 7, wis: 12, cha: 7 },
  skills: { Athletics: 9, Perception: 4 },
  senses: ['passive Perception 14'],
  languages: [],
  challengeRating: 7,
  experiencePoints: 2900,
  actions: [
    {
      name: 'Multiattack',
      description: 'The ape makes two fist attacks.',
    },
    {
      name: 'Fist',
      description:
        'Melee Weapon Attack: +9 to hit, reach 10 ft., one target. Hit: 22 (3d10 + 6) bludgeoning damage.',
      attackBonus: 9,
      reach: 10,
      damage: [
        { dice: { count: 3, die: 'd10', modifier: 6, notation: '3d10+6' }, type: 'bludgeoning' },
      ],
    },
    {
      name: 'Rock',
      description:
        'Ranged Weapon Attack: +9 to hit, range 50/100 ft., one target. Hit: 30 (7d6 + 6) bludgeoning damage.',
      attackBonus: 9,
      reach: 50,
      damage: [
        { dice: { count: 7, die: 'd6', modifier: 6, notation: '7d6+6' }, type: 'bludgeoning' },
      ],
    },
  ],
  environment: ['jungle', 'forest'],
};

export const mammoth: Monster = {
  id: 'mammoth-2024',
  name: 'Mammoth',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  size: 'huge',
  type: 'beast',
  alignment: 'unaligned',
  armorClass: 13,
  hitPoints: { count: 15, die: 'd12', modifier: 60, notation: '15d12+60' },
  speed: { walk: 40 },
  abilities: { str: 24, dex: 9, con: 21, int: 3, wis: 11, cha: 6 },
  senses: ['passive Perception 10'],
  languages: [],
  challengeRating: 6,
  experiencePoints: 2300,
  specialAbilities: [
    {
      name: 'Trampling Charge',
      description:
        'If the mammoth moves at least 20 feet straight toward a creature and then hits it with a gore attack on the same turn, that target must succeed on a DC 18 Strength saving throw or be knocked prone. If the target is prone, the mammoth can make one stomp attack against it as a bonus action.',
    },
  ],
  actions: [
    {
      name: 'Gore',
      description:
        'Melee Weapon Attack: +10 to hit, reach 10 ft., one target. Hit: 25 (4d8 + 7) piercing damage.',
      attackBonus: 10,
      reach: 10,
      damage: [{ dice: { count: 4, die: 'd8', modifier: 7, notation: '4d8+7' }, type: 'piercing' }],
    },
    {
      name: 'Stomp',
      description:
        'Melee Weapon Attack: +10 to hit, reach 5 ft., one prone creature. Hit: 29 (4d10 + 7) bludgeoning damage.',
      attackBonus: 10,
      reach: 5,
      damage: [
        { dice: { count: 4, die: 'd10', modifier: 7, notation: '4d10+7' }, type: 'bludgeoning' },
      ],
    },
  ],
  environment: ['arctic', 'grassland'],
};

export const giantCrocodile: Monster = {
  id: 'giant-crocodile-2024',
  name: 'Giant Crocodile',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  size: 'huge',
  type: 'beast',
  alignment: 'unaligned',
  armorClass: 14,
  hitPoints: { count: 9, die: 'd12', modifier: 27, notation: '9d12+27' },
  speed: { walk: 30, swim: 50 },
  abilities: { str: 21, dex: 9, con: 17, int: 2, wis: 10, cha: 7 },
  skills: { Stealth: 5 },
  senses: ['passive Perception 10'],
  languages: [],
  challengeRating: 5,
  experiencePoints: 1800,
  specialAbilities: [
    {
      name: 'Hold Breath',
      description: 'The crocodile can hold its breath for 30 minutes.',
    },
  ],
  actions: [
    {
      name: 'Multiattack',
      description: 'The crocodile makes two attacks: one with its bite and one with its tail.',
    },
    {
      name: 'Bite',
      description:
        "Melee Weapon Attack: +8 to hit, reach 5 ft., one target. Hit: 21 (3d10 + 5) piercing damage, and the target is grappled (escape DC 16). Until this grapple ends, the target is restrained, and the crocodile can't bite another target.",
      attackBonus: 8,
      reach: 5,
      damage: [
        { dice: { count: 3, die: 'd10', modifier: 5, notation: '3d10+5' }, type: 'piercing' },
      ],
    },
    {
      name: 'Tail',
      description:
        'Melee Weapon Attack: +8 to hit, reach 10 ft., one target not grappled by the crocodile. Hit: 14 (2d8 + 5) bludgeoning damage. If the target is a creature, it must succeed on a DC 16 Strength saving throw or be knocked prone.',
      attackBonus: 8,
      reach: 10,
      damage: [
        { dice: { count: 2, die: 'd8', modifier: 5, notation: '2d8+5' }, type: 'bludgeoning' },
      ],
    },
  ],
  environment: ['swamp', 'water'],
};

export const hunterShark: Monster = {
  id: 'hunter-shark-2024',
  name: 'Hunter Shark',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  size: 'large',
  type: 'beast',
  alignment: 'unaligned',
  armorClass: 12,
  hitPoints: { count: 6, die: 'd10', modifier: 12, notation: '6d10+12' },
  speed: { walk: 0, swim: 40 },
  abilities: { str: 18, dex: 13, con: 15, int: 1, wis: 10, cha: 4 },
  skills: { Perception: 2 },
  senses: ['blindsight 30 ft.', 'passive Perception 12'],
  languages: [],
  challengeRating: 2,
  experiencePoints: 450,
  specialAbilities: [
    {
      name: 'Blood Frenzy',
      description:
        "The shark has advantage on melee attack rolls against any creature that doesn't have all its hit points.",
    },
    {
      name: 'Water Breathing',
      description: 'The shark can breathe only underwater.',
    },
  ],
  actions: [
    {
      name: 'Bite',
      description:
        'Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 13 (2d8 + 4) piercing damage.',
      attackBonus: 6,
      reach: 5,
      damage: [{ dice: { count: 2, die: 'd8', modifier: 4, notation: '2d8+4' }, type: 'piercing' }],
    },
  ],
  environment: ['water'],
};

export const polarBear: Monster = {
  id: 'polar-bear-2024',
  name: 'Polar Bear',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  size: 'large',
  type: 'beast',
  alignment: 'unaligned',
  armorClass: 12,
  hitPoints: { count: 5, die: 'd10', modifier: 15, notation: '5d10+15' },
  speed: { walk: 40, swim: 30 },
  abilities: { str: 20, dex: 10, con: 16, int: 2, wis: 13, cha: 7 },
  skills: { Perception: 3 },
  senses: ['passive Perception 13'],
  languages: [],
  challengeRating: 2,
  experiencePoints: 450,
  specialAbilities: [
    {
      name: 'Keen Smell',
      description: 'The bear has advantage on Wisdom (Perception) checks that rely on smell.',
    },
  ],
  actions: [
    {
      name: 'Multiattack',
      description: 'The bear makes two attacks: one with its bite and one with its claws.',
    },
    {
      name: 'Bite',
      description:
        'Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 9 (1d8 + 5) piercing damage.',
      attackBonus: 7,
      reach: 5,
      damage: [{ dice: { count: 1, die: 'd8', modifier: 5, notation: '1d8+5' }, type: 'piercing' }],
    },
    {
      name: 'Claws',
      description:
        'Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 12 (2d6 + 5) slashing damage.',
      attackBonus: 7,
      reach: 5,
      damage: [{ dice: { count: 2, die: 'd6', modifier: 5, notation: '2d6+5' }, type: 'slashing' }],
    },
  ],
  environment: ['arctic'],
};

export const rhinoceros: Monster = {
  id: 'rhinoceros-2024',
  name: 'Rhinoceros',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  size: 'large',
  type: 'beast',
  alignment: 'unaligned',
  armorClass: 11,
  hitPoints: { count: 6, die: 'd10', modifier: 12, notation: '6d10+12' },
  speed: { walk: 40 },
  abilities: { str: 21, dex: 8, con: 15, int: 2, wis: 12, cha: 6 },
  senses: ['passive Perception 11'],
  languages: [],
  challengeRating: 2,
  experiencePoints: 450,
  specialAbilities: [
    {
      name: 'Charge',
      description:
        'If the rhinoceros moves at least 20 feet straight toward a target and then hits it with a gore attack on the same turn, the target takes an extra 9 (2d8) bludgeoning damage. If the target is a creature, it must succeed on a DC 15 Strength saving throw or be knocked prone.',
    },
  ],
  actions: [
    {
      name: 'Gore',
      description:
        'Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 14 (2d8 + 5) bludgeoning damage.',
      attackBonus: 7,
      reach: 5,
      damage: [
        { dice: { count: 2, die: 'd8', modifier: 5, notation: '2d8+5' }, type: 'bludgeoning' },
      ],
    },
  ],
  environment: ['grassland'],
};

export const saberToothedTiger: Monster = {
  id: 'saber-toothed-tiger-2024',
  name: 'Saber-Toothed Tiger',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  size: 'large',
  type: 'beast',
  alignment: 'unaligned',
  armorClass: 12,
  hitPoints: { count: 7, die: 'd10', modifier: 14, notation: '7d10+14' },
  speed: { walk: 40 },
  abilities: { str: 18, dex: 14, con: 15, int: 3, wis: 12, cha: 8 },
  skills: { Perception: 3, Stealth: 6 },
  senses: ['passive Perception 13'],
  languages: [],
  challengeRating: 2,
  experiencePoints: 450,
  specialAbilities: [
    {
      name: 'Keen Smell',
      description: 'The tiger has advantage on Wisdom (Perception) checks that rely on smell.',
    },
    {
      name: 'Pounce',
      description:
        'If the tiger moves at least 20 feet straight toward a creature and then hits it with a claw attack on the same turn, that target must succeed on a DC 14 Strength saving throw or be knocked prone. If the target is prone, the tiger can make one bite attack against it as a bonus action.',
    },
  ],
  actions: [
    {
      name: 'Bite',
      description:
        'Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 10 (1d10 + 5) piercing damage.',
      attackBonus: 6,
      reach: 5,
      damage: [
        { dice: { count: 1, die: 'd10', modifier: 5, notation: '1d10+5' }, type: 'piercing' },
      ],
    },
    {
      name: 'Claw',
      description:
        'Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 12 (2d6 + 5) slashing damage.',
      attackBonus: 6,
      reach: 5,
      damage: [{ dice: { count: 2, die: 'd6', modifier: 5, notation: '2d6+5' }, type: 'slashing' }],
    },
  ],
  environment: ['arctic', 'mountain'],
};

export const giantElk: Monster = {
  id: 'giant-elk-2024',
  name: 'Giant Elk',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  size: 'huge',
  type: 'beast',
  alignment: 'unaligned',
  armorClass: 14,
  hitPoints: { count: 8, die: 'd12', modifier: 24, notation: '8d12+24' },
  speed: { walk: 60 },
  abilities: { str: 19, dex: 16, con: 14, int: 7, wis: 14, cha: 10 },
  skills: { Perception: 4 },
  senses: ['passive Perception 14'],
  languages: ['Giant Elk', "understands Common, Elvish, and Sylvan but can't speak"],
  challengeRating: 2,
  experiencePoints: 450,
  specialAbilities: [
    {
      name: 'Charge',
      description:
        'If the elk moves at least 20 feet straight toward a target and then hits it with a ram attack on the same turn, the target takes an extra 7 (2d6) damage. If the target is a creature, it must succeed on a DC 14 Strength saving throw or be knocked prone.',
    },
  ],
  actions: [
    {
      name: 'Ram',
      description:
        'Melee Weapon Attack: +6 to hit, reach 10 ft., one target. Hit: 11 (2d6 + 4) bludgeoning damage.',
      attackBonus: 6,
      reach: 10,
      damage: [
        { dice: { count: 2, die: 'd6', modifier: 4, notation: '2d6+4' }, type: 'bludgeoning' },
      ],
    },
    {
      name: 'Hooves',
      description:
        'Melee Weapon Attack: +6 to hit, reach 5 ft., one prone creature. Hit: 22 (4d8 + 4) bludgeoning damage.',
      attackBonus: 6,
      reach: 5,
      damage: [
        { dice: { count: 4, die: 'd8', modifier: 4, notation: '4d8+4' }, type: 'bludgeoning' },
      ],
    },
  ],
  environment: ['forest', 'grassland'],
};

export const beastsCR6to10: Monster[] = [
  giantApe,
  mammoth,
  giantCrocodile,
  hunterShark,
  polarBear,
  rhinoceros,
  saberToothedTiger,
  giantElk,
];
