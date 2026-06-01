import { Swords, Zap } from 'lucide-react';
import type { SceneState } from '../../types/core/scene';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { Badge } from '../ui/Badge';

interface CombatPanelProps {
  state: SceneState;
  /** The currently selected token, used as the attacker. */
  attackerId?: string;
  /** Token ids that have resolvable combat stats (can attack / be precise targets). */
  combatReadyIds: Set<string>;
  /** Currently chosen target id. */
  targetId: string;
  onTargetChange: (targetId: string) => void;
  onAttack: () => void;
  onRunRound: () => void;
  log: string[];
}

/**
 * Combat controls: pick the selected token as attacker, choose a target, and
 * resolve a single attack — or auto-run a whole round through the deterministic
 * tactical executor. A rolling log shows what happened. All resolution goes
 * through the event-sourced scene path; this panel only triggers it.
 */
export function CombatPanel({
  state,
  attackerId,
  combatReadyIds,
  targetId,
  onTargetChange,
  onAttack,
  onRunRound,
  log,
}: CombatPanelProps) {
  const attacker = attackerId ? state.tokens[attackerId] : undefined;
  const attackerReady = Boolean(attackerId && combatReadyIds.has(attackerId));

  const targets = Object.values(state.tokens).filter(
    (token) => token.id !== attackerId && (token.hp ? token.hp.current > 0 : true)
  );
  const canAttack = attackerReady && Boolean(targetId) && combatReadyIds.has(targetId);
  const hasCombatants = combatReadyIds.size >= 2;

  return (
    <div className="rounded-lg border bg-card p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <h5 className="flex items-center gap-1.5 text-sm font-semibold">
          <Swords className="h-4 w-4" /> Combat
        </h5>
        <Button variant="outline" size="sm" disabled={!hasCombatants} onClick={onRunRound}>
          <Zap className="mr-1.5 h-4 w-4" />
          Run Round
        </Button>
      </div>

      <div className="space-y-2 text-sm">
        <div className="text-muted-foreground">
          {attacker ? (
            <>
              Attacker: <span className="font-medium text-foreground">{attacker.name}</span>
              {attacker.hp ? ` (${Math.max(0, attacker.hp.current)}/${attacker.hp.max} HP)` : ''}
              {!attackerReady && (
                <Badge variant="destructive" className="ml-2">
                  no combat stats
                </Badge>
              )}
            </>
          ) : (
            'Select a token on the grid to attack with.'
          )}
        </div>

        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
          <Select
            aria-label="Attack target"
            value={targetId}
            onChange={(event) => onTargetChange(event.target.value)}
            disabled={!attackerReady || targets.length === 0}
          >
            <option value="">Choose target…</option>
            {targets.map((token) => (
              <option key={token.id} value={token.id} disabled={!combatReadyIds.has(token.id)}>
                {token.name}
                {token.hp ? ` (${Math.max(0, token.hp.current)}/${token.hp.max})` : ''}
                {combatReadyIds.has(token.id) ? '' : ' — no stats'}
              </option>
            ))}
          </Select>
          <Button size="sm" disabled={!canAttack} onClick={onAttack}>
            <Swords className="mr-1.5 h-4 w-4" />
            Attack
          </Button>
        </div>

        {log.length > 0 && (
          <ol className="mt-2 max-h-40 space-y-1 overflow-y-auto rounded-md border bg-muted/40 p-2 text-xs">
            {log.map((line, index) => (
              <li key={`${index}-${line}`} className="text-muted-foreground">
                {line}
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
