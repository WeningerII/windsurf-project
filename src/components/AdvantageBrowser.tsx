/**
 * Shared browser for M&M advantages.
 *
 * Extracted from `MamAdvantageBrowserTab` for `WORK_PLAN` §4.3. That wrapper
 * was the ONLY advantage browse-and-add surface in the product, and it could
 * not be deleted alongside the other six because the Dock had nowhere for an
 * M&M add verb to route through — `loadFeatsForSystem('mam3e')` returns `[]`,
 * so the Dock's Feats tab is empty for that system.
 *
 * The markup is the wrapper's, with search added (the Dock browses a whole
 * catalog, not a tab-scoped slice) and the load/error states dropped — the Dock
 * owns loading for every tab, uniformly. It renders shared `Advantage` records
 * and imports no system module.
 */
import React, { useDeferredValue, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import type { Advantage } from '../types/mam/advantages';
import { Badge } from './ui/Badge';

interface AdvantageBrowserProps {
  advantages: Advantage[];
  /** Names already on the character, so catalog rows can read as added. */
  characterAdvantageNames?: ReadonlySet<string>;
  /** Click-add verb. Absent = browse-only. */
  onSelectAdvantage?: (advantage: Advantage) => void;
}

const ALL_TYPES = 'all' as const;

export const AdvantageBrowser: React.FC<AdvantageBrowserProps> = ({
  advantages,
  characterAdvantageNames,
  onSelectAdvantage,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const deferredSearchTerm = useDeferredValue(searchTerm);
  const [typeFilter, setTypeFilter] = useState<string>(ALL_TYPES);

  const types = useMemo(
    () => [...new Set(advantages.map((advantage) => advantage.type))].sort(),
    [advantages]
  );

  const searchHaystacks = useMemo(() => {
    const haystacks = new Map<string, string>();
    for (const advantage of advantages) {
      haystacks.set(
        advantage.id,
        `${advantage.name} ${advantage.description} ${advantage.benefit ?? ''}`.toLowerCase()
      );
    }
    return haystacks;
  }, [advantages]);

  const filtered = useMemo(() => {
    const needle = deferredSearchTerm.trim().toLowerCase();
    return advantages.filter((advantage) => {
      if (typeFilter !== ALL_TYPES && advantage.type !== typeFilter) return false;
      if (!needle) return true;
      return searchHaystacks.get(advantage.id)?.includes(needle) ?? false;
    });
  }, [advantages, deferredSearchTerm, typeFilter, searchHaystacks]);

  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-[12rem] flex-1">
          <Search className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            aria-label="Search advantages"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search advantages…"
            className="w-full rounded-md border border-input bg-transparent py-1.5 pl-8 pr-2 text-sm focus:border-primary focus:outline-none"
          />
        </div>
        <select
          aria-label="Filter advantages by type"
          value={typeFilter}
          onChange={(event) => setTypeFilter(event.target.value)}
          className="rounded-md border border-input bg-transparent px-2 py-1.5 text-sm capitalize focus:border-primary focus:outline-none"
        >
          <option value={ALL_TYPES}>All types</option>
          {types.map((type) => (
            <option key={type} value={type} className="capitalize">
              {type}
            </option>
          ))}
        </select>
      </div>

      <p className="text-xs text-muted-foreground">
        {filtered.length} of {advantages.length} advantages
      </p>

      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        {filtered.map((advantage) => {
          const alreadyAdded = characterAdvantageNames?.has(advantage.name) ?? false;
          return (
            <div key={advantage.id} className="rounded border p-2 transition-colors hover:bg-muted/50">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{advantage.name}</span>
                <Badge variant="secondary" className="px-1.5 py-0 text-[10px] capitalize">
                  {advantage.type}
                </Badge>
                {advantage.ranked && (
                  <Badge variant="outline" className="px-1.5 py-0 text-[10px]">
                    Ranked
                  </Badge>
                )}
                {onSelectAdvantage && (
                  <button
                    type="button"
                    onClick={() => onSelectAdvantage(advantage)}
                    disabled={alreadyAdded}
                    className="ml-auto rounded border px-2 py-0.5 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary disabled:opacity-50 disabled:hover:border-input disabled:hover:text-muted-foreground"
                    title={
                      alreadyAdded
                        ? 'Already on the character (ranked advantages: edit the rank on the Skills tab)'
                        : `Add ${advantage.name} to the character`
                    }
                  >
                    {alreadyAdded ? 'Added' : 'Add'}
                  </button>
                )}
              </div>
              <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                {advantage.benefit || advantage.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
