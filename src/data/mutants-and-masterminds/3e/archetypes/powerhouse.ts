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

export const powerhouseArchetype: CharacterClass = {
  id: 'mam3e-powerhouse',
  name: 'Powerhouse',
  system: 'mam3e',
  source: "Hero's Handbook",
  version: '1.0',
  lastUpdated: '2026-01-15',
  sourceBook: {
    name: "Mutants & Masterminds Hero's Handbook",
    page: 1,
    url: 'https://www.d20herosrd.com/character-creation/archetypes/powerhouse/',
  },
  hitDie: 'd12',
  primaryAbility: ['str', 'con'],
  savingThrowProficiencies: ['str', 'con'],
  armorProficiencies: [],
  weaponProficiencies: [],
  toolProficiencies: [],
  skillProficiencies: {
    count: 2,
    options: ['athletics', 'intimidation'],
    label: 'Choose class skills',
  },
  equipmentChoices: [],
  startingGold: { dice: '1d6', multiplier: 100 },
  features: [
    {
      level: 1,
      features: [
        {
          id: 'massive-strength',
          name: 'Massive Strength',
          source: 'Powerhouse',
          description: 'Overwhelming physical strength',
        },
        {
          id: 'super-toughness',
          name: 'Super-Toughness',
          source: 'Powerhouse',
          description: 'Extraordinary durability and resilience',
        },
      ],
    },
  ],
  subclassLevel: 1,
  subclasses: [],
  description: 'A hero with incredible strength and durability, the ultimate physical combatant.',
};
