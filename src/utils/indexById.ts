/**
 * Shared id-index helpers with a duplicate-id guard.
 *
 * Index builders across the data layer used to silently last-write-win when
 * two entries shared an id, which let conflicting statblocks/items shadow each
 * other depending on access path (see the potion-of-healing incident). These
 * helpers preserve each call site's existing winner semantics but surface the
 * collision loudly in dev — mirroring the `powerById` guard at
 * src/data/mutants-and-masterminds/3e/powers/aggregations.ts.
 */

type Identified = { id: string };

function warnDuplicateId(label: string, id: string): void {
  // import.meta.env exists under Vite (dev server / vitest) but not under the
  // tsx-driven node scripts, so guard the access.
  if (typeof import.meta.env !== 'undefined' && import.meta.env.DEV) {
    console.warn(`[${label}] Duplicate id detected: ${id}`);
  }
}

/**
 * Build a `Record<id, item>` index. On a duplicate id the LAST entry wins
 * (matching the historical reduce-based indexes) and a dev warning is emitted
 * when the colliding entries are distinct objects (re-aggregations of the same
 * object are harmless and stay silent).
 */
export function indexById<T extends Identified>(
  items: readonly T[],
  label: string
): Record<string, T> {
  const index: Record<string, T> = {};
  for (const item of items) {
    const existing = index[item.id];
    if (existing !== undefined && existing !== item) {
      warnDuplicateId(label, item.id);
    }
    index[item.id] = item;
  }
  return index;
}

/**
 * Drop entries whose id was already seen. The FIRST entry wins (matching the
 * historical loader behavior) and a dev warning is emitted when the dropped
 * entry is a distinct object from the kept one.
 */
export function dedupeById<T extends Identified>(items: readonly T[], label: string): T[] {
  const uniqueItems: T[] = [];
  const keptById = new Map<string, T>();

  for (const item of items) {
    const kept = keptById.get(item.id);
    if (kept !== undefined) {
      if (kept !== item) {
        warnDuplicateId(label, item.id);
      }
      continue;
    }
    keptById.set(item.id, item);
    uniqueItems.push(item);
  }

  return uniqueItems;
}
