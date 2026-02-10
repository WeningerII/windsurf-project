import { Monster } from '../../../../../types/creatures/monsters';

// D&D 5e-2024 Constructs - CR 11+ (SRD 5.2)
// Powerful golems and constructs

export const stoneGolem: Monster = {
  id: 'stone-golem-2024',
  name: 'Stone Golem',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  size: 'large',
  type: 'construct',
  alignment: 'unaligned',
  armorClass: 17,
  hitPoints: { count: 17, die: 'd10', modifier: 85, notation: '17d10+85' },
  speed: { walk: 30 },
  abilities: { str: 22, dex: 9, con: 20, int: 3, wis: 11, cha: 1 },
  damageImmunities: ['poison', 'psychic', 'bludgeoning', 'piercing', 'slashing'],
  conditionImmunities: ['charmed', 'exhaustion', 'frightened', 'paralyzed', 'petrified', 'poisoned'],
  senses: ['darkvision 120 ft.', 'passive Perception 10'],
  languages: ['understands the languages of its creator but can\'t speak'],
  challengeRating: 10,
  experiencePoints: 5900,
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
      description: 'Melee Weapon Attack: +10 to hit, reach 5 ft., one target. Hit: 19 (3d8 + 6) bludgeoning damage.',
    },
  ],
  environment: ['dungeon', 'tower'],
};

export const constructsCR11Plus: Monster[] = [
  stoneGolem,
];
