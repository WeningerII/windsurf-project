import React from 'react';

interface Props {
  notes: string;
  canUpdate: boolean;
  onNotesChange: (value: string) => void;
}

export const MamNotesTab: React.FC<Props> = ({ notes, canUpdate, onNotesChange }) => (
  <section className="bg-card p-4 rounded-lg border">
    <h3 className="text-lg font-semibold mb-3">Notes</h3>
    <textarea
      value={notes}
      onChange={(event) => onNotesChange(event.target.value)}
      className="w-full px-3 py-2 border border-input rounded-lg bg-transparent focus:outline-none focus:border-primary text-sm min-h-[200px]"
      placeholder="Character notes, backstory, etc..."
      disabled={!canUpdate}
    />
  </section>
);
