import { beforeAll, describe, expect, it } from 'vitest';

import {
  DND5E_CREATION_STEPS,
  applyDnd5eCreationSelection,
  createDnd5eCreationDraft,
  defaultDnd5eCreationDeps,
} from '../../creation/dnd5eCreation';
import type { CreationDraft } from '../../creation/creationDraft';
import { registerAllSystems } from '../../systems';
import { systemRegistry } from '../../registry';
import {
  loadBackgroundsForSystem,
  loadClassesForSystem,
  loadSpeciesForSystem,
} from '../../utils/dataLoader';
import type { Dnd5eLikeDataModel } from '../../systems/dnd5e/shared/dnd5eSheetShared';

/**
 * PHASE 4B (MASTER_PLAN): the async "apply a choice + validate" layer of guided
 * creation. It must drive the EXACT shared template applicators manual editing
 * uses (no parallel creation rules) and fold the result + validator issues back
 * into the pure draft. These tests exercise the real applicators/validator end to
 * end and prove the injectable seams independently.
 */

const SYSTEM_ID = 'dnd-5e-2024';

/** The draft's working data is 5e-shaped; the union members all carry these fields. */
function system(draft: CreationDraft): Dnd5eLikeDataModel {
  return draft.system as Dnd5eLikeDataModel;
}

describe('D&D 5e guided creation', () => {
  beforeAll(() => {
    if (!systemRegistry.get(SYSTEM_ID)) {
      registerAllSystems();
    }
  });

  describe('createDnd5eCreationDraft', () => {
    it('seeds a blank 5e draft with the ordered creation steps', () => {
      const draft = createDnd5eCreationDraft({ id: 'd1', systemId: SYSTEM_ID });
      expect(draft.systemId).toBe(SYSTEM_ID);
      expect(draft.steps).toEqual([...DND5E_CREATION_STEPS]);
      expect(draft.stepIndex).toBe(0);
      expect(draft.selections).toEqual({});
      expect(draft.issues).toEqual([]);
      expect(system(draft).classLevels ?? []).toEqual([]);
    });

    it('throws for an unregistered system', () => {
      expect(() => createDnd5eCreationDraft({ id: 'x', systemId: 'not-a-system' })).toThrow(
        /not-a-system/
      );
    });
  });

  describe('applyDnd5eCreationSelection — real applicators + validator', () => {
    it('applies a class onto the draft and records the selection', async () => {
      const [firstClass] = await loadClassesForSystem(SYSTEM_ID);
      const draft = createDnd5eCreationDraft({ id: 'd-class', systemId: SYSTEM_ID });

      const next = await applyDnd5eCreationSelection(draft, {
        kind: 'class',
        classId: firstClass.id,
        level: 3,
      });

      expect(system(next).classLevels).toMatchObject([{ classId: firstClass.id, level: 3 }]);
      expect(next.selections).toMatchObject({ classId: firstClass.id, classLevel: 3 });
    });

    it('applies a species and a background through the shared templates', async () => {
      const [firstSpecies] = await loadSpeciesForSystem(SYSTEM_ID);
      const [firstBackground] = await loadBackgroundsForSystem(SYSTEM_ID);
      let draft = createDnd5eCreationDraft({ id: 'd-sb', systemId: SYSTEM_ID });

      draft = await applyDnd5eCreationSelection(draft, {
        kind: 'species',
        speciesId: firstSpecies.id,
      });
      expect(system(draft).speciesId).toBe(firstSpecies.id);

      draft = await applyDnd5eCreationSelection(draft, {
        kind: 'background',
        backgroundId: firstBackground.id,
      });
      expect(system(draft).backgroundId).toBe(firstBackground.id);
      expect(draft.selections).toMatchObject({
        speciesId: firstSpecies.id,
        backgroundId: firstBackground.id,
      });
    });

    it('re-picking a different class replaces the prior one cleanly (no accidental multiclass)', async () => {
      const [a, b] = await loadClassesForSystem(SYSTEM_ID);
      let draft = createDnd5eCreationDraft({ id: 'd-replace', systemId: SYSTEM_ID });

      draft = await applyDnd5eCreationSelection(draft, { kind: 'class', classId: a.id, level: 2 });
      draft = await applyDnd5eCreationSelection(draft, { kind: 'class', classId: b.id, level: 2 });

      expect(system(draft).classLevels).toHaveLength(1);
      expect(system(draft).classLevels).toMatchObject([{ classId: b.id, level: 2 }]);
    });

    it('re-picking the same class updates its level without duplicating it', async () => {
      const [first] = await loadClassesForSystem(SYSTEM_ID);
      let draft = createDnd5eCreationDraft({ id: 'd-same', systemId: SYSTEM_ID });

      draft = await applyDnd5eCreationSelection(draft, {
        kind: 'class',
        classId: first.id,
        level: 1,
      });
      draft = await applyDnd5eCreationSelection(draft, {
        kind: 'class',
        classId: first.id,
        level: 5,
      });

      expect(system(draft).classLevels).toHaveLength(1);
      expect(system(draft).classLevels).toMatchObject([{ classId: first.id, level: 5 }]);
    });
  });

  describe('unknown choices', () => {
    it('reports an unknown class id as a recoverable error without mutating the draft', async () => {
      const draft = createDnd5eCreationDraft({ id: 'd-unknown', systemId: SYSTEM_ID });
      const before = system(draft).classLevels ?? [];

      const next = await applyDnd5eCreationSelection(draft, {
        kind: 'class',
        classId: 'no-such-class',
        level: 1,
      });

      expect(next.issues).toEqual([
        expect.objectContaining({ code: 'creation-unknown-choice', severity: 'error' }),
      ]);
      expect(system(next).classLevels ?? []).toEqual(before);
      expect(next.selections).toEqual({}); // selection not recorded
    });
  });

  describe('injectable dependencies', () => {
    it('consults the injected loader rather than the real catalog', async () => {
      const [realFirst] = await loadClassesForSystem(SYSTEM_ID);
      const draft = createDnd5eCreationDraft({ id: 'd-inj-loader', systemId: SYSTEM_ID });

      // The real catalog HAS this class; an empty injected loader does not, so the
      // orchestrator must report it unknown — proving the injected seam is used.
      const next = await applyDnd5eCreationSelection(
        draft,
        { kind: 'class', classId: realFirst.id, level: 1 },
        { ...defaultDnd5eCreationDeps, loadClasses: async () => [] }
      );

      expect(next.issues).toEqual([expect.objectContaining({ code: 'creation-unknown-choice' })]);
    });

    it("absorbs the injected validator's issues onto the draft", async () => {
      const [realFirst] = await loadClassesForSystem(SYSTEM_ID);
      const sentinel = {
        code: 'sentinel',
        message: 'from the injected validator',
        severity: 'warning',
      } as const;
      const draft = createDnd5eCreationDraft({ id: 'd-inj-validator', systemId: SYSTEM_ID });

      const next = await applyDnd5eCreationSelection(
        draft,
        { kind: 'class', classId: realFirst.id, level: 1 },
        { ...defaultDnd5eCreationDeps, validate: async () => ({ issues: [sentinel] }) }
      );

      expect(next.issues).toEqual([sentinel]);
      expect(system(next).classLevels).toMatchObject([{ classId: realFirst.id, level: 1 }]);
    });
  });
});
