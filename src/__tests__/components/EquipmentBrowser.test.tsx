import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { EquipmentBrowser } from '../../components/EquipmentBrowser';

const equipment = [
  {
    id: 'longsword',
    name: 'Longsword',
    type: 'weapon',
    rarity: 'common',
    cost: '15 gp',
    weight: 3,
    description: 'A martial melee weapon.',
    properties: ['versatile'],
  },
  {
    id: 'healing-potion',
    name: 'Potion of Healing',
    type: 'potion',
    rarity: 'uncommon',
    cost: '50 gp',
    weight: 0.5,
    description: 'Regain hit points when consumed.',
  },
];

describe('EquipmentBrowser', () => {
  it('renders equipment list and summary count', () => {
    render(<EquipmentBrowser equipment={equipment} />);

    expect(screen.getByText('Showing 2 of 2 items')).toBeInTheDocument();
    expect(screen.getByText('Longsword')).toBeInTheDocument();
    expect(screen.getByText('Potion of Healing')).toBeInTheDocument();
  });

  it('filters by search term and shows empty state when no match', async () => {
    const user = userEvent.setup();
    render(<EquipmentBrowser equipment={equipment} />);

    const search = screen.getByPlaceholderText('Search equipment...');
    await user.type(search, 'potion');
    expect(screen.getByText('Showing 1 of 2 items')).toBeInTheDocument();
    expect(screen.getByText('Potion of Healing')).toBeInTheDocument();
    expect(screen.queryByText('Longsword')).not.toBeInTheDocument();

    await user.clear(search);
    await user.type(search, 'nonexistent');
    expect(screen.getByText('No equipment found matching your criteria.')).toBeInTheDocument();
  });

  it('filters by type and rarity, then clears filters', async () => {
    const user = userEvent.setup();
    render(<EquipmentBrowser equipment={equipment} />);

    const [typeSelect, raritySelect] = screen.getAllByRole('combobox');

    fireEvent.change(typeSelect, { target: { value: 'weapon' } });
    expect(screen.getByText('Longsword')).toBeInTheDocument();
    expect(screen.queryByText('Potion of Healing')).not.toBeInTheDocument();

    fireEvent.change(raritySelect, { target: { value: 'common' } });
    expect(screen.getByText('Showing 1 of 2 items')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /clear filters/i }));
    expect(screen.getByText('Showing 2 of 2 items')).toBeInTheDocument();
  });

  it('calls selection callback when item is clicked', async () => {
    const user = userEvent.setup();
    const onSelectEquipment = vi.fn();

    render(<EquipmentBrowser equipment={equipment} onSelectEquipment={onSelectEquipment} />);

    await user.click(screen.getByText('Longsword'));

    expect(onSelectEquipment).toHaveBeenCalledTimes(1);
    expect(onSelectEquipment).toHaveBeenCalledWith(expect.objectContaining({ id: 'longsword' }));
  });

  it('exposes item cards as buttons selectable via keyboard', async () => {
    const user = userEvent.setup();
    const onSelectEquipment = vi.fn();

    render(<EquipmentBrowser equipment={equipment} onSelectEquipment={onSelectEquipment} />);

    const card = screen.getByRole('button', { name: /Longsword/ });
    card.focus();
    expect(card).toHaveFocus();
    await user.keyboard('{Enter}');

    expect(onSelectEquipment).toHaveBeenCalledTimes(1);
    expect(onSelectEquipment).toHaveBeenCalledWith(expect.objectContaining({ id: 'longsword' }));

    await user.keyboard(' ');
    expect(onSelectEquipment).toHaveBeenCalledTimes(2);
  });
});
