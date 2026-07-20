// purpose: Generic derived-stats cards for the PF2e sheet — one card per declared
// quantity that carries a `display`, driven entirely by the declarative
// derivation layer (src/rules/derivation). Adding a surfaced quantity in
// derivedQuantities.ts renders here with no edit to this component.
import React from 'react';
import { Gauge, Sparkles, Weight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { PresentedDerivedQuantity } from '../../../rules/derivation';
import { CombatStatCard } from '../../../components/sheet';

// Icons the declarative derived quantities may name (spec.display.icon). Unknown
// names fall back to a neutral gauge, so a new quantity renders without editing
// this component.
const DERIVED_ICON_BY_NAME: Record<string, LucideIcon> = { Weight, Sparkles };
function derivedIcon(name?: string): LucideIcon {
  return (name && DERIVED_ICON_BY_NAME[name]) || Gauge;
}

interface Props {
  /** Render-ready derived quantities from the declarative derivation layer. */
  derivedCards: PresentedDerivedQuantity[];
}

export const Pf2eDerivedStats: React.FC<Props> = ({ derivedCards }) => {
  if (derivedCards.length === 0) return null;
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {derivedCards.map((card) => (
        <CombatStatCard
          key={card.id}
          icon={derivedIcon(card.icon)}
          title={card.label}
          value={card.text}
          subtitle={card.hint}
        />
      ))}
    </div>
  );
};
