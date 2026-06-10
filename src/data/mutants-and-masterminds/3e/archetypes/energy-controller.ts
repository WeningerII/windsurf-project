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

export const energyControllerArchetype: Mam3eArchetype = {
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
  suggestedSkills: ['science', 'perception'],
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
  description: 'A hero who commands and manipulates various forms of energy.',
};
