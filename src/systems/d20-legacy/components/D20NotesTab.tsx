import React from 'react';

type Personality = {
  description?: string;
  backstory?: string;
};

interface Props {
  personality?: Personality;
  notes?: string;
  canUpdate: boolean;
  onDescriptionChange: (value: string) => void;
  onBackstoryChange: (value: string) => void;
  onNotesChange: (value: string) => void;
}

export const D20NotesTab: React.FC<Props> = ({
  personality,
  notes,
  canUpdate,
  onDescriptionChange,
  onBackstoryChange,
  onNotesChange,
}) => (
  <section className="bg-card p-4 rounded-lg border space-y-4">
    <h3 className="text-lg font-semibold">Character Notes</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          value={personality?.description || ''}
          onChange={(event) => onDescriptionChange(event.target.value)}
          className="w-full px-3 py-2 border border-input rounded-lg bg-transparent focus:outline-none focus:border-primary text-sm min-h-[80px]"
          placeholder="Physical description..."
          disabled={!canUpdate}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Backstory</label>
        <textarea
          value={personality?.backstory || ''}
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
        value={notes || ''}
        onChange={(event) => onNotesChange(event.target.value)}
        className="w-full px-3 py-2 border border-input rounded-lg bg-transparent focus:outline-none focus:border-primary text-sm min-h-[120px]"
        placeholder="Additional notes..."
        disabled={!canUpdate}
      />
    </div>
  </section>
);
