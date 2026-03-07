import React from 'react';

interface Props {
  exhaustionLevel?: number;
  onExhaustionChange?: (level: number) => void;
  onShortRest?: () => void;
  onLongRest?: () => void;
  showExhaustion?: boolean;
}

export const RestControls: React.FC<Props> = ({
  exhaustionLevel,
  onExhaustionChange,
  onShortRest,
  onLongRest,
  showExhaustion = true,
}) => {
  const normalizedExhaustion = Math.max(0, exhaustionLevel ?? 0);
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
          title="Short Rest"
        >
          Short Rest
        </button>
        <button
          type="button"
          className="px-3 py-1.5 rounded border text-sm hover:border-primary hover:text-primary disabled:opacity-50"
          onClick={onLongRest}
          disabled={!onLongRest}
          title="Long Rest"
        >
          Long Rest
        </button>
      </div>
      {showExhaustion && (
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Exhaustion</span>
          <input
            type="number"
            min={0}
            value={normalizedExhaustion}
            onChange={(event) => onExhaustionChange?.(Math.max(0, Number(event.target.value) || 0))}
            className="w-16 text-center border border-input rounded bg-transparent px-2 py-1 text-sm tabular-nums"
            disabled={!canEditExhaustion}
            title="Exhaustion Level"
          />
        </div>
      )}
    </section>
  );
};
