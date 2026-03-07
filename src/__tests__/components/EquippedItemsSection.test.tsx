import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EquippedItemsSection } from '../../components/EquippedItemsSection';
import type { EquippedItem } from '../../types/core/character';

const armor: EquippedItem = {
  itemId: 'chain-mail',
  slot: 'chest',
  attuned: false,
  customName: 'Chain Mail',
  armorClass: 16,
  armorType: 'heavy',
};

const shield: EquippedItem = {
  itemId: 'shield',
  slot: 'offHand',
  attuned: true,
  shieldBonus: 2,
};

describe('EquippedItemsSection', () => {
  it('renders empty slots when nothing is equipped', () => {
    render(<EquippedItemsSection equipment={[]} />);

    expect(screen.getByText('Equipped Items')).toBeInTheDocument();
    expect(screen.queryByText(/\(0 equipped\)/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/attuned/i)).not.toBeInTheDocument();
    expect(screen.getAllByText('Empty')).toHaveLength(11);
  });

  it('renders equipped items and fires unequip and attunement actions', async () => {
    const user = userEvent.setup();
    const onUnequip = vi.fn();
    const onToggleAttune = vi.fn();

    render(
      <EquippedItemsSection
        equipment={[armor, shield]}
        onUnequip={onUnequip}
        onToggleAttune={onToggleAttune}
      />
    );

    expect(screen.getByText('(2 equipped)')).toBeInTheDocument();
    expect(screen.getByText('1/3 attuned')).toBeInTheDocument();
    expect(screen.getByText('Chain Mail')).toBeInTheDocument();
    expect(screen.getByText('AC 16')).toBeInTheDocument();
    expect(screen.getByText('+2 Shield')).toBeInTheDocument();
    expect(screen.getByText('heavy')).toBeInTheDocument();

    await user.click(screen.getAllByTitle('Unequip')[0]);
    await user.click(screen.getByTitle('Attune'));
    await user.click(screen.getByTitle('Unattune'));

    expect(onUnequip).toHaveBeenCalledWith('chain-mail');
    expect(onToggleAttune).toHaveBeenCalledWith('chain-mail');
    expect(onToggleAttune).toHaveBeenCalledWith('shield');
  });

  it('omits action buttons when callbacks are not provided', () => {
    render(<EquippedItemsSection equipment={[armor]} />);

    expect(screen.queryByTitle('Unequip')).not.toBeInTheDocument();
    expect(screen.queryByTitle('Attune')).not.toBeInTheDocument();
    expect(screen.queryByTitle('Unattune')).not.toBeInTheDocument();
  });
});
