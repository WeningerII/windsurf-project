import React from 'react';
import { Badge } from '../../../components/ui/Badge';
import type { Advantage } from '../../../types/mam/advantages';
import { MamResourceLoadError } from './MamResourceLoadError';

interface Props {
  advantagesLoaded: boolean;
  advantagesError?: boolean;
  onRetryAdvantages?: () => void;
  advantages: Advantage[];
  /** Names already on the character, to mark catalog rows as added. */
  characterAdvantageNames?: ReadonlySet<string>;
  onAddAdvantage?: (advantage: Advantage) => void;
}

export const MamAdvantageBrowserTab: React.FC<Props> = ({
  advantagesLoaded,
  advantagesError,
  onRetryAdvantages,
  advantages,
  characterAdvantageNames,
  onAddAdvantage,
}) =>
  advantagesError && !advantagesLoaded ? (
    <MamResourceLoadError resourceLabel="the M&M advantage catalog" onRetry={onRetryAdvantages} />
  ) : !advantagesLoaded ? (
    <div className="text-center py-8 text-muted-foreground">Click to load advantages...</div>
  ) : (
    <section className="bg-card p-4 rounded-lg border space-y-2">
      <h3 className="text-lg font-semibold">SRD Advantages ({advantages.length})</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {advantages.map((advantage) => {
          const alreadyAdded = characterAdvantageNames?.has(advantage.name) ?? false;
          return (
            <div
              key={advantage.id}
              className="p-2 border rounded hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{advantage.name}</span>
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 capitalize">
                  {advantage.type}
                </Badge>
                {advantage.ranked && (
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                    Ranked
                  </Badge>
                )}
                {onAddAdvantage && (
                  <button
                    type="button"
                    onClick={() => onAddAdvantage(advantage)}
                    disabled={alreadyAdded}
                    className="ml-auto text-xs px-2 py-0.5 rounded border text-muted-foreground hover:border-primary hover:text-primary transition-colors disabled:opacity-50 disabled:hover:border-input disabled:hover:text-muted-foreground"
                    title={
                      alreadyAdded
                        ? 'Already on the character (ranked advantages: edit the rank on the Skills tab)'
                        : `Add ${advantage.name} to the character`
                    }
                  >
                    {alreadyAdded ? 'Added' : 'Add'}
                  </button>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {advantage.benefit || advantage.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
