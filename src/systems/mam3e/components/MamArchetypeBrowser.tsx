import React, { useDeferredValue, useMemo, useState } from 'react';
import { Check, Search, Shield } from 'lucide-react';
import type { Mam3eArchetype } from '../../../types/mam/archetypes';

interface MamArchetypeBrowserProps {
  archetypes: Mam3eArchetype[];
  selectedArchetypeIds?: string[];
  onToggleArchetype?: (archetype: Mam3eArchetype) => void;
}

export const MamArchetypeBrowser: React.FC<MamArchetypeBrowserProps> = ({
  archetypes,
  selectedArchetypeIds = [],
  onToggleArchetype,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const deferredSearchTerm = useDeferredValue(searchTerm);
  const selectedIds = useMemo(() => new Set(selectedArchetypeIds), [selectedArchetypeIds]);

  const searchHaystacks = useMemo(() => {
    const haystacks = new Map<string, string>();
    for (const archetype of archetypes) {
      const featureText = archetype.features
        .flatMap((group) =>
          group.features.map((feature) => `${feature.name} ${feature.description}`)
        )
        .join(' ');
      haystacks.set(
        archetype.id,
        [
          archetype.name,
          archetype.description,
          (archetype.suggestedSkills ?? []).join(' '),
          featureText,
        ]
          .join(' ')
          .toLowerCase()
      );
    }
    return haystacks;
  }, [archetypes]);

  const filteredArchetypes = useMemo(() => {
    const normalizedSearch = deferredSearchTerm.trim().toLowerCase();
    if (!normalizedSearch) {
      return archetypes;
    }

    return archetypes.filter((archetype) =>
      (searchHaystacks.get(archetype.id) ?? '').includes(normalizedSearch)
    );
  }, [archetypes, searchHaystacks, deferredSearchTerm]);

  return (
    <section className="rounded-lg border bg-card p-4 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Shield className="w-5 h-5" /> Archetypes
          </h3>
          <p className="text-sm text-muted-foreground">
            Pin SRD archetypes as build references. They do not auto-apply powers or point totals.
          </p>
        </div>
        <div className="text-xs text-muted-foreground tabular-nums">
          {filteredArchetypes.length}/{archetypes.length} visible
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search archetypes..."
          aria-label="Search archetypes"
          className="w-full rounded-lg border border-input bg-background py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {filteredArchetypes.length > 0 ? (
        <div className="grid gap-3 md:grid-cols-2">
          {filteredArchetypes.map((archetype) => {
            const isSelected = selectedIds.has(archetype.id);

            return (
              <article key={archetype.id} className="rounded-lg border bg-muted/20 p-3 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-medium">{archetype.name}</div>
                    <div className="text-xs text-muted-foreground">{archetype.source}</div>
                  </div>
                  {onToggleArchetype && (
                    <button
                      type="button"
                      onClick={() => onToggleArchetype(archetype)}
                      aria-label={isSelected ? `Unpin ${archetype.name}` : `Pin ${archetype.name}`}
                      className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs transition-colors ${
                        isSelected
                          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700'
                          : 'border-input hover:border-primary/50 hover:bg-background'
                      }`}
                    >
                      {isSelected && <Check className="h-3 w-3" />}
                      {isSelected ? 'Pinned' : 'Pin'}
                    </button>
                  )}
                </div>

                {(archetype.suggestedSkills?.length ?? 0) > 0 && (
                  <div className="flex flex-wrap gap-1.5 text-[11px] text-muted-foreground">
                    {archetype.suggestedSkills!.map((skill) => (
                      <span
                        key={`${archetype.id}-${skill}`}
                        className="rounded-full border px-2 py-0.5 capitalize"
                        title="Suggested skill from the published archetype"
                      >
                        {skill.replace(/-/g, ' ')}
                      </span>
                    ))}
                  </div>
                )}

                <p className="text-sm text-muted-foreground">{archetype.description}</p>

                <div className="space-y-2">
                  {archetype.features.map((featureGroup) => (
                    <div
                      key={`${archetype.id}-${featureGroup.level}`}
                      className="rounded-md border bg-card/60 p-2"
                    >
                      <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Level {featureGroup.level}
                      </div>
                      <ul className="mt-1 space-y-1 text-sm">
                        {featureGroup.features.map((feature) => (
                          <li key={feature.id}>
                            <span className="font-medium">{feature.name}</span>
                            {feature.description ? (
                              <span className="text-muted-foreground">: {feature.description}</span>
                            ) : null}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-input px-3 py-8 text-center text-sm text-muted-foreground">
          No archetypes match the current filters.
        </div>
      )}
    </section>
  );
};
