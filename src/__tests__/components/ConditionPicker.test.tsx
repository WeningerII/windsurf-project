import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ConditionPicker } from '../../components/ConditionPicker';

const available = ['Blinded', 'Frightened', 'Stunned', 'Prone'];
const valued = new Set(['frightened', 'stunned']);

describe('ConditionPicker', () => {
  it('shows empty state when no conditions are active', () => {
    render(<ConditionPicker conditions={[]} availableConditions={available} />);
    expect(screen.getByText('Conditions')).toBeInTheDocument();
    expect(screen.getByText('No active conditions.')).toBeInTheDocument();
  });

  it('renders active conditions', () => {
    const conditions = [
      { id: 'blinded', name: 'Blinded' },
      { id: 'frightened', name: 'Frightened', value: 2 },
    ];
    render(<ConditionPicker conditions={conditions} availableConditions={available} />);
    expect(screen.getByText('Blinded')).toBeInTheDocument();
    expect(screen.getByText('Frightened')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('adds a condition via the Add flow', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <ConditionPicker
        conditions={[]}
        availableConditions={available}
        valuedConditions={valued}
        onChange={onChange}
      />
    );

    await user.click(screen.getByRole('button', { name: /add/i }));
    await user.click(screen.getByText('Frightened'));

    expect(onChange).toHaveBeenCalledTimes(1);
    const added = onChange.mock.calls[0][0];
    expect(added).toHaveLength(1);
    expect(added[0].name).toBe('Frightened');
    expect(added[0].value).toBe(1); // valued condition starts at 1
  });

  it('adds a non-valued condition without a value field', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <ConditionPicker
        conditions={[]}
        availableConditions={available}
        valuedConditions={valued}
        onChange={onChange}
      />
    );

    await user.click(screen.getByRole('button', { name: /add/i }));
    await user.click(screen.getByText('Prone'));

    const added = onChange.mock.calls[0][0];
    expect(added[0].value).toBeUndefined();
  });

  it('removes a condition when X is clicked', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const conditions = [{ id: 'blinded', name: 'Blinded' }];
    render(
      <ConditionPicker
        conditions={conditions}
        availableConditions={available}
        onChange={onChange}
      />
    );

    await user.click(screen.getByTitle('Remove condition'));
    expect(onChange).toHaveBeenCalledWith([]);
  });

  it('increments a valued condition', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const conditions = [{ id: 'frightened', name: 'Frightened', value: 2 }];
    render(
      <ConditionPicker
        conditions={conditions}
        availableConditions={available}
        onChange={onChange}
      />
    );

    await user.click(screen.getByTitle('Increase'));
    const updated = onChange.mock.calls[0][0];
    expect(updated[0].value).toBe(3);
  });

  it('decrements a valued condition but not below 0', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const conditions = [{ id: 'frightened', name: 'Frightened', value: 0 }];
    render(
      <ConditionPicker
        conditions={conditions}
        availableConditions={available}
        onChange={onChange}
      />
    );

    await user.click(screen.getByTitle('Decrease'));
    const updated = onChange.mock.calls[0][0];
    expect(updated[0].value).toBe(0);
  });

  it('hides Add button when onChange is not provided', () => {
    render(<ConditionPicker conditions={[]} availableConditions={available} />);
    expect(screen.queryByRole('button', { name: /add/i })).not.toBeInTheDocument();
  });
});
