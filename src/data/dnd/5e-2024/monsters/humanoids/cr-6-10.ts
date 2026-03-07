import { Monster } from '../../../../../types/creatures/monsters';

// D&D 5e-2024 Humanoids - CR 6-10 (SRD 5.2)
// Powerful NPCs and humanoid leaders

export const captain: Monster = {
  id: 'captain-2024',
  name: 'Captain',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  size: 'medium',
  type: 'humanoid',
  alignment: 'lawful neutral',
  armorClass: 16,
  hitPoints: { count: 8, die: 'd8', modifier: 16, notation: '8d8+16' },
  speed: { walk: 30 },
  abilities: { str: 16, dex: 12, con: 14, int: 12, wis: 11, cha: 15 },
  savingThrows: { str: 5, dex: 3, wis: 2 },
  skills: { Athletics: 5, Deception: 4, Perception: 2 },
  senses: ['passive Perception 12'],
  languages: ['Common'],
  challengeRating: 2,
  experiencePoints: 450,
  specialAbilities: [
    {
      name: 'Brave',
      description: 'The captain has advantage on saving throws against being frightened.',
    },
  ],
  actions: [
    {
      name: 'Multiattack',
      description:
        'The captain makes three melee attacks: two with its longsword and one with its dagger. Or the captain makes two ranged attacks with its crossbows.',
    },
    {
      name: 'Longsword',
      description:
        'Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 7 (1d8 + 3) slashing damage.',
    },
    {
      name: 'Dagger',
      description:
        'Melee or Ranged Weapon Attack: +5 to hit, reach 5 ft. or range 20/60 ft., one target. Hit: 5 (1d4 + 3) piercing damage.',
    },
  ],
  reactions: [
    {
      name: 'Parry',
      description:
        'The captain adds 2 to its AC against one melee attack that would hit it. To do so, the captain must see the attacker and be wielding a melee weapon.',
    },
  ],
  environment: ['urban', 'any'],
};

export const mage: Monster = {
  id: 'mage-2024',
  name: 'Mage',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  size: 'medium',
  type: 'humanoid',
  alignment: 'true neutral',
  armorClass: 12,
  hitPoints: { count: 6, die: 'd8', modifier: 6, notation: '6d8+6' },
  speed: { walk: 30 },
  abilities: { str: 9, dex: 14, con: 12, int: 16, wis: 13, cha: 11 },
  savingThrows: { int: 5, wis: 3 },
  skills: { Arcana: 7, History: 7 },
  senses: ['passive Perception 11'],
  languages: ['Common', 'two other languages'],
  challengeRating: 6,
  experiencePoints: 2300,
  specialAbilities: [
    {
      name: 'Magic Resistance',
      description: 'The mage has advantage on saving throws against spells and magical effects.',
    },
    {
      name: 'Spellcasting',
      description:
        'The mage is a 9th-level spellcaster. Its spellcasting ability is Intelligence (spell save DC 15, +7 to hit with spell attacks). The mage has the following wizard spells prepared: Cantrips (at will): fire bolt, light, mage hand, prestidigitation; 1st level (4 slots): detect magic, mage armor, magic missile, shield; 2nd level (3 slots): misty step, scorching ray; 3rd level (3 slots): counterspell, fireball, fly; 4th level (3 slots): greater invisibility, ice storm; 5th level (1 slot): cone of cold.',
    },
  ],
  actions: [
    {
      name: 'Dagger',
      description:
        'Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 2 (1d4) piercing damage.',
    },
  ],
  environment: ['urban', 'tower'],
};

export const warlord: Monster = {
  id: 'warlord-2024',
  name: 'Warlord',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  size: 'medium',
  type: 'humanoid',
  alignment: 'chaotic evil',
  armorClass: 16,
  hitPoints: { count: 11, die: 'd8', modifier: 22, notation: '11d8+22' },
  speed: { walk: 30 },
  abilities: { str: 19, dex: 13, con: 15, int: 12, wis: 12, cha: 15 },
  savingThrows: { str: 7, con: 5, wis: 4 },
  skills: { Athletics: 7, Intimidation: 5 },
  senses: ['passive Perception 11'],
  languages: ['Common'],
  challengeRating: 7,
  experiencePoints: 2900,
  specialAbilities: [
    {
      name: 'Brave',
      description: 'The warlord has advantage on saving throws against being frightened.',
    },
    {
      name: 'Parry',
      description:
        'The warlord adds 3 to its AC against one melee attack that would hit it. To do so, the warlord must see the attacker and be wielding a melee weapon.',
    },
  ],
  actions: [
    {
      name: 'Multiattack',
      description: 'The warlord makes three longsword attacks.',
    },
    {
      name: 'Longsword',
      description:
        'Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 10 (1d8 + 4) slashing damage, or 11 (1d10 + 4) slashing damage if used with two hands.',
    },
  ],
  environment: ['any'],
};

export const necromancer: Monster = {
  id: 'necromancer-2024',
  name: 'Necromancer',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  size: 'medium',
  type: 'humanoid',
  alignment: 'chaotic evil',
  armorClass: 12,
  hitPoints: { count: 11, die: 'd8', modifier: 22, notation: '11d8+22' },
  speed: { walk: 30 },
  abilities: { str: 9, dex: 14, con: 14, int: 17, wis: 12, cha: 11 },
  savingThrows: { int: 6, wis: 4 },
  skills: { Arcana: 9, Religion: 6 },
  damageResistances: ['necrotic'],
  senses: ['passive Perception 11'],
  languages: ['Common', 'two other languages'],
  challengeRating: 9,
  experiencePoints: 5000,
  specialAbilities: [
    {
      name: 'Spellcasting',
      description:
        'The necromancer is a 13th-level spellcaster. Its spellcasting ability is Intelligence (spell save DC 16, +8 to hit with spell attacks). The necromancer has the following wizard spells prepared: Cantrips (at will): chill touch, mage hand, prestidigitation; 1st level (4 slots): detect magic, magic missile, shield; 2nd level (3 slots): blindness/deafness, scorching ray; 3rd level (3 slots): animate dead, counterspell, dispel magic; 4th level (3 slots): blight, dimension door; 5th level (2 slots): cloudkill, cone of cold; 6th level (1 slot): circle of death.',
    },
  ],
  actions: [
    {
      name: 'Dagger',
      description:
        'Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 2 (1d4) piercing damage.',
    },
  ],
  environment: ['underdark', 'tower'],
};

export const humanoidsCR6to10: Monster[] = [captain, mage, warlord, necromancer];
