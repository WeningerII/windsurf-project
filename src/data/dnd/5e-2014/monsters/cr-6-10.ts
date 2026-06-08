import { Monster } from '../../../../types/creatures/monsters';

// CR 6
export const mage: Monster = {
  id: 'mage',
  name: 'Mage',
  system: 'dnd-5e-2014',
  source: 'SRD',
  size: 'medium',
  type: 'humanoid',
  alignment: 'true neutral',
  challengeRating: 6,
  experiencePoints: 2300,
  armorClass: 12,
  hitPoints: { count: 9, die: 'd8', modifier: 9, notation: '9d8+9' },
  speed: { walk: 30 },
  abilities: { str: 9, dex: 14, con: 11, int: 17, wis: 12, cha: 11 },
  savingThrows: { int: 6, wis: 4 },
  skills: { Arcana: 6, History: 6 },
  senses: ['passive Perception 11'],
  languages: ['Common', 'Draconic', 'Elvish', 'Dwarvish'],
  specialAbilities: [
    {
      name: 'Spellcasting',
      description:
        'The mage is a 9th-level spellcaster. Its spellcasting ability is Intelligence (spell save DC 14, +6 to hit with spell attacks). The mage has the following wizard spells prepared: Cantrips: fire bolt, light, mage hand, prestidigitation; 1st level (4 slots): detect magic, mage armor, magic missile, shield; 2nd level (3 slots): misty step, suggestion; 3rd level (3 slots): counterspell, fireball, fly; 4th level (3 slots): greater invisibility, ice storm; 5th level (1 slot): cone of cold.',
    },
  ],
  actions: [
    {
      name: 'Dagger',
      description:
        'Melee or Ranged Weapon Attack: +5 to hit, reach 5 ft. or range 20/60 ft., one target.',
      attackBonus: 5,
      reach: 5,
      range: { normal: 20, max: 60 },
      damage: [{ dice: { count: 1, die: 'd4', modifier: 2, notation: '1d4+2' }, type: 'piercing' }],
    },
  ],
  description: 'Powerful spellcaster with access to high-level magic.',
  environment: ['urban', 'any'],
};

// CR 7
export const stoneGiant: Monster = {
  id: 'stone-giant',
  name: 'Stone Giant',
  system: 'dnd-5e-2014',
  source: 'SRD',
  size: 'huge',
  type: 'giant',
  alignment: 'true neutral',
  challengeRating: 7,
  experiencePoints: 2900,
  armorClass: 17,
  hitPoints: { count: 11, die: 'd12', modifier: 55, notation: '11d12+55' },
  speed: { walk: 40 },
  abilities: { str: 23, dex: 15, con: 20, int: 10, wis: 12, cha: 9 },
  savingThrows: { dex: 5, con: 8, wis: 4 },
  skills: { Athletics: 12, Perception: 4 },
  senses: ['darkvision 60 ft.', 'passive Perception 14'],
  languages: ['Giant'],
  specialAbilities: [
    {
      name: 'Stone Camouflage',
      description:
        'The giant has advantage on Dexterity (Stealth) checks made to hide in rocky terrain.',
    },
  ],
  actions: [
    {
      name: 'Multiattack',
      description: 'The giant makes two greatclub attacks.',
    },
    {
      name: 'Greatclub',
      description: 'Melee Weapon Attack: +9 to hit, reach 15 ft., one target.',
      attackBonus: 9,
      reach: 15,
      damage: [
        { dice: { count: 3, die: 'd8', modifier: 6, notation: '3d8+6' }, type: 'bludgeoning' },
      ],
    },
    {
      name: 'Rock',
      description: 'Ranged Weapon Attack: +9 to hit, range 60/240 ft., one target.',
      attackBonus: 9,
      range: { normal: 60, max: 240 },
      damage: [
        { dice: { count: 4, die: 'd10', modifier: 6, notation: '4d10+6' }, type: 'bludgeoning' },
      ],
    },
  ],
  reactions: [
    {
      name: 'Rock Catching',
      description:
        'If a rock or similar object is hurled at the giant, the giant can, with a successful DC 10 Dexterity saving throw, catch the missile and take no bludgeoning damage from it.',
    },
  ],
  description: 'Solitary giants that dwell in mountains and value artistry in stonework.',
  environment: ['mountains', 'underground'],
};

// CR 8
export const youngRedDragon: Monster = {
  id: 'young-red-dragon',
  name: 'Young Red Dragon',
  system: 'dnd-5e-2014',
  source: 'SRD',
  size: 'large',
  type: 'dragon',
  alignment: 'chaotic evil',
  challengeRating: 10,
  experiencePoints: 5900,
  armorClass: 18,
  hitPoints: { count: 17, die: 'd10', modifier: 85, notation: '17d10+85' },
  speed: { walk: 40, climb: 40, fly: 80 },
  abilities: { str: 23, dex: 10, con: 21, int: 14, wis: 11, cha: 19 },
  savingThrows: { dex: 4, con: 9, wis: 4, cha: 8 },
  skills: { Perception: 8, Stealth: 4 },
  damageImmunities: ['fire'],
  senses: ['blindsight 30 ft.', 'darkvision 120 ft.', 'passive Perception 18'],
  languages: ['Common', 'Draconic'],
  actions: [
    {
      name: 'Multiattack',
      description: 'The dragon makes three attacks: one with its bite and two with its claws.',
    },
    {
      name: 'Bite',
      description: 'Melee Weapon Attack: +10 to hit, reach 10 ft., one target.',
      attackBonus: 10,
      reach: 10,
      damage: [
        { dice: { count: 2, die: 'd10', modifier: 6, notation: '2d10+6' }, type: 'piercing' },
        { dice: { count: 1, die: 'd6', notation: '1d6' }, type: 'fire' },
      ],
    },
    {
      name: 'Claw',
      description: 'Melee Weapon Attack: +10 to hit, reach 5 ft., one target.',
      attackBonus: 10,
      reach: 5,
      damage: [{ dice: { count: 2, die: 'd6', modifier: 6, notation: '2d6+6' }, type: 'slashing' }],
    },
    {
      name: 'Fire Breath',
      description:
        'The dragon exhales fire in a 30-foot cone. Each creature in that area must make a DC 17 Dexterity saving throw, taking 16d6 fire damage on a failed save, or half as much damage on a successful one.',
      savingThrow: {
        attribute: 'dex',
        dc: 17,
        effect: '16d6 fire damage (half on success)',
      },
      recharge: '5-6',
    },
  ],
  description: 'Arrogant and greedy red dragons, the most covetous of all dragon types.',
  environment: ['mountains', 'hills'],
};

// CR 9
export const cloudGiant: Monster = {
  id: 'cloud-giant',
  name: 'Cloud Giant',
  system: 'dnd-5e-2014',
  source: 'SRD',
  size: 'huge',
  type: 'giant',
  alignment: 'neutral good',
  challengeRating: 9,
  experiencePoints: 5000,
  armorClass: 14,
  hitPoints: { count: 16, die: 'd12', modifier: 96, notation: '16d12+96' },
  speed: { walk: 40 },
  abilities: { str: 27, dex: 10, con: 22, int: 12, wis: 16, cha: 16 },
  savingThrows: { con: 10, wis: 7, cha: 7 },
  skills: { Insight: 7, Perception: 7 },
  senses: ['passive Perception 17'],
  languages: ['Common', 'Giant'],
  specialAbilities: [
    {
      name: 'Keen Smell',
      description: 'The giant has advantage on Wisdom (Perception) checks that rely on smell.',
    },
  ],
  actions: [
    {
      name: 'Multiattack',
      description: 'The giant makes two morningstar attacks.',
    },
    {
      name: 'Morningstar',
      description: 'Melee Weapon Attack: +12 to hit, reach 10 ft., one target.',
      attackBonus: 12,
      reach: 10,
      damage: [{ dice: { count: 3, die: 'd8', modifier: 8, notation: '3d8+8' }, type: 'piercing' }],
    },
    {
      name: 'Rock',
      description: 'Ranged Weapon Attack: +12 to hit, range 60/240 ft., one target.',
      attackBonus: 12,
      range: { normal: 60, max: 240 },
      damage: [
        { dice: { count: 4, die: 'd10', modifier: 8, notation: '4d10+8' }, type: 'bludgeoning' },
      ],
    },
  ],
  description: 'Noble giants that dwell in cloud castles high above the world.',
  environment: ['mountains'],
};

// CR 10
export const aboleth: Monster = {
  id: 'aboleth',
  name: 'Aboleth',
  system: 'dnd-5e-2014',
  source: 'SRD',
  size: 'large',
  type: 'aberration',
  alignment: 'lawful evil',
  challengeRating: 10,
  experiencePoints: 5900,
  armorClass: 17,
  hitPoints: { count: 18, die: 'd10', modifier: 72, notation: '18d10+72' },
  speed: { walk: 10, swim: 40 },
  abilities: { str: 21, dex: 9, con: 15, int: 18, wis: 15, cha: 18 },
  savingThrows: { con: 6, int: 8, wis: 6 },
  skills: { History: 12, Perception: 10 },
  senses: ['darkvision 120 ft.', 'passive Perception 20'],
  languages: ['Deep Speech', 'telepathy 120 ft.'],
  specialAbilities: [
    {
      name: 'Amphibious',
      description: 'The aboleth can breathe air and water.',
    },
    {
      name: 'Mucous Cloud',
      description:
        'While underwater, the aboleth is surrounded by transformative mucus. A creature that touches the aboleth or that hits it with a melee attack while within 5 feet of it must make a DC 14 Constitution saving throw. On a failure, the creature is diseased for 1d4 hours. The diseased creature can breathe only underwater.',
    },
    {
      name: 'Probing Telepathy',
      description:
        "If a creature communicates telepathically with the aboleth, the aboleth learns the creature's greatest desires if the aboleth can see the creature.",
    },
  ],
  actions: [
    {
      name: 'Multiattack',
      description: 'The aboleth makes three tentacle attacks.',
    },
    {
      name: 'Tentacle',
      description:
        "Melee Weapon Attack: +9 to hit, reach 10 ft., one target. If the target is a creature, it must succeed on a DC 14 Constitution saving throw or become diseased. The disease has no effect for 1 minute and can be removed by any magic that cures disease. After 1 minute, the diseased creature's skin becomes translucent and slimy, the creature can't regain hit points unless it is underwater, and the disease can be removed only by heal or another disease-curing spell of 6th level or higher. When the creature is outside a body of water, it takes 6 (1d12) acid damage every 10 minutes unless moisture is applied to the skin before 10 minutes have passed.",
      attackBonus: 9,
      reach: 10,
      damage: [
        { dice: { count: 2, die: 'd6', modifier: 5, notation: '2d6+5' }, type: 'bludgeoning' },
      ],
      savingThrow: {
        attribute: 'con',
        dc: 14,
        effect: 'diseased on failure',
      },
    },
    {
      name: 'Tail',
      description: 'Melee Weapon Attack: +9 to hit, reach 10 ft., one target.',
      attackBonus: 9,
      reach: 10,
      damage: [
        { dice: { count: 3, die: 'd6', modifier: 5, notation: '3d6+5' }, type: 'bludgeoning' },
      ],
    },
    {
      name: 'Enslave',
      description:
        "The aboleth targets one creature it can see within 30 feet of it. The target must succeed on a DC 14 Wisdom saving throw or be magically charmed by the aboleth until the aboleth dies or until it is on a different plane of existence from the target. The charmed target is under the aboleth's control and can't take reactions, and the aboleth and the target can communicate telepathically with each other over any distance.",
      savingThrow: {
        attribute: 'wis',
        dc: 14,
        effect: 'charmed and controlled on failure',
      },
    },
  ],
  legendaryActions: [
    {
      name: 'Detect',
      cost: 1,
      description: 'The aboleth makes a Wisdom (Perception) check.',
    },
    {
      name: 'Tail Swipe',
      cost: 1,
      description: 'The aboleth makes one tail attack.',
    },
    {
      name: 'Psychic Drain',
      cost: 2,
      description:
        'One creature charmed by the aboleth takes 10 (3d6) psychic damage, and the aboleth regains hit points equal to the damage the creature takes.',
    },
  ],
  description: 'Ancient aquatic aberrations with powerful psychic abilities and perfect memories.',
  environment: ['underwater'],
};

export const chimera: Monster = {
  id: 'chimera',
  name: 'Chimera',
  system: 'dnd-5e-2014',
  source: 'SRD',
  size: 'large',
  type: 'monstrosity',
  alignment: 'chaotic evil',
  challengeRating: 6,
  experiencePoints: 2300,
  armorClass: 14,
  hitPoints: { count: 12, die: 'd10', notation: '12d10+36' },
  speed: { walk: 30, fly: 60 },
  abilities: { str: 19, dex: 11, con: 19, int: 3, wis: 14, cha: 10 },
  skills: { perception: 8 },
  senses: ['darkvision 60 ft.', 'passive Perception 18'],
  languages: [],
  actions: [
    {
      name: 'Multiattack',
      description:
        'The chimera makes three attacks: one with its bite, one with its horns, and one with its claws. When its fire breath is available, it can use the breath in place of its bite or horns.',
    },
    {
      name: 'Bite',
      description: 'Melee Weapon Attack: +7 to hit, reach 5 ft., one target.',
      attackBonus: 7,
      reach: 5,
      damage: [{ dice: { count: 2, die: 'd6', notation: '2d6+4' }, type: 'piercing' }],
    },
    {
      name: 'Horns',
      description: 'Melee Weapon Attack: +7 to hit, reach 5 ft., one target.',
      attackBonus: 7,
      reach: 5,
      damage: [{ dice: { count: 1, die: 'd12', notation: '1d12+4' }, type: 'bludgeoning' }],
    },
    {
      name: 'Claws',
      description: 'Melee Weapon Attack: +7 to hit, reach 5 ft., one target.',
      attackBonus: 7,
      reach: 5,
      damage: [{ dice: { count: 2, die: 'd6', notation: '2d6+4' }, type: 'slashing' }],
    },
    {
      name: 'Fire Breath',
      description:
        'The dragon head exhales fire in a 15-foot cone. Each creature in that area must make a DC 15 Dexterity saving throw, taking 31 (7d8) fire damage on a failed save, or half as much on a successful one.',
      savingThrow: { attribute: 'dex', dc: 15, effect: 'half as much damage on a success' },
      damage: [{ dice: { count: 7, die: 'd8', notation: '7d8' }, type: 'fire' }],
      recharge: '5-6',
    },
  ],
  description: "A monstrous hybrid with a lion's body, dragon wings, and three heads.",
  environment: ['hills', 'mountains'],
};

export const medusa: Monster = {
  id: 'medusa',
  name: 'Medusa',
  system: 'dnd-5e-2014',
  source: 'SRD',
  size: 'medium',
  type: 'monstrosity',
  alignment: 'lawful evil',
  challengeRating: 6,
  experiencePoints: 2300,
  armorClass: 15,
  hitPoints: { count: 17, die: 'd8', notation: '17d8+51' },
  speed: { walk: 30 },
  abilities: { str: 10, dex: 15, con: 16, int: 12, wis: 13, cha: 15 },
  skills: { deception: 5, insight: 4, perception: 4, stealth: 5 },
  senses: ['darkvision 60 ft.', 'passive Perception 14'],
  languages: ['Common'],
  specialAbilities: [
    {
      name: 'Petrifying Gaze',
      description:
        "When a creature that can see the medusa's eyes starts its turn within 30 feet of the medusa, the medusa can force it to make a DC 14 Constitution saving throw if the medusa isn't incapacitated and can see the creature. On a failed save, the creature magically begins to turn to stone and is restrained. The restrained creature must repeat the saving throw at the end of its next turn. On a success, the effect ends. On a failure, the creature is petrified until freed by the greater restoration spell or other magic.",
    },
  ],
  actions: [
    {
      name: 'Multiattack',
      description:
        'The medusa makes either three melee attacks—one with its snake hair and two with its shortsword—or two ranged attacks with its longbow.',
    },
    {
      name: 'Snake Hair',
      description: 'Melee Weapon Attack: +5 to hit, reach 5 ft., one creature.',
      attackBonus: 5,
      reach: 5,
      damage: [
        { dice: { count: 1, die: 'd4', notation: '1d4+2' }, type: 'piercing' },
        { dice: { count: 4, die: 'd6', notation: '4d6' }, type: 'poison' },
      ],
    },
    {
      name: 'Shortsword',
      description: 'Melee Weapon Attack: +5 to hit, reach 5 ft., one target.',
      attackBonus: 5,
      reach: 5,
      damage: [{ dice: { count: 1, die: 'd6', notation: '1d6+2' }, type: 'piercing' }],
    },
  ],
  description: 'A creature with serpents for hair whose gaze can turn victims to stone.',
  environment: ['ruins', 'underground'],
};

export const wyvern: Monster = {
  id: 'wyvern',
  name: 'Wyvern',
  system: 'dnd-5e-2014',
  source: 'SRD',
  size: 'large',
  type: 'dragon',
  alignment: 'unaligned',
  challengeRating: 6,
  experiencePoints: 2300,
  armorClass: 13,
  hitPoints: { count: 13, die: 'd10', notation: '13d10+39' },
  speed: { walk: 20, fly: 80 },
  abilities: { str: 19, dex: 10, con: 16, int: 5, wis: 12, cha: 6 },
  skills: { perception: 4 },
  senses: ['darkvision 60 ft.', 'passive Perception 14'],
  languages: [],
  actions: [
    {
      name: 'Multiattack',
      description:
        'The wyvern makes two attacks: one with its bite and one with its stinger. While flying, it can use its claws in place of one other attack.',
    },
    {
      name: 'Bite',
      description: 'Melee Weapon Attack: +7 to hit, reach 10 ft., one creature.',
      attackBonus: 7,
      reach: 10,
      damage: [{ dice: { count: 2, die: 'd6', notation: '2d6+4' }, type: 'piercing' }],
    },
    {
      name: 'Claws',
      description: 'Melee Weapon Attack: +7 to hit, reach 5 ft., one target.',
      attackBonus: 7,
      reach: 5,
      damage: [{ dice: { count: 2, die: 'd8', notation: '2d8+4' }, type: 'slashing' }],
    },
    {
      name: 'Stinger',
      description: 'Melee Weapon Attack: +7 to hit, reach 10 ft., one creature.',
      attackBonus: 7,
      reach: 10,
      damage: [
        { dice: { count: 2, die: 'd6', notation: '2d6+4' }, type: 'piercing' },
        { dice: { count: 7, die: 'd6', notation: '7d6' }, type: 'poison' },
      ],
    },
  ],
  description: 'A draconic creature with a venomous stinger tail.',
  environment: ['hills', 'mountains'],
};

export const dnd5eCR6to10Monsters: Monster[] = [
  mage,
  chimera,
  medusa,
  wyvern,
  stoneGiant,
  youngRedDragon,
  cloudGiant,
  aboleth,
  {
    id: 'assassin',
    name: 'Assassin',
    system: 'dnd-5e-2014',
    source: 'SRD',
    size: 'medium',
    type: 'humanoid',
    alignment: 'unaligned',
    challengeRating: 8,
    experiencePoints: 3900,
    armorClass: 15,
    hitPoints: {
      count: 12,
      die: 'd8',
      modifier: 24,
      notation: '12d8+24',
    },
    speed: {
      walk: 30,
    },
    abilities: {
      str: 11,
      dex: 16,
      con: 14,
      int: 13,
      wis: 11,
      cha: 10,
    },
    savingThrows: {
      dex: 6,
      int: 4,
    },
    skills: {
      Acrobatics: 6,
      Deception: 3,
      Perception: 3,
      Stealth: 9,
    },
    damageResistances: ['poison'],
    senses: ['passive Perception 13'],
    languages: ["Thieves' cant plus any two languages"],
    specialAbilities: [
      {
        name: 'Assassinate',
        description:
          "During its first turn, the assassin has advantage on attack rolls against any creature that hasn't taken a turn. Any hit the assassin scores against a surprised creature is a critical hit.",
      },
      {
        name: 'Evasion',
        description:
          'If the assassin is subjected to an effect that allows it to make a Dexterity saving throw to take only half damage, the assassin instead takes no damage if it succeeds on the saving throw, and only half damage if it fails.',
      },
      {
        name: 'Sneak Attack (1/Turn)',
        description:
          "The assassin deals an extra 13 (4d6) damage when it hits a target with a weapon attack and has advantage on the attack roll, or when the target is within 5 ft. of an ally of the assassin that isn't incapacitated and the assassin doesn't have disadvantage on the attack roll.",
      },
    ],
    actions: [
      {
        name: 'Multiattack',
        description: 'The assassin makes two shortsword attacks.',
      },
      {
        name: 'Shortsword',
        description:
          'Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 6 (1d6 + 3) piercing damage, and the target must make a DC 15 Constitution saving throw, taking 24 (7d6) poison damage on a failed save, or half as much damage on a successful one.',
        attackBonus: 6,
        damage: [
          {
            dice: {
              count: 1,
              die: 'd6',
              modifier: 3,
              notation: '1d6+3',
            },
            type: 'piercing',
          },
          {
            dice: {
              count: 7,
              die: 'd6',
              modifier: 0,
              notation: '7d6',
            },
            type: 'poison',
          },
        ],
      },
      {
        name: 'Light Crossbow',
        description:
          'Ranged Weapon Attack: +6 to hit, range 80/320 ft., one target. Hit: 7 (1d8 + 3) piercing damage, and the target must make a DC 15 Constitution saving throw, taking 24 (7d6) poison damage on a failed save, or half as much damage on a successful one.',
        attackBonus: 6,
        damage: [
          {
            dice: {
              count: 1,
              die: 'd8',
              modifier: 3,
              notation: '1d8+3',
            },
            type: 'piercing',
          },
          {
            dice: {
              count: 7,
              die: 'd6',
              modifier: 0,
              notation: '7d6',
            },
            type: 'poison',
          },
        ],
      },
    ],
  },
  {
    id: 'bone-devil',
    name: 'Bone Devil',
    system: 'dnd-5e-2014',
    source: 'SRD',
    size: 'large',
    type: 'fiend',
    alignment: 'lawful evil',
    challengeRating: 9,
    experiencePoints: 5000,
    armorClass: 19,
    hitPoints: {
      count: 15,
      die: 'd10',
      modifier: 60,
      notation: '15d10+60',
    },
    speed: {
      walk: 40,
      fly: 40,
    },
    abilities: {
      str: 18,
      dex: 16,
      con: 18,
      int: 13,
      wis: 14,
      cha: 16,
    },
    savingThrows: {
      int: 5,
      wis: 6,
      cha: 7,
    },
    skills: {
      Deception: 7,
      Insight: 6,
    },
    damageResistances: [
      'cold',
      "bludgeoning, piercing, and slashing from nonmagical weapons that aren't silvered",
    ],
    damageImmunities: ['fire', 'poison'],
    conditionImmunities: ['Poisoned'],
    senses: ['darkvision 120 ft.', 'passive Perception 12'],
    languages: ['Infernal', 'telepathy 120 ft.'],
    specialAbilities: [
      {
        name: "Devil's Sight",
        description: "Magical darkness doesn't impede the devil's darkvision.",
      },
      {
        name: 'Magic Resistance',
        description:
          'The devil has advantage on saving throws against spells and other magical effects.',
      },
    ],
    actions: [
      {
        name: 'Multiattack',
        description: 'The devil makes three attacks: two with its claws and one with its sting.',
      },
      {
        name: 'Claw',
        description:
          'Melee Weapon Attack: +8 to hit, reach 10 ft., one target. Hit: 8 (1d8 + 4) slashing damage.',
        attackBonus: 8,
        damage: [
          {
            dice: {
              count: 1,
              die: 'd8',
              modifier: 4,
              notation: '1d8+4',
            },
            type: 'slashing',
          },
        ],
      },
      {
        name: 'Sting',
        description:
          'Melee Weapon Attack: +8 to hit, reach 10 ft., one target. Hit: 13 (2d8 + 4) piercing damage plus 17 (5d6) poison damage, and the target must succeed on a DC 14 Constitution saving throw or become poisoned for 1 minute. The target can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success.',
        attackBonus: 8,
        damage: [
          {
            dice: {
              count: 2,
              die: 'd8',
              modifier: 4,
              notation: '2d8+4',
            },
            type: 'piercing',
          },
          {
            dice: {
              count: 5,
              die: 'd6',
              modifier: 0,
              notation: '5d6',
            },
            type: 'poison',
          },
        ],
      },
    ],
  },
  {
    id: 'chain-devil',
    name: 'Chain Devil',
    system: 'dnd-5e-2014',
    source: 'SRD',
    size: 'medium',
    type: 'fiend',
    alignment: 'lawful evil',
    challengeRating: 8,
    experiencePoints: 3900,
    armorClass: 16,
    hitPoints: {
      count: 10,
      die: 'd8',
      modifier: 40,
      notation: '10d8+40',
    },
    speed: {
      walk: 30,
    },
    abilities: {
      str: 18,
      dex: 15,
      con: 18,
      int: 11,
      wis: 12,
      cha: 14,
    },
    savingThrows: {
      con: 7,
      wis: 4,
      cha: 5,
    },
    damageResistances: [
      'cold',
      "bludgeoning, piercing, and slashing from nonmagical weapons that aren't silvered",
    ],
    damageImmunities: ['fire', 'poison'],
    conditionImmunities: ['Poisoned'],
    senses: ['darkvision 120 ft.', 'passive Perception 11'],
    languages: ['Infernal', 'telepathy 120 ft.'],
    specialAbilities: [
      {
        name: "Devil's Sight",
        description: "Magical darkness doesn't impede the devil's darkvision.",
      },
      {
        name: 'Magic Resistance',
        description:
          'The devil has advantage on saving throws against spells and other magical effects.',
      },
    ],
    actions: [
      {
        name: 'Multiattack',
        description: 'The devil makes two attacks with its chains.',
      },
      {
        name: 'Chain',
        description:
          "Melee Weapon Attack: +8 to hit, reach 10 ft., one target. Hit: 11 (2d6 + 4) slashing damage. The target is grappled (escape DC 14) if the devil isn't already grappling a creature. Until this grapple ends, the target is restrained and takes 7 (2d6) piercing damage at the start of each of its turns.",
        attackBonus: 8,
        damage: [
          {
            dice: {
              count: 2,
              die: 'd6',
              modifier: 4,
              notation: '2d6+4',
            },
            type: 'slashing',
          },
        ],
      },
      {
        name: 'Animate Chains',
        description:
          "Up to four chains the devil can see within 60 feet of it magically sprout razor-edged barbs and animate under the devil's control, provided that the chains aren't being worn or carried. Each animated chain is an object with AC 20, 20 hit points, resistance to piercing damage, and immunity to psychic and thunder damage. When the devil uses Multiattack on its turn, it can use each animated chain to make one additional chain attack. An animated chain can grapple one creature of its own but can't make attacks while grappling. An animated chain reverts to its inanimate state if reduced to 0 hit points or if the devil is incapacitated or dies.",
      },
    ],
    reactions: [
      {
        name: 'Unnerving Mask',
        description:
          "When a creature the devil can see starts its turn within 30 feet of the devil, the devil can create the illusion that it looks like one of the creature's departed loved ones or bitter enemies. If the creature can see the devil, it must succeed on a DC 14 Wisdom saving throw or be frightened until the end of its turn.",
        savingThrow: {
          attribute: 'wis',
          dc: 14,
          effect: 'see description',
        },
      },
    ],
  },
  {
    id: 'clay-golem',
    name: 'Clay Golem',
    system: 'dnd-5e-2014',
    source: 'SRD',
    size: 'large',
    type: 'construct',
    alignment: 'unaligned',
    challengeRating: 9,
    experiencePoints: 5000,
    armorClass: 14,
    hitPoints: {
      count: 14,
      die: 'd10',
      modifier: 56,
      notation: '14d10+56',
    },
    speed: {
      walk: 20,
    },
    abilities: {
      str: 20,
      dex: 9,
      con: 18,
      int: 3,
      wis: 8,
      cha: 1,
    },
    damageImmunities: [
      'acid',
      'poison',
      'psychic',
      "bludgeoning, piercing, and slashing from nonmagical weapons that aren't adamantine",
    ],
    conditionImmunities: [
      'Charmed',
      'Exhaustion',
      'Frightened',
      'Paralyzed',
      'Petrified',
      'Poisoned',
    ],
    senses: ['darkvision 60 ft.', 'passive Perception 9'],
    languages: ["understands the languages of its creator but can't speak"],
    specialAbilities: [
      {
        name: 'Acid Absorption',
        description:
          'Whenever the golem is subjected to acid damage, it takes no damage and instead regains a number of hit points equal to the acid damage dealt.',
      },
      {
        name: 'Berserk',
        description:
          'Whenever the golem starts its turn with 60 hit points or fewer, roll a d6. On a 6, the golem goes berserk. On each of its turns while berserk, the golem attacks the nearest creature it can see. If no creature is near enough to move to and attack, the golem attacks an object, with preference for an object smaller than itself. Once the golem goes berserk, it continues to do so until it is destroyed or regains all its hit points.',
      },
      {
        name: 'Immutable Form',
        description: 'The golem is immune to any spell or effect that would alter its form.',
      },
      {
        name: 'Magic Resistance',
        description:
          'The golem has advantage on saving throws against spells and other magical effects.',
      },
      {
        name: 'Magic Weapons',
        description: "The golem's weapon attacks are magical.",
      },
    ],
    actions: [
      {
        name: 'Multiattack',
        description: 'The golem makes two slam attacks.',
      },
      {
        name: 'Slam',
        description:
          'Melee Weapon Attack: +8 to hit, reach 5 ft., one target. Hit: 16 (2d10 + 5) bludgeoning damage. If the target is a creature, it must succeed on a DC 15 Constitution saving throw or have its hit point maximum reduced by an amount equal to the damage taken. The target dies if this attack reduces its hit point maximum to 0. The reduction lasts until removed by the greater restoration spell or other magic.',
        attackBonus: 8,
        damage: [
          {
            dice: {
              count: 2,
              die: 'd10',
              modifier: 5,
              notation: '2d10+5',
            },
            type: 'bludgeoning',
          },
        ],
      },
      {
        name: 'Haste',
        description:
          'Until the end of its next turn, the golem magically gains a +2 bonus to its AC, has advantage on Dexterity saving throws, and can use its slam attack as a bonus action.',
        recharge: '5-6',
      },
    ],
  },
  {
    id: 'cloaker',
    name: 'Cloaker',
    system: 'dnd-5e-2014',
    source: 'SRD',
    size: 'large',
    type: 'aberration',
    alignment: 'chaotic neutral',
    challengeRating: 8,
    experiencePoints: 3900,
    armorClass: 14,
    hitPoints: {
      count: 12,
      die: 'd10',
      modifier: 12,
      notation: '12d10+12',
    },
    speed: {
      walk: 10,
      fly: 40,
    },
    abilities: {
      str: 17,
      dex: 15,
      con: 12,
      int: 13,
      wis: 12,
      cha: 14,
    },
    skills: {
      Stealth: 5,
    },
    senses: ['darkvision 60 ft.', 'passive Perception 11'],
    languages: ['Deep Speech', 'Undercommon'],
    specialAbilities: [
      {
        name: 'Damage Transfer',
        description:
          'While attached to a creature, the cloaker takes only half the damage dealt to it (rounded down). and that creature takes the other half.',
      },
      {
        name: 'False Appearance',
        description:
          'While the cloaker remains motionless without its underside exposed, it is indistinguishable from a dark leather cloak.',
      },
      {
        name: 'Light Sensitivity',
        description:
          'While in bright light, the cloaker has disadvantage on attack rolls and Wisdom (Perception) checks that rely on sight.',
      },
    ],
    actions: [
      {
        name: 'Multiattack',
        description: 'The cloaker makes two attacks: one with its bite and one with its tail.',
      },
      {
        name: 'Bite',
        description:
          "Melee Weapon Attack: +6 to hit, reach 5 ft., one creature. Hit: 10 (2d6 + 3) piercing damage, and if the target is Large or smaller, the cloaker attaches to it. If the cloaker has advantage against the target, the cloaker attaches to the target's head, and the target is blinded and unable to breathe while the cloaker is attached. While attached, the cloaker can make this attack only against the target and has advantage on the attack roll. The cloaker can detach itself by spending 5 feet of its movement. A creature, including the target, can take its action to detach the cloaker by succeeding on a DC 16 Strength check.",
        attackBonus: 6,
        damage: [
          {
            dice: {
              count: 2,
              die: 'd6',
              modifier: 3,
              notation: '2d6+3',
            },
            type: 'piercing',
          },
        ],
      },
      {
        name: 'Tail',
        description:
          'Melee Weapon Attack: +6 to hit, reach 10 ft., one creature. Hit: 7 (1d8 + 3) slashing damage.',
        attackBonus: 6,
        damage: [
          {
            dice: {
              count: 1,
              die: 'd8',
              modifier: 3,
              notation: '1d8+3',
            },
            type: 'slashing',
          },
        ],
      },
      {
        name: 'Moan',
        description:
          "Each creature within 60 feet of the cloaker that can hear its moan and that isn't an aberration must succeed on a DC 13 Wisdom saving throw or become frightened until the end of the cloaker's next turn. If a creature's saving throw is successful, the creature is immune to the cloaker's moan for the next 24 hours.",
        savingThrow: {
          attribute: 'wis',
          dc: 13,
          effect: 'see description',
        },
      },
      {
        name: 'Phantasms',
        description:
          "The cloaker magically creates three illusory duplicates of itself if it isn't in bright light. The duplicates move with it and mimic its actions, shifting position so as to make it impossible to track which cloaker is the real one. If the cloaker is ever in an area of bright light, the duplicates disappear. Whenever any creature targets the cloaker with an attack or a harmful spell while a duplicate remains, that creature rolls randomly to determine whether it targets the cloaker or one of the duplicates. A creature is unaffected by this magical effect if it can't see or if it relies on senses other than sight. A duplicate has the cloaker's AC and uses its saving throws. If an attack hits a duplicate, or if a duplicate fails a saving throw against an effect that deals damage, the duplicate disappears.",
      },
    ],
  },
  {
    id: 'deva',
    name: 'Deva',
    system: 'dnd-5e-2014',
    source: 'SRD',
    size: 'medium',
    type: 'celestial',
    alignment: 'lawful good',
    challengeRating: 10,
    experiencePoints: 5900,
    armorClass: 17,
    hitPoints: {
      count: 16,
      die: 'd8',
      modifier: 64,
      notation: '16d8+64',
    },
    speed: {
      walk: 30,
      fly: 90,
    },
    abilities: {
      str: 18,
      dex: 18,
      con: 18,
      int: 17,
      wis: 20,
      cha: 20,
    },
    savingThrows: {
      wis: 9,
      cha: 9,
    },
    skills: {
      Insight: 9,
      Perception: 9,
    },
    damageResistances: ['radiant', 'bludgeoning, piercing, and slashing from nonmagical weapons'],
    conditionImmunities: ['Charmed', 'Exhaustion', 'Frightened'],
    senses: ['darkvision 120 ft.', 'passive Perception 19'],
    languages: ['all', 'telepathy 120 ft.'],
    specialAbilities: [
      {
        name: 'Angelic Weapons',
        description:
          "The deva's weapon attacks are magical. When the deva hits with any weapon, the weapon deals an extra 4d8 radiant damage (included in the attack).",
      },
      {
        name: 'Innate Spellcasting',
        description:
          "The deva's spellcasting ability is Charisma (spell save DC 17). The deva can innately cast the following spells, requiring only verbal components: At will: detect evil and good 1/day each: commune, raise dead",
      },
      {
        name: 'Magic Resistance',
        description:
          'The deva has advantage on saving throws against spells and other magical effects.',
      },
    ],
    actions: [
      {
        name: 'Multiattack',
        description: 'The deva makes two melee attacks.',
      },
      {
        name: 'Mace',
        description:
          'Melee Weapon Attack: +8 to hit, reach 5 ft., one target. Hit: 7 (1d6 + 4) bludgeoning damage plus 18 (4d8) radiant damage.',
        attackBonus: 8,
        damage: [
          {
            dice: {
              count: 1,
              die: 'd6',
              modifier: 4,
              notation: '1d6+4',
            },
            type: 'bludgeoning',
          },
          {
            dice: {
              count: 4,
              die: 'd8',
              modifier: 0,
              notation: '4d8',
            },
            type: 'radiant',
          },
        ],
      },
      {
        name: 'Healing Touch',
        description:
          'The deva touches another creature. The target magically regains 20 (4d8 + 2) hit points and is freed from any curse, disease, poison, blindness, or deafness.',
      },
      {
        name: 'Change Shape',
        description:
          "The deva magically polymorphs into a humanoid or beast that has a challenge rating equal to or less than its own, or back into its true form. It reverts to its true form if it dies. Any equipment it is wearing or carrying is absorbed or borne by the new form (the deva's choice). In a new form, the deva retains its game statistics and ability to speak, but its AC, movement modes, Strength, Dexterity, and special senses are replaced by those of the new form, and it gains any statistics and capabilities (except class features, legendary actions, and lair actions) that the new form has but that it lacks.",
      },
    ],
  },
  {
    id: 'drider',
    name: 'Drider',
    system: 'dnd-5e-2014',
    source: 'SRD',
    size: 'large',
    type: 'monstrosity',
    alignment: 'chaotic evil',
    challengeRating: 6,
    experiencePoints: 2300,
    armorClass: 19,
    hitPoints: {
      count: 13,
      die: 'd10',
      modifier: 52,
      notation: '13d10+52',
    },
    speed: {
      walk: 30,
      climb: 30,
    },
    abilities: {
      str: 16,
      dex: 16,
      con: 18,
      int: 13,
      wis: 14,
      cha: 12,
    },
    skills: {
      Perception: 5,
      Stealth: 9,
    },
    senses: ['darkvision 120 ft.', 'passive Perception 15'],
    languages: ['Elvish', 'Undercommon'],
    specialAbilities: [
      {
        name: 'Fey Ancestry',
        description:
          "The drider has advantage on saving throws against being charmed, and magic can't put the drider to sleep.",
      },
      {
        name: 'Innate Spellcasting',
        description:
          "The drider's innate spellcasting ability is Wisdom (spell save DC 13). The drider can innately cast the following spells, requiring no material components: At will: dancing lights 1/day each: darkness, faerie fire",
      },
      {
        name: 'Spider Climb',
        description:
          'The drider can climb difficult surfaces, including upside down on ceilings, without needing to make an ability check.',
      },
      {
        name: 'Sunlight Sensitivity',
        description:
          'While in sunlight, the drider has disadvantage on attack rolls, as well as on Wisdom (Perception) checks that rely on sight.',
      },
      {
        name: 'Web Walker',
        description: 'The drider ignores movement restrictions caused by webbing.',
      },
    ],
    actions: [
      {
        name: 'Multiattack',
        description:
          'The drider makes three attacks, either with its longsword or its longbow. It can replace one of those attacks with a bite attack.',
      },
      {
        name: 'Bite',
        description:
          'Melee Weapon Attack: +6 to hit, reach 5 ft., one creature. Hit: 2 (1d4) piercing damage plus 9 (2d8) poison damage.',
        attackBonus: 6,
        damage: [
          {
            dice: {
              count: 1,
              die: 'd4',
              modifier: 0,
              notation: '1d4',
            },
            type: 'piercing',
          },
          {
            dice: {
              count: 2,
              die: 'd8',
              modifier: 0,
              notation: '2d8',
            },
            type: 'poison',
          },
        ],
      },
      {
        name: 'Longsword',
        description:
          'Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 7 (1d8 + 3) slashing damage, or 8 (1d10 + 3) slashing damage if used with two hands.',
        attackBonus: 6,
      },
      {
        name: 'Longbow',
        description:
          'Ranged Weapon Attack: +6 to hit, range 150/600 ft., one target. Hit: 7 (1d8 + 3) piercing damage plus 4 (1d8) poison damage.',
        attackBonus: 6,
        damage: [
          {
            dice: {
              count: 1,
              die: 'd8',
              modifier: 3,
              notation: '1d8+3',
            },
            type: 'piercing',
          },
          {
            dice: {
              count: 1,
              die: 'd8',
              modifier: 0,
              notation: '1d8',
            },
            type: 'poison',
          },
        ],
      },
    ],
  },
  {
    id: 'fire-giant',
    name: 'Fire Giant',
    system: 'dnd-5e-2014',
    source: 'SRD',
    size: 'huge',
    type: 'giant',
    alignment: 'lawful evil',
    challengeRating: 9,
    experiencePoints: 5000,
    armorClass: 18,
    hitPoints: {
      count: 13,
      die: 'd12',
      modifier: 78,
      notation: '13d12+78',
    },
    speed: {
      walk: 30,
    },
    abilities: {
      str: 25,
      dex: 9,
      con: 23,
      int: 10,
      wis: 14,
      cha: 13,
    },
    savingThrows: {
      dex: 3,
      con: 10,
      cha: 5,
    },
    skills: {
      Athletics: 11,
      Perception: 6,
    },
    damageImmunities: ['fire'],
    senses: ['passive Perception 16'],
    languages: ['Giant'],
    actions: [
      {
        name: 'Multiattack',
        description: 'The giant makes two greatsword attacks.',
      },
      {
        name: 'Greatsword',
        description:
          'Melee Weapon Attack: +11 to hit, reach 10 ft., one target. Hit: 28 (6d6 + 7) slashing damage.',
        attackBonus: 11,
        damage: [
          {
            dice: {
              count: 6,
              die: 'd6',
              modifier: 7,
              notation: '6d6+7',
            },
            type: 'slashing',
          },
        ],
      },
      {
        name: 'Rock',
        description:
          'Ranged Weapon Attack: +11 to hit, range 60/240 ft., one target. Hit: 29 (4d10 + 7) bludgeoning damage.',
        attackBonus: 11,
        damage: [
          {
            dice: {
              count: 4,
              die: 'd10',
              modifier: 7,
              notation: '4d10+7',
            },
            type: 'bludgeoning',
          },
        ],
      },
    ],
  },
  {
    id: 'frost-giant',
    name: 'Frost Giant',
    system: 'dnd-5e-2014',
    source: 'SRD',
    size: 'huge',
    type: 'giant',
    alignment: 'neutral evil',
    challengeRating: 8,
    experiencePoints: 3900,
    armorClass: 15,
    hitPoints: {
      count: 12,
      die: 'd12',
      modifier: 60,
      notation: '12d12+60',
    },
    speed: {
      walk: 40,
    },
    abilities: {
      str: 23,
      dex: 9,
      con: 21,
      int: 9,
      wis: 10,
      cha: 12,
    },
    savingThrows: {
      con: 8,
      wis: 3,
      cha: 4,
    },
    skills: {
      Athletics: 9,
      Perception: 3,
    },
    damageImmunities: ['cold'],
    senses: ['passive Perception 13'],
    languages: ['Giant'],
    actions: [
      {
        name: 'Multiattack',
        description: 'The giant makes two greataxe attacks.',
      },
      {
        name: 'Greataxe',
        description:
          'Melee Weapon Attack: +9 to hit, reach 10 ft., one target. Hit: 25 (3d12 + 6) slashing damage.',
        attackBonus: 9,
        damage: [
          {
            dice: {
              count: 3,
              die: 'd12',
              modifier: 6,
              notation: '3d12+6',
            },
            type: 'slashing',
          },
        ],
      },
      {
        name: 'Rock',
        description:
          'Ranged Weapon Attack: +9 to hit, range 60/240 ft., one target. Hit: 28 (4d10 + 6) bludgeoning damage.',
        attackBonus: 9,
        damage: [
          {
            dice: {
              count: 4,
              die: 'd10',
              modifier: 6,
              notation: '4d10+6',
            },
            type: 'bludgeoning',
          },
        ],
      },
    ],
  },
  {
    id: 'giant-ape',
    name: 'Giant Ape',
    system: 'dnd-5e-2014',
    source: 'SRD',
    size: 'huge',
    type: 'beast',
    alignment: 'unaligned',
    challengeRating: 7,
    experiencePoints: 2900,
    armorClass: 12,
    hitPoints: {
      count: 15,
      die: 'd12',
      modifier: 60,
      notation: '15d12+60',
    },
    speed: {
      walk: 40,
      climb: 40,
    },
    abilities: {
      str: 23,
      dex: 14,
      con: 18,
      int: 7,
      wis: 12,
      cha: 7,
    },
    skills: {
      Athletics: 9,
      Perception: 4,
    },
    senses: ['passive Perception 14'],
    languages: [],
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
        damage: [
          {
            dice: {
              count: 3,
              die: 'd10',
              modifier: 6,
              notation: '3d10+6',
            },
            type: 'bludgeoning',
          },
        ],
      },
      {
        name: 'Rock',
        description:
          'Ranged Weapon Attack: +9 to hit, range 50/100 ft., one target. Hit: 30 (7d6 + 6) bludgeoning damage.',
        attackBonus: 9,
        damage: [
          {
            dice: {
              count: 7,
              die: 'd6',
              modifier: 6,
              notation: '7d6+6',
            },
            type: 'bludgeoning',
          },
        ],
      },
    ],
  },
  {
    id: 'glabrezu',
    name: 'Glabrezu',
    system: 'dnd-5e-2014',
    source: 'SRD',
    size: 'large',
    type: 'fiend',
    alignment: 'chaotic evil',
    challengeRating: 9,
    experiencePoints: 5000,
    armorClass: 17,
    hitPoints: {
      count: 15,
      die: 'd10',
      modifier: 75,
      notation: '15d10+75',
    },
    speed: {
      walk: 40,
    },
    abilities: {
      str: 20,
      dex: 15,
      con: 21,
      int: 19,
      wis: 17,
      cha: 16,
    },
    savingThrows: {
      str: 9,
      con: 9,
      wis: 7,
      cha: 7,
    },
    damageResistances: [
      'cold',
      'fire',
      'lightning',
      'bludgeoning, piercing, and slashing from nonmagical weapons',
    ],
    damageImmunities: ['poison'],
    conditionImmunities: ['Poisoned'],
    senses: ['truesight 120 ft.', 'passive Perception 13'],
    languages: ['Abyssal', 'telepathy 120 ft.'],
    specialAbilities: [
      {
        name: 'Innate Spellcasting',
        description:
          "The glabrezu's spellcasting ability is Intelligence (spell save DC 16). The glabrezu can innately cast the following spells, requiring no material components: At will: darkness, detect magic, dispel magic 1/day each: confusion, fly, power word stun",
      },
      {
        name: 'Magic Resistance',
        description:
          'The glabrezu has advantage on saving throws against spells and other magical effects.',
      },
    ],
    actions: [
      {
        name: 'Multiattack',
        description:
          'The glabrezu makes four attacks: two with its pincers and two with its fists. Alternatively, it makes two attacks with its pincers and casts one spell.',
      },
      {
        name: 'Pincer',
        description:
          'Melee Weapon Attack: +9 to hit, reach 10 ft., one target. Hit: 16 (2d10 + 5) bludgeoning damage. If the target is a Medium or smaller creature, it is grappled (escape DC 15). The glabrezu has two pincers, each of which can grapple only one target.',
        attackBonus: 9,
        damage: [
          {
            dice: {
              count: 2,
              die: 'd10',
              modifier: 5,
              notation: '2d10+5',
            },
            type: 'bludgeoning',
          },
        ],
      },
      {
        name: 'Fist',
        description:
          'Melee Weapon Attack: +9 to hit, reach 5 ft., one target. Hit: 7 (2d4 + 2) bludgeoning damage.',
        attackBonus: 9,
        damage: [
          {
            dice: {
              count: 2,
              die: 'd4',
              modifier: 2,
              notation: '2d4+2',
            },
            type: 'bludgeoning',
          },
        ],
      },
    ],
  },
  {
    id: 'guardian-naga',
    name: 'Guardian Naga',
    system: 'dnd-5e-2014',
    source: 'SRD',
    size: 'large',
    type: 'monstrosity',
    alignment: 'lawful good',
    challengeRating: 10,
    experiencePoints: 5900,
    armorClass: 18,
    hitPoints: {
      count: 15,
      die: 'd10',
      modifier: 45,
      notation: '15d10+45',
    },
    speed: {
      walk: 40,
    },
    abilities: {
      str: 19,
      dex: 18,
      con: 16,
      int: 16,
      wis: 19,
      cha: 18,
    },
    savingThrows: {
      dex: 8,
      con: 7,
      int: 7,
      wis: 8,
      cha: 8,
    },
    damageImmunities: ['poison'],
    conditionImmunities: ['Charmed', 'Poisoned'],
    senses: ['darkvision 60 ft.', 'passive Perception 14'],
    languages: ['Celestial', 'Common'],
    specialAbilities: [
      {
        name: 'Rejuvenation',
        description:
          'If it dies, the naga returns to life in 1d6 days and regains all its hit points. Only a wish spell can prevent this trait from functioning.',
      },
      {
        name: 'Spellcasting',
        description:
          'The naga is an 11th-level spellcaster. Its spellcasting ability is Wisdom (spell save DC 16, +8 to hit with spell attacks), and it needs only verbal components to cast its spells. It has the following cleric spells prepared: - Cantrips (at will): mending, sacred flame, thaumaturgy - 1st level (4 slots): command, cure wounds, shield of faith - 2nd level (3 slots): calm emotions, hold person - 3rd level (3 slots): bestow curse, clairvoyance - 4th level (3 slots): banishment, freedom of movement - 5th level (2 slots): flame strike, geas - 6th level (1 slot): true seeing',
      },
    ],
    actions: [
      {
        name: 'Bite',
        description:
          'Melee Weapon Attack: +8 to hit, reach 10 ft., one creature. Hit: 8 (1d8 + 4) piercing damage, and the target must make a DC 15 Constitution saving throw, taking 45 (10d8) poison damage on a failed save, or half as much damage on a successful one.',
        attackBonus: 8,
        damage: [
          {
            dice: {
              count: 1,
              die: 'd8',
              modifier: 4,
              notation: '1d8+4',
            },
            type: 'piercing',
          },
        ],
      },
      {
        name: 'Spit Poison',
        description:
          'Ranged Weapon Attack: +8 to hit, range 15/30 ft., one creature. Hit: The target must make a DC 15 Constitution saving throw, taking 45 (10d8) poison damage on a failed save, or half as much damage on a successful one.',
        attackBonus: 8,
      },
    ],
  },
  {
    id: 'hezrou',
    name: 'Hezrou',
    system: 'dnd-5e-2014',
    source: 'SRD',
    size: 'large',
    type: 'fiend',
    alignment: 'chaotic evil',
    challengeRating: 8,
    experiencePoints: 3900,
    armorClass: 16,
    hitPoints: {
      count: 13,
      die: 'd10',
      modifier: 65,
      notation: '13d10+65',
    },
    speed: {
      walk: 30,
    },
    abilities: {
      str: 19,
      dex: 17,
      con: 20,
      int: 5,
      wis: 12,
      cha: 13,
    },
    savingThrows: {
      str: 7,
      con: 8,
      wis: 4,
    },
    damageResistances: [
      'cold',
      'fire',
      'lightning',
      'bludgeoning, piercing, and slashing from nonmagical weapons',
    ],
    damageImmunities: ['poison'],
    conditionImmunities: ['Poisoned'],
    senses: ['darkvision 120 ft.', 'passive Perception 11'],
    languages: ['Abyssal', 'telepathy 120 ft.'],
    specialAbilities: [
      {
        name: 'Magic Resistance',
        description:
          'The hezrou has advantage on saving throws against spells and other magical effects.',
      },
      {
        name: 'Stench',
        description:
          "Any creature that starts its turn within 10 feet of the hezrou must succeed on a DC 14 Constitution saving throw or be poisoned until the start of its next turn. On a successful saving throw, the creature is immune to the hezrou's stench for 24 hours.",
      },
    ],
    actions: [
      {
        name: 'Multiattack',
        description: 'The hezrou makes three attacks: one with its bite and two with its claws.',
      },
      {
        name: 'Bite',
        description:
          'Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 15 (2d10 + 4) piercing damage.',
        attackBonus: 7,
        damage: [
          {
            dice: {
              count: 2,
              die: 'd10',
              modifier: 4,
              notation: '2d10+4',
            },
            type: 'piercing',
          },
        ],
      },
      {
        name: 'Claws',
        description:
          'Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 11 (2d6 + 4) slashing damage.',
        attackBonus: 7,
        damage: [
          {
            dice: {
              count: 2,
              die: 'd6',
              modifier: 4,
              notation: '2d6+4',
            },
            type: 'slashing',
          },
        ],
      },
    ],
  },
  {
    id: 'hydra',
    name: 'Hydra',
    system: 'dnd-5e-2014',
    source: 'SRD',
    size: 'huge',
    type: 'monstrosity',
    alignment: 'unaligned',
    challengeRating: 8,
    experiencePoints: 3900,
    armorClass: 15,
    hitPoints: {
      count: 15,
      die: 'd12',
      modifier: 75,
      notation: '15d12+75',
    },
    speed: {
      walk: 30,
      swim: 30,
    },
    abilities: {
      str: 20,
      dex: 12,
      con: 20,
      int: 2,
      wis: 10,
      cha: 7,
    },
    skills: {
      Perception: 6,
    },
    senses: ['darkvision 60 ft.', 'passive Perception 16'],
    languages: [],
    specialAbilities: [
      {
        name: 'Hold Breath',
        description: 'The hydra can hold its breath for 1 hour.',
      },
      {
        name: 'Multiple Heads',
        description:
          'The hydra has five heads. While it has more than one head, the hydra has advantage on saving throws against being blinded, charmed, deafened, frightened, stunned, and knocked unconscious. Whenever the hydra takes 25 or more damage in a single turn, one of its heads dies. If all its heads die, the hydra dies. At the end of its turn, it grows two heads for each of its heads that died since its last turn, unless it has taken fire damage since its last turn. The hydra regains 10 hit points for each head regrown in this way.',
      },
      {
        name: 'Reactive Heads',
        description:
          'For each head the hydra has beyond one, it gets an extra reaction that can be used only for opportunity attacks.',
      },
      {
        name: 'Wakeful',
        description: 'While the hydra sleeps, at least one of its heads is awake.',
      },
    ],
    actions: [
      {
        name: 'Multiattack',
        description: 'The hydra makes as many bite attacks as it has heads.',
      },
      {
        name: 'Bite',
        description:
          'Melee Weapon Attack: +8 to hit, reach 10 ft., one target. Hit: 10 (1d10 + 5) piercing damage.',
        attackBonus: 8,
        damage: [
          {
            dice: {
              count: 1,
              die: 'd10',
              modifier: 5,
              notation: '1d10+5',
            },
            type: 'piercing',
          },
        ],
      },
    ],
  },
  {
    id: 'invisible-stalker',
    name: 'Invisible Stalker',
    system: 'dnd-5e-2014',
    source: 'SRD',
    size: 'medium',
    type: 'elemental',
    alignment: 'true neutral',
    challengeRating: 6,
    experiencePoints: 2300,
    armorClass: 14,
    hitPoints: {
      count: 16,
      die: 'd8',
      modifier: 32,
      notation: '16d8+32',
    },
    speed: {
      walk: 50,
      fly: 50,
    },
    abilities: {
      str: 16,
      dex: 19,
      con: 14,
      int: 10,
      wis: 15,
      cha: 11,
    },
    skills: {
      Perception: 8,
      Stealth: 10,
    },
    damageResistances: ['bludgeoning, piercing, and slashing from nonmagical weapons'],
    damageImmunities: ['poison'],
    conditionImmunities: [
      'Exhaustion',
      'Grappled',
      'Paralyzed',
      'Petrified',
      'Poisoned',
      'Prone',
      'Restrained',
      'Unconscious',
    ],
    senses: ['darkvision 60 ft.', 'passive Perception 18'],
    languages: ['Auran', "understands Common but doesn't speak it"],
    specialAbilities: [
      {
        name: 'Invisibility',
        description: 'The stalker is invisible.',
      },
      {
        name: 'Faultless Tracker',
        description:
          'The stalker is given a quarry by its summoner. The stalker knows the direction and distance to its quarry as long as the two of them are on the same plane of existence. The stalker also knows the location of its summoner.',
      },
    ],
    actions: [
      {
        name: 'Multiattack',
        description: 'The stalker makes two slam attacks.',
      },
      {
        name: 'Slam',
        description:
          'Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 10 (2d6 + 3) bludgeoning damage.',
        attackBonus: 6,
        damage: [
          {
            dice: {
              count: 2,
              die: 'd6',
              modifier: 3,
              notation: '2d6+3',
            },
            type: 'bludgeoning',
          },
        ],
      },
    ],
  },
  {
    id: 'mammoth',
    name: 'Mammoth',
    system: 'dnd-5e-2014',
    source: 'SRD',
    size: 'huge',
    type: 'beast',
    alignment: 'unaligned',
    challengeRating: 6,
    experiencePoints: 2300,
    armorClass: 13,
    hitPoints: {
      count: 11,
      die: 'd12',
      modifier: 55,
      notation: '11d12+55',
    },
    speed: {
      walk: 40,
    },
    abilities: {
      str: 24,
      dex: 9,
      con: 21,
      int: 3,
      wis: 11,
      cha: 6,
    },
    senses: ['passive Perception 10'],
    languages: [],
    specialAbilities: [
      {
        name: 'Trampling Charge',
        description:
          'If the mammoth moves at least 20 ft. straight toward a creature and then hits it with a gore attack on the same turn, that target must succeed on a DC 18 Strength saving throw or be knocked prone. If the target is prone, the mammoth can make one stomp attack against it as a bonus action.',
      },
    ],
    actions: [
      {
        name: 'Gore',
        description:
          'Melee Weapon Attack: +10 to hit, reach 10 ft., one target. Hit: 25 (4d8 + 7) piercing damage.',
        attackBonus: 10,
        damage: [
          {
            dice: {
              count: 4,
              die: 'd8',
              modifier: 7,
              notation: '4d8+7',
            },
            type: 'piercing',
          },
        ],
      },
      {
        name: 'Stomp',
        description:
          'Melee Weapon Attack: +10 to hit, reach 5 ft., one prone creature. Hit: 29 (4d10 + 7) bludgeoning damage.',
        attackBonus: 10,
        damage: [
          {
            dice: {
              count: 4,
              die: 'd10',
              modifier: 7,
              notation: '4d10+7',
            },
            type: 'bludgeoning',
          },
        ],
      },
    ],
  },
  {
    id: 'oni',
    name: 'Oni',
    system: 'dnd-5e-2014',
    source: 'SRD',
    size: 'large',
    type: 'giant',
    alignment: 'lawful evil',
    challengeRating: 7,
    experiencePoints: 2900,
    armorClass: 16,
    hitPoints: {
      count: 13,
      die: 'd10',
      modifier: 39,
      notation: '13d10+39',
    },
    speed: {
      walk: 30,
      fly: 30,
    },
    abilities: {
      str: 19,
      dex: 11,
      con: 16,
      int: 14,
      wis: 12,
      cha: 15,
    },
    savingThrows: {
      dex: 3,
      con: 6,
      wis: 4,
      cha: 5,
    },
    skills: {
      Arcana: 5,
      Deception: 8,
      Perception: 4,
    },
    senses: ['darkvision 60 ft.', 'passive Perception 14'],
    languages: ['Common', 'Giant'],
    specialAbilities: [
      {
        name: 'Innate Spellcasting',
        description:
          "The oni's innate spellcasting ability is Charisma (spell save DC 13). The oni can innately cast the following spells, requiring no material components: At will: darkness, invisibility 1/day each: charm person, cone of cold, gaseous form, sleep",
      },
      {
        name: 'Magic Weapons',
        description: "The oni's weapon attacks are magical.",
      },
      {
        name: 'Regeneration',
        description:
          'The oni regains 10 hit points at the start of its turn if it has at least 1 hit point.',
      },
    ],
    actions: [
      {
        name: 'Multiattack',
        description: 'The oni makes two attacks, either with its claws or its glaive.',
      },
      {
        name: 'Claw (Oni Form Only)',
        description:
          'Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 8 (1d8 + 4) slashing damage.',
        attackBonus: 7,
        damage: [
          {
            dice: {
              count: 1,
              die: 'd8',
              modifier: 4,
              notation: '1d8+4',
            },
            type: 'slashing',
          },
        ],
      },
      {
        name: 'Glaive',
        description:
          'Melee Weapon Attack: +7 to hit, reach 10 ft., one target. Hit: 15 (2d10 + 4) slashing damage, or 9 (1d10 + 4) slashing damage in Small or Medium form.',
        attackBonus: 7,
        damage: [
          {
            dice: {
              count: 2,
              die: 'd10',
              modifier: 4,
              notation: '2d10+4',
            },
            type: 'slashing',
          },
        ],
      },
      {
        name: 'Change Shape',
        description:
          'The oni magically polymorphs into a Small or Medium humanoid, into a Large giant, or back into its true form. Other than its size, its statistics are the same in each form. The only equipment that is transformed is its glaive, which shrinks so that it can be wielded in humanoid form. If the oni dies, it reverts to its true form, and its glaive reverts to its normal size.',
      },
    ],
  },
  {
    id: 'shield-guardian',
    name: 'Shield Guardian',
    system: 'dnd-5e-2014',
    source: 'SRD',
    size: 'large',
    type: 'construct',
    alignment: 'unaligned',
    challengeRating: 7,
    experiencePoints: 2900,
    armorClass: 17,
    hitPoints: {
      count: 15,
      die: 'd10',
      modifier: 60,
      notation: '15d10+60',
    },
    speed: {
      walk: 30,
    },
    abilities: {
      str: 18,
      dex: 8,
      con: 18,
      int: 7,
      wis: 10,
      cha: 3,
    },
    damageImmunities: ['poison'],
    conditionImmunities: ['Charmed', 'Exhaustion', 'Frightened', 'Paralyzed', 'Poisoned'],
    senses: ['blindsight 10 ft.', 'darkvision 60 ft.', 'passive Perception 10'],
    languages: ["understands commands given in any language but can't speak"],
    specialAbilities: [
      {
        name: 'Bound',
        description:
          "The shield guardian is magically bound to an amulet. As long as the guardian and its amulet are on the same plane of existence, the amulet's wearer can telepathically call the guardian to travel to it, and the guardian knows the distance and direction to the amulet. If the guardian is within 60 feet of the amulet's wearer, half of any damage the wearer takes (rounded up) is transferred to the guardian.",
      },
      {
        name: 'Regeneration',
        description:
          'The shield guardian regains 10 hit points at the start of its turn if it has at least 1 hit. point.',
      },
      {
        name: 'Spell Storing',
        description:
          "A spellcaster who wears the shield guardian's amulet can cause the guardian to store one spell of 4th level or lower. To do so, the wearer must cast the spell on the guardian. The spell has no effect but is stored within the guardian. When commanded to do so by the wearer or when a situation arises that was predefined by the spellcaster, the guardian casts the stored spell with any parameters set by the original caster, requiring no components. When the spell is cast or a new spell is stored, any previously stored spell is lost.",
      },
    ],
    actions: [
      {
        name: 'Multiattack',
        description: 'The guardian makes two fist attacks.',
      },
      {
        name: 'Fist',
        description:
          'Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 11 (2d6 + 4) bludgeoning damage.',
        attackBonus: 7,
        damage: [
          {
            dice: {
              count: 2,
              die: 'd6',
              modifier: 4,
              notation: '2d6+4',
            },
            type: 'bludgeoning',
          },
        ],
      },
    ],
    reactions: [
      {
        name: 'Shield',
        description:
          "When a creature makes an attack against the wearer of the guardian's amulet, the guardian grants a +2 bonus to the wearer's AC if the guardian is within 5 feet of the wearer.",
      },
    ],
  },
  {
    id: 'spirit-naga',
    name: 'Spirit Naga',
    system: 'dnd-5e-2014',
    source: 'SRD',
    size: 'large',
    type: 'monstrosity',
    alignment: 'chaotic evil',
    challengeRating: 8,
    experiencePoints: 3900,
    armorClass: 15,
    hitPoints: {
      count: 10,
      die: 'd10',
      modifier: 20,
      notation: '10d10+20',
    },
    speed: {
      walk: 40,
    },
    abilities: {
      str: 18,
      dex: 17,
      con: 14,
      int: 16,
      wis: 15,
      cha: 16,
    },
    savingThrows: {
      dex: 6,
      con: 5,
      wis: 5,
      cha: 6,
    },
    damageImmunities: ['poison'],
    conditionImmunities: ['Charmed', 'Poisoned'],
    senses: ['darkvision 60 ft.', 'passive Perception 12'],
    languages: ['Abyssal', 'Common'],
    specialAbilities: [
      {
        name: 'Rejuvenation',
        description:
          'If it dies, the naga returns to life in 1d6 days and regains all its hit points. Only a wish spell can prevent this trait from functioning.',
      },
      {
        name: 'Spellcasting',
        description:
          'The naga is a 10th-level spellcaster. Its spellcasting ability is Intelligence (spell save DC 14, +6 to hit with spell attacks), and it needs only verbal components to cast its spells. It has the following wizard spells prepared: - Cantrips (at will): mage hand, minor illusion, ray of frost - 1st level (4 slots): charm person, detect magic, sleep - 2nd level (3 slots): detect thoughts, hold person - 3rd level (3 slots): lightning bolt, water breathing - 4th level (3 slots): blight, dimension door - 5th level (2 slots): dominate person',
      },
    ],
    actions: [
      {
        name: 'Bite',
        description:
          'Melee Weapon Attack: +7 to hit, reach 10 ft., one creature. Hit: 7 (1d6 + 4) piercing damage, and the target must make a DC 13 Constitution saving throw, taking 31 (7d8) poison damage on a failed save, or half as much damage on a successful one.',
        attackBonus: 7,
        damage: [
          {
            dice: {
              count: 1,
              die: 'd6',
              modifier: 4,
              notation: '1d6+4',
            },
            type: 'piercing',
          },
        ],
      },
    ],
  },
  {
    id: 'stone-golem',
    name: 'Stone Golem',
    system: 'dnd-5e-2014',
    source: 'SRD',
    size: 'large',
    type: 'construct',
    alignment: 'unaligned',
    challengeRating: 10,
    experiencePoints: 5900,
    armorClass: 17,
    hitPoints: {
      count: 17,
      die: 'd10',
      modifier: 85,
      notation: '17d10+85',
    },
    speed: {
      walk: 30,
    },
    abilities: {
      str: 22,
      dex: 9,
      con: 20,
      int: 3,
      wis: 11,
      cha: 1,
    },
    damageImmunities: [
      'poison',
      'psychic',
      "bludgeoning, piercing, and slashing from nonmagical weapons that aren't adamantine",
    ],
    conditionImmunities: [
      'Charmed',
      'Exhaustion',
      'Frightened',
      'Paralyzed',
      'Petrified',
      'Poisoned',
    ],
    senses: ['darkvision 120 ft.', 'passive Perception 10'],
    languages: ["understands the languages of its creator but can't speak"],
    specialAbilities: [
      {
        name: 'Immutable Form',
        description: 'The golem is immune to any spell or effect that would alter its form.',
      },
      {
        name: 'Magic Resistance',
        description:
          'The golem has advantage on saving throws against spells and other magical effects.',
      },
      {
        name: 'Magic Weapons',
        description: "The golem's weapon attacks are magical.",
      },
    ],
    actions: [
      {
        name: 'Multiattack',
        description: 'The golem makes two slam attacks.',
      },
      {
        name: 'Slam',
        description:
          'Melee Weapon Attack: +10 to hit, reach 5 ft., one target. Hit: 19 (3d8 + 6) bludgeoning damage.',
        attackBonus: 10,
        damage: [
          {
            dice: {
              count: 3,
              die: 'd8',
              modifier: 6,
              notation: '3d8+6',
            },
            type: 'bludgeoning',
          },
        ],
      },
      {
        name: 'Slow',
        description:
          "The golem targets one or more creatures it can see within 10 ft. of it. Each target must make a DC 17 Wisdom saving throw against this magic. On a failed save, a target can't use reactions, its speed is halved, and it can't make more than one attack on its turn. In addition, the target can take either an action or a bonus action on its turn, not both. These effects last for 1 minute. A target can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success.",
        savingThrow: {
          attribute: 'wis',
          dc: 17,
          effect: 'see description',
        },
        recharge: '5-6',
      },
    ],
  },
  {
    id: 'treant',
    name: 'Treant',
    system: 'dnd-5e-2014',
    source: 'SRD',
    size: 'huge',
    type: 'plant',
    alignment: 'chaotic good',
    challengeRating: 9,
    experiencePoints: 5000,
    armorClass: 16,
    hitPoints: {
      count: 12,
      die: 'd12',
      modifier: 60,
      notation: '12d12+60',
    },
    speed: {
      walk: 30,
    },
    abilities: {
      str: 23,
      dex: 8,
      con: 21,
      int: 12,
      wis: 16,
      cha: 12,
    },
    damageResistances: ['bludgeoning', 'piercing'],
    damageVulnerabilities: ['fire'],
    senses: ['passive Perception 13'],
    languages: ['Common', 'Druidic', 'Elvish', 'Sylvan'],
    specialAbilities: [
      {
        name: 'False Appearance',
        description:
          'While the treant remains motionless, it is indistinguishable from a normal tree.',
      },
      {
        name: 'Siege Monster',
        description: 'The treant deals double damage to objects and structures.',
      },
    ],
    actions: [
      {
        name: 'Multiattack',
        description: 'The treant makes two slam attacks.',
      },
      {
        name: 'Slam',
        description:
          'Melee Weapon Attack: +10 to hit, reach 5 ft., one target. Hit: 16 (3d6 + 6) bludgeoning damage.',
        attackBonus: 10,
        damage: [
          {
            dice: {
              count: 3,
              die: 'd6',
              modifier: 6,
              notation: '3d6+6',
            },
            type: 'bludgeoning',
          },
        ],
      },
      {
        name: 'Rock',
        description:
          'Ranged Weapon Attack: +10 to hit, range 60/180 ft., one target. Hit: 28 (4d10 + 6) bludgeoning damage.',
        attackBonus: 10,
        damage: [
          {
            dice: {
              count: 4,
              die: 'd10',
              modifier: 6,
              notation: '4d10+6',
            },
            type: 'bludgeoning',
          },
        ],
      },
      {
        name: 'Animate Trees',
        description:
          "The treant magically animates one or two trees it can see within 60 feet of it. These trees have the same statistics as a treant, except they have Intelligence and Charisma scores of 1, they can't speak, and they have only the Slam action option. An animated tree acts as an ally of the treant. The tree remains animate for 1 day or until it dies; until the treant dies or is more than 120 feet from the tree; or until the treant takes a bonus action to turn it back into an inanimate tree. The tree then takes root if possible.",
      },
    ],
  },
  {
    id: 'tyrannosaurus-rex',
    name: 'Tyrannosaurus Rex',
    system: 'dnd-5e-2014',
    source: 'SRD',
    size: 'huge',
    type: 'beast',
    alignment: 'unaligned',
    challengeRating: 8,
    experiencePoints: 3900,
    armorClass: 13,
    hitPoints: {
      count: 13,
      die: 'd12',
      modifier: 52,
      notation: '13d12+52',
    },
    speed: {
      walk: 50,
    },
    abilities: {
      str: 25,
      dex: 10,
      con: 19,
      int: 2,
      wis: 12,
      cha: 9,
    },
    skills: {
      Perception: 4,
    },
    senses: ['passive Perception 14'],
    languages: [],
    actions: [
      {
        name: 'Multiattack',
        description:
          "The tyrannosaurus makes two attacks: one with its bite and one with its tail. It can't make both attacks against the same target.",
      },
      {
        name: 'Bite',
        description:
          "Melee Weapon Attack: +10 to hit, reach 10 ft., one target. Hit: 33 (4d12 + 7) piercing damage. If the target is a Medium or smaller creature, it is grappled (escape DC 17). Until this grapple ends, the target is restrained, and the tyrannosaurus can't bite another target.",
        attackBonus: 10,
        damage: [
          {
            dice: {
              count: 4,
              die: 'd12',
              modifier: 7,
              notation: '4d12+7',
            },
            type: 'piercing',
          },
        ],
      },
      {
        name: 'Tail',
        description:
          'Melee Weapon Attack: +10 to hit, reach 10 ft., one target. Hit: 20 (3d8 + 7) bludgeoning damage.',
        attackBonus: 10,
        damage: [
          {
            dice: {
              count: 3,
              die: 'd8',
              modifier: 7,
              notation: '3d8+7',
            },
            type: 'bludgeoning',
          },
        ],
      },
    ],
  },
  {
    id: 'vrock',
    name: 'Vrock',
    system: 'dnd-5e-2014',
    source: 'SRD',
    size: 'large',
    type: 'fiend',
    alignment: 'chaotic evil',
    challengeRating: 6,
    experiencePoints: 2300,
    armorClass: 15,
    hitPoints: {
      count: 11,
      die: 'd10',
      modifier: 44,
      notation: '11d10+44',
    },
    speed: {
      walk: 40,
      fly: 60,
    },
    abilities: {
      str: 17,
      dex: 15,
      con: 18,
      int: 8,
      wis: 13,
      cha: 8,
    },
    savingThrows: {
      dex: 5,
      wis: 4,
      cha: 2,
    },
    damageResistances: [
      'cold',
      'fire',
      'lightning',
      'bludgeoning, piercing, and slashing from nonmagical weapons',
    ],
    damageImmunities: ['poison'],
    conditionImmunities: ['Poisoned'],
    senses: ['darkvision 120 ft.', 'passive Perception 11'],
    languages: ['Abyssal', 'telepathy 120 ft.'],
    specialAbilities: [
      {
        name: 'Magic Resistance',
        description:
          'The vrock has advantage on saving throws against spells and other magical effects.',
      },
    ],
    actions: [
      {
        name: 'Multiattack',
        description: 'The vrock makes two attacks: one with its beak and one with its talons.',
      },
      {
        name: 'Beak',
        description:
          'Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 10 (2d6 + 3) piercing damage.',
        attackBonus: 6,
        damage: [
          {
            dice: {
              count: 2,
              die: 'd6',
              modifier: 3,
              notation: '2d6+3',
            },
            type: 'piercing',
          },
        ],
      },
      {
        name: 'Talons',
        description:
          'Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 14 (2d10 + 3) slashing damage.',
        attackBonus: 6,
        damage: [
          {
            dice: {
              count: 2,
              die: 'd10',
              modifier: 3,
              notation: '2d10+3',
            },
            type: 'slashing',
          },
        ],
      },
      {
        name: 'Spores',
        description:
          'A 15-foot-radius cloud of toxic spores extends out from the vrock. The spores spread around corners. Each creature in that area must succeed on a DC 14 Constitution saving throw or become poisoned. While poisoned in this way, a target takes 5 (1d10) poison damage at the start of each of its turns. A target can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. Emptying a vial of holy water on the target also ends the effect on it.',
        savingThrow: {
          attribute: 'con',
          dc: 14,
          effect: 'see description',
        },
        recharge: '6',
        damage: [
          {
            dice: {
              count: 1,
              die: 'd10',
              modifier: 0,
              notation: '1d10',
            },
            type: 'poison',
          },
        ],
      },
      {
        name: 'Stunning Screech',
        description:
          "The vrock emits a horrific screech. Each creature within 20 feet of it that can hear it and that isn't a demon must succeed on a DC 14 Constitution saving throw or be stunned until the end of the vrock's next turn .",
        savingThrow: {
          attribute: 'con',
          dc: 14,
          effect: 'see description',
        },
      },
    ],
  },
  {
    id: 'young-black-dragon',
    name: 'Young Black Dragon',
    system: 'dnd-5e-2014',
    source: 'SRD',
    size: 'large',
    type: 'dragon',
    alignment: 'chaotic evil',
    challengeRating: 7,
    experiencePoints: 2900,
    armorClass: 18,
    hitPoints: {
      count: 15,
      die: 'd10',
      modifier: 45,
      notation: '15d10+45',
    },
    speed: {
      walk: 40,
      fly: 80,
      swim: 40,
    },
    abilities: {
      str: 19,
      dex: 14,
      con: 17,
      int: 12,
      wis: 11,
      cha: 15,
    },
    savingThrows: {
      dex: 5,
      con: 6,
      wis: 3,
      cha: 5,
    },
    skills: {
      Perception: 6,
      Stealth: 5,
    },
    damageImmunities: ['acid'],
    senses: ['blindsight 30 ft.', 'darkvision 120 ft.', 'passive Perception 16'],
    languages: ['Common', 'Draconic'],
    specialAbilities: [
      {
        name: 'Amphibious',
        description: 'The dragon can breathe air and water.',
      },
    ],
    actions: [
      {
        name: 'Multiattack',
        description: 'The dragon makes three attacks: one with its bite and two with its claws.',
      },
      {
        name: 'Bite',
        description:
          'Melee Weapon Attack: +7 to hit, reach 10 ft., one target. Hit: 15 (2d10 + 4) piercing damage plus 4 (1d8) acid damage.',
        attackBonus: 7,
        damage: [
          {
            dice: {
              count: 2,
              die: 'd10',
              modifier: 4,
              notation: '2d10+4',
            },
            type: 'piercing',
          },
          {
            dice: {
              count: 1,
              die: 'd8',
              modifier: 0,
              notation: '1d8',
            },
            type: 'acid',
          },
        ],
      },
      {
        name: 'Claw',
        description:
          'Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 11 (2d6 + 4) slashing damage.',
        attackBonus: 7,
        damage: [
          {
            dice: {
              count: 2,
              die: 'd6',
              modifier: 4,
              notation: '2d6+4',
            },
            type: 'slashing',
          },
        ],
      },
      {
        name: 'Acid Breath',
        description:
          'The dragon exhales acid in a 30-foot line that is 5 feet wide. Each creature in that line must make a DC 14 Dexterity saving throw, taking 49 (11d8) acid damage on a failed save, or half as much damage on a successful one.',
        damage: [
          {
            dice: {
              count: 11,
              die: 'd8',
              modifier: 0,
              notation: '11d8',
            },
            type: 'acid',
          },
        ],
        savingThrow: {
          attribute: 'dex',
          dc: 14,
          effect: 'half damage on a successful save',
        },
        recharge: '5-6',
      },
    ],
  },
  {
    id: 'young-blue-dragon',
    name: 'Young Blue Dragon',
    system: 'dnd-5e-2014',
    source: 'SRD',
    size: 'large',
    type: 'dragon',
    alignment: 'lawful evil',
    challengeRating: 9,
    experiencePoints: 5000,
    armorClass: 18,
    hitPoints: {
      count: 16,
      die: 'd10',
      modifier: 64,
      notation: '16d10+64',
    },
    speed: {
      walk: 40,
      fly: 80,
      burrow: 20,
    },
    abilities: {
      str: 21,
      dex: 10,
      con: 19,
      int: 14,
      wis: 13,
      cha: 17,
    },
    savingThrows: {
      dex: 4,
      con: 8,
      wis: 5,
      cha: 7,
    },
    skills: {
      Perception: 9,
      Stealth: 4,
    },
    damageImmunities: ['lightning'],
    senses: ['blindsight 30 ft.', 'darkvision 120 ft.', 'passive Perception 19'],
    languages: ['Common', 'Draconic'],
    actions: [
      {
        name: 'Multiattack',
        description: 'The dragon makes three attacks: one with its bite and two with its claws.',
      },
      {
        name: 'Bite',
        description:
          'Melee Weapon Attack: +9 to hit, reach 10 ft., one target. Hit: 16 (2d10 + 5) piercing damage plus 5 (1d10) lightning damage.',
        attackBonus: 9,
        damage: [
          {
            dice: {
              count: 2,
              die: 'd10',
              modifier: 5,
              notation: '2d10+5',
            },
            type: 'piercing',
          },
          {
            dice: {
              count: 1,
              die: 'd10',
              modifier: 0,
              notation: '1d10',
            },
            type: 'lightning',
          },
        ],
      },
      {
        name: 'Claw',
        description:
          'Melee Weapon Attack: +9 to hit, reach 5 ft., one target. Hit: 12 (2d6 + 5) slashing damage.',
        attackBonus: 9,
        damage: [
          {
            dice: {
              count: 2,
              die: 'd6',
              modifier: 5,
              notation: '2d6+5',
            },
            type: 'slashing',
          },
        ],
      },
      {
        name: 'Lightning Breath',
        description:
          'The dragon exhales lightning in a 60-foot line that is 5 feet wide. Each creature in that line must make a DC 16 Dexterity saving throw, taking 55 (10d10) lightning damage on a failed save, or half as much damage on a successful one.',
        damage: [
          {
            dice: {
              count: 10,
              die: 'd10',
              modifier: 0,
              notation: '10d10',
            },
            type: 'lightning',
          },
        ],
        savingThrow: {
          attribute: 'dex',
          dc: 16,
          effect: 'half damage on a successful save',
        },
        recharge: '5-6',
      },
    ],
  },
  {
    id: 'young-brass-dragon',
    name: 'Young Brass Dragon',
    system: 'dnd-5e-2014',
    source: 'SRD',
    size: 'large',
    type: 'dragon',
    alignment: 'chaotic good',
    challengeRating: 6,
    experiencePoints: 2300,
    armorClass: 17,
    hitPoints: {
      count: 13,
      die: 'd10',
      modifier: 39,
      notation: '13d10+39',
    },
    speed: {
      walk: 40,
      fly: 80,
      burrow: 20,
    },
    abilities: {
      str: 19,
      dex: 10,
      con: 17,
      int: 12,
      wis: 11,
      cha: 15,
    },
    savingThrows: {
      dex: 3,
      con: 6,
      wis: 3,
      cha: 5,
    },
    skills: {
      Perception: 6,
      Persuasion: 5,
      Stealth: 3,
    },
    damageImmunities: ['fire'],
    senses: ['blindsight 30 ft.', 'darkvision 120 ft.', 'passive Perception 16'],
    languages: ['Common', 'Draconic'],
    actions: [
      {
        name: 'Multiattack',
        description: 'The dragon makes three attacks: one with its bite and two with its claws.',
      },
      {
        name: 'Bite',
        description:
          'Melee Weapon Attack: +7 to hit, reach 10 ft., one target. Hit: 15 (2d10 + 4) piercing damage.',
        attackBonus: 7,
        damage: [
          {
            dice: {
              count: 2,
              die: 'd10',
              modifier: 4,
              notation: '2d10+4',
            },
            type: 'piercing',
          },
        ],
      },
      {
        name: 'Claw',
        description:
          'Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 11 (2d6 + 4) slashing damage.',
        attackBonus: 7,
        damage: [
          {
            dice: {
              count: 2,
              die: 'd6',
              modifier: 4,
              notation: '2d6+4',
            },
            type: 'slashing',
          },
        ],
      },
      {
        name: 'Breath Weapons',
        description:
          'The dragon uses one of the following breath weapons. Fire Breath. The dragon exhales fire in a 40-foot line that is 5 feet wide. Each creature in that line must make a DC 14 Dexterity saving throw, taking 42 (12d6) fire damage on a failed save, or half as much damage on a successful one. Sleep Breath. The dragon exhales sleep gas in a 30-foot cone. Each creature in that area must succeed on a DC 14 Constitution saving throw or fall unconscious for 5 minutes. This effect ends for a creature if the creature takes damage or someone uses an action to wake it.',
        recharge: '5-6',
        savingThrow: {
          attribute: 'dex',
          dc: 14,
          effect: 'half damage on a successful save',
        },
        damage: [
          {
            dice: {
              count: 12,
              die: 'd6',
              modifier: 0,
              notation: '12d6',
            },
            type: 'fire',
          },
        ],
      },
    ],
  },
  {
    id: 'young-bronze-dragon',
    name: 'Young Bronze Dragon',
    system: 'dnd-5e-2014',
    source: 'SRD',
    size: 'large',
    type: 'dragon',
    alignment: 'lawful good',
    challengeRating: 8,
    experiencePoints: 3900,
    armorClass: 18,
    hitPoints: {
      count: 15,
      die: 'd10',
      modifier: 60,
      notation: '15d10+60',
    },
    speed: {
      walk: 40,
      fly: 80,
      swim: 40,
    },
    abilities: {
      str: 21,
      dex: 10,
      con: 19,
      int: 14,
      wis: 13,
      cha: 17,
    },
    savingThrows: {
      dex: 3,
      con: 7,
      wis: 4,
      cha: 6,
    },
    skills: {
      Insight: 4,
      Perception: 7,
      Stealth: 3,
    },
    damageImmunities: ['lightning'],
    senses: ['blindsight 30 ft.', 'darkvision 120 ft.', 'passive Perception 17'],
    languages: ['Common', 'Draconic'],
    specialAbilities: [
      {
        name: 'Amphibious',
        description: 'The dragon can breathe air and water.',
      },
    ],
    actions: [
      {
        name: 'Multiattack',
        description: 'The dragon makes three attacks: one with its bite and two with its claws.',
      },
      {
        name: 'Bite',
        description:
          'Melee Weapon Attack: +8 to hit, reach 10 ft., one target. Hit: 16 (2d10 + 5) piercing damage.',
        attackBonus: 8,
        damage: [
          {
            dice: {
              count: 2,
              die: 'd10',
              modifier: 5,
              notation: '2d10+5',
            },
            type: 'piercing',
          },
        ],
      },
      {
        name: 'Claw',
        description:
          'Melee Weapon Attack: +8 to hit, reach 5 ft., one target. Hit: 12 (2d6 + 5) slashing damage.',
        attackBonus: 8,
        damage: [
          {
            dice: {
              count: 2,
              die: 'd6',
              modifier: 5,
              notation: '2d6+5',
            },
            type: 'slashing',
          },
        ],
      },
      {
        name: 'Breath Weapons',
        description:
          'The dragon uses one of the following breath weapons. Lightning Breath. The dragon exhales lightning in a 60-foot line that is 5 feet wide. Each creature in that line must make a DC 15 Dexterity saving throw, taking 55 (10d10) lightning damage on a failed save, or half as much damage on a successful one. Repulsion Breath. The dragon exhales repulsion energy in a 30-foot cone. Each creature in that area must succeed on a DC 15 Strength saving throw. On a failed save, the creature is pushed 40 feet away from the dragon.',
        recharge: '5-6',
        savingThrow: {
          attribute: 'dex',
          dc: 15,
          effect: 'half damage on a successful save',
        },
        damage: [
          {
            dice: {
              count: 10,
              die: 'd10',
              modifier: 0,
              notation: '10d10',
            },
            type: 'lightning',
          },
        ],
      },
    ],
  },
  {
    id: 'young-copper-dragon',
    name: 'Young Copper Dragon',
    system: 'dnd-5e-2014',
    source: 'SRD',
    size: 'large',
    type: 'dragon',
    alignment: 'chaotic good',
    challengeRating: 7,
    experiencePoints: 2900,
    armorClass: 17,
    hitPoints: {
      count: 14,
      die: 'd10',
      modifier: 42,
      notation: '14d10+42',
    },
    speed: {
      walk: 40,
      fly: 80,
      climb: 40,
    },
    abilities: {
      str: 19,
      dex: 12,
      con: 17,
      int: 16,
      wis: 13,
      cha: 15,
    },
    savingThrows: {
      dex: 4,
      con: 6,
      wis: 4,
      cha: 5,
    },
    skills: {
      Deception: 5,
      Perception: 7,
      Stealth: 4,
    },
    damageImmunities: ['acid'],
    senses: ['blindsight 30 ft.', 'darkvision 120 ft.', 'passive Perception 17'],
    languages: ['Common', 'Draconic'],
    actions: [
      {
        name: 'Multiattack',
        description: 'The dragon makes three attacks: one with its bite and two with its claws.',
      },
      {
        name: 'Bite',
        description:
          'Melee Weapon Attack: +7 to hit, reach 10 ft., one target. Hit: 15 (2d10 + 4) piercing damage.',
        attackBonus: 7,
        damage: [
          {
            dice: {
              count: 2,
              die: 'd10',
              modifier: 4,
              notation: '2d10+4',
            },
            type: 'piercing',
          },
        ],
      },
      {
        name: 'Claw',
        description:
          'Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 11 (2d6 + 4) slashing damage.',
        attackBonus: 7,
        damage: [
          {
            dice: {
              count: 2,
              die: 'd6',
              modifier: 4,
              notation: '2d6+4',
            },
            type: 'slashing',
          },
        ],
      },
      {
        name: 'Breath Weapons',
        description:
          "The dragon uses one of the following breath weapons. Acid Breath. The dragon exhales acid in an 40-foot line that is 5 feet wide. Each creature in that line must make a DC 14 Dexterity saving throw, taking 40 (9d8) acid damage on a failed save, or half as much damage on a successful one. Slowing Breath. The dragon exhales gas in a 30-foot cone. Each creature in that area must succeed on a DC 14 Constitution saving throw. On a failed save, the creature can't use reactions, its speed is halved, and it can't make more than one attack on its turn. In addition, the creature can use either an action or a bonus action on its turn, but not both. These effects last for 1 minute. The creature can repeat the saving throw at the end of each of its turns, ending the effect on itself with a successful save.",
        recharge: '5-6',
        savingThrow: {
          attribute: 'dex',
          dc: 14,
          effect: 'half damage on a successful save',
        },
        damage: [
          {
            dice: {
              count: 9,
              die: 'd8',
              modifier: 0,
              notation: '9d8',
            },
            type: 'acid',
          },
        ],
      },
    ],
  },
  {
    id: 'young-gold-dragon',
    name: 'Young Gold Dragon',
    system: 'dnd-5e-2014',
    source: 'SRD',
    size: 'large',
    type: 'dragon',
    alignment: 'lawful good',
    challengeRating: 10,
    experiencePoints: 5900,
    armorClass: 18,
    hitPoints: {
      count: 17,
      die: 'd10',
      modifier: 85,
      notation: '17d10+85',
    },
    speed: {
      walk: 40,
      fly: 80,
      swim: 40,
    },
    abilities: {
      str: 23,
      dex: 14,
      con: 21,
      int: 16,
      wis: 13,
      cha: 20,
    },
    savingThrows: {
      dex: 6,
      con: 9,
      wis: 5,
      cha: 9,
    },
    skills: {
      Insight: 5,
      Perception: 9,
      Persuasion: 9,
      Stealth: 6,
    },
    damageImmunities: ['fire'],
    senses: ['blindsight 30 ft.', 'darkvision 120 ft.', 'passive Perception 19'],
    languages: ['Common', 'Draconic'],
    specialAbilities: [
      {
        name: 'Amphibious',
        description: 'The dragon can breathe air and water.',
      },
    ],
    actions: [
      {
        name: 'Multiattack',
        description: 'The dragon makes three attacks: one with its bite and two with its claws.',
      },
      {
        name: 'Bite',
        description:
          'Melee Weapon Attack: +10 to hit, reach 10 ft., one target. Hit: 17 (2d10 + 6) piercing damage.',
        attackBonus: 10,
        damage: [
          {
            dice: {
              count: 2,
              die: 'd10',
              modifier: 6,
              notation: '2d10+6',
            },
            type: 'piercing',
          },
        ],
      },
      {
        name: 'Claw',
        description:
          'Melee Weapon Attack: +10 to hit, reach 5 ft., one target. Hit: 13 (2d6 + 6) slashing damage.',
        attackBonus: 10,
        damage: [
          {
            dice: {
              count: 2,
              die: 'd6',
              modifier: 6,
              notation: '2d6+6',
            },
            type: 'slashing',
          },
        ],
      },
      {
        name: 'Breath Weapons',
        description:
          'The dragon uses one of the following breath weapons. Fire Breath. The dragon exhales fire in a 30-foot cone. Each creature in that area must make a DC 17 Dexterity saving throw, taking 55 (10d10) fire damage on a failed save, or half as much damage on a successful one. Weakening Breath. The dragon exhales gas in a 30-foot cone. Each creature in that area must succeed on a DC 17 Strength saving throw or have disadvantage on Strength-based attack rolls, Strength checks, and Strength saving throws for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success.',
        recharge: '5-6',
        savingThrow: {
          attribute: 'dex',
          dc: 17,
          effect: 'half damage on a successful save',
        },
        damage: [
          {
            dice: {
              count: 10,
              die: 'd10',
              modifier: 0,
              notation: '10d10',
            },
            type: 'fire',
          },
        ],
      },
    ],
  },
  {
    id: 'young-green-dragon',
    name: 'Young Green Dragon',
    system: 'dnd-5e-2014',
    source: 'SRD',
    size: 'large',
    type: 'dragon',
    alignment: 'lawful evil',
    challengeRating: 8,
    experiencePoints: 3900,
    armorClass: 18,
    hitPoints: {
      count: 16,
      die: 'd10',
      modifier: 48,
      notation: '16d10+48',
    },
    speed: {
      walk: 40,
      fly: 80,
      swim: 40,
    },
    abilities: {
      str: 19,
      dex: 12,
      con: 17,
      int: 16,
      wis: 13,
      cha: 15,
    },
    savingThrows: {
      dex: 4,
      con: 6,
      wis: 4,
      cha: 5,
    },
    skills: {
      Deception: 5,
      Perception: 7,
      Stealth: 4,
    },
    damageImmunities: ['poison'],
    conditionImmunities: ['Poisoned'],
    senses: ['blindsight 30 ft.', 'darkvision 120 ft.', 'passive Perception 17'],
    languages: ['Common', 'Draconic'],
    specialAbilities: [
      {
        name: 'Amphibious',
        description: 'The dragon can breathe air and water.',
      },
    ],
    actions: [
      {
        name: 'Multiattack',
        description: 'The dragon makes three attacks: one with its bite and two with its claws.',
      },
      {
        name: 'Bite',
        description:
          'Melee Weapon Attack: +7 to hit, reach 10 ft., one target. Hit: 15 (2d10 + 4) piercing damage plus 7 (2d6) poison damage.',
        attackBonus: 7,
        damage: [
          {
            dice: {
              count: 2,
              die: 'd10',
              modifier: 4,
              notation: '2d10+4',
            },
            type: 'piercing',
          },
          {
            dice: {
              count: 2,
              die: 'd6',
              modifier: 0,
              notation: '2d6',
            },
            type: 'poison',
          },
        ],
      },
      {
        name: 'Claw',
        description:
          'Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 11 (2d6 + 4) slashing damage.',
        attackBonus: 7,
        damage: [
          {
            dice: {
              count: 2,
              die: 'd6',
              modifier: 4,
              notation: '2d6+4',
            },
            type: 'slashing',
          },
        ],
      },
      {
        name: 'Poison Breath',
        description:
          'The dragon exhales poisonous gas in a 30-foot cone. Each creature in that area must make a DC 14 Constitution saving throw, taking 42 (12d6) poison damage on a failed save, or half as much damage on a successful one.',
        damage: [
          {
            dice: {
              count: 12,
              die: 'd6',
              modifier: 0,
              notation: '12d6',
            },
            type: 'poison',
          },
        ],
        savingThrow: {
          attribute: 'con',
          dc: 14,
          effect: 'half damage on a successful save',
        },
        recharge: '5-6',
      },
    ],
  },
  {
    id: 'young-silver-dragon',
    name: 'Young Silver Dragon',
    system: 'dnd-5e-2014',
    source: 'SRD',
    size: 'large',
    type: 'dragon',
    alignment: 'lawful good',
    challengeRating: 9,
    experiencePoints: 5000,
    armorClass: 18,
    hitPoints: {
      count: 16,
      die: 'd10',
      modifier: 80,
      notation: '16d10+80',
    },
    speed: {
      walk: 40,
      fly: 80,
    },
    abilities: {
      str: 23,
      dex: 10,
      con: 21,
      int: 14,
      wis: 11,
      cha: 19,
    },
    savingThrows: {
      dex: 4,
      con: 9,
      wis: 4,
      cha: 8,
    },
    skills: {
      Arcana: 6,
      History: 6,
      Perception: 8,
      Stealth: 4,
    },
    damageImmunities: ['cold'],
    senses: ['blindsight 30 ft.', 'darkvision 120 ft.', 'passive Perception 18'],
    languages: ['Common', 'Draconic'],
    actions: [
      {
        name: 'Multiattack',
        description: 'The dragon makes three attacks: one with its bite and two with its claws.',
      },
      {
        name: 'Bite',
        description:
          'Melee Weapon Attack: +10 to hit, reach 10 ft., one target. Hit: 17 (2d10 + 6) piercing damage.',
        attackBonus: 10,
        damage: [
          {
            dice: {
              count: 2,
              die: 'd10',
              modifier: 6,
              notation: '2d10+6',
            },
            type: 'piercing',
          },
        ],
      },
      {
        name: 'Claw',
        description:
          'Melee Weapon Attack: +10 to hit, reach 5 ft., one target. Hit: 13 (2d6 + 6) slashing damage.',
        attackBonus: 10,
        damage: [
          {
            dice: {
              count: 2,
              die: 'd6',
              modifier: 6,
              notation: '2d6+6',
            },
            type: 'slashing',
          },
        ],
      },
      {
        name: 'Breath Weapons',
        description:
          'The dragon uses one of the following breath weapons. Cold Breath. The dragon exhales an icy blast in a 30-foot cone. Each creature in that area must make a DC 17 Constitution saving throw, taking 54 (12d8) cold damage on a failed save, or half as much damage on a successful one. Paralyzing Breath. The dragon exhales paralyzing gas in a 30-foot cone. Each creature in that area must succeed on a DC 17 Constitution saving throw or be paralyzed for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success.',
        recharge: '5-6',
        savingThrow: {
          attribute: 'con',
          dc: 17,
          effect: 'half damage on a successful save',
        },
        damage: [
          {
            dice: {
              count: 12,
              die: 'd8',
              modifier: 0,
              notation: '12d8',
            },
            type: 'cold',
          },
        ],
      },
    ],
  },
];
