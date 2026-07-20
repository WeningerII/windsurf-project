import { useCallback, useMemo, useState } from 'react';
import type { CharacterDocument } from '../../../types/core/document';
import { createDefaultMam3eData, type Mam3eDataModel } from '../data-model';
import { mam3eStartingPowerPoints } from '../derivedMath';
import { Mam3eEngine } from '../engine';
import { mam3ePointsRemaining, sumMam3ePointsSpent } from '../powerMath';

/**
 * Guided M&M 3e creator — draft hook.
 *
 * Deterministic and NON-AI. This increment covers Power Level + abilities +
 * skills + defenses. It never re-derives M&M point-buy math: the budget comes
 * from {@link mam3eStartingPowerPoints} (15 × PL, Hero's Handbook) and every
 * per-category cost / PL-cap violation is read straight back from the real
 * {@link Mam3eEngine} `prepareData`, the single source of truth. That guarantees
 * the creator can never diverge from the engine or the persisted sheet.
 *
 * No archetypes, powers, or advantages here by design — those stay on the
 * existing sheet and later increments, and pinned reference archetypes must NOT
 * auto-build stats (docs/MASTER_PLAN.md).
 */

export type Mam3eAbilities = Mam3eDataModel['abilities'];
export type Mam3eAbilityKey = keyof Mam3eAbilities;
export type Mam3eSpentBuckets = Mam3eDataModel['powerPoints']['spent'];
export type Mam3ePlViolations = NonNullable<Mam3eDataModel['plViolations']>;

/** One of the five M&M 3e defenses (Dodge/Parry/Fortitude/Toughness/Will). */
export type Mam3eDefenseKey = keyof Mam3eDataModel['defenses'];
/** Purchased rank per defense — the creator's raw defense input state. */
export type Mam3eDefenseRanks = Record<Mam3eDefenseKey, number>;
/** Purchased rank per skill id — only the engine's 16 skills are meaningful. */
export type Mam3eSkillRanks = Record<string, number>;

/**
 * A single M&M 3e ability rank costs 2 Power Points (Hero's Handbook). The
 * engine charges this inside `prepareData`; the constant is exposed here only so
 * the creator UI can label each input's marginal cost without re-deriving it.
 */
export const MAM3E_ABILITY_PP_PER_RANK = 2;

/**
 * A single purchased defense rank costs 1 Power Point (Hero's Handbook;
 * `spent.defenses` is the sum of the five ranks). Label-only, like the ability
 * constant — the engine's `prepareData` is what actually charges it.
 */
export const MAM3E_DEFENSE_PP_PER_RANK = 1;

/**
 * Skills cost 1 Power Point per 2 total ranks across all skills (Hero's
 * Handbook), so the engine charges `ceil(totalRanks / 2)`. There is no clean
 * per-rank marginal cost; the UI reads the aggregate `spent.skills` back from
 * the engine and only uses this constant to word the "1 PP / 2 ranks" hint.
 */
export const MAM3E_SKILL_RANKS_PER_PP = 2;

/**
 * All-zero purchased defense ranks, read from the canonical data model so there
 * is no parallel default. Used as the draft's starting defense state and as the
 * default argument to {@link buildMam3eCreatorData} (keeping the abilities-only
 * path unchanged).
 */
export function createDefaultMam3eDefenseRanks(): Mam3eDefenseRanks {
  const { defenses } = createDefaultMam3eData();
  return {
    dodge: defenses.dodge.rank,
    parry: defenses.parry.rank,
    fortitude: defenses.fortitude.rank,
    toughness: defenses.toughness.rank,
    will: defenses.will.rank,
  };
}

/**
 * Seed the data-model `skills` record from purchased ranks: every total is 0
 * because the engine's `prepareData` overwrites it (total = rank + ability). The
 * creator never computes skill totals itself.
 */
function seedSkillTotals(skills: Mam3eSkillRanks): Mam3eDataModel['skills'] {
  const out: Mam3eDataModel['skills'] = {};
  for (const [id, rank] of Object.entries(skills)) {
    out[id] = { rank, total: 0 };
  }
  return out;
}

/**
 * Seed the data-model `defenses` record from purchased ranks; every total is 0
 * for the same reason as {@link seedSkillTotals} — the engine derives it from
 * the governing ability plus the purchased rank.
 */
function seedDefenseTotals(defenses: Mam3eDefenseRanks): Mam3eDataModel['defenses'] {
  return {
    dodge: { rank: defenses.dodge, total: 0 },
    parry: { rank: defenses.parry, total: 0 },
    fortitude: { rank: defenses.fortitude, total: 0 },
    toughness: { rank: defenses.toughness, total: 0 },
    will: { rank: defenses.will, total: 0 },
  };
}

const DEFAULT_MAM3E_NAME = 'New M&M 3e Hero';

// Deterministic placeholder timestamp for the throwaway document the pure
// derivation feeds to the engine — the engine ignores it, and the hook's live
// `document` overrides id/name/dates with real values.
const DERIVATION_EPOCH = new Date(0);

function toFiniteInt(value: number, fallback: number): number {
  return Number.isFinite(value) ? Math.trunc(value) : fallback;
}

/**
 * Pure serializer for the chosen Power Level + abilities + skills + defenses.
 * Returns {@link createDefaultMam3eData} with the powerLevel, the derived Power
 * Point budget (15 × PL), and the abilities/skills/defenses overlaid; everything
 * else stays at its data-model default. Skill and defense totals are seeded to 0
 * — the engine's `prepareData` overwrites them, so the creator only supplies the
 * purchased ranks. This is the RAW, pre-engine data model — its `spent` buckets
 * are still zero, exactly like a freshly-seeded character. Exported so the
 * hook's `toData()` and the unit tests share one implementation.
 *
 * `skills`/`defenses` default to empty/all-zero so the original abilities-only
 * call signature (and its tests) keeps working unchanged.
 */
export function buildMam3eCreatorData(
  powerLevel: number,
  abilities: Mam3eAbilities,
  skills: Mam3eSkillRanks = {},
  defenses: Mam3eDefenseRanks = createDefaultMam3eDefenseRanks()
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
    skills: seedSkillTotals(skills),
    defenses: seedDefenseTotals(defenses),
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
 * Power Level + abilities + skills + defenses and run the real engine, then read
 * back the spent buckets and PL-cap violations. No parallel cost math lives here
 * — the numbers are whatever `Mam3eEngine.prepareData` produced. In particular
 * `spent.skills = ceil(totalSkillRanks / 2)` and `spent.defenses` = the sum of
 * the five purchased defense ranks, and the defense pair caps now reflect any
 * purchased Dodge/Parry/Fortitude/Toughness/Will ranks — all engine-owned.
 */
export function deriveMam3eCreatorTotals(
  powerLevel: number,
  abilities: Mam3eAbilities,
  skills: Mam3eSkillRanks = {},
  defenses: Mam3eDefenseRanks = createDefaultMam3eDefenseRanks()
): Mam3eCreatorTotals {
  const seed: CharacterDocument<Mam3eDataModel> = {
    id: 'mam3e-creator-derivation',
    name: '',
    systemId: 'mam3e',
    system: buildMam3eCreatorData(powerLevel, abilities, skills, defenses),
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
  // Task-defined draft state: Power Level, the eight ability ranks, purchased
  // skill ranks, and purchased defense ranks. Defaults are read from the
  // canonical data model so there is no parallel copy.
  const [powerLevel, setPowerLevelState] = useState<number>(
    () => createDefaultMam3eData().powerLevel
  );
  const [abilities, setAbilities] = useState<Mam3eAbilities>(() => ({
    ...createDefaultMam3eData().abilities,
  }));
  const [skills, setSkills] = useState<Mam3eSkillRanks>(() => ({}));
  const [defenses, setDefenses] = useState<Mam3eDefenseRanks>(() =>
    createDefaultMam3eDefenseRanks()
  );
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

  const setSkill = useCallback((id: string, value: number) => {
    // Negative purchased skill ranks are illegal (they would refund points), so
    // clamp at 0. A rank of 0 is dropped from the map so the raw data model and
    // the engine's skill loop stay free of untrained-skill noise.
    setSkills((prev) => {
      const rank = Math.max(0, toFiniteInt(value, prev[id] ?? 0));
      if (rank === 0) {
        if (!(id in prev)) return prev;
        const next = { ...prev };
        delete next[id];
        return next;
      }
      return { ...prev, [id]: rank };
    });
  }, []);

  const setDefense = useCallback((key: Mam3eDefenseKey, value: number) => {
    // Negative purchased defense ranks are illegal (they would refund points and
    // lower the defense total), so clamp at 0.
    setDefenses((prev) => ({
      ...prev,
      [key]: Math.max(0, toFiniteInt(value, prev[key])),
    }));
  }, []);

  const derived = useMemo(
    () => deriveMam3eCreatorTotals(powerLevel, abilities, skills, defenses),
    [powerLevel, abilities, skills, defenses]
  );

  // Raw, pre-engine data model (spent buckets still zero) — the value handed to
  // the `onCreate` callback for the app to persist. The engine's `prepareData`
  // runs at add time, so the persisted character carries the computed spend.
  const toData = useCallback(
    (): Mam3eDataModel => buildMam3eCreatorData(powerLevel, abilities, skills, defenses),
    [powerLevel, abilities, skills, defenses]
  );

  return {
    // Draft state
    powerLevel,
    abilities,
    skills,
    defenses,
    name,
    // Setters
    setPowerLevel,
    setAbility,
    setSkill,
    setDefense,
    setName,
    // Derived budget math (all from the engine)
    budget: derived.budget,
    spent: derived.spent,
    totalSpent: derived.totalSpent,
    remaining: derived.remaining,
    overBudget: derived.overBudget,
    plViolations: derived.plViolations,
    // Engine-prepared system (spent + skill/defense totals populated) so the UI
    // can show engine-computed totals without any parallel math.
    system: derived.system,
    // Serializer
    toData,
  };
}
