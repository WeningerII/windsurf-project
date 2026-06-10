/**
 * Import-light catalog of the PF1e prestige-class ids (mirrors the 3.5e
 * `productCatalog.ts`): UI grouping can depend on this module without pulling
 * the full class data into its chunk. Kept in lockstep with the classes
 * exported from `./index.ts` by `pf1e-prestige-catalog.test.ts`, so adding a
 * prestige class without updating this list fails CI instead of silently
 * mis-grouping.
 */
export const pf1eProductPrestigeClassIds = [
  'arcane-archer',
  'assassin',
  'dragon-disciple',
  'duelist',
  'lore-master',
  'mystic-theurge',
  'shadowdancer',
] as const;

const pf1eProductPrestigeClassIdSet = new Set<string>(pf1eProductPrestigeClassIds);

export function isPf1eProductPrestigeClassId(classId: string): boolean {
  return pf1eProductPrestigeClassIdSet.has(classId);
}
