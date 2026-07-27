// purpose: Make the 5e contribution ledger available to the sheet so derived
// values can explain themselves.
import { useEffect, useState } from 'react';
import type { ContributionLedgerResult } from '../../../types/core/contributionLedger';
import type { CharacterDocument } from '../../../types/core/document';
import { buildDnd5eContributionLedger } from './contributionLedger';
import type { Dnd5eLikeDataModel } from './dnd5eSheetShared';
import type { Dnd5eValidationSystemId } from './validation';

function ledgerSystemId(systemId: string): Dnd5eValidationSystemId | null {
  return systemId === 'dnd-5e-2014' || systemId === 'dnd-5e-2024' ? systemId : null;
}

/**
 * Builds the character's contribution ledger off the render path.
 *
 * The builder is async (it loads the class catalog), so the first paint has no
 * ledger and consumers must render the plain number until it resolves — which
 * is exactly how `ContributionBreakdown` already behaves. A build failure
 * clears the ledger rather than surfacing an error: provenance is an
 * enhancement on top of a number the sheet can already show.
 */
export function useDnd5eContributionLedger<T extends Dnd5eLikeDataModel>(
  document: CharacterDocument<T>
): ContributionLedgerResult | undefined {
  const [ledger, setLedger] = useState<ContributionLedgerResult | undefined>(undefined);
  const systemId = ledgerSystemId(document.systemId);
  const system = document.system;

  useEffect(() => {
    if (!systemId) {
      setLedger(undefined);
      return;
    }

    let cancelled = false;
    buildDnd5eContributionLedger(document, systemId)
      .then((result) => {
        if (!cancelled) {
          setLedger(result);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setLedger(undefined);
        }
      });

    return () => {
      cancelled = true;
    };
    // Re-derives whenever the character's system data changes; `document`
    // identity alone would rebuild on unrelated metadata edits.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [systemId, system]);

  return ledger;
}
