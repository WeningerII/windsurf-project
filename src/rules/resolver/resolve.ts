/**
 * Deterministic effect resolver.
 *
 * See `docs/rfc/003-rules-ir-and-effects.md` (Accepted).
 *
 * `resolveEffects` is a PURE fold over `EffectInstance[]`. It groups applicable
 * effects by `target`, applies each target's stacking discipline, and produces:
 *   - a resolved numeric total (and/or dice terms / roll mode) per target;
 *   - the exact list of effects that applied, which IS the contribution ledger.
 *
 * Determinism: the fold itself uses NO randomness. Dice operations (`add-die`)
 * draw exclusively from the injected `SeededRng` (`src/scene/seededRng.ts`),
 * never `Math.random`. Same effects + same seed ⇒ byte-identical result.
 */

import type { SeededRng } from '../../scene/seededRng';
import type { BonusType } from '../../types/core/common';
import type { EffectCondition, EffectInstance, StackPolicy } from '../ir/types';

/** Roll mode produced by folding `advantage`/`disadvantage` (d20 5e). */
export type RollMode = 'normal' | 'advantage' | 'disadvantage';

/** Context evaluated by effect conditions and consumed by dice operations. */
export interface ResolveContext {
  /** Active condition ids on the acting subject. */
  conditions?: ReadonlySet<string>;
  /** Active condition ids on the attacker, for attacker-gated effects. */
  attackerConditions?: ReadonlySet<string>;
  /** Active condition ids on the target, for target-gated effects. */
  targetConditions?: ReadonlySet<string>;
  /** Equipped item ids, for `while-equipped` gating. */
  equippedItemIds?: ReadonlySet<string>;
  /** Terrain tags in play, for `in-terrain` gating. */
  terrainTags?: ReadonlySet<string>;
  /** Whether the subject is wearing armor, for armored/unarmored gating. */
  armored?: boolean;
  /** Arbitrary activity-set flags, for `custom-flag` gating. */
  flags?: ReadonlySet<string>;
  /** Ability scores, for `ability-threshold` gating. */
  abilities?: Readonly<Record<string, number>>;
  /** The ONLY sanctioned source of randomness; required for dice operations. */
  rng?: SeededRng;
}

/** Resolution of a single target. */
export interface ResolvedTarget {
  target: string;
  /** Scalar resolution (after set/add/multiply/min/max folding). */
  total: number;
  /** Rolled dice terms, when the target involved `add-die` and an rng was given. */
  diceTerms?: number[];
  /** Roll mode, when the target involved advantage/disadvantage. */
  rollMode?: RollMode;
  /** Exactly the effects that applied to this target (the per-target ledger). */
  contributions: EffectInstance[];
}

export interface ResolveResult {
  byTarget: Record<string, ResolvedTarget>;
  /** Every applied effect, flattened, in input order — the full ledger. */
  ledger: EffectInstance[];
}

/** Numeric coercion that treats non-numbers as 0 (notes, string values, null). */
function num(value: EffectInstance['value']): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0;
}

/** Evaluate an effect condition against the context. Undefined ⇒ always. */
export function effectApplies(
  condition: EffectCondition | undefined,
  ctx: ResolveContext
): boolean {
  if (!condition || condition.kind === 'always') {
    return true;
  }

  switch (condition.kind) {
    case 'has-condition':
      return hasMember(ctx.conditions, condition.conditionId);
    case 'attacker-has-condition':
      return hasMember(ctx.attackerConditions, condition.conditionId);
    case 'target-has-condition':
      return hasMember(ctx.targetConditions, condition.conditionId);
    case 'while-equipped':
      return hasMember(ctx.equippedItemIds, condition.itemId);
    case 'in-terrain':
      return hasMember(ctx.terrainTags, condition.terrainTag);
    case 'while-armored':
      return ctx.armored === true;
    case 'while-unarmored':
      return ctx.armored === false;
    case 'custom-flag':
      return hasMember(ctx.flags, condition.flag);
    case 'ability-threshold': {
      const ability = typeof condition.ability === 'string' ? condition.ability : undefined;
      const min = typeof condition.min === 'number' ? condition.min : undefined;
      if (ability === undefined || min === undefined) {
        return false;
      }
      const score = ctx.abilities?.[ability];
      return typeof score === 'number' && score >= min;
    }
    default:
      // Unknown condition kinds never apply (fail closed), keeping resolution
      // honest rather than silently granting an effect.
      return false;
  }
}

function hasMember(set: ReadonlySet<string> | undefined, key: unknown): boolean {
  return typeof key === 'string' && set !== undefined && set.has(key);
}

function isBonusTypePolicy(policy: StackPolicy): policy is { bonusType: BonusType } {
  return typeof policy === 'object' && policy !== null && 'bonusType' in policy;
}

/**
 * Fold one target's effects into a resolved value.
 *
 * Order of application (deterministic):
 *   1. `set` establishes a base (the LAST set wins, so later overrides apply).
 *   2. additive contributions:
 *        - `'sum'` policy: all `add`/`subtract` instances accumulate;
 *        - `{ bonusType }` policy: only the largest add per named type
 *          (except `'dodge'`, which stacks — same-type dodge adds sum);
 *        - PF2e buckets: the largest add per bucket, then buckets sum.
 *   3. `multiply` factors apply to the running total.
 *   4. `min`/`max` clamp.
 *   5. dice: `set-die` ESTABLISHES the target's base die (the LAST set-die wins,
 *      mirroring `set` — e.g. a weapon swap replaces the weapon die), rolled
 *      first; then every `add-die` rolls an extra die. All rolls come from the
 *      rng and are recorded in diceTerms.
 *   6. advantage/disadvantage fold into a roll mode (advantage + disadvantage
 *      cancel to normal, per 5e).
 */
function foldTarget(target: string, group: EffectInstance[], ctx: ResolveContext): ResolvedTarget {
  let base: number | undefined;
  for (const effect of group) {
    if (effect.operation === 'set') {
      base = num(effect.value);
    }
  }

  let total = base ?? 0;

  // Additive contributions, partitioned by stack policy.
  const additive = group.filter(
    (effect) => effect.operation === 'add' || effect.operation === 'subtract'
  );
  const signed = (effect: EffectInstance): number =>
    (effect.operation === 'subtract' ? -1 : 1) * num(effect.value);

  // 'sum' policy: everything accumulates.
  for (const effect of additive) {
    if (effect.stackPolicy === 'sum') {
      total += signed(effect);
    }
  }

  // Named-bonus-type policy (d20/PF): only the largest of each type counts.
  // EXCEPTION: 'dodge' bonuses explicitly stack with each other (3.5e/PF1e
  // rules-as-written), so same-type dodge instances accumulate instead.
  const byBonusType = new Map<string, number>();
  for (const effect of additive) {
    if (isBonusTypePolicy(effect.stackPolicy)) {
      const key = effect.stackPolicy.bonusType;
      const current = byBonusType.get(key);
      const candidate = signed(effect);
      if (key === 'dodge') {
        byBonusType.set(key, (current ?? 0) + candidate);
      } else {
        byBonusType.set(key, current === undefined ? candidate : Math.max(current, candidate));
      }
    }
  }
  for (const value of byBonusType.values()) {
    total += value;
  }

  // PF2e buckets: within each bucket the single highest BONUS and the single
  // worst PENALTY both apply (bonuses and penalties of the same type do not
  // stack among themselves, but a bonus and a penalty of the same type both
  // count). Buckets then sum.
  for (const bucket of ['pf2e-item', 'pf2e-status', 'pf2e-circumstance'] as const) {
    const values = additive
      .filter((effect) => effect.stackPolicy === bucket)
      .map((effect) => signed(effect));
    const bonuses = values.filter((value) => value > 0);
    const penalties = values.filter((value) => value < 0);
    if (bonuses.length > 0) {
      total += Math.max(...bonuses);
    }
    if (penalties.length > 0) {
      total += Math.min(...penalties);
    }
  }

  // Multiplicative factors.
  for (const effect of group) {
    if (effect.operation === 'multiply') {
      total *= num(effect.value);
    }
  }

  // Clamps.
  for (const effect of group) {
    if (effect.operation === 'min') {
      total = Math.max(total, num(effect.value));
    } else if (effect.operation === 'max') {
      total = Math.min(total, num(effect.value));
    }
  }

  // Dice terms (deterministic via the seeded rng). `set-die` establishes the
  // base die — the last one wins, like `set` — and rolls before any `add-die`.
  let establishedDie: EffectInstance | undefined;
  for (const effect of group) {
    if (effect.operation === 'set-die') {
      establishedDie = effect;
    }
  }
  const diceEffects = [
    ...(establishedDie ? [establishedDie] : []),
    ...group.filter((effect) => effect.operation === 'add-die'),
  ];
  let diceTerms: number[] | undefined;
  for (const effect of diceEffects) {
    if (ctx.rng) {
      const sides = num(effect.value);
      if (Number.isInteger(sides) && sides > 0) {
        const rolled = ctx.rng.rollDie(sides);
        diceTerms = diceTerms ? [...diceTerms, rolled] : [rolled];
        total += rolled;
      }
    }
  }

  // Roll mode (advantage/disadvantage; opposing sides cancel).
  let hasAdvantage = false;
  let hasDisadvantage = false;
  for (const effect of group) {
    if (effect.operation === 'advantage') {
      hasAdvantage = true;
    } else if (effect.operation === 'disadvantage') {
      hasDisadvantage = true;
    }
  }
  let rollMode: RollMode | undefined;
  if (hasAdvantage || hasDisadvantage) {
    rollMode =
      hasAdvantage && hasDisadvantage ? 'normal' : hasAdvantage ? 'advantage' : 'disadvantage';
  }

  return { target, total, diceTerms, rollMode, contributions: group };
}

/**
 * Resolve a flat list of effect instances into per-target values plus the
 * applied-effect ledger. Pure except for dice, which use `ctx.rng` only.
 */
export function resolveEffects(
  effects: readonly EffectInstance[],
  ctx: ResolveContext = {}
): ResolveResult {
  const applicable = effects.filter((effect) => effectApplies(effect.condition, ctx));

  // Group by target, preserving first-seen order for deterministic output.
  const order: string[] = [];
  const groups = new Map<string, EffectInstance[]>();
  for (const effect of applicable) {
    let bucket = groups.get(effect.target);
    if (!bucket) {
      bucket = [];
      groups.set(effect.target, bucket);
      order.push(effect.target);
    }
    bucket.push(effect);
  }

  const byTarget: Record<string, ResolvedTarget> = {};
  for (const target of order) {
    byTarget[target] = foldTarget(target, groups.get(target) as EffectInstance[], ctx);
  }

  return { byTarget, ledger: applicable };
}
