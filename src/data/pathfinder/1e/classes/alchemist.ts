import { CharacterClass } from '../../../../types/character-options/classes';

export const alchemist: CharacterClass = {
  id: 'alchemist',
  name: 'Alchemist',
  system: 'pf1e',
  source: "Advanced Player's Guide",
  version: '1.0',
  lastUpdated: '2026-04-29',
  sourceBook: {
    name: "Pathfinder Advanced Player's Guide",
    url: 'https://www.d20pfsrd.com/classes/base-classes/alchemist/',
  },
  hitDie: 'd8',
  // Pathfinder SRD (Alchemist): 3/4 BAB, good Fortitude and Reflex, poor Will
  // — previously absent from the hardcoded profile table, so the engine fell
  // back to half BAB / all-poor saves for this class.
  d20Profile: {
    bab: 'three-quarter',
    fortSave: 'good',
    refSave: 'good',
    willSave: 'poor',
  },
  primaryAbility: ['int'],
  armorProficiencies: ['light'],
  weaponProficiencies: ['simple', 'bomb'],
  toolProficiencies: [],
  skillProficiencies: {
    count: 4,
    options: [
      'appraise',
      'craft',
      'disable-device',
      'fly',
      'heal',
      'knowledge-arcana',
      'knowledge-nature',
      'perception',
      'profession',
      'sleight-of-hand',
      'spellcraft',
      'survival',
      'use-magic-device',
    ],
    label: 'Choose class skills (4 + Int modifier ranks per level)',
  },
  equipmentChoices: [],
  startingGold: { dice: '3d6', multiplier: 10 },
  features: [
    {
      level: 1,
      features: [
        {
          id: 'alchemy',
          name: 'Alchemy',
          source: 'Alchemist 1',
          description: 'Create extracts, bombs, and mutagens using alchemical methods.',
        },
        {
          id: 'bomb',
          name: 'Bomb',
          source: 'Alchemist 1',
          description: 'Throw volatile bombs a limited number of times per day.',
        },
        {
          id: 'brew-potion',
          name: 'Brew Potion',
          source: 'Alchemist 1',
          description: 'Gain Brew Potion as a bonus feat.',
        },
        {
          id: 'mutagen',
          name: 'Mutagen',
          source: 'Alchemist 1',
          description: 'Brew a mutagen that enhances physical ability scores.',
        },
      ],
    },
  ],
  subclassLevel: 1,
  subclasses: [],
  classResources: [],
  multiclassRequirements: [],
  multiclassProficiencies: { armor: [], weapons: [], tools: [] },
  description:
    'Alchemists combine magic and chemistry into extracts, bombs, mutagens, and discoveries.',
};
