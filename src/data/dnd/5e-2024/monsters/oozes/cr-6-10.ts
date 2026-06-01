import { Monster } from '../../../../../types/creatures/monsters';

// D&D 5e-2024 Oozes - CR 6-10 (SRD 5.2)
// Black puddings and other dangerous oozes

export const blackPudding: Monster = {
  id: 'black-pudding-2024',
  name: 'Black Pudding',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  size: 'large',
  type: 'ooze',
  alignment: 'unaligned',
  armorClass: 7,
  hitPoints: { count: 11, die: 'd10', modifier: 33, notation: '11d10+33' },
  speed: { walk: 20, climb: 20 },
  abilities: { str: 16, dex: 5, con: 16, int: 1, wis: 6, cha: 1 },
  damageImmunities: ['acid', 'cold', 'lightning', 'poison', 'slashing'],
  conditionImmunities: ['blinded', 'charmed', 'deafened', 'exhaustion', 'frightened', 'prone'],
  senses: ['blindsight 60 ft.', 'passive Perception 8'],
  languages: [],
  challengeRating: 4,
  experiencePoints: 1100,
  specialAbilities: [
    {
      name: 'Amorphous',
      description: "The pudding can occupy another creature's space and vice versa.",
    },
    {
      name: 'Corrosive Form',
      description:
        'A creature that touches the pudding or hits it with a melee attack while within 5 feet of it takes 4 (1d8) acid damage. Any nonmagical weapon made of metal or wood that hits the pudding corrodes. After dealing damage, the weapon takes a permanent and cumulative -1 penalty to damage rolls. If its penalty drops to -5, the weapon is destroyed. Nonmagical ammunition made of metal or wood that hits the pudding is destroyed after dealing damage.',
    },
  ],
  actions: [
    {
      name: 'Pseudopod',
      description:
        'Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 6 (1d6 + 3) bludgeoning damage plus 7 (2d6) acid damage.',
      attackBonus: 5,
      reach: 5,
      damage: [
        { dice: { count: 1, die: 'd6', modifier: 3, notation: '1d6+3' }, type: 'bludgeoning' },
        { dice: { count: 2, die: 'd6', notation: '2d6' }, type: 'acid' },
      ],
    },
  ],
  environment: ['dungeon', 'underdark'],
};

export const oozesCR6to10: Monster[] = [blackPudding];
