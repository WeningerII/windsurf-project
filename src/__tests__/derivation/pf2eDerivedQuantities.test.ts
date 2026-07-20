/**
 * Generic verification for the Pathfinder 2e declarative derived quantities. ONE
 * test covers every declared quantity by iterating each spec's `cases` — adding a
 * quantity in derivedQuantities.ts needs no new test code, and the compute
 * register points its `testRef` at the spec-id describe block below.
 */
import { describe, it, expect } from 'vitest';
import { createDefaultPf2eData, type Pf2eDataModel } from '../../systems/pf2e/data-model';
import { PF2E_DERIVED_QUANTITIES } from '../../systems/pf2e/derivedQuantities';

describe('PF2e declared derived quantities', () => {
  it('every spec declares at least one verification case', () => {
    for (const spec of PF2E_DERIVED_QUANTITIES) {
      expect(spec.cases.length).toBeGreaterThan(0);
    }
  });

  for (const spec of PF2E_DERIVED_QUANTITIES) {
    describe(spec.id, () => {
      for (const testCase of spec.cases) {
        it(testCase.name, () => {
          const system = {
            ...createDefaultPf2eData(),
            ...testCase.system,
          } as Pf2eDataModel;
          expect(spec.compute(system)).toBe(testCase.expected);
        });
      }
    });
  }
});
