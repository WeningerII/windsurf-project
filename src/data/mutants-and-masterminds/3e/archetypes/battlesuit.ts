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

export const battlesuitArchetype: Mam3eArchetype = {
  id: 'mam3e-battlesuit',
  name: 'Battlesuit',
  system: 'mam3e',
  source: "Hero's Handbook",
  version: '1.0',
  lastUpdated: '2026-01-15',
  sourceBook: {
    name: "Mutants & Masterminds Hero's Handbook",
    page: 1,
    url: 'https://www.d20herosrd.com/character-creation/archetypes/battlesuit/',
  },
  suggestedSkills: ['technology', 'athletics', 'perception'],
  features: [
    {
      level: 1,
      features: [
        {
          id: 'powered-armor',
          name: 'Powered Armor',
          source: 'Battlesuit',
          description: 'Advanced technological battlesuit with enhanced abilities',
        },
        {
          id: 'weapons-array',
          name: 'Weapons Array',
          source: 'Battlesuit',
          description: 'Integrated weapon systems',
        },
      ],
    },
  ],
  description: 'A hero in a technological battlesuit with advanced weapons and protection.',
};
