import React from 'react';
import { abilityMod, formatMod, parseNum } from '../../../utils/math';

const ABILITIES = [
  { id: 'str', label: 'STR', title: 'Strength' },
  { id: 'dex', label: 'DEX', title: 'Dexterity' },
  { id: 'con', label: 'CON', title: 'Constitution' },
  { id: 'int', label: 'INT', title: 'Intelligence' },
  { id: 'wis', label: 'WIS', title: 'Wisdom' },
  { id: 'cha', label: 'CHA', title: 'Charisma' },
] as const;

interface Props {
  baseAttributes: Record<string, number>;
  canUpdate: boolean;
  onBaseAttributesChange: (baseAttributes: Record<string, number>) => void;
}

export const D20AbilitiesTab: React.FC<Props> = ({
  baseAttributes,
  canUpdate,
  onBaseAttributesChange,
}) => {
  return (
    <section>
      <h3 className="text-lg font-semibold mb-3">Ability Scores</h3>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {ABILITIES.map(({ id, label, title }) => {
          const key = id;
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
                  onBaseAttributesChange({
                    ...baseAttributes,
                    [key]: parseNum(e.target.value, 10),
                  })
                }
                className="w-14 text-center text-lg font-bold bg-transparent border-b border-input focus:outline-none focus:border-primary tabular-nums"
                disabled={!canUpdate}
                title={`${title} score`}
              />
              <span className="text-sm font-medium tabular-nums">{formatMod(mod)}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
};
