import { useCallback, useMemo, useState } from 'react';
import type { CharacterDocument } from '../../../types/core/document';
import { createDefaultMam3eData, type Mam3eDataModel } from '../data-model';
import { mam3eStartingPowerPoints } from '../derivedMath';
import { Mam3eEngine } from '../engine';
import { mam3ePointsRemaining, sumMam3ePointsSpent } from '../powerMath';

/**
 * Guided M&M 3e creator — draft hook.
 *
 * Deterministic and NON-AI. This first increment covers only Power Level +
 * abilities. It never re-derives M&M point-buy math: the budget comes from
 * {@link mam3eStartingPowerPoints} (15 × PL, Hero's Handbook) and every
 * per-category cost / PL-cap violation is read straight back from the real
 * {@link Mam3eEngine} `prepareData`, the single source of truth. That guarantees
 * the creator can never diverge from the engine or the persisted sheet.
 *
 * No archetypes, powers, advantages, or skills here by design — those stay on
 * the existing sheet and later increments, and pinned reference archetypes must
 * NOT auto-build stats (docs/MASTER_PLAN.md).
 */

export type Mam3eAbilities = Mam3eDataModel['abilities'];
export type Mam3eAbilityKey = keyof Mam3eAbilities;
export type Mam3eSpentBuckets = Mam3eDataModel['powerPoints']['spent'];
export type Mam3ePlViolations = NonNullable<Mam3eDataModel['plViolations']>;

/**
 * A single M&M 3e ability rank costs 2 Power Points (Hero's Handbook). The
 * engine charges this inside `prepareData`; the constant is exposed here only so
 * the creator UI can label each input's marginal cost without re-deriving it.
 */
export const MAM3E_ABILITY_PP_PER_RANK = 2;

const DEFAULT_MAM3E_NAME = 'New M&M 3e Hero';

// Deterministic placeholder timestamp for the throwaway document the pure
// derivation feeds to the engine — the engine ignores it, and the hook's live
// `document` overrides id/name/dates with real values.
const DERIVATION_EPOCH = new Date(0);

function toFiniteInt(value: number, fallback: number): number {
  return Number.isFinite(value) ? Math.trunc(value) : fallback;
}

/**
 * Pure serializer for the chosen Power Level + abilities. Returns
 * {@link createDefaultMam3eData} with the powerLevel, the derived Power Point
 * budget (15 × PL), and the abilities overlaid; everything else stays at its
 * data-model default. This is the RAW, pre-engine data model — its `spent`
 * buckets are still zero, exactly like a freshly-seeded character. Exported so
 * the hook's `toData()` and the unit tests share one implementation.
 */
export function buildMam3eCreatorData(
  powerLevel: number,
  abilities: Mam3eAbilities
): Mam3eDataModel {
  const base = createDefaultMam3eData();
  return {
    ...base,
    powerLevel,
    powerPoints: {
      ...base.powerPoints,
      total: mam3eStartingPowerPoints(powerLevel),
    },
    abilities: { ...abilities },
  };
}

export interface Mam3eCreatorTotals {
  /** Starting Power Point budget = 15 × PL (Hero's Handbook: Power Level). */
  budget: number;
  /** Engine-computed spend per category (abilities, powers, ...). */
  spent: Mam3eSpentBuckets;
  /** Sum of the five spent buckets. */
  totalSpent: number;
  /** budget − totalSpent. */
  remaining: number;
  /** True when spend exceeds the budget. */
  overBudget: boolean;
  /** PL-cap violations detected by the engine (partial coverage; see note). */
  plViolations: Mam3ePlViolations;
  /** The engine-prepared system (spent + totals populated). */
  system: Mam3eDataModel;
}

/**
 * Pure derivation: build a minimal {@link CharacterDocument} from the chosen
 * Power Level + abilities and run the real engine, then read back the spent
 * buckets and PL-cap violations. No parallel cost math lives here — the numbers
 * are whatever `Mam3eEngine.prepareData` produced.
 */
export function deriveMam3eCreatorTotals(
  powerLevel: number,
  abilities: Mam3eAbilities
): Mam3eCreatorTotals {
  const seed: CharacterDocument<Mam3eDataModel> = {
    id: 'mam3e-creator-derivation',
    name: '',
    systemId: 'mam3e',
    system: buildMam3eCreatorData(powerLevel, abilities),
    createdAt: DERIVATION_EPOCH,
    updatedAt: DERIVATION_EPOCH,
  };
  const prepared = new Mam3eEngine().prepareData(seed);
  const spent = prepared.system.powerPoints.spent;
  const budget = mam3eStartingPowerPoints(powerLevel);
  const totalSpent = sumMam3ePointsSpent(spent);
  return {
    budget,
    spent,
    totalSpent,
    remaining: mam3ePointsRemaining(budget, spent),
    overBudget: totalSpent > budget,
    plViolations: prepared.system.plViolations ?? [],
    system: prepared.system,
  };
}

export interface UseMam3eCreatorDraftOptions {
  /** Optional starting name for the draft. */
  initialName?: string;
}

export function useMam3eCreatorDraft({ initialName }: UseMam3eCreatorDraftOptions = {}) {
  // Task-defined draft state: Power Level and the eight ability ranks. Defaults
  // are read from the canonical data model so there is no parallel copy.
  const [powerLevel, setPowerLevelState] = useState<number>(
    () => createDefaultMam3eData().powerLevel
  );
  const [abilities, setAbilities] = useState<Mam3eAbilities>(() => ({
    ...createDefaultMam3eData().abilities,
  }));
  const [name, setName] = useState<string>(() =>
    initialName?.trim() ? initialName : DEFAULT_MAM3E_NAME
  );

  const setPowerLevel = useCallback((value: number) => {
    setPowerLevelState((prev) => Math.max(0, toFiniteInt(value, prev)));
  }, []);

  const setAbility = useCallback((key: Mam3eAbilityKey, value: number) => {
    // Negative ability ranks are legal in M&M 3e (below-average traits refund
    // points), so there is deliberately no clamp here.
    setAbilities((prev) => ({ ...prev, [key]: toFiniteInt(value, prev[key]) }));
  }, []);

  const derived = useMemo(
    () => deriveMam3eCreatorTotals(powerLevel, abilities),
    [powerLevel, abilities]
  );

  // Raw, pre-engine data model (spent buckets still zero) — the value handed to
  // the `onCreate` callback for the app to persist. The engine's `prepareData`
  // runs at add time, so the persisted character carries the computed spend.
  const toData = useCallback(
    (): Mam3eDataModel => buildMam3eCreatorData(powerLevel, abilities),
    [powerLevel, abilities]
  );

  return {
    // Draft state
    powerLevel,
    abilities,
    name,
    // Setters
    setPowerLevel,
    setAbility,
    setName,
    // Derived budget math (all from the engine)
    budget: derived.budget,
    spent: derived.spent,
    totalSpent: derived.totalSpent,
    remaining: derived.remaining,
    overBudget: derived.overBudget,
    plViolations: derived.plViolations,
    // Serializer
    toData,
  };
}
