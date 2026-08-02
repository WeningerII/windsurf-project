/**
 * The deterministic half of the narration critic (Phase 13, WORK_PLAN §5.4).
 *
 * RFC 002 says the model proposes and deterministic validators decide. For ids
 * and numbers that is a catalog lookup. For PROSE there is no catalog, so the
 * honest question is not "is this narration good?" — it is "does this narration
 * assert something its source facts do not support?", and only part of that is
 * decidable. This module implements exactly the decidable part and nothing else:
 *
 * CHECKED HERE (deterministic, refutable):
 * - A proper noun the facts never mention. The narrator was handed one string
 *   and told to use only it; a capitalized mid-sentence word absent from that
 *   string (and from the scene's token names) was invented.
 * - A figure the facts never state. Digits in the narration must appear in the
 *   facts — a "17 damage" the recap never recorded is a fabricated number.
 * - A death the scene does not record. Defeat vocabulary attributed to a token
 *   the scene reports above 0 hp is refuted by `SceneState`, not by opinion.
 * - A recorded defeat the narration silently dropped (reported, never fatal).
 *
 * NOT CHECKED HERE, AND NOT FAKED ANYWHERE: tone, pacing, vividness, whether a
 * sentence is any good. There is no scorer for those in this file because there
 * is no deterministic answer to them. The model-judged pass in
 * `narrationCritiqueFlow.ts` may comment on them, and its comments are ADVISORY
 * — they never move the verdict this module returns.
 *
 * Two deliberate biases, so that a finding means something:
 * - It UNDER-reports. A name that opens a sentence, a nickname, a partial
 *   reference: all missed, because the alternative is flagging ordinary English.
 * - Severity is graded. Only a claim contradicted by, or absent from, the source
 *   is `reject`. "Real scene entity the recap did not mention" is `review`.
 *
 * Pure, total and side-effect free — same contract as the encounter-spec and
 * grid-geometry validators it mirrors.
 */
import type { NarrationFacts } from './narrationFacts';

export type NarrationIssueCode =
  /** The narration is empty; there is nothing to support. */
  | 'empty-narration'
  /** A proper noun that appears neither in the facts nor in the scene. */
  | 'unsupported-name'
  /** A real scene name the facts handed to the narrator never mentioned. */
  | 'off-facts-name'
  /** A figure the facts never state. */
  | 'unsupported-number'
  /** Defeat language attributed to a combatant the scene records as standing. */
  | 'unrecorded-defeat'
  /** The facts record a defeat the narration never mentions. */
  | 'omitted-defeat'
  /** A model-raised concern. Advisory by construction — never decides anything. */
  | 'model-concern';

/**
 * `reject` means the facts refute the claim. `review` means the narration went
 * outside its source without contradicting it. `advisory` is reserved for the
 * model pass and is excluded from the verdict by construction.
 */
export type NarrationIssueSeverity = 'reject' | 'review' | 'advisory';

export interface NarrationCritiqueIssue {
  code: NarrationIssueCode;
  severity: NarrationIssueSeverity;
  message: string;
  /** A verbatim span of the narration the issue is about, when there is one. */
  quote?: string;
  /**
   * True when a deterministic check produced this issue. False marks a
   * model-raised concern, so a caller can never confuse the two.
   */
  deterministic: boolean;
}

export type NarrationCritiqueVerdict = 'supported' | 'needs-review' | 'refuted';

export interface NarrationCritique {
  /**
   * `refuted` when any reject-severity issue fired, `needs-review` when any
   * review-severity issue did, else `supported`. Advisory issues are ignored
   * here on purpose: see {@link verdictFor}.
   */
  verdict: NarrationCritiqueVerdict;
  issues: NarrationCritiqueIssue[];
}

/**
 * Words that are legitimately capitalized mid-sentence in ordinary English or
 * in this app's own vocabulary. Kept deliberately small: every entry is a hole
 * in the `unsupported-name` check, so an entry has to earn its place.
 */
const CAPITALIZED_NON_NAMES: ReadonlySet<string> = new Set([
  'i',
  'dc',
  'hp',
  'ac',
  'gm',
  'dm',
  'ok',
]);

/**
 * Defeat vocabulary. A term here, attributed to a named combatant, is read as
 * the claim "this combatant went down" — which `SceneState` can refute.
 */
const DEFEAT_TERMS: readonly string[] = [
  'died',
  'dies',
  'die',
  'dead',
  'death',
  'killed',
  'kills',
  'kill',
  'slain',
  'slew',
  'slaughtered',
  'perished',
  'perishes',
  'fell',
  'falls',
  'fallen',
  'downed',
  'destroyed',
  'defeated',
  'butchered',
  'expired',
];

const DEFEAT_TERM_RE = new RegExp(`\\b(?:${DEFEAT_TERMS.join('|')})\\b`, 'gi');

/** Sentence-ish spans. Crude on purpose — only used to bound attribution. */
function sentencesOf(text: string): string[] {
  return text.match(/[^.!?]+[.!?]*/g)?.filter((s) => s.trim()) ?? [];
}

/** Lowercased alphabetic word tokens of a string. */
function wordsOf(text: string): string[] {
  return text.match(/[A-Za-z][A-Za-z'’-]*/g)?.map((word) => word.toLowerCase()) ?? [];
}

/** Every run of digits in a string, as written. */
function numbersOf(text: string): string[] {
  return text.match(/\d+/g) ?? [];
}

/** Strip a trailing possessive so "Grish's" is recognized as "Grish". */
function bare(word: string): string {
  return word.replace(/['’]s$/i, '').replace(/['’]$/, '');
}

/**
 * True when [start, end) is not glued to surrounding word characters — so the
 * token "Gob" is not found inside "Goblin". Without this a short token name is
 * "mentioned" everywhere a longer word happens to contain it.
 */
function isWholeWordAt(haystack: string, start: number, end: number): boolean {
  const before = start > 0 ? haystack[start - 1] : '';
  const after = end < haystack.length ? haystack[end] : '';
  return !/[a-z0-9]/.test(before) && !/[a-z0-9]/.test(after);
}

/**
 * The verdict a set of issues implies. ADVISORY ISSUES ARE EXCLUDED — that
 * exclusion is the whole reason the model pass can be wired in at all. If a
 * model comment could push a narration to `refuted`, an unvalidated model call
 * would be deciding, which is the thing RFC 002 forbids.
 */
export function verdictFor(issues: readonly NarrationCritiqueIssue[]): NarrationCritiqueVerdict {
  if (issues.some((issue) => issue.severity === 'reject')) return 'refuted';
  if (issues.some((issue) => issue.severity === 'review')) return 'needs-review';
  return 'supported';
}

/**
 * Judge a narration against the facts it was generated from. Pure and total:
 * same narration + same facts always yields the same verdict and issue list.
 */
export function checkNarrationAgainstFacts(
  narrative: string,
  facts: NarrationFacts
): NarrationCritique {
  const text = narrative.trim();
  if (!text) {
    return {
      verdict: 'refuted',
      issues: [
        {
          code: 'empty-narration',
          severity: 'reject',
          message: 'The narration is empty.',
          deterministic: true,
        },
      ],
    };
  }

  const issues: NarrationCritiqueIssue[] = [];
  const factWords = new Set(wordsOf(facts.text));
  const sceneWords = new Set(facts.names.flatMap((name) => wordsOf(name)));

  checkProperNouns(text, factWords, sceneWords, issues);
  checkNumbers(text, facts, issues);
  checkDefeatClaims(text, facts, issues);
  checkOmittedDefeats(text, facts, issues);

  return { verdict: verdictFor(issues), issues };
}

/**
 * Capitalized words that are not sentence-initial are, in this register, proper
 * nouns. One absent from the facts AND from the scene was invented outright
 * (`reject`); one the scene knows but the recap never mentioned is the narrator
 * reaching past its source (`review`).
 */
function checkProperNouns(
  text: string,
  factWords: ReadonlySet<string>,
  sceneWords: ReadonlySet<string>,
  issues: NarrationCritiqueIssue[]
): void {
  const seen = new Set<string>();
  for (const sentence of sentencesOf(text)) {
    const tokens = sentence.match(/[A-Za-z][A-Za-z'’-]*/g) ?? [];
    // Index 0 is skipped: a capital there is grammar, not a name.
    for (let i = 1; i < tokens.length; i += 1) {
      const token = tokens[i];
      if (!/^[A-Z]/.test(token)) continue;
      const key = bare(token).toLowerCase();
      if (!key || seen.has(key) || CAPITALIZED_NON_NAMES.has(key)) continue;
      if (factWords.has(key)) continue;
      seen.add(key);
      if (sceneWords.has(key)) {
        issues.push({
          code: 'off-facts-name',
          severity: 'review',
          message: `The narration names '${bare(token)}', which is in the scene but not in the facts it was given.`,
          quote: sentence.trim(),
          deterministic: true,
        });
      } else {
        issues.push({
          code: 'unsupported-name',
          severity: 'reject',
          message: `The narration names '${bare(token)}', which the facts do not mention.`,
          quote: sentence.trim(),
          deterministic: true,
        });
      }
    }
  }
}

/** A figure the source never states is a fabricated figure. */
function checkNumbers(text: string, facts: NarrationFacts, issues: NarrationCritiqueIssue[]): void {
  const stated = new Set(numbersOf(facts.text));
  const seen = new Set<string>();
  for (const value of numbersOf(text)) {
    if (stated.has(value) || seen.has(value)) continue;
    seen.add(value);
    issues.push({
      code: 'unsupported-number',
      severity: 'reject',
      message: `The narration states the figure ${value}, which the facts do not.`,
      deterministic: true,
    });
  }
}

/**
 * Attribute each defeat term to the nearest combatant named BEFORE it in the
 * same sentence (falling back to the first named after it), then ask the scene.
 * "Tam fell while Grish fled" attributes to Tam; "Grish fought beside Tam, who
 * fell" also attributes to Tam. Attribution is per-term, not per-sentence,
 * precisely so a sentence naming both a casualty and a survivor does not
 * launder the claim.
 */
function checkDefeatClaims(
  text: string,
  facts: NarrationFacts,
  issues: NarrationCritiqueIssue[]
): void {
  if (facts.names.length === 0) return;
  const defeated = new Set(facts.defeated.map((name) => name.toLowerCase()));
  const reported = new Set<string>();

  for (const sentence of sentencesOf(text)) {
    const lower = sentence.toLowerCase();
    const found: Array<{ index: number; end: number; name: string }> = [];
    for (const name of facts.names) {
      const needle = name.toLowerCase();
      if (!needle) continue;
      let at = lower.indexOf(needle);
      while (at !== -1) {
        const end = at + needle.length;
        if (isWholeWordAt(lower, at, end)) found.push({ index: at, end, name });
        at = lower.indexOf(needle, end);
      }
    }
    // Keep only the most specific name at each span. With tokens 'Goblin' and
    // 'Goblin Chief' both in the scene, "the Goblin Chief fell" names the CHIEF;
    // the bare 'Goblin' also matches there, and attributing the defeat to it
    // would REFUTE a faithful report of a defeat the scene does record.
    //
    // This is also what makes attribution independent of the order `facts.names`
    // arrives in (i.e. of token insertion order): dropping every covered span
    // leaves at most one mention per start offset, so no tie is left to break.
    const mentions = found.filter(
      (m) =>
        !found.some(
          (other) =>
            other.index <= m.index &&
            other.end >= m.end &&
            other.end - other.index > m.end - m.index
        )
    );
    if (mentions.length === 0) continue;
    mentions.sort((a, b) => a.index - b.index);

    DEFEAT_TERM_RE.lastIndex = 0;
    let match = DEFEAT_TERM_RE.exec(sentence);
    while (match) {
      const at = match.index;
      const before = [...mentions].reverse().find((mention) => mention.index < at);
      const subject = before ?? mentions.find((mention) => mention.index > at);
      if (subject && !defeated.has(subject.name.toLowerCase()) && !reported.has(subject.name)) {
        reported.add(subject.name);
        issues.push({
          code: 'unrecorded-defeat',
          severity: 'reject',
          message: `The narration says ${subject.name} '${match[0]}', but the scene records no such defeat.`,
          quote: sentence.trim(),
          deterministic: true,
        });
      }
      match = DEFEAT_TERM_RE.exec(sentence);
    }
  }
}

/** A recorded defeat the narration never mentions: reported, never fatal. */
function checkOmittedDefeats(
  text: string,
  facts: NarrationFacts,
  issues: NarrationCritiqueIssue[]
): void {
  const lower = text.toLowerCase();
  for (const name of facts.defeated) {
    if (name && !lower.includes(name.toLowerCase())) {
      issues.push({
        code: 'omitted-defeat',
        severity: 'review',
        message: `The facts record ${name} defeated, but the narration never mentions ${name}.`,
        deterministic: true,
      });
    }
  }
}
