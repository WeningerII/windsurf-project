import React from 'react';

interface DeathSaves {
  successes: number;
  failures: number;
}

interface Props {
  currentHP: number;
  deathSaves: DeathSaves;
  onChange?: (next: DeathSaves) => void;
}

function clampTrack(track: DeathSaves): DeathSaves {
  return {
    successes: Math.max(0, Math.min(3, track.successes)),
    failures: Math.max(0, Math.min(3, track.failures)),
  };
}

export const DeathSavesTracker: React.FC<Props> = ({ currentHP, deathSaves, onChange }) => {
  const safeTrack = clampTrack(deathSaves);
  const canEdit = Boolean(onChange);
  const isDown = currentHP <= 0;

  const setTrack = (next: DeathSaves) => {
    onChange?.(clampTrack(next));
  };

  return (
    <section className="bg-card p-4 rounded-lg border">
      <h3 className="text-lg font-semibold mb-2">Death Saves</h3>

      {!isDown && (
        <p className="text-sm text-muted-foreground mb-3">
          Death saves are only needed while at 0 HP.
        </p>
      )}

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Successes</span>
          <div className="flex items-center gap-1.5">
            {[0, 1, 2].map((idx) => (
              <span
                key={`success-${idx}`}
                className={`w-3 h-3 rounded-full border ${idx < safeTrack.successes ? 'bg-emerald-500 border-emerald-600' : 'bg-transparent border-muted-foreground/40'}`}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Failures</span>
          <div className="flex items-center gap-1.5">
            {[0, 1, 2].map((idx) => (
              <span
                key={`failure-${idx}`}
                className={`w-3 h-3 rounded-full border ${idx < safeTrack.failures ? 'bg-rose-500 border-rose-600' : 'bg-transparent border-muted-foreground/40'}`}
              />
            ))}
          </div>
        </div>

        {canEdit && (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              type="button"
              className="px-2.5 py-1 rounded border text-xs hover:border-emerald-600 hover:text-emerald-600 disabled:opacity-50"
              onClick={() => setTrack({ ...safeTrack, successes: safeTrack.successes + 1 })}
              disabled={!isDown}
              title="Mark death save success"
            >
              + Success
            </button>
            <button
              type="button"
              className="px-2.5 py-1 rounded border text-xs hover:border-rose-600 hover:text-rose-600 disabled:opacity-50"
              onClick={() => setTrack({ ...safeTrack, failures: safeTrack.failures + 1 })}
              disabled={!isDown}
              title="Mark death save failure"
            >
              + Failure
            </button>
            <button
              type="button"
              className="px-2.5 py-1 rounded border text-xs hover:border-primary hover:text-primary"
              onClick={() => setTrack({ successes: 0, failures: 0 })}
              title="Reset death saves"
            >
              Reset
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
