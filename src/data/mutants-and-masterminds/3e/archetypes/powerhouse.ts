/**
 * Mutants & Masterminds 3e - Archetypes
 *
 * This content is derived from the System Reference Document and is
 * released under the Open Gaming License v1.0a.
 *
 * Source: Hero's Handbook (d20herosrd.com)
 * License: OGL v1.0a
 */

import { Mam3eArchetype } from '../../../../types/mam/archetypes';

export const powerhouseArchetype: Mam3eArchetype = {
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
  suggestedSkills: ['athletics', 'intimidation'],
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
  description: 'A hero with incredible strength and durability, the ultimate physical combatant.',
};
