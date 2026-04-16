import { Suspense, type ComponentType } from 'react';
import { TabsContent } from '../../../../components/ui/Tabs';
import type { FeatDefinition } from '../../../../types/character-options/feats';
import { lazyWithPreload } from '../../../../utils/lazyWithPreload';
import { DND5E_FEAT_COPY } from '../../../../utils/documentationCopy';

type BrowserFeat = {
  id: string;
  name: string;
  system: string;
  source: string;
  description: string;
  benefits: string[];
  prerequisites?: Array<{ type: string; description: string }>;
};

type FeatBrowserProps = {
  feats: BrowserFeat[];
  onSelectFeat?: (feat: BrowserFeat) => void;
};

const FeatBrowser = lazyWithPreload<FeatBrowserProps>(async () => {
  const module = await import('../../../../components/FeatBrowser');
  return {
    default: module.FeatBrowser as ComponentType<FeatBrowserProps>,
  };
});

interface Props {
  systemId: string;
  featsLoaded: boolean;
  featTemplateError: string | null;
  featDefs: FeatDefinition[];
  onSelectFeat?: (featDefinition: FeatDefinition) => void;
}

type Dnd5eFeatBrowserTabComponent = React.FC<Props> & {
  preload: () => Promise<unknown>;
};

export const Dnd5eFeatBrowserTab = (({
  systemId,
  featsLoaded,
  featTemplateError,
  featDefs,
  onSelectFeat,
}: Props) => (
  <TabsContent value="feats" className="space-y-4">
    <div className="rounded-lg border bg-card p-4 text-sm text-muted-foreground">
      {DND5E_FEAT_COPY.browserSupport}
    </div>
    {featTemplateError && (
      <p className="text-sm text-destructive" role="alert">
        {featTemplateError}
      </p>
    )}
    {!featsLoaded ? (
      <div className="py-8 text-center text-muted-foreground">
        Open the Feats tab to load feat data.
      </div>
    ) : (
      <Suspense
        fallback={
          <div className="py-8 text-center text-sm text-muted-foreground">
            Loading feat browser...
          </div>
        }
      >
        <FeatBrowser
          feats={featDefs.map((feat) => ({
            id: feat.id,
            name: feat.name,
            system: systemId,
            source: feat.source,
            description: feat.description,
            benefits: feat.benefits,
            prerequisites: feat.prerequisites?.map((entry) => ({
              type: entry.type,
              description: entry.description || entry.type,
            })),
          }))}
          onSelectFeat={
            onSelectFeat
              ? (feat) => {
                  const selectedFeat = featDefs.find((entry) => entry.id === feat.id);
                  if (selectedFeat) {
                    onSelectFeat(selectedFeat);
                  }
                }
              : undefined
          }
        />
      </Suspense>
    )}
  </TabsContent>
)) as Dnd5eFeatBrowserTabComponent;

Dnd5eFeatBrowserTab.preload = () => FeatBrowser.preload();
