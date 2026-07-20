import React from 'react';
import type { CharacterDocument, SystemDataModel } from '../../types/core/document';
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
