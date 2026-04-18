import type { CharacterDocument, SystemDataModel } from '../types/core/document';
import type { Campaign } from '../types/core/campaign';

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

/**
 * Campaign-set change detector.  Campaigns have no `version` column on the
 * server, so the signature triple collapses to (id, updatedAt).  Sorted
 * character-id list is folded into the signature so reordering or
 * add/remove of member characters counts as a change even if updatedAt
 * happens to collide (it shouldn't in practice — every mutation stamps a
 * fresh Date — but it is cheap insurance).
 */
function campaignSignatureFor(c: Campaign): string {
  const updatedAt =
    c.updatedAt instanceof Date ? c.updatedAt.getTime() : new Date(c.updatedAt).getTime();
  const members = c.characterIds.slice().sort().join(',');
  return `${c.id}|${updatedAt}|${members}`;
}

export function sameCampaignSignatures(
  a: readonly Campaign[],
  b: readonly Campaign[]
): boolean {
  if (a === b) return true;
  if (a.length !== b.length) return false;

  const aSignatures = new Set<string>();
  for (let i = 0; i < a.length; i += 1) {
    aSignatures.add(campaignSignatureFor(a[i]));
  }

  for (let i = 0; i < b.length; i += 1) {
    if (!aSignatures.has(campaignSignatureFor(b[i]))) {
      return false;
    }
  }

  return true;
}
