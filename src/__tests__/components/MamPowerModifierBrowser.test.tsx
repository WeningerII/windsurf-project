import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { MamPowerModifierBrowser } from '../../systems/mam3e/components/MamPowerModifierBrowser';
import { accurate } from '../../data/mutants-and-masterminds/3e/modifiers/extras';
import { activation } from '../../data/mutants-and-masterminds/3e/modifiers/flaws';

describe('MamPowerModifierBrowser', () => {
  it('renders modifier details and cost formatting', () => {
    render(<MamPowerModifierBrowser modifiers={[accurate, activation]} />);

    expect(screen.getByText('Accurate')).toBeInTheDocument();
    // Accurate is a flat extra (1 point per rank of Accurate — Hero's
    // Handbook, Extras), not +1 per effect rank.
    expect(screen.getByText('+1 flat')).toBeInTheDocument();
    expect(screen.getByText('Activation')).toBeInTheDocument();
    expect(screen.getByText('-1 flat')).toBeInTheDocument();
  });

  it('filters modifiers by type and search', async () => {
    const user = userEvent.setup();

    render(<MamPowerModifierBrowser modifiers={[accurate, activation]} />);

    await user.selectOptions(screen.getByLabelText(/filter modifiers by type/i), 'flaw');

    expect(screen.getByText('Activation')).toBeInTheDocument();
    expect(screen.queryByText('Accurate')).not.toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText(/filter modifiers by type/i), 'all');
    await user.type(screen.getByLabelText(/search modifiers/i), 'accurate');

    expect(screen.getByText('Accurate')).toBeInTheDocument();
    expect(screen.queryByText('Activation')).not.toBeInTheDocument();
  });
});
