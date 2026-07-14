import { beforeAll, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CharacterListView } from '../../components/CharacterListView';
import { registerAllSystems } from '../../systems';
import { systemRegistry } from '../../registry';
import type { CharacterDocument, SystemDataModel } from '../../types/core/document';

const now = new Date('2026-03-07T12:00:00.000Z');

function makeDoc(id: string, name: string): CharacterDocument<SystemDataModel> {
  return {
    id,
    name,
    systemId: 'dnd-5e-2024',
    system: {} as SystemDataModel,
    createdAt: now,
    updatedAt: now,
  };
}

const aria = makeDoc('doc-aria', 'Aria Stormwind');
const borin = makeDoc('doc-borin', 'Borin Oakenshield');

function renderList(overrides: Partial<Parameters<typeof CharacterListView>[0]> = {}) {
  const props = {
    documents: [aria, borin],
    filteredDocuments: [aria, borin],
    systemFilter: 'all' as const,
    onSystemFilterChange: vi.fn(),
    sortOption: 'updated-desc' as const,
    onSortOptionChange: vi.fn(),
    onExportAll: vi.fn(),
    onClearAll: vi.fn(),
    onOpenCharacter: vi.fn(),
    onCloneCharacter: vi.fn(),
    onExportCharacter: vi.fn(),
    onDeleteCharacter: vi.fn(),
    storageWarning: null,
    ...overrides,
  };
  render(<CharacterListView {...props} />);
  return props;
}

beforeAll(() => {
  if (!systemRegistry.get('dnd-5e-2024')) {
    registerAllSystems();
  }
});

describe('CharacterListView', () => {
  it('narrows the visible cards by case-insensitive name search', async () => {
    const user = userEvent.setup();
    renderList();

    expect(screen.getByText('Aria Stormwind')).toBeInTheDocument();
    expect(screen.getByText('Borin Oakenshield')).toBeInTheDocument();
    expect(screen.getByText('2 characters saved')).toBeInTheDocument();

    await user.type(screen.getByTitle('Search characters'), 'ARIA');

    expect(screen.getByText('Aria Stormwind')).toBeInTheDocument();
    expect(screen.queryByText('Borin Oakenshield')).not.toBeInTheDocument();
    expect(screen.getByText('Showing 1 of 2 characters')).toBeInTheDocument();
  });

  it('restores the full grid when the search is cleared', async () => {
    const user = userEvent.setup();
    renderList();

    const search = screen.getByTitle('Search characters');
    await user.type(search, 'borin');
    expect(screen.queryByText('Aria Stormwind')).not.toBeInTheDocument();

    await user.clear(search);

    expect(screen.getByText('Aria Stormwind')).toBeInTheDocument();
    expect(screen.getByText('Borin Oakenshield')).toBeInTheDocument();
    expect(screen.getByText('2 characters saved')).toBeInTheDocument();
  });

  it('shows an empty note instead of the grid when nothing matches', async () => {
    const user = userEvent.setup();
    renderList();

    await user.type(screen.getByTitle('Search characters'), 'no such hero');

    expect(screen.getByText('No characters match the current filters.')).toBeInTheDocument();
    expect(screen.queryByText('Aria Stormwind')).not.toBeInTheDocument();
  });

  it('searches on top of the App-owned system filter', async () => {
    const user = userEvent.setup();
    // System filter already narrowed the list down to Aria upstream.
    renderList({ filteredDocuments: [aria] });

    await user.type(screen.getByTitle('Search characters'), 'borin');

    expect(screen.getByText('No characters match the current filters.')).toBeInTheDocument();
  });

  it('threads per-card Export and Delete with the right doc id', async () => {
    const user = userEvent.setup();
    const { onExportCharacter, onDeleteCharacter } = renderList();

    await user.click(screen.getByRole('button', { name: 'More actions for Aria Stormwind' }));
    await user.click(screen.getByRole('menuitem', { name: 'Export' }));
    expect(onExportCharacter).toHaveBeenCalledWith('doc-aria');

    await user.click(screen.getByRole('button', { name: 'More actions for Borin Oakenshield' }));
    await user.click(screen.getByRole('menuitem', { name: 'Delete' }));
    expect(onDeleteCharacter).toHaveBeenCalledWith('doc-borin');
  });

  it('keeps the bulk export/clear and filter/sort controls in place', () => {
    const { onSystemFilterChange } = renderList();

    expect(screen.getByRole('button', { name: /export all characters/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /clear all characters/i })).toBeInTheDocument();
    expect(screen.getByTitle('Filter by system')).toBeInTheDocument();
    expect(screen.getByTitle('Sort characters')).toBeInTheDocument();
    expect(onSystemFilterChange).not.toHaveBeenCalled();
  });
});
