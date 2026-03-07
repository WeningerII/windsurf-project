import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { HitDiceTracker } from '../../components/HitDiceTracker';

const sampleHitDice = [
  { die: 'd10', total: 5, remaining: 3 },
  { die: 'd6', total: 2, remaining: 2 },
];

describe('HitDiceTracker', () => {
  it('renders nothing when hitDice is empty', () => {
    const { container } = render(<HitDiceTracker hitDice={[]} />);
    expect(container.innerHTML).toBe('');
  });

  it('renders die types and remaining counts', () => {
    render(<HitDiceTracker hitDice={sampleHitDice} />);
    expect(screen.getByText('Hit Dice')).toBeInTheDocument();
    expect(screen.getByText('d10')).toBeInTheDocument();
    expect(screen.getByText('d6')).toBeInTheDocument();
    expect(screen.getByText('3/5')).toBeInTheDocument();
    expect(screen.getByText('2/2')).toBeInTheDocument();
  });

  it('calls onSpend when clicking a remaining die', async () => {
    const user = userEvent.setup();
    const onSpend = vi.fn();
    render(<HitDiceTracker hitDice={sampleHitDice} onSpend={onSpend} />);

    const spendButtons = screen.getAllByTitle('Spend d10');
    await user.click(spendButtons[0]);
    expect(onSpend).toHaveBeenCalledWith(0);
  });

  it('calls onRecover when clicking a spent die', async () => {
    const user = userEvent.setup();
    const onRecover = vi.fn();
    render(<HitDiceTracker hitDice={sampleHitDice} onRecover={onRecover} />);

    const recoverButtons = screen.getAllByTitle('Recover d10');
    await user.click(recoverButtons[0]);
    expect(onRecover).toHaveBeenCalledWith(0);
  });

  it('calls onLongRest when clicking Long Rest', async () => {
    const user = userEvent.setup();
    const onLongRest = vi.fn();
    render(<HitDiceTracker hitDice={sampleHitDice} onLongRest={onLongRest} />);

    await user.click(screen.getByText('Long Rest'));
    expect(onLongRest).toHaveBeenCalledTimes(1);
  });

  it('does not show Long Rest when onLongRest is not provided', () => {
    render(<HitDiceTracker hitDice={sampleHitDice} />);
    expect(screen.queryByText('Long Rest')).not.toBeInTheDocument();
  });
});
