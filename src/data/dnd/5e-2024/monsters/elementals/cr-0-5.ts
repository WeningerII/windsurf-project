import { Monster } from '../../../../../types/creatures/monsters';

// D&D 5e-2024 Elementals - CR 0-5 (SRD 5.2)
// Air, earth, fire, and water elementals

export const airElemental: Monster = {
  id: 'air-elemental-2024',
  name: 'Air Elemental',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  size: 'large',
  type: 'elemental',
  alignment: 'unaligned',
  armorClass: 18,
  hitPoints: { count: 5, die: 'd10', modifier: 10, notation: '5d10+10' },
  speed: { fly: 90 },
  abilities: { str: 14, dex: 20, con: 14, int: 6, wis: 10, cha: 6 },
  damageResistances: ['bludgeoning', 'piercing', 'slashing'],
  damageImmunities: ['poison'],
  conditionImmunities: [
    'charmed',
    'exhaustion',
    'frightened',
    'grappled',
    'paralyzed',
    'petrified',
    'poisoned',
    'prone',
    'restrained',
  ],
  senses: ['darkvision 60 ft.', 'passive Perception 12'],
  languages: ['Aquan'],
  challengeRating: 5,
  experiencePoints: 1800,
  specialAbilities: [
    {
      name: 'Air Form',
      description:
        "The elemental can enter a hostile creature's space and stop there. It can move through a space as narrow as 1 inch wide.",
    },
    {
      name: 'Whirlwind',
      description:
        'The elemental can create a 10-foot radius, 30-foot high cylinder of swirling air lasting for 1 minute.',
    },
  ],
  actions: [
    {
      name: 'Multiattack',
      description: 'The elemental makes two slam attacks.',
    },
    {
      name: 'Slam',
      description:
        'Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 13 (2d8 + 4) bludgeoning damage.',
      attackBonus: 7,
      reach: 5,
      damage: [
        { dice: { count: 2, die: 'd8', modifier: 4, notation: '2d8+4' }, type: 'bludgeoning' },
      ],
    },
  ],
  environment: ['coastal', 'grassland'],
};

export const earthElemental: Monster = {
  id: 'earth-elemental-2024',
  name: 'Earth Elemental',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  size: 'large',
  type: 'elemental',
  alignment: 'unaligned',
  armorClass: 18,
  hitPoints: { count: 5, die: 'd10', modifier: 10, notation: '5d10+10' },
  speed: { walk: 30, burrow: 60 },
  abilities: { str: 19, dex: 8, con: 16, int: 6, wis: 10, cha: 6 },
  damageResistances: ['bludgeoning', 'piercing', 'slashing'],
  damageImmunities: ['poison'],
  conditionImmunities: [
    'charmed',
    'exhaustion',
    'frightened',
    'grappled',
    'paralyzed',
    'petrified',
    'poisoned',
    'prone',
    'restrained',
  ],
  senses: ['darkvision 60 ft.', 'passive Perception 10'],
  languages: ['Terran'],
  challengeRating: 5,
  experiencePoints: 1800,
  specialAbilities: [
    {
      name: 'Earth Form',
      description:
        "The elemental can enter a hostile creature's space and stop there. It can move through a space as narrow as 1 inch wide.",
    },
    {
      name: 'Earth Glide',
      description: 'The elemental can burrow through nonmagical, unworked earth and stone.',
    },
  ],
  actions: [
    {
      name: 'Multiattack',
      description: 'The elemental makes two slam attacks.',
    },
    {
      name: 'Slam',
      description:
        'Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 13 (2d8 + 4) bludgeoning damage.',
      attackBonus: 7,
      reach: 5,
      damage: [
        { dice: { count: 2, die: 'd8', modifier: 4, notation: '2d8+4' }, type: 'bludgeoning' },
      ],
    },
  ],
  environment: ['cave', 'mountain'],
};

export const fireElemental: Monster = {
  id: 'fire-elemental-2024',
  name: 'Fire Elemental',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  size: 'large',
  type: 'elemental',
  alignment: 'unaligned',
  armorClass: 15,
  hitPoints: { count: 6, die: 'd10', modifier: 12, notation: '6d10+12' },
  speed: { walk: 50 },
  abilities: { str: 10, dex: 17, con: 16, int: 6, wis: 10, cha: 7 },
  damageResistances: ['bludgeoning', 'piercing', 'slashing'],
  damageImmunities: ['fire', 'poison'],
  conditionImmunities: [
    'charmed',
    'exhaustion',
    'frightened',
    'grappled',
    'paralyzed',
    'petrified',
    'poisoned',
    'prone',
    'restrained',
  ],
  senses: ['darkvision 60 ft.', 'passive Perception 10'],
  languages: ['Ignan'],
  challengeRating: 5,
  experiencePoints: 1800,
  specialAbilities: [
    {
      name: 'Fire Form',
      description:
        "The elemental can enter a hostile creature's space and stop there. It can move through a space as narrow as 1 foot wide.",
    },
    {
      name: 'Illumination',
      description:
        'The elemental sheds bright light in a 30-foot radius and dim light in an additional 30 feet.',
    },
    {
      name: 'Water Susceptibility',
      description:
        'For every 5 feet the elemental moves in water, or for every gallon of water splashed on it, it takes 1 cold damage.',
    },
  ],
  actions: [
    {
      name: 'Multiattack',
      description: 'The elemental makes two touch attacks.',
    },
    {
      name: 'Touch',
      description:
        'Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 10 (2d6 + 3) fire damage. If the target is a creature or a flammable object, it ignites. If not dealt with, the fire spreads.',
      attackBonus: 5,
      reach: 5,
      damage: [{ dice: { count: 2, die: 'd6', modifier: 3, notation: '2d6+3' }, type: 'fire' }],
    },
  ],
  environment: ['underdark', 'volcano'],
};

export const waterElemental: Monster = {
  id: 'water-elemental-2024',
  name: 'Water Elemental',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  size: 'large',
  type: 'elemental',
  alignment: 'unaligned',
  armorClass: 14,
  hitPoints: { count: 5, die: 'd10', modifier: 10, notation: '5d10+10' },
  speed: { swim: 90 },
  abilities: { str: 16, dex: 14, con: 14, int: 6, wis: 10, cha: 6 },
  damageResistances: ['bludgeoning', 'piercing', 'slashing'],
  damageImmunities: ['poison'],
  conditionImmunities: [
    'charmed',
    'exhaustion',
    'frightened',
    'grappled',
    'paralyzed',
    'petrified',
    'poisoned',
    'prone',
    'restrained',
  ],
  senses: ['darkvision 60 ft.', 'passive Perception 12'],
  languages: ['Aquan'],
  challengeRating: 5,
  experiencePoints: 1800,
  specialAbilities: [
    {
      name: 'Water Form',
      description:
        "The elemental can enter a hostile creature's space and stop there. It can move through a space as narrow as 1 inch wide.",
    },
    {
      name: 'Freezing Fog',
      description:
        'The elemental creates a 20-foot radius sphere of magical fog lasting for 1 minute.',
    },
    {
      name: 'Water Susceptibility',
      description: 'The elemental has advantage on Strength checks against creatures in the area.',
    },
  ],
  actions: [
    {
      name: 'Multiattack',
      description: 'The elemental makes two slam attacks.',
    },
    {
      name: 'Slam',
      description:
        'Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 13 (2d8 + 4) bludgeoning damage.',
      attackBonus: 5,
      reach: 5,
      damage: [
        { dice: { count: 2, die: 'd8', modifier: 4, notation: '2d8+4' }, type: 'bludgeoning' },
      ],
    },
  ],
  environment: ['coastal', 'ocean'],
};

export const elementalsCR0to5: Monster[] = [
  airElemental,
  earthElemental,
  fireElemental,
  waterElemental,
];
