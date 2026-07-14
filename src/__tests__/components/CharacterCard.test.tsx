import { beforeAll, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CharacterCard } from '../../components/CharacterCard';
import { registerAllSystems } from '../../systems';
import { systemRegistry } from '../../registry';
import type { CharacterDocument, SystemDataModel } from '../../types/core/document';

const now = new Date('2026-03-07T12:00:00.000Z');

function makeDoc(): CharacterDocument<SystemDataModel> {
  return {
    id: 'card-doc-1',
    name: 'Card Hero',
    systemId: 'dnd-5e-2024',
    system: {} as SystemDataModel,
    createdAt: now,
    updatedAt: now,
  };
}

function renderCard(overrides: Partial<Parameters<typeof CharacterCard>[0]> = {}) {
  const props = {
    document: makeDoc(),
    onOpen: vi.fn(),
    onClone: vi.fn(),
    onExport: vi.fn(),
    onDelete: vi.fn(),
    ...overrides,
  };
  render(<CharacterCard {...props} />);
  return props;
}

beforeAll(() => {
  if (!systemRegistry.get('dnd-5e-2024')) {
    registerAllSystems();
  }
});

describe('CharacterCard', () => {
  it('opens the character when the card is clicked', async () => {
    const user = userEvent.setup();
    const { onOpen, onClone } = renderCard();

    await user.click(screen.getByText('Card Hero'));

    expect(onOpen).toHaveBeenCalledWith('card-doc-1');
    expect(onClone).not.toHaveBeenCalled();
  });

  it('clones without opening — the clone button is a sibling, not nested', async () => {
    const user = userEvent.setup();
    const doc = makeDoc();
    const { onOpen, onClone } = renderCard({ document: doc });

    await user.click(screen.getByRole('button', { name: 'Clone Card Hero' }));

    expect(onClone).toHaveBeenCalledTimes(1);
    expect(onClone).toHaveBeenCalledWith(doc);
    expect(onOpen).not.toHaveBeenCalled();
  });

  it('reveals the hover-only clone button to keyboard focus', () => {
    renderCard();

    const cloneButton = screen.getByRole('button', { name: 'Clone Card Hero' });
    expect(cloneButton.className).toContain('focus-visible:opacity-100');
  });

  it('exports from the card overflow with the doc id, without opening the card', async () => {
    const user = userEvent.setup();
    const { onOpen, onExport } = renderCard();

    const trigger = screen.getByRole('button', { name: 'More actions for Card Hero' });
    expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await user.click(screen.getByRole('menuitem', { name: 'Export' }));

    expect(onExport).toHaveBeenCalledTimes(1);
    expect(onExport).toHaveBeenCalledWith('card-doc-1');
    expect(onOpen).not.toHaveBeenCalled();
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('deletes from the card overflow with the doc id', async () => {
    const user = userEvent.setup();
    const { onDelete } = renderCard();

    await user.click(screen.getByRole('button', { name: 'More actions for Card Hero' }));
    await user.click(screen.getByRole('menuitem', { name: 'Delete' }));

    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(onDelete).toHaveBeenCalledWith('card-doc-1');
  });

  it('keeps the hover-revealed overflow trigger visible while expanded', () => {
    renderCard();

    const trigger = screen.getByRole('button', { name: 'More actions for Card Hero' });
    expect(trigger.className).toContain('focus-visible:opacity-100');
    expect(trigger.className).toContain('aria-expanded:opacity-100');
  });
});
