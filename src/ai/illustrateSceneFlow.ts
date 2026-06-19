/**
 * Client orchestration for AI scene illustration (RFC 002, image-output surface).
 * Unlike the text/vision surfaces, generated imagery has no machine-checkable
 * "correctness": the gateway validates the request and the output envelope (a
 * real, bounded image) and a human judges the picture. The result is a creative
 * aid the GM views or downloads — it is never written into the event-sourced
 * scene state, so it cannot corrupt anything deterministic.
 */
import { callAiGateway } from './gatewayClient';
import type { GeneratedImageData, TaskGatewayCall } from './contracts';

export interface IllustrateSceneParams {
  prompt: string;
  style?: string;
}

export type IllustrateSceneResult =
  | { ok: true; image: GeneratedImageData }
  | { ok: false; error: string };

/** Injectable gateway call so the flow is unit-testable without a network. */
export type IllustrateGatewayCall = TaskGatewayCall<'illustrate-scene'>;

export async function illustrateSceneWithAi(
  params: IllustrateSceneParams,
  options: { call?: IllustrateGatewayCall } = {}
): Promise<IllustrateSceneResult> {
  const prompt = params.prompt.trim();
  if (!prompt) return { ok: false, error: 'Describe what to illustrate first.' };

  const call = options.call ?? (callAiGateway as IllustrateGatewayCall);
  const response = await call<GeneratedImageData>('illustrate-scene', {
    prompt,
    ...(params.style ? { style: params.style } : {}),
  });
  if (!response.ok) return { ok: false, error: response.message };
  return { ok: true, image: response.data };
}
