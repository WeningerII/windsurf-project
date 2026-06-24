import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import * as ledgerBuilder from '../systems/dnd5e/shared/contributionLedger';
import { useDnd5eContributionLedger } from '../systems/dnd5e/shared/useDnd5eContributionLedger';
import { createDefaultDnd5eData } from '../systems/dnd5e/data-model';
import type { CharacterDocument } from '../types/core/document';
import type { ContributionLedgerEntry } from '../types/core/contributionLedger';

function makeDoc(): CharacterDocument<ReturnType<typeof createDefaultDnd5eData>> {
  return {
    id: 'ledger-hook',
    name: 'Hero',
    systemId: 'dnd-5e-2014',
    system: createDefaultDnd5eData(),
    createdAt: new Date('2026-05-01T00:00:00.000Z'),
    updatedAt: new Date('2026-05-01T00:00:00.000Z'),
  } as CharacterDocument<ReturnType<typeof createDefaultDnd5eData>>;
}

describe('useDnd5eContributionLedger', () => {
  it('exposes the built entries once the async build resolves', async () => {
    const entry: ContributionLedgerEntry = {
      id: 'ac-base',
      systemId: 'dnd-5e-2014',
      target: 'armorClass',
      source: { kind: 'system', label: 'Unarmored defense' },
      label: 'Unarmored base AC',
      operation: 'set',
      value: 10,
      category: 'defense',
    };
    const spy = vi
      .spyOn(ledgerBuilder, 'buildDnd5eContributionLedger')
      .mockResolvedValue({ entries: [entry] });

    const { result } = renderHook(() => useDnd5eContributionLedger(makeDoc(), 'dnd-5e-2014'));

    await waitFor(() => expect(result.current).toHaveLength(1));
    expect(result.current[0]).toMatchObject({ target: 'armorClass', value: 10 });
    spy.mockRestore();
  });

  it('stays empty (no unhandled rejection) when the async build rejects', async () => {
    const spy = vi
      .spyOn(ledgerBuilder, 'buildDnd5eContributionLedger')
      .mockRejectedValue(new Error('class catalog load failed'));

    const { result } = renderHook(() => useDnd5eContributionLedger(makeDoc(), 'dnd-5e-2014'));

    // The .catch swallows the failure and leaves the breakdown empty; the assertion
    // would surface any unhandled rejection as a test failure.
    await waitFor(() => expect(ledgerBuilder.buildDnd5eContributionLedger).toHaveBeenCalled());
    expect(result.current).toEqual([]);
    spy.mockRestore();
  });
});
