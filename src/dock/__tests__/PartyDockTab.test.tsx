import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PartyDockTab } from '../PartyDockTab';
import type { CharacterDocument } from '../../types/core/document';

function makeDoc(id: string, name: string, systemId = 'dnd-5e-2014'): CharacterDocument {
  return {
    id,
    name,
    systemId,
    system: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } as unknown as CharacterDocument;
}

describe('PartyDockTab', () => {
  it('renders the roster from the documents prop', () => {
    render(<PartyDockTab documents={[makeDoc('a', 'Aragorn'), makeDoc('b', 'Boromir')]} />);

    expect(screen.getByRole('list', { name: /party roster/i })).toBeInTheDocument();
    expect(screen.getByText('Aragorn')).toBeInTheDocument();
    expect(screen.getByText('Boromir')).toBeInTheDocument();
  });

  it('exposes NO add-to-sheet verb and NO drag affordance in Phase 3', () => {
    const { container } = render(<PartyDockTab documents={[makeDoc('a', 'Aragorn')]} />);

    // Browse-only: no buttons (add) and nothing draggable (drag lands Phase 4).
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(container.querySelector('[draggable="true"]')).toBeNull();
  });

  it('shows an empty-state hint when there are no characters', () => {
    render(<PartyDockTab documents={[]} />);
    expect(screen.getByText(/No characters yet/i)).toBeInTheDocument();
  });
});
