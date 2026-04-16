import React from 'react';
import { HeartPulse, RotateCcw } from 'lucide-react';
import type { Mam3eConditionTrack } from '../data-model';

interface Props {
  conditionTrack: Mam3eConditionTrack;
  canUpdate: boolean;
  onConditionTrackChange: (patch: Partial<Mam3eConditionTrack>) => void;
  onReset: () => void;
  onApplyToughnessFailure: (failureMargin: number) => void;
}

export const MamConditionsTab: React.FC<Props> = ({
  conditionTrack,
  canUpdate,
  onConditionTrackChange,
  onReset,
  onApplyToughnessFailure,
}) => (
  <section className="bg-card p-4 rounded-lg border space-y-4">
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <HeartPulse className="w-5 h-5" /> Condition Track
      </h3>
      {canUpdate && (
        <button
          type="button"
          onClick={onReset}
          className="text-xs px-2 py-1 rounded border border-input hover:border-primary hover:text-primary transition-colors inline-flex items-center gap-1"
          title="Reset condition track"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </button>
      )}
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
      <div className="p-3 rounded border bg-muted/20">
        <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Bruised</div>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold tabular-nums">{conditionTrack.bruised}</span>
          {canUpdate && (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() =>
                  onConditionTrackChange({ bruised: Math.max(0, conditionTrack.bruised - 1) })
                }
                className="w-7 h-7 rounded border border-input hover:border-primary hover:text-primary transition-colors"
                title="Reduce bruised"
              >
                -
              </button>
              <button
                type="button"
                onClick={() => onConditionTrackChange({ bruised: conditionTrack.bruised + 1 })}
                className="w-7 h-7 rounded border border-input hover:border-primary hover:text-primary transition-colors"
                title="Add bruised"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>

      {(
        [
          { key: 'dazed', label: 'Dazed' },
          { key: 'staggered', label: 'Staggered' },
          { key: 'incapacitated', label: 'Incapacitated' },
        ] as const
      ).map(({ key, label }) => (
        <button
          key={key}
          type="button"
          onClick={() => canUpdate && onConditionTrackChange({ [key]: !conditionTrack[key] })}
          disabled={!canUpdate}
          className={`p-3 rounded border text-left transition-colors ${
            conditionTrack[key]
              ? key === 'incapacitated'
                ? 'border-destructive bg-destructive/10 text-destructive'
                : 'border-amber-500/50 bg-amber-500/10 text-amber-700 dark:text-amber-300'
              : 'border-input bg-muted/10 hover:border-primary'
          }`}
        >
          <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{label}</div>
          <div className="font-semibold">{conditionTrack[key] ? 'Active' : 'Inactive'}</div>
        </button>
      ))}
    </div>

    <div className="space-y-2">
      <div className="text-sm font-medium">Apply Toughness Failure</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => canUpdate && onApplyToughnessFailure(2)}
          disabled={!canUpdate}
          className="px-3 py-2 rounded border border-input hover:border-primary hover:text-primary transition-colors text-sm text-left"
        >
          Fail by 1-4: +1 Bruised
        </button>
        <button
          type="button"
          onClick={() => canUpdate && onApplyToughnessFailure(7)}
          disabled={!canUpdate}
          className="px-3 py-2 rounded border border-input hover:border-primary hover:text-primary transition-colors text-sm text-left"
        >
          Fail by 5-9: +1 Bruised, Dazed
        </button>
        <button
          type="button"
          onClick={() => canUpdate && onApplyToughnessFailure(12)}
          disabled={!canUpdate}
          className="px-3 py-2 rounded border border-input hover:border-primary hover:text-primary transition-colors text-sm text-left"
        >
          Fail by 10-14: +1 Bruised, Staggered
        </button>
        <button
          type="button"
          onClick={() => canUpdate && onApplyToughnessFailure(16)}
          disabled={!canUpdate}
          className="px-3 py-2 rounded border border-destructive/40 hover:border-destructive hover:text-destructive transition-colors text-sm text-left"
        >
          Fail by 15+: Incapacitated
        </button>
      </div>
      <p className="text-xs text-muted-foreground">
        Track follows the M&M damage progression (Bruised → Dazed/Staggered → Incapacitated).
      </p>
    </div>
  </section>
);
