/**
 * Ledger projection of the rules IR.
 *
 * See `docs/rfc/003-rules-ir-and-effects.md` (Accepted).
 *
 * The contribution ledger and the effect resolver read the SAME primitive. This
 * module provides the "explain a value" projection: it maps `EffectInstance[]`
 * (the resolver's input/output) onto the existing `ContributionLedgerEntry[]`
 * shape, so provenance and resolution are never two parallel computations.
 *
 * The IR's `operation` and `source.kind` are supersets of the ledger's, so a
 * handful of resolver-only operations are normalized down to the ledger enum.
 */

import type {
  ContributionLedgerEntry,
  ContributionLedgerResult,
  ContributionOperation,
  ContributionValue,
} from '../../types/core/contributionLedger';
import type { EffectInstance, EffectOperation, EffectValue } from './types';

/** Map a resolver operation onto the narrower ledger operation enum. */
function toLedgerOperation(operation: EffectOperation): ContributionOperation {
  switch (operation) {
    case 'add':
    case 'subtract':
    case 'multiply':
    case 'set':
    case 'min':
    case 'max':
      return operation;
    case 'add-die':
      // A rolled die contributes additively to its target.
      return 'add';
    case 'set-die':
      return 'set';
    case 'advantage':
    case 'disadvantage':
    case 'note':
      // No magnitude; surfaced as an additive zero-value annotation row.
      return 'add';
    default: {
      // Exhaustiveness guard: if a new operation is added, fail loudly here.
      const exhaustive: never = operation;
      return exhaustive;
    }
  }
}

/** Map an IR value onto a ledger value (the ledger has no `number[]` member). */
function toLedgerValue(value: EffectValue): ContributionValue {
  if (Array.isArray(value)) {
    return [...value];
  }
  return value;
}

/** Project a single effect instance into a ledger entry. */
export function effectToLedgerEntry(effect: EffectInstance): ContributionLedgerEntry {
  return {
    id: effect.id,
    systemId: effect.systemId,
    target: effect.target,
    source: {
      kind: effect.source.kind,
      label: effect.source.label,
      id: effect.source.id,
      path: effect.source.path,
    },
    label: effect.label,
    operation: toLedgerOperation(effect.operation),
    value: toLedgerValue(effect.value),
    category: effect.category ?? 'other',
    manualBoundary: effect.manualBoundary,
    details: effect.details,
  };
}

/** Project applied effect instances into a contribution ledger result. */
export function toContributionLedger(effects: readonly EffectInstance[]): ContributionLedgerResult {
  return { entries: effects.map(effectToLedgerEntry) };
}
