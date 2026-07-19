import React from 'react';
import { AlertTriangle, Brain, Info, Sparkles, Zap } from 'lucide-react';
import type { Mam3eDataModel } from '../data-model';
import { MAM3E_ABILITY_PP_PER_RANK, useMam3eCreatorDraft } from './useMam3eCreatorDraft';

interface Mam3eCreatorProps {
  /**
   * Commits the finished abilities-only draft. Receives the RAW
   * {@link Mam3eDataModel} (from `toData()`) plus the character name; the app
   * builds and persists the {@link CharacterDocument}, and the engine's
   * `prepareData` runs at add time to populate spent totals + PL violations.
   */
  onCreate: (data: Mam3eDataModel, name: string) => void;
  /** When explicitly `false`, the Create button is disabled. */
  canCreate?: boolean;
  /** Optional starting name for the draft. */
  initialName?: string;
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

export const Mam3eCreator: React.FC<Mam3eCreatorProps> = ({ onCreate, canCreate, initialName }) => {
  const draft = useMam3eCreatorDraft({ initialName });
  const disabled = canCreate === false;

  const handleCreate = () => {
    onCreate(draft.toData(), draft.name);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 p-6">
      <header className="space-y-1">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Zap className="w-6 h-6 text-primary" /> New Mutants &amp; Masterminds 3e Hero
        </h2>
        <p className="text-sm text-muted-foreground">
          Deterministic, non-AI point-buy. Set a Power Level for the budget, then buy your
          abilities. Archetypes, powers, advantages, and skills are not part of this step yet — add
          them on the character sheet after you finish.
        </p>
      </header>

      <section className="bg-card p-4 rounded-lg border space-y-4">
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

      <section aria-label="Power level cap warnings" className="space-y-2">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" /> Power Level cap check
        </h3>
        <p className="flex items-start gap-1.5 text-[11px] text-muted-foreground">
          <Info className="w-3.5 h-3.5 mt-px shrink-0" />
          <span>
            Partial at this abilities-only step: only the ability-driven defense pairs (Dodge/Parry
            + Toughness, Fortitude + Will) are evaluated here. Attack and power-effect caps are
            checked later on the sheet, once you add powers; skill caps the engine does not validate
            at all. An empty list means &ldquo;no violation detected yet&rdquo;, not &ldquo;the
            build is legal&rdquo;.
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
    </div>
  );
};
