import type { CharacterDocument, SystemDataModel } from '../types/core/document';

/**
 * Cheap document-set change detector for the mutation hot path.
 *
 * Two collections are considered equivalent when they contain the same
 * set of (id, version, updatedAt) triples. This is sufficient because the
 * product invariant is that every user-initiated mutation stamps a fresh
 * `updatedAt`; any change to a document's fields implies a change in the
 * triple.
 *
 * Do NOT use this for the initial-load / engine-prepare path, where derived
 * fields may be recomputed in place without bumping `updatedAt`. Use a
 * structural/deep compare there instead.
 */

function signatureFor(doc: CharacterDocument<SystemDataModel>): string {
  const version = doc.version ?? 1;
  const updatedAt =
    doc.updatedAt instanceof Date ? doc.updatedAt.getTime() : new Date(doc.updatedAt).getTime();
  return `${doc.id}|${version}|${updatedAt}`;
}

export function sameDocumentSignatures(
  a: readonly CharacterDocument<SystemDataModel>[],
  b: readonly CharacterDocument<SystemDataModel>[]
): boolean {
  if (a === b) return true;
  if (a.length !== b.length) return false;

  const aSignatures = new Set<string>();
  for (let i = 0; i < a.length; i += 1) {
    aSignatures.add(signatureFor(a[i]));
  }

  for (let i = 0; i < b.length; i += 1) {
    if (!aSignatures.has(signatureFor(b[i]))) {
      return false;
    }
  }

  return true;
}
