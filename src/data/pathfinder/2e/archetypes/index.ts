// Pathfinder 2e Archetypes - Master Index (Strict Core Rulebook only)
// Non-core archetype implementations are intentionally not exported here.

import { Archetype } from '../../../../types/character-options/archetypes';

// Legacy single archetypes (keeping for backwards compatibility)
import { championArchetype } from './champion-archetype';
import { clericArchetype } from './cleric-archetype';
import { rangerArchetype } from './ranger-archetype';
import { rogueArchetype } from './rogue-archetype';
import { wizardArchetype } from './wizard-archetype';

// Strict Core Rulebook exports only
const coreRulebookArchetypes: Archetype[] = [
  championArchetype,
  clericArchetype,
  rangerArchetype,
  rogueArchetype,
  wizardArchetype,
];

// Backward-compatibility placeholders for removed non-core datasets.
// These remain exported as empty arrays so existing imports do not break.
export const coreMulticlassDedications: Archetype[] = [];
export const expandedMulticlassDedications: Archetype[] = [];
export const popularArchetypes: Archetype[] = [];

export const pf2eArchetypes = {
  // Legacy individual exports
  champion: championArchetype,
  cleric: clericArchetype,
  ranger: rangerArchetype,
  rogue: rogueArchetype,
  wizard: wizardArchetype,
  // Core-only archetypes by ID
  ...Object.fromEntries(coreRulebookArchetypes.map(a => [a.id, a])),
};

export const getArchetype = (id: string) => {
  return pf2eArchetypes[id as keyof typeof pf2eArchetypes];
};

// Export individual archetype collections
export {
  // Legacy exports
  championArchetype,
  clericArchetype,
  rangerArchetype,
  rogueArchetype,
  wizardArchetype,
};

// Export combined array for easy iteration
export const allPf2eArchetypes = coreRulebookArchetypes;
