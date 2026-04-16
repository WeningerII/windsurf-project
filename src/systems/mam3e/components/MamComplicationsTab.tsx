import React, { Suspense } from 'react';
import { AlertTriangle, Plus, X } from 'lucide-react';
import { lazyWithPreload } from '../../../utils/lazyWithPreload';
import type { Complication } from '../../../data/mutants-and-masterminds/3e/complications';
import type { Mam3eDataModel } from '../data-model';

const MamComplicationBrowser = lazyWithPreload(async () => {
  const module = await import('../../../components/MamComplicationBrowser');
  return { default: module.MamComplicationBrowser };
});

interface Props {
  complications: Mam3eDataModel['complications'];
  complicationCatalog: Complication[];
  complicationsLoaded: boolean;
  insertedComplicationIds: string[];
  onComplicationsChange?: (complications: Mam3eDataModel['complications']) => void;
  onInsertComplication?: (complication: Complication) => void;
}

type MamComplicationsTabComponent = React.FC<Props> & {
  preload: () => Promise<unknown>;
};

export const MamComplicationsTab = (({
  complications,
  complicationCatalog,
  complicationsLoaded,
  insertedComplicationIds,
  onComplicationsChange,
  onInsertComplication,
}) => (
  <section className="bg-card p-4 rounded-lg border space-y-4">
    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
      <AlertTriangle className="w-5 h-5" /> Complications
    </h3>
    <div className="space-y-2">
      {complications.length === 0 ? (
        <p className="text-sm text-muted-foreground italic">No complications added yet.</p>
      ) : (
        complications.map((complication, index) => (
          <div
            key={index}
            className="flex items-start gap-2 p-2 bg-muted/30 rounded border transition-colors hover:bg-muted/50"
          >
            <div className="flex-1">
              <input
                value={complication.name}
                onChange={(event) => {
                  if (!onComplicationsChange) return;
                  const nextComplications = [...complications];
                  nextComplications[index] = { ...complication, name: event.target.value };
                  onComplicationsChange(nextComplications);
                }}
                className="font-medium bg-transparent border-b border-transparent hover:border-input focus:border-primary focus:outline-none w-full"
                placeholder="Complication name"
                disabled={!onComplicationsChange}
              />
              <div className="mt-1 flex flex-wrap gap-1.5 text-[11px] text-muted-foreground">
                {complication.category && (
                  <span className="rounded-full border px-2 py-0.5 capitalize">
                    {complication.category}
                  </span>
                )}
                {complication.source && (
                  <span className="rounded-full border px-2 py-0.5">{complication.source}</span>
                )}
              </div>
              <input
                value={complication.description}
                onChange={(event) => {
                  if (!onComplicationsChange) return;
                  const nextComplications = [...complications];
                  nextComplications[index] = {
                    ...complication,
                    description: event.target.value,
                  };
                  onComplicationsChange(nextComplications);
                }}
                className="text-sm text-muted-foreground bg-transparent border-b border-transparent hover:border-input focus:border-primary focus:outline-none w-full mt-1"
                placeholder="Description"
                disabled={!onComplicationsChange}
              />
            </div>
            {onComplicationsChange && (
              <button
                type="button"
                onClick={() =>
                  onComplicationsChange(
                    complications.filter((_, entryIndex) => entryIndex !== index)
                  )
                }
                className="text-muted-foreground hover:text-destructive transition-colors mt-1"
                title="Remove complication"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ))
      )}
      {onComplicationsChange && (
        <button
          type="button"
          onClick={() => onComplicationsChange([...complications, { name: '', description: '' }])}
          className="w-full py-2 border border-dashed border-input rounded-lg text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-1"
        >
          <Plus className="w-4 h-4" /> Add Complication
        </button>
      )}
    </div>

    {complicationsLoaded ? (
      <Suspense
        fallback={
          <div className="text-center py-8 text-muted-foreground text-sm">
            Loading Complication Browser...
          </div>
        }
      >
        <MamComplicationBrowser
          complications={complicationCatalog}
          insertedComplicationIds={insertedComplicationIds}
          onInsertComplication={onInsertComplication}
        />
      </Suspense>
    ) : (
      <div className="rounded-lg border border-dashed border-input px-3 py-6 text-center text-sm text-muted-foreground">
        Loading complication catalog...
      </div>
    )}
  </section>
)) as MamComplicationsTabComponent;

MamComplicationsTab.preload = () => MamComplicationBrowser.preload();
