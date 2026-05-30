import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const DND5E_HOST_BUDGET_LINES = 400;

function countLines(source: string): number {
  const normalized = source.endsWith('\n') ? source.slice(0, -1) : source;
  return normalized.length === 0 ? 0 : normalized.split(/\r?\n/).length;
}

describe('sheet host size budgets', () => {
  it('keeps the shared D&D 5e host under the active-track budget', () => {
    const source = readFileSync(
      path.resolve(process.cwd(), 'src/systems/dnd5e/shared/Dnd5eSheetBase.tsx'),
      'utf8'
    );

    expect(countLines(source)).toBeLessThanOrEqual(DND5E_HOST_BUDGET_LINES);
  });
});
