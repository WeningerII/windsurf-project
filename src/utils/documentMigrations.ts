/**
 * Character-document schema versioning (review M-1).
 *
 * `CharacterDocument.version` was optional and never written, so every
 * persisted document is effectively unversioned ("version 0") and the only
 * schema discipline was an additive-changes-only convention. This module
 * makes the version real:
 *
 *   - new documents are stamped with CURRENT_DOCUMENT_VERSION at creation;
 *   - every load path funnels through `migrateDocument`, an ordered runner
 *     keyed on the document's version (missing = 0), so a future
 *     non-additive change ships as one new entry in MIGRATIONS instead of
 *     silent corruption of local-first data;
 *   - documents from a NEWER app version are passed through untouched (no
 *     downgrade) — refusing to load would hold user data hostage.
 *
 * SceneDocument.version (core/scene.ts) already follows this pattern.
 */

import type { CharacterDocument, SystemDataModel } from '../types/core/document';

export const CURRENT_DOCUMENT_VERSION = 1;

/**
 * MIGRATIONS[n] transforms a version-n document into version n+1.
 * Version 0 (the unversioned era) and version 1 share a shape, so the first
 * migration only stamps the number; append real transforms here when a
 * breaking change to CharacterDocument or a system payload ships.
 */
const MIGRATIONS: Array<
  (doc: CharacterDocument<SystemDataModel>) => CharacterDocument<SystemDataModel>
> = [
  // 0 → 1: stamp only. Today's persisted shape IS version 1.
  (doc) => doc,
];

/** Bring a loaded document up to CURRENT_DOCUMENT_VERSION. Pure. */
export function migrateDocument(
  doc: CharacterDocument<SystemDataModel>
): CharacterDocument<SystemDataModel> {
  let version = doc.version ?? 0;
  if (version >= CURRENT_DOCUMENT_VERSION) {
    return doc;
  }

  let migrated = doc;
  while (version < CURRENT_DOCUMENT_VERSION) {
    migrated = MIGRATIONS[version](migrated);
    version += 1;
  }

  return { ...migrated, version: CURRENT_DOCUMENT_VERSION };
}
