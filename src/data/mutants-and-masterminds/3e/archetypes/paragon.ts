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

export const paragonArchetype: CharacterClass = {
  id: 'mam3e-paragon',
  name: 'Paragon',
  system: 'mam3e',
  source: "Hero's Handbook",
  version: '1.0',
  lastUpdated: '2026-01-15',
  sourceBook: {
    name: "Mutants & Masterminds Hero's Handbook",
    page: 1,
    url: 'https://www.d20herosrd.com/character-creation/archetypes/paragon/',
  },
  hitDie: 'd10',
  primaryAbility: ['str', 'con'],
  savingThrowProficiencies: ['str', 'con'],
  armorProficiencies: [],
  weaponProficiencies: [],
  toolProficiencies: [],
  skillProficiencies: {
    count: 3,
    options: ['athletics', 'perception', 'persuasion'],
    label: 'Choose class skills',
  },
  equipmentChoices: [],
  startingGold: { dice: '1d6', multiplier: 100 },
  features: [
    {
      level: 1,
      features: [
        {
          id: 'super-strength',
          name: 'Super-Strength',
          source: 'Paragon',
          description: 'Incredible strength and physical power',
        },
        { id: 'flight', name: 'Flight', source: 'Paragon', description: 'Ability to fly' },
        {
          id: 'invulnerability',
          name: 'Invulnerability',
          source: 'Paragon',
          description: 'Nearly invulnerable to damage',
        },
      ],
    },
  ],
  subclassLevel: 1,
  subclasses: [],
  description: 'The classic flying brick with super-strength, invulnerability, and flight.',
};
