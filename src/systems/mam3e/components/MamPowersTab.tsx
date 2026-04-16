import React from 'react';
import { Activity, Plus, X } from 'lucide-react';
import { Badge } from '../../../components/ui/Badge';
import type { CharacterDocument } from '../../../types/core/document';
import type { Power } from '../../../types/mam/powers';
import type { PowerModifier } from '../../../data/mutants-and-masterminds/3e/modifiers/extras';
import type { Mam3eDataModel } from '../data-model';
import { calculatePowerPointCost, getPowerModifierRank, getPowerRank } from '../powerMath';

interface Props {
  document: CharacterDocument<Mam3eDataModel>;
  canUpdate: boolean;
  extraModifiers: PowerModifier[];
  flawModifiers: PowerModifier[];
  modifierById: Map<string, PowerModifier>;
  onUpdatePowerRank: (powerId: string, rank: number) => void;
  onUpdatePowerBaseCost: (powerId: string, baseCost: number) => void;
  onChangeModifierRank: (powerId: string, modifierId: string, delta: number) => void;
  onAddPowerModifier: (powerId: string, modifierType: 'extra' | 'flaw', modifierId: string) => void;
  onRemovePowerModifier: (
    powerId: string,
    modifierType: 'extra' | 'flaw',
    modifierId: string
  ) => void;
  onRemovePower: (powerId: string) => void;
  onAddPower: () => void;
}

export const MamPowersTab: React.FC<Props> = ({
  document,
  canUpdate,
  extraModifiers,
  flawModifiers,
  modifierById,
  onUpdatePowerRank,
  onUpdatePowerBaseCost,
  onChangeModifierRank,
  onAddPowerModifier,
  onRemovePowerModifier,
  onRemovePower,
  onAddPower,
}) => {
  const data = document.system;

  return (
    <section className="bg-card p-4 rounded-lg border">
      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
        <Activity className="w-5 h-5" /> Powers
      </h3>
      <div className="space-y-3">
        {data.powers.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">No powers added yet.</p>
        ) : (
          data.powers.map((power) => {
            const rank = getPowerRank(power);
            const powerCost = calculatePowerPointCost(power);
            const extraIds = power.extras ?? [];
            const flawIds = power.flaws ?? [];
            const availableExtras = extraModifiers.filter(
              (modifier) => !extraIds.includes(modifier.id)
            );
            const availableFlaws = flawModifiers.filter(
              (modifier) => !flawIds.includes(modifier.id)
            );

            return (
              <div
                key={power.id}
                className="p-3 bg-muted/30 rounded border transition-colors hover:bg-muted/50"
              >
                <div className="flex justify-between font-medium">
                  <span>{power.name}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="info">{power.action}</Badge>
                    {canUpdate && (
                      <button
                        type="button"
                        onClick={() => onRemovePower(power.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                        title="Remove power"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{power.description}</p>
                <div className="flex flex-wrap gap-2 mt-2 items-center">
                  <Badge variant="outline">{power.range}</Badge>
                  <Badge variant="outline">{power.duration}</Badge>
                  {power.perRank && (
                    <label className="text-xs text-muted-foreground flex items-center gap-1">
                      Rank
                      <input
                        type="number"
                        min={1}
                        value={rank}
                        onChange={(event) =>
                          onUpdatePowerRank(power.id, Number(event.target.value))
                        }
                        disabled={!canUpdate}
                        className="w-14 text-center bg-transparent border-b border-input focus:outline-none focus:border-primary tabular-nums"
                        title="Power rank"
                      />
                    </label>
                  )}
                  <label className="text-xs text-muted-foreground flex items-center gap-1">
                    Base
                    <input
                      type="number"
                      min={0}
                      step="1"
                      value={power.baseCost}
                      onChange={(event) =>
                        onUpdatePowerBaseCost(power.id, Number(event.target.value))
                      }
                      disabled={!canUpdate}
                      className="w-16 text-center bg-transparent border-b border-input focus:outline-none focus:border-primary tabular-nums"
                      title="Base cost per rank"
                    />
                  </label>
                  <Badge variant="secondary" className="tabular-nums">
                    {powerCost} PP
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                  <ModifierColumn
                    title="Extras"
                    power={power}
                    modifierIds={extraIds}
                    availableModifiers={availableExtras}
                    modifierById={modifierById}
                    canUpdate={canUpdate}
                    onChangeModifierRank={onChangeModifierRank}
                    onAddModifier={(modifierId) =>
                      onAddPowerModifier(power.id, 'extra', modifierId)
                    }
                    onRemoveModifier={(modifierId) =>
                      onRemovePowerModifier(power.id, 'extra', modifierId)
                    }
                  />
                  <ModifierColumn
                    title="Flaws"
                    power={power}
                    modifierIds={flawIds}
                    availableModifiers={availableFlaws}
                    modifierById={modifierById}
                    canUpdate={canUpdate}
                    onChangeModifierRank={onChangeModifierRank}
                    onAddModifier={(modifierId) => onAddPowerModifier(power.id, 'flaw', modifierId)}
                    onRemoveModifier={(modifierId) =>
                      onRemovePowerModifier(power.id, 'flaw', modifierId)
                    }
                  />
                </div>
              </div>
            );
          })
        )}

        {canUpdate && (
          <button
            type="button"
            onClick={onAddPower}
            className="w-full py-2 border border-dashed border-input rounded-lg text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-1"
          >
            <Plus className="w-4 h-4" /> Add Power
          </button>
        )}
      </div>
    </section>
  );
};

interface ModifierColumnProps {
  title: string;
  power: Power;
  modifierIds: string[];
  availableModifiers: PowerModifier[];
  modifierById: Map<string, PowerModifier>;
  canUpdate: boolean;
  onChangeModifierRank: (powerId: string, modifierId: string, delta: number) => void;
  onAddModifier: (modifierId: string) => void;
  onRemoveModifier: (modifierId: string) => void;
}

const ModifierColumn: React.FC<ModifierColumnProps> = ({
  title,
  power,
  modifierIds,
  availableModifiers,
  modifierById,
  canUpdate,
  onChangeModifierRank,
  onAddModifier,
  onRemoveModifier,
}) => (
  <div className="space-y-2">
    <div className="text-xs uppercase tracking-wide text-muted-foreground font-medium">{title}</div>
    {modifierIds.length === 0 ? (
      <p className="text-xs text-muted-foreground italic">No {title.toLowerCase()}.</p>
    ) : (
      modifierIds.map((modifierId) => {
        const modifier = modifierById.get(modifierId);
        if (!modifier) return null;
        const modifierRank = getPowerModifierRank(power, modifierId);

        return (
          <div
            key={modifierId}
            className="flex items-center justify-between gap-2 text-xs border border-input rounded px-2 py-1 bg-card/50"
          >
            <span className="font-medium">{modifier.name}</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => onChangeModifierRank(power.id, modifierId, -1)}
                disabled={!canUpdate}
                className="w-5 h-5 rounded border border-input hover:border-primary disabled:opacity-50"
                title="Decrease modifier rank"
              >
                -
              </button>
              <span className="tabular-nums min-w-[1.5rem] text-center">{modifierRank}</span>
              <button
                type="button"
                onClick={() => onChangeModifierRank(power.id, modifierId, 1)}
                disabled={!canUpdate}
                className="w-5 h-5 rounded border border-input hover:border-primary disabled:opacity-50"
                title="Increase modifier rank"
              >
                +
              </button>
              <button
                type="button"
                onClick={() => onRemoveModifier(modifierId)}
                disabled={!canUpdate}
                className="w-5 h-5 rounded border border-input hover:border-destructive hover:text-destructive disabled:opacity-50"
                title={`Remove ${title.toLowerCase().slice(0, -1)}`}
              >
                <X className="w-3 h-3 mx-auto" />
              </button>
            </div>
          </div>
        );
      })
    )}
    {canUpdate && (
      <select
        defaultValue=""
        onChange={(event) => {
          const modifierId = event.target.value;
          if (!modifierId) return;
          onAddModifier(modifierId);
          event.currentTarget.value = '';
        }}
        className="w-full px-2 py-1 text-xs border border-input rounded bg-transparent focus:outline-none focus:border-primary"
        title={`Add ${title.toLowerCase().slice(0, -1)}`}
      >
        <option value="">Add {title.toLowerCase().slice(0, -1)}...</option>
        {availableModifiers.map((modifier) => (
          <option key={modifier.id} value={modifier.id}>
            {modifier.name}
          </option>
        ))}
      </select>
    )}
  </div>
);
