/**
 * System-agnostic check resolution + N-participant skill challenges.
 *
 * See `docs/rfc/003-rules-ir-and-effects.md` (Accepted), "Participant-aware
 * resolution" — applied beyond combat.
 *
 * The non-combat half of the tabletop loop runs on checks: a creature rolls its
 * system's check mechanic against a difficulty. The mechanics differ —
 *   - D&D 5e / 3.5e / PF1e: d20 + modifier vs DC, pass/fail;
 *   - Pathfinder 2e:        d20 + modifier vs DC, four degrees (nat 20/1 shift);
 *   - Mutants & Masterminds: d20 + modifier vs DC, graded by 5s;
 *   - Daggerheart:          2d12 (Hope + Fear) + modifier vs Difficulty, with the
 *                           higher die deciding Hope/Fear and matched dice a crit
 * — but they fold into one `CheckResult`, exactly as attacks/saves do for combat.
 *
 * Deterministic: every roll comes from the injected seeded RNG (NOT Math.random),
 * so a given (seed, participants) replays identically — the same discipline as
 * the combat resolvers, keeping any future LLM narrator out of the resolution
 * hot path.
 */

import { createSeededRng, type SeededRng } from '../../scene/seededRng';
import { pf2eSaveDegree } from './participantResolution';

export type CheckRollMode = 'normal' | 'advantage' | 'disadvantage';

/** Graded outcome; systems without degrees collapse to success/failure. */
export type CheckOutcome = 'critical-success' | 'success' | 'failure' | 'critical-failure';

export interface CheckResult {
  systemId: string;
  /** Roll + modifier (Daggerheart: Hope + Fear + modifier). */
  total: number;
  /** Natural dice: [d20] / [d20, d20] for adv-dis, or [hope, fear] for Daggerheart. */
  dice: number[];
  modifier: number;
  dc: number;
  /** Universal pass/fail (success or critical success). */
  success: boolean;
  /** Graded outcome where the system supports it, else success/failure. */
  outcome: CheckOutcome;
  /** Daggerheart only: the Hope die met or beat the Fear die (rolled "with Hope"). */
  withHope?: boolean;
}

export interface CheckInput {
  systemId: string;
  modifier: number;
  dc: number;
  rng: SeededRng;
  /** d20-family advantage/disadvantage (ignored by Daggerheart's 2d12). */
  rollMode?: CheckRollMode;
}

/** Roll a d20 from the seeded stream, honoring advantage/disadvantage. */
function rollD20(
  rng: SeededRng,
  mode: CheckRollMode = 'normal'
): { chosen: number; dice: number[] } {
  const first = rng.rollDie(20);
  if (mode === 'normal') return { chosen: first, dice: [first] };
  const second = rng.rollDie(20);
  const chosen = mode === 'advantage' ? Math.max(first, second) : Math.min(first, second);
  return { chosen, dice: [first, second] };
}

/**
 * Resolve a single check against a DC, using the system's mechanic. Pure given
 * the injected RNG.
 */
export function resolveCheck(input: CheckInput): CheckResult {
  const { systemId, modifier, dc, rng } = input;

  if (systemId === 'daggerheart') {
    // 2d12 duality: Hope die + Fear die. Matched dice are a critical success.
    const hope = rng.rollDie(12);
    const fear = rng.rollDie(12);
    const total = hope + fear + modifier;
    const matched = hope === fear;
    const success = matched || total >= dc;
    const outcome: CheckOutcome = matched ? 'critical-success' : success ? 'success' : 'failure';
    return {
      systemId,
      total,
      dice: [hope, fear],
      modifier,
      dc,
      success,
      outcome,
      withHope: hope >= fear,
    };
  }

  const { chosen, dice } = rollD20(rng, input.rollMode);
  const total = chosen + modifier;

  if (systemId === 'pf2e') {
    const outcome = pf2eSaveDegree(chosen, total, dc); // identical degree math for checks
    const success = outcome === 'success' || outcome === 'critical-success';
    return { systemId, total, dice, modifier, dc, success, outcome };
  }

  if (systemId === 'mam3e') {
    // M&M grades by 5s: a margin of +10 is a great success, -10 a dramatic fail.
    const success = total >= dc;
    const outcome: CheckOutcome =
      total >= dc + 10
        ? 'critical-success'
        : success
          ? 'success'
          : total <= dc - 10
            ? 'critical-failure'
            : 'failure';
    return { systemId, total, dice, modifier, dc, success, outcome };
  }

  // D&D 5e (both), 3.5e, PF1e — and any unrecognized system — resolve as a plain
  // d20 binary pass/fail rather than throwing.
  const success = total >= dc;
  return { systemId, total, dice, modifier, dc, success, outcome: success ? 'success' : 'failure' };
}

// ─── N-participant skill challenge ────────────────────────────────────────────

export interface ChallengeParticipant {
  id: string;
  /** The skill/ability modifier this participant brings to the challenge. */
  modifier: number;
  rollMode?: CheckRollMode;
}

export interface SkillChallengeInput {
  systemId: string;
  dc: number;
  /** Successes required to win the challenge. */
  successesNeeded: number;
  /** Failures that lose it. */
  failuresAllowed: number;
  /** The contributing party — each takes turns, cycling, until it resolves. */
  participants: readonly ChallengeParticipant[];
  seed: string;
  /** Optional skill label, for keying sub-streams and narration. */
  skill?: string;
}

export interface ChallengeAttempt {
  participantId: string;
  result: CheckResult;
  /** Successes/failures this attempt contributed (a crit counts double). */
  delta: number;
}

export interface SkillChallengeResult {
  outcome: 'success' | 'failure';
  successes: number;
  failures: number;
  /** Each attempt, in order — the full transparent record of the group effort. */
  attempts: ChallengeAttempt[];
}

/**
 * Resolve a skill challenge: the party contributes checks (taking turns, cycling
 * through the participants) until it accrues enough successes to win or enough
 * failures to lose — the N-participant principle applied to non-combat. Each
 * attempt draws from its own keyed sub-stream so the whole challenge is
 * deterministic and order-stable. A critical success/failure counts double
 * (the degree systems' edges matter here too).
 */
export function resolveSkillChallenge(input: SkillChallengeInput): SkillChallengeResult {
  const attempts: ChallengeAttempt[] = [];
  if (input.participants.length === 0 || input.successesNeeded <= 0) {
    return {
      outcome: input.successesNeeded <= 0 ? 'success' : 'failure',
      successes: 0,
      failures: 0,
      attempts,
    };
  }

  let successes = 0;
  let failures = 0;
  let attemptIndex = 0;
  while (successes < input.successesNeeded && failures < input.failuresAllowed) {
    const participant = input.participants[attemptIndex % input.participants.length];
    const rng = createSeededRng(
      `${input.seed}::challenge::${input.skill ?? 'check'}::${attemptIndex}::${participant.id}`
    );
    const result = resolveCheck({
      systemId: input.systemId,
      modifier: participant.modifier,
      dc: input.dc,
      rng,
      rollMode: participant.rollMode,
    });
    const isCrit = result.outcome === 'critical-success' || result.outcome === 'critical-failure';
    const delta = isCrit ? 2 : 1;
    if (result.success) successes += delta;
    else failures += delta;
    attempts.push({ participantId: participant.id, result, delta });
    attemptIndex += 1;
  }

  return {
    outcome: successes >= input.successesNeeded ? 'success' : 'failure',
    successes,
    failures,
    attempts,
  };
}
