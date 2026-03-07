import { CharacterClass } from '../../../../types/character-options/classes';

export const paladin: CharacterClass = {
  id: 'paladin',
  name: 'Paladin',
  system: 'pf1e',
  source: 'Core Rulebook',
  version: '1.0',
  lastUpdated: '2026-01-13',
  sourceBook: {
    name: 'Pathfinder Core Rulebook',
    page: 60,
    url: 'https://www.d20pfsrd.com/classes/core-classes/paladin/',
  },
  hitDie: 'd10',
  primaryAbility: ['str', 'cha'],
  savingThrowProficiencies: ['str', 'cha', 'wis'],
  armorProficiencies: ['light', 'medium', 'heavy', 'shields'],
  weaponProficiencies: ['simple', 'martial'],
  toolProficiencies: [],
  skillProficiencies: {
    count: 2,
    options: [
      'diplomacy',
      'handle-animal',
      'heal',
      'knowledge-nobility',
      'knowledge-religion',
      'ride',
      'sense-motive',
      'spellcraft',
    ],
    label: 'Choose class skills (2 + Int modifier ranks per level)',
  },
  equipmentChoices: [],
  startingGold: { dice: '5d6', multiplier: 10 },
  features: [
    {
      level: 1,
      features: [
        {
          id: 'aura-of-good',
          name: 'Aura of Good',
          source: 'Paladin 1',
          description: "The power of a paladin's aura of good is equal to her paladin level.",
        },
        {
          id: 'detect-evil',
          name: 'Detect Evil',
          source: 'Paladin 1',
          description: 'At will, a paladin can use detect evil, as the spell.',
        },
        {
          id: 'smite-evil',
          name: 'Smite Evil (1/day)',
          source: 'Paladin 1',
          description:
            'Once per day, add Cha bonus to attack and paladin level to damage against evil creatures. Bypass DR.',
          uses: { current: 1, max: 1, recoveryType: 'long-rest' },
        },
      ],
    },
    {
      level: 2,
      features: [
        {
          id: 'divine-grace',
          name: 'Divine Grace',
          source: 'Paladin 2',
          description: 'Add Charisma bonus to all saving throws.',
        },
        {
          id: 'lay-on-hands',
          name: 'Lay on Hands',
          source: 'Paladin 2',
          description:
            'Heal 1d6 HP per two paladin levels. Uses per day equal to 1/2 paladin level + Cha modifier.',
        },
      ],
    },
    {
      level: 3,
      features: [
        {
          id: 'aura-of-courage',
          name: 'Aura of Courage',
          source: 'Paladin 3',
          description:
            'Immune to fear. Allies within 10 feet gain +4 morale bonus on saves against fear.',
        },
        {
          id: 'divine-health',
          name: 'Divine Health',
          source: 'Paladin 3',
          description: 'Immune to all diseases.',
        },
        {
          id: 'mercy',
          name: 'Mercy',
          source: 'Paladin 3',
          description: 'Select one mercy. When using lay on hands, also apply the mercy effect.',
        },
      ],
    },
    {
      level: 4,
      features: [
        {
          id: 'channel-positive',
          name: 'Channel Positive Energy',
          source: 'Paladin 4',
          description: 'Channel positive energy like a cleric of level -3.',
        },
        {
          id: 'smite-evil-2',
          name: 'Smite Evil (2/day)',
          source: 'Paladin 4',
          description: 'Can use smite evil twice per day.',
        },
      ],
    },
    {
      level: 5,
      features: [
        {
          id: 'divine-bond',
          name: 'Divine Bond',
          source: 'Paladin 5',
          description: 'Form a divine bond with a weapon or mount.',
        },
      ],
    },
    {
      level: 6,
      features: [
        { id: 'mercy-6', name: 'Mercy', source: 'Paladin 6', description: 'Select another mercy.' },
      ],
    },
    {
      level: 7,
      features: [
        {
          id: 'smite-evil-3',
          name: 'Smite Evil (3/day)',
          source: 'Paladin 7',
          description: 'Can use smite evil three times per day.',
        },
      ],
    },
    {
      level: 8,
      features: [
        {
          id: 'aura-of-resolve',
          name: 'Aura of Resolve',
          source: 'Paladin 8',
          description:
            'Immune to charm. Allies within 10 feet gain +4 morale bonus on saves against charm.',
        },
      ],
    },
    {
      level: 9,
      features: [
        { id: 'mercy-9', name: 'Mercy', source: 'Paladin 9', description: 'Select another mercy.' },
      ],
    },
    {
      level: 10,
      features: [
        {
          id: 'smite-evil-4',
          name: 'Smite Evil (4/day)',
          source: 'Paladin 10',
          description: 'Can use smite evil four times per day.',
        },
      ],
    },
    {
      level: 11,
      features: [
        {
          id: 'aura-of-justice',
          name: 'Aura of Justice',
          source: 'Paladin 11',
          description:
            'Expend two uses of smite evil to grant smite evil to all allies within 10 feet.',
        },
      ],
    },
    {
      level: 12,
      features: [
        {
          id: 'mercy-12',
          name: 'Mercy',
          source: 'Paladin 12',
          description: 'Select another mercy.',
        },
      ],
    },
    {
      level: 13,
      features: [
        {
          id: 'smite-evil-5',
          name: 'Smite Evil (5/day)',
          source: 'Paladin 13',
          description: 'Can use smite evil five times per day.',
        },
      ],
    },
    {
      level: 14,
      features: [
        {
          id: 'aura-of-faith',
          name: 'Aura of Faith',
          source: 'Paladin 14',
          description: 'Weapons wielded by paladin are treated as good-aligned for DR.',
        },
      ],
    },
    {
      level: 15,
      features: [
        {
          id: 'mercy-15',
          name: 'Mercy',
          source: 'Paladin 15',
          description: 'Select another mercy.',
        },
      ],
    },
    {
      level: 16,
      features: [
        {
          id: 'smite-evil-6',
          name: 'Smite Evil (6/day)',
          source: 'Paladin 16',
          description: 'Can use smite evil six times per day.',
        },
      ],
    },
    {
      level: 17,
      features: [
        {
          id: 'aura-of-righteousness',
          name: 'Aura of Righteousness',
          source: 'Paladin 17',
          description:
            'Gain DR 5/evil. Allies within 10 feet gain +4 morale bonus on saves against compulsion.',
        },
      ],
    },
    {
      level: 18,
      features: [
        {
          id: 'mercy-18',
          name: 'Mercy',
          source: 'Paladin 18',
          description: 'Select another mercy.',
        },
      ],
    },
    {
      level: 19,
      features: [
        {
          id: 'smite-evil-7',
          name: 'Smite Evil (7/day)',
          source: 'Paladin 19',
          description: 'Can use smite evil seven times per day.',
        },
      ],
    },
    {
      level: 20,
      features: [
        {
          id: 'holy-champion',
          name: 'Holy Champion',
          source: 'Paladin 20',
          description:
            'DR increases to 10/evil. Smite evil damage maximized against evil outsiders and dragons.',
        },
      ],
    },
  ],
  subclassLevel: 0,
  subclasses: [],
  spellcasting: {
    ability: 'cha',
    spellListId: 'paladin-pf1e',
    preparedCasterFormula: 'cha_mod + Math.floor(class_level / 2)',
    spellSlots: {
      1: [0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4],
      2: [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4],
      3: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3],
      4: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 3],
      5: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      6: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      7: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      8: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      9: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
    ritualCasting: false,
    multiclassCasterLevel: 'half',
  },
  classResources: [
    {
      id: 'smite-evil',
      name: 'Smite Evil',
      maxFormula: '1 + Math.floor((level - 1) / 3)',
      recoveryType: 'long-rest',
      displayOrder: 1,
    },
    {
      id: 'lay-on-hands',
      name: 'Lay on Hands',
      maxFormula: 'Math.floor(level / 2) + cha_mod',
      recoveryType: 'long-rest',
      displayOrder: 2,
    },
  ],
  multiclassRequirements: [],
  multiclassProficiencies: { armor: [], weapons: [], tools: [] },
  description:
    'Through a select, worthy few shines the power of the divine. Called paladins, these noble souls dedicate their swords and lives to the battle against evil.',
  displayMetadata: {
    icon: 'shield',
    color: '#FFD700',
    shortDescription: 'A holy warrior who smites evil and heals allies.',
    playStyle: 'Melee combatant with divine magic and support abilities',
    complexity: 'moderate',
    role: 'hybrid',
    idealFor: ['Players who want to play heroic characters', 'Tank/healer hybrids'],
    tags: ['divine', 'martial', 'melee', 'support'],
    casterType: 'half',
  },
};
