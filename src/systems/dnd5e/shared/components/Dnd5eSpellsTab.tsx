// purpose: Spells tab body — tracked/prepared/always-prepared spell surface with manual-edge honesty copy.
import { Suspense, type ComponentType } from 'react';
import type { SpellBrowserSpell } from '../../../../components/SpellBrowser';
import { Badge } from '../../../../components/ui/Badge';
import { TabsContent } from '../../../../components/ui/Tabs';
import type { Spell } from '../../../../types/magic/spells';
import {
  formatAreaOfEffect,
  formatCastingTime,
  formatDuration,
  formatRange,
} from '../../../../utils/formatters';
import { lazyWithPreload } from '../../../../utils/lazyWithPreload';
import { buildSpellPreparationConcepts } from '../../../../utils/spellPreparation';
import { DND5E_SPELLS_COPY } from '../../../../utils/documentationCopy';
import type {
  Dnd5eAlwaysPreparedSpellSource,
  Dnd5ePreparedCasterSummary,
} from '../spellPreparation';

type SpellBrowserProps = {
  spells: SpellBrowserSpell[];
  onSelectSpell?: (spell: SpellBrowserSpell) => void;
};

const SpellBrowser = lazyWithPreload<SpellBrowserProps>(async () => {
  const module = await import('../../../../components/SpellBrowser');
  return {
    default: module.SpellBrowser as ComponentType<SpellBrowserProps>,
  };
});

interface Props {
  spellcasting?: {
    spellsKnown: string[];
    spellsPrepared: string[];
    alwaysPreparedSpellIds?: string[];
  };
  spellsLoaded: boolean;
  spells: Spell[];
  spellNames: Map<string, string>;
  alwaysPreparedSpellIds: Set<string>;
  alwaysPreparedSpellSources?: Dnd5eAlwaysPreparedSpellSource[];
  preparedSpellIds: Set<string>;
  preparedCasterSummaries: Dnd5ePreparedCasterSummary[];
  onTogglePreparedSpell?: (spellId: string) => void;
  onSelectSpell?: (spell: Spell) => void;
}

type Dnd5eSpellsTabComponent = React.FC<Props> & {
  preload: () => Promise<unknown>;
};

export const Dnd5eSpellsTab = (({
  spellcasting,
  spellsLoaded,
  spells,
  spellNames,
  alwaysPreparedSpellIds,
  alwaysPreparedSpellSources = [],
  preparedSpellIds,
  preparedCasterSummaries,
  onTogglePreparedSpell,
  onSelectSpell,
}: Props) => {
  const spellById = new Map(spells.map((spell) => [spell.id, spell]));
  const spellConcepts = buildSpellPreparationConcepts({
    trackedSpellIds: spellcasting?.spellsKnown,
    preparedSpellIds: spellcasting?.spellsPrepared,
    alwaysPreparedSpellIds: [...alwaysPreparedSpellIds],
    spellById,
    manualNotes: [],
  });
  const alwaysPreparedSourcesBySpellId = alwaysPreparedSpellSources.reduce((index, source) => {
    const sources = index.get(source.spellId) ?? [];
    sources.push(source.source);
    index.set(source.spellId, sources);
    return index;
  }, new Map<string, string[]>());
  const singlePreparedCaster =
    preparedCasterSummaries.length === 1 ? preparedCasterSummaries[0] : null;
  const hasPreparedCasters = preparedCasterSummaries.length > 0;
  const isMulticlassPreparedCaster = preparedCasterSummaries.length > 1;
  const preparedLimitReached =
    singlePreparedCaster != null && preparedSpellIds.size >= singlePreparedCaster.preparedLimit;

  return (
    <TabsContent value="spells" className="space-y-4">
      {spellcasting ? (
        <>
          <section className="rounded-lg border bg-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Spells</h3>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">{spellConcepts.trackedSpells.length} tracked</Badge>
                {spellConcepts.alwaysPreparedSpells.length > 0 && (
                  <Badge variant="secondary">
                    {spellConcepts.alwaysPreparedSpells.length} always prepared
                  </Badge>
                )}
                {singlePreparedCaster && (
                  <Badge variant="outline">
                    Prepared Spells {preparedSpellIds.size}/{singlePreparedCaster.preparedLimit}
                  </Badge>
                )}
                {isMulticlassPreparedCaster && (
                  <Badge variant="outline">Prepared Spells {preparedSpellIds.size} total</Badge>
                )}
              </div>
            </div>
            {!hasPreparedCasters && (
              <p className="text-sm text-muted-foreground">{DND5E_SPELLS_COPY.knownSpellCasting}</p>
            )}
            {singlePreparedCaster && (
              <p className="text-sm text-muted-foreground">
                Prepare up to {singlePreparedCaster.preparedLimit} spells using{' '}
                {singlePreparedCaster.className} ({singlePreparedCaster.ability.toUpperCase()}).
              </p>
            )}
            {isMulticlassPreparedCaster && (
              <p className="text-sm text-muted-foreground">
                {DND5E_SPELLS_COPY.multiclassPreparedPrefix}{' '}
                {preparedCasterSummaries
                  .map((entry) => `${entry.className} ${entry.preparedLimit}`)
                  .join(', ')}
                .
              </p>
            )}
            {spellConcepts.alwaysPreparedSpells.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold">Always Prepared</h4>
                  <p className="text-xs text-muted-foreground">
                    {DND5E_SPELLS_COPY.alwaysPreparedSupport}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {spellConcepts.alwaysPreparedSpells.map((spell) => {
                    const sourceLabels = alwaysPreparedSourcesBySpellId.get(spell.id) ?? [];
                    return (
                      <span
                        key={spell.id}
                        className={`inline-flex items-center gap-1 rounded-full border border-primary/40 bg-primary/10 px-2 py-1 text-xs text-primary ${
                          spell.unresolved ? 'border-dashed' : ''
                        }`}
                        title={
                          spell.unresolved
                            ? 'Loader data for this spell is currently unresolved.'
                            : sourceLabels.length > 0
                              ? `Source: ${sourceLabels.join(', ')}`
                              : undefined
                        }
                      >
                        <span>{spell.name}</span>
                        {sourceLabels.length > 0 && (
                          <Badge variant="outline">{sourceLabels.join(', ')}</Badge>
                        )}
                        {spell.unresolved && <Badge variant="destructive">Unresolved</Badge>}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold">Tracked Spells</h4>
                <p className="text-xs text-muted-foreground">
                  {DND5E_SPELLS_COPY.trackedSpellsSupport}
                </p>
              </div>
              {spellConcepts.trackedSpells.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">
                  No spells selected yet. Use the browser below to add spells.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {spellConcepts.trackedSpells.map((spell) => (
                    <button
                      key={spell.id}
                      type="button"
                      className={`rounded-full border px-2 py-1 text-xs ${
                        preparedSpellIds.has(spell.id)
                          ? 'border-primary/40 bg-primary/10 text-primary'
                          : !hasPreparedCasters
                            ? 'border-input text-muted-foreground'
                            : preparedLimitReached
                              ? 'border-input text-muted-foreground'
                              : 'border-input'
                      }`}
                      onClick={() => onTogglePreparedSpell?.(spell.id)}
                      title="Toggle prepared"
                      disabled={
                        !preparedSpellIds.has(spell.id) &&
                        (!hasPreparedCasters || preparedLimitReached)
                      }
                    >
                      {spellNames.get(spell.id) || spell.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </section>

          {!spellsLoaded ? (
            <div className="py-8 text-center text-muted-foreground">
              Open the Spells tab to load spell data.
            </div>
          ) : (
            <Suspense
              fallback={
                <div className="py-8 text-center text-sm text-muted-foreground">
                  Loading spell browser...
                </div>
              }
            >
              <SpellBrowser
                spells={spells.map((spell) => ({
                  id: spell.id,
                  name: spell.name,
                  level: spell.level,
                  school: spell.school,
                  castingTime: formatCastingTime(spell.castingTime),
                  range: formatRange(spell.range),
                  duration: formatDuration(spell.duration),
                  description: spell.description,
                  classes: spell.classes || [],
                  traditions: spell.traditions,
                  tags: [...(spell.descriptors ?? []), ...(spell.traits ?? [])],
                  target: spell.target,
                  effect: spell.effect,
                  area: spell.area ?? formatAreaOfEffect(spell.areaOfEffect),
                  scaling: spell.atHigherLevels ?? spell.heightening?.summary,
                }))}
                onSelectSpell={
                  onSelectSpell
                    ? (selectedSpell) => {
                        const match = spells.find((entry) => entry.id === selectedSpell.id);
                        if (match) {
                          onSelectSpell(match);
                        }
                      }
                    : undefined
                }
              />
            </Suspense>
          )}
        </>
      ) : (
        <div className="rounded-lg border bg-card p-6 text-sm text-muted-foreground">
          Select a spellcasting class to unlock spell slots and spell browsing.
        </div>
      )}
    </TabsContent>
  );
}) as Dnd5eSpellsTabComponent;

Dnd5eSpellsTab.preload = () => SpellBrowser.preload();
