import '@testing-library/jest-dom';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { registerAllSystems } from '../../systems';
import { systemRegistry } from '../../registry';
import { CreationWizard } from '../../creation/CreationWizard';
import type { SystemDataModel } from '../../types/core/document';
import type { CreationPlan } from '../../creation/types';

/**
 * Accessibility regression lock for the guided-creation wizard.
 *
 * The wizard shell is system-agnostic on purpose (it renders whatever steps a
 * system's CreationPlan declares and imports nothing from `src/systems/**`), so
 * the structural tests below run against a synthetic plan: that exercises the
 * exact shared code path all seven systems go through, deterministically and
 * without mounting seven real SRD plans. The per-system half of the check is
 * asserted inside the existing all-seven parity suite — see the note at the
 * bottom of this file.
 */

beforeAll(() => {
  if (!systemRegistry.get('mam3e')) {
    registerAllSystems();
  }
});

afterEach(() => {
  cleanup();
  localStorage.clear();
});

function syntheticPlan(maxSelections?: number): CreationPlan<SystemDataModel> {
  return {
    systemId: 'dnd-5e-2024',
    steps: [
      {
        kind: 'choice',
        id: 'lineage',
        title: 'Lineage',
        description: 'Pick a lineage.',
        maxSelections,
        loadOptions: () =>
          Promise.resolve([
            { id: 'elf', label: 'Elf' },
            { id: 'dwarf', label: 'Dwarf', description: 'Sturdy.' },
          ]),
        apply: (system: SystemDataModel) => system,
      },
    ],
  } as unknown as CreationPlan<SystemDataModel>;
}

/**
 * The wizard rebuilds + validates its working document asynchronously, and
 * validation lazily imports SRD data. Awaiting that before a test ends avoids
 * "Closing rpc while fetch was pending" teardown races — same guard, same
 * reason, as `src/__tests__/creation/creationWizard.test.tsx`.
 */
async function settleValidation() {
  await waitFor(
    () => expect(screen.getByTestId('creation-validation')).not.toHaveTextContent('Checking build'),
    { timeout: 20000 }
  );
}

function renderSyntheticWizard(maxSelections?: number) {
  const def = systemRegistry.get('dnd-5e-2024');
  if (!def) throw new Error('registry bootstrap failed');
  return render(
    <CreationWizard
      systemId="dnd-5e-2024"
      plan={syntheticPlan(maxSelections)}
      createDefaultData={def.createDefaultData}
      systemLabel={def.label}
      onComplete={vi.fn()}
      onCancel={vi.fn()}
    />
  );
}

describe('guided-creation wizard a11y — shared shell', () => {
  it('gives the name field the same accessible name as its visible label', async () => {
    renderSyntheticWizard();
    await screen.findByTestId('creation-wizard');

    const input = screen.getByTestId('creation-name-input');
    // Would catch re-adding an aria-label that OVERRIDES the visible <label>:
    // a voice-control user reads "Character name" and says "Character name",
    // and must hit this field (WCAG 2.5.3 Label in Name).
    expect(input).toHaveAccessibleName('Character name');
    expect(screen.getByLabelText('Character name')).toBe(input);
    await settleValidation();
  });

  it('parents every option directly inside its listbox', async () => {
    renderSyntheticWizard();
    await screen.findByTestId('creation-wizard');

    // Step 2 is the synthetic choice step.
    userClickStep('2. Lineage');
    const listbox = await screen.findByRole('listbox', { name: 'Lineage' });
    const options = within(listbox).getAllByRole('option');
    expect(options).toHaveLength(2);

    // Would catch a regression to a bare <li> between listbox and option: an
    // implicit `listitem` there makes every option an invalid child AND an
    // invalid-parent violation (axe aria-required-children /
    // aria-required-parent, both serious), and strips option position from
    // screen-reader output.
    options.forEach((option) => {
      expect(option.parentElement).toHaveAttribute('role', 'presentation');
      expect(option.parentElement?.parentElement).toBe(listbox);
    });
    await settleValidation();
  });

  it('declares multi-select listboxes as multi-selectable, and single ones not', async () => {
    const single = renderSyntheticWizard(1);
    await screen.findByTestId('creation-wizard');
    userClickStep('2. Lineage');
    expect(await screen.findByRole('listbox', { name: 'Lineage' })).not.toHaveAttribute(
      'aria-multiselectable'
    );
    single.unmount();
    localStorage.clear();

    renderSyntheticWizard(2);
    await screen.findByTestId('creation-wizard');
    userClickStep('2. Lineage');
    expect(await screen.findByRole('listbox', { name: 'Lineage' })).toHaveAttribute(
      'aria-multiselectable',
      'true'
    );
    await settleValidation();
  });
});

/** Step chips are plain buttons labelled "<n>. <title>". */
function userClickStep(label: string) {
  fireEvent.click(screen.getByRole('button', { name: label }));
}

/*
 * ALL-SEVEN COVERAGE for these same invariants lives in
 * `src/__tests__/creation/creationWizard.test.tsx`, not here. That suite
 * already renders every registered system's real creation plan, so the
 * per-system assertions ride along on work already being done. Re-mounting all
 * seven real plans in this file instead did not finish in a usable time, which
 * is exactly why the check was folded into the existing harness rather than
 * duplicated.
 */
