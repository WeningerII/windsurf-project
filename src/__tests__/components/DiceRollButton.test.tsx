import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { DiceRollButton } from '../../components/DiceRollButton';

describe('DiceRollButton', () => {
  it('calls onRoll and renders the result popover', async () => {
    const user = userEvent.setup();
    const onRoll = vi.fn().mockResolvedValue({
      total: 17,
      formula: '1d20 + 5',
      terms: [12, 5],
    });

    render(<DiceRollButton label="Athletics" onRoll={onRoll} />);
    await user.click(screen.getByTitle('Roll Athletics'));

    expect(onRoll).toHaveBeenCalledTimes(1);
    expect(await screen.findByText('17')).toBeInTheDocument();
    expect(screen.getByText('(1d20 + 5)')).toBeInTheDocument();
  });

  it('shows critical marker for natural 20 results', async () => {
    const user = userEvent.setup();
    const onRoll = vi.fn().mockResolvedValue({
      total: 25,
      formula: '1d20 + 5',
      terms: [20, 5],
      isCritical: true,
    });

    render(<DiceRollButton label="Attack" onRoll={onRoll} />);
    await user.click(screen.getByTitle('Roll Attack'));

    expect(await screen.findByText('NAT 20!')).toBeInTheDocument();
  });

  it('shows fumble marker for natural 1 results', async () => {
    const user = userEvent.setup();
    const onRoll = vi.fn().mockResolvedValue({
      total: 2,
      formula: '1d20 + 1',
      terms: [1, 1],
      isFumble: true,
    });

    render(<DiceRollButton label="Save" onRoll={onRoll} />);
    await user.click(screen.getByTitle('Roll Save'));

    expect(await screen.findByText('NAT 1!')).toBeInTheDocument();
  });
});
