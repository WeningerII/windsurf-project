/**
 * Social resolution: one action, N NPCs, each reacting independently.
 *
 * See `docs/rfc/003-rules-ir-and-effects.md` (Accepted), "Participant-aware
 * resolution" — a conversation is an N-participant loop too.
 *
 * A single social action (a speech, a threat, a lie) is addressed to one or more
 * NPCs, and each judges it on its own: a friendly innkeeper is easily swayed
 * where a hostile guard is not. So the speaker rolls one system-agnostic check
 * PER target (its own seeded sub-stream), and the degree of success shifts that
 * NPC's attitude along the classic track. Re-ordering the NPCs never changes any
 * individual reaction — the same order-independence the AoE save path has.
 *
 * Deterministic and pure: all rolls come from the injected/derived seeded RNG.
 */

import { createSeededRng } from '../../scene/seededRng';
import {
  resolveCheck,
  type CheckOutcome,
  type CheckResult,
  type CheckRollMode,
} from './checkResolution';

/** The classic NPC attitude track, ordered worst → best. */
export const ATTITUDES = ['hostile', 'unfriendly', 'indifferent', 'friendly', 'helpful'] as const;
export type Attitude = (typeof ATTITUDES)[number];

/** How an NPC's current attitude bends the difficulty of swaying it (RAW-ish). */
const ATTITUDE_DC_MOD: Record<Attitude, number> = {
  hostile: 10,
  unfriendly: 5,
  indifferent: 0,
  friendly: -5,
  helpful: -10,
};

/** How each degree of success moves an NPC along the attitude track. */
const OUTCOME_STEPS: Record<CheckOutcome, number> = {
  'critical-success': 2,
  success: 1,
  failure: 0,
  'critical-failure': -1,
};

export type SocialApproach = 'persuasion' | 'deception' | 'intimidation';

/** Move an attitude by `steps` along the track, clamped to the ends. */
export function shiftAttitude(attitude: Attitude, steps: number): Attitude {
  const index = ATTITUDES.indexOf(attitude);
  const next = Math.max(0, Math.min(ATTITUDES.length - 1, index + steps));
  return ATTITUDES[next];
}

/** The effective DC to sway an NPC of a given attitude, from a base difficulty. */
export function attitudeSwayDC(baseDC: number, attitude: Attitude): number {
  return baseDC + ATTITUDE_DC_MOD[attitude];
}

/** An NPC in the conversation: identity + current disposition. */
export interface SocialNpc {
  id: string;
  attitude: Attitude;
}

export interface SocialActionInput {
  systemId: string;
  speakerId: string;
  /** The speaker's social skill modifier (Persuasion/Deception/Intimidation). */
  modifier: number;
  /** Base difficulty before each NPC's attitude adjusts it. */
  baseDC: number;
  /** The NPCs addressed (the N participants in the conversation). */
  targets: readonly SocialNpc[];
  seed: string;
  approach?: SocialApproach;
  rollMode?: CheckRollMode;
}

export interface SocialNpcOutcome {
  npcId: string;
  result: CheckResult;
  /** The attitude-adjusted DC this NPC was actually rolled against. */
  effectiveDC: number;
  before: Attitude;
  after: Attitude;
  /** Steps moved along the track (negative = backfired). */
  steps: number;
}

export interface SocialActionResult {
  speakerId: string;
  approach?: SocialApproach;
  /** One outcome per addressed NPC, in input order. */
  outcomes: SocialNpcOutcome[];
}

/**
 * Resolve a social action against every addressed NPC. Each NPC rolls the
 * speaker's check against its own attitude-adjusted DC from an independent seeded
 * sub-stream, and its attitude shifts by the degree of success — so one speech
 * can win over the friendly merchant while bouncing off the hostile guard, all in
 * a single deterministic, order-independent step.
 */
export function resolveSocialAction(input: SocialActionInput): SocialActionResult {
  const outcomes = input.targets.map((npc): SocialNpcOutcome => {
    const effectiveDC = attitudeSwayDC(input.baseDC, npc.attitude);
    const rng = createSeededRng(
      `${input.seed}::social::${input.approach ?? 'talk'}::${input.speakerId}->${npc.id}`
    );
    const result = resolveCheck({
      systemId: input.systemId,
      modifier: input.modifier,
      dc: effectiveDC,
      rng,
      rollMode: input.rollMode,
    });
    const steps = OUTCOME_STEPS[result.outcome];
    return {
      npcId: npc.id,
      result,
      effectiveDC,
      before: npc.attitude,
      after: shiftAttitude(npc.attitude, steps),
      steps,
    };
  });
  return { speakerId: input.speakerId, approach: input.approach, outcomes };
}
