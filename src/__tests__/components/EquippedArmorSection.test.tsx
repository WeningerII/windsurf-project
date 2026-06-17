import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { EquippedArmorSection } from '../../components/EquippedArmorSection';
import type { Item } from '../../types/equipment/items';

// d20-style armor: carries an armor check penalty, no Bulk/weight.
const fullPlate = {
  id: 'full-plate',
  name: 'Full Plate',
  type: 'armor',
  armorClass: 8,
  armorType: 'heavy',
  dexBonusMax: 1,
  armorCheckPenalty: -6,
} as unknown as Item;

// PF2e-style armor: carries Bulk (weight), no check penalty.
const leather = {
  id: 'leather-pf2e',
  name: 'Leather Armor',
  type: 'armor',
  armorClass: 1,
  armorType: 'light',
  dexBonusMax: 4,
  weight: 1,
} as unknown as Item;

const steelShield = {
  id: 'steel-shield',
  name: 'Steel Shield',
  type: 'shield',
  shieldBonus: 2,
  armorCheckPenalty: -2,
  weight: 1,
} as unknown as Item;

function renderSection(overrides: Partial<React.ComponentProps<typeof EquippedArmorSection>> = {}) {
  const props = {
    equipmentItems: [fullPlate, leather, steelShield],
    equipment: [],
    canUpdate: true,
    onEquipArmor: vi.fn(),
    onEquipShield: vi.fn(),
    onUnequipArmor: vi.fn(),
    onUnequipShield: vi.fn(),
    ...overrides,
  };
  render(<EquippedArmorSection {...props} />);
  return props;
}

describe('EquippedArmorSection (shared d20 + PF2e)', () => {
  it('equips d20-style armor, mapping its check penalty', () => {
    const props = renderSection();
    fireEvent.change(screen.getByLabelText('Armor'), { target: { value: 'full-plate' } });
    expect(props.onEquipArmor).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'full-plate',
        name: 'Full Plate',
        armorClass: 8,
        armorType: 'heavy',
        dexBonusMax: 1,
        armorCheckPenalty: -6,
      })
    );
  });

  it('equips PF2e-style armor, mapping its Bulk', () => {
    const props = renderSection();
    fireEvent.change(screen.getByLabelText('Armor'), { target: { value: 'leather-pf2e' } });
    expect(props.onEquipArmor).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'leather-pf2e', bulk: 1, armorClass: 1, dexBonusMax: 4 })
    );
  });

  it('equips a shield with its bonus', () => {
    const props = renderSection();
    fireEvent.change(screen.getByLabelText('Shield'), { target: { value: 'steel-shield' } });
    expect(props.onEquipShield).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'steel-shield', shieldBonus: 2 })
    );
  });

  it('unequips when None is selected', () => {
    const props = renderSection({
      equipment: [{ itemId: 'steel-shield', name: 'Steel Shield', equipped: true, shieldBonus: 2 }],
    });
    fireEvent.change(screen.getByLabelText('Shield'), { target: { value: '' } });
    expect(props.onUnequipShield).toHaveBeenCalled();
  });

  it('notes a PF2e shield applies only when raised', () => {
    renderSection({
      equipment: [{ itemId: 'steel-shield', name: 'Steel Shield', equipped: true, shieldBonus: 2 }],
      shieldRequiresRaise: true,
    });
    expect(screen.getByText(/when raised/)).toBeTruthy();
  });
});
