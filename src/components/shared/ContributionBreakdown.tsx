/**
 * System-agnostic contribution breakdown — an accessible disclosure that explains
 * a derived value from its {@link ContributionLedgerEntry} rows ("AC 16 = 10 base
 * + 2 armor + 1 magic"). Any sheet can drop it onto a stat by passing that stat's
 * ledger entries; it names no system. The ledger is a non-persisted explanation,
 * so this is read-only.
 */
import { useId, useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

import type { ContributionLedgerEntry } from '../../types/core/contributionLedger';
import { foldContributionTotal, formatContributionValue } from '../../utils/contributionBreakdown';

interface ContributionBreakdownProps {
  /** Entries for ONE target (e.g. the result of `entriesForTarget(all, 'armorClass')`). */
  entries: ContributionLedgerEntry[];
  /** Optional heading for the disclosure toggle (defaults to "Breakdown"). */
  label?: string;
}

export function ContributionBreakdown({
  entries,
  label = 'Breakdown',
}: ContributionBreakdownProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  if (entries.length === 0) {
    return null;
  }

  const total = foldContributionTotal(entries);

  return (
    <div className="text-xs">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-controls={panelId}
        className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
      >
        {open ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
        <span>{label}</span>
        {total !== null && <span className="tabular-nums">({total})</span>}
      </button>
      {open && (
        <ul
          id={panelId}
          className="mt-1 space-y-0.5 border-l border-border/60 pl-2"
          aria-label={`${label} contributions`}
        >
          {entries.map((entry, index) => (
            <li key={`${entry.id}-${index}`} className="flex items-baseline justify-between gap-3">
              <span className="text-muted-foreground">{entry.source.label}</span>
              <span className="tabular-nums font-medium">{formatContributionValue(entry)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
