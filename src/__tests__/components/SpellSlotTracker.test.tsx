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

  describe('pact magic', () => {
    it('renders a labeled Pact Magic row with the shared slot level', () => {
      render(<SpellSlotTracker slots={emptySlots} pactMagic={{ level: 3, max: 2, used: 1 }} />);
      expect(screen.getByText('Spell Slots')).toBeInTheDocument();
      expect(screen.getByText('Pact Magic (Lvl 3)')).toBeInTheDocument();
      expect(screen.getByText('1/2')).toBeInTheDocument(); // 2 max - 1 used
    });

    it('renders for a pure warlock even when all standard slots are 0', () => {
      const { container } = render(
        <SpellSlotTracker slots={emptySlots} pactMagic={{ level: 1, max: 1, used: 0 }} />
      );
      expect(container.innerHTML).not.toBe('');
      expect(screen.queryByText('Lvl 1')).not.toBeInTheDocument(); // no standard rows
    });

    it('renders nothing when both standard and pact slots are empty', () => {
      const { container } = render(
        <SpellSlotTracker slots={emptySlots} pactMagic={{ level: 1, max: 0, used: 0 }} />
      );
      expect(container.innerHTML).toBe('');
    });

    it('calls onUsePactSlot / onRecoverPactSlot from the pact row', async () => {
      const user = userEvent.setup();
      const onUsePactSlot = vi.fn();
      const onRecoverPactSlot = vi.fn();
      render(
        <SpellSlotTracker
          slots={emptySlots}
          pactMagic={{ level: 2, max: 2, used: 1 }}
          onUsePactSlot={onUsePactSlot}
          onRecoverPactSlot={onRecoverPactSlot}
        />
      );

      await user.click(screen.getByTitle('Use pact slot'));
      expect(onUsePactSlot).toHaveBeenCalledTimes(1);

      await user.click(screen.getByTitle('Recover pact slot'));
      expect(onRecoverPactSlot).toHaveBeenCalledTimes(1);
    });
  });
});
