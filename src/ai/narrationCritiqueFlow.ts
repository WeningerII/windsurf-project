/**
 * Client orchestration for the narration critic (Phase 13, WORK_PLAN §5.4) —
 * the second pass over a `scene-narration` result.
 *
 * The shape of this flow is the whole point. The deterministic critic
 * (`checkNarrationAgainstFacts`) runs FIRST, ALWAYS, and owns the verdict. The
 * model review is opt-in, runs second, and is folded in as `advisory` issues
 * that `verdictFor` excludes by construction. Three consequences, each covered
 * by a test:
 *
 * 1. **A provider outage cannot turn a refutation into a pass.** If the gateway
 *    fails, the deterministic critique is still returned, verdict intact, with
 *    the failure reported beside it.
 * 2. **The model cannot invent its own evidence.** Every finding must quote the
 *    narration verbatim; a finding whose quote is not in the narration is
 *    discarded and counted. This is the same move `analyzeMapFlow` makes when it
 *    stamps client-measured dimensions over the model's echo — the critic is a
 *    model call, so its output is untrusted exactly like any other.
 * 3. **The model cannot make a narration worse or better.** It can only add
 *    advisory notes. A critic that could condemn a narration on its own say-so
 *    would have moved the RFC 002 problem, not solved it.
 *
 * What is genuinely NOT solved: an unsupported claim phrased without a proper
 * noun, a number, or defeat vocabulary ("the ritual failed", when no facts
 * mention a ritual) is invisible to the deterministic layer. The model may catch
 * it; a human still has to read the note. That gap is real and is why this
 * surface reviews prose rather than gating it.
 */
import { callAiGateway } from './gatewayClient';
import type { NarrationCritiqueData, TaskGatewayCall } from './contracts';
import type { NarrationFacts } from './narrationFacts';
import {
  checkNarrationAgainstFacts,
  type NarrationCritique,
  type NarrationCritiqueIssue,
} from './narrationCritic';

export interface CritiqueNarrationParams {
  /** The generated narration under review. */
  narrative: string;
  /** The facts it was generated from (see `narrationFactsFromScene`). */
  facts: NarrationFacts;
}

/** What the optional second model pass did, always reported, never load-bearing. */
export interface ModelReviewOutcome {
  /** `skipped` when not requested, `ok` when it answered, `failed` on any error. */
  status: 'skipped' | 'ok' | 'failed';
  /** Findings discarded because their quote was not verbatim in the narration. */
  discarded: number;
  /** The gateway's message, when `status` is `failed`. */
  error?: string;
}

export type CritiqueNarrationResult =
  | { ok: true; critique: NarrationCritique; modelReview: ModelReviewOutcome }
  | { ok: false; error: string };

/** Injectable gateway call so the flow is unit-testable without a network. */
export type NarrationCritiqueGatewayCall = TaskGatewayCall<'narration-critique'>;

/** Collapse runs of whitespace so a quote survives re-wrapping but not rewording. */
function normalizeSpans(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

/**
 * Keep only findings whose quote appears VERBATIM in the narration (modulo
 * whitespace). A model that paraphrases the span it objects to, or quotes a
 * sentence that is not there at all, has produced an objection nothing can be
 * checked against — so it is dropped rather than shown.
 */
function acceptModelFindings(
  narrative: string,
  data: NarrationCritiqueData
): { issues: NarrationCritiqueIssue[]; discarded: number } {
  const haystack = normalizeSpans(narrative);
  const issues: NarrationCritiqueIssue[] = [];
  let discarded = 0;
  for (const finding of data.findings) {
    const quote = normalizeSpans(finding.quote);
    if (!quote || !haystack.includes(quote)) {
      discarded += 1;
      continue;
    }
    issues.push({
      code: 'model-concern',
      severity: 'advisory',
      message: finding.concern,
      quote: finding.quote,
      deterministic: false,
    });
  }
  return { issues, discarded };
}

export async function critiqueNarrationWithAi(
  params: CritiqueNarrationParams,
  options: { call?: NarrationCritiqueGatewayCall; includeModelReview?: boolean } = {}
): Promise<CritiqueNarrationResult> {
  const narrative = params.narrative.trim();
  if (!narrative) return { ok: false, error: 'There is no narration to review.' };

  // The gate runs before, and independently of, any model call.
  const critique = checkNarrationAgainstFacts(narrative, params.facts);

  if (!options.includeModelReview) {
    return { ok: true, critique, modelReview: { status: 'skipped', discarded: 0 } };
  }

  const call = options.call ?? (callAiGateway as NarrationCritiqueGatewayCall);
  const response = await call<NarrationCritiqueData>('narration-critique', {
    narrative,
    facts: params.facts.text,
  });
  if (!response.ok) {
    // The deterministic verdict stands untouched — that is the point.
    return {
      ok: true,
      critique,
      modelReview: { status: 'failed', discarded: 0, error: response.message },
    };
  }

  const { issues, discarded } = acceptModelFindings(narrative, response.data);
  return {
    ok: true,
    critique: { verdict: critique.verdict, issues: [...critique.issues, ...issues] },
    modelReview: { status: 'ok', discarded },
  };
}
