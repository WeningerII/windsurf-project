/**
 * Narration faithfulness critic (RFC 002 / MASTER_PLAN Phase 13).
 *
 * AI scene narration restyles the deterministic recap (`summarizeSceneForLog`)
 * and that recap is its ONLY licensed source material. So a faithful narrative
 * introduces no facts of its own: every number and every proper noun it uses
 * must already appear in the recap. This pure checker enforces exactly that
 * grounding — it is the deterministic validator the narration flow runs before
 * surfacing prose ("the model proposes; the validator decides"), and it never
 * touches game state.
 *
 * It deliberately checks GROUNDING, not full semantics: it flags
 *  - digit-runs in the narrative absent from the recap (a false mechanical claim
 *    — invented damage, HP, DCs, counts), and
 *  - mid-sentence Title-Case words absent from the recap (an invented character
 *    or place).
 * It is tuned for precision over recall: sentence-initial capitalization and
 * all-caps acronyms are never flagged, and any token already in the recap is
 * allowed, so it does not punish legitimate restyling. It cannot catch a
 * semantic inversion ("fled" vs "fell") — that is out of scope and not claimed.
 */

export type NarrationIssueKind = 'ungrounded-number' | 'ungrounded-name';

export interface NarrationFaithfulnessIssue {
  kind: NarrationIssueKind;
  /** The offending token from the narrative. */
  token: string;
  message: string;
}

export interface NarrationFaithfulnessResult {
  faithful: boolean;
  issues: NarrationFaithfulnessIssue[];
}

/**
 * Common words that can appear capitalized mid-sentence without being proper
 * nouns (mostly defensive — mid-sentence Title-Case is already a strong name
 * signal). Lowercased; compared case-insensitively.
 */
const NAME_STOPWORDS: ReadonlySet<string> = new Set([
  'the',
  'and',
  'but',
  'for',
  'nor',
  'yet',
  'then',
  'thus',
  'his',
  'her',
  'hers',
  'its',
  'their',
  'they',
  'them',
  'she',
  'after',
  'before',
  'when',
  'while',
  'with',
  'without',
  'into',
  'onto',
  'from',
  'over',
  'under',
  'again',
  'suddenly',
  'finally',
  'meanwhile',
  'however',
  'though',
  'although',
  'despite',
  'because',
  'since',
  'until',
]);

/** Lowercased alphabetic tokens that appear anywhere in the source facts. */
function factWordSet(facts: string): Set<string> {
  return new Set((facts.toLowerCase().match(/[a-z]+/g) ?? []).map((word) => word));
}

/** Distinct digit-runs (as written) in a string. */
function digitRuns(text: string): string[] {
  return text.match(/\d+/g) ?? [];
}

export function checkNarrationFaithfulness(
  facts: string,
  narrative: string
): NarrationFaithfulnessResult {
  const issues: NarrationFaithfulnessIssue[] = [];

  // 1) Numbers: any digit-run in the prose must appear in the recap.
  const factNumbers = new Set(digitRuns(facts));
  const seenNumbers = new Set<string>();
  for (const number of digitRuns(narrative)) {
    if (factNumbers.has(number) || seenNumbers.has(number)) continue;
    seenNumbers.add(number);
    issues.push({
      kind: 'ungrounded-number',
      token: number,
      message: `The narration states "${number}", which is not in the recap.`,
    });
  }

  // 2) Names: a mid-sentence Title-Case word (≥3 letters) not in the recap is a
  // likely invented proper noun. Sentence-initial words are skipped: a capital
  // there is just grammar, not a name signal. We classify each Title-Case word
  // by the previous non-whitespace character (start or a terminator → initial),
  // which — unlike a prefix match — also catches adjacent names ("Foo Bar").
  const factWords = factWordSet(facts);
  const seenNames = new Set<string>();
  for (const match of narrative.matchAll(/[A-Z][a-z]{2,}/g)) {
    const index = match.index ?? 0;
    let cursor = index - 1;
    while (cursor >= 0 && /\s/.test(narrative[cursor])) cursor -= 1;
    const previous = cursor >= 0 ? narrative[cursor] : '';
    const sentenceInitial = previous === '' || '.!?:;'.includes(previous);
    if (sentenceInitial) continue;

    const word = match[0];
    const lower = word.toLowerCase();
    if (factWords.has(lower) || NAME_STOPWORDS.has(lower) || seenNames.has(lower)) continue;
    seenNames.add(lower);
    issues.push({
      kind: 'ungrounded-name',
      token: word,
      message: `The narration names "${word}", who/which is not in the recap.`,
    });
  }

  return { faithful: issues.length === 0, issues };
}
