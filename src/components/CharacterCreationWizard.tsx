/**
 * Deterministic guided-creation wizard (MASTER_PLAN Phase 4B — "D&D 5e Wizard
 * Path", the visible creator). It walks a user through class → species →
 * background → review and produces a normal {@link CharacterDocument} via the
 * pure draft shell (`creationDraft.ts`) + the 5e orchestrator (`dnd5eCreation.ts`)
 * — the SAME template applicators and validator the character sheet uses. No AI,
 * no Supabase, no parallel schema.
 *
 * The draft is persisted locally on every change so a refresh mid-flow resumes
 * where the user left off (Phase 4A "resumable local drafts"); finalising or
 * cancelling clears it. Edition-agnostic: the 5e orchestrator serves both 2024
 * and 2014 (Phase 4C reuse), so this single component backs every 5e edition.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertCircle, AlertTriangle, ArrowLeft, ArrowRight, Check, Loader2, X } from 'lucide-react';

import type { GameSystemId } from '../types/game-systems';
import type { CharacterDocument, SystemDataModel } from '../types/core/document';
import type { CharacterClass } from '../types/character-options/classes';
import type { Species } from '../types/character-options/species';
import type { Background } from '../types/character-options/backgrounds';
import type { ValidationIssue } from '../registry/types';
import { generateUUID } from '../utils/browserCompat';
import { CURRENT_DOCUMENT_VERSION } from '../utils/documentMigrations';
import {
  loadBackgroundsForSystem,
  loadClassesForSystem,
  loadSpeciesForSystem,
} from '../utils/dataLoader';
import {
  canFinalize,
  finalizeCreationDraft,
  goToStep,
  isOnLastStep,
  nextStep,
  prevStep,
  setDraftName,
  type CreationDraft,
} from '../creation/creationDraft';
import {
  applyDnd5eCreationSelection,
  createDnd5eCreationDraft,
  type Dnd5eCreationSelection,
} from '../creation/dnd5eCreation';
import {
  clearCreationDraft,
  loadCreationDraft,
  saveCreationDraft,
} from '../creation/creationDraftStorage';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Skeleton } from './ui/Skeleton';

interface CharacterCreationWizardProps {
  systemId: GameSystemId;
  onComplete: (document: CharacterDocument<SystemDataModel>) => void;
  onCancel: () => void;
}

interface CatalogPools {
  classes: CharacterClass[];
  species: Species[];
  backgrounds: Background[];
}

const STEP_LABELS: Record<string, string> = {
  class: 'Class',
  species: 'Species',
  background: 'Background',
  review: 'Review',
};

const MIN_LEVEL = 1;
const MAX_LEVEL = 20;

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

/** A selectable option tile shared by the class/species/background steps. */
function OptionTile({
  name,
  source,
  subtitle,
  selected,
  disabled,
  onSelect,
}: {
  name: string;
  source: string;
  subtitle: string;
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
        <span className="font-semibold">{name}</span>
        {selected && <Check className="h-4 w-4 shrink-0 text-primary" />}
      </div>
      {subtitle && <span className="text-xs text-muted-foreground">{subtitle}</span>}
      <Badge variant="outline" className="mt-1">
        {source}
      </Badge>
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

export function CharacterCreationWizard({
  systemId,
  onComplete,
  onCancel,
}: CharacterCreationWizardProps) {
  // Resume an in-progress draft for THIS system if one was saved; otherwise start
  // fresh. (A stored draft for a different system is left untouched and ignored.)
  const [draft, setDraft] = useState<CreationDraft>(() => {
    const stored = loadCreationDraft();
    if (stored && stored.systemId === systemId) return stored;
    return createDnd5eCreationDraft({ id: generateUUID(), systemId });
  });
  const [pools, setPools] = useState<CatalogPools | null>(null);
  const [busy, setBusy] = useState(false);
  const [classLevel, setClassLevel] = useState<number>(() => {
    const stored = draft.selections.classLevel;
    return typeof stored === 'number' ? stored : 1;
  });

  // Persist on every change so a mid-flow refresh resumes (Phase 4A).
  useEffect(() => {
    saveCreationDraft(draft);
  }, [draft]);

  // Load the loader-backed candidate pools for this system.
  useEffect(() => {
    let cancelled = false;
    setPools(null);
    void Promise.all([
      loadClassesForSystem(systemId),
      loadSpeciesForSystem(systemId),
      loadBackgroundsForSystem(systemId),
    ]).then(([classes, species, backgrounds]) => {
      if (!cancelled) setPools({ classes, species, backgrounds });
    });
    return () => {
      cancelled = true;
    };
  }, [systemId]);

  const apply = useCallback(async (selection: Dnd5eCreationSelection, current: CreationDraft) => {
    setBusy(true);
    try {
      setDraft(await applyDnd5eCreationSelection(current, selection));
    } finally {
      setBusy(false);
    }
  }, []);

  const selectedClassId =
    typeof draft.selections.classId === 'string' ? draft.selections.classId : null;
  const selectedSpeciesId =
    typeof draft.selections.speciesId === 'string' ? draft.selections.speciesId : null;
  const selectedBackgroundId =
    typeof draft.selections.backgroundId === 'string' ? draft.selections.backgroundId : null;

  const handleLevelChange = (raw: number) => {
    const level = Math.max(MIN_LEVEL, Math.min(MAX_LEVEL, Math.round(raw) || MIN_LEVEL));
    setClassLevel(level);
    // Re-apply the chosen class at the new level so the draft stays in sync.
    if (selectedClassId) {
      void apply({ kind: 'class', classId: selectedClassId, level }, draft);
    }
  };

  const names = useMemo(() => {
    const find = <T extends { id: string; name: string }>(
      list: T[] | undefined,
      id: string | null
    ) => (id && list?.find((entry) => entry.id === id)?.name) || null;
    return {
      className: find(pools?.classes, selectedClassId),
      speciesName: find(pools?.species, selectedSpeciesId),
      backgroundName: find(pools?.backgrounds, selectedBackgroundId),
    };
  }, [pools, selectedClassId, selectedSpeciesId, selectedBackgroundId]);

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

  const currentStep = draft.steps[draft.stepIndex];
  const onLastStep = isOnLastStep(draft);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Guided Character Creation</h2>
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
        <label htmlFor="wizard-name" className="text-sm font-medium">
          Character name
        </label>
        <Input
          id="wizard-name"
          title="Character name"
          value={draft.name}
          onChange={(event) => setDraft(setDraftName(draft, event.target.value))}
          placeholder="New Character"
        />
      </div>

      {/* Step progress */}
      <ol className="flex flex-wrap items-center gap-2">
        {draft.steps.map((step, index) => {
          const isCurrent = index === draft.stepIndex;
          const isDone = index < draft.stepIndex;
          return (
            <li key={step}>
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
                {STEP_LABELS[step] ?? step}
              </button>
            </li>
          );
        })}
      </ol>

      {/* Validation issues (live) */}
      <IssueList issues={draft.issues} />

      {/* Step body */}
      <div className="min-h-[18rem]">
        {!pools ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((index) => (
              <Skeleton key={index} className="h-24 rounded-lg" />
            ))}
          </div>
        ) : currentStep === 'class' ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <label htmlFor="wizard-level" className="text-sm font-medium">
                Level
              </label>
              <Input
                id="wizard-level"
                title="Class level"
                type="number"
                min={MIN_LEVEL}
                max={MAX_LEVEL}
                value={classLevel}
                onChange={(event) => handleLevelChange(Number(event.target.value))}
                className="w-24"
              />
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
              {pools.classes.map((entry) => (
                <OptionTile
                  key={entry.id}
                  name={entry.name}
                  source={entry.source}
                  subtitle={classSubtitle(entry)}
                  selected={entry.id === selectedClassId}
                  disabled={busy}
                  onSelect={() =>
                    void apply({ kind: 'class', classId: entry.id, level: classLevel }, draft)
                  }
                />
              ))}
            </div>
          </div>
        ) : currentStep === 'species' ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
            {pools.species.map((entry) => (
              <OptionTile
                key={entry.id}
                name={entry.name}
                source={entry.source}
                subtitle={speciesSubtitle(entry)}
                selected={entry.id === selectedSpeciesId}
                disabled={busy}
                onSelect={() => void apply({ kind: 'species', speciesId: entry.id }, draft)}
              />
            ))}
          </div>
        ) : currentStep === 'background' ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
            {pools.backgrounds.map((entry) => (
              <OptionTile
                key={entry.id}
                name={entry.name}
                source={entry.source}
                subtitle={backgroundSubtitle(entry)}
                selected={entry.id === selectedBackgroundId}
                disabled={busy}
                onSelect={() => void apply({ kind: 'background', backgroundId: entry.id }, draft)}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-lg border bg-card p-4">
              <ReviewRow label="Name" value={draft.name.trim() || 'New Character'} />
              <ReviewRow
                label="Class"
                value={names.className ? `${names.className} (level ${classLevel})` : null}
              />
              <ReviewRow label="Species" value={names.speciesName} />
              <ReviewRow label="Background" value={names.backgroundName} />
            </div>
            {!canFinalize(draft) && (
              <p className="text-sm text-destructive">
                Resolve the errors above before creating this character.
              </p>
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
