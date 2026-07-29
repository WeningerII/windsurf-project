import '@testing-library/jest-dom';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { registerAllSystems } from '../../systems';
import { systemRegistry } from '../../registry';
import type { SystemDataModel } from '../../types/core/document';
import type { CreationPlan } from '../../creation/types';

/**
 * Regression lock for a stuck-forever loading state in the guided wizard.
 *
 * THE BUG. `CreationWizard` builds its working document ASYNCHRONOUSLY
 * (`buildWorkingDocument`, which awaits and whose validation lazily imports SRD
 * data), so `workingDoc` is `null` for a window after mount. `ChoiceStepView`'s
 * option-loading effect opened with `if (!document) return;` and declared
 * `[step]` as its only dependency. Reach a choice step inside that window and
 * the effect fires once with a null document, returns early, and **never runs
 * again** — `step` does not change afterwards. `options` stays `null`, so the
 * step renders its loading skeleton permanently. No error, no retry, no way out
 * except navigating away and back.
 *
 * HOW IT PRESENTED. As a CI-only flake in
 * `src/__tests__/a11y/creationWizard.a11y.test.tsx`: `Unable to find
 * role="listbox" and name "Lineage"` with the DOM showing
 * `data-testid="creation-choice-loading"`. It was misdiagnosed twice — first as
 * a slow render (fixed by raising the wait to 10s; it failed again at 10,181ms)
 * and then as a double-mount interaction (fixed by splitting the test; it failed
 * again here). Both were hypotheses that had never been observed failing before
 * and passing after.
 *
 * What finally settled it: that suite's `loadOptions` is
 * `() => Promise.resolve([...])` — an ALREADY-RESOLVED promise. It cannot take
 * ten seconds. The load had never been started, which is a different failure
 * from a slow one, and no timeout can fix it.
 *
 * WHY CI ONLY. The window is real on every machine; a contended worker just
 * makes `buildWorkingDocument` more likely to still be pending when the step
 * changes. This test removes the timing entirely by holding the document
 * unresolved until the step change has definitely happened, so it fails
 * deterministically against the unfixed effect on any machine.
 */

beforeAll(() => {
  if (!systemRegistry.get('mam3e')) {
    registerAllSystems();
  }
});

afterEach(() => {
  cleanup();
  localStorage.clear();
  vi.restoreAllMocks();
});

/** A promise whose resolution this test controls, standing in for the async document build. */
function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((res) => {
    resolve = res;
  });
  return { promise, resolve };
}

const gate = deferred<unknown>();

// Mocked at module scope (vi.mock is hoisted) so the wizard's own import is the
// one that blocks. The real builder is awaited first so the resolved document is
// genuine — only its ARRIVAL is delayed, which is exactly the production window.
vi.mock('../../creation/draftDocument', async () => {
  const actual = await vi.importActual<typeof import('../../creation/draftDocument')>(
    '../../creation/draftDocument'
  );
  return {
    ...actual,
    buildWorkingDocument: async (...args: Parameters<typeof actual.buildWorkingDocument>) => {
      const doc = await actual.buildWorkingDocument(...args);
      await gate.promise;
      return doc;
    },
  };
});

function syntheticPlan(): CreationPlan<SystemDataModel> {
  return {
    systemId: 'dnd-5e-2024',
    steps: [
      {
        kind: 'choice',
        id: 'lineage',
        title: 'Lineage',
        loadOptions: () => [],
        apply: (s: SystemDataModel) => s,
      },
    ],
  } as unknown as CreationPlan<SystemDataModel>;
}

describe('ChoiceStepView option loading vs. the async working document', () => {
  it('loads options when the document arrives AFTER the step is already showing', async () => {
    const { CreationWizard } = await import('../../creation/CreationWizard');
    const def = systemRegistry.get('dnd-5e-2024');
    if (!def) throw new Error('dnd-5e-2024 must be registered');

    render(
      <CreationWizard
        systemId="dnd-5e-2024"
        plan={syntheticPlan()}
        createDefaultData={def.createDefaultData}
        systemLabel={def.label}
        onComplete={() => {}}
        onCancel={() => {}}
      />
    );

    // Navigate to the choice step while `workingDoc` is still null. The wizard
    // synthesizes a Name step first and a Review step last, so the declared
    // choice step is "2. Lineage". This is the production window, held open
    // rather than raced.
    await screen.findByTestId('creation-wizard');
    fireEvent.click(screen.getByRole('button', { name: '2. Lineage' }));
    expect(screen.getByTestId('creation-choice-loading')).toBeInTheDocument();

    // Now let the document arrive. The effect must notice.
    gate.resolve(undefined);

    // Before the fix this never resolves: the effect already ran and returned
    // early, `step` never changes again, so `options` stays null forever and the
    // skeleton is permanent. The assertion is on the skeleton GOING AWAY rather
    // than on a timeout, so a regression fails for the right reason.
    await screen.findByTestId('creation-choice-lineage', undefined, { timeout: 5000 });
    expect(screen.queryByTestId('creation-choice-loading')).not.toBeInTheDocument();

    // Releasing the gate also releases the validation pass behind it, which
    // lazily imports SRD data. Ending the test here tears the worker down
    // mid-import and Vitest reports `Closing rpc while "fetch" was pending` as
    // an unhandled rejection — green tests, red run. Same guard, same reason, as
    // `creationWizard.test.tsx` and the a11y suite; this file needed it too and
    // the full-suite run is what surfaced that.
    await waitFor(
      () =>
        expect(screen.getByTestId('creation-validation')).not.toHaveTextContent('Checking build'),
      { timeout: 20000 }
    );
  });
});
