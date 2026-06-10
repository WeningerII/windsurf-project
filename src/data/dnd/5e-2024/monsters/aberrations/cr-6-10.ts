import { Monster } from '../../../../../types/creatures/monsters';

// D&D 5e-2024 Aberrations - CR 6-10 (SRD 5.2)
// NOTE: The former 'mind-flayer-2024' entry was removed. Mind flayers /
// illithids are WotC Product Identity and appear in no SRD (5.1 or 5.2), so
// the statblock cannot ship under an SRD citation. See
// docs/srd-manifest/dnd5e-2024.ts for the exclusion record.

export const aboleth: Monster = {
  id: 'aboleth-2024',
  name: 'Aboleth',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  size: 'large',
  type: 'aberration',
  alignment: 'chaotic evil',
  armorClass: 17,
  hitPoints: { count: 18, die: 'd10', modifier: 90, notation: '18d10+90' },
  speed: { walk: 10, swim: 40 },
  abilities: { str: 21, dex: 9, con: 20, int: 18, wis: 15, cha: 18 },
  savingThrows: { int: 8, wis: 6, cha: 8 },
  skills: { History: 12, Perception: 10 },
  damageImmunities: ['psychic'],
  conditionImmunities: [
    'charmed',
    'exhaustion',
    'frightened',
    'paralyzed',
    'petrified',
    'poisoned',
    'prone',
    'restrained',
  ],
  senses: ['darkvision 120 ft.', 'passive Perception 20'],
  languages: ['Abyssal', 'telepathy 120 ft.'],
  challengeRating: 10,
  experiencePoints: 5900,
  specialAbilities: [
    {
      name: 'Amphibious',
      description: 'The aboleth can breathe air and water.',
    },
    {
      name: 'Legendary Resistance',
      description:
        'If the aboleth fails a saving throw, it can choose to succeed instead. It can use this trait three times and regains expended uses when it finishes a long rest.',
    },
    {
      name: 'Mucous Cloud',
      description:
        'While underwater, the aboleth is surrounded by transformative mucus. A creature that touches the aboleth or that hits it with a melee attack while within 5 feet of it must make a DC 16 Constitution saving throw. On a failure, the creature is diseased for 1d4 hours. The diseased creature can breathe only underwater.',
    },
  ],
  actions: [
    {
      name: 'Multiattack',
      description: 'The aboleth makes three tentacle attacks.',
    },
    {
      name: 'Tentacle',
      description:
        "Melee Weapon Attack: +9 to hit, reach 30 ft., one target. Hit: 12 (2d6 + 5) bludgeoning damage. If the target is a creature, it must succeed on a DC 16 Constitution saving throw or become diseased. The disease has no effect for 1 minute and can be removed by any magic that cures disease. After 1 minute, the diseased creature's skin becomes translucent and slimy, the creature can't regain hit points unless it is underwater, and the disease can be removed only by heal or another disease-curing spell of 6th level or higher. When the creature is outside a body of salt water, it takes 6 (1d12) acid damage every 10 minutes unless moisture is applied to the skin before the 10 minutes have elapsed.",
    },
  ],
  legendaryActions: [
    {
      name: 'Detect',
      cost: 1,
      description: 'The aboleth makes a Wisdom (Perception) check.',
    },
    {
      name: 'Tail',
      cost: 1,
      description: 'The aboleth makes one tail attack.',
    },
    {
      name: 'Tentacle Attack',
      cost: 2,
      description: 'The aboleth makes two tentacle attacks.',
    },
  ],
  environment: ['underdark', 'water'],
};

export const aberrationsCR6to10: Monster[] = [aboleth];
