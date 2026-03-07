import React from 'react';
import { Sparkles } from 'lucide-react';
import { Badge } from './ui/Badge';
import type { Feature } from '../types/core/character';

interface Props {
  features: Feature[];
  onUseFeature?: (featureId: string) => void;
  onRecoverFeature?: (featureId: string) => void;
}

export const FeaturesSection: React.FC<Props> = ({ features, onUseFeature, onRecoverFeature }) => {
  if (features.length === 0) return null;

  return (
    <section className="bg-card p-4 rounded-lg border space-y-3">
      <h3 className="text-sm font-semibold flex items-center gap-2">
        <Sparkles className="w-4 h-4" /> Class Features
        <span className="text-xs text-muted-foreground">({features.length})</span>
      </h3>
      <div className="space-y-2">
        {features.map((feat) => (
          <div
            key={feat.id}
            className="p-2 bg-muted/30 rounded border transition-colors hover:bg-muted/50"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-medium text-sm truncate">{feat.name}</span>
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 shrink-0">
                  {feat.source}
                </Badge>
              </div>
              {feat.uses &&
                (() => {
                  const uses = feat.uses;
                  return (
                    <div className="flex items-center gap-1 shrink-0">
                      <div className="flex gap-0.5">
                        {Array.from({ length: uses.max }, (_, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              if (i < uses.current && onUseFeature) onUseFeature(feat.id);
                              else if (i >= uses.current && onRecoverFeature)
                                onRecoverFeature(feat.id);
                            }}
                            disabled={!onUseFeature && !onRecoverFeature}
                            className={`w-4 h-4 rounded-sm border transition-colors ${
                              i < uses.current
                                ? 'bg-primary border-primary/80 hover:bg-primary/80'
                                : 'border-input hover:border-primary/50'
                            }`}
                            title={i < uses.current ? 'Use' : 'Recover'}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] text-muted-foreground tabular-nums ml-1">
                        {uses.current}/{uses.max}
                        <span className="ml-0.5 opacity-60">
                          (
                          {uses.recoveryType === 'short-rest'
                            ? 'SR'
                            : uses.recoveryType === 'long-rest'
                              ? 'LR'
                              : uses.recoveryType}
                          )
                        </span>
                      </span>
                    </div>
                  );
                })()}
            </div>
            {feat.description && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{feat.description}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
