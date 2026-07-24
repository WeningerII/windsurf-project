import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { Dock } from '../Dock';
import type { CharacterDocument } from '../../types/core/document';

// The four SRD tabs are browse-only in this structural test (party is the
// default active tab), but useDockResources still fires the loaders — stub them
// so the panel mounts without touching real SRD data chunks.
vi.mock('../../utils/dataLoader', () => ({
  loadSpellsForSystem: vi.fn(() => Promise.resolve([])),
  loadFeatsForSystem: vi.fn(() => Promise.resolve([])),
  loadEquipmentForSystem: vi.fn(() => Promise.resolve([])),
  loadMonstersForSystem: vi.fn(() => Promise.resolve([])),
}));

function makeDoc(id: string, name: string): CharacterDocument {
  return {
    id,
    name,
    systemId: 'dnd-5e-2014',
    system: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } as unknown as CharacterDocument;
}

describe('Dock', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('is collapsed to a summon control by default, with no dock tabs shown', () => {
    render(<Dock documents={[]} />);
    expect(screen.getByRole('button', { name: /toggle toolkit dock/i })).toBeInTheDocument();
    expect(screen.queryByRole('tab')).not.toBeInTheDocument();
  });

  it('summons a panel with exactly the five typed tabs', async () => {
    const user = userEvent.setup();
    render(<Dock documents={[makeDoc('a', 'Aragorn')]} />);

    await user.click(screen.getByRole('button', { name: /toggle toolkit dock/i }));

    expect(screen.getByRole('tab', { name: /party/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /bestiary/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /spells/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /feats/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /equipment/i })).toBeInTheDocument();
    expect(screen.getAllByRole('tab')).toHaveLength(5);
  });

  it('shows the party roster (default tab) and an explicit system selector', async () => {
    const user = userEvent.setup();
    render(<Dock documents={[makeDoc('a', 'Aragorn')]} />);

    await user.click(screen.getByRole('button', { name: /toggle toolkit dock/i }));

    expect(screen.getByText('Aragorn')).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /select game system/i })).toBeInTheDocument();
  });

  it('can be dismissed again via the close control', async () => {
    const user = userEvent.setup();
    render(<Dock documents={[]} />);

    await user.click(screen.getByRole('button', { name: /toggle toolkit dock/i }));
    expect(screen.getByRole('tab', { name: /party/i })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /close toolkit dock/i }));
    expect(screen.queryByRole('tab')).not.toBeInTheDocument();
  });
});
