import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Pf2eEquippedArmorSection } from '../../systems/pf2e/components/Pf2eEquippedArmorSection';
import type { Item } from '../../types/equipment/items';

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
  id: 'steel-shield-pf2e',
  name: 'Steel Shield',
  type: 'shield',
  shieldBonus: 2,
  weight: 1,
} as unknown as Item;

function renderSection(
  overrides: Partial<React.ComponentProps<typeof Pf2eEquippedArmorSection>> = {}
) {
  const props = {
    equipmentItems: [leather, steelShield],
    equipment: [],
    canUpdate: true,
    onEquipArmor: vi.fn(),
    onEquipShield: vi.fn(),
    onUnequipArmor: vi.fn(),
    onUnequipShield: vi.fn(),
    ...overrides,
  };
  render(<Pf2eEquippedArmorSection {...props} />);
  return props;
}

describe('Pf2eEquippedArmorSection', () => {
  it('equips a selected armor with item bonus, dex cap, and bulk', () => {
    const props = renderSection();
    fireEvent.change(screen.getByLabelText('Armor'), { target: { value: 'leather-pf2e' } });
    expect(props.onEquipArmor).toHaveBeenCalledWith({
      id: 'leather-pf2e',
      name: 'Leather Armor',
      bulk: 1,
      armorClass: 1,
      armorType: 'light',
      dexBonusMax: 4,
    });
  });

  it('equips a selected shield with its bonus and bulk', () => {
    const props = renderSection();
    fireEvent.change(screen.getByLabelText('Shield'), { target: { value: 'steel-shield-pf2e' } });
    expect(props.onEquipShield).toHaveBeenCalledWith({
      id: 'steel-shield-pf2e',
      name: 'Steel Shield',
      bulk: 1,
      shieldBonus: 2,
    });
  });

  it('unequips when None is selected for currently-equipped armor', () => {
    const props = renderSection({
      equipment: [
        {
          itemId: 'leather-pf2e',
          name: 'Leather Armor',
          equipped: true,
          armorClass: 1,
          armorType: 'light',
          dexBonusMax: 4,
        },
      ],
    });
    fireEvent.change(screen.getByLabelText('Armor'), { target: { value: '' } });
    expect(props.onUnequipArmor).toHaveBeenCalled();
  });
});
