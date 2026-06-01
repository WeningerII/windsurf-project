import { Monster } from '../../../../../types/creatures/monsters';

// D&D 5e-2024 Aberrations - CR 6-10 (SRD 5.2)
// Mind flayers and other powerful aberrations

export const mindFlayer: Monster = {
  id: 'mind-flayer-2024',
  name: 'Mind Flayer',
  system: 'dnd-5e-2024',
  source: 'SRD 5.2',
  size: 'medium',
  type: 'aberration',
  alignment: 'lawful evil',
  armorClass: 15,
  hitPoints: { count: 22, die: 'd8', modifier: 44, notation: '22d8+44' },
  speed: { walk: 30 },
  abilities: { str: 11, dex: 12, con: 16, int: 17, wis: 16, cha: 17 },
  savingThrows: { int: 5, wis: 5, cha: 5 },
  skills: { Arcana: 5, Insight: 5 },
  damageResistances: ['psychic'],
  senses: ['darkvision 120 ft.', 'passive Perception 13'],
  languages: ['Deep Speech', 'telepathy 120 ft.'],
  challengeRating: 7,
  experiencePoints: 2900,
  specialAbilities: [
    {
      name: 'Magic Resistance',
      description:
        'The mind flayer has advantage on saving throws against spells and magical effects.',
    },
    {
      name: 'Innate Spellcasting',
      description:
        "The mind flayer's innate spellcasting ability is Intelligence (spell save DC 13). It can innately cast the following spells, requiring no material components: At will: mage hand, minor illusion; 1/day each: charm person, detect thoughts, feeblemind, levitate, plane shift.",
    },
  ],
  actions: [
    {
      name: 'Bite',
      description:
        'Melee Weapon Attack: +5 to hit, reach 5 ft., one creature. Hit: 32 (4d12 + 2) piercing damage.',
      attackBonus: 5,
      reach: 5,
      damage: [
        { dice: { count: 4, die: 'd12', modifier: 2, notation: '4d12+2' }, type: 'piercing' },
      ],
    },
    {
      name: 'Tentacles',
      description:
        'Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 15 (2d10 + 2) psychic damage. If the target is Medium or smaller, it is grappled (escape DC 15) and unable to breathe unless it can breathe water. If the mind flayer loses its concentration, the grapple ends.',
      attackBonus: 5,
      reach: 5,
      damage: [
        { dice: { count: 2, die: 'd10', modifier: 2, notation: '2d10+2' }, type: 'psychic' },
      ],
    },
    {
      name: 'Extract Brain',
      description:
        'Melee Weapon Attack: +5 to hit, reach 5 ft., one incapacitated humanoid grappled by the mind flayer. Hit: The target takes 55 (10d10) piercing damage. If this damage reduces the target to 0 hit points, the mind flayer kills the target by extracting and devouring its brain.',
      attackBonus: 5,
      reach: 5,
      damage: [{ dice: { count: 10, die: 'd10', notation: '10d10' }, type: 'piercing' }],
    },
  ],
  environment: ['underdark'],
};

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
      attackBonus: 9,
      reach: 30,
      damage: [
        { dice: { count: 2, die: 'd6', modifier: 5, notation: '2d6+5' }, type: 'bludgeoning' },
      ],
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

export const aberrationsCR6to10: Monster[] = [mindFlayer, aboleth];
