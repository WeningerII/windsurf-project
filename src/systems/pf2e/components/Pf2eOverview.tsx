import React from 'react';
import { Eye, Heart, Swords } from 'lucide-react';
import { DamageHealControl } from '../../../components/DamageHealControl';
import { DiceRollButton } from '../../../components/DiceRollButton';
import { RestControls } from '../../../components/RestControls';
import { abilityMod, formatMod } from '../../../utils/math';
import type { RollResult } from '../../../registry/types';
import type { CharacterDocument } from '../../../types/core/document';
import type { Pf2eDataModel } from '../data-model';
import { Pf2eProficiencyBadge } from './Pf2eProficiencyBadge';

interface Props {
  document: CharacterDocument<Pf2eDataModel>;
  canUpdate: boolean;
  classDcScore: number;
  onHitPointsChange: (current: number, max: number) => void;
  onPerceptionTierCycle: () => void;
  onPerceptionRoll: () => Promise<RollResult>;
  onShortRest?: () => void;
  onLongRest?: () => void;
}

export const Pf2eOverview: React.FC<Props> = ({
  document,
  canUpdate,
  classDcScore,
  onHitPointsChange,
  onPerceptionTierCycle,
  onPerceptionRoll,
  onShortRest,
  onLongRest,
}) => {
  const data = document.system;

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-card border rounded-lg p-4 text-center transition-shadow hover:shadow-sm">
          <div className="text-xs font-medium text-muted-foreground">AC</div>
          <div className="text-3xl font-bold tabular-nums">{data.armorClass}</div>
        </div>
        <div className="bg-card border rounded-lg p-4 text-center transition-shadow hover:shadow-sm">
          <div className="text-xs font-medium text-muted-foreground flex items-center justify-center gap-1">
            <Heart className="w-3 h-3" /> HP
          </div>
          <div className="flex items-center justify-center gap-1">
            <input
              type="number"
              value={data.hitPoints.current}
              onChange={(event) =>
                onHitPointsChange(Number(event.target.value), data.hitPoints.max)
              }
              className="w-14 text-center text-2xl font-bold bg-transparent border-b border-input focus:outline-none focus:border-primary tabular-nums"
              disabled={!canUpdate}
              title="Current HP"
            />
            <span className="text-muted-foreground">/</span>
            <input
              type="number"
              value={data.hitPoints.max}
              onChange={(event) =>
                onHitPointsChange(data.hitPoints.current, Number(event.target.value))
              }
              className="w-14 text-center text-lg bg-transparent border-b border-input focus:outline-none focus:border-primary tabular-nums"
              disabled={!canUpdate}
              title="Max HP"
            />
          </div>
          {data.hitPoints.temp > 0 && (
            <div className="text-xs text-blue-500 tabular-nums">+{data.hitPoints.temp} temp</div>
          )}
          {canUpdate && (
            <DamageHealControl
              onApply={(amount, type) => {
                const nextCurrent =
                  type === 'damage'
                    ? Math.max(0, data.hitPoints.current - amount)
                    : Math.min(data.hitPoints.max, data.hitPoints.current + amount);
                onHitPointsChange(nextCurrent, data.hitPoints.max);
              }}
            />
          )}
        </div>
        <div className="bg-card border rounded-lg p-4 text-center transition-shadow hover:shadow-sm">
          <div className="text-xs font-medium text-muted-foreground">Speed</div>
          <div className="text-2xl font-bold tabular-nums">{data.speed} ft</div>
        </div>
        <div className="bg-card border rounded-lg p-4 text-center transition-shadow hover:shadow-sm">
          <div className="text-xs font-medium text-muted-foreground flex items-center justify-center gap-1">
            <Eye className="w-3 h-3" /> Perception
          </div>
          <div className="flex items-center justify-center gap-2">
            <Pf2eProficiencyBadge
              proficiency={data.perceptionProficiency}
              canUpdate={canUpdate}
              onClick={onPerceptionTierCycle}
            />
            <span className="text-xl font-bold tabular-nums">
              {formatMod(
                abilityMod(data.baseAttributes.wis ?? 10) + data.perceptionProficiency.total
              )}
            </span>
            <DiceRollButton label="Perception" onRoll={onPerceptionRoll} />
          </div>
        </div>
        <div className="bg-card border rounded-lg p-4 text-center transition-shadow hover:shadow-sm">
          <div className="text-xs font-medium text-muted-foreground flex items-center justify-center gap-1">
            <Swords className="w-3 h-3" /> Class DC
          </div>
          <div className="text-2xl font-bold tabular-nums">
            {10 + data.level + 2 + abilityMod(classDcScore)}
          </div>
        </div>
      </div>

      <RestControls
        showExhaustion={false}
        onShortRest={canUpdate ? onShortRest : undefined}
        onLongRest={canUpdate ? onLongRest : undefined}
      />
    </>
  );
};
