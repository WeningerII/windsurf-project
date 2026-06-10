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

export const crimeFighterArchetype: Mam3eArchetype = {
  id: 'mam3e-crime-fighter',
  name: 'Crime Fighter',
  system: 'mam3e',
  source: "Hero's Handbook",
  version: '1.0',
  lastUpdated: '2026-01-15',
  sourceBook: {
    name: "Mutants & Masterminds Hero's Handbook",
    page: 1,
    url: 'https://www.d20herosrd.com/character-creation/archetypes/crime-fighter/',
  },
  suggestedSkills: ['investigation', 'stealth', 'athletics', 'intimidation'],
  features: [
    {
      level: 1,
      features: [
        {
          id: 'detective-skills',
          name: 'Detective Skills',
          source: 'Crime Fighter',
          description: 'Superior investigation and deduction abilities',
        },
        {
          id: 'combat-training',
          name: 'Combat Training',
          source: 'Crime Fighter',
          description: 'Expert hand-to-hand combat skills',
        },
      ],
    },
  ],
  description: 'A non-powered vigilante who fights crime through skill, training, and gadgets.',
};
