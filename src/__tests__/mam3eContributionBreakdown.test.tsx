import '@testing-library/jest-dom';
import { describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { MamPowersTab } from '../systems/mam3e/components/MamPowersTab';
import { buildMam3eContributionLedger } from '../systems/mam3e/contributionLedger';
import { createDefaultMam3eData, type Mam3eDataModel } from '../systems/mam3e/data-model';
import type { CharacterDocument } from '../types/core/document';
import type { Power } from '../types/mam/powers';

function damagePower(overrides: Partial<Power> = {}): Power {
  return {
    id: 'damage',
    name: 'Damage',
    system: 'mam3e',
    source: "Hero's Handbook",
    type: 'attack',
    action: 'standard',
    range: 'close',
    duration: 'instant',
    baseCost: 1,
    perRank: true,
    rank: 5,
    description: 'Damage effect.',
    effects: ['Damage'],
    ...overrides,
  };
}

/**
 * Surfaced contribution ledger (chosen parity direction): the M&M powers tab now
 * shows each power's per-rank cost breakdown — the M&M-idiomatic derived value
 * that extras and flaws modify — through the same shared ContributionBreakdown
 * disclosure 5e and Daggerheart use. Base 1 + Area (+2/rank) + Limited (−1/rank)
 * folds to 2 per rank.
 */
describe('M&M power cost contribution breakdown (powers tab)', () => {
  it("explains a power's per-rank cost from base, extras, and flaws", async () => {
    const user = userEvent.setup();
    const system: Mam3eDataModel = {
      ...createDefaultMam3eData(),
      powers: [
        damagePower({
          extras: ['area'],
          flaws: ['limited'],
          modifierRanks: { area: 2, limited: 1 },
        }),
      ],
    };
    const document = {
      id: 'c',
      name: 'Hero',
      systemId: 'mam3e',
      system,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as CharacterDocument<Mam3eDataModel>;
    const contributionEntries = buildMam3eContributionLedger(document).entries;

    render(
      <MamPowersTab
        document={document}
        canUpdate={false}
        contributionEntries={contributionEntries}
        extraModifiers={[]}
        flawModifiers={[]}
        modifierById={new Map()}
        onUpdatePowerRank={vi.fn()}
        onUpdatePowerBaseCost={vi.fn()}
        onChangeModifierRank={vi.fn()}
        onAddPowerModifier={vi.fn()}
        onRemovePowerModifier={vi.fn()}
        onRemovePower={vi.fn()}
        onAddPower={vi.fn()}
      />
    );

    const toggle = screen.getByRole('button', { name: /cost per rank/i });
    expect(toggle).toHaveTextContent('(2)');

    await user.click(toggle);
    const list = screen.getByRole('list', { name: /cost per rank contributions/i });
    expect(within(list).getByText('Area')).toBeInTheDocument();
    expect(within(list).getByText('Limited')).toBeInTheDocument();
  });
});
