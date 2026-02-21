import { Monster } from '../../../../../types/creatures/monsters';

// D&D 5e-2024 Giants - CR 0-5 (SRD 5.2)
// Small giants and giant-kin

export const hillGiant: Monster = {
  id: 'hill-giant-2024',
  name: 'Hill Giant',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  size: 'huge',
  type: 'giant',
  alignment: 'chaotic evil',
  armorClass: 13,
  hitPoints: { count: 10, die: 'd12', modifier: 40, notation: '10d12+40' },
  speed: { walk: 40 },
  abilities: { str: 21, dex: 8, con: 19, int: 5, wis: 9, cha: 6 },
  skills: { Perception: 3 },
  senses: ['passive Perception 13'],
  languages: ['Giant'],
  challengeRating: 5,
  experiencePoints: 1800,
  actions: [
    {
      name: 'Multiattack',
      description: 'The giant makes two greatclub attacks.',
    },
    {
      name: 'Greatclub',
      description: 'Melee Weapon Attack: +8 to hit, reach 10 ft., one target. Hit: 18 (4d8) bludgeoning damage.',
    },
    {
      name: 'Rock',
      description: 'Ranged Weapon Attack: +8 to hit, range 60/240 ft., one target. Hit: 21 (6d6) bludgeoning damage.',
    },
  ],
  environment: ['mountain', 'hill'],
};

export const giantsCR0to5: Monster[] = [
  hillGiant,
];
