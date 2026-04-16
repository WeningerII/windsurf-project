import React from 'react';
import { Brain, Shield } from 'lucide-react';
import type { CharacterDocument } from '../../../types/core/document';
import type { Mam3eDataModel } from '../data-model';

interface Props {
  document: CharacterDocument<Mam3eDataModel>;
  canUpdate: boolean;
  onAbilityChange: (ability: keyof Mam3eDataModel['abilities'], value: number) => void;
  onDefenseRankChange: (defense: keyof Mam3eDataModel['defenses'], value: number) => void;
}

const ABILITIES: Array<{ label: string; key: keyof Mam3eDataModel['abilities'] }> = [
  { label: 'STR', key: 'str' },
  { label: 'STA', key: 'sta' },
  { label: 'AGI', key: 'agi' },
  { label: 'DEX', key: 'dex' },
  { label: 'FGT', key: 'fgt' },
  { label: 'INT', key: 'int' },
  { label: 'AWE', key: 'awe' },
  { label: 'PRE', key: 'pre' },
];

const DEFENSES: Array<{ label: string; key: keyof Mam3eDataModel['defenses'] }> = [
  { label: 'Dodge', key: 'dodge' },
  { label: 'Parry', key: 'parry' },
  { label: 'Fortitude', key: 'fortitude' },
  { label: 'Toughness', key: 'toughness' },
  { label: 'Will', key: 'will' },
];

export const MamAbilitiesTab: React.FC<Props> = ({
  document,
  canUpdate,
  onAbilityChange,
  onDefenseRankChange,
}) => {
  const data = document.system;

  return (
    <>
      <section>
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Brain className="w-5 h-5" /> Abilities
        </h3>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
          {ABILITIES.map(({ label, key }) => (
            <div
              key={key}
              className="flex flex-col items-center p-3 bg-card border rounded-lg hover:shadow-sm transition-shadow"
            >
              <span className="text-xs font-semibold text-muted-foreground uppercase">{label}</span>
              <input
                type="number"
                value={data.abilities[key]}
                onChange={(event) => onAbilityChange(key, Number(event.target.value))}
                className="w-14 text-center text-xl font-bold bg-transparent border-b border-input focus:outline-none focus:border-primary tabular-nums"
                disabled={!canUpdate}
                title={`${label} rank`}
              />
              <span className="text-xs text-muted-foreground tabular-nums">
                {data.abilities[key] * 2} PP
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-card p-4 rounded-lg border mt-6">
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Shield className="w-5 h-5" /> Defenses
        </h3>
        <div className="space-y-2">
          {DEFENSES.map(({ label, key }) => {
            const defense = data.defenses[key];

            return (
              <div
                key={key}
                className="flex justify-between items-center py-1 border-b last:border-0"
              >
                <span className="font-medium">{label}</span>
                <div className="flex items-center gap-3 text-sm">
                  <label className="flex items-center gap-1">
                    <span className="text-muted-foreground">Rank:</span>
                    <input
                      type="number"
                      value={defense.rank}
                      onChange={(event) => onDefenseRankChange(key, Number(event.target.value))}
                      className="w-12 text-center bg-transparent border-b border-input focus:outline-none focus:border-primary"
                      disabled={!canUpdate}
                    />
                  </label>
                  <span className="font-bold">Total: {defense.total}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
};
