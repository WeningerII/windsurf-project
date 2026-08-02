import React, { useCallback, useMemo } from 'react';
import type { CharacterDocument, SystemDataModel } from '../../types/core/document';
import type { Item } from '../../types/equipment/items';
import type { Spell } from '../../types/magic/spells';
import { useSheetDispatchRegister } from '../../contexts/sheet-dispatch-context';
import { RestControls } from '../../components/RestControls';
import { D20ClassesSection } from './components/D20ClassesSection';
import { D20CombatSection } from './components/D20CombatSection';
import { D20DerivedStats } from './components/D20DerivedStats';
import { D20LegacyHeader } from './components/D20LegacyHeader';
import { D20LegacyTabs } from './components/D20LegacyTabs';
import { useD20LegacySheetController } from './useD20LegacySheetController';

interface Props {
  document: CharacterDocument<SystemDataModel>;
  onUpdate?: (document: CharacterDocument<SystemDataModel>) => void;
}

export const D20LegacySheet: React.FC<Props> = ({ document, onUpdate }) => {
  const { derivedCards, headerProps, classesProps, combatProps, restProps, tabsProps } =
    useD20LegacySheetController({
      document,
      onUpdate,
    });

  // Publish the sheet's add-handlers UP into the shared Dock's dispatch
  // registry (Phase 5, inverted control — same contract as the 5e pilot).
  // 3.5e/PF1e expose a spell-learn (`addKnownSpell`, already `(Spell) => void`)
  // and an inventory-add (`addItem`), reused here. Neither system has an
  // add-feat-BY-DEFINITION handler (its browser is browse-only and `addFeat`
  // only appends a blank custom feat), so `addFeat` stays unpublished and the
  // Dock's feat verb correctly disables for these systems.
  const { onAddKnownSpell, onAddItem } = tabsProps;
  const addEquipment = useCallback(
    (item: Item) =>
      onAddItem({
        id: item.id,
        name: item.name,
        quantity: item.quantity ?? 1,
        weight: item.weight,
      }),
    [onAddItem]
  );
  // The spell-list narrowing the deleted in-sheet D20SpellBrowserPanel applied
  // locally (WORK_PLAN §4.3). Published UP so the Dock's spell tab shows this
  // character's class lists rather than the whole 3.5e/PF1e catalog.
  const { spellListIds } = tabsProps;
  const catalogFilter = useMemo(
    () =>
      spellListIds.length > 0
        ? {
            label: spellListIds.length === 1 ? `${spellListIds[0]} spells` : 'class spell lists',
            spell: (spell: Spell) =>
              spell.classes.some((classId) => spellListIds.includes(classId)),
          }
        : undefined,
    [spellListIds]
  );
  useSheetDispatchRegister(
    onUpdate ? document.id : null,
    {
      addSpell: onUpdate ? onAddKnownSpell : undefined,
      addEquipment: onUpdate ? addEquipment : undefined,
    },
    catalogFilter
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6 p-6">
      <D20LegacyHeader {...headerProps} />
      <D20ClassesSection {...classesProps} />
      <D20CombatSection {...combatProps} />
      <D20DerivedStats derivedCards={derivedCards} />
      <RestControls {...restProps} />
      <D20LegacyTabs {...tabsProps} />
    </div>
  );
};
