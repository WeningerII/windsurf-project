import '@testing-library/jest-dom';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { CharacterCreator } from '../../components/CharacterCreator';
import { registerAllSystems } from '../../systems';
import { systemRegistry } from '../../registry';
import { loadClassesForSystem } from '../../utils/dataLoader';
import {
  createCreationDraft,
  setDraftName,
  withResolvedSystem,
} from '../../creation/creationDraft';
import { createDnd5eCreationDraft } from '../../creation/dnd5eCreation';
import { loadCreationDraft, saveCreationDraft } from '../../creation/creationDraftStorage';
import type { CharacterDocument, SystemDataModel } from '../../types/core/document';

/**
 * MASTER_PLAN creation track: the user-visible, system-agnostic character creator.
 * These tests render it against the REAL draft shell + registry-resolved 5e
 * orchestrator (no mocked rules) and verify the acceptance surface: walk the
 * steps → finalise a CharacterDocument, resume a saved draft, cancel clears it,
 * and validation issues are displayed and gate finalisation.
 */

const SYSTEM_ID = 'dnd-5e-2024';
const TIMEOUT = 15000;

beforeAll(() => {
  if (!systemRegistry.get(SYSTEM_ID)) {
    registerAllSystems();
  }
});

afterEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

async function waitForEnabled(name: RegExp) {
  await waitFor(() => expect(screen.getByRole('button', { name })).toBeEnabled(), {
    timeout: TIMEOUT,
  });
}

describe('CharacterCreator', () => {
  it('walks class → species → background → review and finalises a CharacterDocument', async () => {
    const user = userEvent.setup();
    const classes = await loadClassesForSystem(SYSTEM_ID);
    const firstClass = classes[0];
    const onComplete = vi.fn();

    render(<CharacterCreator systemId={SYSTEM_ID} onComplete={onComplete} onCancel={vi.fn()} />);

    // Class step: pick the first class (an async apply through the real applicator).
    const classButton = await screen.findByRole(
      'button',
      { name: (accessibleName) => accessibleName.startsWith(firstClass.name) },
      { timeout: TIMEOUT }
    );
    await user.click(classButton);
    await waitFor(() => expect(classButton).toHaveAttribute('aria-pressed', 'true'), {
      timeout: TIMEOUT,
    });

    // Advance through the optional species/background steps to review.
    await waitForEnabled(/^next$/i);
    await user.click(screen.getByRole('button', { name: /^next$/i }));
    await user.click(screen.getByRole('button', { name: /^next$/i }));
    await user.click(screen.getByRole('button', { name: /^next$/i }));

    const createButton = await screen.findByRole('button', { name: /create character/i });
    await user.click(createButton);

    expect(onComplete).toHaveBeenCalledTimes(1);
    const doc = onComplete.mock.calls[0][0] as CharacterDocument<SystemDataModel>;
    expect(doc.systemId).toBe(SYSTEM_ID);
    const system = doc.system as { classLevels?: Array<{ classId: string }> };
    expect(system.classLevels).toMatchObject([{ classId: firstClass.id }]);
    // Finalising clears the resumable draft.
    expect(loadCreationDraft()).toBeNull();
  });

  it('resumes a saved draft for the same system', async () => {
    const base = setDraftName(
      createDnd5eCreationDraft({ id: 'resume-1', systemId: SYSTEM_ID }),
      'Resumed Hero'
    );
    saveCreationDraft(base);

    render(<CharacterCreator systemId={SYSTEM_ID} onComplete={vi.fn()} onCancel={vi.fn()} />);

    expect(await screen.findByTitle('Character name')).toHaveValue('Resumed Hero');
  });

  it('ignores a saved draft from a different system', async () => {
    // A draft saved for another system must not leak into this 5e session.
    const foreign = setDraftName(
      createCreationDraft({
        id: 'foreign-1',
        systemId: 'pf2e',
        steps: ['ancestry', 'review'],
        system: {},
      }),
      'PF2e Draft'
    );
    saveCreationDraft(foreign);

    render(<CharacterCreator systemId={SYSTEM_ID} onComplete={vi.fn()} onCancel={vi.fn()} />);

    expect(await screen.findByTitle('Character name')).toHaveValue('New Character');
  });

  it('cancel clears the in-progress draft and calls onCancel', async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();

    render(<CharacterCreator systemId={SYSTEM_ID} onComplete={vi.fn()} onCancel={onCancel} />);

    await screen.findByTitle('Character name');
    await user.click(screen.getByRole('button', { name: /cancel creation/i }));

    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(loadCreationDraft()).toBeNull();
  });

  it('displays validation issues and blocks finalisation on errors', async () => {
    const user = userEvent.setup();
    const blocked = withResolvedSystem(
      createDnd5eCreationDraft({ id: 'issues-1', systemId: SYSTEM_ID }),
      createDnd5eCreationDraft({ id: 'issues-1', systemId: SYSTEM_ID }).system,
      [{ code: 'demo', message: 'You must choose two skills.', severity: 'error' }]
    );
    saveCreationDraft(blocked);

    render(<CharacterCreator systemId={SYSTEM_ID} onComplete={vi.fn()} onCancel={vi.fn()} />);

    // The issue is shown live on every step.
    expect(await screen.findByText('You must choose two skills.')).toBeInTheDocument();

    // Jump to the review step; the error-severity issue must disable creation.
    await user.click(screen.getByRole('button', { name: /^review$/i }));
    expect(screen.getByRole('button', { name: /create character/i })).toBeDisabled();
    expect(screen.getByText(/resolve the errors above/i)).toBeInTheDocument();
  });
});
