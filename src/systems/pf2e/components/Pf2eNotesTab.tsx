import React from 'react';
import type { CharacterDocument } from '../../../types/core/document';
import type { Pf2eDataModel } from '../data-model';

interface Props {
  document: CharacterDocument<Pf2eDataModel>;
  canUpdate: boolean;
  onDescriptionChange: (value: string) => void;
  onBackstoryChange: (value: string) => void;
  onNotesChange: (value: string) => void;
}

export const Pf2eNotesTab: React.FC<Props> = ({
  document,
  canUpdate,
  onDescriptionChange,
  onBackstoryChange,
  onNotesChange,
}) => {
  const data = document.system;

  return (
    <section className="bg-card p-4 rounded-lg border space-y-4">
      <h3 className="text-lg font-semibold">Character Notes</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={data.personality?.description || ''}
            onChange={(event) => onDescriptionChange(event.target.value)}
            className="w-full px-3 py-2 border border-input rounded-lg bg-transparent focus:outline-none focus:border-primary text-sm min-h-[80px]"
            placeholder="Physical description..."
            disabled={!canUpdate}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Backstory</label>
          <textarea
            value={data.personality?.backstory || ''}
            onChange={(event) => onBackstoryChange(event.target.value)}
            className="w-full px-3 py-2 border border-input rounded-lg bg-transparent focus:outline-none focus:border-primary text-sm min-h-[80px]"
            placeholder="Character backstory..."
            disabled={!canUpdate}
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Notes</label>
        <textarea
          value={data.notes || ''}
          onChange={(event) => onNotesChange(event.target.value)}
          className="w-full px-3 py-2 border border-input rounded-lg bg-transparent focus:outline-none focus:border-primary text-sm min-h-[120px]"
          placeholder="Additional notes..."
          disabled={!canUpdate}
        />
      </div>
    </section>
  );
};
