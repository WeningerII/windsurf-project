import React from 'react';
import { Badge } from '../../../components/ui/Badge';
import type { Advantage } from '../../../types/mam/advantages';

interface Props {
  advantagesLoaded: boolean;
  advantages: Advantage[];
}

export const MamAdvantageBrowserTab: React.FC<Props> = ({ advantagesLoaded, advantages }) =>
  !advantagesLoaded ? (
    <div className="text-center py-8 text-muted-foreground">Click to load advantages...</div>
  ) : (
    <section className="bg-card p-4 rounded-lg border space-y-2">
      <h3 className="text-lg font-semibold">SRD Advantages ({advantages.length})</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {advantages.map((advantage) => (
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
            </div>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {advantage.benefit || advantage.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
