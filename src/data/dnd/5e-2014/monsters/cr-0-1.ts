import { Monster } from '../../../../types/creatures/monsters';

// CR 0 - Harmless creatures
export const rat: Monster = {
  id: 'rat',
  name: 'Rat',
  system: 'dnd-5e-2014',
  source: 'SRD',
  size: 'tiny',
  type: 'beast',
  alignment: 'unaligned',
  challengeRating: 0,
  experiencePoints: 10,
  armorClass: 10,
  hitPoints: { count: 1, die: 'd4', notation: '1d4' },
  speed: { walk: 20 },
  abilities: { str: 2, dex: 11, con: 9, int: 2, wis: 10, cha: 4 },
  senses: ['darkvision 30 ft.', 'passive Perception 10'],
  languages: [],
  actions: [
    {
      name: 'Bite',
      description: 'Melee Weapon Attack: +0 to hit, reach 5 ft., one target.',
      attackBonus: 0,
      reach: 5,
      damage: [{ dice: { count: 1, die: 'd1', notation: '1' }, type: 'piercing' }],
    },
  ],
  description: 'A common rat found in cities and dungeons.',
  environment: ['urban', 'underground'],
};

export const commoner: Monster = {
  id: 'commoner',
  name: 'Commoner',
  system: 'dnd-5e-2014',
  source: 'SRD',
  size: 'medium',
  type: 'humanoid',
  alignment: 'true neutral',
  challengeRating: 0,
  experiencePoints: 10,
  armorClass: 10,
  hitPoints: { count: 1, die: 'd8', notation: '1d8' },
  speed: { walk: 30 },
  abilities: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
  senses: ['passive Perception 10'],
  languages: ['Common'],
  actions: [
    {
      name: 'Club',
      description: 'Melee Weapon Attack: +2 to hit, reach 5 ft., one target.',
      attackBonus: 2,
      reach: 5,
      damage: [{ dice: { count: 1, die: 'd4', notation: '1d4' }, type: 'bludgeoning' }],
    },
  ],
  description: 'Ordinary people - farmers, merchants, guards.',
  environment: ['urban', 'any'],
};

// CR 1/8
export const guard: Monster = {
  id: 'guard',
  name: 'Guard',
  system: 'dnd-5e-2014',
  source: 'SRD',
  size: 'medium',
  type: 'humanoid',
  alignment: 'lawful neutral',
  challengeRating: 0.125,
  experiencePoints: 25,
  armorClass: 16,
  hitPoints: { count: 2, die: 'd8', modifier: 2, notation: '2d8+2' },
  speed: { walk: 30 },
  abilities: { str: 13, dex: 12, con: 12, int: 10, wis: 11, cha: 10 },
  skills: { Perception: 2 },
  senses: ['passive Perception 12'],
  languages: ['Common'],
  actions: [
    {
      name: 'Spear',
      description:
        'Melee or Ranged Weapon Attack: +3 to hit, reach 5 ft. or range 20/60 ft., one target.',
      attackBonus: 3,
      reach: 5,
      range: { normal: 20, max: 60 },
      damage: [{ dice: { count: 1, die: 'd6', modifier: 1, notation: '1d6+1' }, type: 'piercing' }],
    },
  ],
  description: 'City guards and basic soldiers.',
  environment: ['urban'],
};

// CR 1/4
export const goblin: Monster = {
  id: 'goblin',
  name: 'Goblin',
  system: 'dnd-5e-2014',
  source: 'SRD',
  size: 'small',
  type: 'humanoid',
  alignment: 'neutral evil',
  challengeRating: 0.25,
  experiencePoints: 50,
  armorClass: 15,
  hitPoints: { count: 2, die: 'd6', notation: '2d6' },
  speed: { walk: 30 },
  abilities: { str: 8, dex: 14, con: 10, int: 10, wis: 8, cha: 8 },
  skills: { Stealth: 6 },
  senses: ['darkvision 60 ft.', 'passive Perception 9'],
  languages: ['Common', 'Goblin'],
  specialAbilities: [
    {
      name: 'Nimble Escape',
      description:
        'The goblin can take the Disengage or Hide action as a bonus action on each of its turns.',
    },
  ],
  actions: [
    {
      name: 'Scimitar',
      description: 'Melee Weapon Attack: +4 to hit, reach 5 ft., one target.',
      attackBonus: 4,
      reach: 5,
      damage: [{ dice: { count: 1, die: 'd6', modifier: 2, notation: '1d6+2' }, type: 'slashing' }],
    },
    {
      name: 'Shortbow',
      description: 'Ranged Weapon Attack: +4 to hit, range 80/320 ft., one target.',
      attackBonus: 4,
      range: { normal: 80, max: 320 },
      damage: [{ dice: { count: 1, die: 'd6', modifier: 2, notation: '1d6+2' }, type: 'piercing' }],
    },
  ],
  description: 'Small, cunning humanoids that raid and ambush travelers.',
  environment: ['forest', 'hills', 'underground'],
};

export const skeleton: Monster = {
  id: 'skeleton',
  name: 'Skeleton',
  system: 'dnd-5e-2014',
  source: 'SRD',
  size: 'medium',
  type: 'undead',
  alignment: 'lawful evil',
  challengeRating: 0.25,
  experiencePoints: 50,
  armorClass: 13,
  hitPoints: { count: 2, die: 'd8', modifier: 4, notation: '2d8+4' },
  speed: { walk: 30 },
  abilities: { str: 10, dex: 14, con: 15, int: 6, wis: 8, cha: 5 },
  damageVulnerabilities: ['bludgeoning'],
  damageImmunities: ['poison'],
  conditionImmunities: ['exhaustion', 'poisoned'],
  senses: ['darkvision 60 ft.', 'passive Perception 9'],
  languages: ["understands all languages it knew in life but can't speak"],
  actions: [
    {
      name: 'Shortsword',
      description: 'Melee Weapon Attack: +4 to hit, reach 5 ft., one target.',
      attackBonus: 4,
      reach: 5,
      damage: [{ dice: { count: 1, die: 'd6', modifier: 2, notation: '1d6+2' }, type: 'piercing' }],
    },
    {
      name: 'Shortbow',
      description: 'Ranged Weapon Attack: +4 to hit, range 80/320 ft., one target.',
      attackBonus: 4,
      range: { normal: 80, max: 320 },
      damage: [{ dice: { count: 1, die: 'd6', modifier: 2, notation: '1d6+2' }, type: 'piercing' }],
    },
  ],
  description: 'Animated bones of the dead, often serving necromancers.',
  environment: ['underground', 'ruins'],
};

// CR 1/2
export const orc: Monster = {
  id: 'orc',
  name: 'Orc',
  system: 'dnd-5e-2014',
  source: 'SRD',
  size: 'medium',
  type: 'humanoid',
  alignment: 'chaotic evil',
  challengeRating: 0.5,
  experiencePoints: 100,
  armorClass: 13,
  hitPoints: { count: 2, die: 'd8', modifier: 6, notation: '2d8+6' },
  speed: { walk: 30 },
  abilities: { str: 16, dex: 12, con: 16, int: 7, wis: 11, cha: 10 },
  skills: { Intimidation: 2 },
  senses: ['darkvision 60 ft.', 'passive Perception 10'],
  languages: ['Common', 'Orc'],
  specialAbilities: [
    {
      name: 'Aggressive',
      description:
        'As a bonus action, the orc can move up to its speed toward a hostile creature that it can see.',
    },
  ],
  actions: [
    {
      name: 'Greataxe',
      description: 'Melee Weapon Attack: +5 to hit, reach 5 ft., one target.',
      attackBonus: 5,
      reach: 5,
      damage: [
        { dice: { count: 1, die: 'd12', modifier: 3, notation: '1d12+3' }, type: 'slashing' },
      ],
    },
    {
      name: 'Javelin',
      description:
        'Melee or Ranged Weapon Attack: +5 to hit, reach 5 ft. or range 30/120 ft., one target.',
      attackBonus: 5,
      reach: 5,
      range: { normal: 30, max: 120 },
      damage: [{ dice: { count: 1, die: 'd6', modifier: 3, notation: '1d6+3' }, type: 'piercing' }],
    },
  ],
  description: 'Savage raiders driven by their god Gruumsh to slaughter and pillage.',
  environment: ['mountains', 'underground'],
};

// CR 1
export const direwolf: Monster = {
  id: 'dire-wolf',
  name: 'Dire Wolf',
  system: 'dnd-5e-2014',
  source: 'SRD',
  size: 'large',
  type: 'beast',
  alignment: 'unaligned',
  challengeRating: 1,
  experiencePoints: 200,
  armorClass: 14,
  hitPoints: { count: 5, die: 'd10', modifier: 10, notation: '5d10+10' },
  speed: { walk: 50 },
  abilities: { str: 17, dex: 15, con: 15, int: 3, wis: 12, cha: 7 },
  skills: { Perception: 3, Stealth: 4 },
  senses: ['passive Perception 13'],
  languages: [],
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
        'Melee Weapon Attack: +5 to hit, reach 5 ft., one target. If the target is a creature, it must succeed on a DC 13 Strength saving throw or be knocked prone.',
      attackBonus: 5,
      reach: 5,
      damage: [{ dice: { count: 2, die: 'd6', modifier: 3, notation: '2d6+3' }, type: 'piercing' }],
      savingThrow: {
        attribute: 'str',
        dc: 13,
        effect: 'knocked prone on failure',
      },
    },
  ],
  description: 'Larger and more ferocious than normal wolves.',
  environment: ['forest', 'hills'],
};

export const bugbear: Monster = {
  id: 'bugbear',
  name: 'Bugbear',
  system: 'dnd-5e-2014',
  source: 'SRD',
  size: 'medium',
  type: 'humanoid',
  alignment: 'chaotic evil',
  challengeRating: 1,
  experiencePoints: 200,
  armorClass: 16,
  hitPoints: { count: 5, die: 'd8', modifier: 5, notation: '5d8+5' },
  speed: { walk: 30 },
  abilities: { str: 15, dex: 14, con: 13, int: 8, wis: 11, cha: 9 },
  skills: { Stealth: 6, Survival: 2 },
  senses: ['darkvision 60 ft.', 'passive Perception 10'],
  languages: ['Common', 'Goblin'],
  specialAbilities: [
    {
      name: 'Brute',
      description:
        'A melee weapon deals one extra die of its damage when the bugbear hits with it (included in the attack).',
    },
    {
      name: 'Surprise Attack',
      description:
        'If the bugbear surprises a creature and hits it with an attack during the first round of combat, the target takes an extra 7 (2d6) damage from the attack.',
    },
  ],
  actions: [
    {
      name: 'Morningstar',
      description: 'Melee Weapon Attack: +4 to hit, reach 5 ft., one target.',
      attackBonus: 4,
      reach: 5,
      damage: [{ dice: { count: 2, die: 'd8', modifier: 2, notation: '2d8+2' }, type: 'piercing' }],
    },
    {
      name: 'Javelin',
      description:
        'Melee or Ranged Weapon Attack: +4 to hit, reach 5 ft. or range 30/120 ft., one target.',
      attackBonus: 4,
      reach: 5,
      range: { normal: 30, max: 120 },
      damage: [{ dice: { count: 2, die: 'd6', modifier: 2, notation: '2d6+2' }, type: 'piercing' }],
    },
  ],
  description: 'Large goblinoids known for their stealth and brutal ambush tactics.',
  environment: ['forest', 'hills', 'underground'],
};

export const zombie: Monster = {
  id: 'zombie',
  name: 'Zombie',
  system: 'dnd-5e-2014',
  source: 'SRD',
  size: 'medium',
  type: 'undead',
  alignment: 'neutral evil',
  challengeRating: 0.25,
  experiencePoints: 50,
  armorClass: 8,
  hitPoints: { count: 3, die: 'd8', modifier: 9, notation: '3d8+9' },
  speed: { walk: 20 },
  abilities: { str: 13, dex: 6, con: 16, int: 3, wis: 6, cha: 5 },
  savingThrows: { wis: 0 },
  damageImmunities: ['poison'],
  conditionImmunities: ['poisoned'],
  senses: ['darkvision 60 ft.', 'passive Perception 8'],
  languages: ["understands the languages it knew in life but can't speak"],
  specialAbilities: [
    {
      name: 'Undead Fortitude',
      description:
        'If damage reduces the zombie to 0 hit points, it must make a Constitution saving throw with a DC of 5 + the damage taken, unless the damage is radiant or from a critical hit. On a success, the zombie drops to 1 hit point instead.',
    },
  ],
  actions: [
    {
      name: 'Slam',
      description: 'Melee Weapon Attack: +3 to hit, reach 5 ft., one target.',
      attackBonus: 3,
      reach: 5,
      damage: [
        { dice: { count: 1, die: 'd6', modifier: 1, notation: '1d6+1' }, type: 'bludgeoning' },
      ],
    },
  ],
  description: 'Shambling corpses animated by foul necromancy.',
  environment: ['any'],
};

export const wolf: Monster = {
  id: 'wolf',
  name: 'Wolf',
  system: 'dnd-5e-2014',
  source: 'SRD',
  size: 'medium',
  type: 'beast',
  alignment: 'unaligned',
  challengeRating: 0.25,
  experiencePoints: 50,
  armorClass: 13,
  hitPoints: { count: 2, die: 'd8', notation: '2d8+2' },
  speed: { walk: 40 },
  abilities: { str: 12, dex: 15, con: 12, int: 3, wis: 12, cha: 6 },
  skills: { perception: 3, stealth: 4 },
  senses: ['passive Perception 13'],
  languages: [],
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
      description: 'Melee Weapon Attack: +4 to hit, reach 5 ft., one target.',
      attackBonus: 4,
      reach: 5,
      damage: [{ dice: { count: 2, die: 'd4', notation: '2d4+2' }, type: 'piercing' }],
    },
  ],
  description: 'A wild wolf that hunts in packs.',
  environment: ['forest', 'grassland', 'hills'],
};

export const spider: Monster = {
  id: 'spider',
  name: 'Spider',
  system: 'dnd-5e-2014',
  source: 'SRD',
  size: 'tiny',
  type: 'beast',
  alignment: 'unaligned',
  challengeRating: 0,
  experiencePoints: 10,
  armorClass: 12,
  hitPoints: { count: 1, die: 'd4', notation: '1d4' },
  speed: { walk: 20, climb: 20 },
  abilities: { str: 2, dex: 14, con: 8, int: 1, wis: 10, cha: 2 },
  skills: { stealth: 4 },
  senses: ['darkvision 30 ft.', 'passive Perception 10'],
  languages: [],
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
      description: 'Melee Weapon Attack: +4 to hit, reach 5 ft., one target.',
      attackBonus: 4,
      reach: 5,
      damage: [{ dice: { count: 1, die: 'd1', notation: '1' }, type: 'piercing' }],
    },
  ],
  description: 'A common spider found in dungeons and wilderness.',
  environment: ['forest', 'underground'],
};

export const kobold: Monster = {
  id: 'kobold',
  name: 'Kobold',
  system: 'dnd-5e-2014',
  source: 'SRD',
  size: 'small',
  type: 'humanoid',
  alignment: 'lawful evil',
  challengeRating: 0.125,
  experiencePoints: 25,
  armorClass: 12,
  hitPoints: { count: 2, die: 'd6', notation: '2d6-2' },
  speed: { walk: 30 },
  abilities: { str: 7, dex: 15, con: 9, int: 8, wis: 7, cha: 8 },
  senses: ['darkvision 60 ft.', 'passive Perception 8'],
  languages: ['Common', 'Draconic'],
  specialAbilities: [
    {
      name: 'Sunlight Sensitivity',
      description:
        'While in sunlight, the kobold has disadvantage on attack rolls and Wisdom (Perception) checks that rely on sight.',
    },
    {
      name: 'Pack Tactics',
      description:
        "The kobold has advantage on attack rolls against a creature if at least one of the kobold's allies is within 5 feet of the creature and the ally isn't incapacitated.",
    },
  ],
  actions: [
    {
      name: 'Dagger',
      description:
        'Melee or Ranged Weapon Attack: +4 to hit, reach 5 ft. or range 20/60 ft., one target.',
      attackBonus: 4,
      reach: 5,
      damage: [{ dice: { count: 1, die: 'd4', notation: '1d4+2' }, type: 'piercing' }],
    },
    {
      name: 'Sling',
      description: 'Ranged Weapon Attack: +4 to hit, range 30/120 ft., one target.',
      attackBonus: 4,
      damage: [{ dice: { count: 1, die: 'd4', notation: '1d4+2' }, type: 'bludgeoning' }],
    },
  ],
  description: 'Small reptilian humanoids that serve dragons.',
  environment: ['underground', 'mountains'],
};

export const bandit: Monster = {
  id: 'bandit',
  name: 'Bandit',
  system: 'dnd-5e-2014',
  source: 'SRD',
  size: 'medium',
  type: 'humanoid',
  alignment: 'chaotic neutral',
  challengeRating: 0.125,
  experiencePoints: 25,
  armorClass: 12,
  hitPoints: { count: 2, die: 'd8', notation: '2d8+2' },
  speed: { walk: 30 },
  abilities: { str: 11, dex: 12, con: 12, int: 10, wis: 10, cha: 10 },
  senses: ['passive Perception 10'],
  languages: ['Common'],
  actions: [
    {
      name: 'Scimitar',
      description: 'Melee Weapon Attack: +3 to hit, reach 5 ft., one target.',
      attackBonus: 3,
      reach: 5,
      damage: [{ dice: { count: 1, die: 'd6', notation: '1d6+1' }, type: 'slashing' }],
    },
    {
      name: 'Light Crossbow',
      description: 'Ranged Weapon Attack: +3 to hit, range 80/320 ft., one target.',
      attackBonus: 3,
      damage: [{ dice: { count: 1, die: 'd8', notation: '1d8+1' }, type: 'piercing' }],
    },
  ],
  description: 'Raiders and highwaymen who prey on travelers.',
  environment: ['any'],
};

export const cultist: Monster = {
  id: 'cultist',
  name: 'Cultist',
  system: 'dnd-5e-2014',
  source: 'SRD',
  size: 'medium',
  type: 'humanoid',
  alignment: 'neutral evil',
  challengeRating: 0.125,
  experiencePoints: 25,
  armorClass: 12,
  hitPoints: { count: 2, die: 'd8', notation: '2d8' },
  speed: { walk: 30 },
  abilities: { str: 11, dex: 12, con: 10, int: 10, wis: 11, cha: 10 },
  skills: { deception: 2, religion: 2 },
  senses: ['passive Perception 10'],
  languages: ['Common'],
  actions: [
    {
      name: 'Scimitar',
      description: 'Melee Weapon Attack: +3 to hit, reach 5 ft., one target.',
      attackBonus: 3,
      reach: 5,
      damage: [{ dice: { count: 1, die: 'd6', notation: '1d6+1' }, type: 'slashing' }],
    },
  ],
  description: 'Fanatic followers of dark deities or demon lords.',
  environment: ['any'],
};

export const dnd5eCR0to1Monsters: Monster[] = [
  rat,
  spider,
  commoner,
  kobold,
  bandit,
  cultist,
  wolf,
  guard,
  goblin,
  skeleton,
  orc,
  direwolf,
  bugbear,
  zombie,
];
