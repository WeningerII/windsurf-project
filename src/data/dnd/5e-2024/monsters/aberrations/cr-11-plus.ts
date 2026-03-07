import { Monster } from '../../../../../types/creatures/monsters';

// D&D 5e-2024 Aberrations - CR 11+ (SRD 5.2)
// Elder brain and other ancient aberrations

export const elderBrain: Monster = {
  id: 'elder-brain-2024',
  name: 'Elder Brain',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  size: 'large',
  type: 'aberration',
  alignment: 'lawful evil',
  armorClass: 10,
  hitPoints: { count: 100, die: 'd12', modifier: 200, notation: '100d12+200' },
  speed: { walk: 0, swim: 30 },
  abilities: { str: 10, dex: 3, con: 15, int: 17, wis: 16, cha: 16 },
  savingThrows: { int: 6, wis: 6, cha: 6 },
  skills: { Arcana: 6, Insight: 6 },
  damageImmunities: ['acid', 'poison', 'psychic'],
  conditionImmunities: [
    'charmed',
    'exhaustion',
    'frightened',
    'paralyzed',
    'poisoned',
    'prone',
    'restrained',
  ],
  senses: ['truesight 120 ft.', 'passive Perception 13'],
  languages: ['Deep Speech', 'telepathy 5 miles'],
  challengeRating: 14,
  experiencePoints: 11500,
  specialAbilities: [
    {
      name: 'Legendary Resistance',
      description:
        'If the brain fails a saving throw, it can choose to succeed instead. It can use this trait three times and regains expended uses when it finishes a long rest.',
    },
    {
      name: 'Magic Resistance',
      description: 'The brain has advantage on saving throws against spells and magical effects.',
    },
  ],
  actions: [
    {
      name: 'Tentacles',
      description:
        'Melee Weapon Attack: +9 to hit, reach 30 ft., one target. Hit: 15 (2d8 + 6) psychic damage. If the target is a creature, it must succeed on a DC 16 Intelligence saving throw or be stunned until the end of its next turn.',
    },
  ],
  legendaryActions: [
    {
      name: 'Tentacle',
      cost: 1,
      description: 'The brain makes one tentacles attack.',
    },
    {
      name: 'Psychic Scream',
      cost: 2,
      description:
        'Each creature within 60 feet of the brain that can hear it must make a DC 16 Intelligence saving throw, taking 22 (4d10) psychic damage on a failed save, or half as much on a successful one.',
    },
  ],
  environment: ['underdark'],
};

export const aberrationsCR11Plus: Monster[] = [elderBrain];
