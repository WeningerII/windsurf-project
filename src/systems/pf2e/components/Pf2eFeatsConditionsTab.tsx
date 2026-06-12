import React from 'react';
import { X } from 'lucide-react';
import { Badge } from '../../../components/ui/Badge';
import { ConditionPicker } from '../../../components/ConditionPicker';
import { CombatTogglesSection } from '../../../components/CombatTogglesSection';
import { availablePf2eToggles, PF2E_TOGGLE_LABELS } from '../../../rules/conditions/pf2eRiders';
import type { CharacterDocument } from '../../../types/core/document';
import type { Pf2eDataModel } from '../data-model';

const PF2E_CONDITIONS: string[] = [
  'Blinded',
  'Broken',
  'Clumsy',
  'Concealed',
  'Confused',
  'Controlled',
  'Dazzled',
  'Deafened',
  'Doomed',
  'Drained',
  'Dying',
  'Encumbered',
  'Enfeebled',
  'Fascinated',
  'Fatigued',
  'Flat-Footed',
  'Fleeing',
  'Frightened',
  'Grabbed',
  'Hidden',
  'Immobilized',
  'Invisible',
  'Observed',
  'Paralyzed',
  'Persistent Damage',
  'Petrified',
  'Prone',
  'Quickened',
  'Restrained',
  'Sickened',
  'Slowed',
  'Stunned',
  'Stupefied',
  'Unconscious',
  'Undetected',
  'Wounded',
];

const PF2E_VALUED_CONDITIONS = new Set([
  'clumsy',
  'doomed',
  'drained',
  'dying',
  'enfeebled',
  'frightened',
  'sickened',
  'slowed',
  'stunned',
  'stupefied',
  'wounded',
]);

interface Props {
  document: CharacterDocument<Pf2eDataModel>;
  canUpdate: boolean;
  onConditionsChange?: (conditions: Pf2eDataModel['conditions']) => void;
  onRemoveFeat?: (featId: string) => void;
  onActiveTogglesChange?: (activeToggles: string[]) => void;
}

export const Pf2eFeatsConditionsTab: React.FC<Props> = ({
  document,
  canUpdate,
  onConditionsChange,
  onRemoveFeat,
  onActiveTogglesChange,
}) => {
  const data = document.system;

  return (
    <>
      <CombatTogglesSection
        availableToggles={availablePf2eToggles({
          featureIds: new Set(data.features.map((feature) => feature.id)),
        })}
        activeToggles={data.activeToggles ?? []}
        labels={PF2E_TOGGLE_LABELS}
        onChange={canUpdate ? onActiveTogglesChange : undefined}
      />

      <ConditionPicker
        conditions={data.conditions}
        availableConditions={PF2E_CONDITIONS}
        valuedConditions={PF2E_VALUED_CONDITIONS}
        onChange={onConditionsChange}
      />

      <section className="bg-card p-4 rounded-lg border">
        <h3 className="text-lg font-semibold mb-3">Features</h3>
        <div className="space-y-2">
          {data.features.length === 0 ? (
            <p className="text-sm text-muted-foreground italic">
              No ancestry, class, or archetype features yet.
            </p>
          ) : (
            data.features.map((feature) => (
              <div
                key={`${feature.id}-${feature.source}`}
                className="p-2 bg-muted/30 rounded border transition-colors hover:bg-muted/50"
              >
                <div className="font-medium">
                  {feature.name}
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 ml-2">
                    {feature.source}
                  </Badge>
                </div>
                {feature.description && (
                  <p className="text-sm text-muted-foreground mt-1">{feature.description}</p>
                )}
              </div>
            ))
          )}
        </div>
      </section>

      <section className="bg-card p-4 rounded-lg border">
        <h3 className="text-lg font-semibold mb-3">Feats</h3>
        <div className="space-y-2">
          {data.feats.length === 0 ? (
            <p className="text-sm text-muted-foreground italic">No feats selected.</p>
          ) : (
            data.feats.map((feat) => (
              <div
                key={feat.id}
                className="flex items-start justify-between p-2 bg-muted/30 rounded border transition-colors hover:bg-muted/50"
              >
                <div>
                  <div className="font-medium">
                    {feat.name}{' '}
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0 ml-1">
                      Lv {feat.level}
                    </Badge>{' '}
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                      {feat.type}
                    </Badge>
                  </div>
                  {feat.description && (
                    <p className="text-sm text-muted-foreground mt-1">{feat.description}</p>
                  )}
                </div>
                {canUpdate && onRemoveFeat && (
                  <button
                    type="button"
                    onClick={() => onRemoveFeat(feat.id)}
                    className="text-muted-foreground hover:text-destructive transition-colors ml-2"
                    title="Remove feat"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </section>
    </>
  );
};
