import { describe, expect, it } from 'vitest';
import { pf1ePrestigeClasses } from '../data/pathfinder/1e/prestige-classes';
import {
  isPf1eProductPrestigeClassId,
  pf1eProductPrestigeClassIds,
} from '../data/pathfinder/1e/prestige-classes/productCatalog';
import { dnd35eNormalizedPrestigeClasses } from '../data/dnd/3.5e/prestige-classes';
import {
  dnd35eProductPrestigeClassIds,
  isDnd35eProductPrestigeClassId,
} from '../data/dnd/3.5e/prestige-classes/productCatalog';

describe('d20-legacy prestige-class catalogs', () => {
  it('keeps the PF1e import-light id catalog in lockstep with the exported prestige classes', () => {
    // The grouping predicate used by D20ClassesSection must cover exactly the
    // prestige classes the data loader serves — a class added to the index
    // without a catalog entry would silently render under "Base Classes".
    expect([...pf1eProductPrestigeClassIds].sort()).toEqual(
      pf1ePrestigeClasses.map((klass) => klass.id).sort()
    );
  });

  it('classifies PF1e prestige ids through the exported predicate', () => {
    pf1ePrestigeClasses.forEach((klass) => {
      expect(isPf1eProductPrestigeClassId(klass.id)).toBe(true);
    });
    expect(isPf1eProductPrestigeClassId('wizard')).toBe(false);
    expect(isPf1eProductPrestigeClassId('fighter')).toBe(false);
  });

  it('keeps the 3.5e id catalog in lockstep with its exported prestige classes', () => {
    expect([...dnd35eProductPrestigeClassIds].sort()).toEqual(
      dnd35eNormalizedPrestigeClasses.map((klass) => klass.id).sort()
    );
    expect(isDnd35eProductPrestigeClassId('mystic-theurge-35e')).toBe(true);
    expect(isDnd35eProductPrestigeClassId('wizard')).toBe(false);
  });
});
