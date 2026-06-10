import { Badge } from '../../../components/ui/Badge';
import { domainDisplayName } from '../daggerheartSheetConstants';
import { DaggerheartFeatureList, DaggerheartSubclassFeatureGroup } from '../daggerheartSheetShared';
import type { DaggerheartSheetController } from '../useDaggerheartSheetController';

interface Props {
  controller: DaggerheartSheetController;
}

export function DaggerheartSelectionOverviewSection({ controller }: Props) {
  const { selectedClass, selectedAncestry, selectedCommunity, selectedSubclass } = controller;

  if (!selectedClass && !selectedAncestry && !selectedCommunity) {
    return null;
  }

  return (
    <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
      {selectedClass && (
        <article className="space-y-3 rounded-lg border bg-card p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold">{selectedClass.name}</h3>
              <p className="text-sm text-muted-foreground">{selectedClass.description}</p>
            </div>
            <Badge variant="secondary">{selectedClass.source}</Badge>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedClass.domains.map((domain) => (
              <Badge key={domain} variant="outline">
                {domainDisplayName(domain)}
              </Badge>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg bg-muted/30 p-3">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Starting Evasion
              </p>
              <p className="text-lg font-semibold tabular-nums">{selectedClass.startingEvasion}</p>
            </div>
            <div className="rounded-lg bg-muted/30 p-3">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Starting Hit Points
              </p>
              <p className="text-lg font-semibold tabular-nums">
                {selectedClass.startingHitPoints}
              </p>
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Class Items
            </p>
            <p className="text-sm text-muted-foreground">
              {selectedClass.classItems.join(' and ')}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Hope Feature
            </p>
            <DaggerheartFeatureList features={[selectedClass.hopeFeature]} />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Core Features
            </p>
            <DaggerheartFeatureList features={selectedClass.classFeatures} />
          </div>
          {selectedSubclass && (
            <div className="space-y-3 rounded-lg border border-dashed border-input p-3">
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="font-semibold">{selectedSubclass.name}</h4>
                {selectedSubclass.spellcastTrait && (
                  <Badge variant="warning">
                    Spellcast Trait: {selectedSubclass.spellcastTrait}
                  </Badge>
                )}
                {controller.passiveSpellcastBonus !== 0 && (
                  <Badge variant="secondary">
                    Spellcast Bonus: {controller.passiveSpellcastBonus > 0 ? '+' : ''}
                    {controller.passiveSpellcastBonus}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{selectedSubclass.description}</p>
              <DaggerheartSubclassFeatureGroup
                label="Foundation"
                features={selectedSubclass.foundationFeatures}
                fallback="No foundation features recorded."
              />
              <DaggerheartSubclassFeatureGroup
                label="Specialization"
                features={selectedSubclass.specializationFeatures}
                fallback="No specialization features recorded."
              />
              <DaggerheartSubclassFeatureGroup
                label="Mastery"
                features={selectedSubclass.masteryFeatures}
                fallback="No mastery features recorded."
              />
            </div>
          )}
        </article>
      )}

      {selectedAncestry && (
        <article className="space-y-3 rounded-lg border bg-card p-4">
          <div>
            <h3 className="text-lg font-semibold">{selectedAncestry.name}</h3>
            <p className="text-sm text-muted-foreground">{selectedAncestry.description}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Ancestry Features
            </p>
            <DaggerheartFeatureList features={selectedAncestry.features} />
          </div>
        </article>
      )}

      {selectedCommunity && (
        <article className="space-y-3 rounded-lg border bg-card p-4">
          <div>
            <h3 className="text-lg font-semibold">{selectedCommunity.name}</h3>
            <p className="text-sm text-muted-foreground">{selectedCommunity.description}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Community Adjectives
            </p>
            <p className="text-sm text-muted-foreground">
              {selectedCommunity.adjectives.join(', ')}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Community Feature
            </p>
            <DaggerheartFeatureList features={[selectedCommunity.feature]} />
          </div>
        </article>
      )}
    </section>
  );
}
