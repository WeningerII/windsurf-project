import { describe, expect, it } from 'vitest';

import {
  canFinalize,
  createCreationDraft,
  finalizeCreationDraft,
  goToStep,
  isOnLastStep,
  nextStep,
  parseCreationDraft,
  prevStep,
  resetCreationDraft,
  serializeCreationDraft,
  setDraftName,
  setSelection,
  withResolvedSystem,
  type CreationDraft,
} from '../../creation/creationDraft';
import type { ValidationIssue } from '../../registry/types';

/**
 * PHASE 4A (MASTER_PLAN): the deterministic guided-creation shell. A pure,
 * system-agnostic draft backbone — step navigation, selection bookkeeping,
 * resumable serialisation, and finalisation into a normal CharacterDocument. No
 * React, no storage, no per-system rules.
 */

const STEPS = ['class', 'species', 'background', 'abilities', 'review'];

function draft(over: Partial<CreationDraft> = {}): CreationDraft {
  return {
    ...createCreationDraft({
      id: 'draft-1',
      systemId: 'dnd-5e-2024',
      steps: STEPS,
      system: { classLevels: [] },
      now: new Date('2026-06-22T00:00:00.000Z'),
    }),
    ...over,
  };
}

const errorIssue: ValidationIssue = { code: 'x', message: 'bad', severity: 'error' };
const warnIssue: ValidationIssue = { code: 'y', message: 'meh', severity: 'warning' };

describe('createCreationDraft', () => {
  it('seeds a blank draft at the first step with a default name', () => {
    const d = createCreationDraft({
      id: 'd',
      systemId: 'dnd-5e-2024',
      steps: STEPS,
      system: { classLevels: [] },
    });
    expect(d).toMatchObject({
      id: 'd',
      systemId: 'dnd-5e-2024',
      name: 'New Character',
      stepIndex: 0,
    });
    expect(d.selections).toEqual({});
    expect(d.issues).toEqual([]);
  });
});

describe('step navigation', () => {
  it('advances and retreats, clamped to the step range', () => {
    let d = draft();
    expect(d.stepIndex).toBe(0);
    d = prevStep(d); // clamped at 0
    expect(d.stepIndex).toBe(0);
    d = nextStep(nextStep(d));
    expect(d.stepIndex).toBe(2);
    d = goToStep(d, 99); // clamped to last
    expect(d.stepIndex).toBe(STEPS.length - 1);
    expect(isOnLastStep(d)).toBe(true);
    d = nextStep(d); // already last → stays
    expect(d.stepIndex).toBe(STEPS.length - 1);
  });
});

describe('selections, name, resolved system', () => {
  it('records selections and name immutably', () => {
    const d = draft();
    const named = setDraftName(setSelection(d, 'classId', 'wizard'), 'Mordenkainen');
    expect(named.selections).toEqual({ classId: 'wizard' });
    expect(named.name).toBe('Mordenkainen');
    expect(d.selections).toEqual({}); // original untouched
  });

  it('absorbs the orchestrator result (system data + issues)', () => {
    const d = withResolvedSystem(draft(), { classLevels: [{ classId: 'wizard', level: 3 }] }, [
      warnIssue,
    ]);
    expect(d.system).toEqual({ classLevels: [{ classId: 'wizard', level: 3 }] });
    expect(d.issues).toEqual([warnIssue]);
  });

  it('resets to a fresh blank system at step 0', () => {
    const dirty = withResolvedSystem(goToStep(setSelection(draft(), 'classId', 'x'), 3), { a: 1 }, [
      errorIssue,
    ]);
    const reset = resetCreationDraft(dirty, { classLevels: [] });
    expect(reset).toMatchObject({
      stepIndex: 0,
      selections: {},
      issues: [],
      system: { classLevels: [] },
    });
    expect(reset.id).toBe(dirty.id); // identity preserved
  });
});

describe('canFinalize / finalizeCreationDraft', () => {
  it('blocks finalisation only on error-severity issues', () => {
    expect(canFinalize(draft({ issues: [] }))).toBe(true);
    expect(canFinalize(draft({ issues: [warnIssue] }))).toBe(true);
    expect(canFinalize(draft({ issues: [errorIssue] }))).toBe(false);
  });

  it('emits a normal CharacterDocument with the draft id/system and a fresh envelope', () => {
    const now = new Date('2026-07-01T12:00:00.000Z');
    const d = setDraftName(
      withResolvedSystem(draft(), { classLevels: [{ classId: 'wizard', level: 1 }] }, []),
      '  Astra  '
    );
    const doc = finalizeCreationDraft(d, { now, version: 2 });
    expect(doc).toEqual({
      id: 'draft-1',
      name: 'Astra',
      systemId: 'dnd-5e-2024',
      system: { classLevels: [{ classId: 'wizard', level: 1 }] },
      createdAt: now,
      updatedAt: now,
      version: 2,
    });
  });
});

describe('serialize / parse', () => {
  it('round-trips a draft through JSON', () => {
    const d = withResolvedSystem(setSelection(draft(), 'classId', 'wizard'), { classLevels: [] }, [
      warnIssue,
    ]);
    const parsed = parseCreationDraft(JSON.parse(serializeCreationDraft(d)));
    expect(parsed).toEqual(d);
  });

  it('drops a structurally invalid draft', () => {
    expect(parseCreationDraft(null)).toBeNull();
    expect(parseCreationDraft({ systemId: 'x', steps: STEPS, system: {} })).toBeNull(); // no id
    expect(parseCreationDraft({ id: 'd', systemId: 'x', steps: [], system: {} })).toBeNull(); // empty steps
    expect(parseCreationDraft({ id: 'd', systemId: 'x', steps: STEPS, system: 5 })).toBeNull(); // system not object
  });

  it('coerces soft fields and clamps a corrupt step index', () => {
    const parsed = parseCreationDraft({
      id: 'd',
      systemId: 'dnd-5e-2024',
      steps: STEPS,
      system: { classLevels: [] },
      stepIndex: 999,
      name: '',
      selections: 'nope',
      issues: [errorIssue, { code: 'z' }, 'garbage'],
    });
    expect(parsed).not.toBeNull();
    expect(parsed!.stepIndex).toBe(STEPS.length - 1);
    expect(parsed!.name).toBe('New Character');
    expect(parsed!.selections).toEqual({});
    expect(parsed!.issues).toEqual([errorIssue]); // malformed issue entries dropped
  });
});
