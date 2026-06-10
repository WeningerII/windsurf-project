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

export const warriorArchetype: Mam3eArchetype = {
  id: 'mam3e-warrior',
  name: 'Warrior',
  system: 'mam3e',
  source: "Hero's Handbook",
  version: '1.0',
  lastUpdated: '2026-01-15',
  sourceBook: {
    name: "Mutants & Masterminds Hero's Handbook",
    page: 1,
    url: 'https://www.d20herosrd.com/character-creation/archetypes/warrior/',
  },
  suggestedSkills: ['athletics', 'intimidation', 'perception'],
  features: [
    {
      level: 1,
      features: [
        {
          id: 'combat-mastery',
          name: 'Combat Mastery',
          source: 'Warrior',
          description: 'Superior combat skills and tactics',
        },
        {
          id: 'weapon-expertise',
          name: 'Weapon Expertise',
          source: 'Warrior',
          description: 'Expert proficiency with all weapons',
        },
      ],
    },
  ],
  description: 'A skilled combatant trained in weapons, tactics, and warfare.',
};
