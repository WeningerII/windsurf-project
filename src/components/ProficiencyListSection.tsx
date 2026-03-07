import React from 'react';
import { Award } from 'lucide-react';

interface Props {
  armor: string[];
  weapons: string[];
  tools: string[];
  languages: string[];
}

const ProfGroup: React.FC<{ label: string; items: string[] }> = ({ label, items }) => {
  if (items.length === 0) return null;
  return (
    <div>
      <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">
        {label}
      </div>
      <div className="flex flex-wrap gap-1">
        {items.map((item) => (
          <span key={item} className="px-1.5 py-0.5 rounded bg-muted text-xs">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};

export const ProficiencyListSection: React.FC<Props> = ({ armor, weapons, tools, languages }) => {
  const total = armor.length + weapons.length + tools.length + languages.length;
  if (total === 0) return null;

  return (
    <section className="bg-card p-4 rounded-lg border space-y-3">
      <h3 className="text-sm font-semibold flex items-center gap-2">
        <Award className="w-4 h-4" /> Proficiencies
        <span className="text-xs text-muted-foreground">({total})</span>
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <ProfGroup label="Armor" items={armor} />
        <ProfGroup label="Weapons" items={weapons} />
        <ProfGroup label="Tools" items={tools} />
        <ProfGroup label="Languages" items={languages} />
      </div>
    </section>
  );
};
