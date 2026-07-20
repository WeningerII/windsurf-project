// purpose: Generic at-a-glance strip of the mam3e declarative derived quantities
// (Initiative, starting PP budget, …) rendered as stat cards above the tabs.
import { Gauge, Target, Zap } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { PresentedDerivedQuantity } from '../../../rules/derivation';
import { CombatStatCard } from '../../../components/sheet';

// Icons the declarative derived quantities may name (spec.display.icon). Unknown
// names fall back to a neutral gauge, so a new quantity renders without editing
// this component.
const DERIVED_ICON_BY_NAME: Record<string, LucideIcon> = { Target, Zap };
function derivedIcon(name?: string): LucideIcon {
  return (name && DERIVED_ICON_BY_NAME[name]) || Gauge;
}

interface Props {
  /** Render-ready derived quantities from the declarative derivation layer. */
  derivedCards: PresentedDerivedQuantity[];
}

export function MamDerivedStats({ derivedCards }: Props) {
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
