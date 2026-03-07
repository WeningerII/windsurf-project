import { Monster } from '../../../../types/creatures/monsters';

// CR 2
export const ogre: Monster = {
  id: 'ogre',
  name: 'Ogre',
  system: 'dnd-5e-2014',
  source: 'SRD',
  size: 'large',
  type: 'giant',
  alignment: 'chaotic evil',
  challengeRating: 2,
  experiencePoints: 450,
  armorClass: 11,
  hitPoints: { count: 7, die: 'd10', modifier: 21, notation: '7d10+21' },
  speed: { walk: 40 },
  abilities: { str: 19, dex: 8, con: 16, int: 5, wis: 7, cha: 7 },
  senses: ['darkvision 60 ft.', 'passive Perception 8'],
  languages: ['Common', 'Giant'],
  actions: [
    {
      name: 'Greatclub',
      description: 'Melee Weapon Attack: +6 to hit, reach 5 ft., one target.',
      attackBonus: 6,
      reach: 5,
      damage: [
        { dice: { count: 2, die: 'd8', modifier: 4, notation: '2d8+4' }, type: 'bludgeoning' },
      ],
    },
    {
      name: 'Javelin',
      description:
        'Melee or Ranged Weapon Attack: +6 to hit, reach 5 ft. or range 30/120 ft., one target.',
      attackBonus: 6,
      reach: 5,
      range: { normal: 30, max: 120 },
      damage: [{ dice: { count: 2, die: 'd6', modifier: 4, notation: '2d6+4' }, type: 'piercing' }],
    },
  ],
  description: 'Large, brutish humanoids with a taste for violence and mayhem.',
  environment: ['mountains', 'hills', 'forest'],
};

export const ghoul: Monster = {
  id: 'ghoul',
  name: 'Ghoul',
  system: 'dnd-5e-2014',
  source: 'SRD',
  size: 'medium',
  type: 'undead',
  alignment: 'chaotic evil',
  challengeRating: 1,
  experiencePoints: 200,
  armorClass: 12,
  hitPoints: { count: 5, die: 'd8', notation: '5d8' },
  speed: { walk: 30 },
  abilities: { str: 13, dex: 15, con: 10, int: 7, wis: 10, cha: 6 },
  damageImmunities: ['poison'],
  conditionImmunities: ['charmed', 'exhaustion', 'poisoned'],
  senses: ['darkvision 60 ft.', 'passive Perception 10'],
  languages: ['Common'],
  actions: [
    {
      name: 'Bite',
      description: 'Melee Weapon Attack: +2 to hit, reach 5 ft., one creature.',
      attackBonus: 2,
      reach: 5,
      damage: [{ dice: { count: 2, die: 'd6', modifier: 2, notation: '2d6+2' }, type: 'piercing' }],
    },
    {
      name: 'Claws',
      description:
        'Melee Weapon Attack: +4 to hit, reach 5 ft., one target. If the target is a creature other than an elf or undead, it must succeed on a DC 10 Constitution saving throw or be paralyzed for 1 minute. The target can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success.',
      attackBonus: 4,
      reach: 5,
      damage: [{ dice: { count: 2, die: 'd4', modifier: 2, notation: '2d4+2' }, type: 'slashing' }],
      savingThrow: {
        attribute: 'con',
        dc: 10,
        effect: 'paralyzed for 1 minute on failure',
      },
    },
  ],
  description: 'Flesh-eating undead that hunger for the living.',
  environment: ['underground', 'ruins'],
};

// CR 3
export const owlbear: Monster = {
  id: 'owlbear',
  name: 'Owlbear',
  system: 'dnd-5e-2014',
  source: 'SRD',
  size: 'large',
  type: 'monstrosity',
  alignment: 'unaligned',
  challengeRating: 3,
  experiencePoints: 700,
  armorClass: 13,
  hitPoints: { count: 7, die: 'd10', modifier: 21, notation: '7d10+21' },
  speed: { walk: 40 },
  abilities: { str: 20, dex: 12, con: 17, int: 3, wis: 12, cha: 7 },
  skills: { Perception: 3 },
  senses: ['darkvision 60 ft.', 'passive Perception 13'],
  languages: [],
  specialAbilities: [
    {
      name: 'Keen Sight and Smell',
      description:
        'The owlbear has advantage on Wisdom (Perception) checks that rely on sight or smell.',
    },
  ],
  actions: [
    {
      name: 'Multiattack',
      description: 'The owlbear makes two attacks: one with its beak and one with its claws.',
    },
    {
      name: 'Beak',
      description: 'Melee Weapon Attack: +7 to hit, reach 5 ft., one creature.',
      attackBonus: 7,
      reach: 5,
      damage: [
        { dice: { count: 1, die: 'd10', modifier: 5, notation: '1d10+5' }, type: 'piercing' },
      ],
    },
    {
      name: 'Claws',
      description: 'Melee Weapon Attack: +7 to hit, reach 5 ft., one target.',
      attackBonus: 7,
      reach: 5,
      damage: [{ dice: { count: 2, die: 'd8', modifier: 5, notation: '2d8+5' }, type: 'slashing' }],
    },
  ],
  description: 'A monstrous cross between a bear and an owl, fiercely territorial.',
  environment: ['forest'],
};

export const werewolf: Monster = {
  id: 'werewolf',
  name: 'Werewolf',
  system: 'dnd-5e-2014',
  source: 'SRD',
  size: 'medium',
  type: 'humanoid',
  alignment: 'chaotic evil',
  challengeRating: 3,
  experiencePoints: 700,
  armorClass: 11,
  hitPoints: { count: 9, die: 'd8', modifier: 18, notation: '9d8+18' },
  speed: { walk: 30 },
  abilities: { str: 15, dex: 13, con: 14, int: 10, wis: 11, cha: 10 },
  skills: { Perception: 4, Stealth: 3 },
  damageResistances: ['bludgeoning', 'piercing', 'slashing'],
  senses: ['passive Perception 14'],
  languages: ['Common'],
  specialAbilities: [
    {
      name: 'Shapechanger',
      description:
        "The werewolf can use its action to polymorph into a wolf-humanoid hybrid or into a wolf, or back into its true form, which is humanoid. Its statistics, other than its AC, are the same in each form. Any equipment it is wearing or carrying isn't transformed. It reverts to its true form if it dies.",
    },
    {
      name: 'Keen Hearing and Smell',
      description:
        'The werewolf has advantage on Wisdom (Perception) checks that rely on hearing or smell.',
    },
  ],
  actions: [
    {
      name: 'Multiattack',
      description:
        'The werewolf makes two attacks: two with its spear (humanoid form) or one with its bite and one with its claws (wolf or hybrid form).',
    },
    {
      name: 'Bite',
      description:
        'Melee Weapon Attack: +4 to hit, reach 5 ft., one target. If the target is a humanoid, it must succeed on a DC 12 Constitution saving throw or be cursed with werewolf lycanthropy.',
      attackBonus: 4,
      reach: 5,
      damage: [{ dice: { count: 1, die: 'd8', modifier: 2, notation: '1d8+2' }, type: 'piercing' }],
      savingThrow: {
        attribute: 'con',
        dc: 12,
        effect: 'cursed with lycanthropy on failure',
      },
    },
    {
      name: 'Claws',
      description: 'Melee Weapon Attack: +4 to hit, reach 5 ft., one creature.',
      attackBonus: 4,
      reach: 5,
      damage: [{ dice: { count: 2, die: 'd4', modifier: 2, notation: '2d4+2' }, type: 'slashing' }],
    },
  ],
  description: 'Humanoids cursed to transform into wolves under the full moon.',
  environment: ['forest', 'urban'],
};

// CR 4
export const blackDragonWyrmling: Monster = {
  id: 'black-dragon-wyrmling',
  name: 'Black Dragon Wyrmling',
  system: 'dnd-5e-2014',
  source: 'SRD',
  size: 'medium',
  type: 'dragon',
  alignment: 'chaotic evil',
  challengeRating: 2,
  experiencePoints: 450,
  armorClass: 17,
  hitPoints: { count: 6, die: 'd8', modifier: 12, notation: '6d8+12' },
  speed: { walk: 30, fly: 60, swim: 30 },
  abilities: { str: 15, dex: 14, con: 15, int: 10, wis: 11, cha: 13 },
  savingThrows: { dex: 4, con: 4, wis: 2, cha: 3 },
  skills: { Perception: 4, Stealth: 4 },
  damageImmunities: ['acid'],
  senses: ['blindsight 10 ft.', 'darkvision 60 ft.', 'passive Perception 14'],
  languages: ['Draconic'],
  specialAbilities: [
    {
      name: 'Amphibious',
      description: 'The dragon can breathe air and water.',
    },
  ],
  actions: [
    {
      name: 'Bite',
      description: 'Melee Weapon Attack: +4 to hit, reach 5 ft., one target.',
      attackBonus: 4,
      reach: 5,
      damage: [
        { dice: { count: 1, die: 'd10', modifier: 2, notation: '1d10+2' }, type: 'piercing' },
        { dice: { count: 1, die: 'd4', notation: '1d4' }, type: 'acid' },
      ],
    },
    {
      name: 'Acid Breath',
      description:
        'The dragon exhales acid in a 15-foot line that is 5 feet wide. Each creature in that line must make a DC 11 Dexterity saving throw, taking 5d8 acid damage on a failed save, or half as much damage on a successful one.',
      savingThrow: {
        attribute: 'dex',
        dc: 11,
        effect: '5d8 acid damage (half on success)',
      },
      recharge: '5-6',
    },
  ],
  description: 'Young black dragon, cruel and vicious even in youth.',
  environment: ['swamp', 'ruins'],
};

export const flameskull: Monster = {
  id: 'flameskull',
  name: 'Flameskull',
  system: 'dnd-5e-2014',
  source: 'SRD',
  size: 'tiny',
  type: 'undead',
  alignment: 'neutral evil',
  challengeRating: 4,
  experiencePoints: 1100,
  armorClass: 13,
  hitPoints: { count: 8, die: 'd4', modifier: 24, notation: '8d4+24' },
  speed: { fly: 40 },
  abilities: { str: 1, dex: 17, con: 14, int: 16, wis: 10, cha: 11 },
  skills: { Arcana: 5, Perception: 2 },
  damageResistances: ['lightning', 'necrotic', 'piercing'],
  damageImmunities: ['cold', 'fire', 'poison'],
  conditionImmunities: ['charmed', 'frightened', 'paralyzed', 'poisoned', 'prone'],
  senses: ['darkvision 60 ft.', 'passive Perception 12'],
  languages: ['Common'],
  specialAbilities: [
    {
      name: 'Illumination',
      description:
        'The flameskull sheds either dim light in a 15-foot radius, or bright light in a 15-foot radius and dim light for an additional 15 feet. It can switch between the options as an action.',
    },
    {
      name: 'Rejuvenation',
      description:
        'If the flameskull is destroyed, it regains all its hit points in 1 hour unless holy water is sprinkled on its remains or a dispel magic or remove curse spell is cast on them.',
    },
  ],
  actions: [
    {
      name: 'Multiattack',
      description: 'The flameskull uses Fire Ray twice.',
    },
    {
      name: 'Fire Ray',
      description: 'Ranged Spell Attack: +5 to hit, range 30 ft., one target.',
      attackBonus: 5,
      range: { normal: 30, max: 30 },
      damage: [{ dice: { count: 3, die: 'd6', notation: '3d6' }, type: 'fire' }],
    },
  ],
  description:
    'The burning skull of a dead wizard, animated by dark magic and bound to guard a location.',
  environment: ['underground', 'ruins'],
};

// CR 5
export const gladiator: Monster = {
  id: 'gladiator',
  name: 'Gladiator',
  system: 'dnd-5e-2014',
  source: 'SRD',
  size: 'medium',
  type: 'humanoid',
  alignment: 'true neutral',
  challengeRating: 5,
  experiencePoints: 1800,
  armorClass: 16,
  hitPoints: { count: 15, die: 'd8', modifier: 60, notation: '15d8+60' },
  speed: { walk: 30 },
  abilities: { str: 18, dex: 15, con: 18, int: 10, wis: 12, cha: 15 },
  savingThrows: { str: 7, dex: 5, con: 7 },
  skills: { Athletics: 10, Intimidation: 5 },
  senses: ['passive Perception 11'],
  languages: ['Common'],
  specialAbilities: [
    {
      name: 'Brave',
      description: 'The gladiator has advantage on saving throws against being frightened.',
    },
    {
      name: 'Brute',
      description:
        'A melee weapon deals one extra die of its damage when the gladiator hits with it (included in the attack).',
    },
  ],
  actions: [
    {
      name: 'Multiattack',
      description: 'The gladiator makes three melee attacks or two ranged attacks.',
    },
    {
      name: 'Spear',
      description:
        'Melee or Ranged Weapon Attack: +7 to hit, reach 5 ft. and range 20/60 ft., one target.',
      attackBonus: 7,
      reach: 5,
      range: { normal: 20, max: 60 },
      damage: [{ dice: { count: 2, die: 'd6', modifier: 4, notation: '2d6+4' }, type: 'piercing' }],
    },
    {
      name: 'Shield Bash',
      description:
        'Melee Weapon Attack: +7 to hit, reach 5 ft., one creature. If the target is a Medium or smaller creature, it must succeed on a DC 15 Strength saving throw or be knocked prone.',
      attackBonus: 7,
      reach: 5,
      damage: [
        { dice: { count: 2, die: 'd4', modifier: 4, notation: '2d4+4' }, type: 'bludgeoning' },
      ],
      savingThrow: {
        attribute: 'str',
        dc: 15,
        effect: 'knocked prone on failure',
      },
    },
  ],
  reactions: [
    {
      name: 'Parry',
      description:
        'The gladiator adds 3 to its AC against one melee attack that would hit it. To do so, the gladiator must see the attacker and be wielding a melee weapon.',
    },
  ],
  description: 'Elite warriors trained for combat in the arena.',
  environment: ['urban', 'any'],
};

export const troll: Monster = {
  id: 'troll',
  name: 'Troll',
  system: 'dnd-5e-2014',
  source: 'SRD',
  size: 'large',
  type: 'giant',
  alignment: 'chaotic evil',
  challengeRating: 5,
  experiencePoints: 1800,
  armorClass: 15,
  hitPoints: { count: 8, die: 'd10', modifier: 40, notation: '8d10+40' },
  speed: { walk: 30 },
  abilities: { str: 18, dex: 13, con: 20, int: 7, wis: 9, cha: 7 },
  skills: { Perception: 2 },
  senses: ['darkvision 60 ft.', 'passive Perception 12'],
  languages: ['Giant'],
  specialAbilities: [
    {
      name: 'Keen Smell',
      description: 'The troll has advantage on Wisdom (Perception) checks that rely on smell.',
    },
    {
      name: 'Regeneration',
      description:
        "The troll regains 10 hit points at the start of its turn. If the troll takes acid or fire damage, this trait doesn't function at the start of the troll's next turn. The troll dies only if it starts its turn with 0 hit points and doesn't regenerate.",
    },
  ],
  actions: [
    {
      name: 'Multiattack',
      description: 'The troll makes three attacks: one with its bite and two with its claws.',
    },
    {
      name: 'Bite',
      description: 'Melee Weapon Attack: +7 to hit, reach 5 ft., one target.',
      attackBonus: 7,
      reach: 5,
      damage: [{ dice: { count: 1, die: 'd6', modifier: 4, notation: '1d6+4' }, type: 'piercing' }],
    },
    {
      name: 'Claw',
      description: 'Melee Weapon Attack: +7 to hit, reach 5 ft., one target.',
      attackBonus: 7,
      reach: 5,
      damage: [{ dice: { count: 2, die: 'd6', modifier: 4, notation: '2d6+4' }, type: 'slashing' }],
    },
  ],
  description: 'Massive regenerating monsters with insatiable appetites.',
  environment: ['mountains', 'swamp', 'underground'],
};

export const youngWhiteDragon: Monster = {
  id: 'young-white-dragon',
  name: 'Young White Dragon',
  system: 'dnd-5e-2014',
  source: 'SRD',
  size: 'large',
  type: 'dragon',
  alignment: 'chaotic evil',
  challengeRating: 6,
  experiencePoints: 2300,
  armorClass: 17,
  hitPoints: { count: 16, die: 'd10', modifier: 64, notation: '16d10+64' },
  speed: { walk: 40, burrow: 20, fly: 80, swim: 40 },
  abilities: { str: 18, dex: 10, con: 18, int: 6, wis: 11, cha: 12 },
  savingThrows: { dex: 3, con: 7, wis: 3, cha: 4 },
  skills: { Perception: 6, Stealth: 3 },
  damageImmunities: ['cold'],
  senses: ['blindsight 30 ft.', 'darkvision 120 ft.', 'passive Perception 16'],
  languages: ['Common', 'Draconic'],
  specialAbilities: [
    {
      name: 'Ice Walk',
      description:
        "The dragon can move across and climb icy surfaces without needing to make an ability check. Additionally, difficult terrain composed of ice or snow doesn't cost it extra movement.",
    },
  ],
  actions: [
    {
      name: 'Multiattack',
      description: 'The dragon makes three attacks: one with its bite and two with its claws.',
    },
    {
      name: 'Bite',
      description: 'Melee Weapon Attack: +7 to hit, reach 10 ft., one target.',
      attackBonus: 7,
      reach: 10,
      damage: [
        { dice: { count: 2, die: 'd10', modifier: 4, notation: '2d10+4' }, type: 'piercing' },
        { dice: { count: 1, die: 'd8', notation: '1d8' }, type: 'cold' },
      ],
    },
    {
      name: 'Claw',
      description: 'Melee Weapon Attack: +7 to hit, reach 5 ft., one target.',
      attackBonus: 7,
      reach: 5,
      damage: [{ dice: { count: 2, die: 'd6', modifier: 4, notation: '2d6+4' }, type: 'slashing' }],
    },
    {
      name: 'Cold Breath',
      description:
        'The dragon exhales an icy blast in a 30-foot cone. Each creature in that area must make a DC 15 Constitution saving throw, taking 10d8 cold damage on a failed save, or half as much damage on a successful one.',
      savingThrow: {
        attribute: 'con',
        dc: 15,
        effect: '10d8 cold damage (half on success)',
      },
      recharge: '5-6',
    },
  ],
  description: 'Savage white dragons that make their lairs in frozen wastelands.',
  environment: ['arctic', 'mountains'],
};

export const ankheg: Monster = {
  id: 'ankheg',
  name: 'Ankheg',
  system: 'dnd-5e-2014',
  source: 'SRD',
  size: 'large',
  type: 'monstrosity',
  alignment: 'unaligned',
  challengeRating: 2,
  experiencePoints: 450,
  armorClass: 14,
  hitPoints: { count: 6, die: 'd10', notation: '6d10+12' },
  speed: { walk: 30, burrow: 10 },
  abilities: { str: 17, dex: 11, con: 13, int: 1, wis: 13, cha: 6 },
  senses: ['darkvision 60 ft.', 'tremorsense 60 ft.', 'passive Perception 11'],
  languages: [],
  actions: [
    {
      name: 'Bite',
      description: 'Melee Weapon Attack: +5 to hit, reach 5 ft., one target.',
      attackBonus: 5,
      reach: 5,
      damage: [
        { dice: { count: 2, die: 'd6', notation: '2d6+3' }, type: 'slashing' },
        { dice: { count: 1, die: 'd6', notation: '1d6' }, type: 'acid' },
      ],
    },
    {
      name: 'Acid Spray',
      description:
        'The ankheg spits acid in a line that is 30 feet long and 5 feet wide. Each creature in that line must make a DC 13 Dexterity saving throw, taking 3d6 acid damage on a failed save, or half as much on a successful one.',
      recharge: '6',
    },
  ],
  description: 'Burrowing insectoid predators that ambush prey from underground.',
  environment: ['forest', 'grassland'],
};

export const banshee: Monster = {
  id: 'banshee',
  name: 'Banshee',
  system: 'dnd-5e-2014',
  source: 'SRD',
  size: 'medium',
  type: 'undead',
  alignment: 'chaotic evil',
  challengeRating: 4,
  experiencePoints: 1100,
  armorClass: 12,
  hitPoints: { count: 13, die: 'd8', notation: '13d8' },
  speed: { walk: 0, fly: 40 },
  abilities: { str: 1, dex: 14, con: 10, int: 12, wis: 11, cha: 17 },
  savingThrows: { wis: 2, cha: 5 },
  damageResistances: [
    'acid',
    'fire',
    'lightning',
    'thunder',
    'bludgeoning',
    'piercing',
    'slashing',
  ],
  damageImmunities: ['cold', 'necrotic', 'poison'],
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
  languages: ['Common', 'Elvish'],
  specialAbilities: [
    {
      name: 'Incorporeal Movement',
      description:
        'The banshee can move through other creatures and objects as if they were difficult terrain. It takes 5 (1d10) force damage if it ends its turn inside an object.',
    },
  ],
  actions: [
    {
      name: 'Corrupting Touch',
      description: 'Melee Spell Attack: +4 to hit, reach 5 ft., one target.',
      attackBonus: 4,
      reach: 5,
      damage: [{ dice: { count: 3, die: 'd8', notation: '3d8+3' }, type: 'necrotic' }],
    },
    {
      name: 'Wail',
      description:
        'The banshee releases a mournful wail. This wail has no effect on constructs and undead. All other creatures within 30 feet that can hear the banshee must make a DC 13 Constitution saving throw. On a failure, a creature drops to 0 hit points. On a success, a creature takes 3d6 psychic damage.',
      recharge: '5-6',
    },
  ],
  description: 'The woeful spirit of an elf, bound by tragedy.',
  environment: ['any'],
};

export const basilisk: Monster = {
  id: 'basilisk',
  name: 'Basilisk',
  system: 'dnd-5e-2014',
  source: 'SRD',
  size: 'medium',
  type: 'monstrosity',
  alignment: 'unaligned',
  challengeRating: 3,
  experiencePoints: 700,
  armorClass: 15,
  hitPoints: { count: 8, die: 'd8', notation: '8d8+16' },
  speed: { walk: 20 },
  abilities: { str: 16, dex: 8, con: 15, int: 2, wis: 8, cha: 7 },
  senses: ['darkvision 60 ft.', 'passive Perception 9'],
  languages: [],
  specialAbilities: [
    {
      name: 'Petrifying Gaze',
      description:
        "If a creature starts its turn within 30 feet of the basilisk and can see the basilisk's eyes, the basilisk can force it to make a DC 12 Constitution saving throw if the basilisk isn't incapacitated. On a failed save, the creature magically begins to turn to stone and is restrained. A creature restrained in this way must make another Constitution saving throw at the end of its next turn. On a success, the effect ends. On a failure, the creature is petrified until freed by the greater restoration spell or other magic.",
    },
  ],
  actions: [
    {
      name: 'Bite',
      description: 'Melee Weapon Attack: +5 to hit, reach 5 ft., one target.',
      attackBonus: 5,
      reach: 5,
      damage: [
        { dice: { count: 2, die: 'd6', notation: '2d6+3' }, type: 'piercing' },
        { dice: { count: 2, die: 'd6', notation: '2d6' }, type: 'poison' },
      ],
    },
  ],
  description: 'A reptilian monster whose gaze turns victims to stone.',
  environment: ['underground', 'desert'],
};

export const dnd5eCR2to5Monsters: Monster[] = [
  ogre,
  ghoul,
  ankheg,
  owlbear,
  basilisk,
  werewolf,
  blackDragonWyrmling,
  banshee,
  flameskull,
  gladiator,
  troll,
  youngWhiteDragon,
];
