import { Monster } from '../../../../types/creatures/monsters';

// CR 13
export const adultRedDragon: Monster = {
  id: 'adult-red-dragon',
  name: 'Adult Red Dragon',
  system: 'dnd-5e-2014',
  source: 'SRD',
  size: 'huge',
  type: 'dragon',
  alignment: 'chaotic evil',
  challengeRating: 17,
  experiencePoints: 18000,
  armorClass: 19,
  hitPoints: { count: 19, die: 'd12', modifier: 133, notation: '19d12+133' },
  speed: { walk: 40, climb: 40, fly: 80 },
  abilities: { str: 27, dex: 10, con: 25, int: 16, wis: 13, cha: 21 },
  savingThrows: { dex: 6, con: 13, wis: 7, cha: 11 },
  skills: { Perception: 13, Stealth: 6 },
  damageImmunities: ['fire'],
  senses: ['blindsight 60 ft.', 'darkvision 120 ft.', 'passive Perception 23'],
  languages: ['Common', 'Draconic'],
  specialAbilities: [
    {
      name: 'Legendary Resistance (3/Day)',
      description: 'If the dragon fails a saving throw, it can choose to succeed instead.',
    },
  ],
  actions: [
    {
      name: 'Multiattack',
      description:
        'The dragon can use its Frightful Presence. It then makes three attacks: one with its bite and two with its claws.',
    },
    {
      name: 'Bite',
      description: 'Melee Weapon Attack: +14 to hit, reach 10 ft., one target.',
      attackBonus: 14,
      reach: 10,
      damage: [
        { dice: { count: 2, die: 'd10', modifier: 8, notation: '2d10+8' }, type: 'piercing' },
        { dice: { count: 2, die: 'd6', notation: '2d6' }, type: 'fire' },
      ],
    },
    {
      name: 'Claw',
      description: 'Melee Weapon Attack: +14 to hit, reach 5 ft., one target.',
      attackBonus: 14,
      reach: 5,
      damage: [{ dice: { count: 2, die: 'd6', modifier: 8, notation: '2d6+8' }, type: 'slashing' }],
    },
    {
      name: 'Tail',
      description: 'Melee Weapon Attack: +14 to hit, reach 15 ft., one target.',
      attackBonus: 14,
      reach: 15,
      damage: [
        { dice: { count: 2, die: 'd8', modifier: 8, notation: '2d8+8' }, type: 'bludgeoning' },
      ],
    },
    {
      name: 'Frightful Presence',
      description:
        "Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 19 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success.",
      savingThrow: {
        attribute: 'wis',
        dc: 19,
        effect: 'frightened for 1 minute on failure',
      },
    },
    {
      name: 'Fire Breath',
      description:
        'The dragon exhales fire in a 60-foot cone. Each creature in that area must make a DC 21 Dexterity saving throw, taking 18d6 fire damage on a failed save, or half as much damage on a successful one.',
      savingThrow: {
        attribute: 'dex',
        dc: 21,
        effect: '18d6 fire damage (half on success)',
      },
      recharge: '5-6',
    },
  ],
  legendaryActions: [
    {
      name: 'Detect',
      cost: 1,
      description: 'The dragon makes a Wisdom (Perception) check.',
    },
    {
      name: 'Tail Attack',
      cost: 1,
      description: 'The dragon makes a tail attack.',
    },
    {
      name: 'Wing Attack',
      cost: 2,
      description:
        'The dragon beats its wings. Each creature within 10 feet of the dragon must succeed on a DC 22 Dexterity saving throw or take 2d6+8 bludgeoning damage and be knocked prone. The dragon can then fly up to half its flying speed.',
    },
  ],
  description: 'The most powerful and greedy of chromatic dragons, arrogant and cruel.',
  environment: ['mountains', 'hills'],
};

// CR 15
export const purpleWorm: Monster = {
  id: 'purple-worm',
  name: 'Purple Worm',
  system: 'dnd-5e-2014',
  source: 'SRD',
  size: 'gargantuan',
  type: 'monstrosity',
  alignment: 'unaligned',
  challengeRating: 15,
  experiencePoints: 13000,
  armorClass: 18,
  hitPoints: { count: 15, die: 'd20', modifier: 90, notation: '15d20+90' },
  speed: { walk: 50, burrow: 30 },
  abilities: { str: 28, dex: 7, con: 22, int: 1, wis: 8, cha: 4 },
  savingThrows: { con: 11, wis: 4 },
  senses: ['blindsight 30 ft.', 'tremorsense 60 ft.', 'passive Perception 9'],
  languages: [],
  specialAbilities: [
    {
      name: 'Tunneler',
      description:
        'The worm can burrow through solid rock at half its burrow speed and leaves a 10-foot-diameter tunnel in its wake.',
    },
  ],
  actions: [
    {
      name: 'Multiattack',
      description: 'The worm makes two attacks: one with its bite and one with its stinger.',
    },
    {
      name: 'Bite',
      description:
        "Melee Weapon Attack: +14 to hit, reach 10 ft., one target. If the target is a Large or smaller creature, it must succeed on a DC 19 Dexterity saving throw or be swallowed by the worm. A swallowed creature is blinded and restrained, it has total cover against attacks and other effects outside the worm, and it takes 6d6 acid damage at the start of each of the worm's turns.",
      attackBonus: 14,
      reach: 10,
      damage: [{ dice: { count: 3, die: 'd8', modifier: 9, notation: '3d8+9' }, type: 'piercing' }],
      savingThrow: {
        attribute: 'dex',
        dc: 19,
        effect: 'swallowed on failure',
      },
    },
    {
      name: 'Tail Stinger',
      description:
        'Melee Weapon Attack: +14 to hit, reach 10 ft., one creature. The target must make a DC 19 Constitution saving throw, taking 12d6 poison damage on a failed save, or half as much damage on a successful one.',
      attackBonus: 14,
      reach: 10,
      damage: [{ dice: { count: 3, die: 'd6', modifier: 9, notation: '3d6+9' }, type: 'piercing' }],
      savingThrow: {
        attribute: 'con',
        dc: 19,
        effect: '12d6 poison damage (half on success)',
      },
    },
  ],
  description: 'Colossal worm that burrows through the Underdark, swallowing creatures whole.',
  environment: ['underground'],
};

// CR 17
export const ancientBlueDragon: Monster = {
  id: 'ancient-blue-dragon',
  name: 'Ancient Blue Dragon',
  system: 'dnd-5e-2014',
  source: 'SRD',
  size: 'gargantuan',
  type: 'dragon',
  alignment: 'lawful evil',
  challengeRating: 23,
  experiencePoints: 50000,
  armorClass: 22,
  hitPoints: { count: 28, die: 'd20', modifier: 252, notation: '28d20+252' },
  speed: { walk: 40, burrow: 40, fly: 80 },
  abilities: { str: 29, dex: 10, con: 27, int: 18, wis: 17, cha: 21 },
  savingThrows: { dex: 7, con: 15, wis: 10, cha: 12 },
  skills: { Perception: 17, Stealth: 7 },
  damageImmunities: ['lightning'],
  senses: ['blindsight 60 ft.', 'darkvision 120 ft.', 'passive Perception 27'],
  languages: ['Common', 'Draconic'],
  specialAbilities: [
    {
      name: 'Legendary Resistance (3/Day)',
      description: 'If the dragon fails a saving throw, it can choose to succeed instead.',
    },
  ],
  actions: [
    {
      name: 'Multiattack',
      description:
        'The dragon can use its Frightful Presence. It then makes three attacks: one with its bite and two with its claws.',
    },
    {
      name: 'Bite',
      description: 'Melee Weapon Attack: +16 to hit, reach 15 ft., one target.',
      attackBonus: 16,
      reach: 15,
      damage: [
        { dice: { count: 2, die: 'd10', modifier: 9, notation: '2d10+9' }, type: 'piercing' },
        { dice: { count: 2, die: 'd10', notation: '2d10' }, type: 'lightning' },
      ],
    },
    {
      name: 'Claw',
      description: 'Melee Weapon Attack: +16 to hit, reach 10 ft., one target.',
      attackBonus: 16,
      reach: 10,
      damage: [{ dice: { count: 2, die: 'd6', modifier: 9, notation: '2d6+9' }, type: 'slashing' }],
    },
    {
      name: 'Tail',
      description: 'Melee Weapon Attack: +16 to hit, reach 20 ft., one target.',
      attackBonus: 16,
      reach: 20,
      damage: [
        { dice: { count: 2, die: 'd8', modifier: 9, notation: '2d8+9' }, type: 'bludgeoning' },
      ],
    },
    {
      name: 'Frightful Presence',
      description:
        "Each creature of the dragon's choice within 120 feet of it and aware of it must succeed on a DC 20 Wisdom saving throw or become frightened for 1 minute.",
      savingThrow: {
        attribute: 'wis',
        dc: 20,
        effect: 'frightened for 1 minute on failure',
      },
    },
    {
      name: 'Lightning Breath',
      description:
        'The dragon exhales lightning in a 120-foot line that is 10 feet wide. Each creature in that line must make a DC 23 Dexterity saving throw, taking 22d10 lightning damage on a failed save, or half as much damage on a successful one.',
      savingThrow: {
        attribute: 'dex',
        dc: 23,
        effect: '22d10 lightning damage (half on success)',
      },
      recharge: '5-6',
    },
  ],
  legendaryActions: [
    {
      name: 'Detect',
      cost: 1,
      description: 'The dragon makes a Wisdom (Perception) check.',
    },
    {
      name: 'Tail Attack',
      cost: 1,
      description: 'The dragon makes a tail attack.',
    },
    {
      name: 'Wing Attack',
      cost: 2,
      description:
        'The dragon beats its wings. Each creature within 15 feet must succeed on a DC 24 Dexterity saving throw or take 2d6+9 bludgeoning damage and be knocked prone. The dragon can then fly up to half its flying speed.',
    },
  ],
  description: 'Ancient and cunning blue dragons, masters of desert wastelands.',
  environment: ['desert', 'coastal'],
};

// CR 20
export const lich: Monster = {
  id: 'lich',
  name: 'Lich',
  system: 'dnd-5e-2014',
  source: 'SRD',
  size: 'medium',
  type: 'undead',
  alignment: 'lawful evil',
  challengeRating: 21,
  experiencePoints: 33000,
  armorClass: 17,
  hitPoints: { count: 18, die: 'd8', modifier: 54, notation: '18d8+54' },
  speed: { walk: 30 },
  abilities: { str: 11, dex: 16, con: 16, int: 20, wis: 14, cha: 16 },
  savingThrows: { con: 10, int: 12, wis: 9 },
  skills: { Arcana: 19, History: 12, Insight: 9, Perception: 9 },
  damageResistances: ['cold', 'lightning', 'necrotic'],
  damageImmunities: ['poison', 'bludgeoning', 'piercing', 'slashing'],
  conditionImmunities: ['charmed', 'exhaustion', 'frightened', 'paralyzed', 'poisoned'],
  senses: ['truesight 120 ft.', 'passive Perception 19'],
  languages: ['Common plus up to five other languages'],
  specialAbilities: [
    {
      name: 'Legendary Resistance (3/Day)',
      description: 'If the lich fails a saving throw, it can choose to succeed instead.',
    },
    {
      name: 'Rejuvenation',
      description:
        'If it has a phylactery, a destroyed lich gains a new body in 1d10 days, regaining all its hit points and becoming active again. The new body appears within 5 feet of the phylactery.',
    },
    {
      name: 'Turn Resistance',
      description: 'The lich has advantage on saving throws against any effect that turns undead.',
    },
    {
      name: 'Spellcasting',
      description:
        'The lich is an 18th-level spellcaster. Its spellcasting ability is Intelligence (spell save DC 20, +12 to hit with spell attacks). The lich has the following wizard spells prepared: Cantrips: mage hand, prestidigitation, ray of frost; 1st level (4 slots): detect magic, magic missile, shield, thunderwave; 2nd level (3 slots): detect thoughts, invisibility, acid arrow, mirror image; 3rd level (3 slots): animate dead, counterspell, dispel magic, fireball; 4th level (3 slots): blight, dimension door; 5th level (3 slots): cloudkill, scrying; 6th level (1 slot): disintegrate, globe of invulnerability; 7th level (1 slot): finger of death, plane shift; 8th level (1 slot): dominate monster, power word stun; 9th level (1 slot): power word kill.',
    },
  ],
  actions: [
    {
      name: 'Paralyzing Touch',
      description:
        'Melee Spell Attack: +12 to hit, reach 5 ft., one creature. The target must succeed on a DC 18 Constitution saving throw or be paralyzed for 1 minute. The target can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success.',
      attackBonus: 12,
      reach: 5,
      damage: [{ dice: { count: 3, die: 'd6', notation: '3d6' }, type: 'cold' }],
      savingThrow: {
        attribute: 'con',
        dc: 18,
        effect: 'paralyzed for 1 minute on failure',
      },
    },
  ],
  legendaryActions: [
    {
      name: 'Cantrip',
      cost: 1,
      description: 'The lich casts a cantrip.',
    },
    {
      name: 'Paralyzing Touch',
      cost: 1,
      description: 'The lich uses its Paralyzing Touch.',
    },
    {
      name: 'Frightening Gaze',
      cost: 2,
      description:
        'The lich fixes its gaze on one creature it can see within 10 feet of it. The target must succeed on a DC 18 Wisdom saving throw against this magic or become frightened for 1 minute. The frightened target can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success.',
    },
    {
      name: 'Disrupt Life',
      cost: 3,
      description:
        'Each living creature within 20 feet of the lich must make a DC 18 Constitution saving throw against this magic, taking 21 (6d6) necrotic damage on a failed save, or half as much damage on a successful one.',
    },
  ],
  description:
    'Powerful undead spellcasters who have achieved immortality through dark magic and a phylactery.',
  environment: ['ruins', 'underground'],
};

// CR 24
export const ancientRedDragon: Monster = {
  id: 'ancient-red-dragon',
  name: 'Ancient Red Dragon',
  system: 'dnd-5e-2014',
  source: 'SRD',
  size: 'gargantuan',
  type: 'dragon',
  alignment: 'chaotic evil',
  challengeRating: 24,
  experiencePoints: 62000,
  armorClass: 22,
  hitPoints: { count: 28, die: 'd20', modifier: 252, notation: '28d20+252' },
  speed: { walk: 40, climb: 40, fly: 80 },
  abilities: { str: 30, dex: 10, con: 29, int: 18, wis: 15, cha: 23 },
  savingThrows: { dex: 7, con: 16, wis: 9, cha: 13 },
  skills: { Perception: 16, Stealth: 7 },
  damageImmunities: ['fire'],
  senses: ['blindsight 60 ft.', 'darkvision 120 ft.', 'passive Perception 26'],
  languages: ['Common', 'Draconic'],
  specialAbilities: [
    {
      name: 'Legendary Resistance (3/Day)',
      description: 'If the dragon fails a saving throw, it can choose to succeed instead.',
    },
  ],
  actions: [
    {
      name: 'Multiattack',
      description:
        'The dragon can use its Frightful Presence. It then makes three attacks: one with its bite and two with its claws.',
    },
    {
      name: 'Bite',
      description: 'Melee Weapon Attack: +17 to hit, reach 15 ft., one target.',
      attackBonus: 17,
      reach: 15,
      damage: [
        { dice: { count: 2, die: 'd10', modifier: 10, notation: '2d10+10' }, type: 'piercing' },
        { dice: { count: 4, die: 'd6', notation: '4d6' }, type: 'fire' },
      ],
    },
    {
      name: 'Claw',
      description: 'Melee Weapon Attack: +17 to hit, reach 10 ft., one target.',
      attackBonus: 17,
      reach: 10,
      damage: [
        { dice: { count: 2, die: 'd6', modifier: 10, notation: '2d6+10' }, type: 'slashing' },
      ],
    },
    {
      name: 'Tail',
      description: 'Melee Weapon Attack: +17 to hit, reach 20 ft., one target.',
      attackBonus: 17,
      reach: 20,
      damage: [
        { dice: { count: 2, die: 'd8', modifier: 10, notation: '2d8+10' }, type: 'bludgeoning' },
      ],
    },
    {
      name: 'Frightful Presence',
      description:
        "Each creature of the dragon's choice within 120 feet of it and aware of it must succeed on a DC 21 Wisdom saving throw or become frightened for 1 minute.",
      savingThrow: {
        attribute: 'wis',
        dc: 21,
        effect: 'frightened for 1 minute on failure',
      },
    },
    {
      name: 'Fire Breath',
      description:
        'The dragon exhales fire in a 90-foot cone. Each creature in that area must make a DC 24 Dexterity saving throw, taking 26d6 fire damage on a failed save, or half as much damage on a successful one.',
      savingThrow: {
        attribute: 'dex',
        dc: 24,
        effect: '26d6 fire damage (half on success)',
      },
      recharge: '5-6',
    },
  ],
  legendaryActions: [
    {
      name: 'Detect',
      cost: 1,
      description: 'The dragon makes a Wisdom (Perception) check.',
    },
    {
      name: 'Tail Attack',
      cost: 1,
      description: 'The dragon makes a tail attack.',
    },
    {
      name: 'Wing Attack',
      cost: 2,
      description:
        'The dragon beats its wings. Each creature within 15 feet must succeed on a DC 25 Dexterity saving throw or take 2d6+10 bludgeoning damage and be knocked prone. The dragon can then fly up to half its flying speed.',
    },
  ],
  description:
    'The ultimate draconic threat - ancient red dragons are the most powerful and terrifying of all chromatic dragons.',
  environment: ['mountains', 'volcanoes'],
};

export const balor: Monster = {
  id: 'balor',
  name: 'Balor',
  system: 'dnd-5e-2014',
  source: 'SRD',
  size: 'huge',
  type: 'fiend',
  alignment: 'chaotic evil',
  challengeRating: 19,
  experiencePoints: 22000,
  armorClass: 19,
  hitPoints: { count: 21, die: 'd12', notation: '21d12+147' },
  speed: { walk: 40, fly: 80 },
  abilities: { str: 26, dex: 15, con: 22, int: 20, wis: 16, cha: 22 },
  savingThrows: { str: 14, con: 12, wis: 9, cha: 12 },
  damageResistances: ['cold', 'lightning', 'bludgeoning', 'piercing', 'slashing'],
  damageImmunities: ['fire', 'poison'],
  conditionImmunities: ['poisoned'],
  senses: ['truesight 120 ft.', 'passive Perception 13'],
  languages: ['Abyssal', 'telepathy 120 ft.'],
  specialAbilities: [
    {
      name: 'Death Throes',
      description:
        'When the balor dies, it explodes. Each creature within 30 feet must make a DC 20 Dexterity saving throw, taking 70 (20d6) fire damage on a failed save, or half as much on a successful one.',
    },
    {
      name: 'Fire Aura',
      description:
        "At the start of each of the balor's turns, each creature within 5 feet takes 10 (3d6) fire damage. A creature that touches the balor or hits it with a melee attack while within 5 feet takes 10 (3d6) fire damage.",
    },
    {
      name: 'Magic Resistance',
      description:
        'The balor has advantage on saving throws against spells and other magical effects.',
    },
  ],
  actions: [
    {
      name: 'Multiattack',
      description: 'The balor makes two attacks: one with its longsword and one with its whip.',
    },
    {
      name: 'Longsword',
      description: 'Melee Weapon Attack: +14 to hit, reach 10 ft., one target.',
      attackBonus: 14,
      reach: 10,
      damage: [
        { dice: { count: 3, die: 'd8', notation: '3d8+8' }, type: 'slashing' },
        { dice: { count: 3, die: 'd8', notation: '3d8' }, type: 'fire' },
      ],
    },
    {
      name: 'Whip',
      description: 'Melee Weapon Attack: +14 to hit, reach 30 ft., one target.',
      attackBonus: 14,
      reach: 30,
      damage: [
        { dice: { count: 2, die: 'd6', notation: '2d6+8' }, type: 'slashing' },
        { dice: { count: 3, die: 'd6', notation: '3d6' }, type: 'fire' },
      ],
    },
  ],
  description: 'The most powerful demon generals, balors command armies of lesser fiends.',
  environment: ['abyss', 'any'],
};

export const kraken: Monster = {
  id: 'kraken',
  name: 'Kraken',
  system: 'dnd-5e-2014',
  source: 'SRD',
  size: 'gargantuan',
  type: 'monstrosity',
  alignment: 'chaotic evil',
  challengeRating: 23,
  experiencePoints: 50000,
  armorClass: 18,
  hitPoints: { count: 27, die: 'd20', notation: '27d20+189' },
  speed: { walk: 20, swim: 60 },
  abilities: { str: 30, dex: 11, con: 25, int: 22, wis: 18, cha: 20 },
  savingThrows: { str: 17, dex: 7, con: 14, int: 13, wis: 11 },
  damageImmunities: ['lightning', 'bludgeoning', 'piercing', 'slashing'],
  conditionImmunities: ['frightened', 'paralyzed'],
  senses: ['truesight 120 ft.', 'passive Perception 14'],
  languages: [
    "understands Abyssal, Celestial, Infernal, and Primordial but can't speak",
    'telepathy 120 ft.',
  ],
  specialAbilities: [
    {
      name: 'Amphibious',
      description: 'The kraken can breathe air and water.',
    },
    {
      name: 'Freedom of Movement',
      description:
        "The kraken ignores difficult terrain, and magical effects can't reduce its speed or cause it to be restrained.",
    },
    {
      name: 'Siege Monster',
      description: 'The kraken deals double damage to objects and structures.',
    },
  ],
  actions: [
    {
      name: 'Multiattack',
      description:
        'The kraken makes three tentacle attacks, each of which it can replace with one use of Fling.',
    },
    {
      name: 'Bite',
      description: 'Melee Weapon Attack: +17 to hit, reach 5 ft., one target.',
      attackBonus: 17,
      reach: 5,
      damage: [{ dice: { count: 3, die: 'd8', notation: '3d8+10' }, type: 'piercing' }],
    },
    {
      name: 'Tentacle',
      description: 'Melee Weapon Attack: +17 to hit, reach 30 ft., one target.',
      attackBonus: 17,
      reach: 30,
      damage: [{ dice: { count: 3, die: 'd6', notation: '3d6+10' }, type: 'bludgeoning' }],
    },
    {
      name: 'Lightning Storm',
      description:
        'The kraken magically creates three bolts of lightning, each of which can strike a target within 120 feet. A target must make a DC 23 Dexterity saving throw, taking 22 (4d10) lightning damage on a failed save, or half as much on a successful one.',
    },
  ],
  legendaryActions: [
    {
      name: 'Tentacle Attack',
      cost: 1,
      description: 'The kraken makes one tentacle attack.',
    },
    {
      name: 'Fling',
      cost: 1,
      description:
        'One Large or smaller object held or creature grappled by the kraken is thrown up to 60 feet in a random direction and knocked prone.',
    },
    {
      name: 'Lightning Storm',
      cost: 2,
      description: 'The kraken uses Lightning Storm.',
    },
  ],
  description: 'A legendary sea monster of colossal size and terrible power.',
  environment: ['ocean', 'underwater'],
};

export const dnd5eCR11PlusMonsters: Monster[] = [
  adultRedDragon,
  purpleWorm,
  ancientBlueDragon,
  balor,
  lich,
  kraken,
  ancientRedDragon,
];
