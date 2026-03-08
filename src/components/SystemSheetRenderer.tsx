import React, { Suspense } from 'react';
import { systemRegistry } from '../registry';
import { CharacterDocument, SystemDataModel } from '../types/core/document';
import { Skeleton } from './ui/Skeleton';

interface Props {
  document: CharacterDocument<SystemDataModel>;
  onUpdate?: (document: CharacterDocument<SystemDataModel>) => void;
}

export const SystemSheetRenderer: React.FC<Props> = ({ document, onUpdate }) => {
  const systemId = document.systemId;
  const systemDef = systemRegistry.get(systemId);

  if (!systemDef) {
    return (
      <div className="p-4 border border-destructive rounded bg-destructive/10 text-destructive">
        Error: System definition not found for &apos;{systemId}&apos;.
      </div>
    );
  }

  const Sheet = systemDef.SheetComponent;
  return (
    <Suspense
      fallback={
        <div className="space-y-4 p-4">
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      }
    >
      <Sheet document={document} onUpdate={onUpdate} />
    </Suspense>
  );
};
