import { CharacterClass } from '../../../../../types/character-options/classes';

export const barbarian: CharacterClass = {
  id: 'barbarian',
  name: 'Barbarian',
  system: 'dnd-3.5e',
  source: 'PHB 3.5',

  version: '3.5',
  lastUpdated: '2026-01-13',
  sourceBook: {
    name: "Player's Handbook 3.5",
    url: 'https://www.d20srd.org/srd/classes/barbarian.htm',
  },

  hitDie: 'd12',
  primaryAbility: ['str'],
  savingThrowProficiencies: ['str', 'con'],

  armorProficiencies: ['light', 'medium', 'shields'],
  weaponProficiencies: ['simple', 'martial'],
  toolProficiencies: [],

  skillProficiencies: {
    count: 4,
    options: ['climb', 'handle-animal', 'intimidate', 'jump', 'listen', 'ride', 'survival', 'swim'],
    label: 'Choose four skills',
  },

  equipmentChoices: [],

  startingGold: {
    dice: '4d4',
    multiplier: 10,
  },

  features: [
    {
      level: 1,
      features: [
        {
          id: 'rage',
          name: 'Rage',
          source: 'Barbarian 1',
          description:
            "A barbarian can fly into a rage a certain number of times per day. In a rage, a barbarian temporarily gains a +4 bonus to Strength, a +4 bonus to Constitution, and a +2 morale bonus on Will saves, but takes a -2 penalty to Armor Class. The increase in Constitution increases the barbarian's hit points by 2 per level, but these hit points go away when the rage ends.",
        },
        {
          id: 'fast-movement-35e',
          name: 'Fast Movement',
          source: 'Barbarian 1',
          description:
            "A barbarian's land speed is faster than the norm for his race by +10 feet. This benefit applies only when he is wearing no armor, light armor, or medium armor and not carrying a heavy load.",
        },
        {
          id: 'illiteracy',
          name: 'Illiteracy',
          source: 'Barbarian 1',
          description:
            'Barbarians are the only characters who do not automatically know how to read and write. A barbarian may spend 2 skill points to gain the ability to read and write all languages he is able to speak.',
        },
      ],
    },
    {
      level: 2,
      features: [
        {
          id: 'uncanny-dodge-35e',
          name: 'Uncanny Dodge',
          source: 'Barbarian 2',
          description:
            'At 2nd level, a barbarian retains his Dexterity bonus to AC (if any) even if he is caught flat-footed or struck by an invisible attacker.',
        },
      ],
    },
    {
      level: 3,
      features: [
        {
          id: 'trap-sense',
          name: 'Trap Sense',
          source: 'Barbarian 3',
          description:
            'At 3rd level, a barbarian gains a +1 bonus on Reflex saves made to avoid traps and a +1 dodge bonus to AC against attacks made by traps.',
        },
      ],
    },
    {
      level: 4,
      features: [
        {
          id: 'trap-sense-4',
          name: 'Trap Sense',
          source: 'Barbarian 4',
          description: 'Trap sense bonus increases. At 4th level, the bonus increases to +2.',
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
          description: 'At 5th level and higher, a barbarian can no longer be flanked.',
        },
      ],
    },
    {
      level: 6,
      features: [
        {
          id: 'trap-sense-6',
          name: 'Trap Sense',
          source: 'Barbarian 6',
          description: 'Trap sense bonus increases to +3.',
        },
      ],
    },
    {
      level: 7,
      features: [
        {
          id: 'damage-reduction',
          name: 'Damage Reduction',
          source: 'Barbarian 7',
          description:
            'At 7th level, a barbarian gains Damage Reduction. Subtract 1 from the damage the barbarian takes each time he is dealt damage from a weapon or a natural attack.',
        },
      ],
    },
    {
      level: 8,
      features: [
        {
          id: 'trap-sense-8',
          name: 'Trap Sense',
          source: 'Barbarian 8',
          description: 'Trap sense bonus increases to +4.',
        },
      ],
    },
    {
      level: 9,
      features: [
        {
          id: 'improved-damage-reduction',
          name: 'Improved Damage Reduction',
          source: 'Barbarian 9',
          description: 'At 9th level, damage reduction increases to 2/-.',
        },
      ],
    },
    {
      level: 10,
      features: [
        {
          id: 'trap-sense-10',
          name: 'Trap Sense',
          source: 'Barbarian 10',
          description: 'Trap sense bonus increases to +5.',
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
            "At 11th level, a barbarian's bonuses to Strength and Constitution during his rage each increase to +6, and his morale bonus on Will saves increases to +3.",
        },
      ],
    },
    {
      level: 12,
      features: [
        {
          id: 'trap-sense-12',
          name: 'Trap Sense',
          source: 'Barbarian 12',
          description: 'Trap sense bonus increases to +6.',
        },
      ],
    },
    {
      level: 13,
      features: [
        {
          id: 'improved-damage-reduction-13',
          name: 'Improved Damage Reduction',
          source: 'Barbarian 13',
          description: 'At 13th level, damage reduction increases to 3/-.',
        },
      ],
    },
    {
      level: 14,
      features: [
        {
          id: 'indomitable-will',
          name: 'Indomitable Will',
          source: 'Barbarian 14',
          description:
            'While in a rage, a barbarian of 14th level or higher gains a +4 bonus on Will saves to resist enchantment spells.',
        },
      ],
    },
    {
      level: 15,
      features: [
        {
          id: 'trap-sense-15',
          name: 'Trap Sense',
          source: 'Barbarian 15',
          description: 'Trap sense bonus increases to +7.',
        },
      ],
    },
    {
      level: 16,
      features: [
        {
          id: 'improved-damage-reduction-16',
          name: 'Improved Damage Reduction',
          source: 'Barbarian 16',
          description: 'At 16th level, damage reduction increases to 4/-.',
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
            'At 17th level and higher, a barbarian no longer becomes fatigued at the end of his rage.',
        },
      ],
    },
    {
      level: 18,
      features: [
        {
          id: 'trap-sense-18',
          name: 'Trap Sense',
          source: 'Barbarian 18',
          description: 'Trap sense bonus increases to +8.',
        },
      ],
    },
    {
      level: 19,
      features: [
        {
          id: 'improved-damage-reduction-19',
          name: 'Improved Damage Reduction',
          source: 'Barbarian 19',
          description: 'At 19th level, damage reduction increases to 5/-.',
        },
      ],
    },
    {
      level: 20,
      features: [
        {
          id: 'mighty-rage',
          name: 'Mighty Rage',
          source: 'Barbarian 20',
          description:
            "At 20th level, a barbarian's bonuses to Strength and Constitution during his rage each increase to +8, and his morale bonus on Will saves increases to +4.",
        },
      ],
    },
  ],

  subclassLevel: 0,
  subclasses: [],

  classResources: [],

  multiclassRequirements: [],

  multiclassProficiencies: {
    armor: [],
    weapons: [],
    tools: [],
  },

  description: 'A ferocious warrior who uses fury and instinct to bring down foes.',

  displayMetadata: {
    icon: 'axe',
    color: '#CD5C5C',
    shortDescription: 'A ferocious warrior who uses fury and instinct.',
    playStyle: 'Aggressive melee combatant',
    complexity: 'simple',
    role: 'striker',
    idealFor: ['Combat-focused players'],
    tags: ['martial', 'melee'],
  },
};
