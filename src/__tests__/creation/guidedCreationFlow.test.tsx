import '@testing-library/jest-dom';
import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import App from '../../App';
import { registerAllSystems } from '../../systems';
import { systemRegistry } from '../../registry';
import { loadClassesForSystem } from '../../utils/dataLoader';

/**
 * MASTER_PLAN creation track — reachability: the system-agnostic character creator
 * must be wired into the app, offered only for systems that registered a creation
 * orchestrator, and on finish must land the user on the normal character sheet for
 * the created document. The existing quick blank-create path must still work (no
 * regression).
 */

const TIMEOUT = 20000;

async function selectSystem(user: ReturnType<typeof userEvent.setup>, systemName: string) {
  const escaped = systemName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  await user.click(screen.getByRole('button', { name: new RegExp(escaped, 'i') }));
}

describe('Guided creation flow (App wiring)', () => {
  beforeAll(() => {
    if (!systemRegistry.get('dnd-5e-2024')) {
      registerAllSystems();
    }
  });

  beforeEach(() => localStorage.clear());

  it(
    'offers Guided Creation for 5e and lands the finished character on the sheet',
    async () => {
      const user = userEvent.setup();
      const [firstClass] = await loadClassesForSystem('dnd-5e-2024');
      render(<App />);

      await selectSystem(user, 'D&D 5e (2024)');
      await user.click(await screen.findByRole('button', { name: /guided creation/i }));

      // The character creator is now showing.
      expect(
        await screen.findByRole('heading', { name: /create a character/i })
      ).toBeInTheDocument();

      // Name the character (the creator's name field).
      const nameInput = await screen.findByTitle('Character name', {}, { timeout: TIMEOUT });
      await user.clear(nameInput);
      await user.type(nameInput, 'Guided Hero');

      // Pick the first class, wait for the async apply, then walk to review.
      const classButton = await screen.findByRole(
        'button',
        { name: (accessibleName) => accessibleName.startsWith(firstClass.name) },
        { timeout: TIMEOUT }
      );
      await user.click(classButton);
      await waitFor(() => expect(classButton).toHaveAttribute('aria-pressed', 'true'), {
        timeout: TIMEOUT,
      });

      await waitFor(() => expect(screen.getByRole('button', { name: /^next$/i })).toBeEnabled(), {
        timeout: TIMEOUT,
      });
      await user.click(screen.getByRole('button', { name: /^next$/i }));
      await user.click(screen.getByRole('button', { name: /^next$/i }));
      await user.click(screen.getByRole('button', { name: /^next$/i }));

      await user.click(await screen.findByRole('button', { name: /create character/i }));

      // The creator is gone and the sheet for the new character is shown.
      await waitFor(
        () =>
          expect(
            screen.queryByRole('heading', { name: /create a character/i })
          ).not.toBeInTheDocument(),
        { timeout: TIMEOUT }
      );
      expect(await screen.findByTitle('Character name', {}, { timeout: TIMEOUT })).toHaveValue(
        'Guided Hero'
      );
    },
    TIMEOUT
  );

  it(
    'serves a second system (PF2e) through the same agnostic creator, ancestry-first',
    async () => {
      // The same UI must render a different system (different data model, different
      // step ORDER) purely because PF2e registered an orchestrator — no UI fork.
      const user = userEvent.setup();
      render(<App />);

      await selectSystem(user, 'Pathfinder 2e');
      await user.click(await screen.findByRole('button', { name: /guided creation/i }));

      expect(
        await screen.findByRole('heading', { name: /create a character/i })
      ).toBeInTheDocument();
      // PF2e's first step is Ancestry (not Class), proving the steps come from the
      // system's orchestrator, not the UI.
      expect(
        await screen.findByRole('button', { name: /^ancestry$/i }, { timeout: TIMEOUT })
      ).toHaveAttribute('aria-current', 'step');
    },
    TIMEOUT
  );

  it('does not offer Guided Creation for systems without an orchestrator', async () => {
    const user = userEvent.setup();
    render(<App />);

    await selectSystem(user, 'M&M 3e');

    // Quick blank-create remains available; guided creation does not appear.
    expect(screen.getByRole('button', { name: /create new character/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /guided creation/i })).not.toBeInTheDocument();
  });
});
