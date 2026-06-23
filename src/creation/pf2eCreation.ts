/**
 * Pathfinder 2e character-creation orchestrator — the SECOND system to register
 * the agnostic {@link CreationOrchestrator} contract, proving the shared
 * `CharacterCreator` UI generalises beyond 5e: a different data model
 * (`Pf2eDataModel`), a different step order (ancestry → background → class), and a
 * different backgrounds loader (`loadPf2eBackgroundsForSystem`) — with no change
 * to the UI.
 *
 * Light by design: imported eagerly by the PF2e `SystemDefinition`, so it must NOT
 * statically pull in the heavy templates. The applicator-dependent "apply a choice
 * + validate" core lives in `./pf2eApply` and is `import()`ed on demand.
 */
import type { CharacterClass } from '../types/character-options/classes';
import type { Species } from '../types/character-options/species';
import type { Pf2eBackgroundDefinition } from '../types/character-options/pf2eBackgrounds';
import type { GameSystemId } from '../types/game-systems';
import { systemRegistry } from '../registry';
import {
  loadClassesForSystem,
  loadPf2eBackgroundsForSystem,
  loadSpeciesForSystem,
} from '../utils/dataLoader';
import { createCreationDraft, type CreationDraft } from './creationDraft';
import type {
  CreationOption,
  CreationOrchestrator,
  CreationStep,
  CreationSummaryRow,
} from './types';

/** The ordered PF2e creation steps (ancestry-first, the PF2e convention). */
export const PF2E_CREATION_STEPS = ['ancestry', 'background', 'class', 'review'] as const;

/** Start a PF2e creation draft seeded from the registry's blank data + PF2e steps. */
export function createPf2eCreationDraft(params: {
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
    steps: [...PF2E_CREATION_STEPS],
    system: definition.createDefaultData(),
    now: params.now,
  });
}

const MIN_CLASS_LEVEL = 1;
const MAX_CLASS_LEVEL = 20;

const PF2E_STEPS: readonly CreationStep[] = [
  { id: 'ancestry', label: 'Ancestry' },
  { id: 'background', label: 'Background' },
  {
    id: 'class',
    label: 'Class',
    params: [
      { id: 'level', label: 'Level', min: MIN_CLASS_LEVEL, max: MAX_CLASS_LEVEL, defaultValue: 1 },
    ],
  },
  { id: 'review', label: 'Review' },
];

function ancestrySubtitle(entry: Species): string {
  return `Size ${entry.size} · Speed ${entry.speed} ft`;
}

function backgroundSubtitle(entry: Pf2eBackgroundDefinition): string {
  return typeof entry.skillTraining === 'string' ? `Trained: ${entry.skillTraining}` : '';
}

function classSubtitle(entry: CharacterClass): string {
  return entry.primaryAbility?.length
    ? `Key ${entry.primaryAbility.map((ability) => ability.toUpperCase()).join('/')}`
    : '';
}

function stringSelection(draft: CreationDraft, key: string): string | null {
  const value = draft.selections[key];
  return typeof value === 'string' ? value : null;
}

/**
 * Build the PF2e orchestrator. Attached to the PF2e {@link SystemDefinition} so
 * the shared creator resolves it via the registry.
 */
export function createPf2eCreationOrchestrator(systemId: string): CreationOrchestrator {
  return {
    steps: PF2E_STEPS,
    createDraft: ({ id, now }) => createPf2eCreationDraft({ id, systemId, now }),
    loadOptions: async (draft, stepId): Promise<CreationOption[]> => {
      const id = draft.systemId as GameSystemId;
      if (stepId === 'ancestry') {
        return (await loadSpeciesForSystem(id)).map((entry) => ({
          id: entry.id,
          name: entry.name,
          source: entry.source,
          subtitle: ancestrySubtitle(entry),
        }));
      }
      if (stepId === 'background') {
        return (await loadPf2eBackgroundsForSystem(id)).map((entry) => ({
          id: entry.id,
          name: entry.name,
          source: entry.source,
          subtitle: backgroundSubtitle(entry),
        }));
      }
      if (stepId === 'class') {
        return (await loadClassesForSystem(id)).map((entry) => ({
          id: entry.id,
          name: entry.name,
          source: entry.source,
          subtitle: classSubtitle(entry),
        }));
      }
      return [];
    },
    selectedOptionId: (draft, stepId) => {
      if (stepId === 'ancestry') return stringSelection(draft, 'ancestryId');
      if (stepId === 'background') return stringSelection(draft, 'backgroundId');
      if (stepId === 'class') return stringSelection(draft, 'classId');
      return null;
    },
    paramValue: (draft, stepId, paramId) => {
      if (stepId === 'class' && paramId === 'level') {
        const value = draft.selections.classLevel;
        return typeof value === 'number' ? value : 1;
      }
      return 0;
    },
    applyOption: async (draft, stepId, optionId, params) => {
      // Loaded on demand so the heavy template applicators stay out of the shell.
      const { applyPf2eCreationSelection } = await import('./pf2eApply');
      if (stepId === 'ancestry') {
        return applyPf2eCreationSelection(draft, { kind: 'ancestry', ancestryId: optionId });
      }
      if (stepId === 'background') {
        return applyPf2eCreationSelection(draft, { kind: 'background', backgroundId: optionId });
      }
      if (stepId === 'class') {
        return applyPf2eCreationSelection(draft, {
          kind: 'class',
          classId: optionId,
          level: params?.level ?? 1,
        });
      }
      return draft;
    },
    summary: (draft): CreationSummaryRow[] => {
      const className = stringSelection(draft, 'className');
      const level =
        typeof draft.selections.classLevel === 'number' ? draft.selections.classLevel : null;
      return [
        { label: 'Ancestry', value: stringSelection(draft, 'ancestryName') },
        { label: 'Background', value: stringSelection(draft, 'backgroundName') },
        {
          label: 'Class',
          value: className ? (level ? `${className} (level ${level})` : className) : null,
        },
      ];
    },
  };
}
