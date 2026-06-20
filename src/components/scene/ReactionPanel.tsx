import { useState } from 'react';
import { Users } from 'lucide-react';
import {
  rollReaction,
  type SceneReactionDisposition,
  type SceneReactionResult,
} from '../../scene/reaction';
import { createSeededRng } from '../../scene/seededRng';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

interface ReactionPanelProps {
  /** Scene seed, mixed with a per-roll nonce so each reaction varies but stays seeded. */
  seed: string;
}

const MAX_HISTORY = 10;

// App-wide monotonic nonce so each reaction roll is distinct across remounts
// (a per-component ref would reset on scene switch). Deterministic, not random.
let globalReactionNonce = 0;

const DISPOSITION_LABEL: Record<SceneReactionDisposition, string> = {
  hostile: 'Hostile',
  unfriendly: 'Unfriendly',
  indifferent: 'Indifferent',
  friendly: 'Friendly',
  helpful: 'Helpful',
};

const DISPOSITION_BADGE: Record<SceneReactionDisposition, string> = {
  hostile: 'bg-destructive/15 text-destructive font-semibold',
  unfriendly: 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
  indifferent: 'bg-muted text-muted-foreground',
  friendly: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  helpful: 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-semibold',
};

interface ReactionHistoryEntry extends SceneReactionResult {
  context?: string;
}

/**
 * NPC reaction roller: a 2d6 reaction-table disposition (Hostile…Helpful) with a
 * modifier — a transparent GM-emulation tool for first impressions, not an AI.
 * Ephemeral like the dice roller: rolls are real (seeded) but live in an
 * in-memory history rather than the replayable event log.
 */
export function ReactionPanel({ seed }: ReactionPanelProps) {
  const [context, setContext] = useState('');
  const [modifier, setModifier] = useState('');
  const [history, setHistory] = useState<ReactionHistoryEntry[]>([]);

  const parsedModifier = modifier.trim() === '' ? 0 : Number(modifier);
  const canRoll = Number.isFinite(parsedModifier);

  const handleRoll = () => {
    if (!canRoll) return;
    globalReactionNonce += 1;
    const result = rollReaction(
      createSeededRng(`${seed}:reaction:${globalReactionNonce}`),
      parsedModifier
    );
    const trimmed = context.trim();
    setHistory((prev) =>
      [{ ...result, ...(trimmed ? { context: trimmed } : {}) }, ...prev].slice(0, MAX_HISTORY)
    );
    setContext('');
  };

  return (
    <div className="rounded-lg border bg-card p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <h5 className="flex items-center gap-1.5 text-sm font-semibold">
          <Users className="h-4 w-4" /> NPC Reaction
        </h5>
      </div>

      <div className="space-y-2 text-sm">
        <div className="grid grid-cols-[minmax(0,1fr)_4.5rem_auto] items-center gap-2">
          <input
            value={context}
            onChange={(e) => setContext(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleRoll();
            }}
            placeholder="Who? (optional)"
            aria-label="Reaction context"
            className="h-9 min-w-0 rounded-md border border-input bg-transparent px-2.5 text-sm focus:outline-none focus:border-primary"
          />
          <input
            type="number"
            value={modifier}
            onChange={(e) => setModifier(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleRoll();
            }}
            placeholder="+mod"
            aria-label="Reaction modifier"
            className="h-9 min-w-0 rounded-md border border-input bg-transparent px-2 text-sm focus:outline-none focus:border-primary"
          />
          <Button size="sm" disabled={!canRoll} onClick={handleRoll}>
            <Users className="mr-1.5 h-4 w-4" />
            React
          </Button>
        </div>

        {history.length > 0 && (
          <ol className="mt-1 max-h-40 space-y-1 overflow-y-auto rounded-md border bg-muted/40 p-2 text-xs">
            {history.map((entry, index) => (
              <li
                key={`${index}-${entry.total}`}
                className="flex items-center justify-between gap-2"
              >
                <span className="min-w-0 truncate text-muted-foreground">
                  {entry.context ? (
                    <span className="font-medium text-foreground">{entry.context}</span>
                  ) : (
                    <span className="italic">Reaction</span>
                  )}
                  {` — 2d6 [${entry.rolls[0]}, ${entry.rolls[1]}]`}
                  {entry.modifier >= 0 ? ` + ${entry.modifier}` : ` − ${Math.abs(entry.modifier)}`}
                  {` = ${entry.total}`}
                </span>
                <Badge
                  variant="secondary"
                  className={`shrink-0 text-[10px] px-1.5 py-0 ${DISPOSITION_BADGE[entry.disposition]}`}
                >
                  {DISPOSITION_LABEL[entry.disposition]}
                </Badge>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
