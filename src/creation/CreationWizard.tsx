import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AlertTriangle, ChevronLeft, ChevronRight, Info, Sparkles, XCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';
import { systemRegistry } from '../registry';
import type { CharacterDocument, SystemDataModel } from '../types/core/document';
import type { ValidationIssue } from '../registry/types';
import { buildWorkingDocument } from './draftDocument';
import { useCreationDraft } from './useCreationDraft';
import type { CreationChoiceStep, CreationOption, CreationPlan, CreationStep } from './types';

export interface CreationWizardProps<T extends SystemDataModel = SystemDataModel> {
  systemId: string;
  /** The system's resolved plan (loaded by the caller via `registry.getCreationPlan`). */
  plan: CreationPlan<T>;
  /** Produces the system's default data model — folded as the working doc base. */
  createDefaultData: () => T;
  /** Human-readable system label for the heading. */
  systemLabel: string;
  /** Hands the finished raw system data + name to the app's existing create path. */
  onComplete: (system: T, name: string) => void;
  /** Close the wizard without creating (draft is preserved for resume). */
  onCancel: () => void;
}

const NAME_STEP_ID = '__name';
const REVIEW_STEP_ID = '__review';

// The shell frames every plan with a name step first and a review step last, so
// systems author only their own middle steps and the flow is uniform across all
// seven systems.
function framedSteps<T extends SystemDataModel>(plan: CreationPlan<T>): Array<CreationStep<T>> {
  return [
    { kind: 'name', id: NAME_STEP_ID, title: 'Name', description: 'Name your character.' },
    ...plan.steps,
    {
      kind: 'review',
      id: REVIEW_STEP_ID,
      title: 'Review',
      description: 'Confirm your choices and create the character.',
    },
  ];
}

function severityWeight(severity: ValidationIssue['severity']): number {
  return severity === 'error' ? 0 : severity === 'warning' ? 1 : 2;
}

/**
 * System-agnostic, deterministic guided-creation wizard shell.
 *
 * Renders whatever steps a system's {@link CreationPlan} declares — name → the
 * system's own loader-exposed choices / embedded creator → live validation →
 * review — and produces a normal `CharacterDocument`'s system data through the
 * EXISTING template applicators (the plan's `apply` closures). It never imports
 * from `src/systems/**`, holds no parallel character schema, and touches no
 * remote storage: drafts are browser-local and resumable via
 * {@link useCreationDraft}. This component is lazy-loaded so it adds no eager
 * weight to the first-paint bundle.
 */
export function CreationWizard<T extends SystemDataModel = SystemDataModel>({
  systemId,
  plan,
  createDefaultData,
  systemLabel,
  onComplete,
  onCancel,
}: CreationWizardProps<T>) {
  const {
    draft,
    resumedFromStorage,
    setName,
    setStepIndex,
    setChoice,
    setComponentData,
    reset,
    clearStorage,
  } = useCreationDraft(systemId);

  const steps = useMemo(() => framedSteps(plan), [plan]);
  const stepCount = steps.length;
  const stepIndex = Math.min(draft.stepIndex, stepCount - 1);
  const currentStep = steps[stepIndex];

  // Working document, rebuilt deterministically by replaying the draft through
  // the plan whenever selections change.
  const [workingDoc, setWorkingDoc] = useState<CharacterDocument<T> | null>(null);
  const [issues, setIssues] = useState<ValidationIssue[]>([]);
  const [validating, setValidating] = useState(false);

  const rebuildToken = useRef(0);
  useEffect(() => {
    const token = ++rebuildToken.current;
    let cancelled = false;
    setValidating(true);
    (async () => {
      const doc = await buildWorkingDocument(plan, createDefaultData, draft);
      if (cancelled || token !== rebuildToken.current) return;
      setWorkingDoc(doc);
      const result = await systemRegistry.validateDocument(doc, { reason: 'creation' });
      if (cancelled || token !== rebuildToken.current) return;
      setIssues(result.issues);
      setValidating(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [plan, createDefaultData, draft]);

  const goNext = useCallback(() => {
    setStepIndex(Math.min(stepIndex + 1, stepCount - 1));
  }, [setStepIndex, stepIndex, stepCount]);

  const goBack = useCallback(() => {
    setStepIndex(Math.max(stepIndex - 1, 0));
  }, [setStepIndex, stepIndex]);

  const handleCreate = useCallback(() => {
    if (!workingDoc) return;
    onComplete(workingDoc.system, draft.name);
    clearStorage();
  }, [workingDoc, onComplete, draft.name, clearStorage]);

  const handleCancel = useCallback(() => {
    onCancel();
  }, [onCancel]);

  const handleReset = useCallback(() => {
    reset();
    rebuildToken.current++;
  }, [reset]);

  const isReview = currentStep.kind === 'review';

  return (
    <div
      className="p-6 space-y-5"
      data-testid="creation-wizard"
      role="group"
      aria-label="Guided character creation"
    >
      <header className="space-y-1">
        <h2 className="text-xl font-semibold tracking-tight flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" /> Create a {systemLabel} character
        </h2>
        <p className="text-sm text-muted-foreground">
          Step {stepIndex + 1} of {stepCount}: {currentStep.title}
        </p>
      </header>

      {resumedFromStorage && (
        <p
          data-testid="creation-resumed-banner"
          className="flex items-center gap-2 rounded-md border border-primary/40 bg-primary/5 px-3 py-2 text-xs text-muted-foreground"
        >
          <Info className="h-3.5 w-3.5 shrink-0" /> Resumed your saved draft for this system.
        </p>
      )}

      <ol className="flex flex-wrap gap-2" aria-label="Steps">
        {steps.map((step, index) => (
          <li key={step.id}>
            <button
              type="button"
              onClick={() => setStepIndex(index)}
              aria-current={index === stepIndex ? 'step' : undefined}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                index === stepIndex
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/70'
              }`}
            >
              {index + 1}. {step.title}
            </button>
          </li>
        ))}
      </ol>

      <section className="min-h-[16rem]" aria-live="polite">
        {currentStep.kind === 'name' && (
          <div className="space-y-2 max-w-md">
            <label
              htmlFor="creation-name"
              className="text-xs font-semibold uppercase text-muted-foreground"
            >
              Character name
            </label>
            <input
              id="creation-name"
              data-testid="creation-name-input"
              aria-label="Draft character name"
              value={draft.name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Character name"
            />
            {currentStep.description && (
              <p className="text-xs text-muted-foreground">{currentStep.description}</p>
            )}
          </div>
        )}

        {currentStep.kind === 'choice' && (
          <ChoiceStepView
            key={currentStep.id}
            step={currentStep}
            document={workingDoc}
            selectedIds={draft.choices[currentStep.id] ?? []}
            onSelect={(ids) => setChoice(currentStep.id, ids)}
          />
        )}

        {currentStep.kind === 'component' && workingDoc && (
          <currentStep.Component
            document={workingDoc}
            onChange={(system) => setComponentData(currentStep.id, system)}
          />
        )}

        {currentStep.kind === 'review' && (
          <ReviewStepView
            document={workingDoc}
            validating={validating}
            steps={steps}
            draft={draft}
          />
        )}
      </section>

      {/* Live validation summary — visible on every step, not just review. */}
      <ValidationSummary issues={issues} validating={validating} />

      <footer className="flex items-center justify-between gap-3 border-t pt-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleCancel} data-testid="creation-cancel">
            Cancel
          </Button>
          <Button variant="ghost" size="sm" onClick={handleReset} data-testid="creation-reset">
            Start over
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={goBack}
            disabled={stepIndex === 0}
            data-testid="creation-back"
          >
            <ChevronLeft className="h-4 w-4" /> Back
          </Button>
          {isReview ? (
            <Button
              size="sm"
              onClick={handleCreate}
              disabled={!workingDoc}
              data-testid="creation-create"
            >
              Create character
            </Button>
          ) : (
            <Button size="sm" onClick={goNext} data-testid="creation-next">
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </footer>
    </div>
  );
}

function ChoiceStepView<T extends SystemDataModel>({
  step,
  document,
  selectedIds,
  onSelect,
}: {
  step: CreationChoiceStep<T>;
  document: CharacterDocument<T> | null;
  selectedIds: string[];
  onSelect: (ids: string[]) => void;
}) {
  const [options, setOptions] = useState<CreationOption[] | null>(null);
  const [error, setError] = useState(false);
  const maxSelections = step.maxSelections ?? 1;

  useEffect(() => {
    if (!document) return;
    let cancelled = false;
    setOptions(null);
    setError(false);
    Promise.resolve(step.loadOptions(document))
      .then((loaded) => {
        if (!cancelled) setOptions(loaded);
      })
      .catch(() => {
        if (!cancelled) {
          setError(true);
          setOptions([]);
        }
      });
    return () => {
      cancelled = true;
    };
    // document identity changes on every rebuild; loadOptions only depends on
    // the system id, which is stable, so keying on step is sufficient.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const toggle = useCallback(
    (id: string) => {
      if (maxSelections === 1) {
        onSelect(selectedIds[0] === id ? [] : [id]);
        return;
      }
      if (selectedIds.includes(id)) {
        onSelect(selectedIds.filter((existing) => existing !== id));
      } else if (selectedIds.length < maxSelections) {
        onSelect([...selectedIds, id]);
      }
    },
    [maxSelections, onSelect, selectedIds]
  );

  if (options === null) {
    return (
      <div className="space-y-2" data-testid="creation-choice-loading">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-2/3" />
      </div>
    );
  }

  return (
    <div className="space-y-3" data-testid={`creation-choice-${step.id}`}>
      {step.description && <p className="text-sm text-muted-foreground">{step.description}</p>}
      {step.optional && (
        <p className="text-xs text-muted-foreground">Optional — you can skip this step.</p>
      )}
      {error && <p className="text-xs text-destructive">Could not load options for this step.</p>}
      {options.length === 0 && !error ? (
        <p className="text-sm text-muted-foreground">No options available for this system.</p>
      ) : (
        <ul className="grid gap-2 sm:grid-cols-2" role="listbox" aria-label={step.title}>
          {options.map((option) => {
            const selected = selectedIds.includes(option.id);
            return (
              <li key={option.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  disabled={option.disabled}
                  onClick={() => toggle(option.id)}
                  data-testid={`creation-option-${option.id}`}
                  className={`w-full rounded-lg border p-3 text-left transition-colors disabled:opacity-40 ${
                    selected
                      ? 'border-primary bg-primary/10'
                      : 'border-input hover:border-primary/50 hover:bg-accent'
                  }`}
                >
                  <span className="block text-sm font-medium">{option.label}</span>
                  {option.description && (
                    <span className="mt-0.5 block text-xs text-muted-foreground">
                      {option.description}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function ReviewStepView<T extends SystemDataModel>({
  document,
  validating,
  steps,
  draft,
}: {
  document: CharacterDocument<T> | null;
  validating: boolean;
  steps: Array<CreationStep<T>>;
  draft: {
    name: string;
    choices: Record<string, string[]>;
    componentData: Record<string, unknown>;
  };
}) {
  return (
    <div className="space-y-4" data-testid="creation-review">
      <dl className="grid gap-2 text-sm">
        <div className="flex justify-between gap-4 border-b pb-1">
          <dt className="text-muted-foreground">Name</dt>
          <dd className="font-medium">{draft.name || 'New Character'}</dd>
        </div>
        {steps
          .filter((step) => step.kind === 'choice' || step.kind === 'component')
          .map((step) => {
            const chosen =
              step.kind === 'choice'
                ? (draft.choices[step.id] ?? []).join(', ') || '—'
                : draft.componentData[step.id]
                  ? 'configured'
                  : '—';
            return (
              <div key={step.id} className="flex justify-between gap-4 border-b pb-1">
                <dt className="text-muted-foreground">{step.title}</dt>
                <dd className="font-medium">{chosen}</dd>
              </div>
            );
          })}
      </dl>
      {!document && !validating && (
        <p className="text-sm text-destructive">Could not assemble the character.</p>
      )}
      <p className="text-xs text-muted-foreground">
        Validation runs deterministically against the assembled document — the same check import and
        edit use. Issues are advisory: you can create now and refine on the sheet.
      </p>
    </div>
  );
}

function ValidationSummary({
  issues,
  validating,
}: {
  issues: ValidationIssue[];
  validating: boolean;
}) {
  const sorted = useMemo(
    () => [...issues].sort((a, b) => severityWeight(a.severity) - severityWeight(b.severity)),
    [issues]
  );

  if (validating && issues.length === 0) {
    return (
      <p data-testid="creation-validation" className="text-xs text-muted-foreground">
        Checking build…
      </p>
    );
  }

  if (issues.length === 0) {
    return (
      <p
        data-testid="creation-validation"
        className="flex items-center gap-1.5 text-xs text-muted-foreground"
      >
        <Sparkles className="h-3.5 w-3.5 text-primary" /> No validation issues detected.
      </p>
    );
  }

  return (
    <ul data-testid="creation-validation" className="space-y-1">
      {sorted.map((issue, index) => (
        <li
          key={`${issue.code}-${index}`}
          data-severity={issue.severity}
          className={`flex items-start gap-1.5 text-xs ${
            issue.severity === 'error'
              ? 'text-destructive'
              : issue.severity === 'warning'
                ? 'text-amber-600 dark:text-amber-400'
                : 'text-muted-foreground'
          }`}
        >
          {issue.severity === 'error' ? (
            <XCircle className="mt-px h-3.5 w-3.5 shrink-0" />
          ) : (
            <AlertTriangle className="mt-px h-3.5 w-3.5 shrink-0" />
          )}
          <span>{issue.message}</span>
        </li>
      ))}
    </ul>
  );
}

export default CreationWizard;
