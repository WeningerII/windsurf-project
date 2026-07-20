/**
 * Generic verification for the Pathfinder 1e declarative derived quantities. ONE
 * test covers every declared quantity by iterating each spec's `cases` — adding a
 * quantity in derivedQuantities.ts needs no new test code, and the compute
 * register points its `testRef` at the spec-id describe block below.
 */
import { describe, it, expect } from 'vitest';
import { createDefaultPf1eData, type Pf1eDataModel } from '../../systems/pf1e/data-model';
import { PF1E_DERIVED_QUANTITIES } from '../../systems/pf1e/derivedQuantities';

describe('Pathfinder 1e declared derived quantities', () => {
  it('every spec declares at least one verification case', () => {
    for (const spec of PF1E_DERIVED_QUANTITIES) {
      expect(spec.cases.length).toBeGreaterThan(0);
    }
  });

  for (const spec of PF1E_DERIVED_QUANTITIES) {
    describe(spec.id, () => {
      for (const testCase of spec.cases) {
        it(testCase.name, () => {
          const system = {
            ...createDefaultPf1eData(),
            ...testCase.system,
          } as Pf1eDataModel;
          expect(spec.compute(system)).toBe(testCase.expected);
        });
      }
    });
  }
});
