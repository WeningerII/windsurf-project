import { Monster } from '../../../../../types/creatures/monsters';

// D&D 5e-2024 Monstrosities - CR 0-5 (SRD 5.2)
// Chimeras, griffons, and other monstrosities

export const griffon: Monster = {
  id: 'griffon-2024',
  name: 'Griffon',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  size: 'large',
  type: 'monstrosity',
  alignment: 'unaligned',
  armorClass: 12,
  hitPoints: { count: 5, die: 'd10', modifier: 10, notation: '5d10+10' },
  speed: { walk: 30, fly: 80 },
  abilities: { str: 18, dex: 13, con: 14, int: 2, wis: 12, cha: 8 },
  skills: { Perception: 4 },
  senses: ['darkvision 60 ft.', 'passive Perception 14'],
  languages: [],
  challengeRating: 2,
  experiencePoints: 450,
  specialAbilities: [
    {
      name: 'Keen Sight',
      description: 'The griffon has advantage on Wisdom (Perception) checks that rely on sight.',
    },
  ],
  actions: [
    {
      name: 'Multiattack',
      description: 'The griffon makes two attacks: one with its beak and one with its claws.',
    },
    {
      name: 'Beak',
      description:
        'Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 8 (1d8 + 4) piercing damage.',
    },
    {
      name: 'Claws',
      description:
        'Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 11 (2d6 + 4) slashing damage.',
    },
  ],
  environment: ['mountain', 'grassland'],
};

export const monstrositiesCR0to5: Monster[] = [griffon];
