import { describe, it, expect } from 'vitest';
import { createPf2eValidator } from '../../../systems/pf2e/validation';
import { createDefaultPf2eData } from '../../../systems/pf2e/data-model';
import type { Pf2eDataModel } from '../../../systems/pf2e/data-model';
import type { CharacterDocument } from '../../../types/core/document';
import type { ValidationContext } from '../../../registry/types';

function makeDoc(mutate?: (sys: Pf2eDataModel) => void): CharacterDocument<Pf2eDataModel> {
  const system = createDefaultPf2eData();
  mutate?.(system);
  return {
    id: 'pf2e-validate-doc',
    name: 'Validate Hero',
    systemId: 'pf2e',
    system,
    createdAt: new Date('2026-03-05T00:00:00.000Z'),
    updatedAt: new Date('2026-03-05T00:00:00.000Z'),
  };
}

/** A complete, in-catalog level-1 build that should pass cleanly. */
function legalDoc(): CharacterDocument<Pf2eDataModel> {
  return makeDoc((sys) => {
    sys.classId = 'wizard';
    sys.ancestryId = 'elf';
    sys.heritageId = 'high-elf';
    sys.backgroundId = 'pf2e-bg-acolyte';
  });
}

const validator = createPf2eValidator();

async function validate(
  doc: CharacterDocument<Pf2eDataModel>,
  context: Omit<ValidationContext, 'systemId'> = { reason: 'creation' }
) {
  return validator.validateDocument(doc, { ...context, systemId: 'pf2e' });
}

function codes(issues: { code: string }[]): string[] {
  return issues.map((issue) => issue.code);
}

describe('createPf2eValidator', () => {
  it('passes a complete, in-catalog level-1 build', async () => {
    const { issues } = await validate(legalDoc());
    expect(issues).toEqual([]);
  });

  it('warns about missing core build choices on a fresh sheet', async () => {
    const { issues } = await validate(makeDoc());
    expect(codes(issues)).toEqual(
      expect.arrayContaining([
        'pf2e-missing-class',
        'pf2e-missing-ancestry',
        'pf2e-missing-background',
      ])
    );
    // Missing choices are warnings, not hard errors.
    expect(issues.every((issue) => issue.severity === 'warning')).toBe(true);
  });

  it('rejects a class that is not in the catalog', async () => {
    const doc = legalDoc();
    doc.system.classId = 'not-a-class';
    const { issues } = await validate(doc);
    const unknown = issues.find((issue) => issue.code === 'pf2e-unknown-class');
    expect(unknown?.severity).toBe('error');
  });

  it('flags a heritage that does not belong to the ancestry', async () => {
    const doc = legalDoc();
    doc.system.heritageId = 'cavern-elf'; // a valid elf heritage — control
    const ok = await validate(doc);
    expect(codes(ok.issues)).not.toContain('pf2e-heritage-ancestry-mismatch');

    doc.system.heritageId = 'forge-blessed'; // belongs to dwarf, not elf
    const bad = await validate(doc);
    const mismatch = bad.issues.find((issue) => issue.code === 'pf2e-heritage-ancestry-mismatch');
    expect(mismatch?.severity).toBe('error');
  });

  it('rejects out-of-range ability scores', async () => {
    const doc = legalDoc();
    doc.system.baseAttributes.str = 99;
    const { issues } = await validate(doc);
    const bad = issues.find((issue) => issue.code === 'pf2e-invalid-ability-score');
    expect(bad?.path).toBe('system.baseAttributes.str');
  });

  it('rejects a corrupt proficiency tier', async () => {
    const doc = legalDoc();
    doc.system.saveProficiencies.fortitude = {
      tier: 'godlike' as Pf2eDataModel['saveProficiencies']['fortitude']['tier'],
      total: 0,
    };
    const { issues } = await validate(doc);
    expect(codes(issues)).toContain('pf2e-invalid-proficiency-tier');
  });

  it('rejects an over-subscribed spell slot', async () => {
    const doc = legalDoc();
    doc.system.spellcasting = {
      tradition: 'arcane',
      type: 'prepared',
      proficiency: { tier: 'trained', total: 0 },
      spellSlots: { 1: { max: 2, used: 5 } },
      spellsKnown: [],
      focusSpells: [],
      focusPoints: { current: 0, max: 0 },
    };
    const { issues } = await validate(doc);
    expect(codes(issues)).toContain('pf2e-invalid-spell-slot');
  });

  it('flags a system-id mismatch', async () => {
    const doc = { ...legalDoc(), systemId: 'mam3e' } as CharacterDocument<Pf2eDataModel>;
    const { issues } = await validate(doc);
    expect(codes(issues)).toContain('pf2e-system-mismatch');
  });

  it('stamps the issue source from the validation reason', async () => {
    const doc = legalDoc();
    doc.system.level = 0;
    const { issues } = await validate(doc, { reason: 'ai-draft' });
    const invalid = issues.find((issue) => issue.code === 'pf2e-invalid-level');
    expect(invalid?.source).toBe('ai-draft');
  });
});
