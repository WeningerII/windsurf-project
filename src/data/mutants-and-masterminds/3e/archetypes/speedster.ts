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

export const speedsterArchetype: Mam3eArchetype = {
  id: 'mam3e-speedster',
  name: 'Speedster',
  system: 'mam3e',
  source: "Hero's Handbook",
  version: '1.0',
  lastUpdated: '2026-01-15',
  sourceBook: {
    name: "Mutants & Masterminds Hero's Handbook",
    page: 1,
    url: 'https://www.d20herosrd.com/character-creation/archetypes/speedster/',
  },
  suggestedSkills: ['acrobatics', 'athletics', 'perception'],
  features: [
    {
      level: 1,
      features: [
        {
          id: 'super-speed',
          name: 'Super Speed',
          source: 'Speedster',
          description: 'Move at superhuman velocities',
        },
        {
          id: 'quick-reflexes',
          name: 'Quick Reflexes',
          source: 'Speedster',
          description: 'Bonus actions in combat',
        },
      ],
    },
  ],
  description: 'A hero with superhuman speed. Speedsters excel at mobility and quick strikes.',
};
