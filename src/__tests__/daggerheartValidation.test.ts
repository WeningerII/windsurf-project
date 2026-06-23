import { describe, expect, it } from 'vitest';

import { createDaggerheartValidator } from '../systems/daggerheart/validation';
import {
  createDefaultDaggerheartData,
  type DaggerheartDataModel,
} from '../systems/daggerheart/data-model';
import { daggerheartClasses } from '../data/daggerheart/1.0/classes';
import { daggerheartAncestries } from '../data/daggerheart/1.0/ancestries';
import type { CharacterDocument } from '../types/core/document';
import type { ValidationIssue } from '../registry/types';

/**
 * MASTER_PLAN parity track: Daggerheart now has a registry validator (closing the
 * validation spike). It reuses `daggerheartDerived` constants/resolvers — the SRD
 * creation trait array, Hope bounds, and class/ancestry name resolution — so it
 * never re-states a rule the system already owns.
 */

const validator = createDaggerheartValidator();
const LEGAL_TRAITS = {
  agility: 2,
  strength: 1,
  finesse: 1,
  instinct: 0,
  presence: 0,
  knowledge: -1,
};

function dhDoc(
  mutate?: (data: DaggerheartDataModel) => void
): CharacterDocument<DaggerheartDataModel> {
  const system = createDefaultDaggerheartData();
  mutate?.(system);
  return {
    id: 'd',
    name: 'Hero',
    systemId: 'daggerheart',
    system,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

async function validate(
  document: CharacterDocument<DaggerheartDataModel>
): Promise<ValidationIssue[]> {
  const result = await validator.validateDocument(document, {
    systemId: 'daggerheart',
    reason: 'creation',
  });
  return result.issues;
}

function codes(issues: ValidationIssue[]): string[] {
  return issues.map((issue) => issue.code);
}

describe('Daggerheart validator', () => {
  it('flags the incomplete default draft (missing class, unassigned traits)', async () => {
    const issues = await validate(dhDoc());
    expect(codes(issues)).toContain('daggerheart-missing-class');
    expect(codes(issues)).toContain('daggerheart-traits-unassigned');
    // Encouraged-but-missing choices are warnings, not errors.
    const ancestry = issues.find((i) => i.code === 'daggerheart-missing-ancestry');
    expect(ancestry?.severity).toBe('warning');
  });

  it('accepts a complete, legal level-1 character', async () => {
    const issues = await validate(
      dhDoc((data) => {
        data.class = daggerheartClasses[0].name;
        data.heritage = daggerheartAncestries[0].name;
        data.community = 'Wanderborne';
        data.attributes = { ...LEGAL_TRAITS };
        data.hope = 2;
      })
    );
    expect(issues).toEqual([]);
  });

  it('errors on an illegal trait array at level 1', async () => {
    const issues = await validate(
      dhDoc((data) => {
        data.class = daggerheartClasses[0].name;
        data.attributes = {
          agility: 3,
          strength: 3,
          finesse: 3,
          instinct: 0,
          presence: 0,
          knowledge: 0,
        };
      })
    );
    expect(issues).toContainEqual(
      expect.objectContaining({ code: 'daggerheart-illegal-trait-array', severity: 'error' })
    );
  });

  it('errors on an unrecognised class name', async () => {
    const issues = await validate(dhDoc((data) => (data.class = 'Bogusmancer')));
    expect(issues).toContainEqual(
      expect.objectContaining({ code: 'daggerheart-unknown-class', severity: 'error' })
    );
  });

  it('errors when Hope is out of range', async () => {
    const issues = await validate(dhDoc((data) => (data.hope = 99)));
    expect(codes(issues)).toContain('daggerheart-hope-range');
  });

  it('does not apply the strict trait array above level 1', async () => {
    const issues = await validate(
      dhDoc((data) => {
        data.class = daggerheartClasses[0].name;
        data.heritage = daggerheartAncestries[0].name;
        data.community = 'Wanderborne';
        data.level = 5;
        data.attributes = {
          agility: 4,
          strength: 3,
          finesse: 2,
          instinct: 1,
          presence: 1,
          knowledge: 0,
        };
      })
    );
    expect(codes(issues)).not.toContain('daggerheart-illegal-trait-array');
  });
});
