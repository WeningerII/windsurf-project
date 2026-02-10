import { Monster } from '../../../../../types/creatures/monsters';

// D&D 5e-2024 Beasts - CR 11+ (SRD 5.2)
// Legendary and ancient beasts

export const tyrannosaurusRex: Monster = {
  id: 'tyrannosaurus-rex-2024',
  name: 'Tyrannosaurus Rex',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  size: 'huge',
  type: 'beast',
  alignment: 'unaligned',
  armorClass: 13,
  hitPoints: { count: 18, die: 'd12', modifier: 90, notation: '18d12+90' },
  speed: { walk: 50 },
  abilities: { str: 25, dex: 10, con: 21, int: 2, wis: 12, cha: 9 },
  skills: { Perception: 4 },
  senses: ['passive Perception 14'],
  languages: [],
  challengeRating: 8,
  experiencePoints: 3900,
  actions: [
    {
      name: 'Multiattack',
      description: 'The tyrannosaurus makes two attacks: one with its bite and one with its tail. It can\'t make both attacks against the same target.',
    },
    {
      name: 'Bite',
      description: 'Melee Weapon Attack: +10 to hit, reach 10 ft., one target. Hit: 33 (4d12 + 7) piercing damage. If the target is a Medium or smaller creature, it is grappled (escape DC 17). Until this grapple ends, the target is restrained, and the tyrannosaurus can\'t bite another target.',
    },
    {
      name: 'Tail',
      description: 'Melee Weapon Attack: +10 to hit, reach 10 ft., one target. Hit: 20 (3d8 + 7) bludgeoning damage.',
    },
  ],
  environment: ['grassland', 'forest'],
};

export const beastsCR11Plus: Monster[] = [
  tyrannosaurusRex,
];
