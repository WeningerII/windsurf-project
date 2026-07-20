import type { CharacterDocument, SystemDataModel } from '../../types/core/document';
import { presentDerivedQuantities } from '../../rules/derivation';
import type { DaggerheartDataModel } from './data-model';
import { DAGGERHEART_DERIVED_QUANTITIES } from './derivedQuantities';
import { DaggerheartCharacterBasicsSection } from './components/DaggerheartCharacterBasicsSection';
import { DaggerheartDerivedStats } from './components/DaggerheartDerivedStats';
import { DaggerheartDomainCardsSection } from './components/DaggerheartDomainCardsSection';
import { DaggerheartEquipmentSection } from './components/DaggerheartEquipmentSection';
import { DaggerheartInventorySection } from './components/DaggerheartInventorySection';
import { DaggerheartNotesSection } from './components/DaggerheartNotesSection';
import { DaggerheartReferenceLibrarySection } from './components/DaggerheartReferenceLibrarySection';
import { DaggerheartSelectionOverviewSection } from './components/DaggerheartSelectionOverviewSection';
import { DaggerheartSheetHeader } from './components/DaggerheartSheetHeader';
import { useDaggerheartSheetController } from './useDaggerheartSheetController';

interface Props {
  document: CharacterDocument<DaggerheartDataModel>;
  onUpdate?: (document: CharacterDocument<SystemDataModel>) => void;
}

export function DaggerheartSheet({ document, onUpdate }: Props) {
  const controller = useDaggerheartSheetController({ document, onUpdate });
  const derivedCards = presentDerivedQuantities(
    DAGGERHEART_DERIVED_QUANTITIES,
    controller.data,
    controller.data.derived
  );

  return (
    <div className="space-y-6">
      <DaggerheartSheetHeader controller={controller} />
      <DaggerheartDerivedStats derivedCards={derivedCards} />
      <DaggerheartSelectionOverviewSection controller={controller} />
      <DaggerheartReferenceLibrarySection controller={controller} />
      <DaggerheartEquipmentSection controller={controller} />
      <DaggerheartCharacterBasicsSection controller={controller} />
      <DaggerheartInventorySection controller={controller} />
      <DaggerheartDomainCardsSection controller={controller} />
      <DaggerheartNotesSection controller={controller} />
    </div>
  );
}
