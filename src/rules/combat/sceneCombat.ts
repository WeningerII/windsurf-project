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
import type { RollMode } from '../resolver/resolve';
import { runCombatRound, type RoundCombatant, type RoundResult } from '../tactical/roundDriver';
import { critModelForSystem, resolveAttack } from '../resolver/attackResolution';
import type { DamageDefenses } from '../resolver/damageDefenses';
import {
  resolveDaggerheartAttack,
  type DaggerheartThresholds,
} from '../resolver/daggerheartResolution';
import { resolveMam3eAttack } from '../resolver/mam3eResolution';
import {
  participantRng,
  resolveAreaEffect,
  type SaveDegree,
} from '../resolver/participantResolution';
import { areaEffectToDamageIntent, attackToDamageIntent } from '../resolver/sceneCombat';
import {
  areaOfEffectToShape,
  diagonalRuleForSystem,
  type AreaShape,
} from '../resolver/areaTargeting';
import {
  computeAreaParticipants,
  shapeForArea,
  type AreaCandidate,
  type AuraAction,
  type SceneAreaAction,
} from '../resolver/areaParticipants';
import { sceneBlockPredicate, sceneMoveCost } from '../terrain/sceneTerrain';
import { coverAcBonus, coverBetween } from '../resolver/lineOfEffect';
import { flankToHitBonus, isFlanking } from '../tactical/flanking';
import { collapseRollMode, statusAdvantage } from '../resolver/conditions';
import { concentrationBreak } from '../resolver/concentration';
import { narrateAttack, type AttackTone } from '../narration/combatNarrator';
import type { AreaOfEffect } from '../../types/core/common';

/** Combat stats for a token, resolved from its statblock or character sheet. */
export interface SceneCombatStats {
  attackEffects: EffectInstance[];
  damageEffects: EffectInstance[];
  armorClass: number;
  /** Reach in grid cells (melee = 1). */
  reach: number;
  /** Movement budget in grid cells per turn (defaults applied when absent). */
  speed?: number;
  critOn?: number;
  /** Weapon critical multiplier (3.5e/PF1e ×2/×3/×4); defaults to ×2 when absent. */
  critMultiplier?: number;
  /** Attacks made per turn (Multiattack / Extra Attack); defaults to 1. */
  attacksPerTurn?: number;
  /**
   * Daggerheart damage thresholds (Major/Severe). Present makes this combatant a
   * Daggerheart target: an attack marks 1-3 HP slots by threshold instead of
   * subtracting raw damage. `armorClass` holds its Evasion.
   */
  thresholds?: DaggerheartThresholds;
  /**
   * M&M Toughness save bonus. Present makes this an M&M target: an attack vs its
   * defense (`armorClass` = Parry) forces a Toughness save → condition track.
   */
  toughness?: number;
  /** Damage resistances/immunities/vulnerabilities, applied per type after crit. */
  damageDefenses?: DamageDefenses;
  /** M&M effect rank of this combatant's attack (Toughness DC = 15 + rank). */
  effectRank?: number;
  /**
   * This combatant's saving-throw bonus for an ability (e.g. 'dex'), used when
   * it is a participant in someone else's area effect. Omitted when unknown — the
   * area resolver then treats the bonus as 0.
   */
  saveBonus?: (ability: string) => number;
}

/** Resolve a token's combat stats, or undefined when it cannot fight. */
export type ResolveCombatStats = (token: SceneToken) => SceneCombatStats | undefined;

/** Resolve a token's save-based area actions (breath / spells), for the AI to use. */
export type ResolveAreaActions = (token: SceneToken) => SceneAreaAction[];

/** Resolve a token's recurring auras (emanations that pulse each round). */
export type ResolveAuras = (token: SceneToken) => AuraAction[];

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
  resolveStats: ResolveCombatStats,
  resolveAreaActions?: ResolveAreaActions,
  resolveAuras?: ResolveAuras
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
    if (!token) continue;
    const stats = resolveStats(token);
    if (!stats) continue;
    // HP-based combatant, or an M&M condition-track combatant (no HP): the latter
    // rides a synthetic up/down proxy — 1 while standing, 0 once incapacitated —
    // so the HP-driven round loop can skip it when it goes down while the real
    // harm is tracked as conditions.
    const hp = token.hp
      ? { current: token.hp.current, max: token.hp.max }
      : stats.toughness != null
        ? { current: token.conditions?.incapacitated ? 0 : 1, max: 1 }
        : undefined;
    if (!hp) continue;
    const areaActions = resolveAreaActions?.(token);
    const auras = resolveAuras?.(token);
    combatants.push({
      tokenId: token.id,
      faction: factionForToken(token),
      position: { ...token.position },
      armorClass: stats.armorClass,
      hp,
      attackEffects: stats.attackEffects,
      damageEffects: stats.damageEffects,
      reach: stats.reach,
      speed: stats.speed,
      critOn: stats.critOn,
      critMultiplier: stats.critMultiplier,
      attacksPerTurn: stats.attacksPerTurn,
      thresholds: stats.thresholds,
      toughness: stats.toughness,
      effectRank: stats.effectRank,
      damageDefenses: stats.damageDefenses,
      statuses: token.statuses,
      concentration: token.concentration,
      makesDeathSaves:
        token.kind === 'character' &&
        (state.systemId === 'dnd-5e-2014' || state.systemId === 'dnd-5e-2024'),
      deathSaves: token.deathSaves,
      conditions: token.conditions,
      areaActions: areaActions && areaActions.length > 0 ? areaActions : undefined,
      auras: auras && auras.length > 0 ? auras : undefined,
      saveBonus: stats.saveBonus,
    });
  }
  return combatants;
}

export interface SceneAttackOutcome {
  /** The apply-damage intent to emit, or undefined on a miss / no damage. */
  intent?: SceneActionIntent;
  /** Follow-on intents (e.g. a broken-concentration clear) to apply after the hit. */
  extraIntents?: SceneActionIntent[];
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
  /** 5e advantage/disadvantage on the attack roll (d20 path only). */
  rollMode?: RollMode;
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

  // Cover between attacker and target (walls/terrain): total cover is no line of
  // sight (the attack can't be made); otherwise a per-system bonus to the
  // target's defense. Flanking (3.5e/PF1e/PF2e) pulls the other way.
  const cover = coverBetween(attacker.position, target.position, sceneBlockPredicate(state));
  if (cover === 'total') {
    return {
      hit: false,
      log: `${attacker.name} has no line of sight to ${target.name} (total cover).`,
    };
  }
  const coverBonus = coverAcBonus(cover, state.systemId);
  const attackerFaction = factionForToken(attacker);
  const flank = flankToHitBonus(state.systemId);
  const flanked =
    flank > 0 &&
    isFlanking({
      attacker: attacker.position,
      target: target.position,
      reach: attackerStats.reach,
      allies: Object.values(state.tokens)
        .filter(
          (t) =>
            t.id !== attackerId &&
            t.id !== targetId &&
            factionForToken(t) === attackerFaction &&
            (t.hp ? t.hp.current > 0 : true)
        )
        .map((t) => t.position),
      rule: diagonalRuleForSystem(state.systemId),
    });
  const defenseBonus = coverBonus - (flanked ? flank : 0);
  const coverNote = `${coverBonus > 0 ? ` incl. +${coverBonus} cover` : ''}${
    flanked ? ` incl. -${flank} flanked` : ''
  }`;

  // Daggerheart: attack vs Evasion (= armorClass), then mark 1-3 HP slots by the
  // target's thresholds rather than subtracting raw damage.
  if (state.systemId === 'daggerheart' && targetStats.thresholds) {
    const dh = resolveDaggerheartAttack({
      attackEffects: attackerStats.attackEffects,
      damageEffects: attackerStats.damageEffects,
      evasion: targetStats.armorClass + defenseBonus,
      thresholds: targetStats.thresholds,
      rng: participantRng(seed, attackerId, targetId),
    });
    const intent: SceneActionIntent | undefined =
      dh.isHit && dh.hpMarked > 0
        ? {
            type: 'apply-damage',
            actorId: attackerId,
            cause: params.cause,
            damages: [{ tokenId: targetId, amount: dh.hpMarked }],
          }
        : undefined;
    const evasion = targetStats.armorClass + defenseBonus;
    const detail = dh.isHit
      ? ` for ${dh.damage} damage → marks ${dh.hpMarked} HP (rolled ${dh.attackTotal} vs Evasion ${evasion}${coverNote})`
      : ` (rolled ${dh.attackTotal} vs Evasion ${evasion}${coverNote})`;
    return {
      intent,
      hit: dh.isHit,
      log: `${attacker.name} ${dh.isHit ? 'hits' : 'misses'} ${target.name}${detail}.`,
    };
  }

  // M&M: attack vs the target's defense (= armorClass = Parry); on a hit, a
  // Toughness save whose shortfall drives the condition track (no hit points).
  if (state.systemId === 'mam3e' && targetStats.toughness != null) {
    const defense = targetStats.armorClass + defenseBonus;
    const mm = resolveMam3eAttack({
      attackEffects: attackerStats.attackEffects,
      targetDefense: defense,
      effectRank: attackerStats.effectRank ?? 0,
      toughness: targetStats.toughness,
      rng: participantRng(seed, attackerId, targetId),
    });
    const hasCondition =
      mm.condition.bruised > 0 ||
      mm.condition.dazed ||
      mm.condition.staggered ||
      mm.condition.incapacitated;
    const intent: SceneActionIntent | undefined =
      mm.isHit && hasCondition
        ? { type: 'apply-conditions', actorId: attackerId, tokenId: targetId, delta: mm.condition }
        : undefined;
    const effect = mm.condition.incapacitated
      ? 'incapacitated'
      : mm.condition.staggered
        ? 'staggered'
        : mm.condition.dazed
          ? 'dazed and bruised'
          : mm.condition.bruised > 0
            ? 'bruised'
            : 'unharmed (saved)';
    const detail = mm.isHit
      ? ` (rolled ${mm.attackTotal} vs defense ${defense}${coverNote}; Toughness ${mm.saveTotal} vs DC ${mm.saveDC} → ${effect})`
      : ` (rolled ${mm.attackTotal} vs defense ${defense}${coverNote})`;
    return {
      intent,
      hit: mm.isHit,
      log: `${attacker.name} ${mm.isHit ? 'hits' : 'misses'} ${target.name}${detail}.`,
    };
  }

  const armorClass = targetStats.armorClass + defenseBonus;
  // 5e: fold the attacker's and target's conditions into advantage/disadvantage,
  // combined with any manual choice (advantage and disadvantage cancel).
  const is5e = state.systemId === 'dnd-5e-2014' || state.systemId === 'dnd-5e-2024';
  const statusMode = is5e
    ? statusAdvantage(attacker.statuses, target.statuses)
    : { advantage: false, disadvantage: false };
  const advantage = statusMode.advantage || params.rollMode === 'advantage';
  const disadvantage = statusMode.disadvantage || params.rollMode === 'disadvantage';
  // Only override when a source applies, so effect-derived modes survive.
  const rollMode =
    advantage || disadvantage ? collapseRollMode(advantage, disadvantage) : undefined;
  const resolution = resolveAttack({
    attackEffects: attackerStats.attackEffects,
    damageEffects: attackerStats.damageEffects,
    targetValue: armorClass,
    critOn: attackerStats.critOn,
    critModel: critModelForSystem(state.systemId),
    critMultiplier: attackerStats.critMultiplier,
    targetDefenses: targetStats.damageDefenses,
    rollMode,
    rng: participantRng(seed, attackerId, targetId),
  });

  const intent = attackToDamageIntent(attackerId, targetId, resolution, params.cause);
  // A 3.5e/PF1e threat that failed to confirm landed as a normal hit, not a crit.
  const verb = resolution.isCriticalHit
    ? 'crits'
    : resolution.confirmed === false
      ? 'hits (crit unconfirmed)'
      : resolution.isHit
        ? 'hits'
        : resolution.degree === 'critical-failure'
          ? 'critically misses'
          : 'misses';
  // Surface advantage/disadvantage (and the pair of dice) so the player sees why.
  const modeNote =
    resolution.rollMode !== 'normal'
      ? ` with ${resolution.rollMode} (${resolution.d20Terms.join('/')})`
      : '';
  const detail = resolution.isHit
    ? ` for ${resolution.damage} (rolled ${resolution.naturalRoll}+${resolution.attackBonus} vs AC ${armorClass}${coverNote})${modeNote}`
    : ` (rolled ${resolution.naturalRoll}+${resolution.attackBonus} vs AC ${armorClass}${coverNote})${modeNote}`;

  // 5e: damage to a concentrating target forces a CON save or the spell drops.
  let concentrationNote = '';
  const extraIntents: SceneActionIntent[] = [];
  if (is5e && target.concentration && resolution.damage > 0) {
    const broken = concentrationBreak({
      tokenId: targetId,
      concentration: target.concentration,
      conSaveBonus: targetStats.saveBonus?.('con') ?? 0,
      damage: resolution.damage,
      rng: participantRng(seed, attackerId, targetId, 'concentration'),
    });
    if (broken) {
      extraIntents.push(broken.intent);
      concentrationNote = ` ${target.name} loses concentration on ${target.concentration} (rolled ${broken.check.total} vs DC ${broken.check.dc}).`;
    }
  }

  return {
    intent,
    extraIntents: extraIntents.length > 0 ? extraIntents : undefined,
    hit: resolution.isHit,
    log: `${attacker.name} ${verb} ${target.name}${detail}.${concentrationNote}`,
  };
}

// SceneAreaAction lives with the shared area selector (resolver/areaParticipants)
// so the scene-free tactical layer can use it without an import cycle; re-exported
// here for existing importers.
export type { SceneAreaAction };

/**
 * Build the grid `AreaShape` an action fills, given where it originates (the
 * emitter's cell) and the cell it's aimed at. Delegates to the canonical
 * `areaOfEffectToShape` for every shape; an action with no parsed template
 * degenerates to a single-cell burst on the aim, so it still resolves (against
 * just the aimed creature) rather than silently doing nothing.
 */
export function areaShapeForAction(
  area: AreaOfEffect | undefined,
  origin: SceneCoordinate,
  aim: SceneCoordinate
): AreaShape {
  if (!area) return { kind: 'burst', origin: aim, radius: 0 };
  return areaOfEffectToShape(area, origin, aim);
}

/** Human labels for PF2e save degrees, shown in the combat log. */
const DEGREE_LABEL: Record<SaveDegree, string> = {
  'critical-success': 'crit-saves',
  success: 'saves',
  failure: 'fails',
  'critical-failure': 'crit-fails',
};

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
  const emitter = source?.position ?? aim;
  // Diagonals (range/radius) and the save model both depend on the system: 5e
  // uses Chebyshev + a binary save; Pathfinder 2e uses the 1-2-1 diagonal + a
  // four-degree basic save.
  const rule = diagonalRuleForSystem(state.systemId);
  const saveModel = state.systemId === 'pf2e' ? 'pf2e-basic' : 'binary';

  if (!source) {
    const shape = shapeForArea(action.area, emitter, aim);
    return { log: ['Area effect failed: the source token is missing.'], shape, affectedIds: [] };
  }

  // Every other living token is a candidate; the shared selector applies the
  // geometry, line of effect, cover, and spread flood-fill. AoE is RAW
  // indiscriminate — allies in the blast are caught too.
  const candidates: AreaCandidate[] = Object.values(state.tokens)
    .filter((token) => token.id !== sourceId && (token.hp ? token.hp.current > 0 : false))
    .map((token) => ({
      id: token.id,
      position: token.position,
      saveBonus: resolveStats(token)?.saveBonus?.(action.saveAbility) ?? 0,
      defenses: resolveStats(token)?.damageDefenses,
    }));

  const selection = computeAreaParticipants({
    area: action.area,
    emitter,
    aim,
    candidates,
    systemId: state.systemId,
    rule,
    isBlocked: sceneBlockPredicate(state),
  });
  const { shape, participants, caughtIds, shieldedByCover } = selection;

  if (participants.length === 0) {
    const why = shieldedByCover > 0 ? ` (${shieldedByCover} shielded by cover)` : '';
    return {
      log: [`${source.name} unleashes ${action.name}, but it catches no one${why}.`],
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
    saveModel,
    participants,
  });

  const nameOf = (id: string): string => state.tokens[id]?.name ?? id;
  const shielded = shieldedByCover > 0 ? `, ${shieldedByCover} behind cover` : '';
  const header = `${source.name} unleashes ${action.name} — ${result.sharedDamage} damage, DC ${action.saveDC} ${action.saveAbility.toUpperCase()} (${participants.length} caught${shielded}).`;
  const lines = result.perTarget.map((outcome) => {
    const label = outcome.degree ? DEGREE_LABEL[outcome.degree] : outcome.saved ? 'saves' : 'fails';
    return `  ${nameOf(outcome.targetId)} ${label} (rolled ${outcome.saveRoll}+${outcome.saveTotal - outcome.saveRoll}) — takes ${outcome.damageTaken}.`;
  });

  return {
    intent: areaEffectToDamageIntent(result, params.cause),
    log: [header, ...lines],
    shape,
    affectedIds: caughtIds,
  };
}

export interface SceneRoundOutcome {
  result: RoundResult;
  intents: SceneActionIntent[];
  /** Terse, mechanical per-line log (rolls, AC, damage). */
  log: string[];
  /** Flavorful prose for the same events — the deterministic narration fallback. */
  narration: string[];
}

/**
 * Run a full combat round over the scene's combatants and return the ordered
 * apply-damage intents plus a per-turn log. The caller applies the intents as
 * scene events (keeping persistence in the UI layer).
 */
export function runSceneRound(params: {
  state: SceneState;
  resolveStats: ResolveCombatStats;
  /** Optional: lets combatants unleash breath/spell AoE during the auto-round. */
  resolveAreaActions?: ResolveAreaActions;
  /** Optional: recurring auras that pulse each round (e.g. a Balor's Fire Aura). */
  resolveAuras?: ResolveAuras;
  seed: string;
  round: number;
}): SceneRoundOutcome {
  const order = buildSceneCombatants(
    params.state,
    params.resolveStats,
    params.resolveAreaActions,
    params.resolveAuras
  );
  const result = runCombatRound({
    order,
    seed: params.seed,
    round: params.round,
    isBlocked: sceneBlockPredicate(params.state),
    diagonalRule: diagonalRuleForSystem(params.state.systemId),
    saveModel: params.state.systemId === 'pf2e' ? 'pf2e-basic' : 'binary',
    systemId: params.state.systemId,
    enterCost: sceneMoveCost(params.state),
  });

  const nameOf = (tokenId: string): string => params.state.tokens[tokenId]?.name ?? tokenId;
  const turnLine = (turn: RoundResult['turns'][number]): string => {
    if (turn.skipped) return `${nameOf(turn.tokenId)} is down and skips its turn.`;
    if (turn.turn.decision === 'no-target') return `${nameOf(turn.tokenId)} has no target.`;
    if (turn.turn.decision === 'area-effect') {
      const caught = (turn.turn.areaCaughtIds ?? []).map(nameOf).join(', ');
      return `${nameOf(turn.tokenId)} unleashes ${turn.turn.chosenAreaActionName} on ${caught}.`;
    }
    if (turn.turn.decision === 'move-to-engage') {
      return `${nameOf(turn.tokenId)} moves toward ${nameOf(turn.turn.chosenTargetId ?? '')}.`;
    }
    const target = nameOf(turn.turn.chosenTargetId ?? '');
    const moved = turn.turn.moveTo ? 'moves in and ' : '';
    // M&M strikes land as a condition delta (no HP / no AttackResolution).
    if (turn.turn.intent?.type === 'apply-conditions') {
      const d = turn.turn.intent.delta;
      const effect = d.incapacitated
        ? 'incapacitates'
        : d.staggered
          ? 'staggers'
          : d.dazed
            ? 'dazes'
            : 'bruises';
      return `${nameOf(turn.tokenId)} ${moved}${effect} ${target}.`;
    }
    // A full attack action of several swings (Multiattack / Extra Attack).
    if ((turn.turn.attacks ?? 1) > 1) {
      const attacks = turn.turn.attacks ?? 1;
      const hits = turn.turn.hits ?? 0;
      const total =
        turn.turn.intent?.type === 'apply-damage'
          ? (turn.turn.intent.damages.find((d) => d.tokenId === turn.turn.chosenTargetId)?.amount ??
            0)
          : 0;
      return hits > 0
        ? `${nameOf(turn.tokenId)} ${moved}makes ${attacks} attacks on ${target}, ${hits} hitting for ${total}.`
        : `${nameOf(turn.tokenId)} ${moved}makes ${attacks} attacks on ${target}, all missing.`;
    }
    const res = turn.turn.resolution;
    if (!res) {
      // An M&M attack that connected but was shrugged off (saved), or a no-op.
      return turn.turn.decision === 'attack' && turn.turn.chosenTargetId
        ? `${nameOf(turn.tokenId)} ${moved}attacks ${target} to no effect.`
        : `${nameOf(turn.tokenId)} acts.`;
    }
    if (!res.isHit) return `${nameOf(turn.tokenId)} ${moved}misses ${target}.`;
    return `${nameOf(turn.tokenId)} ${moved}${res.isCriticalHit ? 'crits' : 'hits'} ${target} for ${res.damage}.`;
  };
  const log = result.turns.flatMap((turn) => {
    const lines: string[] = [];
    // Opportunity attacks the mover provoked resolve before its own action.
    for (const oa of turn.oaIntents ?? []) {
      if (oa.type !== 'apply-damage') continue;
      const total = oa.damages.reduce((sum, d) => sum + d.amount, 0);
      lines.push(
        `${nameOf(turn.tokenId)} provokes an opportunity attack from ${nameOf(
          oa.actorId ?? ''
        )} — takes ${total}.`
      );
    }
    for (const aura of turn.auraIntents ?? []) {
      if (aura.type !== 'apply-damage') continue;
      const hit = aura.damages.map((d) => `${nameOf(d.tokenId)} (${d.amount})`).join(', ');
      lines.push(`${nameOf(turn.tokenId)}'s ${aura.cause ?? 'aura'} sears ${hit}.`);
    }
    lines.push(turnLine(turn));
    return lines;
  });

  // Flavorful narration of the same turns: a single d20 strike gets seeded prose
  // from the narrator; everything else reuses the terse line (already readable).
  const narrationFor = (turn: RoundResult['turns'][number]): string => {
    const res = turn.turn.resolution;
    if (turn.skipped || turn.turn.decision !== 'attack' || !res || (turn.turn.attacks ?? 1) > 1) {
      return turnLine(turn);
    }
    const tone: AttackTone = res.isCriticalHit
      ? 'crit'
      : res.isHit
        ? 'hit'
        : res.isCriticalMiss || res.degree === 'critical-failure'
          ? 'fumble'
          : 'miss';
    return narrateAttack({
      attacker: nameOf(turn.tokenId),
      target: nameOf(turn.turn.chosenTargetId ?? ''),
      tone,
      damage: res.damage,
      seed: `${params.seed}::round${params.round}`,
    });
  };
  const narration = result.turns.flatMap((turn) => {
    const lines: string[] = [];
    for (const oa of turn.oaIntents ?? []) {
      if (oa.type !== 'apply-damage') continue;
      const total = oa.damages.reduce((sum, d) => sum + d.amount, 0);
      lines.push(
        `${nameOf(oa.actorId ?? '')} catches ${nameOf(turn.tokenId)} fleeing — ${total} damage.`
      );
    }
    lines.push(narrationFor(turn));
    return lines;
  });

  return { result, intents: result.intents, log, narration };
}
