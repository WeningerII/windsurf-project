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

export const shapeshifterArchetype: Mam3eArchetype = {
  id: 'mam3e-shapeshifter',
  name: 'Shapeshifter',
  system: 'mam3e',
  source: "Hero's Handbook",
  version: '1.0',
  lastUpdated: '2026-01-15',
  sourceBook: {
    name: "Mutants & Masterminds Hero's Handbook",
    page: 1,
    url: 'https://www.d20herosrd.com/character-creation/archetypes/shapeshifter/',
  },
  suggestedSkills: ['acrobatics', 'deception', 'stealth'],
  features: [
    {
      level: 1,
      features: [
        {
          id: 'shape-shifting',
          name: 'Shape Shifting',
          source: 'Shapeshifter',
          description: 'Change physical form',
        },
        {
          id: 'adaptation',
          name: 'Adaptation',
          source: 'Shapeshifter',
          description: 'Adapt to different forms',
        },
      ],
    },
  ],
  description: 'A master of transformation. Shapeshifters change form to suit any situation.',
};
