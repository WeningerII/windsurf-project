import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { registerAllSystems } from '../../systems';
import { GameSystemSelector } from '../../components/GameSystemSelector';
import type { GameSystemId } from '../../types/game-systems';
import type { SystemCatalogSummary } from '../../types/system-catalog';

const { loadAllSystemCatalogSummariesMock } = vi.hoisted(() => ({
  loadAllSystemCatalogSummariesMock: vi.fn(),
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
  loadAllSystemCatalogSummaries: loadAllSystemCatalogSummariesMock,
}));

beforeAll(() => {
  registerAllSystems();
});

beforeEach(() => {
  loadAllSystemCatalogSummariesMock.mockResolvedValue(mockSummaries);
});

describe('GameSystemSelector', () => {
  it('renders all 7 registered systems', async () => {
    const mockOnSelect = vi.fn();

    render(<GameSystemSelector selectedSystem={null} onSelect={mockOnSelect} />);

    await waitFor(() => {
      expect(loadAllSystemCatalogSummariesMock).toHaveBeenCalled();
    });

    expect(screen.getByText('D&D 5e (2024)')).toBeInTheDocument();
    expect(screen.getByText('D&D 5e (2014)')).toBeInTheDocument();
    expect(screen.getByText('D&D 3.5e')).toBeInTheDocument();
    expect(screen.getByText('Pathfinder 1e')).toBeInTheDocument();
    expect(screen.getByText('Pathfinder 2e')).toBeInTheDocument();
    expect(screen.getByText('M&M 3e')).toBeInTheDocument();
    expect(screen.getByText('Daggerheart')).toBeInTheDocument();
  });

  it('should call onSelect with correct system ID when clicked', async () => {
    const mockOnSelect = vi.fn();
    const user = userEvent.setup();

    render(<GameSystemSelector selectedSystem={null} onSelect={mockOnSelect} />);

    const dnd5e2024Button = screen.getByText('D&D 5e (2024)').closest('button');
    expect(dnd5e2024Button).toBeInTheDocument();

    if (dnd5e2024Button) {
      await user.click(dnd5e2024Button);
      expect(mockOnSelect).toHaveBeenCalledWith('dnd-5e-2024' as GameSystemId);
    }
  });

  it('should display system version info', async () => {
    const mockOnSelect = vi.fn();

    render(<GameSystemSelector selectedSystem={null} onSelect={mockOnSelect} />);

    await waitFor(() => {
      expect(screen.getByText('12 spells')).toBeInTheDocument();
    });

    expect(screen.getByText('SRD 5.2')).toBeInTheDocument();
  });

  it('should have accessible buttons for all systems', async () => {
    const mockOnSelect = vi.fn();

    render(<GameSystemSelector selectedSystem={null} onSelect={mockOnSelect} />);

    await waitFor(() => {
      expect(loadAllSystemCatalogSummariesMock).toHaveBeenCalled();
    });

    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThanOrEqual(7);

    buttons.forEach((button) => {
      expect(button).toBeEnabled();
    });
  });

  it('renders loader-backed summaries and support badges', async () => {
    const mockOnSelect = vi.fn();

    render(<GameSystemSelector selectedSystem={null} onSelect={mockOnSelect} />);

    await waitFor(() => {
      expect(screen.getByText('12 spells')).toBeInTheDocument();
    });

    expect(screen.getByText('106 feature options')).toBeInTheDocument();
    expect(screen.getByText('16 backgrounds')).toBeInTheDocument();
    expect(screen.getByText('15 archetypes')).toBeInTheDocument();
    expect(screen.getByText('21 complications')).toBeInTheDocument();
    expect(screen.getAllByText('Partial')).toHaveLength(2);
    expect(screen.getByText('Scaffold')).toBeInTheDocument();
    expect(screen.getByText('Manual entry only; no local data modules')).toBeInTheDocument();
    expect(screen.getByText('No loader-backed content yet')).toBeInTheDocument();
  });
});
