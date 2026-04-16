import { useCallback } from 'react';
import type { CharacterDocument, SystemDataModel } from '../../../types/core/document';
import type { Dnd5eLikeDataModel } from './dnd5eSheetShared';

interface UseDnd5eDocumentMutatorsProps<T extends Dnd5eLikeDataModel> {
  document: CharacterDocument<T>;
  onUpdate?: (document: CharacterDocument<SystemDataModel>) => void;
}

export function useDnd5eDocumentMutators<T extends Dnd5eLikeDataModel>({
  document,
  onUpdate,
}: UseDnd5eDocumentMutatorsProps<T>) {
  const system = document.system;
  const canUpdate = Boolean(onUpdate);

  const replaceDocument = useCallback(
    (nextDocument: CharacterDocument<T>) => {
      if (!onUpdate) {
        return;
      }

      onUpdate({
        ...nextDocument,
        updatedAt: new Date(),
      } as CharacterDocument<SystemDataModel>);
    },
    [onUpdate]
  );

  const replaceSystem = useCallback(
    (nextSystem: T) => {
      if (!onUpdate) {
        return;
      }

      onUpdate({
        ...document,
        system: nextSystem,
        updatedAt: new Date(),
      } as CharacterDocument<SystemDataModel>);
    },
    [document, onUpdate]
  );

  const update = useCallback(
    (patch: Partial<T>) => {
      replaceSystem({ ...system, ...patch } as T);
    },
    [replaceSystem, system]
  );

  const onNameChange = useCallback(
    (name: string) => {
      if (!onUpdate) {
        return;
      }

      onUpdate({
        ...document,
        name,
        updatedAt: new Date(),
      } as CharacterDocument<SystemDataModel>);
    },
    [document, onUpdate]
  );

  return {
    canUpdate,
    replaceDocument,
    replaceSystem,
    update,
    onNameChange,
  };
}
