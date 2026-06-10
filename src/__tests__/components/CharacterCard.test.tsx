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

beforeAll(() => {
  if (!systemRegistry.get('dnd-5e-2024')) {
    registerAllSystems();
  }
});

describe('CharacterCard', () => {
  it('opens the character when the card is clicked', async () => {
    const user = userEvent.setup();
    const onOpen = vi.fn();
    const onClone = vi.fn();

    render(<CharacterCard document={makeDoc()} onOpen={onOpen} onClone={onClone} />);

    await user.click(screen.getByText('Card Hero'));

    expect(onOpen).toHaveBeenCalledWith('card-doc-1');
    expect(onClone).not.toHaveBeenCalled();
  });

  it('clones without opening — the clone button is a sibling, not nested', async () => {
    const user = userEvent.setup();
    const onOpen = vi.fn();
    const onClone = vi.fn();
    const doc = makeDoc();

    render(<CharacterCard document={doc} onOpen={onOpen} onClone={onClone} />);

    await user.click(screen.getByRole('button', { name: 'Clone Card Hero' }));

    expect(onClone).toHaveBeenCalledTimes(1);
    expect(onClone).toHaveBeenCalledWith(doc);
    expect(onOpen).not.toHaveBeenCalled();
  });

  it('reveals the hover-only clone button to keyboard focus', () => {
    render(<CharacterCard document={makeDoc()} onOpen={vi.fn()} onClone={vi.fn()} />);

    const cloneButton = screen.getByRole('button', { name: 'Clone Card Hero' });
    expect(cloneButton.className).toContain('focus-visible:opacity-100');
  });
});
