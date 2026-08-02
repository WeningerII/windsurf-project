/**
 * Combat controller for SceneManager: resolves a token's stats at action time,
 * derives which tokens can fight and whether the fight is over, and owns the
 * target selection plus the rolling log behind the CombatPanel's prop surface.
 * Extracted verbatim from SceneManager; the host destructures the return into
 * the same names it used inline, so behavior is unchanged.
 *
 * The engine is pure and stays pure: an attack's damage reaches the scene only
 * as an intent handed to `emitSceneAction` / `applySceneIntents`, so every
 * mutation is still an appended event and replay is untouched. The log is
 * presentation only — it is rebuilt per session and never persisted.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  buildSceneCombatants,
  isRoundConclusive,
  NEUTRAL_FACTION,
  resolveSceneAttack,
  runSceneRound,
  type ResolveCombatStats,
} from '../../rules';
import { resolveSceneCombatStats } from '../../scene/combatStats';
import { applySceneIntents } from '../../scene/runtime';
import { generateUUID } from '../../utils/browserCompat';
import { guardSync, ErrorCategory } from '../../utils/errorLogger';
import { ENGINE_FAILURE_ISSUE, type EmitSceneAction } from './useSceneActions';
import type { CharacterDocument, SystemDataModel } from '../../types/core/document';
import type { Monster } from '../../types/creatures/monsters';
import type { DaggerheartAdversary, DaggerheartWeapon } from '../../types/daggerheart';
import type { SceneDocument, SceneEvent, SceneState } from '../../types/core/scene';

export interface UseSceneCombatParams {
  selectedScene: SceneDocument | undefined;
  /** Drives the per-scene clear (another scene's target/log must not linger). */
  selectedSceneId: string | null;
  state: SceneState | undefined;
  sceneSystemId: string | undefined;
  documents: CharacterDocument<SystemDataModel>[];
  /** The loaded creature catalog, indexed — a token's `refId` resolves through it. */
  monstersById: ReadonlyMap<string, Monster>;
  daggerheartWeaponsById: ReadonlyMap<string, DaggerheartWeapon>;
  daggerheartAdversariesById: ReadonlyMap<string, DaggerheartAdversary>;
  /** The host's selected token, which is also the attacker. */
  selectedTokenId: string | undefined;
  emitSceneAction: EmitSceneAction;
  onAppendSceneEvent: (sceneId: string, event: SceneEvent) => void;
  /** Surface validation/rejection messages on the host (its actionIssues banner). */
  onIssues: (issues: string[]) => void;
}

export function useSceneCombat({
  selectedScene,
  selectedSceneId,
  state,
  sceneSystemId,
  documents,
  monstersById,
  daggerheartWeaponsById,
  daggerheartAdversariesById,
  selectedTokenId,
  emitSceneAction,
  onAppendSceneEvent,
  onIssues,
}: UseSceneCombatParams) {
  const [combatTargetId, setCombatTargetId] = useState('');
  const [combatLog, setCombatLog] = useState<string[]>([]);
  // Per-click nonce so a missed attack (which appends no event) still advances
  // the RNG stream — otherwise re-clicking Attack would reproduce the same miss.
  const attackNonce = useRef(0);

  // Transient selections are per-scene: switching scenes clears the combat
  // target and the rolling log (otherwise another scene's log lingers).
  useEffect(() => {
    setCombatTargetId('');
    setCombatLog([]);
  }, [selectedSceneId]);

  // Clear a stale combat target: when the chosen token dies or is removed, the
  // target select would otherwise render blank while Attack stays armed.
  useEffect(() => {
    if (!combatTargetId || !state) return;
    const target = state.tokens[combatTargetId];
    if (!target || (target.hp && target.hp.current <= 0)) {
      setCombatTargetId('');
    }
  }, [combatTargetId, state]);

  // Combat stats are resolved at action time from a token's refId (monster
  // statblock or character document), never stored on the token. Tokens whose
  // stats can't be resolved (no refId, unsupported system) simply can't fight.
  const documentsById = useMemo(() => {
    const map = new Map<string, CharacterDocument<SystemDataModel>>();
    documents.forEach((doc) => map.set(doc.id, doc));
    return map;
  }, [documents]);

  const resolveCombatStats = useCallback<ResolveCombatStats>(
    (token) =>
      resolveSceneCombatStats(token, {
        monstersById,
        documentsById,
        daggerheartWeaponsById,
        daggerheartAdversariesById,
      }),
    [monstersById, documentsById, daggerheartWeaponsById, daggerheartAdversariesById]
  );

  const combatReadyIds = useMemo(() => {
    const ids = new Set<string>();
    if (!state) return ids;
    Object.values(state.tokens).forEach((token) => {
      if (resolveCombatStats(token)) ids.add(token.id);
    });
    return ids;
  }, [state, resolveCombatStats]);

  // A fight is "over" once it had opposing sides and one of them is wiped.
  // Requiring two factions to have been present distinguishes a finished battle
  // (disable Run Round, surface "Combat over") from a single-faction scene where
  // Run Round still legitimately walks the initiative/round cycle.
  const combatConcluded = useMemo(() => {
    if (!state) return false;
    const combatants = buildSceneCombatants(state, resolveCombatStats);
    if (combatants.length < 2) return false;
    // Count only real combat sides — a neutral NPC/object never constitutes a
    // "side", so its presence alone must not read as a finished two-faction
    // battle (nor keep one alive).
    const sidesPresent = new Set(
      combatants
        .map((combatant) => combatant.faction)
        .filter((faction) => faction !== NEUTRAL_FACTION)
    );
    return sidesPresent.size >= 2 && isRoundConclusive(combatants, {});
  }, [state, resolveCombatStats]);

  const handleCombatAttack = () => {
    if (!selectedScene || !state || !selectedTokenId || !combatTargetId) return;
    // The combat engine is pure but field inputs are not: a malformed token or
    // effect must surface as a logged, monitored signal — never an unhandled
    // error in this click handler that silently loses the action.
    const outcome = guardSync(
      () =>
        resolveSceneAttack({
          state,
          attackerId: selectedTokenId,
          targetId: combatTargetId,
          resolveStats: resolveCombatStats,
          // The nonce makes every click a fresh stream even when nothing was
          // appended (a miss adds no event, so events.length alone would replay
          // the byte-identical roll forever).
          seed: `${selectedScene.initialState.seed}:attack:${selectedScene.events.length}:${attackNonce.current++}`,
          cause: 'attack',
        }),
      {
        fallback: undefined,
        category: ErrorCategory.USER_ACTION,
        message: 'Combat attack failed',
        context: {
          systemId: sceneSystemId,
          attackerId: selectedTokenId,
          targetId: combatTargetId,
        },
      }
    );
    if (!outcome) {
      onIssues([ENGINE_FAILURE_ISSUE]);
      return;
    }
    if (outcome.intent) {
      // Only log the hit if its damage event actually applied; emitSceneAction
      // surfaces the issue when the runtime rejects it, so don't also claim it landed.
      const applied = emitSceneAction(selectedScene, outcome.intent);
      if (!applied) {
        return;
      }
    }
    setCombatLog((current) => [outcome.log, ...current].slice(0, 30));
  };

  const handleRunRound = () => {
    if (!selectedScene || !state) return;
    const roundState = state;
    const outcome = guardSync(
      () =>
        runSceneRound({
          state: roundState,
          resolveStats: resolveCombatStats,
          seed: `${selectedScene.initialState.seed}:round:${roundState.round}:${selectedScene.events.length}:${attackNonce.current++}`,
          round: roundState.round,
        }),
      {
        fallback: undefined,
        category: ErrorCategory.USER_ACTION,
        message: 'Combat round failed',
        context: { systemId: sceneSystemId, round: roundState.round },
      }
    );
    if (!outcome) {
      onIssues([ENGINE_FAILURE_ISSUE]);
      return;
    }

    // Re-validate and sequence the round's intents against a working copy, then
    // dispatch the accepted events through the event-sourced persistence path.
    // Rejected (simulated-but-illegal) intents are surfaced, not dropped.
    const { events, rejected } = applySceneIntents(selectedScene, outcome.intents, {
      eventIdFactory: generateUUID,
    });
    events.forEach((event) => onAppendSceneEvent(selectedScene.id, event));
    setCombatLog((current) => [...outcome.log.slice().reverse(), ...current].slice(0, 30));
    onIssues(rejected);
  };

  return {
    combatReadyIds,
    combatConcluded,
    combatTargetId,
    setCombatTargetId,
    combatLog,
    handleCombatAttack,
    handleRunRound,
  };
}
