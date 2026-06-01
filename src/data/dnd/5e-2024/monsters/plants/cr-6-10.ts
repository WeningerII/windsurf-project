import { Monster } from '../../../../../types/creatures/monsters';

// D&D 5e-2024 Plants - CR 6-10 (SRD 5.2)
// Treants and other powerful plants

export const treant: Monster = {
  id: 'treant-2024',
  name: 'Treant',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  size: 'huge',
  type: 'plant',
  alignment: 'chaotic good',
  armorClass: 16,
  hitPoints: { count: 13, die: 'd12', modifier: 39, notation: '13d12+39' },
  speed: { walk: 30 },
  abilities: { str: 21, dex: 8, con: 16, int: 12, wis: 16, cha: 12 },
  damageVulnerabilities: ['fire'],
  damageResistances: ['bludgeoning', 'piercing'],
  senses: ['passive Perception 13'],
  languages: ['Common', 'Druidic', 'Sylvan'],
  challengeRating: 9,
  experiencePoints: 5000,
  specialAbilities: [
    {
      name: 'False Appearance',
      description:
        'While the treant remains motionless, it is indistinguishable from a normal tree.',
    },
    {
      name: 'Siege Monster',
      description: 'The treant deals double damage to objects and structures.',
    },
  ],
  actions: [
    {
      name: 'Multiattack',
      description: 'The treant makes two slam attacks.',
    },
    {
      name: 'Slam',
      description:
        'Melee Weapon Attack: +9 to hit, reach 5 ft., one target. Hit: 15 (3d6 + 5) bludgeoning damage.',
      attackBonus: 9,
      reach: 5,
      damage: [
        { dice: { count: 3, die: 'd6', modifier: 5, notation: '3d6+5' }, type: 'bludgeoning' },
      ],
    },
    {
      name: 'Rock',
      description:
        'Ranged Weapon Attack: +9 to hit, range 60/240 ft., one target. Hit: 28 (4d10 + 5) bludgeoning damage.',
      attackBonus: 9,
      reach: 60,
      damage: [
        { dice: { count: 4, die: 'd10', modifier: 5, notation: '4d10+5' }, type: 'bludgeoning' },
      ],
    },
  ],
  environment: ['forest'],
};

export const plantsCR6to10: Monster[] = [treant];
