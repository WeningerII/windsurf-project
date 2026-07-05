import React, { useMemo, useState } from 'react';
import { Check, Search, Sparkles } from 'lucide-react';
import type {
  Dnd5eFeatureOptionDefinition,
  Dnd5eFeatureOptionSelection,
} from '../../../../types/character-options/feature-options';
import { getDnd5eFeatureOptionGroupLabel } from '../dnd5eFeatureOptions';

interface FeatureOptionBrowserProps {
  options: Dnd5eFeatureOptionDefinition[];
  selectedOptions?: Dnd5eFeatureOptionSelection[];
  onSelectOption?: (option: Dnd5eFeatureOptionDefinition) => void;
}

function selectionKey(selection: Pick<Dnd5eFeatureOptionSelection, 'group' | 'id'>): string {
  return `${selection.group}:${selection.id}`;
}

export const FeatureOptionBrowser: React.FC<FeatureOptionBrowserProps> = ({
  options,
  selectedOptions = [],
  onSelectOption,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const selectedKeys = useMemo(
    () => new Set(selectedOptions.map((selection) => selectionKey(selection))),
    [selectedOptions]
  );

  const filteredOptions = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    if (!normalizedSearch) {
      return options;
    }

    return options.filter((option) => {
      const haystack = [
        option.name,
        option.description,
        option.classIds.join(' '),
        (option.subclassIds || []).join(' '),
        (option.prerequisites || []).join(' '),
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(normalizedSearch);
    });
  }, [options, searchTerm]);

  const groupedOptions = useMemo(() => {
    return filteredOptions.reduce<Record<string, Dnd5eFeatureOptionDefinition[]>>(
      (groups, option) => {
        const label = getDnd5eFeatureOptionGroupLabel(option.group);
        groups[label] = groups[label] || [];
        groups[label].push(option);
        return groups;
      },
      {}
    );
  }, [filteredOptions]);

  const groupEntries = useMemo(() => Object.entries(groupedOptions), [groupedOptions]);

  return (
    <section className="rounded-lg border bg-card p-4 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Sparkles className="w-5 h-5" /> Feature Options
          </h3>
          <p className="text-sm text-muted-foreground">
            Browse the SRD 5.1 option catalogs and mirror selected entries into your feature list.
          </p>
        </div>
        <div className="text-xs text-muted-foreground tabular-nums">
          {filteredOptions.length}/{options.length} visible
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search feature options..."
          aria-label="Search feature options"
          className="w-full rounded-lg border border-input bg-background py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {groupEntries.length > 0 ? (
        <div className="space-y-4">
          {groupEntries.map(([groupLabel, groupOptions]) => (
            <div key={groupLabel} className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  {groupLabel}
                </h4>
                <span className="text-xs text-muted-foreground">{groupOptions.length}</span>
              </div>
              <div className="grid gap-2 md:grid-cols-2">
                {groupOptions.map((option) => {
                  const isSelected = selectedKeys.has(selectionKey(option));

                  return (
                    <article
                      key={selectionKey(option)}
                      className="rounded-lg border bg-muted/20 p-3 space-y-2"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-medium">{option.name}</div>
                          <div className="text-xs text-muted-foreground">{option.source}</div>
                        </div>
                        {onSelectOption && (
                          <button
                            type="button"
                            onClick={() => onSelectOption(option)}
                            disabled={isSelected}
                            className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs transition-colors ${
                              isSelected
                                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700'
                                : 'border-input hover:border-primary/50 hover:bg-background'
                            }`}
                          >
                            {isSelected && <Check className="h-3 w-3" />}
                            {isSelected ? 'Selected' : 'Add'}
                          </button>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-1.5 text-[11px] text-muted-foreground">
                        {option.classIds.map((classId) => (
                          <span
                            key={`${option.id}-${classId}`}
                            className="rounded-full border px-2 py-0.5"
                          >
                            {classId}
                          </span>
                        ))}
                        {typeof option.minLevel === 'number' && (
                          <span className="rounded-full border px-2 py-0.5">
                            Level {option.minLevel}+
                          </span>
                        )}
                        {option.subclassIds?.map((subclassId) => (
                          <span
                            key={`${option.id}-${subclassId}`}
                            className="rounded-full border border-dashed px-2 py-0.5"
                          >
                            {subclassId}
                          </span>
                        ))}
                      </div>

                      <p className="text-sm text-muted-foreground whitespace-pre-line">
                        {option.description}
                      </p>

                      {option.prerequisites && option.prerequisites.length > 0 && (
                        <div className="text-xs text-muted-foreground">
                          Prerequisites: {option.prerequisites.join(', ')}
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-input px-3 py-8 text-center text-sm text-muted-foreground">
          No feature options match the current filters.
        </div>
      )}
    </section>
  );
};
