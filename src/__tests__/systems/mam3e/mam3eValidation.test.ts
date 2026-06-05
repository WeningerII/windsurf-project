import { describe, it, expect } from 'vitest';
import { createMam3eValidator } from '../../../systems/mam3e/validation';
import { createDefaultMam3eData } from '../../../systems/mam3e/data-model';
import type { Mam3eDataModel } from '../../../systems/mam3e/data-model';
import type { CharacterDocument } from '../../../types/core/document';
import type { ValidationContext } from '../../../registry/types';

function makeDoc(overrides: Partial<Mam3eDataModel> = {}): CharacterDocument<Mam3eDataModel> {
  return {
    id: 'test-mam',
    name: 'Test Hero',
    systemId: 'mam3e',
    system: { ...createDefaultMam3eData(), ...overrides },
    createdAt: new Date('2026-05-01T00:00:00.000Z'),
    updatedAt: new Date('2026-05-01T00:00:00.000Z'),
  };
}

const validator = createMam3eValidator();

async function validate(
  doc: CharacterDocument<Mam3eDataModel>,
  context: Omit<ValidationContext, 'systemId'> = { reason: 'creation' }
) {
  return validator.validateDocument(doc, { ...context, systemId: 'mam3e' });
}

function codes(issues: { code: string }[]): string[] {
  return issues.map((issue) => issue.code);
}

describe('createMam3eValidator', () => {
  it('passes a default, standard-budget hero with no errors', async () => {
    // Default: PL 10, total 150 = 15 × 10, nothing spent.
    const { issues } = await validate(makeDoc());
    expect(issues.filter((issue) => issue.severity === 'error')).toEqual([]);
    expect(codes(issues)).not.toContain('mam3e-nonstandard-budget');
  });

  it('flags spending past the available power points', async () => {
    // Every ability at rank 10 costs 8 × 10 × 2 = 160 PP, over the 150 total.
    const { issues } = await validate(
      makeDoc({
        abilities: { str: 10, sta: 10, agi: 10, dex: 10, fgt: 10, int: 10, awe: 10, pre: 10 },
      })
    );
    const over = issues.find((issue) => issue.code === 'mam3e-pp-over-budget');
    expect(over?.severity).toBe('error');
    expect(over?.details).toMatchObject({ spent: 160, total: 150, over: 10 });
  });

  it('surfaces the engine-derived PL trait caps as blocking errors', async () => {
    const { issues } = await validate(
      makeDoc({
        powerLevel: 8, // cap = 16
        abilities: { str: 0, sta: 0, agi: 0, dex: 0, fgt: 10, int: 0, awe: 0, pre: 0 },
        skills: { 'close-combat': { rank: 7, total: 0 } },
        powers: [
          {
            id: 'strike',
            name: 'Strike',
            system: 'mam3e',
            source: 'test',
            type: 'attack',
            action: 'standard',
            range: 'close',
            duration: 'instant',
            baseCost: 1,
            perRank: true,
            rank: 5,
            description: '',
            effects: [],
          },
        ],
      })
    );
    const cap = issues.find((issue) => issue.code === 'mam3e-pl-cap-exceeded');
    expect(cap?.severity).toBe('error');
    expect(cap?.message).toContain('Close Attack + Effect');
  });

  it('warns when the total budget deviates from 15 × PL', async () => {
    const { issues } = await validate(
      makeDoc({ powerLevel: 8, powerPoints: { total: 150, spent: emptySpent() } })
    );
    const budget = issues.find((issue) => issue.code === 'mam3e-nonstandard-budget');
    expect(budget?.severity).toBe('warning');
    expect(budget?.details).toMatchObject({ total: 150, expected: 120, powerLevel: 8 });
  });

  it('rejects a non-integer Power Level', async () => {
    const { issues } = await validate(makeDoc({ powerLevel: 0 }));
    expect(codes(issues)).toContain('mam3e-invalid-power-level');
  });

  it('enforces the PL + 10 skill bonus cap', async () => {
    // PL 10 → cap 20. Technology total = 16 ranks + INT 5 = 21 > 20.
    const { issues } = await validate(
      makeDoc({
        abilities: { str: 0, sta: 0, agi: 0, dex: 0, fgt: 0, int: 5, awe: 0, pre: 0 },
        skills: { technology: { rank: 16, total: 0 } },
      })
    );
    const skill = issues.find((issue) => issue.code === 'mam3e-skill-cap-exceeded');
    expect(skill?.severity).toBe('error');
    expect(skill?.details).toMatchObject({ skillId: 'technology', value: 21, limit: 20 });
  });

  it('flags a system-id mismatch', async () => {
    const doc = { ...makeDoc(), systemId: 'dnd-5e-2014' } as CharacterDocument<Mam3eDataModel>;
    const { issues } = await validate(doc);
    expect(codes(issues)).toContain('mam3e-system-mismatch');
  });

  it('stamps the issue source from the validation reason', async () => {
    const { issues } = await validate(makeDoc({ powerLevel: 0 }), { reason: 'ai-draft' });
    const invalid = issues.find((issue) => issue.code === 'mam3e-invalid-power-level');
    expect(invalid?.source).toBe('ai-draft');
  });
});

function emptySpent(): Mam3eDataModel['powerPoints']['spent'] {
  return { abilities: 0, powers: 0, advantages: 0, skills: 0, defenses: 0 };
}
