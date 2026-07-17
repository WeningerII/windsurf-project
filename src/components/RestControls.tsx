import React from 'react';

interface Props {
  exhaustionLevel?: number;
  onExhaustionChange?: (level: number) => void;
  onShortRest?: () => void;
  onLongRest?: () => void;
  showExhaustion?: boolean;
  /**
   * Button labels — 'Short Rest'/'Long Rest' (the 5e terms) by default. Non-5e
   * sheets pass their own rule vocabulary: PF2e 'Rest & Refocus (10 min)' /
   * 'Daily Preparations', legacy d20 'Rest' / 'Overnight Rest'.
   */
  shortRestLabel?: string;
  longRestLabel?: string;
}

/**
 * Exhaustion level 6 is death in both 5e rule sets; the engines clamp the
 * stored value to 0..6, so the input mirrors that bound.
 */
const MAX_EXHAUSTION_LEVEL = 6;

const clampExhaustion = (level: number) =>
  Math.min(MAX_EXHAUSTION_LEVEL, Math.max(0, Math.floor(level)));

export const RestControls: React.FC<Props> = ({
  exhaustionLevel,
  onExhaustionChange,
  onShortRest,
  onLongRest,
  showExhaustion = true,
  shortRestLabel = 'Short Rest',
  longRestLabel = 'Long Rest',
}) => {
  const normalizedExhaustion = clampExhaustion(exhaustionLevel ?? 0);
  const canEditExhaustion = Boolean(onExhaustionChange);

  return (
    <section className="bg-card p-4 rounded-lg border">
      <h3 className="text-lg font-semibold mb-3">Rest</h3>
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <button
          type="button"
          className="px-3 py-1.5 rounded border text-sm hover:border-primary hover:text-primary disabled:opacity-50"
          onClick={onShortRest}
          disabled={!onShortRest}
          title={shortRestLabel}
        >
          {shortRestLabel}
        </button>
        <button
          type="button"
          className="px-3 py-1.5 rounded border text-sm hover:border-primary hover:text-primary disabled:opacity-50"
          onClick={onLongRest}
          disabled={!onLongRest}
          title={longRestLabel}
        >
          {longRestLabel}
        </button>
      </div>
      {showExhaustion && (
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Exhaustion</span>
          <input
            type="number"
            min={0}
            max={MAX_EXHAUSTION_LEVEL}
            value={normalizedExhaustion}
            onChange={(event) =>
              onExhaustionChange?.(clampExhaustion(Number(event.target.value) || 0))
            }
            className="w-16 text-center border border-input rounded bg-transparent px-2 py-1 text-sm tabular-nums"
            disabled={!canEditExhaustion}
            title="Exhaustion Level"
          />
        </div>
      )}
    </section>
  );
};
