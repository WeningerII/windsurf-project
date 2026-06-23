import { Plus, Swords, X } from 'lucide-react';
import { DiceRollButton } from '../../../components/DiceRollButton';
import { ContributionBreakdown } from '../../../components/shared/ContributionBreakdown';
import { systemRegistry } from '../../../registry';
import { entriesForTarget } from '../../../utils/contributionBreakdown';
import { parseNum } from '../../../utils/math';
import { ATTRIBUTES } from '../daggerheartSheetConstants';
import { useStableListKeys } from '../useStableListKeys';
import type { DaggerheartSheetController } from '../useDaggerheartSheetController';

interface Props {
  controller: DaggerheartSheetController;
}

export function DaggerheartCharacterBasicsSection({ controller }: Props) {
  const { data, canUpdate } = controller;
  const { keys: experienceKeys, removeKeyAt: removeExperienceKeyAt } = useStableListKeys(
    data.experiences.length
  );
  const evasionEntries = entriesForTarget(controller.contributionEntries, 'evasion');

  return (
    <>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <div className="rounded-lg border bg-card p-3 text-center">
          <div className="text-xs font-medium text-muted-foreground">Evasion</div>
          <div className="text-xl font-bold tabular-nums">{controller.derivedStats.evasion}</div>
          {evasionEntries.length > 0 && (
            <div className="mt-1 flex justify-center">
              <ContributionBreakdown entries={evasionEntries} label="Evasion" />
            </div>
          )}
        </div>
        <div className="rounded-lg border bg-card p-3 text-center">
          <div className="text-xs font-medium text-muted-foreground">Armor Score</div>
          <div className="text-xl font-bold tabular-nums">{controller.derivedStats.armorScore}</div>
        </div>
        <div className="rounded-lg border bg-card p-3 text-center">
          <div className="text-xs font-medium text-muted-foreground">Major Threshold</div>
          <div className="text-xl font-bold tabular-nums">
            {controller.derivedStats.majorThreshold}
          </div>
        </div>
        <div className="rounded-lg border bg-card p-3 text-center">
          <div className="text-xs font-medium text-muted-foreground">Severe Threshold</div>
          <div className="text-xl font-bold tabular-nums">
            {controller.derivedStats.severeThreshold}
          </div>
        </div>
      </div>

      <section className="rounded-lg border bg-card p-4">
        <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold">
          <Swords className="h-5 w-5" /> Attributes
        </h3>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {ATTRIBUTES.map((attr) => (
            <div key={attr.id} className="flex flex-col items-center rounded-lg bg-muted/20 p-3">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                {attr.pair}
              </span>
              <span className="text-xs font-semibold uppercase">{attr.label}</span>
              <input
                type="number"
                value={data.attributes[attr.id]}
                onChange={(event) =>
                  // Keep the previous value when the field is blanked instead
                  // of silently writing the -3 floor.
                  controller.updateAttr(
                    attr.id,
                    parseNum(event.target.value, data.attributes[attr.id])
                  )
                }
                className="mt-1 w-14 border-b border-input bg-transparent text-center text-xl font-bold tabular-nums focus:border-primary focus:outline-none"
                disabled={!canUpdate}
                title={`${attr.label} modifier`}
              />
              {controller.effectiveAttributes[attr.id] !== data.attributes[attr.id] && (
                <span className="text-[10px] text-muted-foreground">
                  Effective {controller.effectiveAttributes[attr.id] >= 0 ? '+' : ''}
                  {controller.effectiveAttributes[attr.id]}
                </span>
              )}
              <DiceRollButton
                label={`Roll ${attr.label}`}
                onRoll={() =>
                  systemRegistry
                    .get(controller.document.systemId)!
                    .engine.rollCheck(controller.document, attr.id)
                }
                className="mt-1"
              />
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-lg border bg-card p-4">
        <h3 className="mb-3 text-lg font-semibold">Experiences</h3>
        <div className="flex flex-wrap gap-2">
          {data.experiences.map((experience, index) => (
            <div
              key={experienceKeys[index]}
              className="flex items-center gap-1 rounded-full bg-muted/40 py-1 pl-3 pr-1.5"
            >
              <input
                value={experience}
                onChange={(event) => {
                  const updated = [...data.experiences];
                  updated[index] = event.target.value;
                  controller.update({ experiences: updated });
                }}
                className="w-28 bg-transparent text-sm focus:outline-none"
                disabled={!canUpdate}
              />
              {canUpdate && (
                <button
                  onClick={() => {
                    removeExperienceKeyAt(index);
                    controller.update({
                      experiences: data.experiences.filter((_, entryIndex) => entryIndex !== index),
                    });
                  }}
                  className="rounded-full p-0.5 transition-colors hover:bg-destructive/10 hover:text-destructive"
                  title="Remove experience"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          ))}
          {canUpdate && (
            <button
              onClick={() => controller.update({ experiences: [...data.experiences, ''] })}
              className="flex items-center gap-1 rounded-full border border-dashed border-input px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            >
              <Plus className="h-3 w-3" /> Add Experience
            </button>
          )}
        </div>
        {data.experiences.length === 0 && !canUpdate && (
          <p className="text-sm italic text-muted-foreground">No experiences listed.</p>
        )}
      </section>
    </>
  );
}
