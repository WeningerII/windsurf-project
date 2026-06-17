import { beforeAll, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { registerAllSystems } from '../../systems';
import { GameSystemSelector } from '../../components/GameSystemSelector';
import { loadAllSystemCatalogSummariesFromMetadata } from '../../utils/systemCatalogMetadata';

beforeAll(async () => {
  registerAllSystems();
  await loadAllSystemCatalogSummariesFromMetadata();
}, 60000);

describe('GameSystemSelector', () => {
  it('renders all 7 registered systems', async () => {
    const mockOnSelect = vi.fn();

    render(<GameSystemSelector selectedSystem={null} onSelect={mockOnSelect} />);

    expect(screen.getByText('D&D 5e (2024)')).toBeInTheDocument();
    expect(screen.getByText('D&D 5e (2014)')).toBeInTheDocument();
    expect(screen.getByText('D&D 3.5e')).toBeInTheDocument();
    expect(screen.getByText('Pathfinder 1e')).toBeInTheDocument();
    expect(screen.getByText('Pathfinder 2e')).toBeInTheDocument();
    expect(screen.getByText('M&M 3e')).toBeInTheDocument();
    expect(screen.getByText('Daggerheart')).toBeInTheDocument();

    await waitFor(
      () => {
        expect(screen.getByText(/feature options/i)).toBeInTheDocument();
      },
      { timeout: 30000 }
    );
  });

  it('calls onSelect with the clicked system ID', async () => {
    const mockOnSelect = vi.fn();
    const user = userEvent.setup();

    render(<GameSystemSelector selectedSystem={null} onSelect={mockOnSelect} />);

    const dnd5e2024Button = screen.getByText('D&D 5e (2024)').closest('button');
    expect(dnd5e2024Button).toBeInTheDocument();

    if (dnd5e2024Button) {
      await user.click(dnd5e2024Button);
    }

    expect(mockOnSelect).toHaveBeenCalledWith('dnd-5e-2024');
  });

  it('displays real metadata-backed version info', async () => {
    const mockOnSelect = vi.fn();

    render(<GameSystemSelector selectedSystem={null} onSelect={mockOnSelect} />);

    expect(screen.getByText('SRD 5.2')).toBeInTheDocument();
    expect(screen.getByText('SRD 5.1')).toBeInTheDocument();
    expect(screen.getByText('PF2e SRD')).toBeInTheDocument();

    await waitFor(
      () => {
        expect(screen.getByText(/feature options/i)).toBeInTheDocument();
      },
      { timeout: 30000 }
    );
  });

  it('has accessible buttons for all systems', async () => {
    const mockOnSelect = vi.fn();

    render(<GameSystemSelector selectedSystem={null} onSelect={mockOnSelect} />);

    await waitFor(
      () => {
        expect(screen.getByText(/feature options/i)).toBeInTheDocument();
      },
      { timeout: 30000 }
    );

    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThanOrEqual(7);

    buttons.forEach((button) => {
      expect(button).toBeEnabled();
    });
  });

  it('renders real loader-backed summaries and support badges', async () => {
    const mockOnSelect = vi.fn();

    render(<GameSystemSelector selectedSystem={null} onSelect={mockOnSelect} />);

    await waitFor(
      () => {
        expect(screen.getByText(/feature options/i)).toBeInTheDocument();
      },
      { timeout: 30000 }
    );

    expect(screen.getAllByText(/backgrounds/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/powers/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/archetypes/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/ancestries/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/domain cards/i).length).toBeGreaterThan(0);
    // Only Daggerheart remains Partial; 3.5e and PF1e are now Full.
    expect(screen.getAllByText('Partial')).toHaveLength(1);
    expect(
      screen.getByText(
        'SRD-backed selectors, starter templates, browse tabs, equipment loadouts, gold tracking, and loot libraries are shipped; deterministic passive card bonuses are auto-applied where represented, while triggered, timing-based, and choice-based card effects remain tracked-but-manual or reference-only'
      )
    ).toBeInTheDocument();
  });
});
