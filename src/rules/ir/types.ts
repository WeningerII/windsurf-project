/**
 * System-agnostic Rules Intermediate Representation (IR).
 *
 * See `docs/rfc/003-rules-ir-and-effects.md` (Accepted).
 *
 * Every one of the seven game systems compiles its rules-as-written into the
 * SAME `EffectInstance` shape. The IR is *system-tagged, not system-shaped*:
 * each instance carries a `systemId` for provenance, but the structure is
 * identical across systems. The only per-system variation is the `stackPolicy`
 * value and the `target` namespace.
 *
 * This shape is a strict superset of `ContributionLedgerEntry`
 * (`src/types/core/contributionLedger.ts`): the ledger is the "explain a value"
 * view of the same primitive the resolver reads to "produce a value."
 */

import type { GameSystemId } from '../../types/game-systems';
import type { BonusType } from '../../types/core/common';
import type {
  ContributionCategory,
  ContributionManualBoundary,
  ContributionSourceKind,
} from '../../types/core/contributionLedger';

/**
 * How an effect combines with sibling effects on the same `target`.
 *
 * - `'sum'`: every instance adds. Used by 5e magic items, class/feature
 *   bonuses, Daggerheart passives, and M&M cost math.
 * - `{ bonusType }`: d20/PF named-bonus stacking — only the LARGEST instance of
 *   a given named bonus type counts; different types stack with each other.
 *   Exception: `'dodge'` bonuses stack with each other (3.5e/PF1e RAW), so
 *   same-type dodge instances sum in the resolver.
 * - `'pf2e-item' | 'pf2e-status' | 'pf2e-circumstance'`: PF2e's three stacking
 *   buckets — the highest within each bucket applies, and the buckets sum.
 */
export type StackPolicy =
  | 'sum'
  | { bonusType: BonusType }
  | 'pf2e-item'
  | 'pf2e-status'
  | 'pf2e-circumstance';

/**
 * What an effect does to its target.
 *
 * Scalar arithmetic (`add`/`subtract`/`multiply`/`set`/`min`/`max`) folds into a
 * single number per target. `advantage`/`disadvantage` fold into a roll mode
 * (d20 5e). `set-die`/`add-die` describe dice (weapon damage, M&M ranks,
 * Daggerheart dice) by side count. `note` contributes nothing numerically and
 * exists only to carry a manual-boundary annotation into the ledger.
 */
export type EffectOperation =
  | 'add'
  | 'subtract'
  | 'multiply'
  | 'set'
  | 'min'
  | 'max'
  | 'advantage'
  | 'disadvantage'
  | 'set-die'
  | 'add-die'
  | 'note';

/**
 * The value carried by an effect. `null` for operations that carry no magnitude
 * (e.g. `advantage`, or a `note`). `number[]` is reserved for multi-die terms.
 */
export type EffectValue = number | string | number[] | null;

/** Where an effect comes from. Superset-compatible with the ledger source ref. */
export interface EffectSource {
  kind: ContributionSourceKind;
  /** Stable id of the source (item id, feat id, condition id, terrain tag). */
  id?: string;
  /** Human-readable label for tooltips/breakdowns. */
  label: string;
  /** JSON path into the document/scene, for provenance. */
  path?: string;
}

/**
 * Predicate gating when an effect applies. Pure; evaluated against a
 * `ResolveContext`. `kind: 'always'` (the default when `condition` is omitted)
 * means unconditional.
 *
 * Additional parameters travel as extra properties (e.g.
 * `{ kind: 'has-condition', conditionId: 'prone' }`).
 */
export interface EffectCondition {
  kind:
    | 'always'
    | 'has-condition'
    | 'while-equipped'
    | 'while-armored'
    | 'while-unarmored'
    | 'attacker-has-condition'
    | 'target-has-condition'
    | 'in-terrain'
    | 'ability-threshold'
    | 'custom-flag';
  [param: string]: unknown;
}

/**
 * THE shared primitive. One shape, two readers:
 * - the resolver consumes it to PRODUCE a value;
 * - `toContributionLedger` projects it to EXPLAIN a value.
 */
export interface EffectInstance {
  /** Stable, deterministic id (see `makeEffectId`). */
  id: string;
  /** Provenance tag — NOT a structural discriminator. */
  systemId: GameSystemId;
  /**
   * Open target namespace, validated per-system. Examples:
   * `'ac'`, `'attack'`, `'damage.fire'`, `'save.fortitude'`, `'evasion'`,
   * `'armorScore'`, `'cost.power.0.perRank'`, `'movement-cost'`.
   */
  target: string;
  operation: EffectOperation;
  value: EffectValue;
  stackPolicy: StackPolicy;
  source: EffectSource;
  label: string;
  /** Defaults to `{ kind: 'always' }` when omitted. */
  condition?: EffectCondition;
  /** Ledger grouping; reuses the existing contribution category enum. */
  category?: ContributionCategory;
  /** Honest annotation when a rule's interpretation remains manual. */
  manualBoundary?: ContributionManualBoundary;
  details?: Record<string, unknown>;
}

/** A named bundle of effects plus grading metadata (frightened 2, exhaustion 3). */
export interface ConditionDescriptor {
  id: string;
  systemId: GameSystemId;
  label: string;
  /** Graded conditions carry a level/value; ungraded ones omit it. */
  value?: number;
  effects: EffectInstance[];
}

/** A terrain feature carries effects drawn from the same IR (functional terrain). */
export interface TerrainDescriptor {
  id: string;
  systemId: GameSystemId;
  /** e.g. `'deep-water'`, `'difficult'`, `'fog'`. */
  tag: string;
  label: string;
  effects: EffectInstance[];
}

/** An action intent, compiled to a request the resolver can fold. */
export interface ActionDescriptor {
  id: string;
  systemId: GameSystemId;
  /** e.g. `'attack'`, `'cast'`, `'use-feature'`, `'move'`. */
  kind: string;
  actorId: string;
  targetId?: string;
  inputs?: Record<string, unknown>;
}

/**
 * Build a stable, deterministic effect id from its identifying parts. Pure and
 * order-independent across runs so resolver output and ledgers replay
 * byte-identically.
 */
export function makeEffectId(...parts: Array<string | number | undefined | null>): string {
  return parts
    .filter((part) => part !== undefined && part !== null && part !== '')
    .join(':')
    .toLowerCase()
    .replace(/[^a-z0-9:.]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}
