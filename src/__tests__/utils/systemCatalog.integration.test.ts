// Integration tests for systemCatalog — uses REAL loaders and real registry,
// no vi.mock on dataLoader or systemRegistry.
import { beforeAll, describe, expect, it } from 'vitest';
import { registerAllSystems } from '../../systems';
import { loadSystemCatalogSummary, loadAllSystemCatalogSummaries } from '../../utils/systemCatalog';
import { loadSystemCatalogSummaryFromMetadata } from '../../utils/systemCatalogMetadata';
import { loadFeatsForSystem } from '../../utils/dataLoader';

beforeAll(() => {
  registerAllSystems();
});

describe('systemCatalog integration — real loaders', () => {
  it('dnd-5e-2024: loads non-zero counts for all categories', async () => {
    const summary = await loadSystemCatalogSummary('dnd-5e-2024');

    expect(summary.systemId).toBe('dnd-5e-2024');
    expect(summary.supportLevel).toBe('full');
    expect(summary.totalReachableCount).toBeGreaterThan(0);

    const ids = summary.categories.map((c) => c.id);
    expect(ids).toContain('spells');
    expect(ids).toContain('classes');
    expect(ids).toContain('feats');

    for (const cat of summary.categories) {
      if (cat.reachability === 'product') {
        expect(cat.count).toBeGreaterThan(0);
      }
    }
  });

  it('dnd-5e-2014: loads real feats (not source-filtered, not empty)', async () => {
    const [feats, summary] = await Promise.all([
      loadFeatsForSystem('dnd-5e-2014'),
      loadSystemCatalogSummaryFromMetadata('dnd-5e-2014'),
    ]);

    expect(summary.systemId).toBe('dnd-5e-2014');
    const featCat = summary.categories.find((c) => c.id === 'feats');
    expect(feats.length).toBeGreaterThan(0);
    expect(featCat).toBeDefined();
    expect(featCat!.reachability).toBe('product');
    expect(featCat!.count).toBe(feats.length);
  });

  it('mam3e: loads real powers, advantages, and equipment', async () => {
    const summary = await loadSystemCatalogSummary('mam3e');

    expect(summary.systemId).toBe('mam3e');
    const powersCat = summary.categories.find((c) => c.id === 'spells');
    const advantagesCat = summary.categories.find((c) => c.id === 'advantages');
    const equipmentCat = summary.categories.find((c) => c.id === 'equipment');

    expect(powersCat?.count).toBeGreaterThan(0);
    expect(advantagesCat?.count).toBeGreaterThan(0);
    expect(equipmentCat?.count).toBeGreaterThan(0);
  });

  it('pf2e: loads archetypes and pf2e-specific backgrounds via dedicated loaders', async () => {
    const summary = await loadSystemCatalogSummary('pf2e');

    expect(summary.systemId).toBe('pf2e');
    const archetypesCat = summary.categories.find((c) => c.id === 'archetypes');
    const bgCat = summary.categories.find((c) => c.id === 'backgrounds');

    expect(archetypesCat?.count).toBeGreaterThan(0);
    expect(bgCat?.count).toBeGreaterThan(0);
  });

  it('pf1e: loads traits via dedicated loader', async () => {
    const summary = await loadSystemCatalogSummary('pf1e');

    expect(summary.systemId).toBe('pf1e');
    const traitsCat = summary.categories.find((c) => c.id === 'traits');
    expect(traitsCat?.count).toBeGreaterThan(0);
  });

  it('dnd-3.5e: loads spells and feats', async () => {
    const summary = await loadSystemCatalogSummary('dnd-3.5e');

    expect(summary.systemId).toBe('dnd-3.5e');
    expect(summary.categories.find((c) => c.id === 'spells')?.count).toBeGreaterThan(0);
    expect(summary.categories.find((c) => c.id === 'feats')?.count).toBeGreaterThan(0);
  });

  it('loadAllSystemCatalogSummaries: returns summaries for all 7 systems', async () => {
    const summaries = await loadAllSystemCatalogSummaries();
    const ids = Object.keys(summaries);

    expect(ids).toHaveLength(7);
    expect(ids).toContain('dnd-5e-2024');
    expect(ids).toContain('dnd-5e-2014');
    expect(ids).toContain('pf2e');
    expect(ids).toContain('dnd-3.5e');
    expect(ids).toContain('pf1e');
    expect(ids).toContain('mam3e');
    expect(ids).toContain('daggerheart');

    for (const [, summary] of Object.entries(summaries)) {
      expect(summary.totalReachableCount).toBeGreaterThanOrEqual(0);
    }
  });

  it('metadata path matches loader path for dnd-5e-2014 (feats counts agree)', async () => {
    const [loaderFeats, metaSummary] = await Promise.all([
      loadFeatsForSystem('dnd-5e-2014'),
      loadSystemCatalogSummaryFromMetadata('dnd-5e-2014'),
    ]);

    const metaFeats = metaSummary.categories.find((c) => c.id === 'feats');

    expect(loaderFeats.length).toBe(metaFeats?.count);
    expect(metaFeats?.reachability).toBe('product');
  });
});
