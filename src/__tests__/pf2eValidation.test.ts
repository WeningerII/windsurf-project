import { describe, expect, it } from 'vitest';

import { createPf2eValidator } from '../systems/pf2e/validation';
import { createDefaultPf2eData, type Pf2eDataModel } from '../systems/pf2e/data-model';
import {
  loadClassesForSystem,
  loadPf2eBackgroundsForSystem,
  loadSpeciesForSystem,
} from '../utils/dataLoader';
import type { CharacterDocument } from '../types/core/document';
import type { ValidationIssue } from '../registry/types';

/**
 * MASTER_PLAN parity track: PF2e now has a registry validator. It resolves the
 * ancestry, heritage, background, and class ids against the same loader catalogs
 * the creation flow uses, validates heritage within its ancestry, and bounds the
 * character level — warning on an in-progress build, erroring on an unknown id.
 */

const validator = createPf2eValidator<Pf2eDataModel>();

function pf2eDoc(mutate?: (data: Pf2eDataModel) => void): CharacterDocument<Pf2eDataModel> {
  const system = createDefaultPf2eData();
  mutate?.(system);
  return {
    id: 'p',
    name: 'Hero',
    systemId: 'pf2e',
    system,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

async function validate(document: CharacterDocument<Pf2eDataModel>): Promise<ValidationIssue[]> {
  const result = await validator.validateDocument(document, {
    systemId: 'pf2e',
    reason: 'creation',
  });
  return result.issues;
}

function codes(issues: ValidationIssue[]): string[] {
  return issues.map((issue) => issue.code);
}

describe('PF2e validator', () => {
  it('accepts a legal ancestry/background/class build', async () => {
    const [cls] = await loadClassesForSystem('pf2e');
    const [ancestry] = await loadSpeciesForSystem('pf2e');
    const [background] = await loadPf2eBackgroundsForSystem('pf2e');
    const issues = await validate(
      pf2eDoc((data) => {
        data.level = 1;
        data.classId = cls.id;
        data.ancestryId = ancestry.id;
        data.backgroundId = background.id;
      })
    );
    expect(issues).toEqual([]);
  });

  it('warns on a missing class on the default draft', async () => {
    const issues = await validate(pf2eDoc());
    expect(codes(issues)).toContain('pf2e-missing-class');
  });

  it('errors on an unknown class id', async () => {
    const issues = await validate(pf2eDoc((data) => (data.classId = 'no-such-class')));
    expect(issues).toContainEqual(
      expect.objectContaining({ code: 'pf2e-unknown-class', severity: 'error' })
    );
  });

  it('errors on an unknown ancestry id', async () => {
    const issues = await validate(pf2eDoc((data) => (data.ancestryId = 'no-such-ancestry')));
    expect(issues).toContainEqual(
      expect.objectContaining({ code: 'pf2e-unknown-ancestry', severity: 'error' })
    );
  });

  it('errors on a heritage that is not part of the chosen ancestry', async () => {
    const [ancestry] = await loadSpeciesForSystem('pf2e');
    const issues = await validate(
      pf2eDoc((data) => {
        data.ancestryId = ancestry.id;
        data.heritageId = 'no-such-heritage';
      })
    );
    expect(issues).toContainEqual(
      expect.objectContaining({ code: 'pf2e-unknown-heritage', severity: 'error' })
    );
  });

  it('errors on an out-of-range level', async () => {
    const issues = await validate(pf2eDoc((data) => (data.level = 99)));
    expect(codes(issues)).toContain('pf2e-invalid-level');
  });

  it('errors when the document systemId is not pf2e', async () => {
    const document = pf2eDoc();
    (document as { systemId: string }).systemId = 'dnd5e';
    const issues = await validate(document);
    expect(issues).toContainEqual(
      expect.objectContaining({
        code: 'pf2e-system-mismatch',
        severity: 'error',
        path: 'systemId',
        recoverable: false,
      })
    );
  });

  it('warns when a heritage is set but its ancestry does not resolve', async () => {
    // Heritage without a resolvable ancestry: the validator can't check
    // membership, so it warns (recoverable) rather than erroring on the id.
    const issues = await validate(
      pf2eDoc((data) => {
        data.ancestryId = 'no-such-ancestry';
        data.heritageId = 'skilled';
      })
    );
    expect(issues).toContainEqual(
      expect.objectContaining({
        code: 'pf2e-heritage-without-ancestry',
        severity: 'warning',
        path: 'heritageId',
      })
    );
  });
});
