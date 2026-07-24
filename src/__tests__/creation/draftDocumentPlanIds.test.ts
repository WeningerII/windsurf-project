import { describe, expect, it, vi } from 'vitest';
import {
  buildDocumentFromPlanIds,
  buildWorkingDocumentEnvelope,
  routeIdsThroughPlan,
} from '../../creation/draftDocument';
import type { CreationChoiceStep, CreationPlan } from '../../creation/types';
import type { CharacterDocument, SystemDataModel } from '../../types/core/document';

interface TestModel extends SystemDataModel {
  level: number;
  picks: string[];
}

const createDefaultData = (): TestModel => ({ level: 1, picks: [] });

function planWith(steps: CreationPlan<TestModel>['steps']): CreationPlan<TestModel> {
  return { systemId: 'test-system', steps };
}

function choiceStep(
  id: string,
  optionIds: string[],
  overrides: Partial<{ maxSelections: number; disabled: string[] }> = {}
): CreationChoiceStep<TestModel> {
  return {
    kind: 'choice',
    id,
    title: id,
    optional: true,
    ...(overrides.maxSelections ? { maxSelections: overrides.maxSelections } : {}),
    loadOptions: async () =>
      optionIds.map((optionId) => ({
        id: optionId,
        label: optionId,
        ...(overrides.disabled?.includes(optionId) ? { disabled: true } : {}),
      })),
    apply: async (document: CharacterDocument<TestModel>, selected: string[]) => ({
      ...document,
      system: { ...document.system, picks: [...document.system.picks, ...selected] },
    }),
  };
}

describe('routeIdsThroughPlan — ids find their step by what the step OFFERS', () => {
  it('routes each id to the first step that offers it, respecting maxSelections', async () => {
    const plan = planWith([
      choiceStep('alpha', ['fighter', 'wizard']),
      choiceStep('beta', ['dwarf', 'elf']),
      choiceStep('gamma', ['tough', 'alert', 'lucky'], { maxSelections: 2 }),
    ]);
    const seed = buildWorkingDocumentEnvelope('test-system', createDefaultData(), 'Hero');

    const routing = await routeIdsThroughPlan(plan, seed, [
      'wizard',
      'elf',
      'tough',
      'alert',
      'lucky',
    ]);

    expect(routing.choices).toEqual({
      alpha: ['wizard'],
      beta: ['elf'],
      gamma: ['tough', 'alert'],
    });
    // The third feat exceeded the step's cap: reported, never silently applied.
    expect(routing.unrouted).toEqual(['lucky']);
  });

  it('reports ids no step offers instead of dropping them', async () => {
    const plan = planWith([choiceStep('alpha', ['fighter'])]);
    const seed = buildWorkingDocumentEnvelope('test-system', createDefaultData(), 'Hero');
    const routing = await routeIdsThroughPlan(plan, seed, ['fighter', 'bard-of-nowhere']);
    expect(routing.choices).toEqual({ alpha: ['fighter'] });
    expect(routing.unrouted).toEqual(['bard-of-nowhere']);
  });

  it('reports everything as unrouted for a plan with no choice steps', async () => {
    // Daggerheart's shape today: real pools, no loader-driven creation steps.
    const plan = planWith([]);
    const seed = buildWorkingDocumentEnvelope('test-system', createDefaultData(), 'Hero');
    const routing = await routeIdsThroughPlan(plan, seed, ['a', 'b']);
    expect(routing).toEqual({ choices: {}, unrouted: ['a', 'b'] });
  });

  it('skips disabled options and survives a step whose loader throws', async () => {
    const throwing: CreationChoiceStep<TestModel> = {
      ...choiceStep('broken', ['x']),
      loadOptions: vi.fn(async () => {
        throw new Error('catalog unavailable');
      }),
    };
    const plan = planWith([
      throwing,
      choiceStep('alpha', ['fighter', 'wizard'], { disabled: ['wizard'] }),
    ]);
    const seed = buildWorkingDocumentEnvelope('test-system', createDefaultData(), 'Hero');
    const routing = await routeIdsThroughPlan(plan, seed, ['x', 'wizard', 'fighter']);
    expect(routing.choices).toEqual({ alpha: ['fighter'] });
    expect(routing.unrouted).toEqual(['x', 'wizard']);
  });
});

describe('buildDocumentFromPlanIds — the wizard replay is the apply path', () => {
  it('folds routed ids through the plan’s own applicators', async () => {
    const plan = planWith([
      choiceStep('alpha', ['fighter', 'wizard']),
      choiceStep('beta', ['dwarf']),
    ]);
    const { document, unrouted } = await buildDocumentFromPlanIds(
      plan,
      createDefaultData,
      'Vanguard',
      ['fighter', 'dwarf', 'unknown-thing']
    );
    expect(document.name).toBe('Vanguard');
    expect(document.systemId).toBe('test-system');
    expect(document.system.picks).toEqual(['fighter', 'dwarf']);
    expect(unrouted).toEqual(['unknown-thing']);
  });

  it('builds a valid default-seeded document from an empty id set', async () => {
    const plan = planWith([choiceStep('alpha', ['fighter'])]);
    const { document, unrouted } = await buildDocumentFromPlanIds(
      plan,
      createDefaultData,
      'Blank Slate',
      []
    );
    expect(document.system).toEqual({ level: 1, picks: [] });
    expect(unrouted).toEqual([]);
  });
});
