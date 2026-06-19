/**
 * Client orchestration for AI creature identification (RFC 002, vision surface).
 * The model is shown an image plus the loader-derived catalog and must return
 * one catalog id; this flow then enforces — deterministically — that the id is
 * actually in the offered pool before the UI acts on it. As with encounter
 * drafting, the model proposes and the rules-side catalog decides; an invented
 * id is a hard failure, not something the UI ever trusts.
 */
import { callAiGateway } from './gatewayClient';
import type {
  AiImageInput,
  EncounterDraftCandidate,
  IdentifyCreatureData,
  TaskGatewayCall,
} from './contracts';

export interface IdentifyCreatureParams {
  systemId: string;
  candidates: EncounterDraftCandidate[];
  image: AiImageInput;
  hint?: string;
}

export type IdentifyCreatureResult =
  | { ok: true; monsterId: string; name: string; confidence: number; reason?: string }
  | { ok: false; error: string };

/** Injectable gateway call so the flow is unit-testable without a network. */
export type IdentifyGatewayCall = TaskGatewayCall<'identify-creature'>;

export async function identifyCreatureWithAi(
  params: IdentifyCreatureParams,
  options: { call?: IdentifyGatewayCall } = {}
): Promise<IdentifyCreatureResult> {
  if (params.candidates.length === 0) {
    return { ok: false, error: 'There are no creatures to match against.' };
  }
  const call = options.call ?? (callAiGateway as IdentifyGatewayCall);
  const response = await call<IdentifyCreatureData>('identify-creature', {
    systemId: params.systemId,
    candidates: params.candidates,
    image: params.image,
    ...(params.hint ? { hint: params.hint } : {}),
  });
  if (!response.ok) return { ok: false, error: response.message };

  // The model must name a creature from the offered pool — reject inventions.
  const match = params.candidates.find((candidate) => candidate.id === response.data.monsterId);
  if (!match) {
    return { ok: false, error: 'The AI named a creature that is not in the catalog.' };
  }
  return {
    ok: true,
    monsterId: match.id,
    name: match.name,
    confidence: response.data.confidence,
    ...(response.data.reason ? { reason: response.data.reason } : {}),
  };
}
