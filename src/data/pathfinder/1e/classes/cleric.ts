import { CharacterClass } from '../../../../types/character-options/classes';

export const cleric: CharacterClass = {
  id: 'cleric',
  name: 'Cleric',
  system: 'pf1e',
  source: 'Core Rulebook',
  
  version: '1.0',
  lastUpdated: '2026-01-13',
  sourceBook: {
    name: 'Pathfinder Core Rulebook',
    page: 38,
    url: 'https://www.d20pfsrd.com/classes/core-classes/cleric/'
  },
  
  hitDie: 'd8',
  primaryAbility: ['wis'],
  savingThrowProficiencies: ['wis', 'con'],
  
  armorProficiencies: ['light', 'medium', 'heavy', 'shields'],
  weaponProficiencies: ['simple', 'deity-favored'],
  toolProficiencies: [],
  
  skillProficiencies: {
    count: 2,
    options: ['appraise', 'diplomacy', 'heal', 'knowledge-arcana', 'knowledge-history', 'knowledge-nobility', 'knowledge-planes', 'knowledge-religion', 'linguistics', 'sense-motive', 'spellcraft'],
    label: 'Choose class skills (2 + Int modifier ranks per level)',
  },
  
  equipmentChoices: [],
  
  startingGold: {
    dice: '4d6',
    multiplier: 10,
  },
  
  features: [
    {
      level: 1,
      features: [
        {
          id: 'aura',
          name: 'Aura',
          source: 'Cleric 1',
          description: 'A cleric of a chaotic, evil, good, or lawful deity has a particularly powerful aura corresponding to the deity\'s alignment.',
        },
        {
          id: 'channel-energy',
          name: 'Channel Energy',
          source: 'Cleric 1',
          description: 'Regardless of alignment, any cleric can release a wave of energy by channeling the power of her faith through her holy (or unholy) symbol. This energy can be used to cause or heal damage, depending on the type of energy channeled and the creatures targeted. A cleric can channel energy a number of times per day equal to 3 + her Charisma modifier. The amount of damage dealt or healed is equal to 1d6 points of damage plus 1d6 points of damage for every two cleric levels beyond 1st (2d6 at 3rd, 3d6 at 5th, and so on).',
          uses: {
            current: 3,
            max: 3,
            recoveryType: 'long-rest',
          },
        },
        {
          id: 'domains',
          name: 'Domains',
          source: 'Cleric 1',
          description: 'A cleric\'s deity influences her alignment, what magic she can perform, her values, and how others see her. A cleric chooses two domains from among those belonging to her deity. Each domain grants a number of domain powers, dependent upon the level of the cleric, as well as a number of bonus spells.',
        },
        {
          id: 'orisons',
          name: 'Orisons',
          source: 'Cleric 1',
          description: 'Clerics can prepare a number of orisons, or 0-level spells, each day. These spells are cast like any other spell, but they are not expended when cast and may be used again.',
        },
        {
          id: 'spontaneous-casting',
          name: 'Spontaneous Casting',
          source: 'Cleric 1',
          description: 'A good cleric (or a neutral cleric of a good deity) can channel stored spell energy into healing spells that she did not prepare ahead of time. The cleric can "lose" any prepared spell that is not an orison or domain spell in order to cast any cure spell of the same spell level or lower (a cure spell is any spell with "cure" in its name). An evil cleric (or a neutral cleric of an evil deity) can\'t convert prepared spells to cure spells but can convert them to inflict spells.',
        },
      ],
    },
    {
      level: 3,
      features: [
        {
          id: 'channel-energy-2d6',
          name: 'Channel Energy (2d6)',
          source: 'Cleric 3',
          description: 'Channel energy damage/healing increases to 2d6.',
        },
      ],
    },
    {
      level: 5,
      features: [
        {
          id: 'channel-energy-3d6',
          name: 'Channel Energy (3d6)',
          source: 'Cleric 5',
          description: 'Channel energy damage/healing increases to 3d6.',
        },
      ],
    },
    {
      level: 7,
      features: [
        {
          id: 'channel-energy-4d6',
          name: 'Channel Energy (4d6)',
          source: 'Cleric 7',
          description: 'Channel energy damage/healing increases to 4d6.',
        },
      ],
    },
    {
      level: 9,
      features: [
        {
          id: 'channel-energy-5d6',
          name: 'Channel Energy (5d6)',
          source: 'Cleric 9',
          description: 'Channel energy damage/healing increases to 5d6.',
        },
      ],
    },
    {
      level: 11,
      features: [
        {
          id: 'channel-energy-6d6',
          name: 'Channel Energy (6d6)',
          source: 'Cleric 11',
          description: 'Channel energy damage/healing increases to 6d6.',
        },
      ],
    },
    {
      level: 13,
      features: [
        {
          id: 'channel-energy-7d6',
          name: 'Channel Energy (7d6)',
          source: 'Cleric 13',
          description: 'Channel energy damage/healing increases to 7d6.',
        },
      ],
    },
    {
      level: 15,
      features: [
        {
          id: 'channel-energy-8d6',
          name: 'Channel Energy (8d6)',
          source: 'Cleric 15',
          description: 'Channel energy damage/healing increases to 8d6.',
        },
      ],
    },
    {
      level: 17,
      features: [
        {
          id: 'channel-energy-9d6',
          name: 'Channel Energy (9d6)',
          source: 'Cleric 17',
          description: 'Channel energy damage/healing increases to 9d6.',
        },
      ],
    },
    {
      level: 19,
      features: [
        {
          id: 'channel-energy-10d6',
          name: 'Channel Energy (10d6)',
          source: 'Cleric 19',
          description: 'Channel energy damage/healing increases to 10d6.',
        },
      ],
    },
  ],
  
  subclassLevel: 1,
  subclasses: [],
  
  spellcasting: {
    ability: 'wis',
    spellListId: 'cleric-pf1e',
    preparedCasterFormula: 'wis_mod + class_level',
    spellSlots: {
      1: [1, 2, 2, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
      2: [0, 0, 1, 2, 2, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
      3: [0, 0, 0, 0, 1, 2, 2, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
      4: [0, 0, 0, 0, 0, 0, 1, 2, 2, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4],
      5: [0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 3, 3, 3, 4, 4, 4, 4, 4, 4],
      6: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 3, 3, 3, 4, 4, 4, 4],
      7: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 3, 3, 3, 4, 4],
      8: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 3, 3, 4],
      9: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 4],
    },
    ritualCasting: false,
    multiclassCasterLevel: 'full',
  },
  
  classResources: [
    {
      id: 'channel-energy-uses',
      name: 'Channel Energy',
      maxFormula: '3 + cha_mod',
      recoveryType: 'long-rest',
      displayOrder: 1,
      defaultValue: 3,
    },
  ],
  
  multiclassRequirements: [],
  
  multiclassProficiencies: {
    armor: [],
    weapons: [],
    tools: [],
  },
  
  description: 'In faith and the miracles of the divine, many find a greater purpose. Called to serve powers beyond most mortal understanding, all priests preach wonders and provide for the spiritual needs of their people.',
  
  displayMetadata: {
    icon: 'cross',
    color: '#FFD700',
    shortDescription: 'A divine spellcaster who channels the power of their deity.',
    playStyle: 'Full divine caster with domain powers and channel energy',
    complexity: 'moderate',
    role: 'support',
    idealFor: ['Players who want divine magic', 'Healers', 'Support roles'],
    tags: ['divine', 'spellcaster', 'support'],
    casterType: 'full',
  },
};
