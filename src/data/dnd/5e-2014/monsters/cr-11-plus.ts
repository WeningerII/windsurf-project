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
      savingThrow: { attribute: 'dex', dc: 23, effect: 'half as much damage on a success' },
      damage: [{ dice: { count: 4, die: 'd10', notation: '4d10' }, type: 'lightning' }],
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
  {
    id: 'adult-black-dragon',
    name: 'Adult Black Dragon',
    system: 'dnd-5e-2014',
    source: 'SRD',
    size: 'huge',
    type: 'dragon',
    alignment: 'chaotic evil',
    challengeRating: 14,
    experiencePoints: 11500,
    armorClass: 19,
    hitPoints: {
      count: 17,
      die: 'd12',
      modifier: 85,
      notation: '17d12+85',
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
      int: 14,
      wis: 13,
      cha: 17,
    },
    savingThrows: {
      dex: 7,
      con: 10,
      wis: 6,
      cha: 8,
    },
    skills: {
      Perception: 11,
      Stealth: 7,
    },
    damageImmunities: ['acid'],
    senses: ['blindsight 60 ft.', 'darkvision 120 ft.', 'passive Perception 21'],
    languages: ['Common', 'Draconic'],
    specialAbilities: [
      {
        name: 'Amphibious',
        description: 'The dragon can breathe air and water.',
      },
      {
        name: 'Legendary Resistance',
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
        description:
          'Melee Weapon Attack: +11 to hit, reach 10 ft., one target. Hit: 17 (2d10 + 6) piercing damage plus 4 (1d8) acid damage.',
        attackBonus: 11,
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
          'Melee Weapon Attack: +11 to hit, reach 5 ft., one target. Hit: 13 (2d6 + 6) slashing damage.',
        attackBonus: 11,
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
        name: 'Tail',
        description:
          'Melee Weapon Attack: +11 to hit, reach 15 ft., one target. Hit: 15 (2d8 + 6) bludgeoning damage.',
        attackBonus: 11,
        damage: [
          {
            dice: {
              count: 2,
              die: 'd8',
              modifier: 6,
              notation: '2d8+6',
            },
            type: 'bludgeoning',
          },
        ],
      },
      {
        name: 'Frightful Presence',
        description:
          "Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 16 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature's saving throw is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours.",
        savingThrow: {
          attribute: 'wis',
          dc: 16,
          effect: 'see description',
        },
      },
      {
        name: 'Acid Breath',
        description:
          'The dragon exhales acid in a 60-foot line that is 5 feet wide. Each creature in that line must make a DC 18 Dexterity saving throw, taking 54 (12d8) acid damage on a failed save, or half as much damage on a successful one.',
        damage: [
          {
            dice: {
              count: 12,
              die: 'd8',
              modifier: 0,
              notation: '12d8',
            },
            type: 'acid',
          },
        ],
        savingThrow: {
          attribute: 'dex',
          dc: 18,
          effect: 'half damage on a successful save',
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
        name: 'Wing Attack (Costs 2 Actions)',
        cost: 1,
        description:
          'The dragon beats its wings. Each creature within 10 ft. of the dragon must succeed on a DC 19 Dexterity saving throw or take 13 (2d6 + 6) bludgeoning damage and be knocked prone. The dragon can then fly up to half its flying speed.',
      },
    ],
  },
  {
    id: 'adult-blue-dragon',
    name: 'Adult Blue Dragon',
    system: 'dnd-5e-2014',
    source: 'SRD',
    size: 'huge',
    type: 'dragon',
    alignment: 'lawful evil',
    challengeRating: 16,
    experiencePoints: 15000,
    armorClass: 19,
    hitPoints: {
      count: 18,
      die: 'd12',
      modifier: 108,
      notation: '18d12+108',
    },
    speed: {
      walk: 40,
      fly: 80,
      burrow: 30,
    },
    abilities: {
      str: 25,
      dex: 10,
      con: 23,
      int: 16,
      wis: 15,
      cha: 19,
    },
    savingThrows: {
      dex: 5,
      con: 11,
      wis: 7,
      cha: 9,
    },
    skills: {
      Perception: 12,
      Stealth: 5,
    },
    damageImmunities: ['lightning'],
    senses: ['blindsight 60 ft.', 'darkvision 120 ft.', 'passive Perception 22'],
    languages: ['Common', 'Draconic'],
    specialAbilities: [
      {
        name: 'Legendary Resistance',
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
        description:
          'Melee Weapon Attack: +12 to hit, reach 10 ft., one target. Hit: 18 (2d10 + 7) piercing damage plus 5 (1d10) lightning damage.',
        attackBonus: 12,
        damage: [
          {
            dice: {
              count: 2,
              die: 'd10',
              modifier: 7,
              notation: '2d10+7',
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
          'Melee Weapon Attack: +12 to hit, reach 5 ft., one target. Hit: 14 (2d6 + 7) slashing damage.',
        attackBonus: 12,
        damage: [
          {
            dice: {
              count: 2,
              die: 'd6',
              modifier: 7,
              notation: '2d6+7',
            },
            type: 'slashing',
          },
        ],
      },
      {
        name: 'Tail',
        description:
          'Melee Weapon Attack: +12 to hit, reach 15 ft., one target. Hit: 16 (2d8 + 7) bludgeoning damage.',
        attackBonus: 12,
        damage: [
          {
            dice: {
              count: 2,
              die: 'd8',
              modifier: 7,
              notation: '2d8+7',
            },
            type: 'bludgeoning',
          },
        ],
      },
      {
        name: 'Frightful Presence',
        description:
          "Each creature of the dragon's choice that is within 120 ft. of the dragon and aware of it must succeed on a DC 17 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature's saving throw is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours.",
        savingThrow: {
          attribute: 'wis',
          dc: 17,
          effect: 'see description',
        },
      },
      {
        name: 'Lightning Breath',
        description:
          'The dragon exhales lightning in a 90-foot line that is 5 ft. wide. Each creature in that line must make a DC 19 Dexterity saving throw, taking 66 (12d10) lightning damage on a failed save, or half as much damage on a successful one.',
        damage: [
          {
            dice: {
              count: 12,
              die: 'd10',
              modifier: 0,
              notation: '12d10',
            },
            type: 'lightning',
          },
        ],
        savingThrow: {
          attribute: 'dex',
          dc: 19,
          effect: 'half damage on a successful save',
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
        name: 'Wing Attack (Costs 2 Actions)',
        cost: 1,
        description:
          'The dragon beats its wings. Each creature within 10 ft. of the dragon must succeed on a DC 20 Dexterity saving throw or take 14 (2d6 + 7) bludgeoning damage and be knocked prone. The dragon can then fly up to half its flying speed.',
      },
    ],
  },
  {
    id: 'adult-brass-dragon',
    name: 'Adult Brass Dragon',
    system: 'dnd-5e-2014',
    source: 'SRD',
    size: 'huge',
    type: 'dragon',
    alignment: 'chaotic good',
    challengeRating: 13,
    experiencePoints: 10000,
    armorClass: 18,
    hitPoints: {
      count: 15,
      die: 'd12',
      modifier: 75,
      notation: '15d12+75',
    },
    speed: {
      walk: 40,
      fly: 80,
      burrow: 40,
    },
    abilities: {
      str: 23,
      dex: 10,
      con: 21,
      int: 14,
      wis: 13,
      cha: 17,
    },
    savingThrows: {
      dex: 5,
      con: 10,
      wis: 6,
      cha: 8,
    },
    skills: {
      History: 7,
      Perception: 11,
      Persuasion: 8,
      Stealth: 5,
    },
    damageImmunities: ['fire'],
    senses: ['blindsight 60 ft.', 'darkvision 120 ft.', 'passive Perception 21'],
    languages: ['Common', 'Draconic'],
    specialAbilities: [
      {
        name: 'Legendary Resistance',
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
        description:
          'Melee Weapon Attack: +11 to hit, reach 10 ft., one target. Hit: 17 (2d10 + 6) piercing damage.',
        attackBonus: 11,
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
          'Melee Weapon Attack: +11 to hit, reach 5 ft., one target. Hit: 13 (2d6 + 6) slashing damage.',
        attackBonus: 11,
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
        name: 'Tail',
        description:
          'Melee Weapon Attack: +11 to hit, reach 15 ft., one target. Hit: 15 (2d8 + 6) bludgeoning damage.',
        attackBonus: 11,
        damage: [
          {
            dice: {
              count: 2,
              die: 'd8',
              modifier: 6,
              notation: '2d8+6',
            },
            type: 'bludgeoning',
          },
        ],
      },
      {
        name: 'Frightful Presence',
        description:
          "Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 16 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature's saving throw is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours .",
        savingThrow: {
          attribute: 'wis',
          dc: 16,
          effect: 'see description',
        },
      },
      {
        name: 'Breath Weapons',
        description:
          'The dragon uses one of the following breath weapons. Fire Breath. The dragon exhales fire in an 60-foot line that is 5 feet wide. Each creature in that line must make a DC 18 Dexterity saving throw, taking 45 (13d6) fire damage on a failed save, or half as much damage on a successful one. Sleep Breath. The dragon exhales sleep gas in a 60-foot cone. Each creature in that area must succeed on a DC 18 Constitution saving throw or fall unconscious for 10 minutes. This effect ends for a creature if the creature takes damage or someone uses an action to wake it.',
        recharge: '5-6',
        savingThrow: {
          attribute: 'dex',
          dc: 18,
          effect: 'half damage on a successful save',
        },
        damage: [
          {
            dice: {
              count: 13,
              die: 'd6',
              modifier: 0,
              notation: '13d6',
            },
            type: 'fire',
          },
        ],
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
        name: 'Wing Attack (Costs 2 Actions)',
        cost: 1,
        description:
          'The dragon beats its wings. Each creature within 10 ft. of the dragon must succeed on a DC 19 Dexterity saving throw or take 13 (2d6 + 6) bludgeoning damage and be knocked prone. The dragon can then fly up to half its flying speed.',
      },
    ],
  },
  {
    id: 'adult-bronze-dragon',
    name: 'Adult Bronze Dragon',
    system: 'dnd-5e-2014',
    source: 'SRD',
    size: 'huge',
    type: 'dragon',
    alignment: 'lawful good',
    challengeRating: 15,
    experiencePoints: 13000,
    armorClass: 19,
    hitPoints: {
      count: 17,
      die: 'd12',
      modifier: 102,
      notation: '17d12+102',
    },
    speed: {
      walk: 40,
      fly: 80,
      swim: 40,
    },
    abilities: {
      str: 25,
      dex: 10,
      con: 23,
      int: 16,
      wis: 15,
      cha: 19,
    },
    savingThrows: {
      dex: 5,
      con: 11,
      wis: 7,
      cha: 9,
    },
    skills: {
      Insight: 7,
      Perception: 12,
      Stealth: 5,
    },
    damageImmunities: ['lightning'],
    senses: ['blindsight 60 ft.', 'darkvision 120 ft.', 'passive Perception 22'],
    languages: ['Common', 'Draconic'],
    specialAbilities: [
      {
        name: 'Amphibious',
        description: 'The dragon can breathe air and water.',
      },
      {
        name: 'Legendary Resistance',
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
        description:
          'Melee Weapon Attack: +12 to hit, reach 10 ft., one target. Hit: 18 (2d10 + 7) piercing damage.',
        attackBonus: 12,
        damage: [
          {
            dice: {
              count: 2,
              die: 'd10',
              modifier: 7,
              notation: '2d10+7',
            },
            type: 'piercing',
          },
        ],
      },
      {
        name: 'Claw',
        description:
          'Melee Weapon Attack: +12 to hit, reach 5 ft., one target. Hit: 14 (2d6 + 7) slashing damage.',
        attackBonus: 12,
        damage: [
          {
            dice: {
              count: 2,
              die: 'd6',
              modifier: 7,
              notation: '2d6+7',
            },
            type: 'slashing',
          },
        ],
      },
      {
        name: 'Tail',
        description:
          'Melee Weapon Attack: +12 to hit, reach 15 ft., one target. Hit: 16 (2d8 + 7) bludgeoning damage.',
        attackBonus: 12,
        damage: [
          {
            dice: {
              count: 2,
              die: 'd8',
              modifier: 7,
              notation: '2d8+7',
            },
            type: 'bludgeoning',
          },
        ],
      },
      {
        name: 'Frightful Presence',
        description:
          "Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 17 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature's saving throw is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours.",
        savingThrow: {
          attribute: 'wis',
          dc: 17,
          effect: 'see description',
        },
      },
      {
        name: 'Breath Weapons',
        description:
          'The dragon uses one of the following breath weapons. Lightning Breath. The dragon exhales lightning in a 90-foot line that is 5 feet wide. Each creature in that line must make a DC 19 Dexterity saving throw, taking 66 (12d10) lightning damage on a failed save, or half as much damage on a successful one. Repulsion Breath. The dragon exhales repulsion energy in a 30-foot cone. Each creature in that area must succeed on a DC 19 Strength saving throw. On a failed save, the creature is pushed 60 feet away from the dragon.',
        recharge: '5-6',
        savingThrow: {
          attribute: 'dex',
          dc: 19,
          effect: 'half damage on a successful save',
        },
        damage: [
          {
            dice: {
              count: 12,
              die: 'd10',
              modifier: 0,
              notation: '12d10',
            },
            type: 'lightning',
          },
        ],
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
        name: 'Wing Attack (Costs 2 Actions)',
        cost: 1,
        description:
          'The dragon beats its wings. Each creature within 10 ft. of the dragon must succeed on a DC 20 Dexterity saving throw or take 14 (2d6 + 7) bludgeoning damage and be knocked prone. The dragon can then fly up to half its flying speed.',
      },
    ],
  },
  {
    id: 'adult-copper-dragon',
    name: 'Adult Copper Dragon',
    system: 'dnd-5e-2014',
    source: 'SRD',
    size: 'huge',
    type: 'dragon',
    alignment: 'chaotic good',
    challengeRating: 14,
    experiencePoints: 11500,
    armorClass: 18,
    hitPoints: {
      count: 16,
      die: 'd12',
      modifier: 80,
      notation: '16d12+80',
    },
    speed: {
      walk: 40,
      fly: 80,
      climb: 40,
    },
    abilities: {
      str: 23,
      dex: 12,
      con: 21,
      int: 18,
      wis: 15,
      cha: 17,
    },
    savingThrows: {
      dex: 6,
      con: 10,
      wis: 7,
      cha: 8,
    },
    skills: {
      Deception: 8,
      Perception: 12,
      Stealth: 6,
    },
    damageImmunities: ['acid'],
    senses: ['blindsight 60 ft.', 'darkvision 120 ft.', 'passive Perception 22'],
    languages: ['Common', 'Draconic'],
    specialAbilities: [
      {
        name: 'Legendary Resistance',
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
        description:
          'Melee Weapon Attack: +11 to hit, reach 10 ft., one target. Hit: 17 (2d10 + 6) piercing damage.',
        attackBonus: 11,
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
          'Melee Weapon Attack: +11 to hit, reach 5 ft., one target. Hit: 13 (2d6 + 6) slashing damage.',
        attackBonus: 11,
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
        name: 'Tail',
        description:
          'Melee Weapon Attack: +11 to hit, reach 15 ft., one target. Hit: 15 (2d8 + 6) bludgeoning damage.',
        attackBonus: 11,
        damage: [
          {
            dice: {
              count: 2,
              die: 'd8',
              modifier: 6,
              notation: '2d8+6',
            },
            type: 'bludgeoning',
          },
        ],
      },
      {
        name: 'Frightful Presence',
        description:
          "Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 16 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature's saving throw is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours.",
        savingThrow: {
          attribute: 'wis',
          dc: 16,
          effect: 'see description',
        },
      },
      {
        name: 'Breath Weapons',
        description:
          "The dragon uses one of the following breath weapons. Acid Breath. The dragon exhales acid in an 60-foot line that is 5 feet wide. Each creature in that line must make a DC 18 Dexterity saving throw, taking 54 (12d8) acid damage on a failed save, or half as much damage on a successful one. Slowing Breath. The dragon exhales gas in a 60-foot cone. Each creature in that area must succeed on a DC 18 Constitution saving throw. On a failed save, the creature can't use reactions, its speed is halved, and it can't make more than one attack on its turn. In addition, the creature can use either an action or a bonus action on its turn, but not both. These effects last for 1 minute. The creature can repeat the saving throw at the end of each of its turns, ending the effect on itself with a successful save.",
        recharge: '5-6',
        savingThrow: {
          attribute: 'dex',
          dc: 18,
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
            type: 'acid',
          },
        ],
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
        name: 'Wing Attack (Costs 2 Actions)',
        cost: 1,
        description:
          'The dragon beats its wings. Each creature within 10 ft. of the dragon must succeed on a DC 19 Dexterity saving throw or take 13 (2d6 + 6) bludgeoning damage and be knocked prone. The dragon can then fly up to half its flying speed.',
      },
    ],
  },
  {
    id: 'adult-gold-dragon',
    name: 'Adult Gold Dragon',
    system: 'dnd-5e-2014',
    source: 'SRD',
    size: 'huge',
    type: 'dragon',
    alignment: 'lawful good',
    challengeRating: 17,
    experiencePoints: 18000,
    armorClass: 19,
    hitPoints: {
      count: 19,
      die: 'd12',
      modifier: 133,
      notation: '19d12+133',
    },
    speed: {
      walk: 40,
      fly: 80,
      swim: 40,
    },
    abilities: {
      str: 27,
      dex: 14,
      con: 25,
      int: 16,
      wis: 15,
      cha: 24,
    },
    savingThrows: {
      dex: 8,
      con: 13,
      wis: 8,
      cha: 13,
    },
    skills: {
      Insight: 8,
      Perception: 14,
      Persuasion: 13,
      Stealth: 8,
    },
    damageImmunities: ['fire'],
    senses: ['blindsight 60 ft.', 'darkvision 120 ft.', 'passive Perception 24'],
    languages: ['Common', 'Draconic'],
    specialAbilities: [
      {
        name: 'Amphibious',
        description: 'The dragon can breathe air and water.',
      },
      {
        name: 'Legendary Resistance',
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
        description:
          'Melee Weapon Attack: +14 to hit, reach 10 ft., one target. Hit: 19 (2d10 + 8) piercing damage.',
        attackBonus: 14,
        damage: [
          {
            dice: {
              count: 2,
              die: 'd10',
              modifier: 8,
              notation: '2d10+8',
            },
            type: 'piercing',
          },
        ],
      },
      {
        name: 'Claw',
        description:
          'Melee Weapon Attack: +14 to hit, reach 5 ft., one target. Hit: 15 (2d6 + 8) slashing damage.',
        attackBonus: 14,
        damage: [
          {
            dice: {
              count: 2,
              die: 'd6',
              modifier: 8,
              notation: '2d6+8',
            },
            type: 'slashing',
          },
        ],
      },
      {
        name: 'Tail',
        description:
          'Melee Weapon Attack: +14 to hit, reach 15 ft., one target. Hit: 17 (2d8 + 8) bludgeoning damage.',
        attackBonus: 14,
        damage: [
          {
            dice: {
              count: 2,
              die: 'd8',
              modifier: 8,
              notation: '2d8+8',
            },
            type: 'bludgeoning',
          },
        ],
      },
      {
        name: 'Frightful Presence',
        description:
          "Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 21 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature's saving throw is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours.",
        savingThrow: {
          attribute: 'wis',
          dc: 21,
          effect: 'see description',
        },
      },
      {
        name: 'Breath Weapons',
        description:
          'The dragon uses one of the following breath weapons. Fire Breath. The dragon exhales fire in a 60-foot cone. Each creature in that area must make a DC 21 Dexterity saving throw, taking 66 (12d10) fire damage on a failed save, or half as much damage on a successful one. Weakening Breath. The dragon exhales gas in a 60-foot cone. Each creature in that area must succeed on a DC 21 Strength saving throw or have disadvantage on Strength-based attack rolls, Strength checks, and Strength saving throws for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success.',
        recharge: '5-6',
        savingThrow: {
          attribute: 'dex',
          dc: 21,
          effect: 'half damage on a successful save',
        },
        damage: [
          {
            dice: {
              count: 12,
              die: 'd10',
              modifier: 0,
              notation: '12d10',
            },
            type: 'fire',
          },
        ],
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
        name: 'Wing Attack (Costs 2 Actions)',
        cost: 1,
        description:
          'The dragon beats its wings. Each creature within 10 ft. of the dragon must succeed on a DC 22 Dexterity saving throw or take 15 (2d6 + 8) bludgeoning damage and be knocked prone. The dragon can then fly up to half its flying speed.',
      },
    ],
  },
  {
    id: 'adult-green-dragon',
    name: 'Adult Green Dragon',
    system: 'dnd-5e-2014',
    source: 'SRD',
    size: 'huge',
    type: 'dragon',
    alignment: 'lawful evil',
    challengeRating: 15,
    experiencePoints: 13000,
    armorClass: 19,
    hitPoints: {
      count: 18,
      die: 'd12',
      modifier: 90,
      notation: '18d12+90',
    },
    speed: {
      walk: 40,
      fly: 80,
      swim: 40,
    },
    abilities: {
      str: 23,
      dex: 12,
      con: 21,
      int: 18,
      wis: 15,
      cha: 17,
    },
    savingThrows: {
      dex: 6,
      con: 10,
      wis: 7,
      cha: 8,
    },
    skills: {
      Deception: 8,
      Insight: 7,
      Perception: 12,
      Persuasion: 8,
      Stealth: 6,
    },
    damageImmunities: ['poison'],
    conditionImmunities: ['Poisoned'],
    senses: ['blindsight 60 ft.', 'darkvision 120 ft.', 'passive Perception 22'],
    languages: ['Common', 'Draconic'],
    specialAbilities: [
      {
        name: 'Amphibious',
        description: 'The dragon can breathe air and water.',
      },
      {
        name: 'Legendary Resistance',
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
        description:
          'Melee Weapon Attack: +11 to hit, reach 10 ft., one target. Hit: 17 (2d10 + 6) piercing damage plus 7 (2d6) poison damage.',
        attackBonus: 11,
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
          'Melee Weapon Attack: +11 to hit, reach 5 ft., one target. Hit: 13 (2d6 + 6) slashing damage.',
        attackBonus: 11,
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
        name: 'Tail',
        description:
          'Melee Weapon Attack: +11 to hit, reach 15 ft., one target. Hit: 15 (2d8 + 6) bludgeoning damage.',
        attackBonus: 11,
        damage: [
          {
            dice: {
              count: 2,
              die: 'd8',
              modifier: 6,
              notation: '2d8+6',
            },
            type: 'bludgeoning',
          },
        ],
      },
      {
        name: 'Frightful Presence',
        description:
          "Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 16 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature's saving throw is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours .",
        savingThrow: {
          attribute: 'wis',
          dc: 16,
          effect: 'see description',
        },
      },
      {
        name: 'Poison Breath',
        description:
          'The dragon exhales poisonous gas in a 60-foot cone. Each creature in that area must make a DC 18 Constitution saving throw, taking 56 (16d6) poison damage on a failed save, or half as much damage on a successful one.',
        damage: [
          {
            dice: {
              count: 16,
              die: 'd6',
              modifier: 0,
              notation: '16d6',
            },
            type: 'poison',
          },
        ],
        savingThrow: {
          attribute: 'con',
          dc: 18,
          effect: 'half damage on a successful save',
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
        name: 'Wing Attack (Costs 2 Actions)',
        cost: 1,
        description:
          'The dragon beats its wings. Each creature within 10 ft. of the dragon must succeed on a DC 19 Dexterity saving throw or take 13 (2d6 + 6) bludgeoning damage and be knocked prone. The dragon can then fly up to half its flying speed.',
      },
    ],
  },
  {
    id: 'adult-silver-dragon',
    name: 'Adult Silver Dragon',
    system: 'dnd-5e-2014',
    source: 'SRD',
    size: 'huge',
    type: 'dragon',
    alignment: 'lawful good',
    challengeRating: 16,
    experiencePoints: 15000,
    armorClass: 19,
    hitPoints: {
      count: 18,
      die: 'd12',
      modifier: 126,
      notation: '18d12+126',
    },
    speed: {
      walk: 40,
      fly: 80,
    },
    abilities: {
      str: 27,
      dex: 10,
      con: 25,
      int: 16,
      wis: 13,
      cha: 21,
    },
    savingThrows: {
      dex: 5,
      con: 12,
      wis: 6,
      cha: 10,
    },
    skills: {
      Arcana: 8,
      History: 8,
      Perception: 11,
      Stealth: 5,
    },
    damageImmunities: ['cold'],
    senses: ['blindsight 60 ft.', 'darkvision 120 ft.', 'passive Perception 21'],
    languages: ['Common', 'Draconic'],
    specialAbilities: [
      {
        name: 'Legendary Resistance',
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
        description:
          'Melee Weapon Attack: +13 to hit, reach 10 ft., one target. Hit: 19 (2d10 + 8) piercing damage.',
        attackBonus: 13,
        damage: [
          {
            dice: {
              count: 2,
              die: 'd10',
              modifier: 8,
              notation: '2d10+8',
            },
            type: 'piercing',
          },
        ],
      },
      {
        name: 'Claw',
        description:
          'Melee Weapon Attack: +13 to hit, reach 5 ft., one target. Hit: 15 (2d6 + 8) slashing damage.',
        attackBonus: 13,
        damage: [
          {
            dice: {
              count: 2,
              die: 'd6',
              modifier: 8,
              notation: '2d6+8',
            },
            type: 'slashing',
          },
        ],
      },
      {
        name: 'Tail',
        description:
          'Melee Weapon Attack: +13 to hit, reach 15 ft., one target. Hit: 17 (2d8 + 8) bludgeoning damage.',
        attackBonus: 13,
        damage: [
          {
            dice: {
              count: 2,
              die: 'd8',
              modifier: 8,
              notation: '2d8+8',
            },
            type: 'bludgeoning',
          },
        ],
      },
      {
        name: 'Frightful Presence',
        description:
          "Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 18 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature's saving throw is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours.",
        savingThrow: {
          attribute: 'wis',
          dc: 18,
          effect: 'see description',
        },
      },
      {
        name: 'Breath Weapons',
        description:
          'The dragon uses one of the following breath weapons. Cold Breath. The dragon exhales an icy blast in a 60-foot cone. Each creature in that area must make a DC 20 Constitution saving throw, taking 58 (13d8) cold damage on a failed save, or half as much damage on a successful one. Paralyzing Breath. The dragon exhales paralyzing gas in a 60-foot cone. Each creature in that area must succeed on a DC 20 Constitution saving throw or be paralyzed for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success.',
        recharge: '5-6',
        savingThrow: {
          attribute: 'con',
          dc: 20,
          effect: 'half damage on a successful save',
        },
        damage: [
          {
            dice: {
              count: 13,
              die: 'd8',
              modifier: 0,
              notation: '13d8',
            },
            type: 'cold',
          },
        ],
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
        name: 'Wing Attack (Costs 2 Actions)',
        cost: 1,
        description:
          'The dragon beats its wings. Each creature within 10 ft. of the dragon must succeed on a DC 22 Dexterity saving throw or take 15 (2d6 + 8) bludgeoning damage and be knocked prone. The dragon can then fly up to half its flying speed.',
      },
    ],
  },
  {
    id: 'adult-white-dragon',
    name: 'Adult White Dragon',
    system: 'dnd-5e-2014',
    source: 'SRD',
    size: 'huge',
    type: 'dragon',
    alignment: 'chaotic evil',
    challengeRating: 13,
    experiencePoints: 10000,
    armorClass: 18,
    hitPoints: {
      count: 16,
      die: 'd12',
      modifier: 96,
      notation: '16d12+96',
    },
    speed: {
      walk: 40,
      fly: 80,
      swim: 40,
      burrow: 30,
    },
    abilities: {
      str: 22,
      dex: 10,
      con: 22,
      int: 8,
      wis: 12,
      cha: 12,
    },
    savingThrows: {
      dex: 5,
      con: 11,
      wis: 6,
      cha: 6,
    },
    skills: {
      Perception: 11,
      Stealth: 5,
    },
    damageImmunities: ['cold'],
    senses: ['blindsight 60 ft.', 'darkvision 120 ft.', 'passive Perception 21'],
    languages: ['Common', 'Draconic'],
    specialAbilities: [
      {
        name: 'Ice Walk',
        description:
          "The dragon can move across and climb icy surfaces without needing to make an ability check. Additionally, difficult terrain composed of ice or snow doesn't cost it extra movement.",
      },
      {
        name: 'Legendary Resistance',
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
        description:
          'Melee Weapon Attack: +11 to hit, reach 10 ft., one target. Hit: 17 (2d10 + 6) piercing damage plus 4 (1d8) cold damage.',
        attackBonus: 11,
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
          {
            dice: {
              count: 1,
              die: 'd8',
              modifier: 0,
              notation: '1d8',
            },
            type: 'cold',
          },
        ],
      },
      {
        name: 'Claw',
        description:
          'Melee Weapon Attack: +11 to hit, reach 5 ft., one target. Hit: 13 (2d6 + 6) slashing damage.',
        attackBonus: 11,
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
        name: 'Tail',
        description:
          'Melee Weapon Attack: +11 to hit, reach 15 ft., one target. Hit: 15 (2d8 + 6) bludgeoning damage.',
        attackBonus: 11,
        damage: [
          {
            dice: {
              count: 2,
              die: 'd8',
              modifier: 6,
              notation: '2d8+6',
            },
            type: 'bludgeoning',
          },
        ],
      },
      {
        name: 'Frightful Presence',
        description:
          "Each creature of the dragon's choice that is within 120 ft. of the dragon and aware of it must succeed on a DC 14 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature's saving throw is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours.",
        savingThrow: {
          attribute: 'wis',
          dc: 14,
          effect: 'see description',
        },
      },
      {
        name: 'Cold Breath',
        description:
          'The dragon exhales an icy blast in a 60-foot cone. Each creature in that area must make a DC 19 Constitution saving throw, taking 54 (12d8) cold damage on a failed save, or half as much damage on a successful one.',
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
        savingThrow: {
          attribute: 'con',
          dc: 19,
          effect: 'half damage on a successful save',
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
        name: 'Wing Attack (Costs 2 Actions)',
        cost: 1,
        description:
          'The dragon beats its wings. Each creature within 10 ft. of the dragon must succeed on a DC 19 Dexterity saving throw or take 13 (2d6 + 6) bludgeoning damage and be knocked prone. The dragon can then fly up to half its flying speed.',
      },
    ],
  },
  {
    id: 'ancient-black-dragon',
    name: 'Ancient Black Dragon',
    system: 'dnd-5e-2014',
    source: 'SRD',
    size: 'gargantuan',
    type: 'dragon',
    alignment: 'chaotic evil',
    challengeRating: 21,
    experiencePoints: 33000,
    armorClass: 22,
    hitPoints: {
      count: 21,
      die: 'd20',
      modifier: 147,
      notation: '21d20+147',
    },
    speed: {
      walk: 40,
      fly: 80,
      swim: 40,
    },
    abilities: {
      str: 27,
      dex: 14,
      con: 25,
      int: 16,
      wis: 15,
      cha: 19,
    },
    savingThrows: {
      dex: 9,
      con: 14,
      wis: 9,
      cha: 11,
    },
    skills: {
      Perception: 16,
      Stealth: 9,
    },
    damageImmunities: ['acid'],
    senses: ['blindsight 60 ft.', 'darkvision 120 ft.', 'passive Perception 26'],
    languages: ['Common', 'Draconic'],
    specialAbilities: [
      {
        name: 'Amphibious',
        description: 'The dragon can breathe air and water.',
      },
      {
        name: 'Legendary Resistance',
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
        description:
          'Melee Weapon Attack: +15 to hit, reach 15 ft., one target. Hit: 19 (2d10 + 8) piercing damage plus 9 (2d8) acid damage.',
        attackBonus: 15,
        damage: [
          {
            dice: {
              count: 2,
              die: 'd10',
              modifier: 8,
              notation: '2d10+8',
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
            type: 'acid',
          },
        ],
      },
      {
        name: 'Claw',
        description:
          'Melee Weapon Attack: +15 to hit, reach 10 ft., one target. Hit: 15 (2d6 + 8) slashing damage.',
        attackBonus: 15,
        damage: [
          {
            dice: {
              count: 2,
              die: 'd6',
              modifier: 8,
              notation: '2d6+8',
            },
            type: 'slashing',
          },
        ],
      },
      {
        name: 'Tail',
        description:
          'Melee Weapon Attack: +15 to hit, reach 20 ft., one target. Hit: 17 (2d8 + 8) bludgeoning damage.',
        attackBonus: 15,
        damage: [
          {
            dice: {
              count: 2,
              die: 'd8',
              modifier: 8,
              notation: '2d8+8',
            },
            type: 'bludgeoning',
          },
        ],
      },
      {
        name: 'Frightful Presence',
        description:
          "Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 19 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature's saving throw is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours.",
        savingThrow: {
          attribute: 'wis',
          dc: 19,
          effect: 'see description',
        },
      },
      {
        name: 'Acid Breath',
        description:
          'The dragon exhales acid in a 90-foot line that is 10 feet wide. Each creature in that line must make a DC 22 Dexterity saving throw, taking 67 (15d8) acid damage on a failed save, or half as much damage on a successful one.',
        damage: [
          {
            dice: {
              count: 15,
              die: 'd8',
              modifier: 0,
              notation: '15d8',
            },
            type: 'acid',
          },
        ],
        savingThrow: {
          attribute: 'dex',
          dc: 22,
          effect: 'half damage on a successful save',
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
        name: 'Wing Attack (Costs 2 Actions)',
        cost: 1,
        description:
          'The dragon beats its wings. Each creature within 15 ft. of the dragon must succeed on a DC 23 Dexterity saving throw or take 15 (2d6 + 8) bludgeoning damage and be knocked prone. The dragon can then fly up to half its flying speed.',
      },
    ],
  },
  {
    id: 'ancient-brass-dragon',
    name: 'Ancient Brass Dragon',
    system: 'dnd-5e-2014',
    source: 'SRD',
    size: 'gargantuan',
    type: 'dragon',
    alignment: 'chaotic good',
    challengeRating: 20,
    experiencePoints: 25000,
    armorClass: 20,
    hitPoints: {
      count: 17,
      die: 'd20',
      modifier: 119,
      notation: '17d20+119',
    },
    speed: {
      walk: 40,
      fly: 80,
      burrow: 40,
    },
    abilities: {
      str: 27,
      dex: 10,
      con: 25,
      int: 16,
      wis: 15,
      cha: 19,
    },
    savingThrows: {
      dex: 6,
      con: 13,
      wis: 8,
      cha: 10,
    },
    skills: {
      History: 9,
      Perception: 14,
      Persuasion: 10,
      Stealth: 6,
    },
    damageImmunities: ['fire'],
    senses: ['blindsight 60 ft.', 'darkvision 120 ft.', 'passive Perception 24'],
    languages: ['Common', 'Draconic'],
    specialAbilities: [
      {
        name: 'Legendary Resistance',
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
        description:
          'Melee Weapon Attack: +14 to hit, reach 15 ft., one target. Hit: 19 (2d10 + 8) piercing damage.',
        attackBonus: 14,
        damage: [
          {
            dice: {
              count: 2,
              die: 'd10',
              modifier: 8,
              notation: '2d10+8',
            },
            type: 'piercing',
          },
        ],
      },
      {
        name: 'Claw',
        description:
          'Melee Weapon Attack: +14 to hit, reach 10 ft., one target. Hit: 15 (2d6 + 8) slashing damage.',
        attackBonus: 14,
        damage: [
          {
            dice: {
              count: 2,
              die: 'd6',
              modifier: 8,
              notation: '2d6+8',
            },
            type: 'slashing',
          },
        ],
      },
      {
        name: 'Tail',
        description:
          'Melee Weapon Attack: +14 to hit, reach 20 ft., one target. Hit: 17 (2d8 + 8) bludgeoning damage.',
        attackBonus: 14,
        damage: [
          {
            dice: {
              count: 2,
              die: 'd8',
              modifier: 8,
              notation: '2d8+8',
            },
            type: 'bludgeoning',
          },
        ],
      },
      {
        name: 'Frightful Presence',
        description:
          "Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 18 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature's saving throw is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours.",
        savingThrow: {
          attribute: 'wis',
          dc: 18,
          effect: 'see description',
        },
      },
      {
        name: 'Breath Weapons',
        description:
          'The dragon uses one of the following breath weapons: Fire Breath. The dragon exhales fire in an 90-foot line that is 10 feet wide. Each creature in that line must make a DC 21 Dexterity saving throw, taking 56 (16d6) fire damage on a failed save, or half as much damage on a successful one. Sleep Breath. The dragon exhales sleep gas in a 90-foot cone. Each creature in that area must succeed on a DC 21 Constitution saving throw or fall unconscious for 10 minutes. This effect ends for a creature if the creature takes damage or someone uses an action to wake it.',
        recharge: '5-6',
        savingThrow: {
          attribute: 'dex',
          dc: 21,
          effect: 'half damage on a successful save',
        },
        damage: [
          {
            dice: {
              count: 16,
              die: 'd6',
              modifier: 0,
              notation: '16d6',
            },
            type: 'fire',
          },
        ],
      },
      {
        name: 'Change Shape',
        description:
          "The dragon magically polymorphs into a humanoid or beast that has a challenge rating no higher than its own, or back into its true form. It reverts to its true form if it dies. Any equipment it is wearing or carrying is absorbed or borne by the new form (the dragon's choice). In a new form, the dragon retains its alignment, hit points, Hit Dice, ability to speak, proficiencies, Legendary Resistance, lair actions, and Intelligence, Wisdom, and Charisma scores, as well as this action. Its statistics and capabilities are otherwise replaced by those of the new form, except any class features or legendary actions of that form.",
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
        name: 'Wing Attack (Costs 2 Actions)',
        cost: 1,
        description:
          'The dragon beats its wings. Each creature within 15 ft. of the dragon must succeed on a DC 22 Dexterity saving throw or take 15 (2d6 + 8) bludgeoning damage and be knocked prone. The dragon can then fly up to half its flying speed.',
      },
    ],
  },
  {
    id: 'ancient-bronze-dragon',
    name: 'Ancient Bronze Dragon',
    system: 'dnd-5e-2014',
    source: 'SRD',
    size: 'gargantuan',
    type: 'dragon',
    alignment: 'lawful good',
    challengeRating: 22,
    experiencePoints: 41000,
    armorClass: 22,
    hitPoints: {
      count: 24,
      die: 'd20',
      modifier: 192,
      notation: '24d20+192',
    },
    speed: {
      walk: 40,
      fly: 80,
      swim: 40,
    },
    abilities: {
      str: 29,
      dex: 10,
      con: 27,
      int: 18,
      wis: 17,
      cha: 21,
    },
    savingThrows: {
      dex: 7,
      con: 15,
      wis: 10,
      cha: 12,
    },
    skills: {
      Insight: 10,
      Perception: 17,
      Stealth: 7,
    },
    damageImmunities: ['lightning'],
    senses: ['blindsight 60 ft.', 'darkvision 120 ft.', 'passive Perception 27'],
    languages: ['Common', 'Draconic'],
    specialAbilities: [
      {
        name: 'Amphibious',
        description: 'The dragon can breathe air and water.',
      },
      {
        name: 'Legendary Resistance',
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
        description:
          'Melee Weapon Attack: +16 to hit, reach 15 ft., one target. Hit: 20 (2d10 + 9) piercing damage.',
        attackBonus: 16,
        damage: [
          {
            dice: {
              count: 2,
              die: 'd10',
              modifier: 9,
              notation: '2d10+9',
            },
            type: 'piercing',
          },
        ],
      },
      {
        name: 'Claw',
        description:
          'Melee Weapon Attack: +16 to hit, reach 10 ft., one target. Hit: 16 (2d6 + 9) slashing damage.',
        attackBonus: 16,
        damage: [
          {
            dice: {
              count: 2,
              die: 'd6',
              modifier: 9,
              notation: '2d6+9',
            },
            type: 'slashing',
          },
        ],
      },
      {
        name: 'Tail',
        description:
          'Melee Weapon Attack: +16 to hit, reach 20 ft., one target. Hit: 18 (2d8 + 9) bludgeoning damage.',
        attackBonus: 16,
        damage: [
          {
            dice: {
              count: 2,
              die: 'd8',
              modifier: 9,
              notation: '2d8+9',
            },
            type: 'bludgeoning',
          },
        ],
      },
      {
        name: 'Frightful Presence',
        description:
          "Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 20 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature's saving throw is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours.",
        savingThrow: {
          attribute: 'wis',
          dc: 20,
          effect: 'see description',
        },
      },
      {
        name: 'Breath Weapons',
        description:
          'The dragon uses one of the following breath weapons. Lightning Breath. The dragon exhales lightning in a 120-foot line that is 10 feet wide. Each creature in that line must make a DC 23 Dexterity saving throw, taking 88 (16d10) lightning damage on a failed save, or half as much damage on a successful one. Repulsion Breath. The dragon exhales repulsion energy in a 30-foot cone. Each creature in that area must succeed on a DC 23 Strength saving throw. On a failed save, the creature is pushed 60 feet away from the dragon.',
        recharge: '5-6',
        savingThrow: {
          attribute: 'dex',
          dc: 23,
          effect: 'half damage on a successful save',
        },
        damage: [
          {
            dice: {
              count: 16,
              die: 'd10',
              modifier: 0,
              notation: '16d10',
            },
            type: 'lightning',
          },
        ],
      },
      {
        name: 'Change Shape',
        description:
          "The dragon magically polymorphs into a humanoid or beast that has a challenge rating no higher than its own, or back into its true form. It reverts to its true form if it dies. Any equipment it is wearing or carrying is absorbed or borne by the new form (the dragon's choice). In a new form, the dragon retains its alignment, hit points, Hit Dice, ability to speak, proficiencies, Legendary Resistance, lair actions, and Intelligence, Wisdom, and Charisma scores, as well as this action. Its statistics and capabilities are otherwise replaced by those of the new form, except any class features or legendary actions of that form.",
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
        name: 'Wing Attack (Costs 2 Actions)',
        cost: 1,
        description:
          'The dragon beats its wings. Each creature within 15 ft. of the dragon must succeed on a DC 24 Dexterity saving throw or take 16 (2d6 + 9) bludgeoning damage and be knocked prone. The dragon can then fly up to half its flying speed.',
      },
    ],
  },
  {
    id: 'ancient-copper-dragon',
    name: 'Ancient Copper Dragon',
    system: 'dnd-5e-2014',
    source: 'SRD',
    size: 'gargantuan',
    type: 'dragon',
    alignment: 'chaotic good',
    challengeRating: 21,
    experiencePoints: 33000,
    armorClass: 21,
    hitPoints: {
      count: 20,
      die: 'd20',
      modifier: 140,
      notation: '20d20+140',
    },
    speed: {
      walk: 40,
      fly: 80,
      climb: 40,
    },
    abilities: {
      str: 27,
      dex: 12,
      con: 25,
      int: 20,
      wis: 17,
      cha: 19,
    },
    savingThrows: {
      dex: 8,
      con: 14,
      wis: 10,
      cha: 11,
    },
    skills: {
      Deception: 11,
      Perception: 17,
      Stealth: 8,
    },
    damageImmunities: ['acid'],
    senses: ['blindsight 60 ft.', 'darkvision 120 ft.', 'passive Perception 27'],
    languages: ['Common', 'Draconic'],
    specialAbilities: [
      {
        name: 'Legendary Resistance',
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
        description:
          'Melee Weapon Attack: +15 to hit, reach 15 ft., one target. Hit: 19 (2d10 + 8) piercing damage.',
        attackBonus: 15,
        damage: [
          {
            dice: {
              count: 2,
              die: 'd10',
              modifier: 8,
              notation: '2d10+8',
            },
            type: 'piercing',
          },
        ],
      },
      {
        name: 'Claw',
        description:
          'Melee Weapon Attack: +15 to hit, reach 10 ft., one target. Hit: 15 (2d6 + 8) slashing damage.',
        attackBonus: 15,
        damage: [
          {
            dice: {
              count: 2,
              die: 'd6',
              modifier: 8,
              notation: '2d6+8',
            },
            type: 'slashing',
          },
        ],
      },
      {
        name: 'Tail',
        description:
          'Melee Weapon Attack: +15 to hit, reach 20 ft., one target. Hit: 17 (2d8 + 8) bludgeoning damage.',
        attackBonus: 15,
        damage: [
          {
            dice: {
              count: 2,
              die: 'd8',
              modifier: 8,
              notation: '2d8+8',
            },
            type: 'bludgeoning',
          },
        ],
      },
      {
        name: 'Frightful Presence',
        description:
          "Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 19 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature's saving throw is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours.",
        savingThrow: {
          attribute: 'wis',
          dc: 19,
          effect: 'see description',
        },
      },
      {
        name: 'Breath Weapons',
        description:
          "The dragon uses one of the following breath weapons. Acid Breath. The dragon exhales acid in an 90-foot line that is 10 feet wide. Each creature in that line must make a DC 22 Dexterity saving throw, taking 63 (14d8) acid damage on a failed save, or half as much damage on a successful one. Slowing Breath. The dragon exhales gas in a 90-foot cone. Each creature in that area must succeed on a DC 22 Constitution saving throw. On a failed save, the creature can't use reactions, its speed is halved, and it can't make more than one attack on its turn. In addition, the creature can use either an action or a bonus action on its turn, but not both. These effects last for 1 minute. The creature can repeat the saving throw at the end of each of its turns, ending the effect on itself with a successful save.",
        recharge: '5-6',
        savingThrow: {
          attribute: 'dex',
          dc: 22,
          effect: 'half damage on a successful save',
        },
        damage: [
          {
            dice: {
              count: 14,
              die: 'd8',
              modifier: 0,
              notation: '14d8',
            },
            type: 'acid',
          },
        ],
      },
      {
        name: 'Change Shape',
        description:
          "The dragon magically polymorphs into a humanoid or beast that has a challenge rating no higher than its own, or back into its true form. It reverts to its true form if it dies. Any equipment it is wearing or carrying is absorbed or borne by the new form (the dragon's choice). In a new form, the dragon retains its alignment, hit points, Hit Dice, ability to speak, proficiencies, Legendary Resistance, lair actions, and Intelligence, Wisdom, and Charisma scores, as well as this action. Its statistics and capabilities are otherwise replaced by those of the new form, except any class features or legendary actions of that form.",
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
        name: 'Wing Attack (Costs 2 Actions)',
        cost: 1,
        description:
          'The dragon beats its wings. Each creature within 15 ft. of the dragon must succeed on a DC 23 Dexterity saving throw or take 15 (2d6 + 8) bludgeoning damage and be knocked prone. The dragon can then fly up to half its flying speed.',
      },
    ],
  },
  {
    id: 'ancient-gold-dragon',
    name: 'Ancient Gold Dragon',
    system: 'dnd-5e-2014',
    source: 'SRD',
    size: 'gargantuan',
    type: 'dragon',
    alignment: 'lawful good',
    challengeRating: 24,
    experiencePoints: 62000,
    armorClass: 22,
    hitPoints: {
      count: 28,
      die: 'd20',
      modifier: 252,
      notation: '28d20+252',
    },
    speed: {
      walk: 40,
      fly: 80,
      swim: 40,
    },
    abilities: {
      str: 30,
      dex: 14,
      con: 29,
      int: 18,
      wis: 17,
      cha: 28,
    },
    savingThrows: {
      dex: 9,
      con: 16,
      wis: 10,
      cha: 16,
    },
    skills: {
      Insight: 10,
      Perception: 17,
      Persuasion: 16,
      Stealth: 9,
    },
    damageImmunities: ['fire'],
    senses: ['blindsight 60 ft.', 'darkvision 120 ft.', 'passive Perception 27'],
    languages: ['Common', 'Draconic'],
    specialAbilities: [
      {
        name: 'Amphibious',
        description: 'The dragon can breathe air and water.',
      },
      {
        name: 'Legendary Resistance',
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
        description:
          'Melee Weapon Attack: +17 to hit, reach 15 ft., one target. Hit: 21 (2d10 + 10) piercing damage.',
        attackBonus: 17,
        damage: [
          {
            dice: {
              count: 2,
              die: 'd10',
              modifier: 10,
              notation: '2d10+10',
            },
            type: 'piercing',
          },
        ],
      },
      {
        name: 'Claw',
        description:
          'Melee Weapon Attack: +17 to hit, reach 10 ft., one target. Hit: 17 (2d6 + 10) slashing damage.',
        attackBonus: 17,
        damage: [
          {
            dice: {
              count: 2,
              die: 'd6',
              modifier: 10,
              notation: '2d6+10',
            },
            type: 'slashing',
          },
        ],
      },
      {
        name: 'Tail',
        description:
          'Melee Weapon Attack: +17 to hit, reach 20 ft., one target. Hit: 19 (2d8 + 10) bludgeoning damage.',
        attackBonus: 17,
        damage: [
          {
            dice: {
              count: 2,
              die: 'd8',
              modifier: 10,
              notation: '2d8+10',
            },
            type: 'bludgeoning',
          },
        ],
      },
      {
        name: 'Frightful Presence',
        description:
          "Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 24 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature's saving throw is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours.",
        savingThrow: {
          attribute: 'wis',
          dc: 24,
          effect: 'see description',
        },
      },
      {
        name: 'Breath Weapons',
        description:
          'The dragon uses one of the following breath weapons. Fire Breath. The dragon exhales fire in a 90-foot cone. Each creature in that area must make a DC 24 Dexterity saving throw, taking 71 (13d10) fire damage on a failed save, or half as much damage on a successful one. Weakening Breath. The dragon exhales gas in a 90-foot cone. Each creature in that area must succeed on a DC 24 Strength saving throw or have disadvantage on Strength-based attack rolls, Strength checks, and Strength saving throws for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success.',
        recharge: '5-6',
        savingThrow: {
          attribute: 'dex',
          dc: 24,
          effect: 'half damage on a successful save',
        },
        damage: [
          {
            dice: {
              count: 13,
              die: 'd10',
              modifier: 0,
              notation: '13d10',
            },
            type: 'fire',
          },
        ],
      },
      {
        name: 'Change Shape',
        description:
          "The dragon magically polymorphs into a humanoid or beast that has a challenge rating no higher than its own, or back into its true form. It reverts to its true form if it dies. Any equipment it is wearing or carrying is absorbed or borne by the new form (the dragon's choice). In a new form, the dragon retains its alignment, hit points, Hit Dice, ability to speak, proficiencies, Legendary Resistance, lair actions, and Intelligence, Wisdom, and Charisma scores, as well as this action. Its statistics and capabilities are otherwise replaced by those of the new form, except any class features or legendary actions of that form.",
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
        name: 'Wing Attack (Costs 2 Actions)',
        cost: 1,
        description:
          'The dragon beats its wings. Each creature within 15 ft. of the dragon must succeed on a DC 25 Dexterity saving throw or take 17 (2d6 + 10) bludgeoning damage and be knocked prone. The dragon can then fly up to half its flying speed.',
      },
    ],
  },
  {
    id: 'ancient-green-dragon',
    name: 'Ancient Green Dragon',
    system: 'dnd-5e-2014',
    source: 'SRD',
    size: 'gargantuan',
    type: 'dragon',
    alignment: 'lawful evil',
    challengeRating: 22,
    experiencePoints: 41000,
    armorClass: 21,
    hitPoints: {
      count: 22,
      die: 'd20',
      modifier: 154,
      notation: '22d20+154',
    },
    speed: {
      walk: 40,
      fly: 80,
      swim: 40,
    },
    abilities: {
      str: 27,
      dex: 12,
      con: 25,
      int: 20,
      wis: 17,
      cha: 19,
    },
    savingThrows: {
      dex: 8,
      con: 14,
      wis: 10,
      cha: 11,
    },
    skills: {
      Deception: 11,
      Insight: 10,
      Perception: 17,
      Persuasion: 11,
      Stealth: 8,
    },
    damageImmunities: ['poison'],
    conditionImmunities: ['Poisoned'],
    senses: ['blindsight 60 ft.', 'darkvision 120 ft.', 'passive Perception 27'],
    languages: ['Common', 'Draconic'],
    specialAbilities: [
      {
        name: 'Amphibious',
        description: 'The dragon can breathe air and water.',
      },
      {
        name: 'Legendary Resistance',
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
        description:
          'Melee Weapon Attack: +15 to hit, reach 15 ft., one target. Hit: 19 (2d10 + 8) piercing damage plus 10 (3d6) poison damage.',
        attackBonus: 15,
        damage: [
          {
            dice: {
              count: 2,
              die: 'd10',
              modifier: 8,
              notation: '2d10+8',
            },
            type: 'piercing',
          },
          {
            dice: {
              count: 3,
              die: 'd6',
              modifier: 0,
              notation: '3d6',
            },
            type: 'poison',
          },
        ],
      },
      {
        name: 'Claw',
        description:
          'Melee Weapon Attack: +15 to hit, reach 10 ft., one target. Hit: 22 (4d6 + 8) slashing damage.',
        attackBonus: 15,
        damage: [
          {
            dice: {
              count: 4,
              die: 'd6',
              modifier: 8,
              notation: '4d6+8',
            },
            type: 'slashing',
          },
        ],
      },
      {
        name: 'Tail',
        description:
          'Melee Weapon Attack: +15 to hit, reach 20 ft., one target. Hit: 17 (2d8 + 8) bludgeoning damage.',
        attackBonus: 15,
        damage: [
          {
            dice: {
              count: 2,
              die: 'd8',
              modifier: 8,
              notation: '2d8+8',
            },
            type: 'bludgeoning',
          },
        ],
      },
      {
        name: 'Frightful Presence',
        description:
          "Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 19 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature's saving throw is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours.",
        savingThrow: {
          attribute: 'wis',
          dc: 19,
          effect: 'see description',
        },
      },
      {
        name: 'Poison Breath',
        description:
          'The dragon exhales poisonous gas in a 90-foot cone. Each creature in that area must make a DC 22 Constitution saving throw, taking 77 (22d6) poison damage on a failed save, or half as much damage on a successful one.',
        damage: [
          {
            dice: {
              count: 22,
              die: 'd6',
              modifier: 0,
              notation: '22d6',
            },
            type: 'poison',
          },
        ],
        savingThrow: {
          attribute: 'con',
          dc: 22,
          effect: 'half damage on a successful save',
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
        name: 'Wing Attack (Costs 2 Actions)',
        cost: 1,
        description:
          'The dragon beats its wings. Each creature within 15 ft. of the dragon must succeed on a DC 23 Dexterity saving throw or take 15 (2d6 + 8) bludgeoning damage and be knocked prone. The dragon can then fly up to half its flying speed.',
      },
    ],
  },
  {
    id: 'ancient-silver-dragon',
    name: 'Ancient Silver Dragon',
    system: 'dnd-5e-2014',
    source: 'SRD',
    size: 'gargantuan',
    type: 'dragon',
    alignment: 'lawful good',
    challengeRating: 23,
    experiencePoints: 50000,
    armorClass: 22,
    hitPoints: {
      count: 25,
      die: 'd20',
      modifier: 225,
      notation: '25d20+225',
    },
    speed: {
      walk: 40,
      fly: 80,
    },
    abilities: {
      str: 30,
      dex: 10,
      con: 29,
      int: 18,
      wis: 15,
      cha: 23,
    },
    savingThrows: {
      dex: 7,
      con: 16,
      wis: 9,
      cha: 13,
    },
    skills: {
      Arcana: 11,
      History: 11,
      Perception: 16,
      Stealth: 7,
    },
    damageImmunities: ['cold'],
    senses: ['blindsight 60 ft.', 'darkvision 120 ft.', 'passive Perception 26'],
    languages: ['Common', 'Draconic'],
    specialAbilities: [
      {
        name: 'Legendary Resistance',
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
        description:
          'Melee Weapon Attack: +17 to hit, reach 15 ft., one target. Hit: 21 (2d10 + 10) piercing damage.',
        attackBonus: 17,
        damage: [
          {
            dice: {
              count: 2,
              die: 'd10',
              modifier: 10,
              notation: '2d10+10',
            },
            type: 'piercing',
          },
        ],
      },
      {
        name: 'Claw',
        description:
          'Melee Weapon Attack: +17 to hit, reach 10 ft., one target. Hit: 17 (2d6 + 10) slashing damage.',
        attackBonus: 17,
        damage: [
          {
            dice: {
              count: 2,
              die: 'd6',
              modifier: 10,
              notation: '2d6+10',
            },
            type: 'slashing',
          },
        ],
      },
      {
        name: 'Tail',
        description:
          'Melee Weapon Attack: +17 to hit, reach 20 ft., one target. Hit: 19 (2d8 + 10) bludgeoning damage.',
        attackBonus: 17,
        damage: [
          {
            dice: {
              count: 2,
              die: 'd8',
              modifier: 10,
              notation: '2d8+10',
            },
            type: 'bludgeoning',
          },
        ],
      },
      {
        name: 'Frightful Presence',
        description:
          "Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 21 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature's saving throw is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours.",
        savingThrow: {
          attribute: 'wis',
          dc: 21,
          effect: 'see description',
        },
      },
      {
        name: 'Breath Weapons',
        description:
          'The dragon uses one of the following breath weapons. Cold Breath. The dragon exhales an icy blast in a 90-foot cone. Each creature in that area must make a DC 24 Constitution saving throw, taking 67 (15d8) cold damage on a failed save, or half as much damage on a successful one. Paralyzing Breath. The dragon exhales paralyzing gas in a 90-foot cone. Each creature in that area must succeed on a DC 24 Constitution saving throw or be paralyzed for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success.',
        recharge: '5-6',
        savingThrow: {
          attribute: 'con',
          dc: 24,
          effect: 'half damage on a successful save',
        },
        damage: [
          {
            dice: {
              count: 15,
              die: 'd8',
              modifier: 0,
              notation: '15d8',
            },
            type: 'cold',
          },
        ],
      },
      {
        name: 'Change Shape',
        description:
          "The dragon magically polymorphs into a humanoid or beast that has a challenge rating no higher than its own, or back into its true form. It reverts to its true form if it dies. Any equipment it is wearing or carrying is absorbed or borne by the new form (the dragon's choice). In a new form, the dragon retains its alignment, hit points, Hit Dice, ability to speak, proficiencies, Legendary Resistance, lair actions, and Intelligence, Wisdom, and Charisma scores, as well as this action. Its statistics and capabilities are otherwise replaced by those of the new form, except any class features or legendary actions of that form.",
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
        name: 'Wing Attack (Costs 2 Actions)',
        cost: 1,
        description:
          'The dragon beats its wings. Each creature within 15 ft. of the dragon must succeed on a DC 25 Dexterity saving throw or take 17 (2d6 + 10) bludgeoning damage and be knocked prone. The dragon can then fly up to half its flying speed.',
      },
    ],
  },
  {
    id: 'ancient-white-dragon',
    name: 'Ancient White Dragon',
    system: 'dnd-5e-2014',
    source: 'SRD',
    size: 'gargantuan',
    type: 'dragon',
    alignment: 'chaotic evil',
    challengeRating: 20,
    experiencePoints: 25000,
    armorClass: 20,
    hitPoints: {
      count: 18,
      die: 'd20',
      modifier: 144,
      notation: '18d20+144',
    },
    speed: {
      walk: 40,
      fly: 80,
      swim: 40,
      burrow: 40,
    },
    abilities: {
      str: 26,
      dex: 10,
      con: 26,
      int: 10,
      wis: 13,
      cha: 14,
    },
    savingThrows: {
      dex: 6,
      con: 14,
      wis: 7,
      cha: 8,
    },
    skills: {
      Perception: 13,
      Stealth: 6,
    },
    damageImmunities: ['cold'],
    senses: ['blindsight 60 ft.', 'darkvision 120 ft.', 'passive Perception 23'],
    languages: ['Common', 'Draconic'],
    specialAbilities: [
      {
        name: 'Ice Walk',
        description:
          "The dragon can move across and climb icy surfaces without needing to make an ability check. Additionally, difficult terrain composed of ice or snow doesn't cost it extra movement.",
      },
      {
        name: 'Legendary Resistance',
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
        description:
          'Melee Weapon Attack: +14 to hit, reach 15 ft., one target. Hit: 19 (2d10 + 8) piercing damage plus 9 (2d8) cold damage.',
        attackBonus: 14,
        damage: [
          {
            dice: {
              count: 2,
              die: 'd10',
              modifier: 8,
              notation: '2d10+8',
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
            type: 'cold',
          },
        ],
      },
      {
        name: 'Claw',
        description:
          'Melee Weapon Attack: +14 to hit, reach 10 ft., one target. Hit: 15 (2d6 + 8) slashing damage.',
        attackBonus: 14,
        damage: [
          {
            dice: {
              count: 2,
              die: 'd6',
              modifier: 8,
              notation: '2d6+8',
            },
            type: 'slashing',
          },
        ],
      },
      {
        name: 'Tail',
        description:
          'Melee Weapon Attack: +14 to hit, reach 20 ft., one target. Hit: 17 (2d8 + 8) bludgeoning damage.',
        attackBonus: 14,
        damage: [
          {
            dice: {
              count: 2,
              die: 'd8',
              modifier: 8,
              notation: '2d8+8',
            },
            type: 'bludgeoning',
          },
        ],
      },
      {
        name: 'Frightful Presence',
        description:
          "Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 16 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature's saving throw is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours .",
        savingThrow: {
          attribute: 'wis',
          dc: 16,
          effect: 'see description',
        },
      },
      {
        name: 'Cold Breath',
        description:
          'The dragon exhales an icy blast in a 90-foot cone. Each creature in that area must make a DC 22 Constitution saving throw, taking 72 (16d8) cold damage on a failed save, or half as much damage on a successful one.',
        damage: [
          {
            dice: {
              count: 16,
              die: 'd8',
              modifier: 0,
              notation: '16d8',
            },
            type: 'cold',
          },
        ],
        savingThrow: {
          attribute: 'con',
          dc: 22,
          effect: 'see description',
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
        name: 'Wing Attack (Costs 2 Actions)',
        cost: 1,
        description:
          'The dragon beats its wings. Each creature within 15 ft. of the dragon must succeed on a DC 22 Dexterity saving throw or take 15 (2d6 + 8) bludgeoning damage and be knocked prone. The dragon can then fly up to half its flying speed.',
      },
    ],
  },
  {
    id: 'androsphinx',
    name: 'Androsphinx',
    system: 'dnd-5e-2014',
    source: 'SRD',
    size: 'large',
    type: 'monstrosity',
    alignment: 'lawful neutral',
    challengeRating: 17,
    experiencePoints: 18000,
    armorClass: 17,
    hitPoints: {
      count: 19,
      die: 'd10',
      modifier: 95,
      notation: '19d10+95',
    },
    speed: {
      walk: 40,
      fly: 60,
    },
    abilities: {
      str: 22,
      dex: 10,
      con: 20,
      int: 16,
      wis: 18,
      cha: 23,
    },
    savingThrows: {
      dex: 6,
      con: 11,
      int: 9,
      wis: 10,
    },
    skills: {
      Arcana: 9,
      Perception: 10,
      Religion: 15,
    },
    damageImmunities: ['psychic', 'bludgeoning, piercing, and slashing from nonmagical weapons'],
    conditionImmunities: ['Charmed', 'Frightened'],
    senses: ['truesight 120 ft.', 'passive Perception 20'],
    languages: ['Common', 'Sphinx'],
    specialAbilities: [
      {
        name: 'Inscrutable',
        description:
          "The sphinx is immune to any effect that would sense its emotions or read its thoughts, as well as any divination spell that it refuses. Wisdom (Insight) checks made to ascertain the sphinx's intentions or sincerity have disadvantage.",
      },
      {
        name: 'Magic Weapons',
        description: "The sphinx's weapon attacks are magical.",
      },
      {
        name: 'Spellcasting',
        description:
          "The sphinx is a 12th-level spellcaster. Its spellcasting ability is Wisdom (spell save DC 18, +10 to hit with spell attacks). It requires no material components to cast its spells. The sphinx has the following cleric spells prepared: - Cantrips (at will): sacred flame, spare the dying, thaumaturgy - 1st level (4 slots): command, detect evil and good, detect magic - 2nd level (3 slots): lesser restoration, zone of truth - 3rd level (3 slots): dispel magic, tongues - 4th level (3 slots): banishment, freedom of movement - 5th level (2 slots): flame strike, greater restoration - 6th level (1 slot): heroes' feast",
      },
    ],
    actions: [
      {
        name: 'Multiattack',
        description: 'The sphinx makes two claw attacks.',
      },
      {
        name: 'Claw',
        description:
          'Melee Weapon Attack: +12 to hit, reach 5 ft., one target. Hit: 17 (2d10 + 6) slashing damage.',
        attackBonus: 12,
        damage: [
          {
            dice: {
              count: 2,
              die: 'd10',
              modifier: 6,
              notation: '2d10+6',
            },
            type: 'slashing',
          },
        ],
      },
      {
        name: 'Roar',
        description:
          "The sphinx emits a magical roar. Each time it roars before finishing a long rest, the roar is louder and the effect is different, as detailed below. Each creature within 500 feet of the sphinx and able to hear the roar must make a saving throw. First Roar. Each creature that fails a DC 18 Wisdom saving throw is frightened for 1 minute. A frightened creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. Second Roar. Each creature that fails a DC 18 Wisdom saving throw is deafened and frightened for 1 minute. A frightened creature is paralyzed and can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. Third Roar. Each creature makes a DC 18 Constitution saving throw. On a failed save, a creature takes 44 (8d10) thunder damage and is knocked prone. On a successful save, the creature takes half as much damage and isn't knocked prone.",
        savingThrow: {
          attribute: 'wis',
          dc: 18,
          effect: 'half damage on a successful save',
        },
        damage: [
          {
            dice: {
              count: 8,
              die: 'd10',
              modifier: 0,
              notation: '8d10',
            },
            type: 'thunder',
          },
        ],
      },
    ],
    legendaryActions: [
      {
        name: 'Claw Attack',
        cost: 1,
        description: 'The sphinx makes one claw attack.',
      },
      {
        name: 'Teleport (Costs 2 Actions)',
        cost: 1,
        description:
          'The sphinx magically teleports, along with any equipment it is wearing or carrying, up to 120 feet to an unoccupied space it can see.',
      },
      {
        name: 'Cast a Spell (Costs 3 Actions)',
        cost: 1,
        description:
          'The sphinx casts a spell from its list of prepared spells, using a spell slot as normal.',
      },
    ],
  },
  {
    id: 'archmage',
    name: 'Archmage',
    system: 'dnd-5e-2014',
    source: 'SRD',
    size: 'medium',
    type: 'humanoid',
    alignment: 'unaligned',
    challengeRating: 12,
    experiencePoints: 8400,
    armorClass: 12,
    hitPoints: {
      count: 18,
      die: 'd8',
      modifier: 18,
      notation: '18d8+18',
    },
    speed: {
      walk: 30,
    },
    abilities: {
      str: 10,
      dex: 14,
      con: 12,
      int: 20,
      wis: 15,
      cha: 16,
    },
    savingThrows: {
      int: 9,
      wis: 6,
    },
    skills: {
      Arcana: 13,
      History: 13,
    },
    damageResistances: [
      'damage from spells',
      'bludgeoning, piercing, and slashing from nonmagical attacks (from stoneskin)',
    ],
    senses: ['passive Perception 12'],
    languages: ['any six languages'],
    specialAbilities: [
      {
        name: 'Magic Resistance',
        description:
          'The archmage has advantage on saving throws against spells and other magical effects.',
      },
      {
        name: 'Spellcasting',
        description:
          'The archmage is an 18th-level spellcaster. Its spellcasting ability is Intelligence (spell save DC 17, +9 to hit with spell attacks). The archmage can cast disguise self and invisibility at will and has the following wizard spells prepared: - Cantrips (at will): fire bolt, light, mage hand, prestidigitation, shocking grasp - 1st level (4 slots): detect magic, identify, mage armor*, magic missile - 2nd level (3 slots): detect thoughts, mirror image, misty step - 3rd level (3 slots): counterspell, fly, lightning bolt - 4th level (3 slots): banishment, fire shield, stoneskin* - 5th level (3 slots): cone of cold, scrying, wall of force - 6th level (1 slot): globe of invulnerability - 7th level (1 slot): teleport - 8th level (1 slot): mind blank* - 9th level (1 slot): time stop * The archmage casts these spells on itself before combat.',
      },
    ],
    actions: [
      {
        name: 'Dagger',
        description:
          'Melee or Ranged Weapon Attack: +6 to hit, reach 5 ft. or range 20/60 ft., one target. Hit: 4 (1d4 + 2) piercing damage.',
        attackBonus: 6,
        damage: [
          {
            dice: {
              count: 1,
              die: 'd4',
              modifier: 2,
              notation: '1d4+2',
            },
            type: 'piercing',
          },
        ],
      },
    ],
  },
  {
    id: 'behir',
    name: 'Behir',
    system: 'dnd-5e-2014',
    source: 'SRD',
    size: 'huge',
    type: 'monstrosity',
    alignment: 'neutral evil',
    challengeRating: 11,
    experiencePoints: 7200,
    armorClass: 17,
    hitPoints: {
      count: 16,
      die: 'd12',
      modifier: 64,
      notation: '16d12+64',
    },
    speed: {
      walk: 50,
      climb: 40,
    },
    abilities: {
      str: 23,
      dex: 16,
      con: 18,
      int: 7,
      wis: 14,
      cha: 12,
    },
    skills: {
      Perception: 6,
      Stealth: 7,
    },
    damageImmunities: ['lightning'],
    senses: ['darkvision 90 ft.', 'passive Perception 16'],
    languages: ['Draconic'],
    actions: [
      {
        name: 'Multiattack',
        description: 'The behir makes two attacks: one with its bite and one to constrict.',
      },
      {
        name: 'Bite',
        description:
          'Melee Weapon Attack: +10 to hit, reach 10 ft., one target. Hit: 22 (3d10 + 6) piercing damage.',
        attackBonus: 10,
        damage: [
          {
            dice: {
              count: 3,
              die: 'd10',
              modifier: 6,
              notation: '3d10+6',
            },
            type: 'piercing',
          },
        ],
      },
      {
        name: 'Constrict',
        description:
          "Melee Weapon Attack: +10 to hit, reach 5 ft., one Large or smaller creature. Hit: 17 (2d10 + 6) bludgeoning damage plus 17 (2d10 + 6) slashing damage. The target is grappled (escape DC 16) if the behir isn't already constricting a creature, and the target is restrained until this grapple ends.",
        attackBonus: 10,
        damage: [
          {
            dice: {
              count: 2,
              die: 'd10',
              modifier: 6,
              notation: '2d10+6',
            },
            type: 'bludgeoning',
          },
          {
            dice: {
              count: 2,
              die: 'd10',
              modifier: 6,
              notation: '2d10+6',
            },
            type: 'slashing',
          },
        ],
      },
      {
        name: 'Lightning Breath',
        description:
          'The behir exhales a line of lightning that is 20 ft. long and 5 ft. wide. Each creature in that line must make a DC 16 Dexterity saving throw, taking 66 (12d10) lightning damage on a failed save, or half as much damage on a successful one.',
        damage: [
          {
            dice: {
              count: 12,
              die: 'd10',
              modifier: 0,
              notation: '12d10',
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
      {
        name: 'Swallow',
        description:
          "The behir makes one bite attack against a Medium or smaller target it is grappling. If the attack hits, the target is also swallowed, and the grapple ends. While swallowed, the target is blinded and restrained, it has total cover against attacks and other effects outside the behir, and it takes 21 (6d6) acid damage at the start of each of the behir's turns. A behir can have only one creature swallowed at a time. If the behir takes 30 damage or more on a single turn from the swallowed creature, the behir must succeed on a DC 14 Constitution saving throw at the end of that turn or regurgitate the creature, which falls prone in a space within 10 ft. of the behir. If the behir dies, a swallowed creature is no longer restrained by it and can escape from the corpse by using 15 ft. of movement, exiting prone.",
        damage: [
          {
            dice: {
              count: 6,
              die: 'd6',
              modifier: 0,
              notation: '6d6',
            },
            type: 'acid',
          },
        ],
        savingThrow: {
          attribute: 'con',
          dc: 14,
          effect: 'see description',
        },
      },
    ],
  },
  {
    id: 'djinni',
    name: 'Djinni',
    system: 'dnd-5e-2014',
    source: 'SRD',
    size: 'large',
    type: 'elemental',
    alignment: 'chaotic good',
    challengeRating: 11,
    experiencePoints: 7200,
    armorClass: 17,
    hitPoints: {
      count: 14,
      die: 'd10',
      modifier: 84,
      notation: '14d10+84',
    },
    speed: {
      walk: 30,
      fly: 90,
    },
    abilities: {
      str: 21,
      dex: 15,
      con: 22,
      int: 15,
      wis: 16,
      cha: 20,
    },
    savingThrows: {
      dex: 6,
      wis: 7,
      cha: 9,
    },
    damageImmunities: ['lightning', 'thunder'],
    senses: ['darkvision 120 ft.', 'passive Perception 13'],
    languages: ['Auran'],
    specialAbilities: [
      {
        name: 'Elemental Demise',
        description:
          'If the djinni dies, its body disintegrates into a warm breeze, leaving behind only equipment the djinni was wearing or carrying.',
      },
      {
        name: 'Innate Spellcasting',
        description:
          "The djinni's innate spellcasting ability is Charisma (spell save DC 17, +9 to hit with spell attacks). It can innately cast the following spells, requiring no material components: At will: detect evil and good, detect magic, thunderwave 3/day each: create food and water (can create wine instead of water), tongues, wind walk 1/day each: conjure elemental (air elemental only), creation, gaseous form, invisibility, major image, plane shift",
      },
    ],
    actions: [
      {
        name: 'Multiattack',
        description: 'The djinni makes three scimitar attacks.',
      },
      {
        name: 'Scimitar',
        description:
          "Melee Weapon Attack: +9 to hit, reach 5 ft., one target. Hit: 12 (2d6 + 5) slashing damage plus 3 (1d6) lightning or thunder damage (djinni's choice).",
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
        name: 'Create Whirlwind',
        description:
          'A 5-foot-radius, 30-foot-tall cylinder of swirling air magically forms on a point the djinni can see within 120 feet of it. The whirlwind lasts as long as the djinni maintains concentration (as if concentrating on a spell). Any creature but the djinni that enters the whirlwind must succeed on a DC 18 Strength saving throw or be restrained by it. The djinni can move the whirlwind up to 60 feet as an action, and creatures restrained by the whirlwind move with it. The whirlwind ends if the djinni loses sight of it. A creature can use its action to free a creature restrained by the whirlwind, including itself, by succeeding on a DC 18 Strength check. If the check succeeds, the creature is no longer restrained and moves to the nearest space outside the whirlwind.',
        savingThrow: {
          attribute: 'str',
          dc: 18,
          effect: 'see description',
        },
      },
    ],
  },
  {
    id: 'dragon-turtle',
    name: 'Dragon Turtle',
    system: 'dnd-5e-2014',
    source: 'SRD',
    size: 'gargantuan',
    type: 'dragon',
    alignment: 'true neutral',
    challengeRating: 17,
    experiencePoints: 18000,
    armorClass: 20,
    hitPoints: {
      count: 22,
      die: 'd20',
      modifier: 110,
      notation: '22d20+110',
    },
    speed: {
      walk: 20,
      swim: 40,
    },
    abilities: {
      str: 25,
      dex: 10,
      con: 20,
      int: 10,
      wis: 12,
      cha: 12,
    },
    savingThrows: {
      dex: 6,
      con: 11,
      wis: 7,
    },
    damageResistances: ['fire'],
    senses: ['darkvision 120 ft.', 'passive Perception 11'],
    languages: ['Aquan', 'Draconic'],
    specialAbilities: [
      {
        name: 'Amphibious',
        description: 'The dragon turtle can breathe air and water.',
      },
    ],
    actions: [
      {
        name: 'Multiattack',
        description:
          'The dragon turtle makes three attacks: one with its bite and two with its claws. It can make one tail attack in place of its two claw attacks.',
      },
      {
        name: 'Bite',
        description:
          'Melee Weapon Attack: +13 to hit, reach 15 ft., one target. Hit: 26 (3d12 + 7) piercing damage.',
        attackBonus: 13,
        damage: [
          {
            dice: {
              count: 3,
              die: 'd12',
              modifier: 7,
              notation: '3d12+7',
            },
            type: 'piercing',
          },
        ],
      },
      {
        name: 'Claw',
        description:
          'Melee Weapon Attack: +13 to hit, reach 10 ft., one target. Hit: 16 (2d8 + 7) slashing damage.',
        attackBonus: 13,
        damage: [
          {
            dice: {
              count: 2,
              die: 'd8',
              modifier: 7,
              notation: '2d8+7',
            },
            type: 'slashing',
          },
        ],
      },
      {
        name: 'Tail',
        description:
          'Melee Weapon Attack: +13 to hit, reach 15 ft., one target. Hit: 26 (3d12 + 7) bludgeoning damage. If the target is a creature, it must succeed on a DC 20 Strength saving throw or be pushed up to 10 feet away from the dragon turtle and knocked prone.',
        attackBonus: 13,
        damage: [
          {
            dice: {
              count: 3,
              die: 'd12',
              modifier: 7,
              notation: '3d12+7',
            },
            type: 'bludgeoning',
          },
        ],
      },
      {
        name: 'Steam Breath',
        description:
          "The dragon turtle exhales scalding steam in a 60-foot cone. Each creature in that area must make a DC 18 Constitution saving throw, taking 52 (15d6) fire damage on a failed save, or half as much damage on a successful one. Being underwater doesn't grant resistance against this damage.",
        damage: [
          {
            dice: {
              count: 15,
              die: 'd6',
              modifier: 0,
              notation: '15d6',
            },
            type: 'fire',
          },
        ],
        savingThrow: {
          attribute: 'con',
          dc: 18,
          effect: 'half damage on a successful save',
        },
        recharge: '5-6',
      },
    ],
  },
  {
    id: 'efreeti',
    name: 'Efreeti',
    system: 'dnd-5e-2014',
    source: 'SRD',
    size: 'large',
    type: 'elemental',
    alignment: 'lawful evil',
    challengeRating: 11,
    experiencePoints: 7200,
    armorClass: 17,
    hitPoints: {
      count: 16,
      die: 'd10',
      modifier: 112,
      notation: '16d10+112',
    },
    speed: {
      walk: 40,
      fly: 60,
    },
    abilities: {
      str: 22,
      dex: 12,
      con: 24,
      int: 16,
      wis: 15,
      cha: 16,
    },
    savingThrows: {
      int: 7,
      wis: 6,
      cha: 7,
    },
    damageImmunities: ['fire'],
    senses: ['darkvision 120 ft.', 'passive Perception 12'],
    languages: ['Ignan'],
    specialAbilities: [
      {
        name: 'Elemental Demise',
        description:
          'If the efreeti dies, its body disintegrates in a flash of fire and puff of smoke, leaving behind only equipment the djinni was wearing or carrying.',
      },
      {
        name: 'Innate Spellcasting',
        description:
          "The efreeti's innate spell casting ability is Charisma (spell save DC 15, +7 to hit with spell attacks). It can innately cast the following spells, requiring no material components: At will: detect magic 3/day: enlarge/reduce, tongues 1/day each: conjure elemental (fire elemental only), gaseous form, invisibility, major image, plane shift, wall of fire",
      },
    ],
    actions: [
      {
        name: 'Multiattack',
        description: 'The efreeti makes two scimitar attacks or uses its Hurl Flame twice.',
      },
      {
        name: 'Scimitar',
        description:
          'Melee Weapon Attack: +10 to hit, reach 5 ft., one target. Hit: 13 (2d6 + 6) slashing damage plus 7 (2d6) fire damage.',
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
          {
            dice: {
              count: 2,
              die: 'd6',
              modifier: 0,
              notation: '2d6',
            },
            type: 'fire',
          },
        ],
      },
      {
        name: 'Hurl Flame',
        description:
          'Ranged Spell Attack: +7 to hit, range 120 ft., one target. Hit: 17 (5d6) fire damage.',
        attackBonus: 7,
        damage: [
          {
            dice: {
              count: 5,
              die: 'd6',
              modifier: 0,
              notation: '5d6',
            },
            type: 'fire',
          },
        ],
      },
    ],
  },
  {
    id: 'erinyes',
    name: 'Erinyes',
    system: 'dnd-5e-2014',
    source: 'SRD',
    size: 'medium',
    type: 'fiend',
    alignment: 'lawful evil',
    challengeRating: 12,
    experiencePoints: 8400,
    armorClass: 18,
    hitPoints: {
      count: 18,
      die: 'd8',
      modifier: 72,
      notation: '18d8+72',
    },
    speed: {
      walk: 30,
      fly: 60,
    },
    abilities: {
      str: 18,
      dex: 16,
      con: 18,
      int: 14,
      wis: 14,
      cha: 18,
    },
    savingThrows: {
      dex: 7,
      con: 8,
      wis: 6,
      cha: 8,
    },
    damageResistances: [
      'cold',
      "bludgeoning, piercing, and slashing from nonmagical weapons that aren't silvered",
    ],
    damageImmunities: ['fire', 'poison'],
    conditionImmunities: ['Poisoned'],
    senses: ['truesight 120 ft.', 'passive Perception 12'],
    languages: ['Infernal', 'telepathy 120 ft.'],
    specialAbilities: [
      {
        name: 'Hellish Weapons',
        description:
          "The erinyes's weapon attacks are magical and deal an extra 13 (3d8) poison damage on a hit (included in the attacks).",
      },
      {
        name: 'Magic Resistance',
        description:
          'The erinyes has advantage on saving throws against spells and other magical effects.',
      },
    ],
    actions: [
      {
        name: 'Multiattack',
        description: 'The erinyes makes three attacks',
      },
      {
        name: 'Longsword',
        description:
          'Melee Weapon Attack: +8 to hit, reach 5 ft., one target. Hit: 8 (1d8 + 4) slashing damage, or 9 (1d10 + 4) slashing damage if used with two hands, plus 13 (3d8) poison damage.',
        attackBonus: 8,
        damage: [
          {
            dice: {
              count: 3,
              die: 'd8',
              modifier: 0,
              notation: '3d8',
            },
            type: 'poison',
          },
        ],
      },
      {
        name: 'Longbow',
        description:
          'Ranged Weapon Attack: +7 to hit, range 150/600 ft., one target. Hit: 7 (1d8 + 3) piercing damage plus 13 (3d8) poison damage, and the target must succeed on a DC 14 Constitution saving throw or be poisoned. The poison lasts until it is removed by the lesser restoration spell or similar magic.',
        attackBonus: 7,
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
              count: 3,
              die: 'd8',
              modifier: 0,
              notation: '3d8',
            },
            type: 'poison',
          },
        ],
      },
    ],
    reactions: [
      {
        name: 'Parry',
        description:
          'The erinyes adds 4 to its AC against one melee attack that would hit it. To do so, the erinyes must see the attacker and be wielding a melee weapon.',
      },
    ],
  },
  {
    id: 'gynosphinx',
    name: 'Gynosphinx',
    system: 'dnd-5e-2014',
    source: 'SRD',
    size: 'large',
    type: 'monstrosity',
    alignment: 'lawful neutral',
    challengeRating: 11,
    experiencePoints: 7200,
    armorClass: 17,
    hitPoints: {
      count: 16,
      die: 'd10',
      modifier: 48,
      notation: '16d10+48',
    },
    speed: {
      walk: 40,
      fly: 60,
    },
    abilities: {
      str: 18,
      dex: 15,
      con: 16,
      int: 18,
      wis: 18,
      cha: 18,
    },
    skills: {
      Arcana: 12,
      History: 12,
      Perception: 8,
      Religion: 8,
    },
    damageResistances: ['bludgeoning, piercing, and slashing from nonmagical weapons'],
    damageImmunities: ['psychic'],
    conditionImmunities: ['Charmed', 'Frightened'],
    senses: ['truesight 120 ft.', 'passive Perception 18'],
    languages: ['Common', 'Sphinx'],
    specialAbilities: [
      {
        name: 'Inscrutable',
        description:
          "The sphinx is immune to any effect that would sense its emotions or read its thoughts, as well as any divination spell that it refuses. Wisdom (Insight) checks made to ascertain the sphinx's intentions or sincerity have disadvantage.",
      },
      {
        name: 'Magic Weapons',
        description: "The sphinx's weapon attacks are magical.",
      },
      {
        name: 'Spellcasting',
        description:
          'The sphinx is a 9th-level spellcaster. Its spellcasting ability is Intelligence (spell save DC 16, +8 to hit with spell attacks). It requires no material components to cast its spells. The sphinx has the following wizard spells prepared: - Cantrips (at will): mage hand, minor illusion, prestidigitation - 1st level (4 slots): detect magic, identify, shield - 2nd level (3 slots): darkness, locate object, suggestion - 3rd level (3 slots): dispel magic, remove curse, tongues - 4th level (3 slots): banishment, greater invisibility - 5th level (1 slot): legend lore',
      },
    ],
    actions: [
      {
        name: 'Multiattack',
        description: 'The sphinx makes two claw attacks.',
      },
      {
        name: 'Claw',
        description:
          'Melee Weapon Attack: +9 to hit, reach 5 ft., one target. Hit: 13 (2d8 + 4) slashing damage.',
        attackBonus: 9,
        damage: [
          {
            dice: {
              count: 2,
              die: 'd8',
              modifier: 4,
              notation: '2d8+4',
            },
            type: 'slashing',
          },
        ],
      },
    ],
    legendaryActions: [
      {
        name: 'Claw Attack',
        cost: 1,
        description: 'The sphinx makes one claw attack.',
      },
      {
        name: 'Teleport (Costs 2 Actions)',
        cost: 1,
        description:
          'The sphinx magically teleports, along with any equipment it is wearing or carrying, up to 120 feet to an unoccupied space it can see.',
      },
      {
        name: 'Cast a Spell (Costs 3 Actions)',
        cost: 1,
        description:
          'The sphinx casts a spell from its list of prepared spells, using a spell slot as normal.',
      },
    ],
  },
  {
    id: 'horned-devil',
    name: 'Horned Devil',
    system: 'dnd-5e-2014',
    source: 'SRD',
    size: 'large',
    type: 'fiend',
    alignment: 'lawful evil',
    challengeRating: 11,
    experiencePoints: 7200,
    armorClass: 18,
    hitPoints: {
      count: 17,
      die: 'd10',
      modifier: 85,
      notation: '17d10+85',
    },
    speed: {
      walk: 20,
      fly: 60,
    },
    abilities: {
      str: 22,
      dex: 17,
      con: 21,
      int: 12,
      wis: 16,
      cha: 17,
    },
    savingThrows: {
      str: 10,
      dex: 7,
      wis: 7,
      cha: 7,
    },
    damageResistances: [
      'cold',
      "bludgeoning, piercing, and slashing from nonmagical weapons that aren't silvered",
    ],
    damageImmunities: ['fire', 'poison'],
    conditionImmunities: ['Poisoned'],
    senses: ['darkvision 120 ft.', 'passive Perception 13'],
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
        description:
          'The devil makes three melee attacks: two with its fork and one with its tail. It can use Hurl Flame in place of any melee attack.',
      },
      {
        name: 'Fork',
        description:
          'Melee Weapon Attack: +10 to hit, reach 10 ft., one target. Hit: 15 (2d8 + 6) piercing damage.',
        attackBonus: 10,
        damage: [
          {
            dice: {
              count: 2,
              die: 'd8',
              modifier: 6,
              notation: '2d8+6',
            },
            type: 'piercing',
          },
        ],
      },
      {
        name: 'Tail',
        description:
          'Melee Weapon Attack: +10 to hit, reach 10 ft., one target. Hit: 10 (1d8 + 6) piercing damage. If the target is a creature other than an undead or a construct, it must succeed on a DC 17 Constitution saving throw or lose 10 (3d6) hit points at the start of each of its turns due to an infernal wound. Each time the devil hits the wounded target with this attack, the damage dealt by the wound increases by 10 (3d6). Any creature can take an action to stanch the wound with a successful DC 12 Wisdom (Medicine) check. The wound also closes if the target receives magical healing.',
        attackBonus: 10,
        damage: [
          {
            dice: {
              count: 1,
              die: 'd8',
              modifier: 6,
              notation: '1d8+6',
            },
            type: 'piercing',
          },
        ],
      },
      {
        name: 'Hurl Flame',
        description:
          "Ranged Spell Attack: +7 to hit, range 150 ft., one target. Hit: 14 (4d6) fire damage. If the target is a flammable object that isn't being worn or carried, it also catches fire.",
        attackBonus: 7,
        damage: [
          {
            dice: {
              count: 4,
              die: 'd6',
              modifier: 0,
              notation: '4d6',
            },
            type: 'fire',
          },
        ],
      },
    ],
  },
  {
    id: 'ice-devil',
    name: 'Ice Devil',
    system: 'dnd-5e-2014',
    source: 'SRD',
    size: 'large',
    type: 'fiend',
    alignment: 'lawful evil',
    challengeRating: 14,
    experiencePoints: 11500,
    armorClass: 18,
    hitPoints: {
      count: 19,
      die: 'd10',
      modifier: 76,
      notation: '19d10+76',
    },
    speed: {
      walk: 40,
    },
    abilities: {
      str: 21,
      dex: 14,
      con: 18,
      int: 18,
      wis: 15,
      cha: 18,
    },
    savingThrows: {
      dex: 7,
      con: 9,
      wis: 7,
      cha: 9,
    },
    damageResistances: [
      "bludgeoning, piercing, and slashing from nonmagical weapons that aren't silvered",
    ],
    damageImmunities: ['fire', 'poison'],
    conditionImmunities: ['Poisoned'],
    senses: ['blindsight 60 ft.', 'darkvision 120 ft.', 'passive Perception 12'],
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
        description:
          'The devil makes three attacks: one with its bite, one with its claws, and one with its tail.',
      },
      {
        name: 'Bite',
        description:
          'Melee Weapon Attack: +10 to hit, reach 5 ft., one target. Hit: 12 (2d6 + 5) piercing damage plus 10 (3d6) cold damage.',
        attackBonus: 10,
        damage: [
          {
            dice: {
              count: 2,
              die: 'd6',
              modifier: 5,
              notation: '2d6+5',
            },
            type: 'piercing',
          },
          {
            dice: {
              count: 3,
              die: 'd6',
              modifier: 0,
              notation: '3d6',
            },
            type: 'cold',
          },
        ],
      },
      {
        name: 'Claws',
        description:
          'Melee Weapon Attack: +10 to hit, reach 5 ft., one target. Hit: 10 (2d4 + 5) slashing damage plus 10 (3d6) cold damage.',
        attackBonus: 10,
        damage: [
          {
            dice: {
              count: 2,
              die: 'd4',
              modifier: 5,
              notation: '2d4+5',
            },
            type: 'slashing',
          },
          {
            dice: {
              count: 3,
              die: 'd6',
              modifier: 0,
              notation: '3d6',
            },
            type: 'cold',
          },
        ],
      },
      {
        name: 'Tail',
        description:
          'Melee Weapon Attack: +10 to hit, reach 10 ft., one target. Hit: 12 (2d6 + 5) bludgeoning damage plus 10 (3d6) cold damage.',
        attackBonus: 10,
        damage: [
          {
            dice: {
              count: 2,
              die: 'd6',
              modifier: 5,
              notation: '2d6+5',
            },
            type: 'bludgeoning',
          },
          {
            dice: {
              count: 3,
              die: 'd6',
              modifier: 0,
              notation: '3d6',
            },
            type: 'cold',
          },
        ],
      },
      {
        name: 'Wall of Ice',
        description:
          "The devil magically forms an opaque wall of ice on a solid surface it can see within 60 feet of it. The wall is 1 foot thick and up to 30 feet long and 10 feet high, or it's a hemispherical dome up to 20 feet in diameter. When the wall appears, each creature in its space is pushed out of it by the shortest route. The creature chooses which side of the wall to end up on, unless the creature is incapacitated. The creature then makes a DC 17 Dexterity saving throw, taking 35 (10d6) cold damage on a failed save, or half as much damage on a successful one. The wall lasts for 1 minute or until the devil is incapacitated or dies. The wall can be damaged and breached; each 10-foot section has AC 5, 30 hit points, vulnerability to fire damage, and immunity to acid, cold, necrotic, poison, and psychic damage. If a section is destroyed, it leaves behind a sheet of frigid air in the space the wall occupied. Whenever a creature finishes moving through the frigid air on a turn, willingly or otherwise, the creature must make a DC 17 Constitution saving throw, taking 17 (5d6) cold damage on a failed save, or half as much damage on a successful one. The frigid air dissipates when the rest of the wall vanishes.",
        savingThrow: {
          attribute: 'dex',
          dc: 17,
          effect: 'half damage on a successful save',
        },
        damage: [
          {
            dice: {
              count: 10,
              die: 'd6',
              modifier: 0,
              notation: '10d6',
            },
            type: 'cold',
          },
          {
            dice: {
              count: 5,
              die: 'd6',
              modifier: 0,
              notation: '5d6',
            },
            type: 'cold',
          },
        ],
      },
    ],
  },
  {
    id: 'iron-golem',
    name: 'Iron Golem',
    system: 'dnd-5e-2014',
    source: 'SRD',
    size: 'large',
    type: 'construct',
    alignment: 'unaligned',
    challengeRating: 16,
    experiencePoints: 15000,
    armorClass: 20,
    hitPoints: {
      count: 20,
      die: 'd10',
      modifier: 100,
      notation: '20d10+100',
    },
    speed: {
      walk: 30,
    },
    abilities: {
      str: 24,
      dex: 9,
      con: 20,
      int: 3,
      wis: 11,
      cha: 1,
    },
    damageImmunities: [
      'fire',
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
        name: 'Fire Absorption',
        description:
          'Whenever the golem is subjected to fire damage, it takes no damage and instead regains a number of hit points equal to the fire damage dealt.',
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
        description: 'The golem makes two melee attacks.',
      },
      {
        name: 'Slam',
        description:
          'Melee Weapon Attack: +13 to hit, reach 5 ft., one target. Hit: 20 (3d8 + 7) bludgeoning damage.',
        attackBonus: 13,
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
      {
        name: 'Sword',
        description:
          'Melee Weapon Attack: +13 to hit, reach 10 ft., one target. Hit: 23 (3d10 + 7) slashing damage.',
        attackBonus: 13,
        damage: [
          {
            dice: {
              count: 3,
              die: 'd10',
              modifier: 7,
              notation: '3d10+7',
            },
            type: 'slashing',
          },
        ],
      },
      {
        name: 'Poison Breath',
        description:
          'The golem exhales poisonous gas in a 15-foot cone. Each creature in that area must make a DC 19 Constitution saving throw, taking 45 (10d8) poison damage on a failed save, or half as much damage on a successful one.',
        damage: [
          {
            dice: {
              count: 10,
              die: 'd8',
              modifier: 0,
              notation: '10d8',
            },
            type: 'poison',
          },
        ],
        savingThrow: {
          attribute: 'con',
          dc: 19,
          effect: 'half damage on a successful save',
        },
        recharge: '5-6',
      },
    ],
  },
  {
    id: 'marilith',
    name: 'Marilith',
    system: 'dnd-5e-2014',
    source: 'SRD',
    size: 'large',
    type: 'fiend',
    alignment: 'chaotic evil',
    challengeRating: 16,
    experiencePoints: 15000,
    armorClass: 18,
    hitPoints: {
      count: 18,
      die: 'd10',
      modifier: 90,
      notation: '18d10+90',
    },
    speed: {
      walk: 40,
    },
    abilities: {
      str: 18,
      dex: 20,
      con: 20,
      int: 18,
      wis: 16,
      cha: 20,
    },
    savingThrows: {
      str: 9,
      con: 10,
      wis: 8,
      cha: 10,
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
        name: 'Magic Resistance',
        description:
          'The marilith has advantage on saving throws against spells and other magical effects.',
      },
      {
        name: 'Magic Weapons',
        description: "The marilith's weapon attacks are magical.",
      },
      {
        name: 'Reactive',
        description: 'The marilith can take one reaction on every turn in combat.',
      },
    ],
    actions: [
      {
        name: 'Multiattack',
        description:
          'The marilith can make seven attacks: six with its longswords and one with its tail.',
      },
      {
        name: 'Longsword',
        description:
          'Melee Weapon Attack: +9 to hit, reach 5 ft., one target. Hit: 13 (2d8 + 4) slashing damage.',
        attackBonus: 9,
        damage: [
          {
            dice: {
              count: 2,
              die: 'd8',
              modifier: 4,
              notation: '2d8+4',
            },
            type: 'slashing',
          },
        ],
      },
      {
        name: 'Tail',
        description:
          "Melee Weapon Attack: +9 to hit, reach 10 ft., one creature. Hit: 15 (2d10 + 4) bludgeoning damage. If the target is Medium or smaller, it is grappled (escape DC 19). Until this grapple ends, the target is restrained, the marilith can automatically hit the target with its tail, and the marilith can't make tail attacks against other targets.",
        attackBonus: 9,
        damage: [
          {
            dice: {
              count: 2,
              die: 'd10',
              modifier: 4,
              notation: '2d10+4',
            },
            type: 'bludgeoning',
          },
        ],
      },
      {
        name: 'Teleport',
        description:
          'The marilith magically teleports, along with any equipment it is wearing or carrying, up to 120 feet to an unoccupied space it can see.',
      },
    ],
    reactions: [
      {
        name: 'Parry',
        description:
          'The marilith adds 5 to its AC against one melee attack that would hit it. To do so, the marilith must see the attacker and be wielding a melee weapon.',
      },
    ],
  },
  {
    id: 'mummy-lord',
    name: 'Mummy Lord',
    system: 'dnd-5e-2014',
    source: 'SRD',
    size: 'medium',
    type: 'undead',
    alignment: 'lawful evil',
    challengeRating: 15,
    experiencePoints: 13000,
    armorClass: 17,
    hitPoints: {
      count: 13,
      die: 'd8',
      modifier: 39,
      notation: '13d8+39',
    },
    speed: {
      walk: 20,
    },
    abilities: {
      str: 18,
      dex: 10,
      con: 17,
      int: 11,
      wis: 18,
      cha: 16,
    },
    savingThrows: {
      con: 8,
      int: 5,
      wis: 9,
      cha: 8,
    },
    skills: {
      History: 5,
      Religion: 5,
    },
    damageImmunities: [
      'necrotic',
      'poison',
      'bludgeoning, piercing, and slashing from nonmagical weapons',
    ],
    damageVulnerabilities: ['fire'],
    conditionImmunities: ['Charmed', 'Exhaustion', 'Frightened', 'Paralyzed', 'Poisoned'],
    senses: ['darkvision 60 ft.', 'passive Perception 14'],
    languages: ['the languages it knew in life'],
    specialAbilities: [
      {
        name: 'Magic Resistance',
        description:
          'The mummy lord has advantage on saving throws against spells and other magical effects.',
      },
      {
        name: 'Rejuvenation',
        description:
          "A destroyed mummy lord gains a new body in 24 hours if its heart is intact, regaining all its hit points and becoming active again. The new body appears within 5 feet of the mummy lord's heart.",
      },
      {
        name: 'Spellcasting',
        description:
          'The mummy lord is a 10th-level spellcaster. Its spellcasting ability is Wisdom (spell save DC 17, +9 to hit with spell attacks). The mummy lord has the following cleric spells prepared: - Cantrips (at will): sacred flame, thaumaturgy - 1st level (4 slots): command, guiding bolt, shield of faith - 2nd level (3 slots): hold person, silence, spiritual weapon - 3rd level (3 slots): animate dead, dispel magic - 4th level (3 slots): divination, guardian of faith - 5th level (2 slots): contagion, insect plague - 6th level (1 slot): harm',
      },
    ],
    actions: [
      {
        name: 'Multiattack',
        description:
          'The mummy can use its Dreadful Glare and makes one attack with its rotting fist.',
      },
      {
        name: 'Rotting Fist',
        description:
          "Melee Weapon Attack: +9 to hit, reach 5 ft., one target. Hit: 14 (3d6 + 4) bludgeoning damage plus 21 (6d6) necrotic damage. If the target is a creature, it must succeed on a DC 16 Constitution saving throw or be cursed with mummy rot. The cursed target can't regain hit points, and its hit point maximum decreases by 10 (3d6) for every 24 hours that elapse. If the curse reduces the target's hit point maximum to 0, the target dies, and its body turns to dust. The curse lasts until removed by the remove curse spell or other magic.",
        attackBonus: 9,
        damage: [
          {
            dice: {
              count: 3,
              die: 'd6',
              modifier: 4,
              notation: '3d6+4',
            },
            type: 'bludgeoning',
          },
          {
            dice: {
              count: 6,
              die: 'd6',
              modifier: 0,
              notation: '6d6',
            },
            type: 'necrotic',
          },
        ],
      },
      {
        name: 'Dreadful Glare',
        description:
          "The mummy lord targets one creature it can see within 60 feet of it. If the target can see the mummy lord, it must succeed on a DC 16 Wisdom saving throw against this magic or become frightened until the end of the mummy's next turn. If the target fails the saving throw by 5 or more, it is also paralyzed for the same duration. A target that succeeds on the saving throw is immune to the Dreadful Glare of all mummies and mummy lords for the next 24 hours.",
        savingThrow: {
          attribute: 'wis',
          dc: 16,
          effect: 'see description',
        },
      },
    ],
    legendaryActions: [
      {
        name: 'Attack',
        cost: 1,
        description:
          'The mummy lord makes one attack with its rotting fist or uses its Dreadful Glare.',
      },
      {
        name: 'Blinding Dust',
        cost: 1,
        description:
          "Blinding dust and sand swirls magically around the mummy lord. Each creature within 5 feet of the mummy lord must succeed on a DC 16 Constitution saving throw or be blinded until the end of the creature's next turn.",
      },
      {
        name: 'Blasphemous Word (Costs 2 Actions)',
        cost: 1,
        description:
          "The mummy lord utters a blasphemous word. Each non-undead creature within 10 feet of the mummy lord that can hear the magical utterance must succeed on a DC 16 Constitution saving throw or be stunned until the end of the mummy lord's next turn.",
      },
      {
        name: 'Channel Negative Energy (Costs 2 Actions)',
        cost: 1,
        description:
          "The mummy lord magically unleashes negative energy. Creatures within 60 feet of the mummy lord, including ones behind barriers and around corners, can't regain hit points until the end of the mummy lord's next turn.",
      },
      {
        name: 'Whirlwind of Sand (Costs 2 Actions)',
        cost: 1,
        description:
          "The mummy lord magically transforms into a whirlwind of sand, moves up to 60 feet, and reverts to its normal form. While in whirlwind form, the mummy lord is immune to all damage, and it can't be grappled, petrified, knocked prone, restrained, or stunned. Equipment worn or carried by the mummy lord remain in its possession.",
      },
    ],
  },
  {
    id: 'nalfeshnee',
    name: 'Nalfeshnee',
    system: 'dnd-5e-2014',
    source: 'SRD',
    size: 'large',
    type: 'fiend',
    alignment: 'chaotic evil',
    challengeRating: 13,
    experiencePoints: 10000,
    armorClass: 18,
    hitPoints: {
      count: 16,
      die: 'd10',
      modifier: 96,
      notation: '16d10+96',
    },
    speed: {
      walk: 20,
      fly: 30,
    },
    abilities: {
      str: 21,
      dex: 10,
      con: 22,
      int: 19,
      wis: 12,
      cha: 15,
    },
    savingThrows: {
      con: 11,
      int: 9,
      wis: 6,
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
    senses: ['truesight 120 ft.', 'passive Perception 11'],
    languages: ['Abyssal', 'telepathy 120 ft.'],
    specialAbilities: [
      {
        name: 'Magic Resistance',
        description:
          'The nalfeshnee has advantage on saving throws against spells and other magical effects.',
      },
    ],
    actions: [
      {
        name: 'Multiattack',
        description:
          'The nalfeshnee uses Horror Nimbus if it can. It then makes three attacks: one with its bite and two with its claws.',
      },
      {
        name: 'Bite',
        description:
          'Melee Weapon Attack: +10 to hit, reach 5 ft., one target. Hit: 32 (5d10 + 5) piercing damage.',
        attackBonus: 10,
        damage: [
          {
            dice: {
              count: 5,
              die: 'd10',
              modifier: 5,
              notation: '5d10+5',
            },
            type: 'piercing',
          },
        ],
      },
      {
        name: 'Claw',
        description:
          'Melee Weapon Attack: +10 to hit, reach 10 ft., one target. Hit: 15 (3d6 + 5) slashing damage.',
        attackBonus: 10,
        damage: [
          {
            dice: {
              count: 3,
              die: 'd6',
              modifier: 5,
              notation: '3d6+5',
            },
            type: 'slashing',
          },
        ],
      },
      {
        name: 'Horror Nimbus',
        description:
          "The nalfeshnee magically emits scintillating, multicolored light. Each creature within 15 feet of the nalfeshnee that can see the light must succeed on a DC 15 Wisdom saving throw or be frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature's saving throw is successful or the effect ends for it, the creature is immune to the nalfeshnee's Horror Nimbus for the next 24 hours.",
        savingThrow: {
          attribute: 'wis',
          dc: 15,
          effect: 'see description',
        },
        recharge: '5-6',
      },
      {
        name: 'Teleport',
        description:
          'The nalfeshnee magically teleports, along with any equipment it is wearing or carrying, up to 120 feet to an unoccupied space it can see.',
      },
    ],
  },
  {
    id: 'pit-fiend',
    name: 'Pit Fiend',
    system: 'dnd-5e-2014',
    source: 'SRD',
    size: 'large',
    type: 'fiend',
    alignment: 'lawful evil',
    challengeRating: 20,
    experiencePoints: 25000,
    armorClass: 19,
    hitPoints: {
      count: 24,
      die: 'd10',
      modifier: 168,
      notation: '24d10+168',
    },
    speed: {
      walk: 30,
      fly: 60,
    },
    abilities: {
      str: 26,
      dex: 14,
      con: 24,
      int: 22,
      wis: 18,
      cha: 24,
    },
    savingThrows: {
      dex: 8,
      con: 13,
      wis: 10,
    },
    damageResistances: [
      'cold',
      "bludgeoning, piercing, and slashing from nonmagical weapons that aren't silvered",
    ],
    damageImmunities: ['fire', 'poison'],
    conditionImmunities: ['Poisoned'],
    senses: ['truesight 120 ft.', 'passive Perception 14'],
    languages: ['Infernal', 'telepathy 120 ft.'],
    specialAbilities: [
      {
        name: 'Fear Aura',
        description:
          "Any creature hostile to the pit fiend that starts its turn within 20 feet of the pit fiend must make a DC 21 Wisdom saving throw, unless the pit fiend is incapacitated. On a failed save, the creature is frightened until the start of its next turn. If a creature's saving throw is successful, the creature is immune to the pit fiend's Fear Aura for the next 24 hours.",
      },
      {
        name: 'Magic Resistance',
        description:
          'The pit fiend has advantage on saving throws against spells and other magical effects.',
      },
      {
        name: 'Magic Weapons',
        description: "The pit fiend's weapon attacks are magical.",
      },
      {
        name: 'Innate Spellcasting',
        description:
          "The pit fiend's spellcasting ability is Charisma (spell save DC 21). The pit fiend can innately cast the following spells, requiring no material components: At will: detect magic, fireball 3/day each: hold monster, wall of fire",
      },
    ],
    actions: [
      {
        name: 'Multiattack',
        description:
          'The pit fiend makes four attacks: one with its bite, one with its claw, one with its mace, and one with its tail.',
      },
      {
        name: 'Bite',
        description:
          "Melee Weapon Attack: +14 to hit, reach 5 ft., one target. Hit: 22 (4d6 + 8) piercing damage. The target must succeed on a DC 21 Constitution saving throw or become poisoned. While poisoned in this way, the target can't regain hit points, and it takes 21 (6d6) poison damage at the start of each of its turns. The poisoned target can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success.",
        attackBonus: 14,
        damage: [
          {
            dice: {
              count: 4,
              die: 'd6',
              modifier: 8,
              notation: '4d6+8',
            },
            type: 'piercing',
          },
        ],
      },
      {
        name: 'Claw',
        description:
          'Melee Weapon Attack: +14 to hit, reach 10 ft., one target. Hit: 17 (2d8 + 8) slashing damage.',
        attackBonus: 14,
        damage: [
          {
            dice: {
              count: 2,
              die: 'd8',
              modifier: 8,
              notation: '2d8+8',
            },
            type: 'slashing',
          },
        ],
      },
      {
        name: 'Mace',
        description:
          'Melee Weapon Attack: +14 to hit, reach 10 ft., one target. Hit: 15 (2d6 + 8) bludgeoning damage plus 21 (6d6) fire damage.',
        attackBonus: 14,
        damage: [
          {
            dice: {
              count: 2,
              die: 'd6',
              modifier: 8,
              notation: '2d6+8',
            },
            type: 'bludgeoning',
          },
        ],
      },
      {
        name: 'Tail',
        description:
          'Melee Weapon Attack: +14 to hit, reach 10 ft., one target. Hit: 24 (3d10 + 8) bludgeoning damage.',
        attackBonus: 14,
        damage: [
          {
            dice: {
              count: 3,
              die: 'd10',
              modifier: 8,
              notation: '3d10+8',
            },
            type: 'bludgeoning',
          },
        ],
      },
    ],
  },
  {
    id: 'planetar',
    name: 'Planetar',
    system: 'dnd-5e-2014',
    source: 'SRD',
    size: 'large',
    type: 'celestial',
    alignment: 'lawful good',
    challengeRating: 16,
    experiencePoints: 15000,
    armorClass: 19,
    hitPoints: {
      count: 16,
      die: 'd10',
      modifier: 112,
      notation: '16d10+112',
    },
    speed: {
      walk: 40,
      fly: 120,
    },
    abilities: {
      str: 24,
      dex: 20,
      con: 24,
      int: 19,
      wis: 22,
      cha: 25,
    },
    savingThrows: {
      con: 12,
      wis: 11,
      cha: 12,
    },
    skills: {
      Perception: 11,
    },
    damageResistances: ['radiant', 'bludgeoning, piercing, and slashing from nonmagical weapons'],
    conditionImmunities: ['Charmed', 'Exhaustion', 'Frightened'],
    senses: ['truesight 120 ft.', 'passive Perception 21'],
    languages: ['all', 'telepathy 120 ft.'],
    specialAbilities: [
      {
        name: 'Angelic Weapons',
        description:
          "The planetar's weapon attacks are magical. When the planetar hits with any weapon, the weapon deals an extra 5d8 radiant damage (included in the attack).",
      },
      {
        name: 'Divine Awareness',
        description: 'The planetar knows if it hears a lie.',
      },
      {
        name: 'Innate Spellcasting',
        description:
          "The planetar's spellcasting ability is Charisma (spell save DC 20). The planetar can innately cast the following spells, requiring no material components: At will: detect evil and good, invisibility (self only) 3/day each: blade barrier, dispel evil and good, flame strike, raise dead 1/day each: commune, control weather, insect plague",
      },
      {
        name: 'Magic Resistance',
        description:
          'The planetar has advantage on saving throws against spells and other magical effects.',
      },
    ],
    actions: [
      {
        name: 'Multiattack',
        description: 'The planetar makes two melee attacks.',
      },
      {
        name: 'Greatsword',
        description:
          'Melee Weapon Attack: +12 to hit, reach 5 ft., one target. Hit: 21 (4d6 + 7) slashing damage plus 22 (5d8) radiant damage.',
        attackBonus: 12,
        damage: [
          {
            dice: {
              count: 4,
              die: 'd6',
              modifier: 7,
              notation: '4d6+7',
            },
            type: 'slashing',
          },
          {
            dice: {
              count: 5,
              die: 'd8',
              modifier: 0,
              notation: '5d8',
            },
            type: 'radiant',
          },
        ],
      },
      {
        name: 'Healing Touch',
        description:
          'The planetar touches another creature. The target magically regains 30 (6d8 + 3) hit points and is freed from any curse, disease, poison, blindness, or deafness.',
      },
    ],
  },
  {
    id: 'rakshasa',
    name: 'Rakshasa',
    system: 'dnd-5e-2014',
    source: 'SRD',
    size: 'medium',
    type: 'fiend',
    alignment: 'lawful evil',
    challengeRating: 13,
    experiencePoints: 10000,
    armorClass: 16,
    hitPoints: {
      count: 13,
      die: 'd8',
      modifier: 52,
      notation: '13d8+52',
    },
    speed: {
      walk: 40,
    },
    abilities: {
      str: 14,
      dex: 17,
      con: 18,
      int: 13,
      wis: 16,
      cha: 20,
    },
    skills: {
      Deception: 10,
      Insight: 8,
    },
    damageImmunities: ['bludgeoning, piercing, and slashing from nonmagical weapons'],
    damageVulnerabilities: ['piercing from magic weapons wielded by good creatures'],
    senses: ['darkvision 60 ft.', 'passive Perception 13'],
    languages: ['Common', 'Infernal'],
    specialAbilities: [
      {
        name: 'Limited Magic Immunity',
        description:
          "The rakshasa can't be affected or detected by spells of 6th level or lower unless it wishes to be. It has advantage on saving throws against all other spells and magical effects.",
      },
      {
        name: 'Innate Spellcasting',
        description:
          "The rakshasa's innate spellcasting ability is Charisma (spell save DC 18, +10 to hit with spell attacks). The rakshasa can innately cast the following spells, requiring no material components: At will: detect thoughts, disguise self, mage hand, minor illusion 3/day each: charm person, detect magic, invisibility, major image, suggestion 1/day each: dominate person, fly, plane shift, true seeing",
      },
    ],
    actions: [
      {
        name: 'Multiattack',
        description: 'The rakshasa makes two claw attacks',
      },
      {
        name: 'Claw',
        description:
          "Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 9 (2d6 + 2) slashing damage, and the target is cursed if it is a creature. The magical curse takes effect whenever the target takes a short or long rest, filling the target's thoughts with horrible images and dreams. The cursed target gains no benefit from finishing a short or long rest. The curse lasts until it is lifted by a remove curse spell or similar magic.",
        attackBonus: 7,
        damage: [
          {
            dice: {
              count: 2,
              die: 'd6',
              modifier: 2,
              notation: '2d6+2',
            },
            type: 'slashing',
          },
        ],
      },
    ],
  },
  {
    id: 'remorhaz',
    name: 'Remorhaz',
    system: 'dnd-5e-2014',
    source: 'SRD',
    size: 'huge',
    type: 'monstrosity',
    alignment: 'unaligned',
    challengeRating: 11,
    experiencePoints: 7200,
    armorClass: 17,
    hitPoints: {
      count: 17,
      die: 'd12',
      modifier: 85,
      notation: '17d12+85',
    },
    speed: {
      walk: 30,
      burrow: 20,
    },
    abilities: {
      str: 24,
      dex: 13,
      con: 21,
      int: 4,
      wis: 10,
      cha: 5,
    },
    damageImmunities: ['cold', 'fire'],
    senses: ['darkvision 60 ft.', 'tremorsense 60 ft.', 'passive Perception 10'],
    languages: [],
    specialAbilities: [
      {
        name: 'Heated Body',
        description:
          'A creature that touches the remorhaz or hits it with a melee attack while within 5 feet of it takes 10 (3d6) fire damage.',
      },
    ],
    actions: [
      {
        name: 'Bite',
        description:
          "Melee Weapon Attack: +11 to hit, reach 10 ft., one target. Hit: 40 (6d10 + 7) piercing damage plus 10 (3d6) fire damage. If the target is a creature, it is grappled (escape DC 17). Until this grapple ends, the target is restrained, and the remorhaz can't bite another target.",
        attackBonus: 11,
        damage: [
          {
            dice: {
              count: 6,
              die: 'd10',
              modifier: 7,
              notation: '6d10+7',
            },
            type: 'piercing',
          },
          {
            dice: {
              count: 3,
              die: 'd6',
              modifier: 0,
              notation: '3d6',
            },
            type: 'fire',
          },
        ],
      },
      {
        name: 'Swallow',
        description:
          "The remorhaz makes one bite attack against a Medium or smaller creature it is grappling. If the attack hits, that creature takes the bite's damage and is swallowed, and the grapple ends. While swallowed, the creature is blinded and restrained, it has total cover against attacks and other effects outside the remorhaz, and it takes 21 (6d6) acid damage at the start of each of the remorhaz's turns. If the remorhaz takes 30 damage or more on a single turn from a creature inside it, the remorhaz must succeed on a DC 15 Constitution saving throw at the end of that turn or regurgitate all swallowed creatures, which fall prone in a space within 10 feet of the remorhaz. If the remorhaz dies, a swallowed creature is no longer restrained by it and can escape from the corpse using 15 feet of movement, exiting prone.",
        savingThrow: {
          attribute: 'con',
          dc: 15,
          effect: 'see description',
        },
        damage: [
          {
            dice: {
              count: 6,
              die: 'd6',
              modifier: 0,
              notation: '6d6',
            },
            type: 'acid',
          },
        ],
      },
    ],
  },
  {
    id: 'roc',
    name: 'Roc',
    system: 'dnd-5e-2014',
    source: 'SRD',
    size: 'gargantuan',
    type: 'monstrosity',
    alignment: 'unaligned',
    challengeRating: 11,
    experiencePoints: 7200,
    armorClass: 15,
    hitPoints: {
      count: 16,
      die: 'd20',
      modifier: 80,
      notation: '16d20+80',
    },
    speed: {
      walk: 20,
      fly: 120,
    },
    abilities: {
      str: 28,
      dex: 10,
      con: 20,
      int: 3,
      wis: 10,
      cha: 9,
    },
    savingThrows: {
      dex: 4,
      con: 9,
      wis: 4,
      cha: 3,
    },
    skills: {
      Perception: 4,
    },
    senses: ['passive Perception 14'],
    languages: [],
    specialAbilities: [
      {
        name: 'Keen Sight',
        description: 'The roc has advantage on Wisdom (Perception) checks that rely on sight.',
      },
    ],
    actions: [
      {
        name: 'Multiattack',
        description: 'The roc makes two attacks: one with its beak and one with its talons.',
      },
      {
        name: 'Beak',
        description:
          'Melee Weapon Attack: +13 to hit, reach 10 ft., one target. Hit: 27 (4d8 + 9) piercing damage.',
        attackBonus: 13,
        damage: [
          {
            dice: {
              count: 4,
              die: 'd8',
              modifier: 9,
              notation: '4d8+9',
            },
            type: 'piercing',
          },
        ],
      },
      {
        name: 'Talons',
        description:
          "Melee Weapon Attack: +13 to hit, reach 5 ft., one target. Hit: 23 (4d6 + 9) slashing damage, and the target is grappled (escape DC 19). Until this grapple ends, the target is restrained, and the roc can't use its talons on another target.",
        attackBonus: 13,
        damage: [
          {
            dice: {
              count: 4,
              die: 'd6',
              modifier: 9,
              notation: '4d6+9',
            },
            type: 'slashing',
          },
        ],
      },
    ],
  },
  {
    id: 'solar',
    name: 'Solar',
    system: 'dnd-5e-2014',
    source: 'SRD',
    size: 'large',
    type: 'celestial',
    alignment: 'lawful good',
    challengeRating: 21,
    experiencePoints: 33000,
    armorClass: 21,
    hitPoints: {
      count: 18,
      die: 'd10',
      modifier: 144,
      notation: '18d10+144',
    },
    speed: {
      walk: 50,
      fly: 150,
    },
    abilities: {
      str: 26,
      dex: 22,
      con: 26,
      int: 25,
      wis: 25,
      cha: 30,
    },
    savingThrows: {
      int: 14,
      wis: 14,
      cha: 17,
    },
    skills: {
      Perception: 14,
    },
    damageResistances: ['radiant', 'bludgeoning, piercing, and slashing from nonmagical weapons'],
    damageImmunities: ['necrotic', 'poison'],
    conditionImmunities: ['Charmed', 'Exhaustion', 'Frightened', 'Poisoned'],
    senses: ['truesight 120 ft.', 'passive Perception 24'],
    languages: ['all', 'telepathy 120 ft.'],
    specialAbilities: [
      {
        name: 'Angelic Weapons',
        description:
          "The solar's weapon attacks are magical. When the solar hits with any weapon, the weapon deals an extra 6d8 radiant damage (included in the attack).",
      },
      {
        name: 'Divine Awareness',
        description: 'The solar knows if it hears a lie.',
      },
      {
        name: 'Innate Spellcasting',
        description:
          "The solar's spell casting ability is Charisma (spell save DC 25). It can innately cast the following spells, requiring no material components: At will: detect evil and good, invisibility (self only) 3/day each: blade barrier, dispel evil and good, resurrection 1/day each: commune, control weather",
      },
      {
        name: 'Magic Resistance',
        description:
          'The solar has advantage on saving throws against spells and other magical effects.',
      },
    ],
    actions: [
      {
        name: 'Multiattack',
        description: 'The solar makes two greatsword attacks.',
      },
      {
        name: 'Greatsword',
        description:
          'Melee Weapon Attack: +15 to hit, reach 5 ft., one target. Hit: 22 (4d6 + 8) slashing damage plus 27 (6d8) radiant damage.',
        attackBonus: 15,
        damage: [
          {
            dice: {
              count: 4,
              die: 'd6',
              modifier: 8,
              notation: '4d6+8',
            },
            type: 'slashing',
          },
          {
            dice: {
              count: 6,
              die: 'd8',
              modifier: 0,
              notation: '6d8',
            },
            type: 'radiant',
          },
        ],
      },
      {
        name: 'Slaying Longbow',
        description:
          'Ranged Weapon Attack: +13 to hit, range 150/600 ft., one target. Hit: 15 (2d8 + 6) piercing damage plus 27 (6d8) radiant damage. If the target is a creature that has 190 hit points or fewer, it must succeed on a DC 15 Constitution saving throw or die.',
        attackBonus: 13,
        damage: [
          {
            dice: {
              count: 2,
              die: 'd8',
              modifier: 6,
              notation: '2d8+6',
            },
            type: 'piercing',
          },
          {
            dice: {
              count: 6,
              die: 'd8',
              modifier: 0,
              notation: '6d8',
            },
            type: 'radiant',
          },
        ],
      },
      {
        name: 'Flying Sword',
        description:
          "The solar releases its greatsword to hover magically in an unoccupied space within 5 ft. of it. If the solar can see the sword, the solar can mentally command it as a bonus action to fly up to 50 ft. and either make one attack against a target or return to the solar's hands. If the hovering sword is targeted by any effect, the solar is considered to be holding it. The hovering sword falls if the solar dies.",
      },
      {
        name: 'Healing Touch',
        description:
          'The solar touches another creature. The target magically regains 40 (8d8 + 4) hit points and is freed from any curse, disease, poison, blindness, or deafness.',
      },
    ],
    legendaryActions: [
      {
        name: 'Teleport',
        cost: 1,
        description:
          'The solar magically teleports, along with any equipment it is wearing or carrying, up to 120 ft. to an unoccupied space it can see.',
      },
      {
        name: 'Searing Burst (Costs 2 Actions)',
        cost: 1,
        description:
          'The solar emits magical, divine energy. Each creature of its choice in a 10-foot radius must make a DC 23 Dexterity saving throw, taking 14 (4d6) fire damage plus 14 (4d6) radiant damage on a failed save, or half as much damage on a successful one.',
      },
      {
        name: 'Blinding Gaze (Costs 3 Actions)',
        cost: 1,
        description:
          'The solar targets one creature it can see within 30 ft. of it. If the target can see it, the target must succeed on a DC 15 Constitution saving throw or be blinded until magic such as the lesser restoration spell removes the blindness.',
      },
    ],
  },
  {
    id: 'storm-giant',
    name: 'Storm Giant',
    system: 'dnd-5e-2014',
    source: 'SRD',
    size: 'huge',
    type: 'giant',
    alignment: 'chaotic good',
    challengeRating: 13,
    experiencePoints: 10000,
    armorClass: 16,
    hitPoints: {
      count: 20,
      die: 'd12',
      modifier: 100,
      notation: '20d12+100',
    },
    speed: {
      walk: 50,
      swim: 50,
    },
    abilities: {
      str: 29,
      dex: 14,
      con: 20,
      int: 16,
      wis: 18,
      cha: 18,
    },
    savingThrows: {
      str: 14,
      con: 10,
      wis: 9,
      cha: 9,
    },
    skills: {
      Arcana: 8,
      Athletics: 14,
      History: 8,
      Perception: 9,
    },
    damageResistances: ['cold'],
    damageImmunities: ['lightning', 'thunder'],
    senses: ['passive Perception 19'],
    languages: ['Common', 'Giant'],
    specialAbilities: [
      {
        name: 'Amphibious',
        description: 'The giant can breathe air and water.',
      },
      {
        name: 'Innate Spellcasting',
        description:
          "The giant's innate spellcasting ability is Charisma (spell save DC 17). It can innately cast the following spells, requiring no material components: At will: detect magic, feather fall, levitate, light 3/day each: control weather, water breathing",
      },
    ],
    actions: [
      {
        name: 'Multiattack',
        description: 'The giant makes two greatsword attacks.',
      },
      {
        name: 'Greatsword',
        description:
          'Melee Weapon Attack: +14 to hit, reach 10 ft., one target. Hit: 30 (6d6 + 9) slashing damage.',
        attackBonus: 14,
        damage: [
          {
            dice: {
              count: 6,
              die: 'd6',
              modifier: 9,
              notation: '6d6+9',
            },
            type: 'slashing',
          },
        ],
      },
      {
        name: 'Rock',
        description:
          'Ranged Weapon Attack: +14 to hit, range 60/240 ft., one target. Hit: 35 (4d12 + 9) bludgeoning damage.',
        attackBonus: 14,
        damage: [
          {
            dice: {
              count: 4,
              die: 'd12',
              modifier: 9,
              notation: '4d12+9',
            },
            type: 'bludgeoning',
          },
        ],
      },
      {
        name: 'Lightning Strike',
        description:
          'The giant hurls a magical lightning bolt at a point it can see within 500 feet of it. Each creature within 10 feet of that point must make a DC 17 Dexterity saving throw, taking 54 (12d8) lightning damage on a failed save, or half as much damage on a successful one.',
        damage: [
          {
            dice: {
              count: 12,
              die: 'd8',
              modifier: 0,
              notation: '12d8',
            },
            type: 'lightning',
          },
        ],
        savingThrow: {
          attribute: 'dex',
          dc: 17,
          effect: 'half damage on a successful save',
        },
        recharge: '5-6',
      },
    ],
  },
  {
    id: 'tarrasque',
    name: 'Tarrasque',
    system: 'dnd-5e-2014',
    source: 'SRD',
    size: 'gargantuan',
    type: 'monstrosity',
    alignment: 'unaligned',
    challengeRating: 30,
    experiencePoints: 155000,
    armorClass: 25,
    hitPoints: {
      count: 33,
      die: 'd20',
      modifier: 330,
      notation: '33d20+330',
    },
    speed: {
      walk: 40,
    },
    abilities: {
      str: 30,
      dex: 11,
      con: 30,
      int: 3,
      wis: 11,
      cha: 11,
    },
    savingThrows: {
      int: 5,
      wis: 9,
      cha: 9,
    },
    damageImmunities: [
      'fire',
      'poison',
      'bludgeoning, piercing, and slashing from nonmagical weapons',
    ],
    conditionImmunities: ['Charmed', 'Frightened', 'Paralyzed', 'Poisoned'],
    senses: ['blindsight 120 ft.', 'passive Perception 10'],
    languages: [],
    specialAbilities: [
      {
        name: 'Legendary Resistance',
        description: 'If the tarrasque fails a saving throw, it can choose to succeed instead.',
      },
      {
        name: 'Magic Resistance',
        description:
          'The tarrasque has advantage on saving throws against spells and other magical effects.',
      },
      {
        name: 'Reflective Carapace',
        description:
          'Any time the tarrasque is targeted by a magic missile spell, a line spell, or a spell that requires a ranged attack roll, roll a d6. On a 1 to 5, the tarrasque is unaffected. On a 6, the tarrasque is unaffected, and the effect is reflected back at the caster as though it originated from the tarrasque, turning the caster into the target.',
      },
      {
        name: 'Siege Monster',
        description: 'The tarrasque deals double damage to objects and structures.',
      },
    ],
    actions: [
      {
        name: 'Multiattack',
        description:
          'The tarrasque can use its Frightful Presence. It then makes five attacks: one with its bite, two with its claws, one with its horns, and one with its tail. It can use its Swallow instead of its bite.',
      },
      {
        name: 'Bite',
        description:
          "Melee Weapon Attack: +19 to hit, reach 10 ft., one target. Hit: 36 (4d12 + 10) piercing damage. If the target is a creature, it is grappled (escape DC 20). Until this grapple ends, the target is restrained, and the tarrasque can't bite another target.",
        attackBonus: 19,
        damage: [
          {
            dice: {
              count: 4,
              die: 'd12',
              modifier: 10,
              notation: '4d12+10',
            },
            type: 'piercing',
          },
        ],
      },
      {
        name: 'Claw',
        description:
          'Melee Weapon Attack: +19 to hit, reach 15 ft., one target. Hit: 28 (4d8 + 10) slashing damage.',
        attackBonus: 19,
        damage: [
          {
            dice: {
              count: 4,
              die: 'd8',
              modifier: 10,
              notation: '4d8+10',
            },
            type: 'slashing',
          },
        ],
      },
      {
        name: 'Horns',
        description:
          'Melee Weapon Attack: +19 to hit, reach 10 ft., one target. Hit: 32 (4d10 + 10) piercing damage.',
        attackBonus: 19,
        damage: [
          {
            dice: {
              count: 4,
              die: 'd10',
              modifier: 10,
              notation: '4d10+10',
            },
            type: 'piercing',
          },
        ],
      },
      {
        name: 'Tail',
        description:
          'Melee Weapon Attack: +19 to hit, reach 20 ft., one target. Hit: 24 (4d6 + 10) bludgeoning damage. If the target is a creature, it must succeed on a DC 20 Strength saving throw or be knocked prone.',
        attackBonus: 19,
        damage: [
          {
            dice: {
              count: 4,
              die: 'd6',
              modifier: 10,
              notation: '4d6+10',
            },
            type: 'bludgeoning',
          },
        ],
      },
      {
        name: 'Frightful Presence',
        description:
          "Each creature of the tarrasque's choice within 120 feet of it and aware of it must succeed on a DC 17 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, with disadvantage if the tarrasque is within line of sight, ending the effect on itself on a success. If a creature's saving throw is successful or the effect ends for it, the creature is immune to the tarrasque's Frightful Presence for the next 24 hours.",
        savingThrow: {
          attribute: 'wis',
          dc: 17,
          effect: 'see description',
        },
      },
      {
        name: 'Swallow',
        description:
          "The tarrasque makes one bite attack against a Large or smaller creature it is grappling. If the attack hits, the target takes the bite's damage, the target is swallowed, and the grapple ends. While swallowed, the creature is blinded and restrained, it has total cover against attacks and other effects outside the tarrasque, and it takes 56 (16d6) acid damage at the start of each of the tarrasque's turns. If the tarrasque takes 60 damage or more on a single turn from a creature inside it, the tarrasque must succeed on a DC 20 Constitution saving throw at the end of that turn or regurgitate all swallowed creatures, which fall prone in a space within 10 feet of the tarrasque. If the tarrasque dies, a swallowed creature is no longer restrained by it and can escape from the corpse by using 30 feet of movement, exiting prone.",
        savingThrow: {
          attribute: 'con',
          dc: 20,
          effect: 'see description',
        },
        damage: [
          {
            dice: {
              count: 16,
              die: 'd6',
              modifier: 0,
              notation: '16d6',
            },
            type: 'acid',
          },
        ],
      },
    ],
    legendaryActions: [
      {
        name: 'Attack',
        cost: 1,
        description: 'The tarrasque makes one claw attack or tail attack.',
      },
      {
        name: 'Move',
        cost: 1,
        description: 'The tarrasque moves up to half its speed.',
      },
      {
        name: 'Chomp (Costs 2 Actions)',
        cost: 1,
        description: 'The tarrasque makes one bite attack or uses its Swallow.',
      },
    ],
  },
  {
    id: 'vampire-vampire-form',
    name: 'Vampire, Vampire Form',
    system: 'dnd-5e-2014',
    source: 'SRD',
    size: 'medium',
    type: 'undead',
    alignment: 'lawful evil',
    challengeRating: 13,
    experiencePoints: 10000,
    armorClass: 16,
    hitPoints: {
      count: 17,
      die: 'd8',
      modifier: 68,
      notation: '17d8+68',
    },
    speed: {
      walk: 30,
    },
    abilities: {
      str: 18,
      dex: 18,
      con: 18,
      int: 17,
      wis: 15,
      cha: 18,
    },
    savingThrows: {
      dex: 9,
      wis: 7,
      cha: 9,
    },
    skills: {
      Perception: 7,
      Stealth: 9,
    },
    damageResistances: ['necrotic', 'bludgeoning, piercing, and slashing from nonmagical weapons'],
    senses: ['darkvision 120 ft.', 'passive Perception 17'],
    languages: ['the languages it knew in life'],
    specialAbilities: [
      {
        name: 'Shapechanger',
        description:
          "If the vampire isn't in sun light or running water, it can use its action to polymorph into a Tiny bat or a Medium cloud of mist, or back into its true form. While in bat form, the vampire can't speak, its walking speed is 5 feet, and it has a flying speed of 30 feet. Its statistics, other than its size and speed, are unchanged. Anything it is wearing transforms with it, but nothing it is carrying does. It reverts to its true form if it dies. While in mist form, the vampire can't take any actions, speak, or manipulate objects. It is weightless, has a flying speed of 20 feet, can hover, and can enter a hostile creature's space and stop there. In addition, if air can pass through a space, the mist can do so without squeezing, and it can't pass through water. It has advantage on Strength, Dexterity, and Constitution saving throws, and it is immune to all nonmagical damage, except the damage it takes from sunlight.",
      },
      {
        name: 'Legendary Resistance',
        description: 'If the vampire fails a saving throw, it can choose to succeed instead.',
      },
      {
        name: 'Misty Escape',
        description:
          "When it drops to 0 hit points outside its resting place, the vampire transforms into a cloud of mist (as in the Shapechanger trait) instead of falling unconscious, provided that it isn't in sunlight or running water. If it can't transform, it is destroyed. While it has 0 hit points in mist form, it can't revert to its vampire form, and it must reach its resting place within 2 hours or be destroyed. Once in its resting place, it reverts to its vampire form. It is then paralyzed until it regains at least 1 hit point. After spending 1 hour in its resting place with 0 hit points, it regains 1 hit point.",
      },
      {
        name: 'Regeneration',
        description:
          "The vampire regains 20 hit points at the start of its turn if it has at least 1 hit point and isn't in sunlight or running water. If the vampire takes radiant damage or damage from holy water, this trait doesn't function at the start of the vampire's next turn.",
      },
      {
        name: 'Spider Climb',
        description:
          'The vampire can climb difficult surfaces, including upside down on ceilings, without needing to make an ability check.',
      },
      {
        name: 'Vampire Weaknesses',
        description:
          "The vampire has the following flaws: Forbiddance. The vampire can't enter a residence without an invitation from one of the occupants. Harmed by Running Water. The vampire takes 20 acid damage if it ends its turn in running water. Stake to the Heart. If a piercing weapon made of wood is driven into the vampire's heart while the vampire is incapacitated in its resting place, the vampire is paralyzed until the stake is removed. Sunlight Hypersensitivity. The vampire takes 20 radiant damage when it starts its turn in sunlight. While in sunlight, it has disadvantage on attack rolls and ability checks.",
      },
    ],
    actions: [
      {
        name: 'Multiattack',
        description: 'The vampire makes two attacks, only one of which can be a bite attack.',
      },
      {
        name: 'Unarmed Strike',
        description:
          'Melee Weapon Attack: +9 to hit, reach 5 ft., one creature. Hit: 8 (1d8 + 4) bludgeoning damage. Instead of dealing damage, the vampire can grapple the target (escape DC 18).',
        attackBonus: 9,
        damage: [
          {
            dice: {
              count: 1,
              die: 'd8',
              modifier: 4,
              notation: '1d8+4',
            },
            type: 'bludgeoning',
          },
        ],
      },
      {
        name: 'Bite',
        description:
          "Melee Weapon Attack: +9 to hit, reach 5 ft., one willing creature, or a creature that is grappled by the vampire, incapacitated, or restrained. Hit: 7 (1d6 + 4) piercing damage plus 10 (3d6) necrotic damage. The target's hit point maximum is reduced by an amount equal to the necrotic damage taken, and the vampire regains hit points equal to that amount. The reduction lasts until the target finishes a long rest. The target dies if this effect reduces its hit point maximum to 0. A humanoid slain in this way and then buried in the ground rises the following night as a vampire spawn under the vampire's control.",
        attackBonus: 9,
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
          {
            dice: {
              count: 3,
              die: 'd6',
              modifier: 0,
              notation: '3d6',
            },
            type: 'necrotic',
          },
        ],
      },
      {
        name: 'Charm',
        description:
          "The vampire targets one humanoid it can see within 30 ft. of it. If the target can see the vampire, the target must succeed on a DC 17 Wisdom saving throw against this magic or be charmed by the vampire. The charmed target regards the vampire as a trusted friend to be heeded and protected. Although the target isn't under the vampire's control, it takes the vampire's requests or actions in the most favorable way it can, and it is a willing target for the vampire's bit attack. Each time the vampire or the vampire's companions do anything harmful to the target, it can repeat the saving throw, ending the effect on itself on a success. Otherwise, the effect lasts 24 hours or until the vampire is destroyed, is on a different plane of existence than the target, or takes a bonus action to end the effect.",
        savingThrow: {
          attribute: 'wis',
          dc: 17,
          effect: 'see description',
        },
      },
      {
        name: 'Children of the Night',
        description:
          "The vampire magically calls 2d4 swarms of bats or rats, provided that the sun isn't up. While outdoors, the vampire can call 3d6 wolves instead. The called creatures arrive in 1d4 rounds, acting as allies of the vampire and obeying its spoken commands. The beasts remain for 1 hour, until the vampire dies, or until the vampire dismisses them as a bonus action.",
      },
    ],
    legendaryActions: [
      {
        name: 'Move',
        cost: 1,
        description: 'The vampire moves up to its speed without provoking opportunity attacks.',
      },
      {
        name: 'Unarmed Strike',
        cost: 1,
        description: 'The vampire makes one unarmed strike.',
      },
      {
        name: 'Bite (Costs 2 Actions)',
        cost: 1,
        description: 'The vampire makes one bite attack.',
      },
    ],
  },
  {
    id: 'vampire-bat-form',
    name: 'Vampire, Bat Form',
    system: 'dnd-5e-2014',
    source: 'SRD',
    size: 'medium',
    type: 'undead',
    alignment: 'lawful evil',
    challengeRating: 13,
    experiencePoints: 10000,
    armorClass: 16,
    hitPoints: {
      count: 17,
      die: 'd8',
      modifier: 68,
      notation: '17d8+68',
    },
    speed: {
      walk: 5,
      fly: 30,
    },
    abilities: {
      str: 18,
      dex: 18,
      con: 18,
      int: 17,
      wis: 15,
      cha: 18,
    },
    savingThrows: {
      dex: 9,
      wis: 7,
      cha: 9,
    },
    skills: {
      Perception: 7,
      Stealth: 9,
    },
    damageResistances: ['necrotic', 'bludgeoning, piercing, and slashing from nonmagical weapons'],
    senses: ['darkvision 120 ft.', 'passive Perception 17'],
    languages: ['the languages it knew in life'],
    specialAbilities: [
      {
        name: 'Shapechanger',
        description:
          "If the vampire isn't in sun light or running water, it can use its action to polymorph into a Tiny bat or a Medium cloud of mist, or back into its true form. While in bat form, the vampire can't speak, its walking speed is 5 feet, and it has a flying speed of 30 feet. Its statistics, other than its size and speed, are unchanged. Anything it is wearing transforms with it, but nothing it is carrying does. It reverts to its true form if it dies. While in mist form, the vampire can't take any actions, speak, or manipulate objects. It is weightless, has a flying speed of 20 feet, can hover, and can enter a hostile creature's space and stop there. In addition, if air can pass through a space, the mist can do so without squeezing, and it can't pass through water. It has advantage on Strength, Dexterity, and Constitution saving throws, and it is immune to all nonmagical damage, except the damage it takes from sunlight.",
      },
      {
        name: 'Legendary Resistance',
        description: 'If the vampire fails a saving throw, it can choose to succeed instead.',
      },
      {
        name: 'Misty Escape',
        description:
          "When it drops to 0 hit points outside its resting place, the vampire transforms into a cloud of mist (as in the Shapechanger trait) instead of falling unconscious, provided that it isn't in sunlight or running water. If it can't transform, it is destroyed. While it has 0 hit points in mist form, it can't revert to its vampire form, and it must reach its resting place within 2 hours or be destroyed. Once in its resting place, it reverts to its vampire form. It is then paralyzed until it regains at least 1 hit point. After spending 1 hour in its resting place with 0 hit points, it regains 1 hit point.",
      },
      {
        name: 'Regeneration',
        description:
          "The vampire regains 20 hit points at the start of its turn if it has at least 1 hit point and isn't in sunlight or running water. If the vampire takes radiant damage or damage from holy water, this trait doesn't function at the start of the vampire's next turn.",
      },
      {
        name: 'Spider Climb',
        description:
          'The vampire can climb difficult surfaces, including upside down on ceilings, without needing to make an ability check.',
      },
      {
        name: 'Vampire Weaknesses',
        description:
          "The vampire has the following flaws: Forbiddance. The vampire can't enter a residence without an invitation from one of the occupants. Harmed by Running Water. The vampire takes 20 acid damage if it ends its turn in running water. Stake to the Heart. If a piercing weapon made of wood is driven into the vampire's heart while the vampire is incapacitated in its resting place, the vampire is paralyzed until the stake is removed. Sunlight Hypersensitivity. The vampire takes 20 radiant damage when it starts its turn in sunlight. While in sunlight, it has disadvantage on attack rolls and ability checks.",
      },
    ],
    actions: [
      {
        name: 'Bite',
        description:
          "Melee Weapon Attack: +9 to hit, reach 5 ft., one willing creature, or a creature that is grappled by the vampire, incapacitated, or restrained. Hit: 7 (1d6 + 4) piercing damage plus 10 (3d6) necrotic damage. The target's hit point maximum is reduced by an amount equal to the necrotic damage taken, and the vampire regains hit points equal to that amount. The reduction lasts until the target finishes a long rest. The target dies if this effect reduces its hit point maximum to 0. A humanoid slain in this way and then buried in the ground rises the following night as a vampire spawn under the vampire's control.",
        attackBonus: 9,
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
          {
            dice: {
              count: 3,
              die: 'd6',
              modifier: 0,
              notation: '3d6',
            },
            type: 'necrotic',
          },
        ],
      },
      {
        name: 'Charm',
        description:
          "The vampire targets one humanoid it can see within 30 ft. of it. If the target can see the vampire, the target must succeed on a DC 17 Wisdom saving throw against this magic or be charmed by the vampire. The charmed target regards the vampire as a trusted friend to be heeded and protected. Although the target isn't under the vampire's control, it takes the vampire's requests or actions in the most favorable way it can, and it is a willing target for the vampire's bit attack. Each time the vampire or the vampire's companions do anything harmful to the target, it can repeat the saving throw, ending the effect on itself on a success. Otherwise, the effect lasts 24 hours or until the vampire is destroyed, is on a different plane of existence than the target, or takes a bonus action to end the effect.",
        savingThrow: {
          attribute: 'wis',
          dc: 17,
          effect: 'see description',
        },
      },
      {
        name: 'Children of the Night',
        description:
          "The vampire magically calls 2d4 swarms of bats or rats, provided that the sun isn't up. While outdoors, the vampire can call 3d6 wolves instead. The called creatures arrive in 1d4 rounds, acting as allies of the vampire and obeying its spoken commands. The beasts remain for 1 hour, until the vampire dies, or until the vampire dismisses them as a bonus action.",
      },
    ],
    legendaryActions: [
      {
        name: 'Move',
        cost: 1,
        description: 'The vampire moves up to its speed without provoking opportunity attacks.',
      },
      {
        name: 'Unarmed Strike',
        cost: 1,
        description: 'The vampire makes one unarmed strike.',
      },
      {
        name: 'Bite (Costs 2 Actions)',
        cost: 1,
        description: 'The vampire makes one bite attack.',
      },
    ],
  },
  {
    id: 'vampire-mist-form',
    name: 'Vampire, Mist Form',
    system: 'dnd-5e-2014',
    source: 'SRD',
    size: 'medium',
    type: 'undead',
    alignment: 'lawful evil',
    challengeRating: 13,
    experiencePoints: 10000,
    armorClass: 16,
    hitPoints: {
      count: 17,
      die: 'd8',
      modifier: 68,
      notation: '17d8+68',
    },
    speed: {
      fly: 20,
    },
    abilities: {
      str: 18,
      dex: 18,
      con: 18,
      int: 17,
      wis: 15,
      cha: 18,
    },
    savingThrows: {
      dex: 9,
      wis: 7,
      cha: 9,
    },
    skills: {
      Perception: 7,
      Stealth: 9,
    },
    damageResistances: ['necrotic', 'bludgeoning, piercing, and slashing from nonmagical weapons'],
    senses: ['darkvision 120 ft.', 'passive Perception 17'],
    languages: ['the languages it knew in life'],
    specialAbilities: [
      {
        name: 'Shapechanger',
        description:
          "If the vampire isn't in sun light or running water, it can use its action to polymorph into a Tiny bat or a Medium cloud of mist, or back into its true form. While in bat form, the vampire can't speak, its walking speed is 5 feet, and it has a flying speed of 30 feet. Its statistics, other than its size and speed, are unchanged. Anything it is wearing transforms with it, but nothing it is carrying does. It reverts to its true form if it dies. While in mist form, the vampire can't take any actions, speak, or manipulate objects. It is weightless, has a flying speed of 20 feet, can hover, and can enter a hostile creature's space and stop there. In addition, if air can pass through a space, the mist can do so without squeezing, and it can't pass through water. It has advantage on Strength, Dexterity, and Constitution saving throws, and it is immune to all nonmagical damage, except the damage it takes from sunlight.",
      },
      {
        name: 'Legendary Resistance',
        description: 'If the vampire fails a saving throw, it can choose to succeed instead.',
      },
      {
        name: 'Misty Escape',
        description:
          "When it drops to 0 hit points outside its resting place, the vampire transforms into a cloud of mist (as in the Shapechanger trait) instead of falling unconscious, provided that it isn't in sunlight or running water. If it can't transform, it is destroyed. While it has 0 hit points in mist form, it can't revert to its vampire form, and it must reach its resting place within 2 hours or be destroyed. Once in its resting place, it reverts to its vampire form. It is then paralyzed until it regains at least 1 hit point. After spending 1 hour in its resting place with 0 hit points, it regains 1 hit point.",
      },
      {
        name: 'Regeneration',
        description:
          "The vampire regains 20 hit points at the start of its turn if it has at least 1 hit point and isn't in sunlight or running water. If the vampire takes radiant damage or damage from holy water, this trait doesn't function at the start of the vampire's next turn.",
      },
      {
        name: 'Spider Climb',
        description:
          'The vampire can climb difficult surfaces, including upside down on ceilings, without needing to make an ability check.',
      },
      {
        name: 'Vampire Weaknesses',
        description:
          "The vampire has the following flaws: Forbiddance. The vampire can't enter a residence without an invitation from one of the occupants. Harmed by Running Water. The vampire takes 20 acid damage if it ends its turn in running water. Stake to the Heart. If a piercing weapon made of wood is driven into the vampire's heart while the vampire is incapacitated in its resting place, the vampire is paralyzed until the stake is removed. Sunlight Hypersensitivity. The vampire takes 20 radiant damage when it starts its turn in sunlight. While in sunlight, it has disadvantage on attack rolls and ability checks.",
      },
    ],
    actions: [],
    legendaryActions: [
      {
        name: 'Move',
        cost: 1,
        description: 'The vampire moves up to its speed without provoking opportunity attacks.',
      },
      {
        name: 'Unarmed Strike',
        cost: 1,
        description: 'The vampire makes one unarmed strike.',
      },
      {
        name: 'Bite (Costs 2 Actions)',
        cost: 1,
        description: 'The vampire makes one bite attack.',
      },
    ],
  },
];
