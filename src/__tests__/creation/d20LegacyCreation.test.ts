import { beforeAll, describe, expect, it } from 'vitest';

import {
  D20_LEGACY_CREATION_STEPS,
  createD20LegacyCreationDraft,
  createD20LegacyCreationOrchestrator,
} from '../../creation/d20LegacyCreation';
import {
  applyD20LegacyCreationSelection,
  defaultD20LegacyCreationDeps,
} from '../../creation/d20LegacyApply';
import type { CreationDraft } from '../../creation/creationDraft';
import { registerAllSystems } from '../../systems';
import { systemRegistry } from '../../registry';
import { loadClassesForSystem, loadSpeciesForSystem } from '../../utils/dataLoader';

/**
 * MASTER_PLAN creation track: ONE d20-legacy orchestrator serves BOTH D&D 3.5e and
 * Pathfinder 1e (shared data model + applicators), exactly as the 5e flow serves
 * 2014 + 2024. A race → class flow (no background), driven by the same shared
 * creator. These tests run the real applicators end to end for both systems.
 */

const D20_SYSTEMS = ['dnd-3.5e', 'pf1e'] as const;

type D20Fields = {
  speciesId?: string;
  classLevels?: Array<{ classId: string; level: number }>;
};
function system(draft: CreationDraft): D20Fields {
  return draft.system as D20Fields;
}

describe('d20 legacy guided creation', () => {
  beforeAll(() => {
    if (!systemRegistry.get('dnd-3.5e')) {
      registerAllSystems();
    }
  });

  it('exposes a race-first flow with a class-level param', () => {
    const orchestrator = createD20LegacyCreationOrchestrator('dnd-3.5e');
    expect(orchestrator.steps.map((step) => step.id)).toEqual([...D20_LEGACY_CREATION_STEPS]);
    expect(orchestrator.steps.find((step) => step.id === 'class')?.params).toEqual([
      { id: 'level', label: 'Level', min: 1, max: 20, defaultValue: 1 },
    ]);
  });

  for (const SYSTEM_ID of D20_SYSTEMS) {
    describe(SYSTEM_ID, () => {
      it('seeds a blank race-first draft', () => {
        const draft = createD20LegacyCreationDraft({ id: `${SYSTEM_ID}-1`, systemId: SYSTEM_ID });
        expect(draft.systemId).toBe(SYSTEM_ID);
        expect(draft.steps).toEqual([...D20_LEGACY_CREATION_STEPS]);
        expect(draft.selections).toEqual({});
      });

      it('applies race and class through the shared applicators', async () => {
        const [race] = await loadSpeciesForSystem(SYSTEM_ID);
        const [cls] = await loadClassesForSystem(SYSTEM_ID);
        let draft = createD20LegacyCreationDraft({ id: `${SYSTEM_ID}-b`, systemId: SYSTEM_ID });

        draft = await applyD20LegacyCreationSelection(draft, { kind: 'race', raceId: race.id });
        expect(system(draft).speciesId).toBe(race.id);

        draft = await applyD20LegacyCreationSelection(draft, {
          kind: 'class',
          classId: cls.id,
          level: 2,
        });
        expect(system(draft).classLevels).toMatchObject([{ classId: cls.id, level: 2 }]);
        expect(draft.selections).toMatchObject({
          speciesId: race.id,
          classId: cls.id,
          classLevel: 2,
        });
      });

      it('re-picking a different class replaces the prior one cleanly', async () => {
        const [a, b] = await loadClassesForSystem(SYSTEM_ID);
        let draft = createD20LegacyCreationDraft({ id: `${SYSTEM_ID}-r`, systemId: SYSTEM_ID });

        draft = await applyD20LegacyCreationSelection(draft, {
          kind: 'class',
          classId: a.id,
          level: 1,
        });
        draft = await applyD20LegacyCreationSelection(draft, {
          kind: 'class',
          classId: b.id,
          level: 1,
        });

        expect(system(draft).classLevels).toHaveLength(1);
        expect(system(draft).classLevels).toMatchObject([{ classId: b.id, level: 1 }]);
      });

      it('reports an unknown race id without mutating the draft', async () => {
        const draft = createD20LegacyCreationDraft({ id: `${SYSTEM_ID}-u`, systemId: SYSTEM_ID });
        const next = await applyD20LegacyCreationSelection(draft, {
          kind: 'race',
          raceId: 'no-such-race',
        });

        expect(next.issues).toEqual([
          expect.objectContaining({ code: 'creation-unknown-choice', severity: 'error' }),
        ]);
        expect(next.selections).toEqual({});
      });

      it('consults the injected loader rather than the real catalog', async () => {
        const [realFirst] = await loadSpeciesForSystem(SYSTEM_ID);
        const draft = createD20LegacyCreationDraft({ id: `${SYSTEM_ID}-i`, systemId: SYSTEM_ID });

        const next = await applyD20LegacyCreationSelection(
          draft,
          { kind: 'race', raceId: realFirst.id },
          { ...defaultD20LegacyCreationDeps, loadRaces: async () => [] }
        );

        expect(next.issues).toEqual([expect.objectContaining({ code: 'creation-unknown-choice' })]);
      });

      it('orchestrator maps options and reflects a choice in selection + summary', async () => {
        const orchestrator = createD20LegacyCreationOrchestrator(SYSTEM_ID);
        let draft = orchestrator.createDraft({ id: `${SYSTEM_ID}-o` });
        const races = await loadSpeciesForSystem(SYSTEM_ID);

        const options = await orchestrator.loadOptions(draft, 'race');
        expect(options).toHaveLength(races.length);
        expect(options[0]).toMatchObject({ id: races[0].id, name: races[0].name });

        draft = await orchestrator.applyOption(draft, 'race', races[0].id);
        expect(orchestrator.selectedOptionId(draft, 'race')).toBe(races[0].id);
        expect(orchestrator.summary(draft)).toContainEqual({ label: 'Race', value: races[0].name });
      });
    });
  }
});
