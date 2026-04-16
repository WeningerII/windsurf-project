import { StickyNote } from 'lucide-react';
import type { DaggerheartSheetController } from '../useDaggerheartSheetController';

interface Props {
  controller: DaggerheartSheetController;
}

export function DaggerheartNotesSection({ controller }: Props) {
  return (
    <section className="rounded-lg border bg-card p-4">
      <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold">
        <StickyNote className="h-5 w-5" /> Notes
      </h3>
      <textarea
        value={controller.data.notes || ''}
        onChange={(event) => controller.update({ notes: event.target.value })}
        className="min-h-[120px] w-full resize-y rounded-lg border border-input bg-transparent px-3 py-2 text-sm focus:border-primary focus:outline-none"
        placeholder="Campaign notes, session log..."
        disabled={!controller.canUpdate}
      />
    </section>
  );
}
