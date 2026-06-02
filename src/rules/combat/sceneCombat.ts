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

import type {
  SceneActionIntent,
  SceneCoordinate,
  SceneState,
  SceneToken,
} from '../../types/core/scene';
import type { EffectInstance } from '../ir/types';
import { runCombatRound, type RoundCombatant, type RoundResult } from '../tactical/roundDriver';
import { resolveAttack } from '../resolver/attackResolution';
import {
  participantRng,
  resolveAreaEffect,
  type SaveParticipant,
} from '../resolver/participantResolution';
import { areaEffectToDamageIntent, attackToDamageIntent } from '../resolver/sceneCombat';
import { tokensInArea, type AreaShape } from '../resolver/areaTargeting';
import type { SaveActionArea } from '../combatants/monsterCombatant';

/** Combat stats for a token, resolved from its statblock or character sheet. */
export interface SceneCombatStats {
  attackEffects: EffectInstance[];
  damageEffects: EffectInstance[];
  armorClass: number;
  /** Reach in grid cells (melee = 1). */
  reach: number;
  critOn?: number;
  /**
   * This combatant's saving-throw bonus for an ability (e.g. 'dex'), used when
   * it is a participant in someone else's area effect. Omitted when unknown — the
   * area resolver then treats the bonus as 0.
   */
  saveBonus?: (ability: string) => number;
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

/** A save-based area action ready to resolve on a scene (e.g. a breath weapon). */
export interface SceneAreaAction {
  name: string;
  /** Ability targets save with (e.g. 'dex'), lowercased. */
  saveAbility: string;
  saveDC: number;
  /** When true, a successful save halves damage; else it negates. */
  halfOnSave: boolean;
  damageEffects: EffectInstance[];
  /** Template (cone/line/sphere/cube); undefined → affects only the aimed cell. */
  area?: SaveActionArea;
}

/**
 * Build the grid `AreaShape` an action fills, given where it originates (the
 * emitter's cell) and the cell it's aimed at. Cones and lines emanate from the
 * origin toward the aim; spheres/cubes are centered on the aim. An action with
 * no parsed template degenerates to a single-cell burst on the aim, so it still
 * resolves (against just the aimed creature) rather than silently doing nothing.
 */
export function areaShapeForAction(
  area: SaveActionArea | undefined,
  origin: SceneCoordinate,
  aim: SceneCoordinate
): AreaShape {
  if (!area) return { kind: 'burst', origin: aim, radius: 0 };
  switch (area.shape) {
    case 'cone':
      return { kind: 'cone', origin, aim, length: area.lengthCells };
    case 'line': {
      const dx = aim.x - origin.x;
      const dy = aim.y - origin.y;
      const mag = Math.hypot(dx, dy) || 1;
      const to = {
        x: origin.x + Math.round((dx / mag) * area.lengthCells),
        y: origin.y + Math.round((dy / mag) * area.lengthCells),
      };
      return { kind: 'line', origin, to };
    }
    case 'burst':
      return { kind: 'burst', origin: aim, radius: area.radiusCells };
    case 'cube': {
      const half = Math.floor(area.sizeCells / 2);
      return {
        kind: 'rect',
        origin: { x: aim.x - half, y: aim.y - half },
        width: area.sizeCells,
        height: area.sizeCells,
      };
    }
    default: {
      const exhaustive: never = area;
      return exhaustive;
    }
  }
}

export interface SceneAreaEffectOutcome {
  /** Single apply-damage intent covering everyone who took damage, or undefined. */
  intent?: SceneActionIntent;
  /** Header + per-target lines for the combat log. */
  log: string[];
  /** The resolved template (for an aiming preview / highlight). */
  shape: AreaShape;
  /** Token ids the template caught (excludes the emitter). */
  affectedIds: string[];
}

/**
 * Resolve a save-based area action (breath weapon / AoE) emanating from a source
 * token toward an aim cell. Every living token the template catches (other than
 * the emitter) becomes a participant: damage is rolled ONCE and shared, each
 * target saves independently (its own seeded sub-stream), and the whole blast
 * lands as a single `apply-damage` intent — the N-participant path, RAW.
 */
export function resolveSceneAreaEffect(params: {
  state: SceneState;
  sourceId: string;
  action: SceneAreaAction;
  aim: SceneCoordinate;
  resolveStats: ResolveCombatStats;
  seed: string;
  cause?: string;
}): SceneAreaEffectOutcome {
  const { state, sourceId, action, aim, resolveStats, seed } = params;
  const source = state.tokens[sourceId];
  const shape = areaShapeForAction(action.area, source?.position ?? aim, aim);

  if (!source) {
    return { log: ['Area effect failed: the source token is missing.'], shape, affectedIds: [] };
  }

  // Participants: every other living token inside the template. AoE is RAW
  // indiscriminate — allies in the blast are caught too.
  const caught = tokensInArea(state, shape).filter(
    (token) => token.id !== sourceId && (token.hp ? token.hp.current > 0 : false)
  );

  const participants: SaveParticipant[] = caught.map((token) => ({
    targetId: token.id,
    saveBonus: resolveStats(token)?.saveBonus?.(action.saveAbility) ?? 0,
  }));

  if (participants.length === 0) {
    return {
      log: [`${source.name} unleashes ${action.name}, but it catches no one.`],
      shape,
      affectedIds: [],
    };
  }

  const result = resolveAreaEffect({
    sourceId,
    seed,
    damageEffects: action.damageEffects,
    saveDC: action.saveDC,
    halfOnSave: action.halfOnSave,
    participants,
  });

  const nameOf = (id: string): string => state.tokens[id]?.name ?? id;
  const header = `${source.name} unleashes ${action.name} — ${result.sharedDamage} damage, DC ${action.saveDC} ${action.saveAbility.toUpperCase()} (${participants.length} caught).`;
  const lines = result.perTarget.map((outcome) => {
    const verb = outcome.saved ? 'saves' : 'fails';
    return `  ${nameOf(outcome.targetId)} ${verb} (rolled ${outcome.saveRoll}+${outcome.saveTotal - outcome.saveRoll}) — takes ${outcome.damageTaken}.`;
  });

  return {
    intent: areaEffectToDamageIntent(result, params.cause),
    log: [header, ...lines],
    shape,
    affectedIds: caught.map((token) => token.id),
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
