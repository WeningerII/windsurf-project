/**
 * Mutants & Masterminds 3e - Archetypes
 *
 * This content is derived from the System Reference Document and is
 * released under the Open Gaming License v1.0a.
 *
 * Source: Hero's Handbook (d20herosrd.com)
 * License: OGL v1.0a
 */

import { CharacterClass } from '../../../../types/character-options/classes';

export const energyControllerArchetype: CharacterClass = {
  id: 'mam3e-energy-controller',
  name: 'Energy Controller',
  system: 'mam3e',
  source: "Hero's Handbook",
  version: '1.0',
  lastUpdated: '2026-01-15',
  sourceBook: {
    name: "Mutants & Masterminds Hero's Handbook",
    page: 1,
    url: 'https://www.d20herosrd.com/character-creation/archetypes/energy-controller/',
  },
  hitDie: 'd8',
  primaryAbility: ['int', 'con'],
  savingThrowProficiencies: ['dex', 'con'],
  armorProficiencies: [],
  weaponProficiencies: [],
  toolProficiencies: [],
  skillProficiencies: {
    count: 2,
    options: ['science', 'perception'],
    label: 'Choose class skills',
  },
  equipmentChoices: [],
  startingGold: { dice: '1d6', multiplier: 100 },
  features: [
    {
      level: 1,
      features: [
        {
          id: 'energy-manipulation',
          name: 'Energy Manipulation',
          source: 'Energy Controller',
          description: 'Control and project various forms of energy',
        },
        {
          id: 'energy-immunity',
          name: 'Energy Immunity',
          source: 'Energy Controller',
          description: 'Resist your chosen energy type',
        },
      ],
    },
  ],
  subclassLevel: 1,
  subclasses: [],
  description: 'A hero who commands and manipulates various forms of energy.',
};
