import { Monster } from '../../../../../types/creatures/monsters';

// D&D 5e-2024 Monstrosities - CR 6-10 (SRD 5.2)
// Hydras, manticores, and powerful monstrosities

export const hydra: Monster = {
  id: 'hydra-2024',
  name: 'Hydra',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  size: 'huge',
  type: 'monstrosity',
  alignment: 'unaligned',
  armorClass: 15,
  hitPoints: { count: 11, die: 'd12', modifier: 44, notation: '11d12+44' },
  speed: { walk: 30, swim: 30 },
  abilities: { str: 20, dex: 12, con: 18, int: 3, wis: 12, cha: 7 },
  skills: { Perception: 4 },
  senses: ['darkvision 60 ft.', 'passive Perception 14'],
  languages: [],
  challengeRating: 8,
  experiencePoints: 3900,
  specialAbilities: [
    {
      name: 'Multiple Heads',
      description:
        'The hydra has five heads. While it has more than one head, the hydra has advantage on Wisdom (Perception) checks and on saving throws against being blinded, charmed, deafened, frightened, stunned, and knocked unconscious. Whenever the hydra takes 25 or more damage in a single turn, one of its heads dies. If all its heads die, the hydra dies. At the end of its turn, it grows two heads for each of its heads that died since its last turn, unless it has taken fire damage since its last turn. The hydra regains 10 hit points for each head regrown this way.',
    },
    {
      name: 'Reactive Heads',
      description:
        'For each head the hydra has beyond one, it gets an extra reaction that can be used only for opportunity attacks.',
    },
    {
      name: 'Wakeful',
      description: 'While the hydra sleeps, at least one of its heads is awake.',
    },
  ],
  actions: [
    {
      name: 'Multiattack',
      description: 'The hydra makes as many bite attacks as it has heads.',
    },
    {
      name: 'Bite',
      description:
        'Melee Weapon Attack: +8 to hit, reach 10 ft., one target. Hit: 10 (1d10 + 5) piercing damage.',
    },
  ],
  environment: ['swamp', 'water'],
};

export const manticore: Monster = {
  id: 'manticore-2024',
  name: 'Manticore',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  size: 'large',
  type: 'monstrosity',
  alignment: 'unaligned',
  armorClass: 16,
  hitPoints: { count: 13, die: 'd10', modifier: 39, notation: '13d10+39' },
  speed: { walk: 30, fly: 30 },
  abilities: { str: 19, dex: 16, con: 16, int: 7, wis: 10, cha: 6 },
  skills: { Stealth: 5 },
  senses: ['darkvision 60 ft.', 'passive Perception 12'],
  languages: [],
  challengeRating: 7,
  experiencePoints: 2500,
  specialAbilities: [
    {
      name: 'Flyby Attack',
      description:
        "The manticore doesn't provoke opportunity attacks when it flies out of an enemy's reach.",
    },
    {
      name: 'Keen Hearing',
      description:
        'The manticore can hear sounds that are too faint for others to detect. It can also pinpoint the source of sounds it can hear.',
    },
  ],
  actions: [
    {
      name: 'Multiattack',
      description: 'The manticore makes three attacks: one with its bite and two with its claws.',
    },
    {
      name: 'Bite',
      description:
        'Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 8 (1d6 + 4) piercing damage.',
    },
    {
      name: 'Claw',
      description:
        'Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 8 (1d6 + 4) slashing damage.',
    },
    {
      name: 'Tail Spike',
      description:
        'Ranged Weapon Attack: +7 to hit, range 100/400 ft., one target. Hit: 8 (1d6 + 4) piercing damage.',
    },
  ],
  environment: ['desert', 'grassland', 'mountain'],
};

export const monstrositiesCR6to10: Monster[] = [hydra, manticore];
