import { beforeAll, describe, expect, it } from 'vitest';

import {
  PF2E_CREATION_STEPS,
  createPf2eCreationDraft,
  createPf2eCreationOrchestrator,
} from '../../creation/pf2eCreation';
import { applyPf2eCreationSelection, defaultPf2eCreationDeps } from '../../creation/pf2eApply';
import type { CreationDraft } from '../../creation/creationDraft';
import { registerAllSystems } from '../../systems';
import { systemRegistry } from '../../registry';
import {
  loadClassesForSystem,
  loadPf2eBackgroundsForSystem,
  loadSpeciesForSystem,
} from '../../utils/dataLoader';

/**
 * MASTER_PLAN creation track: PF2e is the SECOND system to register the agnostic
 * CreationOrchestrator, proving the contract generalises across a different data
 * model, a different step ORDER (ancestry-first), and a different backgrounds
 * loader. These tests exercise the real PF2e applicators end to end.
 */

const SYSTEM_ID = 'pf2e';

type Pf2eSelectionFields = { ancestryId?: string; backgroundId?: string; classId?: string };
function system(draft: CreationDraft): Pf2eSelectionFields {
  return draft.system as Pf2eSelectionFields;
}

describe('Pathfinder 2e guided creation', () => {
  beforeAll(() => {
    if (!systemRegistry.get(SYSTEM_ID)) {
      registerAllSystems();
    }
  });

  describe('createPf2eCreationDraft', () => {
    it('seeds a blank PF2e draft with ancestry-first steps', () => {
      const draft = createPf2eCreationDraft({ id: 'p1', systemId: SYSTEM_ID });
      expect(draft.systemId).toBe(SYSTEM_ID);
      expect(draft.steps).toEqual([...PF2E_CREATION_STEPS]);
      expect(draft.stepIndex).toBe(0);
      expect(draft.selections).toEqual({});
    });
  });

  describe('applyPf2eCreationSelection — real applicators', () => {
    it('applies ancestry, background, and class through the shared templates', async () => {
      const [ancestry] = await loadSpeciesForSystem(SYSTEM_ID);
      const [background] = await loadPf2eBackgroundsForSystem(SYSTEM_ID);
      const [cls] = await loadClassesForSystem(SYSTEM_ID);
      let draft = createPf2eCreationDraft({ id: 'p-build', systemId: SYSTEM_ID });

      draft = await applyPf2eCreationSelection(draft, {
        kind: 'ancestry',
        ancestryId: ancestry.id,
      });
      expect(system(draft).ancestryId).toBe(ancestry.id);

      draft = await applyPf2eCreationSelection(draft, {
        kind: 'background',
        backgroundId: background.id,
      });
      expect(system(draft).backgroundId).toBe(background.id);

      draft = await applyPf2eCreationSelection(draft, { kind: 'class', classId: cls.id, level: 1 });
      expect(system(draft).classId).toBe(cls.id);

      expect(draft.selections).toMatchObject({
        ancestryId: ancestry.id,
        backgroundId: background.id,
        classId: cls.id,
        classLevel: 1,
      });
    });

    it('reports an unknown ancestry id as a recoverable error without mutating the draft', async () => {
      const draft = createPf2eCreationDraft({ id: 'p-unknown', systemId: SYSTEM_ID });
      const next = await applyPf2eCreationSelection(draft, {
        kind: 'ancestry',
        ancestryId: 'no-such-ancestry',
      });

      expect(next.issues).toEqual([
        expect.objectContaining({ code: 'creation-unknown-choice', severity: 'error' }),
      ]);
      expect(next.selections).toEqual({});
    });

    it('consults the injected loader rather than the real catalog', async () => {
      const [realFirst] = await loadSpeciesForSystem(SYSTEM_ID);
      const draft = createPf2eCreationDraft({ id: 'p-inj', systemId: SYSTEM_ID });

      const next = await applyPf2eCreationSelection(
        draft,
        { kind: 'ancestry', ancestryId: realFirst.id },
        { ...defaultPf2eCreationDeps, loadAncestries: async () => [] }
      );

      expect(next.issues).toEqual([expect.objectContaining({ code: 'creation-unknown-choice' })]);
    });
  });

  describe('agnostic CreationOrchestrator wrapper', () => {
    it('exposes ancestry-first steps with a class-level param', () => {
      const orchestrator = createPf2eCreationOrchestrator(SYSTEM_ID);
      expect(orchestrator.steps.map((step) => step.id)).toEqual([...PF2E_CREATION_STEPS]);
      expect(orchestrator.steps.find((step) => step.id === 'class')?.params).toEqual([
        { id: 'level', label: 'Level', min: 1, max: 20, defaultValue: 1 },
      ]);
    });

    it('maps loader-backed options and applies a choice reflected in selection + summary', async () => {
      const orchestrator = createPf2eCreationOrchestrator(SYSTEM_ID);
      let draft = orchestrator.createDraft({ id: 'p-orch' });
      const ancestries = await loadSpeciesForSystem(SYSTEM_ID);

      const options = await orchestrator.loadOptions(draft, 'ancestry');
      expect(options).toHaveLength(ancestries.length);
      expect(options[0]).toMatchObject({ id: ancestries[0].id, name: ancestries[0].name });

      draft = await orchestrator.applyOption(draft, 'ancestry', ancestries[0].id);
      expect(orchestrator.selectedOptionId(draft, 'ancestry')).toBe(ancestries[0].id);
      expect(orchestrator.summary(draft)).toContainEqual({
        label: 'Ancestry',
        value: ancestries[0].name,
      });

      expect(await orchestrator.loadOptions(draft, 'review')).toEqual([]);
    });
  });
});
