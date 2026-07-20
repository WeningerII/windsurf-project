import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '../ui/Button';
import { abilityMod, formatMod, parseNum } from '../../utils/math';

interface Props {
  attributes: Record<string, number>;
  names: Record<string, string>;
  onUpdate?: (attributes: Record<string, number>) => void;
  planner?: 'dnd5e';
}

type PlannerMode = 'manual' | 'point-buy' | 'standard-array';
type StandardArrayDraft = Record<string, number | ''>;

const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8] as const;
const POINT_BUY_MIN = 8;
const POINT_BUY_MAX = 15;
const POINT_BUY_BUDGET = 27;
const POINT_BUY_COSTS: Record<number, number> = {
  8: 0,
  9: 1,
  10: 2,
  11: 3,
  12: 4,
  13: 5,
  14: 7,
  15: 9,
};

function emptyPointBuyDraft(keys: string[]): Record<string, number> {
  return Object.fromEntries(keys.map((key) => [key, POINT_BUY_MIN]));
}

function emptyStandardArrayDraft(keys: string[]): StandardArrayDraft {
  return Object.fromEntries(keys.map((key) => [key, '']));
}

function totalPointBuyCost(attributes: Record<string, number>, keys: string[]): number {
  return keys.reduce(
    (total, key) => total + (POINT_BUY_COSTS[attributes[key]] ?? POINT_BUY_BUDGET),
    0
  );
}

function isValidPointBuyDraft(attributes: Record<string, number>, keys: string[]): boolean {
  return (
    keys.every((key) => {
      const score = attributes[key];
      return Number.isInteger(score) && score >= POINT_BUY_MIN && score <= POINT_BUY_MAX;
    }) && totalPointBuyCost(attributes, keys) <= POINT_BUY_BUDGET
  );
}

function buildPointBuyDraft(
  attributes: Record<string, number>,
  keys: string[]
): Record<string, number> {
  const draft = Object.fromEntries(keys.map((key) => [key, attributes[key] ?? POINT_BUY_MIN]));
  return isValidPointBuyDraft(draft, keys) ? draft : emptyPointBuyDraft(keys);
}

function matchesStandardArray(attributes: Record<string, number>, keys: string[]): boolean {
  const actual = keys.map((key) => attributes[key]).sort((left, right) => right - left);
  const expected = [...STANDARD_ARRAY].sort((left, right) => right - left);

  return (
    actual.length === expected.length && actual.every((value, index) => value === expected[index])
  );
}

function buildStandardArrayDraft(
  attributes: Record<string, number>,
  keys: string[]
): StandardArrayDraft {
  if (!matchesStandardArray(attributes, keys)) {
    return emptyStandardArrayDraft(keys);
  }

  return Object.fromEntries(keys.map((key) => [key, attributes[key] ?? '']));
}

function remainingStandardArrayValues(draft: StandardArrayDraft, keys: string[]): number[] {
  const assigned = new Set(
    keys.flatMap((key) => (typeof draft[key] === 'number' ? [draft[key]] : []))
  );
  return STANDARD_ARRAY.filter((value) => !assigned.has(value));
}

function isStandardArrayComplete(draft: StandardArrayDraft, keys: string[]): boolean {
  return keys.every((key) => typeof draft[key] === 'number');
}

function clampPointBuyScore(score: number): number {
  return Math.max(POINT_BUY_MIN, Math.min(POINT_BUY_MAX, score));
}

export const AbilityScoreGrid: React.FC<Props> = ({ attributes, names, onUpdate, planner }) => {
  const abilityKeys = useMemo(() => Object.keys(names), [names]);
  const [plannerMode, setPlannerMode] = useState<PlannerMode>('manual');
  const [pointBuyDraft, setPointBuyDraft] = useState<Record<string, number>>(() =>
    buildPointBuyDraft(attributes, abilityKeys)
  );
  const [standardArrayDraft, setStandardArrayDraft] = useState<StandardArrayDraft>(() =>
    buildStandardArrayDraft(attributes, abilityKeys)
  );

  useEffect(() => {
    setPointBuyDraft(buildPointBuyDraft(attributes, abilityKeys));
    setStandardArrayDraft(buildStandardArrayDraft(attributes, abilityKeys));
  }, [abilityKeys, attributes]);

  const pointBuyRemaining = POINT_BUY_BUDGET - totalPointBuyCost(pointBuyDraft, abilityKeys);
  const standardArrayRemaining = remainingStandardArrayValues(standardArrayDraft, abilityKeys);
  // Whether the stored scores are themselves a legal 27-point-buy set. When
  // they are not (leveled characters, racial bonuses, rolled stats), the
  // planner falls back to an all-8s draft — which must be labelled as a
  // fresh baseline, not silently presented as the current scores.
  const currentMatchesPointBuy = useMemo(
    () =>
      isValidPointBuyDraft(
        Object.fromEntries(abilityKeys.map((key) => [key, attributes[key] ?? POINT_BUY_MIN])),
        abilityKeys
      ),
    [abilityKeys, attributes]
  );

  const handleManualUpdate = (key: string, value: string) => {
    onUpdate?.({ ...attributes, [key]: parseNum(value, 10) });
  };

  // Point Buy is a planner: +/- only edits the local draft. Nothing is
  // written to the character until "Apply Point Buy" (mirrors Standard
  // Array), so opening the tab can never overwrite existing scores.
  const handlePointBuyUpdate = (key: string, nextScore: number) => {
    const draft = { ...pointBuyDraft, [key]: clampPointBuyScore(nextScore) };
    if (!isValidPointBuyDraft(draft, abilityKeys)) {
      return;
    }

    setPointBuyDraft(draft);
  };

  const applyPointBuy = () => {
    onUpdate?.({ ...attributes, ...pointBuyDraft });
  };

  const handleStandardArrayUpdate = (key: string, value: string) => {
    const nextValue = value ? Number.parseInt(value, 10) : '';
    setStandardArrayDraft((current) => ({
      ...current,
      [key]: Number.isFinite(nextValue) ? nextValue : '',
    }));
  };

  const applyStandardArray = () => {
    if (!isStandardArrayComplete(standardArrayDraft, abilityKeys)) {
      return;
    }

    onUpdate?.({
      ...attributes,
      ...Object.fromEntries(
        abilityKeys.map((key) => [key, Number(standardArrayDraft[key] || POINT_BUY_MIN)])
      ),
    });
  };

  return (
    <section>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-lg font-semibold">Ability Scores</h3>
        {planner === 'dnd5e' && onUpdate && (
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              variant={plannerMode === 'manual' ? 'secondary' : 'outline'}
              onClick={() => setPlannerMode('manual')}
            >
              Manual
            </Button>
            <Button
              type="button"
              size="sm"
              variant={plannerMode === 'point-buy' ? 'secondary' : 'outline'}
              onClick={() => {
                setPlannerMode('point-buy');
                setPointBuyDraft(buildPointBuyDraft(attributes, abilityKeys));
              }}
            >
              Point Buy
            </Button>
            <Button
              type="button"
              size="sm"
              variant={plannerMode === 'standard-array' ? 'secondary' : 'outline'}
              onClick={() => {
                setPlannerMode('standard-array');
                setStandardArrayDraft(buildStandardArrayDraft(attributes, abilityKeys));
              }}
            >
              Standard Array
            </Button>
          </div>
        )}
      </div>

      {planner === 'dnd5e' && onUpdate && plannerMode === 'point-buy' && (
        <div className="mb-3 rounded-lg border border-input bg-muted/30 p-3 text-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p>27-point buy. Scores stay between 8 and 15.</p>
            <span className="font-medium tabular-nums">Remaining: {pointBuyRemaining}</span>
          </div>
          {!currentMatchesPointBuy && (
            <p className="mt-2 text-muted-foreground">
              Planning from a fresh 8s baseline — current scores unchanged until you apply.
            </p>
          )}
          <div className="mt-2 flex flex-wrap gap-2">
            <Button type="button" size="sm" onClick={applyPointBuy}>
              Apply Point Buy
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => setPointBuyDraft(emptyPointBuyDraft(abilityKeys))}
            >
              Reset To 8
            </Button>
          </div>
        </div>
      )}

      {planner === 'dnd5e' && onUpdate && plannerMode === 'standard-array' && (
        <div className="mb-3 rounded-lg border border-input bg-muted/30 p-3 text-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p>Assign 15, 14, 13, 12, 10, and 8 once each.</p>
            <span className="font-medium">
              Remaining:{' '}
              {standardArrayRemaining.length > 0 ? standardArrayRemaining.join(', ') : 'Ready'}
            </span>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              onClick={applyStandardArray}
              disabled={!isStandardArrayComplete(standardArrayDraft, abilityKeys)}
            >
              Apply Standard Array
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => setStandardArrayDraft(emptyStandardArrayDraft(abilityKeys))}
            >
              Clear
            </Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {Object.entries(names).map(([key, name]) => {
          const score =
            plannerMode === 'point-buy'
              ? (pointBuyDraft[key] ?? POINT_BUY_MIN)
              : plannerMode === 'standard-array' && typeof standardArrayDraft[key] === 'number'
                ? Number(standardArrayDraft[key])
                : (attributes[key] ?? 10);
          const mod = abilityMod(score);
          const assignedValue = standardArrayDraft[key];
          const standardArrayOptions = [
            ...(typeof assignedValue === 'number' ? [assignedValue] : []),
            ...standardArrayRemaining,
          ].sort((left, right) => right - left);

          return (
            <div
              key={key}
              className="flex flex-col items-center p-3 bg-card border rounded-lg hover:shadow-sm transition-shadow"
            >
              <span className="text-xs font-semibold text-muted-foreground uppercase">{name}</span>
              {plannerMode === 'standard-array' ? (
                <select
                  value={typeof assignedValue === 'number' ? String(assignedValue) : ''}
                  onChange={(event) => handleStandardArrayUpdate(key, event.target.value)}
                  className="w-16 rounded-md border border-input bg-transparent px-1 py-1 text-center text-base font-bold focus:outline-none focus:border-primary"
                  title={`${name} standard array`}
                  aria-label={`${name} standard array`}
                  disabled={!onUpdate}
                >
                  <option value="">--</option>
                  {standardArrayOptions.map((value) => (
                    <option key={`${key}-${value}`} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="number"
                  value={score}
                  onChange={(event) =>
                    plannerMode === 'point-buy'
                      ? handlePointBuyUpdate(key, parseNum(event.target.value, POINT_BUY_MIN))
                      : handleManualUpdate(key, event.target.value)
                  }
                  className="w-14 text-center text-xl font-bold bg-transparent border-b border-input focus:outline-none focus:border-primary tabular-nums"
                  min={plannerMode === 'point-buy' ? POINT_BUY_MIN : undefined}
                  max={plannerMode === 'point-buy' ? POINT_BUY_MAX : undefined}
                  title={`${name} Score`}
                  aria-label={`${name} Score`}
                  disabled={!onUpdate}
                />
              )}
              <span className="text-sm font-medium tabular-nums">{formatMod(mod)}</span>
              {plannerMode === 'point-buy' && onUpdate && (
                <div className="mt-2 flex gap-1">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => handlePointBuyUpdate(key, score - 1)}
                    disabled={score <= POINT_BUY_MIN}
                    aria-label={`Decrease ${name}`}
                  >
                    -
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => handlePointBuyUpdate(key, score + 1)}
                    disabled={score >= POINT_BUY_MAX}
                    aria-label={`Increase ${name}`}
                  >
                    +
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
