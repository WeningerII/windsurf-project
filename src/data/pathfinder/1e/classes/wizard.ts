import { CharacterClass } from '../../../../types/character-options/classes';

export const wizard: CharacterClass = {
  id: 'wizard',
  name: 'Wizard',
  system: 'pf1e',
  source: 'Core Rulebook',
  version: '1.0',
  lastUpdated: '2026-01-13',
  sourceBook: {
    name: 'Pathfinder Core Rulebook',
    page: 77,
    url: 'https://www.d20pfsrd.com/classes/core-classes/wizard/',
  },
  hitDie: 'd6',
  primaryAbility: ['int'],
  savingThrowProficiencies: ['int', 'wis'],
  armorProficiencies: [],
  weaponProficiencies: ['club', 'dagger', 'crossbow-heavy', 'crossbow-light', 'quarterstaff'],
  toolProficiencies: [],
  skillProficiencies: {
    count: 2,
    options: [
      'appraise',
      'fly',
      'knowledge-arcana',
      'knowledge-dungeoneering',
      'knowledge-engineering',
      'knowledge-geography',
      'knowledge-history',
      'knowledge-local',
      'knowledge-nature',
      'knowledge-nobility',
      'knowledge-planes',
      'knowledge-religion',
      'linguistics',
      'spellcraft',
    ],
    label: 'Choose class skills (2 + Int modifier ranks per level)',
  },
  equipmentChoices: [],
  startingGold: { dice: '2d6', multiplier: 10 },
  features: [
    {
      level: 1,
      features: [
        {
          id: 'arcane-bond',
          name: 'Arcane Bond',
          source: 'Wizard 1',
          description: 'Form a powerful bond with an object or familiar.',
        },
        {
          id: 'arcane-school',
          name: 'Arcane School',
          source: 'Wizard 1',
          description:
            'Specialize in a school of magic, gaining school powers. May select universalist instead.',
        },
        {
          id: 'cantrips',
          name: 'Cantrips',
          source: 'Wizard 1',
          description: 'Cast 0-level spells at will.',
        },
        {
          id: 'scribe-scroll',
          name: 'Scribe Scroll',
          source: 'Wizard 1',
          description: 'Gain Scribe Scroll as a bonus feat.',
        },
      ],
    },
    {
      level: 5,
      features: [
        {
          id: 'bonus-feat-5',
          name: 'Bonus Feat',
          source: 'Wizard 5',
          description: 'Gain a bonus metamagic, item creation, or Spell Mastery feat.',
        },
      ],
    },
    {
      level: 10,
      features: [
        {
          id: 'bonus-feat-10',
          name: 'Bonus Feat',
          source: 'Wizard 10',
          description: 'Gain another bonus feat.',
        },
      ],
    },
    {
      level: 15,
      features: [
        {
          id: 'bonus-feat-15',
          name: 'Bonus Feat',
          source: 'Wizard 15',
          description: 'Gain another bonus feat.',
        },
      ],
    },
    {
      level: 20,
      features: [
        {
          id: 'bonus-feat-20',
          name: 'Bonus Feat',
          source: 'Wizard 20',
          description: 'Gain another bonus feat.',
        },
      ],
    },
  ],
  subclassLevel: 1,
  subclasses: [],
  spellcasting: {
    ability: 'int',
    spellListId: 'wizard-pf1e',
    preparedCasterFormula: 'int_mod + class_level',
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
  classResources: [],
  multiclassRequirements: [],
  multiclassProficiencies: { armor: [], weapons: [], tools: [] },
  description:
    'Beyond the veil of the mundane hide the secrets of absolute power. The works of beings beyond mortals, the ## powerful and mysterious arcane magic.',
  displayMetadata: {
    icon: 'book',
    color: '#4169E1',
    shortDescription: 'A prepared arcane caster with access to the largest spell list.',
    playStyle: 'Versatile prepared caster with school specialization',
    complexity: 'complex',
    role: 'controller',
    idealFor: ['Spell variety enthusiasts', 'Strategic thinkers', 'Knowledge seekers'],
    tags: ['arcane', 'spellcaster'],
    casterType: 'full',
  },
};
