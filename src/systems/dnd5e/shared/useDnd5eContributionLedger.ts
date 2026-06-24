/**
 * Builds the 5e contribution ledger for the current document so the sheet can show
 * derived-value breakdowns (e.g. AC). The builder is async (it loads the class
 * catalog and runs the effect resolver), so it lives in a hook the controller
 * exposes — the budget-capped host stays free of loaders/state. Entries are
 * non-persisted explanation rows; this never writes back to the document.
 */
import { useEffect, useState } from 'react';

import type { CharacterDocument } from '../../../types/core/document';
import type { ContributionLedgerEntry } from '../../../types/core/contributionLedger';
import { buildDnd5eContributionLedger } from './contributionLedger';
import type { Dnd5eLikeDataModel } from './dnd5eSheetShared';
import type { Dnd5eValidationSystemId } from './validation';

export function useDnd5eContributionLedger<T extends Dnd5eLikeDataModel>(
  document: CharacterDocument<T>,
  systemId: Dnd5eValidationSystemId
): ContributionLedgerEntry[] {
  const [entries, setEntries] = useState<ContributionLedgerEntry[]>([]);

  useEffect(() => {
    let cancelled = false;
    buildDnd5eContributionLedger(document, systemId)
      .then((result) => {
        if (!cancelled) {
          setEntries(result.entries);
        }
      })
      .catch(() => {
        // The ledger is a non-persisted display aid that loads the class catalog
        // and runs the effect resolver. If that async build fails, leave the
        // breakdown empty rather than leak an unhandled rejection.
        if (!cancelled) {
          setEntries([]);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [document, systemId]);

  return entries;
}
