import { Plus, X } from 'lucide-react';
import { Badge } from '../../../../components/ui/Badge';
import { Button } from '../../../../components/ui/Button';
import { CharacterClass } from '../../../../types/character-options/classes';
import { ClassLevel, SkillProficiency } from '../../../../types/core/character';
import {
  formatDnd5eClassToolChoiceLabel,
  getDnd5eClassSkillChoiceSlots,
  getDnd5eClassToolChoiceSlots,
} from '../../../../utils/classTemplate';

interface Props {
  classLevels: ClassLevel[];
  classes: CharacterClass[];
  totalLevel: number;
  skillProficiencies: Record<string, SkillProficiency>;
  toolProficiencies: string[];
  pendingClassId: string;
  pendingClassLevel: string;
  classTemplateError: string | null;
  skillNames: Map<string, string>;
  canUpdate: boolean;
  onPendingClassIdChange: (value: string) => void;
  onPendingClassLevelChange: (value: string) => void;
  onClassRowChange: (targetClassId: string, nextClassId: string, level: number) => void;
  onClassLevelChange: (classId: string, value: string) => void;
  onSubclassChange: (classId: string, value: string) => void;
  onClassSkillSelectionChange: (
    classData: CharacterClass,
    classLevel: ClassLevel,
    slotIndex: number,
    skillId: string
  ) => void;
  onClassToolSelectionChange: (
    classData: CharacterClass,
    classLevel: ClassLevel,
    slotIndex: number,
    toolId: string
  ) => void;
  onAddClass: () => void;
  onRemoveClass: (classId: string) => void;
}

function canSelectSubclass(classData: CharacterClass, level: number): boolean {
  return level >= classData.subclassLevel || classData.subclassSelection?.timing === 'creation';
}

export function Dnd5eClassesSection({
  classLevels,
  classes,
  totalLevel,
  skillProficiencies,
  toolProficiencies,
  pendingClassId,
  pendingClassLevel,
  classTemplateError,
  skillNames,
  canUpdate,
  onPendingClassIdChange,
  onPendingClassLevelChange,
  onClassRowChange,
  onClassLevelChange,
  onSubclassChange,
  onClassSkillSelectionChange,
  onClassToolSelectionChange,
  onAddClass,
  onRemoveClass,
}: Props) {
  const totalClassLevels = classLevels.reduce((total, classLevel) => total + classLevel.level, 0);

  return (
    <section className="bg-card rounded-xl border shadow-sm p-4 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Classes</h2>
          <p className="text-xs text-muted-foreground">
            Starting class stays first. Additional rows use multiclass progression rules.
          </p>
        </div>
        <Badge variant="secondary">Total Level {totalLevel}</Badge>
      </div>

      {classLevels.length > 0 ? (
        <div className="space-y-2">
          {classLevels.map((classLevel, index) => {
            const otherLevels = totalClassLevels - classLevel.level;
            const maxLevel = Math.max(1, 20 - otherLevels);
            const classData = classes.find((entry) => entry.id === classLevel.classId);
            const usedClassIds = new Set(
              classLevels
                .filter((entry) => entry.classId !== classLevel.classId)
                .map((entry) => entry.classId)
            );
            const subclassSelectionUnlocked = classData
              ? canSelectSubclass(classData, classLevel.level)
              : false;
            const subclassCanChange = classData?.subclassSelection?.canChange ?? true;
            const subclassLockedAfterChoice = Boolean(classLevel.subclassId && !subclassCanChange);
            const subclassHelperText = classData
              ? subclassSelectionUnlocked
                ? classData.subclassSelection?.flavorText || 'Choose a subclass when available.'
                : `Subclass unlocks at level ${classData.subclassLevel}.`
              : 'Choose a class to load subclass options.';
            const showSubclassPicker = (classData?.subclasses.length || 0) > 0;
            const classSkillChoiceSlots =
              index === 0 && classData ? getDnd5eClassSkillChoiceSlots(classData) : [];
            const retainedClassSkills = new Set(
              Object.keys(skillProficiencies || {}).filter(
                (skillId) => !(classLevel.skillSelections || []).includes(skillId)
              )
            );
            const classSkillSlots = classSkillChoiceSlots.map((slot, slotIndex) => {
              const currentValue = classLevel.skillSelections?.[slotIndex] || '';
              const blockedValues = new Set(
                (classLevel.skillSelections || []).filter(
                  (value, selectionIndex) => value && selectionIndex !== slotIndex
                )
              );

              return {
                ...slot,
                slotIndex,
                value: currentValue,
                options: slot.options.filter(
                  (option) =>
                    option === currentValue ||
                    (!retainedClassSkills.has(option) && !blockedValues.has(option))
                ),
              };
            });
            const classToolChoiceSlots =
              index === 0 && classData ? getDnd5eClassToolChoiceSlots(classData) : [];
            const retainedClassTools = new Set(
              (toolProficiencies || []).filter(
                (toolId) => !(classLevel.toolSelections || []).includes(toolId)
              )
            );
            const classToolSlots = classToolChoiceSlots.map((slot, slotIndex) => {
              const currentValue = classLevel.toolSelections?.[slotIndex] || '';
              const blockedValues = new Set(
                (classLevel.toolSelections || []).filter(
                  (value, selectionIndex) => value && selectionIndex !== slotIndex
                )
              );

              return {
                ...slot,
                slotIndex,
                value: currentValue,
                options: slot.options.filter(
                  (option) =>
                    option === currentValue ||
                    (!retainedClassTools.has(option) && !blockedValues.has(option))
                ),
              };
            });

            return (
              <div
                key={classLevel.classId}
                className="grid gap-2 md:grid-cols-[minmax(0,1fr)_110px_auto] md:items-center"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      {index === 0 ? 'Starting Class' : `Class ${index + 1}`}
                    </span>
                  </div>
                  <select
                    value={classLevel.classId}
                    onChange={(event) =>
                      onClassRowChange(classLevel.classId, event.target.value, classLevel.level)
                    }
                    className="w-full px-3 py-2 border border-input rounded-md bg-transparent focus:outline-none focus:border-primary text-sm"
                    title={`Class ${index + 1}`}
                    disabled={!canUpdate}
                  >
                    <option value="">Class...</option>
                    {classes
                      .filter(
                        (entry) => entry.id === classLevel.classId || !usedClassIds.has(entry.id)
                      )
                      .map((entry) => (
                        <option key={entry.id} value={entry.id}>
                          {entry.name}
                        </option>
                      ))}
                  </select>
                  {showSubclassPicker && (
                    <label className="space-y-1 text-sm">
                      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Subclass
                      </span>
                      <select
                        value={classLevel.subclassId || ''}
                        onChange={(event) =>
                          onSubclassChange(classLevel.classId, event.target.value)
                        }
                        className="w-full px-3 py-2 border border-input rounded-md bg-transparent focus:outline-none focus:border-primary text-sm"
                        title={`${classLevel.classId} subclass`}
                        disabled={
                          !canUpdate || !subclassSelectionUnlocked || subclassLockedAfterChoice
                        }
                      >
                        <option value="">
                          {subclassSelectionUnlocked
                            ? 'Choose subclass...'
                            : `Choose at level ${classData?.subclassLevel ?? 1}`}
                        </option>
                        {classData?.subclasses.map((entry) => (
                          <option key={entry.id} value={entry.id}>
                            {entry.name}
                          </option>
                        ))}
                      </select>
                      <p className="text-xs text-muted-foreground">{subclassHelperText}</p>
                    </label>
                  )}
                  {classSkillSlots.length > 0 && classData && (
                    <div className="space-y-2">
                      <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Class Skills
                      </div>
                      {classSkillSlots.map((slot) => (
                        <label key={slot.slotIndex} className="block space-y-1 text-sm">
                          <span className="text-xs text-muted-foreground">{slot.label}</span>
                          <select
                            value={slot.value}
                            onChange={(event) =>
                              onClassSkillSelectionChange(
                                classData,
                                classLevel,
                                slot.slotIndex,
                                event.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-input rounded-md bg-transparent focus:outline-none focus:border-primary text-sm"
                            title={`${classLevel.classId} skill choice ${slot.slotIndex + 1}`}
                            disabled={!canUpdate}
                          >
                            <option value="">Select skill...</option>
                            {slot.options.map((option) => (
                              <option key={option} value={option}>
                                {skillNames.get(option) || option}
                              </option>
                            ))}
                          </select>
                        </label>
                      ))}
                    </div>
                  )}
                  {classToolSlots.length > 0 && classData && (
                    <div className="space-y-2">
                      <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Class Tools
                      </div>
                      {classToolSlots.map((slot) => (
                        <label key={slot.slotIndex} className="block space-y-1 text-sm">
                          <span className="text-xs text-muted-foreground">{slot.label}</span>
                          <select
                            value={slot.value}
                            onChange={(event) =>
                              onClassToolSelectionChange(
                                classData,
                                classLevel,
                                slot.slotIndex,
                                event.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-input rounded-md bg-transparent focus:outline-none focus:border-primary text-sm"
                            title={`${classLevel.classId} tool choice ${slot.slotIndex + 1}`}
                            disabled={!canUpdate}
                          >
                            <option value="">Select tool...</option>
                            {slot.options.map((option) => (
                              <option key={option} value={option}>
                                {formatDnd5eClassToolChoiceLabel(option)}
                              </option>
                            ))}
                          </select>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
                <label className="space-y-1 text-sm">
                  <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Level
                  </span>
                  <input
                    type="number"
                    value={classLevel.level}
                    onChange={(event) => onClassLevelChange(classLevel.classId, event.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-md bg-transparent focus:outline-none focus:border-primary tabular-nums"
                    min={1}
                    max={maxLevel}
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
              className="w-full px-3 py-2 border border-input rounded-md bg-transparent focus:outline-none focus:border-primary text-sm"
              title="Add class"
              disabled={totalClassLevels >= 20}
            >
              <option value="">Choose class...</option>
              {classes
                .filter(
                  (entry) => !classLevels.some((classLevel) => classLevel.classId === entry.id)
                )
                .map((entry) => (
                  <option key={entry.id} value={entry.id}>
                    {entry.name}
                  </option>
                ))}
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
              max={Math.max(1, 20 - totalClassLevels)}
              title="New class level"
              disabled={totalClassLevels >= 20}
            />
          </label>
          <div className="flex items-end md:justify-end">
            <Button
              type="button"
              onClick={onAddClass}
              disabled={!pendingClassId || totalClassLevels >= 20}
              className="gap-1"
            >
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
}
