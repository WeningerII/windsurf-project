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

export const martialArtistArchetype: Mam3eArchetype = {
  id: 'mam3e-martial-artist',
  name: 'Martial Artist',
  system: 'mam3e',
  source: "Hero's Handbook",
  version: '1.0',
  lastUpdated: '2026-01-15',
  sourceBook: {
    name: "Mutants & Masterminds Hero's Handbook",
    page: 1,
    url: 'https://www.d20herosrd.com/character-creation/archetypes/martial-artist/',
  },
  suggestedSkills: ['athletics', 'acrobatics'],
  features: [
    {
      level: 1,
      features: [
        {
          id: 'unarmed-mastery',
          name: 'Unarmed Mastery',
          source: 'Martial Artist',
          description: 'Devastating unarmed strikes',
        },
        {
          id: 'ki-control',
          name: 'Ki Control',
          source: 'Martial Artist',
          description: 'Channel inner energy for enhanced abilities',
        },
      ],
    },
  ],
  description: 'A master of martial arts who channels inner energy for devastating combat.',
};
