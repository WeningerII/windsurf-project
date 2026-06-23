import { beforeAll, describe, expect, it } from 'vitest';

import {
  DAGGERHEART_CREATION_STEPS,
  createDaggerheartCreationDraft,
  createDaggerheartCreationOrchestrator,
} from '../../creation/daggerheartCreation';
import {
  applyDaggerheartCreationSelection,
  defaultDaggerheartCreationDeps,
} from '../../creation/daggerheartApply';
import type { CreationDraft } from '../../creation/creationDraft';
import { registerAllSystems } from '../../systems';
import { systemRegistry } from '../../registry';
import {
  loadDaggerheartAncestriesForSystem,
  loadDaggerheartClassesForSystem,
  loadDaggerheartCommunitiesForSystem,
} from '../../utils/dataLoader';
import { getDaggerheartAncestryAdjustments } from '../../utils/daggerheartDerived';

/**
 * MASTER_PLAN creation track: Daggerheart registers the agnostic
 * CreationOrchestrator — a class → ancestry → community flow (no level), proving
 * the contract once more against a data model that keys choices by NAME, not id.
 * These tests run the real Daggerheart applicators end to end.
 */

const SYSTEM_ID = 'daggerheart';

// Daggerheart stores chosen options by NAME on the data model.
type DaggerheartFields = { class?: string; heritage?: string; community?: string };
function system(draft: CreationDraft): DaggerheartFields {
  return draft.system as DaggerheartFields;
}

describe('Daggerheart guided creation', () => {
  beforeAll(() => {
    if (!systemRegistry.get(SYSTEM_ID)) {
      registerAllSystems();
    }
  });

  it('exposes a class → ancestry → community flow with no params', () => {
    const orchestrator = createDaggerheartCreationOrchestrator(SYSTEM_ID);
    expect(orchestrator.steps.map((step) => step.id)).toEqual([...DAGGERHEART_CREATION_STEPS]);
    expect(orchestrator.steps.every((step) => !step.params)).toBe(true);
  });

  it('seeds a blank class-first draft', () => {
    const draft = createDaggerheartCreationDraft({ id: 'dh-1', systemId: SYSTEM_ID });
    expect(draft.systemId).toBe(SYSTEM_ID);
    expect(draft.steps).toEqual([...DAGGERHEART_CREATION_STEPS]);
    expect(draft.selections).toEqual({});
  });

  it('applies class, ancestry, and community through the shared templates (by name)', async () => {
    const [cls] = await loadDaggerheartClassesForSystem(SYSTEM_ID);
    const [ancestry] = await loadDaggerheartAncestriesForSystem(SYSTEM_ID);
    const [community] = await loadDaggerheartCommunitiesForSystem(SYSTEM_ID);
    let draft = createDaggerheartCreationDraft({ id: 'dh-build', systemId: SYSTEM_ID });

    draft = await applyDaggerheartCreationSelection(draft, { kind: 'class', classId: cls.id });
    expect(system(draft).class).toBe(cls.name);

    draft = await applyDaggerheartCreationSelection(draft, {
      kind: 'ancestry',
      ancestryId: ancestry.id,
    });
    expect(system(draft).heritage).toBe(ancestry.name);

    draft = await applyDaggerheartCreationSelection(draft, {
      kind: 'community',
      communityId: community.id,
    });
    expect(system(draft).community).toBe(community.name);

    expect(draft.selections).toMatchObject({
      classId: cls.id,
      ancestryId: ancestry.id,
      communityId: community.id,
    });
  });

  it('reports an unknown class id as a recoverable error without mutating the draft', async () => {
    const draft = createDaggerheartCreationDraft({ id: 'dh-unknown', systemId: SYSTEM_ID });
    const next = await applyDaggerheartCreationSelection(draft, {
      kind: 'class',
      classId: 'no-such-class',
    });

    expect(next.issues).toEqual([
      expect.objectContaining({ code: 'creation-unknown-choice', severity: 'error' }),
    ]);
    expect(next.selections).toEqual({});
  });

  it('consults the injected loader rather than the real catalog', async () => {
    const [realFirst] = await loadDaggerheartClassesForSystem(SYSTEM_ID);
    const draft = createDaggerheartCreationDraft({ id: 'dh-inj', systemId: SYSTEM_ID });

    const next = await applyDaggerheartCreationSelection(
      draft,
      { kind: 'class', classId: realFirst.id },
      { ...defaultDaggerheartCreationDeps, loadClasses: async () => [] }
    );

    expect(next.issues).toEqual([expect.objectContaining({ code: 'creation-unknown-choice' })]);
  });

  it('surfaces the registered validator live during creation', async () => {
    // The registry now routes Daggerheart through its validator, so an in-progress
    // draft gets live legality feedback (parity with 5e): traits are assigned on
    // the sheet, so a freshly built draft warns they are unassigned.
    const [cls] = await loadDaggerheartClassesForSystem(SYSTEM_ID);
    let draft = createDaggerheartCreationDraft({ id: 'dh-validate', systemId: SYSTEM_ID });
    draft = await applyDaggerheartCreationSelection(draft, { kind: 'class', classId: cls.id });

    const issueCodes = draft.issues.map((issue) => issue.code);
    expect(issueCodes).toContain('daggerheart-traits-unassigned');
    // Choosing a real class clears the missing-class error.
    expect(issueCodes).not.toContain('daggerheart-missing-class');
  });

  it('keeps starting Evasion/HP correct regardless of class/ancestry pick order', async () => {
    // Class and ancestry both feed starting Evasion/HP, so each apply must pass the
    // other. Pick the ancestry with the largest adjustment so the cross-reference
    // genuinely matters, then prove both pick orders converge on the same values.
    const [cls] = await loadDaggerheartClassesForSystem(SYSTEM_ID);
    const ancestries = await loadDaggerheartAncestriesForSystem(SYSTEM_ID);
    const ancestry = ancestries.reduce((best, candidate) => {
      const score = (adj: { evasion: number; hitPoints: number }) =>
        Math.abs(adj.evasion) + Math.abs(adj.hitPoints);
      return score(getDaggerheartAncestryAdjustments(candidate)) >
        score(getDaggerheartAncestryAdjustments(best))
        ? candidate
        : best;
    }, ancestries[0]);
    const adj = getDaggerheartAncestryAdjustments(ancestry);
    const expectedEvasion = cls.startingEvasion + adj.evasion;
    const expectedHp = cls.startingHitPoints + adj.hitPoints;
    type Derived = { evasion: number; hitPoints: { current: number; max: number } };

    let classFirst = createDaggerheartCreationDraft({ id: 'dh-order-a', systemId: SYSTEM_ID });
    classFirst = await applyDaggerheartCreationSelection(classFirst, {
      kind: 'class',
      classId: cls.id,
    });
    classFirst = await applyDaggerheartCreationSelection(classFirst, {
      kind: 'ancestry',
      ancestryId: ancestry.id,
    });
    expect((classFirst.system as Derived).evasion).toBe(expectedEvasion);
    expect((classFirst.system as Derived).hitPoints.max).toBe(expectedHp);

    let ancestryFirst = createDaggerheartCreationDraft({ id: 'dh-order-b', systemId: SYSTEM_ID });
    ancestryFirst = await applyDaggerheartCreationSelection(ancestryFirst, {
      kind: 'ancestry',
      ancestryId: ancestry.id,
    });
    ancestryFirst = await applyDaggerheartCreationSelection(ancestryFirst, {
      kind: 'class',
      classId: cls.id,
    });
    expect((ancestryFirst.system as Derived).evasion).toBe(expectedEvasion);
    expect((ancestryFirst.system as Derived).hitPoints.max).toBe(expectedHp);
  });

  it('orchestrator maps options and reflects a choice in selection + summary', async () => {
    const orchestrator = createDaggerheartCreationOrchestrator(SYSTEM_ID);
    let draft = orchestrator.createDraft({ id: 'dh-orch' });
    const classes = await loadDaggerheartClassesForSystem(SYSTEM_ID);

    const options = await orchestrator.loadOptions(draft, 'class');
    expect(options).toHaveLength(classes.length);
    expect(options[0]).toMatchObject({ id: classes[0].id, name: classes[0].name });

    draft = await orchestrator.applyOption(draft, 'class', classes[0].id);
    expect(orchestrator.selectedOptionId(draft, 'class')).toBe(classes[0].id);
    expect(orchestrator.summary(draft)).toContainEqual({ label: 'Class', value: classes[0].name });

    expect(await orchestrator.loadOptions(draft, 'review')).toEqual([]);
  });
});
