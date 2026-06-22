/**
 * Client orchestration for AI map analysis (RFC 006, MASTER_PLAN Phase 10).
 * The model proposes a grid registration plus region boxes from a map image; the
 * deterministic geometry validator decides. The flow asks the gateway, validates
 * the proposal against the image and grid, and on failure sends the coded issues
 * back for ONE bounded repair before giving up — at which point the GM falls back
 * to manual registration (Phase 9). An accepted analysis is handed back for the
 * GM to review and apply through normal scene events.
 */
import { callAiGateway } from './gatewayClient';
import type { AiImageInput, AnalyzeMapData, TaskGatewayCall } from './contracts';
import {
  validateMapAnalysis,
  type MapAnalysis,
  type MapAnalysisContext,
} from '../scene/mapAnalysis';

export interface AnalyzeMapParams {
  image: AiImageInput;
  imageWidth: number;
  imageHeight: number;
  gridWidth: number;
  gridHeight: number;
}

export type AnalyzeMapResult = { ok: true; analysis: MapAnalysis } | { ok: false; error: string };

/** Injectable gateway call so the flow is unit-testable without a network. */
export type GatewayCall = TaskGatewayCall<'analyze-map'>;

export async function analyzeMapWithAi(
  params: AnalyzeMapParams,
  options: { call?: GatewayCall; maxRepairs?: number } = {}
): Promise<AnalyzeMapResult> {
  const call = options.call ?? (callAiGateway as GatewayCall);
  const maxRepairs = options.maxRepairs ?? 1;
  const context: MapAnalysisContext = {
    imageWidth: params.imageWidth,
    imageHeight: params.imageHeight,
    gridWidth: params.gridWidth,
    gridHeight: params.gridHeight,
  };

  let repairIssues: string[] | undefined;
  for (let attempt = 0; attempt <= maxRepairs; attempt += 1) {
    const response = await call<AnalyzeMapData>('analyze-map', {
      image: params.image,
      imageWidth: params.imageWidth,
      imageHeight: params.imageHeight,
      gridWidth: params.gridWidth,
      gridHeight: params.gridHeight,
      ...(repairIssues ? { repairIssues } : {}),
    });
    if (!response.ok) return { ok: false, error: response.message };

    const validation = validateMapAnalysis(response.data, context);
    if (validation.valid) return { ok: true, analysis: response.data };
    repairIssues = validation.issues.map((issue) => issue.message);
  }

  return {
    ok: false,
    error: 'The AI could not produce a usable map analysis. Register the grid manually instead.',
  };
}
