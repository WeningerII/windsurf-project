import { render, screen, waitFor } from '@testing-library/react';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { registerAllSystems } from '../../systems';
import { SystemStatusDashboard } from '../../components/SystemStatusDashboard';
import type { GameSystemId } from '../../types/game-systems';
import type { SystemCatalogSummary } from '../../types/system-catalog';

const { loadSystemCatalogSummaryMock } = vi.hoisted(() => ({
  loadSystemCatalogSummaryMock: vi.fn(),
}));

const mockSummaries: Record<GameSystemId, SystemCatalogSummary> = {
  'dnd-5e-2024': {
    systemId: 'dnd-5e-2024',
    label: 'D&D 5e (2024)',
    version: 'SRD 5.2',
    supportLevel: 'full',
    categories: [
      { id: 'spells', label: 'Spells', count: 12, reachability: 'product' },
      { id: 'classes', label: 'Classes', count: 4, reachability: 'product' },
      { id: 'monsters', label: 'Monsters', count: 3, reachability: 'product' },
    ],
    totalReachableCount: 19,
  },
  'dnd-5e-2014': {
    systemId: 'dnd-5e-2014',
    label: 'D&D 5e (2014)',
    version: 'SRD 5.1',
    supportLevel: 'full',
    categories: [
      { id: 'spells', label: 'Spells', count: 10, reachability: 'product' },
      { id: 'classes', label: 'Classes', count: 4, reachability: 'product' },
      {
        id: 'featureOptions',
        label: 'Feature Options',
        count: 106,
        reachability: 'product',
      },
      {
        id: 'feats',
        label: 'Feats',
        count: 0,
        reachability: 'source-filtered',
        note: 'SRD 5.1 excludes feat data',
      },
    ],
    totalReachableCount: 120,
  },
  pf2e: {
    systemId: 'pf2e',
    label: 'Pathfinder 2e',
    version: 'PF2e SRD',
    supportLevel: 'full',
    categories: [
      { id: 'classes', label: 'Classes', count: 8, reachability: 'product' },
      { id: 'backgrounds', label: 'Backgrounds', count: 16, reachability: 'product' },
      { id: 'feats', label: 'Feats', count: 22, reachability: 'product' },
    ],
    totalReachableCount: 46,
  },
  'dnd-3.5e': {
    systemId: 'dnd-3.5e',
    label: 'D&D 3.5e',
    version: 'SRD 3.5',
    supportLevel: 'partial',
    supportNotes: 'Base classes only in current product flows',
    categories: [
      { id: 'classes', label: 'Classes', count: 11, reachability: 'product' },
      { id: 'feats', label: 'Feats', count: 25, reachability: 'product' },
    ],
    totalReachableCount: 36,
  },
  pf1e: {
    systemId: 'pf1e',
    label: 'Pathfinder 1e',
    version: 'PF1e SRD',
    supportLevel: 'partial',
    supportNotes:
      'Base classes and vetted CRB prestige classes are selectable; prestige spellcasting progression remains manual',
    categories: [
      { id: 'classes', label: 'Classes', count: 18, reachability: 'product' },
      { id: 'traits', label: 'Traits', count: 7, reachability: 'product' },
    ],
    totalReachableCount: 25,
  },
  mam3e: {
    systemId: 'mam3e',
    label: 'M&M 3e',
    version: '3e',
    supportLevel: 'full',
    categories: [
      { id: 'spells', label: 'Powers', count: 18, reachability: 'product' },
      { id: 'archetypes', label: 'Archetypes', count: 15, reachability: 'product' },
      { id: 'complications', label: 'Complications', count: 21, reachability: 'product' },
      { id: 'equipment', label: 'Equipment', count: 30, reachability: 'product' },
      { id: 'advantages', label: 'Advantages', count: 30, reachability: 'product' },
      { id: 'powerModifiers', label: 'Power Modifiers', count: 40, reachability: 'product' },
    ],
    totalReachableCount: 154,
  },
  daggerheart: {
    systemId: 'daggerheart',
    label: 'Daggerheart',
    version: '1.0',
    supportLevel: 'scaffold',
    supportNotes: 'Manual entry only; no local data modules',
    categories: [],
    totalReachableCount: 0,
  },
};

vi.mock('../../utils/systemCatalog', () => ({
  KNOWN_SYSTEM_IDS: [
    'dnd-5e-2024',
    'dnd-5e-2014',
    'pf2e',
    'dnd-3.5e',
    'pf1e',
    'mam3e',
    'daggerheart',
  ],
  loadSystemCatalogSummary: loadSystemCatalogSummaryMock,
}));

beforeAll(() => {
  registerAllSystems();
});

beforeEach(() => {
  loadSystemCatalogSummaryMock.mockImplementation(async (systemId) => mockSummaries[systemId]);
});

describe('SystemStatusDashboard', () => {
  it('loads product summaries and excludes scaffold systems from readiness counts', async () => {
    render(<SystemStatusDashboard />);

    expect(screen.getByText('0/6 supported systems loaded')).toBeInTheDocument();
    expect(screen.getByText('dnd-5e-2024')).toBeInTheDocument();
    expect(screen.getByText('daggerheart')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('6/6 supported systems loaded')).toBeInTheDocument();
    });

    expect(screen.getByText('D&D 5e (2024)')).toBeInTheDocument();
    expect(screen.getByText('Daggerheart')).toBeInTheDocument();
    expect(screen.getByText('Reachable Content Totals')).toBeInTheDocument();
    expect(
      screen.getByText('No loader-backed content is available for this scaffold system.')
    ).toBeInTheDocument();
    expect(screen.getAllByText('Feature Options').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Complications').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Power Modifiers').length).toBeGreaterThan(0);
    expect(screen.getByText('Feats: SRD 5.1 excludes feat data')).toBeInTheDocument();
    expect(screen.getByText('Base classes only in current product flows')).toBeInTheDocument();
  });
});
