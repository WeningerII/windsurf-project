import { CharacterClass } from '../../../../types/character-options/classes';

export const rogue: CharacterClass = {
  id: 'rogue',
  name: 'Rogue',
  system: 'pf1e',
  source: 'Core Rulebook',
  version: '1.0',
  lastUpdated: '2026-01-13',
  sourceBook: {
    name: 'Pathfinder Core Rulebook',
    page: 67,
    url: 'https://www.d20pfsrd.com/classes/core-classes/rogue/',
  },
  hitDie: 'd8',
  primaryAbility: ['dex'],
  savingThrowProficiencies: ['dex', 'int'],
  armorProficiencies: ['light'],
  weaponProficiencies: ['simple', 'hand-crossbow', 'rapier', 'sap', 'shortbow', 'short-sword'],
  toolProficiencies: [],
  skillProficiencies: {
    count: 8,
    options: [
      'acrobatics',
      'appraise',
      'bluff',
      'climb',
      'diplomacy',
      'disable-device',
      'disguise',
      'escape-artist',
      'intimidate',
      'knowledge-dungeoneering',
      'knowledge-local',
      'linguistics',
      'perception',
      'sense-motive',
      'sleight-of-hand',
      'stealth',
      'swim',
      'use-magic',
    ],
    label: 'Choose class skills (8 + Int modifier ranks per level)',
  },
  equipmentChoices: [],
  startingGold: { dice: '4d6', multiplier: 10 },
  features: [
    {
      level: 1,
      features: [
        {
          id: 'sneak-attack-1d6',
          name: 'Sneak Attack (+1d6)',
          source: 'Rogue 1',
          description: 'Deal +1d6 damage when target is denied Dex bonus to AC or when flanking.',
        },
        {
          id: 'trapfinding',
          name: 'Trapfinding',
          source: 'Rogue 1',
          description:
            'Add 1/2 rogue level to Perception checks to locate traps and to Disable Device checks. Can disarm magical traps.',
        },
      ],
    },
    {
      level: 2,
      features: [
        {
          id: 'evasion',
          name: 'Evasion',
          source: 'Rogue 2',
          description: 'On successful Reflex save for half damage, take no damage instead.',
        },
        {
          id: 'rogue-talent-2',
          name: 'Rogue Talent',
          source: 'Rogue 2',
          description: 'Gain a rogue talent of your choice.',
        },
      ],
    },
    {
      level: 3,
      features: [
        {
          id: 'sneak-attack-2d6',
          name: 'Sneak Attack (+2d6)',
          source: 'Rogue 3',
          description: 'Sneak attack damage increases to 2d6.',
        },
        {
          id: 'trap-sense-1',
          name: 'Trap Sense +1',
          source: 'Rogue 3',
          description: '+1 bonus on Reflex saves and AC against traps.',
        },
      ],
    },
    {
      level: 4,
      features: [
        {
          id: 'rogue-talent-4',
          name: 'Rogue Talent',
          source: 'Rogue 4',
          description: 'Gain another rogue talent.',
        },
        {
          id: 'uncanny-dodge',
          name: 'Uncanny Dodge',
          source: 'Rogue 4',
          description:
            'Cannot be caught flat-footed, retain Dex bonus to AC even if immobilized or against invisible attackers.',
        },
      ],
    },
    {
      level: 5,
      features: [
        {
          id: 'sneak-attack-3d6',
          name: 'Sneak Attack (+3d6)',
          source: 'Rogue 5',
          description: 'Sneak attack damage increases to 3d6.',
        },
      ],
    },
    {
      level: 6,
      features: [
        {
          id: 'rogue-talent-6',
          name: 'Rogue Talent',
          source: 'Rogue 6',
          description: 'Gain another rogue talent.',
        },
        {
          id: 'trap-sense-2',
          name: 'Trap Sense +2',
          source: 'Rogue 6',
          description: 'Trap sense bonus increases to +2.',
        },
      ],
    },
    {
      level: 7,
      features: [
        {
          id: 'sneak-attack-4d6',
          name: 'Sneak Attack (+4d6)',
          source: 'Rogue 7',
          description: 'Sneak attack damage increases to 4d6.',
        },
      ],
    },
    {
      level: 8,
      features: [
        {
          id: 'rogue-talent-8',
          name: 'Rogue Talent',
          source: 'Rogue 8',
          description: 'Gain another rogue talent.',
        },
        {
          id: 'improved-uncanny-dodge',
          name: 'Improved Uncanny Dodge',
          source: 'Rogue 8',
          description: 'Cannot be flanked except by a rogue 4+ levels higher.',
        },
      ],
    },
    {
      level: 9,
      features: [
        {
          id: 'sneak-attack-5d6',
          name: 'Sneak Attack (+5d6)',
          source: 'Rogue 9',
          description: 'Sneak attack damage increases to 5d6.',
        },
        {
          id: 'trap-sense-3',
          name: 'Trap Sense +3',
          source: 'Rogue 9',
          description: 'Trap sense bonus increases to +3.',
        },
      ],
    },
    {
      level: 10,
      features: [
        {
          id: 'rogue-talent-10',
          name: 'Rogue Talent',
          source: 'Rogue 10',
          description: 'Gain another rogue talent. May select advanced talents.',
        },
      ],
    },
    {
      level: 11,
      features: [
        {
          id: 'sneak-attack-6d6',
          name: 'Sneak Attack (+6d6)',
          source: 'Rogue 11',
          description: 'Sneak attack damage increases to 6d6.',
        },
      ],
    },
    {
      level: 12,
      features: [
        {
          id: 'rogue-talent-12',
          name: 'Rogue Talent',
          source: 'Rogue 12',
          description: 'Gain another rogue talent.',
        },
        {
          id: 'trap-sense-4',
          name: 'Trap Sense +4',
          source: 'Rogue 12',
          description: 'Trap sense bonus increases to +4.',
        },
      ],
    },
    {
      level: 13,
      features: [
        {
          id: 'sneak-attack-7d6',
          name: 'Sneak Attack (+7d6)',
          source: 'Rogue 13',
          description: 'Sneak attack damage increases to 7d6.',
        },
      ],
    },
    {
      level: 14,
      features: [
        {
          id: 'rogue-talent-14',
          name: 'Rogue Talent',
          source: 'Rogue 14',
          description: 'Gain another rogue talent.',
        },
      ],
    },
    {
      level: 15,
      features: [
        {
          id: 'sneak-attack-8d6',
          name: 'Sneak Attack (+8d6)',
          source: 'Rogue 15',
          description: 'Sneak attack damage increases to 8d6.',
        },
        {
          id: 'trap-sense-5',
          name: 'Trap Sense +5',
          source: 'Rogue 15',
          description: 'Trap sense bonus increases to +5.',
        },
      ],
    },
    {
      level: 16,
      features: [
        {
          id: 'rogue-talent-16',
          name: 'Rogue Talent',
          source: 'Rogue 16',
          description: 'Gain another rogue talent.',
        },
      ],
    },
    {
      level: 17,
      features: [
        {
          id: 'sneak-attack-9d6',
          name: 'Sneak Attack (+9d6)',
          source: 'Rogue 17',
          description: 'Sneak attack damage increases to 9d6.',
        },
      ],
    },
    {
      level: 18,
      features: [
        {
          id: 'rogue-talent-18',
          name: 'Rogue Talent',
          source: 'Rogue 18',
          description: 'Gain another rogue talent.',
        },
        {
          id: 'trap-sense-6',
          name: 'Trap Sense +6',
          source: 'Rogue 18',
          description: 'Trap sense bonus increases to +6.',
        },
      ],
    },
    {
      level: 19,
      features: [
        {
          id: 'sneak-attack-10d6',
          name: 'Sneak Attack (+10d6)',
          source: 'Rogue 19',
          description: 'Sneak attack damage increases to 10d6.',
        },
      ],
    },
    {
      level: 20,
      features: [
        {
          id: 'rogue-talent-20',
          name: 'Rogue Talent',
          source: 'Rogue 20',
          description: 'Gain another rogue talent.',
        },
        {
          id: 'master-strike',
          name: 'Master Strike',
          source: 'Rogue 20',
          description:
            'When dealing sneak attack damage, target must make Fort save or be put to sleep, paralyzed, or slain.',
        },
      ],
    },
  ],
  subclassLevel: 0,
  subclasses: [],
  classResources: [],
  multiclassRequirements: [],
  multiclassProficiencies: { armor: [], weapons: [], tools: [] },
  description:
    'Life is an endless adventure for those who live by their wits. Ever just one step ahead of danger, rogues bank on their cunning, skill, and charm to bend fate to their favor.',
  displayMetadata: {
    icon: 'dagger',
    color: '#2F4F4F',
    shortDescription: 'A sneaky combatant who deals devastating sneak attacks.',
    playStyle: 'Stealthy striker with skill expertise and talents',
    complexity: 'moderate',
    role: 'striker',
    idealFor: ['Stealth players', 'Skill-focused characters', 'Tactical combatants'],
    tags: ['martial', 'stealth', 'skill-monkey'],
  },
};
