// purpose: Saves tab body — saving-throw proficiency grid with derived totals.
import { Shield } from 'lucide-react';
import { DiceRollButton } from '../../../../components/DiceRollButton';
import { TabsContent } from '../../../../components/ui/Tabs';
import type { RollResult } from '../../../../registry/types';
import { abilityMod, formatMod } from '../../../../utils/math';

interface Props {
  abilityNames: Record<string, string>;
  attributes: Record<string, number>;
  savingThrowProficiencies: string[];
  profBonus: number;
  canUpdate: boolean;
  onToggleProficiency?: (abilityId: string) => void;
  onRollSave?: (abilityId: string) => Promise<RollResult>;
}

export function Dnd5eSavesTab({
  abilityNames,
  attributes,
  savingThrowProficiencies,
  profBonus,
  canUpdate,
  onToggleProficiency,
  onRollSave,
}: Props) {
  return (
    <TabsContent value="saves">
      <section className="space-y-3">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Shield className="w-5 h-5" /> Saving Throws
        </h3>
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3">
          {Object.entries(abilityNames).map(([abilityId, label]) => {
            const modifier =
              abilityMod(attributes[abilityId] ?? 10) +
              (savingThrowProficiencies.includes(abilityId) ? profBonus : 0);

            return (
              <div
                key={abilityId}
                className="flex items-center justify-between rounded-lg border bg-card p-3"
              >
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onToggleProficiency?.(abilityId)}
                    disabled={!canUpdate}
                    className="flex h-5 w-5 items-center justify-center rounded border"
                    title={`Toggle ${label} save proficiency`}
                  >
                    {savingThrowProficiencies.includes(abilityId) && (
                      <div className="h-3 w-3 rounded-sm bg-primary" />
                    )}
                  </button>
                  <div>
                    <div className="font-medium">{label}</div>
                    <div className="text-xs text-muted-foreground uppercase">{abilityId}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-lg font-bold tabular-nums">{formatMod(modifier)}</span>
                  {onRollSave && (
                    <DiceRollButton label={`${label} Save`} onRoll={() => onRollSave(abilityId)} />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </TabsContent>
  );
}
