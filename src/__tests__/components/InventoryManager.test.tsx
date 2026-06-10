import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../utils/browserCompat', () => ({
  generateUUID: vi.fn(() => 'generated-item-id'),
}));

import { InventoryManager } from '../../components/InventoryManager';

const existingItems = [
  {
    id: 'rope',
    name: 'Hempen Rope',
    quantity: 2,
    weight: 10,
    value: '1 gp',
    description: '50 ft. hempen rope',
  },
];

describe('InventoryManager', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders existing inventory and total weight', () => {
    render(<InventoryManager items={existingItems} />);

    expect(screen.getByText('Inventory')).toBeInTheDocument();
    expect(screen.getByText('1 items • 20.0 lbs')).toBeInTheDocument();
    expect(screen.getByText('Hempen Rope')).toBeInTheDocument();
  });

  it('shows empty state when inventory has no items', () => {
    render(<InventoryManager items={[]} />);
    expect(screen.getByText('No items in inventory. Add one to get started!')).toBeInTheDocument();
  });

  it('adds an item through the add form and parses numeric fields', async () => {
    const user = userEvent.setup();
    const onAddItem = vi.fn();

    render(<InventoryManager items={[]} onAddItem={onAddItem} />);

    await user.click(screen.getByRole('button', { name: /add item/i }));

    await user.type(screen.getByPlaceholderText('e.g., Longsword'), 'Torch');

    const quantityInput = screen.getByDisplayValue('1');
    fireEvent.change(quantityInput, { target: { value: '2' } });

    const weightInput = screen.getByDisplayValue('0');
    fireEvent.change(weightInput, { target: { value: '1.5' } });

    fireEvent.change(screen.getByPlaceholderText('e.g., 15 gp'), {
      target: { value: '1 cp' },
    });
    await user.type(screen.getByPlaceholderText('Optional description'), 'Provides light');

    const addButtons = screen.getAllByRole('button', { name: /^add item$/i });
    await user.click(addButtons[1]);

    expect(onAddItem).toHaveBeenCalledTimes(1);
    expect(onAddItem).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'generated-item-id',
        name: 'Torch',
        quantity: 2,
        weight: 1.5,
        value: '1 cp',
        description: 'Provides light',
      })
    );
  });

  it('clamps typed quantity to at least 1 and weight to at least 0', async () => {
    const user = userEvent.setup();
    const onAddItem = vi.fn();

    render(<InventoryManager items={[]} onAddItem={onAddItem} />);

    await user.click(screen.getByRole('button', { name: /add item/i }));
    await user.type(screen.getByPlaceholderText('e.g., Longsword'), 'Cursed Anvil');

    const quantityInput = screen.getByDisplayValue('1');
    fireEvent.change(quantityInput, { target: { value: '-3' } });
    expect(quantityInput).toHaveValue(1);

    const weightInput = screen.getByDisplayValue('0');
    fireEvent.change(weightInput, { target: { value: '-12.5' } });
    expect(weightInput).toHaveValue(0);

    const addButtons = screen.getAllByRole('button', { name: /^add item$/i });
    await user.click(addButtons[1]);

    expect(onAddItem).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Cursed Anvil', quantity: 1, weight: 0 })
    );
  });

  it('removes an item when remove button is clicked', async () => {
    const user = userEvent.setup();
    const onRemoveItem = vi.fn();

    render(<InventoryManager items={existingItems} onRemoveItem={onRemoveItem} />);

    await user.click(screen.getByTitle('Remove item'));

    expect(onRemoveItem).toHaveBeenCalledWith('rope');
  });

  it('can cancel the add form', async () => {
    const user = userEvent.setup();

    render(<InventoryManager items={[]} />);

    await user.click(screen.getByRole('button', { name: /add item/i }));
    expect(screen.getByText('Item Name')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /^cancel$/i }));
    expect(screen.queryByText('Item Name')).not.toBeInTheDocument();
  });
});
