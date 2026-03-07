import type { FC } from 'react';
import { CharacterDocument, SystemDataModel } from '../../../types/core/document';
import { Dnd5e2024DataModel } from '../data-model';
import { Dnd5eSheetBase } from '../../dnd5e/shared/Dnd5eSheetBase';

interface Props {
  document: CharacterDocument<Dnd5e2024DataModel>;
  onUpdate?: (document: CharacterDocument<SystemDataModel>) => void;
}

export const Dnd5e2024Sheet: FC<Props> = ({ document, onUpdate }) => (
  <Dnd5eSheetBase document={document} onUpdate={onUpdate} enableWeaponMasteries />
);
