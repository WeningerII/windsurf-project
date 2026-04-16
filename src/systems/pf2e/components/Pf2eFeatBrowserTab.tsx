import React, { Suspense } from 'react';
import type { FeatDefinition } from '../../../types/character-options/feats';
import type { GameSystemId } from '../../../types/game-systems';
import { lazyWithPreload } from '../../../utils/lazyWithPreload';

const FeatBrowser = lazyWithPreload(async () => {
  const module = await import('../../../components/FeatBrowser');
  return { default: module.FeatBrowser };
});

interface Props {
  systemId: GameSystemId;
  featsLoaded: boolean;
  featDefs: FeatDefinition[];
}

type Pf2eFeatBrowserTabComponent = React.FC<Props> & {
  preload: () => Promise<unknown>;
};

export const Pf2eFeatBrowserTab = (({ systemId, featsLoaded, featDefs }) =>
  !featsLoaded ? (
    <div className="text-center py-8 text-muted-foreground">Click to load feat database...</div>
  ) : (
    <Suspense
      fallback={
        <div className="text-center py-8 text-muted-foreground text-sm">
          Loading Feat Browser...
        </div>
      }
    >
      <FeatBrowser
        feats={featDefs.map((feat) => ({
          id: feat.id,
          name: feat.name,
          system: systemId,
          description: feat.description,
          prerequisites: feat.prerequisites?.map((prerequisite) => ({
            type: prerequisite.type,
            description: prerequisite.description || prerequisite.type,
          })),
          benefits: feat.benefits,
          source: feat.source,
        }))}
      />
    </Suspense>
  )) as Pf2eFeatBrowserTabComponent;

Pf2eFeatBrowserTab.preload = () => FeatBrowser.preload();
