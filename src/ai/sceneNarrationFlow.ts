/**
 * Client orchestration for AI scene narration (RFC 002, MASTER_PLAN Phase 13).
 * The deterministic scene recap is the ONLY source material; the model restyles
 * those facts into prose and the GM reviews and edits the result before it ever
 * reaches the campaign log. Nothing here mutates game state.
 *
 * The narration is gated by a deterministic faithfulness critic
 * ({@link checkNarrationFaithfulness}): a draft that invents numbers or proper
 * nouns absent from the recap is sent back for ONE bounded rewrite citing the
 * issues; if it still fails, the flow falls back to the deterministic recap as
 * the prose. So an unfaithful model is corrected or, failing that, replaced by
 * honest facts — never surfaced as if it were grounded.
 */
import { callAiGateway } from './gatewayClient';
import type { SceneNarrationData, TaskGatewayCall } from './contracts';
import { checkNarrationFaithfulness } from './narrationCritic';

export interface NarrateSceneParams {
  /** The deterministic recap to restyle (the prose's only source material). */
  facts: string;
  /** Optional style hint passed through to the prompt. */
  tone?: string;
}

export type NarrateSceneResult =
  | {
      ok: true;
      narrative: string;
      /** True when the critic rejected the AI prose and the recap was used instead. */
      fallback?: boolean;
      /** Faithfulness issues that forced a rewrite or the fallback (for the UI). */
      corrections?: string[];
    }
  | { ok: false; error: string };

/** Injectable gateway call so the flow is unit-testable without a network. */
export type NarrationGatewayCall = TaskGatewayCall<'scene-narration'>;

export async function narrateSceneWithAi(
  params: NarrateSceneParams,
  options: { call?: NarrationGatewayCall; maxRewrites?: number } = {}
): Promise<NarrateSceneResult> {
  const facts = params.facts.trim();
  if (!facts) return { ok: false, error: 'There are no scene facts to narrate yet.' };

  const call = options.call ?? (callAiGateway as NarrationGatewayCall);
  const maxRewrites = options.maxRewrites ?? 1;

  let critique: string[] | undefined;
  for (let attempt = 0; attempt <= maxRewrites; attempt += 1) {
    const response = await call<SceneNarrationData>('scene-narration', {
      facts,
      ...(params.tone ? { tone: params.tone } : {}),
      ...(critique ? { critique } : {}),
    });
    if (!response.ok) return { ok: false, error: response.message };

    const narrative = response.data.narrative.trim();
    if (!narrative) return { ok: false, error: 'The AI returned an empty narration.' };

    const verdict = checkNarrationFaithfulness(facts, narrative);
    if (verdict.faithful) {
      // A clean draft after a rewrite still carries the corrections that were fixed.
      return { ok: true, narrative, ...(critique ? { corrections: critique } : {}) };
    }
    critique = verdict.issues.map((issue) => issue.message);
  }

  // The model could not produce a grounded retelling: surface the deterministic
  // recap itself (always faithful) rather than prose that invents details.
  return {
    ok: true,
    narrative: facts,
    fallback: true,
    ...(critique ? { corrections: critique } : {}),
  };
}
