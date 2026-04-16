import type { CharacterDocument, SystemDataModel } from '../../types/core/document';
import type { DaggerheartDataModel } from './data-model';
import { DaggerheartCharacterBasicsSection } from './components/DaggerheartCharacterBasicsSection';
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

  return (
    <div className="space-y-6">
      <DaggerheartSheetHeader controller={controller} />
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
