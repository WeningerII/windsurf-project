/**
 * System-agnostic character-creation contract.
 *
 * One creator UI consumes this interface; each system registers its own
 * orchestrator on its `SystemDefinition` (resolved via the registry, exactly like
 * engines and validators). The UI never names a system — it renders the
 * orchestrator's steps and options and applies the chosen option. All per-system
 * specifics (5e class/species/background, PF2e ancestry/background/class, …) live
 * behind these generic shapes, and `applyOption` MUST go through that system's
 * existing template applicators + validator (no parallel creation rules).
 */
import type { CreationDraft } from './creationDraft';

/** A numeric input rendered alongside a step's options (e.g. 5e class level). */
export interface CreationStepParam {
  id: string;
  label: string;
  min: number;
  max: number;
  defaultValue: number;
}

/** One ordered creation step (the creator renders one per step). */
export interface CreationStep {
  id: string;
  label: string;
  /** Optional numeric parameters the UI collects alongside the step's choice. */
  params?: readonly CreationStepParam[];
}

/** A selectable option tile within a step. */
export interface CreationOption {
  id: string;
  name: string;
  /** Open-content source label (book/SRD), shown as a badge. */
  source?: string;
  /** One-line system-specific descriptor (e.g. "Hit die d12 · Primary STR"). */
  subtitle?: string;
}

/** One reviewable line on the final step. */
export interface CreationSummaryRow {
  label: string;
  value: string | null;
}

/**
 * A system's character-creation orchestrator: agnostic shapes in, system-specific
 * work hidden inside.
 */
export interface CreationOrchestrator {
  /** Ordered steps, ending in a review step (one whose `loadOptions` returns []). */
  readonly steps: readonly CreationStep[];
  /** Start a blank draft seeded from the system's default data. */
  createDraft(params: { id: string; now?: Date }): CreationDraft;
  /** Loader-backed candidate options for a step ([] for the review step). */
  loadOptions(draft: CreationDraft, stepId: string): Promise<CreationOption[]>;
  /** The currently-chosen option id for a step (for highlighting), or null. */
  selectedOptionId(draft: CreationDraft, stepId: string): string | null;
  /** Current value of a step param (chosen-or-default), e.g. class level. */
  paramValue(draft: CreationDraft, stepId: string, paramId: string): number;
  /** Apply a chosen option (+ any step params) through the system's applicators. */
  applyOption(
    draft: CreationDraft,
    stepId: string,
    optionId: string,
    params?: Record<string, number>
  ): Promise<CreationDraft>;
  /** Human-readable summary lines for the review step. */
  summary(draft: CreationDraft): CreationSummaryRow[];
}
