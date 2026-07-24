import { describe, expect, it } from 'vitest';

import { buildPf2eContributionLedger } from '../../../systems/pf2e/contributionLedger';
import { getPf2eConditionStatusPenalty } from '../../../rules';
import { createDefaultPf2eData, type Pf2eDataModel } from '../../../systems/pf2e/data-model';
import type { CharacterDocument } from '../../../types/core/document';
import type { ContributionLedgerEntry } from '../../../types/core/contributionLedger';

/**
 * Provenance verification for `buildPf2eContributionLedger` — PF2e's FIRST ledger
 * builder, re-backed onto the shared resolver via the W4 seam and the W5 condition
 * fold. The ledger is a non-persisted explanation projection, so these tests pin:
 *
 *   1. Additive — a bare character yields no rows (the resolver anchor property).
 *   2. Equipment provenance — a magic AC item projects an 'ac' row from the resolver.
 *   3. Condition differential equivalence — the folded status-penalty rows, summed
 *      per target, equal `getPf2eConditionStatusPenalty` (the engine's helper),
 *      with PF2e's worst-per-bucket stacking applied by the resolver.
 */

const TEST_DATE = new Date('2026-05-01T00:00:00.000Z');

function doc(over: Partial<Pf2eDataModel> = {}): CharacterDocument<Pf2eDataModel> {
  return {
    id: 'pf2e-ledger',
    name: 'PF2e Character',
    systemId: 'pf2e',
    system: { ...createDefaultPf2eData(), ...over },
    createdAt: TEST_DATE,
    updatedAt: TEST_DATE,
  };
}

const forTarget = (entries: ContributionLedgerEntry[], target: string): ContributionLedgerEntry[] =>
  entries.filter((entry) => entry.target === target);

const sumValues = (entries: ContributionLedgerEntry[]): number =>
  entries.reduce((total, entry) => total + (typeof entry.value === 'number' ? entry.value : 0), 0);

describe('buildPf2eContributionLedger', () => {
  it('additive: a bare character contributes no rows', () => {
    expect(buildPf2eContributionLedger(doc()).entries).toHaveLength(0);
  });

  it('projects an equipped magic AC item as an ac row from the resolver', () => {
    const { entries } = buildPf2eContributionLedger(
      doc({
        equipment: [
          {
            itemId: 'armor-potency',
            name: '+1 Armor Potency',
            bulk: 0,
            equipped: true,
            acBonus: 1,
          },
        ],
      })
    );
    const acRows = forTarget(entries, 'ac');
    expect(acRows).toHaveLength(1);
    expect(acRows[0].source.id).toBe('armor-potency');
    expect(acRows[0].operation).toBe('add');
    expect(acRows[0].value).toBe(1);
  });

  it('DIFFERENTIAL: folded status-penalty rows equal getPf2eConditionStatusPenalty', () => {
    const conditions = [
      { id: 'frightened', name: 'Frightened', value: 2 },
      { id: 'sickened', name: 'Sickened', value: 1 },
      { id: 'clumsy', name: 'Clumsy', value: 3 },
    ];
    const { entries } = buildPf2eContributionLedger(doc({ conditions }));

    // 'all'-scoped conditions land on 'check'; clumsy on 'check.dex'. The resolver
    // takes the single worst pf2e-status penalty per target, but the ledger keeps
    // EVERY contributing row for provenance — so parity is asserted through the
    // helper, which itself selects the worst, matched against the max row value.
    const checkRows = forTarget(entries, 'check');
    const dexRows = forTarget(entries, 'check.dex');
    expect(checkRows.length).toBeGreaterThan(0);
    for (const row of [...checkRows, ...dexRows]) {
      expect(row.source.kind).toBe('condition');
      expect(row.operation).toBe('subtract');
    }
    // The worst 'all' penalty equals the helper's ability-less selection.
    expect(Math.max(...checkRows.map((r) => Number(r.value)))).toBe(
      getPf2eConditionStatusPenalty(conditions)
    );
    // Dex-scoped: worst of the 'all' rows and the dex row equals helper('dex').
    expect(Math.max(...[...checkRows, ...dexRows].map((r) => Number(r.value)))).toBe(
      getPf2eConditionStatusPenalty(conditions, 'dex')
    );
  });

  it('value-less conditions contribute no rows (additive over inactive states)', () => {
    // A named-but-zero condition and a non-value condition emit nothing.
    const { entries } = buildPf2eContributionLedger(
      doc({ conditions: [{ id: 'prone', name: 'Prone' }] })
    );
    expect(sumValues(entries)).toBe(0);
    expect(entries).toHaveLength(0);
  });
});
