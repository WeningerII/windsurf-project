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
import { gridDistance } from '../resolver/areaTargeting';
import { participantRng } from '../resolver/participantResolution';
import { attackToDamageIntent } from '../resolver/sceneCombat';
import { collectDnd5eConditionEffects } from '../conditions/dnd5eConditions';
import { daggerheartHpMarked, resolveDaggerheartAttack } from '../resolver/daggerheartResolution';

/** PF2e scenes resolve attacks by CRB degrees of success; others use d20 crits. */
function degreeModelForScene(state: SceneState): 'd20' | 'pf2e' {
  return state.systemId === 'pf2e' ? 'pf2e' : 'd20';
}

/** Combat stats for a token, resolved from its statblock or character sheet. */
export interface SceneCombatStats {
  attackEffects: EffectInstance[];
  damageEffects: EffectInstance[];
  armorClass: number;
  /** Reach in grid cells (melee = 1). */
  reach: number;
  critOn?: number;
  /** Attacks per turn (SRD Multiattack). Default 1. */
  attacksPerRound?: number;
  /** Movement per turn in grid cells (speed feet / 5). Default 6 (30 ft.). */
  speedCells?: number;
  /**
   * Daggerheart combat variant: present when this token fights by the duality
   * model (2d12 vs Evasion, threshold-marked HP). armorClass carries Evasion.
   */
  daggerheart?: { thresholds: { major: number; severe: number } };
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
    // The token's own conditions compile into its attack effects (poisoned ->
    // disadvantage etc.), so autonomous rounds fight the same as the manual
    // path. Unknown condition ids contribute nothing.
    const conditionEffects = collectDnd5eConditionEffects(token.conditions ?? []);
    combatants.push({
      tokenId: token.id,
      faction: factionForToken(token),
      position: { ...token.position },
      armorClass: stats.armorClass,
      hp: { current: token.hp.current, max: token.hp.max },
      attackEffects: [...stats.attackEffects, ...conditionEffects],
      damageEffects: stats.damageEffects,
      reach: stats.reach,
      critOn: stats.critOn,
      attacksPerRound: stats.attacksPerRound,
      speedCells: stats.speedCells,
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
 * Deterministic given the seed. Returns an honest no-intent outcome when the
 * attack misses, either token cannot be resolved, either side is down (or has
 * no HP to lose), or the target is beyond the attacker's reach — the same rules
 * the autonomous round enforces.
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
  // Liveness: a downed (or HP-less) attacker cannot act; a downed target cannot
  // be beaten further, and an HP-less target would silently discard the damage
  // in the fold — refuse honestly instead of logging a phantom hit.
  if (!attacker.hp || attacker.hp.current <= 0) {
    return { log: `${attacker.name} is down and cannot attack.`, hit: false };
  }
  if (!target.hp || target.hp.current <= 0) {
    return {
      log: target.hp
        ? `${target.name} is already down.`
        : `${target.name} has no hit points to damage.`,
      hit: false,
    };
  }
  const attackerStats = resolveStats(attacker);
  const targetStats = resolveStats(target);
  if (!attackerStats || !targetStats) {
    return { log: `${attacker.name} cannot resolve combat stats for this attack.`, hit: false };
  }

  // Reach: the manual path enforces the same Chebyshev-distance rule the
  // autonomous round does (scoreTargets.inReach). No RNG is consumed, so an
  // out-of-reach click never advances any stream.
  const distance = gridDistance(attacker.position, target.position);
  if (distance > attackerStats.reach) {
    return {
      log: `${attacker.name} cannot reach ${target.name} (${distance} cells away, reach ${attackerStats.reach}).`,
      hit: false,
    };
  }

  // Daggerheart scenes resolve by the system's own model: 2d12 duality vs
  // Evasion, damage compared to thresholds, MARKED HP as the damage amount.
  if (state.systemId === 'daggerheart' && targetStats.daggerheart) {
    const result = resolveDaggerheartAttack({
      attackEffects: attackerStats.attackEffects,
      damageEffects: attackerStats.damageEffects,
      evasion: targetStats.armorClass,
      thresholds: targetStats.daggerheart.thresholds,
      rng: participantRng(seed, attackerId, targetId),
    });
    const marked = result.isHit
      ? (result.hpMarked ??
        daggerheartHpMarked(result.damage ?? 0, targetStats.daggerheart.thresholds))
      : 0;
    const intent =
      marked > 0
        ? ({
            type: 'apply-damage',
            damages: [{ tokenId: targetId, amount: marked }],
            cause: params.cause,
          } as SceneActionIntent)
        : undefined;
    const dice = `Hope ${result.hopeDie} / Fear ${result.fearDie}`;
    return {
      intent,
      hit: result.isHit,
      log: result.isHit
        ? `${attacker.name} ${result.isCritical ? 'critically hits' : 'hits'} ${target.name} (${dice} vs Evasion ${targetStats.armorClass}) — marks ${marked} HP.`
        : `${attacker.name} misses ${target.name} (${dice} vs Evasion ${targetStats.armorClass}).`,
    };
  }

  // Conditions: the attacker's own conditions compile to effects (e.g.
  // poisoned -> disadvantage on attack), and both sides' condition sets ride
  // the resolve context so condition-gated equipment/feat effects can fire.
  // The compiler speaks the 5e vocabulary; unknown ids contribute nothing.
  const attackerConditions = attacker.conditions ?? [];
  const targetConditions = new Set(target.conditions ?? []);
  const resolution = resolveAttack({
    attackEffects: [
      ...attackerStats.attackEffects,
      ...collectDnd5eConditionEffects(attackerConditions),
    ],
    damageEffects: attackerStats.damageEffects,
    targetValue: targetStats.armorClass,
    critOn: attackerStats.critOn,
    degreeModel: degreeModelForScene(state),
    rng: participantRng(seed, attackerId, targetId),
    context: {
      conditions: new Set(attackerConditions),
      attackerConditions: new Set(attackerConditions),
      targetConditions,
    },
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
  /**
   * Ordered intents to apply: the round's apply-damage intents followed by the
   * advance-turn intents that walk the initiative cycle back to its top, so the
   * fold increments `state.round` exactly once per completed engine round.
   */
  intents: SceneActionIntent[];
  log: string[];
}

/**
 * Run a full combat round over the scene's combatants and return the ordered
 * intents plus a per-turn log. The caller applies the intents as scene events
 * (keeping persistence in the UI layer). `runCombatRound` documents
 * round-advancement as the caller's job — this bridge does it by appending
 * advance-turn intents (one per remaining initiative slot) after the damage,
 * so the scene's round/active-token machinery stays in sync with autonomous
 * combat. Scenes with no initiative order have no turn machinery to advance.
 */
export function runSceneRound(params: {
  state: SceneState;
  resolveStats: ResolveCombatStats;
  seed: string;
  round: number;
}): SceneRoundOutcome {
  const order = buildSceneCombatants(params.state, params.resolveStats);
  const result = runCombatRound({
    order,
    seed: params.seed,
    round: params.round,
    degreeModel: degreeModelForScene(params.state),
  });

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

  const intents: SceneActionIntent[] = [...result.intents];
  if (params.state.initiative.length > 0) {
    const activeIndex = params.state.initiative.findIndex(
      (entry) => entry.tokenId === params.state.activeTokenId
    );
    // Walk from the current active slot back to the top of the order; the fold
    // bumps state.round when the cycle wraps. An active token missing from
    // initiative wraps to the top in a single step (matching the fold's rule).
    const steps = activeIndex < 0 ? 1 : params.state.initiative.length - activeIndex;
    for (let step = 0; step < steps; step += 1) {
      intents.push({ type: 'advance-turn' });
    }
  }

  return { result, intents, log };
}
