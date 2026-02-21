import React from 'react';
import { systemRegistry } from '../registry';
import { CharacterDocument, SystemDataModel } from '../types/core/document';

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
  return <Sheet document={document} onUpdate={onUpdate} />;
};
