/**
 * Scene exploration bridge — a group skill challenge with scene stakes.
 *
 * See `docs/rfc/003-rules-ir-and-effects.md` (Accepted), "Participant-aware
 * resolution".
 *
 * The party (the N participants) attempts a skill challenge; on failure a trap
 * can spring, damaging the whole party through the same event-sourced
 * apply-damage path as combat — so an exploration check actually changes the
 * scene, not just the log. Pure and deterministic: the trap damage is rolled
 * from a seeded sub-stream.
 */

import { createSeededRng } from '../../scene/seededRng';
import type { SceneActionIntent, SceneState } from '../../types/core/scene';
import {
  resolveSkillChallenge,
  type ChallengeParticipant,
  type SkillChallengeResult,
} from '../resolver/checkResolution';

/** Trap damage dice (e.g. 3d6+2) the party suffers when a challenge fails. */
export interface TrapDamage {
  count: number;
  faces: number;
  modifier: number;
}

export interface SceneChallengeOutcome {
  result: SkillChallengeResult;
  /** apply-damage intent when a trap springs on failure, else undefined. */
  intent?: SceneActionIntent;
  /** Header + per-attempt lines (+ a trap line) for the panel log. */
  log: string[];
}

/**
 * Resolve a party skill challenge on a scene. On failure, an optional trap deals
 * its rolled damage to every party (character) token with hit points, returned as
 * a single apply-damage intent for the caller to apply as a scene event.
 */
export function resolveSceneChallenge(params: {
  state: SceneState;
  participants: readonly ChallengeParticipant[];
  dc: number;
  successesNeeded: number;
  failuresAllowed: number;
  skill?: string;
  trap?: TrapDamage;
  seed: string;
}): SceneChallengeOutcome {
  const { state } = params;
  const result = resolveSkillChallenge({
    systemId: state.systemId,
    dc: params.dc,
    successesNeeded: params.successesNeeded,
    failuresAllowed: params.failuresAllowed,
    participants: params.participants,
    seed: params.seed,
    skill: params.skill,
  });

  const nameOf = (id: string): string => state.tokens[id]?.name ?? id;
  const header = `Challenge ${result.outcome.toUpperCase()} — ${result.successes} success / ${result.failures} failure.`;
  const log = [
    header,
    ...result.attempts.map(
      (attempt) =>
        `  ${nameOf(attempt.participantId)}: ${attempt.result.outcome} (rolled ${attempt.result.total}).`
    ),
  ];

  let intent: SceneActionIntent | undefined;
  if (result.outcome === 'failure' && params.trap) {
    const rng = createSeededRng(`${params.seed}::trap`);
    let damage = params.trap.modifier;
    for (let i = 0; i < params.trap.count; i += 1) damage += rng.rollDie(params.trap.faces);
    damage = Math.max(0, damage);
    const damages = Object.values(state.tokens)
      .filter((token) => token.kind === 'character' && token.hp)
      .map((token) => ({ tokenId: token.id, amount: damage }));
    if (damages.length > 0) {
      intent = { type: 'apply-damage', cause: 'trap', damages };
      log.push(`  The trap springs! Each party member takes ${damage}.`);
    }
  }

  return { result, intent, log };
}
