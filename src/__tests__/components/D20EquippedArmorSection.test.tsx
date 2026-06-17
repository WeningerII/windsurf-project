import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { D20EquippedArmorSection } from '../../systems/d20-legacy/components/D20EquippedArmorSection';
import type { Item } from '../../types/equipment/items';

const fullPlate = {
  id: 'full-plate',
  name: 'Full Plate',
  type: 'armor',
  armorClass: 8,
  armorType: 'heavy',
  dexBonusMax: 1,
  armorCheckPenalty: -6,
} as unknown as Item;

const heavyShield = {
  id: 'heavy-steel-shield',
  name: 'Heavy Steel Shield',
  type: 'shield',
  shieldBonus: 2,
  armorCheckPenalty: -2,
} as unknown as Item;

function renderSection(
  overrides: Partial<React.ComponentProps<typeof D20EquippedArmorSection>> = {}
) {
  const props = {
    equipmentItems: [fullPlate, heavyShield],
    equipment: [],
    canUpdate: true,
    onEquipArmor: vi.fn(),
    onEquipShield: vi.fn(),
    onUnequipArmor: vi.fn(),
    onUnequipShield: vi.fn(),
    ...overrides,
  };
  render(<D20EquippedArmorSection {...props} />);
  return props;
}

describe('D20EquippedArmorSection', () => {
  it('equips a selected armor with its mapped catalog stats', () => {
    const props = renderSection();
    fireEvent.change(screen.getByLabelText('Armor'), { target: { value: 'full-plate' } });
    expect(props.onEquipArmor).toHaveBeenCalledWith({
      id: 'full-plate',
      name: 'Full Plate',
      armorClass: 8,
      armorType: 'heavy',
      dexBonusMax: 1,
      armorCheckPenalty: -6,
    });
  });

  it('equips a selected shield with its bonus and check penalty', () => {
    const props = renderSection();
    fireEvent.change(screen.getByLabelText('Shield'), {
      target: { value: 'heavy-steel-shield' },
    });
    expect(props.onEquipShield).toHaveBeenCalledWith({
      id: 'heavy-steel-shield',
      name: 'Heavy Steel Shield',
      shieldBonus: 2,
      armorCheckPenalty: -2,
    });
  });

  it('unequips when None is selected for a currently-equipped piece', () => {
    const props = renderSection({
      equipment: [
        {
          itemId: 'heavy-steel-shield',
          name: 'Heavy Steel Shield',
          equipped: true,
          shieldBonus: 2,
        },
      ],
    });
    fireEvent.change(screen.getByLabelText('Shield'), { target: { value: '' } });
    expect(props.onUnequipShield).toHaveBeenCalled();
  });
});
