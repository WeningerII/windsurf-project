import { expect, type Page } from '@playwright/test';

/**
 * Drive the system-agnostic guided-creation wizard that opens when a system is
 * picked from the New Character dialog: jump to the Review step and create from
 * the SRD defaults (skipping the optional class/species/etc. choices), landing
 * on the character sheet — the same end state the old pick-to-create flow
 * produced. Shared so every e2e spec drives the wizard identically.
 *
 * Call immediately after clicking the system button, before waiting for the
 * sheet (the Back button / character heading).
 */
export async function completeGuidedCreationFromDefaults(page: Page): Promise<void> {
  await page.getByTestId('creation-wizard').waitFor({ timeout: 30_000 });
  await page.getByRole('button', { name: /\bReview\b/i }).click();
  const createBtn = page.getByTestId('creation-create');
  await expect(createBtn).toBeEnabled({ timeout: 30_000 });
  await createBtn.click();
}
