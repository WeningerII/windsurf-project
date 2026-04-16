import React from 'react';
import { Shield } from 'lucide-react';
import { DiceRollButton } from '../../../components/DiceRollButton';
import { abilityMod, formatMod } from '../../../utils/math';
import type { RollResult } from '../../../registry/types';
import { SAVE_ABILITIES } from '../constants';
import type { CharacterDocument } from '../../../types/core/document';
import type { Pf2eDataModel } from '../data-model';
import { Pf2eProficiencyBadge } from './Pf2eProficiencyBadge';

interface Props {
  document: CharacterDocument<Pf2eDataModel>;
  canUpdate: boolean;
  onCycleSaveTier: (saveId: keyof Pf2eDataModel['saveProficiencies']) => void;
  onRollCheck: (checkId: string) => Promise<RollResult>;
}

export const Pf2eSavesTab: React.FC<Props> = ({
  document,
  canUpdate,
  onCycleSaveTier,
  onRollCheck,
}) => {
  const data = document.system;

  return (
    <section>
      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
        <Shield className="w-5 h-5" /> Saving Throws
      </h3>
      <div className="grid grid-cols-3 gap-3">
        {Object.entries(SAVE_ABILITIES).map(([saveId, ability]) => {
          const save = data.saveProficiencies[saveId as keyof typeof data.saveProficiencies];
          const total = abilityMod(data.baseAttributes[ability] ?? 10) + (save?.total ?? 0);

          return (
            <div
              key={saveId}
              className="flex items-center justify-between p-3 bg-card border rounded-lg transition-shadow hover:shadow-sm"
            >
              <div className="flex items-center gap-2">
                <Pf2eProficiencyBadge
                  proficiency={save}
                  canUpdate={canUpdate}
                  onClick={() =>
                    onCycleSaveTier(saveId as keyof Pf2eDataModel['saveProficiencies'])
                  }
                />
                <div>
                  <div className="font-medium capitalize">{saveId}</div>
                  <div className="text-xs text-muted-foreground uppercase">{ability}</div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xl font-bold tabular-nums">{formatMod(total)}</span>
                <DiceRollButton label={`${saveId} Save`} onRoll={() => onRollCheck(saveId)} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
