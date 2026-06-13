import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * Enforces the size budget that the sheet-host orchestrators document. These
 * files are deliberately thin "tabs container + section wiring" hosts; per-tab
 * logic and state belong in `./components/` and the controller hooks, not here.
 * `Dnd5eSheetBase.tsx` references this test by name — it now exists and is the
 * mechanism that keeps the hosts from growing into god-objects.
 */
const HOST_BUDGET_LOC = 400;

const HOSTS = [
  'src/systems/dnd5e/shared/Dnd5eSheetBase.tsx',
  'src/systems/mam3e/sheet.tsx',
  'src/systems/pf2e/sheet.tsx',
  'src/systems/daggerheart/sheet.tsx',
  'src/systems/d20-legacy/sheet.tsx',
];

function loc(relPath: string): number {
  return readFileSync(resolve(process.cwd(), relPath), 'utf8').split('\n').length;
}

describe('sheet-host size budget', () => {
  it.each(HOSTS)('%s stays within the %i-LOC host budget', (host) => {
    const lines = loc(host);
    expect(lines, `${host} is ${lines} LOC (budget ${HOST_BUDGET_LOC})`).toBeLessThanOrEqual(
      HOST_BUDGET_LOC
    );
  });
});
