/**
 * Deterministic character-creation draft — the pure, system-agnostic shell of the
 * creation track (MASTER_PLAN).
 *
 * A `CreationDraft` is an in-progress character: the system's data (seeded from
 * `createDefaultData`, later mutated by the SAME template applicators manual
 * editing uses), the ordered creation steps, what the user has chosen, and the
 * latest validation issues. This module is the pure, system-agnostic backbone —
 * step navigation, selection bookkeeping, serialisation for a resumable local
 * draft, and finalisation into a normal {@link CharacterDocument}. It owns no
 * React, no storage, no async, and no per-system rules: the async "apply a
 * choice + validate" orchestration (per-system) and the creator UI layer on top
 * and feed their results back in through {@link withResolvedSystem}.
 *
 * Constraints (MASTER_PLAN): the output is a normal CharacterDocument produced
 * via the existing applicators/validators — no parallel schema, no loader bypass,
 * no Supabase. The draft is plain JSON so it round-trips through local storage.
 */
import type { CharacterDocument, SystemDataModel } from '../types/core/document';
import type { ValidationIssue } from '../registry/types';

export interface CreationDraft {
  /** Stable id; also becomes the finalised document's id. */
  id: string;
  systemId: string;
  /** Working character name (defaults to "New Character"). */
  name: string;
  /** The in-progress system data — seeded blank, mutated by applicators. */
  system: SystemDataModel;
  /** Ordered creation step ids for this system (e.g. class, species, …). */
  steps: string[];
  /** Index into `steps` of the current step. */
  stepIndex: number;
  /** What the user has chosen so far (classId, speciesId, …) — provenance. */
  selections: Record<string, unknown>;
  /** Latest validation issues from the apply orchestrator (Phase 4B). */
  issues: ValidationIssue[];
  /** When the draft was started (ISO; the FINAL document is re-stamped). */
  createdAt: string;
}

export interface CreateCreationDraftParams {
  id: string;
  systemId: string;
  /** Ordered step ids; must be non-empty. */
  steps: string[];
  /** Blank system data from the registry's `createDefaultData()`. */
  system: SystemDataModel;
  name?: string;
  now?: Date;
}

export function createCreationDraft(params: CreateCreationDraftParams): CreationDraft {
  return {
    id: params.id,
    systemId: params.systemId,
    name: params.name?.trim() ? params.name : 'New Character',
    system: params.system,
    steps: [...params.steps],
    stepIndex: 0,
    selections: {},
    issues: [],
    createdAt: (params.now ?? new Date()).toISOString(),
  };
}

/** Clamp a step index into `[0, steps.length - 1]` (0 when there are no steps). */
function clampStepIndex(steps: readonly string[], index: number): number {
  if (steps.length === 0) return 0;
  if (!Number.isInteger(index) || index < 0) return 0;
  return Math.min(index, steps.length - 1);
}

export function goToStep(draft: CreationDraft, stepIndex: number): CreationDraft {
  return { ...draft, stepIndex: clampStepIndex(draft.steps, stepIndex) };
}

export function nextStep(draft: CreationDraft): CreationDraft {
  return goToStep(draft, draft.stepIndex + 1);
}

export function prevStep(draft: CreationDraft): CreationDraft {
  return goToStep(draft, draft.stepIndex - 1);
}

/** True when the current step is the last one (the review/finalise step). */
export function isOnLastStep(draft: CreationDraft): boolean {
  return draft.stepIndex >= draft.steps.length - 1;
}

export function setDraftName(draft: CreationDraft, name: string): CreationDraft {
  return { ...draft, name };
}

/** Record a user choice (merged into `selections`). Pure provenance only — the
 * actual rules effect is applied by the orchestrator, which feeds the resulting
 * system data back via {@link withResolvedSystem}. */
export function setSelection(draft: CreationDraft, key: string, value: unknown): CreationDraft {
  return { ...draft, selections: { ...draft.selections, [key]: value } };
}

/** Replace the draft's system data and validation issues — the output of the
 * async "apply a choice + validate" orchestration (Phase 4B). */
export function withResolvedSystem(
  draft: CreationDraft,
  system: SystemDataModel,
  issues: ValidationIssue[]
): CreationDraft {
  return { ...draft, system, issues: [...issues] };
}

/** Reset to the first step with fresh blank system data, keeping id/system/steps.
 * The caller supplies a new `createDefaultData()` result (this module is rules-free). */
export function resetCreationDraft(
  draft: CreationDraft,
  freshSystem: SystemDataModel
): CreationDraft {
  return { ...draft, system: freshSystem, stepIndex: 0, selections: {}, issues: [] };
}

/** No blocking (error-severity) issues remain, so the draft can become a document. */
export function canFinalize(draft: CreationDraft): boolean {
  return !draft.issues.some((issue) => issue.severity === 'error');
}

/**
 * Produce the final {@link CharacterDocument}. The system data is whatever the
 * applicators built; the envelope is stamped fresh. `version`/`now` are injected
 * so this stays pure and deterministic.
 */
export function finalizeCreationDraft(
  draft: CreationDraft,
  options: { now: Date; version: number }
): CharacterDocument {
  return {
    id: draft.id,
    name: draft.name.trim() || 'New Character',
    systemId: draft.systemId,
    system: draft.system,
    createdAt: options.now,
    updatedAt: options.now,
    version: options.version,
  };
}

export function serializeCreationDraft(draft: CreationDraft): string {
  return JSON.stringify(draft);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function coerceIssues(value: unknown): ValidationIssue[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (entry): entry is ValidationIssue =>
      isRecord(entry) &&
      typeof entry.code === 'string' &&
      typeof entry.message === 'string' &&
      (entry.severity === 'info' || entry.severity === 'warning' || entry.severity === 'error')
  );
}

/**
 * Parse an untrusted (stored) draft, dropping a structurally invalid one
 * (parse-don't-cast). A draft needs an id, systemId, a non-empty step list, and
 * an object `system`; soft fields fall back to safe defaults so a lightly
 * corrupt draft still resumes rather than crashing.
 */
export function parseCreationDraft(value: unknown): CreationDraft | null {
  if (!isRecord(value)) return null;
  if (typeof value.id !== 'string' || !value.id) return null;
  if (typeof value.systemId !== 'string' || !value.systemId) return null;
  if (!Array.isArray(value.steps) || !value.steps.every((step) => typeof step === 'string')) {
    return null;
  }
  if (value.steps.length === 0) return null;
  if (!isRecord(value.system)) return null;

  const steps = value.steps as string[];
  return {
    id: value.id,
    systemId: value.systemId,
    name: typeof value.name === 'string' && value.name ? value.name : 'New Character',
    system: value.system,
    steps,
    stepIndex: clampStepIndex(steps, typeof value.stepIndex === 'number' ? value.stepIndex : 0),
    selections: isRecord(value.selections) ? value.selections : {},
    issues: coerceIssues(value.issues),
    createdAt: typeof value.createdAt === 'string' ? value.createdAt : new Date().toISOString(),
  };
}
