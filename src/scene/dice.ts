import type { SeededRng } from './seededRng';

/**
 * A focused dice-expression evaluator for a scratch roller (damage, loot,
 * random tables). Supports a sum of terms separated by `+`/`-`, where each term
 * is either a constant or `NdM` with an optional keep modifier `khX` (keep
 * highest X) / `klX` (keep lowest X) — e.g. `2d6+3`, `4d6kh3`, `d20-1`,
 * `2d20kl1`. Pure: the caller supplies the RNG, so a roll is deterministic
 * given its seed and the parser is trivially testable.
 *
 * This is deliberately NOT event-sourced like checks/oracle: arbitrary dice are
 * a transient tool (a damage roll, a loot table), so they live in an in-memory
 * history rather than bloating the replayable scene event log.
 */

export interface DiceTerm {
  sign: 1 | -1;
  /** A flat constant; mutually exclusive with the dice fields. */
  constant?: number;
  count?: number;
  sides?: number;
  keep?: { type: 'kh' | 'kl'; n: number };
}

export interface DiceTermResult {
  /** Human-readable term, e.g. "4d6kh3" or "+3". */
  text: string;
  /** Every die rolled for the term (absent for a constant). */
  rolls?: number[];
  /** The dice that counted toward the total after keep (absent for a constant). */
  kept?: number[];
  /** Signed contribution to the grand total. */
  value: number;
}

export interface DiceRollResult {
  expression: string;
  terms: DiceTermResult[];
  total: number;
}

const MAX_DICE = 100;
const MAX_SIDES = 1000;
/** A real dice expression is short; cap input so pathological strings can't drive a long parse. */
const MAX_EXPRESSION_LENGTH = 100;

const TERM_RE = /([+-])(?:(\d*)d(\d+)(?:(kh|kl)(\d+))?|(\d+))/g;

/**
 * Parse a dice expression into signed terms. Throws a descriptive error on any
 * syntactic or bounds problem so the UI can surface it.
 */
export function parseDiceExpression(input: string): DiceTerm[] {
  if (input.length > MAX_EXPRESSION_LENGTH) {
    throw new Error(`Dice expression is too long (max ${MAX_EXPRESSION_LENGTH} characters).`);
  }
  const normalized = input.replace(/\s+/g, '').toLowerCase();
  if (!normalized) {
    throw new Error('Enter a dice expression, e.g. 2d6+3.');
  }
  // Allow a leading term with no explicit sign by defaulting it to '+'.
  const signed = /^[+-]/.test(normalized) ? normalized : `+${normalized}`;

  const terms: DiceTerm[] = [];
  let matchedLength = 0;
  TERM_RE.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = TERM_RE.exec(signed)) !== null) {
    if (match.index !== matchedLength) break; // a gap means invalid syntax
    matchedLength += match[0].length;

    const sign: 1 | -1 = match[1] === '-' ? -1 : 1;
    const [, , countText, sidesText, keepType, keepText, constantText] = match;

    if (constantText !== undefined) {
      terms.push({ sign, constant: Number.parseInt(constantText, 10) });
      continue;
    }

    const count = countText === '' ? 1 : Number.parseInt(countText, 10);
    const sides = Number.parseInt(sidesText, 10);
    if (count < 1 || count > MAX_DICE) {
      throw new Error(`Dice count must be between 1 and ${MAX_DICE}.`);
    }
    if (sides < 1 || sides > MAX_SIDES) {
      throw new Error(`Die sides must be between 1 and ${MAX_SIDES}.`);
    }

    const term: DiceTerm = { sign, count, sides };
    if (keepType) {
      const n = Number.parseInt(keepText, 10);
      if (n < 1 || n > count) {
        throw new Error(`Keep count must be between 1 and the dice count (${count}).`);
      }
      term.keep = { type: keepType as 'kh' | 'kl', n };
    }
    terms.push(term);
  }

  if (matchedLength !== signed.length || terms.length === 0) {
    throw new Error(`Could not parse "${input}". Try a form like 2d6+3 or 4d6kh3.`);
  }
  return terms;
}

/** Parse and evaluate a dice expression, rolling each die from `rng`. */
export function rollDiceExpression(input: string, rng: SeededRng): DiceRollResult {
  const terms = parseDiceExpression(input);
  const results: DiceTermResult[] = [];
  let total = 0;

  for (const term of terms) {
    if (term.constant !== undefined) {
      const value = term.sign * term.constant;
      total += value;
      results.push({ text: `${term.sign < 0 ? '-' : '+'}${term.constant}`, value });
      continue;
    }

    const count = term.count ?? 1;
    const sides = term.sides ?? 0;
    const rolls = Array.from({ length: count }, () => rng.rollDie(sides));
    const kept = applyKeep(rolls, term.keep);
    const value = term.sign * kept.reduce((sum, n) => sum + n, 0);
    total += value;
    results.push({ text: formatTermText(term), rolls, kept, value });
  }

  return { expression: input.trim(), terms: results, total };
}

/** The dice that count after a keep-highest/keep-lowest modifier (all, by default). */
function applyKeep(rolls: number[], keep: DiceTerm['keep']): number[] {
  if (!keep) return rolls;
  const sorted = [...rolls].sort((a, b) => (keep.type === 'kh' ? b - a : a - b));
  return sorted.slice(0, keep.n);
}

function formatTermText(term: DiceTerm): string {
  const sign = term.sign < 0 ? '-' : '+';
  const keep = term.keep ? `${term.keep.type}${term.keep.n}` : '';
  return `${sign}${term.count}d${term.sides}${keep}`;
}
