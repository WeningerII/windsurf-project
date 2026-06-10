import React from 'react';
import { Badge } from '../../../components/ui/Badge';
import type { Spell } from '../../../types/magic/spells';
import {
  buildSpellPreparationConcepts,
  resolveSpellPreparationEntry,
} from '../../../utils/spellPreparation';
import { D20_LEGACY_MANUAL_NOTES } from '../../../utils/documentationCopy';
import type { D20LegacyData } from '../d20LegacySheetShared';
import { D20SpellBrowserPanel } from './D20SpellBrowserPanel';

function compareSpells(left: Spell, right: Spell): number {
  return left.level - right.level || left.name.localeCompare(right.name);
}

function formatSpellLevel(level: number): string {
  if (level < 0) {
    return 'Unknown level';
  }

  return level === 0 ? 'Level 0' : `Level ${level}`;
}

interface Props {
  spellsLoaded: boolean;
  spells: Spell[];
  spellListIds: string[];
  trackedSpellIds: string[];
  preparedSpellsByLevel: Record<number, string[]>;
  alwaysPreparedSpellIds: string[];
  spellSlots: Record<number, { total: number; used: number }>;
  spellSlotLevels: number[];
  manualSpellcastingExtras?: D20LegacyData['manualSpellcastingExtras'];
  canUpdate: boolean;
  onAddSpellLevel: () => void;
  onAddKnownSpell: (spell: Spell) => void;
  onRemoveKnownSpell: (spellId: string) => void;
  onSetPreparedSpell: (level: number, slotIndex: number, spellId: string) => void;
  onUseSpellSlot: (level: number) => void;
  onRecoverSpellSlot: (level: number) => void;
  onSetSpellSlotTotal: (level: number, total: number) => void;
  onSetManualExtraConsumed: (
    kind: 'domain' | 'specialist',
    level: number,
    consumed: boolean
  ) => void;
  onSetSpontaneousConversionReference: (reference: 'cure' | 'inflict' | 'both') => void;
  onSetDragonDiscipleBonusSlots: (patch: Partial<{ total: number; used: number }>) => void;
}

export const D20SpellsTab: React.FC<Props> = ({
  spellsLoaded,
  spells,
  spellListIds,
  trackedSpellIds,
  preparedSpellsByLevel,
  alwaysPreparedSpellIds,
  spellSlots,
  spellSlotLevels,
  manualSpellcastingExtras,
  canUpdate,
  onAddSpellLevel,
  onAddKnownSpell,
  onRemoveKnownSpell,
  onSetPreparedSpell,
  onUseSpellSlot,
  onRecoverSpellSlot,
  onSetSpellSlotTotal,
  onSetManualExtraConsumed,
  onSetSpontaneousConversionReference,
  onSetDragonDiscipleBonusSlots,
}) => {
  const browseableSpells = React.useMemo(() => {
    const sortedSpells = [...spells].sort(compareSpells);
    if (spellListIds.length === 0) {
      return sortedSpells;
    }

    return sortedSpells.filter((spell) =>
      spell.classes.some((classId) => spellListIds.includes(classId))
    );
  }, [spellListIds, spells]);
  // Resolve tracked spells against the FULL loaded spell list, not the
  // class-filtered browse list: spells tracked before a class change (or
  // off-list spells) must still resolve instead of rendering "Unresolved".
  const spellById = React.useMemo(
    () => new Map(spells.map((spell) => [spell.id, spell])),
    [spells]
  );
  const trackedSpellSet = React.useMemo(
    () => new Set([...trackedSpellIds, ...alwaysPreparedSpellIds]),
    [alwaysPreparedSpellIds, trackedSpellIds]
  );
  const spellConcepts = React.useMemo(
    () =>
      buildSpellPreparationConcepts({
        trackedSpellIds,
        alwaysPreparedSpellIds,
        spellById,
        manualNotes: [...D20_LEGACY_MANUAL_NOTES],
      }),
    [alwaysPreparedSpellIds, spellById, trackedSpellIds]
  );
  const preparedSlotLevels = React.useMemo(
    () =>
      spellSlotLevels.filter((level) => {
        const slot = spellSlots[level];
        return (slot?.total ?? 0) > 0 || (preparedSpellsByLevel[level]?.length ?? 0) > 0;
      }),
    [preparedSpellsByLevel, spellSlotLevels, spellSlots]
  );
  const manualExtraLevels = React.useMemo(
    () => spellSlotLevels.filter((level) => level > 0),
    [spellSlotLevels]
  );
  const spontaneousReference = manualSpellcastingExtras?.spontaneousConversionReference ?? 'both';
  const spontaneousSpellReferences = React.useMemo(
    () =>
      browseableSpells.filter((spell) => {
        const normalizedName = spell.name.toLowerCase();
        if (spontaneousReference === 'cure') {
          return normalizedName.startsWith('cure ');
        }
        if (spontaneousReference === 'inflict') {
          return normalizedName.startsWith('inflict ');
        }
        return normalizedName.startsWith('cure ') || normalizedName.startsWith('inflict ');
      }),
    [browseableSpells, spontaneousReference]
  );
  const dragonDiscipleSlots = manualSpellcastingExtras?.dragonDiscipleBonusSlots ?? {
    total: 0,
    used: 0,
  };

  return (
    <>
      <section className="bg-card p-4 rounded-lg border mb-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Spell Slots</h3>
          {canUpdate && (
            <button
              type="button"
              onClick={onAddSpellLevel}
              className="px-2 py-1 text-xs border border-dashed border-input rounded hover:border-primary hover:text-primary"
            >
              Add Level
            </button>
          )}
        </div>
        {spellSlotLevels.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">No spell slots configured.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {spellSlotLevels.map((level) => {
              const slot = spellSlots[level];
              if (!slot) {
                return null;
              }

              const remaining = Math.max(0, slot.total - slot.used);
              return (
                <div key={level} className="p-2 border rounded bg-muted/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{formatSpellLevel(level)}</span>
                    <span className="text-xs tabular-nums text-muted-foreground">
                      {remaining}/{slot.total}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="w-6 h-6 rounded border text-sm hover:border-primary disabled:opacity-50"
                      onClick={() => onUseSpellSlot(level)}
                      disabled={!canUpdate || remaining === 0}
                      title={`Use ${formatSpellLevel(level)} slot`}
                    >
                      -
                    </button>
                    <button
                      type="button"
                      className="w-6 h-6 rounded border text-sm hover:border-primary disabled:opacity-50"
                      onClick={() => onRecoverSpellSlot(level)}
                      disabled={!canUpdate || slot.used === 0}
                      title={`Recover ${formatSpellLevel(level)} slot`}
                    >
                      +
                    </button>
                    {canUpdate && (
                      <input
                        type="number"
                        min={0}
                        value={slot.total}
                        onChange={(event) => onSetSpellSlotTotal(level, Number(event.target.value))}
                        className="w-14 text-xs text-center border border-input rounded bg-transparent px-1 py-0.5 tabular-nums"
                        title={`Total ${formatSpellLevel(level)} slots`}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="bg-card p-4 rounded-lg border mb-4 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold">Manual Extras</h3>
          <Badge variant="outline">Manual</Badge>
        </div>

        <div className="grid gap-3 lg:grid-cols-2">
          <div className="rounded-md border p-3 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold">Domain Slots</h4>
              <Badge variant="secondary">1/level</Badge>
            </div>
            {manualExtraLevels.length === 0 ? (
              <p className="text-sm text-muted-foreground">No spell levels configured.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {manualExtraLevels.map((level) => {
                  const consumed = Boolean(
                    manualSpellcastingExtras?.domainSlotConsumedByLevel?.[level]
                  );
                  return (
                    <label
                      key={level}
                      className="inline-flex items-center gap-1 rounded border px-2 py-1 text-xs"
                    >
                      <input
                        type="checkbox"
                        checked={consumed}
                        disabled={!canUpdate}
                        onChange={(event) =>
                          onSetManualExtraConsumed('domain', level, event.target.checked)
                        }
                      />
                      <span>{formatSpellLevel(level)}</span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          <div className="rounded-md border p-3 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold">Specialist Slots</h4>
              <Badge variant="secondary">1/level</Badge>
            </div>
            {manualExtraLevels.length === 0 ? (
              <p className="text-sm text-muted-foreground">No spell levels configured.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {manualExtraLevels.map((level) => {
                  const consumed = Boolean(
                    manualSpellcastingExtras?.specialistSlotConsumedByLevel?.[level]
                  );
                  return (
                    <label
                      key={level}
                      className="inline-flex items-center gap-1 rounded border px-2 py-1 text-xs"
                    >
                      <input
                        type="checkbox"
                        checked={consumed}
                        disabled={!canUpdate}
                        onChange={(event) =>
                          onSetManualExtraConsumed('specialist', level, event.target.checked)
                        }
                      />
                      <span>{formatSpellLevel(level)}</span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-3 lg:grid-cols-2">
          <div className="rounded-md border p-3 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold">Spontaneous Conversion</h4>
              <select
                value={spontaneousReference}
                disabled={!canUpdate}
                onChange={(event) =>
                  onSetSpontaneousConversionReference(
                    event.target.value as 'cure' | 'inflict' | 'both'
                  )
                }
                className="rounded-md border border-input bg-background px-2 py-1 text-xs"
                aria-label="Spontaneous conversion reference"
              >
                <option value="both">Cure + Inflict</option>
                <option value="cure">Cure</option>
                <option value="inflict">Inflict</option>
              </select>
            </div>
            {spontaneousSpellReferences.length === 0 ? (
              <p className="text-sm text-muted-foreground">No cure or inflict spells loaded.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {spontaneousSpellReferences.slice(0, 12).map((spell) => (
                  <span key={spell.id} className="rounded-full border px-2 py-1 text-xs">
                    {spell.name}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-md border p-3 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold">Dragon Disciple Bonus Slots</h4>
              <Badge variant="outline">
                {dragonDiscipleSlots.total - dragonDiscipleSlots.used}/{dragonDiscipleSlots.total}
              </Badge>
            </div>
            <div className="flex items-center gap-3">
              <label className="text-xs text-muted-foreground space-y-1">
                <span className="block font-medium">Total</span>
                <input
                  type="number"
                  min={0}
                  value={dragonDiscipleSlots.total}
                  disabled={!canUpdate}
                  onChange={(event) =>
                    onSetDragonDiscipleBonusSlots({ total: Number(event.target.value) })
                  }
                  className="w-20 rounded-md border border-input bg-background px-2 py-1 text-sm"
                />
              </label>
              <label className="text-xs text-muted-foreground space-y-1">
                <span className="block font-medium">Used</span>
                <input
                  type="number"
                  min={0}
                  max={dragonDiscipleSlots.total}
                  value={dragonDiscipleSlots.used}
                  disabled={!canUpdate}
                  onChange={(event) =>
                    onSetDragonDiscipleBonusSlots({ used: Number(event.target.value) })
                  }
                  className="w-20 rounded-md border border-input bg-background px-2 py-1 text-sm"
                />
              </label>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-card p-4 rounded-lg border mb-4 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold">Spellbook</h3>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <Badge variant="secondary">{spellConcepts.trackedSpells.length} tracked</Badge>
            {spellConcepts.alwaysPreparedSpells.length > 0 && (
              <Badge variant="outline">
                {spellConcepts.alwaysPreparedSpells.length} always prepared
              </Badge>
            )}
          </div>
        </div>

        {spellConcepts.alwaysPreparedSpells.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Always Prepared</h4>
            <div className="flex flex-wrap gap-2">
              {spellConcepts.alwaysPreparedSpells.map((spell) => (
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

        {spellConcepts.trackedSpells.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No spells tracked yet. Use the browser below to add prepared spell options and spellbook
            entries.
          </p>
        ) : (
          <div className="space-y-2">
            {spellConcepts.trackedSpells.map((spell) => (
              <div
                key={spell.id}
                className="flex items-center justify-between gap-3 rounded-md border px-3 py-2"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{spell.name}</span>
                    <Badge variant="outline">{formatSpellLevel(spell.level)}</Badge>
                    {spell.unresolved && <Badge variant="destructive">Unresolved</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {spell.unresolved
                      ? 'This spell id no longer resolves in the current loader data.'
                      : 'Tracked in the document and available for preparation at its spell level.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveKnownSpell(spell.id)}
                  disabled={!canUpdate}
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

      <section className="bg-card p-4 rounded-lg border mb-4 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold">Prepared Slots</h3>
            <p className="text-xs text-muted-foreground">
              Assign tracked spells to each prepared slot. Duplicate preparations are supported,
              including Level 0 rows when you track them.
            </p>
          </div>
          <Badge variant="outline">{preparedSlotLevels.length} active levels</Badge>
        </div>

        {preparedSlotLevels.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No prepared slot rows are active yet. Use the slot tracker above to add a spell level.
          </p>
        ) : (
          <div className="space-y-3">
            {preparedSlotLevels.map((level) => {
              const slot = spellSlots[level];
              const selections = preparedSpellsByLevel[level] ?? [];
              const options = browseableSpells.filter(
                (spell) => spell.level === level && trackedSpellSet.has(spell.id)
              );
              const fallbackSelections = selections
                .filter((spellId) => !options.some((spell) => spell.id === spellId))
                .map((spellId) => resolveSpellPreparationEntry(spellId, spellById));

              if (!slot) {
                return null;
              }

              return (
                <div key={level} className="rounded-md border p-3 space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <h4 className="text-sm font-medium">{formatSpellLevel(level)}</h4>
                    <Badge variant="outline">
                      {selections.filter(Boolean).length}/{slot.total} prepared
                    </Badge>
                  </div>
                  {options.length === 0 && fallbackSelections.length === 0 ? (
                    <p className="text-xs text-muted-foreground">
                      No tracked {formatSpellLevel(level).toLowerCase()} spells are currently
                      available to prepare.
                    </p>
                  ) : (
                    <div className="grid gap-2 md:grid-cols-2">
                      {Array.from({ length: slot.total }, (_, slotIndex) => (
                        <label key={slotIndex} className="text-xs text-muted-foreground space-y-1">
                          <span className="block font-medium">Slot {slotIndex + 1}</span>
                          <select
                            value={selections[slotIndex] ?? ''}
                            onChange={(event) =>
                              onSetPreparedSpell(level, slotIndex, event.target.value)
                            }
                            disabled={!canUpdate}
                            aria-label={`Prepared ${formatSpellLevel(level).toLowerCase()} slot ${
                              slotIndex + 1
                            }`}
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
          </div>
        )}
      </section>

      <section className="bg-card p-4 rounded-lg border mb-4 space-y-2">
        <h3 className="text-sm font-semibold">Manual Notes</h3>
        <ul className="space-y-1 text-sm text-muted-foreground">
          {spellConcepts.manualNotes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </section>

      {!spellsLoaded ? (
        <div className="text-center py-8 text-muted-foreground">Click to load spells...</div>
      ) : (
        <D20SpellBrowserPanel spells={browseableSpells} onSelectSpell={onAddKnownSpell} />
      )}
    </>
  );
};
