/**
 * System-agnostic character creator (MASTER_PLAN creation track). One UI for
 * every system: it resolves the current system's {@link CreationOrchestrator}
 * from the registry and walks that system's steps, rendering each step's
 * loader-backed options and applying the chosen one through the system's own
 * template applicators + validator (no parallel rules, no per-system UI). The
 * component names no system — a system becomes creatable purely by registering an
 * orchestrator on its `SystemDefinition`.
 *
 * The draft is persisted locally on every change so a refresh mid-flow resumes
 * where the user left off (resumable local drafts); finishing or cancelling
 * clears it. It produces a normal {@link CharacterDocument}. No AI, no Supabase.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AlertCircle, AlertTriangle, ArrowLeft, ArrowRight, Check, Loader2, X } from 'lucide-react';

import type { GameSystemId } from '../types/game-systems';
import type { CharacterDocument, SystemDataModel } from '../types/core/document';
import type { ValidationIssue } from '../registry/types';
import { systemRegistry } from '../registry';
import { generateUUID } from '../utils/browserCompat';
import { CURRENT_DOCUMENT_VERSION } from '../utils/documentMigrations';
import {
  canFinalize,
  createCreationDraft,
  finalizeCreationDraft,
  goToStep,
  isOnLastStep,
  nextStep,
  prevStep,
  setDraftName,
  type CreationDraft,
} from '../creation/creationDraft';
import {
  clearCreationDraft,
  loadCreationDraft,
  saveCreationDraft,
} from '../creation/creationDraftStorage';
import type { CreationOption } from '../creation/types';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Skeleton } from './ui/Skeleton';

interface CharacterCreatorProps {
  systemId: GameSystemId;
  onComplete: (document: CharacterDocument<SystemDataModel>) => void;
  onCancel: () => void;
}

/** A selectable option tile shared by every step. */
function OptionTile({
  option,
  selected,
  disabled,
  onSelect,
}: {
  option: CreationOption;
  selected: boolean;
  disabled: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      aria-pressed={selected}
      className={`flex flex-col items-start gap-1 rounded-lg border p-4 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
        selected
          ? 'border-primary bg-primary/5 ring-1 ring-primary'
          : 'border-input bg-card hover:bg-accent hover:text-accent-foreground'
      }`}
    >
      <div className="flex w-full items-center justify-between gap-2">
        <span className="font-semibold">{option.name}</span>
        {selected && <Check className="h-4 w-4 shrink-0 text-primary" />}
      </div>
      {option.subtitle && <span className="text-xs text-muted-foreground">{option.subtitle}</span>}
      {option.source && (
        <Badge variant="outline" className="mt-1">
          {option.source}
        </Badge>
      )}
    </button>
  );
}

function IssueList({ issues }: { issues: ValidationIssue[] }) {
  if (issues.length === 0) return null;
  return (
    <ul className="space-y-2" aria-label="Validation issues">
      {issues.map((issue, index) => {
        const isError = issue.severity === 'error';
        return (
          <li
            key={`${issue.code}-${index}`}
            className={`flex items-start gap-2 rounded-md border px-3 py-2 text-sm ${
              isError
                ? 'border-destructive/30 bg-destructive/10 text-destructive'
                : 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400'
            }`}
          >
            {isError ? (
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            ) : (
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            )}
            <span>{issue.message}</span>
          </li>
        );
      })}
    </ul>
  );
}

function ReviewRow({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border/60 py-2 last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={`text-sm font-medium ${value ? '' : 'italic text-muted-foreground'}`}>
        {value ?? 'Not selected — you can add this on the sheet'}
      </span>
    </div>
  );
}

export function CharacterCreator({ systemId, onComplete, onCancel }: CharacterCreatorProps) {
  const orchestrator = useMemo(() => systemRegistry.get(systemId)?.creation ?? null, [systemId]);

  // Resume an in-progress draft for THIS system if one was saved; otherwise start
  // fresh. (A stored draft for a different system is left untouched and ignored.)
  const [draft, setDraft] = useState<CreationDraft>(() => {
    const stored = loadCreationDraft();
    if (stored && stored.systemId === systemId) return stored;
    if (orchestrator) return orchestrator.createDraft({ id: generateUUID() });
    // No orchestrator for this system: a placeholder (never rendered — see guard).
    return createCreationDraft({ id: generateUUID(), systemId, steps: ['review'], system: {} });
  });
  const [paramValues, setParamValues] = useState<Record<string, number>>(() => {
    const values: Record<string, number> = {};
    orchestrator?.steps.forEach((step) =>
      step.params?.forEach((param) => {
        values[`${step.id}.${param.id}`] = orchestrator.paramValue(draft, step.id, param.id);
      })
    );
    return values;
  });
  const [options, setOptions] = useState<CreationOption[] | null>(null);
  const [busy, setBusy] = useState(false);

  // loadOptions only needs the draft's systemId, so reload on step change (not on
  // every selection); a ref keeps the call current without widening the deps.
  const draftRef = useRef(draft);
  draftRef.current = draft;

  const currentStep = orchestrator?.steps[draft.stepIndex] ?? null;
  const currentStepId = currentStep?.id ?? null;
  const onLastStep = isOnLastStep(draft);

  // Persist on every change so a mid-flow refresh resumes.
  useEffect(() => {
    saveCreationDraft(draft);
  }, [draft]);

  // Load the current step's loader-backed options.
  useEffect(() => {
    if (!orchestrator || currentStepId === null) return;
    let cancelled = false;
    setOptions(null);
    void orchestrator.loadOptions(draftRef.current, currentStepId).then((next) => {
      if (!cancelled) setOptions(next);
    });
    return () => {
      cancelled = true;
    };
  }, [orchestrator, currentStepId]);

  const apply = useCallback(
    async (stepId: string, optionId: string, params?: Record<string, number>) => {
      if (!orchestrator) return;
      setBusy(true);
      try {
        setDraft(await orchestrator.applyOption(draftRef.current, stepId, optionId, params));
      } finally {
        setBusy(false);
      }
    },
    [orchestrator]
  );

  const paramsForStep = useCallback(
    (stepId: string): Record<string, number> => {
      const result: Record<string, number> = {};
      currentStep?.params?.forEach((param) => {
        result[param.id] = paramValues[`${stepId}.${param.id}`] ?? param.defaultValue;
      });
      return result;
    },
    [currentStep, paramValues]
  );

  const handleParamChange = (
    stepId: string,
    paramId: string,
    min: number,
    max: number,
    raw: number
  ) => {
    const value = Math.max(min, Math.min(max, Math.round(raw) || min));
    setParamValues((prev) => ({ ...prev, [`${stepId}.${paramId}`]: value }));
    // Re-apply the current choice with the new param so the draft stays in sync.
    const selected = orchestrator?.selectedOptionId(draftRef.current, stepId) ?? null;
    if (selected) {
      void apply(stepId, selected, { ...paramsForStep(stepId), [paramId]: value });
    }
  };

  const handleCreate = () => {
    const document = finalizeCreationDraft(draft, {
      now: new Date(),
      version: CURRENT_DOCUMENT_VERSION,
    });
    clearCreationDraft();
    onComplete(document);
  };

  const handleCancel = () => {
    clearCreationDraft();
    onCancel();
  };

  if (!orchestrator || !currentStep) {
    return (
      <div className="mx-auto max-w-xl space-y-4 text-center">
        <p className="text-muted-foreground">
          Guided creation is not available for this system yet.
        </p>
        <Button variant="outline" onClick={onCancel}>
          Back to list
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Create a Character</h2>
          <p className="text-sm text-muted-foreground">
            Build a character step by step — validated as you go, finished on the sheet.
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={handleCancel} title="Cancel creation">
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Name */}
      <div className="space-y-1">
        <label htmlFor="creator-name" className="text-sm font-medium">
          Character name
        </label>
        <Input
          id="creator-name"
          title="Character name"
          value={draft.name}
          onChange={(event) => setDraft(setDraftName(draft, event.target.value))}
          placeholder="New Character"
        />
      </div>

      {/* Step progress */}
      <ol className="flex flex-wrap items-center gap-2">
        {orchestrator.steps.map((step, index) => {
          const isCurrent = index === draft.stepIndex;
          const isDone = index < draft.stepIndex;
          return (
            <li key={step.id}>
              <button
                type="button"
                onClick={() => setDraft(goToStep(draft, index))}
                aria-current={isCurrent ? 'step' : undefined}
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm transition-colors ${
                  isCurrent
                    ? 'border-primary bg-primary text-primary-foreground'
                    : isDone
                      ? 'border-primary/40 text-primary'
                      : 'border-input text-muted-foreground hover:bg-accent'
                }`}
              >
                {isDone && <Check className="h-3.5 w-3.5" />}
                {step.label}
              </button>
            </li>
          );
        })}
      </ol>

      {/* Validation issues (live) */}
      <IssueList issues={draft.issues} />

      {/* Step body */}
      <div className="min-h-[18rem]">
        {onLastStep ? (
          <div className="space-y-4">
            <div className="rounded-lg border bg-card p-4">
              <ReviewRow label="Name" value={draft.name.trim() || 'New Character'} />
              {orchestrator.summary(draft).map((row) => (
                <ReviewRow key={row.label} label={row.label} value={row.value} />
              ))}
            </div>
            {!canFinalize(draft) && (
              <p className="text-sm text-destructive">
                Resolve the errors above before creating this character.
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {currentStep.params && currentStep.params.length > 0 && (
              <div className="flex flex-wrap items-center gap-3">
                {currentStep.params.map((param) => (
                  <div key={param.id} className="flex items-center gap-2">
                    <label htmlFor={`param-${param.id}`} className="text-sm font-medium">
                      {param.label}
                    </label>
                    <Input
                      id={`param-${param.id}`}
                      title={param.label}
                      type="number"
                      min={param.min}
                      max={param.max}
                      value={paramValues[`${currentStep.id}.${param.id}`] ?? param.defaultValue}
                      onChange={(event) =>
                        handleParamChange(
                          currentStep.id,
                          param.id,
                          param.min,
                          param.max,
                          Number(event.target.value)
                        )
                      }
                      className="w-24"
                    />
                  </div>
                ))}
              </div>
            )}
            {!options ? (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((index) => (
                  <Skeleton key={index} className="h-24 rounded-lg" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
                {options.map((option) => (
                  <OptionTile
                    key={option.id}
                    option={option}
                    selected={option.id === orchestrator.selectedOptionId(draft, currentStep.id)}
                    disabled={busy}
                    onSelect={() =>
                      void apply(currentStep.id, option.id, paramsForStep(currentStep.id))
                    }
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer navigation */}
      <div className="flex items-center justify-between gap-3 border-t pt-4">
        <Button
          variant="outline"
          onClick={() => setDraft(prevStep(draft))}
          disabled={draft.stepIndex === 0 || busy}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div className="flex items-center gap-2">
          {busy && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
          {onLastStep ? (
            <Button onClick={handleCreate} disabled={busy || !canFinalize(draft)}>
              <Check className="mr-2 h-4 w-4" />
              Create Character
            </Button>
          ) : (
            <Button onClick={() => setDraft(nextStep(draft))} disabled={busy}>
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
