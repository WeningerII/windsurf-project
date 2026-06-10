import { CharacterClass } from '../../../../types/character-options/classes';

export const sorcerer: CharacterClass = {
  id: 'sorcerer',
  name: 'Sorcerer',
  system: 'pf1e',
  source: 'Core Rulebook',
  version: '1.0',
  lastUpdated: '2026-01-13',
  sourceBook: {
    name: 'Pathfinder Core Rulebook',
    page: 70,
    url: 'https://www.d20pfsrd.com/classes/core-classes/sorcerer/',
  },
  hitDie: 'd6',
  d20Profile: {
    bab: 'half',
    fortSave: 'poor',
    refSave: 'poor',
    willSave: 'good',
  },
  primaryAbility: ['cha'],
  armorProficiencies: [],
  weaponProficiencies: ['simple'],
  toolProficiencies: [],
  skillProficiencies: {
    count: 2,
    options: [
      'appraise',
      'bluff',
      'fly',
      'intimidate',
      'knowledge-arcana',
      'spellcraft',
      'use-magic',
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
          id: 'bloodline',
          name: 'Bloodline',
          source: 'Sorcerer 1',
          description:
            'Choose a bloodline that grants class skills, bonus spells, bonus feats, and bloodline powers.',
        },
        {
          id: 'bloodline-power-1',
          name: 'Bloodline Power',
          source: 'Sorcerer 1',
          description: "Gain your bloodline's 1st-level power.",
        },
        {
          id: 'cantrips',
          name: 'Cantrips',
          source: 'Sorcerer 1',
          description: 'Cast 0-level spells at will.',
        },
        {
          id: 'eschew-materials',
          name: 'Eschew Materials',
          source: 'Sorcerer 1',
          description: 'Gain Eschew Materials as a bonus feat.',
        },
      ],
    },
    {
      level: 3,
      features: [
        {
          id: 'bloodline-power-3',
          name: 'Bloodline Power',
          source: 'Sorcerer 3',
          description: "Gain your bloodline's 3rd-level power.",
        },
        {
          id: 'bloodline-spell-3',
          name: 'Bloodline Spell',
          source: 'Sorcerer 3',
          description: 'Add your 1st bloodline spell to spells known.',
        },
      ],
    },
    {
      level: 5,
      features: [
        {
          id: 'bloodline-spell-5',
          name: 'Bloodline Spell',
          source: 'Sorcerer 5',
          description: 'Add your 2nd bloodline spell to spells known.',
        },
      ],
    },
    {
      level: 7,
      features: [
        {
          id: 'bloodline-feat-7',
          name: 'Bloodline Feat',
          source: 'Sorcerer 7',
          description: 'Gain a bonus feat from your bloodline list.',
        },
        {
          id: 'bloodline-spell-7',
          name: 'Bloodline Spell',
          source: 'Sorcerer 7',
          description: 'Add your 3rd bloodline spell to spells known.',
        },
      ],
    },
    {
      level: 9,
      features: [
        {
          id: 'bloodline-power-9',
          name: 'Bloodline Power',
          source: 'Sorcerer 9',
          description: "Gain your bloodline's 9th-level power.",
        },
        {
          id: 'bloodline-spell-9',
          name: 'Bloodline Spell',
          source: 'Sorcerer 9',
          description: 'Add your 4th bloodline spell to spells known.',
        },
      ],
    },
    {
      level: 11,
      features: [
        {
          id: 'bloodline-spell-11',
          name: 'Bloodline Spell',
          source: 'Sorcerer 11',
          description: 'Add your 5th bloodline spell to spells known.',
        },
      ],
    },
    {
      level: 13,
      features: [
        {
          id: 'bloodline-feat-13',
          name: 'Bloodline Feat',
          source: 'Sorcerer 13',
          description: 'Gain another bonus feat from your bloodline list.',
        },
        {
          id: 'bloodline-spell-13',
          name: 'Bloodline Spell',
          source: 'Sorcerer 13',
          description: 'Add your 6th bloodline spell to spells known.',
        },
      ],
    },
    {
      level: 15,
      features: [
        {
          id: 'bloodline-power-15',
          name: 'Bloodline Power',
          source: 'Sorcerer 15',
          description: "Gain your bloodline's 15th-level power.",
        },
        {
          id: 'bloodline-spell-15',
          name: 'Bloodline Spell',
          source: 'Sorcerer 15',
          description: 'Add your 7th bloodline spell to spells known.',
        },
      ],
    },
    {
      level: 17,
      features: [
        {
          id: 'bloodline-spell-17',
          name: 'Bloodline Spell',
          source: 'Sorcerer 17',
          description: 'Add your 8th bloodline spell to spells known.',
        },
      ],
    },
    {
      level: 19,
      features: [
        {
          id: 'bloodline-feat-19',
          name: 'Bloodline Feat',
          source: 'Sorcerer 19',
          description: 'Gain another bonus feat from your bloodline list.',
        },
        {
          id: 'bloodline-spell-19',
          name: 'Bloodline Spell',
          source: 'Sorcerer 19',
          description: 'Add your 9th bloodline spell to spells known.',
        },
      ],
    },
    {
      level: 20,
      features: [
        {
          id: 'bloodline-power-20',
          name: 'Bloodline Power',
          source: 'Sorcerer 20',
          description: "Gain your bloodline's capstone power.",
        },
      ],
    },
  ],
  subclassLevel: 1,
  subclasses: [],
  spellcasting: {
    ability: 'cha',
    spellListId: 'sorcerer-pf1e',
    cantripsKnown: [4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
    spellsKnown: [2, 2, 3, 3, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
    spellSlots: {
      1: [3, 4, 5, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
      2: [0, 0, 0, 3, 4, 5, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
      3: [0, 0, 0, 0, 0, 3, 4, 5, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
      4: [0, 0, 0, 0, 0, 0, 0, 3, 4, 5, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
      5: [0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 4, 5, 6, 6, 6, 6, 6, 6, 6, 6],
      6: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 4, 5, 6, 6, 6, 6, 6, 6],
      7: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 4, 5, 6, 6, 6, 6],
      8: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 4, 5, 6, 6],
      9: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 4, 6],
    },
    ritualCasting: false,
    multiclassCasterLevel: 'full',
  },
  classResources: [],
  multiclassRequirements: [],
  multiclassProficiencies: { armor: [], weapons: [], tools: [] },
  description:
    'Scions of innately magical bloodlines, the chosen of deities, the spawn of monsters, pawns of fate and destiny, or simply flukes of fickle magic, sorcerers look within themselves for arcane prowess.',
  displayMetadata: {
    icon: 'fire',
    color: '#DC143C',
    shortDescription: 'A spontaneous arcane caster powered by innate bloodline magic.',
    playStyle: 'Flexible arcane caster with bloodline powers',
    complexity: 'moderate',
    role: 'controller',
    idealFor: ['Spontaneous casters', 'Blasters', 'Themed character concepts'],
    tags: ['arcane', 'spellcaster'],
    casterType: 'full',
  },
};
