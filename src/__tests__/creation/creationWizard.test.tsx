import '@testing-library/jest-dom';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { registerAllSystems } from '../../systems';
import { systemRegistry } from '../../registry';
import { CreationWizard } from '../../creation/CreationWizard';
import { buildWorkingDocumentEnvelope } from '../../creation/draftDocument';
import { exportDocuments, importDocumentsWithReport } from '../../utils/documentStorage';
import type { SystemDataModel } from '../../types/core/document';
import type { CreationPlan } from '../../creation/types';

// The seven registered systems — the guided-creation parity matrix.
const SYSTEM_IDS = [
  'dnd-5e-2014',
  'dnd-5e-2024',
  'dnd-3.5e',
  'pf1e',
  'pf2e',
  'mam3e',
  'daggerheart',
] as const;

const TEST_TIMEOUT_MS = 30000;

beforeAll(() => {
  if (!systemRegistry.get('mam3e')) {
    registerAllSystems();
  }
});

afterEach(() => {
  cleanup();
  localStorage.clear();
});

// Wait until the wizard's async work (working-document rebuild + validation,
// which for some systems triggers lazy SRD-data imports) has settled. Awaiting
// this before a test ends avoids "Closing rpc while fetch was pending" teardown
// races when those imports outlive the test.
async function settleValidation() {
  await waitFor(
    () => expect(screen.getByTestId('creation-validation')).not.toHaveTextContent('Checking build'),
    { timeout: 20000 }
  );
}

async function renderWizardFor(systemId: string) {
  const def = systemRegistry.get(systemId);
  if (!def) throw new Error(`missing system ${systemId}`);
  const plan = await systemRegistry.getCreationPlan(systemId);
  expect(plan).toBeTruthy();
  const onComplete = vi.fn();
  const onCancel = vi.fn();
  const view = render(
    <CreationWizard
      systemId={systemId}
      plan={plan as CreationPlan<SystemDataModel>}
      createDefaultData={def.createDefaultData}
      systemLabel={def.label}
      onComplete={onComplete}
      onCancel={onCancel}
    />
  );
  await screen.findByTestId('creation-wizard');
  return { onComplete, onCancel, def, view };
}

describe('guided-creation wizard — 7/7 system parity', () => {
  it('every registered system exposes a resolvable creation plan', async () => {
    for (const systemId of SYSTEM_IDS) {
      const plan = await systemRegistry.getCreationPlan(systemId);
      expect(plan, `plan for ${systemId}`).toBeTruthy();
      expect(plan?.systemId).toBe(systemId);
    }
  });

  describe.each(SYSTEM_IDS)('system: %s', (systemId) => {
    it(
      'drives the wizard to a normal CharacterDocument that round-trips export/import',
      async () => {
        const user = userEvent.setup();
        const { onComplete } = await renderWizardFor(systemId);

        const name = `Wizard ${systemId}`;
        fireEvent.change(screen.getByTestId('creation-name-input'), { target: { value: name } });

        // Jump straight to the Review step (all middle steps are optional).
        await user.click(screen.getByRole('button', { name: /\breview\b/i }));

        const createBtn = await screen.findByTestId('creation-create');
        await waitFor(() => expect(createBtn).toBeEnabled());
        await settleValidation();
        await user.click(createBtn);

        expect(onComplete).toHaveBeenCalledTimes(1);
        const [system, createdName] = onComplete.mock.calls[0] as [SystemDataModel, string];
        expect(system).toBeTruthy();
        expect(createdName).toBe(name);

        // The produced system data builds a normal document through the shared
        // envelope and survives an export → import round-trip unchanged.
        const doc = buildWorkingDocumentEnvelope(systemId, system, createdName);
        const json = exportDocuments([doc]);
        const { documents, droppedCount } = importDocumentsWithReport(json);
        expect(droppedCount).toBe(0);
        expect(documents).toHaveLength(1);
        expect(documents[0].systemId).toBe(systemId);
        expect(documents[0].name).toBe(name);
        expect(JSON.parse(JSON.stringify(documents[0].system))).toEqual(
          JSON.parse(JSON.stringify(system))
        );
      },
      TEST_TIMEOUT_MS
    );
  });
});

describe('guided-creation wizard — loader-driven choice application', () => {
  it(
    'applies a selected D&D 5e (2024) class through the existing template applicator',
    async () => {
      const user = userEvent.setup();
      const { onComplete } = await renderWizardFor('dnd-5e-2024');

      fireEvent.change(screen.getByTestId('creation-name-input'), {
        target: { value: 'Fighter Draft' },
      });

      // Advance to the Class step and pick Fighter from the loader-exposed options.
      await user.click(screen.getByRole('button', { name: /\bclass\b/i }));
      const fighter = await screen.findByTestId('creation-option-fighter', {}, { timeout: 15000 });
      await user.click(fighter);

      await user.click(screen.getByRole('button', { name: /\breview\b/i }));
      const createBtn = await screen.findByTestId('creation-create');
      await waitFor(() => expect(createBtn).toBeEnabled());
      await settleValidation();
      await user.click(createBtn);

      const [system] = onComplete.mock.calls[0] as [{ classLevels?: Array<{ classId?: string }> }];
      expect(system.classLevels?.some((cl) => cl.classId === 'fighter')).toBe(true);
    },
    TEST_TIMEOUT_MS
  );
});

describe('guided-creation wizard — resumable local drafts', () => {
  const SYSTEM_ID = 'dnd-5e-2014';

  it('resumes an in-progress draft from browser-local storage', async () => {
    const first = await renderWizardFor(SYSTEM_ID);
    fireEvent.change(screen.getByTestId('creation-name-input'), {
      target: { value: 'Persisted Hero' },
    });
    await waitFor(() =>
      expect(localStorage.getItem(`rpg-creation-draft-v1:${SYSTEM_ID}`)).toContain('Persisted Hero')
    );
    await settleValidation();
    first.view.unmount();

    // A fresh mount for the same system resumes where we left off.
    await renderWizardFor(SYSTEM_ID);
    expect(screen.getByTestId('creation-name-input')).toHaveValue('Persisted Hero');
    expect(screen.getByTestId('creation-resumed-banner')).toBeInTheDocument();
    await settleValidation();
  });

  it('reset ("Start over") clears the draft and its storage', async () => {
    const user = userEvent.setup();
    await renderWizardFor(SYSTEM_ID);
    fireEvent.change(screen.getByTestId('creation-name-input'), {
      target: { value: 'Throwaway' },
    });
    await waitFor(() =>
      expect(localStorage.getItem(`rpg-creation-draft-v1:${SYSTEM_ID}`)).toContain('Throwaway')
    );

    await user.click(screen.getByTestId('creation-reset'));

    expect(screen.getByTestId('creation-name-input')).toHaveValue('New Character');
    expect(localStorage.getItem(`rpg-creation-draft-v1:${SYSTEM_ID}`)).toBeNull();
    await settleValidation();
  });

  it('cancel preserves the draft for a later resume', async () => {
    const user = userEvent.setup();
    const { onCancel, view } = await renderWizardFor(SYSTEM_ID);
    fireEvent.change(screen.getByTestId('creation-name-input'), {
      target: { value: 'Paused Hero' },
    });
    await waitFor(() =>
      expect(localStorage.getItem(`rpg-creation-draft-v1:${SYSTEM_ID}`)).toContain('Paused Hero')
    );

    await settleValidation();
    await user.click(screen.getByTestId('creation-cancel'));
    expect(onCancel).toHaveBeenCalledTimes(1);
    // Cancel does not discard the draft.
    expect(localStorage.getItem(`rpg-creation-draft-v1:${SYSTEM_ID}`)).toContain('Paused Hero');

    view.unmount();
    await renderWizardFor(SYSTEM_ID);
    expect(screen.getByTestId('creation-name-input')).toHaveValue('Paused Hero');
    await settleValidation();
  });
});

describe('guided-creation wizard — validation-failure display', () => {
  const TEST_SYS = 'creation-wizard-test-validation-system';

  beforeAll(() => {
    if (systemRegistry.get(TEST_SYS)) return;
    systemRegistry.register({
      id: TEST_SYS,
      label: 'Synthetic Validation System',
      createDefaultData: () => ({}) as SystemDataModel,
      engine: {
        prepareData: (doc) => doc,
        rollCheck: async () => ({ total: 0, formula: '', terms: [] }),
        applyDamage: (doc) => doc,
      },
      validator: {
        validateDocument: () => ({
          issues: [
            { code: 'synthetic-error', severity: 'error', message: 'Synthetic creation error' },
          ],
        }),
      },
      SheetComponent: () => null,
      loadCreationPlan: async () => ({ systemId: TEST_SYS, steps: [] }),
    });
  });

  it('surfaces validator errors live during creation', async () => {
    await renderWizardFor(TEST_SYS);

    const panel = await screen.findByTestId('creation-validation');
    await waitFor(() => {
      expect(panel).toHaveTextContent('Synthetic creation error');
    });
    expect(panel.querySelector('[data-severity="error"]')).not.toBeNull();
  });
});
