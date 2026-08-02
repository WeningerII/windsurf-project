/**
 * RFC 007 AI-DM runtime — the DETERMINISTIC half, with no gateway in it.
 *
 * This module owns the two things that must not be model-decided: what an
 * AI-DM is allowed to ask for this turn (the option pool), and what a chosen
 * option is allowed to become (the `SceneActionIntent`). Both are pure
 * functions over the folded scene, so they are unit-testable without a network
 * and without a provider — `src/ai/dmTurnFlow.ts` is the only part that talks
 * to the gateway.
 *
 * Three properties are load-bearing, and none of them is the model's to hold:
 *
 * 1. **The model never names an intent type.** It returns an OPTION ID from a
 *    pool this module built. `dmProposalToIntent` maps an option's verb to the
 *    single intent shape that verb is permitted to produce. An id outside the
 *    pool has no mapping and is dropped by the flow before an intent exists —
 *    the same shape of gate `encounterDraftFlow` applies to monster ids.
 * 2. **The option's parameters win over the response's.** A `check`'s label,
 *    modifier and DC are read off the OPTION the caller built from system data,
 *    never off the proposal, so the model cannot alter a roll it merely chose to
 *    make. This is `analyzeMapFlow`'s client-stamped image size, applied to
 *    rules numbers: the proposal supplies the choice, not the arithmetic.
 * 3. **Nothing resolves here.** No die is rolled, no damage is computed, no
 *    state is written. Every intent this module returns still has to survive
 *    `resolveSceneAction`, which is where RFC 006 rolls the check from the event
 *    id and stores the resolved value — so replay stays byte-identical and never
 *    re-calls the model.
 *
 * It is peer-system by construction: there is no `systemId` in this file. The
 * option pool's system-specific content (which checks exist, how far the actor
 * moves) arrives as caller-supplied data, and the mapping below is written once
 * for all seven systems.
 */
import { DM_TURN_VERBS, type DmTurnActionOption, type DmTurnCheckParams } from './contracts';
import type { DmTurnProposal, DmTurnTokenRef, DmTurnVerb } from './contracts';
import { tokenAllegiance } from '../scene/allegiance';
import type { SceneActionIntent, SceneToken } from '../types/core/scene';

/**
 * `actorId` stamped on every event the AI-DM causes, so the log says who asked.
 * The AI-DM is producer #3 in RFC 006's "three producers, one path" model; this
 * is the only thing that distinguishes its events from a player's, and it is
 * attribution, never authority — the fold treats them identically.
 */
export const DM_ACTOR_ID = 'ai-dm';

/**
 * Explicit, inspectable autonomy limits (RFC 007 "DM policy and guardrails").
 * Every field narrows what one invocation may do; none of them can widen what
 * `resolveSceneAction` permits.
 */
export interface DmPolicy {
  /** Which verbs are live. A verb absent here is never offered to the model. */
  enabledVerbs: readonly DmTurnVerb[];
  /** Hard cap on proposals APPLIED from one turn; the surplus is reported. */
  maxProposalsPerTurn: number;
  /**
   * Verbs whose proposals are held for human confirmation instead of applied.
   * Empty by default: every verb in the shipped vocabulary is already gated by
   * the deterministic resolver, which is exactly the RFC's stated reason combat
   * turns may auto-apply. A verb that spends a resource or spawns a token would
   * belong here — none exists yet, and an entry for one that does not is a door
   * nobody is watching.
   */
  confirmVerbs: readonly DmTurnVerb[];
  /** RFC 002's bounded repair: how many corrective re-asks, never unbounded. */
  repairBudget: number;
}

export const DEFAULT_DM_POLICY: DmPolicy = {
  enabledVerbs: DM_TURN_VERBS,
  // A move plus an action — one creature's turn in every system this ships for.
  maxProposalsPerTurn: 2,
  confirmVerbs: [],
  repairBudget: 1,
};

/**
 * The system-derived facts a caller supplies for one actor's turn. Both fields
 * are the CALLER's arithmetic (speed in cells, the checks this creature can
 * make), computed from the system engine before the model is involved.
 */
export interface DmTurnOptionContext {
  /** Chebyshev cells the actor may cover. 0 or less offers no move at all. */
  moveDistance: number;
  /** Checks this actor could make; each becomes one option, in order. */
  checks?: readonly DmTurnCheckParams[];
}

/** Chebyshev (king-move) distance, the metric the square grid already uses. */
export function chebyshevDistance(
  a: { x: number; y: number },
  b: { x: number; y: number }
): number {
  return Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y));
}

/** A folded scene token as the model is allowed to see it. */
export function toDmTurnTokenRef(token: SceneToken): DmTurnTokenRef {
  return {
    id: token.id,
    name: token.name,
    allegiance: tokenAllegiance(token),
    position: { x: token.position.x, y: token.position.y },
  };
}

/**
 * Build the closed option pool for one turn. Every option carries the
 * deterministic parameters the intent will be built from, so the pool IS the
 * contract: an action not in here cannot be proposed, and a parameter not in
 * here cannot be supplied later.
 */
export function buildDmTurnOptions(
  context: DmTurnOptionContext,
  policy: DmPolicy = DEFAULT_DM_POLICY
): DmTurnActionOption[] {
  const options: DmTurnActionOption[] = [];
  const enabled = (verb: DmTurnVerb): boolean => policy.enabledVerbs.includes(verb);

  const distance = Math.trunc(context.moveDistance);
  if (enabled('move') && distance >= 1) {
    options.push({
      id: 'move',
      verb: 'move',
      label: `Move up to ${distance} square${distance === 1 ? '' : 's'}`,
      maxDistance: distance,
    });
  }
  if (enabled('check')) {
    (context.checks ?? []).forEach((check, index) => {
      options.push({
        id: `check-${index}`,
        verb: 'check',
        label:
          check.dc !== undefined
            ? `Attempt ${check.label} (DC ${check.dc})`
            : `Attempt ${check.label}`,
        check: {
          label: check.label,
          modifier: check.modifier,
          ...(check.dc !== undefined ? { dc: check.dc } : {}),
        },
      });
    });
  }
  if (enabled('hold')) {
    options.push({ id: 'hold', verb: 'hold', label: 'Do nothing and end the turn' });
  }
  return options;
}

export type DmProposalMapping =
  | { ok: true; intent: SceneActionIntent }
  | { ok: false; reason: string };

/**
 * Map one chosen option to the one intent it is allowed to become.
 *
 * The gates here are the ones the scene runtime does NOT already apply. It
 * checks grid bounds and footprint overlap for a move, so this checks REACH —
 * without it the AI-DM could cross the map in a step, a privilege RFC 007
 * forbids it over the player and the autonomous round. Everything the runtime
 * does check is deliberately left to the runtime; re-deciding it here would
 * create a second, quieter opinion about legality.
 */
export function dmProposalToIntent(
  option: DmTurnActionOption,
  proposal: DmTurnProposal,
  actor: Pick<SceneToken, 'id' | 'name' | 'position'>
): DmProposalMapping {
  switch (option.verb) {
    case 'move': {
      const destination = proposal.destination;
      if (!destination) {
        return { ok: false, reason: `'${option.id}' is a move and needs a destination.` };
      }
      if (!Number.isInteger(destination.x) || !Number.isInteger(destination.y)) {
        return {
          ok: false,
          reason: `'${option.id}' needs whole-number grid coordinates for its destination.`,
        };
      }
      const reach = option.maxDistance ?? 0;
      const distance = chebyshevDistance(actor.position, destination);
      if (distance === 0) {
        return {
          ok: false,
          reason: `'${option.id}' proposed moving ${actor.name} to the square it already occupies.`,
        };
      }
      if (distance > reach) {
        return {
          ok: false,
          reason: `'${option.id}' proposed moving ${distance} squares, but only ${reach} are available.`,
        };
      }
      return {
        ok: true,
        intent: {
          type: 'move-token',
          actorId: DM_ACTOR_ID,
          // Stamped from the folded scene, never from the proposal: the AI-DM
          // runs the turn of the actor it was GIVEN, and cannot move a token it
          // was not asked about.
          tokenId: actor.id,
          position: { x: destination.x, y: destination.y },
        },
      };
    }
    case 'check': {
      const check = option.check;
      if (!check) {
        return { ok: false, reason: `'${option.id}' is a check but carries no check parameters.` };
      }
      return {
        ok: true,
        intent: {
          type: 'roll-check',
          actorId: DM_ACTOR_ID,
          actorTokenId: actor.id,
          // All three come off the OPTION. The proposal contributed the choice
          // to roll, and nothing else about it.
          label: check.label,
          modifier: check.modifier,
          ...(check.dc !== undefined ? { dc: check.dc } : {}),
        },
      };
    }
    case 'hold':
      return { ok: true, intent: { type: 'advance-turn', actorId: DM_ACTOR_ID } };
    default:
      return assertNever(option.verb);
  }
}

/** Exhaustiveness guard: a new verb without a mapping fails to typecheck. */
function assertNever(verb: never): never {
  throw new Error(`Unhandled AI-DM verb '${String(verb)}'.`);
}
