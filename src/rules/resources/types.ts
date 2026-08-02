import type { ResourcePool } from '../../utils/resourcePool';

/**
 * The stateful counterpart to the legal-actions seam (`src/registry/types.ts`).
 *
 * RFC 003's legal-actions seam enumerates what a build MAY do; RFC 005's pool
 * primitive (`src/utils/resourcePool.ts`) knows how to move a bounded counter.
 * Neither answers "which counters does THIS character have, and may this
 * proposed spend actually happen" — so every caller that wanted to change a
 * resource had to know a system's data model by hand. That is the gap RFC 005's
 * remaining future-work item names: "a generic per-pool registry so a UI stepper
 * and an AI-DM action drive the same code path."
 *
 * The contract is deliberately system-agnostic and privileges no vocabulary.
 * A pool is a pool whether it counts 5e spell slots, PF2e focus points, or
 * Daggerheart Stress — the canonical `{ max, spent }` shape already absorbs the
 * direction each system displays (Stress counts UP as it is spent; a spell slot
 * counts used-of-total; focus counts remaining-of-max), so `spend` means the
 * same thing in all three.
 */

/** The verbs of RFC 005, as a proposable intent. */
export type ResourceVerb = 'spend' | 'restore' | 'reset' | 'consume';

/**
 * One depletable pool a character has right now. Descriptors are data, not
 * behavior: they name and measure a pool but never mutate it — application is
 * the owning system's job (see `SystemResourcePoolsProvider`).
 */
export interface ResourcePoolDescriptor {
  /** Stable id, unique within a list (e.g. `'dnd5e:spell-slot:3'`). */
  id: string;
  /** The system's own resource taxonomy — NOT a cross-system enum. */
  kind: string;
  /** Human-readable name, in the system's own rule vocabulary. */
  label: string;
  /** Canonical `{ max, spent }` view; see `src/utils/resourcePool.ts`. */
  pool: ResourcePool;
}

/** The enumerated pools of one document. */
export interface ResourcePoolList {
  /** systemId that produced this list. */
  systemId: string;
  pools: ResourcePoolDescriptor[];
}

/** Framing passed to a provider; the registry stamps the system id. */
export interface ResourcePoolsContext {
  systemId: string;
}

/**
 * A proposed change to one pool. This is the unit a UI stepper emits and an
 * AI-DM proposes — identical shape, so both reach the same validator.
 */
export interface ResourceIntent {
  poolId: string;
  verb: ResourceVerb;
  /** Units to move; defaults to 1. Ignored by `reset`. */
  amount?: number;
}

/**
 * Why an intent was refused.
 *
 * - `unknown-pool` — no pool with that id on this document.
 * - `invalid-amount` — not a positive integer. Fractions are REFUSED rather than
 *   truncated: `clampCount` would silently turn a proposed 1.5 into 1, and a
 *   caller that meant 1.5 has a bug the pool layer must not launder.
 * - `insufficient` — the spend exceeds what remains.
 * - `unsupported-verb` — not one of RFC 005's four verbs. Reachable only from an
 *   UNTYPED caller, which is exactly the caller this seam exists for: an AI-DM
 *   proposal arrives as model-generated JSON, so `verb` is a string until this
 *   layer says otherwise. Refusing it keeps the resolver total — every other
 *   malformed input already returns a typed rejection rather than throwing.
 */
export type ResourceRejectionCode =
  | 'unknown-pool'
  | 'invalid-amount'
  | 'insufficient'
  | 'unsupported-verb';

export interface ResourceIntentAccepted {
  ok: true;
  poolId: string;
  /** The pool AFTER the verb; the value a provider writes back. */
  pool: ResourcePool;
  /**
   * How much `spent` actually moved (always >= 0). Not derivable from the
   * request: `restore`/`reset` clamp, so a restore of 3 against 1 spent point
   * reports 1. Spends never clamp (an over-spend is refused), so for those it
   * always equals the requested amount.
   */
  delta: number;
  /**
   * Present ONLY for `consume` — the exhaustion signal RFC 005 deliberately
   * kept off `spend`, so the common case (a spell slot, refilled on rest) never
   * carries a flag it must ignore. `true` means the caller should destroy the
   * bearer (the last arrow, potion, or wand charge).
   */
  depleted?: boolean;
}

export interface ResourceIntentRejected {
  ok: false;
  code: ResourceRejectionCode;
  /** Human-readable refusal, safe to surface to a player or an AI-DM. */
  reason: string;
}

export type ResourceIntentOutcome = ResourceIntentAccepted | ResourceIntentRejected;

/**
 * A resolved pool handed back to its owning system for persistence. The system
 * does no arithmetic — it only knows WHERE the id lives in its data model.
 */
export interface ResourcePoolChange {
  poolId: string;
  pool: ResourcePool;
}
