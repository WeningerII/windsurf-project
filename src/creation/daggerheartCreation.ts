/**
 * Daggerheart character-creation orchestrator — the fourth (and final structural)
 * consumer of the agnostic {@link CreationOrchestrator}: a class → ancestry →
 * community flow with NO level param (Daggerheart characters start at level 1),
 * rendered by the same shared `CharacterCreator` unchanged. Proves the contract
 * once more against a different data model that keys choices by NAME, not id.
 *
 * Light by design: imported eagerly by the Daggerheart `SystemDefinition`, so the
 * applicator-dependent core lives in `./daggerheartApply` and is `import()`ed on
 * demand to keep the heavy templates out of the first-paint shell.
 */
import type { DaggerheartClass } from '../types/daggerheart';
import type { GameSystemId } from '../types/game-systems';
import { systemRegistry } from '../registry';
import {
  loadDaggerheartAncestriesForSystem,
  loadDaggerheartClassesForSystem,
  loadDaggerheartCommunitiesForSystem,
} from '../utils/dataLoader';
import { createCreationDraft, type CreationDraft } from './creationDraft';
import type {
  CreationOption,
  CreationOrchestrator,
  CreationStep,
  CreationSummaryRow,
} from './types';

/** The ordered Daggerheart creation steps (class-first; no background). */
export const DAGGERHEART_CREATION_STEPS = ['class', 'ancestry', 'community', 'review'] as const;

/** Start a Daggerheart creation draft seeded from the registry's blank data. */
export function createDaggerheartCreationDraft(params: {
  id: string;
  systemId: string;
  now?: Date;
}): CreationDraft {
  const definition = systemRegistry.get(params.systemId);
  if (!definition) {
    throw new Error(`No registered system '${params.systemId}' for guided creation.`);
  }
  return createCreationDraft({
    id: params.id,
    systemId: params.systemId,
    steps: [...DAGGERHEART_CREATION_STEPS],
    system: definition.createDefaultData(),
    now: params.now,
  });
}

const DAGGERHEART_STEPS: readonly CreationStep[] = [
  { id: 'class', label: 'Class' },
  { id: 'ancestry', label: 'Ancestry' },
  { id: 'community', label: 'Community' },
  { id: 'review', label: 'Review' },
];

function classSubtitle(entry: DaggerheartClass): string {
  return `Evasion ${entry.startingEvasion} · HP ${entry.startingHitPoints}`;
}

function stringSelection(draft: CreationDraft, key: string): string | null {
  const value = draft.selections[key];
  return typeof value === 'string' ? value : null;
}

function toOptions(
  entries: Array<{ id: string; name: string; source: string }>,
  subtitle?: (entry: { id: string; name: string; source: string }) => string
): CreationOption[] {
  return entries.map((entry) => ({
    id: entry.id,
    name: entry.name,
    source: entry.source,
    subtitle: subtitle?.(entry),
  }));
}

/**
 * Build the Daggerheart orchestrator. Attached to the Daggerheart
 * {@link SystemDefinition} so the shared creator resolves it via the registry.
 */
export function createDaggerheartCreationOrchestrator(systemId: string): CreationOrchestrator {
  return {
    steps: DAGGERHEART_STEPS,
    createDraft: ({ id, now }) => createDaggerheartCreationDraft({ id, systemId, now }),
    loadOptions: async (draft, stepId): Promise<CreationOption[]> => {
      const id = draft.systemId as GameSystemId;
      if (stepId === 'class') {
        const classes = await loadDaggerheartClassesForSystem(id);
        return classes.map((entry: DaggerheartClass) => ({
          id: entry.id,
          name: entry.name,
          source: entry.source,
          subtitle: classSubtitle(entry),
        }));
      }
      if (stepId === 'ancestry') {
        return toOptions(await loadDaggerheartAncestriesForSystem(id));
      }
      if (stepId === 'community') {
        return toOptions(await loadDaggerheartCommunitiesForSystem(id));
      }
      return [];
    },
    selectedOptionId: (draft, stepId) => {
      if (stepId === 'class') return stringSelection(draft, 'classId');
      if (stepId === 'ancestry') return stringSelection(draft, 'ancestryId');
      if (stepId === 'community') return stringSelection(draft, 'communityId');
      return null;
    },
    paramValue: () => 0,
    applyOption: async (draft, stepId, optionId) => {
      // Loaded on demand so the heavy template applicators stay out of the shell.
      const { applyDaggerheartCreationSelection } = await import('./daggerheartApply');
      if (stepId === 'class') {
        return applyDaggerheartCreationSelection(draft, { kind: 'class', classId: optionId });
      }
      if (stepId === 'ancestry') {
        return applyDaggerheartCreationSelection(draft, { kind: 'ancestry', ancestryId: optionId });
      }
      if (stepId === 'community') {
        return applyDaggerheartCreationSelection(draft, {
          kind: 'community',
          communityId: optionId,
        });
      }
      return draft;
    },
    summary: (draft): CreationSummaryRow[] => [
      { label: 'Class', value: stringSelection(draft, 'className') },
      { label: 'Ancestry', value: stringSelection(draft, 'ancestryName') },
      { label: 'Community', value: stringSelection(draft, 'communityName') },
    ],
  };
}
