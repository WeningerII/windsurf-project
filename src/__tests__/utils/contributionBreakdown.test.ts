import { describe, expect, it } from 'vitest';

import {
  entriesForTarget,
  foldContributionTotal,
  formatContributionValue,
} from '../../utils/contributionBreakdown';
import type {
  ContributionLedgerEntry,
  ContributionOperation,
  ContributionValue,
} from '../../types/core/contributionLedger';

function entry(
  over: Partial<ContributionLedgerEntry> & {
    operation: ContributionOperation;
    value: ContributionValue;
  }
): ContributionLedgerEntry {
  return {
    id: over.id ?? 'e',
    systemId: 'dnd-5e-2024',
    target: over.target ?? 'armorClass',
    source: over.source ?? { kind: 'system', label: 'Source' },
    label: over.label ?? 'Contribution',
    category: over.category ?? 'defense',
    ...over,
  };
}

describe('entriesForTarget', () => {
  it('keeps only entries for the requested target', () => {
    const entries = [
      entry({ target: 'armorClass', operation: 'set', value: 10 }),
      entry({ target: 'initiative', operation: 'add', value: 2 }),
    ];
    expect(entriesForTarget(entries, 'armorClass')).toHaveLength(1);
    expect(entriesForTarget(entries, 'armorClass')[0].target).toBe('armorClass');
  });
});

describe('foldContributionTotal', () => {
  it('folds a set base plus additions (the AC shape)', () => {
    const total = foldContributionTotal([
      entry({ operation: 'set', value: 10 }),
      entry({ operation: 'add', value: 2 }),
      entry({ operation: 'add', value: 1 }),
    ]);
    expect(total).toBe(13);
  });

  it('applies subtract / multiply / max / min in order', () => {
    expect(
      foldContributionTotal([
        entry({ operation: 'set', value: 10 }),
        entry({ operation: 'subtract', value: 3 }),
      ])
    ).toBe(7);
    expect(
      foldContributionTotal([
        entry({ operation: 'set', value: 4 }),
        entry({ operation: 'multiply', value: 2 }),
      ])
    ).toBe(8);
    expect(
      foldContributionTotal([
        entry({ operation: 'set', value: 5 }),
        entry({ operation: 'max', value: 8 }),
        entry({ operation: 'min', value: 6 }),
      ])
    ).toBe(6);
  });

  it('returns null when any value is non-numeric (a list/flag target)', () => {
    expect(
      foldContributionTotal([
        entry({ operation: 'add', value: ['athletics', 'stealth'], category: 'proficiency' }),
      ])
    ).toBeNull();
    expect(foldContributionTotal([])).toBeNull();
  });
});

describe('formatContributionValue', () => {
  it('signs additions and shows a set base bare', () => {
    expect(formatContributionValue(entry({ operation: 'add', value: 2 }))).toBe('+2');
    expect(formatContributionValue(entry({ operation: 'add', value: -1 }))).toBe('−1');
    expect(formatContributionValue(entry({ operation: 'subtract', value: 3 }))).toBe('−3');
    expect(formatContributionValue(entry({ operation: 'set', value: 10 }))).toBe('10');
  });

  it('joins list values and handles flags', () => {
    expect(formatContributionValue(entry({ operation: 'add', value: ['light', 'medium'] }))).toBe(
      '+light, medium'
    );
    expect(formatContributionValue(entry({ operation: 'set', value: true }))).toBe('yes');
    expect(formatContributionValue(entry({ operation: 'set', value: null }))).toBe('—');
  });
});
