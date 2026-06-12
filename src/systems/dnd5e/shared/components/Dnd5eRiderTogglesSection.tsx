// purpose: Combat-toggle chips (Rage / GWM / Sneak Attack) — surfaces the
// feature-gated rider toggles compiled by collectDnd5eRiderEffects.
import React from 'react';
import { Zap } from 'lucide-react';

const TOGGLE_LABELS: Record<string, string> = {
  rage: 'Rage',
  'great-weapon-master': 'Great Weapon Master (-5/+10)',
  sharpshooter: 'Sharpshooter (-5/+10)',
  'sneak-attack': 'Sneak Attack',
  'divine-smite': 'Divine Smite (2d8)',
};

interface Props {
  /** Toggle ids this character is eligible for (availableDnd5eToggles). */
  availableToggles: string[];
  /** Currently active toggle ids persisted on the character. */
  activeToggles: string[];
  onChange?: (activeToggles: string[]) => void;
}

export const Dnd5eRiderTogglesSection: React.FC<Props> = ({
  availableToggles,
  activeToggles,
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
              {TOGGLE_LABELS[id] ?? id}
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
