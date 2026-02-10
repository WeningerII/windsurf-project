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
      description: 'The mage is a 9th-level spellcaster. Its spellcasting ability is Intelligence (spell save DC 14, +6 to hit with spell attacks). The mage has the following wizard spells prepared: Cantrips: fire bolt, light, mage hand, prestidigitation; 1st level (4 slots): detect magic, mage armor, magic missile, shield; 2nd level (3 slots): misty step, suggestion; 3rd level (3 slots): counterspell, fireball, fly; 4th level (3 slots): greater invisibility, ice storm; 5th level (1 slot): cone of cold.',
    },
  ],
  actions: [
    {
      name: 'Dagger',
      description: 'Melee or Ranged Weapon Attack: +5 to hit, reach 5 ft. or range 20/60 ft., one target.',
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
      description: 'The giant has advantage on Dexterity (Stealth) checks made to hide in rocky terrain.',
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
      damage: [{ dice: { count: 3, die: 'd8', modifier: 6, notation: '3d8+6' }, type: 'bludgeoning' }],
    },
    {
      name: 'Rock',
      description: 'Ranged Weapon Attack: +9 to hit, range 60/240 ft., one target.',
      attackBonus: 9,
      range: { normal: 60, max: 240 },
      damage: [{ dice: { count: 4, die: 'd10', modifier: 6, notation: '4d10+6' }, type: 'bludgeoning' }],
    },
  ],
  reactions: [
    {
      name: 'Rock Catching',
      description: 'If a rock or similar object is hurled at the giant, the giant can, with a successful DC 10 Dexterity saving throw, catch the missile and take no bludgeoning damage from it.',
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
      description: 'The dragon exhales fire in a 30-foot cone. Each creature in that area must make a DC 17 Dexterity saving throw, taking 16d6 fire damage on a failed save, or half as much damage on a successful one.',
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
      damage: [{ dice: { count: 4, die: 'd10', modifier: 8, notation: '4d10+8' }, type: 'bludgeoning' }],
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
      description: 'While underwater, the aboleth is surrounded by transformative mucus. A creature that touches the aboleth or that hits it with a melee attack while within 5 feet of it must make a DC 14 Constitution saving throw. On a failure, the creature is diseased for 1d4 hours. The diseased creature can breathe only underwater.',
    },
    {
      name: 'Probing Telepathy',
      description: 'If a creature communicates telepathically with the aboleth, the aboleth learns the creature\'s greatest desires if the aboleth can see the creature.',
    },
  ],
  actions: [
    {
      name: 'Multiattack',
      description: 'The aboleth makes three tentacle attacks.',
    },
    {
      name: 'Tentacle',
      description: 'Melee Weapon Attack: +9 to hit, reach 10 ft., one target. If the target is a creature, it must succeed on a DC 14 Constitution saving throw or become diseased. The disease has no effect for 1 minute and can be removed by any magic that cures disease. After 1 minute, the diseased creature\'s skin becomes translucent and slimy, the creature can\'t regain hit points unless it is underwater, and the disease can be removed only by heal or another disease-curing spell of 6th level or higher. When the creature is outside a body of water, it takes 6 (1d12) acid damage every 10 minutes unless moisture is applied to the skin before 10 minutes have passed.',
      attackBonus: 9,
      reach: 10,
      damage: [{ dice: { count: 2, die: 'd6', modifier: 5, notation: '2d6+5' }, type: 'bludgeoning' }],
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
      damage: [{ dice: { count: 3, die: 'd6', modifier: 5, notation: '3d6+5' }, type: 'bludgeoning' }],
    },
    {
      name: 'Enslave',
      description: 'The aboleth targets one creature it can see within 30 feet of it. The target must succeed on a DC 14 Wisdom saving throw or be magically charmed by the aboleth until the aboleth dies or until it is on a different plane of existence from the target. The charmed target is under the aboleth\'s control and can\'t take reactions, and the aboleth and the target can communicate telepathically with each other over any distance.',
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
      description: 'One creature charmed by the aboleth takes 10 (3d6) psychic damage, and the aboleth regains hit points equal to the damage the creature takes.',
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
      description: 'The chimera makes three attacks: one with its bite, one with its horns, and one with its claws. When its fire breath is available, it can use the breath in place of its bite or horns.',
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
      description: 'The dragon head exhales fire in a 15-foot cone. Each creature in that area must make a DC 15 Dexterity saving throw, taking 31 (7d8) fire damage on a failed save, or half as much on a successful one.',
      recharge: '5-6',
    },
  ],
  description: 'A monstrous hybrid with a lion\'s body, dragon wings, and three heads.',
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
      description: 'When a creature that can see the medusa\'s eyes starts its turn within 30 feet of the medusa, the medusa can force it to make a DC 14 Constitution saving throw if the medusa isn\'t incapacitated and can see the creature. On a failed save, the creature magically begins to turn to stone and is restrained. The restrained creature must repeat the saving throw at the end of its next turn. On a success, the effect ends. On a failure, the creature is petrified until freed by the greater restoration spell or other magic.',
    },
  ],
  actions: [
    {
      name: 'Multiattack',
      description: 'The medusa makes either three melee attacks—one with its snake hair and two with its shortsword—or two ranged attacks with its longbow.',
    },
    {
      name: 'Snake Hair',
      description: 'Melee Weapon Attack: +5 to hit, reach 5 ft., one creature.',
      attackBonus: 5,
      reach: 5,
      damage: [{ dice: { count: 1, die: 'd4', notation: '1d4+2' }, type: 'piercing' }, { dice: { count: 4, die: 'd6', notation: '4d6' }, type: 'poison' }],
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
      description: 'The wyvern makes two attacks: one with its bite and one with its stinger. While flying, it can use its claws in place of one other attack.',
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
      damage: [{ dice: { count: 2, die: 'd6', notation: '2d6+4' }, type: 'piercing' }, { dice: { count: 7, die: 'd6', notation: '7d6' }, type: 'poison' }],
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
];
