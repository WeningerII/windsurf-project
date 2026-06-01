import { Monster } from '../../../../../types/creatures/monsters';

// D&D 5e-2024 Plants - CR 0-5 (SRD 5.2)
// Awakened shrubs and other plant creatures

export const awakenedShrub: Monster = {
  id: 'awakened-shrub-2024',
  name: 'Awakened Shrub',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  size: 'small',
  type: 'plant',
  alignment: 'chaotic good',
  armorClass: 9,
  hitPoints: { count: 1, die: 'd6', notation: '1d6' },
  speed: { walk: 20 },
  abilities: { str: 3, dex: 8, con: 11, int: 10, wis: 10, cha: 6 },
  damageVulnerabilities: ['fire'],
  damageResistances: ['piercing', 'slashing'],
  senses: ['passive Perception 10'],
  languages: ['one language known by its creator'],
  challengeRating: 0,
  experiencePoints: 10,
  actions: [
    {
      name: 'Rake',
      description:
        'Melee Weapon Attack: +1 to hit, reach 5 ft., one target. Hit: 1 (1d4 - 1) slashing damage.',
      attackBonus: 1,
      reach: 5,
      damage: [
        { dice: { count: 1, die: 'd4', modifier: -1, notation: '1d4-1' }, type: 'slashing' },
      ],
    },
  ],
  environment: ['forest'],
};

export const plantsCR0to5: Monster[] = [awakenedShrub];
