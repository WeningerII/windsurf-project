import { describe, expect, it } from 'vitest';

import { createD20LegacyValidator } from '../systems/d20-legacy/validation';
import {
  createDefaultDnd35eData,
  type Dnd35eClassLevel,
  type Dnd35eDataModel,
} from '../systems/dnd35e/data-model';
import { loadClassesForSystem, loadSpeciesForSystem } from '../utils/dataLoader';
import type { CharacterDocument } from '../types/core/document';
import type { ValidationIssue } from '../registry/types';

/**
 * MASTER_PLAN parity track: D&D 3.5e and Pathfinder 1e share one d20-legacy
 * validator (mirroring their shared engine/creation orchestrator). It checks level
 * bounds, race + class id resolution against the loader catalog, per-class level
 * bounds, and the multiclass level-sum rule. Parameterized over both systems; the
 * shared Dnd35e-shaped carrier is sound because the validator reads only the common
 * fields and keys the catalog off `document.systemId`.
 */

const SYSTEMS = ['dnd-3.5e', 'pf1e'] as const;

function classLevel(classId: string, level: number): Dnd35eClassLevel {
  return {
    classId,
    level,
    hitDieRolls: [],
    bab: 'full',
    fortSave: 'good',
    refSave: 'poor',
    willSave: 'poor',
    skillPointsPerLevel: 4,
  };
}

function d20Doc(
  systemId: (typeof SYSTEMS)[number],
  mutate?: (data: Dnd35eDataModel) => void
): CharacterDocument<Dnd35eDataModel> {
  const system = createDefaultDnd35eData();
  mutate?.(system);
  return { id: 'd', name: 'Hero', systemId, system, createdAt: new Date(), updatedAt: new Date() };
}

async function validate(
  systemId: (typeof SYSTEMS)[number],
  document: CharacterDocument<Dnd35eDataModel>
): Promise<ValidationIssue[]> {
  const result = await createD20LegacyValidator<Dnd35eDataModel>(systemId).validateDocument(
    document,
    { systemId, reason: 'edit' }
  );
  return result.issues;
}

function codes(issues: ValidationIssue[]): string[] {
  return issues.map((issue) => issue.code);
}

describe('d20 legacy validator', () => {
  for (const SYSTEM_ID of SYSTEMS) {
    describe(SYSTEM_ID, () => {
      it('accepts a legal single-class build', async () => {
        const [cls] = await loadClassesForSystem(SYSTEM_ID);
        const [race] = await loadSpeciesForSystem(SYSTEM_ID);
        const issues = await validate(
          SYSTEM_ID,
          d20Doc(SYSTEM_ID, (data) => {
            data.level = 3;
            data.speciesId = race.id;
            data.classLevels = [classLevel(cls.id, 3)];
          })
        );
        expect(issues).toEqual([]);
      });

      it('warns when there is no class', async () => {
        const issues = await validate(SYSTEM_ID, d20Doc(SYSTEM_ID));
        expect(codes(issues)).toContain('d20-legacy-missing-class');
      });

      it('errors on an unknown class id', async () => {
        const issues = await validate(
          SYSTEM_ID,
          d20Doc(SYSTEM_ID, (data) => {
            data.classLevels = [classLevel('no-such-class', 1)];
          })
        );
        expect(issues).toContainEqual(
          expect.objectContaining({ code: 'd20-legacy-unknown-class', severity: 'error' })
        );
      });

      it('errors on an unknown race id', async () => {
        const [cls] = await loadClassesForSystem(SYSTEM_ID);
        const issues = await validate(
          SYSTEM_ID,
          d20Doc(SYSTEM_ID, (data) => {
            data.level = 1;
            data.speciesId = 'no-such-race';
            data.classLevels = [classLevel(cls.id, 1)];
          })
        );
        expect(issues).toContainEqual(
          expect.objectContaining({ code: 'd20-legacy-unknown-race', severity: 'error' })
        );
      });

      it('warns when class levels do not sum to the character level', async () => {
        const [cls] = await loadClassesForSystem(SYSTEM_ID);
        const issues = await validate(
          SYSTEM_ID,
          d20Doc(SYSTEM_ID, (data) => {
            data.level = 5;
            data.classLevels = [classLevel(cls.id, 2)];
          })
        );
        expect(codes(issues)).toContain('d20-legacy-level-sum-mismatch');
      });

      it('errors on an out-of-range character level', async () => {
        const [cls] = await loadClassesForSystem(SYSTEM_ID);
        const issues = await validate(
          SYSTEM_ID,
          d20Doc(SYSTEM_ID, (data) => {
            data.level = 0;
            data.classLevels = [classLevel(cls.id, 1)];
          })
        );
        expect(codes(issues)).toContain('d20-legacy-invalid-level');
      });

      it('errors (non-recoverable) when the document systemId does not match the validator', async () => {
        // Validate a doc carrying the OTHER d20-legacy systemId against this
        // validator: the mismatch is a hard, non-recoverable error.
        const otherSystemId = SYSTEM_ID === 'dnd-3.5e' ? 'pf1e' : 'dnd-3.5e';
        const issues = await validate(SYSTEM_ID, d20Doc(otherSystemId));
        expect(issues).toContainEqual(
          expect.objectContaining({
            code: 'd20-legacy-system-mismatch',
            severity: 'error',
            path: 'systemId',
            recoverable: false,
          })
        );
      });

      it('errors on an out-of-range per-class level', async () => {
        const [cls] = await loadClassesForSystem(SYSTEM_ID);
        const issues = await validate(
          SYSTEM_ID,
          d20Doc(SYSTEM_ID, (data) => {
            data.level = 21;
            data.classLevels = [classLevel(cls.id, 21)];
          })
        );
        expect(issues).toContainEqual(
          expect.objectContaining({
            code: 'd20-legacy-invalid-class-level',
            severity: 'error',
            path: 'classLevels.0.level',
          })
        );
      });
    });
  }
});
