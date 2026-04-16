import React from 'react';
import { Shield } from 'lucide-react';
import { CharacterDocument } from '../../../types/core/document';
import { formatMod, parseNum } from '../../../utils/math';
import { DiceRollButton } from '../../../components/DiceRollButton';
import { systemRegistry } from '../../../registry';
import { Dnd35eDataModel } from '../../dnd35e/data-model';
import { Pf1eDataModel } from '../../pf1e/data-model';

type D20SaveId = 'fortitude' | 'reflex' | 'will';

interface D20Save {
  base: number;
  ability: number;
  misc: number;
  total: number;
}

interface Props {
  document: CharacterDocument<Dnd35eDataModel | Pf1eDataModel>;
  saves: Record<D20SaveId, D20Save>;
  canUpdate: boolean;
  onSavesChange: (saves: Record<D20SaveId, D20Save>) => void;
}

const SAVE_IDS: D20SaveId[] = ['fortitude', 'reflex', 'will'];

export const D20SavesTab: React.FC<Props> = ({ document, saves, canUpdate, onSavesChange }) => {
  return (
    <section>
      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
        <Shield className="w-5 h-5" /> Saving Throws
      </h3>
      <div className="grid grid-cols-3 gap-3">
        {SAVE_IDS.map((saveId) => {
          const save = saves[saveId];
          return (
            <div
              key={saveId}
              className="bg-card border rounded-lg p-3 transition-shadow hover:shadow-sm"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold capitalize">{saveId}</span>
                <div className="flex items-center gap-1">
                  <span className="text-2xl font-bold tabular-nums">{formatMod(save.total)}</span>
                  <DiceRollButton
                    label={`${saveId} Save`}
                    onRoll={() => {
                      const saveRollId =
                        saveId === 'fortitude'
                          ? 'save-fort'
                          : saveId === 'reflex'
                            ? 'save-ref'
                            : 'save-will';
                      return systemRegistry
                        .get(document.systemId)!
                        .engine.rollCheck(document, saveRollId);
                    }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-1 text-xs text-muted-foreground">
                <div className="text-center">
                  <div>Base</div>
                  <div className="font-medium text-foreground tabular-nums">
                    {formatMod(save.base)}
                  </div>
                </div>
                <div className="text-center">
                  <div>Ability</div>
                  <div className="font-medium text-foreground tabular-nums">
                    {formatMod(save.ability)}
                  </div>
                </div>
                <div className="text-center">
                  <div>Misc</div>
                  <input
                    type="number"
                    value={save.misc}
                    onChange={(e) =>
                      onSavesChange({
                        ...saves,
                        [saveId]: { ...save, misc: parseNum(e.target.value, 0) },
                      })
                    }
                    className="w-full text-center font-medium text-foreground bg-transparent border-b border-input focus:outline-none focus:border-primary tabular-nums"
                    disabled={!canUpdate}
                    title={`${saveId} misc modifier`}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
