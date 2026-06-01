import { Monster } from '../../../../../types/creatures/monsters';

// D&D 5e-2024 Undead - CR 6-10 (SRD 5.2)
// Wraiths, mummies, and powerful undead

export const wraith: Monster = {
  id: 'wraith-2024',
  name: 'Wraith',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  size: 'medium',
  type: 'undead',
  alignment: 'chaotic evil',
  armorClass: 13,
  hitPoints: { count: 6, die: 'd8', modifier: 18, notation: '6d8+18' },
  speed: { walk: 0, fly: 60 },
  abilities: { str: 6, dex: 16, con: 16, int: 12, wis: 14, cha: 15 },
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
    'charmed',
    'exhaustion',
    'grappled',
    'paralyzed',
    'petrified',
    'poisoned',
    'prone',
    'restrained',
  ],
  senses: ['darkvision 60 ft.', 'passive Perception 12'],
  languages: ['Common'],
  challengeRating: 5,
  experiencePoints: 1800,
  specialAbilities: [
    {
      name: 'Incorporeal Movement',
      description:
        'The wraith can move through other creatures and objects as if they were difficult terrain. It takes 5 (1d10) force damage if it ends its turn inside an object.',
    },
    {
      name: 'Sunlight Sensitivity',
      description:
        'While in sunlight, the wraith has disadvantage on attack rolls, as well as on Wisdom (Perception) checks that rely on sight.',
    },
  ],
  actions: [
    {
      name: 'Life Drain',
      description:
        'Melee Weapon Attack: +6 to hit, reach 5 ft., one creature. Hit: 22 (4d8 + 4) necrotic damage. The target must succeed on a DC 14 Constitution saving throw or its hit point maximum is reduced by an amount equal to the damage taken. This reduction lasts until the target finishes a long rest. The target dies if this effect reduces its hit point maximum to 0.',
      attackBonus: 6,
      reach: 5,
      damage: [{ dice: { count: 4, die: 'd8', modifier: 4, notation: '4d8+4' }, type: 'necrotic' }],
    },
  ],
  environment: ['underdark', 'ruins'],
};

export const mummy: Monster = {
  id: 'mummy-2024',
  name: 'Mummy',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  size: 'medium',
  type: 'undead',
  alignment: 'lawful evil',
  armorClass: 11,
  hitPoints: { count: 9, die: 'd8', modifier: 27, notation: '9d8+27' },
  speed: { walk: 20 },
  abilities: { str: 16, dex: 8, con: 15, int: 6, wis: 16, cha: 12 },
  savingThrows: { wis: 5 },
  damageImmunities: ['necrotic', 'poison'],
  damageResistances: ['bludgeoning', 'piercing', 'slashing'],
  conditionImmunities: ['charmed', 'exhaustion', 'frightened', 'paralyzed', 'poisoned'],
  senses: ['darkvision 60 ft.', 'passive Perception 13'],
  languages: ['Common'],
  challengeRating: 3,
  experiencePoints: 700,
  specialAbilities: [
    {
      name: 'Curse of the Mummy',
      description:
        'Any creature that starts its turn within 5 feet of the mummy must succeed on a DC 13 Wisdom saving throw or be cursed. A cursed creature has disadvantage on attack rolls and saving throws. The curse lasts until removed by a remove curse spell or similar magic.',
    },
  ],
  actions: [
    {
      name: 'Multiattack',
      description: 'The mummy makes two melee attacks.',
    },
    {
      name: 'Rotting Fist',
      description:
        'Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 10 (2d6 + 3) bludgeoning damage plus 10 (3d6) necrotic damage.',
      attackBonus: 5,
      reach: 5,
      damage: [
        { dice: { count: 2, die: 'd6', modifier: 3, notation: '2d6+3' }, type: 'bludgeoning' },
        { dice: { count: 3, die: 'd6', notation: '3d6' }, type: 'necrotic' },
      ],
    },
  ],
  environment: ['dungeon', 'ruins', 'tomb'],
};

export const vampireSpawn: Monster = {
  id: 'vampire-spawn-2024',
  name: 'Vampire Spawn',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  size: 'medium',
  type: 'undead',
  alignment: 'chaotic evil',
  armorClass: 15,
  hitPoints: { count: 10, die: 'd8', modifier: 20, notation: '10d8+20' },
  speed: { walk: 30, fly: 30 },
  abilities: { str: 16, dex: 16, con: 14, int: 11, wis: 10, cha: 12 },
  savingThrows: { dex: 5, wis: 2 },
  skills: { Perception: 2, Stealth: 7 },
  damageResistances: ['necrotic', 'bludgeoning', 'piercing', 'slashing'],
  senses: ['darkvision 60 ft.', 'passive Perception 12'],
  languages: ['Common'],
  challengeRating: 5,
  experiencePoints: 1800,
  specialAbilities: [
    {
      name: 'Regeneration',
      description:
        "The vampire spawn regains 6 hit points at the start of its turn if it has at least 1 hit point and isn't in sunlight or running water. If the spawn takes radiant damage or damage from holy water, this trait doesn't function at the start of the spawn's next turn.",
    },
    {
      name: 'Spider Climb',
      description:
        'The vampire spawn can climb difficult surfaces, including upside down on ceilings, without needing to make an ability check.',
    },
    {
      name: 'Vampire Weaknesses',
      description:
        "The vampire spawn has the following flaws: Forbiddance. The spawn can't enter a residence without an invitation from one of the occupants. Harmed by Running Water. The spawn takes 20 acid damage when it ends a turn in running water. Stake to the Heart. If a piercing weapon made of wood is driven into the spawn's heart while the spawn is incapacitated in its resting place, the spawn is paralyzed until the stake is removed. Sunlight Hypersensitivity. The spawn takes 20 radiant damage when it starts its turn in sunlight. While in sunlight, it has disadvantage on attack rolls and ability checks.",
    },
  ],
  actions: [
    {
      name: 'Multiattack',
      description: 'The spawn makes two melee attacks, or uses Parry and makes one melee attack.',
    },
    {
      name: 'Claw',
      description:
        'Melee Weapon Attack: +5 to hit, reach 5 ft., one creature. Hit: 6 (1d6 + 3) slashing damage. Instead of dealing damage, the spawn can grapple the target (escape DC 13).',
      attackBonus: 5,
      reach: 5,
      damage: [{ dice: { count: 1, die: 'd6', modifier: 3, notation: '1d6+3' }, type: 'slashing' }],
    },
    {
      name: 'Bite',
      description:
        "Melee Weapon Attack: +5 to hit, reach 5 ft., one willing creature, or a creature that is grappled by the spawn, incapacitated, or restrained. Hit: 6 (1d6 + 3) piercing damage plus 7 (2d6) necrotic damage. The target's hit point maximum is reduced by an amount equal to the necrotic damage taken, and the spawn regains hit points equal to that amount. The reduction lasts until the target finishes a long rest. The target dies if this effect reduces its hit point maximum to 0.",
      attackBonus: 5,
      reach: 5,
      damage: [
        { dice: { count: 1, die: 'd6', modifier: 3, notation: '1d6+3' }, type: 'piercing' },
        { dice: { count: 2, die: 'd6', notation: '2d6' }, type: 'necrotic' },
      ],
    },
  ],
  environment: ['urban', 'underdark'],
};

export const undeadCR6to10: Monster[] = [wraith, mummy, vampireSpawn];
