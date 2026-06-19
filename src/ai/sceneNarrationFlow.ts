/**
 * Client orchestration for AI scene narration (RFC 002, second task surface).
 * The deterministic scene recap is the ONLY source material; the model restyles
 * those facts into prose and the GM reviews and edits the result before it ever
 * reaches the campaign log. Nothing here mutates game state, and there is no
 * legality to decide — the gateway already guarantees a non-empty narrative — so
 * this flow assembles the request and normalizes the outcome for the UI.
 */
import { callAiGateway } from './gatewayClient';
import type { SceneNarrationData, TaskGatewayCall } from './contracts';

export interface NarrateSceneParams {
  /** The deterministic recap to restyle (the prose's only source material). */
  facts: string;
  /** Optional style hint passed through to the prompt. */
  tone?: string;
}

export type NarrateSceneResult = { ok: true; narrative: string } | { ok: false; error: string };

/** Injectable gateway call so the flow is unit-testable without a network. */
export type NarrationGatewayCall = TaskGatewayCall<'scene-narration'>;

export async function narrateSceneWithAi(
  params: NarrateSceneParams,
  options: { call?: NarrationGatewayCall } = {}
): Promise<NarrateSceneResult> {
  const facts = params.facts.trim();
  if (!facts) return { ok: false, error: 'There are no scene facts to narrate yet.' };

  const call = options.call ?? (callAiGateway as NarrationGatewayCall);
  const response = await call<SceneNarrationData>('scene-narration', {
    facts,
    ...(params.tone ? { tone: params.tone } : {}),
  });
  if (!response.ok) return { ok: false, error: response.message };

  const narrative = response.data.narrative.trim();
  if (!narrative) return { ok: false, error: 'The AI returned an empty narration.' };
  return { ok: true, narrative };
}
