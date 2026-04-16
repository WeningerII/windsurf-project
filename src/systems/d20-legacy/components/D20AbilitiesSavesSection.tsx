import React from 'react';
import { Shield } from 'lucide-react';
import { abilityMod, formatMod, parseNum } from '../../../utils/math';
import { DiceRollButton } from '../../../components/DiceRollButton';
import { systemRegistry } from '../../../registry';
import type { CharacterDocument } from '../../../types/core/document';
import type { Dnd35eDataModel } from '../../dnd35e/data-model';
import type { Pf1eDataModel } from '../../pf1e/data-model';

const ABILITY_NAMES: Record<string, string> = {
  str: 'Strength',
  dex: 'Dexterity',
  con: 'Constitution',
  int: 'Intelligence',
  wis: 'Wisdom',
  cha: 'Charisma',
};

interface Props {
  document: CharacterDocument<Dnd35eDataModel | Pf1eDataModel>;
  baseAttributes: Record<string, number>;
  saves: Record<
    'fortitude' | 'reflex' | 'will',
    {
      base: number;
      ability: number;
      misc: number;
      total: number;
    }
  >;
  onUpdate: boolean;
  update: (
    changes: Partial<
      Pick<Dnd35eDataModel, 'baseAttributes' | 'saves'> &
        Pick<Pf1eDataModel, 'baseAttributes' | 'saves'>
    >
  ) => void;
}

export const D20AbilitiesSavesSection: React.FC<Props> = ({
  document,
  baseAttributes,
  saves,
  onUpdate,
  update,
}) => {
  return (
    <>
      <section className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Ability Scores</h3>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {Object.entries(ABILITY_NAMES).map(([key, label]) => {
            const score = baseAttributes[key] ?? 10;
            const mod = abilityMod(score);
            return (
              <div
                key={key}
                className="flex flex-col items-center p-3 bg-card border rounded-lg hover:shadow-sm transition-shadow"
              >
                <span className="text-xs font-semibold text-muted-foreground">{label}</span>
                <input
                  type="number"
                  value={score}
                  onChange={(e) =>
                    update({
                      baseAttributes: {
                        ...baseAttributes,
                        [key]: parseNum(e.target.value, 10),
                      },
                    })
                  }
                  className="w-14 text-center text-lg font-bold bg-transparent border-b border-input focus:outline-none focus:border-primary tabular-nums"
                  disabled={!onUpdate}
                  title={`${label} score`}
                />
                <span className="text-sm font-medium tabular-nums">{formatMod(mod)}</span>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Shield className="w-5 h-5" /> Saving Throws
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {(['fortitude', 'reflex', 'will'] as const).map((saveId) => {
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
                        update({
                          saves: {
                            ...saves,
                            [saveId]: { ...save, misc: parseNum(e.target.value, 0) },
                          },
                        })
                      }
                      className="w-full text-center font-medium text-foreground bg-transparent border-b border-input focus:outline-none focus:border-primary tabular-nums"
                      disabled={!onUpdate}
                      title={`${saveId} misc modifier`}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
};
