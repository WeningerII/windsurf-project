import { CharacterClass } from '../../../../types/character-options/classes';

export const barbarian: CharacterClass = {
  id: 'barbarian',
  name: 'Barbarian',
  system: 'pf1e',
  source: 'Core Rulebook',

  version: '1.0',
  lastUpdated: '2026-01-13',
  sourceBook: {
    name: 'Pathfinder Core Rulebook',
    page: 31,
    url: 'https://www.d20pfsrd.com/classes/core-classes/barbarian/',
  },

  hitDie: 'd12',
  primaryAbility: ['str', 'con'],
  savingThrowProficiencies: ['str', 'con'],

  armorProficiencies: ['light', 'medium', 'shields'],
  weaponProficiencies: ['simple', 'martial'],
  toolProficiencies: [],

  skillProficiencies: {
    count: 4,
    options: [
      'acrobatics',
      'climb',
      'handle-animal',
      'intimidate',
      'knowledge-nature',
      'perception',
      'ride',
      'survival',
      'swim',
    ],
    label: 'Choose class skills (4 + Int modifier ranks per level)',
  },

  equipmentChoices: [],

  startingGold: {
    dice: '3d6',
    multiplier: 10,
  },

  features: [
    {
      level: 1,
      features: [
        {
          id: 'fast-movement',
          name: 'Fast Movement',
          source: 'Barbarian 1',
          description:
            "A barbarian's land speed is faster than the norm for her race by +10 feet. This benefit applies only when she is wearing no armor, light armor, or medium armor, and not carrying a heavy load.",
        },
        {
          id: 'rage',
          name: 'Rage',
          source: 'Barbarian 1',
          description:
            'A barbarian can call upon inner reserves of strength and ferocity, granting her additional combat prowess. Starting at 1st level, a barbarian can rage for a number of rounds per day equal to 4 + her Constitution modifier. At each level after 1st, she can rage for 2 additional rounds. While in rage, a barbarian gains a +4 morale bonus to her Strength and Constitution, as well as a +2 morale bonus on Will saves. In addition, she takes a –2 penalty to Armor Class.',
          uses: {
            current: 4,
            max: 4,
            recoveryType: 'long-rest',
          },
        },
      ],
    },
    {
      level: 2,
      features: [
        {
          id: 'rage-power-2',
          name: 'Rage Power',
          source: 'Barbarian 2',
          description:
            'As a barbarian gains levels, she learns to use her rage in new ways. Starting at 2nd level, a barbarian gains a rage power. She gains another rage power for every two levels of barbarian attained after 2nd level.',
        },
        {
          id: 'uncanny-dodge',
          name: 'Uncanny Dodge',
          source: 'Barbarian 2',
          description:
            'At 2nd level, a barbarian gains the ability to react to danger before her senses would normally allow her to do so. She cannot be caught flat-footed, nor does she lose her Dex bonus to AC if the attacker is invisible.',
        },
      ],
    },
    {
      level: 3,
      features: [
        {
          id: 'trap-sense-1',
          name: 'Trap Sense +1',
          source: 'Barbarian 3',
          description:
            'At 3rd level, a barbarian gains a +1 bonus on Reflex saves made to avoid traps and a +1 dodge bonus to AC against attacks made by traps. These bonuses increase by +1 every three barbarian levels thereafter.',
        },
      ],
    },
    {
      level: 4,
      features: [
        {
          id: 'rage-power-4',
          name: 'Rage Power',
          source: 'Barbarian 4',
          description: 'The barbarian gains another rage power.',
        },
      ],
    },
    {
      level: 5,
      features: [
        {
          id: 'improved-uncanny-dodge',
          name: 'Improved Uncanny Dodge',
          source: 'Barbarian 5',
          description:
            'At 5th level and higher, a barbarian can no longer be flanked. This defense denies a rogue the ability to sneak attack the barbarian by flanking her, unless the attacker has at least four more rogue levels than the target has barbarian levels.',
        },
      ],
    },
    {
      level: 6,
      features: [
        {
          id: 'rage-power-6',
          name: 'Rage Power',
          source: 'Barbarian 6',
          description: 'The barbarian gains another rage power.',
        },
        {
          id: 'trap-sense-2',
          name: 'Trap Sense +2',
          source: 'Barbarian 6',
          description: "The barbarian's trap sense bonus increases to +2.",
        },
      ],
    },
    {
      level: 7,
      features: [
        {
          id: 'damage-reduction-1',
          name: 'Damage Reduction 1/—',
          source: 'Barbarian 7',
          description:
            'At 7th level, a barbarian gains damage reduction. Subtract 1 from the damage the barbarian takes each time she is dealt damage from a weapon or a natural attack. This damage reduction increases by 1 for every three barbarian levels beyond 7th.',
        },
      ],
    },
    {
      level: 8,
      features: [
        {
          id: 'rage-power-8',
          name: 'Rage Power',
          source: 'Barbarian 8',
          description: 'The barbarian gains another rage power.',
        },
      ],
    },
    {
      level: 9,
      features: [
        {
          id: 'trap-sense-3',
          name: 'Trap Sense +3',
          source: 'Barbarian 9',
          description: "The barbarian's trap sense bonus increases to +3.",
        },
      ],
    },
    {
      level: 10,
      features: [
        {
          id: 'rage-power-10',
          name: 'Rage Power',
          source: 'Barbarian 10',
          description: 'The barbarian gains another rage power.',
        },
        {
          id: 'damage-reduction-2',
          name: 'Damage Reduction 2/—',
          source: 'Barbarian 10',
          description: "The barbarian's damage reduction increases to 2/—.",
        },
      ],
    },
    {
      level: 11,
      features: [
        {
          id: 'greater-rage',
          name: 'Greater Rage',
          source: 'Barbarian 11',
          description:
            'At 11th level, when a barbarian enters rage, the morale bonus to her Strength and Constitution increases to +6 and the morale bonus on her Will saves increases to +3.',
        },
      ],
    },
    {
      level: 12,
      features: [
        {
          id: 'rage-power-12',
          name: 'Rage Power',
          source: 'Barbarian 12',
          description: 'The barbarian gains another rage power.',
        },
        {
          id: 'trap-sense-4',
          name: 'Trap Sense +4',
          source: 'Barbarian 12',
          description: "The barbarian's trap sense bonus increases to +4.",
        },
      ],
    },
    {
      level: 13,
      features: [
        {
          id: 'damage-reduction-3',
          name: 'Damage Reduction 3/—',
          source: 'Barbarian 13',
          description: "The barbarian's damage reduction increases to 3/—.",
        },
      ],
    },
    {
      level: 14,
      features: [
        {
          id: 'rage-power-14',
          name: 'Rage Power',
          source: 'Barbarian 14',
          description: 'The barbarian gains another rage power.',
        },
        {
          id: 'indomitable-will',
          name: 'Indomitable Will',
          source: 'Barbarian 14',
          description:
            'While in rage, a barbarian of 14th level or higher gains a +4 bonus on Will saves to resist enchantment spells. This bonus stacks with all other modifiers, including the morale bonus on Will saves she also receives during her rage.',
        },
      ],
    },
    {
      level: 15,
      features: [
        {
          id: 'trap-sense-5',
          name: 'Trap Sense +5',
          source: 'Barbarian 15',
          description: "The barbarian's trap sense bonus increases to +5.",
        },
      ],
    },
    {
      level: 16,
      features: [
        {
          id: 'rage-power-16',
          name: 'Rage Power',
          source: 'Barbarian 16',
          description: 'The barbarian gains another rage power.',
        },
        {
          id: 'damage-reduction-4',
          name: 'Damage Reduction 4/—',
          source: 'Barbarian 16',
          description: "The barbarian's damage reduction increases to 4/—.",
        },
      ],
    },
    {
      level: 17,
      features: [
        {
          id: 'tireless-rage',
          name: 'Tireless Rage',
          source: 'Barbarian 17',
          description:
            'Starting at 17th level, a barbarian no longer becomes fatigued at the end of her rage.',
        },
      ],
    },
    {
      level: 18,
      features: [
        {
          id: 'rage-power-18',
          name: 'Rage Power',
          source: 'Barbarian 18',
          description: 'The barbarian gains another rage power.',
        },
        {
          id: 'trap-sense-6',
          name: 'Trap Sense +6',
          source: 'Barbarian 18',
          description: "The barbarian's trap sense bonus increases to +6.",
        },
      ],
    },
    {
      level: 19,
      features: [
        {
          id: 'damage-reduction-5',
          name: 'Damage Reduction 5/—',
          source: 'Barbarian 19',
          description: "The barbarian's damage reduction increases to 5/—.",
        },
      ],
    },
    {
      level: 20,
      features: [
        {
          id: 'rage-power-20',
          name: 'Rage Power',
          source: 'Barbarian 20',
          description: 'The barbarian gains another rage power.',
        },
        {
          id: 'mighty-rage',
          name: 'Mighty Rage',
          source: 'Barbarian 20',
          description:
            'At 20th level, when a barbarian enters rage, the morale bonus to her Strength and Constitution increases to +8 and the morale bonus on her Will saves increases to +4.',
        },
      ],
    },
  ],

  subclassLevel: 0,
  subclasses: [],

  classResources: [
    {
      id: 'rage-rounds',
      name: 'Rage Rounds',
      maxFormula: '4 + con_mod + (level - 1) * 2',
      recoveryType: 'long-rest',
      displayOrder: 1,
      defaultValue: 4,
    },
  ],

  multiclassRequirements: [],

  multiclassProficiencies: {
    armor: [],
    weapons: [],
    tools: [],
  },

  description:
    'For some, there is only rage. In the ways of their people, in the fury of their passion, in the howl of battle, conflict is all these brutal souls know. Savages, hired muscle, masters of vicious martial techniques, they are not combatants combating evil—they are anger, primal and unrelenting.',

  displayMetadata: {
    icon: 'axe',
    color: '#8B0000',
    shortDescription: 'A fierce warrior who channels rage into devastating combat prowess.',
    playStyle: 'Aggressive melee combatant with rage powers',
    complexity: 'simple',
    role: 'striker',
    idealFor: ['Players who like aggressive combat', 'Simple but powerful builds'],
    tags: ['martial', 'melee'],
  },
};
