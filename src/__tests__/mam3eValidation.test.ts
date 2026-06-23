import { describe, expect, it } from 'vitest';

import { createMam3eValidator } from '../systems/mam3e/validation';
import { createDefaultMam3eData, type Mam3eDataModel } from '../systems/mam3e/data-model';
import type { CharacterDocument } from '../types/core/document';
import type { ValidationIssue } from '../registry/types';

/**
 * MASTER_PLAN parity track: M&M 3e now has a registry validator (closing the
 * validation spike). It is point-buy on a Power Level budget, so legality is the
 * PL trade-off caps + the power-point budget — surfaced from the engine's own
 * `prepareData` math (no parallel rules).
 */

const validator = createMam3eValidator();

function mam3eDoc(mutate?: (data: Mam3eDataModel) => void): CharacterDocument<Mam3eDataModel> {
  const system = createDefaultMam3eData();
  mutate?.(system);
  return {
    id: 'm',
    name: 'Hero',
    systemId: 'mam3e',
    system,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

async function validate(document: CharacterDocument<Mam3eDataModel>): Promise<ValidationIssue[]> {
  const result = await validator.validateDocument(document, { systemId: 'mam3e', reason: 'edit' });
  return result.issues;
}

function codes(issues: ValidationIssue[]): string[] {
  return issues.map((issue) => issue.code);
}

describe('M&M 3e validator', () => {
  it('accepts the default (empty, balanced) build with no errors', async () => {
    const issues = await validate(mam3eDoc());
    expect(issues.filter((issue) => issue.severity === 'error')).toEqual([]);
  });

  it('flags an over-budget build', async () => {
    // 76 ranks of Intellect cost 152 PP, over the PL 10 budget of 150.
    const issues = await validate(mam3eDoc((data) => (data.abilities.int = 76)));
    expect(issues).toContainEqual(
      expect.objectContaining({ code: 'mam3e-over-budget', severity: 'error' })
    );
  });

  it('flags a Power Level trade-off cap violation', async () => {
    // Agility 15 (Dodge 15) + Toughness rank 10 → Dodge + Toughness 25 > 2 × PL (20).
    const issues = await validate(
      mam3eDoc((data) => {
        data.abilities.agi = 15;
        data.defenses.toughness.rank = 10;
      })
    );
    expect(issues).toContainEqual(
      expect.objectContaining({ code: 'mam3e-pl-cap', severity: 'error' })
    );
  });

  it('flags an invalid Power Level', async () => {
    const issues = await validate(mam3eDoc((data) => (data.powerLevel = 0)));
    expect(codes(issues)).toContain('mam3e-invalid-power-level');
  });

  it('flags a system-id mismatch', async () => {
    const document = mam3eDoc();
    const wrong = { ...document, systemId: 'pf2e' };
    const issues = await validate(wrong);
    expect(codes(issues)).toContain('mam3e-system-mismatch');
  });
});

/**
 * addIssue stamps each issue with a `source`, falling back across
 * issue.source -> context.source -> context.reason. Covers both arms of the
 * `source ? { ...issue, source } : issue` ternary (validation.ts:31).
 */
describe('M&M 3e validator issue source stamping', () => {
  // System mismatch is a context-stamped issue: it carries no `source` of its
  // own, so whatever ends up on it comes entirely from the context fallback.
  const mismatch = (): CharacterDocument<Mam3eDataModel> => {
    const document = mam3eDoc();
    return { ...document, systemId: 'pf2e' };
  };

  function mismatchIssue(issues: ValidationIssue[]): ValidationIssue {
    return issues.find((issue) => issue.code === 'mam3e-system-mismatch')!;
  }

  it('leaves the issue unstamped when neither reason nor source is supplied', async () => {
    const { issues } = await validator.validateDocument(mismatch(), { systemId: 'mam3e' });
    // Falsy branch: no context source/reason -> the raw issue is pushed as-is.
    expect(mismatchIssue(issues).source).toBeUndefined();
  });

  it('stamps the context reason as the source when no explicit source is given', async () => {
    const { issues } = await validator.validateDocument(mismatch(), {
      systemId: 'mam3e',
      reason: 'import',
    });
    expect(mismatchIssue(issues).source).toBe('import');
  });

  it('prefers an explicit context source over the reason', async () => {
    const { issues } = await validator.validateDocument(mismatch(), {
      systemId: 'mam3e',
      reason: 'import',
      source: 'ai-draft',
    });
    expect(mismatchIssue(issues).source).toBe('ai-draft');
  });
});
