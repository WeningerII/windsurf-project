import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { DiceRollButton } from '../../components/DiceRollButton';

afterEach(() => {
  vi.useRealTimers();
});

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

  it('renders roll flavor when the engine returns contextual text', async () => {
    const user = userEvent.setup();
    const onRoll = vi.fn().mockResolvedValue({
      total: 16,
      formula: '2d12 + 2 (agility)',
      terms: [10, 4],
      flavor: 'Hope (10) vs Fear (4) with Hope!',
    });

    render(<DiceRollButton label="Agility" onRoll={onRoll} />);
    await user.click(screen.getByTitle('Roll Agility'));

    expect(await screen.findByText(/with Hope/i)).toBeInTheDocument();
  });

  it('shows an inline error instead of an unhandled rejection when the roll fails', async () => {
    const user = userEvent.setup();
    const onRoll = vi.fn().mockRejectedValue(new Error('engine exploded'));

    render(<DiceRollButton label="Doom" onRoll={onRoll} />);
    await user.click(screen.getByTitle('Roll Doom'));

    expect(await screen.findByRole('alert')).toHaveTextContent('Roll failed');
    // The button recovers and can be clicked again.
    expect(screen.getByTitle('Roll Doom')).toBeEnabled();
  });

  it('replaces the error with the result on a successful re-roll', async () => {
    const user = userEvent.setup();
    const onRoll = vi
      .fn()
      .mockRejectedValueOnce(new Error('boom'))
      .mockResolvedValueOnce({ total: 13, formula: '1d20', terms: [13] });

    render(<DiceRollButton label="Retry" onRoll={onRoll} />);

    await user.click(screen.getByTitle('Roll Retry'));
    expect(await screen.findByRole('alert')).toBeInTheDocument();

    await user.click(screen.getByTitle('Roll Retry'));
    expect(await screen.findByText('13')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('restarts the dismiss countdown when rolling again within the window', async () => {
    vi.useFakeTimers();
    const onRoll = vi
      .fn()
      .mockResolvedValueOnce({ total: 11, formula: '1d20', terms: [11] })
      .mockResolvedValueOnce({ total: 19, formula: '1d20', terms: [19] });

    render(<DiceRollButton label="Check" onRoll={onRoll} />);
    const button = screen.getByTitle('Roll Check');

    await act(async () => {
      fireEvent.click(button);
    });
    expect(screen.getByText('11')).toBeInTheDocument();

    // Re-roll 3 s into the first result's 4 s window.
    await act(async () => {
      vi.advanceTimersByTime(3000);
    });
    await act(async () => {
      fireEvent.click(button);
    });
    expect(screen.getByText('19')).toBeInTheDocument();

    // The first roll's timer would have fired at t=4s — the second result
    // must survive past that point.
    await act(async () => {
      vi.advanceTimersByTime(1500);
    });
    expect(screen.getByText('19')).toBeInTheDocument();

    // The restarted countdown expires 4 s after the second roll.
    await act(async () => {
      vi.advanceTimersByTime(2600);
    });
    expect(screen.queryByText('19')).not.toBeInTheDocument();
  });

  it('clears the pending dismiss timer on unmount', async () => {
    vi.useFakeTimers();
    const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout');
    const onRoll = vi.fn().mockResolvedValue({ total: 7, formula: '1d8', terms: [7] });

    const { unmount } = render(<DiceRollButton label="Cleanup" onRoll={onRoll} />);
    await act(async () => {
      fireEvent.click(screen.getByTitle('Roll Cleanup'));
    });
    expect(screen.getByText('7')).toBeInTheDocument();

    clearTimeoutSpy.mockClear();
    unmount();
    expect(clearTimeoutSpy).toHaveBeenCalled();

    // Nothing left scheduled: advancing time must not throw or update state.
    await act(async () => {
      vi.advanceTimersByTime(5000);
    });
  });
});
