import { describe, it, expect } from 'vitest';
import { createD20LegacyValidator } from '../../../systems/d20-legacy/validation';
import { createDefaultPf1eData, type Pf1eDataModel } from '../../../systems/pf1e/data-model';
import { createDefaultDnd35eData, type Dnd35eDataModel } from '../../../systems/dnd35e/data-model';
import type { CharacterDocument } from '../../../types/core/document';

const pf1eValidator = createD20LegacyValidator<Pf1eDataModel>('pf1e');
const dnd35eValidator = createD20LegacyValidator<Dnd35eDataModel>('dnd-3.5e');

function pf1eDoc(mutate?: (sys: Pf1eDataModel) => void): CharacterDocument<Pf1eDataModel> {
  const system = createDefaultPf1eData();
  system.level = 1;
  system.speciesId = 'human';
  system.classLevels = [
    {
      classId: 'fighter',
      level: 1,
      hitDieRolls: [10],
      bab: 'full',
      fortSave: 'good',
      refSave: 'poor',
      willSave: 'poor',
      skillPointsPerLevel: 2,
      favoredClassBonus: 'hp',
    },
  ];
  mutate?.(system);
  return wrap('pf1e', system);
}

function dnd35eDoc(mutate?: (sys: Dnd35eDataModel) => void): CharacterDocument<Dnd35eDataModel> {
  const system = createDefaultDnd35eData();
  system.level = 1;
  system.speciesId = 'human';
  system.classLevels = [
    {
      classId: 'fighter',
      level: 1,
      hitDieRolls: [10],
      bab: 'full',
      fortSave: 'good',
      refSave: 'poor',
      willSave: 'poor',
      skillPointsPerLevel: 2,
    },
  ];
  mutate?.(system);
  return wrap('dnd-3.5e', system);
}

function wrap<T extends Pf1eDataModel | Dnd35eDataModel>(
  systemId: string,
  system: T
): CharacterDocument<T> {
  return {
    id: 'd20-validate-doc',
    name: 'd20 Hero',
    systemId,
    system,
    createdAt: new Date('2026-03-05T00:00:00.000Z'),
    updatedAt: new Date('2026-03-05T00:00:00.000Z'),
  };
}

function codes(issues: { code: string }[]): string[] {
  return issues.map((issue) => issue.code);
}

describe('createD20LegacyValidator (shared by PF1e and D&D 3.5e)', () => {
  it('passes a complete, in-catalog level-1 fighter for both systems', async () => {
    const pf1e = await pf1eValidator.validateDocument(pf1eDoc(), { systemId: 'pf1e' });
    expect(pf1e.issues).toEqual([]);

    const dnd35e = await dnd35eValidator.validateDocument(dnd35eDoc(), { systemId: 'dnd-3.5e' });
    expect(dnd35e.issues).toEqual([]);
  });

  it('rejects an unknown class and an unknown race', async () => {
    const doc = pf1eDoc((sys) => {
      sys.classLevels[0].classId = 'not-a-class';
      sys.speciesId = 'not-a-race';
    });
    const { issues } = await pf1eValidator.validateDocument(doc, { systemId: 'pf1e' });
    expect(codes(issues)).toEqual(
      expect.arrayContaining(['d20-unknown-class', 'd20-unknown-species'])
    );
  });

  it('warns when class levels do not total the character level', async () => {
    const doc = pf1eDoc((sys) => {
      sys.level = 3; // classLevels still total 1
    });
    const { issues } = await pf1eValidator.validateDocument(doc, { systemId: 'pf1e' });
    const mismatch = issues.find((issue) => issue.code === 'd20-class-total-mismatch');
    expect(mismatch?.severity).toBe('warning');
    expect(mismatch?.details).toMatchObject({ totalClassLevel: 1, characterLevel: 3 });
  });

  it('rejects out-of-range ability scores', async () => {
    const doc = pf1eDoc((sys) => {
      sys.baseAttributes.str = 0;
    });
    const { issues } = await pf1eValidator.validateDocument(doc, { systemId: 'pf1e' });
    expect(codes(issues)).toContain('d20-invalid-ability-score');
  });

  it('applies the system-specific skill-rank cap (PF1e=level, 3.5e=level+3)', async () => {
    // 4 ranks at level 1: legal in 3.5e (cap 4), illegal in PF1e (cap 1).
    const pf1e = await pf1eValidator.validateDocument(
      pf1eDoc((sys) => {
        sys.skillRanks = { climb: 4 };
      }),
      { systemId: 'pf1e' }
    );
    const over = pf1e.issues.find((issue) => issue.code === 'd20-skill-ranks-over-cap');
    expect(over?.details).toMatchObject({ value: 4, limit: 1 });

    const dnd35e = await dnd35eValidator.validateDocument(
      dnd35eDoc((sys) => {
        sys.skillRanks = { climb: 4 };
      }),
      { systemId: 'dnd-3.5e' }
    );
    expect(codes(dnd35e.issues)).not.toContain('d20-skill-ranks-over-cap');
  });

  it('flags a system-id mismatch', async () => {
    const doc = { ...pf1eDoc(), systemId: 'pf2e' } as CharacterDocument<Pf1eDataModel>;
    const { issues } = await pf1eValidator.validateDocument(doc, { systemId: 'pf1e' });
    expect(codes(issues)).toContain('d20-system-mismatch');
  });

  it('stamps the issue source from the validation reason', async () => {
    const doc = pf1eDoc((sys) => {
      sys.level = 0;
    });
    const { issues } = await pf1eValidator.validateDocument(doc, {
      systemId: 'pf1e',
      reason: 'ai-draft',
    });
    const invalid = issues.find((issue) => issue.code === 'd20-invalid-level');
    expect(invalid?.source).toBe('ai-draft');
  });
});
