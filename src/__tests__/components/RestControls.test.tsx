import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { RestControls } from '../../components/RestControls';

describe('RestControls', () => {
  it('fires short and long rest callbacks', async () => {
    const user = userEvent.setup();
    const onShortRest = vi.fn();
    const onLongRest = vi.fn();

    render(<RestControls onShortRest={onShortRest} onLongRest={onLongRest} />);

    await user.click(screen.getByRole('button', { name: /short rest/i }));
    await user.click(screen.getByRole('button', { name: /long rest/i }));

    expect(onShortRest).toHaveBeenCalledTimes(1);
    expect(onLongRest).toHaveBeenCalledTimes(1);
  });

  it('disables rest buttons and the exhaustion input without callbacks', () => {
    render(<RestControls />);

    expect(screen.getByRole('button', { name: /short rest/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /long rest/i })).toBeDisabled();
    expect(screen.getByTitle('Exhaustion Level')).toBeDisabled();
  });

  it('clamps typed exhaustion to the 0..6 range used by the rules', () => {
    const onExhaustionChange = vi.fn();
    render(<RestControls exhaustionLevel={2} onExhaustionChange={onExhaustionChange} />);

    const input = screen.getByTitle('Exhaustion Level');

    fireEvent.change(input, { target: { value: '11' } });
    expect(onExhaustionChange).toHaveBeenLastCalledWith(6);

    fireEvent.change(input, { target: { value: '-4' } });
    expect(onExhaustionChange).toHaveBeenLastCalledWith(0);

    fireEvent.change(input, { target: { value: '3' } });
    expect(onExhaustionChange).toHaveBeenLastCalledWith(3);
  });

  it('clamps an out-of-range stored exhaustion level for display', () => {
    render(<RestControls exhaustionLevel={42} onExhaustionChange={vi.fn()} />);

    expect(screen.getByTitle('Exhaustion Level')).toHaveValue(6);
  });

  it('hides exhaustion when showExhaustion is false', () => {
    render(<RestControls showExhaustion={false} />);

    expect(screen.queryByTitle('Exhaustion Level')).not.toBeInTheDocument();
  });
});
