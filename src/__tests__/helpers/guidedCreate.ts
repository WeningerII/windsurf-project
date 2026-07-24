import { fireEvent, screen, waitFor } from '@testing-library/react';
import { expect } from 'vitest';

const DEFAULT_TIMEOUT_MS = 15000;

/**
 * Test helper: drive the system-agnostic guided-creation wizard that now opens
 * when a system is picked from the New Character dialog. Jumps straight to the
 * Review step and creates from the SRD defaults (skipping the optional
 * class/species/etc. choices), landing on the character sheet — the same end
 * state the old pick-to-create flow produced. Shared so App/flow tests drive the
 * wizard identically without repeating the click sequence.
 */
export async function completeGuidedCreationFromDefaults(timeout = DEFAULT_TIMEOUT_MS) {
  await screen.findByTestId('creation-wizard', {}, { timeout });
  fireEvent.click(screen.getByRole('button', { name: /\breview\b/i }));
  const createBtn = await screen.findByTestId('creation-create', {}, { timeout });
  await waitFor(() => expect(createBtn).toBeEnabled(), { timeout });
  // Let the wizard's live validation settle first — for some systems it triggers
  // lazy SRD-data imports, and awaiting them here avoids "Closing rpc while fetch
  // was pending" teardown races once the wizard unmounts on create.
  await waitFor(
    () => expect(screen.getByTestId('creation-validation')).not.toHaveTextContent('Checking build'),
    { timeout }
  );
  fireEvent.click(createBtn);
}
