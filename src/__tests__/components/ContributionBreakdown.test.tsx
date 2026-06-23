import '@testing-library/jest-dom';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ContributionBreakdown } from '../../components/shared/ContributionBreakdown';
import type { ContributionLedgerEntry } from '../../types/core/contributionLedger';

const AC_ENTRIES: ContributionLedgerEntry[] = [
  {
    id: 'ac-base',
    systemId: 'dnd-5e-2024',
    target: 'armorClass',
    source: { kind: 'item', label: 'Chain Mail' },
    label: 'Equipped armor base AC',
    operation: 'set',
    value: 16,
    category: 'defense',
  },
  {
    id: 'ac-shield',
    systemId: 'dnd-5e-2024',
    target: 'armorClass',
    source: { kind: 'item', label: 'Shield' },
    label: 'Shield AC bonus',
    operation: 'add',
    value: 2,
    category: 'defense',
  },
];

describe('ContributionBreakdown', () => {
  it('renders nothing when there are no entries', () => {
    const { container } = render(<ContributionBreakdown entries={[]} label="Armor Class" />);
    expect(container).toBeEmptyDOMElement();
  });

  it('shows the folded total in the toggle and reveals contributions when expanded', async () => {
    const user = userEvent.setup();
    render(<ContributionBreakdown entries={AC_ENTRIES} label="Armor Class" />);

    // Collapsed: the toggle shows the label + folded total (16 + 2 = 18); rows hidden.
    const toggle = screen.getByRole('button', { name: /armor class/i });
    expect(toggle).toHaveTextContent('(18)');
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('Chain Mail')).not.toBeInTheDocument();

    await user.click(toggle);

    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Chain Mail')).toBeInTheDocument();
    expect(screen.getByText('16')).toBeInTheDocument();
    expect(screen.getByText('Shield')).toBeInTheDocument();
    expect(screen.getByText('+2')).toBeInTheDocument();
  });
});
