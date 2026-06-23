/**
 * D&D 5e character-creation orchestrator — the first system to register the
 * agnostic {@link CreationOrchestrator} contract consumed by the shared
 * `CharacterCreator` UI. The same flow serves both 5e editions (2014 and 2024)
 * via `Dnd5eLikeDataModel` + the shared applicators.
 *
 * This module is deliberately light: it is imported eagerly by the 5e
 * `SystemDefinition` (so the registry can advertise "this system is creatable"),
 * so it must NOT statically pull in the heavy template applicators. The
 * applicator-dependent "apply a choice + validate" core lives in `./dnd5eApply`
 * and is `import()`ed only when the user actually applies a choice in the lazily-
 * loaded creator — keeping the applicators out of the first-paint shell.
 */
import type { Background } from '../types/character-options/backgrounds';
import type { CharacterClass } from '../types/character-options/classes';
import type { Species } from '../types/character-options/species';
import type { GameSystemId } from '../types/game-systems';
import { systemRegistry } from '../registry';
import {
  loadBackgroundsForSystem,
  loadClassesForSystem,
  loadSpeciesForSystem,
} from '../utils/dataLoader';
import { createCreationDraft, type CreationDraft } from './creationDraft';
import type {
  CreationOption,
  CreationOrchestrator,
  CreationStep,
  CreationSummaryRow,
} from './types';

/** The ordered 5e creation steps (the creator renders one per step). */
export const DND5E_CREATION_STEPS = ['class', 'species', 'background', 'review'] as const;

/** Start a 5e creation draft seeded from the registry's blank data + 5e steps. */
export function createDnd5eCreationDraft(params: {
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
    steps: [...DND5E_CREATION_STEPS],
    system: definition.createDefaultData(),
    now: params.now,
  });
}

// --- Agnostic orchestrator -------------------------------------------------
// These map 5e's loaders/applicators onto the system-agnostic CreationOrchestrator
// the shared CharacterCreator UI consumes. All 5e specifics (the option subtitles,
// the class-level param, the class/species/background step ids) live here, not in
// the UI.

const MIN_CLASS_LEVEL = 1;
const MAX_CLASS_LEVEL = 20;

const DND5E_STEPS: readonly CreationStep[] = [
  {
    id: 'class',
    label: 'Class',
    params: [
      { id: 'level', label: 'Level', min: MIN_CLASS_LEVEL, max: MAX_CLASS_LEVEL, defaultValue: 1 },
    ],
  },
  { id: 'species', label: 'Species' },
  { id: 'background', label: 'Background' },
  { id: 'review', label: 'Review' },
];

function classSubtitle(entry: CharacterClass): string {
  const primary = entry.primaryAbility?.length
    ? `Primary ${entry.primaryAbility.map((ability) => ability.toUpperCase()).join('/')}`
    : '';
  return [`Hit die ${entry.hitDie}`, primary].filter(Boolean).join(' · ');
}

function speciesSubtitle(entry: Species): string {
  return `Size ${entry.size} · Speed ${entry.speed} ft`;
}

function backgroundSubtitle(entry: Background): string {
  return entry.feature?.name ? `Feature: ${entry.feature.name}` : '';
}

function stringSelection(draft: CreationDraft, key: string): string | null {
  const value = draft.selections[key];
  return typeof value === 'string' ? value : null;
}

/**
 * Build the 5e orchestrator for a given system id (2014 or 2024). Attached to the
 * 5e {@link SystemDefinition}s so the shared creator resolves it via the registry.
 */
export function createDnd5eCreationOrchestrator(systemId: string): CreationOrchestrator {
  return {
    steps: DND5E_STEPS,
    createDraft: ({ id, now }) => createDnd5eCreationDraft({ id, systemId, now }),
    loadOptions: async (draft, stepId): Promise<CreationOption[]> => {
      const id = draft.systemId as GameSystemId;
      if (stepId === 'class') {
        return (await loadClassesForSystem(id)).map((entry) => ({
          id: entry.id,
          name: entry.name,
          source: entry.source,
          subtitle: classSubtitle(entry),
        }));
      }
      if (stepId === 'species') {
        return (await loadSpeciesForSystem(id)).map((entry) => ({
          id: entry.id,
          name: entry.name,
          source: entry.source,
          subtitle: speciesSubtitle(entry),
        }));
      }
      if (stepId === 'background') {
        return (await loadBackgroundsForSystem(id)).map((entry) => ({
          id: entry.id,
          name: entry.name,
          source: entry.source,
          subtitle: backgroundSubtitle(entry),
        }));
      }
      return [];
    },
    selectedOptionId: (draft, stepId) => {
      if (stepId === 'class') return stringSelection(draft, 'classId');
      if (stepId === 'species') return stringSelection(draft, 'speciesId');
      if (stepId === 'background') return stringSelection(draft, 'backgroundId');
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
      const { applyDnd5eCreationSelection } = await import('./dnd5eApply');
      if (stepId === 'class') {
        return applyDnd5eCreationSelection(draft, {
          kind: 'class',
          classId: optionId,
          level: params?.level ?? 1,
        });
      }
      if (stepId === 'species') {
        return applyDnd5eCreationSelection(draft, { kind: 'species', speciesId: optionId });
      }
      if (stepId === 'background') {
        return applyDnd5eCreationSelection(draft, { kind: 'background', backgroundId: optionId });
      }
      return draft;
    },
    summary: (draft): CreationSummaryRow[] => {
      const className = stringSelection(draft, 'className');
      const level =
        typeof draft.selections.classLevel === 'number' ? draft.selections.classLevel : null;
      return [
        {
          label: 'Class',
          value: className ? (level ? `${className} (level ${level})` : className) : null,
        },
        { label: 'Species', value: stringSelection(draft, 'speciesName') },
        { label: 'Background', value: stringSelection(draft, 'backgroundName') },
      ];
    },
  };
}
