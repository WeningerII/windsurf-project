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
import {
  executeTacticalTurn,
  resolveStrike,
  type TacticalTurnInput,
  type TacticalTurnResult,
} from './tacticalExecutor';
import type { TacticalActor, TacticalTarget } from './targetScoring';
import {
  computeAreaParticipants,
  type AuraAction,
  type AuraTrigger,
  type SceneAreaAction,
} from '../resolver/areaParticipants';
import {
  participantRng,
  resolveAreaEffect,
  type SaveModel,
} from '../resolver/participantResolution';
import { areaEffectToDamageIntent } from '../resolver/sceneCombat';
import { cannotAct } from '../resolver/conditions';
import { concentrationBreak } from '../resolver/concentration';
import { rollDeathSave } from '../resolver/deathSaves';
import { resolveFall } from '../resolver/falling';
import { gridDistance } from '../resolver/areaTargeting';
import type { DamageDefenses } from '../resolver/damageDefenses';
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
  /** Attacks made per turn (Multiattack / Extra Attack); defaults to 1. */
  attacksPerTurn?: number;
  /** Movement budget in grid cells per turn. */
  speed?: number;
  /** Fly speed in grid cells per turn; > 0 means this combatant can fly. */
  flySpeed?: number;
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
  /** Damage resistances/immunities/vulnerabilities, applied per type after crit. */
  damageDefenses?: DamageDefenses;
  /** Active named conditions (5e advantage/disadvantage on attacks). */
  statuses?: readonly string[];
  /** Spell this combatant is concentrating on (5e); damage may break it. */
  concentration?: string;
  /** When true (a 5e character), being at 0 HP makes a death save each turn. */
  makesDeathSaves?: boolean;
  /** Running death-save tally when downed. */
  deathSaves?: { successes: number; failures: number };
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
  /** Opportunity attacks this combatant provoked by moving out of reach. */
  oaIntents?: SceneActionIntent[];
  /** Descent + falling damage when this combatant fell at the start of its turn. */
  fallIntents?: SceneActionIntent[];
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
  /** Per-cell movement entering cost (≥1; difficult terrain). Default 1. */
  enterCost?: (cell: SceneCoordinate) => number;
  /** Strategist seam: bias each turn's target among legal candidates (or defer). */
  chooseTarget?: TacticalTurnInput['chooseTarget'];
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
    flySpeed: combatant.flySpeed,
    attacksPerTurn: combatant.attacksPerTurn,
    effectRank: combatant.effectRank,
    statuses: combatant.statuses,
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
        defenses: other.damageDefenses,
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
    damageDefenses: combatant.damageDefenses,
    statuses: combatant.statuses,
  };
}

/**
 * Systems where every melee combatant threatens its reach and so gets an
 * opportunity attack: 5e and the d20-legacy line. PF2e's reaction is conditional
 * (not in the data) and M&M/Daggerheart have other action economies, so they
 * don't provoke universally here.
 */
function oaSystemProvokes(systemId: string | undefined): boolean {
  return (
    systemId === 'dnd-5e-2014' ||
    systemId === 'dnd-5e-2024' ||
    systemId === 'dnd-3.5e' ||
    systemId === 'pf1e'
  );
}

/**
 * Opportunity attacks a mover provokes by leaving an enemy's reach. Each living,
 * able enemy that threatened the START cell but not the END cell strikes the
 * mover (resolved as it leaves, from the start cell). Damage folds into the
 * working HP; the intents are returned for the caller to apply. RAW-baseline:
 * one reaction per threatener, resolved after the move (not a mid-move interrupt).
 */
function resolveOpportunityAttacks(params: {
  mover: RoundCombatant;
  start: SceneCoordinate;
  end: SceneCoordinate;
  order: readonly RoundCombatant[];
  hp: Record<string, number>;
  pos: Record<string, SceneCoordinate>;
  seed: string;
  round: number;
  systemId?: string;
  isBlocked?: BlockPredicate;
  diagonalRule?: DiagonalRule;
}): SceneActionIntent[] {
  if (!oaSystemProvokes(params.systemId)) return [];
  const intents: SceneActionIntent[] = [];
  const moverTarget = toTarget(params.mover, params.hp[params.mover.tokenId], params.start);

  for (const threatener of params.order) {
    if (threatener.tokenId === params.mover.tokenId) continue;
    if (params.hp[threatener.tokenId] <= 0 || cannotAct(threatener.statuses)) continue;
    if (threatener.faction === params.mover.faction) continue; // only enemies threaten

    const reach = threatener.reach ?? 1;
    const from = params.pos[threatener.tokenId];
    const threatenedStart = gridDistance(from, params.start, params.diagonalRule) <= reach;
    const threatenedEnd = gridDistance(from, params.end, params.diagonalRule) <= reach;
    if (!threatenedStart || threatenedEnd) continue; // only when the mover leaves reach

    const oaInput: TacticalTurnInput = {
      actor: toActor(threatener, from),
      targets: [],
      seed: `${params.seed}::oa::round${params.round}::${threatener.tokenId}`,
      cause: 'opportunity attack',
      isBlocked: params.isBlocked,
      diagonalRule: params.diagonalRule,
      systemId: params.systemId,
    };
    const rng = participantRng(
      params.seed,
      `oa::round${params.round}`,
      threatener.tokenId,
      params.mover.tokenId
    );
    const strike = resolveStrike(oaInput, moverTarget, rng);
    if (!strike.intent) continue;
    if (strike.intent.type === 'apply-damage') {
      for (const damage of strike.intent.damages) {
        if (params.hp[damage.tokenId] != null) {
          params.hp[damage.tokenId] = Math.max(0, params.hp[damage.tokenId] - damage.amount);
        }
      }
    }
    intents.push(strike.intent);
  }
  return intents;
}

/**
 * 5e: when damage lands on a concentrating combatant, roll its concentration
 * save; on a failure clear the working concentration and return a set-
 * concentration intent. Only applies for 5e; a held save returns undefined.
 */
function breakConcentration(params: {
  tokenId: string;
  damage: number;
  combatant: RoundCombatant | undefined;
  concentrating: Record<string, string | undefined>;
  seed: string;
  round: number;
  turnIndex: number;
  systemId?: string;
}): SceneActionIntent | undefined {
  const is5e = params.systemId === 'dnd-5e-2014' || params.systemId === 'dnd-5e-2024';
  if (!is5e) return undefined;
  const spell = params.concentrating[params.tokenId];
  if (!spell) return undefined;
  const broken = concentrationBreak({
    tokenId: params.tokenId,
    concentration: spell,
    conSaveBonus: params.combatant?.saveBonus?.('con') ?? 0,
    damage: params.damage,
    rng: participantRng(
      params.seed,
      `conc::round${params.round}::turn${params.turnIndex}`,
      params.tokenId
    ),
  });
  if (!broken) return undefined;
  params.concentrating[params.tokenId] = undefined; // it dropped; don't re-check
  return broken.intent;
}

/**
 * Roll a downed 5e character's death save for its turn: update the working tally
 * and produce the scene intents. A revive (nat 20) heals it to 1 HP and clears
 * the tally; a stabilize keeps it at 0 but no longer dying; three failures kill
 * it. Returns undefined once it's already settled (stable or dead).
 */
function rollTurnDeathSave(params: {
  combatant: RoundCombatant;
  deathSaves: Record<string, { successes: number; failures: number }>;
  hp: Record<string, number>;
  seed: string;
  round: number;
}): { intents: SceneActionIntent[]; rationale: string } | undefined {
  const id = params.combatant.tokenId;
  const tally = params.deathSaves[id] ?? { successes: 0, failures: 0 };
  if (tally.successes >= 3 || tally.failures >= 3) return undefined; // already settled

  const result = rollDeathSave({
    rng: participantRng(params.seed, `death::round${params.round}`, id),
    successes: tally.successes,
    failures: tally.failures,
  });
  const intents: SceneActionIntent[] = [];

  if (result.status === 'revived') {
    params.hp[id] = 1;
    delete params.deathSaves[id];
    intents.push({
      type: 'apply-damage',
      actorId: id,
      cause: 'death save',
      damages: [{ tokenId: id, amount: -1 }],
    });
    intents.push({ type: 'set-death-saves', tokenId: id });
    return { intents, rationale: `Rolls a natural 20 on its death save — back up with 1 HP!` };
  }

  params.deathSaves[id] = { successes: result.successes, failures: result.failures };
  intents.push({
    type: 'set-death-saves',
    tokenId: id,
    deathSaves: { successes: result.successes, failures: result.failures },
  });
  const rationale =
    result.status === 'dead'
      ? `Fails its third death save and dies.`
      : result.status === 'stable'
        ? `Stabilizes (three death-save successes).`
        : `Death save: ${result.successes} success(es), ${result.failures} failure(s).`;
  return { intents, rationale };
}

/**
 * Drop an airborne combatant to the ground: zero its working elevation, emit the
 * descent move, and — only if it was conscious as it fell — roll system falling
 * damage and fold it in. A creature already at 0 HP simply plummets (no extra
 * damage). Returns the intents (empty when it was not actually airborne).
 */
function fallToGround(params: {
  tokenId: string;
  pos: Record<string, SceneCoordinate>;
  hp: Record<string, number>;
  conscious: boolean;
  seed: string;
  round: number;
  turnIndex: number;
  systemId?: string;
}): SceneActionIntent[] {
  const { tokenId, pos, hp } = params;
  const height = pos[tokenId]?.z ?? 0;
  if (height <= 0) return [];

  // Land on the same cell at ground level (z dropped).
  const grounded: SceneCoordinate = { x: pos[tokenId].x, y: pos[tokenId].y };
  pos[tokenId] = grounded;
  const intents: SceneActionIntent[] = [{ type: 'move-token', tokenId, position: grounded }];

  if (params.conscious) {
    const fall = resolveFall({
      systemId: params.systemId,
      heightCells: height,
      rng: participantRng(
        params.seed,
        `fall::round${params.round}::turn${params.turnIndex}`,
        tokenId
      ),
    });
    if (fall.damage > 0) {
      if (hp[tokenId] != null) hp[tokenId] = Math.max(0, hp[tokenId] - fall.damage);
      intents.push({
        type: 'apply-damage',
        actorId: tokenId,
        cause: 'fall',
        damages: [{ tokenId, amount: fall.damage }],
      });
    }
  }
  return intents;
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
  const concentrating: Record<string, string | undefined> = {};
  const deathSaves: Record<string, { successes: number; failures: number }> = {};
  for (const combatant of input.order) {
    hp[combatant.tokenId] = combatant.hp.current;
    pos[combatant.tokenId] = { ...combatant.position };
    if (combatant.conditions) conditions[combatant.tokenId] = { ...combatant.conditions };
    if (combatant.concentration) concentrating[combatant.tokenId] = combatant.concentration;
    if (combatant.deathSaves) deathSaves[combatant.tokenId] = { ...combatant.deathSaves };
  }

  const byId = new Map(input.order.map((combatant) => [combatant.tokenId, combatant]));
  const turns: RoundTurnRecord[] = [];
  const intents: SceneActionIntent[] = [];

  input.order.forEach((combatant, turnIndex) => {
    // Gravity, before anything else: a combatant that is airborne but cannot
    // sustain flight — it has no fly speed, or it is already down — drops to the
    // ground at the start of its turn, taking falling damage if it was conscious.
    const airborne = (pos[combatant.tokenId]?.z ?? 0) > 0;
    const conscious = hp[combatant.tokenId] > 0;
    const fallIntents =
      airborne && ((combatant.flySpeed ?? 0) <= 0 || !conscious)
        ? fallToGround({
            tokenId: combatant.tokenId,
            pos,
            hp,
            conscious,
            seed: input.seed,
            round: input.round,
            turnIndex,
            systemId: input.systemId,
          })
        : [];
    fallIntents.forEach((intent) => intents.push(intent));
    const falls = fallIntents.length > 0 ? fallIntents : undefined;

    // Skip combatants that can't act: already down, or held by an incapacitating
    // condition (stunned / paralyzed / unconscious / …).
    const down = hp[combatant.tokenId] <= 0;
    const held = cannotAct(combatant.statuses);
    if (down || held) {
      // A downed 5e character makes a death save instead of acting.
      let deathRationale: string | undefined;
      if (down && !held && combatant.makesDeathSaves) {
        const ds = rollTurnDeathSave({
          combatant,
          deathSaves,
          hp,
          seed: input.seed,
          round: input.round,
        });
        if (ds) {
          deathRationale = ds.rationale;
          ds.intents.forEach((intent) => intents.push(intent));
        }
      }
      turns.push({
        tokenId: combatant.tokenId,
        skipped: true,
        fallIntents: falls,
        turn: {
          actorId: combatant.tokenId,
          decision: 'no-target',
          scored: [],
          rationale:
            deathRationale ??
            (down
              ? 'Down at the start of its turn; skipped.'
              : 'Incapacitated by a condition; skipped.'),
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
      enterCost: input.enterCost,
      chooseTarget: input.chooseTarget,
    });

    // Apply movement first: any enemy whose reach the combatant leaves gets an
    // opportunity attack (resolved from the start cell, folded into working HP),
    // then update the working position and emit a move event so later turns (and
    // the scene) see the combatant in its new cell.
    let oaIntents: SceneActionIntent[] | undefined;
    if (turn.moveTo) {
      const oas = resolveOpportunityAttacks({
        mover: combatant,
        start: pos[combatant.tokenId],
        end: turn.moveTo,
        order: input.order,
        hp,
        pos,
        seed: input.seed,
        round: input.round,
        systemId: input.systemId,
        isBlocked: input.isBlocked,
        diagonalRule: input.diagonalRule,
      });
      if (oas.length > 0) {
        oaIntents = oas;
        oas.forEach((intent) => intents.push(intent));
      }
      pos[combatant.tokenId] = { ...turn.moveTo };
      intents.push({ type: 'move-token', tokenId: combatant.tokenId, position: turn.moveTo });
    }

    // Fold this turn's outcome into working state so later turns see it.
    if (turn.intent && turn.intent.type === 'apply-damage') {
      for (const damage of turn.intent.damages) {
        const before = hp[damage.tokenId];
        if (before != null && byId.get(damage.tokenId)?.hp) {
          hp[damage.tokenId] = Math.max(0, before - damage.amount);
        }
        // Shot out of the sky: a combatant knocked to 0 HP while airborne loses
        // flight and plummets to the ground (it is already out, so no extra
        // damage). Its descent lands after the attack that downed it.
        if (before != null && before > 0 && hp[damage.tokenId] <= 0) {
          fallToGround({
            tokenId: damage.tokenId,
            pos,
            hp,
            conscious: false,
            seed: input.seed,
            round: input.round,
            turnIndex,
            systemId: input.systemId,
          }).forEach((intent) => intents.push(intent));
        }
        // 5e: damage to a concentrating combatant may break its spell.
        const broken = breakConcentration({
          tokenId: damage.tokenId,
          damage: damage.amount,
          combatant: byId.get(damage.tokenId),
          concentrating,
          seed: input.seed,
          round: input.round,
          turnIndex,
          systemId: input.systemId,
        });
        if (broken) intents.push(broken);
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
      oaIntents,
      fallIntents: falls,
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
