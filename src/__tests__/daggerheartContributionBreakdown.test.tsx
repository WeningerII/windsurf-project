import '@testing-library/jest-dom';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { DaggerheartSheet } from '../systems/daggerheart/sheet';
import { createDefaultDaggerheartData } from '../systems/daggerheart/data-model';
import { registerAllSystems } from '../systems';
import { systemRegistry } from '../registry';
import type { CharacterDocument } from '../types/core/document';

/**
 * Surfaced contribution ledger (chosen parity direction): the Daggerheart sheet
 * now shows an Evasion breakdown built from the same ledger primitive 5e uses for
 * AC. End-to-end proof of the slice — synchronous builder → controller memo →
 * basics section → the shared ContributionBreakdown disclosure. Bard starts at
 * Evasion 10 and Simiah adds +1, so the breakdown folds to 11.
 */
describe('Daggerheart Evasion contribution breakdown (sheet)', () => {
  beforeAll(() => {
    if (!systemRegistry.get('daggerheart')) {
      registerAllSystems();
    }
  });

  it('reveals the class + ancestry pieces behind Evasion', async () => {
    const user = userEvent.setup();
    const document = {
      id: 'c',
      name: 'Hero',
      systemId: 'daggerheart',
      system: { ...createDefaultDaggerheartData(), class: 'Bard', heritage: 'Simiah' },
      createdAt: new Date(),
      updatedAt: new Date(),
    } as CharacterDocument<ReturnType<typeof createDefaultDaggerheartData>>;

    render(<DaggerheartSheet document={document} onUpdate={vi.fn()} />);

    // Let the basics section settle, then grab the Evasion disclosure (the one
    // whose folded total reads "(11)"), distinct from the static Evasion label.
    await screen.findByText('Attributes');
    const toggle = (await screen.findAllByRole('button', { name: /evasion/i })).find((node) =>
      node.textContent?.includes('(11)')
    );
    expect(toggle).toBeDefined();

    await user.click(toggle!);

    const list = await screen.findByRole('list', { name: /evasion contributions/i });
    expect(within(list).getByText('Bard')).toBeInTheDocument();
    expect(within(list).getByText('Simiah')).toBeInTheDocument();
  });
});
