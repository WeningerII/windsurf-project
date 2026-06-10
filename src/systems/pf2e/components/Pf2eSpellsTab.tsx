import React from 'react';
import { Sparkles } from 'lucide-react';
import { Badge } from '../../../components/ui/Badge';
import { abilityMod, formatMod } from '../../../utils/math';
import type { Spell } from '../../../types/magic/spells';
import {
  buildSpellPreparationConcepts,
  resolveSpellPreparationEntry,
} from '../../../utils/spellPreparation';
import { PF2E_SPELLS_COPY } from '../../../utils/documentationCopy';
import type { Pf2eSpellcasting } from '../data-model';
import { Pf2eProficiencyBadge } from './Pf2eProficiencyBadge';
import { Pf2eSpellBrowserPanel } from './Pf2eSpellBrowserPanel';

interface Props {
  classId?: string;
  spellcasting?: Pf2eSpellcasting;
  spellsLoaded: boolean;
  spells: Spell[];
  /** Key-ability score for spell attack/DC, or null when no key ability is set. */
  spellAbilityScore?: number | null;
  onSpellProficiencyTierCycle?: () => void;
  onSpellcastingChange?: (spellcasting: Pf2eSpellcasting) => void;
}

type Pf2eSpellsTabComponent = React.FC<Props> & {
  preload: () => Promise<unknown>;
};

function sortSpells(spells: Spell[]): Spell[] {
  return [...spells].sort(
    (left, right) => left.level - right.level || left.name.localeCompare(right.name)
  );
}

function prunePreparedRanks(
  preparedSpellsByRank: Pf2eSpellcasting['preparedSpellsByRank'],
  knownSpellIds: Set<string>
): Pf2eSpellcasting['preparedSpellsByRank'] {
  if (!preparedSpellsByRank) {
    return {};
  }

  const nextRanks: Record<number, string[]> = {};

  for (const [rank, spellIds] of Object.entries(preparedSpellsByRank)) {
    const filtered = spellIds.filter((spellId) => knownSpellIds.has(spellId));
    if (filtered.length > 0) {
      nextRanks[Number(rank)] = filtered;
    }
  }

  return nextRanks;
}

export const Pf2eSpellsTab = (({
  classId,
  spellcasting,
  spellsLoaded,
  spells,
  spellAbilityScore,
  onSpellProficiencyTierCycle,
  onSpellcastingChange,
}) => {
  const browseableSpells = React.useMemo(
    () => sortSpells(classId ? spells.filter((spell) => spell.classes.includes(classId)) : spells),
    [classId, spells]
  );
  const spellsById = React.useMemo(
    () => new Map(spells.map((spell) => [spell.id, spell])),
    [spells]
  );
  const spellConcepts = React.useMemo(
    () =>
      buildSpellPreparationConcepts({
        trackedSpellIds: spellcasting?.spellsKnown,
        alwaysPreparedSpellIds: spellcasting?.alwaysPreparedSpellIds,
        spellById: spellsById,
      }),
    [spellcasting?.alwaysPreparedSpellIds, spellcasting?.spellsKnown, spellsById]
  );
  const knownSpellEntries = spellConcepts.trackedSpells;
  const alwaysPreparedSpellEntries = spellConcepts.alwaysPreparedSpells;
  const focusSpellEntries = React.useMemo(
    () =>
      (spellcasting?.focusSpells ?? []).map((spellId) =>
        resolveSpellPreparationEntry(spellId, spellsById)
      ),
    [spellcasting?.focusSpells, spellsById]
  );

  const handleLearnSpell = React.useCallback(
    (spell: Spell) => {
      if (!spellcasting || !onSpellcastingChange) return;
      if (
        spellcasting.spellsKnown.includes(spell.id) ||
        spellcasting.alwaysPreparedSpellIds?.includes(spell.id)
      ) {
        return;
      }

      onSpellcastingChange({
        ...spellcasting,
        spellsKnown: [...spellcasting.spellsKnown, spell.id],
      });
    },
    [onSpellcastingChange, spellcasting]
  );

  const handleForgetSpell = React.useCallback(
    (spellId: string) => {
      if (!spellcasting || !onSpellcastingChange) return;

      const nextKnownSpellIds = spellcasting.spellsKnown.filter(
        (knownSpellId) => knownSpellId !== spellId
      );
      const nextKnownSpellSet = new Set(nextKnownSpellIds);

      onSpellcastingChange({
        ...spellcasting,
        spellsKnown: nextKnownSpellIds,
        ...(spellcasting.type === 'prepared'
          ? {
              preparedSpellsByRank: prunePreparedRanks(
                spellcasting.preparedSpellsByRank,
                nextKnownSpellSet
              ),
            }
          : {}),
      });
    },
    [onSpellcastingChange, spellcasting]
  );

  const handlePreparedSpellChange = React.useCallback(
    (rank: number, slotIndex: number, spellId: string) => {
      if (!spellcasting || !onSpellcastingChange) return;

      const nextPreparedSpellsByRank = { ...(spellcasting.preparedSpellsByRank ?? {}) };
      const nextRankSelections = [...(nextPreparedSpellsByRank[rank] ?? [])];

      nextRankSelections[slotIndex] = spellId;
      while (nextRankSelections.length > 0 && !nextRankSelections.at(-1)) {
        nextRankSelections.pop();
      }

      if (nextRankSelections.length > 0) {
        nextPreparedSpellsByRank[rank] = nextRankSelections;
      } else {
        delete nextPreparedSpellsByRank[rank];
      }

      onSpellcastingChange({
        ...spellcasting,
        preparedSpellsByRank: nextPreparedSpellsByRank,
      });
    },
    [onSpellcastingChange, spellcasting]
  );

  return (
    <>
      {spellcasting && (
        <section className="bg-card p-4 rounded-lg border space-y-4 mb-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Spellcasting
            </h3>
            <div className="flex items-center gap-2 text-xs">
              <Badge variant="secondary" className="capitalize">
                {spellcasting.tradition}
              </Badge>
              <Badge variant="outline" className="capitalize">
                {spellcasting.type}
              </Badge>
              <Badge variant="outline">{knownSpellEntries.length} spells tracked</Badge>
              {alwaysPreparedSpellEntries.length > 0 && (
                <Badge variant="outline">{alwaysPreparedSpellEntries.length} always prepared</Badge>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-xs font-medium text-muted-foreground">Spell Attack / DC</span>
            <div className="flex items-center gap-2">
              <Pf2eProficiencyBadge
                proficiency={spellcasting.proficiency}
                canUpdate={Boolean(onSpellcastingChange)}
                onClick={onSpellProficiencyTierCycle}
              />
              {/* CRB: spell attack = key ability mod + proficiency; DC = 10 + that. */}
              <span className="text-lg font-bold tabular-nums">
                {spellAbilityScore != null
                  ? formatMod(abilityMod(spellAbilityScore) + spellcasting.proficiency.total)
                  : '—'}
              </span>
              <span className="text-xs text-muted-foreground">/</span>
              <span className="text-lg font-bold tabular-nums">
                {spellAbilityScore != null
                  ? `DC ${10 + abilityMod(spellAbilityScore) + spellcasting.proficiency.total}`
                  : 'DC —'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-muted-foreground">Focus Points</span>
            <div className="flex gap-1">
              {Array.from({ length: spellcasting.focusPoints.max }, (_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => {
                    if (!onSpellcastingChange) return;
                    const nextFocusPoints = { ...spellcasting.focusPoints };
                    if (index < nextFocusPoints.current) nextFocusPoints.current -= 1;
                    else if (nextFocusPoints.current < nextFocusPoints.max) {
                      nextFocusPoints.current += 1;
                    }
                    onSpellcastingChange({ ...spellcasting, focusPoints: nextFocusPoints });
                  }}
                  disabled={!onSpellcastingChange}
                  className={`w-5 h-5 rounded-full border-2 transition-colors ${
                    index < spellcasting.focusPoints.current
                      ? 'bg-amber-500 border-amber-600 hover:bg-amber-400'
                      : 'border-input hover:border-amber-400'
                  }`}
                  title={
                    index < spellcasting.focusPoints.current
                      ? 'Spend focus point'
                      : 'Recover focus point'
                  }
                />
              ))}
            </div>
            <span className="text-xs tabular-nums text-muted-foreground">
              {spellcasting.focusPoints.current}/{spellcasting.focusPoints.max}
            </span>
          </div>

          <section className="space-y-2 rounded-md border p-3">
            <div className="flex items-center justify-between gap-3">
              <h4 className="text-sm font-semibold">Focus Spells</h4>
              <Badge variant="outline">Manual</Badge>
            </div>
            {focusSpellEntries.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">No focus spells tracked.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {focusSpellEntries.map((spell) => (
                  <span
                    key={spell.id}
                    className={`inline-flex items-center gap-1 rounded-full border border-amber-500/40 bg-amber-500/10 px-2 py-1 text-xs text-amber-700 ${
                      spell.unresolved ? 'border-dashed' : ''
                    }`}
                    title={
                      spell.unresolved
                        ? 'Loader data for this focus spell is currently unresolved.'
                        : undefined
                    }
                  >
                    <span>{spell.name}</span>
                    <Badge variant="outline">Applied manually</Badge>
                    {spell.unresolved && <Badge variant="destructive">Unresolved</Badge>}
                  </span>
                ))}
              </div>
            )}
          </section>

          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
            {Array.from({ length: 10 }, (_, index) => index + 1).map((level) => {
              const slot = spellcasting.spellSlots[level];
              if (!slot || slot.max === 0) return null;

              const remaining = slot.max - slot.used;

              return (
                <div key={level} className="text-center space-y-1">
                  <div className="text-[10px] font-medium text-muted-foreground">Lv {level}</div>
                  <div className="flex justify-center gap-0.5 flex-wrap">
                    {Array.from({ length: slot.max }, (_, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => {
                          if (!onSpellcastingChange) return;
                          const nextSpellSlots = { ...spellcasting.spellSlots };
                          if (index < remaining) {
                            nextSpellSlots[level] = { ...slot, used: slot.used + 1 };
                          } else {
                            nextSpellSlots[level] = { ...slot, used: Math.max(0, slot.used - 1) };
                          }
                          onSpellcastingChange({ ...spellcasting, spellSlots: nextSpellSlots });
                        }}
                        disabled={!onSpellcastingChange}
                        className={`w-4 h-4 rounded-full border-2 transition-colors ${
                          index < remaining
                            ? 'bg-primary border-primary/80 hover:bg-primary/80'
                            : 'border-input hover:border-primary/50'
                        }`}
                        title={
                          index < remaining
                            ? `Use level ${level} slot`
                            : `Recover level ${level} slot`
                        }
                      />
                    ))}
                  </div>
                  <div className="text-[10px] tabular-nums text-muted-foreground">
                    {remaining}/{slot.max}
                  </div>
                </div>
              );
            })}
          </div>

          <section className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-semibold">
                  {spellcasting.type === 'prepared' ? 'Spellbook' : 'Tracked Spells'}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {spellcasting.type === 'prepared'
                    ? 'Learned spells can be assigned to prepared slots by rank.'
                    : 'Track your repertoire here. Daily preparation is only shown for prepared casters.'}
                </p>
              </div>
              {classId && (
                <Badge variant="outline" className="capitalize">
                  {classId} spells
                </Badge>
              )}
            </div>

            {alwaysPreparedSpellEntries.length > 0 && (
              <div className="space-y-2 rounded-md border p-3">
                <div className="flex items-center justify-between gap-3">
                  <h5 className="text-sm font-medium">Always Prepared</h5>
                  <p className="text-xs text-muted-foreground">
                    {PF2E_SPELLS_COPY.alwaysPreparedSupport}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {alwaysPreparedSpellEntries.map((spell) => (
                    <span
                      key={spell.id}
                      className={`rounded-full border border-primary/40 bg-primary/10 px-2 py-1 text-xs text-primary ${
                        spell.unresolved ? 'border-dashed' : ''
                      }`}
                      title={
                        spell.unresolved
                          ? 'Loader data for this spell is currently unresolved.'
                          : undefined
                      }
                    >
                      {spell.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {knownSpellEntries.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No spells tracked yet. Use the browser below to add spells.
              </p>
            ) : (
              <div className="space-y-2">
                {knownSpellEntries.map((spell) => (
                  <div
                    key={spell.id}
                    className="flex items-center justify-between gap-3 rounded-md border px-3 py-2"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{spell.name}</span>
                        <Badge variant="outline">
                          {spell.level < 0
                            ? 'Unknown rank'
                            : spell.level === 0
                              ? 'Cantrip'
                              : `Rank ${spell.level}`}
                        </Badge>
                        {spell.unresolved && <Badge variant="destructive">Unresolved</Badge>}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {spell.unresolved
                          ? 'This spell id no longer resolves in the current loader data.'
                          : 'Tracked in the document and available for preparation where applicable.'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleForgetSpell(spell.id)}
                      disabled={!onSpellcastingChange}
                      className="text-xs px-2 py-1 rounded border border-input hover:bg-muted disabled:opacity-60"
                      aria-label={`Forget ${spell.name}`}
                    >
                      Forget
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {spellcasting.type === 'prepared' ? (
            <section className="space-y-3">
              <div>
                <h4 className="text-sm font-semibold">Prepared Slots</h4>
                <p className="text-xs text-muted-foreground">
                  {PF2E_SPELLS_COPY.preparedSlotsSupport}
                </p>
              </div>
              {Array.from({ length: 10 }, (_, index) => index + 1).map((rank) => {
                const slot = spellcasting.spellSlots[rank];
                if (!slot || slot.max === 0) {
                  return null;
                }

                const options = browseableSpells.filter(
                  (spell) =>
                    spell.level === rank && (spellcasting.spellsKnown ?? []).includes(spell.id)
                );
                const selections = spellcasting.preparedSpellsByRank?.[rank] ?? [];
                const preparedCount = selections.filter(Boolean).length;
                const fallbackSelections = selections
                  .filter((spellId) => !options.some((spell) => spell.id === spellId))
                  .map((spellId) => resolveSpellPreparationEntry(spellId, spellsById));

                return (
                  <div key={rank} className="rounded-md border p-3 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <h5 className="text-sm font-medium">Rank {rank}</h5>
                      <Badge variant="outline">
                        {preparedCount}/{slot.max} prepared
                      </Badge>
                    </div>
                    {options.length === 0 && fallbackSelections.length === 0 ? (
                      <p className="text-xs text-muted-foreground">
                        No tracked rank {rank} spells are currently available to prepare.
                      </p>
                    ) : (
                      <div className="grid gap-2 md:grid-cols-2">
                        {Array.from({ length: slot.max }, (_, slotIndex) => (
                          <label
                            key={slotIndex}
                            className="text-xs text-muted-foreground space-y-1"
                          >
                            <span className="block font-medium">Slot {slotIndex + 1}</span>
                            <select
                              value={selections[slotIndex] ?? ''}
                              onChange={(event) =>
                                handlePreparedSpellChange(rank, slotIndex, event.target.value)
                              }
                              disabled={!onSpellcastingChange}
                              aria-label={`Prepared rank ${rank} slot ${slotIndex + 1}`}
                              className="w-full rounded-md border border-input bg-background px-2 py-2 text-sm"
                            >
                              <option value="">Open slot</option>
                              {fallbackSelections.map((spell) => (
                                <option key={spell.id} value={spell.id}>
                                  {spell.name} (unresolved)
                                </option>
                              ))}
                              {options.map((spell) => (
                                <option key={spell.id} value={spell.id}>
                                  {spell.name}
                                </option>
                              ))}
                            </select>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </section>
          ) : (
            <section className="rounded-md border p-3 text-sm text-muted-foreground">
              {spellcasting.type === 'spontaneous'
                ? PF2E_SPELLS_COPY.spontaneousSupport
                : PF2E_SPELLS_COPY.innateSupport}
            </section>
          )}
        </section>
      )}

      {!spellsLoaded ? (
        <div className="text-center py-8 text-muted-foreground">Click to load spells...</div>
      ) : (
        <Pf2eSpellBrowserPanel spells={browseableSpells} onSelectSpell={handleLearnSpell} />
      )}
    </>
  );
}) as Pf2eSpellsTabComponent;

Pf2eSpellsTab.preload = () => Pf2eSpellBrowserPanel.preload();
