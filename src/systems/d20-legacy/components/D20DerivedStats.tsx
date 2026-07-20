// purpose: Generic at-a-glance strip of the d20-legacy (D&D 3.5e / Pathfinder 1e)
// declarative derived quantities (max skill ranks, feats/ability increases from
// level, …) rendered as stat cards. Driven entirely by each system's derived
// map via presentDerivedQuantities, so a new spec surfaces here with no edit.
import { Award, Gauge, GraduationCap, TrendingUp } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { PresentedDerivedQuantity } from '../../../rules/derivation';
import { CombatStatCard } from '../../../components/sheet';

// Icons the declarative derived quantities may name (spec.display.icon). Unknown
// names fall back to a neutral gauge, so a new quantity renders without editing
// this component.
const DERIVED_ICON_BY_NAME: Record<string, LucideIcon> = {
  Award,
  GraduationCap,
  TrendingUp,
};
function derivedIcon(name?: string): LucideIcon {
  return (name && DERIVED_ICON_BY_NAME[name]) || Gauge;
}

interface Props {
  /** Render-ready derived quantities from the declarative derivation layer. */
  derivedCards: PresentedDerivedQuantity[];
}

export function D20DerivedStats({ derivedCards }: Props) {
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
