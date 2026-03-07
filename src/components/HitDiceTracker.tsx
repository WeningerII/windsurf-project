import React from 'react';
import { Dices } from 'lucide-react';
import type { HitDice } from '../types/core/character';

interface Props {
  hitDice: HitDice[];
  onSpend?: (index: number) => void;
  onRecover?: (index: number) => void;
  onLongRest?: () => void;
}

export const HitDiceTracker: React.FC<Props> = ({ hitDice, onSpend, onRecover, onLongRest }) => {
  if (hitDice.length === 0) return null;

  return (
    <section className="bg-card p-4 rounded-lg border space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Dices className="w-4 h-4" /> Hit Dice
        </h3>
        {onLongRest && (
          <button
            onClick={onLongRest}
            className="text-xs px-2 py-1 rounded border border-input hover:bg-muted transition-colors"
            title="Long rest: recover half your total hit dice (minimum 1)"
          >
            Long Rest
          </button>
        )}
      </div>
      <div className="flex items-center gap-4 flex-wrap">
        {hitDice.map((hd, idx) => (
          <div key={idx} className="text-center space-y-1">
            <div className="text-xs font-medium text-muted-foreground">{hd.die}</div>
            <div className="flex justify-center gap-0.5 flex-wrap">
              {Array.from({ length: hd.total }, (_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    if (i < hd.remaining && onSpend) onSpend(idx);
                    else if (i >= hd.remaining && onRecover) onRecover(idx);
                  }}
                  disabled={!onSpend && !onRecover}
                  className={`w-5 h-5 rounded border-2 transition-colors ${
                    i < hd.remaining
                      ? 'bg-emerald-500 border-emerald-600 hover:bg-emerald-400'
                      : 'border-input hover:border-emerald-400'
                  }`}
                  title={i < hd.remaining ? `Spend ${hd.die}` : `Recover ${hd.die}`}
                />
              ))}
            </div>
            <div className="text-xs tabular-nums text-muted-foreground">
              {hd.remaining}/{hd.total}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
