import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Dice5 } from 'lucide-react';
import { RollResult } from '../registry/types';

interface DiceRollButtonProps {
  label: string;
  onRoll: () => Promise<RollResult>;
  className?: string;
  size?: 'sm' | 'md';
}

export const DiceRollButton: React.FC<DiceRollButtonProps> = ({
  label,
  onRoll,
  className = '',
  size = 'sm',
}) => {
  const [result, setResult] = useState<RollResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [rolling, setRolling] = useState(false);
  const dismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearDismissTimer = useCallback(() => {
    if (dismissTimerRef.current !== null) {
      clearTimeout(dismissTimerRef.current);
      dismissTimerRef.current = null;
    }
  }, []);

  // A re-roll within the 4 s window must restart the countdown — otherwise
  // the previous timer dismisses the new result early.
  const scheduleDismiss = useCallback(() => {
    clearDismissTimer();
    dismissTimerRef.current = setTimeout(() => {
      dismissTimerRef.current = null;
      setResult(null);
      setError(null);
    }, 4000);
  }, [clearDismissTimer]);

  // Drop any pending dismiss timer on unmount.
  useEffect(() => clearDismissTimer, [clearDismissTimer]);

  const handleRoll = useCallback(async () => {
    setRolling(true);
    try {
      const r = await onRoll();
      setResult(r);
      setError(null);
      scheduleDismiss();
    } catch {
      // Surface the failure inline instead of escaping as an unhandled
      // promise rejection.
      setResult(null);
      setError('Roll failed');
      scheduleDismiss();
    } finally {
      setRolling(false);
    }
  }, [onRoll, scheduleDismiss]);

  const sizeClasses = size === 'sm' ? 'w-6 h-6 text-xs' : 'w-8 h-8 text-sm';

  return (
    <div className="relative inline-flex items-center">
      <button
        onClick={handleRoll}
        disabled={rolling}
        className={`${sizeClasses} rounded border flex items-center justify-center transition-colors hover:bg-primary/10 hover:border-primary text-muted-foreground hover:text-primary ${rolling ? 'animate-spin' : ''} ${className}`}
        title={`Roll ${label}`}
      >
        <Dice5 className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
      </button>
      {error && !result && (
        <div
          role="alert"
          className="absolute left-full ml-2 z-50 px-3 py-1.5 rounded-lg shadow-lg border text-sm whitespace-nowrap animate-in fade-in-0 slide-in-from-left-2 bg-red-500/10 border-red-500/30 text-red-600"
        >
          {error}
        </div>
      )}
      {result && (
        <div
          className={`absolute left-full ml-2 z-50 px-3 py-1.5 rounded-lg shadow-lg border text-sm whitespace-nowrap animate-in fade-in-0 slide-in-from-left-2 ${
            result.isCritical
              ? 'bg-green-500/10 border-green-500/30 text-green-600'
              : result.isFumble
                ? 'bg-red-500/10 border-red-500/30 text-red-600'
                : 'bg-card border-border'
          }`}
        >
          <div>
            <span className="font-bold tabular-nums">{result.total}</span>
            <span className="text-muted-foreground ml-1.5 text-xs">({result.formula})</span>
            {result.isCritical && <span className="ml-1 text-green-600 font-bold">NAT 20!</span>}
            {result.isFumble && <span className="ml-1 text-red-600 font-bold">NAT 1!</span>}
          </div>
          {result.flavor && (
            <div className="mt-1 text-[11px] leading-snug text-muted-foreground whitespace-normal">
              {result.flavor}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
