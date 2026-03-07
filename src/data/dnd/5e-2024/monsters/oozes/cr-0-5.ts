import { Monster } from '../../../../../types/creatures/monsters';

// D&D 5e-2024 Oozes - CR 0-5 (SRD 5.2)
// Gelatinous cubes and small oozes

export const gelatinousCube: Monster = {
  id: 'gelatinous-cube-2024',
  name: 'Gelatinous Cube',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  size: 'large',
  type: 'ooze',
  alignment: 'unaligned',
  armorClass: 6,
  hitPoints: { count: 10, die: 'd10', modifier: 20, notation: '10d10+20' },
  speed: { walk: 15 },
  abilities: { str: 14, dex: 3, con: 16, int: 1, wis: 6, cha: 1 },
  conditionImmunities: ['blinded', 'charmed', 'deafened', 'exhaustion', 'frightened', 'prone'],
  senses: ['blindsight 60 ft.', 'passive Perception 8'],
  languages: [],
  challengeRating: 3,
  experiencePoints: 700,
  specialAbilities: [
    {
      name: 'Engulfing Movement',
      description:
        "The cube can enter a hostile creature's space and stop there. It can move through a space as narrow as 3 feet wide.",
    },
    {
      name: 'Transparent',
      description:
        "Even when the cube is in plain sight, it takes a successful DC 15 Wisdom (Perception) check to spot the cube if it has neither moved nor attacked. A creature that tries to enter the cube's space while unaware of it is surprised by the cube.",
    },
  ],
  actions: [
    {
      name: 'Engulf',
      description:
        'Melee Weapon Attack: +4 to hit, reach 5 ft., one creature. Hit: 13 (2d8 + 4) acid damage. If the cube hits a Medium or smaller creature, the target is also grappled (escape DC 12). Until this grapple ends, the target is restrained and unable to breathe unless it can breathe water. If the cube moves, the grappled creature moves with it.',
    },
  ],
  environment: ['dungeon', 'underdark'],
};

export const oozesCR0to5: Monster[] = [gelatinousCube];
