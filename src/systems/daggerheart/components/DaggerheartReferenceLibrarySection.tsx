import { Badge } from '../../../components/ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/Tabs';
import { DaggerheartFeatureList } from '../daggerheartSheetShared';
import type { DaggerheartSheetController } from '../useDaggerheartSheetController';

interface Props {
  controller: DaggerheartSheetController;
}

export function DaggerheartReferenceLibrarySection({ controller }: Props) {
  if (controller.optionsState !== 'ready') {
    return null;
  }

  const { data, canUpdate } = controller;

  return (
    <section className="space-y-4 rounded-lg border bg-card p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h3 className="text-lg font-semibold">Reference Library</h3>
          <p className="text-sm text-muted-foreground">
            Browse every shipped Daggerheart SRD class, ancestry, and community entry and apply them
            directly to the sheet.
          </p>
        </div>
        <Badge variant="secondary">
          {controller.classOptions.length +
            controller.ancestryOptions.length +
            controller.communityOptions.length}{' '}
          SRD entries
        </Badge>
      </div>

      <Tabs defaultValue="classes">
        <TabsList className="h-auto w-full flex-wrap justify-start">
          <TabsTrigger value="classes">Class Library</TabsTrigger>
          <TabsTrigger value="ancestries">Ancestry Library</TabsTrigger>
          <TabsTrigger value="communities">Community Library</TabsTrigger>
        </TabsList>

        <TabsContent value="classes" className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {controller.classOptions.map((entry) => {
            const isSelected = entry.name === data.class;
            return (
              <article
                key={entry.id}
                className={`space-y-3 rounded-lg border p-4 ${
                  isSelected ? 'border-primary bg-primary/5' : 'bg-muted/10'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="text-base font-semibold">{entry.name}</h4>
                    <p className="text-sm text-muted-foreground">{entry.description}</p>
                  </div>
                  <div className="flex flex-wrap justify-end gap-2">
                    {isSelected && <Badge variant="info">Selected</Badge>}
                    <Badge variant="secondary">{entry.source}</Badge>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {entry.domains.map((domain) => (
                    <Badge key={domain} variant="outline">
                      {domain}
                    </Badge>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-lg bg-muted/30 p-3">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      Starting Evasion
                    </p>
                    <p className="text-lg font-semibold tabular-nums">{entry.startingEvasion}</p>
                  </div>
                  <div className="rounded-lg bg-muted/30 p-3">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      Starting Hit Points
                    </p>
                    <p className="text-lg font-semibold tabular-nums">{entry.startingHitPoints}</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Class Items
                  </p>
                  <p className="text-sm text-muted-foreground">{entry.classItems.join(' and ')}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Hope Feature
                  </p>
                  <DaggerheartFeatureList features={[entry.hopeFeature]} />
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Subclasses
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {entry.subclasses.map((subclass) => subclass.name).join(' / ')}
                  </p>
                </div>

                {canUpdate && (
                  <button
                    type="button"
                    onClick={() => controller.handleClassChange(entry.name)}
                    className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      isSelected
                        ? 'bg-primary/10 text-primary'
                        : 'border border-input hover:border-primary hover:text-primary'
                    }`}
                  >
                    {isSelected ? `${entry.name} Applied` : `Apply ${entry.name}`}
                  </button>
                )}
              </article>
            );
          })}
        </TabsContent>

        <TabsContent value="ancestries" className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {controller.ancestryOptions.map((entry) => {
            const isSelected = entry.name === data.heritage;
            return (
              <article
                key={entry.id}
                className={`space-y-3 rounded-lg border p-4 ${
                  isSelected ? 'border-primary bg-primary/5' : 'bg-muted/10'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="text-base font-semibold">{entry.name}</h4>
                    <p className="text-sm text-muted-foreground">{entry.description}</p>
                  </div>
                  <div className="flex flex-wrap justify-end gap-2">
                    {isSelected && <Badge variant="info">Selected</Badge>}
                    <Badge variant="secondary">{entry.source}</Badge>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Ancestry Features
                  </p>
                  <DaggerheartFeatureList features={entry.features} />
                </div>

                {canUpdate && (
                  <button
                    type="button"
                    onClick={() => controller.handleAncestryChange(entry.name)}
                    className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      isSelected
                        ? 'bg-primary/10 text-primary'
                        : 'border border-input hover:border-primary hover:text-primary'
                    }`}
                  >
                    {isSelected ? `${entry.name} Applied` : `Apply ${entry.name}`}
                  </button>
                )}
              </article>
            );
          })}
        </TabsContent>

        <TabsContent value="communities" className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {controller.communityOptions.map((entry) => {
            const isSelected = entry.name === data.community;
            return (
              <article
                key={entry.id}
                className={`space-y-3 rounded-lg border p-4 ${
                  isSelected ? 'border-primary bg-primary/5' : 'bg-muted/10'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="text-base font-semibold">{entry.name}</h4>
                    <p className="text-sm text-muted-foreground">{entry.description}</p>
                  </div>
                  <div className="flex flex-wrap justify-end gap-2">
                    {isSelected && <Badge variant="info">Selected</Badge>}
                    <Badge variant="secondary">{entry.source}</Badge>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Community Adjectives
                  </p>
                  <p className="text-sm text-muted-foreground">{entry.adjectives.join(', ')}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Community Feature
                  </p>
                  <DaggerheartFeatureList features={[entry.feature]} />
                </div>

                {canUpdate && (
                  <button
                    type="button"
                    onClick={() => controller.handleCommunityChange(entry.name)}
                    className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      isSelected
                        ? 'bg-primary/10 text-primary'
                        : 'border border-input hover:border-primary hover:text-primary'
                    }`}
                  >
                    {isSelected ? `${entry.name} Applied` : `Apply ${entry.name}`}
                  </button>
                )}
              </article>
            );
          })}
        </TabsContent>
      </Tabs>
    </section>
  );
}
