import React, { useDeferredValue, useMemo, useState } from 'react';
import { AlertTriangle, Check, Search } from 'lucide-react';
import type { Complication } from '../data/mutants-and-masterminds/3e/complications';

interface MamComplicationBrowserProps {
  complications: Complication[];
  insertedComplicationIds?: string[];
  onInsertComplication?: (complication: Complication) => void;
}

export const MamComplicationBrowser: React.FC<MamComplicationBrowserProps> = ({
  complications,
  insertedComplicationIds = [],
  onInsertComplication,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const deferredSearchTerm = useDeferredValue(searchTerm);
  const [categoryFilter, setCategoryFilter] = useState<'all' | Complication['category']>('all');
  const insertedIds = useMemo(() => new Set(insertedComplicationIds), [insertedComplicationIds]);

  const categories = useMemo(
    () => [...new Set(complications.map((complication) => complication.category))].sort(),
    [complications]
  );

  const searchHaystacks = useMemo(() => {
    const haystacks = new Map<string, string>();
    for (const complication of complications) {
      haystacks.set(
        complication.id,
        [
          complication.name,
          complication.category,
          complication.description,
          complication.examples.join(' '),
        ]
          .join(' ')
          .toLowerCase()
      );
    }
    return haystacks;
  }, [complications]);

  const filteredComplications = useMemo(() => {
    const normalizedSearch = deferredSearchTerm.trim().toLowerCase();

    return complications.filter((complication) => {
      if (categoryFilter !== 'all' && complication.category !== categoryFilter) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      return (searchHaystacks.get(complication.id) ?? '').includes(normalizedSearch);
    });
  }, [categoryFilter, complications, searchHaystacks, deferredSearchTerm]);

  return (
    <section className="rounded-lg border bg-card p-4 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" /> SRD Complications
          </h3>
          <p className="text-sm text-muted-foreground">
            Insert official complications into the current character, or continue using custom
            entries.
          </p>
        </div>
        <div className="text-xs text-muted-foreground tabular-nums">
          {filteredComplications.length}/{complications.length} visible
        </div>
      </div>

      <div className="grid gap-2 md:grid-cols-[minmax(0,1fr),180px]">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search complications..."
            aria-label="Search complications"
            className="w-full rounded-lg border border-input bg-background py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(event) =>
            setCategoryFilter(event.target.value as 'all' | Complication['category'])
          }
          aria-label="Filter complications by category"
          className="rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="all">All categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {filteredComplications.length > 0 ? (
        <div className="grid gap-3 md:grid-cols-2">
          {filteredComplications.map((complication) => {
            const isInserted = insertedIds.has(complication.id);

            return (
              <article
                key={complication.id}
                className="rounded-lg border bg-muted/20 p-3 space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-medium">{complication.name}</div>
                    <div className="text-xs text-muted-foreground">{complication.source}</div>
                  </div>
                  {onInsertComplication && (
                    <button
                      type="button"
                      onClick={() => onInsertComplication(complication)}
                      disabled={isInserted}
                      className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs transition-colors ${
                        isInserted
                          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700'
                          : 'border-input hover:border-primary/50 hover:bg-background'
                      }`}
                    >
                      {isInserted && <Check className="h-3 w-3" />}
                      {isInserted ? 'Inserted' : 'Insert'}
                    </button>
                  )}
                </div>

                <div className="inline-flex rounded-full border px-2 py-0.5 text-[11px] capitalize text-muted-foreground">
                  {complication.category}
                </div>

                <p className="text-sm text-muted-foreground">{complication.description}</p>

                {complication.examples.length > 0 && (
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Examples
                    </div>
                    <ul className="mt-1 list-disc pl-5 text-sm text-muted-foreground">
                      {complication.examples.slice(0, 3).map((example) => (
                        <li key={example}>{example}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-input px-3 py-8 text-center text-sm text-muted-foreground">
          No complications match the current filters.
        </div>
      )}
    </section>
  );
};
