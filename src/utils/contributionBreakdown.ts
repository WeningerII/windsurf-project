/**
 * Pure helpers for rendering a contribution-ledger breakdown (the "why" behind a
 * derived value, e.g. "AC 16 = 10 base + 2 armor + 1 magic"). System-agnostic:
 * they operate on the shared {@link ContributionLedgerEntry} shape, so one
 * breakdown UI serves every system. The ledger is a non-persisted explanation —
 * these helpers never mutate it.
 */
import type {
  ContributionLedgerEntry,
  ContributionOperation,
} from '../types/core/contributionLedger';

/** The entries that explain a single target (e.g. 'armorClass'). */
export function entriesForTarget(
  entries: ContributionLedgerEntry[],
  target: string
): ContributionLedgerEntry[] {
  return entries.filter((entry) => entry.target === target);
}

/**
 * Fold numeric contributions, in order, into a single total — `set` establishes a
 * base and the rest combine (the additive-stacking shape used by AC, Evasion,
 * etc.). Returns null if any entry's value is non-numeric (a list/flag target
 * that does not sum), so the caller can fall back to listing instead of totalling.
 */
export function foldContributionTotal(entries: ContributionLedgerEntry[]): number | null {
  let total: number | null = null;
  for (const entry of entries) {
    if (typeof entry.value !== 'number') return null;
    const value = entry.value;
    switch (entry.operation) {
      case 'set':
        total = value;
        break;
      case 'add':
        total = (total ?? 0) + value;
        break;
      case 'subtract':
        total = (total ?? 0) - value;
        break;
      case 'multiply':
        total = (total ?? 0) * value;
        break;
      case 'max':
        total = total === null ? value : Math.max(total, value);
        break;
      case 'min':
        total = total === null ? value : Math.min(total, value);
        break;
    }
  }
  return total;
}

const OPERATION_PREFIX: Record<ContributionOperation, string> = {
  set: '',
  add: '+',
  subtract: '−',
  multiply: '×',
  max: '↑',
  min: '↓',
};

/** A short, signed display for one contribution's value (e.g. "+2", "10", "×2"). */
export function formatContributionValue(entry: ContributionLedgerEntry): string {
  const { operation, value } = entry;
  if (Array.isArray(value)) {
    return value.length > 0 ? `+${value.join(', ')}` : '—';
  }
  if (typeof value === 'number') {
    if (operation === 'add') {
      return `${value < 0 ? '−' : '+'}${Math.abs(value)}`;
    }
    return `${OPERATION_PREFIX[operation]}${operation === 'subtract' ? Math.abs(value) : value}`;
  }
  if (typeof value === 'boolean') {
    return value ? 'yes' : 'no';
  }
  if (value === null) {
    return '—';
  }
  return String(value);
}
