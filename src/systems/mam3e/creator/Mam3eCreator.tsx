import React, { useEffect } from 'react';
import { AlertTriangle, Brain, Info, Shield, Sparkles, Target, Zap } from 'lucide-react';
import type { Mam3eDataModel } from '../data-model';
import {
  MAM3E_ABILITY_PP_PER_RANK,
  MAM3E_DEFENSE_PP_PER_RANK,
  MAM3E_SKILL_RANKS_PER_PP,
  type Mam3eDefenseKey,
  useMam3eCreatorDraft,
} from './useMam3eCreatorDraft';

interface Mam3eCreatorProps {
  /**
   * Commits the finished draft (abilities + skills + defenses). Receives the RAW
   * {@link Mam3eDataModel} (from `toData()`) plus the character name; the app
   * builds and persists the {@link CharacterDocument}, and the engine's
   * `prepareData` runs at add time to populate spent totals + PL violations.
   *
   * Optional in `embedded` mode: there the point-buy is a wizard STEP, so the
   * guided-creation shell owns the name + Create action and reads live data via
   * {@link Mam3eCreatorProps.onChange} instead of a terminal commit.
   */
  onCreate?: (data: Mam3eDataModel, name: string) => void;
  /** When explicitly `false`, the Create button is disabled. */
  canCreate?: boolean;
  /** Optional starting name for the draft. */
  initialName?: string;
  /**
   * Embedded mode for the system-agnostic guided-creation wizard: hides the name
   * field and the Create button (the shell owns both) and streams the draft's
   * raw data model out via {@link Mam3eCreatorProps.onChange} on every edit. This
   * lets the wizard REUSE the exact M&M point-buy UI + engine-backed math as a
   * step, rather than duplicating it.
   */
  embedded?: boolean;
  /** Fires with the raw {@link Mam3eDataModel} on every draft change (embedded). */
  onChange?: (data: Mam3eDataModel) => void;
}

// Same eight abilities and ordering the sheet's MamAbilitiesTab uses.
const ABILITIES: Array<{ label: string; key: keyof Mam3eDataModel['abilities'] }> = [
  { label: 'STR', key: 'str' },
  { label: 'STA', key: 'sta' },
  { label: 'AGI', key: 'agi' },
  { label: 'DEX', key: 'dex' },
  { label: 'FGT', key: 'fgt' },
  { label: 'INT', key: 'int' },
  { label: 'AWE', key: 'awe' },
  { label: 'PRE', key: 'pre' },
];

// The 16 M&M 3e skills (ids match mam3e/definition.ts and the engine's
// SKILL_ABILITY_MAP). Listed locally, mirroring how ABILITIES is defined here,
// so the creator does not value-import the system definition.
const SKILLS: Array<{ label: string; id: string }> = [
  { label: 'Acrobatics', id: 'acrobatics' },
  { label: 'Athletics', id: 'athletics' },
  { label: 'Close Combat', id: 'close-combat' },
  { label: 'Deception', id: 'deception' },
  { label: 'Expertise', id: 'expertise' },
  { label: 'Insight', id: 'insight' },
  { label: 'Intimidation', id: 'intimidation' },
  { label: 'Investigation', id: 'investigation' },
  { label: 'Perception', id: 'perception' },
  { label: 'Persuasion', id: 'persuasion' },
  { label: 'Ranged Combat', id: 'ranged-combat' },
  { label: 'Sleight of Hand', id: 'sleight-of-hand' },
  { label: 'Stealth', id: 'stealth' },
  { label: 'Technology', id: 'technology' },
  { label: 'Treatment', id: 'treatment' },
  { label: 'Vehicles', id: 'vehicles' },
];

// The five M&M 3e defenses, ordered as on the sheet.
const DEFENSES: Array<{ label: string; key: Mam3eDefenseKey }> = [
  { label: 'Dodge', key: 'dodge' },
  { label: 'Parry', key: 'parry' },
  { label: 'Fortitude', key: 'fortitude' },
  { label: 'Toughness', key: 'toughness' },
  { label: 'Will', key: 'will' },
];

export const Mam3eCreator: React.FC<Mam3eCreatorProps> = ({
  onCreate,
  canCreate,
  initialName,
  embedded = false,
  onChange,
}) => {
  const draft = useMam3eCreatorDraft({ initialName });
  const disabled = canCreate === false;

  // Embedded (wizard-step) mode: stream the raw data model out on every change.
  // `draft.toData` is recreated whenever the point-buy state changes, so this
  // effect re-fires exactly when the build changes.
  const draftData = draft.toData;
  useEffect(() => {
    if (embedded && onChange) {
      onChange(draftData());
    }
  }, [embedded, onChange, draftData]);

  const handleCreate = () => {
    onCreate?.(draft.toData(), draft.name);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 p-6">
      <header className="space-y-1">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Zap className="w-6 h-6 text-primary" /> New Mutants &amp; Masterminds 3e Hero
        </h2>
        <p className="text-sm text-muted-foreground">
          Deterministic, non-AI point-buy. Set a Power Level for the budget, then buy your
          abilities, skills, and defenses. Powers, advantages, and archetypes are not part of this
          step yet — add them on the character sheet after you finish.
        </p>
      </header>

      <section className="bg-card p-4 rounded-lg border space-y-4">
        {!embedded && (
          <div className="flex flex-col gap-1">
            <label
              htmlFor="mam3e-creator-name"
              className="text-xs font-semibold text-muted-foreground uppercase"
            >
              Name
            </label>
            <input
              id="mam3e-creator-name"
              value={draft.name}
              onChange={(event) => draft.setName(event.target.value)}
              className="w-full bg-transparent border-b border-input focus:outline-none focus:border-primary"
              title="Character name"
              placeholder="Character name"
            />
          </div>
        )}

        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <label
              htmlFor="mam3e-creator-power-level"
              className="text-xs font-semibold text-muted-foreground uppercase"
            >
              Power Level
            </label>
            <input
              id="mam3e-creator-power-level"
              type="number"
              min={0}
              value={draft.powerLevel}
              onChange={(event) => draft.setPowerLevel(Number(event.target.value))}
              className="w-20 text-center text-lg font-bold bg-transparent border-b border-input focus:outline-none focus:border-primary tabular-nums"
              title="Power level"
            />
            <span className="text-[11px] text-muted-foreground">Budget is 15 × PL.</span>
          </div>

          <div className="text-right">
            <div className="text-xs font-medium text-muted-foreground uppercase">
              Power Points spent / budget
            </div>
            <div
              data-testid="mam3e-creator-pp-readout"
              className={`text-2xl font-bold tabular-nums ${
                draft.overBudget ? 'text-destructive' : 'text-primary'
              }`}
            >
              {draft.totalSpent} / {draft.budget}
            </div>
            <div
              className={`flex items-center justify-end gap-1 text-xs mt-1 ${
                draft.overBudget ? 'text-destructive' : 'text-muted-foreground'
              }`}
            >
              {draft.overBudget ? (
                <>
                  <AlertTriangle className="w-3 h-3" /> Over budget by{' '}
                  {draft.totalSpent - draft.budget} PP
                </>
              ) : (
                <>{draft.remaining} PP remaining</>
              )}
            </div>
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Brain className="w-5 h-5" /> Abilities
          <span className="text-xs font-normal text-muted-foreground">
            ({MAM3E_ABILITY_PP_PER_RANK} PP per rank)
          </span>
        </h3>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
          {ABILITIES.map(({ label, key }) => (
            <div
              key={key}
              className="flex flex-col items-center p-3 bg-card border rounded-lg hover:shadow-sm transition-shadow"
            >
              <span className="text-xs font-semibold text-muted-foreground uppercase">{label}</span>
              <input
                type="number"
                value={draft.abilities[key]}
                onChange={(event) => draft.setAbility(key, Number(event.target.value))}
                className="w-14 text-center text-xl font-bold bg-transparent border-b border-input focus:outline-none focus:border-primary tabular-nums"
                title={`${label} rank`}
              />
              <span className="text-xs text-muted-foreground tabular-nums">
                {draft.abilities[key] * MAM3E_ABILITY_PP_PER_RANK} PP
              </span>
            </div>
          ))}
        </div>
      </section>

      <section aria-label="Skills">
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Target className="w-5 h-5" /> Skills
          <span className="text-xs font-normal text-muted-foreground">
            (1 PP per {MAM3E_SKILL_RANKS_PER_PP} ranks)
          </span>
          <span
            data-testid="mam3e-creator-skills-cost"
            className="ml-auto text-xs font-semibold text-primary tabular-nums"
          >
            {draft.spent.skills} PP
          </span>
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {SKILLS.map(({ label, id }) => (
            <div
              key={id}
              className="flex items-center justify-between gap-2 p-2 bg-card border rounded-lg"
            >
              <span className="text-xs font-medium text-muted-foreground">{label}</span>
              <input
                type="number"
                min={0}
                value={draft.skills[id] ?? 0}
                onChange={(event) => draft.setSkill(id, Number(event.target.value))}
                className="w-12 text-center text-base font-bold bg-transparent border-b border-input focus:outline-none focus:border-primary tabular-nums"
                title={`${label} rank`}
              />
            </div>
          ))}
        </div>
      </section>

      <section aria-label="Defenses">
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Shield className="w-5 h-5" /> Defenses
          <span className="text-xs font-normal text-muted-foreground">
            ({MAM3E_DEFENSE_PP_PER_RANK} PP per rank)
          </span>
          <span
            data-testid="mam3e-creator-defenses-cost"
            className="ml-auto text-xs font-semibold text-primary tabular-nums"
          >
            {draft.spent.defenses} PP
          </span>
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {DEFENSES.map(({ label, key }) => (
            <div
              key={key}
              className="flex flex-col items-center p-3 bg-card border rounded-lg hover:shadow-sm transition-shadow"
            >
              <span className="text-xs font-semibold text-muted-foreground uppercase">{label}</span>
              <input
                type="number"
                min={0}
                value={draft.defenses[key]}
                onChange={(event) => draft.setDefense(key, Number(event.target.value))}
                className="w-14 text-center text-xl font-bold bg-transparent border-b border-input focus:outline-none focus:border-primary tabular-nums"
                title={`${label} rank`}
              />
              <span className="text-[11px] text-muted-foreground tabular-nums">
                total {draft.system.defenses[key].total}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section aria-label="Power level cap warnings" className="space-y-2">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" /> Power Level cap check
        </h3>
        <p className="flex items-start gap-1.5 text-[11px] text-muted-foreground">
          <Info className="w-3.5 h-3.5 mt-px shrink-0" />
          <span>
            Partial coverage: the defense pairs (Dodge/Parry + Toughness, Fortitude + Will) are
            evaluated here, now including your purchased defense ranks. Attack and power-effect caps
            are checked later on the sheet, once you add powers; skill caps the engine does not
            validate at all. An empty list means &ldquo;no violation detected yet&rdquo;, not
            &ldquo;the build is legal&rdquo;.
          </span>
        </p>
        <div data-testid="mam3e-creator-pl-violations" className="min-h-[1.5rem]">
          {draft.plViolations.length > 0 ? (
            <ul className="space-y-1">
              {draft.plViolations.map((violation) => (
                <li
                  key={violation.label}
                  className="flex items-center gap-1.5 text-xs text-destructive"
                >
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    {violation.label}: {violation.value} exceeds PL cap of {violation.limit}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Sparkles className="w-3.5 h-3.5 shrink-0" /> No power-level cap violations detected.
            </p>
          )}
        </div>
      </section>

      {!embedded && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleCreate}
            disabled={disabled}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Zap className="w-4 h-4" /> Create character
          </button>
        </div>
      )}
    </div>
  );
};
