import type { FC } from 'react';
import { CharacterDocument, SystemDataModel } from '../../../types/core/document';
import { Dnd5eDataModel } from '../data-model';
import { Dnd5eSheetBase } from '../shared/Dnd5eSheetBase';

interface Props {
  document: CharacterDocument<Dnd5eDataModel>;
  onUpdate?: (document: CharacterDocument<SystemDataModel>) => void;
}

export const Dnd5eSheet: FC<Props> = ({ document, onUpdate }) => (
  <Dnd5eSheetBase document={document} onUpdate={onUpdate} />
);
