/**
 * Generic verification for the D&D 3.5e declarative derived quantities. ONE test
 * covers every declared quantity by iterating each spec's `cases` — adding a
 * quantity in derivedQuantities.ts needs no new test code, and the compute
 * register points its `testRef` at the spec-id describe block below.
 */
import { describe, it, expect } from 'vitest';
import { createDefaultDnd35eData, type Dnd35eDataModel } from '../../systems/dnd35e/data-model';
import { DND35E_DERIVED_QUANTITIES } from '../../systems/dnd35e/derivedQuantities';

describe('D&D 3.5e declared derived quantities', () => {
  it('every spec declares at least one verification case', () => {
    for (const spec of DND35E_DERIVED_QUANTITIES) {
      expect(spec.cases.length).toBeGreaterThan(0);
    }
  });

  for (const spec of DND35E_DERIVED_QUANTITIES) {
    describe(spec.id, () => {
      for (const testCase of spec.cases) {
        it(testCase.name, () => {
          const system = {
            ...createDefaultDnd35eData(),
            ...testCase.system,
          } as Dnd35eDataModel;
          expect(spec.compute(system)).toBe(testCase.expected);
        });
      }
    });
  }
});
