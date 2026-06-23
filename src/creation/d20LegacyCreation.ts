/**
 * d20 legacy character-creation orchestrator — one flow for BOTH D&D 3.5e and
 * Pathfinder 1e (they share the d20-legacy data model + applicators), registered
 * on both `SystemDefinition`s. The third consumer of the agnostic
 * {@link CreationOrchestrator}: a race → class flow (no background — neither system
 * ships backgrounds), rendered by the same shared `CharacterCreator` unchanged.
 *
 * Light by design: imported eagerly by the 3.5e/PF1e `SystemDefinition`s, so it
 * must NOT statically pull in the heavy templates. The applicator-dependent "apply
 * a choice + validate" core lives in `./d20LegacyApply` and is `import()`ed on
 * demand.
 */
import type { CharacterClass } from '../types/character-options/classes';
import type { Species } from '../types/character-options/species';
import type { GameSystemId } from '../types/game-systems';
import { systemRegistry } from '../registry';
import { loadClassesForSystem, loadSpeciesForSystem } from '../utils/dataLoader';
import { createCreationDraft, type CreationDraft } from './creationDraft';
import type {
  CreationOption,
  CreationOrchestrator,
  CreationStep,
  CreationSummaryRow,
} from './types';

/** The ordered d20-legacy creation steps (race-first; no background surface). */
export const D20_LEGACY_CREATION_STEPS = ['race', 'class', 'review'] as const;

/** Start a d20-legacy creation draft seeded from the registry's blank data. */
export function createD20LegacyCreationDraft(params: {
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
    steps: [...D20_LEGACY_CREATION_STEPS],
    system: definition.createDefaultData(),
    now: params.now,
  });
}

const MIN_CLASS_LEVEL = 1;
const MAX_CLASS_LEVEL = 20;

const D20_LEGACY_STEPS: readonly CreationStep[] = [
  { id: 'race', label: 'Race' },
  {
    id: 'class',
    label: 'Class',
    params: [
      { id: 'level', label: 'Level', min: MIN_CLASS_LEVEL, max: MAX_CLASS_LEVEL, defaultValue: 1 },
    ],
  },
  { id: 'review', label: 'Review' },
];

function raceSubtitle(entry: Species): string {
  return `Size ${entry.size} · Speed ${entry.speed} ft`;
}

function classSubtitle(entry: CharacterClass): string {
  return `Hit die ${entry.hitDie}`;
}

function stringSelection(draft: CreationDraft, key: string): string | null {
  const value = draft.selections[key];
  return typeof value === 'string' ? value : null;
}

/**
 * Build the d20-legacy orchestrator for a system id (3.5e or PF1e). Attached to
 * both {@link SystemDefinition}s so the shared creator resolves it via the registry.
 */
export function createD20LegacyCreationOrchestrator(systemId: string): CreationOrchestrator {
  return {
    steps: D20_LEGACY_STEPS,
    createDraft: ({ id, now }) => createD20LegacyCreationDraft({ id, systemId, now }),
    loadOptions: async (draft, stepId): Promise<CreationOption[]> => {
      const id = draft.systemId as GameSystemId;
      if (stepId === 'race') {
        return (await loadSpeciesForSystem(id)).map((entry) => ({
          id: entry.id,
          name: entry.name,
          source: entry.source,
          subtitle: raceSubtitle(entry),
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
      if (stepId === 'race') return stringSelection(draft, 'speciesId');
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
      const { applyD20LegacyCreationSelection } = await import('./d20LegacyApply');
      if (stepId === 'race') {
        return applyD20LegacyCreationSelection(draft, { kind: 'race', raceId: optionId });
      }
      if (stepId === 'class') {
        return applyD20LegacyCreationSelection(draft, {
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
        { label: 'Race', value: stringSelection(draft, 'speciesName') },
        {
          label: 'Class',
          value: className ? (level ? `${className} (level ${level})` : className) : null,
        },
      ];
    },
  };
}
