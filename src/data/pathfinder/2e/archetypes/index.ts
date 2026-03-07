// Pathfinder 2e Archetypes - Master Index (Strict Core Rulebook only)
// Single-source architecture: all archetypes combined from individual files

import { Archetype } from '../../../../types/character-options/archetypes';

import { championArchetype } from './champion-archetype';
import { clericArchetype } from './cleric-archetype';
import { rangerArchetype } from './ranger-archetype';
import { rogueArchetype } from './rogue-archetype';
import { wizardArchetype } from './wizard-archetype';

// All archetypes combined (single source of truth)
export const allPf2eArchetypes: Archetype[] = [
  championArchetype,
  clericArchetype,
  rangerArchetype,
  rogueArchetype,
  wizardArchetype,
];

// Archetypes indexed by id for quick lookup
export const pf2eArchetypes: Record<string, Archetype> = Object.fromEntries(
  allPf2eArchetypes.map((a) => [a.id, a])
);
