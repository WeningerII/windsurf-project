/**
 * Client orchestration for AI map analysis (RFC 002 vision surface × RFC 006
 * Phase 10). The model looks at a battle-map image and PROPOSES grid geometry;
 * this flow then runs the deterministic gate that has been sitting unused since
 * it landed — `validateGridGeometryProposal` — before the UI is allowed to show
 * anything as applicable.
 *
 * Two properties are load-bearing and neither is the model's to hold:
 *
 * 1. **The image dimensions are the CLIENT's.** The payload sends them so the
 *    model can reason in the right space, but the proposal is stamped with the
 *    measured values, never with whatever the model echoed back. A model that
 *    misreports the image size therefore cannot make an off-image box look
 *    in-bounds — `box-out-of-image` still fires.
 * 2. **The envelope `version` is pinned here.** The model never names the
 *    schema version it is targeting, so it cannot opt into a version this build
 *    does not implement.
 *
 * The verdict is passed through unflattened. `manual-correction` is a real
 * outcome, not a soft failure: the geometry is plausible and the human should
 * adjust it, which is exactly what the MapPanel affordance offers. Only
 * `reject` is an error.
 */
import { callAiGateway } from './gatewayClient';
import type { AiImageInput, AnalyzeMapData, TaskGatewayCall } from './contracts';
import {
  GRID_GEOMETRY_PROPOSAL_VERSION,
  validateGridGeometryProposal,
  type GridBoxProposal,
  type GridGeometryProposal,
  type GridGeometryValidation,
} from '../scene/gridGeometryProposal';

export interface AnalyzeMapParams {
  image: AiImageInput;
  /** Measured from the decoded asset by the caller — see the note above. */
  imageSize: { widthPx: number; heightPx: number };
  hint?: string;
}

export type AnalyzeMapResult =
  | {
      ok: true;
      proposal: GridGeometryProposal;
      validation: GridGeometryValidation;
      reason?: string;
    }
  | { ok: false; error: string; validation?: GridGeometryValidation };

/** Injectable gateway call so the flow is unit-testable without a network. */
export type AnalyzeMapGatewayCall = TaskGatewayCall<'analyze-map'>;

/**
 * Build the versioned proposal from the model's geometry plus the CLIENT's
 * image dimensions. `kind` and `suggestedPreset` stay raw strings here — the
 * validator owns both vocabularies and narrows them, and pre-filtering to the
 * known set would hide an `unknown-box-kind` finding instead of reporting it.
 */
function toProposal(
  data: AnalyzeMapData,
  imageSize: { widthPx: number; heightPx: number }
): GridGeometryProposal {
  return {
    version: GRID_GEOMETRY_PROPOSAL_VERSION,
    image: { widthPx: imageSize.widthPx, heightPx: imageSize.heightPx },
    registration: data.registration,
    boxes: data.boxes as readonly GridBoxProposal[],
  };
}

export async function analyzeMapWithAi(
  params: AnalyzeMapParams,
  options: { call?: AnalyzeMapGatewayCall } = {}
): Promise<AnalyzeMapResult> {
  const { widthPx, heightPx } = params.imageSize;
  if (!Number.isInteger(widthPx) || !Number.isInteger(heightPx) || widthPx <= 0 || heightPx <= 0) {
    return { ok: false, error: 'The map image size could not be measured.' };
  }

  const call = options.call ?? (callAiGateway as AnalyzeMapGatewayCall);
  const response = await call<AnalyzeMapData>('analyze-map', {
    image: params.image,
    imageSize: { widthPx, heightPx },
    ...(params.hint ? { hint: params.hint } : {}),
  });
  if (!response.ok) return { ok: false, error: response.message };

  const proposal = toProposal(response.data, params.imageSize);
  const validation = validateGridGeometryProposal(proposal);

  if (validation.verdict === 'reject') {
    const first = validation.issues.find((issue) => issue.severity === 'reject');
    return {
      ok: false,
      error: first
        ? `The proposed grid was rejected: ${first.message}`
        : 'The proposed grid was rejected.',
      validation,
    };
  }

  return {
    ok: true,
    proposal,
    validation,
    ...(response.data.reason ? { reason: response.data.reason } : {}),
  };
}
