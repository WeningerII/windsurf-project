import type { ComponentType } from 'react';
import type { CharacterDocument, SystemDataModel } from '../types/core/document';

/**
 * System-agnostic guided-creation wizard: shared step vocabulary.
 *
 * A {@link CreationPlan} is the ONLY thing a system exposes to the wizard shell.
 * The shell renders whatever steps the plan declares and never special-cases a
 * system: every branch below is data the system's OWN loaders/validators/
 * template applicators produce. The plan's `apply` closures live in
 * `src/systems/**` (so they may value-import that system's template applicators);
 * the shell in `src/creation/**` only orchestrates and stays layer-boundary
 * clean (it value-imports nothing from `src/systems/**`).
 */

/** One selectable option in a {@link CreationChoiceStep}. */
export interface CreationOption {
  /** Stable id used as the selection value and passed to `apply`. */
  id: string;
  /** Human-readable label. */
  label: string;
  /** Optional one-line description shown under the label. */
  description?: string;
  /** When true the option renders but cannot be picked. */
  disabled?: boolean;
}

/**
 * The always-first step: capture the character name. The shell renders exactly
 * one name step at the top of every plan; systems never author it themselves.
 */
export interface CreationNameStep {
  kind: 'name';
  id: string;
  title: string;
  description?: string;
}

/**
 * A choice over loader-exposed options. `loadOptions` reads the system's loaders
 * (async); `apply` folds the selection into the working document through the
 * system's OWN template applicator. Both are pure and deterministic — no AI, no
 * network beyond the loader's data import.
 */
export interface CreationChoiceStep<T extends SystemDataModel> {
  kind: 'choice';
  id: string;
  title: string;
  description?: string;
  /** When true the step may be left empty and still advance. Default: required. */
  optional?: boolean;
  /** Max simultaneously-selectable options. Default 1 (single-select). */
  maxSelections?: number;
  /** Enumerate the options from the system's loaders. */
  loadOptions: (document: CharacterDocument<T>) => Promise<CreationOption[]> | CreationOption[];
  /**
   * Fold the selected option ids into the working document via the system's own
   * template applicator. MUST be replay-safe (called again from scratch when a
   * persisted draft resumes), so it re-resolves any data it needs rather than
   * relying on `loadOptions` having run.
   */
  apply: (
    document: CharacterDocument<T>,
    selectedIds: string[]
  ) => Promise<CharacterDocument<T>> | CharacterDocument<T>;
}

/** Props a system's embedded creation-step component receives from the shell. */
export interface CreationComponentStepProps<T extends SystemDataModel> {
  /** The working document as folded by earlier steps. */
  document: CharacterDocument<T>;
  /** Report the step's produced system data back to the wizard on every change. */
  onChange: (system: T) => void;
}

/**
 * Reuse an existing per-system creator UI (e.g. M&M 3e's point-buy) as a step,
 * rather than duplicating it. The component drives its own local draft and calls
 * `onChange` with the full system data model on every edit; the shell treats
 * that as the working document's system data for subsequent steps.
 */
export interface CreationComponentStep<T extends SystemDataModel> {
  kind: 'component';
  id: string;
  title: string;
  description?: string;
  Component: ComponentType<CreationComponentStepProps<T>>;
}

/** The final step: summarize + surface live validation before creating. */
export interface CreationReviewStep {
  kind: 'review';
  id: string;
  title: string;
  description?: string;
}

export type CreationStep<T extends SystemDataModel> =
  | CreationNameStep
  | CreationChoiceStep<T>
  | CreationComponentStep<T>
  | CreationReviewStep;

/**
 * The complete, ordered set of steps a system exposes to the wizard. Systems
 * declare this lazily (`SystemDefinition.loadCreationPlan`) so their (often
 * large) plan + template-applicator closures code-split away from the eager
 * registry bootstrap chunk, mirroring `loadValidator`/`loadLegalActions`.
 */
export interface CreationPlan<T extends SystemDataModel> {
  systemId: string;
  steps: Array<CreationStep<T>>;
}

/**
 * The persisted, resumable draft state. Deliberately serializable (no Dates, no
 * document envelope): the working document is rebuilt deterministically by
 * replaying these selections through the plan, so a resumed draft can never
 * carry a stale derived document.
 */
export interface CreationDraftState {
  name: string;
  stepIndex: number;
  /** step id -> selected option ids (choice steps). */
  choices: Record<string, string[]>;
  /** step id -> produced system data (component steps). */
  componentData: Record<string, SystemDataModel>;
}
