import type { Dnd5eFeatureOptionGroup } from '../../../types/character-options/feature-options';
import type { EquippedItem } from '../../../types/core/character';
import type { Dnd5e2024DataModel } from '../../dnd5e-2024/data-model';
import type { Dnd5eDataModel } from '../data-model';

type Dnd5eActivityStateDataModel = Dnd5eDataModel | Dnd5e2024DataModel;

export function hasDnd5eFeatureOptionSelection(
  system: Pick<Dnd5eActivityStateDataModel, 'featureOptionSelections'>,
  group: Dnd5eFeatureOptionGroup,
  id: string
): boolean {
  return (system.featureOptionSelections ?? []).some(
    (selection) => selection.group === group && selection.id === id
  );
}

export function hasDnd5eEquippedArmor(
  equipment: Array<Pick<EquippedItem, 'slot' | 'armorClass'>>
): boolean {
  return equipment.some((item) => item.slot === 'chest' && item.armorClass != null);
}

export function getDnd5eDefenseStyleArmorClassBonus(
  system: Pick<Dnd5eActivityStateDataModel, 'featureOptionSelections' | 'equipment'>
): number {
  if (!hasDnd5eFeatureOptionSelection(system, 'fighting-styles', 'defense')) {
    return 0;
  }

  return hasDnd5eEquippedArmor(system.equipment) ? 1 : 0;
}
