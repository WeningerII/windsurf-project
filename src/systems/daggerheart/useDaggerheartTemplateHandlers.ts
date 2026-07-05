import { useCallback } from 'react';
import type { CharacterDocument } from '../../types/core/document';
import type {
  DaggerheartAncestry,
  DaggerheartClass,
  DaggerheartCommunity,
} from '../../types/daggerheart';
import {
  applyDaggerheartAncestryTemplate,
  applyDaggerheartClassTemplate,
  applyDaggerheartCommunityTemplate,
} from './daggerheartTemplate';
import type { DaggerheartDataModel } from './data-model';

interface UseDaggerheartTemplateHandlersProps {
  document: CharacterDocument<DaggerheartDataModel>;
  data: DaggerheartDataModel;
  classOptions: DaggerheartClass[];
  ancestryOptions: DaggerheartAncestry[];
  communityOptions: DaggerheartCommunity[];
  selectedClass?: DaggerheartClass;
  selectedAncestry?: DaggerheartAncestry;
  commitDocument: (nextDocument: CharacterDocument<DaggerheartDataModel>) => void;
  update: (patch: Partial<DaggerheartDataModel>) => void;
}

export function useDaggerheartTemplateHandlers({
  document,
  data,
  classOptions,
  ancestryOptions,
  communityOptions,
  selectedClass,
  selectedAncestry,
  commitDocument,
  update,
}: UseDaggerheartTemplateHandlersProps) {
  const handleClassChange = useCallback(
    (nextClassName: string) => {
      const nextClass = classOptions.find((entry) => entry.name === nextClassName);
      if (!nextClass) {
        update({ class: nextClassName, subclass: '' });
        return;
      }

      const keepSubclass = nextClass.subclasses.some((entry) => entry.name === data.subclass);
      const nextDocument = applyDaggerheartClassTemplate(document, nextClass, {
        previousClass: selectedClass,
        ancestry: selectedAncestry,
        subclassName: keepSubclass ? data.subclass : '',
      });
      commitDocument(nextDocument);
    },
    [classOptions, commitDocument, data.subclass, document, selectedAncestry, selectedClass, update]
  );

  const handleAncestryChange = useCallback(
    (nextAncestryName: string) => {
      const nextAncestry = ancestryOptions.find((entry) => entry.name === nextAncestryName);
      if (!nextAncestry) {
        update({ heritage: nextAncestryName });
        return;
      }

      const nextDocument = applyDaggerheartAncestryTemplate(document, nextAncestry, {
        previousAncestry: selectedAncestry,
        classData: selectedClass,
      });
      commitDocument(nextDocument);
    },
    [ancestryOptions, commitDocument, document, selectedAncestry, selectedClass, update]
  );

  const handleCommunityChange = useCallback(
    (nextCommunityName: string) => {
      const nextCommunity = communityOptions.find((entry) => entry.name === nextCommunityName);
      if (!nextCommunity) {
        update({ community: nextCommunityName });
        return;
      }

      commitDocument(applyDaggerheartCommunityTemplate(document, nextCommunity));
    },
    [commitDocument, communityOptions, document, update]
  );

  return {
    handleClassChange,
    handleAncestryChange,
    handleCommunityChange,
  };
}
