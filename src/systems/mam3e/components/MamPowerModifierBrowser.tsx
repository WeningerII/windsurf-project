import React, { useDeferredValue, useMemo, useState } from 'react';
import { Search, Wand2 } from 'lucide-react';
import type { PowerModifier } from '../../../data/mutants-and-masterminds/3e/modifiers/extras';

interface MamPowerModifierBrowserProps {
  modifiers: PowerModifier[];
}

function formatModifierCost(modifier: PowerModifier): string {
  const perRank =
    modifier.costPerRank === 0
      ? null
      : `${modifier.costPerRank > 0 ? '+' : ''}${modifier.costPerRank}/rank`;
  const flatCost =
    modifier.flatCost == null
      ? null
      : `${modifier.flatCost > 0 ? '+' : ''}${modifier.flatCost} flat`;

  return [perRank, flatCost].filter(Boolean).join(', ') || 'No cost change';
}

export const MamPowerModifierBrowser: React.FC<MamPowerModifierBrowserProps> = ({ modifiers }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const deferredSearchTerm = useDeferredValue(searchTerm);
  const [typeFilter, setTypeFilter] = useState<'all' | PowerModifier['type']>('all');

  const searchHaystacks = useMemo(() => {
    const haystacks = new Map<string, string>();
    for (const modifier of modifiers) {
      haystacks.set(
        modifier.id,
        [modifier.name, modifier.type, modifier.description, modifier.effects.join(' ')]
          .join(' ')
          .toLowerCase()
      );
    }
    return haystacks;
  }, [modifiers]);

  const filteredModifiers = useMemo(() => {
    const normalizedSearch = deferredSearchTerm.trim().toLowerCase();

    return modifiers.filter((modifier) => {
      if (typeFilter !== 'all' && modifier.type !== typeFilter) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      return (searchHaystacks.get(modifier.id) ?? '').includes(normalizedSearch);
    });
  }, [modifiers, searchHaystacks, deferredSearchTerm, typeFilter]);

  return (
    <section className="rounded-lg border bg-card p-4 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Wand2 className="w-5 h-5" /> Power Modifiers
          </h3>
          <p className="text-sm text-muted-foreground">
            Reference the SRD extras and flaws that the power editor can apply.
          </p>
        </div>
        <div className="text-xs text-muted-foreground tabular-nums">
          {filteredModifiers.length}/{modifiers.length} visible
        </div>
      </div>

      <div className="grid gap-2 md:grid-cols-[minmax(0,1fr),180px]">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search modifiers..."
            aria-label="Search modifiers"
            className="w-full rounded-lg border border-input bg-background py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(event) => setTypeFilter(event.target.value as 'all' | PowerModifier['type'])}
          aria-label="Filter modifiers by type"
          className="rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="all">All modifiers</option>
          <option value="extra">Extras</option>
          <option value="flaw">Flaws</option>
        </select>
      </div>

      {filteredModifiers.length > 0 ? (
        <div className="grid gap-3 md:grid-cols-2">
          {filteredModifiers.map((modifier) => (
            <article key={modifier.id} className="rounded-lg border bg-muted/20 p-3 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-medium">{modifier.name}</div>
                  <div className="text-xs text-muted-foreground">{modifier.source}</div>
                </div>
                <div className="space-y-1 text-right">
                  <div className="inline-flex rounded-full border px-2 py-0.5 text-[11px] capitalize text-muted-foreground">
                    {modifier.type}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatModifierCost(modifier)}
                  </div>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">{modifier.description}</p>

              {modifier.effects.length > 0 && (
                <ul className="list-disc pl-5 text-sm text-muted-foreground">
                  {modifier.effects.slice(0, 4).map((effect) => (
                    <li key={effect}>{effect}</li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-input px-3 py-8 text-center text-sm text-muted-foreground">
          No modifiers match the current filters.
        </div>
      )}
    </section>
  );
};
