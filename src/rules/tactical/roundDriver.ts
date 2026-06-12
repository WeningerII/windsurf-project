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
import type { SceneCoordinate, SceneActionIntent } from '../../types/core/scene';
import { executeTacticalTurn, type TacticalTurnResult } from './tacticalExecutor';
import type { TacticalActor, TacticalTarget } from './targetScoring';

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
  /** Attacks per turn (SRD Multiattack). Default 1. */
  attacksPerRound?: number;
  /** Movement per turn in grid cells. Default 6. */
  speedCells?: number;
}

export interface RoundTurnRecord {
  tokenId: string;
  turn: TacticalTurnResult;
  /** The damage intent this turn produced, if any (for scene application). */
  intent?: SceneActionIntent;
  /** Whether the turn was skipped because the actor was already down. */
  skipped: boolean;
}

export interface RoundResult {
  round: number;
  turns: RoundTurnRecord[];
  /** Final current-HP per combatant after the round. */
  finalHp: Record<string, number>;
  /** All damage intents produced this round, in turn order. */
  intents: SceneActionIntent[];
}

export interface RunRoundInput {
  /** Combatants in initiative order (highest first). */
  order: readonly RoundCombatant[];
  /** Base seed (e.g. the scene seed). Combined with round + turn for each roll. */
  seed: string;
  /** Round number (1-based); part of the per-turn seed and the result. */
  round: number;
  /** Hit/crit model for the whole round (default 'd20'). */
  degreeModel?: 'd20' | 'pf2e';
}

function toActor(combatant: RoundCombatant): TacticalActor {
  return {
    tokenId: combatant.tokenId,
    faction: combatant.faction,
    position: combatant.position,
    attackEffects: combatant.attackEffects,
    damageEffects: combatant.damageEffects,
    reach: combatant.reach,
    critOn: combatant.critOn,
    attacksPerRound: combatant.attacksPerRound,
    speedCells: combatant.speedCells,
  };
}

function toTarget(combatant: RoundCombatant, currentHp: number): TacticalTarget {
  return {
    tokenId: combatant.tokenId,
    faction: combatant.faction,
    position: combatant.position,
    armorClass: combatant.armorClass,
    hp: { current: currentHp, max: combatant.hp.max },
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
  // Working HP and positions start from each combatant's current values
  // (local copies — inputs are never mutated, per this driver's contract).
  const hp: Record<string, number> = {};
  const positions: Record<string, SceneCoordinate> = {};
  for (const combatant of input.order) {
    hp[combatant.tokenId] = combatant.hp.current;
    positions[combatant.tokenId] = { ...combatant.position };
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
          attacks: [],
          rationale: 'Down at the start of its turn; skipped.',
        },
      });
      return;
    }

    // The participant set: every OTHER living combatant, with up-to-date HP.
    const targets: TacticalTarget[] = input.order
      .filter((other) => other.tokenId !== combatant.tokenId && hp[other.tokenId] > 0)
      .map((other) => ({
        ...toTarget(other, hp[other.tokenId]),
        position: { ...positions[other.tokenId] },
      }));

    const turn = executeTacticalTurn({
      actor: { ...toActor(combatant), position: { ...positions[combatant.tokenId] } },
      targets,
      seed: `${input.seed}::round${input.round}::turn${turnIndex}`,
      degreeModel: input.degreeModel,
    });

    // Movement executed this turn: update the working position so later
    // turns score against where the combatant actually is, and surface the
    // move intent for scene application (before the damage it enabled).
    if (turn.move) {
      positions[combatant.tokenId] = { ...turn.move.to };
      intents.push(turn.move.intent);
    }

    // Fold this turn's damage into working HP so later turns see it. Under
    // Multiattack a turn carries several attack intents, in order.
    for (const attack of turn.attacks) {
      if (attack.intent?.type !== 'apply-damage') continue;
      for (const damage of attack.intent.damages) {
        if (hp[damage.tokenId] != null && byId.get(damage.tokenId)?.hp) {
          hp[damage.tokenId] = Math.max(0, hp[damage.tokenId] - damage.amount);
        }
      }
      intents.push(attack.intent);
    }

    turns.push({ tokenId: combatant.tokenId, turn, intent: turn.intent, skipped: false });
  });

  return { round: input.round, turns, finalHp: hp, intents };
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
