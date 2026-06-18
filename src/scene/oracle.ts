import type { SceneOracleAnswer, SceneOracleOdds, SceneOracleResult } from '../types/core/scene';

/**
 * d100 "yes" thresholds per odds level: a roll at or under the target is a yes.
 * The spread is symmetric around an even (50/50) question.
 */
const ODDS_TARGET: Record<SceneOracleOdds, number> = {
  'very-likely': 85,
  likely: 70,
  even: 50,
  unlikely: 30,
  'very-unlikely': 15,
};

/** Ordered for the UI: most to least likely. */
export const ORACLE_ODDS: SceneOracleOdds[] = [
  'very-likely',
  'likely',
  'even',
  'unlikely',
  'very-unlikely',
];

export const ORACLE_ODDS_LABEL: Record<SceneOracleOdds, string> = {
  'very-likely': 'Very likely',
  likely: 'Likely',
  even: 'Even (50/50)',
  unlikely: 'Unlikely',
  'very-unlikely': 'Very unlikely',
};

export const ORACLE_ANSWER_LABEL: Record<SceneOracleAnswer, string> = {
  'exceptional-yes': 'Exceptional Yes',
  yes: 'Yes',
  no: 'No',
  'exceptional-no': 'Exceptional No',
};

/**
 * Resolve an oracle question. `roll` is a d100 (1–100); a roll at or under the
 * odds target is a yes. The extreme one-fifth of each side is promoted to an
 * exceptional result (a strong outcome or a twist), the way solo GM-emulators
 * use the tails of the range. Pure — the caller rolls the die so the scene
 * fold stays deterministic and the result can be stored on the event.
 */
export function resolveOracle(odds: SceneOracleOdds, roll: number): SceneOracleResult {
  const target = ODDS_TARGET[odds];
  const yes = roll <= target;
  // Lowest fifth of the yes range, highest fifth of the no range.
  const exceptionalYes = roll <= Math.ceil(target / 5);
  const exceptionalNo = roll > target + Math.floor(((100 - target) * 4) / 5);
  const answer: SceneOracleAnswer = yes
    ? exceptionalYes
      ? 'exceptional-yes'
      : 'yes'
    : exceptionalNo
      ? 'exceptional-no'
      : 'no';
  return { odds, roll, target, answer };
}

/** Whether a value is a recognized odds level (for validating persisted intents). */
export function isOracleOdds(value: unknown): value is SceneOracleOdds {
  return typeof value === 'string' && value in ODDS_TARGET;
}
