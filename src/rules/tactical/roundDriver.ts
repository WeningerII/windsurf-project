/**
 * Round driver — runs a full round of N combatants through initiative.
 *
 * See `docs/rfc/003-rules-ir-and-effects.md` (Accepted), tactical-executor phase
 * and "Participant-aware resolution".
 *
 * This is the loop where the N-participant principle is most visible: it walks
 * the initiative order and, on each combatant's turn, that combatant considers
 * EVERY other living combatant (via the tactical executor's scoring) before
 * acting. The result of one turn (a downed enemy) changes the participant set
 * the next combatant sees — so the loop is re-derived each turn, never a fixed
 * pairing.
 *
 * Deterministic and pure: no RNG of its own and no mutation of inputs. Each
 * turn's attack is seeded by (base seed + round + turn index + actor), so the
 * whole round replays byte-identically. Damage is applied to a local working
 * copy of combatant HP so later turns in the same round see updated state; the
 * driver returns the per-turn records and the final HP, leaving scene-event
 * application to the caller (keeping this layer free of scene plumbing).
 */

import type { EffectInstance } from '../ir/types';
import type {
  SceneConditionTrack,
  SceneCoordinate,
  SceneActionIntent,
} from '../../types/core/scene';
import { executeTacticalTurn, type TacticalTurnResult } from './tacticalExecutor';
import type { TacticalActor, TacticalTarget } from './targetScoring';
import {
  computeAreaParticipants,
  type AuraAction,
  type AuraTrigger,
  type SceneAreaAction,
} from '../resolver/areaParticipants';
import { resolveAreaEffect, type SaveModel } from '../resolver/participantResolution';
import { areaEffectToDamageIntent } from '../resolver/sceneCombat';
import type { BlockPredicate } from '../resolver/lineOfEffect';
import type { DiagonalRule } from '../resolver/areaTargeting';

/** A combatant in the round: identity, faction, position, stats, and live HP. */
export interface RoundCombatant {
  tokenId: string;
  faction: string;
  position: SceneCoordinate;
  armorClass: number;
  hp: { current: number; max: number };
  attackEffects: readonly EffectInstance[];
  damageEffects: readonly EffectInstance[];
  reach?: number;
  critOn?: number;
  /** Weapon critical multiplier (3.5e/PF1e ×2/×3/×4); defaults to ×2 when absent. */
  critMultiplier?: number;
  /** Movement budget in grid cells per turn. */
  speed?: number;
  /** Save-based area actions this combatant may unleash (breath / spells). */
  areaActions?: readonly SceneAreaAction[];
  /** Recurring auras this combatant emits each round (e.g. a Balor's Fire Aura). */
  auras?: readonly AuraAction[];
  /** Saving-throw bonus accessor (for being caught in an area effect). */
  saveBonus?: (ability: string) => number;
  /** Daggerheart damage thresholds — present makes attacks mark HP slots. */
  thresholds?: { major: number; severe: number };
  /** M&M effect rank of this combatant's attack (Toughness DC = 15 + rank). */
  effectRank?: number;
  /** M&M Toughness save bonus — present makes attacks force a Toughness save. */
  toughness?: number;
  /**
   * M&M condition track. HP-less M&M combatants ride a synthetic `hp` proxy
   * (1 = up, 0 = incapacitated); the real harm folds here so the round can
   * report it and the scene can apply it.
   */
  conditions?: SceneConditionTrack;
}

export interface RoundTurnRecord {
  tokenId: string;
  turn: TacticalTurnResult;
  /** The damage intent this turn produced, if any (for scene application). */
  intent?: SceneActionIntent;
  /** Damage from this combatant's recurring auras pulsing on its turn. */
  auraIntents?: SceneActionIntent[];
  /** Whether the turn was skipped because the actor was already down. */
  skipped: boolean;
}

export interface RoundResult {
  round: number;
  turns: RoundTurnRecord[];
  /** Final current-HP per combatant after the round. */
  finalHp: Record<string, number>;
  /** Final condition track per HP-less (M&M) combatant after the round. */
  finalConditions: Record<string, SceneConditionTrack>;
  /** All damage/condition intents produced this round, in turn order. */
  intents: SceneActionIntent[];
}

export interface RunRoundInput {
  /** Combatants in initiative order (highest first). */
  order: readonly RoundCombatant[];
  /** Base seed (e.g. the scene seed). Combined with round + turn for each roll. */
  seed: string;
  /** Round number (1-based); part of the per-turn seed and the result. */
  round: number;
  /** Walls for area line-of-effect/cover; default: no walls. */
  isBlocked?: BlockPredicate;
  /** Diagonal counting rule for area range; default chebyshev. */
  diagonalRule?: DiagonalRule;
  /** Save model for area effects; default binary. */
  saveModel?: SaveModel;
  /** System id (drives cover→save bonus). */
  systemId?: string;
}

function toActor(combatant: RoundCombatant, position: SceneCoordinate): TacticalActor {
  return {
    tokenId: combatant.tokenId,
    faction: combatant.faction,
    position,
    attackEffects: combatant.attackEffects,
    damageEffects: combatant.damageEffects,
    reach: combatant.reach,
    critOn: combatant.critOn,
    critMultiplier: combatant.critMultiplier,
    speed: combatant.speed,
    effectRank: combatant.effectRank,
    areaActions: combatant.areaActions,
  };
}

/**
 * Pulse a combatant's auras of the given trigger: each aura is a self-centered
 * emanation re-resolved from the owner's current cell against every other living
 * combatant in range (line of effect applied). Folds damage into the working HP
 * and returns the intents. RAW-indiscriminate — allies in the aura are hit too.
 */
function pulseAuras(params: {
  owner: RoundCombatant;
  trigger: AuraTrigger;
  order: readonly RoundCombatant[];
  hp: Record<string, number>;
  seed: string;
  round: number;
  rule?: DiagonalRule;
  isBlocked?: BlockPredicate;
  saveModel?: SaveModel;
  systemId?: string;
}): SceneActionIntent[] {
  const auras = (params.owner.auras ?? []).filter((aura) => aura.trigger === params.trigger);
  if (auras.length === 0) return [];

  const intents: SceneActionIntent[] = [];
  for (const aura of auras) {
    const candidates = params.order
      .filter((other) => other.tokenId !== params.owner.tokenId && params.hp[other.tokenId] > 0)
      .map((other) => ({
        id: other.tokenId,
        position: other.position,
        saveBonus: other.saveBonus?.(aura.saveAbility) ?? 0,
      }));
    const selection = computeAreaParticipants({
      area: aura.area,
      emitter: params.owner.position,
      aim: params.owner.position,
      candidates,
      systemId: params.systemId ?? '',
      rule: params.rule,
      isBlocked: params.isBlocked,
    });
    if (selection.participants.length === 0) continue;

    const result = resolveAreaEffect({
      sourceId: params.owner.tokenId,
      seed: `${params.seed}::round${params.round}::aura::${params.owner.tokenId}::${aura.name}::${params.trigger}`,
      damageEffects: aura.damageEffects,
      saveDC: aura.saveDC,
      halfOnSave: aura.halfOnSave,
      saveModel: params.saveModel,
      participants: selection.participants,
    });
    const intent = areaEffectToDamageIntent(result, aura.name);
    if (intent && intent.type === 'apply-damage') {
      for (const damage of intent.damages) {
        if (params.hp[damage.tokenId] != null) {
          params.hp[damage.tokenId] = Math.max(0, params.hp[damage.tokenId] - damage.amount);
        }
      }
      intents.push(intent);
    }
  }
  return intents;
}

function toTarget(
  combatant: RoundCombatant,
  currentHp: number,
  position: SceneCoordinate
): TacticalTarget {
  return {
    tokenId: combatant.tokenId,
    faction: combatant.faction,
    position,
    armorClass: combatant.armorClass,
    hp: { current: currentHp, max: combatant.hp.max },
    saveBonus: combatant.saveBonus,
    thresholds: combatant.thresholds,
    toughness: combatant.toughness,
  };
}

/**
 * Run one full round. For each combatant in initiative order (skipping the
 * already-downed), build the live participant set from every OTHER combatant's
 * current HP, run the tactical turn, and fold any damage into the working HP so
 * subsequent turns see it. Returns per-turn records, final HP, and the ordered
 * damage intents for the caller to apply as scene events.
 */
export function runCombatRound(input: RunRoundInput): RoundResult {
  // Working HP starts from each combatant's current HP; M&M combatants also carry
  // a working condition track (their `hp` is the synthetic up/down proxy).
  const hp: Record<string, number> = {};
  const pos: Record<string, SceneCoordinate> = {};
  const conditions: Record<string, SceneConditionTrack> = {};
  for (const combatant of input.order) {
    hp[combatant.tokenId] = combatant.hp.current;
    pos[combatant.tokenId] = { ...combatant.position };
    if (combatant.conditions) conditions[combatant.tokenId] = { ...combatant.conditions };
  }

  const byId = new Map(input.order.map((combatant) => [combatant.tokenId, combatant]));
  const turns: RoundTurnRecord[] = [];
  const intents: SceneActionIntent[] = [];

  input.order.forEach((combatant, turnIndex) => {
    // Skip combatants already down at the start of their turn.
    if (hp[combatant.tokenId] <= 0) {
      turns.push({
        tokenId: combatant.tokenId,
        skipped: true,
        turn: {
          actorId: combatant.tokenId,
          decision: 'no-target',
          scored: [],
          rationale: 'Down at the start of its turn; skipped.',
        },
      });
      return;
    }

    const auraOpts = {
      order: input.order,
      hp,
      seed: input.seed,
      round: input.round,
      rule: input.diagonalRule,
      isBlocked: input.isBlocked,
      saveModel: input.saveModel,
      systemId: input.systemId,
    };
    // Start-of-turn auras pulse before the action; their damage is folded so the
    // actor (and its target scoring) see the post-aura participant set.
    const startAuras = pulseAuras({ owner: combatant, trigger: 'start-of-turn', ...auraOpts });
    startAuras.forEach((intent) => intents.push(intent));

    // The participant set: every OTHER living combatant, with up-to-date HP and
    // current (post-movement) position.
    const targets: TacticalTarget[] = input.order
      .filter((other) => other.tokenId !== combatant.tokenId && hp[other.tokenId] > 0)
      .map((other) => toTarget(other, hp[other.tokenId], pos[other.tokenId]));

    const turn = executeTacticalTurn({
      actor: toActor(combatant, pos[combatant.tokenId]),
      targets,
      seed: `${input.seed}::round${input.round}::turn${turnIndex}`,
      isBlocked: input.isBlocked,
      diagonalRule: input.diagonalRule,
      saveModel: input.saveModel,
      systemId: input.systemId,
    });

    // Apply movement first: update the working position and emit a move event so
    // later turns (and the scene) see the combatant in its new cell.
    if (turn.moveTo) {
      pos[combatant.tokenId] = { ...turn.moveTo };
      intents.push({ type: 'move-token', tokenId: combatant.tokenId, position: turn.moveTo });
    }

    // Fold this turn's outcome into working state so later turns see it.
    if (turn.intent && turn.intent.type === 'apply-damage') {
      for (const damage of turn.intent.damages) {
        if (hp[damage.tokenId] != null && byId.get(damage.tokenId)?.hp) {
          hp[damage.tokenId] = Math.max(0, hp[damage.tokenId] - damage.amount);
        }
      }
      intents.push(turn.intent);
    } else if (turn.intent && turn.intent.type === 'apply-conditions') {
      // M&M: accumulate the condition delta (Bruised stacks, flags latch — the
      // same semantics the scene's apply-conditions event uses) and drop an
      // incapacitated combatant to the down proxy (working hp 0) so the rest of
      // the loop treats it as out of the fight.
      const { tokenId, delta } = turn.intent;
      const track = conditions[tokenId] ?? {
        bruised: 0,
        dazed: false,
        staggered: false,
        incapacitated: false,
      };
      track.bruised += delta.bruised;
      track.dazed = track.dazed || delta.dazed;
      track.staggered = track.staggered || delta.staggered;
      track.incapacitated = track.incapacitated || delta.incapacitated;
      conditions[tokenId] = track;
      if (track.incapacitated && hp[tokenId] != null) hp[tokenId] = 0;
      intents.push(turn.intent);
    }

    const endAuras = pulseAuras({ owner: combatant, trigger: 'end-of-turn', ...auraOpts });
    endAuras.forEach((intent) => intents.push(intent));

    const auraIntents = [...startAuras, ...endAuras];
    turns.push({
      tokenId: combatant.tokenId,
      turn,
      intent: turn.intent,
      auraIntents: auraIntents.length > 0 ? auraIntents : undefined,
      skipped: false,
    });
  });

  return { round: input.round, turns, finalHp: hp, finalConditions: conditions, intents };
}

/** True when every living combatant belongs to a single faction (combat over). */
export function isRoundConclusive(
  order: readonly RoundCombatant[],
  hp: Record<string, number>
): boolean {
  const livingFactions = new Set(
    order
      .filter((combatant) => (hp[combatant.tokenId] ?? combatant.hp.current) > 0)
      .map((c) => c.faction)
  );
  return livingFactions.size <= 1;
}
