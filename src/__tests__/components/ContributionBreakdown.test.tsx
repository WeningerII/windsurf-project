import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContributionBreakdown } from '../../components/sheet/ContributionBreakdown';
import type {
  ContributionLedgerEntry,
  ContributionLedgerResult,
} from '../../types/core/contributionLedger';

function entry(overrides: Partial<ContributionLedgerEntry>): ContributionLedgerEntry {
  return {
    id: 'entry',
    systemId: 'dnd-5e-2014',
    target: 'armorClass',
    source: { kind: 'system', label: 'Unarmored defense' },
    label: 'Unarmored base AC',
    operation: 'set',
    value: 10,
    category: 'defense',
    ...overrides,
  };
}

const ledger: ContributionLedgerResult = {
  entries: [
    entry({ id: 'base' }),
    entry({
      id: 'armor',
      source: { kind: 'item', label: 'Chain Shirt' },
      label: 'Equipped armor base AC',
      operation: 'add',
      value: 4,
    }),
    entry({
      id: 'dex',
      source: { kind: 'system', label: 'Dexterity modifier' },
      label: 'Dexterity AC contribution',
      operation: 'add',
      value: 2,
    }),
    entry({
      id: 'ring',
      source: { kind: 'item', label: 'Ring of Protection' },
      label: 'Magic item AC bonus',
      operation: 'add',
      value: 1,
    }),
    // Different target: must not leak into the armour-class breakdown.
    entry({
      id: 'save-dc',
      target: 'spellcasting.classes.wizard.spellSaveDc',
      operation: 'add',
      value: 3,
    }),
    // Non-numeric row: not expressible as arithmetic, so it is skipped.
    entry({
      id: 'proficiencies',
      target: 'armorClass',
      operation: 'add',
      value: ['heavy'],
      category: 'proficiency',
    }),
  ],
};

describe('ContributionBreakdown', () => {
  it('renders the plain value with no affordance when no ledger is available', () => {
    render(<ContributionBreakdown target="armorClass" total={17} label="Armor Class" />);

    expect(screen.getByText('17')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.queryByRole('note')).not.toBeInTheDocument();
  });

  it('renders the plain value when the ledger explains no matching target', () => {
    render(
      <ContributionBreakdown target="initiative" total={3} label="Initiative" ledger={ledger} />
    );

    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('summarizes the numeric contributions for the target in the trigger', () => {
    render(
      <ContributionBreakdown target="armorClass" total={17} label="Armor Class" ledger={ledger} />
    );

    const trigger = screen.getByRole('button');
    expect(trigger).toHaveAttribute(
      'title',
      'Armor Class 17 = 10 Unarmored defense + 4 Chain Shirt + 2 Dexterity modifier + 1 Ring of Protection'
    );
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('note')).not.toBeInTheDocument();
  });

  it('opens and closes a per-source breakdown on click', async () => {
    const user = userEvent.setup();
    render(
      <ContributionBreakdown target="armorClass" total={17} label="Armor Class" ledger={ledger} />
    );

    await user.click(screen.getByRole('button'));

    const panel = screen.getByRole('note');
    expect(panel).toHaveTextContent(
      'Armor Class 17 = 10 Unarmored defense + 4 Chain Shirt + 2 Dexterity modifier + 1 Ring of Protection'
    );
    expect(screen.getByText('Chain Shirt')).toBeInTheDocument();
    expect(screen.getByText('Equipped armor base AC')).toBeInTheDocument();
    expect(screen.getByText('+4')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    // Rows for other targets stay out of this breakdown.
    expect(screen.queryByText('+3')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button'));
    expect(screen.queryByRole('note')).not.toBeInTheDocument();
  });

  it('renders negative and non-additive contributions with their operator', async () => {
    const user = userEvent.setup();
    render(
      <ContributionBreakdown
        target="armorClass"
        total={9}
        label="Armor Class"
        ledger={{
          entries: [
            entry({ id: 'base' }),
            entry({
              id: 'penalty',
              source: { kind: 'condition', label: 'Sundered Plate' },
              label: 'Broken armor penalty',
              operation: 'add',
              value: -1,
            }),
          ],
        }}
      />
    );

    await user.click(screen.getByRole('button'));

    expect(screen.getByText('-1')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveAttribute(
      'title',
      'Armor Class 9 = 10 Unarmored defense - 1 Sundered Plate'
    );
  });
});
