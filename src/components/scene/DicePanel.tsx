import { useState } from 'react';
import { Dice6 } from 'lucide-react';
import { rollDiceExpression, type DiceRollResult } from '../../scene/dice';
import { createSeededRng } from '../../scene/seededRng';
import { Button } from '../ui/Button';

interface DicePanelProps {
  /** Scene seed, mixed with a per-roll nonce so each roll varies but stays seeded. */
  seed: string;
  /** Scene system id; picks the quick-roll chips (default: the d20-family set). */
  systemId?: string;
}

// Quick-roll chips by system. The d20 family (default) keeps d20 + the D&D
// ability-score method; Daggerheart leads with its 2d12 duality dice. Kept as a
// local map — the layer boundary forbids shared components value-importing from
// src/systems/**. The input stays free-text for anything else.
const QUICK_ROLLS_BY_SYSTEM: Record<string, readonly string[]> = {
  daggerheart: ['2d12', 'd6', 'd20', 'd100'],
};
const DEFAULT_QUICK_ROLLS = ['d20', 'd100', '2d6', '4d6kh3'] as const;
const MAX_HISTORY = 10;

// App-wide monotonic roll counter: mixed into each seed so every roll is
// distinct even across panel remounts (a per-component ref would reset to 0 on
// scene switch and reproduce the previous scene's first rolls). Deterministic
// (no Math.random), just never repeating.
let globalRollNonce = 0;

/**
 * A scratch dice roller for arbitrary expressions (damage, loot, custom tables)
 * — distinct from checks/oracle, which record adjudicated outcomes. Rolls are
 * real (seeded RNG) but transient: they live in an in-memory history rather than
 * the replayable scene event log.
 */
export function DicePanel({ seed, systemId }: DicePanelProps) {
  const [expression, setExpression] = useState('');
  const [history, setHistory] = useState<DiceRollResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const quickRolls = QUICK_ROLLS_BY_SYSTEM[systemId ?? ''] ?? DEFAULT_QUICK_ROLLS;

  const roll = (expr: string) => {
    const trimmed = expr.trim();
    if (!trimmed) return;
    try {
      globalRollNonce += 1;
      const result = rollDiceExpression(
        trimmed,
        createSeededRng(`${seed}:dice:${globalRollNonce}`)
      );
      setHistory((prev) => [result, ...prev].slice(0, MAX_HISTORY));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not roll that expression.');
    }
  };

  return (
    <div className="rounded-lg border bg-card p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <h5 className="flex items-center gap-1.5 text-sm font-semibold">
          <Dice6 className="h-4 w-4" /> Dice
        </h5>
      </div>

      <div className="space-y-2 text-sm">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
          <input
            value={expression}
            onChange={(e) => setExpression(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') roll(expression);
            }}
            placeholder="e.g. 2d6+3, 4d6kh3"
            aria-label="Dice expression"
            className="h-9 min-w-0 rounded-md border border-input bg-transparent px-2.5 text-sm focus:outline-none focus:border-primary"
          />
          <Button size="sm" disabled={!expression.trim()} onClick={() => roll(expression)}>
            <Dice6 className="mr-1.5 h-4 w-4" />
            Roll
          </Button>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {quickRolls.map((quick) => (
            <Button
              key={quick}
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={() => roll(quick)}
            >
              {quick}
            </Button>
          ))}
        </div>

        {error && <p className="text-xs text-destructive">{error}</p>}

        {history.length > 0 && (
          <ol className="mt-1 max-h-40 space-y-1 overflow-y-auto rounded-md border bg-muted/40 p-2 text-xs">
            {history.map((entry, index) => (
              <li key={`${index}-${entry.expression}`}>
                <div className="flex items-center justify-between gap-2">
                  <span className="min-w-0 truncate font-medium text-foreground">
                    {entry.expression}
                  </span>
                  <span className="shrink-0 font-semibold text-foreground">= {entry.total}</span>
                </div>
                <div className="truncate text-muted-foreground">{formatBreakdown(entry)}</div>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}

/** "2d6 [4, 5]; +3" or "4d6kh3 [6,5,3,(2)]" with dropped dice parenthesized. */
function formatBreakdown(result: DiceRollResult): string {
  return result.terms
    .map((term) => {
      if (!term.rolls) return term.text; // constant
      if (!term.kept || term.kept.length === term.rolls.length) {
        return `${term.text} [${term.rolls.join(', ')}]`;
      }
      // Mark dropped dice (those not in the kept multiset) in parentheses.
      const keptCounts = new Map<number, number>();
      for (const value of term.kept) keptCounts.set(value, (keptCounts.get(value) ?? 0) + 1);
      const shown = term.rolls.map((value) => {
        const remaining = keptCounts.get(value) ?? 0;
        if (remaining > 0) {
          keptCounts.set(value, remaining - 1);
          return String(value);
        }
        return `(${value})`;
      });
      return `${term.text} [${shown.join(', ')}]`;
    })
    .join(' ');
}
