import { describe, expect, it } from 'vitest';
import { loadEquipmentForSystem, loadSpellsForSystem } from '../../utils/dataLoader';
import {
  formatAreaOfEffect,
  formatCastingTime,
  formatDuration,
  formatItemCost,
  formatRange,
} from '../../utils/formatters';
import type { GameSystemId } from '../../types/game-systems';

/**
 * WORK_PLAN §6.6 — the shared formatters run over SEVEN catalogs, and the
 * shapes only diverge at runtime, per system, so TypeScript cannot see it.
 *
 * This is the gate that was missing. Two production crashes came from the same
 * hole one commit apart: `formatItemCost` printing "undefined undefined" for
 * M&M Equipment-Point costs, then `formatCastingTime` reading `ct.amount` on an
 * M&M power that has no casting time at all — which took the whole app into its
 * error boundary the moment the Dock re-keyed to M&M (docs/GAPS.md §20.2). Both
 * were found by an e2e smoke test, and only because the second one was fatal.
 *
 * So this asserts against what the LOADERS ACTUALLY RETURN, not against the
 * declared types. It fails if a formatter throws on real shipped data, and it
 * fails if one leaks the string "undefined" into a caption.
 *
 * Measured absences at the time of writing, which is why the assertions are
 * shaped the way they are rather than demanding every field be present:
 *   - mam3e spells (61 powers): no castingTime, areaOfEffect, level or school
 *   - mam3e equipment (192):     no weight
 *   - every d20 system:          areaOfEffect absent on most spells
 *   - daggerheart:               both catalogs empty
 * Absence is legitimate here. A power has no casting time; that is not a
 * content defect and must not be "fixed" in the data.
 */

const SYSTEMS: GameSystemId[] = [
  'dnd-5e-2014',
  'dnd-5e-2024',
  'dnd-3.5e',
  'pf1e',
  'pf2e',
  'mam3e',
  'daggerheart',
];

/** A formatter result must be printable — never leak the absence into the UI. */
function expectPrintable(value: string | undefined, label: string) {
  if (value === undefined) return; // an explicit "nothing to show" is fine
  expect(typeof value, `${label} returned a non-string`).toBe('string');
  expect(value.toLowerCase(), `${label} leaked an absent value into the caption`).not.toContain(
    'undefined'
  );
  expect(value.toLowerCase(), `${label} leaked a null into the caption`).not.toContain('null');
  expect(value, `${label} returned NaN`).not.toContain('NaN');
}

describe('shared browser formatters over every shipped catalog', () => {
  for (const system of SYSTEMS) {
    it(`formats every spell row for ${system} without throwing or printing an absence`, async () => {
      const spells = await loadSpellsForSystem(system);

      for (const spell of spells) {
        // Exactly the calls src/dock/Dock.tsx makes when building a browser row.
        expectPrintable(formatCastingTime(spell.castingTime), `${system} castingTime`);
        expectPrintable(formatRange(spell.range), `${system} range`);
        expectPrintable(formatDuration(spell.duration), `${system} duration`);
        expectPrintable(formatAreaOfEffect(spell.areaOfEffect), `${system} areaOfEffect`);
      }
    });

    it(`formats every equipment row for ${system} without throwing or printing an absence`, async () => {
      const items = await loadEquipmentForSystem(system);

      for (const item of items) {
        expectPrintable(formatItemCost(item.cost), `${system} cost`);
      }
    });
  }

  it('keeps a fallback for the absent case rather than rendering the word undefined', () => {
    // The regression that crashed the app: a power with no casting time. Pinned
    // directly so the guard cannot be removed without a red test, independent
    // of whether the M&M catalog ever gains the field.
    expect(formatCastingTime(undefined)).toBe('—');
    expect(formatItemCost(undefined)).toBe('—');
    expect(formatAreaOfEffect(undefined)).toBeUndefined();

    // M&M prices gear in Equipment Points, not coin — a bare number, not {amount, currency}.
    expect(formatItemCost(3)).toBe('3 ep');
    expect(formatItemCost({ amount: 50, currency: 'gp' })).toBe('50 gp');
  });
});
