import { Monster } from '../../../../../types/creatures/monsters';

// D&D 5e-2024 Undead - CR 0-5 (SRD 5.2)
// Common undead creatures

export const skeleton: Monster = {
  id: 'skeleton-2024',
  name: 'Skeleton',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  size: 'medium',
  type: 'undead',
  alignment: 'lawful evil',
  armorClass: 13,
  hitPoints: { count: 2, die: 'd8', modifier: 4, notation: '2d8+4' },
  speed: { walk: 30 },
  abilities: { str: 10, dex: 14, con: 15, int: 6, wis: 8, cha: 5 },
  damageVulnerabilities: ['bludgeoning'],
  damageImmunities: ['poison'],
  conditionImmunities: ['exhaustion', 'poisoned'],
  senses: ['darkvision 60 ft.', 'passive Perception 9'],
  languages: ["understands Common but can't speak"],
  challengeRating: 0.25,
  experiencePoints: 50,
  actions: [
    {
      name: 'Shortsword',
      description:
        'Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 5 (1d6 + 2) piercing damage.',
    },
    {
      name: 'Shortbow',
      description:
        'Ranged Weapon Attack: +4 to hit, range 80/320 ft., one target. Hit: 5 (1d6 + 2) piercing damage.',
    },
  ],
  environment: ['dungeon', 'ruins'],
};

export const zombie: Monster = {
  id: 'zombie-2024',
  name: 'Zombie',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  size: 'medium',
  type: 'undead',
  alignment: 'neutral evil',
  armorClass: 8,
  hitPoints: { count: 3, die: 'd8', modifier: 9, notation: '3d8+9' },
  speed: { walk: 20 },
  abilities: { str: 13, dex: 6, con: 16, int: 3, wis: 6, cha: 5 },
  savingThrows: { wis: 0 },
  damageImmunities: ['poison'],
  conditionImmunities: ['poisoned'],
  senses: ['darkvision 60 ft.', 'passive Perception 8'],
  languages: ["understands languages it knew in life but can't speak"],
  challengeRating: 0.25,
  experiencePoints: 50,
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
      description:
        'Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 4 (1d6 + 1) bludgeoning damage.',
    },
  ],
  environment: ['dungeon', 'ruins', 'graveyard'],
};

export const ghoul: Monster = {
  id: 'ghoul-2024',
  name: 'Ghoul',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  size: 'medium',
  type: 'undead',
  alignment: 'chaotic evil',
  armorClass: 12,
  hitPoints: { count: 5, die: 'd8', notation: '5d8' },
  speed: { walk: 30 },
  abilities: { str: 13, dex: 15, con: 10, int: 7, wis: 10, cha: 6 },
  damageImmunities: ['poison'],
  conditionImmunities: ['charmed', 'exhaustion', 'poisoned'],
  senses: ['darkvision 60 ft.', 'passive Perception 10'],
  languages: ['Common'],
  challengeRating: 1,
  experiencePoints: 200,
  actions: [
    {
      name: 'Bite',
      description:
        'Melee Weapon Attack: +2 to hit, reach 5 ft., one target. Hit: 9 (2d6 + 2) piercing damage.',
    },
    {
      name: 'Claws',
      description:
        'Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 7 (2d4 + 2) slashing damage. If the target is a creature other than an elf or undead, it must succeed on a DC 10 Constitution saving throw or be paralyzed for 1 minute. The target can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success.',
    },
  ],
  environment: ['dungeon', 'ruins', 'graveyard'],
};

export const shadow: Monster = {
  id: 'shadow-2024',
  name: 'Shadow',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  size: 'medium',
  type: 'undead',
  alignment: 'chaotic evil',
  armorClass: 12,
  hitPoints: { count: 3, die: 'd8', modifier: 3, notation: '3d8+3' },
  speed: { walk: 40 },
  abilities: { str: 6, dex: 14, con: 13, int: 6, wis: 10, cha: 8 },
  skills: { Stealth: 4 },
  damageVulnerabilities: ['radiant'],
  damageResistances: [
    'acid',
    'cold',
    'fire',
    'lightning',
    'thunder',
    'bludgeoning',
    'piercing',
    'slashing',
  ],
  damageImmunities: ['necrotic', 'poison'],
  conditionImmunities: [
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
  languages: [],
  challengeRating: 0.5,
  experiencePoints: 100,
  specialAbilities: [
    {
      name: 'Amorphous',
      description:
        'The shadow can move through a space as narrow as 1 inch wide without squeezing.',
    },
    {
      name: 'Shadow Stealth',
      description:
        'While in dim light or darkness, the shadow can take the Hide action as a bonus action.',
    },
    {
      name: 'Sunlight Weakness',
      description:
        'While in sunlight, the shadow has disadvantage on attack rolls, ability checks, and saving throws.',
    },
  ],
  actions: [
    {
      name: 'Strength Drain',
      description:
        "Melee Weapon Attack: +4 to hit, reach 5 ft., one creature. Hit: 9 (2d6 + 2) necrotic damage, and the target's Strength score is reduced by 1d4. The target dies if this reduces its Strength to 0. Otherwise, the reduction lasts until the target finishes a short or long rest.",
    },
  ],
  environment: ['dungeon', 'ruins'],
};

export const willOWisp: Monster = {
  id: 'will-o-wisp-2024',
  name: "Will-o'-Wisp",
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  size: 'tiny',
  type: 'undead',
  alignment: 'chaotic evil',
  armorClass: 19,
  hitPoints: { count: 9, die: 'd4', notation: '9d4' },
  speed: { walk: 0, fly: 50 },
  abilities: { str: 1, dex: 28, con: 10, int: 13, wis: 14, cha: 11 },
  damageResistances: [
    'acid',
    'cold',
    'fire',
    'necrotic',
    'thunder',
    'bludgeoning',
    'piercing',
    'slashing',
  ],
  damageImmunities: ['lightning', 'poison'],
  conditionImmunities: [
    'exhaustion',
    'grappled',
    'paralyzed',
    'poisoned',
    'prone',
    'restrained',
    'unconscious',
  ],
  senses: ['darkvision 120 ft.', 'passive Perception 12'],
  languages: ['the languages it knew in life'],
  challengeRating: 2,
  experiencePoints: 450,
  specialAbilities: [
    {
      name: 'Consume Life',
      description:
        "As a bonus action, the will-o'-wisp can target one creature it can see within 5 feet of it that has 0 hit points and is still alive. The target must succeed on a DC 10 Constitution saving throw against this magic or die. If the target dies, the will-o'-wisp regains 10 (3d6) hit points.",
    },
    {
      name: 'Ephemeral',
      description: "The will-o'-wisp can't wear or carry anything.",
    },
    {
      name: 'Incorporeal Movement',
      description:
        "The will-o'-wisp can move through other creatures and objects as if they were difficult terrain. It takes 5 (1d10) force damage if it ends its turn inside an object.",
    },
    {
      name: 'Variable Illumination',
      description:
        "The will-o'-wisp sheds bright light in a 5- to 20-foot radius and dim light for an additional number of feet equal to the chosen radius. The will-o'-wisp can alter the radius as a bonus action.",
    },
  ],
  actions: [
    {
      name: 'Shock',
      description:
        'Melee Spell Attack: +4 to hit, reach 5 ft., one creature. Hit: 9 (2d8) lightning damage.',
    },
  ],
  environment: ['swamp', 'ruins'],
};

export const undeadCR0to5: Monster[] = [skeleton, zombie, ghoul, shadow, willOWisp];
