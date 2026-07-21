/**
 * Core Document Architecture
 *
 * This file defines the generic container structure for all character data.
 * It follows the "Document & Data Model" pattern where the Core Application
 * manages the container (ID, metadata) and the System handles the implementation details.
 */

// Type-only imports from the systems layer (allowed by the layer boundary —
// erased at compile time; see .eslintrc.json). These wire the existing
// per-system data models into the discriminated union below (REMEDIATION_PLAN
// Phase 3.1) without adding any runtime dependency on src/systems/**.
import type { GameSystemId } from '../game-systems';
import type { Dnd5eDataModel } from '../../systems/dnd5e/data-model';
import type { Dnd5e2024DataModel } from '../../systems/dnd5e-2024/data-model';
import type { Dnd35eDataModel } from '../../systems/dnd35e/data-model';
import type { Pf1eDataModel } from '../../systems/pf1e/data-model';
import type { Pf2eDataModel } from '../../systems/pf2e/data-model';
import type { Mam3eDataModel } from '../../systems/mam3e/data-model';
import type { DaggerheartDataModel } from '../../systems/daggerheart/data-model';

/**
 * The base interface that all System Data Models must extend.
 * This ensures that every system has at least a minimal structure.
 *
 * Systems should define their own specific interfaces extending this.
 * e.g., interface Dnd5eData extends SystemDataModel { attributes: ... }
 */
export interface SystemDataModel {
  [key: string]: unknown;
}

/**
 * The Generic Character Document.
 *
 * This is the object that gets saved to localStorage/database.
 * It wraps the system-specific data in a type-safe container.
 *
 * @template T The specific System Data Model (defaults to generic)
 */
export interface CharacterDocument<T extends SystemDataModel = SystemDataModel> {
  // Universal Identity & Metadata
  id: string;
  name: string;

  // The System Discriminator
  // This tells the app which System Engine to load
  systemId: string;

  // Universal Visuals
  img?: string;

  // The Black Box
  // This contains ALL system-specific mechanics (stats, items, spells, etc.)
  // The Core App should rarely touch this directly, instead delegating to the System Engine.
  system: T;

  // Metadata
  createdAt: Date;
  updatedAt: Date;
  version?: number;
}

/**
 * The systemId → data-model wiring (REMEDIATION_PLAN Phase 3.1).
 *
 * One entry per `GameSystemId`; the mapped-type derivations below stay
 * exhaustive automatically — adding a system without an entry here is a
 * compile error.
 */
export interface SystemDataModelMap {
  'dnd-5e-2014': Dnd5eDataModel;
  'dnd-5e-2024': Dnd5e2024DataModel;
  'dnd-3.5e': Dnd35eDataModel;
  pf1e: Pf1eDataModel;
  pf2e: Pf2eDataModel;
  mam3e: Mam3eDataModel;
  daggerheart: DaggerheartDataModel;
}

// Exhaustiveness: `Record<GameSystemId, true>` forces one key per system —
// a missing or extra key is a compile error — and the runtime guard set is
// derived from it, so it can never drift from the map above.
const KNOWN_SYSTEM_ID_FLAGS: Record<GameSystemId, true> = {
  'dnd-5e-2014': true,
  'dnd-5e-2024': true,
  'dnd-3.5e': true,
  pf1e: true,
  pf2e: true,
  mam3e: true,
  daggerheart: true,
};
const KNOWN_SYSTEM_IDS: ReadonlySet<string> = new Set(Object.keys(KNOWN_SYSTEM_ID_FLAGS));

/**
 * A `CharacterDocument` whose `systemId` is narrowed to a specific system and
 * whose `system` payload is that system's concrete data model.
 */
export interface SystemCharacterDocument<K extends GameSystemId> extends CharacterDocument<
  SystemDataModelMap[K]
> {
  systemId: K;
}

/**
 * The discriminated union of every known system's character document, keyed on
 * `systemId`. Narrow with the `isSystemDocument` guard (or a `switch` on
 * `systemId` once a value is typed as this union).
 */
export type AnyCharacterDocument = {
  [K in GameSystemId]: SystemCharacterDocument<K>;
}[GameSystemId];

/**
 * `systemId`-narrowing type guard: refines a generic `CharacterDocument` to
 * the requested system's document type. Purely a discriminator check — it does
 * NOT validate the `system` payload's shape (that is Phase 3.2's
 * parse-at-the-boundary work).
 */
export function isSystemDocument<K extends GameSystemId>(
  document: CharacterDocument,
  systemId: K
): document is SystemCharacterDocument<K> {
  return document.systemId === systemId;
}

/**
 * Guard for the union itself: true when the document's `systemId` names one of
 * the known game systems (i.e. it can be treated as `AnyCharacterDocument`).
 */
export function isKnownSystemDocument(
  document: CharacterDocument
): document is AnyCharacterDocument {
  return KNOWN_SYSTEM_IDS.has(document.systemId);
}
