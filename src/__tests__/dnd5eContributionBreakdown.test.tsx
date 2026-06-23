import '@testing-library/jest-dom';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Dnd5eSheet } from '../systems/dnd5e/components/Dnd5eSheet';
import { createDefaultDnd5eData } from '../systems/dnd5e/data-model';
import { registerAllSystems } from '../systems';
import { systemRegistry } from '../registry';
import type { CharacterDocument } from '../types/core/document';

/**
 * Surfaced contribution ledger (chosen parity direction): the 5e sheet now shows
 * an Armor Class breakdown built from the registry's contribution ledger. This is
 * the end-to-end proof of the vertical slice — builder → async hook → controller →
 * host → overview section → the shared ContributionBreakdown disclosure.
 */
describe('5e Armor Class contribution breakdown (sheet)', () => {
  beforeAll(() => {
    if (!systemRegistry.get('dnd-5e-2024')) {
      registerAllSystems();
    }
  });

  it('reveals where the AC came from once the ledger resolves', async () => {
    const user = userEvent.setup();
    const document = {
      id: 'c',
      name: 'Hero',
      systemId: 'dnd-5e-2014',
      system: createDefaultDnd5eData(),
      createdAt: new Date(),
      updatedAt: new Date(),
    } as CharacterDocument<ReturnType<typeof createDefaultDnd5eData>>;

    render(<Dnd5eSheet document={document} onUpdate={vi.fn()} />);

    // The breakdown is a disclosure BUTTON (distinct from the static "Armor Class"
    // card title), appearing once the async contribution ledger resolves. Unarmored
    // base AC (10) is a 'set' entry, so even a fresh character has a breakdown.
    const toggle = await screen.findByRole('button', { name: /armor class/i }, { timeout: 5000 });
    expect(toggle).toHaveTextContent('(10)');

    await user.click(toggle);
    expect(await screen.findByText('Unarmored defense')).toBeInTheDocument();
  });
});
