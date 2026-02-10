import { Monster } from '../../../../../types/creatures/monsters';

// D&D 5e-2024 Humanoids - CR 0-5 (SRD 5.2)
// Common NPCs and humanoid creatures

export const commoner: Monster = {
  id: 'commoner-2024',
  name: 'Commoner',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  size: 'medium',
  type: 'humanoid',
  alignment: 'true neutral',
  armorClass: 10,
  hitPoints: { count: 1, die: 'd8', notation: '1d8' },
  speed: { walk: 30 },
  abilities: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
  senses: ['passive Perception 10'],
  languages: ['Common'],
  challengeRating: 0,
  experiencePoints: 10,
  actions: [
    {
      name: 'Club',
      description: 'Melee Weapon Attack: +2 to hit, reach 5 ft., one target. Hit: 2 (1d4) bludgeoning damage.',
    },
  ],
  environment: ['urban', 'any'],
};

export const guard: Monster = {
  id: 'guard-2024',
  name: 'Guard',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  size: 'medium',
  type: 'humanoid',
  alignment: 'lawful neutral',
  armorClass: 16,
  hitPoints: { count: 2, die: 'd8', modifier: 2, notation: '2d8+2' },
  speed: { walk: 30 },
  abilities: { str: 13, dex: 12, con: 12, int: 10, wis: 11, cha: 10 },
  skills: { Perception: 2 },
  senses: ['passive Perception 12'],
  languages: ['Common'],
  challengeRating: 0.125,
  experiencePoints: 25,
  actions: [
    {
      name: 'Spear',
      description: 'Melee or Ranged Weapon Attack: +3 to hit, reach 5 ft. or range 20/60 ft., one target. Hit: 4 (1d6 + 1) piercing damage, or 5 (1d8 + 1) piercing damage if used with two hands to make a melee attack.',
    },
  ],
  environment: ['urban'],
};

export const bandit: Monster = {
  id: 'bandit-2024',
  name: 'Bandit',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  size: 'medium',
  type: 'humanoid',
  alignment: 'chaotic neutral',
  armorClass: 12,
  hitPoints: { count: 2, die: 'd8', modifier: 2, notation: '2d8+2' },
  speed: { walk: 30 },
  abilities: { str: 11, dex: 12, con: 12, int: 10, wis: 10, cha: 10 },
  senses: ['passive Perception 10'],
  languages: ['Common'],
  challengeRating: 0.125,
  experiencePoints: 25,
  actions: [
    {
      name: 'Scimitar',
      description: 'Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 4 (1d6 + 1) slashing damage.',
    },
    {
      name: 'Light Crossbow',
      description: 'Ranged Weapon Attack: +3 to hit, range 80/320 ft., one target. Hit: 5 (1d8 + 1) piercing damage.',
    },
  ],
  environment: ['forest', 'road'],
};

export const cultist: Monster = {
  id: 'cultist-2024',
  name: 'Cultist',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  size: 'medium',
  type: 'humanoid',
  alignment: 'chaotic evil',
  armorClass: 12,
  hitPoints: { count: 2, die: 'd8', notation: '2d8' },
  speed: { walk: 30 },
  abilities: { str: 11, dex: 12, con: 10, int: 10, wis: 11, cha: 10 },
  skills: { Deception: 2, Religion: 2 },
  senses: ['passive Perception 10'],
  languages: ['Common'],
  challengeRating: 0.125,
  experiencePoints: 25,
  actions: [
    {
      name: 'Scimitar',
      description: 'Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 4 (1d6 + 1) slashing damage.',
    },
  ],
  environment: ['urban', 'dungeon'],
};

export const noble: Monster = {
  id: 'noble-2024',
  name: 'Noble',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  size: 'medium',
  type: 'humanoid',
  alignment: 'lawful neutral',
  armorClass: 15,
  hitPoints: { count: 2, die: 'd8', modifier: 2, notation: '2d8+2' },
  speed: { walk: 30 },
  abilities: { str: 11, dex: 12, con: 11, int: 12, wis: 14, cha: 16 },
  skills: { Deception: 3, Insight: 4, Persuasion: 5 },
  senses: ['passive Perception 12'],
  languages: ['Common', 'one additional language'],
  challengeRating: 0.125,
  experiencePoints: 25,
  actions: [
    {
      name: 'Rapier',
      description: 'Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 5 (1d8 + 1) piercing damage.',
    },
  ],
  reactions: [
    {
      name: 'Parry',
      description: 'The noble adds 2 to its AC against one melee attack that would hit it. To do so, the noble must see the attacker and be wielding a melee weapon.',
    },
  ],
  environment: ['urban'],
};

export const goblin: Monster = {
  id: 'goblin-2024',
  name: 'Goblin',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  size: 'small',
  type: 'humanoid',
  alignment: 'neutral evil',
  armorClass: 15,
  hitPoints: { count: 2, die: 'd6', notation: '2d6' },
  speed: { walk: 30 },
  abilities: { str: 8, dex: 14, con: 10, int: 10, wis: 8, cha: 8 },
  skills: { Stealth: 6 },
  senses: ['darkvision 60 ft.', 'passive Perception 9'],
  languages: ['Common', 'Goblin'],
  challengeRating: 0.25,
  experiencePoints: 50,
  specialAbilities: [
    {
      name: 'Nimble Escape',
      description: 'The goblin can take the Disengage or Hide action as a bonus action on each of its turns.',
    },
  ],
  actions: [
    {
      name: 'Scimitar',
      description: 'Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 5 (1d6 + 2) slashing damage.',
    },
    {
      name: 'Shortbow',
      description: 'Ranged Weapon Attack: +4 to hit, range 80/320 ft., one target. Hit: 5 (1d6 + 2) piercing damage.',
    },
  ],
  environment: ['forest', 'hill', 'underdark'],
};

export const orc: Monster = {
  id: 'orc-2024',
  name: 'Orc',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  size: 'medium',
  type: 'humanoid',
  alignment: 'chaotic evil',
  armorClass: 13,
  hitPoints: { count: 2, die: 'd8', modifier: 6, notation: '2d8+6' },
  speed: { walk: 30 },
  abilities: { str: 16, dex: 12, con: 16, int: 7, wis: 11, cha: 10 },
  skills: { Intimidation: 2 },
  senses: ['darkvision 60 ft.', 'passive Perception 10'],
  languages: ['Common', 'Orc'],
  challengeRating: 0.5,
  experiencePoints: 100,
  specialAbilities: [
    {
      name: 'Aggressive',
      description: 'As a bonus action, the orc can move up to its speed toward a hostile creature that it can see.',
    },
  ],
  actions: [
    {
      name: 'Greataxe',
      description: 'Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 9 (1d12 + 3) slashing damage.',
    },
    {
      name: 'Javelin',
      description: 'Melee or Ranged Weapon Attack: +5 to hit, reach 5 ft. or range 30/120 ft., one target. Hit: 6 (1d6 + 3) piercing damage.',
    },
  ],
  environment: ['mountain', 'underdark'],
};

export const acolyte: Monster = {
  id: 'acolyte-2024',
  name: 'Acolyte',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  size: 'medium',
  type: 'humanoid',
  alignment: 'lawful neutral',
  armorClass: 10,
  hitPoints: { count: 2, die: 'd8', notation: '2d8' },
  speed: { walk: 30 },
  abilities: { str: 10, dex: 10, con: 10, int: 10, wis: 14, cha: 11 },
  skills: { Medicine: 4, Religion: 2 },
  senses: ['passive Perception 12'],
  languages: ['Common'],
  challengeRating: 0.25,
  experiencePoints: 50,
  actions: [
    {
      name: 'Club',
      description: 'Melee Weapon Attack: +2 to hit, reach 5 ft., one target. Hit: 2 (1d4) bludgeoning damage.',
    },
  ],
  environment: ['urban', 'temple'],
};

export const kobold: Monster = {
  id: 'kobold-2024',
  name: 'Kobold',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  size: 'small',
  type: 'humanoid',
  alignment: 'lawful evil',
  armorClass: 12,
  hitPoints: { count: 2, die: 'd6', notation: '2d6' },
  speed: { walk: 30 },
  abilities: { str: 7, dex: 15, con: 9, int: 8, wis: 7, cha: 8 },
  senses: ['darkvision 60 ft.', 'passive Perception 8'],
  languages: ['Common', 'Draconic'],
  challengeRating: 0.125,
  experiencePoints: 25,
  specialAbilities: [
    {
      name: 'Sunlight Sensitivity',
      description: 'While in sunlight, the kobold has disadvantage on attack rolls, as well as on Wisdom (Perception) checks that rely on sight.',
    },
    {
      name: 'Pack Tactics',
      description: 'The kobold has advantage on an attack roll against a creature if at least one of the kobold\'s allies is within 5 feet of the creature and the ally isn\'t incapacitated.',
    },
  ],
  actions: [
    {
      name: 'Dagger',
      description: 'Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 4 (1d4 + 2) piercing damage.',
    },
    {
      name: 'Sling',
      description: 'Ranged Weapon Attack: +4 to hit, range 30/120 ft., one target. Hit: 4 (1d4 + 2) bludgeoning damage.',
    },
  ],
  environment: ['underdark', 'forest'],
};

export const hobgoblin: Monster = {
  id: 'hobgoblin-2024',
  name: 'Hobgoblin',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  size: 'medium',
  type: 'humanoid',
  alignment: 'lawful evil',
  armorClass: 18,
  hitPoints: { count: 2, die: 'd8', modifier: 2, notation: '2d8+2' },
  speed: { walk: 30 },
  abilities: { str: 13, dex: 12, con: 12, int: 10, wis: 10, cha: 9 },
  senses: ['darkvision 60 ft.', 'passive Perception 10'],
  languages: ['Common', 'Goblin'],
  challengeRating: 0.5,
  experiencePoints: 100,
  specialAbilities: [
    {
      name: 'Martial Advantage',
      description: 'Once per turn, the hobgoblin can deal an extra 7 (2d6) damage to a creature it hits with a weapon attack if that creature is within 5 feet of an ally of the hobgoblin that isn\'t incapacitated.',
    },
  ],
  actions: [
    {
      name: 'Longsword',
      description: 'Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 5 (1d8 + 1) slashing damage, or 6 (1d10 + 1) slashing damage if used with two hands.',
    },
    {
      name: 'Longbow',
      description: 'Ranged Weapon Attack: +3 to hit, range 150/600 ft., one target. Hit: 5 (1d8 + 1) piercing damage.',
    },
  ],
  environment: ['forest', 'mountain'],
};

export const bugbear: Monster = {
  id: 'bugbear-2024',
  name: 'Bugbear',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  size: 'medium',
  type: 'humanoid',
  alignment: 'chaotic evil',
  armorClass: 16,
  hitPoints: { count: 5, die: 'd8', modifier: 5, notation: '5d8+5' },
  speed: { walk: 30 },
  abilities: { str: 15, dex: 14, con: 13, int: 8, wis: 11, cha: 9 },
  skills: { Stealth: 6, Survival: 2 },
  senses: ['darkvision 60 ft.', 'passive Perception 10'],
  languages: ['Common', 'Goblin'],
  challengeRating: 1,
  experiencePoints: 200,
  specialAbilities: [
    {
      name: 'Brute',
      description: 'A melee weapon deals one extra die of its damage when the bugbear hits with it (included in the attack).',
    },
    {
      name: 'Surprise Attack',
      description: 'If the bugbear surprises a creature and hits it with an attack during the first round of combat, the target takes an extra 7 (2d6) damage from the attack.',
    },
  ],
  actions: [
    {
      name: 'Morningstar',
      description: 'Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 11 (2d8 + 2) piercing damage.',
    },
    {
      name: 'Javelin',
      description: 'Melee or Ranged Weapon Attack: +4 to hit, reach 5 ft. or range 30/120 ft., one target. Hit: 9 (2d6 + 2) piercing damage in melee or 5 (1d6 + 2) piercing damage at range.',
    },
  ],
  environment: ['forest', 'underdark'],
};

export const scout: Monster = {
  id: 'scout-2024',
  name: 'Scout',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  size: 'medium',
  type: 'humanoid',
  alignment: 'true neutral',
  armorClass: 13,
  hitPoints: { count: 3, die: 'd8', modifier: 3, notation: '3d8+3' },
  speed: { walk: 30 },
  abilities: { str: 11, dex: 14, con: 12, int: 11, wis: 13, cha: 11 },
  skills: { Nature: 4, Perception: 5, Stealth: 6, Survival: 5 },
  senses: ['passive Perception 15'],
  languages: ['Common'],
  challengeRating: 0.5,
  experiencePoints: 100,
  specialAbilities: [
    {
      name: 'Keen Hearing and Sight',
      description: 'The scout has advantage on Wisdom (Perception) checks that rely on hearing or sight.',
    },
  ],
  actions: [
    {
      name: 'Multiattack',
      description: 'The scout makes two melee attacks or two ranged attacks.',
    },
    {
      name: 'Shortsword',
      description: 'Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 5 (1d6 + 2) piercing damage.',
    },
    {
      name: 'Longbow',
      description: 'Ranged Weapon Attack: +4 to hit, range 150/600 ft., one target. Hit: 6 (1d8 + 2) piercing damage.',
    },
  ],
  environment: ['forest', 'grassland'],
};

export const spy: Monster = {
  id: 'spy-2024',
  name: 'Spy',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  size: 'medium',
  type: 'humanoid',
  alignment: 'true neutral',
  armorClass: 12,
  hitPoints: { count: 6, die: 'd8', modifier: 6, notation: '6d8+6' },
  speed: { walk: 30 },
  abilities: { str: 10, dex: 15, con: 10, int: 12, wis: 14, cha: 16 },
  skills: { Deception: 5, Insight: 4, Investigation: 5, Perception: 6, Persuasion: 5, Sleight_of_Hand: 4, Stealth: 4 },
  senses: ['passive Perception 16'],
  languages: ['Common', 'two other languages'],
  challengeRating: 1,
  experiencePoints: 200,
  specialAbilities: [
    {
      name: 'Cunning Action',
      description: 'On each of its turns, the spy can use a bonus action to take the Dash, Disengage, or Hide action.',
    },
    {
      name: 'Sneak Attack',
      description: 'Once per turn, the spy deals an extra 7 (2d6) damage when it hits a target with a weapon attack and has advantage on the attack roll, or when the target is within 5 feet of an ally of the spy that isn\'t incapacitated and the spy doesn\'t have disadvantage on the attack roll.',
    },
  ],
  actions: [
    {
      name: 'Multiattack',
      description: 'The spy makes two melee attacks.',
    },
    {
      name: 'Shortsword',
      description: 'Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 5 (1d6 + 2) piercing damage.',
    },
    {
      name: 'Hand Crossbow',
      description: 'Ranged Weapon Attack: +4 to hit, range 30/120 ft., one target. Hit: 5 (1d6 + 2) piercing damage.',
    },
  ],
  environment: ['urban'],
};

export const thug: Monster = {
  id: 'thug-2024',
  name: 'Thug',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  size: 'medium',
  type: 'humanoid',
  alignment: 'neutral evil',
  armorClass: 11,
  hitPoints: { count: 5, die: 'd8', modifier: 5, notation: '5d8+5' },
  speed: { walk: 30 },
  abilities: { str: 15, dex: 11, con: 14, int: 10, wis: 10, cha: 11 },
  skills: { Intimidation: 2 },
  senses: ['passive Perception 10'],
  languages: ['Common'],
  challengeRating: 0.5,
  experiencePoints: 100,
  specialAbilities: [
    {
      name: 'Pack Tactics',
      description: 'The thug has advantage on an attack roll against a creature if at least one of the thug\'s allies is within 5 feet of the creature and the ally isn\'t incapacitated.',
    },
  ],
  actions: [
    {
      name: 'Multiattack',
      description: 'The thug makes two melee attacks.',
    },
    {
      name: 'Mace',
      description: 'Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 5 (1d6 + 2) bludgeoning damage.',
    },
    {
      name: 'Heavy Crossbow',
      description: 'Ranged Weapon Attack: +2 to hit, range 100/400 ft., one target. Hit: 5 (1d10) piercing damage.',
    },
  ],
  environment: ['urban'],
};

export const veteran: Monster = {
  id: 'veteran-2024',
  name: 'Veteran',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  size: 'medium',
  type: 'humanoid',
  alignment: 'true neutral',
  armorClass: 17,
  hitPoints: { count: 9, die: 'd8', modifier: 18, notation: '9d8+18' },
  speed: { walk: 30 },
  abilities: { str: 16, dex: 13, con: 14, int: 10, wis: 11, cha: 10 },
  skills: { Athletics: 5, Perception: 2 },
  senses: ['passive Perception 12'],
  languages: ['Common'],
  challengeRating: 3,
  experiencePoints: 700,
  actions: [
    {
      name: 'Multiattack',
      description: 'The veteran makes two longsword attacks. If it has a shortsword drawn, it can also make a shortsword attack.',
    },
    {
      name: 'Longsword',
      description: 'Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 7 (1d8 + 3) slashing damage, or 8 (1d10 + 3) slashing damage if used with two hands.',
    },
    {
      name: 'Shortsword',
      description: 'Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 6 (1d6 + 3) piercing damage.',
    },
    {
      name: 'Heavy Crossbow',
      description: 'Ranged Weapon Attack: +3 to hit, range 100/400 ft., one target. Hit: 6 (1d10 + 1) piercing damage.',
    },
  ],
  environment: ['urban', 'any'],
};

export const berserker: Monster = {
  id: 'berserker-2024',
  name: 'Berserker',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  size: 'medium',
  type: 'humanoid',
  alignment: 'chaotic neutral',
  armorClass: 13,
  hitPoints: { count: 9, die: 'd8', modifier: 18, notation: '9d8+18' },
  speed: { walk: 30 },
  abilities: { str: 16, dex: 12, con: 15, int: 9, wis: 11, cha: 9 },
  senses: ['passive Perception 10'],
  languages: ['Common'],
  challengeRating: 2,
  experiencePoints: 450,
  specialAbilities: [
    {
      name: 'Reckless',
      description: 'At the start of its turn, the berserker can gain advantage on all melee weapon attack rolls during that turn, but attack rolls against it have advantage until the start of its next turn.',
    },
  ],
  actions: [
    {
      name: 'Greataxe',
      description: 'Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 9 (1d12 + 3) slashing damage.',
    },
  ],
  environment: ['any'],
};

export const druid: Monster = {
  id: 'druid-2024',
  name: 'Druid',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  size: 'medium',
  type: 'humanoid',
  alignment: 'true neutral',
  armorClass: 11,
  hitPoints: { count: 5, die: 'd8', modifier: 5, notation: '5d8+5' },
  speed: { walk: 30 },
  abilities: { str: 10, dex: 12, con: 13, int: 12, wis: 15, cha: 11 },
  skills: { Medicine: 4, Nature: 3, Perception: 4 },
  senses: ['passive Perception 14'],
  languages: ['Druidic', 'Common'],
  challengeRating: 2,
  experiencePoints: 450,
  specialAbilities: [
    {
      name: 'Spellcasting',
      description: 'The druid is a 4th-level spellcaster. Its spellcasting ability is Wisdom (spell save DC 12, +4 to hit with spell attacks). The druid has the following druid spells prepared: Cantrips (at will): druidcraft, produce flame, shillelagh; 1st level (4 slots): entangle, longstrider, speak with animals, thunderwave; 2nd level (3 slots): animal messenger, barkskin.',
    },
  ],
  actions: [
    {
      name: 'Quarterstaff',
      description: 'Melee Weapon Attack: +2 to hit (+4 to hit with shillelagh), reach 5 ft., one target. Hit: 3 (1d6) bludgeoning damage, or 4 (1d8) bludgeoning damage if wielded with two hands, or 6 (1d8 + 2) bludgeoning damage with shillelagh.',
    },
  ],
  environment: ['forest', 'grassland'],
};

export const priest: Monster = {
  id: 'priest-2024',
  name: 'Priest',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  size: 'medium',
  type: 'humanoid',
  alignment: 'true neutral',
  armorClass: 13,
  hitPoints: { count: 5, die: 'd8', modifier: 5, notation: '5d8+5' },
  speed: { walk: 30 },
  abilities: { str: 10, dex: 10, con: 12, int: 13, wis: 16, cha: 13 },
  skills: { Medicine: 7, Persuasion: 3, Religion: 4 },
  senses: ['passive Perception 13'],
  languages: ['Common', 'two other languages'],
  challengeRating: 2,
  experiencePoints: 450,
  specialAbilities: [
    {
      name: 'Divine Eminence',
      description: 'As a bonus action, the priest can expend a spell slot to cause its melee weapon attacks to magically deal an extra 10 (3d6) radiant damage to a target on a hit. This benefit lasts until the end of the turn. If the priest expends a spell slot of 2nd level or higher, the extra damage increases by 1d6 for each level above 1st.',
    },
    {
      name: 'Spellcasting',
      description: 'The priest is a 5th-level spellcaster. Its spellcasting ability is Wisdom (spell save DC 13, +5 to hit with spell attacks). The priest has the following cleric spells prepared: Cantrips (at will): light, sacred flame, thaumaturgy; 1st level (4 slots): cure wounds, guiding bolt, sanctuary; 2nd level (3 slots): lesser restoration, spiritual weapon; 3rd level (2 slots): dispel magic, spirit guardians.',
    },
  ],
  actions: [
    {
      name: 'Mace',
      description: 'Melee Weapon Attack: +2 to hit, reach 5 ft., one target. Hit: 3 (1d6) bludgeoning damage.',
    },
  ],
  environment: ['urban', 'temple'],
};

export const knight: Monster = {
  id: 'knight-2024',
  name: 'Knight',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  size: 'medium',
  type: 'humanoid',
  alignment: 'lawful good',
  armorClass: 18,
  hitPoints: { count: 8, die: 'd8', modifier: 16, notation: '8d8+16' },
  speed: { walk: 30 },
  abilities: { str: 16, dex: 11, con: 14, int: 11, wis: 11, cha: 15 },
  savingThrows: { con: 4, wis: 2 },
  senses: ['passive Perception 10'],
  languages: ['Common'],
  challengeRating: 3,
  experiencePoints: 700,
  specialAbilities: [
    {
      name: 'Brave',
      description: 'The knight has advantage on saving throws against being frightened.',
    },
  ],
  actions: [
    {
      name: 'Multiattack',
      description: 'The knight makes two melee attacks.',
    },
    {
      name: 'Greatsword',
      description: 'Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 10 (2d6 + 3) slashing damage.',
    },
    {
      name: 'Heavy Crossbow',
      description: 'Ranged Weapon Attack: +2 to hit, range 100/400 ft., one target. Hit: 5 (1d10) piercing damage.',
    },
  ],
  reactions: [
    {
      name: 'Parry',
      description: 'The knight adds 2 to its AC against one melee attack that would hit it. To do so, the knight must see the attacker and be wielding a melee weapon.',
    },
  ],
  environment: ['urban', 'castle'],
};

export const gladiator: Monster = {
  id: 'gladiator-2024',
  name: 'Gladiator',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  size: 'medium',
  type: 'humanoid',
  alignment: 'true neutral',
  armorClass: 16,
  hitPoints: { count: 15, die: 'd8', modifier: 30, notation: '15d8+30' },
  speed: { walk: 30 },
  abilities: { str: 18, dex: 15, con: 16, int: 10, wis: 12, cha: 15 },
  savingThrows: { str: 7, dex: 5, con: 6 },
  skills: { Athletics: 10, Intimidation: 5 },
  senses: ['passive Perception 11'],
  languages: ['Common'],
  challengeRating: 5,
  experiencePoints: 1800,
  specialAbilities: [
    {
      name: 'Brave',
      description: 'The gladiator has advantage on saving throws against being frightened.',
    },
    {
      name: 'Brute',
      description: 'A melee weapon deals one extra die of its damage when the gladiator hits with it (included in the attack).',
    },
  ],
  actions: [
    {
      name: 'Multiattack',
      description: 'The gladiator makes three melee attacks or two ranged attacks.',
    },
    {
      name: 'Spear',
      description: 'Melee or Ranged Weapon Attack: +7 to hit, reach 5 ft. and range 20/60 ft., one target. Hit: 11 (2d6 + 4) piercing damage, or 13 (2d8 + 4) piercing damage if used with two hands to make a melee attack.',
    },
    {
      name: 'Shield Bash',
      description: 'Melee Weapon Attack: +7 to hit, reach 5 ft., one creature. Hit: 9 (2d4 + 4) bludgeoning damage. If the target is a Medium or smaller creature, it must succeed on a DC 15 Strength saving throw or be knocked prone.',
    },
  ],
  reactions: [
    {
      name: 'Parry',
      description: 'The gladiator adds 3 to its AC against one melee attack that would hit it. To do so, the gladiator must see the attacker and be wielding a melee weapon.',
    },
  ],
  environment: ['urban', 'arena'],
};

export const assassin: Monster = {
  id: 'assassin-2024',
  name: 'Assassin',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  size: 'medium',
  type: 'humanoid',
  alignment: 'neutral evil',
  armorClass: 15,
  hitPoints: { count: 12, die: 'd8', modifier: 24, notation: '12d8+24' },
  speed: { walk: 30 },
  abilities: { str: 11, dex: 16, con: 14, int: 13, wis: 11, cha: 10 },
  savingThrows: { dex: 6, int: 4 },
  skills: { Acrobatics: 6, Deception: 3, Perception: 3, Stealth: 9 },
  damageResistances: ['poison'],
  senses: ['passive Perception 13'],
  languages: ['Thieves\' Cant', 'Common', 'two other languages'],
  challengeRating: 8,
  experiencePoints: 3900,
  specialAbilities: [
    {
      name: 'Assassinate',
      description: 'During its first turn, the assassin has advantage on attack rolls against any creature that hasn\'t taken a turn. Any hit the assassin scores against a surprised creature is a critical hit.',
    },
    {
      name: 'Evasion',
      description: 'If the assassin is subjected to an effect that allows it to make a Dexterity saving throw to take only half damage, the assassin instead takes no damage if it succeeds on the saving throw, and only half damage if it fails.',
    },
    {
      name: 'Sneak Attack',
      description: 'Once per turn, the assassin deals an extra 14 (4d6) damage when it hits a target with a weapon attack and has advantage on the attack roll, or when the target is within 5 feet of an ally of the assassin that isn\'t incapacitated and the assassin doesn\'t have disadvantage on the attack roll.',
    },
  ],
  actions: [
    {
      name: 'Multiattack',
      description: 'The assassin makes two shortsword attacks.',
    },
    {
      name: 'Shortsword',
      description: 'Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 6 (1d6 + 3) piercing damage, and the target must make a DC 15 Constitution saving throw, taking 24 (7d6) poison damage on a failed save, or half as much damage on a successful one.',
    },
    {
      name: 'Light Crossbow',
      description: 'Ranged Weapon Attack: +6 to hit, range 80/320 ft., one target. Hit: 7 (1d8 + 3) piercing damage, and the target must make a DC 15 Constitution saving throw, taking 24 (7d6) poison damage on a failed save, or half as much damage on a successful one.',
    },
  ],
  environment: ['urban'],
};

export const humanoidsCR0to5: Monster[] = [
  commoner,
  guard,
  bandit,
  cultist,
  noble,
  goblin,
  orc,
  acolyte,
  kobold,
  hobgoblin,
  bugbear,
  scout,
  spy,
  thug,
  veteran,
  berserker,
  druid,
  priest,
  knight,
  gladiator,
  assassin,
];
