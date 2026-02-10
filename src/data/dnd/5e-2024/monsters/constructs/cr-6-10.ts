import { Monster } from '../../../../../types/creatures/monsters';

// D&D 5e-2024 Constructs - CR 6-10 (SRD 5.2)
// Stone and iron golems

export const ironGolem: Monster = {
  id: 'iron-golem-2024',
  name: 'Iron Golem',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  size: 'large',
  type: 'construct',
  alignment: 'unaligned',
  armorClass: 20,
  hitPoints: { count: 20, die: 'd10', modifier: 100, notation: '20d10+100' },
  speed: { walk: 30 },
  abilities: { str: 24, dex: 9, con: 20, int: 3, wis: 11, cha: 1 },
  damageImmunities: ['fire', 'poison', 'psychic', 'bludgeoning', 'piercing', 'slashing'],
  conditionImmunities: ['charmed', 'exhaustion', 'frightened', 'paralyzed', 'petrified', 'poisoned'],
  senses: ['darkvision 120 ft.', 'passive Perception 10'],
  languages: ['understands the languages of its creator but can\'t speak'],
  challengeRating: 16,
  experiencePoints: 15000,
  specialAbilities: [
    {
      name: 'Immutable Form',
      description: 'The golem is immune to any spell or effect that would alter its form.',
    },
    {
      name: 'Magic Resistance',
      description: 'The golem has advantage on saving throws against spells and magical effects.',
    },
    {
      name: 'Magic Weapons',
      description: 'The golem\'s weapon attacks are magical.',
    },
  ],
  actions: [
    {
      name: 'Multiattack',
      description: 'The golem makes two slam attacks.',
    },
    {
      name: 'Slam',
      description: 'Melee Weapon Attack: +13 to hit, reach 5 ft., one target. Hit: 20 (3d8 + 7) bludgeoning damage.',
    },
  ],
  environment: ['dungeon', 'tower'],
};

export const constructsCR6to10: Monster[] = [
  ironGolem,
];
