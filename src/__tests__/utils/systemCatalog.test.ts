import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { GameSystemId } from '../../types/game-systems';

const {
  systemRegistryGetMock,
  loadAdvantagesForSystemMock,
  loadArchetypesForSystemMock,
  loadBackgroundsForSystemMock,
  loadClassesForSystemMock,
  loadComplicationsForSystemMock,
  loadEquipmentForSystemMock,
  loadFeatsForSystemMock,
  loadFeatureOptionsForSystemMock,
  loadMam3eArchetypesForSystemMock,
  loadMonstersForSystemMock,
  loadPf2eBackgroundsForSystemMock,
  loadPowerModifiersForSystemMock,
  loadSpeciesForSystemMock,
  loadSpellsForSystemMock,
  loadTraitsForSystemMock,
} = vi.hoisted(() => ({
  systemRegistryGetMock: vi.fn(),
  loadAdvantagesForSystemMock: vi.fn(),
  loadArchetypesForSystemMock: vi.fn(),
  loadBackgroundsForSystemMock: vi.fn(),
  loadClassesForSystemMock: vi.fn(),
  loadComplicationsForSystemMock: vi.fn(),
  loadEquipmentForSystemMock: vi.fn(),
  loadFeatsForSystemMock: vi.fn(),
  loadFeatureOptionsForSystemMock: vi.fn(),
  loadMam3eArchetypesForSystemMock: vi.fn(),
  loadMonstersForSystemMock: vi.fn(),
  loadPf2eBackgroundsForSystemMock: vi.fn(),
  loadPowerModifiersForSystemMock: vi.fn(),
  loadSpeciesForSystemMock: vi.fn(),
  loadSpellsForSystemMock: vi.fn(),
  loadTraitsForSystemMock: vi.fn(),
}));

vi.mock('../../registry', () => ({
  systemRegistry: {
    get: systemRegistryGetMock,
  },
}));

vi.mock('../../utils/dataLoader', () => ({
  loadAdvantagesForSystem: loadAdvantagesForSystemMock,
  loadArchetypesForSystem: loadArchetypesForSystemMock,
  loadBackgroundsForSystem: loadBackgroundsForSystemMock,
  loadClassesForSystem: loadClassesForSystemMock,
  loadComplicationsForSystem: loadComplicationsForSystemMock,
  loadEquipmentForSystem: loadEquipmentForSystemMock,
  loadFeatsForSystem: loadFeatsForSystemMock,
  loadFeatureOptionsForSystem: loadFeatureOptionsForSystemMock,
  loadMam3eArchetypesForSystem: loadMam3eArchetypesForSystemMock,
  loadMonstersForSystem: loadMonstersForSystemMock,
  loadPf2eBackgroundsForSystem: loadPf2eBackgroundsForSystemMock,
  loadPowerModifiersForSystem: loadPowerModifiersForSystemMock,
  loadSpeciesForSystem: loadSpeciesForSystemMock,
  loadSpellsForSystem: loadSpellsForSystemMock,
  loadTraitsForSystem: loadTraitsForSystemMock,
}));

import { loadAllSystemCatalogSummaries, loadSystemCatalogSummary } from '../../utils/systemCatalog';

type SupportMeta = {
  label: string;
  version?: string;
  supportLevel: 'full' | 'partial' | 'scaffold';
  supportNotes?: string;
};

const registryMeta: Partial<Record<GameSystemId, SupportMeta>> = {
  'dnd-5e-2024': { label: 'D&D 5e (2024)', version: 'SRD 5.2', supportLevel: 'full' },
  'dnd-5e-2014': { label: 'D&D 5e (2014)', version: 'SRD 5.1', supportLevel: 'full' },
  pf2e: { label: 'Pathfinder 2e', version: 'PF2e SRD', supportLevel: 'full' },
  'dnd-3.5e': {
    label: 'D&D 3.5e',
    version: 'SRD 3.5',
    supportLevel: 'partial',
    supportNotes: 'Base classes only in current product flows',
  },
  pf1e: {
    label: 'Pathfinder 1e',
    version: 'PF1e SRD',
    supportLevel: 'partial',
    supportNotes:
      'Base classes and vetted CRB prestige classes are selectable; prestige spellcasting progression remains manual',
  },
  daggerheart: {
    label: 'Daggerheart',
    version: '1.0',
    supportLevel: 'scaffold',
    supportNotes: 'Manual entry only; no local data modules',
  },
};

function makeItems(prefix: string, count: number): Array<{ id: string }> {
  return Array.from({ length: count }, (_, index) => ({ id: `${prefix}-${index + 1}` }));
}

beforeEach(() => {
  systemRegistryGetMock.mockReset();
  systemRegistryGetMock.mockImplementation((systemId: GameSystemId) => registryMeta[systemId]);

  [
    loadAdvantagesForSystemMock,
    loadArchetypesForSystemMock,
    loadBackgroundsForSystemMock,
    loadClassesForSystemMock,
    loadComplicationsForSystemMock,
    loadEquipmentForSystemMock,
    loadFeatsForSystemMock,
    loadFeatureOptionsForSystemMock,
    loadMam3eArchetypesForSystemMock,
    loadMonstersForSystemMock,
    loadPf2eBackgroundsForSystemMock,
    loadPowerModifiersForSystemMock,
    loadSpeciesForSystemMock,
    loadSpellsForSystemMock,
    loadTraitsForSystemMock,
  ].forEach((mockFn) => {
    mockFn.mockReset();
    mockFn.mockResolvedValue([]);
  });
});

describe('systemCatalog', () => {
  it('summarizes D&D 5e 2014 product categories and source-filtered feats', async () => {
    loadSpellsForSystemMock.mockResolvedValue(makeItems('spell', 2));
    loadClassesForSystemMock.mockResolvedValue(makeItems('class', 1));
    loadSpeciesForSystemMock.mockResolvedValue(makeItems('species', 1));
    loadBackgroundsForSystemMock.mockResolvedValue(makeItems('background', 1));
    loadFeatureOptionsForSystemMock.mockResolvedValue(makeItems('feature-option', 4));
    loadMonstersForSystemMock.mockResolvedValue(makeItems('monster', 1));
    loadEquipmentForSystemMock.mockResolvedValue(makeItems('equipment', 3));

    const summary = await loadSystemCatalogSummary('dnd-5e-2014');

    expect(summary.label).toBe('D&D 5e (2014)');
    expect(summary.supportLevel).toBe('full');
    expect(summary.totalReachableCount).toBe(13);
    expect(summary.categories).toEqual([
      { id: 'spells', label: 'Spells', count: 2, reachability: 'product' },
      { id: 'classes', label: 'Classes', count: 1, reachability: 'product' },
      { id: 'species', label: 'Species', count: 1, reachability: 'product' },
      { id: 'featureOptions', label: 'Feature Options', count: 4, reachability: 'product' },
      { id: 'backgrounds', label: 'Backgrounds', count: 1, reachability: 'product' },
      { id: 'monsters', label: 'Monsters', count: 1, reachability: 'product' },
      { id: 'equipment', label: 'Equipment', count: 3, reachability: 'product' },
      {
        id: 'feats',
        label: 'Feats',
        count: 0,
        reachability: 'source-filtered',
        note: 'SRD 5.1 excludes feat data',
      },
    ]);
    expect(loadFeatureOptionsForSystemMock).toHaveBeenCalledWith('dnd-5e-2014');
    expect(loadMonstersForSystemMock).toHaveBeenCalledWith('dnd-5e-2014');
    expect(loadFeatsForSystemMock).not.toHaveBeenCalled();
  });

  it('summarizes PF2e with dedicated background and archetype loaders', async () => {
    loadSpellsForSystemMock.mockResolvedValue(makeItems('spell', 4));
    loadClassesForSystemMock.mockResolvedValue(makeItems('class', 2));
    loadSpeciesForSystemMock.mockResolvedValue(makeItems('species', 1));
    loadPf2eBackgroundsForSystemMock.mockResolvedValue(makeItems('background', 3));
    loadEquipmentForSystemMock.mockResolvedValue(makeItems('equipment', 5));
    loadFeatsForSystemMock.mockResolvedValue(makeItems('feat', 6));
    loadArchetypesForSystemMock.mockResolvedValue(makeItems('archetype', 2));

    const summary = await loadSystemCatalogSummary('pf2e');

    expect(summary.supportLevel).toBe('full');
    expect(summary.totalReachableCount).toBe(23);
    expect(summary.categories.map((category) => category.id)).toEqual([
      'spells',
      'classes',
      'species',
      'backgrounds',
      'archetypes',
      'equipment',
      'feats',
    ]);
    expect(summary.categories.find((category) => category.id === 'backgrounds')?.count).toBe(3);
    expect(summary.categories.find((category) => category.id === 'archetypes')?.count).toBe(2);
    expect(loadPf2eBackgroundsForSystemMock).toHaveBeenCalledWith('pf2e');
    expect(loadBackgroundsForSystemMock).not.toHaveBeenCalled();
  });

  it('summarizes PF1e traits alongside the d20 content families', async () => {
    loadSpellsForSystemMock.mockResolvedValue(makeItems('spell', 2));
    loadClassesForSystemMock.mockResolvedValue(makeItems('class', 3));
    loadSpeciesForSystemMock.mockResolvedValue(makeItems('species', 1));
    loadEquipmentForSystemMock.mockResolvedValue(makeItems('equipment', 4));
    loadFeatsForSystemMock.mockResolvedValue(makeItems('feat', 5));
    loadTraitsForSystemMock.mockResolvedValue(makeItems('trait', 2));

    const summary = await loadSystemCatalogSummary('pf1e');

    expect(summary.supportLevel).toBe('partial');
    expect(summary.supportNotes).toContain('prestige classes');
    expect(summary.totalReachableCount).toBe(17);
    expect(summary.categories.map((category) => category.id)).toEqual([
      'spells',
      'classes',
      'species',
      'traits',
      'equipment',
      'feats',
    ]);
    expect(loadTraitsForSystemMock).toHaveBeenCalledWith('pf1e');
  });

  it('falls back to default metadata for systems missing registry entries', async () => {
    systemRegistryGetMock.mockImplementation((systemId: GameSystemId) =>
      systemId === 'mam3e' ? undefined : registryMeta[systemId]
    );
    loadSpellsForSystemMock.mockResolvedValue(makeItems('power', 3));
    loadAdvantagesForSystemMock.mockResolvedValue(makeItems('advantage', 2));
    loadMam3eArchetypesForSystemMock.mockResolvedValue(makeItems('archetype', 1));
    loadComplicationsForSystemMock.mockResolvedValue(makeItems('complication', 4));
    loadEquipmentForSystemMock.mockResolvedValue(makeItems('equipment', 1));
    loadPowerModifiersForSystemMock.mockResolvedValue(makeItems('modifier', 5));

    const summary = await loadSystemCatalogSummary('mam3e');

    expect(summary.label).toBe('M&M 3e');
    expect(summary.version).toBe('3e');
    expect(summary.supportLevel).toBe('full');
    expect(summary.totalReachableCount).toBe(16);
    expect(summary.categories).toEqual([
      { id: 'spells', label: 'Powers', count: 3, reachability: 'product' },
      { id: 'archetypes', label: 'Archetypes', count: 1, reachability: 'product' },
      { id: 'complications', label: 'Complications', count: 4, reachability: 'product' },
      { id: 'equipment', label: 'Equipment', count: 1, reachability: 'product' },
      { id: 'advantages', label: 'Advantages', count: 2, reachability: 'product' },
      { id: 'powerModifiers', label: 'Power Modifiers', count: 5, reachability: 'product' },
    ]);
  });

  it('returns an empty scaffold summary for Daggerheart without calling loaders', async () => {
    const summary = await loadSystemCatalogSummary('daggerheart');

    expect(summary.label).toBe('Daggerheart');
    expect(summary.supportLevel).toBe('scaffold');
    expect(summary.supportNotes).toBe('Manual entry only; no local data modules');
    expect(summary.categories).toEqual([]);
    expect(summary.totalReachableCount).toBe(0);
    expect(loadSpellsForSystemMock).not.toHaveBeenCalled();
    expect(loadClassesForSystemMock).not.toHaveBeenCalled();
  });

  it('loads summaries for only the requested system IDs', async () => {
    loadSpellsForSystemMock.mockResolvedValue(makeItems('spell', 1));
    loadClassesForSystemMock.mockResolvedValue(makeItems('class', 1));
    loadSpeciesForSystemMock.mockResolvedValue(makeItems('species', 1));
    loadPf2eBackgroundsForSystemMock.mockResolvedValue(makeItems('background', 1));
    loadEquipmentForSystemMock.mockResolvedValue(makeItems('equipment', 1));
    loadFeatsForSystemMock.mockResolvedValue(makeItems('feat', 1));
    loadArchetypesForSystemMock.mockResolvedValue(makeItems('archetype', 1));

    const summaries = await loadAllSystemCatalogSummaries(['pf2e', 'daggerheart']);

    expect(Object.keys(summaries)).toEqual(['pf2e', 'daggerheart']);
    expect(summaries.pf2e.totalReachableCount).toBe(7);
    expect(summaries.daggerheart.totalReachableCount).toBe(0);
    expect(loadTraitsForSystemMock).not.toHaveBeenCalled();
    expect(loadAdvantagesForSystemMock).not.toHaveBeenCalled();
  });
});
