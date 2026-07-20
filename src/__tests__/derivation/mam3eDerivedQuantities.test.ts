/**
 * Generic verification for the Mutants & Masterminds 3e declarative derived
 * quantities. ONE test covers every declared quantity by iterating each spec's
 * `cases` — adding a quantity in derivedQuantities.ts needs no new test code,
 * and the compute register points its `testRef` at the spec-id describe block
 * below.
 */
import { describe, it, expect } from 'vitest';
import { createDefaultMam3eData, type Mam3eDataModel } from '../../systems/mam3e/data-model';
import { MAM3E_DERIVED_QUANTITIES } from '../../systems/mam3e/derivedQuantities';

describe('M&M 3e declared derived quantities', () => {
  it('every spec declares at least one verification case', () => {
    for (const spec of MAM3E_DERIVED_QUANTITIES) {
      expect(spec.cases.length).toBeGreaterThan(0);
    }
  });

  for (const spec of MAM3E_DERIVED_QUANTITIES) {
    describe(spec.id, () => {
      for (const testCase of spec.cases) {
        it(testCase.name, () => {
          const system = {
            ...createDefaultMam3eData(),
            ...testCase.system,
          } as Mam3eDataModel;
          expect(spec.compute(system)).toBe(testCase.expected);
        });
      }
    });
  }
});
