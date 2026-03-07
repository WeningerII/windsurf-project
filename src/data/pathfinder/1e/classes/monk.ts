import { CharacterClass } from '../../../../types/character-options/classes';

export const monk: CharacterClass = {
  id: 'monk',
  name: 'Monk',
  system: 'pf1e',
  source: 'Core Rulebook',
  version: '1.0',
  lastUpdated: '2026-01-13',
  sourceBook: {
    name: 'Pathfinder Core Rulebook',
    page: 56,
    url: 'https://www.d20pfsrd.com/classes/core-classes/monk/',
  },
  hitDie: 'd8',
  primaryAbility: ['wis', 'str', 'dex'],
  savingThrowProficiencies: ['str', 'dex', 'wis'],
  armorProficiencies: [],
  weaponProficiencies: [
    'club',
    'crossbow-light',
    'crossbow-heavy',
    'dagger',
    'handaxe',
    'javelin',
    'kama',
    'nunchaku',
    'quarterstaff',
    'sai',
    'shortspear',
    'short-sword',
    'shuriken',
    'siangham',
    'sling',
    'spear',
  ],
  toolProficiencies: [],
  skillProficiencies: {
    count: 4,
    options: [
      'acrobatics',
      'climb',
      'escape-artist',
      'intimidate',
      'knowledge-history',
      'knowledge-religion',
      'perception',
      'ride',
      'sense-motive',
      'stealth',
      'swim',
    ],
    label: 'Choose class skills (4 + Int modifier ranks per level)',
  },
  equipmentChoices: [],
  startingGold: { dice: '1d6', multiplier: 10 },
  features: [
    {
      level: 1,
      features: [
        {
          id: 'ac-bonus',
          name: 'AC Bonus',
          source: 'Monk 1',
          description:
            'When unarmored and unencumbered, add Wisdom bonus to AC and CMD. Gains +1 bonus at 4th level, increasing by 1 every four levels.',
        },
        {
          id: 'flurry-of-blows',
          name: 'Flurry of Blows',
          source: 'Monk 1',
          description:
            'Make one additional attack at -2 penalty on all attacks as a full-attack action.',
        },
        {
          id: 'stunning-fist',
          name: 'Stunning Fist',
          source: 'Monk 1',
          description: 'Gains Stunning Fist as a bonus feat. Uses per day equal to monk level.',
        },
        {
          id: 'unarmed-strike',
          name: 'Unarmed Strike',
          source: 'Monk 1',
          description: 'Gains Improved Unarmed Strike. Deals 1d6 damage (1d4 Small).',
        },
      ],
    },
    {
      level: 2,
      features: [
        {
          id: 'bonus-feat-2',
          name: 'Bonus Feat',
          source: 'Monk 2',
          description: 'Select a bonus feat from the monk bonus feat list.',
        },
        {
          id: 'evasion',
          name: 'Evasion',
          source: 'Monk 2',
          description: 'On successful Reflex save for half damage, take no damage instead.',
        },
      ],
    },
    {
      level: 3,
      features: [
        {
          id: 'fast-movement',
          name: 'Fast Movement (+10 ft)',
          source: 'Monk 3',
          description: 'Land speed increases by 10 feet when unarmored.',
        },
        {
          id: 'maneuver-training',
          name: 'Maneuver Training',
          source: 'Monk 3',
          description: 'Use monk level instead of BAB for CMB.',
        },
        {
          id: 'still-mind',
          name: 'Still Mind',
          source: 'Monk 3',
          description: '+2 bonus on saves against enchantment spells and effects.',
        },
      ],
    },
    {
      level: 4,
      features: [
        {
          id: 'ki-pool',
          name: 'Ki Pool',
          source: 'Monk 4',
          description: 'Gain ki pool equal to 1/2 monk level + Wisdom modifier.',
        },
        {
          id: 'slow-fall-20',
          name: 'Slow Fall (20 ft)',
          source: 'Monk 4',
          description: 'Reduce falling damage as if fall were 20 feet shorter.',
        },
      ],
    },
    {
      level: 5,
      features: [
        {
          id: 'high-jump',
          name: 'High Jump',
          source: 'Monk 5',
          description: 'Add monk level to Acrobatics checks to jump.',
        },
        {
          id: 'purity-of-body',
          name: 'Purity of Body',
          source: 'Monk 5',
          description: 'Immunity to all diseases.',
        },
      ],
    },
    {
      level: 6,
      features: [
        {
          id: 'bonus-feat-6',
          name: 'Bonus Feat',
          source: 'Monk 6',
          description: 'Gain another bonus feat.',
        },
        {
          id: 'fast-movement-20',
          name: 'Fast Movement (+20 ft)',
          source: 'Monk 6',
          description: 'Speed bonus increases to +20 feet.',
        },
      ],
    },
    {
      level: 7,
      features: [
        {
          id: 'wholeness-of-body',
          name: 'Wholeness of Body',
          source: 'Monk 7',
          description: 'Heal monk level HP by spending 2 ki points.',
        },
      ],
    },
    {
      level: 9,
      features: [
        {
          id: 'improved-evasion',
          name: 'Improved Evasion',
          source: 'Monk 9',
          description: 'Take half damage on failed Reflex save, no damage on success.',
        },
        {
          id: 'fast-movement-30',
          name: 'Fast Movement (+30 ft)',
          source: 'Monk 9',
          description: 'Speed bonus increases to +30 feet.',
        },
      ],
    },
    {
      level: 10,
      features: [
        {
          id: 'bonus-feat-10',
          name: 'Bonus Feat',
          source: 'Monk 10',
          description: 'Gain another bonus feat.',
        },
        {
          id: 'ki-strike-lawful',
          name: 'Ki Strike (Lawful)',
          source: 'Monk 10',
          description: 'Unarmed attacks count as lawful for DR.',
        },
      ],
    },
    {
      level: 11,
      features: [
        {
          id: 'diamond-body',
          name: 'Diamond Body',
          source: 'Monk 11',
          description: 'Immunity to all poisons.',
        },
      ],
    },
    {
      level: 12,
      features: [
        {
          id: 'abundant-step',
          name: 'Abundant Step',
          source: 'Monk 12',
          description: 'Dimension door as a move action for 2 ki points.',
        },
        {
          id: 'fast-movement-40',
          name: 'Fast Movement (+40 ft)',
          source: 'Monk 12',
          description: 'Speed bonus increases to +40 feet.',
        },
      ],
    },
    {
      level: 13,
      features: [
        {
          id: 'diamond-soul',
          name: 'Diamond Soul',
          source: 'Monk 13',
          description: 'Gain SR equal to monk level + 10.',
        },
      ],
    },
    {
      level: 14,
      features: [
        {
          id: 'bonus-feat-14',
          name: 'Bonus Feat',
          source: 'Monk 14',
          description: 'Gain another bonus feat.',
        },
      ],
    },
    {
      level: 15,
      features: [
        {
          id: 'quivering-palm',
          name: 'Quivering Palm',
          source: 'Monk 15',
          description: 'Set up vibrations that can kill target on command.',
        },
        {
          id: 'fast-movement-50',
          name: 'Fast Movement (+50 ft)',
          source: 'Monk 15',
          description: 'Speed bonus increases to +50 feet.',
        },
      ],
    },
    {
      level: 16,
      features: [
        {
          id: 'ki-strike-adamantine',
          name: 'Ki Strike (Adamantine)',
          source: 'Monk 16',
          description: 'Unarmed attacks count as adamantine for DR.',
        },
      ],
    },
    {
      level: 17,
      features: [
        {
          id: 'timeless-body',
          name: 'Timeless Body',
          source: 'Monk 17',
          description: 'No longer take aging penalties.',
        },
        {
          id: 'tongue-of-sun-moon',
          name: 'Tongue of Sun and Moon',
          source: 'Monk 17',
          description: 'Speak with any living creature.',
        },
      ],
    },
    {
      level: 18,
      features: [
        {
          id: 'bonus-feat-18',
          name: 'Bonus Feat',
          source: 'Monk 18',
          description: 'Gain another bonus feat.',
        },
        {
          id: 'fast-movement-60',
          name: 'Fast Movement (+60 ft)',
          source: 'Monk 18',
          description: 'Speed bonus increases to +60 feet.',
        },
      ],
    },
    {
      level: 19,
      features: [
        {
          id: 'empty-body',
          name: 'Empty Body',
          source: 'Monk 19',
          description: 'Become ethereal for 1 minute for 3 ki points.',
        },
      ],
    },
    {
      level: 20,
      features: [
        {
          id: 'perfect-self',
          name: 'Perfect Self',
          source: 'Monk 20',
          description: 'Become an outsider with DR 10/chaotic.',
        },
      ],
    },
  ],
  subclassLevel: 0,
  subclasses: [],
  classResources: [
    {
      id: 'ki-pool',
      name: 'Ki Pool',
      maxFormula: 'Math.floor(level / 2) + wis_mod',
      recoveryType: 'long-rest',
      displayOrder: 1,
    },
    {
      id: 'stunning-fist',
      name: 'Stunning Fist',
      maxFormula: 'level',
      recoveryType: 'long-rest',
      displayOrder: 2,
    },
  ],
  multiclassRequirements: [],
  multiclassProficiencies: { armor: [], weapons: [], tools: [] },
  description:
    'For the truly exemplary, martial skill transcends the battlefield—it is a lifestyle, a doctrine, a state of mind.',
  displayMetadata: {
    icon: 'fist',
    color: '#DAA520',
    shortDescription: 'A martial artist who channels ki to perform supernatural feats.',
    playStyle: 'Mobile unarmed combatant with supernatural abilities',
    complexity: 'moderate',
    role: 'striker',
    idealFor: ['Martial arts enthusiasts', 'Mobile fighters'],
    tags: ['martial', 'melee'],
  },
};
