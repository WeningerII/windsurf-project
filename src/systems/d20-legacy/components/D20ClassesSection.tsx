import React, { useMemo } from 'react';
import { Plus, X } from 'lucide-react';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { isDnd35eProductPrestigeClassId } from '../../../data/dnd/3.5e/prestige-classes/productCatalog';
import type { CharacterClass } from '../../../types/character-options/classes';
import type { GameSystemId } from '../../../types/game-systems';
import {
  getD20LegacySpellcastingAdvancement,
  getEligibleD20LegacySpellcastingTargets,
} from '../../../utils/d20LegacySpellcasting';

type D20LegacyClassLevel = {
  classId: string;
  level: number;
  spellcastingSelections?: string[];
};

interface Props {
  systemId: GameSystemId;
  totalLevel: number;
  classLevels: D20LegacyClassLevel[];
  classes: CharacterClass[];
  pendingClassId: string;
  pendingClassLevel: string;
  classTemplateError: string | null;
  canUpdate: boolean;
  onPendingClassIdChange: (classId: string) => void;
  onPendingClassLevelChange: (level: string) => void;
  onLoadOptions: () => void | Promise<void>;
  onClassRowChange: (targetClassId: string, nextClassId: string, level: number) => void;
  onClassLevelChange: (classId: string, value: string) => void;
  onSpellcastingSelectionChange: (
    targetClassId: string,
    trackIndex: number,
    selectedClassId: string
  ) => void;
  onAddClass: () => void;
  onRemoveClass: (classId: string) => void;
}

const PF1E_PRESTIGE_CLASS_IDS = new Set([
  'arcane-archer',
  'assassin',
  'dragon-disciple',
  'duelist',
  'lore-master',
  'mystic-theurge',
  'shadowdancer',
]);

function isPf1ePrestigeClassId(classId: string): boolean {
  return PF1E_PRESTIGE_CLASS_IDS.has(classId);
}

function renderClassOptions(classOptions: CharacterClass[], systemId: GameSystemId) {
  if (systemId !== 'pf1e' && systemId !== 'dnd-3.5e') {
    return classOptions.map((entry) => (
      <option key={entry.id} value={entry.id}>
        {entry.name}
      </option>
    ));
  }

  const isPrestigeClass =
    systemId === 'pf1e' ? isPf1ePrestigeClassId : isDnd35eProductPrestigeClassId;
  const baseClasses = classOptions.filter((entry) => !isPrestigeClass(entry.id));
  const prestigeClasses = classOptions.filter((entry) => isPrestigeClass(entry.id));

  return (
    <>
      {baseClasses.length > 0 && (
        <optgroup label="Base Classes">
          {baseClasses.map((entry) => (
            <option key={entry.id} value={entry.id}>
              {entry.name}
            </option>
          ))}
        </optgroup>
      )}
      {prestigeClasses.length > 0 && (
        <optgroup label="Prestige Classes">
          {prestigeClasses.map((entry) => (
            <option key={entry.id} value={entry.id}>
              {entry.name}
            </option>
          ))}
        </optgroup>
      )}
    </>
  );
}

export const D20ClassesSection: React.FC<Props> = ({
  systemId,
  totalLevel,
  classLevels,
  classes,
  pendingClassId,
  pendingClassLevel,
  classTemplateError,
  canUpdate,
  onPendingClassIdChange,
  onPendingClassLevelChange,
  onLoadOptions,
  onClassRowChange,
  onClassLevelChange,
  onSpellcastingSelectionChange,
  onAddClass,
  onRemoveClass,
}) => {
  const classCatalog = useMemo(() => new Map(classes.map((entry) => [entry.id, entry])), [classes]);

  return (
    <section className="bg-card rounded-xl border shadow-sm p-4 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Classes</h2>
          <p className="text-xs text-muted-foreground">
            Each class row tracks its own BAB, saves, hit dice, and feature progression.
          </p>
        </div>
        <Badge variant="secondary">Total Level {totalLevel}</Badge>
      </div>

      {classLevels.length > 0 ? (
        <div className="space-y-2">
          {classLevels.map((classLevel, index) => {
            const usedClassIds = new Set(
              classLevels
                .filter((entry) => entry.classId !== classLevel.classId)
                .map((entry) => entry.classId)
            );
            const classData = classCatalog.get(classLevel.classId);
            const spellcastingAdvancement = getD20LegacySpellcastingAdvancement(classData);

            return (
              <div key={classLevel.classId} className="space-y-2 rounded-lg border p-3">
                <div className="grid gap-2 md:grid-cols-[minmax(0,1fr)_110px_auto] md:items-center">
                  <div className="space-y-1">
                    <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      {index === 0 ? 'Starting Class' : `Class ${index + 1}`}
                    </span>
                    <select
                      value={classLevel.classId}
                      onChange={(event) =>
                        onClassRowChange(classLevel.classId, event.target.value, classLevel.level)
                      }
                      onFocus={() => {
                        void onLoadOptions();
                      }}
                      className="w-full px-3 py-2 border border-input rounded-md bg-transparent focus:outline-none focus:border-primary text-sm"
                      disabled={!canUpdate}
                      title={`Class ${index + 1}`}
                    >
                      <option value="">Class...</option>
                      {renderClassOptions(
                        classes.filter(
                          (entry) => entry.id === classLevel.classId || !usedClassIds.has(entry.id)
                        ),
                        systemId
                      )}
                    </select>
                  </div>
                  <label className="space-y-1 text-sm">
                    <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Level
                    </span>
                    <input
                      type="number"
                      value={classLevel.level}
                      onChange={(event) =>
                        onClassLevelChange(classLevel.classId, event.target.value)
                      }
                      className="w-full px-3 py-2 border border-input rounded-md bg-transparent focus:outline-none focus:border-primary tabular-nums"
                      min={1}
                      title={`${classLevel.classId} level`}
                      disabled={!canUpdate}
                    />
                  </label>
                  <div className="flex items-end md:justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveClass(classLevel.classId)}
                      disabled={!canUpdate || classLevels.length <= 1}
                      title={`Remove ${classLevel.classId}`}
                      className="gap-1"
                    >
                      <X className="h-4 w-4" />
                      Remove
                    </Button>
                  </div>
                </div>

                {spellcastingAdvancement && (
                  <div className="rounded-lg border border-dashed border-input bg-muted/10 p-3">
                    <div className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Spellcasting Advancement
                    </div>
                    <div className="grid gap-2 md:grid-cols-2">
                      {spellcastingAdvancement.tracks.map((track, trackIndex) => {
                        const selectedElsewhere = (classLevel.spellcastingSelections ?? []).filter(
                          (entry, entryIndex) => entry && entryIndex !== trackIndex
                        );
                        const options = getEligibleD20LegacySpellcastingTargets({
                          systemId,
                          classLevels,
                          classCatalog,
                          rowIndex: index,
                          track,
                          excludedClassIds: selectedElsewhere,
                        });

                        return (
                          <label
                            key={`${classLevel.classId}-${track.id}`}
                            className="space-y-1 text-sm"
                          >
                            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                              {track.label}
                            </span>
                            <select
                              value={classLevel.spellcastingSelections?.[trackIndex] || ''}
                              onChange={(event) =>
                                onSpellcastingSelectionChange(
                                  classLevel.classId,
                                  trackIndex,
                                  event.target.value
                                )
                              }
                              className="w-full px-3 py-2 border border-input rounded-md bg-transparent focus:outline-none focus:border-primary text-sm"
                              disabled={!canUpdate || options.length === 0}
                              title={`${classLevel.classId} ${track.label}`}
                            >
                              <option value="">
                                {options.length > 0
                                  ? `Select ${track.label.toLowerCase()}...`
                                  : `No eligible ${track.kind === 'any' ? 'spellcasting' : track.kind} class`}
                              </option>
                              {options.map((option) => (
                                <option key={option.classId} value={option.classId}>
                                  {option.className}
                                </option>
                              ))}
                            </select>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-input px-3 py-4 text-sm text-muted-foreground">
          No class template applied yet.
        </div>
      )}

      {canUpdate && (
        <div className="grid gap-2 rounded-lg border border-dashed border-input p-3 md:grid-cols-[minmax(0,1fr)_110px_auto] md:items-end">
          <label className="space-y-1 text-sm">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Add Class
            </span>
            <select
              value={pendingClassId}
              onChange={(event) => onPendingClassIdChange(event.target.value)}
              onFocus={() => {
                void onLoadOptions();
              }}
              className="w-full px-3 py-2 border border-input rounded-md bg-transparent focus:outline-none focus:border-primary text-sm"
              disabled={!canUpdate}
              title="Add class"
            >
              <option value="">Choose class...</option>
              {renderClassOptions(
                classes.filter(
                  (entry) => !classLevels.some((classLevel) => classLevel.classId === entry.id)
                ),
                systemId
              )}
            </select>
          </label>
          <label className="space-y-1 text-sm">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Level
            </span>
            <input
              type="number"
              value={pendingClassLevel}
              onChange={(event) => onPendingClassLevelChange(event.target.value)}
              className="w-full px-3 py-2 border border-input rounded-md bg-transparent focus:outline-none focus:border-primary tabular-nums"
              min={1}
              title="New class level"
              disabled={!canUpdate}
            />
          </label>
          <div className="flex items-end md:justify-end">
            <Button type="button" onClick={onAddClass} disabled={!pendingClassId} className="gap-1">
              <Plus className="h-4 w-4" />
              Add Class
            </Button>
          </div>
        </div>
      )}

      {classTemplateError && (
        <p className="text-sm text-destructive" role="alert">
          {classTemplateError}
        </p>
      )}
    </section>
  );
};
