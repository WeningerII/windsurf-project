import { Flame, Swords, Zap } from 'lucide-react';
import type { SceneState } from '../../types/core/scene';
import type { AreaOfEffect } from '../../types/core/common';
import type { RollMode, SceneAreaAction } from '../../rules';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { Badge } from '../ui/Badge';

/** 5e (2014/2024) is the family that resolves attacks with advantage/disadvantage. */
function supportsAdvantage(systemId: string): boolean {
  return systemId === 'dnd-5e-2014' || systemId === 'dnd-5e-2024';
}

/** Human label for a canonical area template, in feet (the table-facing unit). */
function describeArea(area: AreaOfEffect | undefined): string {
  if (!area) return 'targeted';
  switch (area.type) {
    case 'cone':
      return `${area.feet}-ft cone`;
    case 'cube':
      return `${area.feet}-ft cube`;
    case 'cylinder':
      return `${area.radius}-ft radius cylinder`;
    case 'line':
      return `${area.length}-ft line`;
    case 'sphere':
      return `${area.radius}-ft radius`;
    case 'emanation':
      return `${area.radius}-ft emanation`;
    case 'spread':
      return `${area.radius}-ft spread`;
    default:
      return 'area';
  }
}

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
  /** 5e advantage/disadvantage for the manual attack (shown only for 5e). */
  rollMode: RollMode;
  onRollModeChange: (mode: RollMode) => void;
  /** Save-based area actions (breath weapons / spells) the attacker can use. */
  saveActions: SceneAreaAction[];
  /** Currently chosen area action name (aimed at `targetId`). */
  selectedSaveActionName: string;
  onSaveActionChange: (name: string) => void;
  onAreaEffect: () => void;
  /** How many tokens the chosen area action would catch, aimed at the target. */
  areaPreviewCount: number;
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
  rollMode,
  onRollModeChange,
  saveActions,
  selectedSaveActionName,
  onSaveActionChange,
  onAreaEffect,
  areaPreviewCount,
  log,
}: CombatPanelProps) {
  const attacker = attackerId ? state.tokens[attackerId] : undefined;
  const attackerReady = Boolean(attackerId && combatReadyIds.has(attackerId));

  const targets = Object.values(state.tokens).filter(
    (token) => token.id !== attackerId && (token.hp ? token.hp.current > 0 : true)
  );
  const canAttack = attackerReady && Boolean(targetId) && combatReadyIds.has(targetId);
  const hasCombatants = combatReadyIds.size >= 2;
  const aimName = targetId ? state.tokens[targetId]?.name : undefined;
  const canUnleash = attackerReady && Boolean(selectedSaveActionName) && Boolean(targetId);

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

        {supportsAdvantage(state.systemId) && (
          <Select
            aria-label="Attack roll mode"
            value={rollMode}
            onChange={(event) => onRollModeChange(event.target.value as RollMode)}
            disabled={!attackerReady}
          >
            <option value="normal">Normal roll</option>
            <option value="advantage">Advantage</option>
            <option value="disadvantage">Disadvantage</option>
          </Select>
        )}

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

        {saveActions.length > 0 && (
          <div className="space-y-2 border-t pt-2">
            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Flame className="h-3.5 w-3.5" /> Area Effect (breath / spell)
            </div>
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
              <Select
                aria-label="Area action"
                value={selectedSaveActionName}
                onChange={(event) => onSaveActionChange(event.target.value)}
                disabled={!attackerReady}
              >
                <option value="">Choose area action…</option>
                {saveActions.map((action) => (
                  <option key={action.name} value={action.name}>
                    {action.name} · DC {action.saveDC} {action.saveAbility.toUpperCase()} ·{' '}
                    {describeArea(action.area)}
                  </option>
                ))}
              </Select>
              <Button size="sm" variant="outline" disabled={!canUnleash} onClick={onAreaEffect}>
                <Flame className="mr-1.5 h-4 w-4" />
                Unleash
              </Button>
            </div>
            {selectedSaveActionName && (
              <div className="text-xs text-muted-foreground">
                {targetId ? (
                  <>
                    Aimed at <span className="font-medium text-foreground">{aimName}</span> —{' '}
                    {areaPreviewCount} creature{areaPreviewCount === 1 ? '' : 's'} in area.
                  </>
                ) : (
                  'Choose a target to aim the area at.'
                )}
              </div>
            )}
          </div>
        )}

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
