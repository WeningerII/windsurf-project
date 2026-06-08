import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { GameSystemId } from '../../types/game-systems';

const {
  systemRegistryGetMock,
  loadAdvantagesForSystemMock,
  loadArchetypesForSystemMock,
  loadBackgroundsForSystemMock,
  loadClassesForSystemMock,
  loadComplicationsForSystemMock,
  loadDaggerheartAncestriesForSystemMock,
  loadDaggerheartClassesForSystemMock,
  loadDaggerheartCommunitiesForSystemMock,
  loadDaggerheartConsumablesForSystemMock,
  loadDaggerheartDomainCardsForSystemMock,
  loadDaggerheartDomainsForSystemMock,
  loadDaggerheartArmorForSystemMock,
  loadDaggerheartLootForSystemMock,
  loadDaggerheartWeaponsForSystemMock,
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
  loadDaggerheartAncestriesForSystemMock: vi.fn(),
  loadDaggerheartClassesForSystemMock: vi.fn(),
  loadDaggerheartCommunitiesForSystemMock: vi.fn(),
  loadDaggerheartConsumablesForSystemMock: vi.fn(),
  loadDaggerheartDomainCardsForSystemMock: vi.fn(),
  loadDaggerheartDomainsForSystemMock: vi.fn(),
  loadDaggerheartArmorForSystemMock: vi.fn(),
  loadDaggerheartLootForSystemMock: vi.fn(),
  loadDaggerheartWeaponsForSystemMock: vi.fn(),
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
  loadDaggerheartAncestriesForSystem: loadDaggerheartAncestriesForSystemMock,
  loadDaggerheartClassesForSystem: loadDaggerheartClassesForSystemMock,
  loadDaggerheartCommunitiesForSystem: loadDaggerheartCommunitiesForSystemMock,
  loadDaggerheartConsumablesForSystem: loadDaggerheartConsumablesForSystemMock,
  loadDaggerheartDomainCardsForSystem: loadDaggerheartDomainCardsForSystemMock,
  loadDaggerheartDomainsForSystem: loadDaggerheartDomainsForSystemMock,
  loadDaggerheartArmorForSystem: loadDaggerheartArmorForSystemMock,
  loadDaggerheartLootForSystem: loadDaggerheartLootForSystemMock,
  loadDaggerheartWeaponsForSystem: loadDaggerheartWeaponsForSystemMock,
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

import {
  clearSystemCatalogSummaryCache,
  loadAllSystemCatalogSummaries,
  loadSystemCatalogSummary,
} from '../../utils/systemCatalog';
import {
  clearSystemCatalogMetadataSummaryCache,
  loadSystemCatalogSummaryFromMetadata,
} from '../../utils/systemCatalogMetadata';

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
    supportNotes: 'Base classes plus the full core SRD prestige catalog are selectable',
  },
  pf1e: {
    label: 'Pathfinder 1e',
    version: 'PF1e SRD',
    supportLevel: 'partial',
    supportNotes:
      'Base classes and vetted CRB prestige classes are selectable; prestige spellcasting advancement is automated for the shipped prestige casters',
  },
  daggerheart: {
    label: 'Daggerheart',
    version: '1.0',
    supportLevel: 'partial',
    supportNotes:
      'SRD-backed selectors, starter templates, browse tabs, equipment loadouts, gold tracking, and loot libraries are shipped; deterministic passive card bonuses are auto-applied where represented, while triggered, timing-based, and choice-based card effects remain tracked-but-manual or reference-only',
  },
};

function makeItems(prefix: string, count: number): Array<{ id: string }> {
  return Array.from({ length: count }, (_, index) => ({ id: `${prefix}-${index + 1}` }));
}

beforeEach(() => {
  clearSystemCatalogSummaryCache();
  clearSystemCatalogMetadataSummaryCache();
  systemRegistryGetMock.mockReset();
  systemRegistryGetMock.mockImplementation((systemId: GameSystemId) => registryMeta[systemId]);

  [
    loadAdvantagesForSystemMock,
    loadArchetypesForSystemMock,
    loadBackgroundsForSystemMock,
    loadClassesForSystemMock,
    loadComplicationsForSystemMock,
    loadDaggerheartAncestriesForSystemMock,
    loadDaggerheartClassesForSystemMock,
    loadDaggerheartCommunitiesForSystemMock,
    loadDaggerheartConsumablesForSystemMock,
    loadDaggerheartDomainCardsForSystemMock,
    loadDaggerheartDomainsForSystemMock,
    loadDaggerheartArmorForSystemMock,
    loadDaggerheartLootForSystemMock,
    loadDaggerheartWeaponsForSystemMock,
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
  it('summarizes D&D 5e 2014 product categories including real feats', async () => {
    loadSpellsForSystemMock.mockResolvedValue(makeItems('spell', 2));
    loadClassesForSystemMock.mockResolvedValue(makeItems('class', 1));
    loadSpeciesForSystemMock.mockResolvedValue(makeItems('species', 1));
    loadBackgroundsForSystemMock.mockResolvedValue(makeItems('background', 1));
    loadFeatureOptionsForSystemMock.mockResolvedValue(makeItems('feature-option', 4));
    loadMonstersForSystemMock.mockResolvedValue(makeItems('monster', 1));
    loadEquipmentForSystemMock.mockResolvedValue(makeItems('equipment', 3));
    loadFeatsForSystemMock.mockResolvedValue(makeItems('feat', 39));

    const summary = await loadSystemCatalogSummary('dnd-5e-2014');

    expect(summary.label).toBe('D&D 5e (2014)');
    expect(summary.supportLevel).toBe('full');
    expect(summary.totalReachableCount).toBe(52);
    expect(summary.categories).toEqual([
      { id: 'spells', label: 'Spells', count: 2, reachability: 'product' },
      { id: 'classes', label: 'Classes', count: 1, reachability: 'product' },
      { id: 'species', label: 'Species', count: 1, reachability: 'product' },
      { id: 'featureOptions', label: 'Feature Options', count: 4, reachability: 'product' },
      { id: 'backgrounds', label: 'Backgrounds', count: 1, reachability: 'product' },
      { id: 'monsters', label: 'Monsters', count: 1, reachability: 'product' },
      { id: 'equipment', label: 'Equipment', count: 3, reachability: 'product' },
      { id: 'feats', label: 'Feats', count: 39, reachability: 'product' },
    ]);
    expect(loadFeatureOptionsForSystemMock).toHaveBeenCalledWith('dnd-5e-2014');
    expect(loadMonstersForSystemMock).toHaveBeenCalledWith('dnd-5e-2014');
    expect(loadFeatsForSystemMock).toHaveBeenCalledWith('dnd-5e-2014');
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

  it('reports d20 legacy monsters as a product category', async () => {
    loadSpellsForSystemMock.mockResolvedValue(makeItems('spell', 1));
    loadClassesForSystemMock.mockResolvedValue(makeItems('class', 1));
    loadSpeciesForSystemMock.mockResolvedValue(makeItems('species', 1));
    loadEquipmentForSystemMock.mockResolvedValue(makeItems('equipment', 1));
    loadFeatsForSystemMock.mockResolvedValue(makeItems('feat', 1));
    loadTraitsForSystemMock.mockResolvedValue(makeItems('trait', 1));
    loadMonstersForSystemMock.mockResolvedValue(makeItems('monster', 99));

    const dnd35e = await loadSystemCatalogSummary('dnd-3.5e');
    const pf1e = await loadSystemCatalogSummary('pf1e');

    expect(dnd35e.categories.find((category) => category.id === 'monsters')?.count).toBe(99);
    expect(pf1e.categories.find((category) => category.id === 'monsters')?.count).toBe(99);
    expect(loadMonstersForSystemMock).toHaveBeenCalledWith('dnd-3.5e');
    expect(loadMonstersForSystemMock).toHaveBeenCalledWith('pf1e');
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

  it('summarizes Daggerheart from its dedicated SRD-backed loaders', async () => {
    loadDaggerheartClassesForSystemMock.mockResolvedValue(makeItems('dh-class', 9));
    loadDaggerheartAncestriesForSystemMock.mockResolvedValue(makeItems('dh-ancestry', 19));
    loadDaggerheartCommunitiesForSystemMock.mockResolvedValue(makeItems('dh-community', 9));
    loadDaggerheartDomainsForSystemMock.mockResolvedValue(makeItems('dh-domain', 9));
    loadDaggerheartDomainCardsForSystemMock.mockResolvedValue(makeItems('dh-card', 189));
    loadDaggerheartWeaponsForSystemMock.mockResolvedValue(makeItems('dh-weapon', 204));
    loadDaggerheartArmorForSystemMock.mockResolvedValue(makeItems('dh-armor', 34));
    loadDaggerheartLootForSystemMock.mockResolvedValue(makeItems('dh-loot', 61));
    loadDaggerheartConsumablesForSystemMock.mockResolvedValue(makeItems('dh-consumable', 54));

    const summary = await loadSystemCatalogSummary('daggerheart');

    expect(summary.label).toBe('Daggerheart');
    expect(summary.supportLevel).toBe('partial');
    expect(summary.supportNotes).toContain('starter templates');
    expect(summary.categories).toEqual([
      { id: 'classes', label: 'Classes', count: 9, reachability: 'product' },
      { id: 'domains', label: 'Domains', count: 9, reachability: 'product' },
      { id: 'domainCards', label: 'Domain Cards', count: 189, reachability: 'product' },
      { id: 'species', label: 'Ancestries', count: 19, reachability: 'product' },
      { id: 'backgrounds', label: 'Communities', count: 9, reachability: 'product' },
      { id: 'equipment', label: 'Equipment', count: 353, reachability: 'product' },
    ]);
    expect(summary.totalReachableCount).toBe(588);
    expect(loadClassesForSystemMock).not.toHaveBeenCalled();
    expect(loadSpeciesForSystemMock).not.toHaveBeenCalled();
    expect(loadBackgroundsForSystemMock).not.toHaveBeenCalled();
    expect(loadDaggerheartClassesForSystemMock).toHaveBeenCalledWith('daggerheart');
    expect(loadDaggerheartAncestriesForSystemMock).toHaveBeenCalledWith('daggerheart');
    expect(loadDaggerheartCommunitiesForSystemMock).toHaveBeenCalledWith('daggerheart');
    expect(loadDaggerheartDomainsForSystemMock).toHaveBeenCalledWith('daggerheart');
    expect(loadDaggerheartDomainCardsForSystemMock).toHaveBeenCalledWith('daggerheart');
    expect(loadDaggerheartWeaponsForSystemMock).toHaveBeenCalledWith('daggerheart');
    expect(loadDaggerheartArmorForSystemMock).toHaveBeenCalledWith('daggerheart');
    expect(loadDaggerheartLootForSystemMock).toHaveBeenCalledWith('daggerheart');
    expect(loadDaggerheartConsumablesForSystemMock).toHaveBeenCalledWith('daggerheart');
  });

  it('loads summaries for only the requested system IDs', async () => {
    loadSpellsForSystemMock.mockResolvedValue(makeItems('spell', 1));
    loadClassesForSystemMock.mockResolvedValue(makeItems('class', 1));
    loadSpeciesForSystemMock.mockResolvedValue(makeItems('species', 1));
    loadPf2eBackgroundsForSystemMock.mockResolvedValue(makeItems('background', 1));
    loadEquipmentForSystemMock.mockResolvedValue(makeItems('equipment', 1));
    loadFeatsForSystemMock.mockResolvedValue(makeItems('feat', 1));
    loadArchetypesForSystemMock.mockResolvedValue(makeItems('archetype', 1));
    loadDaggerheartClassesForSystemMock.mockResolvedValue(makeItems('dh-class', 9));
    loadDaggerheartAncestriesForSystemMock.mockResolvedValue(makeItems('dh-ancestry', 19));
    loadDaggerheartCommunitiesForSystemMock.mockResolvedValue(makeItems('dh-community', 9));
    loadDaggerheartDomainsForSystemMock.mockResolvedValue(makeItems('dh-domain', 9));
    loadDaggerheartDomainCardsForSystemMock.mockResolvedValue(makeItems('dh-card', 189));
    loadDaggerheartWeaponsForSystemMock.mockResolvedValue(makeItems('dh-weapon', 204));
    loadDaggerheartArmorForSystemMock.mockResolvedValue(makeItems('dh-armor', 34));
    loadDaggerheartLootForSystemMock.mockResolvedValue(makeItems('dh-loot', 61));
    loadDaggerheartConsumablesForSystemMock.mockResolvedValue(makeItems('dh-consumable', 54));

    const summaries = await loadAllSystemCatalogSummaries(['pf2e', 'daggerheart']);

    expect(Object.keys(summaries)).toEqual(['pf2e', 'daggerheart']);
    expect(summaries.pf2e.totalReachableCount).toBe(7);
    expect(summaries.daggerheart.totalReachableCount).toBe(588);
    expect(loadTraitsForSystemMock).not.toHaveBeenCalled();
    expect(loadAdvantagesForSystemMock).not.toHaveBeenCalled();
  });

  it('builds metadata-backed summaries without invoking loader modules', async () => {
    const summary = await loadSystemCatalogSummaryFromMetadata('dnd-5e-2014');

    expect(summary.systemId).toBe('dnd-5e-2014');
    expect(summary.label).toBe('D&D 5e (2014)');
    expect(summary.supportLevel).toBe('full');
    expect(summary.categories.some((category) => category.id === 'spells')).toBe(true);
    expect(summary.categories.some((category) => category.id === 'featureOptions')).toBe(true);
    expect(summary.categories.some((category) => category.id === 'feats')).toBe(true);
    expect(summary.categories.find((category) => category.id === 'feats')).toMatchObject({
      reachability: 'product',
    });
    expect(summary.categories.find((category) => category.id === 'feats')!.count).toBeGreaterThan(
      0
    );
    expect(loadSpellsForSystemMock).not.toHaveBeenCalled();
    expect(loadClassesForSystemMock).not.toHaveBeenCalled();
    expect(loadFeatureOptionsForSystemMock).not.toHaveBeenCalled();
  });
});
