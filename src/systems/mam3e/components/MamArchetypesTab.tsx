import React, { Suspense } from 'react';
import type { Mam3eArchetype } from '../../../types/mam/archetypes';
import { Shield, X } from 'lucide-react';
import { Badge } from '../../../components/ui/Badge';
import { lazyWithPreload } from '../../../utils/lazyWithPreload';
import { MAM3E_ARCHETYPE_COPY } from '../../../utils/documentationCopy';
import { MamResourceLoadError } from './MamResourceLoadError';

const MamArchetypeBrowser = lazyWithPreload(async () => {
  const module = await import('../../../components/MamArchetypeBrowser');
  return { default: module.MamArchetypeBrowser };
});

interface Props {
  archetypesLoaded: boolean;
  archetypesError?: boolean;
  onRetryArchetypes?: () => void;
  archetypes: Mam3eArchetype[];
  pinnedArchetypeIds: string[];
  pinnedArchetypes: Mam3eArchetype[];
  onToggleArchetype?: (archetype: Mam3eArchetype) => void;
}

type MamArchetypesTabComponent = React.FC<Props> & {
  preload: () => Promise<unknown>;
};

export const MamArchetypesTab = (({
  archetypesLoaded,
  archetypesError,
  onRetryArchetypes,
  archetypes,
  pinnedArchetypeIds,
  pinnedArchetypes,
  onToggleArchetype,
}) =>
  archetypesError && !archetypesLoaded ? (
    <MamResourceLoadError resourceLabel="the M&M archetype catalog" onRetry={onRetryArchetypes} />
  ) : !archetypesLoaded ? (
    <div className="text-center py-8 text-muted-foreground">Click to load archetypes...</div>
  ) : (
    <div className="space-y-4">
      {pinnedArchetypes.length > 0 && (
        <section className="rounded-lg border bg-card p-4 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Shield className="w-5 h-5" /> Pinned Archetypes
            </h3>
            <Badge variant="secondary">{pinnedArchetypes.length}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">{MAM3E_ARCHETYPE_COPY.referenceOnly}</p>
          <div className="grid gap-3 md:grid-cols-2">
            {pinnedArchetypes.map((archetype) => (
              <article key={archetype.id} className="rounded-lg border bg-muted/20 p-3 space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-medium">{archetype.name}</div>
                    <div className="text-xs text-muted-foreground">{archetype.source}</div>
                  </div>
                  {onToggleArchetype && (
                    <button
                      type="button"
                      onClick={() => onToggleArchetype(archetype)}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                      title={`Unpin ${archetype.name}`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{archetype.description}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      <Suspense
        fallback={
          <div className="text-center py-8 text-muted-foreground text-sm">
            Loading Archetype Browser...
          </div>
        }
      >
        <MamArchetypeBrowser
          archetypes={archetypes}
          selectedArchetypeIds={pinnedArchetypeIds}
          onToggleArchetype={onToggleArchetype}
        />
      </Suspense>
    </div>
  )) as MamArchetypesTabComponent;

MamArchetypesTab.preload = () => MamArchetypeBrowser.preload();
