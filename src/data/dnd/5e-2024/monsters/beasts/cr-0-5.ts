import { Monster } from '../../../../../types/creatures/monsters';

// D&D 5e-2024 Beasts - CR 0-5 (SRD 5.2)
// Common animals and natural creatures

export const wolf: Monster = {
  id: 'wolf-2024',
  name: 'Wolf',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  size: 'medium',
  type: 'beast',
  alignment: 'unaligned',
  armorClass: 13,
  hitPoints: { count: 2, die: 'd8', modifier: 2, notation: '2d8+2' },
  speed: { walk: 40 },
  abilities: { str: 12, dex: 15, con: 12, int: 3, wis: 12, cha: 6 },
  skills: { Perception: 3, Stealth: 4 },
  senses: ['darkvision 60 ft.', 'passive Perception 13'],
  languages: [],
  challengeRating: 0.25,
  experiencePoints: 50,
  specialAbilities: [
    {
      name: 'Keen Hearing and Smell',
      description:
        'The wolf has advantage on Wisdom (Perception) checks that rely on hearing or smell.',
    },
    {
      name: 'Pack Tactics',
      description:
        "The wolf has advantage on attack rolls against a creature if at least one of the wolf's allies is within 5 feet of the creature and the ally isn't incapacitated.",
    },
  ],
  actions: [
    {
      name: 'Bite',
      description:
        'Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 7 (2d4 + 2) piercing damage. If the target is a creature, it must succeed on a DC 11 Strength saving throw or be knocked prone.',
    },
  ],
  environment: ['forest', 'grassland', 'hill'],
};

export const direwolf: Monster = {
  id: 'direwolf-2024',
  name: 'Dire Wolf',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  size: 'large',
  type: 'beast',
  alignment: 'unaligned',
  armorClass: 14,
  hitPoints: { count: 5, die: 'd10', modifier: 10, notation: '5d10+10' },
  speed: { walk: 50 },
  abilities: { str: 17, dex: 15, con: 15, int: 3, wis: 12, cha: 7 },
  skills: { Perception: 3, Stealth: 4 },
  senses: ['darkvision 60 ft.', 'passive Perception 13'],
  languages: [],
  challengeRating: 1,
  experiencePoints: 200,
  specialAbilities: [
    {
      name: 'Keen Hearing and Smell',
      description:
        'The wolf has advantage on Wisdom (Perception) checks that rely on hearing or smell.',
    },
    {
      name: 'Pack Tactics',
      description:
        "The wolf has advantage on attack rolls against a creature if at least one of the wolf's allies is within 5 feet of the creature and the ally isn't incapacitated.",
    },
  ],
  actions: [
    {
      name: 'Bite',
      description:
        'Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 10 (2d6 + 3) piercing damage. If the target is a creature, it must succeed on a DC 13 Strength saving throw or be knocked prone.',
    },
  ],
  environment: ['forest', 'hill'],
};

export const brownBear: Monster = {
  id: 'brown-bear-2024',
  name: 'Brown Bear',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  size: 'large',
  type: 'beast',
  alignment: 'unaligned',
  armorClass: 11,
  hitPoints: { count: 4, die: 'd10', modifier: 12, notation: '4d10+12' },
  speed: { walk: 40, climb: 30 },
  abilities: { str: 19, dex: 10, con: 16, int: 2, wis: 13, cha: 7 },
  skills: { Perception: 3 },
  senses: ['passive Perception 13'],
  languages: [],
  challengeRating: 1,
  experiencePoints: 200,
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
        'Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 8 (1d8 + 4) piercing damage.',
    },
    {
      name: 'Claws',
      description:
        'Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 11 (2d6 + 4) slashing damage.',
    },
  ],
  environment: ['forest', 'hill'],
};

export const giantSpider: Monster = {
  id: 'giant-spider-2024',
  name: 'Giant Spider',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  size: 'large',
  type: 'beast',
  alignment: 'unaligned',
  armorClass: 14,
  hitPoints: { count: 4, die: 'd10', modifier: 4, notation: '4d10+4' },
  speed: { walk: 30, climb: 30 },
  abilities: { str: 14, dex: 16, con: 12, int: 2, wis: 11, cha: 4 },
  skills: { Stealth: 7 },
  senses: ['blindsight 10 ft.', 'darkvision 60 ft.', 'passive Perception 10'],
  languages: [],
  challengeRating: 1,
  experiencePoints: 200,
  specialAbilities: [
    {
      name: 'Spider Climb',
      description:
        'The spider can climb difficult surfaces, including upside down on ceilings, without needing to make an ability check.',
    },
    {
      name: 'Web Sense',
      description:
        'While in contact with a web, the spider knows the exact location of any other creature in contact with the same web.',
    },
    {
      name: 'Web Walker',
      description: 'The spider ignores movement restrictions caused by webbing.',
    },
  ],
  actions: [
    {
      name: 'Bite',
      description:
        'Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 7 (1d8 + 3) piercing damage, and the target must make a DC 11 Constitution saving throw, taking 9 (2d8) poison damage on a failed save, or half as much damage on a successful one. If the poison damage reduces the target to 0 hit points, the target is stable but poisoned for 1 hour, even after regaining hit points, and is paralyzed while poisoned in this way.',
    },
    {
      name: 'Web',
      description:
        'Ranged Weapon Attack: +5 to hit, range 30/60 ft., one creature. Hit: The target is restrained by webbing. As an action, the restrained target can make a DC 12 Strength check, bursting the webbing on a success. The webbing can also be attacked and destroyed (AC 10; hp 5; vulnerability to fire damage; immunity to bludgeoning, poison, and psychic damage).',
    },
  ],
  environment: ['underdark', 'forest'],
};

export const crocodile: Monster = {
  id: 'crocodile-2024',
  name: 'Crocodile',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  size: 'large',
  type: 'beast',
  alignment: 'unaligned',
  armorClass: 12,
  hitPoints: { count: 3, die: 'd10', modifier: 3, notation: '3d10+3' },
  speed: { walk: 20, swim: 30 },
  abilities: { str: 15, dex: 10, con: 13, int: 2, wis: 10, cha: 5 },
  skills: { Stealth: 2 },
  senses: ['passive Perception 10'],
  languages: [],
  challengeRating: 0.5,
  experiencePoints: 100,
  specialAbilities: [
    {
      name: 'Hold Breath',
      description: 'The crocodile can hold its breath for 15 minutes.',
    },
  ],
  actions: [
    {
      name: 'Bite',
      description:
        "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 7 (1d10 + 2) piercing damage, and the target is grappled (escape DC 12). Until this grapple ends, the target is restrained, and the crocodile can't bite another target.",
    },
  ],
  environment: ['swamp', 'water'],
};

export const lion: Monster = {
  id: 'lion-2024',
  name: 'Lion',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  size: 'large',
  type: 'beast',
  alignment: 'unaligned',
  armorClass: 12,
  hitPoints: { count: 4, die: 'd10', modifier: 4, notation: '4d10+4' },
  speed: { walk: 50 },
  abilities: { str: 17, dex: 15, con: 13, int: 3, wis: 12, cha: 8 },
  skills: { Perception: 3, Stealth: 6 },
  senses: ['passive Perception 13'],
  languages: [],
  challengeRating: 1,
  experiencePoints: 200,
  specialAbilities: [
    {
      name: 'Keen Smell',
      description: 'The lion has advantage on Wisdom (Perception) checks that rely on smell.',
    },
    {
      name: 'Pack Tactics',
      description:
        "The lion has advantage on an attack roll against a creature if at least one of the lion's allies is within 5 feet of the creature and the ally isn't incapacitated.",
    },
    {
      name: 'Pounce',
      description:
        'If the lion moves at least 20 feet straight toward a creature and then hits it with a claw attack on the same turn, that target must succeed on a DC 13 Strength saving throw or be knocked prone. If the target is prone, the lion can make one bite attack against it as a bonus action.',
    },
    {
      name: 'Running Leap',
      description: 'With a 10-foot running start, the lion can long jump up to 25 feet.',
    },
  ],
  actions: [
    {
      name: 'Bite',
      description:
        'Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 7 (1d8 + 3) piercing damage.',
    },
    {
      name: 'Claw',
      description:
        'Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 6 (1d6 + 3) slashing damage.',
    },
  ],
  environment: ['grassland', 'hill'],
};

export const giantRat: Monster = {
  id: 'giant-rat-2024',
  name: 'Giant Rat',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  size: 'small',
  type: 'beast',
  alignment: 'unaligned',
  armorClass: 12,
  hitPoints: { count: 2, die: 'd6', notation: '2d6' },
  speed: { walk: 30 },
  abilities: { str: 7, dex: 15, con: 11, int: 2, wis: 10, cha: 4 },
  senses: ['darkvision 60 ft.', 'passive Perception 10'],
  languages: [],
  challengeRating: 0.125,
  experiencePoints: 25,
  specialAbilities: [
    {
      name: 'Keen Smell',
      description: 'The rat has advantage on Wisdom (Perception) checks that rely on smell.',
    },
    {
      name: 'Pack Tactics',
      description:
        "The rat has advantage on an attack roll against a creature if at least one of the rat's allies is within 5 feet of the creature and the ally isn't incapacitated.",
    },
  ],
  actions: [
    {
      name: 'Bite',
      description:
        'Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 4 (1d4 + 2) piercing damage.',
    },
  ],
  environment: ['urban', 'underdark'],
};

export const elk: Monster = {
  id: 'elk-2024',
  name: 'Elk',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  size: 'large',
  type: 'beast',
  alignment: 'unaligned',
  armorClass: 10,
  hitPoints: { count: 2, die: 'd10', modifier: 2, notation: '2d10+2' },
  speed: { walk: 50 },
  abilities: { str: 16, dex: 10, con: 12, int: 2, wis: 10, cha: 6 },
  senses: ['passive Perception 10'],
  languages: [],
  challengeRating: 0.25,
  experiencePoints: 50,
  specialAbilities: [
    {
      name: 'Charge',
      description:
        'If the elk moves at least 20 feet straight toward a target and then hits it with a ram attack on the same turn, the target takes an extra 7 (2d6) damage. If the target is a creature, it must succeed on a DC 13 Strength saving throw or be knocked prone.',
    },
  ],
  actions: [
    {
      name: 'Ram',
      description:
        'Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 6 (1d6 + 3) bludgeoning damage.',
    },
    {
      name: 'Hooves',
      description:
        'Melee Weapon Attack: +5 to hit, reach 5 ft., one prone creature. Hit: 8 (2d4 + 3) bludgeoning damage.',
    },
  ],
  environment: ['forest', 'grassland', 'hill'],
};

export const eagle: Monster = {
  id: 'eagle-2024',
  name: 'Eagle',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  size: 'small',
  type: 'beast',
  alignment: 'unaligned',
  armorClass: 12,
  hitPoints: { count: 1, die: 'd6', modifier: 1, notation: '1d6+1' },
  speed: { walk: 10, fly: 60 },
  abilities: { str: 6, dex: 15, con: 10, int: 2, wis: 14, cha: 7 },
  skills: { Perception: 4 },
  senses: ['passive Perception 14'],
  languages: [],
  challengeRating: 0,
  experiencePoints: 10,
  specialAbilities: [
    {
      name: 'Keen Sight',
      description: 'The eagle has advantage on Wisdom (Perception) checks that rely on sight.',
    },
  ],
  actions: [
    {
      name: 'Talons',
      description:
        'Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 4 (1d4 + 2) slashing damage.',
    },
  ],
  environment: ['mountain', 'grassland'],
};

export const panther: Monster = {
  id: 'panther-2024',
  name: 'Panther',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  size: 'medium',
  type: 'beast',
  alignment: 'unaligned',
  armorClass: 12,
  hitPoints: { count: 3, die: 'd8', modifier: 3, notation: '3d8+3' },
  speed: { walk: 50, climb: 40 },
  abilities: { str: 14, dex: 15, con: 10, int: 3, wis: 14, cha: 7 },
  skills: { Perception: 4, Stealth: 6 },
  senses: ['passive Perception 14'],
  languages: [],
  challengeRating: 0.25,
  experiencePoints: 50,
  specialAbilities: [
    {
      name: 'Keen Smell',
      description: 'The panther has advantage on Wisdom (Perception) checks that rely on smell.',
    },
    {
      name: 'Pounce',
      description:
        'If the panther moves at least 20 feet straight toward a creature and then hits it with a claw attack on the same turn, that target must succeed on a DC 12 Strength saving throw or be knocked prone. If the target is prone, the panther can make one bite attack against it as a bonus action.',
    },
  ],
  actions: [
    {
      name: 'Bite',
      description:
        'Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 5 (1d6 + 2) piercing damage.',
    },
    {
      name: 'Claw',
      description:
        'Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 4 (1d4 + 2) slashing damage.',
    },
  ],
  environment: ['forest', 'jungle'],
};

export const boar: Monster = {
  id: 'boar-2024',
  name: 'Boar',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  size: 'medium',
  type: 'beast',
  alignment: 'unaligned',
  armorClass: 11,
  hitPoints: { count: 2, die: 'd8', modifier: 2, notation: '2d8+2' },
  speed: { walk: 40 },
  abilities: { str: 13, dex: 11, con: 12, int: 2, wis: 9, cha: 5 },
  senses: ['passive Perception 9'],
  languages: [],
  challengeRating: 0.25,
  experiencePoints: 50,
  specialAbilities: [
    {
      name: 'Charge',
      description:
        'If the boar moves at least 20 feet straight toward a target and then hits it with a tusk attack on the same turn, the target takes an extra 3 (1d6) slashing damage. If the target is a creature, it must succeed on a DC 11 Strength saving throw or be knocked prone.',
    },
    {
      name: 'Relentless',
      description:
        'If the boar takes 7 damage or less that would reduce it to 0 hit points, it is reduced to 1 hit point instead.',
    },
  ],
  actions: [
    {
      name: 'Tusk',
      description:
        'Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 4 (1d6 + 1) slashing damage.',
    },
  ],
  environment: ['forest', 'grassland'],
};

export const constrictor_snake: Monster = {
  id: 'constrictor-snake-2024',
  name: 'Constrictor Snake',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  size: 'large',
  type: 'beast',
  alignment: 'unaligned',
  armorClass: 12,
  hitPoints: { count: 2, die: 'd10', modifier: 2, notation: '2d10+2' },
  speed: { walk: 30, swim: 30 },
  abilities: { str: 15, dex: 14, con: 12, int: 1, wis: 10, cha: 3 },
  senses: ['blindsight 10 ft.', 'passive Perception 10'],
  languages: [],
  challengeRating: 0.25,
  experiencePoints: 50,
  actions: [
    {
      name: 'Bite',
      description:
        'Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 5 (1d6 + 2) piercing damage.',
    },
    {
      name: 'Constrict',
      description:
        "Melee Weapon Attack: +4 to hit, reach 5 ft., one creature. Hit: 6 (1d8 + 2) bludgeoning damage, and the target is grappled (escape DC 14). Until this grapple ends, the creature is restrained, and the snake can't constrict another target.",
    },
  ],
  environment: ['swamp', 'jungle'],
};

export const reef_shark: Monster = {
  id: 'reef-shark-2024',
  name: 'Reef Shark',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  size: 'medium',
  type: 'beast',
  alignment: 'unaligned',
  armorClass: 12,
  hitPoints: { count: 4, die: 'd8', modifier: 4, notation: '4d8+4' },
  speed: { walk: 0, swim: 40 },
  abilities: { str: 14, dex: 13, con: 13, int: 1, wis: 10, cha: 4 },
  skills: { Perception: 2 },
  senses: ['blindsight 30 ft.', 'passive Perception 12'],
  languages: [],
  challengeRating: 0.5,
  experiencePoints: 100,
  specialAbilities: [
    {
      name: 'Pack Tactics',
      description:
        "The shark has advantage on an attack roll against a creature if at least one of the shark's allies is within 5 feet of the creature and the ally isn't incapacitated.",
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
        'Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 6 (1d8 + 2) piercing damage.',
    },
  ],
  environment: ['water'],
};

export const warhorse: Monster = {
  id: 'warhorse-2024',
  name: 'Warhorse',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  size: 'large',
  type: 'beast',
  alignment: 'unaligned',
  armorClass: 11,
  hitPoints: { count: 3, die: 'd10', modifier: 3, notation: '3d10+3' },
  speed: { walk: 60 },
  abilities: { str: 18, dex: 12, con: 13, int: 2, wis: 12, cha: 7 },
  senses: ['passive Perception 11'],
  languages: [],
  challengeRating: 0.5,
  experiencePoints: 100,
  specialAbilities: [
    {
      name: 'Trampling Charge',
      description:
        'If the horse moves at least 20 feet straight toward a creature and then hits it with a hooves attack on the same turn, that target must succeed on a DC 14 Strength saving throw or be knocked prone. If the target is prone, the horse can make another attack with its hooves against it as a bonus action.',
    },
  ],
  actions: [
    {
      name: 'Hooves',
      description:
        'Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 11 (2d6 + 4) bludgeoning damage.',
    },
  ],
  environment: ['grassland'],
};

export const ape: Monster = {
  id: 'ape-2024',
  name: 'Ape',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  size: 'medium',
  type: 'beast',
  alignment: 'unaligned',
  armorClass: 12,
  hitPoints: { count: 3, die: 'd8', modifier: 6, notation: '3d8+6' },
  speed: { walk: 30, climb: 30 },
  abilities: { str: 16, dex: 14, con: 14, int: 6, wis: 12, cha: 7 },
  skills: { Athletics: 5, Perception: 3 },
  senses: ['passive Perception 13'],
  languages: [],
  challengeRating: 0.5,
  experiencePoints: 100,
  actions: [
    {
      name: 'Multiattack',
      description: 'The ape makes two fist attacks.',
    },
    {
      name: 'Fist',
      description:
        'Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 6 (1d6 + 3) bludgeoning damage.',
    },
    {
      name: 'Rock',
      description:
        'Ranged Weapon Attack: +5 to hit, range 25/50 ft., one target. Hit: 6 (1d6 + 3) bludgeoning damage.',
    },
  ],
  environment: ['forest', 'jungle'],
};

export const blackBear: Monster = {
  id: 'black-bear-2024',
  name: 'Black Bear',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  size: 'medium',
  type: 'beast',
  alignment: 'unaligned',
  armorClass: 11,
  hitPoints: { count: 3, die: 'd8', modifier: 6, notation: '3d8+6' },
  speed: { walk: 40, climb: 30 },
  abilities: { str: 15, dex: 10, con: 14, int: 2, wis: 12, cha: 7 },
  skills: { Perception: 3 },
  senses: ['passive Perception 13'],
  languages: [],
  challengeRating: 0.5,
  experiencePoints: 100,
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
        'Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 5 (1d6 + 2) piercing damage.',
    },
    {
      name: 'Claws',
      description:
        'Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 7 (2d4 + 2) slashing damage.',
    },
  ],
  environment: ['forest'],
};

export const giantBat: Monster = {
  id: 'giant-bat-2024',
  name: 'Giant Bat',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  size: 'large',
  type: 'beast',
  alignment: 'unaligned',
  armorClass: 13,
  hitPoints: { count: 4, die: 'd10', modifier: 4, notation: '4d10+4' },
  speed: { walk: 10, fly: 60 },
  abilities: { str: 15, dex: 16, con: 11, int: 2, wis: 12, cha: 6 },
  senses: ['blindsight 60 ft.', 'passive Perception 11'],
  languages: [],
  challengeRating: 0.25,
  experiencePoints: 50,
  specialAbilities: [
    {
      name: 'Echolocation',
      description: "The bat can't use its blindsight while deafened.",
    },
    {
      name: 'Keen Hearing',
      description: 'The bat has advantage on Wisdom (Perception) checks that rely on hearing.',
    },
  ],
  actions: [
    {
      name: 'Bite',
      description:
        'Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 5 (1d6 + 2) piercing damage.',
    },
  ],
  environment: ['underdark', 'cave'],
};

export const giantCentipede: Monster = {
  id: 'giant-centipede-2024',
  name: 'Giant Centipede',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  size: 'small',
  type: 'beast',
  alignment: 'unaligned',
  armorClass: 13,
  hitPoints: { count: 1, die: 'd6', modifier: 1, notation: '1d6+1' },
  speed: { walk: 30, climb: 30 },
  abilities: { str: 5, dex: 14, con: 12, int: 1, wis: 7, cha: 3 },
  senses: ['blindsight 30 ft.', 'passive Perception 8'],
  languages: [],
  challengeRating: 0.25,
  experiencePoints: 50,
  actions: [
    {
      name: 'Bite',
      description:
        'Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 4 (1d4 + 2) piercing damage, and the target must succeed on a DC 11 Constitution saving throw or take 10 (3d6) poison damage. If the poison damage reduces the target to 0 hit points, the target is stable but poisoned for 1 hour, even after regaining hit points, and is paralyzed while poisoned in this way.',
    },
  ],
  environment: ['underdark', 'forest'],
};

export const giantFrog: Monster = {
  id: 'giant-frog-2024',
  name: 'Giant Frog',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  size: 'medium',
  type: 'beast',
  alignment: 'unaligned',
  armorClass: 11,
  hitPoints: { count: 4, die: 'd8', notation: '4d8' },
  speed: { walk: 30, swim: 30 },
  abilities: { str: 12, dex: 13, con: 11, int: 2, wis: 10, cha: 3 },
  skills: { Perception: 2, Stealth: 3 },
  senses: ['darkvision 30 ft.', 'passive Perception 12'],
  languages: [],
  challengeRating: 0.25,
  experiencePoints: 50,
  specialAbilities: [
    {
      name: 'Amphibious',
      description: 'The frog can breathe air and water.',
    },
    {
      name: 'Standing Leap',
      description:
        "The frog's long jump is up to 20 feet and its high jump is up to 10 feet, with or without a running start.",
    },
  ],
  actions: [
    {
      name: 'Bite',
      description:
        "Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 4 (1d6 + 1) piercing damage, and the target is grappled (escape DC 11). Until this grapple ends, the target is restrained, and the frog can't bite another target.",
    },
    {
      name: 'Swallow',
      description:
        "The frog makes one bite attack against a Small or smaller target it is grappling. If the attack hits, the target is swallowed, and the grapple ends. The swallowed target is blinded and restrained, it has total cover against attacks and other effects outside the frog, and it takes 5 (2d4) acid damage at the start of each of the frog's turns. The frog can have only one target swallowed at a time.",
    },
  ],
  environment: ['swamp', 'forest'],
};

export const giantWasp: Monster = {
  id: 'giant-wasp-2024',
  name: 'Giant Wasp',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  size: 'medium',
  type: 'beast',
  alignment: 'unaligned',
  armorClass: 12,
  hitPoints: { count: 4, die: 'd8', modifier: 4, notation: '4d8+4' },
  speed: { walk: 10, fly: 50 },
  abilities: { str: 10, dex: 14, con: 10, int: 1, wis: 10, cha: 3 },
  senses: ['passive Perception 10'],
  languages: [],
  challengeRating: 0.5,
  experiencePoints: 100,
  actions: [
    {
      name: 'Sting',
      description:
        'Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 5 (1d6 + 2) piercing damage, and the target must make a DC 11 Constitution saving throw, taking 10 (3d6) poison damage on a failed save, or half as much damage on a successful one. If the poison damage reduces the target to 0 hit points, the target is stable but poisoned for 1 hour, even after regaining hit points, and is paralyzed while poisoned in this way.',
    },
  ],
  environment: ['forest', 'grassland'],
};

export const beastsCR0to5: Monster[] = [
  wolf,
  direwolf,
  brownBear,
  giantSpider,
  crocodile,
  lion,
  giantRat,
  elk,
  eagle,
  panther,
  boar,
  constrictor_snake,
  reef_shark,
  warhorse,
  ape,
  blackBear,
  giantBat,
  giantCentipede,
  giantFrog,
  giantWasp,
];
