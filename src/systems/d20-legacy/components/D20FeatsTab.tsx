import React from 'react';
import { Plus, X } from 'lucide-react';
import { Badge } from '../../../components/ui/Badge';
import { ConditionPicker } from '../../../components/ConditionPicker';
import { FeaturesSection } from '../../../components/FeaturesSection';
import { D20_LEGACY_CONDITION_NAMES } from '../../../rules/conditions/d20LegacyConditions';
import type { Pf1eTrait } from '../../pf1e/data-model';
import type { Feature } from '../../../types/core/character';

type FeatEntry = {
  id: string;
  name: string;
  description: string;
  source: string;
};

interface Props {
  features: Feature[];
  feats: FeatEntry[];
  isPf1e: boolean;
  traits: Pf1eTrait[];
  traitOptions: Pf1eTrait[];
  traitsLoaded: boolean;
  selectedTraitId: string;
  canUpdate: boolean;
  conditions: Array<{ id: string; name: string }>;
  onConditionChange?: (conditions: Array<{ id: string; name: string }>) => void;
  onRemoveFeat: (featId: string) => void;
  onAddFeat: () => void;
  onSelectedTraitIdChange: (traitId: string) => void;
  onLoadTraitOptions: () => void | Promise<void>;
  onAddTrait: () => void;
  onRemoveTrait: (traitId: string) => void;
}

export const D20FeatsTab: React.FC<Props> = ({
  features,
  feats,
  isPf1e,
  traits,
  traitOptions,
  traitsLoaded,
  selectedTraitId,
  canUpdate,
  conditions,
  onConditionChange,
  onRemoveFeat,
  onAddFeat,
  onSelectedTraitIdChange,
  onLoadTraitOptions,
  onAddTrait,
  onRemoveTrait,
}) => (
  <div className="space-y-4">
    <FeaturesSection features={features} />
    <ConditionPicker
      conditions={conditions}
      availableConditions={D20_LEGACY_CONDITION_NAMES}
      onChange={canUpdate ? onConditionChange : undefined}
    />
    <section className="bg-card p-4 rounded-lg border">
      <h3 className="text-lg font-semibold mb-3">Feats</h3>
      <div className="space-y-2">
        {feats.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">No feats selected.</p>
        ) : (
          feats.map((feat) => (
            <div
              key={feat.id}
              className="flex items-start justify-between p-2 bg-muted/30 rounded border transition-colors hover:bg-muted/50"
            >
              <div>
                <span className="font-medium">{feat.name}</span>
                {feat.description && (
                  <p className="text-sm text-muted-foreground mt-1">{feat.description}</p>
                )}
              </div>
              {canUpdate && (
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
        {canUpdate && (
          <button
            type="button"
            onClick={onAddFeat}
            className="w-full py-2 border border-dashed border-input rounded-lg text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-1"
          >
            <Plus className="w-4 h-4" /> Add Feat
          </button>
        )}
      </div>
      {isPf1e && (
        <div className="mt-5 pt-4 border-t space-y-2">
          <h4 className="font-semibold">Traits</h4>
          {traits.length === 0 ? (
            <p className="text-sm text-muted-foreground italic">No traits selected.</p>
          ) : (
            traits.map((trait) => (
              <div
                key={trait.id}
                className="flex items-start justify-between p-2 bg-muted/20 rounded border"
              >
                <div>
                  <span className="font-medium">{trait.name}</span>
                  <Badge variant="outline" className="ml-2 text-[10px] px-1.5 py-0 capitalize">
                    {trait.type}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-1">{trait.description}</p>
                </div>
                {canUpdate && (
                  <button
                    type="button"
                    onClick={() => onRemoveTrait(trait.id)}
                    className="text-muted-foreground hover:text-destructive transition-colors ml-2"
                    title="Remove trait"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))
          )}
          {canUpdate && (
            <div className="flex gap-2">
              <select
                value={selectedTraitId}
                onChange={(event) => onSelectedTraitIdChange(event.target.value)}
                className="flex-1 px-2 py-1 border border-input rounded bg-transparent focus:outline-none focus:border-primary text-sm"
                title="Add trait"
                onFocus={() => {
                  void onLoadTraitOptions();
                }}
              >
                <option value="">{traitsLoaded ? 'Select trait...' : 'Loading traits...'}</option>
                {traitOptions
                  .filter((trait) => !traits.some((current) => current.id === trait.id))
                  .map((trait) => (
                    <option key={trait.id} value={trait.id}>
                      {trait.name}
                    </option>
                  ))}
              </select>
              <button
                type="button"
                onClick={onAddTrait}
                className="px-3 py-1.5 rounded border text-sm hover:border-primary hover:text-primary disabled:opacity-50"
                disabled={!selectedTraitId || !traitsLoaded}
              >
                Add Trait
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  </div>
);
