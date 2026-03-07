import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { SpellSlotTracker } from '../../components/SpellSlotTracker';
import type { SpellSlots } from '../../types/core/character';

const emptySlots: SpellSlots = {
  1: { max: 0, used: 0 },
  2: { max: 0, used: 0 },
  3: { max: 0, used: 0 },
  4: { max: 0, used: 0 },
  5: { max: 0, used: 0 },
  6: { max: 0, used: 0 },
  7: { max: 0, used: 0 },
  8: { max: 0, used: 0 },
  9: { max: 0, used: 0 },
};

const sampleSlots: SpellSlots = {
  ...emptySlots,
  1: { max: 4, used: 1 },
  2: { max: 3, used: 0 },
  3: { max: 2, used: 2 },
};

describe('SpellSlotTracker', () => {
  it('renders nothing when all slots have max 0', () => {
    const { container } = render(<SpellSlotTracker slots={emptySlots} />);
    expect(container.innerHTML).toBe('');
  });

  it('renders slot levels that have max > 0', () => {
    render(<SpellSlotTracker slots={sampleSlots} />);
    expect(screen.getByText('Spell Slots')).toBeInTheDocument();
    expect(screen.getByText('Lvl 1')).toBeInTheDocument();
    expect(screen.getByText('Lvl 2')).toBeInTheDocument();
    expect(screen.getByText('Lvl 3')).toBeInTheDocument();
    expect(screen.queryByText('Lvl 4')).not.toBeInTheDocument();
  });

  it('displays remaining/max counts', () => {
    render(<SpellSlotTracker slots={sampleSlots} />);
    expect(screen.getByText('3/4')).toBeInTheDocument(); // level 1: 4 max - 1 used = 3
    expect(screen.getByText('3/3')).toBeInTheDocument(); // level 2: all available
    expect(screen.getByText('0/2')).toBeInTheDocument(); // level 3: all used
  });

  it('calls onUseSlot when clicking an available slot', async () => {
    const user = userEvent.setup();
    const onUseSlot = vi.fn();
    render(<SpellSlotTracker slots={sampleSlots} onUseSlot={onUseSlot} />);

    const useButtons = screen.getAllByTitle('Use level 1 slot');
    await user.click(useButtons[0]);
    expect(onUseSlot).toHaveBeenCalledWith(1);
  });

  it('calls onRecoverSlot when clicking a used slot', async () => {
    const user = userEvent.setup();
    const onRecoverSlot = vi.fn();
    render(<SpellSlotTracker slots={sampleSlots} onRecoverSlot={onRecoverSlot} />);

    const recoverButtons = screen.getAllByTitle('Recover level 3 slot');
    await user.click(recoverButtons[0]);
    expect(onRecoverSlot).toHaveBeenCalledWith(3);
  });

  it('calls onRecoverAll when clicking Recover All', async () => {
    const user = userEvent.setup();
    const onRecoverAll = vi.fn();
    render(<SpellSlotTracker slots={sampleSlots} onRecoverAll={onRecoverAll} />);

    await user.click(screen.getByText('Recover All'));
    expect(onRecoverAll).toHaveBeenCalledTimes(1);
  });

  it('does not show Recover All when onRecoverAll is not provided', () => {
    render(<SpellSlotTracker slots={sampleSlots} />);
    expect(screen.queryByText('Recover All')).not.toBeInTheDocument();
  });
});
