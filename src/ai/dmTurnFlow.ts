/**
 * RFC 007 AI-DM runtime — the client orchestration for ONE actor's turn.
 *
 * This is RFC 002's proposal contract in loop form: the model proposes, the
 * deterministic validators decide. The flow is the third producer in RFC 006's
 * "three producers, one path" model, and it gains no privileges over the other
 * two:
 *
 *     gateway proposal -> parseTaskData        (envelope, in gatewayCore)
 *                      -> option-pool membership (here; an invented id dies)
 *                      -> batch shape           (here; one option once, and
 *                                                nothing acts past a passed turn)
 *                      -> dmProposalToIntent    (typed SceneActionIntent)
 *                      -> applySceneIntents     -> resolveSceneAction  // veto
 *                                               -> appendSceneEvent    // on pass
 *
 * The batch step exists because every other gate on that path judges ONE thing
 * at a time: `dmProposalToIntent` sees a single proposal against the pre-batch
 * fold, and `resolveSceneAction` sees a single intent and never asks whose turn
 * it is. A proposal list whose every entry is individually legal can still be an
 * illegal turn — the same check rolled twice, one move's reach spent twice, or
 * an action sequenced after the turn was passed — and this is where that dies.
 *
 * What this module deliberately does NOT do:
 *
 * - **It never builds an event.** It hands intents to `applySceneIntents` and
 *   returns whatever came back, the same way `useSceneMap` applies an accepted
 *   map analysis. Nothing here can put a value in the log that the runtime did
 *   not resolve.
 * - **It never resolves anything.** The d20 for a proposed check is rolled
 *   inside `resolveSceneAction`, seeded from the event id, and stored on the
 *   event — so an AI-DM scene folds to byte-identical state on replay and never
 *   calls the model again (RFC 006's determinism contract, RFC 007's
 *   "determinism and replay are preserved").
 * - **It never widens the runtime's rules.** A proposal the resolver rejects is
 *   reported in `rejected`, not retried into existence. The graceful degradation
 *   of a vetoed turn is the deterministic autonomous round, which the caller
 *   already has.
 *
 * The whole surface is default-off behind `VITE_AI_ENABLED` at the gateway
 * client, and keyless CI drives it through the mock adapter and fixtures.
 */
import { callAiGateway } from './gatewayClient';
import type {
  DmTurnActionOption,
  DmTurnCheckParams,
  DmTurnIntentData,
  TaskGatewayCall,
} from './contracts';
import {
  DEFAULT_DM_POLICY,
  buildDmTurnOptions,
  dmProposalToIntent,
  toDmTurnTokenRef,
  type DmPolicy,
} from './dmTurn';
import { applySceneIntents, foldSceneEvents } from '../scene/runtime';
import { summarizeSceneForLog } from '../scene/sceneRecap';
import { generateUUID } from '../utils/browserCompat';
import type { SceneActionIntent, SceneDocument, SceneEvent } from '../types/core/scene';

export interface DmTurnParams {
  /** The token whose turn the AI-DM is running. */
  actorTokenId: string;
  /** Chebyshev cells this actor may cover — the CALLER's system arithmetic. */
  moveDistance: number;
  /** Checks this actor could make, in the caller's preferred order. */
  checks?: readonly DmTurnCheckParams[];
  /** Autonomy limits for this invocation. Defaults to {@link DEFAULT_DM_POLICY}. */
  policy?: DmPolicy;
}

/** A proposal held back for human confirmation: typed, validated, unapplied. */
export interface DmTurnPendingProposal {
  option: DmTurnActionOption;
  intent: SceneActionIntent;
  /** The model's one-line justification, presentation-only. */
  reason?: string;
}

export type DmTurnResult =
  | {
      ok: true;
      /**
       * Events the runtime resolved and accepted, in order. The caller appends
       * them exactly as it appends a manual action's event — this flow does not
       * own the scene document.
       */
      events: SceneEvent[];
      /** Proposals awaiting human confirm under `policy.confirmVerbs`. */
      pending: DmTurnPendingProposal[];
      /** Every proposal the flow or the runtime refused, with its reason. */
      rejected: string[];
      /** The model's account of the turn, presentation-only. */
      rationale?: string;
    }
  | { ok: false; error: string };

/** Injectable gateway call so the flow is unit-testable without a network. */
export type DmTurnGatewayCall = TaskGatewayCall<'dm-turn-intent'>;

export interface DmTurnOptions {
  call?: DmTurnGatewayCall;
  /** Injected so a test can pin event ids — and therefore every seeded roll. */
  eventIdFactory?: () => string;
  now?: () => Date;
}

export async function runDmTurn(
  scene: SceneDocument,
  params: DmTurnParams,
  options: DmTurnOptions = {}
): Promise<DmTurnResult> {
  const policy = params.policy ?? DEFAULT_DM_POLICY;

  // 1. Fold for authoritative current state (RFC 007 loop step 1). A scene that
  //    does not fold cleanly is not one the AI-DM may act on: `appendSceneEvent`
  //    would refuse the result anyway, and asking the model first would spend a
  //    provider call to learn that.
  const { state, issues } = foldSceneEvents(scene);
  if (issues.some((issue) => issue.severity === 'error')) {
    return { ok: false, error: 'This scene has invalid events; the AI-DM cannot act on it.' };
  }

  const actor = state.tokens[params.actorTokenId];
  if (!actor) {
    return { ok: false, error: `Token '${params.actorTokenId}' is not in this scene.` };
  }
  // Turn order is the runtime's, not the AI-DM's. `resolveSceneAction` does not
  // gate WHO acts (a player may move any token), so an AI-DM that ran the wrong
  // creature's turn would sail through — this is the gate that stops it.
  if (state.activeTokenId !== undefined && state.activeTokenId !== actor.id) {
    return { ok: false, error: `It is not ${actor.name}'s turn.` };
  }

  // 2-3. Deterministic candidate/verb pool for this beat.
  const pool = buildDmTurnOptions(
    { moveDistance: params.moveDistance, ...(params.checks ? { checks: params.checks } : {}) },
    policy
  );
  if (pool.length === 0) {
    return { ok: false, error: 'No AI-DM actions are available for this turn.' };
  }
  const optionById = new Map(pool.map((option) => [option.id, option]));

  const payloadBase = {
    systemId: scene.systemId,
    // The SAME deterministic recap the shipped narration task is grounded in.
    // The model sees resolved facts, never the raw log or the rules.
    facts: summarizeSceneForLog(state),
    round: state.round,
    actor: toDmTurnTokenRef(actor),
    tokens: Object.values(state.tokens)
      .filter((token) => token.id !== actor.id)
      .map(toDmTurnTokenRef),
    options: pool,
  };

  // 4-6. Ask, parse-don't-cast, map, with RFC 002's BOUNDED repair. A rejected
  //      proposal is dropped, never coerced into something legal.
  let accepted: DmTurnPendingProposal[] = [];
  let rejected: string[] = [];
  let rationale: string | undefined;
  let repairIssues: string[] | undefined;

  const call = options.call ?? (callAiGateway as DmTurnGatewayCall);
  for (let attempt = 0; attempt <= Math.max(0, policy.repairBudget); attempt += 1) {
    const response = await call<DmTurnIntentData>('dm-turn-intent', {
      ...payloadBase,
      ...(repairIssues ? { repairIssues } : {}),
    });
    if (!response.ok) return { ok: false, error: response.message };

    const attemptAccepted: DmTurnPendingProposal[] = [];
    const attemptRejected: string[] = [];
    // The option pool is a SET, but a response's proposal list is a multiset,
    // and the two batch-level rules below are the only thing that reconciles
    // them. Neither is re-checkable downstream: `dmProposalToIntent` sees one
    // proposal at a time (so it re-reads the PRE-BATCH actor position for every
    // move), and `resolveSceneAction` gates each intent independently and never
    // gates who may act. Without these, a well-formed response whose every
    // individual proposal passes still buys privileges the AI-DM does not have
    // — a second roll of the same check, or the next creature's whole turn.
    const chosen = new Set<string>();
    let turnPassed = false;
    for (const proposal of response.data.proposals) {
      const option = optionById.get(proposal.optionId);
      if (!option) {
        attemptRejected.push(
          `'${proposal.optionId}' is not one of the offered actions; choose from the list.`
        );
        continue;
      }
      // One option, once. A repeat is not a second action — it is the same
      // action taken twice, which is how a rejected check becomes a reroll and
      // how one move's reach becomes two (each is measured from where the actor
      // stood BEFORE the batch, so N repeats travel up to N times as far).
      if (chosen.has(option.id)) {
        attemptRejected.push(
          `'${option.id}' was already taken this turn; each offered action may be chosen at most once.`
        );
        continue;
      }
      // Nothing acts after the turn is passed. The turn-order gate above runs
      // ONCE, before the batch; an intent sequenced after a turn-ending one
      // would land on a creature that is no longer up, and the runtime would
      // not object.
      if (turnPassed) {
        attemptRejected.push(
          `'${option.id}' comes after the turn was passed; nothing may act once the turn ends.`
        );
        continue;
      }
      const mapped = dmProposalToIntent(option, proposal, actor);
      if (!mapped.ok) {
        attemptRejected.push(mapped.reason);
        continue;
      }
      chosen.add(option.id);
      // Derived from the mapped INTENT, not the verb, so a future verb that also
      // ends the turn is covered without remembering to list it here.
      if (mapped.intent.type === 'advance-turn') turnPassed = true;
      attemptAccepted.push({
        option,
        intent: mapped.intent,
        ...(proposal.reason ? { reason: proposal.reason } : {}),
      });
    }

    accepted = attemptAccepted;
    rejected = attemptRejected;
    rationale = response.data.rationale;
    if (attemptRejected.length === 0) break;
    repairIssues = attemptRejected;
  }

  // The per-invocation autonomy cap. The surplus is REPORTED rather than
  // silently dropped, so a policy that is too tight is visible as such.
  const cap = Math.max(0, policy.maxProposalsPerTurn);
  for (const surplus of accepted.slice(cap)) {
    rejected.push(
      `'${surplus.option.id}' was dropped: the AI-DM may apply at most ${cap} action(s) per turn.`
    );
  }
  const bounded = accepted.slice(0, cap);

  const pending: DmTurnPendingProposal[] = [];
  const intents: SceneActionIntent[] = [];
  for (const entry of bounded) {
    if (policy.confirmVerbs.includes(entry.option.verb)) pending.push(entry);
    else intents.push(entry.intent);
  }

  // 7. The one and only write path — and the veto point. Everything above this
  //    line is a proposal; nothing above it has touched the scene.
  const applied = applySceneIntents(scene, intents, {
    eventIdFactory: options.eventIdFactory ?? generateUUID,
    ...(options.now ? { now: options.now } : {}),
  });
  rejected.push(...applied.rejected);

  return {
    ok: true,
    events: applied.events,
    pending,
    rejected,
    ...(rationale ? { rationale } : {}),
  };
}
