import {
  consume,
  remainingOf,
  reset,
  restore,
  spend,
  type ResourcePool,
} from '../../utils/resourcePool';
import type {
  ResourceIntent,
  ResourceIntentOutcome,
  ResourcePoolDescriptor,
  ResourcePoolList,
} from './types';

/**
 * The deterministic decision layer over RFC 005's pool verbs.
 *
 * RFC 002's contract is "the model proposes, deterministic validators decide,"
 * and a pool is where an AI-DM can most cheaply invent something: narrating a
 * third-level spell from a caster with no third-level slots left. The pool
 * primitive alone cannot stop that, because it CLAMPS — `spend` on an exhausted
 * pool returns the exhausted pool and no error, so the caller cannot tell a
 * spend that happened from one that did not.
 *
 * So this layer refuses in the direction that would create resources out of
 * nothing, and clamps in the direction that cannot:
 *
 * - `spend` / `consume` beyond what remains is REFUSED (`insufficient`). The
 *   proposal never half-applies.
 * - `restore` / `reset` past full CLAMP, and report what actually moved in
 *   `delta`. Refusing a rest that over-restores would be hostile and wrong —
 *   "recover 1d4 Stress" with 1 marked is a legal move, not an error.
 *
 * Pure and total: it reads an enumerated list, returns an outcome, and never
 * touches a document.
 */

function findPool(list: ResourcePoolList, poolId: string): ResourcePoolDescriptor | undefined {
  return list.pools.find((descriptor) => descriptor.id === poolId);
}

export function resolveResourceIntent(
  list: ResourcePoolList,
  intent: ResourceIntent
): ResourceIntentOutcome {
  const descriptor = findPool(list, intent.poolId);
  if (!descriptor) {
    return {
      ok: false,
      code: 'unknown-pool',
      reason: `${list.systemId} has no resource pool '${intent.poolId}'`,
    };
  }

  if (intent.amount !== undefined && !isPositiveInteger(intent.amount)) {
    return {
      ok: false,
      code: 'invalid-amount',
      reason: `Amount must be a positive whole number, got ${intent.amount}`,
    };
  }

  const before = descriptor.pool;
  const amount = intent.amount ?? 1;

  switch (intent.verb) {
    case 'spend':
    case 'consume': {
      const remaining = remainingOf(before);
      if (amount > remaining) {
        return {
          ok: false,
          code: 'insufficient',
          reason: `${descriptor.label}: ${remaining} remaining, ${amount} requested`,
        };
      }
      if (intent.verb === 'consume') {
        const result = consume(before, amount);
        return accepted(descriptor.id, before, result.pool, { depleted: result.depleted });
      }
      return accepted(descriptor.id, before, spend(before, amount));
    }
    case 'restore':
      return accepted(descriptor.id, before, restore(before, amount));
    case 'reset':
      return accepted(descriptor.id, before, reset(before));
    default:
      // Unreachable for a TYPED caller, and the whole point for an untyped one:
      // an AI-DM proposal is model-generated JSON, so `verb` is an arbitrary
      // string until this layer rules on it. Falling through here would return
      // `undefined` and make `outcome.ok` throw one frame up, turning the
      // validator into the crash it exists to prevent.
      return {
        ok: false,
        code: 'unsupported-verb',
        reason: `Unsupported resource verb '${String(intent.verb)}'`,
      };
  }
}

function isPositiveInteger(value: number): boolean {
  return Number.isInteger(value) && value > 0;
}

function accepted(
  poolId: string,
  before: ResourcePool,
  after: ResourcePool,
  extra?: { depleted: boolean }
): ResourceIntentOutcome {
  return {
    ok: true,
    poolId,
    pool: after,
    delta: Math.abs(after.spent - before.spent),
    ...extra,
  };
}
