import { Monster } from '../../../../../types/creatures/monsters';

// D&D 5e-2024 Aberrations - CR 0-5 (SRD 5.2)
// Mind flayers, grimlocks, and other aberrations

export const grimlock: Monster = {
  id: 'grimlock-2024',
  name: 'Grimlock',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  size: 'medium',
  type: 'aberration',
  alignment: 'neutral evil',
  armorClass: 13,
  hitPoints: { count: 2, die: 'd8', modifier: 4, notation: '2d8+4' },
  speed: { walk: 30, climb: 30 },
  abilities: { str: 16, dex: 12, con: 14, int: 3, wis: 8, cha: 6 },
  skills: { Athletics: 5 },
  senses: ['blindsight 30 ft.', 'passive Perception 9'],
  languages: [],
  challengeRating: 0.25,
  experiencePoints: 50,
  specialAbilities: [
    {
      name: 'Blind Senses',
      description: "The grimlock can't use its blindsight while deafened and unable to smell.",
    },
    {
      name: 'Keen Smell',
      description: 'The grimlock has advantage on Wisdom (Perception) checks that rely on smell.',
    },
  ],
  actions: [
    {
      name: 'Spiked Bone Club',
      description:
        'Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 7 (1d8 + 3) bludgeoning damage.',
      attackBonus: 5,
      reach: 5,
      damage: [
        { dice: { count: 1, die: 'd8', modifier: 3, notation: '1d8+3' }, type: 'bludgeoning' },
      ],
    },
  ],
  environment: ['underdark'],
};

export const chuul: Monster = {
  id: 'chuul-2024',
  name: 'Chuul',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  size: 'large',
  type: 'aberration',
  alignment: 'chaotic evil',
  armorClass: 16,
  hitPoints: { count: 15, die: 'd10', modifier: 30, notation: '15d10+30' },
  speed: { walk: 30, swim: 30 },
  abilities: { str: 19, dex: 15, con: 16, int: 2, wis: 10, cha: 6 },
  skills: { Stealth: 7 },
  senses: ['darkvision 60 ft.', 'passive Perception 12'],
  languages: ['Undercommon'],
  challengeRating: 4,
  experiencePoints: 1300,
  specialAbilities: [
    {
      name: 'Amphibious',
      description: 'The chuul can breathe air and water.',
    },
    {
      name: 'Spider Climb',
      description:
        'The chuul can climb difficult surfaces, including upside down on ceilings, without needing to make an ability check.',
    },
  ],
  actions: [
    {
      name: 'Multiattack',
      description: 'The chuul makes two attacks: one with its bite and one with its claws.',
    },
    {
      name: 'Bite',
      description:
        'Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 11 (2d6 + 4) piercing damage.',
      attackBonus: 7,
      reach: 5,
      damage: [{ dice: { count: 2, die: 'd6', modifier: 4, notation: '2d6+4' }, type: 'piercing' }],
    },
    {
      name: 'Claws',
      description:
        'Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 13 (2d8 + 4) slashing damage.',
      attackBonus: 7,
      reach: 5,
      damage: [{ dice: { count: 2, die: 'd8', modifier: 4, notation: '2d8+4' }, type: 'slashing' }],
    },
  ],
  environment: ['underdark'],
};

export const otyugh: Monster = {
  id: 'otyugh-2024',
  name: 'Otyugh',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  size: 'large',
  type: 'aberration',
  alignment: 'true neutral',
  armorClass: 14,
  hitPoints: { count: 6, die: 'd10', modifier: 12, notation: '6d10+12' },
  speed: { walk: 30 },
  abilities: { str: 16, dex: 11, con: 16, int: 6, wis: 13, cha: 6 },
  savingThrows: { con: 5 },
  senses: ['darkvision 120 ft.', 'passive Perception 11'],
  languages: ['Otyugh'],
  challengeRating: 5,
  experiencePoints: 1800,
  specialAbilities: [
    {
      name: 'Limited Telepathy',
      description:
        "The otyugh can magically transmit simple messages and images to any creature within 120 feet of it that can see it. Communication is limited by the otyugh's Intelligence score. The creature can't transmit emotions or sensory experiences other than images.",
    },
  ],
  actions: [
    {
      name: 'Multiattack',
      description: 'The otyugh makes three attacks: one with its bite and two with its tentacles.',
    },
    {
      name: 'Bite',
      description:
        'Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 12 (2d8 + 3) piercing damage.',
      attackBonus: 6,
      reach: 5,
      damage: [{ dice: { count: 2, die: 'd8', modifier: 3, notation: '2d8+3' }, type: 'piercing' }],
    },
    {
      name: 'Tentacle',
      description:
        'Melee Weapon Attack: +6 to hit, reach 15 ft., one target. Hit: 10 (2d6 + 3) bludgeoning damage. If the target is Medium or smaller, it is grappled (escape DC 14). Until this grapple ends, the target is restrained and unable to breathe unless it can breathe water. If the otyugh moves, the grappled creature moves with it.',
      attackBonus: 6,
      reach: 15,
      damage: [
        { dice: { count: 2, die: 'd6', modifier: 3, notation: '2d6+3' }, type: 'bludgeoning' },
      ],
    },
  ],
  environment: ['underdark', 'dungeon'],
};

export const aberrationsCR0to5: Monster[] = [grimlock, chuul, otyugh];
