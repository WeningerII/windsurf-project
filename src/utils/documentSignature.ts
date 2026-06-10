import type { CharacterDocument, SystemDataModel } from '../types/core/document';
import type { Campaign } from '../types/core/campaign';
import type { SceneDocument } from '../types/core/scene';

/**
 * Cheap document-set change detector for the mutation hot path.
 *
 * Two collections are considered equivalent when they contain the same
 * multiset of (id, version, updatedAt) triples. This is sufficient because the
 * product invariant is that every user-initiated mutation stamps a fresh
 * `updatedAt`; any change to a document's fields implies a change in the
 * triple. Comparison is multiplicity-aware: collections that only differ in
 * how often a duplicated id occurs are NOT considered equal.
 *
 * Do NOT use this for the initial-load / engine-prepare path, where derived
 * fields may be recomputed in place without bumping `updatedAt`. Use a
 * structural/deep compare there instead.
 */

/**
 * Multiset comparison of two collections by a signature key. Unlike a
 * set-based comparison, duplicated signatures must occur the same number of
 * times on both sides, so e.g. [A, A, B] never compares equal to [A, B, B].
 */
function sameSignatureMultisets<T>(
  a: readonly T[],
  b: readonly T[],
  signatureOf: (item: T) => string
): boolean {
  if (a === b) return true;
  if (a.length !== b.length) return false;

  const counts = new Map<string, number>();
  for (let i = 0; i < a.length; i += 1) {
    const signature = signatureOf(a[i]);
    counts.set(signature, (counts.get(signature) ?? 0) + 1);
  }

  for (let i = 0; i < b.length; i += 1) {
    const signature = signatureOf(b[i]);
    const remaining = counts.get(signature);
    if (!remaining) {
      return false;
    }
    counts.set(signature, remaining - 1);
  }

  return true;
}

function toTime(value: Date | string): number {
  return value instanceof Date ? value.getTime() : new Date(value).getTime();
}

function signatureFor(doc: CharacterDocument<SystemDataModel>): string {
  const version = doc.version ?? 1;
  return `${doc.id}|${version}|${toTime(doc.updatedAt)}`;
}

export function sameDocumentSignatures(
  a: readonly CharacterDocument<SystemDataModel>[],
  b: readonly CharacterDocument<SystemDataModel>[]
): boolean {
  return sameSignatureMultisets(a, b, signatureFor);
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
  const members = c.characterIds.slice().sort().join(',');
  return `${c.id}|${toTime(c.updatedAt)}|${members}`;
}

export function sameCampaignSignatures(a: readonly Campaign[], b: readonly Campaign[]): boolean {
  return sameSignatureMultisets(a, b, campaignSignatureFor);
}

/**
 * Scene-set change detector for cross-tab merge short-circuits. The event
 * count is folded in because `appendSceneEvent` stamps `updatedAt` from the
 * event's own `createdAt`, so two appends sharing a timestamp would otherwise
 * be invisible to an (id, updatedAt) pair.
 */
function sceneSignatureFor(scene: SceneDocument): string {
  return `${scene.id}|${toTime(scene.updatedAt)}|${scene.events.length}`;
}

export function sameSceneSignatures(
  a: readonly SceneDocument[],
  b: readonly SceneDocument[]
): boolean {
  return sameSignatureMultisets(a, b, sceneSignatureFor);
}
