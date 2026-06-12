// purpose: Generic combat-toggle chips — surfaces feature-gated rider toggles
// (Rage, Sneak Attack, ...) for any system's rider compiler.
import React from 'react';
import { Zap } from 'lucide-react';

interface Props {
  /** Toggle ids this character is eligible for (feature/feat-gated). */
  availableToggles: string[];
  /** Currently active toggle ids persisted on the character. */
  activeToggles: string[];
  /** Display labels by toggle id (unlisted ids render as the raw id). */
  labels: Record<string, string>;
  onChange?: (activeToggles: string[]) => void;
}

export const CombatTogglesSection: React.FC<Props> = ({
  availableToggles,
  activeToggles,
  labels,
  onChange,
}) => {
  if (!availableToggles.length) return null;
  const active = new Set(activeToggles);

  const toggle = (id: string) => {
    if (!onChange) return;
    onChange(active.has(id) ? activeToggles.filter((t) => t !== id) : [...activeToggles, id]);
  };

  return (
    <section className="bg-card p-4 rounded-lg border space-y-3">
      <h3 className="text-sm font-semibold flex items-center gap-2">
        <Zap className="w-4 h-4" /> Combat Toggles
        {active.size > 0 && <span className="text-xs text-muted-foreground">({active.size})</span>}
      </h3>
      <div className="flex flex-wrap gap-2">
        {availableToggles.map((id) => {
          const isActive = active.has(id);
          return (
            <button
              key={id}
              onClick={() => toggle(id)}
              disabled={!onChange}
              aria-pressed={isActive}
              className={`text-sm px-3 py-1 rounded-full border transition-colors ${
                isActive
                  ? 'bg-amber-500/10 border-amber-500/40 text-amber-600 font-medium'
                  : 'border-input hover:bg-muted text-muted-foreground'
              }`}
            >
              {labels[id] ?? id}
            </button>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground italic">
        Active toggles add their riders to attack and damage rolls on the sheet and in scenes.
      </p>
    </section>
  );
};
