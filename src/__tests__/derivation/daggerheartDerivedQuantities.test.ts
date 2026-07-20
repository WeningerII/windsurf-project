/**
 * Generic verification for the Daggerheart declarative derived quantities. ONE
 * test covers every declared quantity by iterating each spec's `cases` — adding
 * a quantity in derivedQuantities.ts needs no new test code, and the compute
 * register points its `testRef` at the spec-id describe block below.
 */
import { describe, it, expect } from 'vitest';
import {
  createDefaultDaggerheartData,
  type DaggerheartDataModel,
} from '../../systems/daggerheart/data-model';
import { DAGGERHEART_DERIVED_QUANTITIES } from '../../systems/daggerheart/derivedQuantities';

describe('Daggerheart declared derived quantities', () => {
  it('every spec declares at least one verification case', () => {
    for (const spec of DAGGERHEART_DERIVED_QUANTITIES) {
      expect(spec.cases.length).toBeGreaterThan(0);
    }
  });

  for (const spec of DAGGERHEART_DERIVED_QUANTITIES) {
    describe(spec.id, () => {
      for (const testCase of spec.cases) {
        it(testCase.name, () => {
          const system = {
            ...createDefaultDaggerheartData(),
            ...testCase.system,
          } as DaggerheartDataModel;
          expect(spec.compute(system)).toBe(testCase.expected);
        });
      }
    });
  }
});
