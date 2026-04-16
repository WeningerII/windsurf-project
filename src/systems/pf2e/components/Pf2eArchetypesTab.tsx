import React from 'react';
import { X } from 'lucide-react';
import { Badge } from '../../../components/ui/Badge';
import type { Archetype } from '../../../types/character-options/archetypes';

interface Props {
  archetypesLoaded: boolean;
  classId?: string;
  selectedArchetypeIds: string[];
  selectedArchetypes: Archetype[];
  orderedArchetypes: Archetype[];
  onToggleArchetype?: (archetype: Archetype) => void;
}

export const Pf2eArchetypesTab: React.FC<Props> = ({
  archetypesLoaded,
  classId,
  selectedArchetypeIds,
  selectedArchetypes,
  orderedArchetypes,
  onToggleArchetype,
}) =>
  !archetypesLoaded ? (
    <div className="text-center py-8 text-muted-foreground">Click to load archetype options...</div>
  ) : (
    <div className="space-y-4">
      <section className="bg-card p-4 rounded-lg border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Selected Archetypes</h3>
          <Badge variant="secondary">{selectedArchetypeIds.length}</Badge>
        </div>
        {selectedArchetypes.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">No archetypes selected.</p>
        ) : (
          <div className="space-y-2">
            {selectedArchetypes.map((archetype) => (
              <div
                key={archetype.id}
                className="flex items-start justify-between gap-3 p-3 bg-muted/30 rounded border"
              >
                <div>
                  <div className="font-medium">
                    {archetype.name}
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 ml-2">
                      {archetype.parentClassId}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{archetype.description}</p>
                </div>
                {onToggleArchetype && (
                  <button
                    type="button"
                    onClick={() => onToggleArchetype(archetype)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                    title="Remove archetype"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="bg-card p-4 rounded-lg border">
        <h3 className="text-lg font-semibold mb-3">Available Archetypes</h3>
        <div className="space-y-2">
          {orderedArchetypes.map((archetype) => {
            const isSelected = selectedArchetypeIds.includes(archetype.id);
            const classMatch = archetype.parentClassId === classId;

            return (
              <div
                key={archetype.id}
                className="flex items-start justify-between gap-3 p-3 bg-muted/30 rounded border transition-colors hover:bg-muted/50"
              >
                <div>
                  <div className="font-medium">
                    {archetype.name}
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 ml-2">
                      {archetype.parentClassId}
                    </Badge>
                    {classMatch && (
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0 ml-2">
                        Matches class
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{archetype.description}</p>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                    {archetype.features.map((feature) => (
                      <span
                        key={`${archetype.id}-${feature.level}-${feature.name}`}
                        className="rounded-full border border-dashed border-input px-2 py-1"
                      >
                        Level {feature.level}: {feature.name}
                      </span>
                    ))}
                  </div>
                </div>
                {onToggleArchetype && (
                  <button
                    type="button"
                    onClick={() => onToggleArchetype(archetype)}
                    className={`px-3 py-1.5 rounded border text-sm transition-colors ${
                      isSelected
                        ? 'border-destructive/40 text-destructive hover:border-destructive'
                        : 'hover:border-primary hover:text-primary'
                    }`}
                  >
                    {isSelected ? 'Remove' : 'Add'}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
