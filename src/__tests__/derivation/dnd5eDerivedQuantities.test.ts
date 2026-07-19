/**
 * Generic verification for the D&D 5e declarative derived quantities. ONE test
 * covers every declared quantity by iterating each spec's `cases` — adding a
 * quantity in derivedQuantities.ts needs no new test code, and the compute
 * register points its `testRef` at the spec-id describe block below.
 */
import { describe, it, expect } from 'vitest';
import { createDefaultDnd5eData, type Dnd5eDataModel } from '../../systems/dnd5e/data-model';
import { DND5E_DERIVED_QUANTITIES } from '../../systems/dnd5e/shared/derivedQuantities';

describe('D&D 5e declared derived quantities', () => {
  it('every spec declares at least one verification case', () => {
    for (const spec of DND5E_DERIVED_QUANTITIES) {
      expect(spec.cases.length).toBeGreaterThan(0);
    }
  });

  for (const spec of DND5E_DERIVED_QUANTITIES) {
    describe(spec.id, () => {
      for (const testCase of spec.cases) {
        it(testCase.name, () => {
          const system = {
            ...createDefaultDnd5eData(),
            ...testCase.system,
          } as Dnd5eDataModel;
          expect(spec.compute(system)).toBe(testCase.expected);
        });
      }
    });
  }
});
