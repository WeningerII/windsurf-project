/**
 * Scene combat bridge — connect the deterministic combat engine to a scene.
 *
 * See `docs/rfc/003-rules-ir-and-effects.md` (Accepted).
 *
 * The UI holds a folded `SceneState` (tokens with live HP) plus access to the
 * loaders/documents a token's `refId` points at. This module turns that into the
 * combat engine's inputs and back into scene `apply-damage` intents, so combat
 * runs through the same validated, event-sourced path as every manual action.
 *
 * Combat stats are RESOLVED, not stored: the caller injects a `resolveStats`
 * function (token → attack/damage effects + AC + reach) built from monster
 * statblocks and character documents. Tokens whose stats can't be resolved
 * (no refId, unsupported system) are simply omitted — honest, not faked.
 *
 * Pure and deterministic: the only randomness is the seeded RNG threaded through
 * the resolvers, so a given (scene, seed) replays identically.
 */

import type { SceneActionIntent, SceneState, SceneToken } from '../../types/core/scene';
import type { EffectInstance } from '../ir/types';
import { runCombatRound, type RoundCombatant, type RoundResult } from '../tactical/roundDriver';
import { resolveAttack } from '../resolver/attackResolution';
import { participantRng } from '../resolver/participantResolution';
import { attackToDamageIntent } from '../resolver/sceneCombat';

/** Combat stats for a token, resolved from its statblock or character sheet. */
export interface SceneCombatStats {
  attackEffects: EffectInstance[];
  damageEffects: EffectInstance[];
  armorClass: number;
  /** Reach in grid cells (melee = 1). */
  reach: number;
  critOn?: number;
}

/** Resolve a token's combat stats, or undefined when it cannot fight. */
export type ResolveCombatStats = (token: SceneToken) => SceneCombatStats | undefined;

/** Map a token kind to a combat faction (allies vs enemies for targeting). */
export function factionForToken(token: SceneToken): string {
  switch (token.kind) {
    case 'character':
      return 'party';
    case 'monster':
      return 'monsters';
    case 'npc':
      return 'npc';
    default:
      return 'object';
  }
}

/**
 * Assemble combat-ready combatants from the scene, in initiative order when an
 * initiative list exists (else token insertion order). Tokens without resolvable
 * stats or without HP are omitted.
 */
export function buildSceneCombatants(
  state: SceneState,
  resolveStats: ResolveCombatStats
): RoundCombatant[] {
  // Order: initiative first (highest value), then any remaining tokens.
  const initiativeOrder = state.initiative.map((entry) => entry.tokenId);
  const orderedIds = [
    ...initiativeOrder.filter((id) => state.tokens[id]),
    ...Object.keys(state.tokens).filter((id) => !initiativeOrder.includes(id)),
  ];

  const combatants: RoundCombatant[] = [];
  for (const tokenId of orderedIds) {
    const token = state.tokens[tokenId];
    if (!token?.hp) continue;
    const stats = resolveStats(token);
    if (!stats) continue;
    combatants.push({
      tokenId: token.id,
      faction: factionForToken(token),
      position: { ...token.position },
      armorClass: stats.armorClass,
      hp: { current: token.hp.current, max: token.hp.max },
      attackEffects: stats.attackEffects,
      damageEffects: stats.damageEffects,
      reach: stats.reach,
      critOn: stats.critOn,
    });
  }
  return combatants;
}

export interface SceneAttackOutcome {
  /** The apply-damage intent to emit, or undefined on a miss / no damage. */
  intent?: SceneActionIntent;
  /** One-line, human-readable summary for the combat log. */
  log: string;
  hit: boolean;
}

/**
 * Resolve one attacker→target attack and produce a scene intent + log line.
 * Deterministic given the seed. Returns a miss log (no intent) when the attack
 * misses or both tokens cannot be resolved.
 */
export function resolveSceneAttack(params: {
  state: SceneState;
  attackerId: string;
  targetId: string;
  resolveStats: ResolveCombatStats;
  seed: string;
  cause?: string;
}): SceneAttackOutcome {
  const { state, attackerId, targetId, resolveStats, seed } = params;
  const attacker = state.tokens[attackerId];
  const target = state.tokens[targetId];
  if (!attacker || !target) {
    return { log: 'Attack failed: attacker or target is missing.', hit: false };
  }
  const attackerStats = resolveStats(attacker);
  const targetStats = resolveStats(target);
  if (!attackerStats || !targetStats) {
    return { log: `${attacker.name} cannot resolve combat stats for this attack.`, hit: false };
  }

  const resolution = resolveAttack({
    attackEffects: attackerStats.attackEffects,
    damageEffects: attackerStats.damageEffects,
    targetValue: targetStats.armorClass,
    critOn: attackerStats.critOn,
    rng: participantRng(seed, attackerId, targetId),
  });

  const intent = attackToDamageIntent(attackerId, targetId, resolution, params.cause);
  const verb = resolution.isCriticalHit ? 'crits' : resolution.isHit ? 'hits' : 'misses';
  const detail = resolution.isHit
    ? ` for ${resolution.damage} (rolled ${resolution.naturalRoll}+${resolution.attackBonus} vs AC ${targetStats.armorClass})`
    : ` (rolled ${resolution.naturalRoll}+${resolution.attackBonus} vs AC ${targetStats.armorClass})`;

  return {
    intent,
    hit: resolution.isHit,
    log: `${attacker.name} ${verb} ${target.name}${detail}.`,
  };
}

export interface SceneRoundOutcome {
  result: RoundResult;
  intents: SceneActionIntent[];
  log: string[];
}

/**
 * Run a full combat round over the scene's combatants and return the ordered
 * apply-damage intents plus a per-turn log. The caller applies the intents as
 * scene events (keeping persistence in the UI layer).
 */
export function runSceneRound(params: {
  state: SceneState;
  resolveStats: ResolveCombatStats;
  seed: string;
  round: number;
}): SceneRoundOutcome {
  const order = buildSceneCombatants(params.state, params.resolveStats);
  const result = runCombatRound({ order, seed: params.seed, round: params.round });

  const nameOf = (tokenId: string): string => params.state.tokens[tokenId]?.name ?? tokenId;
  const log = result.turns.map((turn) => {
    if (turn.skipped) return `${nameOf(turn.tokenId)} is down and skips its turn.`;
    if (turn.turn.decision === 'no-target') return `${nameOf(turn.tokenId)} has no target.`;
    if (turn.turn.decision === 'move-to-engage') {
      return `${nameOf(turn.tokenId)} moves to engage ${nameOf(turn.turn.chosenTargetId ?? '')}.`;
    }
    const target = nameOf(turn.turn.chosenTargetId ?? '');
    const res = turn.turn.resolution;
    if (!res) return `${nameOf(turn.tokenId)} acts.`;
    if (!res.isHit) return `${nameOf(turn.tokenId)} misses ${target}.`;
    return `${nameOf(turn.tokenId)} ${res.isCriticalHit ? 'crits' : 'hits'} ${target} for ${res.damage}.`;
  });

  return { result, intents: result.intents, log };
}
