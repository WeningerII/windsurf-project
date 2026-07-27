// purpose: Presentational "where did this number come from" popover for a
// derived value, driven by a ContributionLedgerResult.
//
// This is the render side of the contribution ledger (RFC 003): the per-system
// builders and `rules/ir/ledgerView` compute the entries, this component shows
// them. It is deliberately system-agnostic — it only reads the shared
// `ContributionLedgerEntry` shape, never a system data model — so it stays on
// the shared side of the lint-enforced layer boundary.
//
// Degradation is the contract: with no ledger, no rows for the target, or no
// numeric rows, it renders the plain value and no trigger at all. It never
// shows an empty breakdown shell.
import { useState } from 'react';
import type {
  ContributionLedgerEntry,
  ContributionLedgerResult,
} from '../../types/core/contributionLedger';

interface Props {
  /** Ledger `target` to explain, e.g. `'armorClass'`. */
  target: string;
  /** The value as the sheet already displays it. Always rendered. */
  total: number | string;
  /** Human label for the value, used in the breakdown heading. */
  label: string;
  /** Ledger for the whole character; may be absent while loading or unsupported. */
  ledger?: ContributionLedgerResult;
}

interface BreakdownRow {
  id: string;
  /** `''` for the opening term, otherwise `'+'`, `'-'`, `'x'`, `'max'`, `'min'`. */
  prefix: string;
  amount: string;
  /** Where the contribution came from (item, feature, class, ...). */
  source: string;
  /** What the contribution is. */
  detail: string;
}

/**
 * Ledger rows carry every value kind the IR can hold; only numeric ones can be
 * shown as an arithmetic breakdown. Non-numeric rows (proficiency string lists,
 * spell grants) belong to a different presentation and are skipped here.
 */
function toRow(entry: ContributionLedgerEntry, index: number): BreakdownRow | null {
  if (typeof entry.value !== 'number' || !Number.isFinite(entry.value)) {
    return null;
  }

  const magnitude = Math.abs(entry.value);
  let prefix: string;
  switch (entry.operation) {
    case 'set':
      // An opening `set` reads as the base term; a later one is a replacement.
      prefix = index === 0 ? '' : '=';
      break;
    case 'add':
      prefix = entry.value < 0 ? '-' : '+';
      break;
    case 'subtract':
      prefix = '-';
      break;
    case 'multiply':
      prefix = 'x';
      break;
    case 'max':
    case 'min':
      prefix = entry.operation;
      break;
    default:
      prefix = '+';
  }

  return {
    id: entry.id,
    prefix,
    amount: String(magnitude),
    source: entry.source.label,
    detail: entry.label,
  };
}

function buildRows(target: string, ledger?: ContributionLedgerResult): BreakdownRow[] {
  if (!ledger) {
    return [];
  }

  return ledger.entries
    .filter((entry) => entry.target === target)
    .map(toRow)
    .filter((row): row is BreakdownRow => row !== null);
}

function formulaOf(rows: BreakdownRow[]): string {
  return rows
    .map((row) =>
      row.prefix ? `${row.prefix} ${row.amount} ${row.source}` : `${row.amount} ${row.source}`
    )
    .join(' ');
}

/**
 * Renders `total`, plus a click-to-open breakdown when the ledger explains it.
 *
 * The panel is in-flow rather than absolutely positioned: stat cards clip their
 * overflow, and a clipped popover is worse than a card that grows.
 */
export function ContributionBreakdown({ target, total, label, ledger }: Props) {
  const [open, setOpen] = useState(false);
  const rows = buildRows(target, ledger);

  if (rows.length === 0) {
    return <>{total}</>;
  }

  const panelId = `contribution-breakdown-${target}`;

  return (
    <span className="flex flex-col items-center">
      <button
        type="button"
        onClick={() => setOpen((wasOpen) => !wasOpen)}
        aria-expanded={open}
        aria-controls={panelId}
        title={`${label} ${total} = ${formulaOf(rows)}`}
        className="tabular-nums underline decoration-dotted decoration-muted-foreground underline-offset-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
      >
        {total}
      </button>
      {open && (
        <span id={panelId} role="note" className="mt-2 block w-full text-left">
          <span className="block text-xs font-medium text-muted-foreground">
            {label} {total} = {formulaOf(rows)}
          </span>
          {rows.map((row) => (
            <span key={row.id} className="mt-1 flex items-baseline justify-between gap-2 text-xs">
              <span className="font-normal">
                {row.source}
                <span className="block text-[0.65rem] text-muted-foreground">{row.detail}</span>
              </span>
              <span className="tabular-nums font-semibold">
                {row.prefix ? `${row.prefix}${row.amount}` : row.amount}
              </span>
            </span>
          ))}
        </span>
      )}
    </span>
  );
}
