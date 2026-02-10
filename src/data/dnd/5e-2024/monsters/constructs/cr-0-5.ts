import { Monster } from '../../../../../types/creatures/monsters';

// D&D 5e-2024 Constructs - CR 0-5 (SRD 5.2)
// Golems and magical constructs

export const clayGolem: Monster = {
  id: 'clay-golem-2024',
  name: 'Clay Golem',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  size: 'large',
  type: 'construct',
  alignment: 'unaligned',
  armorClass: 14,
  hitPoints: { count: 13, die: 'd10', modifier: 39, notation: '13d10+39' },
  speed: { walk: 20 },
  abilities: { str: 20, dex: 9, con: 16, int: 3, wis: 8, cha: 1 },
  damageImmunities: ['acid', 'poison', 'psychic'],
  conditionImmunities: ['charmed', 'exhaustion', 'frightened', 'paralyzed', 'petrified', 'poisoned'],
  senses: ['darkvision 60 ft.', 'passive Perception 9'],
  languages: ['understands the languages of its creator but can\'t speak'],
  challengeRating: 5,
  experiencePoints: 1800,
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
      description: 'Melee Weapon Attack: +8 to hit, reach 5 ft., one target. Hit: 13 (2d8 + 5) bludgeoning damage.',
    },
  ],
  environment: ['dungeon', 'tower'],
};

export const constructsCR0to5: Monster[] = [
  clayGolem,
];
