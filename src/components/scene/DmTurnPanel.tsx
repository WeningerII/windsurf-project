import { useState } from 'react';
import { Bot } from 'lucide-react';
import type { DmTurnResult } from '../../ai/dmTurnFlow';
import type { SceneEvent } from '../../types/core/scene';
import { Button } from '../ui/Button';

/** What one run of the AI-DM asks for, gathered from the GM. */
export interface DmTurnRequest {
  /** Chebyshev cells this actor may cover — the GM's system arithmetic. */
  moveDistance: number;
  /** One optional check this actor could make, read off its sheet. */
  check?: { label: string; modifier: number; dc?: number };
}

interface DmTurnPanelProps {
  /** The token whose turn would be run. Absent hides the whole affordance. */
  actor?: { id: string; name: string };
  /**
   * Ask the AI-DM for this actor's turn. Injected as a closure that already
   * holds the scene, so this panel needs no scene knowledge and testing it
   * needs no gateway — the seam `MapPanel`'s `onAnalyzeGrid` established.
   * Absent when AI is off.
   */
  onRunTurn?: (request: DmTurnRequest) => Promise<DmTurnResult>;
  /**
   * Append the reviewed events. Returns an error message when the scene moved
   * on since the proposal was resolved (the events would carry stale
   * sequences), or null on success.
   */
  onApply?: (events: SceneEvent[]) => string | null;
}

/** Human-readable summary of one resolved event, for the review list. */
function describeEvent(event: SceneEvent): string {
  switch (event.type) {
    case 'token.moved':
      return `Move to (${event.payload.position.x}, ${event.payload.position.y})`;
    case 'check.rolled': {
      const { label, die, modifier, total, dc, outcome } = event.payload;
      const sign = modifier >= 0 ? `+ ${modifier}` : `− ${Math.abs(modifier)}`;
      const against = dc !== undefined ? ` vs difficulty ${dc} — ${outcome}` : '';
      return `${label}: d20 ${die} ${sign} = ${total}${against}`;
    }
    case 'turn.advanced':
      return 'End the turn';
    default:
      return event.type;
  }
}

/**
 * The AI-DM affordance (RFC 007): run ONE actor's turn as a proposal the GM
 * reads before anything reaches the scene log.
 *
 * The flow behind it never writes to the scene — it resolves intents against a
 * working copy and hands back the events, so everything shown here is still a
 * proposal. `Apply` is the only thing that appends, and it appends exactly what
 * is on screen. Refusing costs nothing: the scene is untouched either way, and
 * the deterministic autonomous round remains available as it always was.
 *
 * Every number the model is allowed to act on comes from the GM (reach) or from
 * the deterministic resolver (the die). The model contributes the CHOICE and
 * nothing else — `dmProposalToIntent` reads a check's label, modifier and DC off
 * the option, never off the proposal.
 */
export function DmTurnPanel({ actor, onRunTurn, onApply }: DmTurnPanelProps) {
  const [moveDistance, setMoveDistance] = useState('6');
  const [checkLabel, setCheckLabel] = useState('');
  const [checkModifier, setCheckModifier] = useState('');
  const [checkDc, setCheckDc] = useState('');
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<DmTurnResult | null>(null);
  const [applyError, setApplyError] = useState<string | null>(null);

  if (!actor || !onRunTurn) return null;

  const parsedDistance = Number.parseInt(moveDistance, 10);
  const distance = Number.isFinite(parsedDistance) ? parsedDistance : 0;
  const trimmedCheck = checkLabel.trim();
  const parsedModifier = checkModifier.trim() === '' ? 0 : Number(checkModifier);
  const parsedDc = checkDc.trim() === '' ? undefined : Number(checkDc);
  const checkUsable =
    trimmedCheck.length > 0 &&
    Number.isFinite(parsedModifier) &&
    (parsedDc === undefined || Number.isFinite(parsedDc));

  const handleRun = async () => {
    if (running) return;
    setRunning(true);
    setResult(null);
    setApplyError(null);
    try {
      setResult(
        await onRunTurn({
          moveDistance: distance,
          ...(checkUsable
            ? {
                check: {
                  label: trimmedCheck,
                  modifier: parsedModifier,
                  ...(parsedDc !== undefined ? { dc: parsedDc } : {}),
                },
              }
            : {}),
        })
      );
    } finally {
      setRunning(false);
    }
  };

  const handleApply = () => {
    if (!result?.ok || !onApply || result.events.length === 0) return;
    const error = onApply(result.events);
    if (error) {
      setApplyError(error);
      return;
    }
    setResult(null);
    setApplyError(null);
  };

  return (
    <div className="rounded-lg border bg-card p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <h5 className="flex items-center gap-1.5 text-sm font-semibold">
          <Bot className="h-4 w-4" /> AI-DM Turn
        </h5>
        <span className="truncate text-[11px] text-muted-foreground">{actor.name}</span>
      </div>

      <div className="space-y-2 text-sm">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
          <label className="flex items-center gap-2 text-[11px] text-muted-foreground">
            Move (squares)
            <input
              type="number"
              min={0}
              value={moveDistance}
              onChange={(event) => setMoveDistance(event.target.value)}
              aria-label="Move distance in squares"
              disabled={running}
              className="h-9 w-20 rounded-md border border-input bg-transparent px-2 text-sm text-foreground focus:border-primary focus:outline-none"
            />
          </label>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRun}
            disabled={running}
            title={`Ask the AI-DM to propose ${actor.name}'s turn`}
          >
            <Bot className="mr-1.5 h-4 w-4" />
            {running ? 'Thinking…' : 'Propose turn'}
          </Button>
        </div>

        <div className="grid grid-cols-[minmax(0,1fr)_4.5rem_4.5rem] gap-2">
          <input
            value={checkLabel}
            onChange={(event) => setCheckLabel(event.target.value)}
            placeholder="Offer a check (optional)"
            aria-label="AI-DM check label"
            disabled={running}
            className="h-9 min-w-0 rounded-md border border-input bg-transparent px-2.5 text-sm focus:border-primary focus:outline-none"
          />
          <input
            type="number"
            value={checkModifier}
            onChange={(event) => setCheckModifier(event.target.value)}
            placeholder="+mod"
            aria-label="AI-DM check modifier"
            disabled={running}
            className="h-9 min-w-0 rounded-md border border-input bg-transparent px-2 text-sm focus:border-primary focus:outline-none"
          />
          <input
            type="number"
            value={checkDc}
            onChange={(event) => setCheckDc(event.target.value)}
            placeholder="Difficulty"
            aria-label="AI-DM check difficulty"
            disabled={running}
            className="h-9 min-w-0 rounded-md border border-input bg-transparent px-2 text-sm focus:border-primary focus:outline-none"
          />
        </div>

        {result && !result.ok && (
          <p className="text-xs text-destructive" role="status">
            {result.error}
          </p>
        )}

        {result?.ok && (
          <div className="space-y-1.5 rounded-md border bg-muted/30 p-2" role="status">
            {result.rationale && (
              <p className="text-[11px] text-muted-foreground">{result.rationale}</p>
            )}

            {result.events.length > 0 ? (
              <ol className="space-y-0.5 text-xs">
                {result.events.map((event) => (
                  <li key={event.id}>{describeEvent(event)}</li>
                ))}
              </ol>
            ) : (
              <p className="text-[11px] text-muted-foreground">
                The AI-DM proposed nothing this scene would accept.
              </p>
            )}

            {result.pending.length > 0 && (
              <ul className="space-y-0.5 text-[11px] text-muted-foreground">
                {result.pending.map((entry) => (
                  <li key={entry.option.id}>Held for confirmation: {entry.option.label}</li>
                ))}
              </ul>
            )}

            {result.rejected.length > 0 && (
              <ul className="space-y-0.5 text-[11px] text-muted-foreground">
                {result.rejected.map((reason, index) => (
                  <li key={`${index}:${reason}`}>Refused: {reason}</li>
                ))}
              </ul>
            )}

            <p className="text-[11px] text-muted-foreground">
              Nothing has been applied. These are resolved proposals — Apply puts exactly these
              events in the log.
            </p>

            <div className="flex items-center gap-2">
              <Button size="sm" onClick={handleApply} disabled={result.events.length === 0}>
                Apply turn
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setResult(null);
                  setApplyError(null);
                }}
              >
                Discard
              </Button>
            </div>

            {applyError && <p className="text-xs text-destructive">{applyError}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
