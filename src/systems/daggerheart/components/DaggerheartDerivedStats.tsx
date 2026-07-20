// purpose: Generic at-a-glance strip of the Daggerheart declarative derived
// quantities (Tier, Proficiency, damage thresholds, …) rendered as stat cards
// below the header. Built entirely from presentDerivedQuantities — adding a
// quantity in derivedQuantities.ts surfaces it here with no edit to this file.
import { Award, Gauge, Layers, ShieldAlert, ShieldX } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { PresentedDerivedQuantity } from '../../../rules/derivation';
import { CombatStatCard } from '../../../components/sheet';

// Icons the declarative derived quantities may name (spec.display.icon). Unknown
// names fall back to a neutral gauge, so a new quantity renders without editing
// this component.
const DERIVED_ICON_BY_NAME: Record<string, LucideIcon> = {
  Layers,
  Award,
  ShieldAlert,
  ShieldX,
};
function derivedIcon(name?: string): LucideIcon {
  return (name && DERIVED_ICON_BY_NAME[name]) || Gauge;
}

interface Props {
  /** Render-ready derived quantities from the declarative derivation layer. */
  derivedCards: PresentedDerivedQuantity[];
}

export function DaggerheartDerivedStats({ derivedCards }: Props) {
  if (derivedCards.length === 0) return null;
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {derivedCards.map((card) => (
        <CombatStatCard
          key={card.id}
          icon={derivedIcon(card.icon)}
          title={card.label}
          value={card.text}
        />
      ))}
    </div>
  );
}
