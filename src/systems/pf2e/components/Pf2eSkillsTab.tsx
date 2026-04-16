import React from 'react';
import { Zap } from 'lucide-react';
import { DiceRollButton } from '../../../components/DiceRollButton';
import { abilityMod, formatMod } from '../../../utils/math';
import type { RollResult } from '../../../registry/types';
import { SKILL_ABILITIES } from '../constants';
import type { CharacterDocument } from '../../../types/core/document';
import type { Pf2eDataModel, Pf2eProficiencyTier } from '../data-model';
import { Pf2eProficiencyBadge } from './Pf2eProficiencyBadge';

function formatPf2eOptionLabel(value: string): string {
  return value
    .split('-')
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');
}

interface Props {
  document: CharacterDocument<Pf2eDataModel>;
  canUpdate: boolean;
  loreIds: string[];
  backgroundSkillChoice?: {
    label: string;
    options: string[];
  };
  backgroundLoreChoice?: {
    label: string;
    options: string[];
  };
  onCycleSkillTier: (skillId: string) => void;
  onCycleLoreTier: (loreId: string) => void;
  onBackgroundSkillTrainingChange: (value: string) => void;
  onBackgroundLoreTrainingChange: (value: string) => void;
  onRollCheck: (checkId: string) => Promise<RollResult>;
}

export const Pf2eSkillsTab: React.FC<Props> = ({
  document,
  canUpdate,
  loreIds,
  backgroundSkillChoice,
  backgroundLoreChoice,
  onCycleSkillTier,
  onCycleLoreTier,
  onBackgroundSkillTrainingChange,
  onBackgroundLoreTrainingChange,
  onRollCheck,
}) => {
  const data = document.system;

  return (
    <section className="space-y-4">
      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
        <Zap className="w-5 h-5" /> Skills
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {Object.entries(SKILL_ABILITIES).map(([skillId, ability]) => {
          const proficiency = data.skillProficiencies[skillId] ?? {
            tier: 'untrained' as Pf2eProficiencyTier,
            total: 0,
          };
          const total = abilityMod(data.baseAttributes[ability] ?? 10) + proficiency.total;

          return (
            <div
              key={skillId}
              className="flex items-center justify-between p-2 bg-card border rounded transition-colors hover:bg-muted/50"
            >
              <div className="flex items-center gap-2">
                <Pf2eProficiencyBadge
                  proficiency={proficiency}
                  canUpdate={canUpdate}
                  onClick={() => onCycleSkillTier(skillId)}
                />
                <div>
                  <span className="font-medium capitalize">{skillId.replace(/-/g, ' ')}</span>
                  <span className="text-xs text-muted-foreground ml-1 uppercase">({ability})</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-bold min-w-[3rem] text-right tabular-nums">
                  {formatMod(total)}
                </span>
                <DiceRollButton label={`${skillId} Check`} onRoll={() => onRollCheck(skillId)} />
              </div>
            </div>
          );
        })}
      </div>

      {(backgroundSkillChoice || backgroundLoreChoice) && (
        <div className="bg-card border rounded-lg p-4 space-y-3">
          <h4 className="font-semibold">Background Training</h4>
          {backgroundSkillChoice && (
            <label className="block space-y-1">
              <span className="text-xs text-muted-foreground">{backgroundSkillChoice.label}</span>
              <select
                value={data.backgroundSkillTrainingSelection || ''}
                onChange={(event) => onBackgroundSkillTrainingChange(event.target.value)}
                className="w-full px-2 py-1 border border-input rounded bg-transparent focus:outline-none focus:border-primary text-sm"
                disabled={!canUpdate}
                aria-label="Background skill training"
              >
                <option value="">Select trained skill...</option>
                {backgroundSkillChoice.options.map((option) => (
                  <option key={option} value={option}>
                    {formatPf2eOptionLabel(option)}
                  </option>
                ))}
              </select>
            </label>
          )}
          {backgroundLoreChoice && (
            <label className="block space-y-1">
              <span className="text-xs text-muted-foreground">{backgroundLoreChoice.label}</span>
              <select
                value={data.backgroundLoreTrainingSelection || ''}
                onChange={(event) => onBackgroundLoreTrainingChange(event.target.value)}
                className="w-full px-2 py-1 border border-input rounded bg-transparent focus:outline-none focus:border-primary text-sm"
                disabled={!canUpdate}
                aria-label="Background lore training"
              >
                <option value="">Select lore...</option>
                {backgroundLoreChoice.options.map((option) => (
                  <option key={option} value={option}>
                    {formatPf2eOptionLabel(option)}
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>
      )}

      {loreIds.length > 0 && (
        <div className="bg-card border rounded-lg p-4 space-y-2">
          <h4 className="font-semibold">Lore</h4>
          {loreIds.map((loreId) => {
            const proficiency = data.loreProficiencies[loreId];
            const total = abilityMod(data.baseAttributes.int ?? 10) + (proficiency?.total ?? 0);

            return (
              <div
                key={loreId}
                className="flex items-center justify-between p-2 bg-muted/30 rounded border"
              >
                <div className="flex items-center gap-2">
                  <Pf2eProficiencyBadge
                    proficiency={proficiency}
                    canUpdate={canUpdate}
                    onClick={() => onCycleLoreTier(loreId)}
                  />
                  <div className="font-medium capitalize">{loreId.replace(/-/g, ' ')}</div>
                </div>
                <span className="font-bold min-w-[3rem] text-right tabular-nums">
                  {formatMod(total)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
